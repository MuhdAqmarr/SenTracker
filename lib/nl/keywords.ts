/**
 * Natural Language Expense Parser - Category Keyword Maps
 * Malaysian-focused expense categorization
 */

/**
 * Keywords that suggest a specific category
 * Keys are lowercase category names matching the categories table
 */
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: [
    // Malaysian food
    "nasi", "teh", "kopi", "makan", "minum", "mamak", "kopitiam",
    "roti", "nasi lemak", "nasi kandar", "char kuey teow", "laksa",
    "satay", "rendang", "ayam", "ikan", "goreng", "sup", "mi",
    // Meal types
    "lunch", "dinner", "breakfast", "supper", "brunch", "snack",
    // Chains
    "mcd", "mcdonalds", "kfc", "burger king", "pizza hut", "dominos",
    "subway", "starbucks", "zus", "zus coffee", "familymart", "7eleven",
    "oldtown", "secret recipe", "sushi king", "kenny rogers",
    "texas chicken", "nandos", "tealive", "gongcha", "boba",
  ],
  transport: [
    // Ride-hailing
    "grab", "grabcar", "grabfood", "indriver", "maxim",
    // Fuel
    "petrol", "diesel", "fuel", "minyak", "shell", "petronas", "caltex", "bp",
    // Parking & tolls
    "parking", "toll", "parkson", "tng", "touch n go", "smarttag",
    // Public transport
    "lrt", "mrt", "ktm", "bus", "rapidkl", "prasarana", "erl",
    // Vehicle
    "car wash", "cuci kereta", "service", "tayar", "tyre",
  ],
  shopping: [
    // E-commerce
    "shopee", "lazada", "zalora", "carousell",
    // Retail
    "uniqlo", "h&m", "zara", "cotton on", "padini", "vincci",
    "mr diy", "mr. diy", "ace hardware", "ikea", "harvey norman",
    "courts", "senheng", "aeon", "mydin", "tesco", "giant", "jaya grocer",
    // General
    "beli", "shopping", "belanja", "mall",
  ],
  subscriptions: [
    "netflix", "spotify", "youtube", "youtube premium", "disney",
    "disney+", "hbo", "hbo max", "apple music", "amazon prime",
    "chatgpt", "openai", "notion", "figma", "canva", "adobe",
    "microsoft 365", "google one", "icloud", "dropbox",
    "gym", "fitness first", "celebrity fitness", "anytime fitness",
  ],
  utilities: [
    "tnb", "tenaga", "electric", "elektrik", "syabas", "air", "water",
    "wifi", "internet", "unifi", "maxis", "digi", "celcom", "yes4g",
    "astro", "time", "streamyx", "broadband",
    "indah water", "sampah", "cukai", "assessment", "dbkl",
  ],
  entertainment: [
    "cinema", "wayang", "movie", "filem", "gsc", "tgv", "mbo", "mmcineplexes",
    "arcade", "bowling", "karaoke", "zoo", "aquaria", "theme park",
    "legoland", "sunway lagoon", "genting", "concert", "ticket", "tiket",
  ],
  healthcare: [
    "doctor", "doktor", "clinic", "klinik", "hospital", "pharmacy", "farmasi",
    "guardian", "watsons", "caring", "medicine", "ubat", "vitamin",
    "dental", "dentist", "gigi", "checkup", "medical",
  ],
  education: [
    "tuition", "class", "kelas", "book", "buku", "stationery", "alat tulis",
    "popular", "mph", "kinokuniya", "school", "sekolah", "university",
    "course", "kursus", "exam", "peperiksaan",
  ],
};

/**
 * Known merchants mapped to categories
 * Keys are lowercase merchant identifiers
 */
export const MERCHANT_CATEGORY_MAP: Record<string, string> = {
  // Transport
  grab: "transport",
  shell: "transport",
  petronas: "transport",
  caltex: "transport",
  tng: "transport",
  "touch n go": "transport",
  
  // Food
  mcd: "food",
  mcdonalds: "food",
  kfc: "food",
  starbucks: "food",
  zus: "food",
  "zus coffee": "food",
  familymart: "food",
  "7eleven": "food",
  "7-eleven": "food",
  oldtown: "food",
  tealive: "food",
  gongcha: "food",
  
  // Shopping
  shopee: "shopping",
  lazada: "shopping",
  zalora: "shopping",
  uniqlo: "shopping",
  "mr diy": "shopping",
  ikea: "shopping",
  aeon: "shopping",
  
  // Subscriptions
  netflix: "subscriptions",
  spotify: "subscriptions",
  youtube: "subscriptions",
  disney: "subscriptions",
  
  // Utilities
  tnb: "utilities",
  unifi: "utilities",
  maxis: "utilities",
  digi: "utilities",
  celcom: "utilities",
  astro: "utilities",
};

/**
 * Find category from keywords in text
 * Returns category name and confidence
 */
export function suggestCategoryFromKeywords(
  text: string
): { category: string | undefined; confidence: number } {
  const lowerText = text.toLowerCase();
  
  // Check merchant map first (higher confidence)
  for (const [merchant, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
    if (lowerText.includes(merchant)) {
      return { category, confidence: 0.9 };
    }
  }
  
  // Check keyword lists
  let bestMatch: { category: string; score: number } | null = null;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        // Longer keywords are worth more
        score += keyword.length;
      }
    }
    
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { category, score };
    }
  }
  
  if (bestMatch) {
    // Confidence based on match strength
    const confidence = Math.min(0.7 + (bestMatch.score * 0.02), 0.85);
    return { category: bestMatch.category, confidence };
  }
  
  return { category: undefined, confidence: 0 };
}
