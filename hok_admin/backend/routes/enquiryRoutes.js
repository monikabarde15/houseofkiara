import express from "express";
import {
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  convertEnquiryToBooking,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
import { enforceSectionIfAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/enquiries", enforceSectionIfAdmin("enquiries", "View"), getEnquiries);
router.post("/enquiries", enforceSectionIfAdmin("enquiries", "Edit"), createEnquiry);
router.put("/enquiries/:id", enforceSectionIfAdmin("enquiries", "Edit"), updateEnquiry);
router.patch("/enquiries/:id", enforceSectionIfAdmin("enquiries", "Edit"), updateEnquiry);
router.post(
  "/enquiries/:id/convert",
  enforceSectionIfAdmin("enquiries", "Edit"),
  (req, res, next) =>
    req.body?.target === "offer"
      ? enforceSectionIfAdmin("offers", "Edit")(req, res, next)
      : enforceSectionIfAdmin("orders", "Edit")(req, res, next),
  convertEnquiryToBooking,
);
router.delete("/enquiries/:id", enforceSectionIfAdmin("enquiries", "Edit"), deleteEnquiry);

export default router;
