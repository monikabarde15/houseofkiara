import express from "express";
import {
  getListers,
  getLister,
  createLister,
  updateLister,
  deleteLister,
  updateBankDetails,
  getListerListings,
  getListerPayouts,
  getListerCommunications,
  addListerCommunication,
  getListerActivities,
  addListerActivity,
  getListerRecalls,
  createListerRecall,
  updateListerRecall,
} from "../controllers/listerController.js";
import {
  enforceSectionIfAdmin,
  enforceDecisionWhenIfAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", enforceSectionIfAdmin("listers", "View"), getListers);
router.post("/", enforceSectionIfAdmin("listers", "Edit"), createLister);
router.get("/:id", enforceSectionIfAdmin("listers", "View"), getLister);
router.put(
  "/:id",
  enforceSectionIfAdmin("listers", "Edit"),
  enforceDecisionWhenIfAdmin(
    "verify_lister_bank",
    (req) => req.body?.bank?.verified === true,
  ),
  updateLister,
);
router.delete("/:id", enforceSectionIfAdmin("listers", "Edit"), deleteLister);
router.put(
  "/:id/bank-details",
  enforceSectionIfAdmin("listers", "Edit"),
  enforceDecisionWhenIfAdmin(
    "verify_lister_bank",
    (req) => req.body?.verified === true || req.body?.bank?.verified === true,
  ),
  updateBankDetails,
);
router.get("/:id/listings", enforceSectionIfAdmin("listers", "View"), getListerListings);
router.get("/:id/payouts", enforceSectionIfAdmin("listers", "View"), getListerPayouts);
router.get("/:id/communications", enforceSectionIfAdmin("listers", "View"), getListerCommunications);
router.post("/:id/communications", enforceSectionIfAdmin("listers", "Edit"), addListerCommunication);
router.get("/:id/activities", enforceSectionIfAdmin("listers", "View"), getListerActivities);
router.post("/:id/activities", enforceSectionIfAdmin("listers", "Edit"), addListerActivity);
router.get("/:id/recalls", enforceSectionIfAdmin("listers", "View"), getListerRecalls);
router.post("/:id/recalls", enforceSectionIfAdmin("listers", "Edit"), createListerRecall);
router.patch("/:id/recalls/:recallId", enforceSectionIfAdmin("listers", "Edit"), updateListerRecall);

export default router;
