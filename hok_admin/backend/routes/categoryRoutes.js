import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOccasions,
  createOccasion,
  getColors,
  createColor,
  getFabricCare,
  createFabricCare,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/occasions", getOccasions);
router.post("/occasions", createOccasion);
router.get("/colors", getColors);
router.post("/colors", createColor);
router.get("/fabric-care", getFabricCare);
router.post("/fabric-care", createFabricCare);
router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
