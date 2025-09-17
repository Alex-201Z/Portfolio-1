
import type { ReactNode } from "react";
import { Briefcase, GraduationCap, Palette, Server, Database, Code, BrainCircuit } from "lucide-react";

// --- TYPES ---

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl?: string;
  tags: string[];
}

export interface TimelineEvent {
  type: 'education' | 'experience';
  title: string;
  institution: string;
  date: string;
  description: string[];
  icon: ReactNode;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  // L'icône sera gérée côté client, pas besoin de la stocker
}

export interface SkillCategory {
  id: string; // ex: 'frontend', 'backend'
  name: string; // ex: 'Frontend', 'Backend'
  icon: ReactNode;
  skills: Skill[];
}


// --- DONNÉES STATIQUES ---
// Les projets et compétences sont maintenant gérés depuis l'interface d'administration
// et stockés dans Firebase. Seul le parcours reste statique ici.

export const timeline: TimelineEvent[] = [
    // Pour ajouter une expérience ou une formation, copiez et collez un des blocs ci-dessous.
  {
    type: 'experience',
    title: 'Développeur Junior (Stage)',
    institution: 'Freelance, Lyon',
    date: 'Jan-Fév 2025',
    description: [
      'Développement d\'applications avec React',
      'Rédaction de la documentation technique',
      'Gestion de projet en autonomie'
    ],
    icon: <Briefcase />,
  },
  {
    type: 'experience',
    title: 'Développeur Junior (Stage)',
    institution: 'ObenTx, Lyon',
    date: 'Mai-Août 2024',
    description: [
      'Développement de sites web avec WordPress',
      'Conception de supports visuels (flyers)',
      'Participation à l\'élaboration de plans d\'architecture'
    ],
    icon: <Briefcase />,
  },
  {
    type: 'education',
    title: 'BTS Services Informatiques aux Organisations (SLAM)',
    institution: 'Lycée la Martinière Duchère',
    date: '2023-2025',
    description: [],
    icon: <GraduationCap />,
  },
  {
    type: 'experience',
    title: 'Technicien IT (Stage)',
    institution: 'iClinic, Irlande',
    date: 'Mar-Avr 2023',
    description: [
      'Réparation de téléphones',
      'Démontage de PCs',
      'Relation client en anglais'
    ],
    icon: <Briefcase />,
  },
  {
    type: 'experience',
    title: 'Technicien IT (Stage)',
    institution: 'Foxstream, Lyon',
    date: 'Nov-Déc 2022',
    description: [
      'Assemblage, démontage et reconditionnement de PC et Box',
      'Vérification des stocks',
      'Installation de systèmes d\'exploitation'
    ],
    icon: <Briefcase />,
  },
  {
    type: 'education',
    title: 'Bac Pro Systèmes Numériques',
    institution: 'Lycée Professionnel Jacques de Flesselles',
    date: '2020-2023',
    description: [],
    icon: <GraduationCap />,
  },
];

export const staticSkillCategories = [
    {
        id: 'frontend',
        name: 'Frontend',
        icon: <Palette />,
    },
    {
        id: 'backend',
        name: 'Backend',
        icon: <Server />,
    },
    {
        id: 'database',
        name: 'Base de Données',
        icon: <Database />,
    },
    {
        id: 'ai',
        name: 'Intelligence Artificielle',
        icon: <BrainCircuit />,
    },
     {
        id: 'other',
        name: 'Autres',
        icon: <Code />,
    }
];
