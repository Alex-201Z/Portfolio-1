'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// Fonction utilitaire pour le slug
const createSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

const projectSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Le titre est requis.'),
    description: z.string().min(1, 'La description est requise.'),
    imageUrl: z.string().url("URL de l'image invalide."),
    tags: z.string().min(1, 'Au moins un tag est requis.'),
    githubUrl: z.string().url('URL GitHub invalide.').optional().or(z.literal('')),
});

interface ActionResult {
    success: boolean;
    error?: string;
}

export async function addProjectAction(values: z.infer<typeof projectSchema>): Promise<ActionResult> {
    const validatedFields = projectSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: 'Données invalides.' };
    }

    const { title, description, imageUrl, tags, githubUrl } = validatedFields.data;
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    try {
        await addDoc(collection(db, 'projects'), {
            title,
            description,
            imageUrl,
            tags: tagsArray,
            githubUrl: githubUrl || null,
            createdAt: serverTimestamp(),
            slug: createSlug(title), // Utilisation de la fonction
        });

        revalidatePath('/[lang]/projects', 'page');
        revalidatePath('/[lang]/admin/projects', 'page');
        return { success: true };
    } catch (error) {
        console.error('Error adding project:', error);
        return { success: false, error: "Une erreur est survenue lors de l'ajout du projet." };
    }
}

export async function updateProjectAction(values: z.infer<typeof projectSchema>): Promise<ActionResult> {
    const validatedFields = projectSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: 'Données invalides.' };
    }
    
    if (!validatedFields.data.id) {
         return { success: false, error: 'ID de projet manquant.' };
    }

    const { id, title, description, imageUrl, tags, githubUrl } = validatedFields.data;
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    try {
        const projectRef = doc(db, 'projects', id!);
        await updateDoc(projectRef, {
            title,
            description,
            imageUrl,
            tags: tagsArray,
            githubUrl: githubUrl || null,
            slug: createSlug(title), // Utilisation de la fonction
        });

        revalidatePath('/[lang]/projects', 'page');
        revalidatePath('/[lang]/admin/projects', 'page');
        return { success: true };

    } catch (error) {
        console.error('Error updating project:', error);
        return { success: false, error: 'Une erreur est survenue lors de la mise à jour du projet.' };
    }
}

export async function deleteProjectAction(projectId: string): Promise<ActionResult> {
    if (!projectId) {
        return { success: false, error: 'ID de projet invalide.' };
    }

    try {
        await deleteDoc(doc(db, 'projects', projectId));
        
        revalidatePath('/[lang]/projects', 'page');
        revalidatePath('/[lang]/admin/projects', 'page');
        return { success: true };

    } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, error: 'Une erreur est survenue lors de la suppression du projet.' };
    }
}