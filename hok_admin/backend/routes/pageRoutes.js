import express from "express";
import {
  getPages,
  savePage,
  getPageContent,
  savePageContent,
  getFigures,
  saveFigure,
  publishChanges,
} from "../controllers/pageController.js";
import {
  enforceDecisionIfAdmin,
  enforceSectionIfAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Pages list
router.get("/", getPages);
router.post("/", enforceSectionIfAdmin("pages", "Edit"), savePage);

// 2. Specific page dynamic content (fieldValues, answers, settings)
router.get("/content", getPageContent);
router.post("/content", enforceSectionIfAdmin("pages", "Edit"), savePageContent);

// 3. Figures register
router.get("/figures", getFigures);
router.post("/figures", enforceSectionIfAdmin("pages", "Edit"), saveFigure);

// 4. Publish pending changes
router.post("/publish", enforceDecisionIfAdmin("publish_to_website"), publishChanges);

export default router;

