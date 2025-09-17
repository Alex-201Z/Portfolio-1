import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/animated-text";
import Link from "next/link";
import { ArrowRight, Briefcase, Code, Download } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { use } from "react"; // --- CORRECTION 1 : Importer 'use' ---

export default function Home({ params }: { params: { lang: string } }) {
  // --- CORRECTION 2 : Utiliser le hook 'use' pour lire les params ---
  const { lang } = use(params); 
  const dictionary = use(getDictionary(lang)); // On peut aussi l'utiliser ici
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
      <div className="max-w-4xl">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-glow bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Alex Ondo
        </h1>
        <p className="font-headline text-2xl md:text-3xl text-primary text-glow mb-6">
          {dictionary.home.jobTitle}
        </p>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-8 h-6">
          <Code className="w-5 h-5 text-accent" />
          <AnimatedText phrases={dictionary.home.animatedText} />
        </div>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 mb-10">
          {dictionary.home.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="button-glow w-full sm:w-auto">
            <Link href={`/${lang}/projects`}>
              <Briefcase className="mr-2 h-5 w-5" />
              {dictionary.home.projectsButton}
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <a href="/Alex-Ondo-CV.pdf" download>
              <Download className="mr-2 h-5 w-5" />
              {dictionary.home.cvButton}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-accent/50 text-accent hover:bg-accent/10 hover:text-accent button-glow-accent">
            <Link href={`/${lang}/contact`}>
              {dictionary.home.contactButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}