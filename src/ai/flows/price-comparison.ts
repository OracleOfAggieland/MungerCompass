'use server';

/**
 * @fileOverview An AI agent that finds and suggests cheaper alternatives online for a given item.
 *
 * - findCheaperAlternatives - A function that initiates the process of finding cheaper alternatives.
 * - FindCheaperAlternativesInput - The input type for the findCheaperAlternatives function.
 * - FindCheaperAlternativesOutput - The return type for the findCheaperAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindCheaperAlternativesInputSchema = z.object({
  itemName: z.string().describe('The name of the item to find alternatives for.'),
  itemImageUrl: z
    .string()
    .describe(
      'A URL of a photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    )
});
export type FindCheaperAlternativesInput = z.infer<typeof FindCheaperAlternativesInputSchema>;

const FindCheaperAlternativesOutputSchema = z.object({
  alternatives: z
    .array(
      z.object({
        name: z.string().describe('The name of the alternative item.'),
        url: z.string().url().describe('The URL where the alternative item can be found.'),
        price: z.number().describe('The price of the alternative item.'),
      })
    )
    .describe('A list of cheaper alternatives found online.'),
});
export type FindCheaperAlternativesOutput = z.infer<typeof FindCheaperAlternativesOutputSchema>;

export async function findCheaperAlternatives(
  input: FindCheaperAlternativesInput
): Promise<FindCheaperAlternativesOutput> {
  return findCheaperAlternativesFlow(input);
}

const findCheaperAlternativesPrompt = ai.definePrompt({
  name: 'findCheaperAlternativesPrompt',
  input: {schema: FindCheaperAlternativesInputSchema},
  output: {schema: FindCheaperAlternativesOutputSchema},
  prompt: `You are a helpful shopping assistant that finds cheaper alternatives for items online.

  Given the item name and an image of the item, search online and find at least three cheaper alternatives.
  Return a list of alternatives with their name, URL, and price.

  Item Name: {{{itemName}}}
  Item Image: {{media url=itemImageUrl}}

  Ensure that you only suggest alternatives that are cheaper than the original item.
  Consider using web scraping APIs to fetch alternative pricing.
  Be mindful of the opportunity cost and rational decision-making in your suggestions.
  Return your response in JSON format adhering to the output schema.`,
});

const findCheaperAlternativesFlow = ai.defineFlow(
  {
    name: 'findCheaperAlternativesFlow',
    inputSchema: FindCheaperAlternativesInputSchema,
    outputSchema: FindCheaperAlternativesOutputSchema,
  },
  async input => {
    const {output} = await findCheaperAlternativesPrompt(input);
    return output!;
  }
);
