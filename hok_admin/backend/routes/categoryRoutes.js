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
import { enforceSectionIfAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/occasions", getOccasions);
router.post("/occasions", enforceSectionIfAdmin("master_data", "Edit"), createOccasion);
router.get("/colors", getColors);
router.post("/colors", enforceSectionIfAdmin("master_data", "Edit"), createColor);
router.get("/fabric-care", getFabricCare);
router.post("/fabric-care", enforceSectionIfAdmin("master_data", "Edit"), createFabricCare);
router.get("/", getCategories);
router.post("/", enforceSectionIfAdmin("master_data", "Edit"), createCategory);
router.put("/:id", enforceSectionIfAdmin("master_data", "Edit"), updateCategory);
router.delete("/:id", enforceSectionIfAdmin("master_data", "Edit"), deleteCategory);

export default router;
