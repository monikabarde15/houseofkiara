import crypto from "crypto";
import TeamRole from "../models/TeamRole.js";
import TeamMember from "../models/TeamMember.js";
import TeamHistory from "../models/TeamHistory.js";
import Admin from "../models/Admin.js";
import {
  DECISIONS,
  DECISION_BY_ID,
  FOUNDER_ROLE_ID,
  SECTIONS,
  SECTION_BY_ID,
  computeEffectivePermissions,
  getFirstName,
  normalizeMemberStatusForApi,
  normalizeMemberStatusForDb,
} from "../config/permissionsRegistry.js";
import {
  countActiveFounders,
  ensureTeamPermissionsSeeded,
  formatHistoryForApi,
  formatMemberForApi,
  formatRoleForApi,
  generateUniquePersonId,
  generateUniqueRoleId,
  getEligibleHandOverMembers,
  getOpenWorkForMember,
  handOverOpenWork,
  isShownNameTaken,
  isValidEmail,
  isWorkEmailTaken,
  recordHistory,
  sanitizeDecisionsForStorage,
  sanitizeLevelsForStorage,
  validateWhatsApp,
} from "../services/teamPermissionsService.js";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getActorDisplayName(req) {
  return (
    req.teamMember?.shownOnRecordsAs ||
    req.admin?.name ||
    "Soumya"
  );
}

/**
 * GET /api/team-permissions/bootstrap (Founder only)
 */
export const getBootstrap = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const [roles, members, history] = await Promise.all([
      TeamRole.find({}).sort({ sortOrder: 1, createdAt: 1 }),
      TeamMember.find({}),
      TeamHistory.find({}).sort({ occurredAt: -1, createdAt: -1 }),
    ]);

    return res.json({
      success: true,
      data: {
        roles: roles.map(formatRoleForApi),
        members: members.map(formatMemberForApi),
        history: history.map(formatHistoryForApi),
        currentPersonId: req.teamMember?.personId || null,
        sections: SECTIONS,
        decisions: DECISIONS,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load Team & Permissions.",
      error: error.message,
    });
  }
};

/**
 * GET /api/team-permissions/roster (Any authenticated admin)
 * Used across the panel for "Assigned to", "Received by", "Approved by", Notifications chips, etc.
 */
export const getRoster = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const [roles, members] = await Promise.all([
      TeamRole.find({}).sort({ sortOrder: 1, createdAt: 1 }),
      TeamMember.find({}),
    ]);

    return res.json({
      success: true,
      data: {
        roles: roles.map(formatRoleForApi),
        members: members.map((m) => ({
          personId: m.personId,
          fullName: m.fullName,
          shownOnRecordsAs: m.shownOnRecordsAs,
          olderSpellings: Array.isArray(m.olderSpellings) ? m.olderSpellings : [],
          roleId: m.roleId,
          status: normalizeMemberStatusForApi(m.status),
        })),
        currentPersonId: req.teamMember?.personId || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load team roster.",
      error: error.message,
    });
  }
};

/**
 * GET /api/team-permissions/members/:personId/open-work (Founder only)
 */
export const getMemberOpenWork = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const [member, allMembers, allRoles] = await Promise.all([
      TeamMember.findOne({ personId }),
      TeamMember.find({}),
      TeamRole.find({ archived: false }),
    ]);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    const items = await getOpenWorkForMember(member);
    const eligibleRecipients = getEligibleHandOverMembers(
      items,
      allMembers,
      allRoles,
      member.personId,
    ).map((m) => ({
      personId: m.personId,
      fullName: m.fullName,
      shownOnRecordsAs: m.shownOnRecordsAs,
      roleId: m.roleId,
      roleName: allRoles.find((r) => r.roleId === m.roleId)?.name || "",
    }));

    return res.json({
      success: true,
      data: {
        personId: member.personId,
        items,
        eligibleRecipients,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load open work.",
      error: error.message,
    });
  }
};

/**
 * POST /api/team-permissions/members/invite (Founder only)
 */
export const inviteMember = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const {
      fullName = "",
      shownOnRecordsAs = "",
      workEmail = "",
      roleId = "",
      whatsappNumber = "",
    } = req.body || {};

    const [allMembers, allRoles] = await Promise.all([
      TeamMember.find({}),
      TeamRole.find({ archived: false }),
    ]);

    const errors = {};
    const cleanName = String(fullName).trim();
    if (!cleanName) {
      errors.fullName = "Add their name.";
    }

    const cleanEmail = String(workEmail).trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      errors.workEmail = "Add a work email the invite can go to.";
    } else if (isWorkEmailTaken(cleanEmail, allMembers)) {
      errors.workEmail = "Someone on the team already signs in with this.";
    }

    const selectedRole = allRoles.find((r) => r.roleId === roleId);
    if (!selectedRole) {
      errors.roleId = "Pick the role they will hold.";
    }

    const waCheck = validateWhatsApp(whatsappNumber);
    if (!waCheck.valid) {
      errors.whatsappNumber = waCheck.message;
    }

    const cleanShown = String(shownOnRecordsAs || "").trim() || getFirstName(cleanName);
    if (cleanName && !cleanShown) {
      errors.shownOnRecordsAs = "Add how records should show this person.";
    } else if (cleanShown) {
      const conflict = isShownNameTaken(cleanShown, allMembers);
      if (conflict) {
        const conflictStatus = normalizeMemberStatusForApi(conflict.status);
        const firstWord = getFirstName(cleanName) || cleanShown;
        const tag = selectedRole ? selectedRole.name.split(/\s+/)[0] : "";
        const suggested = tag ? `${firstWord} (${tag})` : "";
        const suggestionFree =
          suggested && !isShownNameTaken(suggested, allMembers);
        const baseMsg =
          conflictStatus === "Left"
            ? `“${cleanShown}” is kept for ${conflict.fullName}, who has left.`
            : `“${cleanShown}” is already used for ${conflict.fullName}.`;
        errors.shownOnRecordsAs = `${baseMsg} ${
          suggestionFree
            ? `Try ${suggested}.`
            : "Add a tag that tells them apart."
        }`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fix the highlighted fields.",
        errors,
      });
    }

    const nowIso = new Date().toISOString();
    const expiresIso = new Date(Date.now() + INVITE_TTL_MS).toISOString();
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const personId = generateUniquePersonId(cleanShown, allMembers);
    const actor = getActorDisplayName(req);

    const created = await TeamMember.create({
      personId,
      adminId: null,
      fullName: cleanName,
      shownOnRecordsAs: cleanShown,
      olderSpellings: [],
      roleId: selectedRole.roleId,
      status: "Invited",
      workEmail: cleanEmail,
      whatsappNumber: waCheck.normalized,
      addedAt: nowIso,
      addedBy: actor,
      invitedAt: nowIso,
      inviteToken,
      inviteExpiresAt: expiresIso,
      joinedAt: null,
      lastActiveAt: null,
      pausedSince: null,
      leftOn: null,
      hasSignedInOnce: false,
    });

    const hist = await recordHistory({
      kind: "people",
      who: actor,
      target: personId,
      message: `Invited ${cleanName} as ${selectedRole.name}`,
      occurredAt: nowIso,
    });

    return res.status(201).json({
      success: true,
      message: `Invite sent to ${cleanEmail}.`,
      data: {
        member: formatMemberForApi(created),
        historyEntry: formatHistoryForApi(hist),
        inviteToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to send invite.",
      error: error.message,
    });
  }
};

/**
 * POST /api/team-permissions/members/:personId/resend-invite
 */
export const resendInvite = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const member = await TeamMember.findOne({ personId });
    if (!member || normalizeMemberStatusForApi(member.status) !== "Invited") {
      return res.status(400).json({
        success: false,
        message: "Only pending invites can be resent.",
      });
    }

    const nowIso = new Date().toISOString();
    member.inviteToken = crypto.randomBytes(32).toString("hex");
    member.invitedAt = nowIso;
    member.inviteExpiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
    await member.save();

    const hist = await recordHistory({
      kind: "people",
      who: getActorDisplayName(req),
      target: member.personId,
      message: `Resent the invite to ${member.fullName}`,
      occurredAt: nowIso,
    });

    return res.json({
      success: true,
      message: `Invite resent to ${member.workEmail}. The new link works for 7 days.`,
      data: {
        member: formatMemberForApi(member),
        historyEntry: formatHistoryForApi(hist),
        inviteToken: member.inviteToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to resend invite.",
      error: error.message,
    });
  }
};

/**
 * POST /api/team-permissions/members/:personId/cancel-invite
 */
export const cancelInvite = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const member = await TeamMember.findOne({ personId });
    if (!member || normalizeMemberStatusForApi(member.status) !== "Invited") {
      return res.status(400).json({
        success: false,
        message: "Only pending invites can be cancelled.",
      });
    }

    const nowIso = new Date().toISOString();
    const actor = getActorDisplayName(req);
    const wasOnTeamBefore = Boolean(member.hasSignedInOnce || member.joinedAt);

    if (wasOnTeamBefore) {
      member.status = "Left";
      member.inviteToken = null;
      member.inviteExpiresAt = null;
      if (!member.leftOn) member.leftOn = nowIso;
      await member.save();

      const hist = await recordHistory({
        kind: "people",
        who: actor,
        target: member.personId,
        message: `Cancelled the invite for ${member.fullName}; back in past team members`,
        occurredAt: nowIso,
      });

      return res.json({
        success: true,
        data: {
          removed: false,
          member: formatMemberForApi(member),
          historyEntry: formatHistoryForApi(hist),
        },
      });
    }

    const fullName = member.fullName;
    await TeamMember.deleteOne({ personId: member.personId });

    const hist = await recordHistory({
      kind: "people",
      who: actor,
      target: personId,
      message: `Cancelled the invite for ${fullName}`,
      occurredAt: nowIso,
    });

    return res.json({
      success: true,
      data: {
        removed: true,
        personId,
        historyEntry: formatHistoryForApi(hist),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to cancel invite.",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/team-permissions/members/:personId/details
 */
export const updateMemberDetails = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const [member, allMembers] = await Promise.all([
      TeamMember.findOne({ personId }),
      TeamMember.find({}),
    ]);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }
    if (normalizeMemberStatusForApi(member.status) === "Left") {
      return res.status(400).json({
        success: false,
        message: "Details for past team members cannot be changed.",
      });
    }

    const {
      fullName = "",
      shownOnRecordsAs = "",
      workEmail = "",
      whatsappNumber = "",
    } = req.body || {};

    const errors = {};
    const nextName = String(fullName).trim();
    const nextShown = String(shownOnRecordsAs).trim();
    const nextEmail = String(workEmail).trim().toLowerCase();
    const waCheck = validateWhatsApp(whatsappNumber);

    if (!nextName) errors.fullName = "Add a name.";
    if (!nextShown) {
      errors.shownOnRecordsAs = "Add how records should show this person.";
    } else {
      const conflict = isShownNameTaken(nextShown, allMembers, member.personId);
      if (conflict) {
        const conflictStatus = normalizeMemberStatusForApi(conflict.status);
        errors.shownOnRecordsAs =
          conflictStatus === "Left"
            ? `“${nextShown}” is kept for ${conflict.fullName}, who has left.`
            : `“${nextShown}” is already used for ${conflict.fullName}.`;
      }
    }

    if (!isValidEmail(nextEmail)) {
      errors.workEmail = "Add a work email they can sign in with.";
    } else if (isWorkEmailTaken(nextEmail, allMembers, member.personId)) {
      errors.workEmail = "Someone on the team already signs in with this.";
    }

    if (!waCheck.valid) {
      errors.whatsappNumber = waCheck.message;
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fix the highlighted fields.",
        errors,
      });
    }

    const oldName = member.fullName;
    const oldShown = member.shownOnRecordsAs;
    const oldEmail = String(member.workEmail || "").toLowerCase();
    const oldWa = String(member.whatsappNumber || "");

    const nowIso = new Date().toISOString();
    const actor = getActorDisplayName(req);
    const historyEntries = [];

    if (nextShown !== oldShown) {
      const spellings = Array.isArray(member.olderSpellings)
        ? [...member.olderSpellings]
        : [];
      if (oldShown && !spellings.includes(oldShown)) {
        spellings.push(oldShown);
      }
      member.olderSpellings = spellings;
      member.shownOnRecordsAs = nextShown;
    }

    member.fullName = nextName;
    member.workEmail = nextEmail;
    member.whatsappNumber = waCheck.normalized;
    await member.save();

    // Sync linked Admin record if present
    if (member.adminId) {
      const adm = await Admin.findById(member.adminId).catch(() => null);
      if (adm) {
        adm.name = nextName;
        adm.email = nextEmail;
        await adm.save().catch(() => {});
      }
    }

    if (nextShown !== oldShown) {
      const h = await recordHistory({
        kind: "people",
        who: actor,
        target: member.personId,
        message: `Records now show ${nextName} as ${nextShown} (was ${oldShown})`,
        occurredAt: nowIso,
      });
      historyEntries.push(formatHistoryForApi(h));
    }
    if (nextName !== oldName) {
      const h = await recordHistory({
        kind: "people",
        who: actor,
        target: member.personId,
        message: `Name changed from ${oldName} to ${nextName}`,
        occurredAt: nowIso,
      });
      historyEntries.push(formatHistoryForApi(h));
    }
    if (nextEmail !== oldEmail) {
      const h = await recordHistory({
        kind: "people",
        who: actor,
        target: member.personId,
        message: `Work email changed to ${nextEmail}`,
        occurredAt: nowIso,
      });
      historyEntries.push(formatHistoryForApi(h));
    }
    if (waCheck.normalized !== oldWa) {
      const h = await recordHistory({
        kind: "people",
        who: actor,
        target: member.personId,
        message: waCheck.normalized
          ? `WhatsApp number set to ${waCheck.normalized}`
          : "WhatsApp number removed",
        occurredAt: nowIso,
      });
      historyEntries.push(formatHistoryForApi(h));
    }

    return res.json({
      success: true,
      message: `Saved. ${getFirstName(nextName)}’s details are up to date.`,
      data: {
        member: formatMemberForApi(member),
        historyEntries,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to save details.",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/team-permissions/members/:personId/role
 */
export const changeMemberRole = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const { roleId } = req.body || {};

    if (req.teamMember?.personId === personId) {
      return res.status(400).json({
        success: false,
        message: "You can never change your own role.",
      });
    }

    const [member, allMembers, allRoles] = await Promise.all([
      TeamMember.findOne({ personId }),
      TeamMember.find({}),
      TeamRole.find({}),
    ]);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }
    if (normalizeMemberStatusForApi(member.status) === "Left") {
      return res.status(400).json({
        success: false,
        message: "Cannot change the role of someone who has left.",
      });
    }

    const activeFounders = await countActiveFounders(allMembers);
    if (
      member.roleId === FOUNDER_ROLE_ID &&
      normalizeMemberStatusForApi(member.status) === "Active" &&
      activeFounders <= 1 &&
      roleId !== FOUNDER_ROLE_ID
    ) {
      return res.status(400).json({
        success: false,
        message: "The only active Founder cannot have their role changed.",
      });
    }

    const oldRole = allRoles.find((r) => r.roleId === member.roleId);
    const newRole = allRoles.find((r) => r.roleId === roleId && !r.archived);
    if (!newRole) {
      return res.status(400).json({
        success: false,
        message: "Role not found or archived.",
      });
    }

    if (member.roleId === newRole.roleId) {
      return res.json({
        success: true,
        data: { member: formatMemberForApi(member), historyEntry: null },
      });
    }

    const oldRoleName = oldRole?.name || member.roleId;
    member.roleId = newRole.roleId;
    await member.save();

    if (member.adminId) {
      const adm = await Admin.findById(member.adminId).catch(() => null);
      if (adm) {
        adm.roleId = newRole.roleId;
        await adm.save().catch(() => {});
      }
    }

    const nowIso = new Date().toISOString();
    const hist = await recordHistory({
      kind: "people",
      who: getActorDisplayName(req),
      target: member.personId,
      message: `Changed ${member.fullName}’s role from ${oldRoleName} to ${newRole.name}`,
      occurredAt: nowIso,
    });

    return res.json({
      success: true,
      message: `${getFirstName(member.fullName)} is now ${newRole.name}.`,
      data: {
        member: formatMemberForApi(member),
        historyEntry: formatHistoryForApi(hist),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to change role.",
      error: error.message,
    });
  }
};

/**
 * POST /api/team-permissions/members/:personId/hand-over
 */
export const handOverMemberWork = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const { toPersonId } = req.body || {};

    const [fromMember, toMember, allMembers, allRoles] = await Promise.all([
      TeamMember.findOne({ personId }),
      TeamMember.findOne({ personId: toPersonId }),
      TeamMember.find({}),
      TeamRole.find({ archived: false }),
    ]);

    if (!fromMember || !toMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    const openItems = await getOpenWorkForMember(fromMember);
    const eligible = getEligibleHandOverMembers(
      openItems,
      allMembers,
      allRoles,
      fromMember.personId,
    );
    if (!eligible.some((m) => m.personId === toMember.personId)) {
      return res.status(400).json({
        success: false,
        message: `${toMember.shownOnRecordsAs} cannot work on all open items.`,
      });
    }

    const movedCount = await handOverOpenWork(fromMember, toMember, "manual");
    const nowIso = new Date().toISOString();
    const hist = await recordHistory({
      kind: "people",
      who: getActorDisplayName(req),
      target: fromMember.personId,
      message: `Handed ${movedCount} open ${movedCount === 1 ? "item" : "items"} from ${fromMember.shownOnRecordsAs} to ${toMember.shownOnRecordsAs}`,
      occurredAt: nowIso,
    });

    return res.json({
      success: true,
      message: `${movedCount} open ${movedCount === 1 ? "item" : "items"} now with ${toMember.shownOnRecordsAs}.`,
      data: {
        movedCount,
        historyEntry: formatHistoryForApi(hist),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to hand over open work.",
      error: error.message,
    });
  }
};

/**
 * POST /api/team-permissions/members/:personId/pause
 */
export const pauseMember = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    if (req.teamMember?.personId === personId) {
      return res.status(400).json({
        success: false,
        message: "You cannot pause yourself.",
      });
    }

    const [member, allMembers] = await Promise.all([
      TeamMember.findOne({ personId }),
      TeamMember.find({}),
    ]);
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found." });
    }
    if (normalizeMemberStatusForApi(member.status) !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Only active team members can be paused.",
      });
    }

    const activeFounders = await countActiveFounders(allMembers);
    if (member.roleId === FOUNDER_ROLE_ID && activeFounders <= 1) {
      return res.status(400).json({
        success: false,
        message: "The only active Founder cannot be paused or removed.",
      });
    }

    const nowIso = new Date().toISOString();
    member.status = normalizeMemberStatusForDb("Paused");
    member.pausedSince = nowIso;
    await member.save();

    if (member.adminId) {
      const adm = await Admin.findById(member.adminId).catch(() => null);
      if (adm) {
        adm.status = "Suspended";
        adm.sessionToken = null;
        await adm.save().catch(() => {});
      }
    }

    const hist = await recordHistory({
      kind: "people",
      who: getActorDisplayName(req),
      target: member.personId,
      message: `Paused ${member.fullName}’s access`,
      occurredAt: nowIso,
    });

    return res.json({
      success: true,
      data: {
        member: formatMemberForApi(member),
        historyEntry: formatHistoryForApi(hist),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to pause access.",
      error: error.message,
    });
  }
};

/**
 * POST /api/team-permissions/members/:personId/restore
 */
export const restoreMember = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const member = await TeamMember.findOne({ personId });
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found." });
    }
    if (normalizeMemberStatusForApi(member.status) !== "Paused") {
      return res.status(400).json({
        success: false,
        message: "Access is not paused.",
      });
    }

    const nowIso = new Date().toISOString();
    member.status = "Active";
    member.pausedSince = null;
    await member.save();

    if (member.adminId) {
      const adm = await Admin.findById(member.adminId).catch(() => null);
      if (adm) {
        adm.status = "Active";
        await adm.save().catch(() => {});
      }
    }

    const hist = await recordHistory({
      kind: "people",
      who: getActorDisplayName(req),
      target: member.personId,
      message: `Restored ${member.fullName}’s access`,
      occurredAt: nowIso,
    });

    return res.json({
      success: true,
      message: `Access restored. ${getFirstName(member.fullName)} can sign in again.`,
      data: {
        member: formatMemberForApi(member),
        historyEntry: formatHistoryForApi(hist),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to restore access.",
      error: error.message,
    });
  }
};

/**
 * POST /api/team-permissions/members/:personId/remove
 */
export const removeMember = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const { handOverToPersonId } = req.body || {};

    if (req.teamMember?.personId === personId) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself.",
      });
    }

    const [member, allMembers, allRoles] = await Promise.all([
      TeamMember.findOne({ personId }),
      TeamMember.find({}),
      TeamRole.find({ archived: false }),
    ]);

    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found." });
    }

    const currentStatus = normalizeMemberStatusForApi(member.status);
    if (currentStatus === "Left") {
      return res.status(400).json({
        success: false,
        message: "Person has already left the team.",
      });
    }

    const activeFounders = await countActiveFounders(allMembers);
    if (
      member.roleId === FOUNDER_ROLE_ID &&
      currentStatus === "Active" &&
      activeFounders <= 1
    ) {
      return res.status(400).json({
        success: false,
        message: "The only active Founder cannot be paused or removed.",
      });
    }

    const openItems = await getOpenWorkForMember(member);
    let movedCount = 0;
    let recipient = null;

    if (openItems.length > 0) {
      const eligible = getEligibleHandOverMembers(
        openItems,
        allMembers,
        allRoles,
        member.personId,
      );
      recipient =
        eligible.find((m) => m.personId === handOverToPersonId) || eligible[0];
      if (!recipient) {
        return res.status(400).json({
          success: false,
          message: "No active team member can receive their open work.",
        });
      }
      movedCount = await handOverOpenWork(member, recipient, "left");
    }

    const nowIso = new Date().toISOString();
    member.status = "Left";
    member.leftOn = nowIso;
    member.inviteToken = null;
    member.inviteExpiresAt = null;
    await member.save();

    if (member.adminId) {
      const adm = await Admin.findById(member.adminId).catch(() => null);
      if (adm) {
        adm.status = "Left";
        adm.sessionToken = null;
        await adm.save().catch(() => {});
      }
    }

    const histMsg =
      movedCount > 0 && recipient
        ? `Removed ${member.fullName} from the team and handed ${movedCount} open ${movedCount === 1 ? "item" : "items"} to ${recipient.shownOnRecordsAs}`
        : `Removed ${member.fullName} from the team`;

    const hist = await recordHistory({
      kind: "people",
      who: getActorDisplayName(req),
      target: member.personId,
      message: histMsg,
      occurredAt: nowIso,
    });

    const toastMsg =
      movedCount > 0 && recipient
        ? `${member.fullName} has been removed. ${movedCount} open ${movedCount === 1 ? "item" : "items"} now with ${recipient.shownOnRecordsAs}.`
        : `${member.fullName} has been removed.`;

    return res.json({
      success: true,
      message: toastMsg,
      data: {
        member: formatMemberForApi(member),
        movedCount,
        historyEntry: formatHistoryForApi(hist),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to remove team member.",
      error: error.message,
    });
  }
};

/**
 * POST /api/team-permissions/members/:personId/reinvite
 */
export const reinviteMember = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { personId } = req.params;
    const [member, allMembers, role] = await Promise.all([
      TeamMember.findOne({ personId }),
      TeamMember.find({}),
      TeamRole.find({}),
    ]);

    if (!member || normalizeMemberStatusForApi(member.status) !== "Left") {
      return res.status(400).json({
        success: false,
        message: "Only past team members can be re-invited.",
      });
    }

    const memberRole = role.find((r) => r.roleId === member.roleId);
    if (!memberRole || memberRole.archived) {
      return res.status(400).json({
        success: false,
        message: "Their previous role has been archived.",
      });
    }

    const emailConflict = isWorkEmailTaken(
      member.workEmail,
      allMembers,
      member.personId,
    );
    if (emailConflict) {
      return res.status(400).json({
        success: false,
        message: `Someone on the team already signs in with ${member.workEmail}. Change the work email first.`,
      });
    }

    const nowIso = new Date().toISOString();
    member.status = "Invited";
    member.invitedAt = nowIso;
    member.inviteToken = crypto.randomBytes(32).toString("hex");
    member.inviteExpiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
    await member.save();

    const hist = await recordHistory({
      kind: "people",
      who: getActorDisplayName(req),
      target: member.personId,
      message: `Re-invited ${member.fullName} as ${memberRole.name}`,
      occurredAt: nowIso,
    });

    return res.json({
      success: true,
      message: `Invite sent to ${member.workEmail}.`,
      data: {
        member: formatMemberForApi(member),
        historyEntry: formatHistoryForApi(hist),
        inviteToken: member.inviteToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to re-invite team member.",
      error: error.message,
    });
  }
};

/**
 * PUT /api/team-permissions/roles/save (Founder only)
 * Applies drafted role changes (new, renamed, described, levels, decisions, archived, restored)
 * atomically with a single timestamp in History.
 */
export const saveRolesBatch = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { roles: incomingRoles } = req.body || {};
    if (!Array.isArray(incomingRoles)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roles payload.",
      });
    }

    const [existingRoles, allMembers] = await Promise.all([
      TeamRole.find({}).sort({ sortOrder: 1, createdAt: 1 }),
      TeamMember.find({}),
    ]);

    const activeIncoming = incomingRoles.filter((r) => !r.archived);
    // Validate names on active roles (Spec 6.5)
    const seenNames = new Map();
    for (const r of activeIncoming) {
      const cleanName = String(r.name || "").trim();
      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: "A role needs a name.",
        });
      }
      const lower = cleanName.toLowerCase();
      if (seenNames.has(lower)) {
        return res.status(400).json({
          success: false,
          message: `Two roles are called “${cleanName}”.`,
        });
      }
      seenNames.set(lower, cleanName);
    }

    // Check archiving safety: cannot archive a role held by anyone who has not left
    for (const r of incomingRoles) {
      if (r.archived && r.roleId !== FOUNDER_ROLE_ID) {
        const holders = allMembers.filter(
          (m) =>
            m.roleId === r.roleId &&
            normalizeMemberStatusForApi(m.status) !== "Left",
        );
        if (holders.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Give ${holders.length} ${holders.length === 1 ? "person" : "people"} another role first.`,
          });
        }
      }
    }

    const existingById = new Map(existingRoles.map((r) => [r.roleId, r]));
    const workingRoles = [...existingRoles];
    const nowIso = new Date().toISOString();
    const actor = getActorDisplayName(req);
    const historyLines = [];
    let changeCount = 0;

    for (let idx = 0; idx < incomingRoles.length; idx += 1) {
      const inc = incomingRoles[idx];
      if (inc.roleId === FOUNDER_ROLE_ID || inc.isFixed) {
        continue; // Founder is fixed
      }

      const cleanName = String(inc.name || "").trim();
      const cleanDesc = String(inc.description || "").trim();
      const cleanLevels = sanitizeLevelsForStorage(inc.rawLevels || inc.levels || {});
      const effectivePreview = computeEffectivePermissions({
        roleId: inc.roleId || "temp",
        name: cleanName,
        levels: cleanLevels,
        decisions: inc.rawDecisions || inc.decisions || [],
      });
      const cleanDecisions = sanitizeDecisionsForStorage(
        inc.rawDecisions || inc.decisions || [],
        effectivePreview.levels,
      );
      const isArchived = Boolean(inc.archived);

      const prev = inc.roleId ? existingById.get(inc.roleId) : null;

      if (!prev) {
        if (isArchived) continue; // New role archived before ever being saved -> dropped
        const newRoleId =
          inc.roleId && !inc.roleId.startsWith("draft_")
            ? inc.roleId
            : generateUniqueRoleId(cleanName, workingRoles);

        const created = await TeamRole.create({
          roleId: newRoleId,
          name: cleanName,
          description: cleanDesc,
          colour: inc.colour || "#8A7E72",
          isFixed: false,
          archived: false,
          sortOrder: idx + 1,
          levels: cleanLevels,
          decisions: cleanDecisions,
        });
        workingRoles.push(created);

        historyLines.push({
          kind: "roles",
          who: actor,
          target: newRoleId,
          message: `Added the role ${cleanName}`,
        });
        changeCount += 1;
        continue;
      }

      // Existing role diffing
      const prevEffective = computeEffectivePermissions(prev);
      const prevName = String(prev.name || "").trim();
      const prevDesc = String(prev.description || "").trim();
      const prevArchived = Boolean(prev.archived);
      const prevLevels = prevEffective.levels;
      const prevDecisions = new Set(prevEffective.decisions);
      const nextDecisionsSet = new Set(cleanDecisions);

      if (!prevArchived && isArchived) {
        historyLines.push({
          kind: "roles",
          who: actor,
          target: prev.roleId,
          message: `Archived the role ${prevName}`,
        });
        changeCount += 1;
      } else if (prevArchived && !isArchived) {
        historyLines.push({
          kind: "roles",
          who: actor,
          target: prev.roleId,
          message: `Brought back the role ${cleanName}`,
        });
        changeCount += 1;
      }

      if (cleanName !== prevName) {
        historyLines.push({
          kind: "roles",
          who: actor,
          target: prev.roleId,
          message: `Renamed the role ${prevName} to ${cleanName}`,
        });
        changeCount += 1;
      }

      if (cleanDesc !== prevDesc) {
        historyLines.push({
          kind: "roles",
          who: actor,
          target: prev.roleId,
          message: `Rewrote what ${cleanName} does: “${cleanDesc}”`,
        });
        changeCount += 1;
      }

      for (const sec of SECTIONS) {
        if (!sec.inRolesTable) continue;
        const oldLvl = prevLevels[sec.id] || "Hidden";
        const newLvl = cleanLevels[sec.id] || "Hidden";
        if (oldLvl !== newLvl) {
          historyLines.push({
            kind: "roles",
            who: actor,
            target: prev.roleId,
            message: `${cleanName} · ${sec.label}: ${oldLvl} → ${newLvl}`,
          });
          changeCount += 1;
        }
      }

      for (const dec of DECISIONS) {
        const had = prevDecisions.has(dec.id);
        const has = nextDecisionsSet.has(dec.id);
        if (!had && has) {
          historyLines.push({
            kind: "roles",
            who: actor,
            target: prev.roleId,
            message: `${cleanName} can now ${dec.label.charAt(0).toLowerCase() + dec.label.slice(1)}`,
          });
          changeCount += 1;
        } else if (had && !has) {
          historyLines.push({
            kind: "roles",
            who: actor,
            target: prev.roleId,
            message: `${cleanName} can no longer ${dec.label.charAt(0).toLowerCase() + dec.label.slice(1)}`,
          });
          changeCount += 1;
        }
      }

      prev.name = cleanName;
      prev.description = cleanDesc;
      prev.colour = inc.colour || prev.colour || "#8A7E72";
      prev.archived = isArchived;
      prev.sortOrder = idx + 1;
      prev.levels = cleanLevels;
      prev.decisions = cleanDecisions;
      await prev.save();
    }

    const createdHistory = [];
    for (const line of historyLines) {
      const h = await recordHistory({ ...line, occurredAt: nowIso });
      createdHistory.push(formatHistoryForApi(h));
    }

    const updatedRoles = await TeamRole.find({}).sort({ sortOrder: 1, createdAt: 1 });

    return res.json({
      success: true,
      message: `Saved. ${changeCount} ${changeCount === 1 ? "change" : "changes"} now in force for everyone who holds the role. Each is in History.`,
      data: {
        roles: updatedRoles.map(formatRoleForApi),
        historyEntries: createdHistory,
        changeCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to save role changes.",
      error: error.message,
    });
  }
};
