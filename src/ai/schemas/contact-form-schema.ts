/**
 * @fileOverview Zod schemas and TypeScript types for the contact form flow.
 */

import { z } from 'zod';

// Schema for the contact form input
export const ContactFormInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

// Schema for the AI's response
export const ContactFormOutputSchema = z.object({
  response: z.string().describe("A helpful and friendly response to the user's message, written in French."),
});
export type ContactFormOutput = z.infer<typeof ContactFormOutputSchema>;
