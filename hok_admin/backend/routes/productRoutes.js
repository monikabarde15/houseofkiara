import express from "express";
import {
  getProducts,
  getProductById,
  getNextSku,
  createProduct,
  updateProduct,
  deleteProduct,
  archiveProduct,
  restoreProduct,
  updateProductImages,
  incrementTimesRented,
  updateListingModes,
  updateMeasurements,
  getProductActivity,
} from "../controllers/productController.js";

import {
  checkProductAvailability,
  reserveProduct,
} from "../controllers/bookingController.js";

import {
  addBlockedDate,
  removeBlockedDate,
  getProductPayoutHistory,
  addExternalBooking,
  getAvailabilityCalendar,
  updateRelatedProducts,
} from "../controllers/productSectionController.js";
import { calculateProductQuote } from "../controllers/productQuoteController.js";

import { getPayouts } from "../controllers/payoutController.js";
import {
  enforceSectionIfAdmin,
  enforceDecisionWhenIfAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ========== PRODUCT ROUTES ==========
// GET routes
router.get("/products", getProducts);
router.get("/products/next-sku", getNextSku);
router.get("/products/:id/availability", checkProductAvailability);
router.get("/products/:id/quote", calculateProductQuote);
router.get("/products/:id/calendar", getAvailabilityCalendar);
router.get("/products/:productId/payout-history", getProductPayoutHistory);
router.get("/products/:id/activity", getProductActivity);
router.get("/products/:id", getProductById);

// POST routes
router.post(
  "/products",
  enforceSectionIfAdmin("products", "Edit"),
  enforceDecisionWhenIfAdmin(
    "put_piece_live",
    (req) => String(req.body?.status || "") === "Live",
  ),
  createProduct,
);

// PUT routes
router.put(
  "/products/:id",
  enforceSectionIfAdmin("products", "Edit"),
  enforceDecisionWhenIfAdmin(
    "put_piece_live",
    (req) => String(req.body?.status || "") === "Live",
  ),
  updateProduct,
);
router.put("/products/:id/images", enforceSectionIfAdmin("products", "Edit"), updateProductImages);

// DELETE routes
router.delete("/products/:id", enforceSectionIfAdmin("products", "Edit"), deleteProduct);

// PATCH/UPDATE routes
router.patch("/products/:id/archive", enforceSectionIfAdmin("products", "Edit"), archiveProduct);
router.patch("/products/:id/restore", enforceSectionIfAdmin("products", "Edit"), restoreProduct);
router.patch("/products/:id/increment-rented", enforceSectionIfAdmin("products", "Edit"), incrementTimesRented);
router.patch("/products/:id/listing-modes", enforceSectionIfAdmin("products", "Edit"), updateListingModes);

// ========== BOOKING & SECTION ROUTES ==========
router.post("/products/:id/reserve", reserveProduct);
// Alias retained for the client booking helper.
router.post("/products/:id/bookings", reserveProduct);
router.post("/products/:id/external-booking", enforceSectionIfAdmin("orders", "Edit"), addExternalBooking);
router.post("/products/:id/external-bookings", enforceSectionIfAdmin("orders", "Edit"), addExternalBooking);
router.post("/products/:id/blocked-dates", enforceSectionIfAdmin("calendar", "Edit"), addBlockedDate);
router.delete("/products/:id/blocked-dates/:index", enforceSectionIfAdmin("calendar", "Edit"), removeBlockedDate);
router.patch("/products/:id/measurements", enforceSectionIfAdmin("products", "Edit"), updateMeasurements);
router.put("/products/:id/related-products", enforceSectionIfAdmin("products", "Edit"), updateRelatedProducts);

export default router;
