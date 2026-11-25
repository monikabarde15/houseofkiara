import React, { useEffect, useMemo, useState } from "react";
import * as tpApi from "../../../../services/teamPermissionsApi";
import { useTeamPermissions } from "../../TeamPermissionsContext";
import { getFirstName } from "../../constants";
import { OpenWorkItem, RoleRecord, TeamMemberRecord } from "../../types";
import { TpDialog } from "../SharedPrimitives";
import { computeRoleDiff, formatDiffList } from "./TeamUtils";

interface ChangeRoleDialogProps {
  member: TeamMemberRecord | null;
  newRole: RoleRecord | null;
  onClose: () => void;
}

export const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({
  member,
  newRole,
  onClose,
}) => {
  const { roles, applyMemberUpdate, triggerRowFlash, showPanelToast } =
    useTeamPermissions();

  const [openWork, setOpenWork] = useState<OpenWorkItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const oldRole = useMemo(
    () => roles.find((r) => r.roleId === member?.roleId) || null,
    [roles, member?.roleId],
  );

  useEffect(() => {
    if (!member || !newRole) return;
    setOpenWork([]);
    if (member.status === "Invited") return;
    let active = true;
    tpApi
      .getMemberOpenWork(member.personId)
      .then((res) => {
        if (active) setOpenWork(res.items || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [member?.personId, newRole?.roleId]);

  const open = Boolean(member && newRole && oldRole);
  const firstName = member ? getFirstName(member.fullName) : "";

  const diff = useMemo(() => {
    if (!oldRole || !newRole) return null;
    return computeRoleDiff(oldRole, newRole, openWork);
  }, [oldRole, newRole, openWork]);

  const handleConfirm = async () => {
    if (!member || !newRole || submitting) return;
    setSubmitting(true);
    try {
      const res = await tpApi.changeTeamMemberRole(
        member.personId,
        newRole.roleId,
      );
      applyMemberUpdate(res.member, res.historyEntry);
      triggerRowFlash(member.personId);
      showPanelToast({
        boldPrefix: `${firstName} is now ${newRole.name}.`,
        message: "",
      });
      onClose();
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not change role.",
        message: err?.message || "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !member || !oldRole || !newRole || !diff) return null;

  return (
    <TpDialog
      open={open}
      onClose={onClose}
      title={`Change ${firstName}’s role to ${newRole.name}?`}
    >
      <div className="space-y-3 text-[13px] leading-relaxed text-[#5C5248]">
        <p>
          {firstName} moves from {oldRole.name} to {newRole.name} as soon as
          you confirm.
        </p>

        {diff.isFounderTarget ? (
          <p className="text-[#1A1612]">
            <strong className="font-semibold">Everything.</strong> A Founder
            opens every section, makes every decision and manages the team.
          </p>
        ) : (
          <>
            {diff.gainedSections.length > 0 && (
              <p className="text-[#1A1612]">
                <strong className="font-semibold">
                  Can now open or change:
                </strong>{" "}
                {formatDiffList(diff.gainedSections)}.
              </p>
            )}
            {diff.lostSections.length > 0 && (
              <p className="text-[#1A1612]">
                <strong className="font-semibold">Loses:</strong>{" "}
                {formatDiffList(diff.lostSections)}.
              </p>
            )}
            {diff.gainedDecisions.length > 0 && (
              <p className="text-[#1A1612]">
                <strong className="font-semibold">Can now decide:</strong>{" "}
                {formatDiffList(diff.gainedDecisions)}.
              </p>
            )}
            {diff.lostDecisions.length > 0 && (
              <p className="text-[#1A1612]">
                <strong className="font-semibold">Can no longer decide:</strong>{" "}
                {formatDiffList(diff.lostDecisions)}.
              </p>
            )}
          </>
        )}

        {diff.blockedOpenItemsCount > 0 && (
          <p className="text-[#A4512F]">
            {firstName} has {diff.blockedOpenItemsCount} open{" "}
            {diff.blockedOpenItemsCount === 1 ? "item" : "items"} the new role
            cannot work on. Hand them over from Manage afterwards.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="tp-btn-outline"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="tp-btn-gold"
          disabled={submitting}
        >
          {submitting ? "Changing..." : "Change role"}
        </button>
      </div>
    </TpDialog>
  );
};
