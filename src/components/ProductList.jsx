// src\components\ProductList.jsx
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/product-list.css";

/* ================= DATA ================= */
export const products = [
  {
    id: 1,
    designer: "RAHUL MISHRA",
    name: "Blush Zardosi Anarkali",
    price: "₹2,40,00",
    oldPrice: "₹3,00,00",
    tag: "RENT",
    condition: {
      grade: "excellent", // "excellent" or "pristine" or "good"
    },
    prelovedSize: `S (fitted · 32" bust · 26" waist)`,
    colors: [
      {
        code: "#f5d0c5",
        images: [
          "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg",
        ],
      },
      {
        code: "#d4a373",
        images: [
          "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg",
        ],
      },
    ],
    image: [
      "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg",
      "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg",
    ],
    amazonData: {
      highlights: {
        material: "Jimmy Choo Silk",
        weave: "Woven",
        finish: "Readymade",
        pattern: "Solid",
        care: "Dry Clean Only",
        neck: "U-Neck",
      },

      about: [
        "Wine Embroidered silk lehenga with blouse and dupatta.",
        "Blouse Material: Silk Blend | Bottom: Silk Blend | Dupatta: Crepe",
        "Package: 1 Lehenga + 1 Blouse + 1 Dupatta",
        "Blouse Length: 15 inch | Bottom Length: 42 inch | Dupatta: 2.5m",
        "Neck: U-Neck | Sleeve: Sleeveless",
      ],

      additional: {
        manufacturer: "Stylum Mart Private Limited, Jaipur",
        weight: "300 g",
        dimensions: "25.5 x 20.3 x 2.5 cm",
        quantity: "1",
        name: "Lehenga Choli",
      },

      style: {
        pattern: "Solid",
        sleeve: "Sleeveless",
        neck: "U-Neck",
        color: "Wine",
      },

      materialCare: {
        material: "Silk",
        fabric: "Silk",
        care: "Dry Clean Only",
      },
    },
    color: ["red", "gold"],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    // 🔥 UNIQUE DATA
    craft: `
    Each Rahul Mishra anarkali begins as a sketch and becomes a conversation between designer and artisan. 
    This ivory georgette set was worked on by fourteen karigars over the course of nine weeks in a Lucknow atelier — each responsible for a different section of the chikankari floral field. 

    The zardozi border at the hem is done in antique gold bullion wire, hand-coiled and stitched in the shadow-work style native to Uttar Pradesh. No two pieces are identical.

    Styling note: The ivory colour photographs exceptionally under both daylight and warm studio lighting. Pair with uncut diamond or polki jewellery to let the threadwork breathe. The floor-length silhouette is flattering across all heights — the dupatta can be draped or pinned for different looks.
    `,
    sizeNote: `
    This is an unstitched set — it includes the fabric panels for the anarkali, churidar, and dupatta. 
    Please refer to the size guide below and check your measurements carefully before ordering. 
    For any sizing queries, reach out to us on WhatsApp before placing your order.
    `,
    sizeTable: [
      {
        size: "XS",
        bust: '30"',
        waist: '24"',
        hips: '32"',
        height: "5'0\"–5'3\"",
      },
      {
        size: "S",
        bust: '32"',
        waist: '26"',
        hips: '34"',
        height: "5'2\"–5'5\"",
      },
      {
        size: "M",
        bust: '34"',
        waist: '28"',
        hips: '36"',
        height: "5'4\"–5'7\"",
        recommended: true,
      },
      {
        size: "L",
        bust: '36"',
        waist: '30"',
        hips: '38"',
        height: "5'5\"–5'8\"",
      },
      {
        size: "XL",
        bust: '38"',
        waist: '32"',
        hips: '40"',
        height: "5'6\"–5'9\"",
      },
    ],
    care: [
      "Dry clean only. Do not machine wash or hand wash — silk georgette and hand-done threadwork require specialist cleaning.",
      "Store in a cool, dark space in the muslin garment bag provided. Avoid plastic storage — it traps moisture and damages silk fibres.",
      "Do not iron directly on the embroidered surface. Use a pressing cloth and low heat on the reverse only.",
      "Avoid prolonged exposure to direct sunlight, which can yellow ivory silk over time.",
      "If beads or thread snag, do not pull — visit a specialist karigar for repairs.",
    ],
    shipping: [
      { method: "Standard delivery", time: "3–5 business days", cost: "Free" },
      { method: "Express delivery", time: "1–2 business days", cost: "₹499" },
      {
        method: "Same-day (Indore only)",
        time: "Within 6 hours",
        cost: "₹299",
      },
    ],

    packaging: [
      "Piece is packed in archival tissue within its original garment bag, placed in a rigid protective box.",
    ],

    details: {
      fabric: "Silk Georgette",
      technique: "Zardozi",
      includes: "Anarkali Set",
      delivery: "3–5 days",
      color: "Blush Pink",
      thread: "Gold thread",
      occasion: "Wedding",
      origin: "India",
    },

    disclosure: `
Worn once for a full-day wedding in Udaipur, November 2023.
Professionally dry-cleaned twice. No alterations, no bead loss, no staining.
Minor settling of embroidery at the hem — photographed in image 4.
The dupatta is pristine. The blouse fits a 32" bust; the skirt waist is adjustable to 26–28".
`,

    // ========================= MODES // =========================//
    modes: {
      // ===== RENT =====
      rent: {
        enabled: true,

        pricing: {
          type: "hybrid",

          pricePerDay: 2500,
          minDays: 3,

          windows: [
            {
              id: "standard",
              label: "Standard Window",
              price: 8500,
              days: 4,
              tag: "most popular",
            },
            {
              id: "extended",
              label: "Extended Window",
              price: 14000,
              days: 7,
              tag: "destination weddings",
            },
          ],
        },
        delivery: {
          dispatchBeforeDays: 2,
          returnAfterDays: 1,
          label: "Arrives",
          returnLabel: "Collected",
        },

        deposit: {
          amount: 25000,
          refundable: true,
          returnDays: 5,
        },

        availability: {
          unavailableDates: [
            "2026-04-05",
            "2026-04-06",
            "2026-04-14",
            "2026-04-15",
            "2026-04-16",
            "2026-04-17",
          ],
          rentedCount: 4,
        },


        rules: {
          allowCustomRange: true,
        },
        sizes: [
          { label: "XS", available: true },
          { label: "S", available: true },
          { label: "M", available: true },
          { label: "L", available: false },
          { label: "XL", available: false },
        ],
      },

      // ===== PRELOVED =====
      preloved: {
        enabled: true,

        pricing: {
          price: 13000,
          originalPrice: 24000,
        },

        condition: {
          label: "Excellent Condition",
          rating: 4.5,
        },
        disclosure:
          "Worn once for a reception. No alterations made. Minor organza pull on pallu border — photographed and disclosed. Blouse fabric unstitched, included.",
        finalSaleNote:
          "Pre-loved pieces cannot be returned once dispatched. Please review all condition notes and photographs before purchasing. Reach us on Whatsapp before placing your order",
      },

      // ===== BUY =====
      buy: {
        enabled: true,

        pricing: {
          price: 140000,
          discountPrice: 12000,
        },

        stock: {
          available: true,
          quantity: 5,
        },
      },

      // ===== TRY (FUTURE) =====
      try: {
        enabled: false,

        pricing: {
          trialFee: 1500,
        },

        duration: {
          days: 2,
        },
      },
    },
  },

  {
    id: 2,
    designer: "RAHUL MISHRA",
    name: "Midnight Sharara",
    price: "₹3,10,000",
    oldPrice: "₹3,00,000",
    tag: "NEW",
    condition: { grade: "pristine" },
    colors: [
      {
        code: "#f5d0c5",
        images: [
          "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg",
        ],
      },
      {
        code: "#d4a373",
        images: [
          "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg",
        ],
      },
    ],
    amazonData: {
      highlights: {
        material: "Jimmy Choo Silk",
        weave: "Woven",
        finish: "Readymade",
        pattern: "Solid",
        care: "Dry Clean Only",
        neck: "U-Neck",
      },

      about: [
        "Wine Embroidered silk lehenga with blouse and dupatta.",
        "Blouse Material: Silk Blend | Bottom: Silk Blend | Dupatta: Crepe",
        "Package: 1 Lehenga + 1 Blouse + 1 Dupatta",
        "Blouse Length: 15 inch | Bottom Length: 42 inch | Dupatta: 2.5m",
        "Neck: U-Neck | Sleeve: Sleeveless",
      ],

      additional: {
        manufacturer: "Stylum Mart Private Limited, Jaipur",
        weight: "300 g",
        dimensions: "25.5 x 20.3 x 2.5 cm",
        quantity: "1",
        name: "Lehenga Choli",
      },

      style: {
        pattern: "Solid",
        sleeve: "Sleeveless",
        neck: "U-Neck",
        color: "Wine",
      },

      materialCare: {
        material: "Silk",
        fabric: "Silk",
        care: "Dry Clean Only",
      },
    },
    image: [
      "https://i.pinimg.com/736x/c8/59/fb/c859fbc8a0d67baf213921e88f5c0829.jpg",
      "https://i.pinimg.com/736x/37/07/fd/3707fd1fa71c713110f15b7be7b67fc9.jpg",
    ],

    craft: `
      Each Rahul Mishra anarkali begins as a sketch and becomes a conversation between designer and artisan. 
      This ivory georgette set was worked on by fourteen karigars over the course of nine weeks in a Lucknow atelier — each responsible for a different section of the chikankari floral field. 

      The zardozi border at the hem is done in antique gold bullion wire, hand-coiled and stitched in the shadow-work style native to Uttar Pradesh. No two pieces are identical.

      Styling note: The ivory colour photographs exceptionally under both daylight and warm studio lighting. Pair with uncut diamond or polki jewellery to let the threadwork breathe. The floor-length silhouette is flattering across all heights — the dupatta can be draped or pinned for different looks.
      `,
    sizeNote: `
      This is an unstitched set — it includes the fabric panels for the anarkali, churidar, and dupatta. 
      Please refer to the size guide below and check your measurements carefully before ordering. 
      For any sizing queries, reach out to us on WhatsApp before placing your order.
      `,
    sizeTable: [
      {
        size: "XS",
        bust: '30"',
        waist: '24"',
        hips: '32"',
        height: "5'0\"–5'3\"",
      },
      {
        size: "S",
        bust: '32"',
        waist: '26"',
        hips: '34"',
        height: "5'2\"–5'5\"",
      },
      {
        size: "M",
        bust: '34"',
        waist: '28"',
        hips: '36"',
        height: "5'4\"–5'7\"",
        recommended: true,
      },
      {
        size: "L",
        bust: '36"',
        waist: '30"',
        hips: '38"',
        height: "5'5\"–5'8\"",
      },
      {
        size: "XL",
        bust: '38"',
        waist: '32"',
        hips: '40"',
        height: "5'6\"–5'9\"",
      },
    ],
    care: [
      "Dry clean only. Do not machine wash or hand wash — silk georgette and hand-done threadwork require specialist cleaning.",
      "Store in a cool, dark space in the muslin garment bag provided. Avoid plastic storage — it traps moisture and damages silk fibres.",
      "Do not iron directly on the embroidered surface. Use a pressing cloth and low heat on the reverse only.",
      "Avoid prolonged exposure to direct sunlight, which can yellow ivory silk over time.",
      "If beads or thread snag, do not pull — visit a specialist karigar for repairs.",
    ],
    shipping: [
      { method: "Standard delivery", time: "3–5 business days", cost: "Free" },
      { method: "Express delivery", time: "1–2 business days", cost: "₹499" },
      {
        method: "Same-day (Indore only)",
        time: "Within 6 hours",
        cost: "₹299",
      },
    ],

    details: {
      fabric: "Velvet",
      technique: "Threadwork",
      includes: "Sharara Set",
      delivery: "2–4 days",
      color: "Midnight Blue",
      thread: "Silk thread",
      occasion: "Party",
      origin: "India",
    },
  },
  {
    id: 3,
    designer: "RAHUL MISHRA",
    name: "Elegant Purple Sari",
    price: "₹3,10,000",
    oldPrice: "₹3,00,000",
    tag: "NEW",
    condition: { grade: "good" },
    colors: [
      {
        code: "#f5d0c5",
        images: [
          "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg",
        ],
      },
      {
        code: "#d4a373",
        images: [
          "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg",
        ],
      },
    ],
    amazonData: {
      highlights: {
        material: "Jimmy Choo Silk",
        weave: "Woven",
        finish: "Readymade",
        pattern: "Solid",
        care: "Dry Clean Only",
        neck: "U-Neck",
      },

      about: [
        "Wine Embroidered silk lehenga with blouse and dupatta.",
        "Blouse Material: Silk Blend | Bottom: Silk Blend | Dupatta: Crepe",
        "Package: 1 Lehenga + 1 Blouse + 1 Dupatta",
        "Blouse Length: 15 inch | Bottom Length: 42 inch | Dupatta: 2.5m",
        "Neck: U-Neck | Sleeve: Sleeveless",
      ],

      additional: {
        manufacturer: "Stylum Mart Private Limited, Jaipur",
        weight: "300 g",
        dimensions: "25.5 x 20.3 x 2.5 cm",
        quantity: "1",
        name: "Lehenga Choli",
      },

      style: {
        pattern: "Solid",
        sleeve: "Sleeveless",
        neck: "U-Neck",
        color: "Wine",
      },

      materialCare: {
        material: "Silk",
        fabric: "Silk",
        care: "Dry Clean Only",
      },
    },
    image: [
      "https://i.pinimg.com/736x/e8/0a/fb/e80afbb97e03195973cb07ccee77e8b4.jpg",
      "https://i.pinimg.com/736x/2c/71/88/2c7188bf10d1e20702c8b4f8f14c8ef2.jpg",
      "https://i.pinimg.com/1200x/8b/b6/06/8bb606de890cb8f52987b32c9f6c7396.jpg",
    ],

    craft: `
      Each Rahul Mishra anarkali begins as a sketch and becomes a conversation between designer and artisan. 
      This ivory georgette set was worked on by fourteen karigars over the course of nine weeks in a Lucknow atelier — each responsible for a different section of the chikankari floral field. 

      The zardozi border at the hem is done in antique gold bullion wire, hand-coiled and stitched in the shadow-work style native to Uttar Pradesh. No two pieces are identical.

      Styling note: The ivory colour photographs exceptionally under both daylight and warm studio lighting. Pair with uncut diamond or polki jewellery to let the threadwork breathe. The floor-length silhouette is flattering across all heights — the dupatta can be draped or pinned for different looks.
      `,
    sizeNote: `
      This is an unstitched set — it includes the fabric panels for the anarkali, churidar, and dupatta. 
      Please refer to the size guide below and check your measurements carefully before ordering. 
      For any sizing queries, reach out to us on WhatsApp before placing your order.
      `,
    sizeTable: [
      {
        size: "XS",
        bust: '30"',
        waist: '24"',
        hips: '32"',
        height: "5'0\"–5'3\"",
      },
      {
        size: "S",
        bust: '32"',
        waist: '26"',
        hips: '34"',
        height: "5'2\"–5'5\"",
      },
      {
        size: "M",
        bust: '34"',
        waist: '28"',
        hips: '36"',
        height: "5'4\"–5'7\"",
        recommended: true,
      },
      {
        size: "L",
        bust: '36"',
        waist: '30"',
        hips: '38"',
        height: "5'5\"–5'8\"",
      },
      {
        size: "XL",
        bust: '38"',
        waist: '32"',
        hips: '40"',
        height: "5'6\"–5'9\"",
      },
    ],
    care: [
      "Dry clean only. Do not machine wash or hand wash — silk georgette and hand-done threadwork require specialist cleaning.",
      "Store in a cool, dark space in the muslin garment bag provided. Avoid plastic storage — it traps moisture and damages silk fibres.",
      "Do not iron directly on the embroidered surface. Use a pressing cloth and low heat on the reverse only.",
      "Avoid prolonged exposure to direct sunlight, which can yellow ivory silk over time.",
      "If beads or thread snag, do not pull — visit a specialist karigar for repairs.",
    ],
    shipping: [
      { method: "Standard delivery", time: "3–5 business days", cost: "Free" },
      { method: "Express delivery", time: "1–2 business days", cost: "₹499" },
      {
        method: "Same-day (Indore only)",
        time: "Within 6 hours",
        cost: "₹299",
      },
    ],

    details: {
      fabric: "Velvet",
      technique: "Threadwork",
      includes: "Sharara Set",
      delivery: "2–4 days",
      color: "Midnight Blue",
      thread: "Silk thread",
      occasion: "Party",
      origin: "India",
    },
  },
  {
    id: 4,
    designer: "RAHUL MISHRA",
    name: "Elegant Purple Sari",
    price: "₹3,10,000",
    oldPrice: "₹3,00,000",
    tag: "PRELOVED",
    condition: { grade: "excellent" },
    colors: [
      {
        code: "#f5d0c5",
        images: [
          "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg",
        ],
      },
      {
        code: "#d4a373",
        images: [
          "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg",
        ],
      },
    ],
    amazonData: {
      highlights: {
        material: "Jimmy Choo Silk",
        weave: "Woven",
        finish: "Readymade",
        pattern: "Solid",
        care: "Dry Clean Only",
        neck: "U-Neck",
      },

      about: [
        "Wine Embroidered silk lehenga with blouse and dupatta.",
        "Blouse Material: Silk Blend | Bottom: Silk Blend | Dupatta: Crepe",
        "Package: 1 Lehenga + 1 Blouse + 1 Dupatta",
        "Blouse Length: 15 inch | Bottom Length: 42 inch | Dupatta: 2.5m",
        "Neck: U-Neck | Sleeve: Sleeveless",
      ],

      additional: {
        manufacturer: "Stylum Mart Private Limited, Jaipur",
        weight: "300 g",
        dimensions: "25.5 x 20.3 x 2.5 cm",
        quantity: "1",
        name: "Lehenga Choli",
      },

      style: {
        pattern: "Solid",
        sleeve: "Sleeveless",
        neck: "U-Neck",
        color: "Wine",
      },

      materialCare: {
        material: "Silk",
        fabric: "Silk",
        care: "Dry Clean Only",
      },
    },
    image: [
      "https://i.pinimg.com/736x/0b/38/6d/0b386d4ad511c3191adc8e0d8e347652.jpg",
      "https://i.pinimg.com/736x/5c/96/c0/5c96c0d3a91b73a6d6d02d4964332876.jpg",
      "https://i.pinimg.com/736x/72/41/16/7241160a89d381e15af363914b23bd99.jpg",
    ],

    craft: `
      Each Rahul Mishra anarkali begins as a sketch and becomes a conversation between designer and artisan. 
      This ivory georgette set was worked on by fourteen karigars over the course of nine weeks in a Lucknow atelier — each responsible for a different section of the chikankari floral field. 

      The zardozi border at the hem is done in antique gold bullion wire, hand-coiled and stitched in the shadow-work style native to Uttar Pradesh. No two pieces are identical.

      Styling note: The ivory colour photographs exceptionally under both daylight and warm studio lighting. Pair with uncut diamond or polki jewellery to let the threadwork breathe. The floor-length silhouette is flattering across all heights — the dupatta can be draped or pinned for different looks.
      `,
    sizeNote: `
      This is an unstitched set — it includes the fabric panels for the anarkali, churidar, and dupatta. 
      Please refer to the size guide below and check your measurements carefully before ordering. 
      For any sizing queries, reach out to us on WhatsApp before placing your order.
      `,
    sizeTable: [
      {
        size: "XS",
        bust: '30"',
        waist: '24"',
        hips: '32"',
        height: "5'0\"–5'3\"",
      },
      {
        size: "S",
        bust: '32"',
        waist: '26"',
        hips: '34"',
        height: "5'2\"–5'5\"",
      },
      {
        size: "M",
        bust: '34"',
        waist: '28"',
        hips: '36"',
        height: "5'4\"–5'7\"",
        recommended: true,
      },
      {
        size: "L",
        bust: '36"',
        waist: '30"',
        hips: '38"',
        height: "5'5\"–5'8\"",
      },
      {
        size: "XL",
        bust: '38"',
        waist: '32"',
        hips: '40"',
        height: "5'6\"–5'9\"",
      },
    ],
    care: [
      "Dry clean only. Do not machine wash or hand wash — silk georgette and hand-done threadwork require specialist cleaning.",
      "Store in a cool, dark space in the muslin garment bag provided. Avoid plastic storage — it traps moisture and damages silk fibres.",
      "Do not iron directly on the embroidered surface. Use a pressing cloth and low heat on the reverse only.",
      "Avoid prolonged exposure to direct sunlight, which can yellow ivory silk over time.",
      "If beads or thread snag, do not pull — visit a specialist karigar for repairs.",
    ],
    shipping: [
      { method: "Standard delivery", time: "3–5 business days", cost: "Free" },
      { method: "Express delivery", time: "1–2 business days", cost: "₹499" },
      {
        method: "Same-day (Indore only)",
        time: "Within 6 hours",
        cost: "₹299",
      },
    ],

    details: {
      fabric: "Velvet",
      technique: "Threadwork",
      includes: "Sharara Set",
      delivery: "2–4 days",
      color: "Midnight Blue",
      thread: "Silk thread",
      occasion: "Party",
      origin: "India",
    },
  },
];
/* ================= FINAL HELPER ================= */
export const makeProductDetail = (item) => {
  // Support both sources:
  // 1. Full product API: has listingModes array e.g. ["RENTAL", "PRELOVED", "BUY NEW"]
  // 2. Web-products listing API: has rent/preloved/isNew boolean flags
  const listingModes = item.listingModes || [];
  const rentEnabled = listingModes.includes("RENTAL") || item.rent === true;
  const prelovedEnabled =
    listingModes.includes("PRELOVED") ||
    listingModes.includes("RE-SELL") ||
    item.preloved === true;
  const buyEnabled =
    listingModes.includes("BUY NEW") ||
    listingModes.includes("BUY") ||
    item.isNew === true;

  // Build modes object (used by detail page toggle buttons)
  const builtModes = item.modes || {
    rent: {
      enabled: rentEnabled,
        pricing: {
          pricePerDay: item.rentalPrice ? Math.round(item.rentalPrice / 4) : (item.perDayRate || 0),
          minDays: item.minimumDurationDays || 3,
          windows: [
            {
              id: "standard",
              label: item.standardWindowLabel || "Standard Window",
              price: item.rentalPrice || 0,
              days: 4,
              tag: item.standardWindowTag || "most popular",
            },
            {
              id: "extended",
              label: item.extendedWindowLabel || "Extended Window",
              price: item.extendedWindowPrice && item.extendedWindowPrice !== item.rentalPrice
                ? item.extendedWindowPrice
                : item.rentalPrice
                ? Math.round((item.rentalPrice / 4) * 7)
                : 0,
              days: 7,
              tag: item.extendedWindowTag || "destination weddings",
            },
          ],
        },
      deposit: {
        amount: item.securityDeposit || 0,
        refundable: true,
        returnDays: 5,
      },
      availability: {
        unavailableDates: (() => {
          const dates = [];
          if (Array.isArray(item.blockedDates)) {
            item.blockedDates.forEach((bd) => {
              if (!bd.from || !bd.to) return;
              const start = new Date(bd.from);
              const end = new Date(bd.to);
              const bufferStart = new Date(start);
              bufferStart.setDate(
                bufferStart.getDate() - (item.preRentalBufferDays || 2),
              );
              const bufferEnd = new Date(end);
              bufferEnd.setDate(
                bufferEnd.getDate() + (item.postRentalBufferDays || 3),
              );
              let d = new Date(bufferStart);
              while (d <= bufferEnd) {
                dates.push(d.toISOString().split("T")[0]);
                d.setDate(d.getDate() + 1);
              }
            });
          }
          return [...new Set(dates)];
        })(),
        blockedRanges: (() => {
          if (!Array.isArray(item.blockedDates)) return [];
          return item.blockedDates
            .filter((bd) => bd.from && bd.to)
            .map((bd) => {
              const start = new Date(bd.from);
              const end = new Date(bd.to);
              const bufferStart = new Date(start);
              bufferStart.setDate(
                bufferStart.getDate() - (item.preRentalBufferDays || 2),
              );
              const bufferEnd = new Date(end);
              bufferEnd.setDate(
                bufferEnd.getDate() + (item.postRentalBufferDays || 3),
              );
              return {
                from: bufferStart.toISOString().split("T")[0],
                to: bufferEnd.toISOString().split("T")[0],
                reason: bd.reason || "Booked",
              };
            });
        })(),
        preRentalBufferDays: item.preRentalBufferDays || 2,
        rentedCount: item.timesRented || 0,
      },
      delivery: {
        dispatchBeforeDays: item.preRentalBufferDays || 2,
        returnAfterDays: item.postRentalBufferDays || 1,
      },
      rules: { allowCustomRange: true },
      sizes:
        item.sizes && item.sizes.length > 0
          ? item.sizes.map((s) => ({ label: s.label || s, available: true }))
          : [],
    },
    preloved: {
      enabled: prelovedEnabled,
      pricing: {
        price: item.listingPrice || 0,
        originalPrice: item.originalRetailPrice || 0,
      },
    },
    buy: {
      enabled: buyEnabled,
      pricing: { price: item.listingPrice || 0, discountPrice: 0 },
    },
  };

  return {
    ...item,
    type:
      item.rent === true
        ? "rental"
        : item.preloved === true
          ? "preloved"
          : item.isNew === true
            ? "new"
            : rentEnabled
              ? "rental"
              : prelovedEnabled
                ? "preloved"
                : "new",
    title: item.name || item.title,
    subTitle: item.subtitle || item.subTitle || "",
    modes: builtModes,
    // Shortcut getters for legacy code
    rent: builtModes.rent,
    preloved: builtModes.preloved,
    buy: builtModes.buy,
    new: builtModes.buy,

    description: item.description || item.story || "",
    story: item.story || item.description || "",
    craft: item.craft || "",
    rating: item.rating || 0,
    reviews: item.reviewCount || item.reviews || 0,
    condition: { grade: item.condition?.grade || item.condition || "pristine" },
    disclosure: item.honestDisclosure || item.disclosure || "",
    sku: item.sku || "",
    tags: (() => {
      const dbTags = item.tags || [];
      // Only filter out HOK internal product-code tags like "HOK-IW-001", "HOK-PRD-123"
      const meaningfulTags = dbTags.filter(
        (t) => !String(t).match(/^HOK-[A-Z0-9-]+$/i),
      );
      if (meaningfulTags.length > 0) return meaningfulTags;
      // Auto-generate from product attributes as fallback (when only SKU tags exist)
      return [
        item.category,
        item.occasion,
        item.color,
        item.material,
        item.embellishments,
      ].filter(Boolean);
    })(),
    relatedProductIds: item.relatedProductIds || [],
    weight: item.weight || "",
    originalRetailPrice: item.originalRetailPrice || 0,
    bestSuitedForHeight: item.bestSuitedForHeight || "",
    measurements: item.measurements || null,
    measurementsCm: item.measurementsCm || null,
    rentInfo: { rentedCount: item.timesRented || 0 },
    badges: [
      buyEnabled || item.tag === "NEW" ? "BUY NEW" : null,
      item.condition === "pristine" || !item.condition ? "NEVER WORN" : null,
    ].filter(Boolean),
    delivery: item.deliveryTiming || "",
    sizeNote: item.sizeNote || item.sizeGuide || "",
    note: item.sizeGuide || item.sizeNote || "",
    taxNote: item.taxNote || "",
    packaging:
      item.packaging && item.packaging.length > 0
        ? item.packaging
        : ["Arrives in a signature HOK protective garment bag."],
    sizeTable: item.sizeTable || [],
    features: item.features || [],
    images: item.images || item.image || [],
    colors: (() => {
      if (Array.isArray(item.colors) && item.colors.length > 0) {
        return item.colors.map((c, i) => {
          if (typeof c === "string") {
            const hex = c.startsWith("#") ? c : "#8B0000";
            return {
              code: hex,
              name: c,
              images: item.images || item.image || [],
            };
          }
          return {
            code: c.code || "#8B0000",
            name: c.name || `Color ${i + 1}`,
            images: c.images || item.images || item.image || [],
          };
        });
      }
      if (item.color) {
        const colorNames = String(item.color)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const colorHexMap = {
          red: "#C0392B",
          crimson: "#990000",
          maroon: "#800000",
          emerald: "#0B6623",
          green: "#27AE60",
          blue: "#2980B9",
          navy: "#1B263B",
          midnight: "#191970",
          pink: "#E8A598",
          blush: "#F4C2C2",
          wine: "#722F37",
          burgundy: "#800020",
          gold: "#D4AF37",
          mustard: "#E1AD01",
          black: "#1A1A1A",
          white: "#FDFEFE",
          ivory: "#FFFFF0",
          beige: "#F5F5DC",
          purple: "#8E44AD",
          peach: "#FFE5B4",
          yellow: "#F1C40F",
        };
        return colorNames.map((cName) => {
          const lower = cName.toLowerCase();
          const foundHex =
            colorHexMap[lower] ||
            (lower.includes("red")
              ? "#C0392B"
              : lower.includes("green")
                ? "#0B6623"
                : lower.includes("blue")
                  ? "#2980B9"
                  : lower.includes("pink")
                    ? "#E8A598"
                    : lower.includes("gold")
                      ? "#D4AF37"
                      : "#8B0000");
          return {
            code: foundHex,
            name: cName,
            images: item.images || item.image || [],
          };
        });
      }
      return [];
    })(),
    sizes:
      item.sizes && item.sizes.length > 0
        ? item.sizes
        : ["XS", "S", "M", "L", "XL"],
    shipping:
      item.shipping && item.shipping.length > 0
        ? item.shipping
        : [
            { method: "Standard", time: "5-7 Business Days", cost: "Free" },
            { method: "Express", time: "2-3 Business Days", cost: "₹500" },
          ],
    care:
      item.care && item.care.length > 0
        ? item.care
        : ["Dry clean only", "Do not bleach", "Iron on low heat"],
    details: {
      fabric: item.material || item.details?.fabric || "",
      technique: item.technique || item.details?.technique || "",
      includes: item.setIncludes || item.details?.includes || "",
      delivery: item.deliveryTiming || item.details?.delivery || "",
      color: item.color || item.details?.color || "",
      thread:
        item.threadYarnDetail || item.threadWork || item.details?.thread || "",
      occasion: item.occasion || item.details?.occasion || "",
      origin: item.origin || item.details?.origin || "",
      embellishments: item.embellishments || item.details?.embellishments || "",
    },
  };
};
/* ================= COMPONENT ================= */
export default function ProductList() {
  const [hoveredId, setHoveredId] = useState(null);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    fetch(`${backendUrl}/api/web-products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          // Map backend products to the expected UI format if needed, or just use as is
          // Assume backend returns standard format for now
          setFetchedProducts(data.data);
        } else {
          setFetchedProducts(products); // fallback to hardcoded
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setFetchedProducts(products); // fallback
      })
      .finally(() => setLoading(false));
  }, []);

  const displayProducts =
    fetchedProducts.length > 0 ? fetchedProducts : products;

  return (
    <section className="luxury-products">
      <Container>
        {/* HEADER */}
        <div className="lux-header">
          <div>
            <p className="sub">FROM THE SAME HOUSE</p>
            <h2>
              Our <span>Collection</span>
            </h2>
          </div>

          <Link to="/products" className="p-view-all">
            VIEW ALL
          </Link>
        </div>

        {/* GRID */}
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <Row className="g-4 justify-content-start">
            {displayProducts.map((item, index) => (
              <Col lg={3} md={4} sm={6} xs={6} key={item.id || item._id}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/product/${item.id || item._id}`}
                    state={{ product: makeProductDetail(item) }}
                    className="text-decoration-none"
                  >
                    <div
                      className="lux-card"
                      onMouseEnter={() => setHoveredId(item.id || item._id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* IMAGE */}
                      <div className="img-box">
                        <img
                          src={
                            hoveredId === (item.id || item._id) &&
                            (item.image?.[1] || item.images?.[1])
                              ? (item.image?.[1] || item.images?.[1])
                              : (item.image?.[0] || item.images?.[0]) ||
                                "https://via.placeholder.com/300x400"
                          }
                          alt={item.name || item.title}
                        />

                        {item.tag && (
                          <span className={`badge-${item.tag.toLowerCase()}`}>
                            {item.tag}
                          </span>
                        )}

                        <button
                          className="wishlist"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // 🔥 IMPORTANT

                            const wishlistStore =
                              import("../store/wishlistStore").then((m) =>
                                m.default.getState(),
                              );
                            wishlistStore.then((store) =>
                              store.toggleWishlist(
                                (item.id || item._id).toString(),
                              ),
                            );
                          }}
                        >
                          <Heart
                            size={16}
                            fill={(() => {
                              // Dynamic fill based on store - we'll handle this purely visually or with a React hook later if needed
                              // For now, let's keep it simple
                              return "none";
                            })()}
                          />
                        </button>

                        <div className="overlay"></div>
                      </div>

                      {/* TEXT */}
                      <div className="info">
                        <p className="designer">
                          {item.designer || item.brand || "House of Kaira"}
                        </p>
                        <h6 className="product-name">{item.name || item.title}</h6>
                        <div className="price-wrap">
                          <span className="price">
                            ₹
                            {item.price ||
                              item.modes?.rent?.pricing?.pricePerDay ||
                              0}
                          </span>
                          {item.oldPrice && (
                            <span className="old-price">{item.oldPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
}
