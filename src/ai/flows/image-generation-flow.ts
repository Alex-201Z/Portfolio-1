
'use server';

/**
 * @fileOverview A flow for generating images from a text prompt.
 *
 * - generateImage - Generates an image based on a text prompt.
 */

import { ai } from '@/ai/genkit';
import { GenerateImageInputSchema, GenerateImageOutputSchema, type GenerateImageInput, type GenerateImageOutput } from '@/ai/schemas/image-generation-schema';

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ prompt }) => {
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `A high-quality, professional, and visually appealing image for a developer portfolio project. The image should be in a 16:9 aspect ratio. The image should represent: ${prompt}`,
    });

    if (!media.url) {
        throw new Error('Image generation failed to return a URL.');
    }

    return { imageUrl: media.url };
  }
);
