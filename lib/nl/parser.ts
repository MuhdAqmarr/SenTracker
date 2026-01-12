/**
 * Natural Language Expense Parser - Main Parser
 * Deterministic parsing of expense text into structured data
 */

import type { ParsedExpense } from "./types";
import { normalizeText, removeFillerWords, toTitleCase } from "./normalize";
import { parseDate } from "./date";
import { suggestCategoryFromKeywords } from "./keywords";

/**
 * Amount extraction patterns
 * Supports: rm12, rm 12, RM12.50, 12rm, 12 myr, myr12, etc.
 */
const AMOUNT_PATTERNS = [
  // RM prefix: rm12, rm 12, rm12.50, RM 12.50
  /(?:rm|myr)\s*(\d+(?:\.\d{1,2})?)/i,
  // RM suffix: 12rm, 12 rm, 12.50rm
  /(\d+(?:\.\d{1,2})?)\s*(?:rm|myr|ringgit)/i,
  // Standalone number with decimal (less confident)
  /\b(\d+\.\d{1,2})\b/,
];

/**
 * Merchant extraction patterns
 * Matches: "at X", "@ X", "from X", "kedai X", "mamak X"
 */
const MERCHANT_PATTERNS = [
  /(?:at|@|from|kedai|mamak|restoran|restaurant)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:on|for|rm|myr|\d|$))/i,
  /(?:at|@|from|kedai|mamak|restoran|restaurant)\s+([a-zA-Z0-9\s]+)$/i,
];

/**
 * Parses natural language expense text into structured data
 * 
 * Supports Malaysian context: "RM12 grab today", "semalam rm25 petrol shell"
 * 
 * @param input - Raw expense text from user input
 * @returns ParsedExpense object with extracted amount, merchant, category, and date
 * 
 * @example
 * ```ts
 * parseExpenseText("RM12 grab today")
 * // Returns: { amount: 12, merchant: "Grab", category: "Transport", date: today }
 * ```
 */
export function parseExpenseText(input: string): ParsedExpense {
  const warnings: string[] = [];
  let confidence = 0;
  
  // Step 1: Normalize input
  let text = normalizeText(input);
  const originalInput = input;
  
  // Step 2: Extract amount
  let amount: number | undefined;
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      amount = parseFloat(match[1]);
      text = text.replace(pattern, " ").replace(/\s+/g, " ").trim();
      break;
    }
  }
  
  if (amount !== undefined && amount > 0) {
    confidence += 0.4;
  } else {
    warnings.push("Amount not found");
  }
  
  // Step 3: Extract date
  const dateResult = parseDate(text);
  const date = dateResult.date;
  text = dateResult.remaining;
  
  if (dateResult.explicit) {
    confidence += 0.15;
  } else {
    warnings.push("Date assumed today");
  }
  
  // Step 4: Extract merchant
  let merchant: string | undefined;
  for (const pattern of MERCHANT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      merchant = toTitleCase(match[1].trim());
      text = text.replace(pattern, " ").replace(/\s+/g, " ").trim();
      break;
    }
  }
  
  // If no merchant pattern found, try to find known merchants
  if (!merchant) {
    const lowerText = text.toLowerCase();
    const knownMerchants = [
      "grab", "shell", "petronas", "shopee", "lazada", "netflix", "spotify",
      "starbucks", "zus", "familymart", "kfc", "mcd", "mcdonalds", "tealive",
      "gongcha", "uniqlo", "ikea", "aeon", "tesco", "giant", "jaya grocer",
    ];
    
    for (const m of knownMerchants) {
      if (lowerText.includes(m)) {
        merchant = toTitleCase(m);
        text = text.replace(new RegExp(m, "gi"), " ").replace(/\s+/g, " ").trim();
        break;
      }
    }
  }
  
  if (merchant) {
    confidence += 0.2;
  }
  
  // Step 5: Extract notes (what remains)
  let notes: string | undefined = removeFillerWords(text).trim();
  
  // Clean up notes
  notes = notes
    .replace(/\s+/g, " ")
    .replace(/^[\s\-,]+/, "")
    .replace(/[\s\-,]+$/, "")
    .trim();
  
  if (notes) {
    notes = toTitleCase(notes);
  } else {
    notes = undefined;
  }
  
  // Step 6: Suggest category
  const categoryResult = suggestCategoryFromKeywords(originalInput);
  let categoryName = categoryResult.category;
  
  if (categoryName && categoryResult.confidence >= 0.7) {
    confidence += 0.25;
  } else if (categoryName && categoryResult.confidence < 0.7) {
    warnings.push("Category guessed - please verify");
    confidence += 0.1;
  } else {
    warnings.push("Category not detected - please select");
    categoryName = undefined;
  }
  
  // Clamp confidence to 0..1
  confidence = Math.min(Math.max(confidence, 0), 1);
  
  return {
    amount,
    currency: "MYR",
    merchant,
    date,
    notes,
    categoryName,
    confidence,
    warnings,
  };
}

/**
 * Validate parsed expense for save readiness
 */
export function isReadyToSave(parsed: ParsedExpense, categoryId?: string): boolean {
  return (
    parsed.amount !== undefined &&
    parsed.amount > 0 &&
    (categoryId !== undefined || parsed.categoryName !== undefined)
  );
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number | undefined): string {
  if (amount === undefined) return "—";
  return `RM ${amount.toFixed(2)}`;
}
