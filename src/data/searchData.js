export const trendingSearches = [
  "Sabyasachi lehenga",
  "Bridal red lehenga",
  "Manish Malhotra saree",
  "Torani anarkali",
  "Wedding guest outfit",
  "Mehendi sharara",
  "Raw Mango saree",
  "Cocktail gown",
];

export const categories = [
  {
    type: "category",
    label: "Bridal Lehengas",
    page: "women_bridal",
    tags: ["bridal", "lehenga", "wedding"],
  },

  {
    type: "category",
    label: "Sarees",
    page: "women_sarees",
    tags: ["saree", "silk", "festive"],
  },

  {
    type: "category",
    label: "Anarkalis",
    page: "women_anarkalis",
    tags: ["anarkali", "ethnic"],
  },

  {
    type: "category",
    label: "Sharara Sets",
    page: "women_sharara",
    tags: ["sharara", "mehendi"],
  },

  {
    type: "category",
    label: "Sherwanis",
    page: "men_sherwanis",
    tags: ["groom", "sherwani"],
  },

  {
    type: "category",
    label: "Kurta Sets",
    page: "women_kurta",
    tags: ["kurta"],
  },

  {
    type: "category",
    label: "Gowns",
    page: "women_gowns",
    tags: ["gown", "cocktail"],
  },
];

export const occasions = [
  {
    type: "occasion",
    label: "Bridal",
    page: "occ_bridal",
    tags: ["bridal", "wedding"],
  },

  {
    type: "occasion",
    label: "Wedding Guest",
    page: "occ_guest",
    tags: ["guest", "wedding"],
  },

  {
    type: "occasion",
    label: "Mehendi & Sangeet",
    page: "occ_mehendi",
    tags: ["mehendi", "sangeet"],
  },

  {
    type: "occasion",
    label: "Festive",
    page: "occ_festive",
    tags: ["festive", "festival"],
  },

  {
    type: "occasion",
    label: "Cocktail",
    page: "occ_cocktail",
    tags: ["cocktail", "party"],
  },
];

export const modes = [
  {
    type: "mode",
    label: "Rent",
    page: "rent_all",
    tags: ["rent", "rental", "hire", "borrow"],
  },

  {
    type: "mode",
    label: "Preloved",
    page: "preloved_all",
    tags: ["preloved", "pre loved", "resale"],
  },

  {
    type: "mode",
    label: "New",
    page: "new_all",
    tags: ["new", "brand new"],
  },
];

export const products = [
  {
    id: 1,
    type: "product",
    designer: "Sabyasachi",
    label: "Bridal Red Lehenga",
    price: "₹14,999",
    mode: "Rent",
    page: "rent_bridal",
    imageClass: "ci-a",
    tags: ["bridal", "lehenga", "red", "wedding"],
  },

  {
    id: 2,
    type: "product",
    designer: "Sabyasachi",
    label: "Gold Zardozi Lehenga",
    price: "₹18,999",
    mode: "Rent",
    page: "rent_sabyasachi",
    imageClass: "ci-b",
    tags: ["bridal", "gold", "lehenga"],
  },

  {
    id: 3,
    type: "product",
    designer: "Manish Malhotra",
    label: "Cocktail Gown",
    price: "₹39,999",
    mode: "Preloved",
    page: "preloved_mm",
    imageClass: "ci-c",
    tags: ["cocktail", "gown"],
  },

  {
    id: 4,
    type: "product",
    designer: "Torani",
    label: "Festive Anarkali",
    price: "₹22,999",
    mode: "New",
    page: "new_torani",
    imageClass: "ci-d",
    tags: ["anarkali", "festive"],
  },

  {
    id: 5,
    type: "product",
    designer: "Raw Mango",
    label: "Handwoven Saree",
    price: "₹29,999",
    mode: "New",
    page: "new_rawmango",
    imageClass: "ci-e",
    tags: ["saree", "handwoven"],
  },

  {
    id: 6,
    type: "product",
    designer: "Anita Dongre",
    label: "Bridal Kurta Set",
    price: "₹19,999",
    mode: "Rent",
    page: "rent_anita",
    imageClass: "ci-f",
    tags: ["kurta", "bridal"],
  },
];

export const searchCatalogue = [
  ...products,
  ...categories,
  ...occasions,
  ...modes,
];