'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ProjectForm } from '@/components/admin/project-form';
import { useEffect, useState, useTransition, use } from 'react';
import { getDictionary } from '@/lib/i18n';
import type { Project } from '@/lib/data';
import { getProjects } from '@/services/projects';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// --- NOUVEAUX IMPORTS ---
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default function AdminProjectsPage({ params }: { params: { lang: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const lang = use(params).lang;
  const { toast } = useToast();
  
  const [dictionary, setDictionary] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };
    fetchDictionary();
  }, [lang]);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${lang}/login`);
    }
  }, [user, loading, router, lang]);

  const fetchProjects = async () => {
      setIsFetchingProjects(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
      setIsFetchingProjects(false);
  };

  useEffect(() => {
    if (user) {
        fetchProjects();
    }
  }, [user]);

  // --- LOGIQUE DE SUPPRESSION DÉPLACÉE ICI ---
  const handleDeleteProject = (projectId: string) => {
    startTransition(async () => {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        toast({ title: 'Succès', description: 'Projet supprimé.' });
        setProjects(prev => prev.filter(p => p.id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue lors de la suppression.' });
      }
    });
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  const handleFormFinished = () => {
    setEditingProject(null);
    fetchProjects();
  }

  if (loading || !user || !dictionary) {
    return (
      <div className="container mx-auto py-12 text-center flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const t = dictionary.portfolioManager;

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-bold mb-2">
            {editingProject ? t.editProjectTitle.replace('{title}', editingProject.title) : t.newProjectTitle}
        </h1>
        <p className="text-muted-foreground">
            {editingProject ? "Modifiez les détails du projet ci-dessous." : "Ajoutez un nouveau projet à votre portfolio."}
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <ProjectForm 
            texts={t.form} 
            projectToEdit={editingProject}
            onFinished={handleFormFinished}
        />
      </div>

      <Separator className="my-16" />
      
      <div>
        <h2 className="font-headline text-3xl font-bold mb-2">Liste des projets</h2>
        <p className="text-muted-foreground mb-8">Gérez les projets existants.</p>
        
        <div className="rounded-lg border">
            {isFetchingProjects ? (
                <div className="p-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Titre</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map(project => (
                            <TableRow key={project.id}>
                                <TableCell>
                                    <Image src={project.imageUrl} alt={project.title} width={60} height={40} className="rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">{project.title}</TableCell>
                                <TableCell className="text-right">
                                     <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}>
                                        <Pencil className="w-4 h-4" />
                                     </Button>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" disabled={isPending}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>{t.deleteProject.title}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {t.deleteProject.description}
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>{t.deleteProject.cancel}</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => handleDeleteProject(project.id)} 
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                {isPending ? <Loader2 className="animate-spin" /> : t.deleteProject.confirm}
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
      </div>
    </div>
  );
}