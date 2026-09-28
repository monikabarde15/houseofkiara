/**
 * Search Synonyms, Filler Words & Popular Questions for Refund & Cancellation Policy
 * Spec v1.2 · Section 12.7, 13.7 & 13.8
 */

export const REFUND_SEARCH_SYNONYMS = {
  refund: ["refund", "money back", "reimburse"],
  money: ["money", "refund", "payment"],
  cancel: ["cancel", "cancellation", "postpone"],
  cancellation: ["cancellation", "cancel"],
  deposit: ["deposit", "security"],
  security: ["security", "deposit"],
  return: ["return", "send back", "pickup"],
  late: ["late", "delay", "delayed"],
  delay: ["delay", "late"],
  lost: ["lost", "missing", "stolen"],
  missing: ["missing", "lost"],
  stolen: ["stolen", "lost"],
  damage: ["damage", "damaged", "stain", "tear"],
  stain: ["stain", "spill", "damage"],
  fit: ["fit", "size"],
  size: ["size", "fit"],
  wrong: ["wrong", "mistake", "different"],
  fake: ["fake", "authentic", "genuine"],
  real: ["real", "authentic", "genuine"],
  genuine: ["genuine", "authentic"],
  exchange: ["exchange", "swap"],
  swap: ["swap", "exchange", "change"],
  change: ["change", "swap", "move"],
  complaint: ["complaint", "grievance", "unhappy", "escalate"],
  unhappy: ["unhappy", "complaint"],
  chargeback: ["chargeback", "dispute"],
  dispute: ["dispute", "chargeback", "disagree"],
  coupon: ["coupon", "promo", "code", "discount"],
  promo: ["promo", "coupon", "code"],
  discount: ["discount", "promo", "coupon"],
  gst: ["gst", "tax"],
  tax: ["tax", "gst"],
  emi: ["emi", "instalment", "installment"],
  ship: ["ship", "delivery", "courier"],
  shipping: ["shipping", "delivery"],
  delivery: ["delivery", "courier", "parcel"],
  parcel: ["parcel", "package", "box"],
  package: ["package", "parcel"],
  wedding: ["wedding", "event"],
  event: ["event", "wedding"],
  postponed: ["postponed", "moved", "called off"],
  extend: ["extend", "extension", "longer"],
  early: ["early", "sooner"],
  clean: ["clean", "wash", "fresh"],
  wash: ["wash", "clean"],
  smell: ["smell", "fresh"],
};

export const FILLER_WORDS = new Set([
  "the", "and", "can", "my", "is", "it", "do", "if", "of", "to", "in", "on", 
  "for", "what", "how", "an", "get", "does", "will", "am", "me", "at", "or", 
  "be", "a", "i"
]);

export const POPULAR_QUESTIONS = [
  {
    id: "r-cancel-early",
    text: "What do I get back if I cancel more than 7 days before my rental starts?",
    tab: "rental",
  },
  {
    id: "r-deposit-back",
    text: "When do I get my deposit back?",
    tab: "rental",
  },
  {
    id: "p-cancel-after",
    text: "Can I cancel after it has been dispatched?",
    tab: "preloved",
  },
  {
    id: "m-time",
    text: "How long does a refund take?",
    tab: "rental", // Shared, opens in current tab or rental
  },
];
