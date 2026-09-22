import Category from "../models/Category.js";
import mongoose from "mongoose";

const initialCategories = [
  "Bridal Lehenga",
  "Lehenga",
  "Anarkali",
  "Sherwani",
  "Saree",
  "Gown",
  "Kurta Set"
];

const ensureSeedData = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding initial categories into MongoDB...");
      const docs = initialCategories.map((name, i) => ({
        categoryId: `CAT-${Date.now() + i}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
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
      data: docs.map(doc => ({
        id: doc.categoryId || doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        image: doc.image || "",
        description: doc.description || ""
      }))
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
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    const existing = await Category.findOne({
      $or: [{ name: { $regex: new RegExp(`^${name}$`, "i") } }, { slug }]
    });

    if (existing) {
      return res.json({
        success: true,
        data: {
          id: existing.categoryId || existing._id.toString(),
          name: existing.name,
          slug: existing.slug,
          image: existing.image || "",
          description: existing.description || ""
        }
      });
    }

    const doc = await Category.create({
      categoryId: `CAT-${Date.now()}`,
      name: name.trim(),
      slug
    });

    return res.status(201).json({
      success: true,
      data: {
        id: doc.categoryId || doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        image: doc.image || "",
        description: doc.description || ""
      }
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

    const doc = await Category.findOne({ $or: [{ categoryId: id }, { _id: id.length === 24 ? id : null }] });
    if (!doc) return res.status(404).json({ success: false, message: "Category not found" });

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
        description: doc.description || ""
      }
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
    const deleted = await Category.findOneAndDelete({ $or: [{ categoryId: id }, { _id: id.length === 24 ? id : null }] });
    if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });

    return res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("🔥 Error in deleteCategory:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
