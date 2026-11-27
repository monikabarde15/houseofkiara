import { Product } from "../../types/product";

export type MeasurementUnit = "in" | "m";
export type MeasurementRole = "bust" | "chest" | "waist" | "hips" | null;
export type GarmentDetailKey = "padded" | "cancan" | "closure";

export interface MasterMeasurementDef {
  k: string;
  lbl: string;
  unit: MeasurementUnit;
  std: boolean;
  role: MeasurementRole;
}

export interface MasterGarmentPiece {
  id: string;
  name: string;
  measures: MasterMeasurementDef[];
  details: GarmentDetailKey[];
}

export interface GarmentMeasurementValue {
  v?: string;
  open?: string;
  take?: string;
}

export interface GarmentPieceDetails {
  padded?: string;
  cancan?: string;
  closure?: string;
}

export interface GarmentSetPiece {
  uid?: string;
  piece: string;
  name: string;
  m: Record<string, GarmentMeasurementValue>;
  d: GarmentPieceDetails;
}

export type NormalizedSizeFitGender = "men" | "women" | "unisex";

export const normalizeSizeFitGender = (
  gender?: string,
  category?: string,
): NormalizedSizeFitGender => {
  const gLower = String(gender || "").trim().toLowerCase();
  if (["men", "man", "male", "mens", "men's"].includes(gLower)) return "men";
  if (["women", "woman", "female", "womens", "women's"].includes(gLower)) {
    return "women";
  }
  if (gLower === "unisex") return "unisex";
  const catLower = String(category || "").toLowerCase();
  if (
    catLower.includes("sherwani") ||
    catLower.includes("bandhgala") ||
    catLower.includes("nehru") ||
    catLower.includes("achkan") ||
    catLower.includes("jodhpuri") ||
    catLower.includes("waistcoat") ||
    catLower.includes("bundi") ||
    catLower.includes("(men)") ||
    /\b(shirt|shirts|pant|pants|trouser|trousers|blazer|suit|suits)\b/.test(
      catLower,
    )
  ) {
    return "men";
  }
  return "women";
};

export const CLOSURE_OPTIONS_WOMEN = [
  "Back hooks",
  "Front hooks",
  "Side hooks",
  "Back dori",
  "Side zip",
  "Back zip",
  "Drawstring",
  "Hooks and drawstring",
  "Elastic",
  "Buttons",
];

export const CLOSURE_OPTIONS_MEN = [
  "Buttons",
  "Front zip",
  "Side zip",
  "Hook & bar",
  "Drawstring",
  "Elastic",
  "Concealed placket",
  "Open front",
];

export const CLOSURE_OPTIONS_UNISEX = [
  "Buttons",
  "Front zip",
  "Side zip",
  "Drawstring",
  "Elastic",
  "Hook & bar",
  "Open front",
];

export const CLOSURE_OPTIONS = [
  "",
  ...Array.from(
    new Set([
      ...CLOSURE_OPTIONS_WOMEN,
      ...CLOSURE_OPTIONS_MEN,
      ...CLOSURE_OPTIONS_UNISEX,
    ]),
  ),
];

export const ADJUSTABLE_CLOSURES = new Set([
  "back dori",
  "drawstring",
  "hooks and drawstring",
  "elastic",
]);

export const PADDED_OPTIONS = ["", "Yes", "No"];
export const CANCAN_OPTIONS = ["", "Yes", "No", "Detachable"];

export const HOW_IT_FITS_WOMEN = [
  "Not said",
  "Fitted at bust and waist",
  "Relaxed fit",
  "Flows from the waist",
];

export const HOW_IT_FITS_MEN = [
  "Not said",
  "Fitted at chest and waist",
  "Tailored fit",
  "Regular fit",
  "Relaxed fit",
];

export const HOW_IT_FITS_UNISEX = [
  "Not said",
  "Tailored fit",
  "Regular fit",
  "Relaxed fit",
];

export const HOW_IT_FITS_OPTIONS = Array.from(
  new Set([...HOW_IT_FITS_WOMEN, ...HOW_IT_FITS_MEN, ...HOW_IT_FITS_UNISEX]),
);

const WOMEN_ONLY_MEASURE_KEYS = new Set([
  "bust",
  "underBust",
  "blouseLength",
  "frontNeckDepth",
  "backNeckDepth",
  "hemFlare",
]);

const MEN_ONLY_MEASURE_KEYS = new Set([
  "chest",
  "collar",
  "cuff",
  "inseam",
  "frontRise",
  "bottomOpening",
]);

const WOMEN_ONLY_PIECE_IDS = new Set(["blouse", "lehenga_skirt", "saree_drape"]);

const WOMEN_ONLY_CLOSURES = new Set([
  "back hooks",
  "front hooks",
  "side hooks",
  "back dori",
  "back zip",
  "hooks and drawstring",
]);

const MEN_ONLY_CLOSURES = new Set([
  "front zip",
  "hook & bar",
  "concealed placket",
  "open front",
]);

export const isWomenOnlyFitOption = (val: string): boolean =>
  /\b(bust|flows from the waist)\b/i.test(String(val || ""));

export const isMenOnlyFitOption = (val: string): boolean =>
  /\b(chest|tailored fit|regular fit)\b/i.test(String(val || ""));

export const getHowItFitsOptionsForGender = (
  allOptions: string[] = HOW_IT_FITS_OPTIONS,
  gender?: string,
  category?: string,
): string[] => {
  const g = normalizeSizeFitGender(gender, category);
  const base =
    g === "men"
      ? HOW_IT_FITS_MEN
      : g === "unisex"
        ? HOW_IT_FITS_UNISEX
        : HOW_IT_FITS_WOMEN;
  const seen = new Set(base.map((x) => x.toLowerCase()));
  const out = [...base];
  for (const item of allOptions || []) {
    const clean = String(item || "").trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    if (g === "men" && isWomenOnlyFitOption(clean)) continue;
    if (g === "women" && isMenOnlyFitOption(clean)) continue;
    if (
      g === "unisex" &&
      (isWomenOnlyFitOption(clean) || isMenOnlyFitOption(clean))
    ) {
      continue;
    }
    seen.add(key);
    out.push(clean);
  }
  return out;
};

export const adaptFitDescForGender = (
  fitDesc?: string,
  gender?: string,
  category?: string,
): string => {
  const clean = String(fitDesc || "").trim();
  if (!clean) return "Not said";
  const g = normalizeSizeFitGender(gender, category);
  const lower = clean.toLowerCase();
  if (g === "men") {
    if (lower === "fitted at bust and waist") return "Fitted at chest and waist";
    if (isWomenOnlyFitOption(clean)) return "Not said";
    return clean;
  }
  if (g === "women") {
    if (lower === "fitted at chest and waist") return "Fitted at bust and waist";
    if (lower === "tailored fit" || lower === "regular fit") return "Not said";
    return clean;
  }
  if (
    lower === "fitted at bust and waist" ||
    lower === "fitted at chest and waist"
  ) {
    return "Tailored fit";
  }
  if (lower === "flows from the waist") return "Not said";
  return clean;
};

export const getClosureOptionsForGender = (
  allOptions: string[] = CLOSURE_OPTIONS,
  gender?: string,
  category?: string,
): string[] => {
  const g = normalizeSizeFitGender(gender, category);
  const base =
    g === "men"
      ? CLOSURE_OPTIONS_MEN
      : g === "unisex"
        ? CLOSURE_OPTIONS_UNISEX
        : CLOSURE_OPTIONS_WOMEN;
  const seen = new Set(base.map((x) => x.toLowerCase()));
  const out = [...base];
  for (const item of allOptions || []) {
    const clean = String(item || "").trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    if (g === "men" && WOMEN_ONLY_CLOSURES.has(key)) continue;
    if (g === "women" && MEN_ONLY_CLOSURES.has(key)) continue;
    if (g === "unisex" && WOMEN_ONLY_CLOSURES.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out;
};

export const adaptClosureForGender = (
  closure?: string,
  gender?: string,
  category?: string,
): string => {
  const clean = String(closure || "").trim();
  if (!clean) return "";
  const g = normalizeSizeFitGender(gender, category);
  const lower = clean.toLowerCase();
  if ((g === "men" || g === "unisex") && WOMEN_ONLY_CLOSURES.has(lower)) {
    return "";
  }
  if (g === "women" && MEN_ONLY_CLOSURES.has(lower)) {
    return "";
  }
  return clean;
};

export const MEASURED_BY_OPTIONS = [
  "The HOK team",
  "The owner (checked again at authentication)",
];

export const HEIGHT_OPTIONS = [
  `4'10"`,
  `4'11"`,
  `5'0"`,
  `5'1"`,
  `5'2"`,
  `5'3"`,
  `5'4"`,
  `5'5"`,
  `5'6"`,
  `5'7"`,
  `5'8"`,
  `5'9"`,
  `5'10"`,
  `5'11"`,
  `6'0"`,
  `6'1"`,
  `6'2"`,
];

export const MASTER_GARMENT_PIECES: MasterGarmentPiece[] = [
  {
    id: "blouse",
    name: "Blouse or choli",
    details: ["padded", "closure"],
    measures: [
      { k: "bust", lbl: "Bust", unit: "in", std: true, role: "bust" },
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: null },
      { k: "shoulder", lbl: "Shoulder", unit: "in", std: true, role: null },
      { k: "sleeveLength", lbl: "Sleeve length", unit: "in", std: true, role: null },
      { k: "blouseLength", lbl: "Blouse length", unit: "in", std: true, role: null },
      { k: "underBust", lbl: "Under bust", unit: "in", std: false, role: null },
      { k: "armhole", lbl: "Armhole", unit: "in", std: false, role: null },
      { k: "sleeveRound", lbl: "Sleeve round", unit: "in", std: false, role: null },
      { k: "frontNeckDepth", lbl: "Front neck depth", unit: "in", std: false, role: null },
      { k: "backNeckDepth", lbl: "Back neck depth", unit: "in", std: false, role: null },
    ],
  },
  {
    id: "lehenga_skirt",
    name: "Lehenga skirt",
    details: ["cancan", "closure"],
    measures: [
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: "waist" },
      { k: "hips", lbl: "Hips", unit: "in", std: true, role: "hips" },
      { k: "length", lbl: "Length, waist to hem", unit: "in", std: true, role: null },
      { k: "hemFlare", lbl: "Hem flare", unit: "m", std: false, role: null },
    ],
  },
  {
    id: "kurta",
    name: "Kurta, anarkali or gown",
    details: ["padded", "closure"],
    measures: [
      { k: "bust", lbl: "Bust", unit: "in", std: true, role: "bust" },
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: "waist" },
      { k: "hips", lbl: "Hips", unit: "in", std: true, role: "hips" },
      { k: "shoulder", lbl: "Shoulder", unit: "in", std: true, role: null },
      { k: "sleeveLength", lbl: "Sleeve length", unit: "in", std: true, role: null },
      { k: "length", lbl: "Length", unit: "in", std: true, role: null },
      { k: "armhole", lbl: "Armhole", unit: "in", std: false, role: null },
      { k: "sleeveRound", lbl: "Sleeve round", unit: "in", std: false, role: null },
      { k: "hemFlare", lbl: "Hem flare", unit: "m", std: false, role: null },
    ],
  },
  {
    id: "sharara",
    name: "Sharara, palazzo or pants",
    details: ["closure"],
    measures: [
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: "waist" },
      { k: "hips", lbl: "Hips", unit: "in", std: true, role: "hips" },
      { k: "thigh", lbl: "Thigh", unit: "in", std: true, role: null },
      { k: "length", lbl: "Length", unit: "in", std: true, role: null },
      { k: "knee", lbl: "Knee", unit: "in", std: false, role: null },
      { k: "hemRound", lbl: "Hem round", unit: "in", std: false, role: null },
    ],
  },
  {
    id: "churidar",
    name: "Churidar, pyjama or trousers",
    details: ["closure"],
    measures: [
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: "waist" },
      { k: "hips", lbl: "Hips", unit: "in", std: true, role: "hips" },
      { k: "thigh", lbl: "Thigh", unit: "in", std: true, role: null },
      { k: "length", lbl: "Length", unit: "in", std: true, role: null },
      { k: "calf", lbl: "Calf", unit: "in", std: false, role: null },
      { k: "ankle", lbl: "Ankle", unit: "in", std: false, role: null },
    ],
  },
  {
    id: "sherwani",
    name: "Sherwani, bandhgala or jacket",
    details: ["closure"],
    measures: [
      { k: "chest", lbl: "Chest", unit: "in", std: true, role: "chest" },
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: null },
      { k: "shoulder", lbl: "Shoulder", unit: "in", std: true, role: null },
      { k: "sleeveLength", lbl: "Sleeve length", unit: "in", std: true, role: null },
      { k: "collar", lbl: "Collar / Neck", unit: "in", std: true, role: null },
      { k: "length", lbl: "Length", unit: "in", std: true, role: null },
      { k: "hips", lbl: "Hip / Seat", unit: "in", std: false, role: null },
      { k: "armhole", lbl: "Armhole", unit: "in", std: false, role: null },
      { k: "cuff", lbl: "Cuff", unit: "in", std: false, role: null },
      { k: "sleeveRound", lbl: "Bicep / Sleeve round", unit: "in", std: false, role: null },
    ],
  },
  {
    id: "kurta_men",
    name: "Kurta (Men)",
    details: ["closure"],
    measures: [
      { k: "chest", lbl: "Chest", unit: "in", std: true, role: "chest" },
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: null },
      { k: "shoulder", lbl: "Shoulder", unit: "in", std: true, role: null },
      { k: "sleeveLength", lbl: "Sleeve length", unit: "in", std: true, role: null },
      { k: "collar", lbl: "Collar / Neck", unit: "in", std: true, role: null },
      { k: "length", lbl: "Kurta length", unit: "in", std: true, role: null },
      { k: "hips", lbl: "Hip / Seat", unit: "in", std: false, role: null },
      { k: "armhole", lbl: "Armhole", unit: "in", std: false, role: null },
      { k: "cuff", lbl: "Cuff", unit: "in", std: false, role: null },
      { k: "sleeveRound", lbl: "Bicep / Sleeve round", unit: "in", std: false, role: null },
    ],
  },
  {
    id: "shirt_men",
    name: "Shirt (Men)",
    details: ["closure"],
    measures: [
      { k: "chest", lbl: "Chest", unit: "in", std: true, role: "chest" },
      { k: "collar", lbl: "Collar / Neck", unit: "in", std: true, role: null },
      { k: "shoulder", lbl: "Shoulder", unit: "in", std: true, role: null },
      { k: "sleeveLength", lbl: "Sleeve length", unit: "in", std: true, role: null },
      { k: "length", lbl: "Shirt length", unit: "in", std: true, role: null },
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: null },
      { k: "cuff", lbl: "Cuff", unit: "in", std: false, role: null },
      { k: "armhole", lbl: "Armhole", unit: "in", std: false, role: null },
      { k: "sleeveRound", lbl: "Bicep / Sleeve round", unit: "in", std: false, role: null },
    ],
  },
  {
    id: "pant_men",
    name: "Pant / Trousers (Men)",
    details: ["closure"],
    measures: [
      { k: "waist", lbl: "Waist", unit: "in", std: true, role: "waist" },
      { k: "length", lbl: "Length (Outseam)", unit: "in", std: true, role: null },
      { k: "inseam", lbl: "Inseam", unit: "in", std: true, role: null },
      { k: "hips", lbl: "Hip / Seat", unit: "in", std: true, role: "hips" },
      { k: "thigh", lbl: "Thigh", unit: "in", std: true, role: null },
      { k: "frontRise", lbl: "Front rise", unit: "in", std: false, role: null },
      { k: "knee", lbl: "Knee", unit: "in", std: false, role: null },
      { k: "bottomOpening", lbl: "Bottom opening", unit: "in", std: false, role: null },
    ],
  },
  {
    id: "dupatta",
    name: "Dupatta or stole",
    details: [],
    measures: [
      { k: "length", lbl: "Length", unit: "m", std: true, role: null },
      { k: "width", lbl: "Width", unit: "m", std: true, role: null },
    ],
  },
  {
    id: "saree_drape",
    name: "Saree drape",
    details: [],
    measures: [
      { k: "length", lbl: "Length", unit: "m", std: true, role: null },
      { k: "width", lbl: "Width", unit: "m", std: true, role: null },
    ],
  },
  {
    id: "cape",
    name: "Cape",
    details: ["closure"],
    measures: [
      { k: "shoulder", lbl: "Shoulder", unit: "in", std: true, role: null },
      { k: "length", lbl: "Length", unit: "in", std: true, role: null },
    ],
  },
];

export const getMasterPieceDef = (
  pieceId?: string,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
): MasterGarmentPiece => {
  const source =
    Array.isArray(masterPiecesList) && masterPiecesList.length > 0
      ? masterPiecesList
      : MASTER_GARMENT_PIECES;
  return source.find((p) => p.id === pieceId) || source[0];
};

export const getGenderAwarePieceDef = (
  pieceId?: string,
  gender?: string,
  category?: string,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
): MasterGarmentPiece => {
  const g = normalizeSizeFitGender(gender, category);
  let mappedId = String(pieceId || "").trim();
  if (g === "men") {
    if (mappedId === "kurta") mappedId = "kurta_men";
    else if (mappedId === "sharara") mappedId = "pant_men";
  } else if (g === "women") {
    if (mappedId === "kurta_men" || mappedId === "shirt_men") mappedId = "kurta";
    else if (mappedId === "pant_men") mappedId = "sharara";
  }

  const base = getMasterPieceDef(mappedId, masterPiecesList);
  let details = Array.isArray(base.details) ? [...base.details] : [];
  let measures = Array.isArray(base.measures)
    ? base.measures.map((m) => ({ ...m }))
    : [];

  if (g === "men") {
    details = details.filter((d) => d !== "padded" && d !== "cancan");
    const hadBust = measures.some((m) => m.k === "bust");
    measures = measures.filter((m) => !WOMEN_ONLY_MEASURE_KEYS.has(m.k));
    if (hadBust && !measures.some((m) => m.k === "chest")) {
      measures.unshift({
        k: "chest",
        lbl: "Chest",
        unit: "in",
        std: true,
        role: "chest",
      });
    }
  } else if (g === "women") {
    const hadChest = measures.some((m) => m.k === "chest");
    measures = measures.filter((m) => !MEN_ONLY_MEASURE_KEYS.has(m.k));
    if (hadChest && !measures.some((m) => m.k === "bust")) {
      measures.unshift({
        k: "bust",
        lbl: "Bust",
        unit: "in",
        std: true,
        role: "bust",
      });
    }
  }

  return {
    ...base,
    details,
    measures,
  };
};

export interface CategoryPieceOption {
  piece: string;
  name: string;
}

export const DEFAULT_CATEGORY_ALLOWED_PIECES: Record<string, string[]> = {
  "Bridal Lehenga": ["blouse", "lehenga_skirt", "dupatta", "cape"],
  Lehenga: ["blouse", "lehenga_skirt", "dupatta", "cape"],
  Saree: ["saree_drape", "blouse", "dupatta", "cape"],
  Anarkali: ["kurta", "churidar", "sharara", "dupatta", "cape"],
  "Sharara Set": ["kurta", "sharara", "dupatta", "cape"],
  Sherwani: ["sherwani", "pant_men", "churidar", "kurta_men", "shirt_men", "dupatta"],
  Bandhgala: ["sherwani", "pant_men", "churidar", "shirt_men", "kurta_men", "dupatta"],
  Shirt: ["shirt_men", "pant_men", "sherwani", "churidar"],
  "Pant / Trousers": ["pant_men", "shirt_men", "sherwani", "kurta_men"],
  "Kurta Set (women)": ["kurta", "sharara", "churidar", "dupatta", "cape"],
  "Kurta Set (men)": ["kurta_men", "churidar", "pant_men", "sherwani", "dupatta"],
  Gown: ["kurta", "cape", "dupatta"],
  "Indo-Western": ["blouse", "kurta", "kurta_men", "shirt_men", "sherwani", "sharara", "pant_men", "churidar", "lehenga_skirt", "cape", "dupatta"],
  "Indo-Western (men)": ["sherwani", "pant_men", "churidar", "shirt_men", "kurta_men", "dupatta"],
  "Indo-Western (women)": ["blouse", "kurta", "sharara", "lehenga_skirt", "cape", "dupatta"],
  "Nehru Jacket": ["sherwani", "kurta_men", "shirt_men", "pant_men", "churidar", "dupatta"],
};

export const DEFAULT_CATEGORY_ADD_OPTIONS: Record<string, CategoryPieceOption[]> = {
  "Bridal Lehenga": [
    { piece: "blouse", name: "Blouse" },
    { piece: "lehenga_skirt", name: "Lehenga skirt" },
    { piece: "dupatta", name: "Dupatta" },
    { piece: "cape", name: "Cape" },
  ],
  Lehenga: [
    { piece: "blouse", name: "Blouse" },
    { piece: "lehenga_skirt", name: "Lehenga skirt" },
    { piece: "dupatta", name: "Dupatta" },
    { piece: "cape", name: "Cape" },
  ],
  Saree: [
    { piece: "blouse", name: "Blouse" },
    { piece: "saree_drape", name: "Saree drape" },
    { piece: "dupatta", name: "Veil / Dupatta" },
    { piece: "cape", name: "Cape" },
  ],
  Anarkali: [
    { piece: "kurta", name: "Anarkali" },
    { piece: "churidar", name: "Churidar" },
    { piece: "sharara", name: "Palazzo / Pants" },
    { piece: "dupatta", name: "Dupatta" },
    { piece: "cape", name: "Cape" },
  ],
  "Sharara Set": [
    { piece: "kurta", name: "Kurta" },
    { piece: "sharara", name: "Sharara" },
    { piece: "dupatta", name: "Dupatta" },
    { piece: "cape", name: "Cape" },
  ],
  Sherwani: [
    { piece: "sherwani", name: "Sherwani" },
    { piece: "churidar", name: "Churidar" },
    { piece: "pant_men", name: "Pant / Trousers" },
    { piece: "kurta_men", name: "Inner kurta" },
    { piece: "shirt_men", name: "Shirt" },
    { piece: "dupatta", name: "Stole" },
  ],
  Bandhgala: [
    { piece: "sherwani", name: "Bandhgala" },
    { piece: "pant_men", name: "Trousers / Pant" },
    { piece: "shirt_men", name: "Shirt" },
    { piece: "kurta_men", name: "Inner kurta" },
    { piece: "churidar", name: "Churidar" },
    { piece: "dupatta", name: "Stole" },
  ],
  "Nehru Jacket": [
    { piece: "sherwani", name: "Nehru jacket" },
    { piece: "kurta_men", name: "Kurta" },
    { piece: "shirt_men", name: "Shirt" },
    { piece: "pant_men", name: "Pant / Trousers" },
    { piece: "churidar", name: "Pyjama / Churidar" },
    { piece: "dupatta", name: "Stole" },
  ],
  Shirt: [
    { piece: "shirt_men", name: "Shirt" },
    { piece: "pant_men", name: "Pant / Trousers" },
    { piece: "sherwani", name: "Jacket / Blazer" },
    { piece: "churidar", name: "Churidar" },
  ],
  "Pant / Trousers": [
    { piece: "pant_men", name: "Pant / Trousers" },
    { piece: "shirt_men", name: "Shirt" },
    { piece: "sherwani", name: "Jacket / Blazer" },
    { piece: "kurta_men", name: "Kurta" },
  ],
  "Kurta Set (women)": [
    { piece: "kurta", name: "Kurta" },
    { piece: "sharara", name: "Pants / Palazzo" },
    { piece: "churidar", name: "Churidar" },
    { piece: "dupatta", name: "Dupatta" },
    { piece: "cape", name: "Cape" },
  ],
  "Kurta Set (men)": [
    { piece: "kurta_men", name: "Kurta" },
    { piece: "churidar", name: "Pyjama / Churidar" },
    { piece: "pant_men", name: "Pant / Trousers" },
    { piece: "sherwani", name: "Nehru jacket" },
    { piece: "dupatta", name: "Stole" },
  ],
  Gown: [
    { piece: "kurta", name: "Gown" },
    { piece: "cape", name: "Cape" },
    { piece: "dupatta", name: "Dupatta / Drape" },
  ],
  "Indo-Western": [
    { piece: "sherwani", name: "Jacket" },
    { piece: "pant_men", name: "Pant / Trousers" },
    { piece: "shirt_men", name: "Shirt" },
    { piece: "churidar", name: "Churidar / Pyjama" },
    { piece: "blouse", name: "Blouse / Crop top" },
    { piece: "kurta", name: "Tunic / Kurta" },
    { piece: "sharara", name: "Palazzo / Pants" },
    { piece: "lehenga_skirt", name: "Skirt" },
    { piece: "cape", name: "Cape" },
    { piece: "dupatta", name: "Drape / Stole" },
  ],
  "Indo-Western (men)": [
    { piece: "sherwani", name: "Jacket" },
    { piece: "pant_men", name: "Pant / Trousers" },
    { piece: "shirt_men", name: "Shirt" },
    { piece: "kurta_men", name: "Kurta" },
    { piece: "churidar", name: "Churidar / Pyjama" },
    { piece: "dupatta", name: "Stole" },
  ],
  "Indo-Western (women)": [
    { piece: "blouse", name: "Blouse / Crop top" },
    { piece: "kurta", name: "Tunic / Kurta" },
    { piece: "sharara", name: "Palazzo / Pants" },
    { piece: "lehenga_skirt", name: "Skirt" },
    { piece: "cape", name: "Cape" },
    { piece: "dupatta", name: "Drape / Stole" },
  ],
};

const resolveCategoryAliasKey = (
  catLower: string,
  genderLower: string,
): string | undefined => {
  const isMen = genderLower === "men" || genderLower === "male" || genderLower === "man";
  const isWomen =
    genderLower === "women" || genderLower === "female" || genderLower === "woman";

  if (catLower.includes("saree") || catLower.includes("sari")) return "Saree";
  if (catLower.includes("bridal") && catLower.includes("lehenga")) return "Bridal Lehenga";
  if (catLower.includes("lehenga")) return "Lehenga";
  if (catLower.includes("bandhgala")) return "Bandhgala";
  if (catLower.includes("sherwani")) return "Sherwani";
  if (catLower.includes("nehru")) return "Nehru Jacket";
  if (/\b(shirt|shirts)\b/.test(catLower)) return "Shirt";
  if (/\b(pant|pants|trouser|trousers)\b/.test(catLower)) return "Pant / Trousers";
  if (catLower.includes("sharara") || catLower.includes("gharara")) return "Sharara Set";
  if (catLower.includes("anarkali")) return "Anarkali";
  if (catLower.includes("kurta")) return isMen ? "Kurta Set (men)" : "Kurta Set (women)";
  if (catLower.includes("gown")) return "Gown";
  if (catLower.includes("indo")) {
    return isMen
      ? "Indo-Western (men)"
      : isWomen
        ? "Indo-Western (women)"
        : "Indo-Western";
  }
  return undefined;
};

const lookupCategoryMapEntry = <T>(
  map: Record<string, T>,
  tokenLower: string,
  genderLower: string,
): T | undefined => {
  const aliasKey = resolveCategoryAliasKey(tokenLower, genderLower);
  if (aliasKey && map[aliasKey]) return map[aliasKey];
  for (const [key, val] of Object.entries(map)) {
    if (key.toLowerCase() === tokenLower) return val;
  }
  return undefined;
};

export const getAllowedPiecesForCategory = (
  category?: string,
  gender?: string,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
  categoryAllowedPiecesMap?: Record<string, string[]>,
): MasterGarmentPiece[] => {
  const source =
    Array.isArray(masterPiecesList) && masterPiecesList.length > 0
      ? masterPiecesList
      : MASTER_GARMENT_PIECES;
  const mergedMap = {
    ...DEFAULT_CATEGORY_ALLOWED_PIECES,
    ...(categoryAllowedPiecesMap || {}),
  };
  const cleanCat = String(category || "").trim();
  const genderLower = String(gender || "").trim().toLowerCase();

  const allowedIds = cleanCat
    ? lookupCategoryMapEntry(mergedMap, cleanCat.toLowerCase(), genderLower)
    : undefined;

  if (!Array.isArray(allowedIds) || allowedIds.length === 0) {
    return source;
  }
  const allowedSet = new Set(allowedIds);
  const filtered = source.filter((p) => allowedSet.has(p.id));
  return filtered.length > 0 ? filtered : source;
};

const MEN_FALLBACK_ADD_OPTIONS: CategoryPieceOption[] = [
  { piece: "kurta_men", name: "Kurta" },
  { piece: "shirt_men", name: "Shirt" },
  { piece: "sherwani", name: "Sherwani / Jacket" },
  { piece: "pant_men", name: "Pant / Trousers" },
  { piece: "churidar", name: "Churidar / Pyjama" },
  { piece: "dupatta", name: "Stole" },
  { piece: "cape", name: "Cape" },
];

const WOMEN_FALLBACK_ADD_OPTIONS: CategoryPieceOption[] = [
  { piece: "blouse", name: "Blouse" },
  { piece: "kurta", name: "Kurta / Gown" },
  { piece: "sharara", name: "Pants / Palazzo" },
  { piece: "dupatta", name: "Dupatta" },
  { piece: "cape", name: "Cape" },
];

const WOMEN_ONLY_DEFAULT_NAME_REGEX =
  /^(gown|anarkali|kurta,\s*anarkali\s*or\s*gown|tunic\s*\/\s*kurta|blouse|blouse\s*\/\s*crop\s*top)$/i;

const WOMEN_BOTTOM_NAME_REGEX =
  /^(sharara|palazzo\s*\/\s*pants|pants\s*\/\s*palazzo|sharara,\s*palazzo\s*or\s*pants)$/i;

const WOMEN_DUPATTA_NAME_REGEX =
  /^(dupatta|dupatta\s*\/\s*drape|veil\s*\/\s*dupatta|dupatta\s*or\s*stole|drape|drape\s*\/\s*stole)$/i;

export const getAddOptionsForCategory = (
  category?: string,
  gender?: string,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
  categoryAddOptionsMap?: Record<string, CategoryPieceOption[]>,
): CategoryPieceOption[] => {
  const source =
    Array.isArray(masterPiecesList) && masterPiecesList.length > 0
      ? masterPiecesList
      : MASTER_GARMENT_PIECES;
  const validIds = new Set(source.map((p) => p.id));
  const mergedMap: Record<string, CategoryPieceOption[]> = {
    ...DEFAULT_CATEGORY_ADD_OPTIONS,
    ...(categoryAddOptionsMap || {}),
  };
  const g = normalizeSizeFitGender(gender, category);
  const genderLower = String(gender || "").trim().toLowerCase();
  const tokens = String(category || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return g === "men" ? MEN_FALLBACK_ADD_OPTIONS : [];
  }

  const seenPieces = new Set<string>();
  const out: CategoryPieceOption[] = [];
  const catLower = String(category || "").toLowerCase();
  const isIndoWestern = catLower.includes("indo");

  const pushAdapted = (item: CategoryPieceOption) => {
    if (!item?.piece) return;
    let nextPiece = item.piece;
    let nextName = String(item.name || "").trim();

    if (g === "men") {
      if (WOMEN_ONLY_PIECE_IDS.has(nextPiece)) return;
      if (nextPiece === "kurta") {
        nextPiece = "kurta_men";
        if (!nextName || WOMEN_ONLY_DEFAULT_NAME_REGEX.test(nextName)) {
          nextName = "Kurta";
        }
      } else if (nextPiece === "sharara") {
        nextPiece = "pant_men";
        if (!nextName || WOMEN_BOTTOM_NAME_REGEX.test(nextName)) {
          nextName = "Pant / Trousers";
        }
      } else if (
        nextPiece === "dupatta" &&
        (!nextName || WOMEN_DUPATTA_NAME_REGEX.test(nextName))
      ) {
        nextName = "Stole";
      }
    } else if (g === "women") {
      if (nextPiece === "shirt_men") return;
      if (nextPiece === "kurta_men") {
        nextPiece = "kurta";
        if (!nextName || /^inner\s*kurta$|^kurta\s*\(men\)$/i.test(nextName)) {
          nextName = "Kurta";
        }
      } else if (nextPiece === "pant_men") {
        nextPiece = "sharara";
        nextName = "Pants / Palazzo";
      }
      if (nextPiece === "sherwani" && !isIndoWestern) return;
      if (nextPiece === "dupatta" && /^stole$/i.test(nextName)) {
        nextName = "Dupatta";
      }
    }

    if (!validIds.has(nextPiece) || seenPieces.has(nextPiece)) return;
    seenPieces.add(nextPiece);
    out.push({ piece: nextPiece, name: nextName || getMasterPieceDef(nextPiece, source).name });
  };

  for (const token of tokens) {
    const entries = lookupCategoryMapEntry(
      mergedMap,
      token.toLowerCase(),
      genderLower,
    );
    if (!Array.isArray(entries)) continue;
    for (const item of entries) {
      pushAdapted(item);
    }
  }

  if (g === "men" && out.length < 2) {
    for (const fb of MEN_FALLBACK_ADD_OPTIONS) {
      pushAdapted(fb);
    }
  } else if (g === "women" && out.length === 0) {
    for (const fb of WOMEN_FALLBACK_ADD_OPTIONS) {
      pushAdapted(fb);
    }
  }

  return out;
};

export const getDisplayKindLabel = (
  pieceId: string,
  category?: string,
  gender?: string,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
): string => {
  const catLower = String(category || "").toLowerCase();
  const g = normalizeSizeFitGender(gender, category);
  const isMenswear = g === "men";

  if (isMenswear) {
    if (pieceId === "kurta_men" || pieceId === "kurta") return "Kurta (Men)";
    if (pieceId === "shirt_men") return "Shirt (Men)";
    if (pieceId === "pant_men" || pieceId === "sharara") return "Pant / Trousers";
    if (pieceId === "dupatta") return "Stole";
    if (pieceId === "churidar") return "Churidar / Pyjama";
    if (pieceId === "sherwani") {
      return catLower.includes("bandhgala")
        ? "Bandhgala / Jacket"
        : "Sherwani / Jacket";
    }
  } else if (g === "women") {
    if (pieceId === "dupatta") return "Dupatta";
    if (pieceId === "kurta_men" || pieceId === "kurta" || pieceId === "shirt_men") {
      return "Kurta, anarkali or gown";
    }
    if (pieceId === "pant_men") return "Sharara, palazzo or pants";
  }

  const def = getMasterPieceDef(pieceId, masterPiecesList);
  return def.name;
};

export interface SizeChartRow {
  size: string;
  bust?: number;
  chest?: number;
  waist?: number;
  hips?: number;
}

export interface SizeGuideDef {
  id: "womens_sets" | "saree_blouse" | "menswear";
  label: string;
  allow: number;
  rows: SizeChartRow[];
}

export const SIZE_GUIDES: Record<SizeGuideDef["id"], SizeGuideDef> = {
  womens_sets: {
    id: "womens_sets",
    label: "Women's sets guide",
    allow: 1.5,
    rows: [
      { size: "XS", bust: 32, waist: 26, hips: 35 },
      { size: "S", bust: 34, waist: 28, hips: 37 },
      { size: "M", bust: 36, waist: 30, hips: 39 },
      { size: "L", bust: 38, waist: 32, hips: 41 },
      { size: "XL", bust: 40, waist: 34, hips: 43 },
      { size: "XXL", bust: 42, waist: 36, hips: 45 },
    ],
  },
  saree_blouse: {
    id: "saree_blouse",
    label: "Saree & blouse guide",
    allow: 1.5,
    rows: [
      { size: "32", bust: 32 },
      { size: "34", bust: 34 },
      { size: "36", bust: 36 },
      { size: "38", bust: 38 },
      { size: "40", bust: 40 },
      { size: "42", bust: 42 },
      { size: "44", bust: 44 },
    ],
  },
  menswear: {
    id: "menswear",
    label: "Menswear guide",
    allow: 2,
    rows: [
      { size: "S (36)", chest: 36 },
      { size: "M (38)", chest: 38 },
      { size: "L (40)", chest: 40 },
      { size: "XL (42)", chest: 42 },
      { size: "XXL (44)", chest: 44 },
      { size: "3XL (46)", chest: 46 },
    ],
  },
};

export const createEmptySetPiece = (
  pieceId: string,
  displayName?: string,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
): GarmentSetPiece => {
  const def = getMasterPieceDef(pieceId, masterPiecesList);
  return {
    uid: `${pieceId}_${Math.random().toString(36).slice(2, 8)}`,
    piece: def.id,
    name: displayName || def.name,
    m: {},
    d: {},
  };
};

export const getDefaultSetForCategory = (
  category?: string,
  gender?: string,
): GarmentSetPiece[] => {
  const cat = String(category || "").toLowerCase();
  const g = normalizeSizeFitGender(gender, category);

  if (g === "men") {
    if (cat.includes("sherwani")) {
      return [
        createEmptySetPiece("sherwani", "Sherwani"),
        createEmptySetPiece("churidar", "Churidar"),
        createEmptySetPiece("dupatta", "Stole"),
      ];
    }
    if (cat.includes("bandhgala")) {
      return [
        createEmptySetPiece("sherwani", "Bandhgala"),
        createEmptySetPiece("pant_men", "Trousers"),
      ];
    }
    if (cat.includes("nehru")) {
      return [createEmptySetPiece("sherwani", "Nehru jacket")];
    }
    if (/\b(shirt|shirts)\b/.test(cat)) {
      return [createEmptySetPiece("shirt_men", "Shirt")];
    }
    if (/\b(pant|pants|trouser|trousers)\b/.test(cat)) {
      return [createEmptySetPiece("pant_men", "Pant / Trousers")];
    }
    if (cat.includes("indo-western") || cat.includes("indo western")) {
      return [
        createEmptySetPiece("sherwani", "Jacket"),
        createEmptySetPiece("pant_men", "Trousers"),
      ];
    }
    if (cat.includes("kurta")) {
      return [
        createEmptySetPiece("kurta_men", "Kurta"),
        createEmptySetPiece("churidar", "Pyjama"),
      ];
    }
    if (cat.includes("cape")) {
      return [createEmptySetPiece("cape", "Cape")];
    }
    return [
      createEmptySetPiece("kurta_men", "Kurta"),
      createEmptySetPiece("pant_men", "Pant / Trousers"),
    ];
  }

  if (cat.includes("saree") || cat.includes("sari")) {
    return [
      createEmptySetPiece("blouse", "Blouse"),
      createEmptySetPiece("saree_drape", "Saree drape"),
    ];
  }
  if (cat.includes("indo-western") || cat.includes("indo western")) {
    return [
      createEmptySetPiece("blouse", "Blouse / Crop top"),
      createEmptySetPiece("sharara", "Pants / Palazzo"),
      createEmptySetPiece("dupatta", "Drape"),
    ];
  }
  if (cat.includes("sharara") || cat.includes("gharara")) {
    return [
      createEmptySetPiece("kurta", "Kurta"),
      createEmptySetPiece("sharara", "Sharara"),
      createEmptySetPiece("dupatta", "Dupatta"),
    ];
  }
  if (cat.includes("anarkali")) {
    return [
      createEmptySetPiece("kurta", "Anarkali"),
      createEmptySetPiece("churidar", "Churidar"),
      createEmptySetPiece("dupatta", "Dupatta"),
    ];
  }
  if (cat.includes("kurta")) {
    return [
      createEmptySetPiece("kurta", "Kurta"),
      createEmptySetPiece("sharara", "Pants"),
      createEmptySetPiece("dupatta", "Dupatta"),
    ];
  }
  if (cat.includes("gown")) {
    return [createEmptySetPiece("kurta", "Gown")];
  }
  if (cat.includes("cape")) {
    return [createEmptySetPiece("cape", "Cape")];
  }

  // Default & Bridal Lehenga / Lehenga
  return [
    createEmptySetPiece("blouse", "Blouse"),
    createEmptySetPiece("lehenga_skirt", "Lehenga"),
    createEmptySetPiece("dupatta", "Dupatta"),
  ];
};

export const adaptSetForGender = (
  set: GarmentSetPiece[],
  gender?: string,
  category?: string,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
): GarmentSetPiece[] => {
  if (!Array.isArray(set) || set.length === 0) {
    return getDefaultSetForCategory(category, gender);
  }
  const g = normalizeSizeFitGender(gender, category);
  if (g === "unisex") {
    return set.map((item, idx) => ({
      uid: item.uid || `${item.piece || "piece"}_${idx}`,
      piece: item.piece || "kurta",
      name: item.name || getMasterPieceDef(item.piece, masterPiecesList).name,
      m: { ...(item.m || {}) },
      d: { ...(item.d || {}) },
    }));
  }

  const out: GarmentSetPiece[] = [];
  const seenPieceIds = new Set<string>();

  for (let idx = 0; idx < set.length; idx += 1) {
    const item = set[idx];
    let nextPiece = String(item?.piece || "kurta").trim();
    let nextName = String(item?.name || "").trim();
    const nextM: Record<string, GarmentMeasurementValue> = {};
    for (const [k, mv] of Object.entries(item?.m || {})) {
      if (mv && typeof mv === "object") nextM[k] = { ...mv };
    }
    const nextD: GarmentPieceDetails = { ...(item?.d || {}) };

    if (g === "men") {
      if (WOMEN_ONLY_PIECE_IDS.has(nextPiece)) {
        continue;
      }
      if (nextPiece === "kurta") {
        nextPiece = "kurta_men";
        if (!nextName || WOMEN_ONLY_DEFAULT_NAME_REGEX.test(nextName)) {
          nextName = "Kurta";
        }
      } else if (nextPiece === "sharara") {
        nextPiece = "pant_men";
        if (!nextName || WOMEN_BOTTOM_NAME_REGEX.test(nextName)) {
          nextName = "Pant / Trousers";
        }
      } else if (
        nextPiece === "dupatta" &&
        (!nextName || WOMEN_DUPATTA_NAME_REGEX.test(nextName))
      ) {
        nextName = "Stole";
      }

      delete nextD.padded;
      delete nextD.cancan;
      const sanitizedClosure = adaptClosureForGender(nextD.closure, "Men", category);
      if (sanitizedClosure) nextD.closure = sanitizedClosure;
      else delete nextD.closure;

      const hasChestVal =
        parseNumericMeasure(nextM.chest?.v) !== null ||
        parseNumericMeasure(nextM.chest?.open) !== null ||
        parseNumericMeasure(nextM.chest?.take) !== null;
      if (!hasChestVal && nextM.bust) {
        nextM.chest = { ...nextM.bust };
      }
      for (const wk of WOMEN_ONLY_MEASURE_KEYS) {
        delete nextM[wk];
      }
    } else if (g === "women") {
      if (nextPiece === "shirt_men") {
        continue;
      }
      if (nextPiece === "kurta_men") {
        nextPiece = "kurta";
        if (!nextName || /^kurta\s*\(men\)$|^inner\s*kurta$/i.test(nextName)) {
          nextName = "Kurta";
        }
      } else if (nextPiece === "pant_men") {
        nextPiece = "sharara";
        if (!nextName || /^pant/i.test(nextName) || /^trouser/i.test(nextName)) {
          nextName = "Pants / Palazzo";
        }
      } else if (nextPiece === "dupatta" && /^stole$/i.test(nextName)) {
        nextName = "Dupatta";
      }

      const sanitizedClosure = adaptClosureForGender(
        nextD.closure,
        "Women",
        category,
      );
      if (sanitizedClosure) nextD.closure = sanitizedClosure;
      else delete nextD.closure;

      const hasBustVal =
        parseNumericMeasure(nextM.bust?.v) !== null ||
        parseNumericMeasure(nextM.bust?.open) !== null ||
        parseNumericMeasure(nextM.bust?.take) !== null;
      if (!hasBustVal && nextM.chest) {
        nextM.bust = { ...nextM.chest };
      }
      for (const mk of MEN_ONLY_MEASURE_KEYS) {
        delete nextM[mk];
      }
    }

    if (seenPieceIds.has(nextPiece)) continue;
    seenPieceIds.add(nextPiece);

    const def = getGenderAwarePieceDef(
      nextPiece,
      gender,
      category,
      masterPiecesList,
    );
    out.push({
      uid: item?.uid || `${nextPiece}_${idx}`,
      piece: nextPiece,
      name: nextName || def.name,
      m: nextM,
      d: nextD,
    });
  }

  return out.length > 0 ? out : getDefaultSetForCategory(category, gender);
};

export const parseNumericMeasure = (raw?: string | number | null): number | null => {
  if (raw === undefined || raw === null) return null;
  const cleaned = String(raw).replace(/[^0-9.]/g, "").trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0 ? num : null;
};

export const inchesToCmLabel = (raw?: string | number | null): string => {
  const num = parseNumericMeasure(raw);
  if (num === null) return "";
  return `${Math.round(num * 2.54)} cm`;
};

export const hasAnyMeasurementValue = (set?: GarmentSetPiece[]): boolean => {
  if (!Array.isArray(set) || set.length === 0) return false;
  return set.some((piece) =>
    Object.values(piece?.m || {}).some(
      (mv) =>
        parseNumericMeasure(mv?.v) !== null ||
        parseNumericMeasure(mv?.open) !== null ||
        parseNumericMeasure(mv?.take) !== null,
    ),
  );
};

export const hydrateSizeFitSetFromProduct = (
  product: Partial<Product>,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
): GarmentSetPiece[] => {
  const explicitGender = String((product as any)?.gender || "").trim();
  const explicitLower = explicitGender.toLowerCase();
  const isExplicitMenOrWomen = [
    "men",
    "man",
    "male",
    "women",
    "woman",
    "female",
  ].includes(explicitLower);

  if (Array.isArray(product?.set) && product.set.length > 0) {
    const mapped = product.set.map((item, idx) => ({
      uid: item.uid || `${item.piece || "piece"}_${idx}`,
      piece: item.piece || "blouse",
      name:
        item.name ||
        getMasterPieceDef(item.piece, masterPiecesList).name,
      m: { ...(item.m || {}) },
      d: { ...(item.d || {}) },
    }));
    return isExplicitMenOrWomen
      ? adaptSetForGender(
          mapped,
          explicitGender,
          product?.category,
          masterPiecesList,
        )
      : mapped;
  }

  const baseSet = getDefaultSetForCategory(
    product?.category,
    (product as any)?.gender,
  );
  const legacy = product?.measurements || {};
  const legacyBust = String(legacy.bust || "").trim();
  const legacyWaist = String(legacy.waist || "").trim();
  const legacyHips = String(legacy.hips || "").trim();
  const legacyLength = String(legacy.length || "").trim();

  if (legacyBust || legacyWaist || legacyHips || legacyLength) {
    for (const item of baseSet) {
      const def = getGenderAwarePieceDef(
        item.piece,
        (product as any)?.gender,
        product?.category,
        masterPiecesList,
      );
      if (legacyBust && def.measures.some((m) => m.k === "bust") && !item.m.bust?.v) {
        item.m.bust = { ...(item.m.bust || {}), v: legacyBust };
      }
      if (
        legacyBust &&
        def.measures.some((m) => m.k === "chest") &&
        !item.m.chest?.v
      ) {
        item.m.chest = { ...(item.m.chest || {}), v: legacyBust };
      }
      if (
        legacyWaist &&
        def.measures.some((m) => m.role === "waist") &&
        !item.m.waist?.v
      ) {
        item.m.waist = { ...(item.m.waist || {}), v: legacyWaist };
      }
      if (
        legacyHips &&
        def.measures.some((m) => m.role === "hips") &&
        !item.m.hips?.v
      ) {
        item.m.hips = { ...(item.m.hips || {}), v: legacyHips };
      }
      if (
        legacyLength &&
        def.measures.some((m) => m.k === "length" && m.unit === "in") &&
        !item.m.length?.v
      ) {
        item.m.length = { ...(item.m.length || {}), v: legacyLength };
      }
    }
  }

  return baseSet;
};

export const resolveSizeGuide = (
  category?: string,
  gender?: string,
  set: GarmentSetPiece[] = [],
  guidesMap: Record<SizeGuideDef["id"], SizeGuideDef> = SIZE_GUIDES,
): SizeGuideDef => {
  const cat = String(category || "").toLowerCase();
  const gLower = String(gender || "").trim().toLowerCase();

  if (["men", "man", "male"].includes(gLower)) {
    return guidesMap.menswear || SIZE_GUIDES.menswear;
  }
  if (["women", "woman", "female"].includes(gLower)) {
    if (
      cat.includes("saree") ||
      cat.includes("sari") ||
      set.some((p) => p.piece === "saree_drape")
    ) {
      return guidesMap.saree_blouse || SIZE_GUIDES.saree_blouse;
    }
    return guidesMap.womens_sets || SIZE_GUIDES.womens_sets;
  }

  const isMen =
    cat.includes("sherwani") ||
    cat.includes("bandhgala") ||
    cat.includes("nehru") ||
    set.some((p) => p.piece === "sherwani" || p.piece === "kurta_men");

  if (isMen) return guidesMap.menswear || SIZE_GUIDES.menswear;
  if (
    cat.includes("saree") ||
    cat.includes("sari") ||
    set.some((p) => p.piece === "saree_drape")
  ) {
    return guidesMap.saree_blouse || SIZE_GUIDES.saree_blouse;
  }
  return guidesMap.womens_sets || SIZE_GUIDES.womens_sets;
};

export interface HeadlineMeasurePreview {
  key: "bust" | "waist" | "hips" | "length";
  label: string;
  valueText: string;
  subText: string;
}

export interface PiecePreviewRow {
  label: string;
  valueText: string;
}

export interface PiecePreview {
  name: string;
  kindName: string;
  detailsParts: string[];
  rows: PiecePreviewRow[];
}

export interface SizeFitSummary {
  isMeasured: boolean;
  fitsLikeText: string;
  blouseNumberText: string;
  headerBadgeText: string;
  guideId: SizeGuideDef["id"];
  guideLabel: string;
  decidingLegend: string;
  headlines: HeadlineMeasurePreview[];
  piecePreviews: PiecePreview[];
  heightDisplayText: string;
  fitNotesText: string;
  filterSizes: string[];
  filterNote: string;
  setNamesLine: string;
}

interface RoleMeasurementHit {
  pieceName: string;
  val: number;
  min: number;
  max: number;
  open?: number | null;
  take?: number | null;
  hasAdjustableClosure: boolean;
}

const buildHitFromMeasure = (
  piece: GarmentSetPiece,
  def: MasterGarmentPiece,
  measureDef?: MasterMeasurementDef,
): RoleMeasurementHit | null => {
  if (!measureDef) return null;
  const mv = piece.m?.[measureDef.k];
  const baseVal = parseNumericMeasure(mv?.v);
  if (baseVal === null) return null;
  const openVal = parseNumericMeasure(mv?.open);
  const takeVal = parseNumericMeasure(mv?.take);
  const min = takeVal !== null ? Math.min(baseVal, takeVal) : baseVal;
  const max = openVal !== null ? Math.max(baseVal, openVal) : baseVal;
  const closureLower = String(piece.d?.closure || "").trim().toLowerCase();
  return {
    pieceName: piece.name || def.name,
    val: baseVal,
    min,
    max,
    open: openVal,
    take: takeVal,
    hasAdjustableClosure: ADJUSTABLE_CLOSURES.has(closureLower),
  };
};

const findRoleMeasurement = (
  set: GarmentSetPiece[],
  targetRole: Exclude<MeasurementRole, null>,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
  gender?: string,
  category?: string,
): RoleMeasurementHit | null => {
  for (const piece of set) {
    const def = getGenderAwarePieceDef(
      piece.piece,
      gender,
      category,
      masterPiecesList,
    );
    const hit = buildHitFromMeasure(
      piece,
      def,
      def.measures.find((m) => m.role === targetRole),
    );
    if (hit) return hit;
  }
  return null;
};

const findKeyMeasurement = (
  set: GarmentSetPiece[],
  targetKey: string,
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
  gender?: string,
  category?: string,
): RoleMeasurementHit | null => {
  for (const piece of set) {
    const def = getGenderAwarePieceDef(
      piece.piece,
      gender,
      category,
      masterPiecesList,
    );
    const hit = buildHitFromMeasure(
      piece,
      def,
      def.measures.find((m) => m.k === targetKey),
    );
    if (hit) return hit;
  }
  return null;
};

const formatRoleRoomNote = (hit: RoleMeasurementHit): string => {
  const parts: string[] = [hit.pieceName];
  if (hit.open !== null && hit.open !== undefined) {
    parts.push(`opens to ${hit.open}"`);
  }
  if (hit.take !== null && hit.take !== undefined) {
    parts.push(`takes in to ${hit.take}"`);
  }
  return parts.join(" · ");
};

const findLongestInLength = (
  set: GarmentSetPiece[],
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
  gender?: string,
  category?: string,
): { pieceName: string; lbl: string; val: number } | null => {
  let best: { pieceName: string; lbl: string; val: number } | null = null;
  for (const piece of set) {
    const def = getGenderAwarePieceDef(
      piece.piece,
      gender,
      category,
      masterPiecesList,
    );
    for (const mDef of def.measures) {
      if (mDef.unit !== "in") continue;
      if (mDef.k !== "length" && mDef.k !== "blouseLength") continue;
      const val = parseNumericMeasure(piece.m?.[mDef.k]?.v);
      if (val === null) continue;
      if (!best || val > best.val) {
        best = {
          pieceName: piece.name || def.name,
          lbl: mDef.lbl,
          val,
        };
      }
    }
  }
  return best;
};

const buildPiecePreviews = (
  set: GarmentSetPiece[],
  masterPiecesList: MasterGarmentPiece[] = MASTER_GARMENT_PIECES,
  gender?: string,
  category?: string,
): PiecePreview[] => {
  const previews: PiecePreview[] = [];
  for (const piece of set) {
    const def = getGenderAwarePieceDef(
      piece.piece,
      gender,
      category,
      masterPiecesList,
    );
    const kindName = getDisplayKindLabel(
      piece.piece,
      category,
      gender,
      masterPiecesList,
    );
    const detailsParts: string[] = [];
    if (def.details.includes("padded") && piece.d?.padded?.trim()) {
      detailsParts.push(`Padded: ${piece.d.padded.trim()}`);
    }
    if (def.details.includes("cancan") && piece.d?.cancan?.trim()) {
      detailsParts.push(`Can-can: ${piece.d.cancan.trim()}`);
    }
    const sanitizedClosure = adaptClosureForGender(
      piece.d?.closure,
      gender,
      category,
    );
    if (def.details.includes("closure") && sanitizedClosure) {
      detailsParts.push(`Closure: ${sanitizedClosure}`);
    }

    const rows: PiecePreviewRow[] = [];
    for (const mDef of def.measures) {
      const mv = piece.m?.[mDef.k];
      const vNum = parseNumericMeasure(mv?.v);
      const openNum = parseNumericMeasure(mv?.open);
      const takeNum = parseNumericMeasure(mv?.take);
      if (vNum === null && openNum === null && takeNum === null) continue;

      const unitSuffix = mDef.unit === "m" ? " m" : '"';
      const segs: string[] = [];
      if (vNum !== null) {
        const cmNote = mDef.unit === "in" ? ` (${inchesToCmLabel(vNum)})` : "";
        segs.push(`${vNum}${unitSuffix}${cmNote}`);
      }
      if (openNum !== null) {
        segs.push(`opens to ${openNum}${unitSuffix}`);
      }
      if (takeNum !== null) {
        segs.push(`takes in to ${takeNum}${unitSuffix}`);
      }
      rows.push({
        label: mDef.lbl,
        valueText: segs.join(" · "),
      });
    }

    if (detailsParts.length > 0 || rows.length > 0) {
      previews.push({
        name: piece.name || kindName || def.name,
        kindName,
        detailsParts,
        rows,
      });
    }
  }
  return previews;
};

const rangeMatchesBody = (
  hit: RoleMeasurementHit,
  bodyTarget: number,
  allow: number,
): boolean => {
  const effectiveMin = hit.hasAdjustableClosure
    ? Math.max(0, hit.min - 2)
    : hit.min;
  return effectiveMin <= bodyTarget + allow && hit.max >= bodyTarget;
};

export const computeSizeFitSummary = (
  set: GarmentSetPiece[],
  options: {
    category?: string;
    gender?: string;
    ownerSize?: string;
    designerLabel?: string;
    fitDesc?: string;
    fitNote?: string;
    measuredBy?: string;
    measuredOn?: string;
    heightFrom?: string;
    heightTo?: string;
    bestSuitedForHeight?: string;
    fitNotes?: string;
    masterPieces?: MasterGarmentPiece[];
    sizeGuides?: Record<SizeGuideDef["id"], SizeGuideDef>;
  } = {},
): SizeFitSummary => {
  const masterList =
    Array.isArray(options.masterPieces) && options.masterPieces.length > 0
      ? options.masterPieces
      : MASTER_GARMENT_PIECES;
  const guide = resolveSizeGuide(
    options.category,
    options.gender,
    set,
    options.sizeGuides || SIZE_GUIDES,
  );
  const bustHit = findRoleMeasurement(
    set,
    "bust",
    masterList,
    options.gender,
    options.category,
  );
  const chestHit = findRoleMeasurement(
    set,
    "chest",
    masterList,
    options.gender,
    options.category,
  );
  const waistHit = findRoleMeasurement(
    set,
    "waist",
    masterList,
    options.gender,
    options.category,
  );
  const hipsHit = findRoleMeasurement(
    set,
    "hips",
    masterList,
    options.gender,
    options.category,
  );
  const headlineBustOrChestHit =
    (guide.id === "menswear" ? chestHit : bustHit) ||
    findKeyMeasurement(
      set,
      guide.id === "menswear" ? "chest" : "bust",
      masterList,
      options.gender,
      options.category,
    );
  const headlineWaistHit =
    waistHit ||
    findKeyMeasurement(
      set,
      "waist",
      masterList,
      options.gender,
      options.category,
    );
  const headlineHipsHit =
    hipsHit ||
    findKeyMeasurement(
      set,
      "hips",
      masterList,
      options.gender,
      options.category,
    );
  const longestLen = findLongestInLength(
    set,
    masterList,
    options.gender,
    options.category,
  );

  const primaryBustOrChest = guide.id === "menswear" ? chestHit : bustHit;
  const hasAny = hasAnyMeasurementValue(set);

  const canComputeFitsLike =
    guide.id === "womens_sets"
      ? Boolean(bustHit && waistHit)
      : guide.id === "saree_blouse"
        ? Boolean(bustHit)
        : Boolean(chestHit);

  let fitsLikeText = "";
  let blouseNumberText = "";
  let filterSizes: string[] = [];

  if (canComputeFitsLike) {
    const passingRows = guide.rows.filter((row) => {
      if (guide.id === "womens_sets") {
        if (!bustHit || !waistHit || !row.bust || !row.waist) return false;
        const bustOk = rangeMatchesBody(bustHit, row.bust, guide.allow);
        const waistOk = rangeMatchesBody(waistHit, row.waist, guide.allow);
        if (!bustOk || !waistOk) return false;
        if (hipsHit && row.hips) {
          const effectiveHips = hipsHit.max;
          if (effectiveHips < row.hips - 1) return false;
        }
        return true;
      }
      if (guide.id === "saree_blouse") {
        return Boolean(bustHit && row.bust && rangeMatchesBody(bustHit, row.bust, guide.allow));
      }
      return Boolean(chestHit && row.chest && rangeMatchesBody(chestHit, row.chest, guide.allow));
    });

    if (passingRows.length > 0) {
      filterSizes = passingRows.map((r) => r.size);
      fitsLikeText =
        passingRows.length === 1
          ? passingRows[0].size
          : `${passingRows[0].size} to ${passingRows[passingRows.length - 1].size}`;

      const hasBlousePiece = set.some((p) => p.piece === "blouse");
      if (guide.id === "womens_sets" && hasBlousePiece) {
        const minBust = passingRows[0].bust;
        const maxBust = passingRows[passingRows.length - 1].bust;
        if (minBust && maxBust) {
          blouseNumberText =
            minBust === maxBust ? `Blouse ${minBust}` : `Blouse ${minBust} to ${maxBust}`;
        }
      }
    } else {
      // Closest size fallback
      let closestRow = guide.rows[0];
      let bestDist = Infinity;
      for (const row of guide.rows) {
        const target = guide.id === "menswear" ? row.chest || 0 : row.bust || 0;
        const actual = primaryBustOrChest ? primaryBustOrChest.val : target;
        let dist = Math.abs(actual - target);
        if (guide.id === "womens_sets" && waistHit && row.waist) {
          dist += Math.abs(waistHit.val - row.waist);
        }
        if (dist < bestDist) {
          bestDist = dist;
          closestRow = row;
        }
      }
      fitsLikeText = `Closest to ${closestRow.size}`;
      filterSizes = [closestRow.size];
    }
  } else if (!hasAny) {
    const cleanOwner = String(options.ownerSize || "").trim();
    if (cleanOwner) {
      fitsLikeText = cleanOwner;
      filterSizes = [cleanOwner];
    } else {
      fitsLikeText = "";
      filterSizes = [];
    }
  }

  const headlines: HeadlineMeasurePreview[] = [];
  if (headlineBustOrChestHit) {
    headlines.push({
      key: "bust",
      label: guide.id === "menswear" ? "CHEST" : "BUST",
      valueText: `${headlineBustOrChestHit.val}"`,
      subText: formatRoleRoomNote(headlineBustOrChestHit),
    });
  }
  if (headlineWaistHit) {
    headlines.push({
      key: "waist",
      label: "WAIST",
      valueText: `${headlineWaistHit.val}"`,
      subText: formatRoleRoomNote(headlineWaistHit),
    });
  }
  if (headlineHipsHit) {
    headlines.push({
      key: "hips",
      label: "HIPS",
      valueText: `${headlineHipsHit.val}"`,
      subText: formatRoleRoomNote(headlineHipsHit),
    });
  }
  if (longestLen) {
    const shortLenLabel = longestLen.lbl.toLowerCase().includes("waist to hem")
      ? `${longestLen.pieceName}, waist to hem`
      : longestLen.lbl.toLowerCase().includes("blouse")
        ? `${longestLen.pieceName}, blouse`
        : `${longestLen.pieceName}, ${longestLen.lbl.toLowerCase()}`;
    headlines.push({
      key: "length",
      label: "LENGTH",
      valueText: `${longestLen.val}"`,
      subText: shortLenLabel,
    });
  }

  const measuredByShort = String(options.measuredBy || "").startsWith("The owner")
    ? "owner (to verify)"
    : "the HOK team";
  const datePart = options.measuredOn ? `, ${options.measuredOn}` : "";

  let headerBadgeText =
    guide.id === "menswear"
      ? "Standard menswear size · optional tape measurements"
      : "Measurements pending";
  if (hasAny) {
    if (fitsLikeText) {
      const blousePart = blouseNumberText ? ` · ${blouseNumberText.toLowerCase()}` : "";
      headerBadgeText = `Fits like ${fitsLikeText}${blousePart} · measured by ${measuredByShort}${datePart}`;
    } else {
      headerBadgeText = `Measured by ${measuredByShort}${datePart} · add deciding measurements for Fits like`;
    }
  } else if (options.ownerSize) {
    headerBadgeText =
      guide.id === "menswear"
        ? `Menswear size ${options.ownerSize}`
        : `Measurements pending · owner says ${options.ownerSize}`;
  }

  const filterNote =
    filterSizes.length === 0
      ? guide.id === "menswear"
        ? "Select a standard menswear size or enter chest measurement so the size filter can find this piece."
        : "Without measurements or owner's word, the size filter cannot find this piece."
      : hasAny
        ? `The size filter finds it under ${
            filterSizes.length === 1
              ? filterSizes[0]
              : `${filterSizes.slice(0, -1).join(", ")} and ${filterSizes[filterSizes.length - 1]}`
          }.`
        : guide.id === "menswear"
          ? `The size filter finds it under ${filterSizes[0]}.`
          : `The size filter finds it under ${filterSizes[0]}, on its owner's word.`;

  const decidingLegend =
    guide.id === "menswear"
      ? `Decides Fits like: chest against the Menswear guide (${guide.allow} in allowance). Every other measurement is printed for him to check. Blank boxes never show on the site.`
      : guide.id === "saree_blouse"
        ? `Decides Fits like: blouse bust against the Saree & blouse guide (${guide.allow} in allowance). Every other measurement is printed for her to check. Blank boxes never show on the site.`
        : `Decides Fits like: bust and waist, and hips when given, against the Women's sets guide. Every other measurement is printed for her to check. Blank boxes never show on the site.`;

  const piecePreviews = buildPiecePreviews(
    set,
    masterList,
    options.gender,
    options.category,
  );
  const hFrom = String(options.heightFrom || "").trim();
  const hTo = String(options.heightTo || "").trim();
  const heightDisplayText =
    hFrom && hTo
      ? `${hFrom} to ${hTo}`
      : hFrom
        ? `${hFrom}+`
        : hTo
          ? `Up to ${hTo}`
          : String(options.bestSuitedForHeight || "").trim();
  const fitNotesText = String(options.fitNotes || "").trim();

  return {
    isMeasured: hasAny,
    fitsLikeText,
    blouseNumberText,
    headerBadgeText,
    guideId: guide.id,
    guideLabel: guide.label,
    decidingLegend,
    headlines,
    piecePreviews,
    heightDisplayText,
    fitNotesText,
    filterSizes,
    filterNote,
    setNamesLine: set
      .map((p) => {
        const gDef = getGenderAwarePieceDef(
          p.piece,
          options.gender,
          options.category,
          masterList,
        );
        return p.name || getDisplayKindLabel(p.piece, options.category, options.gender, masterList) || gDef.name;
      })
      .join(" · "),
  };
};

export const deriveLegacyMeasurementsFromSet = (
  set: GarmentSetPiece[],
  heightFrom?: string,
  heightTo?: string,
  gender?: string,
  category?: string,
) => {
  const bustHit =
    findRoleMeasurement(
      set,
      "bust",
      MASTER_GARMENT_PIECES,
      gender,
      category,
    ) ||
    findRoleMeasurement(
      set,
      "chest",
      MASTER_GARMENT_PIECES,
      gender,
      category,
    );
  const waistHit = findRoleMeasurement(
    set,
    "waist",
    MASTER_GARMENT_PIECES,
    gender,
    category,
  );
  const hipsHit = findRoleMeasurement(
    set,
    "hips",
    MASTER_GARMENT_PIECES,
    gender,
    category,
  );
  const lenHit = findLongestInLength(
    set,
    MASTER_GARMENT_PIECES,
    gender,
    category,
  );

  const bust = bustHit ? String(bustHit.val) : "";
  const waist = waistHit ? String(waistHit.val) : "";
  const hips = hipsHit ? String(hipsHit.val) : "";
  const length = lenHit ? String(lenHit.val) : "";

  const measurements = { bust, waist, hips, length };
  const measurementsCm = {
    bust: bust ? String(Math.round(Number(bust) * 2.54)) : "",
    waist: waist ? String(Math.round(Number(waist) * 2.54)) : "",
    hips: hips ? String(Math.round(Number(hips) * 2.54)) : "",
    length: length ? String(Math.round(Number(length) * 2.54)) : "",
  };

  const g = normalizeSizeFitGender(gender, category);
  let bestSuitedForHeight = "";
  const fromClean = String(heightFrom || "").trim();
  const toClean = String(heightTo || "").trim();
  if (fromClean && toClean) {
    bestSuitedForHeight =
      g === "women"
        ? `${fromClean} to ${toClean} in heels`
        : `${fromClean} to ${toClean}`;
  } else if (fromClean || toClean) {
    bestSuitedForHeight =
      g === "women"
        ? `${fromClean || toClean} in heels`
        : `${fromClean || toClean}`;
  }

  return { measurements, measurementsCm, bestSuitedForHeight };
};

export const formatMeasuredDateToday = (): string => {
  try {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};
