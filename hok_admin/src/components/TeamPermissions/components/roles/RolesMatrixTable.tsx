import React from "react";
import { Check, Lock } from "lucide-react";
import { DECISIONS, SECTION_GROUPS, SECTIONS } from "../../constants";
import { RoleRecord, TeamMemberRecord } from "../../types";
import { RolesLayoutMetrics, getRoleHoldersText } from "./RolesUtils";

interface RolesMatrixTableProps {
  activeRoles: RoleRecord[];
  members: TeamMemberRecord[];
  layout: RolesLayoutMetrics;
  frameRef: React.RefObject<HTMLDivElement | null>;
  frameHeight: number;
  scrolledX: boolean;
  onFrameScroll: () => void;
  changedCellKeys: Set<string>;
  changedRoleIds: Set<string>;
  onOpenLevelMenu: (
    anchorEl: HTMLElement,
    roleId: string,
    sectionId: string,
    requiredDecisionId?: string,
  ) => void;
  onOpenOptionsMenu: (anchorEl: HTMLElement, roleId: string) => void;
  onToggleDecision: (roleId: string, decisionId: string) => void;
}

export const RolesMatrixTable: React.FC<RolesMatrixTableProps> = ({
  activeRoles,
  members,
  layout,
  frameRef,
  frameHeight,
  scrolledX,
  onFrameScroll,
  changedCellKeys,
  changedRoleIds,
  onOpenLevelMenu,
  onOpenOptionsMenu,
  onToggleDecision,
}) => {
  const { useFrame, firstColWidth, founderColWidth, roleColWidth, tableWidth } =
    layout;

  const stickyLeftStyle: React.CSSProperties = useFrame
    ? {
        position: "sticky",
        left: 0,
        zIndex: 15,
        backgroundColor: "#FFFFFF",
        boxShadow: scrolledX
          ? "6px 0 12px -4px rgba(26, 22, 18, 0.12)"
          : undefined,
      }
    : {};

  const stickyCornerStyle: React.CSSProperties = useFrame
    ? {
        position: "sticky",
        left: 0,
        top: 0,
        zIndex: 30,
        backgroundColor: "#FFFEFB",
        boxShadow: scrolledX
          ? "6px 0 12px -4px rgba(26, 22, 18, 0.12)"
          : undefined,
      }
    : {
        position: "sticky",
        top: 0,
        zIndex: 20,
        backgroundColor: "#FFFEFB",
      };

  const acrossDecisions = DECISIONS.filter((d) => d.tableSectionId === null);

  return (
    <div
      ref={frameRef}
      onScroll={onFrameScroll}
      style={
        useFrame
          ? {
              height: frameHeight,
              minHeight: 320,
              overflow: "auto",
            }
          : { overflow: "visible" }
      }
      className="bg-white border border-[#E6DCCB] rounded-[8px]"
    >
      <table
        style={{ width: useFrame ? tableWidth : "100%" }}
        className="border-collapse table-fixed"
      >
        <colgroup>
          <col style={{ width: firstColWidth }} />
          {activeRoles.map((r) => (
            <col
              key={r.roleId}
              style={{
                width: r.isFixed ? founderColWidth : roleColWidth,
              }}
            />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th
              style={stickyCornerStyle}
              className="px-5 py-3.5 text-left align-bottom border-b border-[#E6DCCB] bg-[#FFFEFB] text-[12px] font-normal text-[#6E6358]"
            >
              Click a cell to change it
            </th>
            {activeRoles.map((role) => {
              const isFounder = role.isFixed || role.roleId === "founder";
              const holdersText = getRoleHoldersText(role.roleId, members);
              const showRoleDot = !isFounder && changedRoleIds.has(role.roleId);
              return (
                <th
                  key={role.roleId}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    backgroundColor: isFounder ? "#FCFAF6" : "#FFFEFB",
                  }}
                  className="px-2.5 py-3.5 text-center align-bottom border-b border-[#E6DCCB] font-normal"
                >
                  <div className="inline-flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-[#1A1612] leading-snug">
                    <span>{role.name}</span>
                    {isFounder && (
                      <Lock className="h-3 w-3 text-[#8A7E72] shrink-0" />
                    )}
                    {showRoleDot && (
                      <span
                        className="tp-unsaved-dot"
                        title="Unsaved changes"
                      />
                    )}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-[#6E6358] truncate">
                    {holdersText}
                  </div>
                  <div className="mt-1">
                    {isFounder ? (
                      <span className="text-[12px] text-[#6E6358]">
                        Everything
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) =>
                          onOpenOptionsMenu(e.currentTarget, role.roleId)
                        }
                        className="tp-link-gold text-[12px]"
                      >
                        Options
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {SECTION_GROUPS.map((groupName) => {
            const groupSections = SECTIONS.filter(
              (s) => s.group === groupName && s.inRolesTable,
            );
            if (groupSections.length === 0) return null;

            return (
              <React.Fragment key={groupName}>
                <tr>
                  <td
                    style={{
                      ...(useFrame
                        ? { ...stickyLeftStyle, backgroundColor: "#FAF7F2" }
                        : { backgroundColor: "#FAF7F2" }),
                    }}
                    className="px-5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72] border-t border-b border-[#EFE7DA]"
                  >
                    {groupName}
                  </td>
                  {activeRoles.map((role) => (
                    <td
                      key={`${groupName}-${role.roleId}`}
                      className="bg-[#FAF7F2] border-t border-b border-[#EFE7DA]"
                    />
                  ))}
                </tr>

                {groupSections.map((sec) => {
                  const sectionDecisions = DECISIONS.filter(
                    (d) => d.tableSectionId === sec.id,
                  );

                  return (
                    <React.Fragment key={sec.id}>
                      <tr className="border-b border-[#EFE7DA]">
                        <td
                          style={stickyLeftStyle}
                          className="px-5 py-3 text-[13.5px] text-[#1A1612]"
                        >
                          {sec.label}
                        </td>
                        {activeRoles.map((role) => {
                          const isFounder =
                            role.isFixed || role.roleId === "founder";
                          const level = role.levels[sec.id] || "Hidden";
                          const isChanged = changedCellKeys.has(
                            `${role.roleId}:sec:${sec.id}`,
                          );
                          const pillClass =
                            level === "Edit"
                              ? "is-edit"
                              : level === "View"
                                ? "is-view"
                                : "is-hidden";

                          return (
                            <td
                              key={`${sec.id}-${role.roleId}`}
                              style={{
                                backgroundColor: isFounder
                                  ? "#FCFAF6"
                                  : undefined,
                              }}
                              className="px-2 py-2.5 text-center"
                            >
                              {isFounder ? (
                                <span
                                  className={`tp-level-pill ${pillClass} is-founder`}
                                >
                                  {level}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    onOpenLevelMenu(
                                      e.currentTarget,
                                      role.roleId,
                                      sec.id,
                                    )
                                  }
                                  className={`tp-level-pill ${pillClass} ${
                                    isChanged ? "is-changed" : ""
                                  }`}
                                >
                                  {level}
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {sectionDecisions.map((dec) => (
                        <tr key={dec.id} className="border-b border-[#EFE7DA]">
                          <td
                            style={stickyLeftStyle}
                            className="pl-[40px] pr-4 py-2.5 text-[12.5px] text-[#5C5248] relative"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute left-[26px] top-[8px] w-[9px] h-[11px] border-l border-b border-[#D8CEBE]"
                            />
                            {dec.label}
                          </td>

                          {activeRoles.map((role) => {
                            const isFounder =
                              role.isFixed || role.roleId === "founder";
                            const held =
                              isFounder || role.decisions.includes(dec.id);
                            const reachable =
                              isFounder ||
                              dec.needsEditOn.length === 0 ||
                              dec.needsEditOn.some(
                                (sId) => role.levels[sId] === "Edit",
                              );
                            const isChanged = changedCellKeys.has(
                              `${role.roleId}:dec:${dec.id}`,
                            );

                            return (
                              <td
                                key={`${dec.id}-${role.roleId}`}
                                style={{
                                  backgroundColor: isFounder
                                    ? "#FCFAF6"
                                    : undefined,
                                }}
                                className="px-2 py-2 text-center"
                              >
                                {isFounder ? (
                                  <span className="tp-decision-circle is-held is-founder">
                                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                  </span>
                                ) : reachable ? (
                                  <button
                                    type="button"
                                    aria-label={`${dec.label} for ${role.name}`}
                                    aria-pressed={held}
                                    onClick={() =>
                                      onToggleDecision(role.roleId, dec.id)
                                    }
                                    className={`tp-decision-btn ${
                                      isChanged ? "is-changed" : ""
                                    }`}
                                  >
                                    <span
                                      className={`tp-decision-circle ${
                                        held ? "is-held" : "is-empty"
                                      }`}
                                    >
                                      {held && (
                                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                      )}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    aria-label={`${dec.label} requires Edit on ${sec.label}`}
                                    onClick={(e) =>
                                      onOpenLevelMenu(
                                        e.currentTarget,
                                        role.roleId,
                                        sec.id,
                                        dec.id,
                                      )
                                    }
                                    className={`tp-decision-btn ${
                                      isChanged ? "is-changed" : ""
                                    }`}
                                  >
                                    <span className="tp-decision-dot" />
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}

          {/* Across the panel */}
          <tr>
            <td
              style={{
                ...(useFrame
                  ? { ...stickyLeftStyle, backgroundColor: "#FAF7F2" }
                  : { backgroundColor: "#FAF7F2" }),
              }}
              className="px-5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72] border-t border-b border-[#EFE7DA]"
            >
              Across the panel
            </td>
            {activeRoles.map((role) => (
              <td
                key={`across-${role.roleId}`}
                className="bg-[#FAF7F2] border-t border-b border-[#EFE7DA]"
              />
            ))}
          </tr>

          {acrossDecisions.map((dec) => (
            <tr key={dec.id}>
              <td
                style={stickyLeftStyle}
                className="pl-[40px] pr-4 py-3 text-[12.5px] text-[#5C5248] relative"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-[26px] top-[10px] w-[9px] h-[11px] border-l border-b border-[#D8CEBE]"
                />
                {dec.label}
              </td>
              {activeRoles.map((role) => {
                const isFounder = role.isFixed || role.roleId === "founder";
                const held = isFounder || role.decisions.includes(dec.id);
                const isChanged = changedCellKeys.has(
                  `${role.roleId}:dec:${dec.id}`,
                );
                return (
                  <td
                    key={`${dec.id}-${role.roleId}`}
                    style={{
                      backgroundColor: isFounder ? "#FCFAF6" : undefined,
                    }}
                    className="px-2 py-2.5 text-center"
                  >
                    {isFounder ? (
                      <span className="tp-decision-circle is-held is-founder">
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        aria-label={`${dec.label} for ${role.name}`}
                        aria-pressed={held}
                        onClick={() => onToggleDecision(role.roleId, dec.id)}
                        className={`tp-decision-btn ${
                          isChanged ? "is-changed" : ""
                        }`}
                      >
                        <span
                          className={`tp-decision-circle ${
                            held ? "is-held" : "is-empty"
                          }`}
                        >
                          {held && (
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          )}
                        </span>
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
