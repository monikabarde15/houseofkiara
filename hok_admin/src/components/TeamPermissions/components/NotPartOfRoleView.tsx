import React from "react";
import { Lock } from "lucide-react";
import { SECTION_BY_ID } from "../constants";
import { useTeamPermissions } from "../TeamPermissionsContext";

export const NotPartOfRoleView: React.FC<{
  sectionId: string;
  onGoToFirstOpen: () => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
}> = ({ sectionId, onGoToFirstOpen, onGoBack, canGoBack }) => {
  const { effectivePermissions, getFirstOpenSection } = useTeamPermissions();
  const secLabel = SECTION_BY_ID[sectionId]?.label || sectionId;
  const roleName = effectivePermissions.roleName || "your role";
  const firstOpenId = getFirstOpenSection();
  const firstOpenLabel = SECTION_BY_ID[firstOpenId]?.label || "Dashboard";

  return (
    <div className="tp-root flex min-h-[calc(100vh-140px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-[540px] rounded-[10px] border border-[#E6DCCB] bg-white px-10 py-11 text-center shadow-[0_2px_12px_rgba(26,22,18,0.04)]">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2EEF7] text-[#6B5B82]">
          <Lock className="h-5 w-5" />
        </div>
        <h2
          style={{ fontFamily: "var(--tp-serif)" }}
          className="text-[28px] leading-tight font-normal text-[#1A1612]"
        >
          {secLabel} is not part of your role
        </h2>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[#5C5248]">
          Your role, {roleName}, does not include {secLabel}. If you need it,
          ask a Founder to change what {roleName} can open, in Team &amp;
          Permissions.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {canGoBack && onGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="tp-btn-outline"
            >
              Go back
            </button>
          )}
          <button
            type="button"
            onClick={onGoToFirstOpen}
            className="tp-btn-gold"
          >
            Go to {firstOpenLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
