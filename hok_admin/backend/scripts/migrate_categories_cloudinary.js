import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_DATA = [
  {
    name: "Bridal Lehengas",
    slug: "bridal-lehengas",
    mobileFile: "src/assets/Shop-by-category/cate1.jpg",
    desktopFile: "src/assets/sbc-desktop/sbc-1.jpg",
    publicId: "cate-bridal-lehengas",
    description:
      "Discover exquisite bridal lehengas crafted for your most memorable celebrations. Explore luxurious fabrics, intricate embroidery, traditional craftsmanship and contemporary bridal silhouettes.",
    pieces: "480 pieces",
    order: 1,
  },
  {
    name: "Sherwanis",
    slug: "sherwanis",
    mobileFile: "src/assets/Shop-by-category/cate2.jpg",
    desktopFile: "src/assets/sbc-desktop/sbc-2.jpg",
    publicId: "cate-sherwanis",
    description:
      "Elegant sherwanis for weddings, receptions and festive occasions. Discover sophisticated silhouettes featuring rich fabrics, detailed embroidery and timeless Indian craftsmanship.",
    pieces: "210 pieces",
    order: 2,
  },
  {
    name: "Sarees",
    slug: "sarees",
    mobileFile: "src/assets/Shop-by-category/cate3.jpg",
    desktopFile: "src/assets/sbc-desktop/sbc-3.jpg",
    publicId: "cate-sarees",
    description:
      "Explore an elegant collection of sarees featuring timeless drapes, luxurious fabrics, intricate embellishments and contemporary designs for weddings and special occasions.",
    pieces: "640 pieces",
    order: 3,
  },
  {
    name: "Anarkalis",
    slug: "anarkalis",
    mobileFile: "src/assets/Shop-by-category/cate4.jpg",
    desktopFile: "src/assets/sbc-desktop/sbc-4.jpg",
    publicId: "cate-anarkalis",
    description:
      "Graceful Anarkali ensembles designed for effortless elegance. From richly embroidered festive styles to contemporary silhouettes, find the perfect look for every celebration.",
    pieces: "380 pieces",
    order: 4,
  },
  {
    name: "Gowns",
    slug: "gowns",
    mobileFile: "src/assets/Shop-by-category/cate5.jpg",
    desktopFile: "src/assets/sbc-desktop/sbc-5.jpg",
    publicId: "cate-gowns",
    description:
      "Glamorous red carpet and evening gowns with dramatic flairs, modern cuts, and hand-embroidered luxury detailing.",
    pieces: "190 pieces",
    order: 5,
  },
  {
    name: "Indo-Western",
    slug: "indo-western",
    fallbackUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85",
    description:
      "A modern interpretation of Indian fashion combining traditional craftsmanship with contemporary silhouettes.",
    pieces: "250 pieces",
    order: 6,
  },
  {
    name: "Kurta Sets",
    slug: "kurta-sets",
    fallbackUrl:
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=1600&q=85",
    description:
      "Contemporary and festive kurta sets crafted from breathable silk, chanderi, and organza with delicate threadwork.",
    pieces: "320 pieces",
    order: 7,
  },
  {
    name: "Lehengas",
    slug: "lehengas",
    fallbackUrl:
      "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792058850/houseofkaira/categories/cate-bridal-lehengas.jpg",
    description:
      "Festive and wedding party lehengas with vibrant colors, mirror work, and exquisite flair.",
    pieces: "410 pieces",
    order: 8,
  },
];

async function uploadToCloudinary(filePath, publicId) {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "houseofkaira/categories",
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    return res.secure_url;
  } catch (err) {
    console.warn(`Failed to upload ${filePath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log("🚀 Starting Category Cloudinary Migration...");
  await connectDB();

  const rootDir = path.resolve(__dirname, "../../..");

  // Upload local images and resolve URLs
  for (const cat of CATEGORIES_DATA) {
    let cloudImageUrl = cat.fallbackUrl || "";

    if (cat.mobileFile) {
      const fullPath = path.resolve(rootDir, cat.mobileFile);
      if (fs.existsSync(fullPath)) {
        console.log(`📤 Uploading mobile image for ${cat.name}...`);
        const url = await uploadToCloudinary(fullPath, `${cat.publicId}-mobile`);
        if (url) cloudImageUrl = url;
      }
    }

    if (cat.desktopFile) {
      const fullDesktopPath = path.resolve(rootDir, cat.desktopFile);
      if (fs.existsSync(fullDesktopPath)) {
        console.log(`📤 Uploading desktop image for ${cat.name}...`);
        const desktopUrl = await uploadToCloudinary(
          fullDesktopPath,
          `${cat.publicId}-desktop`
        );
        cat.desktopImage = desktopUrl || cloudImageUrl;
      }
    }

    cat.image = cloudImageUrl;
  }

  // Delete all existing categories to prevent duplicates
  console.log("🧹 Cleaning up old duplicate categories...");
  await Category.deleteMany({});

  // Insert fresh, pristine category records with Cloudinary images
  console.log("💾 Inserting clean categories with Cloudinary URLs...");
  const docs = CATEGORIES_DATA.map((cat, idx) => ({
    categoryId: `CAT-${1792000000000 + idx}`,
    name: cat.name,
    slug: cat.slug,
    image: cat.image,
    desktopImage: cat.desktopImage || cat.image,
    mobileImage: cat.image,
    description: cat.description,
    pieces: cat.pieces,
    cta: "Shop Now",
    order: cat.order,
    status: "Active",
  }));

  const inserted = await Category.insertMany(docs);
  console.log(`✅ Successfully migrated and saved ${inserted.length} categories with Cloudinary data!`);

  for (const item of inserted) {
    console.log(`  - [${item.name}]: ${item.image}`);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
