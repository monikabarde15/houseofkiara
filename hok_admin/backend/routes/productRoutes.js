import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  archiveProduct,
  restoreProduct,
  updateProductImages,
  incrementTimesRented,
  updateListingModes,
  updateMeasurements,
  getProductActivity
} from '../controllers/productController.js';

import { 
  checkProductAvailability,
  reserveProduct 
} from '../controllers/bookingController.js';

import {
  addBlockedDate,
  removeBlockedDate,
  getProductPayoutHistory,
  addExternalBooking,
  getAvailabilityCalendar,
  updateRelatedProducts
} from '../controllers/productSectionController.js';
import { calculateProductQuote } from '../controllers/productQuoteController.js';

import { getPayouts } from '../controllers/payoutController.js';

const router = express.Router();

// ========== PRODUCT ROUTES ==========
// GET routes
router.get('/products', getProducts);
router.get('/products/:id/availability', checkProductAvailability);
router.get('/products/:id/quote', calculateProductQuote);
router.get('/products/:id/calendar', getAvailabilityCalendar);
router.get('/products/:productId/payout-history', getProductPayoutHistory);
router.get('/products/:id/activity', getProductActivity);
router.get('/products/:id', getProductById);

// POST routes
router.post('/products', createProduct);

// PUT routes
router.put('/products/:id', updateProduct);
router.put('/products/:id/images', updateProductImages);

// DELETE routes
router.delete('/products/:id', deleteProduct);

// PATCH/UPDATE routes
router.patch('/products/:id/archive', archiveProduct);
router.patch('/products/:id/restore', restoreProduct);
router.patch('/products/:id/increment-rented', incrementTimesRented);
router.patch('/products/:id/listing-modes', updateListingModes);

// ========== BOOKING & SECTION ROUTES ==========
router.post('/products/:id/reserve', reserveProduct);
// Alias retained for the client booking helper.
router.post('/products/:id/bookings', reserveProduct);
router.post('/products/:id/external-booking', addExternalBooking);
router.post('/products/:id/external-bookings', addExternalBooking);
router.post('/products/:id/blocked-dates', addBlockedDate);
router.delete('/products/:id/blocked-dates/:index', removeBlockedDate);
router.patch('/products/:id/measurements', updateMeasurements);
router.put('/products/:id/related-products', updateRelatedProducts);

export default router;
