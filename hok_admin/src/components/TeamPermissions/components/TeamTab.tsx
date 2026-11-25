import React, { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { useTeamPermissions } from "../TeamPermissionsContext";
import { FOUNDER_ROLE_ID, sortMembersForTeamTable } from "../constants";
import { RoleRecord, TeamMemberRecord } from "../types";
import { StatusPill, TeamAvatar } from "./SharedPrimitives";
import { InviteMemberDialog } from "./team/InviteMemberDialog";
import { ChangeRoleDialog } from "./team/ChangeRoleDialog";
import { PersonPanel } from "./team/PersonPanel";
import { formatMemberLastActive } from "./team/TeamUtils";

interface TeamTabProps {
  onNavigateView?: (view: string, intent?: any) => void;
}

export const TeamTab: React.FC<TeamTabProps> = ({ onNavigateView }) => {
  const {
    members,
    roles,
    currentPerson,
    showPastMembers,
    setShowPastMembers,
    setSelectedPersonId,
    flashingPersonId,
  } = useTeamPermissions();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    member: TeamMemberRecord;
    newRole: RoleRecord;
  } | null>(null);

  const roleById = useMemo(
    () => new Map(roles.map((r) => [r.roleId, r])),
    [roles],
  );

  const sortedAll = useMemo(
    () => sortMembersForTeamTable(members, roles),
    [members, roles],
  );

  const nonLeftMembers = useMemo(
    () => sortedAll.filter((m) => m.status !== "Left"),
    [sortedAll],
  );
  const leftMembers = useMemo(
    () => sortedAll.filter((m) => m.status === "Left"),
    [sortedAll],
  );
  const visibleMembers = showPastMembers ? sortedAll : nonLeftMembers;

  const activeFoundersCount = useMemo(
    () =>
      members.filter(
        (m) => m.roleId === FOUNDER_ROLE_ID && m.status === "Active",
      ).length,
    [members],
  );

  const hasInvited = nonLeftMembers.some((m) => m.status === "Invited");
  const canSignInCount = nonLeftMembers.length;
  const summaryText = `${canSignInCount} ${
    canSignInCount === 1 ? "person" : "people"
  } can sign in${hasInvited ? ", including invites not yet accepted." : "."}`;

  const nonArchivedRoles = useMemo(
    () => roles.filter((r) => !r.archived),
    [roles],
  );

  const handleRoleSelect = (member: TeamMemberRecord, nextRoleId: string) => {
    if (nextRoleId === member.roleId) return;
    const targetRole = roleById.get(nextRoleId);
    if (!targetRole) return;
    setRoleChangeTarget({ member, newRole: targetRole });
  };

  return (
    <div className="pt-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-[13px] text-[#5C5248]">{summaryText}</p>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="tp-btn-gold shrink-0"
        >
          + Invite someone
        </button>
      </div>

      <div className="tp-card">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="tp-table-head-cell w-[36%]">Person</th>
              <th className="tp-table-head-cell">Role</th>
              <th className="tp-table-head-cell">Status</th>
              <th className="tp-table-head-cell">Last active</th>
              <th className="tp-table-head-cell text-right" aria-label="Manage" />
            </tr>
          </thead>
          <tbody>
            {visibleMembers.map((member, idx) => {
              const role = roleById.get(member.roleId) || null;
              const isSelf = currentPerson?.personId === member.personId;
              const isLeft = member.status === "Left";
              const isOnlyFounder =
                member.roleId === FOUNDER_ROLE_ID &&
                member.status === "Active" &&
                activeFoundersCount <= 1;
              const lockRole = isSelf || isOnlyFounder;
              const isFlashing = flashingPersonId === member.personId;

              const roleOptions =
                role && role.archived
                  ? [
                      ...nonArchivedRoles,
                      role,
                    ]
                  : nonArchivedRoles;

              return (
                <tr
                  key={member.personId}
                  className={`${idx > 0 ? "border-t border-[#EFE7DA]" : ""} ${
                    isFlashing ? "tp-row-flash" : ""
                  } ${isLeft ? "opacity-60" : ""}`}
                >
                  <td className="px-4 py-3.5 align-middle">
                    <div className="flex items-center gap-3 min-w-0">
                      <TeamAvatar
                        name={member.fullName}
                        colour={role?.colour || "#8A7E72"}
                        size={34}
                      />
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold text-[#1A1612] truncate">
                          {member.fullName}
                          {isSelf ? " (you)" : ""}
                        </div>
                        <div className="text-[12px] text-[#6E6358] truncate">
                          {member.workEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 align-middle">
                    {isLeft ? (
                      <span className="text-[13px] text-[#5C5248]">
                        {role?.name || member.roleId}
                      </span>
                    ) : lockRole ? (
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-[#5C5248]">
                        <span>{role?.name || member.roleId}</span>
                        <Lock className="h-3.5 w-3.5 text-[#8A7E72]" />
                      </span>
                    ) : (
                      <select
                        aria-label={`Role for ${member.fullName}`}
                        value={member.roleId}
                        onChange={(e) =>
                          handleRoleSelect(member, e.target.value)
                        }
                        className="tp-select min-w-[210px] w-auto max-w-[260px] text-[13px]"
                      >
                        {roleOptions.map((r) => (
                          <option key={r.roleId} value={r.roleId}>
                            {r.name}
                            {r.archived ? " (Archived)" : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  <td className="px-4 py-3.5 align-middle">
                    <StatusPill status={member.status} />
                  </td>

                  <td className="px-4 py-3.5 align-middle text-[13px] text-[#5C5248] whitespace-nowrap">
                    {formatMemberLastActive(member)}
                  </td>

                  <td className="px-4 py-3.5 align-middle text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedPersonId(member.personId)}
                      className="tp-btn-outline"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {leftMembers.length > 0 && (
        <div className="mt-3.5">
          <button
            type="button"
            onClick={() => setShowPastMembers(!showPastMembers)}
            className="tp-link-gold"
          >
            {showPastMembers
              ? `Hide past team members (${leftMembers.length})`
              : `Show past team members (${leftMembers.length})`}
          </button>
        </div>
      )}

      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />

      <ChangeRoleDialog
        member={roleChangeTarget?.member || null}
        newRole={roleChangeTarget?.newRole || null}
        onClose={() => setRoleChangeTarget(null)}
      />

      <PersonPanel onNavigateView={onNavigateView} />
    </div>
  );
};
