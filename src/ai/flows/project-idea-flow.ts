/**
 * @fileOverview A project idea generator AI agent.
 *
 * - generateProjectIdea - A function that handles the project idea generation process.
 * - GenerateProjectIdeaInput - The input type for the generateProjectIdea function.
 * - GenerateProjectIdeaOutput - The return type for the generateProjectIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const GenerateProjectIdeaInputSchema = z.object({
  keywords: z.string().describe('A string of keywords to base the project idea on.'),
  lang: z.string().describe('The language to respond in (e.g., "fr" or "en").'),
});
export type GenerateProjectIdeaInput = z.infer<typeof GenerateProjectIdeaInputSchema>;

export const GenerateProjectIdeaOutputSchema = z.object({
    title: z.string().describe('A catchy and descriptive title for the project.'),
    description: z.string().describe('A one-paragraph summary of the project idea.'),
    features: z.array(z.string()).describe('A list of 3 to 5 key features for the project.'),
    technologies: z.array(z.string()).describe('A list of recommended technologies (frontend, backend, database, etc.).'),
});
export type GenerateProjectIdeaOutput = z.infer<typeof GenerateProjectIdeaOutputSchema>;


const prompt = ai.definePrompt({
  name: 'projectIdeaPrompt',
  input: {schema: GenerateProjectIdeaInputSchema},
  output: {schema: GenerateProjectIdeaOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are a creative product manager and senior software architect. Your task is to generate a compelling project idea for a developer's portfolio based on a set of keywords.

The idea should be interesting, feasible for a junior to mid-level developer, and showcase a good range of skills.

IMPORTANT: You MUST respond with a valid JSON object that conforms to the output schema. Do not add any text or formatting before or after the JSON object.

Here is an example of the desired output format:
\`\`\`json
{
  "title": "Project Title",
  "description": "Project description.",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "technologies": ["Tech 1", "Tech 2", "Tech 3"]
}
\`\`\`

Respond in the following language: {{lang}}

Generate a structured project idea based on the following keywords:
"{{keywords}}"
`,
});

const projectIdeaFlow = ai.defineFlow(
  {
    name: 'projectIdeaFlow',
    inputSchema: GenerateProjectIdeaInputSchema,
    outputSchema: GenerateProjectIdeaOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateProjectIdea(input: GenerateProjectIdeaInput): Promise<GenerateProjectIdeaOutput> {
    return await projectIdeaFlow(input);
}
