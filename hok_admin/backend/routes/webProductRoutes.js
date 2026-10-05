import express from "express";
import {
  getWebProducts,
  getFiltersData,
  getWebProductById,
} from "../controllers/webProductController.js";

const router = express.Router();

// GET /api/web-products/filters
router.get("/filters", getFiltersData);

// GET /api/web-products
router.get("/", getWebProducts);

// GET /api/web-products/:id
router.get("/:id", getWebProductById);

export default router;
