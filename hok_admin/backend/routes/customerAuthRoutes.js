import express from "express";
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  logout,
  googleLogin,
  getMe,
  toggleWishlist,
  getWishlist,
  getMyOrders,
  getMyOrderById,
  placeOrder,
  cancelOrder,
} from "../controllers/customerAuthController.js";
import { requireCustomerAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication Endpoints
router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/resend-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", forgotPassword);
router.post("/request-password-reset", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/google", googleLogin);

// Current User Profile
router.get("/me", requireCustomerAuth, getMe);

// Customer Wishlist
router.post("/wishlist/:productId", requireCustomerAuth, toggleWishlist);
router.get("/wishlist", requireCustomerAuth, getWishlist);

// Customer Orders
router.get("/orders", requireCustomerAuth, getMyOrders);
router.get("/orders/:orderId", requireCustomerAuth, getMyOrderById);
router.post("/orders/place", requireCustomerAuth, placeOrder);
router.post("/orders/:orderId/cancel", requireCustomerAuth, cancelOrder);

export default router;
