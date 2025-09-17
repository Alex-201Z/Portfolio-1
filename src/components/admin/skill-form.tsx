'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { staticSkillCategories } from '@/lib/data';
import type { Skill } from '@/lib/data';

// --- NOUVEAUX IMPORTS ---
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Le nom est requis.'),
  level: z.number().min(0).max(100),
  category: z.string().min(1, 'La catégorie est requise.'),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
    skillToEdit?: Skill | null;
    onFinished: () => void;
    texts: any;
}

export function SkillForm({ skillToEdit, onFinished, texts }: SkillFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      id: '',
      name: '',
      level: 50,
      category: '',
    },
  });

  useEffect(() => {
    if (skillToEdit) {
      form.reset({
        id: skillToEdit.id,
        name: skillToEdit.name,
        level: skillToEdit.level,
        category: skillToEdit.category,
      });
    } else {
      form.reset({
        id: '',
        name: '',
        level: 50,
        category: '',
      });
    }
  }, [skillToEdit, form]);

  // --- LOGIQUE DE SAUVEGARDE MODIFIÉE ---
  const onSubmit = (data: SkillFormValues) => {
    startTransition(async () => {
      try {
        if (data.id) {
          // Mise à jour d'une compétence existante
          const skillRef = doc(db, 'skills', data.id);
          const { id, ...skillData } = data;
          await updateDoc(skillRef, skillData);
          toast({ title: 'Succès', description: 'Compétence mise à jour avec succès !' });
        } else {
          // Ajout d'une nouvelle compétence
          const { id, ...skillData } = data;
          await addDoc(collection(db, 'skills'), {
            ...skillData,
            createdAt: serverTimestamp(),
          });
          toast({ title: 'Succès', description: 'Compétence ajoutée avec succès !' });
        }
        onFinished();
      } catch (error) {
        console.error('Error saving skill:', error);
        toast({ variant: 'destructive', title: 'Erreur', description: "Une erreur est survenue lors de l'enregistrement." });
      }
    });
  };

  const isEditing = !!skillToEdit;
  const submitText = texts?.submitButton || 'Ajouter la compétence';
  const updateText = texts?.updateButton || 'Mettre à jour';
  const cancelText = texts?.cancelButton || 'Annuler';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Le reste du JSX du formulaire reste identique */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la compétence</FormLabel>
              <FormControl>
                <Input placeholder="ex: React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {staticSkillCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau de maîtrise : {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : (isEditing ? updateText : submitText)}
            </Button>
            {isEditing && (
                <Button type="button" variant="outline" onClick={onFinished}>
                    {cancelText}
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}