import express from "express";
import {
  getDesigners,
  getDesignerById,
  createDesigner,
  updateDesigner,
  deleteDesigner,
  reorderFeaturedDesigners,
  updateDesignerType
} from "../controllers/designerController.js";

const router = express.Router();

router.get("/", getDesigners);
router.post("/", createDesigner);
router.put("/bulk/reorder-featured", reorderFeaturedDesigners);
router.put("/bulk/update-type", updateDesignerType);
router.get("/:id", getDesignerById);
router.put("/:id", updateDesigner);
router.delete("/:id", deleteDesigner);

export default router;
