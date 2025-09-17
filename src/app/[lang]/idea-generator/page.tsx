
"use client";

import { useState, useTransition, use } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { generateProjectIdeaAction } from "@/app/actions/generate-project-idea";
import type { GenerateProjectIdeaOutput } from "@/ai/flows/project-idea-flow";
import { Loader2, Wand2, Lightbulb, CheckCircle, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";

const formSchema = z.object({
  keywords: z.string().min(3, "Please enter at least 3 characters."),
});

export default function IdeaGeneratorPage({ params }: { params: { lang: string } }) {
  const lang = use(params).lang;
  const [isPending, startTransition] = useTransition();
  const [idea, setIdea] = useState<GenerateProjectIdeaOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIdea(null);
    startTransition(async () => {
      const result = await generateProjectIdeaAction({ ...values, lang: lang });
      if (result.success) {
        setIdea(result.data!);
      } else {
        // Handle error, maybe show a toast
        console.error(result.error);
      }
    });
  };

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
       <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-glow bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Générateur d'Idées
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Un petit outil IA pour trouver l'inspiration pour votre prochain projet de portfolio.
        </p>
      </div>

      <Card className="bg-secondary/30">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Wand2 className="text-primary"/>
                Trouver une idée de projet
            </CardTitle>
            <CardDescription>
                Entrez quelques mots-clés (technologies, thèmes, etc.) et laissez l'IA faire le reste.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
                    <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                                <FormLabel>Mots-clés</FormLabel>
                                <FormControl>
                                <Input placeholder="ex: app de fitness, React Native, gamification" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : <Lightbulb />}
                        <span className="ml-2 hidden md:inline">Générer</span>
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>

      <AnimatePresence>
      {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 text-center"
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary"/>
            <p className="text-muted-foreground mt-2">L'IA réfléchit à votre prochaine grande idée...</p>
          </motion.div>
      )}
      </AnimatePresence>
      
      <AnimatePresence>
        {idea && (
             <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
             >
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary text-glow">{idea.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-foreground/80">{idea.description}</p>
                    
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><CheckCircle className="text-accent"/>Fonctionnalités Clés</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {idea.features.map((feature, i) => <li key={i}>{feature}</li>)}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Code className="text-accent"/>Stack Technique Recommandée</h3>
                        <div className="flex flex-wrap gap-2">
                             {idea.technologies.map((tech, i) => <Badge key={i} variant="outline">{tech}</Badge>)}
                        </div>
                    </div>
                </CardContent>
            </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
