import React from "react";
import { useTeamPermissions } from "../TeamPermissionsContext";

export const PreviewBar: React.FC = () => {
  const {
    preview,
    roles,
    effectivePermissions,
    switchPreviewRole,
    stopPreview,
  } = useTeamPermissions();

  if (!preview.active) return null;

  const previewableRoles = roles.filter(
    (r) => !r.archived && !r.isFixed && r.roleId !== "founder",
  );

  const openCount = effectivePermissions.openSectionsCount;
  const decCount = effectivePermissions.decisions.length;
  const whoLabel = preview.personFirstName
    ? `${preview.personFirstName}, ${effectivePermissions.roleName}`
    : effectivePermissions.roleName;

  return (
    <div className="tp-preview-bar" role="region" aria-label="Role preview">
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <span className="tp-unsaved-dot mt-1 sm:mt-0" />
        <div className="min-w-0">
          <strong className="font-semibold text-[#F3EADB]">
            Previewing as {whoLabel}.
          </strong>{" "}
          <span className="text-[#D9CEBE]">
            {openCount} {openCount === 1 ? "section" : "sections"} open,{" "}
            {decCount} of 14 decisions held. Anything this role cannot do is
            locked; what you do change is still saved in your name.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <select
          aria-label="Switch previewed role"
          value={preview.roleId}
          onChange={(e) => switchPreviewRole(e.target.value)}
          className="h-8 rounded-[5px] border border-[#544637] bg-[#1D1610] px-2.5 text-[12.5px] font-medium text-[#F3EADB] outline-none cursor-pointer"
        >
          {previewableRoles.map((r) => (
            <option key={r.roleId} value={r.roleId}>
              {r.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => stopPreview()}
          className="tp-btn-gold !h-8"
        >
          Stop preview
        </button>
      </div>
    </div>
  );
};
