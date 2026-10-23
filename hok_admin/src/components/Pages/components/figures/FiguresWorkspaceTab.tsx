/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FiguresWorkspaceTab (Spec §5 & Appendix A, Screens 04–06)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState, useMemo } from 'react';
import { FigureItem, FigureSubjectId } from '../../types';
import { FIGURE_SUBJECTS } from '../../data';
import { FigureFilters, FigureFilterStatus } from './FigureFilters';
import { FigureSubjectGroup } from './FigureSubjectGroup';
import { FigureInspectorPanel } from './FigureInspectorPanel';

interface FiguresWorkspaceTabProps {
  figures: FigureItem[];
  onUpdateFigure?: (key: string, newValue: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const FiguresWorkspaceTab: React.FC<FiguresWorkspaceTabProps> = ({
  figures,
  onUpdateFigure,
  onNavigateToPage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<FigureFilterStatus>('all');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>('all');
  
  // Default selected figure for the inspector (Screen 04 shows Free delivery from)
  const [selectedFigureKey, setSelectedFigureKey] = useState<string>('free_delivery_min');

  // Compute status counts for the filter bar (Spec §5.1)
  const statusCounts = useMemo(() => {
    return {
      all: figures.length,
      setHere: figures.filter(f => f.owner === 'Set here').length,
      waiting: figures.filter(f => f.decisionRequired || f.status === 'waiting').length,
      retired: figures.filter(f => f.status === 'retired').length,
      neverPrinted: figures.filter(f => f.status === 'never-printed').length,
      changing: figures.filter(f => f.hasScheduled || f.status === 'changing').length
    };
  }, [figures]);

  // Compute counts per subject (Spec §5.1)
  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    FIGURE_SUBJECTS.forEach(s => {
      counts[s.id] = figures.filter(f => f.subject === s.id).length;
    });
    return counts;
  }, [figures]);

  // Filter figures based on query, status filter, and subject filter
  const filteredFigures = useMemo(() => {
    return figures.filter(fig => {
      // 1. Status filter
      if (activeStatusFilter === 'set-here' && fig.owner !== 'Set here') return false;
      if (activeStatusFilter === 'waiting' && !fig.decisionRequired && fig.status !== 'waiting') return false;
      if (activeStatusFilter === 'retired' && fig.status !== 'retired') return false;
      if (activeStatusFilter === 'never-printed' && fig.status !== 'never-printed') return false;
      if (activeStatusFilter === 'changing' && !fig.hasScheduled && fig.status !== 'changing') return false;

      // 2. Subject filter
      if (activeSubjectFilter !== 'all' && fig.subject !== activeSubjectFilter) return false;

      // 3. Search query (matches name, description, page file name, value)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesLabel = fig.label.toLowerCase().includes(q);
        const matchesKey = fig.key.toLowerCase().includes(q);
        const matchesValue = fig.displayValue.toLowerCase().includes(q);
        const matchesNotes = fig.notes ? fig.notes.toLowerCase().includes(q) : false;
        if (!matchesLabel && !matchesKey && !matchesValue && !matchesNotes) return false;
      }

      return true;
    });
  }, [figures, activeStatusFilter, activeSubjectFilter, searchQuery]);

  // Group filtered figures by subject
  const figuresBySubject = useMemo(() => {
    const map = new Map<FigureSubjectId, FigureItem[]>();
    FIGURE_SUBJECTS.forEach(s => map.set(s.id, []));

    filteredFigures.forEach(fig => {
      const list = map.get(fig.subject);
      if (list) {
        list.push(fig);
      } else {
        map.set(fig.subject, [fig]);
      }
    });

    return map;
  }, [filteredFigures]);

  // Chosen figure for the right-hand inspector panel (Screen 04)
  const activeInspectingFigure = useMemo(() => {
    const found = figures.find(f => f.key === selectedFigureKey);
    return found || figures[0] || null;
  }, [figures, selectedFigureKey]);

  return (
    <div className="space-y-4">
      {/* 1. Register Filter & Search Bar (Spec §5.1) */}
      <FigureFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeStatusFilter={activeStatusFilter}
        onSelectStatusFilter={setActiveStatusFilter}
        activeSubjectFilter={activeSubjectFilter}
        onSelectSubjectFilter={setActiveSubjectFilter}
        statusCounts={statusCounts}
        subjectCounts={subjectCounts}
      />

      {/* 2. Desktop Two-Column Split Layout: Register on Left, Fixed Inspector on Right (Spec §5, Screen 04) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Column: Register Groups */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {FIGURE_SUBJECTS.map(subject => {
            const subjectFigures = figuresBySubject.get(subject.id) || [];
            if (subjectFigures.length === 0) return null;

            return (
              <FigureSubjectGroup
                key={subject.id}
                id={subject.id}
                label={subject.label}
                description={subject.description}
                figures={subjectFigures}
                selectedFigureKey={selectedFigureKey}
                onInspectFigure={fig => setSelectedFigureKey(fig.key)}
                defaultExpanded={true}
              />
            );
          })}

          {filteredFigures.length === 0 && (
            <div className="p-12 text-center rounded-[8px] bg-[#fffefb] border border-[#e6dccb] space-y-2">
              <p className="text-sm font-semibold text-[#1a1612]">No matching figures found</p>
              <p className="text-xs text-[#6e6358]">
                No figures match your search or active filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveStatusFilter('all');
                  setActiveSubjectFilter('all');
                }}
                className="mt-3 px-3 py-1.5 rounded-[6px] text-xs font-medium text-[#8a6a36] bg-[#f5edd8] border border-[#c9a96e]/40 hover:bg-[#f5edd8]/80 transition-colors cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Fixed Inspector Panel (Spec §5.2, Screen 04, 384px wide) */}
        <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
          <FigureInspectorPanel
            figure={activeInspectingFigure}
            onUpdateFigure={onUpdateFigure}
            onNavigateToPage={onNavigateToPage}
          />
        </div>
      </div>
    </div>
  );
};

export default FiguresWorkspaceTab;
