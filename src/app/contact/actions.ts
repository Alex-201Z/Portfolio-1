
'use server';

/**
 * @fileOverview A contact form submission flow with an AI responder.
 */

import { ai } from '@/ai/genkit';
import { ContactFormInputSchema, type ContactFormInput } from '@/ai/schemas/contact-form-schema';
import { ContactFormOutputSchema } from '@/ai/schemas/contact-form-schema';
import { timeline, staticSkillCategories } from '@/lib/data';

// The Genkit prompt for the AI assistant
const assistantPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    input: { schema: ContactFormInputSchema },
    output: { schema: ContactFormOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are a helpful AI assistant for Alex Ondo, a junior web developer.
    Your goal is to answer questions about his portfolio, skills, and experience based on the context provided below.
    Be friendly, concise, and always respond in French.

    CONTEXT:
    - Alex Ondo is a junior developer looking for an apprenticeship.
    - Timeline/CV: ${JSON.stringify(timeline)}
    - Skills: ${JSON.stringify(staticSkillCategories)}
    - He has built a full portfolio website with a project manager, a gamer profile page, and AI features.
    - He has experience with both frontend and backend development.

    User's message:
    "{{message}}"

    Based on this, provide a helpful response.
    `,
});


// The main server action that will be called by the form
export async function submitContactForm(values: ContactFormInput) {
  const validatedFields = ContactFormInputSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid data provided.',
    };
  }

  try {
    // We don't save the message to a database in this example,
    // but this is where you would do it.

    // Generate a response from the AI
    const { output } = await assistantPrompt(validatedFields.data);
    
    if (!output) {
      throw new Error("The AI failed to generate a response.");
    }
    
    return {
      success: true,
      message: "Message received!",
      aiResponse: output.response,
    };

  } catch (error: any) {
    console.error('Error in contact form action:', error);
    return {
      success: false,
      message: 'An unexpected error occurred.',
    };
  }
}
