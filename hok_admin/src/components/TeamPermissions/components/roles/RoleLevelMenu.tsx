import React from "react";
import { DECISION_BY_ID, SECTION_BY_ID } from "../../constants";
import { RoleRecord, SectionLevel } from "../../types";
import { TpMenu } from "../SharedPrimitives";

interface RoleLevelMenuProps {
  anchorEl: HTMLElement | null;
  role: RoleRecord | null;
  sectionId: string | null;
  requiredDecisionId?: string | null;
  onSelect: (level: SectionLevel) => void;
  onClose: () => void;
}

const CHOICES: Array<{
  level: SectionLevel;
  pillClass: string;
  caption: string;
}> = [
  { level: "Edit", pillClass: "is-edit", caption: "Can add and change" },
  { level: "View", pillClass: "is-view", caption: "Can open and read" },
  { level: "Hidden", pillClass: "is-hidden", caption: "Not in their sidebar" },
];

export const RoleLevelMenu: React.FC<RoleLevelMenuProps> = ({
  anchorEl,
  role,
  sectionId,
  requiredDecisionId,
  onSelect,
  onClose,
}) => {
  if (!anchorEl || !role || !sectionId) return null;
  const section = SECTION_BY_ID[sectionId];
  if (!section) return null;

  const currentLevel = role.levels[sectionId] || "Hidden";
  const decision = requiredDecisionId
    ? DECISION_BY_ID[requiredDecisionId]
    : null;
  const isViewOnlySection = section.maxLevel === "View";

  return (
    <TpMenu anchorEl={anchorEl} onClose={onClose}>
      <div className="px-4 py-3 border-b border-[#EFE7DA]">
        <div className="text-[13px] font-semibold text-[#1A1612]">
          {section.label} for {role.name}
        </div>
        <p className="mt-1 text-[12px] leading-snug text-[#5C5248]">
          {section.description}
        </p>
        {decision && (
          <p className="mt-1.5 text-[12px] leading-snug text-[#A4512F]">
            {decision.label} needs Edit here first.
          </p>
        )}
      </div>

      <div className="py-1.5">
        {CHOICES.map((c) => {
          const disabled = isViewOnlySection && c.level === "Edit";
          const isCurrent = currentLevel === c.level;
          return (
            <button
              key={c.level}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  onSelect(c.level);
                  onClose();
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left border-0 transition-colors ${
                disabled
                  ? "opacity-45 cursor-not-allowed bg-transparent"
                  : isCurrent
                    ? "bg-[#F5EDD8] cursor-pointer"
                    : "bg-transparent hover:bg-[#FAF6EE] cursor-pointer"
              }`}
            >
              <span
                className={`tp-level-pill ${c.pillClass}`}
                style={{ minWidth: 56, height: 22, fontSize: 12 }}
              >
                {c.level}
              </span>
              <span className="text-[12.5px] text-[#1A1612]">
                {disabled ? "Only ever viewed" : c.caption}
              </span>
            </button>
          );
        })}
      </div>
    </TpMenu>
  );
};
