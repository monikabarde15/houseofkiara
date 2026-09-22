import express from "express";
import { getPayouts, getPayoutById, createPayout, markPayoutPaid, exportPayouts, updatePayoutStatus, updatePayout } from "../controllers/payoutController.js";

const router = express.Router();

// Existing routes
router.get("/payouts", getPayouts); 
router.get("/payouts/export/csv", exportPayouts); 
router.get("/payouts/:id", getPayoutById); 
router.post("/payouts", createPayout); 
router.patch("/payouts/:id/paid", markPayoutPaid); 
router.patch("/payouts/:id/approve", markPayoutPaid); 
router.patch("/payouts/:id/status", updatePayoutStatus);
router.patch("/payouts/:id", updatePayout);

export default router;