
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy } from 'firebase/firestore';
import type { Skill } from '@/lib/data';

/**
 * Fetches all skills from the Firestore database.
 * @returns A promise that resolves to an array of skills.
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const skillsCollection = collection(db, 'skills');
    // We can order them later if needed, for now, just fetch all
    const q = await getDocs(skillsCollection);

    const skills = q.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        level: data.level,
        category: data.category
      } as Skill;
    });
    
    return skills;
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}
