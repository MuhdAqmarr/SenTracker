/**
 * Natural Language Expense Parser - AI Fallback (Stubbed)
 * Reserved for future AI-powered parsing integration
 */

import type { ParsedExpense } from "./types";

/**
 * Feature flag for AI parsing
 * Set NEXT_PUBLIC_AI_PARSER_ENABLED=true in .env to enable
 */
export const AI_PARSER_ENABLED = process.env.NEXT_PUBLIC_AI_PARSER_ENABLED === "true";

/**
 * Parse expense text using AI
 * Currently stubbed - throws error if called
 * 
 * Future implementation could use:
 * - OpenAI GPT-4
 * - Google Gemini
 * - Anthropic Claude
 * - Local LLM
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function parseWithAI(_text: string): Promise<ParsedExpense> {
  if (!AI_PARSER_ENABLED) {
    throw new Error("AI parsing is not enabled. Set NEXT_PUBLIC_AI_PARSER_ENABLED=true to enable.");
  }
  
  // TODO: Implement AI parsing
  // Example structure for future implementation:
  // 
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [
  //     { role: "system", content: "Extract expense data from text..." },
  //     { role: "user", content: text }
  //   ],
  //   response_format: { type: "json_object" }
  // });
  // 
  // return parseResponseToParsedExpense(response);
  
  throw new Error("AI parsing not yet implemented");
}

/**
 * Check if AI parsing is available
 */
export function isAIAvailable(): boolean {
  return AI_PARSER_ENABLED;
}
