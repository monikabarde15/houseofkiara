import express from "express";
import { requireAdminAuth, requireFounder } from "../middleware/authMiddleware.js";
import {
  cancelInvite,
  changeMemberRole,
  createRole,
  getBootstrap,
  getMemberOpenWork,
  getRoster,
  handOverMemberWork,
  inviteMember,
  pauseMember,
  reinviteMember,
  removeMember,
  resendInvite,
  restoreMember,
  saveRolesBatch,
  setMemberPassword,
  updateMemberDetails,
} from "../controllers/teamPermissionsController.js";

const router = express.Router();

// Roster for "Assigned to", "Approved by", "Received by", Notifications chips across the panel
router.get("/roster", requireAdminAuth, getRoster);

// Everything below is strictly Founder-only
router.get("/bootstrap", requireAdminAuth, requireFounder, getBootstrap);

// People management (immediate effect)
router.get(
  "/members/:personId/open-work",
  requireAdminAuth,
  requireFounder,
  getMemberOpenWork,
);
router.post(
  "/members/invite",
  requireAdminAuth,
  requireFounder,
  inviteMember,
);
router.post(
  "/members/:personId/resend-invite",
  requireAdminAuth,
  requireFounder,
  resendInvite,
);
router.post(
  "/members/:personId/cancel-invite",
  requireAdminAuth,
  requireFounder,
  cancelInvite,
);
router.patch(
  "/members/:personId/details",
  requireAdminAuth,
  requireFounder,
  updateMemberDetails,
);
router.patch(
  "/members/:personId/role",
  requireAdminAuth,
  requireFounder,
  changeMemberRole,
);
router.post(
  "/members/:personId/hand-over",
  requireAdminAuth,
  requireFounder,
  handOverMemberWork,
);
router.post(
  "/members/:personId/pause",
  requireAdminAuth,
  requireFounder,
  pauseMember,
);
router.post(
  "/members/:personId/restore",
  requireAdminAuth,
  requireFounder,
  restoreMember,
);
router.post(
  "/members/:personId/remove",
  requireAdminAuth,
  requireFounder,
  removeMember,
);
router.post(
  "/members/:personId/reinvite",
  requireAdminAuth,
  requireFounder,
  reinviteMember,
);
router.post(
  "/members/:personId/set-password",
  requireAdminAuth,
  requireFounder,
  setMemberPassword,
);

// Roles create & batch save
router.post(
  "/roles",
  requireAdminAuth,
  requireFounder,
  createRole,
);
router.put(
  "/roles/save",
  requireAdminAuth,
  requireFounder,
  saveRolesBatch,
);

export default router;
