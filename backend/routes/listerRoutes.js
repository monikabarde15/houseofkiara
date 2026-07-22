import express from "express";
import { getListers, getLister, createLister, updateLister, updateBankDetails } from "../controllers/listerController.js";
const router = express.Router();
router.get("/listers", getListers); router.post("/listers", createLister); router.get("/listers/:id", getLister); router.put("/listers/:id", updateLister); router.put("/listers/:id/bank-details", updateBankDetails);
export default router;
