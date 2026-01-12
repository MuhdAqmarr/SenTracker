/**
 * Natural Language Expense Parser - Barrel Export
 */

export { parseExpenseText, isReadyToSave, formatAmount } from "./parser";
export { parseDate } from "./date";
export { normalizeText, toTitleCase, removeFillerWords } from "./normalize";
export { suggestCategoryFromKeywords, CATEGORY_KEYWORDS, MERCHANT_CATEGORY_MAP } from "./keywords";
export { isAIAvailable, parseWithAI, AI_PARSER_ENABLED } from "./aiFallback";
export type { ParsedExpense, CategoryMapping } from "./types";
