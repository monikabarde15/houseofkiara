import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import Product from "../models/Product.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not set in backend/.env file.");
  process.exit(1);
}

async function classifyGender(imageUrl, productName, category) {
  const prompt = `You are a fashion expert. Based on this image and product details, classify the gender it is intended for.
Product Name: ${productName}
Category: ${category}
Return strictly ONE WORD: "Men", "Women", or "Unisex". Do not add any punctuation.`;

  try {
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok)
      throw new Error(`Failed to fetch image: ${imageResp.statusText}`);
    const arrayBuffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imageResp.headers.get("content-type") || "image/jpeg";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    if (data.error) {
      console.error("Gemini API Error:", data.error.message);
      return null;
    }
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Clean up result (e.g. if it returns "Men." or " Unisex ")
    const cleaned = result?.replace(/[^a-zA-Z]/g, "");
    if (["Men", "Women", "Unisex"].includes(cleaned)) {
      return cleaned;
    }

    return null;
  } catch (error) {
    console.error("Error classifying:", error.message);
    return null;
  }
}

async function run() {
  try {
    console.log("Connecting to DB and fetching products...");

    const products = await Product.find({});
    console.log(`Found ${products.length} products to process.`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(
        `\n[${i + 1}/${products.length}] Processing: ${product.name}`,
      );

      const imageUrl =
        product.images && product.images.length > 0 ? product.images[0] : null;
      if (!imageUrl || imageUrl.includes("placehold.co")) {
        console.log("  -> Skipping: No valid image found.");
        continue;
      }

      const predictedGender = await classifyGender(
        imageUrl,
        product.name,
        product.category,
      );
      if (predictedGender) {
        console.log(`  -> Classified as: ${predictedGender}`);
        if (product.gender !== predictedGender) {
          await Product.updateOne(
            { _id: product._id },
            { $set: { gender: predictedGender } },
          );
          console.log("  -> Database updated.");
        } else {
          console.log("  -> No update needed (already matches).");
        }
      } else {
        console.log("  -> Failed to classify.");
      }

      // Delay to avoid Gemini API rate limits
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    console.log("\nFinished processing all products.");
    process.exit(0);
  } catch (error) {
    console.error("Fatal Error:", error);
    process.exit(1);
  }
}

run();
