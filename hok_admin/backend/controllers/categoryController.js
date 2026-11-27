import Category from "../models/Category.js";
import SiteSettings from "../models/SiteSettings.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { pool } from "../config/db.js";
import {
  COLOR_PALETTE,
  COLOR_FAMILIES,
  findPaletteByName,
  normalizeHex,
  resolveFamily,
} from "../utils/colorPalette.js";

const DEFAULT_OCCASIONS = [
  "Wedding",
  "Mehendi",
  "Haldi",
  "Sangeet",
  "Reception",
  "Cocktail",
  "Engagement",
  "Festive",
];

const initialCategories = [
  {
    name: "Bridal Lehengas",
    slug: "bridal-lehengas",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792059019/houseofkaira/categories/cate-bridal-lehengas-mobile.jpg",
    description: "Discover exquisite bridal lehengas crafted for your most memorable celebrations. Explore luxurious fabrics, intricate embroidery, traditional craftsmanship and contemporary bridal silhouettes.",
  },
  {
    name: "Sherwanis",
    slug: "sherwanis",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792059028/houseofkaira/categories/cate-sherwanis-mobile.jpg",
    description: "Elegant sherwanis for weddings, receptions and festive occasions. Discover sophisticated silhouettes featuring rich fabrics, detailed embroidery and timeless Indian craftsmanship.",
  },
  {
    name: "Sarees",
    slug: "sarees",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792059030/houseofkaira/categories/cate-sarees-mobile.jpg",
    description: "Explore an elegant collection of sarees featuring timeless drapes, luxurious fabrics, intricate embellishments and contemporary designs for weddings and special occasions.",
  },
  {
    name: "Anarkalis",
    slug: "anarkalis",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792059036/houseofkaira/categories/cate-anarkalis-mobile.jpg",
    description: "Graceful Anarkali ensembles designed for effortless elegance. From richly embroidered festive styles to contemporary silhouettes, find the perfect look for every celebration.",
  },
  {
    name: "Gowns",
    slug: "gowns",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792059041/houseofkaira/categories/cate-gowns-mobile.jpg",
    description: "Glamorous red carpet and evening gowns with dramatic flairs, modern cuts, and hand-embroidered luxury detailing.",
  },
  {
    name: "Indo-Western",
    slug: "indo-western",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85",
    description: "A modern interpretation of Indian fashion combining traditional craftsmanship with contemporary silhouettes.",
  },
  {
    name: "Kurta Sets",
    slug: "kurta-sets",
    image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=1600&q=85",
    description: "Contemporary and festive kurta sets crafted from breathable silk, chanderi, and organza with delicate threadwork.",
  },
  {
    name: "Lehengas",
    slug: "lehengas",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792058850/houseofkaira/categories/cate-bridal-lehengas.jpg",
    description: "Festive and wedding party lehengas with vibrant colors, mirror work, and exquisite flair.",
  },
];

const DEFAULT_MAIN_CATEGORIES = [
  { _id: "mc_women", mainCategoryId: "MC-WOMEN", name: "Women", slug: "women", sortOrder: 1 },
  { _id: "mc_men", mainCategoryId: "MC-MEN", name: "Men", slug: "men", sortOrder: 2 },
  { _id: "mc_unisex", mainCategoryId: "MC-UNISEX", name: "Unisex", slug: "unisex", sortOrder: 3 },
];

const inferMainCategoryForCategoryName = (name) => {
  const lower = String(name || "").trim().toLowerCase();
  if (
    lower.includes("sherwani") ||
    lower.includes("bandhgala") ||
    lower.includes("nehru") ||
    lower.includes("achkan") ||
    lower.includes("jodhpuri") ||
    lower.includes("waistcoat") ||
    lower.includes("bundi") ||
    /\b(shirt|shirts|pant|pants|trouser|trousers|blazer|suit|suits|men|mens)\b/.test(
      lower,
    )
  ) {
    return DEFAULT_MAIN_CATEGORIES[1]; // Men
  }
  if (
    lower.includes("kurta") ||
    lower.includes("indo-western") ||
    lower.includes("indo western")
  ) {
    return DEFAULT_MAIN_CATEGORIES[2]; // Unisex
  }
  return DEFAULT_MAIN_CATEGORIES[0]; // Women
};

const resolveMainCategoryInput = async (inputVal, fallbackCategoryName = "") => {
  const clean = String(inputVal || "").trim();
  const rows = await pool
    .query(
      "SELECT _id, main_category_id, name, slug, sort_order FROM main_categories ORDER BY sort_order ASC, name ASC",
    )
    .then((r) => r.rows || [])
    .catch(() => []);

  const list =
    rows.length > 0
      ? rows.map((r) => ({
          _id: r._id,
          mainCategoryId: r.main_category_id,
          name: r.name,
          slug: r.slug,
          sortOrder: r.sort_order ?? 1,
        }))
      : DEFAULT_MAIN_CATEGORIES;

  if (clean) {
    const lower = clean.toLowerCase();
    const matched = list.find(
      (mc) =>
        mc.mainCategoryId.toLowerCase() === lower ||
        mc.name.toLowerCase() === lower ||
        mc.slug.toLowerCase() === lower,
    );
    if (matched) return matched;
    if (["male", "man", "men", "mens"].includes(lower)) {
      return list.find((m) => m.slug === "men") || DEFAULT_MAIN_CATEGORIES[1];
    }
    if (["female", "woman", "women", "womens"].includes(lower)) {
      return list.find((m) => m.slug === "women") || DEFAULT_MAIN_CATEGORIES[0];
    }
    if (["unisex", "all", "both"].includes(lower)) {
      return list.find((m) => m.slug === "unisex") || DEFAULT_MAIN_CATEGORIES[2];
    }
  }
  return inferMainCategoryForCategoryName(fallbackCategoryName);
};

let mainCategoryBackfillPromise = null;
const ensureMainCategoriesAndBackfill = async () => {
  if (!mainCategoryBackfillPromise) {
    mainCategoryBackfillPromise = (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS main_categories (
            _id VARCHAR(64) PRIMARY KEY,
            main_category_id VARCHAR(64) UNIQUE NOT NULL,
            name VARCHAR(100) UNIQUE NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            sort_order INT DEFAULT 1,
            data JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
        await pool.query(`
          INSERT INTO main_categories (_id, main_category_id, name, slug, sort_order, data)
          VALUES
            ('mc_women', 'MC-WOMEN', 'Women', 'women', 1, '{"mainCategoryId":"MC-WOMEN","name":"Women","slug":"women","sortOrder":1}'::jsonb),
            ('mc_men', 'MC-MEN', 'Men', 'men', 2, '{"mainCategoryId":"MC-MEN","name":"Men","slug":"men","sortOrder":2}'::jsonb),
            ('mc_unisex', 'MC-UNISEX', 'Unisex', 'unisex', 3, '{"mainCategoryId":"MC-UNISEX","name":"Unisex","slug":"unisex","sortOrder":3}'::jsonb)
          ON CONFLICT (slug) DO NOTHING;
        `);
        await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS main_category_id VARCHAR(64);`);
        await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS main_category VARCHAR(100);`);

        const docs = await Category.find({});
        for (const doc of docs) {
          if (!doc.mainCategoryId || !doc.mainCategory) {
            const resolved = await resolveMainCategoryInput(
              doc.mainCategoryId || doc.mainCategory,
              doc.name,
            );
            doc.mainCategoryId = resolved.mainCategoryId;
            doc.mainCategory = resolved.name;
            await doc.save();
          }
        }
      } catch (err) {
        mainCategoryBackfillPromise = null;
        console.error("Failed ensuring main_categories:", err.message);
      }
    })();
  }
  return mainCategoryBackfillPromise;
};

const formatCategoryDto = (doc) => ({
  id: doc.categoryId || doc._id.toString(),
  name: doc.name,
  slug: doc.slug,
  mainCategoryId: doc.mainCategoryId || "",
  mainCategory: doc.mainCategory || "",
  image: doc.image || "",
  description: doc.description || "",
});

const ensureSeedData = async () => {
  try {
    await ensureMainCategoriesAndBackfill();
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding initial categories into PostgreSQL (Supabase)...");
      const docs = initialCategories.map((item, i) => {
        const mc = inferMainCategoryForCategoryName(item.name);
        return {
          categoryId: `CAT-${1792000000000 + i}`,
          name: item.name,
          slug: item.slug,
          mainCategoryId: mc.mainCategoryId,
          mainCategory: mc.name,
          image: item.image,
          description: item.description,
        };
      });
      await Category.insertMany(docs);
    }
  } catch (err) {
    console.error("Failed to seed initial categories:", err.message);
  }
};

setTimeout(ensureSeedData, 2000);

// GET /api/categories/main-categories
export const getMainCategories = async (req, res) => {
  try {
    await ensureMainCategoriesAndBackfill();
    const result = await pool.query(
      "SELECT _id, main_category_id, name, slug, sort_order FROM main_categories ORDER BY sort_order ASC, name ASC",
    );
    const rows =
      result?.rows?.length > 0
        ? result.rows.map((r) => ({
            id: r.main_category_id,
            mainCategoryId: r.main_category_id,
            name: r.name,
            slug: r.slug,
            sortOrder: r.sort_order ?? 1,
          }))
        : DEFAULT_MAIN_CATEGORIES.map((mc) => ({
            id: mc.mainCategoryId,
            mainCategoryId: mc.mainCategoryId,
            name: mc.name,
            slug: mc.slug,
            sortOrder: mc.sortOrder,
          }));
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("🔥 Error in getMainCategories:", err);
    return res.json({
      success: true,
      data: DEFAULT_MAIN_CATEGORIES.map((mc) => ({
        id: mc.mainCategoryId,
        mainCategoryId: mc.mainCategoryId,
        name: mc.name,
        slug: mc.slug,
        sortOrder: mc.sortOrder,
      })),
    });
  }
};

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    await ensureMainCategoriesAndBackfill();
    const docs = await Category.find({}).sort({ name: 1 });
    return res.json({
      success: true,
      data: docs.map(formatCategoryDto),
    });
  } catch (err) {
    console.error("🔥 Error in getCategories:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    await ensureMainCategoriesAndBackfill();
    const { name, mainCategoryId, mainCategory, gender } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existing = await Category.findOne({
      $or: [{ name: { $regex: new RegExp(`^${name}$`, "i") } }, { slug }],
    });

    if (existing) {
      return res.json({
        success: true,
        data: formatCategoryDto(existing),
      });
    }

    const mc = await resolveMainCategoryInput(
      mainCategoryId || mainCategory || gender,
      name,
    );
    const doc = await Category.create({
      categoryId: `CAT-${Date.now()}`,
      name: name.trim(),
      slug,
      mainCategoryId: mc.mainCategoryId,
      mainCategory: mc.name,
    });

    global.__webProductsCache = null;
    global.__webFiltersCache = null;

    return res.status(201).json({
      success: true,
      data: formatCategoryDto(doc),
    });
  } catch (err) {
    console.error("🔥 Error in createCategory:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    await ensureMainCategoriesAndBackfill();
    const { id } = req.params;
    const { name, image, description, mainCategoryId, mainCategory, gender } =
      req.body;

    const doc = await Category.findOne({
      $or: [{ categoryId: id }, { _id: id.length === 24 ? id : null }],
    });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    if (name) {
      doc.name = name.trim();
      doc.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    if (image !== undefined) doc.image = image;
    if (description !== undefined) doc.description = description;
    if (
      mainCategoryId !== undefined ||
      mainCategory !== undefined ||
      gender !== undefined
    ) {
      const mc = await resolveMainCategoryInput(
        mainCategoryId || mainCategory || gender,
        doc.name,
      );
      doc.mainCategoryId = mc.mainCategoryId;
      doc.mainCategory = mc.name;
    }

    await doc.save();
    global.__webProductsCache = null;
    global.__webFiltersCache = null;

    return res.json({
      success: true,
      data: formatCategoryDto(doc),
    });
  } catch (err) {
    console.error("🔥 Error in updateCategory:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findOneAndDelete({
      $or: [{ categoryId: id }, { _id: id.length === 24 ? id : null }],
    });
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    global.__webProductsCache = null;
    global.__webFiltersCache = null;

    return res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("🔥 Error in deleteCategory:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/categories/occasions
export const getOccasions = async (req, res) => {
  try {
    const [settingsDoc, allProducts] = await Promise.all([
      SiteSettings.findOne({ key: "master_occasions" }).catch(() => null),
      Product.find({}).catch(() => []),
    ]);

    const savedNames = Array.isArray(settingsDoc?.occasions)
      ? settingsDoc.occasions
      : [];

    const fromProducts = [];
    (allProducts || []).forEach((p) => {
      if (!p?.occasion) return;
      String(p.occasion)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((o) => fromProducts.push(o));
    });

    const seen = new Set();
    const merged = [];
    [...DEFAULT_OCCASIONS, ...savedNames, ...fromProducts].forEach((raw) => {
      const clean = String(raw || "").trim();
      if (!clean) return;
      const k = clean.toLowerCase();
      if (seen.has(k)) return;
      seen.add(k);
      merged.push({
        id: clean.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: clean,
      });
    });

    merged.sort((a, b) => a.name.localeCompare(b.name));
    return res.json({ success: true, data: merged });
  } catch (err) {
    console.error("Error in getOccasions:", err);
    return res.json({
      success: true,
      data: DEFAULT_OCCASIONS.map((name) => ({
        id: name.toLowerCase(),
        name,
      })),
    });
  }
};

// POST /api/categories/occasions
export const createOccasion = async (req, res) => {
  try {
    const rawName = String(req.body?.name || "").trim();
    if (!rawName) {
      return res
        .status(400)
        .json({ success: false, message: "Occasion name is required" });
    }

    let doc = await SiteSettings.findOne({ key: "master_occasions" }).catch(
      () => null,
    );
    const currentList = Array.isArray(doc?.occasions)
      ? [...doc.occasions]
      : [...DEFAULT_OCCASIONS];

    const existing = currentList.find(
      (o) => String(o || "").trim().toLowerCase() === rawName.toLowerCase(),
    );
    const finalName = existing ? String(existing).trim() : rawName;

    if (!existing) {
      currentList.push(finalName);
      if (doc) {
        doc.occasions = currentList;
        await doc.save();
      } else {
        await SiteSettings.create({
          key: "master_occasions",
          occasions: currentList,
        });
      }
    }

    global.__webFiltersCache = null;

    return res.status(201).json({
      success: true,
      data: {
        id: finalName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: finalName,
      },
    });
  } catch (err) {
    console.error("Error in createOccasion:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================== MASTER COLOURS ==================
const toColorEntry = (raw) => {
  const name = String(raw?.name || "").trim();
  if (!name) return null;
  const palette = findPaletteByName(name);
  const hex = normalizeHex(raw?.hex) || palette?.hex || "";
  const family =
    String(raw?.family || "").trim() || resolveFamily(name, hex) || "";
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    hex,
    family,
  };
};

// GET /api/categories/colors
export const getColors = async (req, res) => {
  try {
    const [settingsDoc, allProducts] = await Promise.all([
      SiteSettings.findOne({ key: "master_colors" }).catch(() => null),
      Product.find({}).catch(() => []),
    ]);
    const saved = Array.isArray(settingsDoc?.colors) ? settingsDoc.colors : [];
    const fromProducts = [];
    (allProducts || []).forEach((p) => {
      if (Array.isArray(p?.colors)) p.colors.forEach((c) => fromProducts.push(c));
    });

    const map = new Map();
    // Saved/custom entries override palette defaults with the same name
    [...COLOR_PALETTE, ...fromProducts, ...saved].forEach((raw) => {
      const entry = toColorEntry(raw);
      if (entry) map.set(entry.name.toLowerCase(), entry);
    });
    const data = Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return res.json({ success: true, data, families: COLOR_FAMILIES });
  } catch (err) {
    console.error("Error in getColors:", err);
    return res.json({
      success: true,
      data: COLOR_PALETTE.map(toColorEntry),
      families: COLOR_FAMILIES,
    });
  }
};

// POST /api/categories/colors  { name, hex, family }
export const createColor = async (req, res) => {
  try {
    const entry = toColorEntry(req.body || {});
    if (!entry) {
      return res
        .status(400)
        .json({ success: false, message: "Colour name is required" });
    }
    if (!entry.hex) {
      return res
        .status(400)
        .json({ success: false, message: "Please pick a colour (hex code)" });
    }

    const doc = await SiteSettings.findOne({ key: "master_colors" }).catch(
      () => null,
    );
    const list = Array.isArray(doc?.colors) ? [...doc.colors] : [];
    const idx = list.findIndex(
      (c) => String(c?.name || "").trim().toLowerCase() === entry.name.toLowerCase(),
    );
    const stored = { name: entry.name, hex: entry.hex, family: entry.family };
    if (idx >= 0) list[idx] = stored;
    else list.push(stored);

    if (doc) {
      doc.colors = list;
      await doc.save();
    } else {
      await SiteSettings.create({ key: "master_colors", colors: list });
    }

    global.__webFiltersCache = null;
    global.__webProductsCache = null;
    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("Error in createColor:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================== MASTER FABRIC CARE ==================
const MASTER_FABRIC_CARE_KEY = "master_fabric_care";

const INITIAL_FABRIC_CARE = [
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

const normalizeFabricCareItem = (raw) => {
  const label = String(raw?.label || raw?.name || "").trim();
  if (!label) return null;
  const id =
    String(raw?.id || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "") ||
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const instructions = Array.isArray(raw?.instructions)
    ? raw.instructions.map((s) => String(s || "").trim()).filter(Boolean)
    : typeof raw?.instructions === "string"
      ? raw.instructions
          .split(/\r?\n|;/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  return { id, label, instructions };
};

// GET /api/categories/fabric-care
export const getFabricCare = async (req, res) => {
  try {
    let items = [];
    const dbRes = await pool.query(
      `SELECT data FROM site_settings WHERE key = $1 LIMIT 1`,
      [MASTER_FABRIC_CARE_KEY],
    );

    if (dbRes?.rows?.length > 0) {
      const rawData =
        typeof dbRes.rows[0].data === "string"
          ? JSON.parse(dbRes.rows[0].data)
          : dbRes.rows[0].data || {};
      if (Array.isArray(rawData.items)) {
        items = rawData.items.map(normalizeFabricCareItem).filter(Boolean);
      }
    } else {
      items = INITIAL_FABRIC_CARE.map(normalizeFabricCareItem).filter(Boolean);
      await pool.query(
        `INSERT INTO site_settings (key, data, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO NOTHING`,
        [MASTER_FABRIC_CARE_KEY, JSON.stringify({ items })],
      );
    }

    const byId = new Set(items.map((i) => i.id.toLowerCase()));
    const byLabel = new Set(items.map((i) => i.label.toLowerCase()));

    const allProducts = await Product.find({}).catch(() => []);
    (allProducts || []).forEach((p) => {
      const rawCbf = String(p?.careByFabric || "").trim();
      if (!rawCbf) return;
      const lower = rawCbf.toLowerCase();
      if (byId.has(lower) || byLabel.has(lower)) return;
      const entry = normalizeFabricCareItem({
        id: rawCbf,
        label: rawCbf,
        instructions: Array.isArray(p?.care) ? p.care : [],
      });
      if (entry && !byId.has(entry.id.toLowerCase())) {
        items.push(entry);
        byId.add(entry.id.toLowerCase());
        byLabel.add(entry.label.toLowerCase());
      }
    });

    items.sort((a, b) => a.label.localeCompare(b.label));
    return res.json({ success: true, data: items });
  } catch (err) {
    console.error("Error in getFabricCare:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/categories/fabric-care { label, instructions }
export const createFabricCare = async (req, res) => {
  try {
    const entry = normalizeFabricCareItem(req.body || {});
    if (!entry) {
      return res
        .status(400)
        .json({ success: false, message: "Fabric care label is required" });
    }

    const dbRes = await pool.query(
      `SELECT data FROM site_settings WHERE key = $1 LIMIT 1`,
      [MASTER_FABRIC_CARE_KEY],
    );
    let current = [];
    if (dbRes?.rows?.length > 0) {
      const rawData =
        typeof dbRes.rows[0].data === "string"
          ? JSON.parse(dbRes.rows[0].data)
          : dbRes.rows[0].data || {};
      if (Array.isArray(rawData.items)) {
        current = rawData.items.map(normalizeFabricCareItem).filter(Boolean);
      }
    } else {
      current = INITIAL_FABRIC_CARE.map(normalizeFabricCareItem).filter(Boolean);
    }

    const idx = current.findIndex(
      (item) =>
        item.id.toLowerCase() === entry.id.toLowerCase() ||
        item.label.toLowerCase() === entry.label.toLowerCase(),
    );
    if (idx >= 0) {
      current[idx] = {
        ...current[idx],
        label: entry.label,
        instructions:
          entry.instructions.length > 0
            ? entry.instructions
            : current[idx].instructions,
      };
    } else {
      current.push(entry);
    }

    await pool.query(
      `INSERT INTO site_settings (key, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key)
       DO UPDATE SET data = $2, updated_at = NOW()`,
      [MASTER_FABRIC_CARE_KEY, JSON.stringify({ items: current })],
    );

    const savedItem = idx >= 0 ? current[idx] : entry;
    return res.status(201).json({ success: true, data: savedItem });
  } catch (err) {
    console.error("Error in createFabricCare:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const MASTER_SIZES_KEY = "master_sizes";
const DEFAULT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "Free Size",
  "Custom",
];

const dedupeSizeList = (arr = []) => {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const clean = String(item || "").trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out;
};

const formatSizeOption = (name) => ({
  id:
    String(name || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") || String(name || "").trim().toLowerCase(),
  name: String(name || "").trim(),
});

const persistMasterSizes = async (sizesList) => {
  await pool.query(
    `INSERT INTO site_settings (key, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key)
     DO UPDATE SET data = $2, updated_at = NOW()`,
    [MASTER_SIZES_KEY, JSON.stringify({ sizes: sizesList })],
  );
};

const loadMasterSizes = async ({ includeProductSizes = false } = {}) => {
  const dbRes = await pool.query(
    `SELECT data FROM site_settings WHERE key = $1 LIMIT 1`,
    [MASTER_SIZES_KEY],
  );

  if (dbRes?.rows?.length > 0) {
    const rawData =
      typeof dbRes.rows[0].data === "string"
        ? JSON.parse(dbRes.rows[0].data)
        : dbRes.rows[0].data || {};
    if (Array.isArray(rawData.sizes)) {
      return dedupeSizeList(rawData.sizes);
    }
  }

  let productSizes = [];
  if (includeProductSizes) {
    const allProducts = await Product.find({}).catch(() => []);
    (allProducts || []).forEach((p) => {
      if (Array.isArray(p?.sizes)) {
        p.sizes.forEach((s) => productSizes.push(s));
      }
    });
  }

  const seeded = dedupeSizeList([...DEFAULT_SIZES, ...productSizes]);
  await persistMasterSizes(seeded);
  return seeded;
};

// GET /api/categories/sizes
export const getSizes = async (req, res) => {
  try {
    const list = await loadMasterSizes({ includeProductSizes: true });
    return res.json({
      success: true,
      data: list.map(formatSizeOption),
    });
  } catch (err) {
    console.error("Error in getSizes:", err);
    return res.json({
      success: true,
      data: DEFAULT_SIZES.map(formatSizeOption),
    });
  }
};

// POST /api/categories/sizes
export const createSize = async (req, res) => {
  try {
    const rawName = String(req.body?.name || "").trim();
    if (!rawName) {
      return res
        .status(400)
        .json({ success: false, message: "Size name is required" });
    }

    const current = await loadMasterSizes();
    const existing = current.find(
      (s) => s.toLowerCase() === rawName.toLowerCase(),
    );
    const canonical = existing || rawName;
    const updated = existing ? current : dedupeSizeList([...current, canonical]);

    if (!existing) {
      await persistMasterSizes(updated);
    }

    return res.status(201).json({
      success: true,
      data: formatSizeOption(canonical),
      list: updated,
    });
  } catch (err) {
    console.error("Error in createSize:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/categories/sizes/:name
export const deleteSize = async (req, res) => {
  try {
    const rawName = decodeURIComponent(String(req.params?.name || "")).trim();
    if (!rawName) {
      return res
        .status(400)
        .json({ success: false, message: "Size name is required" });
    }

    const current = await loadMasterSizes();
    const filtered = current.filter(
      (s) => s.toLowerCase() !== rawName.toLowerCase(),
    );
    await persistMasterSizes(filtered);

    return res.json({
      success: true,
      data: { removed: rawName },
      list: filtered,
    });
  } catch (err) {
    console.error("Error in deleteSize:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
