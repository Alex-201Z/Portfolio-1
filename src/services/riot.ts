
// In a real-world application, this file would contain functions that
// make fetch requests to the official Riot Games API endpoints.
// We will now implement the actual API calls.

export interface ChampionStats {
    name: string;
    gamesPlayed: number;
    winRate: number;
    kda: string;
    imageUrl: string;
}

export interface GamerProfile {
    name: string;
    level: number;
    rank: string;
    wins: number;
    losses: number;
    winRate: number;
    profileIconUrl: string;
    topChampions: ChampionStats[];
}

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const API_BASE_URL_EUROPE = "https://europe.api.riotgames.com";
const API_BASE_URL_EUW1 = "https://euw1.api.riotgames.com";
const DDRAGON_BASE_URL = "https://ddragon.leagueoflegends.com";

// Helper function to handle API requests
async function fetchRiotAPI(url: string) {
    if (!RIOT_API_KEY) {
        throw new Error("Riot Games API key is not configured in .env file.");
    }
    const response = await fetch(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY }
    });
    if (!response.ok) {
        console.error(`Riot API error: ${response.status} ${response.statusText}`);
        const errorBody = await response.text();
        console.error("Error body:", errorBody);
        throw new Error(`Failed to fetch from Riot API: ${response.statusText}`);
    }
    return response.json();
}

export async function getProfileData(): Promise<GamerProfile> {
    const gameName = "Akarisus";
    const tagLine = "5148";

    // 1. Get PUUID from Riot ID
    const accountData = await fetchRiotAPI(`${API_BASE_URL_EUROPE}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);
    const puuid = accountData.puuid;

    // 2. Get Summoner data (level, profile icon) by PUUID
    const summonerData = await fetchRiotAPI(`${API_BASE_URL_EUW1}/lol/summoner/v4/summoners/by-puuid/${puuid}`);
    const summonerId = summonerData.id;
    const profileIconId = summonerData.profileIconId;
    
    // Fetch latest DDragon version for assets
    const versions = await (await fetch(`${DDRAGON_BASE_URL}/api/versions.json`)).json();
    const latestVersion = versions[0];
    
    const profileIconUrl = `${DDRAGON_BASE_URL}/cdn/${latestVersion}/img/profileicon/${profileIconId}.png`;

    // 3. Get League/Rank data
    const leagueData = await fetchRiotAPI(`${API_BASE_URL_EUW1}/lol/league/v4/entries/by-summoner/${summonerId}`);
    const rankedSoloQueue = leagueData.find((q: any) => q.queueType === "RANKED_SOLO_5x5");

    let rank = "Unranked";
    let wins = 0;
    let losses = 0;
    if (rankedSoloQueue) {
        rank = `${rankedSoloQueue.tier} ${rankedSoloQueue.rank}`;
        wins = rankedSoloQueue.wins;
        losses = rankedSoloQueue.losses;
    }
    const totalGames = wins + losses;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    
    // 4. Get Match History and calculate Top Champions
    const matchIds = await fetchRiotAPI(`${API_BASE_URL_EUROPE}/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&start=0&count=20`);

    const championStats: { [key: string]: { name: string, games: number, wins: number, kills: number, deaths: number, assists: number } } = {};

    // Fetch details for the last 20 matches
    await Promise.all(matchIds.slice(0, 20).map(async (matchId: string) => {
        const matchData = await fetchRiotAPI(`${API_BASE_URL_EUROPE}/lol/match/v5/matches/${matchId}`);
        const participant = matchData.info.participants.find((p: any) => p.puuid === puuid);
        if (participant) {
            const champName = participant.championName;
            if (!championStats[champName]) {
                championStats[champName] = { name: champName, games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 };
            }
            championStats[champName].games++;
            if (participant.win) {
                championStats[champName].wins++;
            }
            championStats[champName].kills += participant.kills;
            championStats[champName].deaths += participant.deaths;
            championStats[champName].assists += participant.assists;
        }
    }));
    
    // 5. Get all champion data from DDragon for images
    const allChampsData = await(await fetch(`${DDRAGON_BASE_URL}/cdn/${latestVersion}/data/en_US/champion.json`)).json();
    const champDataMap = allChampsData.data;

    // 6. Format top champions data
    const topChampions = Object.values(championStats)
        .sort((a, b) => b.games - a.games)
        .slice(0, 3)
        .map(champ => {
            const deaths = champ.deaths === 0 ? 1 : champ.deaths; // Avoid division by zero
            const kda = ((champ.kills + champ.assists) / deaths).toFixed(2);
            const champImage = champDataMap[champ.name]?.image?.full || 'default.png';
            return {
                name: champ.name,
                gamesPlayed: champ.games,
                winRate: Math.round((champ.wins / champ.games) * 100),
                kda,
                imageUrl: `${DDRAGON_BASE_URL}/cdn/${latestVersion}/img/champion/${champImage}`,
            }
        });

    return {
        name: `${gameName}#${tagLine}`,
        level: summonerData.summonerLevel,
        rank,
        wins,
        losses,
        winRate,
        profileIconUrl,
        topChampions,
    };
}
