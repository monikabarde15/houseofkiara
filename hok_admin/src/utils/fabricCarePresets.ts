export interface FabricCarePreset {
  id: string;
  label: string;
  instructions: string[];
}

export const FABRIC_CARE_PRESETS: FabricCarePreset[] = [
  {
    id: "silk-pure",
    label: "Silk & Pure Silk (Banarasi, Kanjivaram, Raw Silk)",
    instructions: [
      "Specialist dry clean only; never wash with water or home detergents",
      "Steam lightly from the reverse side using low heat — never press directly on zari or silk weave",
      "Store in breathable unbleached muslin away from direct sunlight and dampness",
      "Keep perfume, hairspray, and haldi/sindoor well away from raw silk and metallic weave",
    ],
  },
  {
    id: "silk-organza-tissue",
    label: "Silk Organza & Tissue",
    instructions: [
      "Delicate hydrocarbon dry clean only — zero wringing, soaking, or twisting",
      "Always wear jewellery after dressing so clasps never pull fine organza threads",
      "Hang on a padded hanger with acid-free tissue between folds to prevent crinkle tears",
      "Avoid direct steam nozzles or hot irons; vertical mist steam gently from a safe distance",
    ],
  },
  {
    id: "velvet-brocade",
    label: "Velvet & Brocade",
    instructions: [
      "Specialist dry clean only; avoid water spotting which flattens velvet pile permanently",
      "Steam gently from the inside only — never place a flat iron directly on velvet nap",
      "Hang padded at waist and shoulders rather than folding tightly to avoid crush marks",
      "Brush lightly along the grain with a soft garment brush before storage",
    ],
  },
  {
    id: "georgette-chiffon-crepe",
    label: "Georgette, Chiffon & Crepe",
    instructions: [
      "Dry clean only to preserve drape, bias fall, and pleat tension",
      "Pin dupattas or pallus strictly through the plain border or lining, never through sheer body",
      "Low-temperature steam while hanging; avoid pulling stitched seams while warm",
      "Keep away from sharp jewellery, rough handbags, and velcro edges",
    ],
  },
  {
    id: "net-embroidered-couture",
    label: "Net, Tulle & Heavy Embroidery (Zardozi / Sequin / Mirror)",
    instructions: [
      "Couture specialist spot & solvent dry clean only — handle beaded panels by lining weight",
      "Never rub stains, stretch tulle panels, or iron over sequins, dabka, or mirror work",
      "Fold flat with butter paper or muslin between embroidered layers to prevent snagging",
      "Support skirt weight by inner hanging loops so delicate net shoulders do not stretch",
    ],
  },
  {
    id: "chanderi-cotton-silk",
    label: "Chanderi, Maheshwari & Cotton Silk",
    instructions: [
      "Gentle dry clean recommended to protect sheen and handwoven zari borders",
      "Low to medium press on the reverse side with a thin cotton press cloth",
      "Air out in shade after wear and refold along alternating lines every few months",
      "Store with wrapped neem or cedar away from direct contact with the fabric",
    ],
  },
  {
    id: "linen-cotton-handloom",
    label: "Linen, Cotton & Handloom Weaves",
    instructions: [
      "Soft dry clean or cool delicate wash recommended for dyed and block-printed weaves",
      "Steam or warm press while slightly damp on the reverse side",
      "Dry strictly in shade to prevent natural dye fading",
      "Store loosely folded in cool, ventilated cotton bags",
    ],
  },
  {
    id: "satin-taffeta-gown",
    label: "Satin, Taffeta & Structured Gowns",
    instructions: [
      "Professional dry clean only to retain bodice boning, structure, and satin lustre",
      "Avoid spot-wiping water drops on satin or taffeta as water rings show clearly",
      "Steam lightly through a protective cloth; never bend corset bones or structured pleats",
      "Hang on wide contoured hanger in a full-length breathable garment cover",
    ],
  },
];

export function findFabricCarePreset(
  idOrLabel?: string,
): FabricCarePreset | undefined {
  const key = String(idOrLabel || "")
    .trim()
    .toLowerCase();
  if (!key) return undefined;
  return FABRIC_CARE_PRESETS.find(
    (p) =>
      p.id.toLowerCase() === key ||
      p.label.toLowerCase() === key,
  );
}

export function matchPresetByInstructions(
  care?: string[],
): FabricCarePreset | undefined {
  if (!Array.isArray(care) || care.length === 0) return undefined;
  const normalized = care
    .map((line) => String(line || "").trim())
    .filter(Boolean);
  if (normalized.length === 0) return undefined;

  return FABRIC_CARE_PRESETS.find(
    (preset) =>
      preset.instructions.length === normalized.length &&
      preset.instructions.every((line, idx) => line === normalized[idx]),
  );
}
