import express from "express";
import {
  getSubmissions,
  getSubmission,
  createSubmission,
  updateSubmission,
  updateSubmissionDecision,
  requestMoreInfo,
  markSubmissionInfoSeen,
  replySubmissionInfo,
  getAssignees,
} from "../controllers/submissionController.js";
import { withdrawSubmission } from "../controllers/customerProfileController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getSubmissions);
router.get("/assignees", getAssignees);
router.get("/:id", getSubmission);
router.post("/", upload.any(), createSubmission);
router.put("/:id", updateSubmission);
router.put("/:id/decision", updateSubmissionDecision);
router.put("/:id/more-info", requestMoreInfo);
router.post("/:id/seen", markSubmissionInfoSeen);
router.put("/:id/seen", markSubmissionInfoSeen);
router.post("/:id/reply", upload.any(), replySubmissionInfo);
router.put("/:id/reply", upload.any(), replySubmissionInfo);
router.post("/:id/withdraw", withdrawSubmission);
router.put("/:id/withdraw", withdrawSubmission);

export default router;
