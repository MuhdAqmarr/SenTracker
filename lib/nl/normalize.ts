/**
 * Natural Language Expense Parser - Text Normalization Helpers
 */

/** Filler words to remove from input for cleaner parsing */
const FILLER_WORDS = [
  "spent", "spend", "pay", "paid", "beli", "bayar",
  "on", "untuk", "for", "bought", "purchase",
  "just", "only", "about", "around", "roughly",
  "i", "my", "me", "the", "a", "an"
];

/**
 * Normalize input text for parsing:
 * - Lowercase
 * - Collapse multiple spaces
 * - Trim whitespace
 * - Normalize common currency symbols
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/ringgit/gi, "rm")
    .replace(/myr/gi, "rm")
    .trim();
}

/**
 * Remove filler words from text
 */
export function removeFillerWords(text: string): string {
  const words = text.split(" ");
  const filtered = words.filter(word => !FILLER_WORDS.includes(word.toLowerCase()));
  return filtered.join(" ").trim();
}

/**
 * Convert to title case for display
 */
export function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Remove punctuation from string
 */
export function removePunctuation(str: string): string {
  return str.replace(/[.,!?;:'"()[\]{}]/g, "");
}

/**
 * Extract and remove a matched pattern, returning both the match and remaining text
 */
export function extractPattern(
  text: string, 
  pattern: RegExp
): { match: RegExpMatchArray | null; remaining: string } {
  const match = text.match(pattern);
  if (match) {
    const remaining = text.replace(pattern, "").replace(/\s+/g, " ").trim();
    return { match, remaining };
  }
  return { match: null, remaining: text };
}
