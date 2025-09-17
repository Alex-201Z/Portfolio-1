
import { AnimatedOnScroll } from "@/components/animated-on-scroll";
import { ProjectCard } from "@/components/project-card";
import { getDictionary } from "@/lib/i18n";
import { getProjects } from "@/services/projects";
import React from "react";

export default async function ProjectsPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.projects;
  const repos = await getProjects();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-glow bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            {t.title}
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {repos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((repo, index) => (
            <AnimatedOnScroll key={repo.id} delay={index * 0.1}>
              <ProjectCard project={repo} />
            </AnimatedOnScroll>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <p>Aucun projet à afficher pour le moment. Revenez bientôt !</p>
        </div>
      )}
    </div>
  );
}
