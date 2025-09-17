'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
// Les imports pour addDoc, updateDoc, serverTimestamp ne sont plus nécessaires ici
import { doc, deleteDoc } from 'firebase/firestore'; 
import { revalidatePath } from 'next/cache';

interface ActionResult {
    success: boolean;
    error?: string;
}

// CONSERVEZ UNIQUEMENT deleteSkillAction
export async function deleteSkillAction(skillId: string): Promise<ActionResult> {
    if (!skillId) {
        return { success: false, error: 'ID de compétence invalide.' };
    }

    try {
        await deleteDoc(doc(db, 'skills', skillId));
        
        revalidatePath('/[lang]/skills', 'page');
        revalidatePath('/[lang]/admin/skills', 'page');
        return { success: true };

    } catch (error) {
        console.error('Error deleting skill:', error);
        return { success: false, error: 'Une erreur est survenue lors de la suppression de la compétence.' };
    }
}