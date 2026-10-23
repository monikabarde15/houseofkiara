/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Main Entry Component (Spec §1 to §9)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import './tokens.css';
import { TopLevelTab, PageCardData, FigureItem, LinksAndAddressesData, WorkspaceTab, CheckItem } from './types';
import { SEED_PAGES, SEED_FIGURES, SEED_CHECKS, SEED_LINKS_ADDRESSES } from './data';
import { PagesHeader } from './components/PagesHeader';
import { PagesWorkspaceTab } from './components/PagesWorkspaceTab';
import { FiguresWorkspaceTab } from './components/figures/FiguresWorkspaceTab';
import { LinksWorkspaceTab } from './components/links/LinksWorkspaceTab';
import { LevelTwoShell } from './components/workspace/LevelTwoShell';

interface PagesModuleProps {
  onBackToDashboard?: () => void;
}

export const PagesModule: React.FC<PagesModuleProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<TopLevelTab>('pages');
  const [pages, setPages] = useState<PageCardData[]>(SEED_PAGES);
  const [figures, setFigures] = useState<FigureItem[]>(SEED_FIGURES);
  const [checks, setChecks] = useState<CheckItem[]>(SEED_CHECKS);
  const [linksData, setLinksData] = useState<LinksAndAddressesData>(SEED_LINKS_ADDRESSES);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);
  const [selectedFigureKey, setSelectedFigureKey] = useState<string | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('edit');
  const [userRole, setUserRole] = useState<'Super Admin' | 'Operations Manager' | 'Content Manager' | 'Viewer'>('Super Admin');
  const accessLevel: 'Full Access' | 'Edit' | 'View Only' =
    userRole === 'Viewer'
      ? 'View Only'
      : userRole === 'Operations Manager'
      ? 'Edit'
      : 'Full Access';
  const [pendingChanges, setPendingChanges] = useState<Array<{
    id: string;
    type: 'figure' | 'page' | 'check';
    title: string;
    details: string;
    source: string;
  }>>([]);

  const selectedPage = pages.find(p => p.slug === selectedPageSlug);

  const handleSelectFigure = (figureKey: string) => {
    setSelectedFigureKey(figureKey);
    setActiveTab('figures');
    setSelectedPageSlug(null);
  };

  const handleSelectPage = (slug: string) => {
    setSelectedPageSlug(slug);
    setActiveWorkspaceTab('edit');
  };

  const handleQueueChange = (change: {
    id: string;
    type: 'figure' | 'page' | 'check';
    title: string;
    details: string;
    source: string;
  }) => {
    setPendingChanges(prev => [...prev.filter(c => c.id !== change.id), change]);
  };

  const handleUpdateFigure = (key: string, newValue: string) => {
    setFigures(prev =>
      prev.map(f => {
        if (f.key === key) {
          return {
            ...f,
            value: newValue,
            displayValue: newValue,
            status: 'waiting'
          };
        }
        return f;
      })
    );

    const targetFig = figures.find(f => f.key === key);
    if (targetFig) {
      handleQueueChange({
        id: `fig_${key}`,
        type: 'figure',
        title: `Updated ${targetFig.label}`,
        details: `Value changed to "${newValue}". Affects ${targetFig.reachCount} connected pages.`,
        source: 'Figure edit'
      });
    }
  };

  const handleResolveCheck = (checkId: string) => {
    const targetCheck = checks.find(c => c.id === checkId);
    if (!targetCheck) return;

    setChecks(prev =>
      prev.map(c => (c.id === checkId ? { ...c, resolved: true } : c))
    );

    // Update page checks count
    setPages(prev =>
      prev.map(p => {
        if (p.slug === targetCheck.pageSlug) {
          const newChecksCount = Math.max(0, p.checksCount - 1);
          const newHigh = targetCheck.importance === 'high' ? Math.max(0, p.highChecksCount - 1) : p.highChecksCount;
          const newMedium = targetCheck.importance === 'medium' ? Math.max(0, p.mediumChecksCount - 1) : p.mediumChecksCount;
          const newLow = targetCheck.importance === 'low' ? Math.max(0, p.lowChecksCount - 1) : p.lowChecksCount;
          return {
            ...p,
            checksCount: newChecksCount,
            highChecksCount: newHigh,
            mediumChecksCount: newMedium,
            lowChecksCount: newLow,
            health: newChecksCount === 0 ? 'clean' : p.health
          };
        }
        return p;
      })
    );

    handleQueueChange({
      id: `resolve_${checkId}`,
      type: 'check',
      title: `Resolved: ${targetCheck.title}`,
      details: `${targetCheck.actionLabel} applied on ${targetCheck.pageSlug}`,
      source: 'Checks inspector'
    });
  };

  const handleUndoCheck = (checkId: string) => {
    const targetCheck = checks.find(c => c.id === checkId);
    if (!targetCheck) return;

    setChecks(prev =>
      prev.map(c => (c.id === checkId ? { ...c, resolved: false } : c))
    );

    setPages(prev =>
      prev.map(p => {
        if (p.slug === targetCheck.pageSlug) {
          return {
            ...p,
            checksCount: p.checksCount + 1,
            highChecksCount: targetCheck.importance === 'high' ? p.highChecksCount + 1 : p.highChecksCount,
            mediumChecksCount: targetCheck.importance === 'medium' ? p.mediumChecksCount + 1 : p.mediumChecksCount,
            lowChecksCount: targetCheck.importance === 'low' ? p.lowChecksCount + 1 : p.lowChecksCount,
            health: 'needs-attention'
          };
        }
        return p;
      })
    );

    setPendingChanges(prev => prev.filter(c => c.id !== `resolve_${checkId}`));
  };

  const handleAcknowledgeCheck = (checkId: string, reason: string) => {
    const targetCheck = checks.find(c => c.id === checkId);
    if (!targetCheck) return;

    setChecks(prev =>
      prev.map(c =>
        c.id === checkId
          ? {
              ...c,
              acknowledged: true,
              acknowledgedReason: reason,
              acknowledgedBy: 'Admin (Aman S.)',
              acknowledgedAt: '20 Oct 2026'
            }
          : c
      )
    );

    // Update page checks count
    setPages(prev =>
      prev.map(p => {
        if (p.slug === targetCheck.pageSlug) {
          const newChecksCount = Math.max(0, p.checksCount - 1);
          const newHigh = targetCheck.importance === 'high' ? Math.max(0, p.highChecksCount - 1) : p.highChecksCount;
          const newMedium = targetCheck.importance === 'medium' ? Math.max(0, p.mediumChecksCount - 1) : p.mediumChecksCount;
          const newLow = targetCheck.importance === 'low' ? Math.max(0, p.lowChecksCount - 1) : p.lowChecksCount;
          return {
            ...p,
            checksCount: newChecksCount,
            highChecksCount: newHigh,
            mediumChecksCount: newMedium,
            lowChecksCount: newLow,
            health: newChecksCount === 0 ? 'clean' : 'needs-attention'
          };
        }
        return p;
      })
    );
  };

  const handleCreateDraft = (slug: string, initialTitle: string, initialSummary: string) => {
    setPages(prev =>
      prev.map(p => {
        if (p.slug === slug) {
          return {
            ...p,
            isBuilt: true,
            title: initialTitle,
            summary: initialSummary,
            version: 'v0.1-draft',
            lastPublished: 'Draft in progress',
            lastEditor: 'Editor (Current draft)',
            wordsCount: 450,
            figuresCount: 2,
            checksCount: 0,
            highChecksCount: 0,
            mediumChecksCount: 0,
            lowChecksCount: 0,
            health: 'clean'
          };
        }
        return p;
      })
    );

    handleQueueChange({
      id: `draft_${slug}`,
      type: 'page',
      title: `Created draft for ${initialTitle}`,
      details: `Generated starter structure for ${slug}`,
      source: 'Template scaffolder'
    });
  };

  const handleUnlinkNavigation = (slug: string) => {
    handleQueueChange({
      id: `unlink_${slug}`,
      type: 'page',
      title: `Suppressed navigation link for ${slug}`,
      details: 'Temporarily removed from storefront header/footer menus',
      source: 'Navigation management'
    });
  };

  const handleConfirmPublish = () => {
    setPendingChanges([]);
    setFigures(prev =>
      prev.map(f => (f.status === 'waiting' ? { ...f, status: 'live' } : f))
    );
    setPages(prev =>
      prev.map(p => ({
        ...p,
        lastPublished: 'Just now',
        lastEditor: 'You (Published)'
      }))
    );
  };

  // If a page is selected, render the Level Two 3-Zone Workspace Shell (Spec §7 & §8)
  if (selectedPageSlug && selectedPage) {
    return (
      <LevelTwoShell
        page={selectedPage}
        pages={pages}
        figures={figures}
        checks={checks}
        onSelectPage={handleSelectPage}
        onBackToLevelOne={() => setSelectedPageSlug(null)}
        activeWorkspaceTab={activeWorkspaceTab}
        onWorkspaceTabChange={setActiveWorkspaceTab}
        onUpdateFigure={handleUpdateFigure}
        onResolveCheck={handleResolveCheck}
        onUndoCheck={handleUndoCheck}
        onAcknowledgeCheck={handleAcknowledgeCheck}
        onCreateDraft={handleCreateDraft}
        onUnlinkNavigation={handleUnlinkNavigation}
        userRole={userRole}
        accessLevel={accessLevel}
      />
    );
  }

  // Otherwise render Level One Shell (Spec §3, §4, §5, §6)
  return (
    <div className="hok-pages-root min-h-screen bg-[#f7f2ea] text-[#1a1612]">
      {/* Level One Sticky Header (Spec §3.1 & §3.4) */}
      <PagesHeader
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
          if (tab !== 'pages') setSelectedPageSlug(null);
        }}
        pagesCount={pages.length}
        figuresCount={figures.length}
        thingsToFixCount={linksData.summary.thingsToFixCount}
        hasScheduledChanges={true}
        hasPendingChanges={pendingChanges.length > 0}
        pendingChanges={pendingChanges}
        onConfirmPublish={handleConfirmPublish}
        onSelectFigure={handleSelectFigure}
        onSelectPage={handleSelectPage}
        userRole={userRole}
        onRoleChange={setUserRole}
        accessLevel={accessLevel}
        onBackToDashboard={onBackToDashboard}
      />

      {/* Main Level One Workspace Body */}
      <main className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Level One: Tab 1 — Pages */}
        {activeTab === 'pages' && (
          <PagesWorkspaceTab
            pages={pages}
            onSelectPage={handleSelectPage}
            onNavigateToFigures={() => setActiveTab('figures')}
          />
        )}

        {/* Level One: Tab 2 — Figures */}
        {activeTab === 'figures' && (
          <FiguresWorkspaceTab
            figures={figures}
            onUpdateFigure={handleUpdateFigure}
            onNavigateToPage={handleSelectPage}
          />
        )}

        {/* Level One: Tab 3 — Links and addresses */}
        {activeTab === 'links' && (
          <LinksWorkspaceTab
            data={linksData}
            onUpdateData={setLinksData}
            onNavigateToPage={handleSelectPage}
            onQueueChange={handleQueueChange}
          />
        )}
      </main>
    </div>
  );
};

export default PagesModule;
