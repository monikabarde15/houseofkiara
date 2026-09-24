import express from "express";
import { 
  getListers, 
  getLister, 
  createLister, 
  updateLister, 
  deleteLister,
  updateBankDetails 
} from "../controllers/listerController.js";

const router = express.Router();

router.get("/", getListers); 
router.post("/", createLister); 
router.get("/:id", getLister); 
router.put("/:id", updateLister); 
router.delete("/:id", deleteLister); 
router.put("/:id/bank-details", updateBankDetails);

export default router;