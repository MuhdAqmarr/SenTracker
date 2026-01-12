/**
 * Natural Language Expense Parser - Date Parsing Helpers
 * Supports Malaysian date formats (D/M preferred over M/D)
 */

const MONTH_NAMES: Record<string, number> = {
  jan: 0, january: 0, januari: 0,
  feb: 1, february: 1, februari: 1,
  mar: 2, march: 2, mac: 2,
  apr: 3, april: 3,
  may: 4, mei: 4,
  jun: 5, june: 5,
  jul: 6, july: 6, julai: 6,
  aug: 7, august: 7, ogos: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, oktober: 9,
  nov: 10, november: 10,
  dec: 11, december: 11, disember: 11,
};

export type DateParseResult = {
  date: Date;
  explicit: boolean; // true if date was explicitly provided
  remaining: string; // text with date removed
};

/**
 * Parse date from text, returning the date and remaining text
 * Defaults to current time if no date found
 */
export function parseDate(text: string): DateParseResult {
  const now = new Date();
  
  // Comparison date at midnight for date-only comparisons
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);
  
  let remaining = text;
  
  // Check for "today"
  if (/\btoday\b|\bhari ini\b/i.test(text)) {
    remaining = text.replace(/\btoday\b|\bhari ini\b/gi, "").trim();
    return { date: now, explicit: true, remaining };
  }
  
  // Check for "yesterday" / "semalam"
  if (/\byesterday\b|\bsemalam\b/i.test(text)) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    remaining = text.replace(/\byesterday\b|\bsemalam\b/gi, "").trim();
    return { date: yesterday, explicit: true, remaining };
  }
  
  // Pattern: D/M or DD/MM or D-M or DD-MM (Malaysian format: day first)
  const numericDatePattern = /\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/;
  const numericMatch = text.match(numericDatePattern);
  if (numericMatch) {
    const day = parseInt(numericMatch[1], 10);
    const month = parseInt(numericMatch[2], 10) - 1; // 0-indexed
    let year = numericMatch[3] ? parseInt(numericMatch[3], 10) : now.getFullYear();
    
    // Handle 2-digit year
    if (year < 100) {
      year += 2000;
    }
    
    // Validate date
    if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
      const date = new Date(year, month, day, now.getHours(), now.getMinutes(), now.getSeconds());
      const dateMidnight = new Date(year, month, day);
      // Don't allow future dates beyond today
      if (dateMidnight <= todayMidnight) {
        remaining = text.replace(numericDatePattern, "").trim();
        return { date, explicit: true, remaining };
      }
    }
  }
  
  // Pattern: D MMM or DD MMM or D MMMM (e.g., "12 jan", "5 december")
  const namedMonthPattern = /\b(\d{1,2})\s+(jan|january|januari|feb|february|februari|mar|march|mac|apr|april|may|mei|jun|june|jul|july|julai|aug|august|ogos|sep|sept|september|oct|october|oktober|nov|november|dec|december|disember)\b/i;
  const namedMatch = text.match(namedMonthPattern);
  if (namedMatch) {
    const day = parseInt(namedMatch[1], 10);
    const monthName = namedMatch[2].toLowerCase();
    const month = MONTH_NAMES[monthName];
    
    if (month !== undefined && day >= 1 && day <= 31) {
      let year = now.getFullYear();
      const date = new Date(year, month, day, now.getHours(), now.getMinutes(), now.getSeconds());
      const dateMidnight = new Date(year, month, day);
      
      // If date is in future, assume last year
      if (dateMidnight > todayMidnight) {
        year -= 1;
        date.setFullYear(year);
      }
      
      remaining = text.replace(namedMonthPattern, "").trim();
      return { date, explicit: true, remaining };
    }
  }
  
  // No date found - default to current time
  return { date: now, explicit: false, remaining: text };
}
