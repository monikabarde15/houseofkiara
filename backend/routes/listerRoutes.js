import express from "express";
import { 
  getListers, 
  getLister, 
  createLister, 
  updateLister, 
  updateBankDetails 
} from "../controllers/listerController.js";

const router = express.Router();

// ✅ FIX: Yahan sirf "/" use karo, kyunki server.js mein "/api/listers" add ho chuka hai
router.get("/", getListers); 
router.post("/", createLister); 
router.get("/:id", getLister); 
router.put("/:id", updateLister); 
router.put("/:id/bank-details", updateBankDetails);

export default router;