import express from "express";
import {
  getProfile,
  updateProfile,
  requestPasswordReset,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/customerProfileController.js";
import { requireCustomerAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer Profile Endpoints (Self-service, requires authentication)
router.get("/", requireCustomerAuth, getProfile);
router.get("/me", requireCustomerAuth, getProfile);
router.put("/", requireCustomerAuth, updateProfile);
router.patch("/", requireCustomerAuth, updateProfile);

// Password Reset Request from Profile
router.post("/change-password", requireCustomerAuth, requestPasswordReset);
router.post("/request-password-reset", requireCustomerAuth, requestPasswordReset);

// Customer Address Management
router.get("/addresses", requireCustomerAuth, getAddresses);
router.post("/addresses", requireCustomerAuth, addAddress);
router.put("/addresses/:addressId", requireCustomerAuth, updateAddress);
router.delete("/addresses/:addressId", requireCustomerAuth, deleteAddress);
router.patch("/addresses/:addressId/default", requireCustomerAuth, setDefaultAddress);

export default router;
