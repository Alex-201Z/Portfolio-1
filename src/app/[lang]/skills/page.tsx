
import { AnimatedOnScroll } from "@/components/animated-on-scroll";
import { InteractiveSkills } from "@/components/interactive-skills";
import { getDictionary } from "@/lib/i18n";
import { getSkills } from "@/services/skills";
import { staticSkillCategories } from "@/lib/data";
import type { SkillCategory } from "@/lib/data";

export default async function SkillsPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.skills;

  const skills = await getSkills();
  
  // Group skills by category
  const categories: SkillCategory[] = staticSkillCategories.map(cat => ({
    ...cat,
    skills: skills.filter(skill => skill.category === cat.id)
  })).filter(cat => cat.skills.length > 0);


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

      <AnimatedOnScroll className="w-full max-w-3xl mx-auto">
        <InteractiveSkills categories={categories} />
      </AnimatedOnScroll>
    </div>
  );
}
