import React, { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import * as tpApi from "../../../../services/teamPermissionsApi";
import { useTeamPermissions } from "../../TeamPermissionsContext";
import { FOUNDER_ROLE_ID } from "../../constants";
import { EligibleRecipient, OpenWorkItem } from "../../types";
import { StatusPill, TeamAvatar } from "../SharedPrimitives";
import { PersonDetailsSection } from "./PersonDetailsSection";
import { PersonOpenWorkSection } from "./PersonOpenWorkSection";
import { PersonAccessSection } from "./PersonAccessSection";

interface PersonPanelProps {
  onNavigateView?: (view: string, intent?: any) => void;
}

export const PersonPanel: React.FC<PersonPanelProps> = ({ onNavigateView }) => {
  const {
    members,
    roles,
    currentPerson,
    selectedPersonId,
    setSelectedPersonId,
  } = useTeamPermissions();

  const member = members.find((m) => m.personId === selectedPersonId) || null;
  const role = member
    ? roles.find((r) => r.roleId === member.roleId) || null
    : null;

  const [openWork, setOpenWork] = useState<OpenWorkItem[]>([]);
  const [eligibleRecipients, setEligibleRecipients] = useState<
    EligibleRecipient[]
  >([]);
  const [loadingWork, setLoadingWork] = useState(false);
  const [childDialogOpen, setChildDialogOpen] = useState(false);

  const loadOpenWork = useCallback(async () => {
    if (!member || member.status === "Invited") {
      setOpenWork([]);
      setEligibleRecipients([]);
      return;
    }
    setLoadingWork(true);
    try {
      const res = await tpApi.getMemberOpenWork(member.personId);
      setOpenWork(res.items || []);
      setEligibleRecipients(res.eligibleRecipients || []);
    } catch {
      setOpenWork([]);
      setEligibleRecipients([]);
    } finally {
      setLoadingWork(false);
    }
  }, [member?.personId, member?.status]);

  useEffect(() => {
    loadOpenWork();
  }, [loadOpenWork]);

  // Spec 4.6: Escape closes panel unless a dialog is open on top
  useEffect(() => {
    if (!member) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !childDialogOpen) {
        setSelectedPersonId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [member, childDialogOpen, setSelectedPersonId]);

  if (!member) return null;

  const isSelf = currentPerson?.personId === member.personId;
  const activeFoundersCount = members.filter(
    (m) => m.roleId === FOUNDER_ROLE_ID && m.status === "Active",
  ).length;
  const isOnlyActiveFounder =
    member.roleId === FOUNDER_ROLE_ID &&
    member.status === "Active" &&
    activeFoundersCount <= 1;

  const handleNavigateOpenItem = (item: OpenWorkItem) => {
    setSelectedPersonId(null);
    if (item.kind === "Enquiry") {
      onNavigateView?.("enquiries", { enquiryId: item.id });
    } else if (item.kind === "Offer") {
      onNavigateView?.("offers", { offerId: item.id });
    } else {
      onNavigateView?.("notifications", { personName: member.shownOnRecordsAs });
    }
  };

  return (
    <div
      className="tp-drawer-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !childDialogOpen) {
          setSelectedPersonId(null);
        }
      }}
    >
      <aside className="tp-drawer-panel" aria-label={member.fullName}>
        <div className="tp-drawer-header">
          <TeamAvatar
            name={member.fullName}
            colour={role?.colour || "#8A7E72"}
            size={48}
          />
          <div className="min-w-0 flex-1">
            <h2 className="tp-drawer-title truncate">
              {member.fullName}
              {isSelf ? " (you)" : ""}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] text-[#5C5248]">
                {role?.name || member.roleId}
              </span>
              <StatusPill status={member.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPersonId(null)}
            aria-label="Close panel"
            className="text-[#6E6358] hover:text-[#1A1612] p-1 bg-transparent border-0 cursor-pointer self-start"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="tp-drawer-body">
          <PersonDetailsSection member={member} />

          <PersonOpenWorkSection
            member={member}
            isSelf={isSelf}
            openWork={openWork}
            eligibleRecipients={eligibleRecipients}
            loading={loadingWork}
            onWorkHandedOver={loadOpenWork}
            onNavigateItem={handleNavigateOpenItem}
          />

          <PersonAccessSection
            member={member}
            role={role}
            isSelf={isSelf}
            isOnlyActiveFounder={isOnlyActiveFounder}
            openWork={openWork}
            eligibleRecipients={eligibleRecipients}
            onClosePanel={() => setSelectedPersonId(null)}
            onDialogVisibilityChange={setChildDialogOpen}
          />
        </div>
      </aside>
    </div>
  );
};
