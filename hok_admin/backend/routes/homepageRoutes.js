import express from "express";
import {
  getHeroSection,
  getHiwSection,
  getFeaturedSection,
  getCategorySection,
  getOccasionsSection,
  getHomepageData,
  updateHeroSection,
  updateHiwSection,
  updateFeaturedSection,
  updateCategorySection,
  updateOccasionsSection,
  updateHomepage,
} from "../controllers/homepageController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to verify admin authentication
const protectAdmin = async (req, res, next) => {
  if (req.headers.authorization) {
    return requireAdminAuth(req, res, next);
  }
  if (process.env.NODE_ENV === "production") {
    return res.status(401).json({
      success: false,
      message: "Authorization token required (Bearer format).",
    });
  }
  next();
};

// Storefront & public read endpoints
router.get("/hero", getHeroSection);
router.get("/how-it-works", getHiwSection);
router.get("/hiw", getHiwSection);
router.get("/featured-pieces", getFeaturedSection);
router.get("/featured", getFeaturedSection);
router.get("/category", getCategorySection);
router.get("/shop-by-category", getCategorySection);
router.get("/occasions", getOccasionsSection);
router.get("/shop-by-occasion", getOccasionsSection);
router.get("/", getHomepageData);

// Protected admin endpoints
router.put("/hero", protectAdmin, updateHeroSection);
router.put("/how-it-works", protectAdmin, updateHiwSection);
router.put("/hiw", protectAdmin, updateHiwSection);
router.put("/featured-pieces", protectAdmin, updateFeaturedSection);
router.put("/featured", protectAdmin, updateFeaturedSection);
router.put("/category", protectAdmin, updateCategorySection);
router.put("/shop-by-category", protectAdmin, updateCategorySection);
router.put("/occasions", protectAdmin, updateOccasionsSection);
router.put("/shop-by-occasion", protectAdmin, updateOccasionsSection);
router.put("/", protectAdmin, updateHomepage);

export default router;
