import React, { useEffect, useState } from "react";
import { getFirstName } from "../../constants";
import {
  EligibleRecipient,
  OpenWorkItem,
  TeamMemberRecord,
} from "../../types";
import { TpDialog } from "../SharedPrimitives";

export const PauseAccessDialog: React.FC<{
  open: boolean;
  member: TeamMemberRecord;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, member, busy, onClose, onConfirm }) => {
  const firstName = getFirstName(member.fullName);
  return (
    <TpDialog
      open={open}
      onClose={onClose}
      title={`Pause ${firstName}’s access?`}
    >
      <p className="tp-dialog-body">
        {firstName} will not be able to sign in until you restore it. The role
        and open work stay as they are; you can hand the work over from Manage.
      </p>
      <div className="flex items-center justify-end gap-2.5 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="tp-btn-outline"
          disabled={busy}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="tp-btn-gold"
          disabled={busy}
        >
          {busy ? "Pausing..." : "Pause access"}
        </button>
      </div>
    </TpDialog>
  );
};

export const RemoveMemberDialog: React.FC<{
  open: boolean;
  member: TeamMemberRecord;
  openWork: OpenWorkItem[];
  eligibleRecipients: EligibleRecipient[];
  busy: boolean;
  onClose: () => void;
  onConfirm: (handOverToPersonId?: string) => void;
}> = ({
  open,
  member,
  openWork,
  eligibleRecipients,
  busy,
  onClose,
  onConfirm,
}) => {
  const firstName = getFirstName(member.fullName);
  const [recipientId, setRecipientId] = useState("");

  useEffect(() => {
    setRecipientId(eligibleRecipients[0]?.personId || "");
  }, [eligibleRecipients, open]);

  return (
    <TpDialog
      open={open}
      onClose={onClose}
      title={`Remove ${firstName} from the team?`}
    >
      <div className="space-y-4">
        <p className="tp-dialog-body">
          {firstName} will no longer be able to sign in. {firstName}’s name
          stays on every record, and “{member.shownOnRecordsAs}” stays reserved,
          so old records always read clearly.
        </p>

        {openWork.length > 0 && (
          <div>
            <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
              {firstName} has {openWork.length} open{" "}
              {openWork.length === 1 ? "item" : "items"}. Hand them to
            </label>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="tp-select"
              disabled={eligibleRecipients.length === 0}
            >
              {eligibleRecipients.map((r) => (
                <option key={r.personId} value={r.personId}>
                  {r.shownOnRecordsAs}, {r.roleName}
                </option>
              ))}
            </select>
            <p className="tp-field-hint">
              Each record gets a line saying it was handed over, and when.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="tp-btn-outline"
          disabled={busy}
        >
          Keep {firstName}
        </button>
        <button
          type="button"
          onClick={() => onConfirm(recipientId || undefined)}
          className="tp-btn-danger-outline"
          disabled={
            busy || (openWork.length > 0 && eligibleRecipients.length === 0)
          }
        >
          {busy ? "Removing..." : `Remove ${firstName}`}
        </button>
      </div>
    </TpDialog>
  );
};

export const CancelInviteDialog: React.FC<{
  open: boolean;
  member: TeamMemberRecord;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, member, busy, onClose, onConfirm }) => {
  const firstName = getFirstName(member.fullName);
  const wasOnTeamBefore = Boolean(member.hasSignedInOnce || member.joinedAt);

  return (
    <TpDialog
      open={open}
      onClose={onClose}
      title={`Cancel the invite for ${firstName}?`}
    >
      <p className="tp-dialog-body">
        The link stops working at once.
        {wasOnTeamBefore
          ? ` ${firstName} goes back to past team members, and “${member.shownOnRecordsAs}” stays reserved.`
          : ""}
      </p>
      <div className="flex items-center justify-end gap-2.5 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="tp-btn-outline"
          disabled={busy}
        >
          Keep it
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="tp-btn-danger-outline"
          disabled={busy}
        >
          {busy ? "Cancelling..." : "Cancel invite"}
        </button>
      </div>
    </TpDialog>
  );
};
