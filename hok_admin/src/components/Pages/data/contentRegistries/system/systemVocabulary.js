/**
 * House of Kaira: Search Vocabulary
 * Appendix D of System Pages Specification v1.0
 */

export const SMALL_WORDS_IGNORED = [
  "a", "an", "the", "for", "of", "in", "on", "with", "and", "to",
  "my", "me", "i", "want", "need", "looking", "some", "something",
  "outfit", "outfits", "look", "looks", "piece", "pieces", "wear",
  "please", "show", "find"
];

export const SPELLING_VARIANTS = {
  lehnga: "lehenga",
  lengha: "lehenga",
  lahenga: "lehenga",
  lehanga: "lehenga",
  lenga: "lehenga",
  ghagra: "lehenga",
  ghaghra: "lehenga",
  chaniya: "lehenga",
  lehengas: "lehenga",
  sari: "saree",
  saris: "saree",
  sarees: "saree",
  saaree: "saree",
  sherwanis: "sherwani",
  sherwaani: "sherwani",
  anarkalis: "anarkali",
  shararas: "sharara",
  gharara: "sharara",
  kurtas: "kurta",
  kurti: "kurta",
  gowns: "gown",
  dress: "gown",
  mehndi: "mehendi",
  mehandi: "mehendi",
  henna: "mehendi",
  sangit: "sangeet",
  sabya: "sabyasachi",
  mm: "manish malhotra",
  tt: "tarun tahiliani",
  ajsk: "abu jani sandeep khosla",
  pdp: "papa dont preach",
  hire: "rent",
  rental: "rent",
  rentals: "rent",
  renting: "rent",
  resale: "preloved",
  preowned: "preloved",
  secondhand: "preloved",
  bride: "bridal",
  roka: "engagement",
  sagai: "engagement",
  golden: "gold",
  offwhite: "ivory"
};

export const WAY_OF_SHOPPING_WORDS = {
  rent: ["rent", "rental", "rentals", "renting", "hire"],
  preloved: ["preloved", "resale", "preowned", "secondhand", "pre loved", "pre-owned", "second hand"]
};

export const SHOPPING_PREFIX_WORDS = ["to", "on", "for", "a", "in"];

export const ROUTE_WORDS_IGNORED = [
  "rent", "rental", "rentals", "preloved", "buy", "new", "product", "products",
  "p", "piece", "pieces", "designer", "designers", "occasion", "occasions",
  "category", "categories", "collection", "collections", "edit", "shop",
  "search", "www", "html", "htm", "php", "index", "page", "pages", "amp", "utm"
];

export const TRENDING_SEARCHES = [
  "Sabyasachi lehenga",
  "Bridal red lehenga",
  "Manish Malhotra saree",
  "Torani anarkali",
  "Wedding guest outfit",
  "Mehendi sharara",
  "Raw Mango saree",
  "Cocktail gown"
];

export const OCCASIONS_ORDER = [
  { id: "bridal", roman: "I", name: "Bridal", path: "/main-page?section=occasions&occ=bridal" },
  { id: "wedding-guest", roman: "II", name: "Wedding Guest", path: "/main-page?section=occasions&occ=wedding-guest" },
  { id: "mehendi-sangeet", roman: "III", name: "Mehendi & Sangeet", path: "/main-page?section=occasions&occ=mehendi" },
  { id: "festive", roman: "IV", name: "Festive", path: "/main-page?section=occasions&occ=festive" },
  { id: "cocktail", roman: "V", name: "Cocktail", path: "/main-page?section=occasions&occ=cocktail" },
  { id: "reception", roman: "VI", name: "Reception", path: "/main-page?section=occasions&occ=reception" },
  { id: "engagement", roman: "VII", name: "Engagement", path: "/main-page?section=occasions&occ=engagement" }
];

export const CATEGORY_PLURALS = {
  lehenga: "lehengas",
  saree: "sarees",
  anarkali: "anarkalis",
  sharara: "sharara sets",
  sherwani: "sherwanis",
  kurta: "kurta sets",
  gown: "gowns",
  bandhgala: "bandhgalas"
};
