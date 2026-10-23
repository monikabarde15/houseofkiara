/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LevelTwoShell (Spec §7.1, §7.2, §7.3, §7.9, §8.1, §8.2, §8.3, §8.4, §8.5)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, WorkspaceTab, FigureItem, CheckItem } from '../../types';
import { WorkspaceHeader } from './WorkspaceHeader';
import { PageNavTree } from './PageNavTree';
import { PagePaper } from './PagePaper';
import { WorkspaceRightPanel } from './WorkspaceRightPanel';
import { WorkspaceChecksTab } from './WorkspaceChecksTab';
import { WorkspaceHistoryTab } from './WorkspaceHistoryTab';
import { WorkspaceReachTab } from './WorkspaceReachTab';
import { WorkspacePreviewTab } from './WorkspacePreviewTab';
import { NotBuiltWorkspace } from './NotBuiltWorkspace';
import { SystemPageWorkspace } from './SystemPageWorkspace';
import { PageSettingsDrawer } from './PageSettingsDrawer';
import { Sliders, SidebarClose, SidebarOpen } from 'lucide-react';

interface LevelTwoShellProps {
  page: PageCardData;
  pages: PageCardData[];
  figures: FigureItem[];
  checks: CheckItem[];
  onSelectPage: (slug: string) => void;
  onBackToLevelOne: () => void;
  activeWorkspaceTab: WorkspaceTab;
  onWorkspaceTabChange: (tab: WorkspaceTab) => void;
  onUpdateFigure?: (key: string, newValue: string) => void;
  onResolveCheck: (checkId: string) => void;
  onUndoCheck?: (checkId: string) => void;
  onAcknowledgeCheck?: (checkId: string, reason: string) => void;
  onCreateDraft?: (slug: string, initialTitle: string, initialSummary: string) => void;
  onUnlinkNavigation?: (slug: string) => void;
  userRole?: 'Super Admin' | 'Operations Manager' | 'Content Manager' | 'Viewer';
  accessLevel?: 'Full Access' | 'Edit' | 'View Only';
}

export const LevelTwoShell: React.FC<LevelTwoShellProps> = ({
  page,
  pages,
  figures,
  checks,
  onSelectPage,
  onBackToLevelOne,
  activeWorkspaceTab,
  onWorkspaceTabChange,
  onUpdateFigure,
  onResolveCheck,
  onUndoCheck,
  onAcknowledgeCheck,
  onCreateDraft,
  onUnlinkNavigation,
  userRole = 'Super Admin',
  accessLevel = 'Full Access'
}) => {
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<FigureItem | null>(null);
  const [showMode, setShowMode] = useState<'changes' | 'live' | 'date'>('changes');
  const [selectedDate, setSelectedDate] = useState<string>('20 October 2026');

  const handleSelectFigureToken = (fig: FigureItem) => {
    setSelectedFigure(fig);
    setIsInspectorOpen(true);
  };

  const isNotBuiltYet = page.group === 'not-built' && !page.isBuilt;
  const isSystemPage = page.group === 'system';

  return (
    <div className="min-h-screen bg-[#efe7db] flex flex-col text-[#1a1612]">
      {/* View Only Banner (Spec §11, Screen 63) */}
      {accessLevel === 'View Only' && (
        <div className="bg-[#fdf8e6] border-b border-[#eedca6] px-6 py-2 text-xs text-[#7d5e16] flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-2xs z-30">
          <span className="font-medium">
            View only. Your role ({userRole}) has View Only on this section.
          </span>
          <span className="text-[11px] text-[#9c7826]">
            The paper cannot be typed into, settings are read only, and action buttons are hidden.
          </span>
        </div>
      )}

      {/* 1. Level Two Header (Spec §3.1 & §7.2) */}
      <WorkspaceHeader
        page={page}
        activeTab={activeWorkspaceTab}
        onTabChange={onWorkspaceTabChange}
        onBackToLevelOne={onBackToLevelOne}
        hasUnsavedChanges={false}
        onOpenSettings={() => setIsPageSettingsOpen(true)}
        showMode={showMode}
        onShowModeChange={mode => setShowMode(mode)}
      />

      {/* 2. Main Three-Zone Body (Spec §7.1) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Zone: Navigation Tree (240px) */}
        <PageNavTree
          pages={pages}
          selectedSlug={page.slug}
          onSelectPage={slug => {
            onSelectPage(slug);
            setSelectedFigure(null);
          }}
        />

        {/* Middle Zone: The Desk (#EFE7DB) carrying the Paper */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center bg-[#efe7db] min-h-[calc(100vh-84px)]">
          <div className={`w-full space-y-6 ${activeWorkspaceTab === 'preview' ? 'max-w-[1040px]' : 'max-w-[760px]'}`}>
            {/* Tab 1: Edit */}
            {activeWorkspaceTab === 'edit' && (
              <>
                {isNotBuiltYet ? (
                  <NotBuiltWorkspace
                    page={page}
                    onCreateDraft={(slug, title, summary) => {
                      onCreateDraft?.(slug, title, summary);
                    }}
                    onUnlinkNavigation={slug => {
                      onUnlinkNavigation?.(slug);
                    }}
                    builtPages={pages.filter(p => p.isBuilt).map(p => ({ slug: p.slug, title: p.title }))}
                  />
                ) : isSystemPage ? (
                  <SystemPageWorkspace
                    page={page}
                    figures={figures}
                    onSelectFigure={handleSelectFigureToken}
                  />
                ) : (
                  <PagePaper
                    page={page}
                    figures={figures}
                    checks={checks}
                    onSelectFigure={handleSelectFigureToken}
                    selectedFigureKey={selectedFigure?.key}
                    showMode={showMode}
                    selectedDate={selectedDate}
                    onResetShowMode={() => setShowMode('changes')}
                    onSelectCheck={() => onWorkspaceTabChange('checks')}
                  />
                )}
              </>
            )}

            {/* Tab 2: Checks */}
            {activeWorkspaceTab === 'checks' && (
              <WorkspaceChecksTab
                page={page}
                checks={checks}
                onResolveCheck={onResolveCheck}
                onUndoCheck={onUndoCheck}
                onAcknowledgeCheck={onAcknowledgeCheck}
                onSwitchToEdit={() => onWorkspaceTabChange('edit')}
              />
            )}

            {/* Tab 3: History */}
            {activeWorkspaceTab === 'history' && (
              <WorkspaceHistoryTab
                page={page}
                onSwitchToEdit={() => onWorkspaceTabChange('edit')}
              />
            )}

            {/* Tab 4: Reach */}
            {activeWorkspaceTab === 'reach' && (
              <WorkspaceReachTab
                page={page}
                figures={figures}
                onSelectFigure={handleSelectFigureToken}
                onNavigateToPage={onSelectPage}
                onSwitchToEdit={() => onWorkspaceTabChange('edit')}
              />
            )}

            {/* Tab 5: Preview (Storefront Live Preview & Scheduled Simulator) */}
            {activeWorkspaceTab === 'preview' && (
              <WorkspacePreviewTab
                page={page}
                figures={figures}
                onSwitchToEdit={() => onWorkspaceTabChange('edit')}
              />
            )}
          </div>
        </main>

        {/* Right Zone: Inspector Panel (384px, Spec §7.1) */}
        {isInspectorOpen ? (
          <aside className="w-[384px] shrink-0 bg-[#fffefb] border-l border-[#e6dccb] flex flex-col h-[calc(100vh-84px)] sticky top-[84px] shadow-[-2px_0_10px_rgba(26,22,18,0.02)]">
            <div className="px-4 py-3 border-b border-[#e6dccb] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#8a6a36]" />
                <span className="text-xs font-semibold text-[#1a1612]">
                  {selectedFigure ? 'Figure Inspector' : 'Inspector'}
                </span>
              </div>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="p-1 rounded-[4px] text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db] transition-colors cursor-pointer"
                title="Collapse inspector"
              >
                <SidebarClose className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <WorkspaceRightPanel
                page={page}
                activeFigure={selectedFigure}
                onClearActiveFigure={() => setSelectedFigure(null)}
                onUpdateFigureValue={onUpdateFigure}
                onNavigateToPage={onSelectPage}
                onNavigateToChecks={() => onWorkspaceTabChange('checks')}
                onNavigateToReach={() => onWorkspaceTabChange('reach')}
              />
            </div>
          </aside>
        ) : (
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="fixed right-3 bottom-6 p-2 rounded-[6px] bg-[#fffefb] border border-[#d9ccb6] text-[#8a6a36] hover:bg-[#efe7db] shadow-md transition-colors cursor-pointer z-20 flex items-center gap-1.5 text-xs font-medium"
            title="Open inspector"
          >
            <SidebarOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Inspector</span>
          </button>
        )}
      </div>

      {/* Page Settings Drawer (Spec §7.9, Screens 28–30) */}
      <PageSettingsDrawer
        page={page}
        isOpen={isPageSettingsOpen}
        onClose={() => setIsPageSettingsOpen(false)}
        accessLevel={accessLevel}
        onReadAsOnDate={dateStr => {
          setSelectedDate(dateStr);
          setShowMode('date');
        }}
        onMarkReviewedToday={() => {
          console.log('Stamped review date for:', page.slug);
        }}
        onSave={settings => {
          console.log('Saved page settings:', settings);
        }}
      />
    </div>
  );
};

export default LevelTwoShell;