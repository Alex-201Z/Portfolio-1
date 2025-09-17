
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Project } from '@/lib/data';

/**
 * Fetches all projects from the Firestore database, ordered by creation date.
 * @returns A promise that resolves to an array of projects.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const projectsCollection = collection(db, 'projects');
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const projects = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        tags: data.tags || [],
        githubUrl: data.githubUrl,
        slug: data.slug,
        // Ensure createdAt is handled correctly, even if it's null
        // createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as Project;
    });
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // In case of an error, return an empty array to prevent the page from crashing.
    return [];
  }
}
