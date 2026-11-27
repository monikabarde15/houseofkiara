import crypto from "crypto";
import { pool } from "../config/db.js";
import Admin from "../models/Admin.js";
import TeamRole from "../models/TeamRole.js";
import TeamMember from "../models/TeamMember.js";
import TeamHistory from "../models/TeamHistory.js";
import Enquiry from "../models/Enquiry.js";
import Offer from "../models/Offer.js";
import Notification from "../models/Notification.js";
import {
  DECISIONS,
  DECISION_BY_ID,
  DEFAULT_ROLES,
  FOUNDER_ROLE_ID,
  SECTIONS,
  SECTION_BY_ID,
  clampSectionLevel,
  computeEffectivePermissions,
  getFirstName,
  normalizeMemberStatusForApi,
  normalizeMemberStatusForDb,
} from "../config/permissionsRegistry.js";

let tablesEnsured = false;
let seedPromise = null;

export async function ensureTeamTables() {
  if (tablesEnsured) return;
  const ddl = [
    `CREATE TABLE IF NOT EXISTS team_roles (
      _id VARCHAR(64) PRIMARY KEY,
      role_id VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      colour VARCHAR(32) DEFAULT '#8A7E72',
      is_fixed BOOLEAN DEFAULT FALSE,
      archived BOOLEAN DEFAULT FALSE,
      sort_order INT DEFAULT 0,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS team_members (
      _id VARCHAR(64) PRIMARY KEY,
      person_id VARCHAR(100) UNIQUE NOT NULL,
      admin_id VARCHAR(64),
      full_name VARCHAR(255) NOT NULL,
      shown_on_records_as VARCHAR(255) NOT NULL,
      role_id VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      work_email VARCHAR(255) NOT NULL,
      whatsapp_number VARCHAR(100),
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS team_history (
      _id VARCHAR(64) PRIMARY KEY,
      entry_id VARCHAR(100) UNIQUE NOT NULL,
      kind VARCHAR(32) NOT NULL,
      who VARCHAR(255) NOT NULL,
      target VARCHAR(255),
      message TEXT NOT NULL,
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,
    `ALTER TABLE admins ADD COLUMN IF NOT EXISTS role_id VARCHAR(100) DEFAULT 'founder';`,
    `ALTER TABLE admins ADD COLUMN IF NOT EXISTS person_id VARCHAR(100);`,
    `ALTER TABLE admins ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';`,
  ];
  for (const sql of ddl) {
    await pool.query(sql).catch(() => {});
  }
  tablesEnsured = true;
}

export function slugifyId(raw = "") {
  const base = String(raw || "")
    .replace(/\([^)]*\)/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return base || "member";
}

export function generateUniquePersonId(shownName, existingPeople) {
  const base = slugifyId(shownName);
  const used = new Set(existingPeople.map((p) => p.personId));
  if (!used.has(base)) return base;
  let idx = 2;
  while (used.has(`${base}${idx}`)) {
    idx += 1;
  }
  return `${base}${idx}`;
}

export function generateUniqueRoleId(name, existingRoles) {
  const base = slugifyId(name) || "role";
  const used = new Set(existingRoles.map((r) => r.roleId));
  if (!used.has(base)) return base;
  let idx = 2;
  while (used.has(`${base}_${idx}`)) {
    idx += 1;
  }
  return `${base}_${idx}`;
}

export function getMemberNameAliases(member) {
  const names = [
    member?.shownOnRecordsAs,
    ...(Array.isArray(member?.olderSpellings) ? member.olderSpellings : []),
  ]
    .map((n) => String(n || "").trim().toLowerCase())
    .filter(Boolean);
  return new Set(names);
}

export function formatRoleForApi(roleDoc) {
  const raw = typeof roleDoc?.toObject === "function" ? roleDoc.toObject() : roleDoc;
  if (!raw) return null;
  const effective = computeEffectivePermissions(raw);
  return {
    roleId: raw.roleId,
    name: raw.name,
    description: raw.description || "",
    colour: raw.colour || "#8A7E72",
    isFixed: Boolean(raw.isFixed) || raw.roleId === FOUNDER_ROLE_ID,
    archived: Boolean(raw.archived),
    sortOrder: Number(raw.sortOrder ?? 99),
    levels: effective.levels,
    rawLevels: raw.levels || {},
    decisions: effective.decisions,
    rawDecisions: Array.isArray(raw.decisions) ? raw.decisions : [],
    openSectionsCount: effective.openSectionsCount,
  };
}

export function formatMemberForApi(memberDoc, options = {}) {
  const raw =
    typeof memberDoc?.toObject === "function" ? memberDoc.toObject() : memberDoc;
  if (!raw) return null;
  const status = normalizeMemberStatusForApi(raw.status);
  const formatted = {
    personId: raw.personId,
    adminId: raw.adminId || null,
    hasLoginAccount: Boolean(raw.adminId),
    fullName: raw.fullName,
    shownOnRecordsAs: raw.shownOnRecordsAs,
    olderSpellings: Array.isArray(raw.olderSpellings) ? raw.olderSpellings : [],
    roleId: raw.roleId,
    status,
    workEmail: raw.workEmail,
    whatsappNumber: raw.whatsappNumber || "",
    addedAt: raw.addedAt || raw.createdAt || null,
    addedBy: raw.addedBy || null,
    invitedAt: raw.invitedAt || null,
    inviteExpiresAt: raw.inviteExpiresAt || null,
    joinedAt: raw.joinedAt || null,
    lastActiveAt: raw.lastActiveAt || null,
    pausedSince: raw.pausedSince || null,
    leftOn: raw.leftOn || null,
    hasSignedInOnce: Boolean(raw.hasSignedInOnce),
  };
  if (options.includeInviteToken && status === "Invited") {
    formatted.inviteToken = raw.inviteToken || null;
  }
  return formatted;
}

export async function findLinkedAdminForMember(member) {
  if (!member) return null;
  if (member.adminId) {
    const byId = await Admin.findById(member.adminId).catch(() => null);
    if (byId) return byId;
  }
  if (member.personId) {
    const byPerson = await Admin.findOne({ personId: member.personId }).catch(
      () => null,
    );
    if (byPerson) return byPerson;
  }
  const emailLower = String(member.workEmail || "").toLowerCase().trim();
  if (emailLower) {
    const byEmail = await Admin.findOne({ email: emailLower }).catch(
      () => null,
    );
    if (byEmail) return byEmail;
  }
  return null;
}

export function formatHistoryForApi(histDoc) {
  const raw =
    typeof histDoc?.toObject === "function" ? histDoc.toObject() : histDoc;
  if (!raw) return null;
  return {
    entryId: raw.entryId,
    kind: raw.kind,
    who: raw.who,
    target: raw.target || "",
    message: raw.message,
    occurredAt: raw.occurredAt || raw.createdAt,
  };
}

export async function recordHistory({ kind, who, target = "", message, occurredAt }) {
  const ts = occurredAt || new Date().toISOString();
  const entryId = `HIS-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  return TeamHistory.create({
    entryId,
    kind,
    who: String(who || "Founder"),
    target: String(target || ""),
    message,
    occurredAt: ts,
  });
}

export async function ensureTeamPermissionsSeeded() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    try {
      await ensureTeamTables();

      // 1. Ensure the system Founder role always exists (no sample roles auto-seeded)
      const existingRoles = await TeamRole.find({}).catch(() => []);
      const roleIds = new Set(existingRoles.map((r) => r.roleId));
      const founderDef = DEFAULT_ROLES.find((r) => r.roleId === FOUNDER_ROLE_ID);
      if (founderDef && !roleIds.has(FOUNDER_ROLE_ID)) {
        await TeamRole.create({ ...founderDef });
        roleIds.add(FOUNDER_ROLE_ID);
      }

      // 2. Link existing Admin accounts and TeamMember rows (no sample users/history auto-seeded)
      const [admins, existingMembers] = await Promise.all([
        Admin.find({}).catch(() => []),
        TeamMember.find({}).catch(() => []),
      ]);

      const adminByEmail = new Map(
        admins.map((a) => [String(a.email || "").toLowerCase().trim(), a]),
      );

      const workingMembers = [...existingMembers];
      for (const member of workingMembers) {
        const emailLower = String(member.workEmail || "").toLowerCase().trim();
        const matchedAdmin = adminByEmail.get(emailLower);
        if (matchedAdmin) {
          if (!member.adminId) {
            member.adminId = String(matchedAdmin._id);
            await member.save().catch(() => {});
          }
          if (
            matchedAdmin.personId !== member.personId ||
            matchedAdmin.roleId !== member.roleId
          ) {
            matchedAdmin.personId = member.personId;
            matchedAdmin.roleId = member.roleId;
            await matchedAdmin.save().catch(() => {});
          }
        }
      }

      // Sync any existing Admin accounts that are not yet linked to a TeamMember
      for (const adm of admins) {
        const admId = String(adm._id);
        const admEmail = String(adm.email || "").toLowerCase().trim();
        const linked = workingMembers.find(
          (m) =>
            m.adminId === admId ||
            (adm.personId && m.personId === adm.personId) ||
            (admEmail && String(m.workEmail || "").toLowerCase().trim() === admEmail),
        );
        if (linked) {
          let dirtyMember = false;
          if (!linked.adminId) {
            linked.adminId = admId;
            dirtyMember = true;
          }
          if (dirtyMember) await linked.save().catch(() => {});
          if (adm.personId !== linked.personId || adm.roleId !== linked.roleId) {
            adm.personId = linked.personId;
            adm.roleId = linked.roleId;
            await adm.save().catch(() => {});
          }
          continue;
        }
        if (!admEmail) continue;

        const baseName = String(adm.name || "").trim() || admEmail.split("@")[0];
        const candidatePersonId = generateUniquePersonId(baseName, workingMembers);
        let candidateShown = baseName;
        if (isShownNameTaken(candidateShown, workingMembers)) {
          candidateShown = `${baseName} (Admin)`;
        }
        if (isShownNameTaken(candidateShown, workingMembers)) {
          candidateShown = `${baseName} (${candidatePersonId})`;
        }

        const roleId = roleIds.has(adm.roleId) ? adm.roleId : FOUNDER_ROLE_ID;
        const ts = adm.createdAt || new Date().toISOString();
        const createdMember = await TeamMember.create({
          personId: candidatePersonId,
          adminId: admId,
          fullName: baseName,
          shownOnRecordsAs: candidateShown,
          olderSpellings: [],
          roleId,
          status: normalizeMemberStatusForDb(adm.status || "Active"),
          workEmail: admEmail,
          whatsappNumber: "",
          addedAt: ts,
          addedBy: candidateShown,
          invitedAt: null,
          inviteToken: null,
          inviteExpiresAt: null,
          joinedAt: ts,
          lastActiveAt: ts,
          hasSignedInOnce: true,
        });
        workingMembers.push(createdMember);
        adm.personId = createdMember.personId;
        adm.roleId = createdMember.roleId;
        await adm.save().catch(() => {});
      }
    } finally {
      seedPromise = null;
    }
  })();
  return seedPromise;
}

export async function resolveAdminContext(admin) {
  await ensureTeamPermissionsSeeded();
  if (!admin) return { member: null, role: null, permissions: null };

  const emailLower = String(admin.email || "").toLowerCase().trim();
  const member =
    (admin.personId
      ? await TeamMember.findOne({ personId: admin.personId }).catch(() => null)
      : null) ||
    (await TeamMember.findOne({ adminId: String(admin._id) }).catch(
      () => null,
    )) ||
    (await TeamMember.findOne({ workEmail: emailLower }).catch(() => null));

  const roleId = member?.roleId || admin.roleId || FOUNDER_ROLE_ID;
  const role =
    (await TeamRole.findOne({ roleId }).catch(() => null)) ||
    DEFAULT_ROLES.find((r) => r.roleId === FOUNDER_ROLE_ID);

  const permissions = computeEffectivePermissions(role);
  return {
    member,
    role,
    permissions,
  };
}

export function isShownNameTaken(candidateName, members, excludePersonId = null) {
  const needle = String(candidateName || "").trim().toLowerCase();
  if (!needle) return null;
  for (const m of members) {
    if (excludePersonId && m.personId === excludePersonId) continue;
    const aliases = getMemberNameAliases(m);
    if (aliases.has(needle)) {
      return m;
    }
  }
  return null;
}

export function isWorkEmailTaken(email, members, excludePersonId = null) {
  const needle = String(email || "").trim().toLowerCase();
  if (!needle) return null;
  for (const m of members) {
    if (excludePersonId && m.personId === excludePersonId) continue;
    const st = normalizeMemberStatusForApi(m.status);
    if (st === "Left") continue;
    if (String(m.workEmail || "").trim().toLowerCase() === needle) {
      return m;
    }
  }
  return null;
}

export function validateWhatsApp(raw = "") {
  const trimmed = String(raw || "").trim();
  if (!trimmed || trimmed === "+91") return { valid: true, normalized: "" };
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10) {
    return {
      valid: false,
      message: "Add the full number, with the country code.",
    };
  }
  return { valid: true, normalized: trimmed };
}

export function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

/**
 * Spec 5.3: Open work for a person read live from Enquiries, Offers, and Notifications desk state.
 */
export async function getOpenWorkForMember(member) {
  if (!member) return [];
  const aliases = getMemberNameAliases(member);
  if (aliases.size === 0) return [];

  const [enquiries, offers, deskDoc] = await Promise.all([
    Enquiry.find({}).catch(() => []),
    Offer.find({}).catch(() => []),
    Notification.findOne({ notificationId: "DESK_STATE" }).catch(() => null),
  ]);

  const items = [];

  for (const enq of Array.isArray(enquiries) ? enquiries : []) {
    const st = String(enq.status || "New");
    if (st === "Converted" || st === "Closed") continue;
    const assigned = String(enq.assignedTo || "").trim().toLowerCase();
    if (assigned && aliases.has(assigned)) {
      const id = enq.enquiryId || enq._id;
      items.push({
        kind: "Enquiry",
        sectionId: "enquiries",
        id: String(id),
        customerName: enq.customerName || "",
        label: `${id} · ${enq.customerName || "Customer"}`,
      });
    }
  }

  for (const off of Array.isArray(offers) ? offers : []) {
    if (off.isDeleted) continue;
    const st = String(off.status || "Pending");
    if (!["Pending", "Countered", "Counter Offered", "On Hold"].includes(st)) {
      continue;
    }
    const assigned = String(off.assignedTo || "").trim().toLowerCase();
    if (assigned && aliases.has(assigned)) {
      const id = off.offerId || off._id;
      items.push({
        kind: "Offer",
        sectionId: "offers",
        id: String(id),
        customerName: off.customerName || "",
        label: `${id} · ${off.customerName || "Customer"}`,
      });
    }
  }

  const assignedMap = deskDoc?.assigned || {};
  for (const [alertKey, entry] of Object.entries(assignedMap)) {
    const byVal =
      typeof entry === "string"
        ? entry
        : entry?.by || entry?.assignedTo || entry?.name || "";
    const byLower = String(byVal || "").trim().toLowerCase();
    if (byLower && aliases.has(byLower)) {
      const atStr =
        typeof entry === "object" && entry?.at ? entry.at : "recently";
      items.push({
        kind: "Alert",
        sectionId: "notifications",
        id: alertKey,
        pickedUpAt: atStr,
        label: `${alertKey} · picked up ${atStr}`,
      });
    }
  }

  return items;
}

export function getEligibleHandOverMembers(openItems, allMembers, allRoles, excludePersonId) {
  const roleMap = new Map(
    allRoles.map((r) => [r.roleId, computeEffectivePermissions(r)]),
  );
  const neededSections = Array.from(
    new Set(openItems.map((it) => it.sectionId)),
  );

  const candidates = allMembers.filter((m) => {
    if (m.personId === excludePersonId) return false;
    if (normalizeMemberStatusForApi(m.status) !== "Active") return false;
    const perms = roleMap.get(m.roleId);
    if (!perms) return false;
    return neededSections.every((secId) => perms.levels[secId] === "Edit");
  });

  // Founder last, per Spec 5.3
  candidates.sort((a, b) => {
    const aIsF = a.roleId === FOUNDER_ROLE_ID ? 1 : 0;
    const bIsF = b.roleId === FOUNDER_ROLE_ID ? 1 : 0;
    if (aIsF !== bIsF) return aIsF - bIsF;
    return String(a.fullName || "").localeCompare(String(b.fullName || ""));
  });

  return candidates;
}

export async function handOverOpenWork(fromMember, toMember, noteMode = "manual") {
  const openItems = await getOpenWorkForMember(fromMember);
  if (openItems.length === 0) return 0;

  const aliases = getMemberNameAliases(fromMember);
  const toName = toMember.shownOnRecordsAs;
  const fromName = fromMember.shownOnRecordsAs;
  const noteLine =
    noteMode === "left"
      ? `Handed to ${toName} when ${getFirstName(fromMember.fullName)} left the team.`
      : `Handed to ${toName} from ${fromName}.`;

  // 1. Enquiries
  const enquiryIds = openItems
    .filter((i) => i.kind === "Enquiry")
    .map((i) => i.id);
  if (enquiryIds.length > 0) {
    const allEnq = await Enquiry.find({}).catch(() => []);
    for (const enq of allEnq) {
      const id = String(enq.enquiryId || enq._id);
      if (!enquiryIds.includes(id)) continue;
      const assigned = String(enq.assignedTo || "").trim().toLowerCase();
      if (!aliases.has(assigned)) continue;
      enq.assignedTo = toName;
      const log = Array.isArray(enq.conversationLog)
        ? [...enq.conversationLog]
        : [];
      log.push({
        message: noteLine,
        author: toName,
        createdAt: new Date().toISOString(),
      });
      enq.conversationLog = log;
      await enq.save();
    }
  }

  // 2. Offers
  const offerIds = openItems
    .filter((i) => i.kind === "Offer")
    .map((i) => i.id);
  if (offerIds.length > 0) {
    const allOff = await Offer.find({}).catch(() => []);
    for (const off of allOff) {
      const id = String(off.offerId || off._id);
      if (!offerIds.includes(id)) continue;
      const assigned = String(off.assignedTo || "").trim().toLowerCase();
      if (!aliases.has(assigned)) continue;
      off.assignedTo = toName;
      const notes = Array.isArray(off.notes) ? [...off.notes] : [];
      notes.push({
        message: noteLine,
        createdBy: toName,
        createdAt: new Date().toISOString(),
      });
      off.notes = notes;
      const timeline = Array.isArray(off.timeline) ? [...off.timeline] : [];
      timeline.push({
        action: "Handed over",
        remarks: noteLine,
        user: toName,
        createdAt: new Date().toISOString(),
      });
      off.timeline = timeline;
      await off.save();
    }
  }

  // 3. Notifications DESK_STATE
  const alertIds = openItems
    .filter((i) => i.kind === "Alert")
    .map((i) => i.id);
  if (alertIds.length > 0) {
    const deskDoc = await Notification.findOne({
      notificationId: "DESK_STATE",
    }).catch(() => null);
    if (deskDoc && deskDoc.assigned) {
      const nextAssigned = { ...deskDoc.assigned };
      for (const key of alertIds) {
        if (nextAssigned[key] && typeof nextAssigned[key] === "object") {
          nextAssigned[key] = { ...nextAssigned[key], by: toName };
        } else {
          nextAssigned[key] = { by: toName, at: new Date().toISOString() };
        }
      }
      await Notification.findOneAndUpdate(
        { notificationId: "DESK_STATE" },
        { $set: { assigned: nextAssigned } },
        { new: true },
      );
    }
  }

  return openItems.length;
}

export async function countActiveFounders(members) {
  return members.filter(
    (m) =>
      m.roleId === FOUNDER_ROLE_ID &&
      normalizeMemberStatusForApi(m.status) === "Active",
  ).length;
}

export function sanitizeLevelsForStorage(rawLevels = {}) {
  const cleaned = {};
  for (const sec of SECTIONS) {
    if (sec.founderOnly || sec.followsRole) continue;
    cleaned[sec.id] = clampSectionLevel(sec.id, rawLevels[sec.id]);
  }
  return cleaned;
}

export function sanitizeDecisionsForStorage(rawDecisions = [], effectiveLevels = {}) {
  const validSet = new Set(DECISIONS.map((d) => d.id));
  const result = [];
  for (const decId of Array.isArray(rawDecisions) ? rawDecisions : []) {
    if (!validSet.has(decId)) continue;
    const dec = DECISION_BY_ID[decId];
    if (
      !dec.needsEditOn ||
      dec.needsEditOn.length === 0 ||
      dec.needsEditOn.some((sId) => effectiveLevels[sId] === "Edit")
    ) {
      result.push(decId);
    }
  }
  return Array.from(new Set(result));
}

export { SECTION_BY_ID };
