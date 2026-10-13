// src/data/pricing/pricingSynonyms.js
// Section 8.3 Synonym expansions for two-sided Pricing & Fees search

export const PRICING_SYNONYMS = {
  // Renting actions and terminology
  rent: ["rental", "hire", "borrow", "wear", "lease"],
  rental: ["rent", "hire", "borrow", "wear"],
  hire: ["rent", "rental"],

  // Buying, preloved and resale
  buy: ["purchase", "preloved", "owned", "keep"],
  preloved: ["secondhand", "resale", "preowned", "thrift", "used", "vintage"],
  resale: ["preloved", "preowned", "secondhand"],

  // Security deposits and financial guarantees
  deposit: ["security", "caution", "hold", "advance", "pledge"],
  security: ["deposit", "caution", "hold"],
  refund: ["return", "reimbursement", "back", "credit"],
  fee: ["charge", "cost", "price", "rate", "bill"],
  cost: ["fee", "price", "charge", "rate"],
  price: ["cost", "fee", "rate", "charge"],
  tax: ["gst", "charges", "duty"],
  gst: ["tax", "taxes", "charges"],

  // Logistics and timeliness
  delivery: ["shipping", "courier", "dispatch", "transit", "pickup"],
  shipping: ["delivery", "courier", "dispatch"],
  late: ["overdue", "delayed", "delay", "penalty", "extension"],
  penalty: ["late", "fine", "charge", "deduction"],
  extension: ["extend", "extra days", "renew"],

  // Care and condition
  damage: ["stain", "tear", "rip", "broken", "loss", "scratch", "ruined"],
  stain: ["damage", "mark", "spill", "spot"],
  cleaning: ["wash", "dryclean", "hygiene", "laundry"],

  // Lister and earnings terminology
  payout: ["earnings", "money", "income", "commission", "split", "disbursement"],
  earnings: ["payout", "income", "revenue", "profit"],
  commission: ["split", "cut", "share", "margin", "payout"],
  listing: ["lister", "consign", "closet", "wardrobe", "sell"],
  lister: ["seller", "owner", "partner", "consignor"],
  sell: ["list", "lister", "resale", "earnings"],
  insurance: ["protection", "coverage", "guarantee"],
  recall: ["retrieve", "pull back", "reclaim", "return"],
};

export const PRICING_STOP_WORDS = new Set([
  "the", "and", "can", "my", "is", "it", "do", "if", "of", "to",
  "in", "on", "for", "what", "how", "an", "get", "does", "will",
  "am", "me", "at", "or", "be", "a", "i", "you", "your"
]);
