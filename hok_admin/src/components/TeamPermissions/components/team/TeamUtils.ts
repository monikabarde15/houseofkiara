import {
  DECISIONS,
  FOUNDER_ROLE_ID,
  SECTIONS,
  computeEffectivePermissions,
  formatRelativeDateTime,
  formatShortDate,
  getFirstName,
  joinWithAnd,
} from "../../constants";
import { OpenWorkItem, RoleRecord, TeamMemberRecord } from "../../types";

export function formatMemberLastActive(member: TeamMemberRecord): string {
  if (member.status === "Invited") {
    const rel = member.invitedAt
      ? formatRelativeDateTime(member.invitedAt, true)
      : "";
    return rel ? `Invite sent ${rel}` : "Invite sent";
  }
  if (member.status === "Paused") {
    const dt = member.pausedSince ? formatShortDate(member.pausedSince) : "";
    return dt ? `Paused since ${dt}` : "Paused";
  }
  if (member.status === "Left") {
    const dt = member.leftOn ? formatShortDate(member.leftOn) : "";
    return dt ? `Left ${dt}` : "Left";
  }
  if (!member.lastActiveAt) return "Not yet";
  return formatRelativeDateTime(member.lastActiveAt, false) || "Not yet";
}

export function getInviteExpiryText(member: TeamMemberRecord): string {
  if (!member.inviteExpiresAt) return "The link works for 7 more days.";
  const diffMs = new Date(member.inviteExpiresAt).getTime() - Date.now();
  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return "The link has expired.";
  }
  const days = Math.max(1, Math.ceil(diffMs / 86400000));
  return `The link works for ${days} more ${days === 1 ? "day" : "days"}.`;
}

export function isShownNameUsedInList(
  candidate: string,
  members: TeamMemberRecord[],
  excludePersonId?: string,
): TeamMemberRecord | null {
  const needle = candidate.trim().toLowerCase();
  if (!needle) return null;
  for (const m of members) {
    if (excludePersonId && m.personId === excludePersonId) continue;
    const aliases = [
      m.shownOnRecordsAs,
      ...(Array.isArray(m.olderSpellings) ? m.olderSpellings : []),
    ].map((s) => String(s || "").trim().toLowerCase());
    if (aliases.includes(needle)) return m;
  }
  return null;
}

/**
 * Spec 5.6: Suggests first word of full name; if taken, appends ({tag}) once a role is chosen.
 */
export function suggestShownOnRecordsAs(
  fullName: string,
  roleName: string | null,
  members: TeamMemberRecord[],
): string {
  const firstWord = getFirstName(fullName);
  if (!firstWord) return "";
  if (!isShownNameUsedInList(firstWord, members)) {
    return firstWord;
  }
  if (roleName) {
    const tag = roleName.trim().split(/\s+/)[0];
    if (tag) {
      const tagged = `${firstWord} (${tag})`;
      if (!isShownNameUsedInList(tagged, members)) {
        return tagged;
      }
    }
  }
  return firstWord;
}

export interface RoleDiffSummary {
  isFounderTarget: boolean;
  gainedSections: string[];
  lostSections: string[];
  gainedDecisions: string[];
  lostDecisions: string[];
  blockedOpenItemsCount: number;
}

const RANK = { Hidden: 0, View: 1, Edit: 2 };

export function computeRoleDiff(
  oldRole: RoleRecord,
  newRole: RoleRecord,
  openWorkItems: OpenWorkItem[],
): RoleDiffSummary {
  const oldEff = computeEffectivePermissions(oldRole);
  const newEff = computeEffectivePermissions(newRole);

  if (newEff.isFounder) {
    return {
      isFounderTarget: true,
      gainedSections: [],
      lostSections: [],
      gainedDecisions: [],
      lostDecisions: [],
      blockedOpenItemsCount: 0,
    };
  }

  const gainedSections: string[] = [];
  const lostSections: string[] = [];

  for (const sec of SECTIONS) {
    if (sec.founderOnly || sec.followsRole) continue;
    const oldLvl = oldEff.levels[sec.id] || "Hidden";
    const newLvl = newEff.levels[sec.id] || "Hidden";
    if (RANK[newLvl] > RANK[oldLvl]) {
      gainedSections.push(
        newLvl === "View" ? `${sec.label} (view)` : sec.label,
      );
    } else if (RANK[newLvl] < RANK[oldLvl]) {
      lostSections.push(
        newLvl === "View" ? `${sec.label} (keeps view)` : sec.label,
      );
    }
  }

  const oldDecSet = new Set(oldEff.decisions);
  const newDecSet = new Set(newEff.decisions);
  const gainedDecisions: string[] = [];
  const lostDecisions: string[] = [];

  for (const dec of DECISIONS) {
    const lowerLabel = dec.label.charAt(0).toLowerCase() + dec.label.slice(1);
    if (!oldDecSet.has(dec.id) && newDecSet.has(dec.id)) {
      gainedDecisions.push(lowerLabel);
    } else if (oldDecSet.has(dec.id) && !newDecSet.has(dec.id)) {
      lostDecisions.push(lowerLabel);
    }
  }

  const blockedOpenItemsCount = openWorkItems.filter(
    (item) => (newEff.levels[item.sectionId] || "Hidden") !== "Edit",
  ).length;

  return {
    isFounderTarget: false,
    gainedSections,
    lostSections,
    gainedDecisions,
    lostDecisions,
    blockedOpenItemsCount,
  };
}

export function formatDiffList(items: string[]): string {
  return joinWithAnd(items);
}

export function isFounderRole(roleId?: string, isFixed?: boolean): boolean {
  return Boolean(isFixed) || roleId === FOUNDER_ROLE_ID;
}
