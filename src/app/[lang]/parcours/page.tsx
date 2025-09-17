
import { getDictionary } from "@/lib/i18n";
import { TimelineItem } from "@/components/timeline-item";
import { Briefcase, GraduationCap } from "lucide-react";
import { AnimatedOnScroll } from "@/components/animated-on-scroll";
import type { ReactNode } from 'react';
import { timeline as timelineData } from "@/lib/data";

export interface TimelineEvent {
  type: 'education' | 'experience';
  title: string;
  institution: string;
  date: string;
  description: string[];
  icon: ReactNode;
}

const timeline: TimelineEvent[] = timelineData;


export default async function ParcoursPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.parcours;
  
  const experiences = timeline.filter(e => e.type === 'experience');
  const education = timeline.filter(e => e.type === 'education');

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-glow bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          {t.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="flex items-center gap-3 font-headline text-3xl text-accent text-glow-accent mb-8">
            <Briefcase className="w-8 h-8"/>
            {t.experience}
          </h2>
          <div className="relative timeline-line">
            {experiences.map((event, index) => (
               <AnimatedOnScroll key={index} delay={index * 0.2}>
                <TimelineItem event={event} />
              </AnimatedOnScroll>
            ))}
          </div>
        </div>
        
        <div>
           <h2 className="flex items-center gap-3 font-headline text-3xl text-accent text-glow-accent mb-8">
            <GraduationCap className="w-8 h-8"/>
            {t.education}
          </h2>
          <div className="relative timeline-line">
            {education.map((event, index) => (
              <AnimatedOnScroll key={index} delay={index * 0.2}>
                <TimelineItem event={event} />
              </AnimatedOnScroll>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
