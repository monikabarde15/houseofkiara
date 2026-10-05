import express from "express";
import { setConsent } from "../controllers/consentController.js";

const router = express.Router();

/**
 * POST /api/consent
 * Spec Section 11.1 - Server-set hok_consent cookie
 */
router.post("/consent", setConsent);

export default router;
