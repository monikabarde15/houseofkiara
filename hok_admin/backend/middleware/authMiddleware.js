import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";
import { resolveAdminContext } from "../services/teamPermissionsService.js";
import {
  DECISION_BY_ID,
  SECTION_BY_ID,
  normalizeMemberStatusForApi,
} from "../config/permissionsRegistry.js";

const JWT_SECRET = process.env.JWT_SECRET || "hok_super_secret_key_123";
const LAST_ACTIVE_THROTTLE_MS = 60 * 1000;

async function attachAdminPermissions(req, admin) {
  const { member, role, permissions } = await resolveAdminContext(admin);
  if (member) {
    const status = normalizeMemberStatusForApi(member.status);
    if (status === "Paused") {
      return {
        blockedStatus: 403,
        message: "Your access is paused. Please ask a Founder to restore it.",
      };
    }
    if (status === "Left") {
      return {
        blockedStatus: 403,
        message: "Your account is no longer active on this team.",
      };
    }
    if (status === "Invited") {
      return {
        blockedStatus: 403,
        message: "Please accept your invite link before signing in.",
      };
    }
    const lastMs = member.lastActiveAt
      ? new Date(member.lastActiveAt).getTime()
      : 0;
    if (!lastMs || Date.now() - lastMs > LAST_ACTIVE_THROTTLE_MS) {
      member.lastActiveAt = new Date().toISOString();
      await member.save().catch(() => {});
    }
  }
  req.admin = admin;
  req.teamMember = member;
  req.teamRole = role;
  req.effectivePermissions = permissions;
  return { blockedStatus: null };
}

export const requireCustomerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required (Bearer format).",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session has expired. Please sign in again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid authorization token.",
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Malformed authorization token.",
      });
    }

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer account not found or session expired.",
      });
    }

    if (customer.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account is currently suspended. Please contact support.",
      });
    }

    req.user = customer;
    req.customer = customer;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
      error: error.message,
    });
  }
};

export const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required (Bearer format).",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing.",
      });
    }

    const admin = await Admin.findOne({ sessionToken: token });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session token.",
      });
    }

    const check = await attachAdminPermissions(req, admin);
    if (check.blockedStatus) {
      return res.status(check.blockedStatus).json({
        success: false,
        message: check.message,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
      error: error.message,
    });
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required (Bearer format).",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing.",
      });
    }

    // Try Admin session token lookup first
    const admin = await Admin.findOne({ sessionToken: token });
    if (admin) {
      const check = await attachAdminPermissions(req, admin);
      if (check.blockedStatus) {
        return res.status(check.blockedStatus).json({
          success: false,
          message: check.message,
        });
      }
      return next();
    }

    // Fallback: Try JWT verification for Customer
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) {
        const customer = await Customer.findById(decoded.id);
        if (customer) {
          if (customer.status === "Suspended") {
            return res.status(403).json({
              success: false,
              message: "Account is suspended.",
            });
          }
          req.user = customer;
          req.customer = customer;
          return next();
        }
      }
    } catch (_) {}

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
      error: error.message,
    });
  }
};

export const requireFounder = (req, res, next) => {
  if (!req.effectivePermissions?.isFounder) {
    return res.status(403).json({
      success: false,
      message: "Only a Founder can open Team & Permissions.",
    });
  }
  return next();
};

const LEVEL_RANK = { Hidden: 0, View: 1, Edit: 2 };

export const requireSectionAccess = (sectionId, minLevel = "Edit") => {
  return (req, res, next) => {
    if (!req.effectivePermissions) return next();
    if (req.effectivePermissions.isFounder) return next();

    const actual = req.effectivePermissions.levels?.[sectionId] || "Hidden";
    if (LEVEL_RANK[actual] >= LEVEL_RANK[minLevel]) {
      return next();
    }
    const secLabel = SECTION_BY_ID[sectionId]?.label || sectionId;
    const roleName = req.effectivePermissions.roleName || "your role";
    const msg =
      actual === "View"
        ? `View only. Your role (${roleName}) can view ${secLabel} but not change it.`
        : `This needs Edit on ${secLabel}. Your role (${roleName}) does not include ${secLabel}. A Founder can change this in Team & Permissions.`;
    return res.status(403).json({
      success: false,
      message: msg,
    });
  };
};

export const requireDecision = (decisionId) => {
  return (req, res, next) => {
    if (!req.effectivePermissions) return next();
    if (req.effectivePermissions.isFounder) return next();

    const held = Array.isArray(req.effectivePermissions.decisions)
      ? req.effectivePermissions.decisions
      : [];
    if (held.includes(decisionId)) {
      return next();
    }
    const dec = DECISION_BY_ID[decisionId];
    const roleName = req.effectivePermissions.roleName || "your role";
    const label = dec?.label || decisionId;
    const askLine = dec?.askLine || "";
    return res.status(403).json({
      success: false,
      message: `${label} is not one of the decisions your role (${roleName}) holds. ${askLine} A Founder can change this in Team & Permissions.`.trim(),
    });
  };
};

async function resolveOptionalAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  const admin = await Admin.findOne({ sessionToken: token }).catch(() => null);
  return admin || null;
}

export const enforceSectionIfAdmin = (sectionId, minLevel = "Edit") => {
  return async (req, res, next) => {
    try {
      const admin = await resolveOptionalAdmin(req);
      if (!admin) return next();
      const check = await attachAdminPermissions(req, admin);
      if (check.blockedStatus) {
        return res.status(check.blockedStatus).json({
          success: false,
          message: check.message,
        });
      }
      return requireSectionAccess(sectionId, minLevel)(req, res, next);
    } catch (error) {
      return next();
    }
  };
};

export const enforceAnySectionIfAdmin = (sectionIds = [], minLevel = "Edit") => {
  return async (req, res, next) => {
    try {
      const admin = await resolveOptionalAdmin(req);
      if (!admin) return next();
      const check = await attachAdminPermissions(req, admin);
      if (check.blockedStatus) {
        return res.status(check.blockedStatus).json({
          success: false,
          message: check.message,
        });
      }
      if (!req.effectivePermissions || req.effectivePermissions.isFounder) {
        return next();
      }
      const allowed = (Array.isArray(sectionIds) ? sectionIds : []).some(
        (secId) => {
          const actual = req.effectivePermissions.levels?.[secId] || "Hidden";
          return LEVEL_RANK[actual] >= LEVEL_RANK[minLevel];
        },
      );
      if (allowed) return next();

      const primarySecId = sectionIds[0] || "";
      const secLabel = SECTION_BY_ID[primarySecId]?.label || primarySecId;
      const roleName = req.effectivePermissions.roleName || "your role";
      return res.status(403).json({
        success: false,
        message: `This needs ${minLevel} access on ${secLabel}. Your role (${roleName}) does not allow this.`,
      });
    } catch (error) {
      return next();
    }
  };
};

export const enforceDecisionIfAdmin = (decisionId) => {
  return async (req, res, next) => {
    try {
      const admin = await resolveOptionalAdmin(req);
      if (!admin) return next();
      const check = await attachAdminPermissions(req, admin);
      if (check.blockedStatus) {
        return res.status(check.blockedStatus).json({
          success: false,
          message: check.message,
        });
      }
      return requireDecision(decisionId)(req, res, next);
    } catch (error) {
      return next();
    }
  };
};

export const enforceDecisionWhenIfAdmin = (decisionId, predicate) => {
  return async (req, res, next) => {
    try {
      if (typeof predicate === "function" && !predicate(req)) return next();
      return enforceDecisionIfAdmin(decisionId)(req, res, next);
    } catch {
      return next();
    }
  };
};

export default requireAuth;
