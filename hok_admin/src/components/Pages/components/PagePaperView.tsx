/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagePaperView (Spec §7, §9, §10)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';
import { PageCardData } from '../types';
import { SEED_FIGURES, ACTIVE_CHECKS } from '../data';
import { CheckItem } from '../types/checks.types';
import { getPageContent } from '../data/pageContentRegistry';
import { PageLevelTwoHeader } from './PageLevelTwoHeader';
import { PagePaperCanvas, EditableFieldInfo } from './PagePaperCanvas';
import { PageDefaultPanel } from './PageDefaultPanel';
import { WordEditorPanel } from './WordEditorPanel';
import { FigureInspector } from './FigureInspector';
import { PageSettingsWorkspaceView } from './PageSettingsWorkspaceView';
import { PageChecksPanel } from './PageChecksPanel';
import { PageFiguresPanel } from './PageFiguresPanel';

interface PagePaperViewProps {
  page: PageCardData;
  allPages: PageCardData[];
  onSelectPage: (slug: string) => void;
  onBackToPages: () => void;
  onNavigateToFigure?: (key: string) => void;
  onOpenAnswersView?: () => void;
}

export const PagePaperView: React.FC<PagePaperViewProps> = ({
  page,
  allPages,
  onSelectPage,
  onBackToPages,
  onNavigateToFigure,
  onOpenAnswersView
}) => {
  const [activePartId, setActivePartId] = useState<string>('hero');
  const [activePanelTab, setActivePanelTab] = useState<'default' | 'figures' | 'checks' | 'settings'>('default');
  const [showMode, setShowMode] = useState<'waiting' | 'live' | 'date'>('waiting');

  const [focusedField, setFocusedField] = useState<EditableFieldInfo | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [selectedFigureKey, setSelectedFigureKey] = useState<string | null>(null);

  const [pageChecks, setPageChecks] = useState<CheckItem[]>(() =>
    ACTIVE_CHECKS.filter(c => c.pageSlug.includes(page.slug) || c.pageSlug === `/${page.slug}`)
  );

  const pageFigures = useMemo(() => {
    return SEED_FIGURES.filter(f =>
      f.locations && f.locations.some(loc => loc.pageSlug === page.slug || loc.pageSlug.includes(page.slug))
    );
  }, [page.slug]);

  const selectedFigure = selectedFigureKey
    ? SEED_FIGURES.find(f => f.key === selectedFigureKey) || null
    : null;

  const pageContent = getPageContent(page.slug);
  const pageParts = pageContent.parts;

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFigureSelect = (key: string) => {
    setSelectedFigureKey(key);
    setFocusedField(null);
  };

  const handleAcknowledgeCheck = (checkId: string, reason: string) => {
    setPageChecks(prev =>
      prev.map(c => (c.id === checkId ? { ...c, acknowledged: true, acknowledgementReason: reason } : c))
    );
  };

  const handleOpenCheck = (c: CheckItem) => {
    setActivePanelTab('checks');
    if (c.suggestedFigureKey) {
      setSelectedFigureKey(c.suggestedFigureKey);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#1a1612]">
      {/* 1. Level Two Sticky Header & Parts Strip (Spec §7.2, Screen 20) */}
      <PageLevelTwoHeader
        page={page}
        allPages={allPages}
        onSelectPage={onSelectPage}
        onBackToPages={onBackToPages}
        activePartId={activePartId}
        onSelectPart={id => {
          if (activePanelTab === 'settings') setActivePanelTab('default');
          if (id === 'answers' && onOpenAnswersView) {
            onOpenAnswersView();
            return;
          }
          setActivePartId(id);
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        parts={pageParts}
        figuresCount={pageFigures.length || page.figuresCount || 23}
        checksCount={pageChecks.length || page.checksCount || 5}
        activePanelTab={activePanelTab}
        onSelectPanelTab={setActivePanelTab}
        showMode={showMode}
        onShowModeChange={setShowMode}
      />

      {/* 2. Main Desk Layout (Spec §7.3, §7.9) */}
      <main className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {activePanelTab === 'settings' ? (
          <PageSettingsWorkspaceView
            page={page}
            onBackToPaper={() => setActivePanelTab('default')}
            onOpenAnswersView={onOpenAnswersView}
            onJumpToPart={id => {
              setActivePanelTab('default');
              setActivePartId(id);
            }}
            onReadAsOnDate={() => {
              setShowMode('date');
              setActivePanelTab('default');
            }}
          />
        ) : (
          <div className="flex-1 min-w-0 flex flex-col items-center w-full">
            {showMode === 'date' && (
              <div className="w-full max-w-[760px] mb-4 p-3 bg-[#1a1612] text-white rounded-[6px] text-xs flex items-center justify-between shadow-md">
                <span className="text-[#c5ad7d] font-medium">
                  Reading as on 12 August 2026. Words and figures cannot be edited.
                </span>
                <button
                  type="button"
                  onClick={() => setShowMode('waiting')}
                  className="px-2.5 py-1 rounded bg-white text-[#1a1612] font-medium text-[11px] hover:bg-[#f7f2ea] transition-colors"
                >
                  Back to editing
                </button>
              </div>
            )}

            <PagePaperCanvas
              page={page}
              activePartId={activePartId}
              onSelectPart={id => {
                setActivePartId(id);
                if (selectedFigureKey) setSelectedFigureKey(null);
              }}
              onSelectFigure={handleFigureSelect}
              onOpenAnswersView={onOpenAnswersView}
              onOpenCheck={handleOpenCheck}
              focusedField={showMode === 'date' ? null : focusedField}
              onFocusField={info => {
                if (showMode === 'date') return;
                setFocusedField(info);
                if (info) setSelectedFigureKey(null);
              }}
              fieldValues={fieldValues}
              onFieldChange={handleFieldChange}
              highlightedFigureKey={selectedFigureKey}
            />
          </div>
        )}

        {/* Right-Hand Panel (384px wide, Spec §7.7, §9.1) */}
        <div className="w-full lg:w-[384px] shrink-0 sticky top-36">
          {selectedFigure ? (
            <div className="space-y-2">
              <div className="bg-[#1a1612] text-white px-3.5 py-2 rounded-[6px] text-xs flex items-center justify-between shadow-md">
                <span className="text-white/80">
                  Prints on this page, outlined in gold where in view.
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFigureKey(null)}
                  className="text-xs text-[#c5ad7d] hover:underline cursor-pointer"
                >
                  Close
                </button>
              </div>
              <FigureInspector
                figure={selectedFigure}
                onAddChange={() => {}}
                onDiscardChange={() => {}}
                onNavigateToPage={slug => onSelectPage(slug)}
              />
            </div>
          ) : focusedField && activePanelTab !== 'settings' ? (
            <WordEditorPanel
              partTitle={focusedField.fieldName}
              fieldName={focusedField.fieldName}
              helpText={focusedField.helpText}
              fieldValue={fieldValues[focusedField.fieldId] || ''}
              onCloseWords={() => setFocusedField(null)}
              onUseFigure={(detectedText, figureKey) => {
                const current = fieldValues[focusedField.fieldId] || '';
                handleFieldChange(focusedField.fieldId, current.replace(detectedText, `{{${figureKey}}}`));
              }}
            />
          ) : activePanelTab === 'checks' ? (
            <PageChecksPanel
              checks={pageChecks}
              onOpenCheckWords={handleOpenCheck}
              onOpenFigure={key => {
                if (onNavigateToFigure) onNavigateToFigure(key);
                else setSelectedFigureKey(key);
              }}
              onAcknowledgeCheck={handleAcknowledgeCheck}
              onClose={() => setActivePanelTab('default')}
            />
          ) : activePanelTab === 'figures' ? (
            <PageFiguresPanel
              figures={pageFigures}
              onOpenFigure={key => {
                if (onNavigateToFigure) onNavigateToFigure(key);
                else setSelectedFigureKey(key);
              }}
              onClose={() => setActivePanelTab('default')}
            />
          ) : (
            <PageDefaultPanel
              page={page}
              onOpenFigure={key => {
                if (onNavigateToFigure) onNavigateToFigure(key);
                else setSelectedFigureKey(key);
              }}
              onOpenChecks={() => setActivePanelTab('checks')}
              onOpenSettings={() => setActivePanelTab('settings')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PagePaperView;
