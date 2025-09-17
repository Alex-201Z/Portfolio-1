
"use client";

import type { TimelineEvent } from "@/app/[lang]/parcours/page";
import { Badge } from "./ui/badge";

export function TimelineItem({ event }: { event: TimelineEvent }) {
  return (
    <div className="relative pl-12 pb-8">
      <div className="absolute left-0 top-[6px] h-full">
        <div className="timeline-point relative">
          <div className="absolute top-[-9px] left-[-9px] w-6 h-6 flex items-center justify-center text-primary">
            {event.icon}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-1">
        <h3 className="font-headline text-xl text-primary text-glow">{event.title}</h3>
        <Badge 
          variant={event.type === 'experience' ? 'default' : 'secondary'}
          className={`shrink-0 ${event.type === 'experience' ? 'bg-accent text-accent-foreground border-transparent' : ''}`}
        >
          {event.date}
        </Badge>
      </div>

      <p className="font-semibold text-foreground/80 mb-2">{event.institution}</p>
      
      {event.description.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
          {event.description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
