
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github } from "lucide-react";
import type { Project } from "@/lib/data";
import { usePathname } from "next/navigation";

export function ProjectCard({ project }: { project: Project }) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'fr';
  // Note: The slug is generated in addProjectAction and is part of the project data from Firestore
  const projectUrl = project.githubUrl ? project.githubUrl : `/${lang}/projects/${project.slug}`;
  const isExternalLink = !!project.githubUrl;

  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/50 bg-secondary/30 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <Link href={projectUrl} target={isExternalLink ? "_blank" : "_self"} className="absolute inset-0 z-10" aria-label={`View ${project.title}`} />
      <CardHeader>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="abstract code"
          />
           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
        <CardTitle className="font-headline text-xl text-primary text-glow">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{project.description}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-accent/50 text-accent bg-accent/10">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-primary transition-transform duration-300 group-hover:translate-x-1 z-20">
          {isExternalLink ? 'Voir sur GitHub' : 'Voir le projet'} 
          {isExternalLink ? <Github className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
        </div>
      </CardFooter>
    </Card>
  );
}
