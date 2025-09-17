
"use client"

import * as React from "react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import type { SkillCategory, Skill } from "@/lib/data" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Palette, Server, Database, Code, BrainCircuit } from 'lucide-react';


const chartConfig = {
  level: {
    label: "Niveau",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function InteractiveSkills({ categories }: { categories: SkillCategory[] }) {
  
  const chartData: Skill[] = React.useMemo(() => {
    return categories.flatMap(cat => cat.skills);
  }, [categories]);

  return (
    <Card className="bg-secondary/30">
      <CardHeader>
        <CardTitle className="text-center font-headline text-2xl text-primary text-glow">Vue d'ensemble des Compétences</CardTitle>
        <CardDescription className="text-center">
            Passez la souris sur un point pour voir la compétence. Le graphique affiche toutes les compétences.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
         {chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[250px] w-full max-w-[250px] sm:h-[400px] sm:max-w-[400px]"
            >
            <RadarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
            >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }} />
                <Radar
                  dataKey="level"
                  fill="var(--color-level)"
                  fillOpacity={0.6}
                  stroke="var(--color-level)"
                />
            </RadarChart>
            </ChartContainer>
         ) : (
            <p className="text-center text-muted-foreground py-16">Aucune compétence à afficher. Ajoutez-en depuis le panneau d'administration !</p>
         )}
      </CardContent>
    </Card>
  )
}
