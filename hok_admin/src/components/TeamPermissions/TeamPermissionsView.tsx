import React from "react";
import "./TeamPermissions.css";
import { useTeamPermissions } from "./TeamPermissionsContext";
import { TeamTab } from "./components/TeamTab";
import { RolesTab } from "./components/RolesTab";
import { HistoryTab } from "./components/HistoryTab";
import { NotPartOfRoleView } from "./components/NotPartOfRoleView";
import { TeamPermissionsTab } from "./types";

interface TeamPermissionsViewProps {
  onNavigateView?: (view: string, intent?: any) => void;
}

export const TeamPermissionsView: React.FC<TeamPermissionsViewProps> = ({
  onNavigateView,
}) => {
  const {
    loading,
    effectivePermissions,
    activeTab,
    setActiveTab,
    hasUnsavedRoleChanges,
    getFirstOpenSection,
  } = useTeamPermissions();

  // Spec §2 & §9.2: Only a Founder can open Team & Permissions
  if (!effectivePermissions.isFounder) {
    return (
      <NotPartOfRoleView
        sectionId="roles_permissions"
        onGoToFirstOpen={() => onNavigateView?.(getFirstOpenSection())}
      />
    );
  }

  const tabs: Array<{ id: TeamPermissionsTab; label: string }> = [
    { id: "team", label: "Team" },
    { id: "roles", label: "Roles" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="tp-root">
      <div className="tp-page-container">
        <header>
          <h1 className="tp-page-title">Team &amp; Permissions</h1>
          <p className="tp-page-subtitle">
            Who can sign in, and what each role can open and decide.
          </p>
        </header>

        <div className="tp-tabs-bar" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const showDot = tab.id === "roles" && hasUnsavedRoleChanges;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`tp-tab-btn ${isActive ? "is-active" : ""}`}
              >
                <span>{tab.label}</span>
                {showDot && (
                  <span
                    className="tp-unsaved-dot"
                    title="Unsaved changes"
                    aria-label="Unsaved changes"
                  />
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="pt-6 text-[13px] text-[#6E6358]">
            Loading team and roles...
          </div>
        ) : (
          <>
            {activeTab === "team" && <TeamTab onNavigateView={onNavigateView} />}
            {activeTab === "roles" && <RolesTab />}
            {activeTab === "history" && <HistoryTab />}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamPermissionsView;
