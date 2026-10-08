import express from "express";
import {
  getHeroSection,
  getHiwSection,
  getFeaturedSection,
  getCategorySection,
  getOccasionsSection,
  getCommitmentSection,
  getDesignersSection,
  getTestimonialsSection,
  getInstagramSection,
  getHomepageData,
  updateHeroSection,
  updateHiwSection,
  updateFeaturedSection,
  updateCategorySection,
  updateOccasionsSection,
  updateCommitmentSection,
  updateDesignersSection,
  updateTestimonialsSection,
  updateInstagramSection,
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
router.get("/commitment", getCommitmentSection);
router.get("/our-commitment", getCommitmentSection);
router.get("/commit", getCommitmentSection);
router.get("/designers", getDesignersSection);
router.get("/featured-designers", getDesignersSection);
router.get("/testimonials", getTestimonialsSection);
router.get("/testi", getTestimonialsSection);
router.get("/instagram", getInstagramSection);
router.get("/insta", getInstagramSection);
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
router.put("/commitment", protectAdmin, updateCommitmentSection);
router.put("/our-commitment", protectAdmin, updateCommitmentSection);
router.put("/commit", protectAdmin, updateCommitmentSection);
router.put("/designers", protectAdmin, updateDesignersSection);
router.put("/featured-designers", protectAdmin, updateDesignersSection);
router.put("/testimonials", protectAdmin, updateTestimonialsSection);
router.put("/testi", protectAdmin, updateTestimonialsSection);
router.put("/instagram", protectAdmin, updateInstagramSection);
router.put("/insta", protectAdmin, updateInstagramSection);
router.put("/", protectAdmin, updateHomepage);

export default router;
