"use client";

import { useEffect, useTransition, use } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth"; // Importez useAuth

const formSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

export default function LoginPage({ params }: { params: { lang: string } }) {
  const lang = use(params).lang;
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { user, loading } = useAuth(); // Utilisez le hook useAuth

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Gère la redirection une fois que l'utilisateur est authentifié
  useEffect(() => {
    if (!loading && user) {
      router.push(`/${lang}/admin/projects`);
    }
  }, [user, loading, router, lang]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
          title: "Succès",
          description: "Connexion réussie ! Redirection...",
        });
        // La redirection est maintenant gérée par le useEffect
      } catch (error: any) {
         let errorMessage = 'Une erreur inconnue est survenue.';
         switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = 'Email ou mot de passe incorrect.';
                break;
            default:
                console.error('Firebase sign-in error:', error);
                errorMessage = 'Une erreur est survenue lors de la connexion.';
        }
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage,
        });
      }
    });
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Connexion Admin</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder au panneau d'administration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@exemple.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <LogIn />
                )}
                <span className="ml-2">Se connecter</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}