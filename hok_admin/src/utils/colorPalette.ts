// @ts-nocheck
// Mirror of hok_admin/backend/utils/colorPalette.js — keep both in sync.
// Shared English colour palette: every shade belongs to one colour family.
// Families drive the storefront COLOUR filter circles; shade names drive search.

export const COLOR_FAMILIES = [
  { name: "Red", hex: "#C62828" },
  { name: "Maroon", hex: "#800020" },
  { name: "Pink", hex: "#F48FB1" },
  { name: "Orange", hex: "#FB8C00" },
  { name: "Yellow", hex: "#FDD835" },
  { name: "Gold", hex: "#C9A96E" },
  { name: "Green", hex: "#2E7D32" },
  { name: "Blue", hex: "#1E40AF" },
  { name: "Purple", hex: "#6A1B9A" },
  { name: "Ivory", hex: "#F5EDD8" },
  { name: "Beige", hex: "#E3D3B5" },
  { name: "Brown", hex: "#6D4C41" },
  { name: "Grey", hex: "#9E9E9E" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Black", hex: "#1A1612" },
  { name: "White", hex: "#FFFFFF" },
];

// [name, hex, family]
const RAW = [
  ["Red", "#D32F2F", "Red"],
  ["Crimson", "#DC143C", "Red"],
  ["Scarlet", "#FF2400", "Red"],
  ["Cherry Red", "#D2042D", "Red"],
  ["Ruby Red", "#9B111E", "Red"],
  ["Light Red", "#F07470", "Red"],
  ["Brick Red", "#CB4154", "Red"],
  ["Vermilion", "#E34234", "Red"],
  ["Tomato Red", "#FF6347", "Red"],
  ["Blood Red", "#8A0303", "Red"],
  ["Maroon", "#800000", "Maroon"],
  ["Light Maroon", "#A0404A", "Maroon"],
  ["Dark Maroon", "#5C0A0A", "Maroon"],
  ["Wine", "#722F37", "Maroon"],
  ["Burgundy", "#800020", "Maroon"],
  ["Oxblood", "#4A0000", "Maroon"],
  ["Pink", "#FFC0CB", "Pink"],
  ["Light Pink", "#FFB6C1", "Pink"],
  ["Baby Pink", "#F4C2C2", "Pink"],
  ["Blush Pink", "#DE98A0", "Pink"],
  ["Hot Pink", "#FF69B4", "Pink"],
  ["Rose Pink", "#FF66CC", "Pink"],
  ["Dusty Rose", "#C9A0A0", "Pink"],
  ["Onion Pink", "#E5A4A4", "Pink"],
  ["Salmon Pink", "#FF91A4", "Pink"],
  ["Fuchsia", "#FF00FF", "Pink"],
  ["Magenta", "#C2185B", "Pink"],
  ["Orange", "#FF8C00", "Orange"],
  ["Light Orange", "#FFB347", "Orange"],
  ["Saffron", "#FF9933", "Orange"],
  ["Tangerine", "#F28500", "Orange"],
  ["Burnt Orange", "#CC5500", "Orange"],
  ["Rust", "#B7410E", "Orange"],
  ["Coral", "#FF7F50", "Orange"],
  ["Peach", "#FFCBA4", "Orange"],
  ["Apricot", "#FBCEB1", "Orange"],
  ["Yellow", "#FFEB3B", "Yellow"],
  ["Lemon Yellow", "#FFF44F", "Yellow"],
  ["Light Yellow", "#FFF59D", "Yellow"],
  ["Mustard", "#E1AD01", "Yellow"],
  ["Turmeric Yellow", "#E3A008", "Yellow"],
  ["Canary Yellow", "#FFEF00", "Yellow"],
  ["Gold", "#D4AF37", "Gold"],
  ["Antique Gold", "#C9A55C", "Gold"],
  ["Champagne", "#F7E7CE", "Gold"],
  ["Rose Gold", "#B76E79", "Gold"],
  ["Bronze", "#CD7F32", "Gold"],
  ["Green", "#2E7D32", "Green"],
  ["Light Green", "#90EE90", "Green"],
  ["Dark Green", "#013220", "Green"],
  ["Emerald", "#50C878", "Green"],
  ["Bottle Green", "#006A4E", "Green"],
  ["Forest Green", "#228B22", "Green"],
  ["Olive", "#808000", "Green"],
  ["Mint", "#98FF98", "Green"],
  ["Sage", "#9CAF88", "Green"],
  ["Lime Green", "#32CD32", "Green"],
  ["Parrot Green", "#8DB600", "Green"],
  ["Pistachio", "#93C572", "Green"],
  ["Sea Green", "#2E8B57", "Green"],
  ["Blue", "#1E40AF", "Blue"],
  ["Light Blue", "#ADD8E6", "Blue"],
  ["Navy Blue", "#000080", "Blue"],
  ["Royal Blue", "#4169E1", "Blue"],
  ["Sky Blue", "#87CEEB", "Blue"],
  ["Powder Blue", "#B0E0E6", "Blue"],
  ["Ice Blue", "#D6ECEF", "Blue"],
  ["Cobalt Blue", "#0047AB", "Blue"],
  ["Midnight Blue", "#191970", "Blue"],
  ["Turquoise", "#40E0D0", "Blue"],
  ["Teal", "#008080", "Blue"],
  ["Peacock Blue", "#005F69", "Blue"],
  ["Purple", "#6A1B9A", "Purple"],
  ["Light Purple", "#B39DDB", "Purple"],
  ["Lavender", "#B57EDC", "Purple"],
  ["Lilac", "#C8A2C8", "Purple"],
  ["Violet", "#8F00FF", "Purple"],
  ["Mauve", "#B784A7", "Purple"],
  ["Plum", "#8E4585", "Purple"],
  ["Orchid", "#DA70D6", "Purple"],
  ["Indigo", "#4B0082", "Purple"],
  ["Aubergine", "#3D0734", "Purple"],
  ["Ivory", "#FFFFF0", "Ivory"],
  ["Off White", "#FAF9F6", "Ivory"],
  ["Cream", "#FFFDD0", "Ivory"],
  ["Pearl", "#EAE0C8", "Ivory"],
  ["Eggshell", "#F0EAD6", "Ivory"],
  ["Beige", "#F5F5DC", "Beige"],
  ["Nude", "#E3BC9A", "Beige"],
  ["Sand", "#C2B280", "Beige"],
  ["Khaki", "#C3B091", "Beige"],
  ["Taupe", "#B38B6D", "Beige"],
  ["Brown", "#6D4C41", "Brown"],
  ["Light Brown", "#A47551", "Brown"],
  ["Chocolate", "#7B3F00", "Brown"],
  ["Coffee", "#6F4E37", "Brown"],
  ["Tan", "#D2B48C", "Brown"],
  ["Camel", "#C19A6B", "Brown"],
  ["Copper", "#B87333", "Brown"],
  ["Grey", "#808080", "Grey"],
  ["Light Grey", "#D3D3D3", "Grey"],
  ["Charcoal", "#36454F", "Grey"],
  ["Ash Grey", "#B2BEB5", "Grey"],
  ["Slate Grey", "#708090", "Grey"],
  ["Gunmetal", "#2A3439", "Grey"],
  ["Silver", "#C0C0C0", "Silver"],
  ["Platinum", "#E5E4E2", "Silver"],
  ["Black", "#111111", "Black"],
  ["Jet Black", "#0A0A0A", "Black"],
  ["White", "#FFFFFF", "White"],
  ["Snow White", "#FFFAFA", "White"],
];

export const COLOR_PALETTE = RAW.map(([name, hex, family]) => ({
  name,
  hex,
  family,
}));

const familyNames = COLOR_FAMILIES.map((f) => f.name.toLowerCase());

export const normalizeHex = (hex) => {
  let h = String(hex || "").trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return "";
  return `#${h.toUpperCase()}`;
};

const hexToRgb = (hex) => {
  const h = normalizeHex(hex);
  if (!h) return null;
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
};

// "Redmean" weighted RGB distance â€” close to human perception, no deps.
const distance = (a, b) => {
  const rm = (a[0] + b[0]) / 2;
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(
    (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db,
  );
};

export const nearestPaletteColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let best = null;
  let bestD = Infinity;
  for (const c of COLOR_PALETTE) {
    const d = distance(rgb, hexToRgb(c.hex));
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
};

export const findPaletteByName = (name) => {
  const n = String(name || "").trim().toLowerCase();
  if (!n) return null;
  const exact = COLOR_PALETTE.find((c) => c.name.toLowerCase() === n);
  if (exact) return exact;
  // "light pink shade" -> Light Pink, "navy" -> Navy Blue
  const contains = COLOR_PALETTE.filter(
    (c) => n.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(n),
  ).sort((a, b) => b.name.length - a.name.length);
  return contains[0] || null;
};

// Resolve family for any colour name (+ optional hex)
export const resolveFamily = (name, hex) => {
  const n = String(name || "").toLowerCase();
  const fromName = familyNames.find((f) =>
    n.split(/[^a-z]+/).includes(f),
  );
  if (fromName) {
    return COLOR_FAMILIES.find((f) => f.name.toLowerCase() === fromName).name;
  }
  const p = findPaletteByName(name);
  if (p) return p.family;
  const near = hex ? nearestPaletteColor(hex) : null;
  return near ? near.family : "";
};

export const familyHex = (family) =>
  COLOR_FAMILIES.find(
    (f) => f.name.toLowerCase() === String(family || "").toLowerCase(),
  )?.hex || "";
