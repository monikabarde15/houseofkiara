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

const router = express.Router();

// 1. Pages list
router.get("/", getPages);
router.post("/", savePage);

// 2. Specific page dynamic content (fieldValues, answers, settings)
router.get("/content", getPageContent);
router.post("/content", savePageContent);

// 3. Figures register
router.get("/figures", getFigures);
router.post("/figures", saveFigure);

// 4. Publish pending changes
router.post("/publish", publishChanges);

export default router;

