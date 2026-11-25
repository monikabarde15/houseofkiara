import React, { useEffect, useRef, useState } from "react";
import * as tpApi from "../../../../services/teamPermissionsApi";
import { useTeamPermissions } from "../../TeamPermissionsContext";
import { FOUNDER_ROLE_ID, getFirstName } from "../../constants";
import { TpDialog } from "../SharedPrimitives";
import { isShownNameUsedInList, suggestShownOnRecordsAs } from "./TeamUtils";

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

export const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  open,
  onClose,
}) => {
  const {
    roles,
    members,
    applyMemberUpdate,
    triggerRowFlash,
    showPanelToast,
  } = useTeamPermissions();

  const fullNameRef = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState("");
  const [shownName, setShownName] = useState("");
  const [shownEditedByUser, setShownEditedByUser] = useState(false);
  const [showShownField, setShowShownField] = useState(false);
  const [workEmail, setWorkEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [whatsapp, setWhatsapp] = useState("+91");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const availableRoles = roles.filter((r) => !r.archived);
  const selectedRole = availableRoles.find((r) => r.roleId === roleId) || null;

  useEffect(() => {
    if (!open) return;
    setFullName("");
    setShownName("");
    setShownEditedByUser(false);
    setShowShownField(false);
    setWorkEmail("");
    setRoleId("");
    setWhatsapp("+91");
    setErrors({});
    setSubmitting(false);
    const t = window.setTimeout(() => fullNameRef.current?.focus(), 20);
    return () => window.clearTimeout(t);
  }, [open]);

  const suggestedName = suggestShownOnRecordsAs(
    fullName,
    selectedRole?.name || null,
    members,
  );
  const effectiveShownName = shownEditedByUser ? shownName : suggestedName;

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const nextErrors: Record<string, string> = {};
    const cleanName = fullName.trim();
    const cleanEmail = workEmail.trim().toLowerCase();
    const cleanShown = effectiveShownName.trim();
    const cleanWa = whatsapp.trim();

    if (!cleanName) {
      nextErrors.fullName = "Add their name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      nextErrors.workEmail = "Add a work email the invite can go to.";
    } else if (
      members.some(
        (m) =>
          m.status !== "Left" &&
          m.workEmail.trim().toLowerCase() === cleanEmail,
      )
    ) {
      nextErrors.workEmail = "Someone on the team already signs in with this.";
    }
    if (!roleId || !selectedRole) {
      nextErrors.roleId = "Pick the role they will hold.";
    }

    if (cleanWa && cleanWa !== "+91") {
      const digits = cleanWa.replace(/\D/g, "");
      if (digits.length < 10) {
        nextErrors.whatsappNumber =
          "Add the full number, with the country code.";
      }
    }

    if (cleanName && cleanShown) {
      const conflict = isShownNameUsedInList(cleanShown, members);
      if (conflict) {
        const firstWord = getFirstName(cleanName) || cleanShown;
        const tag = selectedRole ? selectedRole.name.split(/\s+/)[0] : "";
        const tryName = tag ? `${firstWord} (${tag})` : "";
        const tryFree = tryName && !isShownNameUsedInList(tryName, members);
        const base =
          conflict.status === "Left"
            ? `“${cleanShown}” is kept for ${conflict.fullName}, who has left.`
            : `“${cleanShown}” is already used for ${conflict.fullName}.`;
        nextErrors.shownOnRecordsAs = `${base} ${
          tryFree ? `Try ${tryName}.` : "Add a tag that tells them apart."
        }`;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (nextErrors.shownOnRecordsAs) {
        setShowShownField(true);
        if (!shownEditedByUser) setShownName(cleanShown);
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await tpApi.inviteTeamMember({
        fullName: cleanName,
        shownOnRecordsAs: cleanShown,
        workEmail: cleanEmail,
        roleId,
        whatsappNumber: cleanWa === "+91" ? "" : cleanWa,
      });
      applyMemberUpdate(res.member, res.historyEntry);
      triggerRowFlash(res.member.personId);
      if (res.inviteToken && typeof window !== "undefined") {
        const inviteUrl = `${window.location.origin}/?invite=${encodeURIComponent(res.inviteToken)}`;
        navigator.clipboard?.writeText(inviteUrl).catch(() => {});
      }
      showPanelToast({
        boldPrefix: `Invite sent to ${res.member.workEmail}.`,
        message: "",
      });
      onClose();
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not send invite.",
        message: err?.message || "Please check the fields.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TpDialog open={open} onClose={onClose} title="Invite someone">
      <p className="tp-dialog-body mb-5">
        They get an email with a link to set a password. Until they accept,
        nothing is open to them.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Full name
          </label>
          <input
            ref={fullNameRef}
            type="text"
            placeholder="First and last name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError("fullName");
              clearError("shownOnRecordsAs");
            }}
            className={`tp-input ${errors.fullName ? "has-error" : ""}`}
          />
          {errors.fullName && (
            <p className="tp-field-error">{errors.fullName}</p>
          )}
          {fullName.trim() && !showShownField && (
            <p className="mt-1.5 text-[12px] text-[#5C5248]">
              Shown on records as{" "}
              <strong className="font-semibold text-[#1A1612]">
                {effectiveShownName}
              </strong>
              .{" "}
              <button
                type="button"
                onClick={() => {
                  setShownName(effectiveShownName);
                  setShowShownField(true);
                }}
                className="tp-link-gold text-[12px]"
              >
                Change
              </button>
            </p>
          )}
        </div>

        {showShownField && (
          <div>
            <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
              Shown on records as
            </label>
            <input
              type="text"
              placeholder={suggestedName || "For example, Priya (Ops)"}
              value={shownEditedByUser ? shownName : effectiveShownName}
              onChange={(e) => {
                setShownEditedByUser(true);
                setShownName(e.target.value);
                clearError("shownOnRecordsAs");
              }}
              className={`tp-input ${errors.shownOnRecordsAs ? "has-error" : ""}`}
            />
            {errors.shownOnRecordsAs && (
              <p className="tp-field-error">{errors.shownOnRecordsAs}</p>
            )}
            <p className="tp-field-hint">
              Add a tag when a first name is shared, as with Priya (Ops).
            </p>
          </div>
        )}

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Work email
          </label>
          <input
            type="email"
            placeholder="name@houseofkaira.com"
            value={workEmail}
            onChange={(e) => {
              setWorkEmail(e.target.value);
              clearError("workEmail");
            }}
            className={`tp-input ${errors.workEmail ? "has-error" : ""}`}
          />
          {errors.workEmail && (
            <p className="tp-field-error">{errors.workEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Role
          </label>
          <select
            value={roleId}
            onChange={(e) => {
              setRoleId(e.target.value);
              clearError("roleId");
              clearError("shownOnRecordsAs");
            }}
            className={`tp-select ${errors.roleId ? "has-error" : ""}`}
          >
            <option value="" disabled>
              Choose a role
            </option>
            {availableRoles.map((r) => (
              <option key={r.roleId} value={r.roleId}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.roleId && <p className="tp-field-error">{errors.roleId}</p>}
          {selectedRole && (
            <p className="tp-field-hint">
              {selectedRole.description}
              {selectedRole.roleId === FOUNDER_ROLE_ID
                ? " Invite a Founder only for a partner in the business."
                : ""}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            WhatsApp number (optional)
          </label>
          <input
            type="text"
            placeholder="+91"
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value);
              clearError("whatsappNumber");
            }}
            className={`tp-input ${errors.whatsappNumber ? "has-error" : ""}`}
          />
          {errors.whatsappNumber && (
            <p className="tp-field-error">{errors.whatsappNumber}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="tp-btn-outline"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="tp-btn-gold"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send invite"}
          </button>
        </div>
      </form>
    </TpDialog>
  );
};
