/**
 * House of Kaira - Care Policy Search Synonyms & Stop Words
 * Section 6.4 of Build Specification 2.0
 */

export const CARE_SYNONYMS = {
  stain: ["spill", "mark", "spot"],
  mark: ["stain", "spot"],
  spill: ["spilled", "stain", "splash"],
  steam: ["iron", "press", "crease"],
  iron: ["steam", "press"],
  crease: ["wrinkle", "steam", "iron"],
  pin: ["pins", "tape"],
  tape: ["pin"],
  alter: ["alteration", "tailor", "stitch", "fit"],
  wash: ["clean", "cleaning"],
  clean: ["cleaning", "wash", "dry"],
  cleaning: ["clean"],
  damage: ["stain", "tear", "burn"],
  tear: ["torn", "snag", "rip"],
  snag: ["tear", "pull"],
  sweat: ["perspiration"],
  perspiration: ["sweat"],
  perfume: ["scent", "deodorant"],
  makeup: ["foundation", "lipstick"],
  jewellery: ["jewelry", "necklace", "earrings"],
  jewelry: ["jewellery"],
  haldi: ["turmeric", "colour"],
  holi: ["colour", "gulal"],
  colour: ["color", "gulal", "haldi"],
  color: ["colour"],
  mehendi: ["henna", "mehndi"],
  henna: ["mehendi"],
  mehndi: ["mehendi", "henna"],
  fire: ["diya", "candle", "pheras", "burn"],
  rain: ["monsoon", "wet", "water"],
  return: ["send", "back", "courier"],
  pack: ["packing", "fold"],
  label: ["print"],
  deduction: ["deduct", "charge", "cost"],
  charge: ["deduction", "cost", "pay"],
  preloved: ["bought", "own"],
  own: ["preloved", "bought"],
  lehenga: ["skirt"],
  saree: ["sari"],
  sari: ["saree"],
  sherwani: ["bandhgala"],
  hook: ["button", "sequin"],
  button: ["hook"],
  sequin: ["bead", "sequins"],
  bead: ["sequin", "beads"]
};

export const CARE_STOP_WORDS = new Set([
  "the", "and", "can", "my", "is", "it", "do", "if", "of", "to", "in", "on", 
  "for", "what", "how", "an", "get", "does", "will", "am", "me", "at", "or", 
  "be", "a", "i"
]);
