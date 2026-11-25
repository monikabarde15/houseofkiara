import crypto from "crypto";
import { promisify } from "util";
import Admin from "../models/Admin.js";
import TeamMember from "../models/TeamMember.js";
import {
  ensureTeamPermissionsSeeded,
  formatMemberForApi,
  formatRoleForApi,
  recordHistory,
  resolveAdminContext,
} from "../services/teamPermissionsService.js";
import {
  FOUNDER_ROLE_ID,
  getFirstName,
  normalizeMemberStatusForApi,
} from "../config/permissionsRegistry.js";

const scrypt = promisify(crypto.scrypt);
const hashPassword = async (
  password,
  salt = crypto.randomBytes(16).toString("hex"),
) => ({
  salt,
  hash: (await scrypt(password, salt, 64)).toString("hex"),
});

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password (8+ characters) are required.",
      });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email is already registered.",
      });
    }

    const credentials = await hashPassword(password);
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const admin = await Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: credentials.hash,
      passwordSalt: credentials.salt,
      sessionToken,
      roleId: FOUNDER_ROLE_ID,
      status: "Active",
    });

    const ctx = await resolveAdminContext(admin);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      data: {
        token: sessionToken,
        admin: {
          name: admin.name,
          email: admin.email,
          personId: ctx.member?.personId || null,
          shownOnRecordsAs: ctx.member?.shownOnRecordsAs || getFirstName(admin.name),
          roleId: ctx.permissions?.roleId || FOUNDER_ROLE_ID,
          roleName: ctx.permissions?.roleName || "Founder",
          isFounder: Boolean(ctx.permissions?.isFounder),
          permissions: ctx.permissions,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to register admin.",
      error: error.message,
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    await ensureTeamPermissionsSeeded();
    const emailLower = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: emailLower });
    if (!admin) {
      const invitedOrPaused = await TeamMember.findOne({ workEmail: emailLower }).catch(() => null);
      if (invitedOrPaused) {
        const st = normalizeMemberStatusForApi(invitedOrPaused.status);
        if (st === "Invited") {
          return res.status(403).json({
            success: false,
            message: "Please accept your invite link to set your password before signing in.",
          });
        }
        if (st === "Paused") {
          return res.status(403).json({
            success: false,
            message: "Your access is paused. Please ask a Founder to restore it.",
          });
        }
        if (st === "Left") {
          return res.status(403).json({
            success: false,
            message: "Your account is no longer active on this team.",
          });
        }
      }
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const credentials = await hashPassword(password, admin.passwordSalt);
    const submittedHash = Buffer.from(String(credentials.hash || ""), "hex");
    const storedHash = Buffer.from(String(admin.passwordHash || ""), "hex");
    if (
      submittedHash.length === 0 ||
      storedHash.length === 0 ||
      submittedHash.length !== storedHash.length ||
      !crypto.timingSafeEqual(submittedHash, storedHash)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const ctx = await resolveAdminContext(admin);
    if (ctx.member) {
      const st = normalizeMemberStatusForApi(ctx.member.status);
      if (st === "Paused") {
        return res.status(403).json({
          success: false,
          message: "Your access is paused. Please ask a Founder to restore it.",
        });
      }
      if (st === "Left") {
        return res.status(403).json({
          success: false,
          message: "Your account is no longer active on this team.",
        });
      }
      if (st === "Invited") {
        return res.status(403).json({
          success: false,
          message: "Please accept your invite link to set your password before signing in.",
        });
      }
      ctx.member.lastActiveAt = new Date().toISOString();
      await ctx.member.save().catch(() => {});
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    admin.sessionToken = sessionToken;
    await admin.save();

    return res.json({
      success: true,
      message: "Login successful.",
      data: {
        token: sessionToken,
        admin: {
          name: ctx.member?.fullName || admin.name,
          email: admin.email,
          personId: ctx.member?.personId || null,
          shownOnRecordsAs: ctx.member?.shownOnRecordsAs || getFirstName(admin.name),
          roleId: ctx.permissions?.roleId || FOUNDER_ROLE_ID,
          roleName: ctx.permissions?.roleName || "Founder",
          isFounder: Boolean(ctx.permissions?.isFounder),
          permissions: ctx.permissions,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to login.",
      error: error.message,
    });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.body?.token) {
      token = req.body.token;
    }

    if (token) {
      const admin = await Admin.findOne({ sessionToken: token });
      if (admin) {
        admin.sessionToken = null;
        await admin.save();
      }
    }

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to logout.",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const ctx = await resolveAdminContext(req.admin);
    return res.json({
      success: true,
      data: {
        admin: {
          name: ctx.member?.fullName || req.admin.name,
          email: req.admin.email,
          personId: ctx.member?.personId || null,
          shownOnRecordsAs:
            ctx.member?.shownOnRecordsAs || getFirstName(req.admin.name),
          roleId: ctx.permissions?.roleId || FOUNDER_ROLE_ID,
          roleName: ctx.permissions?.roleName || "Founder",
          isFounder: Boolean(ctx.permissions?.isFounder),
          permissions: ctx.permissions,
        },
        person: ctx.member ? formatMemberForApi(ctx.member) : null,
        role: ctx.role ? formatRoleForApi(ctx.role) : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin profile.",
      error: error.message,
    });
  }
};

export const getAuthStatus = async (_req, res) => {
  try {
    const hasAdmin = Boolean(await Admin.exists({}));
    return res.json({
      success: true,
      data: {
        registered: hasAdmin,
        initialized: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to check auth status.",
      error: error.message,
    });
  }
};

export const getAdmins = async (_req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const [admins, members] = await Promise.all([
      Admin.find({}, { name: 1, email: 1, personId: 1, roleId: 1 }),
      TeamMember.find({}),
    ]);
    const memberByEmail = new Map(
      members.map((m) => [String(m.workEmail || "").toLowerCase(), m]),
    );
    return res.json({
      success: true,
      data: admins.map((a) => {
        const m = memberByEmail.get(String(a.email || "").toLowerCase());
        return {
          id: a._id,
          name: m?.shownOnRecordsAs || a.name,
          fullName: m?.fullName || a.name,
          email: a.email,
          personId: m?.personId || a.personId || null,
          roleId: m?.roleId || a.roleId || FOUNDER_ROLE_ID,
          status: m ? normalizeMemberStatusForApi(m.status) : "Active",
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admins.",
      error: error.message,
    });
  }
};

export const getInviteInfo = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const token = String(req.query?.token || "").trim();
    if (!token) {
      return res.status(400).json({ success: false, message: "Invite token is required." });
    }
    const member = await TeamMember.findOne({ inviteToken: token });
    if (!member || normalizeMemberStatusForApi(member.status) !== "Invited") {
      return res.status(404).json({
        success: false,
        message: "This invite link is no longer valid.",
      });
    }
    const exp = member.inviteExpiresAt
      ? new Date(member.inviteExpiresAt).getTime()
      : 0;
    if (!exp || Date.now() > exp) {
      return res.status(410).json({
        success: false,
        message: "This invite link has expired. Ask a Founder to resend it.",
      });
    }
    return res.json({
      success: true,
      data: {
        fullName: member.fullName,
        workEmail: member.workEmail,
        shownOnRecordsAs: member.shownOnRecordsAs,
        roleId: member.roleId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to verify invite.",
      error: error.message,
    });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    await ensureTeamPermissionsSeeded();
    const { token = "", password = "" } = req.body || {};
    const cleanToken = String(token || "").trim();
    if (!cleanToken || !password || String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: "A valid invite token and a password (8+ characters) are required.",
      });
    }

    const member = await TeamMember.findOne({ inviteToken: cleanToken });
    if (!member || normalizeMemberStatusForApi(member.status) !== "Invited") {
      return res.status(404).json({
        success: false,
        message: "This invite link is no longer valid.",
      });
    }
    const exp = member.inviteExpiresAt
      ? new Date(member.inviteExpiresAt).getTime()
      : 0;
    if (!exp || Date.now() > exp) {
      return res.status(410).json({
        success: false,
        message: "This invite link has expired. Ask a Founder to resend it.",
      });
    }

    const credentials = await hashPassword(password);
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const emailLower = String(member.workEmail || "").toLowerCase().trim();

    let admin = await Admin.findOne({ email: emailLower });
    if (admin) {
      admin.name = member.fullName;
      admin.passwordHash = credentials.hash;
      admin.passwordSalt = credentials.salt;
      admin.sessionToken = sessionToken;
      admin.roleId = member.roleId;
      admin.personId = member.personId;
      admin.status = "Active";
      await admin.save();
    } else {
      admin = await Admin.create({
        name: member.fullName,
        email: emailLower,
        passwordHash: credentials.hash,
        passwordSalt: credentials.salt,
        sessionToken,
        roleId: member.roleId,
        personId: member.personId,
        status: "Active",
      });
    }

    const nowIso = new Date().toISOString();
    const isFirstEverSignIn = !member.hasSignedInOnce;
    member.adminId = String(admin._id);
    member.status = "Active";
    member.inviteToken = null;
    member.inviteExpiresAt = null;
    if (!member.joinedAt) member.joinedAt = nowIso;
    member.lastActiveAt = nowIso;
    member.hasSignedInOnce = true;
    await member.save();

    if (isFirstEverSignIn) {
      await recordHistory({
        kind: "people",
        who: member.shownOnRecordsAs,
        target: member.personId,
        message: `${getFirstName(member.fullName)} accepted their invite and signed in for the first time`,
        occurredAt: nowIso,
      });
    }

    const ctx = await resolveAdminContext(admin);
    return res.json({
      success: true,
      message: "Welcome to House of Kaira.",
      data: {
        token: sessionToken,
        admin: {
          name: member.fullName,
          email: admin.email,
          personId: member.personId,
          shownOnRecordsAs: member.shownOnRecordsAs,
          roleId: ctx.permissions?.roleId || member.roleId,
          roleName: ctx.permissions?.roleName || "",
          isFounder: Boolean(ctx.permissions?.isFounder),
          permissions: ctx.permissions,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to accept invite.",
      error: error.message,
    });
  }
};
