import React from "react";
import { RoleRecord } from "../../types";
import { TpMenu } from "../SharedPrimitives";

interface RoleOptionsMenuProps {
  anchorEl: HTMLElement | null;
  role: RoleRecord | null;
  holderCount: number;
  hasUnsavedChanges: boolean;
  isUnsavedNewRole: boolean;
  onPreview: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onClose: () => void;
}

export const RoleOptionsMenu: React.FC<RoleOptionsMenuProps> = ({
  anchorEl,
  role,
  holderCount,
  hasUnsavedChanges,
  isUnsavedNewRole,
  onPreview,
  onRename,
  onDuplicate,
  onArchive,
  onClose,
}) => {
  if (!anchorEl || !role) return null;

  const previewDisabled = hasUnsavedChanges || isUnsavedNewRole;
  const archiveDisabled = holderCount > 0;

  return (
    <TpMenu anchorEl={anchorEl} onClose={onClose}>
      <div className="px-4 py-3 border-b border-[#EFE7DA]">
        <div className="text-[13px] font-semibold text-[#1A1612]">
          {role.name}
        </div>
        <p className="mt-1 text-[12px] leading-snug text-[#5C5248]">
          {role.description || "No description yet."}
        </p>
      </div>

      <div className="py-1.5">
        <button
          type="button"
          disabled={previewDisabled}
          onClick={() => {
            if (!previewDisabled) {
              onClose();
              onPreview();
            }
          }}
          className={`w-full px-4 py-2 text-left border-0 bg-transparent ${
            previewDisabled
              ? "opacity-45 cursor-not-allowed"
              : "hover:bg-[#FAF6EE] cursor-pointer"
          }`}
        >
          <div className="text-[12.5px] font-semibold text-[#1A1612]">
            See the panel as this role
          </div>
          <div className="text-[11.5px] text-[#5C5248]">
            {previewDisabled
              ? "Save your changes first."
              : "Browse with exactly its sidebar and locks."}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onRename();
          }}
          className="w-full px-4 py-2 text-left border-0 bg-transparent hover:bg-[#FAF6EE] cursor-pointer"
        >
          <div className="text-[12.5px] font-semibold text-[#1A1612]">
            Rename or describe
          </div>
          <div className="text-[11.5px] text-[#5C5248]">
            The name everyone sees, and one line on the job.
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onDuplicate();
          }}
          className="w-full px-4 py-2 text-left border-0 bg-transparent hover:bg-[#FAF6EE] cursor-pointer"
        >
          <div className="text-[12.5px] font-semibold text-[#1A1612]">
            Duplicate
          </div>
          <div className="text-[11.5px] text-[#5C5248]">
            Start a new role from this one.
          </div>
        </button>

        <button
          type="button"
          disabled={archiveDisabled}
          onClick={() => {
            if (!archiveDisabled) {
              onClose();
              onArchive();
            }
          }}
          className={`w-full px-4 py-2 text-left border-0 bg-transparent ${
            archiveDisabled
              ? "opacity-45 cursor-not-allowed"
              : "hover:bg-[#FDF5F2] cursor-pointer"
          }`}
        >
          <div className="text-[12.5px] font-semibold text-[#A4512F]">
            Archive
          </div>
          <div className="text-[11.5px] text-[#5C5248]">
            {archiveDisabled
              ? `Give ${holderCount} ${holderCount === 1 ? "person" : "people"} another role first.`
              : "Nobody holds it, so it can go."}
          </div>
        </button>
      </div>
    </TpMenu>
  );
};
