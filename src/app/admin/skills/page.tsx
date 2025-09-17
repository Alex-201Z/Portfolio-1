'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SkillForm } from '@/components/admin/skill-form';
import { useEffect, useState, useTransition, use } from 'react';
import { getDictionary } from '@/lib/i18n'; // Importez le dictionnaire
import type { Skill } from '@/lib/data';
import { getSkills } from '@/services/skills';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { deleteSkillAction } from '@/app/admin/skills/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { staticSkillCategories } from '@/lib/data';

export default function AdminSkillsPage({ params }: { params: { lang: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const lang = use(params).lang;
  const { toast } = useToast();
  
  const [dictionary, setDictionary] = useState<any>(null); // State pour le dictionnaire
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isFetchingSkills, setIsFetchingSkills] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  
  // Récupérez le dictionnaire
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

  const fetchSkills = async () => {
      setIsFetchingSkills(true);
      const fetchedSkills = await getSkills();
      setSkills(fetchedSkills);
      setIsFetchingSkills(false);
  };

  useEffect(() => {
    if (user) {
        fetchSkills();
    }
  }, [user]);

  const handleDeleteSkill = (skillId: string) => {
    startTransition(async () => {
        const result = await deleteSkillAction(skillId);
        if(result.success) {
            toast({ title: 'Succès', description: 'Compétence supprimée.' });
            setSkills(prev => prev.filter(p => p.id !== skillId));
        } else {
            toast({ variant: 'destructive', title: 'Erreur', description: result.error });
        }
    });
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  const handleFormFinished = () => {
    setEditingSkill(null);
    fetchSkills(); // refetch skills
  }

  const getCategoryName = (categoryId: string) => {
    return staticSkillCategories.find(cat => cat.id === categoryId)?.name || categoryId;
  }

  if (loading || !user || !dictionary) { // Ajoutez dictionary à la condition de chargement
    return (
      <div className="container mx-auto py-12 text-center flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const t = dictionary.portfolioManager; // Utilisez les mêmes textes que pour le gestionnaire de portfolio

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-bold mb-2">
            {editingSkill ? `Modifier : ${editingSkill.name}` : 'Ajouter une Compétence'}
        </h1>
        <p className="text-muted-foreground">
            {editingSkill ? "Modifiez les détails de la compétence ci-dessous." : "Ajoutez une nouvelle compétence à votre profil."}
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <SkillForm 
            skillToEdit={editingSkill}
            onFinished={handleFormFinished}
            texts={t.form} // Passez les textes au formulaire
        />
      </div>

      <Separator className="my-16" />
      
      <div>
        <h2 className="font-headline text-3xl font-bold mb-2">Liste des compétences</h2>
        <p className="text-muted-foreground mb-8">Gérez les compétences existantes.</p>
        
        <div className="rounded-lg border">
            {isFetchingSkills ? (
                <div className="p-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skills.map(skill => (
                            <TableRow key={skill.id}>
                                <TableCell className="font-medium">{skill.name}</TableCell>
                                <TableCell>{getCategoryName(skill.category)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={skill.level} className="w-full max-w-[150px] h-2"/>
                                        <span>{skill.level}%</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                     <Button variant="ghost" size="icon" onClick={() => handleEditSkill(skill)}>
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
                                                Cette action est irréversible. La compétence sera définitivement supprimée.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>{t.deleteProject.cancel}</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => handleDeleteSkill(skill.id)} 
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