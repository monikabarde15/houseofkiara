import React from "react";
import { useTeamPermissions } from "../../TeamPermissionsContext";
import { joinWithAnd } from "../../constants";

export const RolesSaveBar: React.FC = () => {
  const {
    hasUnsavedRoleChanges,
    unsavedChangeCount,
    changedRoleNames,
    draftValidationError,
    discardRoleDraft,
    saveRoleDraft,
    savingRoles,
  } = useTeamPermissions();

  if (!hasUnsavedRoleChanges) return null;

  return (
    <div className="tp-save-bar" role="region" aria-label="Unsaved role changes">
      <div className="flex items-center gap-2.5 min-w-0 text-[13px] text-[#1A1612]">
        <span className="tp-unsaved-dot" />
        <span className="truncate">
          <strong className="font-semibold">
            {unsavedChangeCount}{" "}
            {unsavedChangeCount === 1 ? "change" : "changes"}
          </strong>{" "}
          to {joinWithAnd(changedRoleNames)}, not saved yet.
          {draftValidationError && (
            <span className="ml-2 text-[#A4512F] font-medium">
              {draftValidationError}
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={discardRoleDraft}
          disabled={savingRoles}
          className="tp-btn-outline"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={() => saveRoleDraft()}
          disabled={Boolean(draftValidationError) || savingRoles}
          className="tp-btn-gold"
        >
          {savingRoles ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
};
