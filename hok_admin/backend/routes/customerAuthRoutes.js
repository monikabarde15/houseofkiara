import express from "express";
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  googleLogin,
  getMe
} from "../controllers/customerAuthController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  toggleWishlist,
  getWishlist
} from "../controllers/customerAuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleLogin);
router.get("/me", requireAuth, getMe);

// Wishlist
router.post("/wishlist/:productId", requireAuth, toggleWishlist);
router.get("/wishlist", requireAuth, getWishlist);

export default router;
