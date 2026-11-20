import Category from "../models/Category.js";
import SiteSettings from "../models/SiteSettings.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
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

const ensureSeedData = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding initial categories into PostgreSQL (Supabase)...");
      const docs = initialCategories.map((item, i) => ({
        categoryId: `CAT-${1792000000000 + i}`,
        name: item.name,
        slug: item.slug,
        image: item.image,
        description: item.description,
      }));
      await Category.insertMany(docs);
    }
  } catch (err) {
    console.error("Failed to seed initial categories:", err.message);
  }
};

setTimeout(ensureSeedData, 2000);

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const docs = await Category.find({}).sort({ name: 1 });
    return res.json({
      success: true,
      data: docs.map((doc) => ({
        id: doc.categoryId || doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        image: doc.image || "",
        description: doc.description || "",
      })),
    });
  } catch (err) {
    console.error("🔥 Error in getCategories:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
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
        data: {
          id: existing.categoryId || existing._id.toString(),
          name: existing.name,
          slug: existing.slug,
          image: existing.image || "",
          description: existing.description || "",
        },
      });
    }

    const doc = await Category.create({
      categoryId: `CAT-${Date.now()}`,
      name: name.trim(),
      slug,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: doc.categoryId || doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        image: doc.image || "",
        description: doc.description || "",
      },
    });
  } catch (err) {
    console.error("🔥 Error in createCategory:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, description } = req.body;

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

    await doc.save();

    return res.json({
      success: true,
      data: {
        id: doc.categoryId || doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        image: doc.image || "",
        description: doc.description || "",
      },
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
