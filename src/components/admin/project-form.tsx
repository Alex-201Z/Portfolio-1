'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import type { Project } from '@/lib/data';

// --- NOUVEAUX IMPORTS ---
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Le titre est requis.'),
  description: z.string().min(1, 'La description est requise.'),
  imageUrl: z.string().url('URL de l\'image invalide.'),
  tags: z.string().min(1, 'Au moins un tag est requis.'),
  githubUrl: z.string().url('URL GitHub invalide.').optional().or(z.literal('')),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
    texts: any;
    projectToEdit?: Project | null;
    onFinished?: () => void;
}

const createSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export function ProjectForm({ texts, projectToEdit, onFinished }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: '',
      title: '',
      description: '',
      imageUrl: 'https://picsum.photos/600/400',
      tags: '',
      githubUrl: '',
    },
  });
  
  useEffect(() => {
    if (projectToEdit) {
        form.reset({
            id: projectToEdit.id,
            title: projectToEdit.title,
            description: projectToEdit.description,
            imageUrl: projectToEdit.imageUrl,
            tags: projectToEdit.tags.join(', '),
            githubUrl: projectToEdit.githubUrl || '',
        });
    } else {
        form.reset({
            id: '',
            title: '',
            description: '',
            imageUrl: 'https://picsum.photos/600/400',
            tags: '',
            githubUrl: '',
        });
    }
  }, [projectToEdit, form]);

  const onSubmit = (data: ProjectFormValues) => {
    startTransition(async () => {
      const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      try {
        if (data.id) {
          // Mise à jour
          const projectRef = doc(db, 'projects', data.id);
          await updateDoc(projectRef, {
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            tags: tagsArray,
            githubUrl: data.githubUrl || null,
            slug: createSlug(data.title),
          });
          toast({ title: 'Succès', description: 'Projet mis à jour avec succès !' });
        } else {
          // Ajout
          await addDoc(collection(db, 'projects'), {
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            tags: tagsArray,
            githubUrl: data.githubUrl || null,
            createdAt: serverTimestamp(),
            slug: createSlug(data.title),
          });
          toast({ title: 'Succès', description: 'Projet ajouté avec succès !' });
        }
        form.reset();
        if (onFinished) onFinished();
      } catch (error) {
        console.error("Error saving project:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: "Une erreur est survenue lors de l'enregistrement du projet." });
      }
    });
  };

  const isEditing = !!projectToEdit;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{texts.titleLabel}</FormLabel>
              <FormControl>
                <Input placeholder={texts.titlePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{texts.descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea placeholder={texts.descriptionPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://picsum.photos/600/400" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{texts.tagsLabel}</FormLabel>
              <FormControl>
                <Input placeholder={texts.tagsPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{texts.githubUrlLabel}</FormLabel>
              <FormControl>
                <Input placeholder={texts.githubUrlPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : (isEditing ? texts.updateButton : texts.submitButton)}
            </Button>
            {isEditing && (
                <Button type="button" variant="outline" onClick={onFinished}>
                    {texts.cancelButton}
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}