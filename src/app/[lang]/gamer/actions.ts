"use server";

import { getProfileData as getRiotProfile, type GamerProfile as RiotGamerProfile } from "@/services/riot";
import { getSteamProfile, type SteamProfile } from "@/services/steam";

interface CombinedGamerProfile {
    riot?: RiotGamerProfile;
    steam?: SteamProfile;
}

interface ActionResult {
    success: boolean;
    data?: CombinedGamerProfile;
    error?: string;
}

export async function getGamerProfiles(): Promise<ActionResult> {
    try {
        // Utilise Promise.allSettled pour ne pas bloquer si une API échoue
        const [riotResult, steamResult] = await Promise.allSettled([
            getRiotProfile(),
            getSteamProfile()
        ]);

        const data: CombinedGamerProfile = {};
        
        if (riotResult.status === 'fulfilled') {
            data.riot = riotResult.value;
        } else {
            console.error("Failed to fetch Riot Games profile:", riotResult.reason.message);
        }

        if (steamResult.status === 'fulfilled') {
            data.steam = steamResult.value;
        } else {
            console.error("Failed to fetch Steam profile:", steamResult.reason.message);
        }
        
        if (!data.riot && !data.steam) {
             return { success: false, error: "Impossible de charger les profils. Veuillez vérifier si au moins une clé d'API (Riot ou Steam) est correctement configurée dans votre fichier .env." };
        }

        return { success: true, data };

    } catch (error: any) {
        console.error("An unexpected error occurred in getGamerProfiles:", error);
        return { success: false, error: "Une erreur inconnue est survenue lors de la récupération des profils." };
    }
}