import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import HomepageSection from "../models/HomepageSection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("Starting Cloudinary migration script...");

  const uploadsDir = path.resolve(__dirname, "../../../public/uploads");
  const heroImagesDir = path.resolve(__dirname, "../../../src/assets/Hero-images");

  const filesToUpload = new Map();

  // Check public/uploads
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const f of files) {
      const fullPath = path.join(uploadsDir, f);
      if (fs.statSync(fullPath).isFile() && !f.startsWith(".")) {
        filesToUpload.set(f, fullPath);
      }
    }
  }

  // Check src/assets/Hero-images for any extra grid files
  if (fs.existsSync(heroImagesDir)) {
    const files = fs.readdirSync(heroImagesDir);
    for (const f of files) {
      if (!filesToUpload.has(f)) {
        const fullPath = path.join(heroImagesDir, f);
        if (fs.statSync(fullPath).isFile() && !f.startsWith(".")) {
          filesToUpload.set(f, fullPath);
        }
      }
    }
  }

  console.log(`Found ${filesToUpload.size} files to check/upload to Cloudinary.`);

  const urlMap = new Map();

  for (const [filename, filePath] of filesToUpload.entries()) {
    try {
      console.log(`Uploading ${filename}...`);
      const publicIdName = path.parse(filename).name;
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "houseofkaira/products",
        public_id: publicIdName,
        overwrite: false,
        resource_type: "image",
      });

      console.log(`Uploaded ${filename} -> ${result.secure_url}`);
      urlMap.set(filename, result.secure_url);
      urlMap.set(`/uploads/${filename}`, result.secure_url);
      urlMap.set(`uploads/${filename}`, result.secure_url);
    } catch (uploadErr) {
      console.error(`Error uploading ${filename}:`, uploadErr.message);
      // In case file already exists on Cloudinary or has conflict
      try {
        const existing = await cloudinary.api.resource(`houseofkaira/products/${path.parse(filename).name}`);
        if (existing && existing.secure_url) {
          urlMap.set(filename, existing.secure_url);
          urlMap.set(`/uploads/${filename}`, existing.secure_url);
          urlMap.set(`uploads/${filename}`, existing.secure_url);
          console.log(`Found existing resource for ${filename}: ${existing.secure_url}`);
        }
      } catch (checkErr) {
        console.error(`Could not retrieve existing resource for ${filename}:`, checkErr.message);
      }
    }
  }

  console.log(`\nURL Map constructed with ${urlMap.size} mappings. Updating database products...`);

  // Update Products
  const products = await Product.find({});
  let updatedProductsCount = 0;

  for (const prod of products) {
    let changed = false;
    const currentImages = Array.isArray(prod.images) ? [...prod.images] : [];
    const newImages = currentImages.map((img) => {
      if (typeof img === "string") {
        // Direct match
        if (urlMap.has(img)) {
          changed = true;
          return urlMap.get(img);
        }
        // Match by filename
        const base = path.basename(img);
        if (urlMap.has(base)) {
          changed = true;
          return urlMap.get(base);
        }
      }
      return img;
    });

    if (changed) {
      prod.images = newImages;
      await prod.save();
      console.log(`Updated product ${prod.productId} (${prod.name}) images:`, newImages);
      updatedProductsCount++;
    }
  }

  console.log(`Updated ${updatedProductsCount} products in database.`);

  // Update Categories if any have /uploads/
  const categories = await Category.find({});
  let updatedCategoriesCount = 0;
  for (const cat of categories) {
    let changed = false;
    if (cat.image && urlMap.has(cat.image)) {
      cat.image = urlMap.get(cat.image);
      changed = true;
    } else if (cat.image && urlMap.has(path.basename(cat.image))) {
      cat.image = urlMap.get(path.basename(cat.image));
      changed = true;
    }
    if (changed) {
      await cat.save();
      updatedCategoriesCount++;
    }
  }
  console.log(`Updated ${updatedCategoriesCount} categories.`);

  // Update HomepageSection if any have /uploads/
  const sections = await HomepageSection.find({});
  let updatedSectionsCount = 0;
  for (const sec of sections) {
    if (sec.data) {
      let dataStr = JSON.stringify(sec.data);
      let changed = false;
      for (const [localPath, cloudUrl] of urlMap.entries()) {
        if (dataStr.includes(localPath)) {
          dataStr = dataStr.split(localPath).join(cloudUrl);
          changed = true;
        }
      }
      if (changed) {
        sec.data = JSON.parse(dataStr);
        await sec.save();
        updatedSectionsCount++;
      }
    }
  }
  console.log(`Updated ${updatedSectionsCount} homepage sections.`);

  console.log("\nMigration completed successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
