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
import { officialValidationGuard } from "../middleware/officialValidationGuard.js";
import {
  enforceSectionIfAdmin,
  enforceDecisionIfAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", enforceSectionIfAdmin("lyp", "View"), getSubmissions);
router.get("/assignees", enforceSectionIfAdmin("lyp", "View"), getAssignees);
router.get("/:id", enforceSectionIfAdmin("lyp", "View"), getSubmission);
router.post("/", upload.any(), officialValidationGuard, createSubmission);
router.put("/:id", enforceSectionIfAdmin("lyp", "Edit"), updateSubmission);
router.put(
  "/:id/decision",
  enforceSectionIfAdmin("lyp", "Edit"),
  enforceDecisionIfAdmin("decide_lyp_submission"),
  updateSubmissionDecision,
);
router.put("/:id/more-info", enforceSectionIfAdmin("lyp", "Edit"), requestMoreInfo);
router.post("/:id/seen", markSubmissionInfoSeen);
router.put("/:id/seen", markSubmissionInfoSeen);
router.post("/:id/reply", upload.any(), officialValidationGuard, replySubmissionInfo);
router.put("/:id/reply", upload.any(), officialValidationGuard, replySubmissionInfo);
router.post("/:id/withdraw", withdrawSubmission);
router.put("/:id/withdraw", withdrawSubmission);

export default router;
