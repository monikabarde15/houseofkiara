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

  exportOffersCSV

} from "../controllers/offerController.js";

const router = express.Router();



// ===============================
// Dashboard
// ===============================

router.get("/offers/dashboard", getOfferDashboard);

router.get("/offers/recent", getRecentOffers);

router.get("/offers/statistics", getOfferStatistics);



// ===============================
// Export
// ===============================

router.get("/offers/export/csv", exportOffersCSV);



// ===============================
// Offer Listing
// ===============================

router.get("/offers", getOffers);

router.get("/offers/trash", getDeletedOffers);

router.get("/offers/:id", getOfferById);



// ===============================
// CRUD
// ===============================

router.post("/offers", createOffer);

router.put("/offers/:id", updateOffer);

router.delete("/offers/:id", deleteOffer);

router.delete(
  "/offers/:id/permanent",
  permanentDeleteOffer
);



// ===============================
// Restore
// ===============================

router.patch(
  "/offers/:id/restore",
  restoreOffer
);



// ===============================
// Bulk Operations
// ===============================

router.delete(
  "/offers/bulk-delete",
  bulkDeleteOffers
);

router.patch(
  "/offers/bulk-restore",
  bulkRestoreOffers
);

router.delete(
  "/offers/bulk-permanent-delete",
  bulkPermanentDeleteOffers
);



// ===============================
// Duplicate
// ===============================

router.post(
  "/offers/:id/duplicate",
  duplicateOffer
);



// ===============================
// Status
// ===============================

router.patch(
  "/offers/:id/status",
  updateOfferStatus
);



// ===============================
// Counter Offer
// ===============================

router.post(
  "/offers/:id/counter-offer",
  sendCounterOffer
);

router.get(
  "/offers/:id/counter-offers",
  getCounterOfferHistory
);



// ===============================
// Assignment
// ===============================

router.post(
  "/offers/:id/assign",
  assignOffer
);

router.get(
  "/offers/:id/assignment-history",
  getAssignmentHistory
);



// ===============================
// Notes
// ===============================

router.post(
  "/offers/:id/notes",
  addOfferNote
);

router.get(
  "/offers/:id/notes",
  getOfferNotes
);



// ===============================
// Timeline
// ===============================

router.get(
  "/offers/:id/timeline",
  getOfferTimeline
);

export default router;