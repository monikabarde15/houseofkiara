import express from "express";
import { getAuthStatus, loginAdmin, registerAdmin } from "../controllers/authController.js";

const router = express.Router();
router.get("/auth/status", getAuthStatus);
router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);
export default router;
