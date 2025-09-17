
'use server';

import { generateProjectIdea } from "@/ai/flows/project-idea-flow";
import type { GenerateProjectIdeaInput } from "@/ai/flows/project-idea-flow";

export async function generateProjectIdeaAction(input: GenerateProjectIdeaInput) {
    try {
        const idea = await generateProjectIdea(input);
        return { success: true, data: idea };
    } catch(e: any) {
        console.error(e);
        return { success: false, error: e.message as string };
    }
}
