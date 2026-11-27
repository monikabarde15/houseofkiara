import express from "express";

import {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  permanentDeleteOffer,
  restoreOffer,
  getDeletedOffers,
  bulkDeleteOffers,
  bulkRestoreOffers,
  bulkPermanentDeleteOffers,
  duplicateOffer,
  updateOfferStatus,
  sendCounterOffer,
  getCounterOfferHistory,
  assignOffer,
  getAssignmentHistory,
  addOfferNote,
  getOfferNotes,
  getOfferTimeline,
  getOfferDashboard,
  getRecentOffers,
  getOfferStatistics,
  exportOffersCSV,
} from "../controllers/offerController.js";
import {
  enforceDecisionIfAdmin,
  enforceSectionIfAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// Dashboard
// ===============================

router.get("/offers/dashboard", enforceSectionIfAdmin("offers", "View"), getOfferDashboard);

router.get("/offers/recent", enforceSectionIfAdmin("offers", "View"), getRecentOffers);

router.get("/offers/statistics", enforceSectionIfAdmin("offers", "View"), getOfferStatistics);

// ===============================
// Export
// ===============================

router.get("/offers/export/csv", enforceDecisionIfAdmin("download_lists"), exportOffersCSV);

// ===============================
// Offer Listing
// ===============================

router.get("/offers", enforceSectionIfAdmin("offers", "View"), getOffers);

router.get("/offers/trash", enforceSectionIfAdmin("offers", "View"), getDeletedOffers);

router.get("/offers/:id", enforceSectionIfAdmin("offers", "View"), getOfferById);

// ===============================
// CRUD
// ===============================

router.post("/offers", enforceSectionIfAdmin("offers", "Edit"), createOffer);

router.put("/offers/:id", enforceSectionIfAdmin("offers", "Edit"), updateOffer);

router.delete("/offers/:id", enforceSectionIfAdmin("offers", "Edit"), deleteOffer);

router.delete("/offers/:id/permanent", enforceSectionIfAdmin("offers", "Edit"), permanentDeleteOffer);

// ===============================
// Restore
// ===============================

router.patch("/offers/:id/restore", enforceSectionIfAdmin("offers", "Edit"), restoreOffer);

// ===============================
// Bulk Operations
// ===============================

router.delete("/offers/bulk-delete", enforceSectionIfAdmin("offers", "Edit"), bulkDeleteOffers);

router.patch("/offers/bulk-restore", enforceSectionIfAdmin("offers", "Edit"), bulkRestoreOffers);

router.delete("/offers/bulk-permanent-delete", enforceSectionIfAdmin("offers", "Edit"), bulkPermanentDeleteOffers);

// ===============================
// Duplicate
// ===============================

router.post("/offers/:id/duplicate", enforceSectionIfAdmin("offers", "Edit"), duplicateOffer);

// ===============================
// Status
// ===============================

router.patch(
  "/offers/:id/status",
  enforceSectionIfAdmin("offers", "Edit"),
  enforceDecisionIfAdmin("accept_counter_decline_offer"),
  updateOfferStatus,
);

// ===============================
// Counter Offer
// ===============================

router.post(
  "/offers/:id/counter-offer",
  enforceSectionIfAdmin("offers", "Edit"),
  enforceDecisionIfAdmin("accept_counter_decline_offer"),
  sendCounterOffer,
);

router.get("/offers/:id/counter-offers", enforceSectionIfAdmin("offers", "View"), getCounterOfferHistory);

// ===============================
// Assignment
// ===============================

router.post("/offers/:id/assign", enforceSectionIfAdmin("offers", "Edit"), assignOffer);

router.get("/offers/:id/assignment-history", enforceSectionIfAdmin("offers", "View"), getAssignmentHistory);

// ===============================
// Notes
// ===============================

router.post("/offers/:id/notes", enforceSectionIfAdmin("offers", "Edit"), addOfferNote);

router.get("/offers/:id/notes", enforceSectionIfAdmin("offers", "View"), getOfferNotes);

// ===============================
// Timeline
// ===============================

router.get("/offers/:id/timeline", enforceSectionIfAdmin("offers", "View"), getOfferTimeline);

export default router;
