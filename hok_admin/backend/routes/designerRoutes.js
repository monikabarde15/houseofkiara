import express from "express";
import {
  getDesigners,
  getDesignerById,
  createDesigner,
  updateDesigner,
  deleteDesigner,
  reorderFeaturedDesigners,
  updateDesignerType,
} from "../controllers/designerController.js";
import {
  enforceSectionIfAdmin,
  enforceDecisionWhenIfAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", enforceSectionIfAdmin("designers", "View"), getDesigners);
router.post("/", enforceSectionIfAdmin("designers", "Edit"), createDesigner);
router.put("/bulk/reorder-featured", enforceSectionIfAdmin("designers", "Edit"), reorderFeaturedDesigners);
router.put("/bulk/update-type", enforceSectionIfAdmin("designers", "Edit"), updateDesignerType);
router.get("/:id", enforceSectionIfAdmin("designers", "View"), getDesignerById);
router.put(
  "/:id",
  enforceSectionIfAdmin("designers", "Edit"),
  enforceDecisionWhenIfAdmin(
    "set_or_change_prices",
    (req) =>
      req.body?.commissionRate !== undefined ||
      req.body?.commission !== undefined ||
      req.body?.paymentTerms !== undefined ||
      req.body?.buyNewPartner !== undefined,
  ),
  updateDesigner,
);
router.delete("/:id", enforceSectionIfAdmin("designers", "Edit"), deleteDesigner);

export default router;
