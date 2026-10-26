import Category from "../models/Category.js";
import mongoose from "mongoose";

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
