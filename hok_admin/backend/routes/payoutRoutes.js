import express from "express";
import {
  getPayouts,
  getPayoutById,
  createPayout,
  markPayoutPaid,
  exportPayouts,
  updatePayoutStatus,
  updatePayout,
} from "../controllers/payoutController.js";
import {
  enforceDecisionIfAdmin,
  enforceSectionIfAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Existing routes
router.get("/payouts", enforceSectionIfAdmin("payouts", "View"), getPayouts);
router.get("/payouts/export/csv", enforceDecisionIfAdmin("download_lists"), exportPayouts);
router.get("/payouts/:id", enforceSectionIfAdmin("payouts", "View"), getPayoutById);
router.post("/payouts", enforceSectionIfAdmin("payouts", "Edit"), createPayout);
router.patch("/payouts/:id/paid", enforceDecisionIfAdmin("approve_pay_lister_payouts"), markPayoutPaid);
router.patch("/payouts/:id/approve", enforceDecisionIfAdmin("approve_pay_lister_payouts"), markPayoutPaid);
router.patch("/payouts/:id/status", enforceSectionIfAdmin("payouts", "Edit"), updatePayoutStatus);
router.patch("/payouts/:id", enforceSectionIfAdmin("payouts", "Edit"), updatePayout);

export default router;
