
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {year} Alex Ondo. Tous droits réservés.
        </p>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com/Alex-201Z" target="_blank" aria-label="GitHub">
              <Github className="h-5 w-5 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://www.linkedin.com/in/alex-ondo-a5285920b" target="_blank" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
