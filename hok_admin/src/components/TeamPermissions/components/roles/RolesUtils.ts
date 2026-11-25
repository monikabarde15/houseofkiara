import {
  DECISIONS,
  FOUNDER_ROLE_ID,
  SECTIONS,
  computeEffectivePermissions,
  getFirstName,
  joinWithAnd,
} from "../../constants";
import { RoleRecord, TeamMemberRecord } from "../../types";

export function getRoleActiveHolders(
  roleId: string,
  members: TeamMemberRecord[],
): TeamMemberRecord[] {
  return members.filter(
    (m) => m.roleId === roleId && m.status !== "Left",
  );
}

export function getRoleHoldersText(
  roleId: string,
  members: TeamMemberRecord[],
): string {
  const holders = getRoleActiveHolders(roleId, members);
  if (holders.length === 0) return "Nobody yet";
  const firstNames = holders.map((m) => getFirstName(m.fullName));
  return joinWithAnd(firstNames);
}

export function computeCoverageCheck(
  draftRoles: RoleRecord[],
  members: TeamMemberRecord[],
): { ok: boolean; missingItems: string[] } {
  const activeMembers = members.filter((m) => m.status === "Active");
  const activeRoleIds = new Set(activeMembers.map((m) => m.roleId));
  const heldRoles = draftRoles.filter(
    (r) => !r.archived && activeRoleIds.has(r.roleId),
  );
  const heldEff = heldRoles.map((r) => computeEffectivePermissions(r));

  const missing: string[] = [];

  for (const sec of SECTIONS) {
    if (!sec.inRolesTable) continue;
    const requiredLevel = sec.maxLevel === "View" ? "View" : "Edit";
    const covered = heldEff.some((eff) => {
      const lvl = eff.levels[sec.id] || "Hidden";
      if (requiredLevel === "View") return lvl === "View" || lvl === "Edit";
      return lvl === "Edit";
    });
    if (!covered) {
      missing.push(sec.label.toLowerCase());
    }
  }

  for (const dec of DECISIONS) {
    const covered = heldEff.some(
      (eff) => eff.isFounder || eff.decisions.includes(dec.id),
    );
    if (!covered) {
      missing.push(dec.label.charAt(0).toLowerCase() + dec.label.slice(1));
    }
  }

  return { ok: missing.length === 0, missingItems: missing };
}

export interface RolesLayoutMetrics {
  useFrame: boolean;
  firstColWidth: number;
  founderColWidth: number;
  roleColWidth: number;
  tableWidth: number;
}

/**
 * Spec 6.2 & 6.9: Column widths & frame threshold
 */
export function computeRolesTableLayout(
  containerWidth: number,
  activeRolesCount: number,
): RolesLayoutMetrics {
  const founderColWidth = 104;
  const otherCount = Math.max(0, activeRolesCount - 1);
  const safeWidth = Math.max(containerWidth || 1000, 640);

  const idealFirst = Math.round(safeWidth * 0.29);
  const minOther = 120;
  const minFirst = 260;

  const minTotalNeeded = minFirst + founderColWidth + otherCount * minOther;

  if (minTotalNeeded > safeWidth) {
    return {
      useFrame: true,
      firstColWidth: minFirst,
      founderColWidth,
      roleColWidth: minOther,
      tableWidth: minTotalNeeded,
    };
  }

  const remainingWithIdeal = safeWidth - idealFirst - founderColWidth;
  if (otherCount === 0 || remainingWithIdeal / otherCount >= minOther) {
    const roleColWidth =
      otherCount > 0 ? Math.floor(remainingWithIdeal / otherCount) : 120;
    return {
      useFrame: false,
      firstColWidth: idealFirst,
      founderColWidth,
      roleColWidth,
      tableWidth: safeWidth,
    };
  }

  const shrunkFirst = Math.max(
    minFirst,
    safeWidth - founderColWidth - otherCount * minOther,
  );
  const roleColWidth =
    otherCount > 0
      ? Math.floor((safeWidth - shrunkFirst - founderColWidth) / otherCount)
      : 120;

  return {
    useFrame: false,
    firstColWidth: shrunkFirst,
    founderColWidth,
    roleColWidth,
    tableWidth: safeWidth,
  };
}

export function validateRoleNameUnique(
  name: string,
  draftRoles: RoleRecord[],
  excludeRoleId?: string,
): string | null {
  const clean = name.trim();
  if (!clean) return "Give the role a name.";
  const lower = clean.toLowerCase();
  const duplicate = draftRoles.some(
    (r) =>
      !r.archived &&
      r.roleId !== excludeRoleId &&
      r.name.trim().toLowerCase() === lower,
  );
  if (duplicate) return "Another role already has this name.";
  return null;
}

export { FOUNDER_ROLE_ID };
