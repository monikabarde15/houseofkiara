import express from "express";
import {
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  convertEnquiryToBooking,
  deleteEnquiry,
} from "../controllers/enquiryController.js";

const router = express.Router();

router.get("/enquiries", getEnquiries);
router.post("/enquiries", createEnquiry);
router.put("/enquiries/:id", updateEnquiry);
router.patch("/enquiries/:id", updateEnquiry);
router.post("/enquiries/:id/convert", convertEnquiryToBooking);
router.delete("/enquiries/:id", deleteEnquiry);

export default router;
