import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTeamPermissions } from "../TeamPermissionsContext";
import { joinWithAnd } from "../constants";
import { RoleLevelMenu } from "./roles/RoleLevelMenu";
import { RoleOptionsMenu } from "./roles/RoleOptionsMenu";
import {
  ArchivedRolesDialog,
  NewRoleDialog,
  RenameDescribeRoleDialog,
} from "./roles/RoleDialogs";
import { RolesMatrixTable } from "./roles/RolesMatrixTable";
import { RolesSaveBar } from "./roles/RolesSaveBar";
import {
  computeCoverageCheck,
  computeRolesTableLayout,
  getRoleActiveHolders,
} from "./roles/RolesUtils";

export const RolesTab: React.FC = () => {
  const {
    roles,
    draftRoles,
    members,
    hasUnsavedRoleChanges,
    changedCellKeys,
    changedRoleIds,
    setDraftRoleLevel,
    toggleDraftDecision,
    renameOrDescribeDraftRole,
    addDraftRole,
    duplicateDraftRole,
    archiveDraftRole,
    restoreArchivedDraftRole,
    startPreviewRole,
  } = useTeamPermissions();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(1120);
  const [frameHeight, setFrameHeight] = useState(520);
  const [scrolledX, setScrolledX] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [levelMenu, setLevelMenu] = useState<{
    anchorEl: HTMLElement;
    roleId: string;
    sectionId: string;
    requiredDecisionId?: string;
  } | null>(null);

  const [optionsMenu, setOptionsMenu] = useState<{
    anchorEl: HTMLElement;
    roleId: string;
  } | null>(null);

  const [renameRoleId, setRenameRoleId] = useState<string | null>(null);
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [archivedOpen, setArchivedOpen] = useState(false);

  const activeRoles = useMemo(
    () => draftRoles.filter((r) => !r.archived),
    [draftRoles],
  );
  const archivedRoles = useMemo(
    () => draftRoles.filter((r) => r.archived),
    [draftRoles],
  );

  const coverage = useMemo(
    () => computeCoverageCheck(draftRoles, members),
    [draftRoles, members],
  );

  const layout = useMemo(
    () => computeRolesTableLayout(containerWidth, activeRoles.length),
    [containerWidth, activeRoles.length],
  );

  useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
      if (frameRef.current) {
        const rect = frameRef.current.getBoundingClientRect();
        const available = window.innerHeight - rect.top - (hasUnsavedRoleChanges ? 118 : 74);
        setFrameHeight(Math.max(320, Math.floor(available)));
      }
    };
    updateSizes();
    const ro = new ResizeObserver(updateSizes);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateSizes);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSizes);
    };
  }, [hasUnsavedRoleChanges, layout.useFrame]);

  const syncScrollButtons = () => {
    const el = frameRef.current;
    if (!el) return;
    setScrolledX(el.scrollLeft > 2);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    syncScrollButtons();
  }, [layout.useFrame, activeRoles.length, containerWidth]);

  const scrollFrameByColumns = (direction: -1 | 1) => {
    const el = frameRef.current;
    if (!el) return;
    const visibleCols = Math.max(
      1,
      Math.floor((el.clientWidth - layout.firstColWidth) / layout.roleColWidth),
    );
    el.scrollBy({
      left: direction * visibleCols * layout.roleColWidth,
      behavior: "smooth",
    });
  };

  const scrollToFarRight = () => {
    window.setTimeout(() => {
      const el = frameRef.current;
      if (el) {
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      }
    }, 30);
  };

  const levelMenuRole = levelMenu
    ? activeRoles.find((r) => r.roleId === levelMenu.roleId) || null
    : null;
  const optionsMenuRole = optionsMenu
    ? activeRoles.find((r) => r.roleId === optionsMenu.roleId) || null
    : null;
  const renameTargetRole = renameRoleId
    ? activeRoles.find((r) => r.roleId === renameRoleId) || null
    : null;

  const isOptionsRoleUnsavedNew = optionsMenuRole
    ? !roles.some((sr) => sr.roleId === optionsMenuRole.roleId)
    : false;

  return (
    <div ref={containerRef} className="pt-5">
      {/* Top coverage + actions strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-[13px]">
          {coverage.ok ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-[#4F6142] shrink-0" />
              <span className="text-[#4F6142]">
                Every section and decision has someone on the team who can act
                on it.
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-[#A4512F] shrink-0" />
              <span className="text-[#A4512F]">
                Nobody on the team can act on{" "}
                {joinWithAnd(coverage.missingItems)}. Give it to a role someone
                holds.
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {archivedRoles.length > 0 && (
            <button
              type="button"
              onClick={() => setArchivedOpen(true)}
              className="tp-link-gold"
            >
              Archived roles ({archivedRoles.length})
            </button>
          )}

          {layout.useFrame && (
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] text-[#6E6358]">
                {activeRoles.length} roles
              </span>
              <button
                type="button"
                disabled={!canScrollLeft}
                onClick={() => scrollFrameByColumns(-1)}
                className="tp-btn-outline !h-7 !px-2.5 !text-[12px]"
              >
                ‹ Earlier
              </button>
              <button
                type="button"
                disabled={!canScrollRight}
                onClick={() => scrollFrameByColumns(1)}
                className="tp-btn-outline !h-7 !px-2.5 !text-[12px]"
              >
                More ›
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setNewRoleOpen(true)}
            className="tp-btn-outline"
          >
            + New role
          </button>
        </div>
      </div>

      <RolesMatrixTable
        activeRoles={activeRoles}
        members={members}
        layout={layout}
        frameRef={frameRef}
        frameHeight={frameHeight}
        scrolledX={scrolledX}
        onFrameScroll={() => {
          syncScrollButtons();
          setLevelMenu(null);
          setOptionsMenu(null);
        }}
        changedCellKeys={changedCellKeys}
        changedRoleIds={changedRoleIds}
        onOpenLevelMenu={(anchorEl, roleId, sectionId, requiredDecisionId) => {
          setOptionsMenu(null);
          setLevelMenu({ anchorEl, roleId, sectionId, requiredDecisionId });
        }}
        onOpenOptionsMenu={(anchorEl, roleId) => {
          setLevelMenu(null);
          setOptionsMenu({ anchorEl, roleId });
        }}
        onToggleDecision={toggleDraftDecision}
      />

      <p className="mt-3.5 text-[12px] leading-relaxed text-[#6E6358]">
        Edit means they can add and change records there; View means they can
        only look; Hidden takes it off their sidebar. A tick needs Edit on the
        section above it. Alerts in Notifications follow whatever a role can
        open. Only a Founder can open this page.
      </p>

      <RoleLevelMenu
        anchorEl={levelMenu?.anchorEl || null}
        role={levelMenuRole}
        sectionId={levelMenu?.sectionId || null}
        requiredDecisionId={levelMenu?.requiredDecisionId || null}
        onSelect={(level) => {
          if (!levelMenu) return;
          setDraftRoleLevel(
            levelMenu.roleId,
            levelMenu.sectionId,
            level,
            levelMenu.requiredDecisionId,
          );
        }}
        onClose={() => setLevelMenu(null)}
      />

      <RoleOptionsMenu
        anchorEl={optionsMenu?.anchorEl || null}
        role={optionsMenuRole}
        holderCount={
          optionsMenuRole
            ? getRoleActiveHolders(optionsMenuRole.roleId, members).length
            : 0
        }
        hasUnsavedChanges={hasUnsavedRoleChanges}
        isUnsavedNewRole={isOptionsRoleUnsavedNew}
        onPreview={() => {
          if (optionsMenuRole) {
            startPreviewRole(optionsMenuRole.roleId, { returnTab: "roles" });
          }
        }}
        onRename={() => {
          if (optionsMenuRole) setRenameRoleId(optionsMenuRole.roleId);
        }}
        onDuplicate={() => {
          if (optionsMenuRole) {
            const copy = duplicateDraftRole(optionsMenuRole.roleId);
            if (copy) scrollToFarRight();
          }
        }}
        onArchive={() => {
          if (optionsMenuRole) archiveDraftRole(optionsMenuRole.roleId);
        }}
        onClose={() => setOptionsMenu(null)}
      />

      <RenameDescribeRoleDialog
        open={Boolean(renameTargetRole)}
        role={renameTargetRole}
        draftRoles={draftRoles}
        onConfirm={(name, desc) => {
          if (renameTargetRole) {
            renameOrDescribeDraftRole(renameTargetRole.roleId, name, desc);
          }
        }}
        onClose={() => setRenameRoleId(null)}
      />

      <NewRoleDialog
        open={newRoleOpen}
        draftRoles={draftRoles}
        onConfirm={(name, copyFromRoleId) => {
          addDraftRole(name, copyFromRoleId);
          scrollToFarRight();
        }}
        onClose={() => setNewRoleOpen(false)}
      />

      <ArchivedRolesDialog
        open={archivedOpen}
        archivedRoles={archivedRoles}
        onBringBack={(roleId) => restoreArchivedDraftRole(roleId)}
        onClose={() => setArchivedOpen(false)}
      />

      <RolesSaveBar />
    </div>
  );
};
