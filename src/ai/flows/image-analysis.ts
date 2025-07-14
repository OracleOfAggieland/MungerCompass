// src/ai/flows/image-analysis.ts
'use server';

/**
 * @fileOverview Analyzes an image of a product and provides purchase advice, incorporating image analysis for item identification.
 *
 * - analyzeImage - A function that analyzes an image and provides purchase advice.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  itemName: z.string().describe('The name of the item.'),
  cost: z.number().describe('The cost of the item.'),
  purpose: z.string().optional().describe('The purpose of the item.'),
  frequency:
    z
      .string()
      .optional()
      .describe('How often the item will be used (Daily, Weekly, Monthly, Rarely, One-time).'),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  recommendation: z.string().describe('A recommendation on whether to buy the item.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
  opportunityCost: z.string().describe('An analysis of the opportunity cost.'),
  alternatives: z.array(z.string()).describe('Cheaper alternative suggestions.'),
  financialImpact: z.object({
    shortTerm: z.string(),
    longTerm: z.string(),
  }).describe('The short-term and long-term financial impact of the purchase.'),
  keyInsights: z.string().describe('Key insights and behavioral economics observations.'),
  itemDescription: z.string().describe('A description of the item identified from the image.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const analyzeImagePrompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are Charlie Munger, providing financial advice. Analyze the following purchase decision and provide a recommendation.

Item Name: {{itemName}}
Cost: {{cost}}
Purpose: {{purpose}}
Frequency of Use: {{frequency}}
Image: {{media url=photoDataUri}}

Consider the opportunity cost, financial impact, and behavioral economics principles.  First, provide a short description of the item in the image, and then provide your Munger style analysis.

Item Description:
Recommendation: 
Reasoning: 
Opportunity Cost: 
Alternatives: 
Financial Impact: 
Key Insights: `,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeImagePrompt(input);
    return output!;
  }
);
