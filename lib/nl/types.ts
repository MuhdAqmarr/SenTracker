/**
 * Natural Language Expense Parser - Core Types
 */

/**
 * Result of parsing a natural language expense input.
 */
export type ParsedExpense = {
  /** Extracted amount in MYR (undefined if not found) */
  amount?: number;
  /** Always MYR for Malaysian context */
  currency: "MYR";
  /** Extracted merchant name */
  merchant?: string;
  /** Parsed date (defaults to today if not found) */
  date: Date;
  /** Additional notes/description */
  notes?: string;
  /** Suggested category name (lowercase, matches categories table) */
  categoryName?: string;
  /** Confidence score 0..1 */
  confidence: number;
  /** Parsing warnings for user feedback */
  warnings: string[];
};

/**
 * Category with ID mapping for DB lookup
 */
export type CategoryMapping = {
  id: string;
  name: string;
  normalizedName: string; // lowercase for matching
};
