// src/data/faq/searchKeywords.js
// Popular questions and search alternatives from Appendix C of Spec v3

export const POPULAR_QUESTIONS = [
  {
    id: "fit",
    label: "How do I know a piece will fit me?",
    momentId: "before",
    sectionId: "sizing-fit",
  },
  {
    id: "deposit-back",
    label: "When will I get my deposit back?",
    momentId: "back",
    sectionId: "your-deposit",
  },
  {
    id: "lead-time",
    label: "How far in advance should I book?",
    momentId: "before",
    sectionId: "rental-dates",
  },
  {
    id: "preloved-return",
    label: "Can I return a preloved piece?",
    momentId: "pre",
    sectionId: "after-it-arrives",
  },
];

export const SEARCH_ALTERNATIVES = {
  refund: ["refund", "deposit", "money back"],
  money: ["money", "refund", "payment", "price"],
  return: ["return", "send back", "pickup"],
  size: ["size", "fit", "measure"],
  fit: ["fit", "size", "measure"],
  ship: ["ship", "deliver", "courier"],
  shipping: ["shipping", "delivery", "courier"],
  delivery: ["delivery", "deliver", "ship"],
  price: ["price", "cost", "fee", "charge"],
  cost: ["cost", "price", "fee", "charge"],
  cod: ["cod", "cash"],
  cash: ["cash", "cod"],
  fake: ["fake", "authentic"],
  real: ["real", "authentic"],
  late: ["late", "delay", "extra day"],
  damage: ["damage", "stain", "tear"],
  stain: ["stain", "spill", "damage"],
  cancel: ["cancel", "postpone"],
  offer: ["offer", "negotiate"],
  bargain: ["bargain", "offer", "negotiate"],
  alter: ["alter", "tailor", "stitch"],
  tailor: ["tailor", "alter"],
  secondhand: ["preloved", "used"],
  used: ["used", "preloved", "worn"],
  hygiene: ["hygiene", "hygienic", "clean"],
  hygienic: ["hygienic", "hygiene", "clean"],
  clean: ["clean", "cleaned", "cleaning", "dry-cleaned"],
  fresh: ["fresh", "clean"],
  smell: ["smell", "fresh"],
  sanitised: ["sanitised", "hygiene"],
  sanitized: ["sanitized", "hygiene"],
  dirty: ["dirty", "clean"],
  care: ["care", "look after"],
  respect: ["respect", "care"],
  lehenga: ["lehenga", "piece"],
  saree: ["saree", "piece"],
  outfit: ["outfit", "piece"],
};

export default {
  POPULAR_QUESTIONS,
  SEARCH_ALTERNATIVES,
};
