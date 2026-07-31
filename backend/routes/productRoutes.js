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
  updateMeasurements  // 👈 YEH IMPORT KARO
} from '../controllers/productController.js';
import { 
  checkProductAvailability,
  getProductCalendar,
  addExternalBooking,
  reserveProduct 
} from '../controllers/bookingController.js';

const router = express.Router();

// ========== PRODUCT ROUTES ==========
// GET routes
router.get('/products', getProducts);
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

// ========== BOOKING ROUTES ==========
router.get('/products/:id/availability', checkProductAvailability);
router.get('/products/:id/calendar', getProductCalendar);
router.post('/products/:id/reserve', reserveProduct);
router.post('/products/:id/external-booking', addExternalBooking);
router.patch('/products/:id/measurements', updateMeasurements);

export default router;