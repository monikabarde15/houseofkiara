import React, { useEffect, useState } from "react";
import * as tpApi from "../../../../services/teamPermissionsApi";
import { useTeamPermissions } from "../../TeamPermissionsContext";
import { getFirstName } from "../../constants";
import {
  EligibleRecipient,
  OpenWorkItem,
  TeamMemberRecord,
} from "../../types";

interface PersonOpenWorkSectionProps {
  member: TeamMemberRecord;
  isSelf: boolean;
  openWork: OpenWorkItem[];
  eligibleRecipients: EligibleRecipient[];
  loading: boolean;
  onWorkHandedOver: () => void;
  onNavigateItem: (item: OpenWorkItem) => void;
}

export const PersonOpenWorkSection: React.FC<PersonOpenWorkSectionProps> = ({
  member,
  isSelf,
  openWork,
  eligibleRecipients,
  loading,
  onWorkHandedOver,
  onNavigateItem,
}) => {
  const { showPanelToast, applyMemberUpdate } = useTeamPermissions();
  const [targetPersonId, setTargetPersonId] = useState("");
  const [handingOver, setHandingOver] = useState(false);

  useEffect(() => {
    setTargetPersonId(eligibleRecipients[0]?.personId || "");
  }, [eligibleRecipients, member.personId]);

  // Spec 5.3: Not shown for someone who is only invited
  if (member.status === "Invited") return null;

  const firstName = getFirstName(member.fullName);

  const handleHandOver = async () => {
    if (!targetPersonId || handingOver) return;
    setHandingOver(true);
    try {
      const res = await tpApi.handOverMemberWork(
        member.personId,
        targetPersonId,
      );
      if (res.historyEntry) {
        applyMemberUpdate(member, res.historyEntry);
      }
      const recipient = eligibleRecipients.find(
        (r) => r.personId === targetPersonId,
      );
      const n = res.movedCount;
      showPanelToast({
        boldPrefix: `${n} open ${n === 1 ? "item" : "items"} now with ${recipient?.shownOnRecordsAs || "teammate"}.`,
        message: "",
      });
      onWorkHandedOver();
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not hand over.",
        message: err?.message || "Please try again.",
      });
    } finally {
      setHandingOver(false);
    }
  };

  return (
    <section className="py-6 border-b border-[#EFE7DA]">
      <h3 className="tp-kicker-heading">OPEN WORK</h3>
      {loading ? (
        <p className="text-[13px] text-[#6E6358]">Checking open work...</p>
      ) : openWork.length === 0 ? (
        <p className="text-[13px] text-[#5C5248]">
          Nothing is waiting in {firstName}’s name.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            {openWork.map((item) => (
              <div
                key={`${item.kind}-${item.id}`}
                className="flex items-baseline text-[13px]"
              >
                <span className="w-[62px] shrink-0 text-[#6E6358]">
                  {item.kind}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateItem(item)}
                  className="tp-link-gold text-left truncate"
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>

          {!isSelf && (
            <div className="flex items-center gap-2.5 pt-2">
              <select
                value={targetPersonId}
                onChange={(e) => setTargetPersonId(e.target.value)}
                disabled={eligibleRecipients.length === 0 || handingOver}
                className="tp-select flex-1 text-[13px]"
              >
                {eligibleRecipients.length === 0 ? (
                  <option value="">No one available to hand over to</option>
                ) : (
                  eligibleRecipients.map((r) => (
                    <option key={r.personId} value={r.personId}>
                      Hand over to {r.shownOnRecordsAs}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={handleHandOver}
                disabled={!targetPersonId || handingOver}
                className="tp-btn-outline shrink-0"
              >
                {handingOver ? "Moving..." : "Hand over"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
