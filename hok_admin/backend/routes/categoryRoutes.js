import express from "express";
import {
  getMainCategories,
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
  getSizes,
  createSize,
  deleteSize,
} from "../controllers/categoryController.js";
import {
  getSizeFitOptions,
  addSizeFitOption,
  updateSizeFitOptions,
} from "../controllers/sizeFitOptionsController.js";
import {
  enforceAnySectionIfAdmin,
  enforceSectionIfAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/occasions", getOccasions);
router.post("/occasions", enforceSectionIfAdmin("master_data", "Edit"), createOccasion);
router.get("/colors", getColors);
router.post("/colors", enforceSectionIfAdmin("master_data", "Edit"), createColor);
router.get("/fabric-care", getFabricCare);
router.post("/fabric-care", enforceSectionIfAdmin("master_data", "Edit"), createFabricCare);
router.get("/sizes", getSizes);
router.post("/sizes", enforceSectionIfAdmin("products", "Edit"), createSize);
router.delete("/sizes/:name", enforceSectionIfAdmin("products", "Edit"), deleteSize);
router.get("/size-fit-options", getSizeFitOptions);
router.post("/size-fit-options", enforceSectionIfAdmin("products", "Edit"), addSizeFitOption);
router.put("/size-fit-options", enforceSectionIfAdmin("master_data", "Edit"), updateSizeFitOptions);
router.get("/main-categories", getMainCategories);
router.get("/", getCategories);
router.post("/", enforceAnySectionIfAdmin(["products", "master_data"], "Edit"), createCategory);
router.put("/:id", enforceAnySectionIfAdmin(["products", "master_data"], "Edit"), updateCategory);
router.delete("/:id", enforceAnySectionIfAdmin(["products", "master_data"], "Edit"), deleteCategory);

export default router;
