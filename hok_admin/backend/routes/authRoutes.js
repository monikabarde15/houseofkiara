import express from "express";
import {
  getAuthStatus,
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  getMe,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/auth/status", getAuthStatus);
router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);
router.post("/auth/logout", logoutAdmin);
router.get("/auth/me", requireAuth, getMe);

export default router;
