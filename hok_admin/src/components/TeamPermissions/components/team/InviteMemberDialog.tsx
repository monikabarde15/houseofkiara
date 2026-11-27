import React, { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import * as tpApi from "../../../../services/teamPermissionsApi";
import { useTeamPermissions } from "../../TeamPermissionsContext";
import { FOUNDER_ROLE_ID, buildInviteUrl, getFirstName } from "../../constants";
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
  const [accessSetup, setAccessSetup] = useState<"invite" | "password">("password");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createdInviteInfo, setCreatedInviteInfo] = useState<{
    email: string;
    name: string;
    inviteUrl: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
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
    setAccessSetup("password");
    setPassword("");
    setConfirmPassword("");
    setCreatedInviteInfo(null);
    setCopiedLink(false);
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

  const handleCopyInviteUrl = async (url: string) => {
    try {
      await navigator.clipboard?.writeText(url);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore clipboard errors
    }
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
      nextErrors.workEmail = "Add a work email they can sign in with.";
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

    if (accessSetup === "password") {
      if (password.length < 8) {
        nextErrors.password = "Password must be at least 8 characters.";
      } else if (password !== confirmPassword) {
        nextErrors.confirmPassword = "Passwords do not match.";
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
        ...(accessSetup === "password" ? { password } : {}),
      });
      applyMemberUpdate(res.member, res.historyEntry);
      triggerRowFlash(res.member.personId);
      if (res.directLoginReady) {
        showPanelToast({
          boldPrefix: `${res.member.fullName} added.`,
          message: `They can sign in now with ${res.member.workEmail}.`,
        });
        onClose();
        return;
      }

      if (res.inviteToken) {
        const inviteUrl = buildInviteUrl(res.inviteToken);
        navigator.clipboard?.writeText(inviteUrl).catch(() => {});
        setCreatedInviteInfo({
          email: res.member.workEmail,
          name: res.member.fullName,
          inviteUrl,
        });
        showPanelToast({
          boldPrefix: `Invite link ready for ${res.member.workEmail}.`,
          message: "Copied to clipboard.",
        });
      } else {
        onClose();
      }
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not add team member.",
        message: err?.message || "Please check the fields.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (createdInviteInfo) {
    return (
      <TpDialog open={open} onClose={onClose} title="Invite link ready">
        <p className="tp-dialog-body mb-4">
          Share this private sign-in link with{" "}
          <strong className="font-semibold text-[#1A1612]">
            {createdInviteInfo.name}
          </strong>{" "}
          ({createdInviteInfo.email}). They will use it to set their password
          and sign in. It works for 7 days.
        </p>

        <div className="p-3 rounded-[6px] bg-[#FAF7F2] border border-[#E6DCCB]">
          <div className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[#8A7E72] mb-1.5">
            Sign-in invite link
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={createdInviteInfo.inviteUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="tp-input !h-8 text-[12px] font-mono bg-white"
            />
            <button
              type="button"
              onClick={() => handleCopyInviteUrl(createdInviteInfo.inviteUrl)}
              className="tp-btn-outline shrink-0 !h-8"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#4F6142]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end mt-5">
          <button type="button" onClick={onClose} className="tp-btn-gold">
            Done
          </button>
        </div>
      </TpDialog>
    );
  }

  return (
    <TpDialog open={open} onClose={onClose} title="Invite someone">
      <p className="tp-dialog-body mb-5">
        Give a team member their own sign-in and role permissions. Set a password
        now for instant sign-in, or generate an invite link.
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
            Sign-in setup
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setAccessSetup("password");
                clearError("password");
                clearError("confirmPassword");
              }}
              className={`px-3 py-2 rounded-[6px] border text-left text-[12px] cursor-pointer transition-colors ${
                accessSetup === "password"
                  ? "border-[#C9A96E] bg-[#FAF4E8] text-[#1A1612] font-semibold"
                  : "border-[#E6DCCB] bg-white text-[#5C5248] hover:bg-[#FAF7F2]"
              }`}
            >
              Set password now
              <span className="block text-[11px] font-normal text-[#6E6358] mt-0.5">
                Can log in immediately
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAccessSetup("invite");
                clearError("password");
                clearError("confirmPassword");
              }}
              className={`px-3 py-2 rounded-[6px] border text-left text-[12px] cursor-pointer transition-colors ${
                accessSetup === "invite"
                  ? "border-[#C9A96E] bg-[#FAF4E8] text-[#1A1612] font-semibold"
                  : "border-[#E6DCCB] bg-white text-[#5C5248] hover:bg-[#FAF7F2]"
              }`}
            >
              Create invite link
              <span className="block text-[11px] font-normal text-[#6E6358] mt-0.5">
                They set password via link
              </span>
            </button>
          </div>
        </div>

        {accessSetup === "password" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                  clearError("confirmPassword");
                }}
                className={`tp-input ${errors.password ? "has-error" : ""}`}
              />
              {errors.password && (
                <p className="tp-field-error">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                className={`tp-input ${errors.confirmPassword ? "has-error" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="tp-field-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}

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
            {submitting
              ? accessSetup === "password"
                ? "Adding..."
                : "Creating..."
              : accessSetup === "password"
                ? "Add & enable login"
                : "Create invite link"}
          </button>
        </div>
      </form>
    </TpDialog>
  );
};
