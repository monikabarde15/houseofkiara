import express from "express";
import {
  getAllPromoCodes,
  getPromoCode,
  createPromoCode,
  updatePromoCode,
  togglePromoCodeStatus,
  deletePromoCode,
} from "../controllers/promotionController.js";

const router = express.Router();

router.get("/", getAllPromoCodes);
router.get("/:code", getPromoCode);
router.post("/", createPromoCode);
router.put("/:code", updatePromoCode);
router.patch("/:code/toggle", togglePromoCodeStatus);
router.delete("/:code", deletePromoCode);

export default router;
