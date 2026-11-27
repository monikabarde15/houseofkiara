import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import * as tpApi from "../../../../services/teamPermissionsApi";
import { useTeamPermissions } from "../../TeamPermissionsContext";
import {
  FOUNDER_ROLE_ID,
  buildInviteUrl,
  formatFullDateTime,
  getFirstName,
} from "../../constants";
import {
  EligibleRecipient,
  OpenWorkItem,
  RoleRecord,
  TeamMemberRecord,
} from "../../types";
import {
  CancelInviteDialog,
  PauseAccessDialog,
  RemoveMemberDialog,
} from "./PersonAccessDialogs";
import { getInviteExpiryText } from "./TeamUtils";

interface PersonAccessSectionProps {
  member: TeamMemberRecord;
  role: RoleRecord | null;
  isSelf: boolean;
  isOnlyActiveFounder: boolean;
  openWork: OpenWorkItem[];
  eligibleRecipients: EligibleRecipient[];
  onClosePanel: () => void;
  onDialogVisibilityChange: (open: boolean) => void;
}

export const PersonAccessSection: React.FC<PersonAccessSectionProps> = ({
  member,
  role,
  isSelf,
  isOnlyActiveFounder,
  openWork,
  eligibleRecipients,
  onClosePanel,
  onDialogVisibilityChange,
}) => {
  const {
    applyMemberUpdate,
    applyInviteCancelled,
    setShowPastMembers,
    startPreviewRole,
    showPanelToast,
  } = useTeamPermissions();

  const [activeDialog, setActiveDialog] = useState<
    "pause" | "remove" | "cancel_invite" | null
  >(null);
  const [busy, setBusy] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setPasswordOpen(false);
    setPasswordValue("");
    setPasswordConfirm("");
    setPasswordError(null);
    setCopiedInvite(false);
  }, [member.personId]);

  const openDialog = (kind: "pause" | "remove" | "cancel_invite") => {
    setActiveDialog(kind);
    onDialogVisibilityChange(true);
  };
  const closeDialog = () => {
    setActiveDialog(null);
    onDialogVisibilityChange(false);
  };

  const firstName = getFirstName(member.fullName);
  const isFounder =
    member.roleId === FOUNDER_ROLE_ID || Boolean(role?.isFixed);
  const canPreview = !isFounder && role && !role.archived;
  const wasOnTeamBefore = Boolean(member.hasSignedInOnce || member.joinedAt);
  const liveInviteUrl = member.inviteToken ? buildInviteUrl(member.inviteToken) : "";

  const handleCopyInvite = async () => {
    if (!liveInviteUrl) return;
    try {
      await navigator.clipboard?.writeText(liveInviteUrl);
      setCopiedInvite(true);
      window.setTimeout(() => setCopiedInvite(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingPassword) return;
    if (passwordValue.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (passwordValue !== passwordConfirm) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    setPasswordError(null);
    try {
      const res = await tpApi.setTeamMemberPassword(
        member.personId,
        passwordValue,
      );
      applyMemberUpdate(res.member, res.historyEntry);
      setPasswordOpen(false);
      setPasswordValue("");
      setPasswordConfirm("");
      showPanelToast({
        boldPrefix: "Password saved.",
        message:
          res.message ||
          `${firstName} can sign in with ${res.member.workEmail}.`,
      });
    } catch (err: any) {
      setPasswordError(err?.message || "Could not set password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleResendInvite = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await tpApi.resendTeamInvite(member.personId);
      applyMemberUpdate(res.member, res.historyEntry);
      if (res.inviteToken) {
        const inviteUrl = buildInviteUrl(res.inviteToken);
        navigator.clipboard?.writeText(inviteUrl).catch(() => {});
      }
      showPanelToast({
        boldPrefix: "Invite link refreshed",
        message: `for ${res.member.workEmail} and copied. Works for 7 days.`,
      });
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not resend.",
        message: err?.message || "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleCancelInvite = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await tpApi.cancelTeamInvite(member.personId);
      applyInviteCancelled(res);
      closeDialog();
      if (res.removed) {
        onClosePanel();
      } else {
        setShowPastMembers(true);
      }
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not cancel invite.",
        message: err?.message || "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handlePause = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await tpApi.pauseTeamMember(member.personId);
      applyMemberUpdate(res.member, res.historyEntry);
      closeDialog();
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not pause access.",
        message: err?.message || "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await tpApi.restoreTeamMember(member.personId);
      applyMemberUpdate(res.member, res.historyEntry);
      showPanelToast({
        boldPrefix: "Access restored.",
        message: `${firstName} can sign in again.`,
      });
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not restore access.",
        message: err?.message || "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (handOverToPersonId?: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await tpApi.removeTeamMember(
        member.personId,
        handOverToPersonId,
      );
      applyMemberUpdate(res.member, res.historyEntry);
      setShowPastMembers(true);
      closeDialog();
      onClosePanel();
      const movedMsg =
        res.movedCount > 0
          ? res.message?.replace(`${res.member.fullName} has been removed. `, "") || ""
          : "";
      showPanelToast({
        boldPrefix: `${res.member.fullName} has been removed.`,
        message: movedMsg,
      });
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not remove team member.",
        message: err?.message || "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleReinvite = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await tpApi.reinviteTeamMember(member.personId);
      applyMemberUpdate(res.member, res.historyEntry);
      if (res.inviteToken) {
        const inviteUrl = buildInviteUrl(res.inviteToken);
        navigator.clipboard?.writeText(inviteUrl).catch(() => {});
      }
      showPanelToast({
        boldPrefix: `Invite link ready for ${res.member.workEmail}.`,
        message: "Copied to clipboard.",
      });
    } catch (err: any) {
      showPanelToast({
        boldPrefix: err?.message || "Could not re-invite.",
        message: "",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="pt-6">
      <h3 className="tp-kicker-heading">ACCESS</h3>

      {isSelf ? (
        <p className="text-[13px] leading-relaxed text-[#5C5248]">
          This is you. Your role stays Founder, and only another Founder could
          pause or remove you.
        </p>
      ) : member.status === "Left" ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[13.5px] font-semibold text-[#1A1612]">
              Bring {firstName} back
            </div>
            <p className="text-[12.5px] text-[#5C5248] mt-0.5">
              Sends a fresh invite under the same name and role, so the old
              records join up again.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReinvite}
            disabled={busy || Boolean(role?.archived)}
            className="tp-btn-outline shrink-0"
          >
            Re-invite
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {canPreview && (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[13.5px] font-semibold text-[#1A1612]">
                  See the panel as {firstName}
                </div>
                <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                  The same sidebar, locks and refusals {firstName} gets.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  startPreviewRole(member.roleId, {
                    personId: member.personId,
                    personFirstName: firstName,
                    returnTab: "team",
                    returnPersonId: member.personId,
                  })
                }
                className="tp-btn-outline shrink-0"
              >
                Preview
              </button>
            </div>
          )}

          {member.status === "Invited" && (
            <>
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[13.5px] font-semibold text-[#1A1612]">
                      Invite link
                    </div>
                    <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                      Created {formatFullDateTime(member.invitedAt)} for{" "}
                      {member.workEmail}. {getInviteExpiryText(member)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResendInvite}
                    disabled={busy}
                    className="tp-btn-outline shrink-0"
                  >
                    New link
                  </button>
                </div>

                {liveInviteUrl && (
                  <div className="flex items-center gap-2 p-2 rounded-[6px] bg-[#FAF7F2] border border-[#E6DCCB]">
                    <input
                      type="text"
                      readOnly
                      value={liveInviteUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="tp-input !h-8 text-[11.5px] font-mono bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleCopyInvite}
                      className="tp-btn-outline shrink-0 !h-8"
                    >
                      {copiedInvite ? (
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
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[13.5px] font-semibold text-[#1A1612]">
                      Or set password directly
                    </div>
                    <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                      Activates {firstName} immediately so they can sign in with{" "}
                      {member.workEmail}.
                    </p>
                  </div>
                  {!passwordOpen && (
                    <button
                      type="button"
                      onClick={() => setPasswordOpen(true)}
                      className="tp-btn-outline shrink-0"
                    >
                      Set password
                    </button>
                  )}
                </div>

                {passwordOpen && (
                  <form
                    onSubmit={handleSavePassword}
                    className="p-3 rounded-[6px] bg-[#FAF7F2] border border-[#E6DCCB] space-y-2.5"
                  >
                    <input
                      type="password"
                      placeholder="New password (min 8 characters)"
                      value={passwordValue}
                      disabled={savingPassword}
                      onChange={(e) => {
                        setPasswordValue(e.target.value);
                        setPasswordError(null);
                      }}
                      className="tp-input bg-white"
                    />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={passwordConfirm}
                      disabled={savingPassword}
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                        setPasswordError(null);
                      }}
                      className="tp-input bg-white"
                    />
                    {passwordError && (
                      <p className="tp-field-error !mt-1">{passwordError}</p>
                    )}
                    <div className="flex items-center justify-end gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordOpen(false);
                          setPasswordError(null);
                        }}
                        disabled={savingPassword}
                        className="tp-btn-outline"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="tp-btn-gold"
                      >
                        {savingPassword ? "Saving..." : "Save & activate"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[13.5px] font-semibold text-[#1A1612]">
                    Cancel the invite
                  </div>
                  <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                    {wasOnTeamBefore
                      ? `The link stops working. ${firstName} goes back to past team members.`
                      : `The link stops working. Nothing is kept, since ${firstName} never signed in.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openDialog("cancel_invite")}
                  disabled={busy}
                  className="tp-btn-danger-outline shrink-0"
                >
                  Cancel invite
                </button>
              </div>
            </>
          )}

          {(member.status === "Active" || member.status === "Paused") && (
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[13.5px] font-semibold text-[#1A1612]">
                    Sign-in password
                  </div>
                  <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                    {member.hasLoginAccount
                      ? `${firstName} signs in with ${member.workEmail} and a password.`
                      : `No password is set yet. Set one so ${firstName} can sign in with ${member.workEmail}.`}
                  </p>
                </div>
                {!passwordOpen && (
                  <button
                    type="button"
                    onClick={() => setPasswordOpen(true)}
                    className="tp-btn-outline shrink-0"
                  >
                    {member.hasLoginAccount ? "Reset password" : "Set password"}
                  </button>
                )}
              </div>

              {passwordOpen && (
                <form
                  onSubmit={handleSavePassword}
                  className="p-3 rounded-[6px] bg-[#FAF7F2] border border-[#E6DCCB] space-y-2.5"
                >
                  <input
                    type="password"
                    placeholder="New password (min 8 characters)"
                    value={passwordValue}
                    disabled={savingPassword}
                    onChange={(e) => {
                      setPasswordValue(e.target.value);
                      setPasswordError(null);
                    }}
                    className="tp-input bg-white"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={passwordConfirm}
                    disabled={savingPassword}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      setPasswordError(null);
                    }}
                    className="tp-input bg-white"
                  />
                  {passwordError && (
                    <p className="tp-field-error !mt-1">{passwordError}</p>
                  )}
                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordOpen(false);
                        setPasswordError(null);
                      }}
                      disabled={savingPassword}
                      className="tp-btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="tp-btn-gold"
                    >
                      {savingPassword ? "Saving..." : "Save password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {member.status === "Active" && (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[13.5px] font-semibold text-[#1A1612]">
                  Pause access
                </div>
                <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                  Stops {firstName} signing in until you restore it. Nothing
                  else changes.
                </p>
                {isOnlyActiveFounder && (
                  <p className="text-[12px] text-[#6E6358] mt-1">
                    The only active Founder cannot be paused or removed.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => openDialog("pause")}
                disabled={busy || isOnlyActiveFounder}
                className="tp-btn-outline shrink-0"
              >
                Pause
              </button>
            </div>
          )}

          {member.status === "Paused" && (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[13.5px] font-semibold text-[#1A1612]">
                  Access is paused
                </div>
                <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                  {firstName} cannot sign in. The role and open work stay as
                  they are.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRestore}
                disabled={busy}
                className="tp-btn-gold shrink-0"
              >
                Restore
              </button>
            </div>
          )}

          {(member.status === "Active" || member.status === "Paused") && (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[13.5px] font-semibold text-[#1A1612]">
                  Remove from the team
                </div>
                <p className="text-[12.5px] text-[#5C5248] mt-0.5">
                  {firstName}’s name stays on every record they touched.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openDialog("remove")}
                disabled={busy || isOnlyActiveFounder}
                className="tp-btn-danger-outline shrink-0"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      <PauseAccessDialog
        open={activeDialog === "pause"}
        member={member}
        busy={busy}
        onClose={closeDialog}
        onConfirm={handlePause}
      />

      <RemoveMemberDialog
        open={activeDialog === "remove"}
        member={member}
        openWork={openWork}
        eligibleRecipients={eligibleRecipients}
        busy={busy}
        onClose={closeDialog}
        onConfirm={handleRemove}
      />

      <CancelInviteDialog
        open={activeDialog === "cancel_invite"}
        member={member}
        busy={busy}
        onClose={closeDialog}
        onConfirm={handleCancelInvite}
      />
    </section>
  );
};
