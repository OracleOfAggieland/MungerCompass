'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing Charlie Munger-inspired financial advice on purchase decisions.
 *
 * - mungerStyleAnalysis - A function that handles the financial analysis process.
 * - MungerStyleAnalysisInput - The input type for the mungerStyleAnalysis function.
 * - MungerStyleAnalysisOutput - The return type for the mungerStyleAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MungerStyleAnalysisInputSchema = z.object({
  itemName: z.string().describe('The name of the item to be purchased.'),
  cost: z.number().describe('The cost of the item in dollars.'),
  purpose: z.string().optional().describe('The purpose of the item.'),
  frequency: z
    .enum(['Daily', 'Weekly', 'Monthly', 'Rarely', 'One-time'])
    .optional()
    .describe('How frequently the item will be used.'),
  imageUrl: z
    .string()
    .optional()
    .describe(
      'A URL of a photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
  income: z.number().optional().describe('Monthly income of the user'),
  expenses: z.number().optional().describe('Monthly expenses of the user'),
  savings: z.number().optional().describe('Total savings of the user'),
  riskTolerance: z
    .string()
    .optional()
    .describe('Risk tolerance of the user (e.g., low, medium, high)'),
});

export type MungerStyleAnalysisInput = z.infer<typeof MungerStyleAnalysisInputSchema>;

const MungerStyleAnalysisOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A clear recommendation: Buy or Don\'t Buy.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
  opportunityCost: z
    .string()
    .describe('An analysis of the opportunity cost of the purchase.'),
  alternatives: z
    .string()
    .optional()
    .describe('Suggested cheaper alternatives, if any.'),
  financialImpact: z
    .string()
    .describe('How the purchase affects the user\'s financial health.'),
  keyInsights: z
    .string()
    .describe('Key insights and behavioral economics observations.'),
});

export type MungerStyleAnalysisOutput = z.infer<typeof MungerStyleAnalysisOutputSchema>;

export async function mungerStyleAnalysis(
  input: MungerStyleAnalysisInput
): Promise<MungerStyleAnalysisOutput> {
  return mungerStyleAnalysisFlow(input);
}

const mungerStyleAnalysisPrompt = ai.definePrompt({
  name: 'mungerStyleAnalysisPrompt',
  input: {schema: MungerStyleAnalysisInputSchema},
  output: {schema: MungerStyleAnalysisOutputSchema},
  prompt: `You are Charlie Munger, a wise and rational financial advisor. A user is considering purchasing the following item:

Item Name: {{{itemName}}}
Cost: {{{cost}}}
Purpose: {{{purpose}}}
Frequency of Use: {{{frequency}}}
{{#if imageUrl}}
Item Image: {{media url=imageUrl}}
{{/if}}

Consider the user's financial situation:
{{#if income}}
Monthly Income: {{{income}}}
{{/if}}
{{#if expenses}}
Monthly Expenses: {{{expenses}}}
{{/if}}
{{#if savings}}
Total Savings: {{{savings}}}
{{/if}}
{{#if riskTolerance}}
Risk Tolerance: {{{riskTolerance}}}
{{/if}}

Analyze the purchase, considering opportunity cost, rational thinking, and long-term financial impact. Provide a clear recommendation (Buy or Don't Buy) and explain your reasoning. Suggest cheaper alternatives if available. Analyze how the purchase affects the user's financial health and provide key insights and behavioral economics observations related to the purchase.

Format your response as follows:

Recommendation: [Buy/Don't Buy]
Reasoning: [Your reasoning here]
Opportunity Cost: [Analysis of opportunity cost]
Alternatives: [Suggested cheaper alternatives, if any]
Financial Impact: [How the purchase affects the user's financial health]
Key Insights: [Key insights and behavioral economics observations]`,
});

const mungerStyleAnalysisFlow = ai.defineFlow(
  {
    name: 'mungerStyleAnalysisFlow',
    inputSchema: MungerStyleAnalysisInputSchema,
    outputSchema: MungerStyleAnalysisOutputSchema,
  },
  async input => {
    const {output} = await mungerStyleAnalysisPrompt(input);
    return output!;
  }
);

