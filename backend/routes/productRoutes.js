import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct, archiveProduct, restoreProduct, updateProductImages } from "../controllers/productController.js";
import { checkProductAvailability } from "../controllers/availabilityController.js";
import { reserveProduct } from "../controllers/bookingController.js";
import { getAvailabilityCalendar, addBlockedDate, removeBlockedDate, getProductActivity, getProductPayoutHistory, updateRelatedProducts, updateProductLister, addExternalBooking } from "../controllers/productSectionController.js";
import { calculateProductQuote } from "../controllers/productQuoteController.js";
const router = express.Router();
router.get("/products", getProducts); router.get("/products/:id/availability", checkProductAvailability); router.get("/products/:id/quote", calculateProductQuote); router.get("/products/:id/calendar", getAvailabilityCalendar); router.post("/products/:id/bookings", reserveProduct); router.post("/products/:id/external-bookings", addExternalBooking); router.post("/products/:id/blocked-dates", addBlockedDate); router.delete("/products/:id/blocked-dates/:index", removeBlockedDate); router.get("/products/:id/activity", getProductActivity); router.get("/products/:id/payout-history", getProductPayoutHistory); router.put("/products/:id/related-products", updateRelatedProducts); router.put("/products/:id/lister", updateProductLister); router.put("/products/:id/images", updateProductImages); router.patch("/products/:id/archive", archiveProduct); router.patch("/products/:id/restore", restoreProduct); router.post("/products", createProduct); router.put("/products/:id", updateProduct); router.delete("/products/:id", deleteProduct);
export default router;
