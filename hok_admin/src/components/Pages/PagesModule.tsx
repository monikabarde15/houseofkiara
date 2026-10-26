/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Main Entry Component (Spec §1 to §11)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import './tokens.css';
import { TopLevelTab, PageCardData, FigureItem, LinksAndAddressesData } from './types';
import { SEED_PAGES, SEED_FIGURES, SEED_LINKS_ADDRESSES } from './data';
import { PagesHeader } from './components/PagesHeader';
import { PagesWorkspaceTab } from './components/PagesWorkspaceTab';
import { FiguresWorkspaceTab } from './components/FiguresWorkspaceTab';
import { LinksWorkspaceTab } from './components/LinksWorkspaceTab';
import { PagePaperView } from './components/PagePaperView';
import { AnswersWorkspaceView } from './components/AnswersWorkspaceView';
import { ReviewPublishDrawer } from './components/ReviewPublishDrawer';
import { ViewOnlyBanner } from './components/ViewOnlyBanner';
import { OtherSectionsPointersModal } from './components/OtherSectionsPointersModal';

interface PagesModuleProps {
  onBackToDashboard?: () => void;
}

export const PagesModule: React.FC<PagesModuleProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<TopLevelTab>('pages');
  const [pages, setPages] = useState<PageCardData[]>(SEED_PAGES);
  const [figures, setFigures] = useState<FigureItem[]>(SEED_FIGURES);
  const [linksData, setLinksData] = useState<LinksAndAddressesData>(SEED_LINKS_ADDRESSES);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);
  const [pageViewMode, setPageViewMode] = useState<'paper' | 'answers'>('paper');
  const [selectedFigureKey, setSelectedFigureKey] = useState<string | null>('free_delivery_min');
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [pointersModalOpen, setPointersModalOpen] = useState(false);

  const [userRole, setUserRole] = useState<'Super Admin' | 'Operations Manager' | 'Content Manager' | 'Viewer'>('Super Admin');
  const accessLevel: 'Full Access' | 'Edit' | 'View Only' =
    userRole === 'Viewer' ? 'View Only' : userRole === 'Operations Manager' ? 'Edit' : 'Full Access';

  const [pendingChanges, setPendingChanges] = useState<Array<{
    id: string;
    type: 'figure' | 'page' | 'check';
    title: string;
    details: string;
    source: string;
  }>>([
    {
      id: 'free_delivery_min',
      type: 'figure',
      title: 'Free delivery from',
      details: '₹5,000 to ₹6,000',
      source: 'Figure register'
    }
  ]);

  const handleConfirmPublish = () => {
    setPendingChanges([]);
    setFigures(prev =>
      prev.map(f => (f.hasPendingChange ? { ...f, status: 'live', hasPendingChange: false, displayValue: f.waitingChange?.value || f.displayValue } : f))
    );
    setPages(prev =>
      prev.map(p => ({
        ...p,
        version: p.version ? `Version ${parseInt(p.version.replace(/\D/g, '') || '7', 10) + 1}` : p.version,
        lastPublished: 'Just now',
        lastEditor: `${userRole} (Published)`
      }))
    );
  };

  const handleAddFigureChange = (key: string, newValue: string, when: 'now' | 'date', date?: string, why?: string) => {
    setFigures(prev =>
      prev.map(f => (f.key === key ? {
        ...f,
        hasPendingChange: true,
        waitingChange: { value: newValue, when, date, why: why || 'Value update', who: userRole, at: 'Just now' }
      } : f))
    );
    const fig = figures.find(f => f.key === key);
    setPendingChanges(prev => [
      ...prev.filter(p => p.id !== key),
      { id: key, type: 'figure', title: fig ? fig.label : key, details: `${fig ? fig.displayValue : ''} to ${newValue}`, source: 'Figure register' }
    ]);
  };

  const handleDiscardFigureChange = (key: string) => {
    setFigures(prev =>
      prev.map(f => (f.key === key ? { ...f, hasPendingChange: false, waitingChange: undefined } : f))
    );
    setPendingChanges(prev => prev.filter(p => p.id !== key));
  };

  const handleSend404ToPage = (logId: string, targetSlug: string) => {
    setLinksData(prev => ({
      ...prev,
      notFound404Logs: prev.notFound404Logs.map(l => (l.id === logId ? { ...l, resolved: true, suggestedRedirect: targetSlug } : l)),
      summary: { ...prev.summary, thingsToFixCount: Math.max(0, prev.summary.thingsToFixCount - 1) }
    }));
  };

  const activePage = pages.find(p => p.slug === selectedPageSlug);
  if (selectedPageSlug && activePage) {
    if (pageViewMode === 'answers') {
      return (
        <AnswersWorkspaceView
          page={activePage}
          onBackToPaperView={() => setPageViewMode('paper')}
          onBackToAllPages={() => { setSelectedPageSlug(null); setPageViewMode('paper'); }}
        />
      );
    }
    return (
      <PagePaperView
        page={activePage}
        allPages={pages}
        onSelectPage={slug => { setSelectedPageSlug(slug); setPageViewMode('paper'); }}
        onBackToPages={() => { setSelectedPageSlug(null); setPageViewMode('paper'); }}
        onNavigateToFigure={key => { setSelectedFigureKey(key); setActiveTab('figures'); setSelectedPageSlug(null); setPageViewMode('paper'); }}
        onOpenAnswersView={() => setPageViewMode('answers')}
      />
    );
  }

  return (
    <div className="hok-pages-root min-h-screen bg-[#f7f2ea] text-[#1a1612]">
      {/* View Only Banner (Spec §11, Screen 63) */}
      {accessLevel === 'View Only' && <ViewOnlyBanner userRole={userRole} />}

      {/* Level One Sticky Header (Spec §3.1 & Screen 01) */}
      <PagesHeader
        activeTab={activeTab}
        onTabChange={tab => { setActiveTab(tab); if (tab !== 'pages') setSelectedPageSlug(null); }}
        pagesCount={pages.length}
        figuresCount={figures.length}
        thingsToFixCount={linksData.summary.thingsToFixCount}
        hasScheduledChanges={true}
        hasPendingChanges={pendingChanges.length > 0}
        pendingChanges={pendingChanges}
        onConfirmPublish={() => setReviewDrawerOpen(true)}
        onSelectFigure={key => { setSelectedFigureKey(key); setActiveTab('figures'); }}
        onSelectPage={slug => setSelectedPageSlug(slug)}
        userRole={userRole}
        onRoleChange={setUserRole}
        accessLevel={accessLevel}
        onBackToDashboard={onBackToDashboard}
      />

      {/* Main Workspace Body */}
      <main className="max-w-[1440px] mx-auto px-6 py-6">
        {activeTab === 'pages' && (
          <PagesWorkspaceTab
            pages={pages}
            onSelectPage={slug => setSelectedPageSlug(slug)}
            onNavigateToFigures={() => setActiveTab('figures')}
          />
        )}
        {activeTab === 'figures' && (
          <FiguresWorkspaceTab
            figures={figures}
            selectedFigureKey={selectedFigureKey}
            onSelectFigure={key => setSelectedFigureKey(key)}
            onNavigateToPage={slug => { setSelectedPageSlug(slug); setActiveTab('pages'); }}
            onAddFigureChange={handleAddFigureChange}
            onDiscardFigureChange={handleDiscardFigureChange}
            onOpenPointersPreview={() => setPointersModalOpen(true)}
          />
        )}
        {activeTab === 'links' && (
          <LinksWorkspaceTab
            data={linksData}
            pages={pages}
            onNavigateToPage={slug => { setSelectedPageSlug(slug); setActiveTab('pages'); }}
            onOpenSiteSettings={() => {}}
            onSend404ToPage={handleSend404ToPage}
          />
        )}
      </main>

      {/* Slide-over Review & Publish Drawer (Spec §10.2, Screens 18, 19, 64) */}
      <ReviewPublishDrawer
        isOpen={reviewDrawerOpen}
        onClose={() => setReviewDrawerOpen(false)}
        figures={figures}
        accessLevel={accessLevel}
        onConfirmPublish={handleConfirmPublish}
        onDiscardFigureChange={handleDiscardFigureChange}
      />

      {/* How Other Sections Read the Register Modal (Spec §12, Screens 65-76) */}
      <OtherSectionsPointersModal
        isOpen={pointersModalOpen}
        onClose={() => setPointersModalOpen(false)}
        figures={figures}
        pages={pages}
        onOpenFigure={key => {
          setSelectedFigureKey(key);
          setActiveTab('figures');
          setSelectedPageSlug(null);
        }}
        onOpenPage={slug => {
          setSelectedPageSlug(slug);
          setPageViewMode('paper');
        }}
        onNavigateToLinks={() => {
          setActiveTab('links');
          setSelectedPageSlug(null);
        }}
      />
    </div>
  );
};

export default PagesModule;
