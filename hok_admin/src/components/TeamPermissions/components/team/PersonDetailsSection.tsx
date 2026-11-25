import React, { useEffect, useState } from "react";
import * as tpApi from "../../../../services/teamPermissionsApi";
import { useTeamPermissions } from "../../TeamPermissionsContext";
import { getFirstName } from "../../constants";
import { TeamMemberRecord } from "../../types";
import { isShownNameUsedInList } from "./TeamUtils";

interface PersonDetailsSectionProps {
  member: TeamMemberRecord;
}

export const PersonDetailsSection: React.FC<PersonDetailsSectionProps> = ({
  member,
}) => {
  const { members, applyMemberUpdate, showPanelToast } = useTeamPermissions();
  const isLeft = member.status === "Left";
  const firstName = getFirstName(member.fullName);

  const [fullName, setFullName] = useState(member.fullName);
  const [shownName, setShownName] = useState(member.shownOnRecordsAs);
  const [workEmail, setWorkEmail] = useState(member.workEmail);
  const [whatsapp, setWhatsapp] = useState(member.whatsappNumber || "+91");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(member.fullName);
    setShownName(member.shownOnRecordsAs);
    setWorkEmail(member.workEmail);
    setWhatsapp(member.whatsappNumber || "+91");
    setErrors({});
  }, [
    member.personId,
    member.fullName,
    member.shownOnRecordsAs,
    member.workEmail,
    member.whatsappNumber,
  ]);

  const normalizedWaSaved = member.whatsappNumber || "+91";
  const isDirty =
    fullName !== member.fullName ||
    shownName !== member.shownOnRecordsAs ||
    workEmail !== member.workEmail ||
    whatsapp !== normalizedWaSaved;

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty || saving || isLeft) return;

    const nextErrors: Record<string, string> = {};
    const cleanName = fullName.trim();
    const cleanShown = shownName.trim();
    const cleanEmail = workEmail.trim().toLowerCase();
    const cleanWa = whatsapp.trim();

    if (!cleanName) {
      nextErrors.fullName = "Add a name.";
    }
    if (!cleanShown) {
      nextErrors.shownOnRecordsAs = "Add how records should show this person.";
    } else {
      const conflict = isShownNameUsedInList(
        cleanShown,
        members,
        member.personId,
      );
      if (conflict) {
        nextErrors.shownOnRecordsAs =
          conflict.status === "Left"
            ? `“${cleanShown}” is kept for ${conflict.fullName}, who has left.`
            : `“${cleanShown}” is already used for ${conflict.fullName}.`;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      nextErrors.workEmail = "Add a work email they can sign in with.";
    } else if (
      members.some(
        (m) =>
          m.personId !== member.personId &&
          m.status !== "Left" &&
          m.workEmail.trim().toLowerCase() === cleanEmail,
      )
    ) {
      nextErrors.workEmail = "Someone on the team already signs in with this.";
    }

    if (cleanWa && cleanWa !== "+91") {
      const digits = cleanWa.replace(/\D/g, "");
      if (digits.length < 10) {
        nextErrors.whatsappNumber =
          "Add the full number, with the country code.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await tpApi.updateTeamMemberDetails(member.personId, {
        fullName: cleanName,
        shownOnRecordsAs: cleanShown,
        workEmail: cleanEmail,
        whatsappNumber: cleanWa === "+91" ? "" : cleanWa,
      });
      applyMemberUpdate(res.member, res.historyEntries);
      showPanelToast({
        boldPrefix: "Saved.",
        message: `${getFirstName(res.member.fullName)}’s details are up to date.`,
      });
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not save details.",
        message: err?.message || "Please check the fields.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="pb-6 border-b border-[#EFE7DA]">
      <h3 className="tp-kicker-heading">DETAILS</h3>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            disabled={isLeft}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError("fullName");
            }}
            className={`tp-input ${errors.fullName ? "has-error" : ""}`}
          />
          {errors.fullName && (
            <p className="tp-field-error">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Shown on records as
          </label>
          <input
            type="text"
            value={shownName}
            disabled={isLeft}
            onChange={(e) => {
              setShownName(e.target.value);
              clearError("shownOnRecordsAs");
            }}
            className={`tp-input ${errors.shownOnRecordsAs ? "has-error" : ""}`}
          />
          {errors.shownOnRecordsAs && (
            <p className="tp-field-error">{errors.shownOnRecordsAs}</p>
          )}
          <p className="tp-field-hint">
            How {firstName} appears in “Assigned to” and on every record. Kept
            for {firstName} for good.
          </p>
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            Work email
          </label>
          <input
            type="email"
            value={workEmail}
            disabled={isLeft}
            onChange={(e) => {
              setWorkEmail(e.target.value);
              clearError("workEmail");
            }}
            className={`tp-input ${errors.workEmail ? "has-error" : ""}`}
          />
          {errors.workEmail && (
            <p className="tp-field-error">{errors.workEmail}</p>
          )}
          <p className="tp-field-hint">{firstName} signs in with this.</p>
        </div>

        <div>
          <label className="block text-[12.5px] font-medium text-[#1A1612] mb-1.5">
            WhatsApp number
          </label>
          <input
            type="text"
            placeholder="+91"
            value={whatsapp}
            disabled={isLeft}
            onChange={(e) => {
              setWhatsapp(e.target.value);
              clearError("whatsappNumber");
            }}
            className={`tp-input ${errors.whatsappNumber ? "has-error" : ""}`}
          />
          {errors.whatsappNumber && (
            <p className="tp-field-error">{errors.whatsappNumber}</p>
          )}
          <p className="tp-field-hint">
            For the team’s own reminders. Never shown to customers.
          </p>
        </div>

        {!isLeft && (
          <div className="pt-1">
            <button
              type="submit"
              disabled={!isDirty || saving}
              className="tp-btn-gold"
            >
              {saving ? "Saving..." : "Save details"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
};
