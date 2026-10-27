/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FiguresWorkspaceTab (Spec §5.1, §5.2, Screens 04-16)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';
import { Network } from 'lucide-react';
import { FigureItem } from '../types';
import { FIGURE_SUBJECTS } from '../data';
import { FigureFilterBar, FigureStatusFilter } from './FigureFilterBar';
import { FigureSubjectGroup } from './FigureSubjectGroup';
import { FigureInspector } from './FigureInspector';

interface FiguresWorkspaceTabProps {
  figures: FigureItem[];
  selectedFigureKey?: string | null;
  onSelectFigure?: (key: string) => void;
  onNavigateToPage?: (slug: string) => void;
  onAddFigureChange?: (key: string, newValue: string, when: 'now' | 'date', date?: string, why?: string) => void;
  onDiscardFigureChange?: (key: string) => void;
  onReviewAndPublish?: () => void;
  onOpenPointersPreview?: () => void;
}

export const FiguresWorkspaceTab: React.FC<FiguresWorkspaceTabProps> = ({
  figures,
  selectedFigureKey,
  onSelectFigure,
  onNavigateToPage,
  onAddFigureChange,
  onDiscardFigureChange,
  onReviewAndPublish,
  onOpenPointersPreview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<FigureStatusFilter>('all');
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [internalSelectedKey, setInternalSelectedKey] = useState<string>(
    selectedFigureKey || 'free_delivery_min'
  );

  const activeKey = selectedFigureKey || internalSelectedKey;

  const handleSelectKey = (key: string) => {
    setInternalSelectedKey(key);
    if (onSelectFigure) onSelectFigure(key);
  };

  // 1. Filtering logic combining search, status, and subject (Spec §5.1)
  const filteredFigures = useMemo(() => {
    return figures.filter(fig => {
      // Status filter
      if (activeStatus === 'set-here' && fig.owner !== 'Set here') return false;
      if (activeStatus === 'waiting' && fig.status !== 'waiting') return false;
      if (activeStatus === 'retired' && fig.status !== 'retired') return false;
      if (activeStatus === 'never-printed' && fig.owner !== 'Never printed' && fig.status !== 'never-printed') return false;
      if (activeStatus === 'changing' && !fig.hasScheduled && !fig.hasPendingChange) return false;

      // Subject filter
      if (activeSubject !== 'all' && fig.subject !== activeSubject) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchLabel = fig.label.toLowerCase().includes(q);
        const matchNotes = fig.notes?.toLowerCase().includes(q) || fig.description?.toLowerCase().includes(q) || false;
        const matchKey = fig.key.toLowerCase().includes(q);
        const matchVal = fig.displayValue?.toLowerCase().includes(q) || String(fig.value).toLowerCase().includes(q);
        const matchLegacy = fig.legacyValues?.some(lv => lv.writtenAs.toLowerCase().includes(q) || lv.fileSays.toLowerCase().includes(q));
        if (!matchLabel && !matchNotes && !matchKey && !matchVal && !matchLegacy) {
          return false;
        }
      }

      return true;
    });
  }, [figures, activeStatus, activeSubject, searchQuery]);

  // Group filtered figures by canonical subjects
  const groupedSubjects = useMemo(() => {
    return FIGURE_SUBJECTS.map(subject => {
      const subjectFigures = filteredFigures.filter(f => f.subject === subject.id);
      return {
        ...subject,
        figures: subjectFigures
      };
    }).filter(group => group.figures.length > 0);
  }, [filteredFigures]);

  // Selected figure object
  const currentFigure = useMemo(() => {
    return figures.find(f => f.key === activeKey) || figures[0];
  }, [figures, activeKey]);

  return (
    <div className="space-y-4">
      {/* Spec §12: How other sections read the register banner */}
      {onOpenPointersPreview && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#fcfaf7] border border-[#e8dfd2] rounded-[8px] text-xs shadow-2xs">
          <div className="flex items-center gap-2 text-[#6e6358]">
            <Network className="w-4 h-4 text-[#8a6a36]" />
            <span className="font-medium text-[#1a1612]">How other sections read the register:</span>
            <span className="hidden md:inline">Promotions, Master Data, Platform & Legal, Site Settings, and Messaging (Screens 65 to 76).</span>
          </div>
          <button
            type="button"
            onClick={onOpenPointersPreview}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] border border-[#d9ccb6] bg-white text-xs font-medium text-[#1a1612] hover:bg-[#f7f2ea] hover:border-[#8a6a36] transition cursor-pointer shadow-2xs shrink-0"
          >
            <span>See the pointers</span>
          </button>
        </div>
      )}

      {/* 1. Register Filter Bar (Search, Status filters, Subject menu) */}
      <FigureFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        activeSubject={activeSubject}
        onSubjectChange={setActiveSubject}
        subjects={FIGURE_SUBJECTS}
        figures={figures}
      />

      {/* 2. Split Screen: Register List on left, Inspector panel on right (Spec §5 & Screen 04) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Register grouped by subject */}
        <div className="w-full lg:w-[60%] min-w-0">
          {groupedSubjects.length === 0 ? (
            <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-8 text-center text-xs text-[#73675a]">
              No figures found matching your search and filter criteria.
            </div>
          ) : (
            groupedSubjects.map(group => (
              <FigureSubjectGroup
                key={group.id}
                subject={group}
                figures={group.figures}
                selectedKey={activeKey}
                onSelectFigure={handleSelectKey}
              />
            ))
          )}
        </div>

        {/* Right Column: Full Figure Inspector Panel (Spec §5.2, Screens 04-16) */}
        <div className="w-full lg:w-[40%] xl:w-[480px] shrink-0 sticky top-24">
          {currentFigure && (
            <FigureInspector
              figure={currentFigure}
              onAddChange={(key, newValue, when, date, why) => {
                if (onAddFigureChange) {
                  onAddFigureChange(key, newValue, when, date, why);
                }
              }}
              onDiscardChange={key => {
                if (onDiscardFigureChange) {
                  onDiscardFigureChange(key);
                }
              }}
              onReviewAndPublish={onReviewAndPublish}
              onNavigateToPage={onNavigateToPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FiguresWorkspaceTab;
