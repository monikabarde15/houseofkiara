import express from "express";
import {
  getAllPromoCodes,
  getPromoCode,
  createPromoCode,
  updatePromoCode,
  togglePromoCodeStatus,
  deletePromoCode,
  logAttempt,
  getRefusedAttempts,
  validatePromoCodeForCheckout,
} from "../controllers/promotionController.js";
import { enforceDecisionIfAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPromoCodes);
router.get("/refused-attempts", getRefusedAttempts);
router.post("/log-attempt", logAttempt);
router.post("/validate", validatePromoCodeForCheckout);
router.get("/:code", getPromoCode);
router.post("/", enforceDecisionIfAdmin("create_change_promo_codes"), createPromoCode);
router.put("/:code", enforceDecisionIfAdmin("create_change_promo_codes"), updatePromoCode);
router.patch("/:code/toggle", enforceDecisionIfAdmin("create_change_promo_codes"), togglePromoCodeStatus);
router.delete("/:code", enforceDecisionIfAdmin("create_change_promo_codes"), deletePromoCode);

export default router;
