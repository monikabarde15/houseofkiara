import express from "express";
import {
  getDesigners,
  getDesignerById,
  createDesigner,
  updateDesigner,
  deleteDesigner
} from "../controllers/designerController.js";

const router = express.Router();

router.get("/", getDesigners);
router.get("/:id", getDesignerById);
router.post("/", createDesigner);
router.put("/:id", updateDesigner);
router.delete("/:id", deleteDesigner);

export default router;
