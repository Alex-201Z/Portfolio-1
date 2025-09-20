
export interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    iconUrl: string;
}

export interface SteamProfile {
    steamid: string;
    personaName: string;
    profileUrl: string;
    avatarFullUrl: string;
    avatarUrl: string;
    level: number;
    games: SteamGame[];
}

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

// DEBUG: Affiche la valeur des clés API au démarrage (à retirer en production)
console.log('DEBUG STEAM_API_KEY:', STEAM_API_KEY ? '[OK]' : '[NON TROUVÉ]');
console.log('DEBUG STEAM_ID:', STEAM_ID ? '[OK]' : '[NON TROUVÉ]');
const API_BASE_URL = "https://api.steampowered.com";


async function fetchSteamAPI(endpoint: string, params: URLSearchParams) {
    if (!STEAM_API_KEY || !STEAM_ID) {
        throw new Error("Steam API Key or Steam ID is not configured in .env file.");
    }
    params.set('key', STEAM_API_KEY);
    params.set('steamid', STEAM_ID);
    
    const url = `${API_BASE_URL}/${endpoint}/?${params.toString()}`;

    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Steam API error for ${endpoint}: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Failed to fetch from Steam API: ${endpoint}`);
    }
    const data = await response.json();
    
    // Steam API often wraps the result in a 'response' object
    return data.response;
}


export async function getSteamProfile(): Promise<SteamProfile> {
    // 1. Get Player Summaries
    const playerSummariesParams = new URLSearchParams({ steamids: STEAM_ID! });
    const summariesData = await fetchSteamAPI("ISteamUser/GetPlayerSummaries/v2", playerSummariesParams);
    const player = summariesData.players[0];

    if (!player) {
        throw new Error("Could not find Steam user with the provided ID.");
    }

    // 2. Get Player Level
    const levelParams = new URLSearchParams();
    const levelData = await fetchSteamAPI("IPlayerService/GetSteamLevel/v1", levelParams);
    const level = levelData.player_level;

    // 3. Get Owned Games
    const gamesParams = new URLSearchParams({
        include_appinfo: "true",
        include_played_free_games: "true",
        format: "json",
    });
    const ownedGamesData = await fetchSteamAPI("IPlayerService/GetOwnedGames/v1", gamesParams);
    
    const games: SteamGame[] = ownedGamesData.games
        .filter((game: any) => game.playtime_forever > 0) // Filter out unplayed games
        .sort((a: any, b: any) => b.playtime_forever - a.playtime_forever) // Sort by playtime
        .map((game: any) => ({
            appid: game.appid,
            name: game.name,
            playtime_forever: game.playtime_forever,
            img_icon_url: game.img_icon_url,
            // Construct the icon URL. If img_icon_url is present, use it.
            iconUrl: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
        }));
    
    return {
        steamid: player.steamid,
        personaName: player.personaname,
        profileUrl: player.profileurl,
        avatarFullUrl: player.avatarfull,
        avatarUrl: player.avatar,
        level: level,
        games: games,
    };
}
