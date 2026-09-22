import express from "express";
import { 
  getListers, 
  getLister, 
  createLister, 
  updateLister, 
  deleteLister,
  updateBankDetails,
  getListerListings, getListerPayouts, getListerCommunications, addListerCommunication,
  getListerActivities, addListerActivity, getListerRecalls, createListerRecall, updateListerRecall
} from "../controllers/listerController.js";

const router = express.Router();

router.get("/", getListers); 
router.post("/", createLister); 
router.get("/:id", getLister); 
router.put("/:id", updateLister); 
router.delete("/:id", deleteLister); 
router.put("/:id/bank-details", updateBankDetails);
router.get("/:id/listings", getListerListings);
router.get("/:id/payouts", getListerPayouts);
router.get("/:id/communications", getListerCommunications);
router.post("/:id/communications", addListerCommunication);
router.get("/:id/activities", getListerActivities);
router.post("/:id/activities", addListerActivity);
router.get("/:id/recalls", getListerRecalls);
router.post("/:id/recalls", createListerRecall);
router.patch("/:id/recalls/:recallId", updateListerRecall);

export default router;
