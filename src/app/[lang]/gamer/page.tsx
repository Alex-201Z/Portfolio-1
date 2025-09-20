
"use client";

import { getDictionary } from "@/lib/i18n";
import { useEffect, useState, use } from "react";
import { getGamerProfiles } from "./actions";
import type { GamerProfile as RiotGamerProfile } from "@/services/riot";
import type { SteamProfile } from "@/services/steam";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CombinedProfile {
    riot?: RiotGamerProfile;
    steam?: SteamProfile;
}

export default function GamerPage({ params }: { params: { lang: string } }) {
  const lang = use(params).lang;
  const [dictionary, setDictionary] = useState<any>(null);
  const [profiles, setProfiles] = useState<CombinedProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict.gamer);
    };
    fetchDictionary();
  }, [lang]);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const result = await getGamerProfiles();
      if (result.success) {
        setProfiles(result.data!);
      } else {
        setError(result.error!);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  if (!dictionary || loading) {
    return <div className="container mx-auto max-w-4xl py-12 px-4"><GamerProfileSkeleton /></div>;
  }
  
  const t = dictionary;

  const defaultTab = profiles?.riot ? "riot" : "steam";

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-glow bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          {t.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {error && (
         <Card className="bg-destructive/20 border-destructive">
            <CardHeader>
                <CardTitle>{t.error.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t.error.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{error}</p>
            </CardContent>
        </Card>
      )}

      {loading && <GamerProfileSkeleton />}

      {profiles && !loading && (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="riot" disabled={!profiles.riot}>{t.platforms.riot}</TabsTrigger>
                <TabsTrigger value="steam" disabled={!profiles.steam}>{t.platforms.steam}</TabsTrigger>
            </TabsList>
            
            {profiles.riot && (
                <TabsContent value="riot">
                    <RiotProfile profile={profiles.riot} t={t} />
                </TabsContent>
            )}

            {profiles.steam && (
                <TabsContent value="steam">
                    <SteamProfileComponent profile={profiles.steam} t={t} />
                </TabsContent>
            )}
        </Tabs>
      )}
    </div>
  );
}

function RiotProfile({ profile, t }: { profile: RiotGamerProfile, t: any }) {
    return (
        <div className="space-y-8 mt-6">
            <Card className="bg-secondary/30">
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                     <div className="relative">
                        <Image
                            src={profile.profileIconUrl}
                            alt="Profile Icon"
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-primary shadow-lg"
                            data-ai-hint="warrior avatar"
                        />
                        <span className="absolute bottom-0 -right-2 bg-background border-2 border-primary/50 text-foreground text-sm font-bold px-3 py-1 rounded-full shadow-md">
                            {profile.level}
                        </span>
                    </div>

                    <div className="flex-grow text-center md:text-left">
                        <h2 className="text-3xl font-bold font-headline text-primary text-glow">{profile.name}</h2>
                        <p className="text-xl text-muted-foreground">{profile.rank}</p>
                        <div className="flex justify-center md:justify-start items-center gap-4 mt-2">
                            <span className="font-semibold">{t.stats.winrate}: <span className="text-green-400">{profile.winRate}%</span></span>
                            <span className="text-muted-foreground">|</span>
                            <span>{t.stats.wins}: {profile.wins}</span>
                            <span>{t.stats.losses}: {profile.losses}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-2xl font-headline text-primary text-glow mb-4 text-center">{t.champions.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.topChampions.map(champ => (
                        <Card key={champ.name} className="bg-secondary/30 overflow-hidden group">
                           <CardContent className="p-4 flex items-center gap-4">
                                <Image 
                                    src={champ.imageUrl} 
                                    alt={champ.name} 
                                    width={64} 
                                    height={64} 
                                    className="rounded-md border-2 border-border group-hover:border-accent transition-colors"
                                    data-ai-hint="fantasy character"
                                />
                                <div className="flex-grow">
                                    <p className="font-bold text-lg text-foreground">{champ.name}</p>
                                    <p className="text-sm text-muted-foreground">KDA: <span className="font-semibold text-accent">{champ.kda}</span></p>
                                    <p className="text-xs text-muted-foreground">{t.stats.winrate}: {champ.winRate}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-lg text-primary">{champ.gamesPlayed}</p>
                                    <p className="text-xs text-muted-foreground">{t.champions.games}</p>
                                </div>
                           </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

function SteamProfileComponent({ profile, t }: { profile: SteamProfile, t: any }) {
    return (
        <div className="space-y-8 mt-6">
            <Card className="bg-secondary/30">
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <Image
                        src={profile.avatarUrl}
                        alt="Steam Avatar"
                        width={120}
                        height={120}
                        className="rounded-md border-4 border-primary shadow-lg"
                        data-ai-hint="gamer avatar"
                    />
                    <div className="flex-grow text-center md:text-left">
                        <h2 className="text-3xl font-bold font-headline text-primary text-glow">{profile.personaName}</h2>
                        <p className="text-muted-foreground">{t.steam.level.replace('{level}', profile.level.toString())}</p>
                        <div className="flex justify-center md:justify-start items-center gap-2 mt-2 text-sm">
                            <Gamepad2 className="w-4 h-4 text-accent"/> 
                            <span>{t.steam.gamesOwned.replace('{count}', profile.games.length.toString())}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <div>
                <h3 className="text-2xl font-headline text-primary text-glow mb-4 text-center">{t.steam.mostPlayed}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.games.slice(0, 12).map(game => (
                        <Card key={game.appid} className="bg-secondary/30 overflow-hidden group">
                           <CardContent className="p-4 flex items-center gap-4">
                                <Image 
                                    src={game.iconUrl} 
                                    alt={game.name} 
                                    width={64} 
                                    height={64} 
                                    className="rounded-md border-2 border-border group-hover:border-accent transition-colors"
                                    data-ai-hint="game icon"
                                />
                                <div className="flex-grow">
                                    <p className="font-bold text-lg text-foreground truncate">{game.name}</p>
                                    <p className="text-sm text-muted-foreground">{t.steam.playtime.replace('{hours}', (game.playtime_forever / 60).toFixed(1))}</p>
                                </div>
                           </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

function GamerProfileSkeleton() {
    return (
      <div className="space-y-8">
        <Card className="bg-secondary/30">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <Skeleton className="w-[120px] h-[120px] rounded-full" />
            <div className="flex-grow space-y-2 text-center md:text-left">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-32 mx-auto md:mx-0" />
              <Skeleton className="h-5 w-64 mx-auto md:mx-0" />
            </div>
          </CardContent>
        </Card>
        <div>
          <Skeleton className="h-8 w-64 mb-4 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-secondary/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
// Forcer le redéploiement pour prendre en compte les permissions IAM