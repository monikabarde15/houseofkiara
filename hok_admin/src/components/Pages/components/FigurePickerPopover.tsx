/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigurePickerPopover (Spec §7.6, Screen 34)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';
import { FigureItem } from '../types';
import { SEED_FIGURES } from '../data';

export interface FigurePickerPopoverProps {
  pageSlug?: string;
  onSelectFigure: (figure: FigureItem) => void;
  onClose: () => void;
  style?: React.CSSProperties;
}

export const FigurePickerPopover: React.FC<FigurePickerPopoverProps> = ({
  pageSlug,
  onSelectFigure,
  onClose,
  style
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Spec §7.6: "Retired figures and figures that are never printed are not offered."
  const availableFigures = useMemo(() => {
    return SEED_FIGURES.filter(f => f.status !== 'retired' && f.status !== 'never-printed');
  }, []);

  // Filtered by search query: label, notes, displayValue, or key
  const filteredFigures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availableFigures;
    return availableFigures.filter(f =>
      f.label.toLowerCase().includes(q) ||
      f.displayValue.toLowerCase().includes(q) ||
      (f.notes && f.notes.toLowerCase().includes(q)) ||
      f.key.toLowerCase().includes(q)
    );
  }, [availableFigures, searchQuery]);

  // "This page" figures
  const thisPageFigures = useMemo(() => {
    return filteredFigures.filter(f =>
      f.locations && f.locations.some(loc => loc.pageSlug === pageSlug || loc.pageName.toLowerCase().includes('refund'))
    );
  }, [filteredFigures, pageSlug]);

  // Group remainder by subject
  const groupedBySubject = useMemo(() => {
    const map = new Map<string, FigureItem[]>();
    for (const f of filteredFigures) {
      const list = map.get(f.subject) || [];
      list.push(f);
      map.set(f.subject, list);
    }
    return Array.from(map.entries());
  }, [filteredFigures]);

  return (
    <div
      style={style}
      className="absolute z-50 w-[340px] max-h-[460px] bg-white border border-[#ebe5dc] rounded-[8px] shadow-[0_8px_30px_rgba(26,22,18,0.14)] flex flex-col overflow-hidden text-xs text-[#1a1612] animate-in fade-in"
    >
      {/* Header with Search (Spec §7.6: "Find a figure: delivery, deposit, 24 hours") */}
      <div className="p-2.5 border-b border-[#ebe5dc] bg-[#faf7f2]/50 flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-[#8a7f73] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Find a figure: delivery, deposit, 24 hours"
          autoFocus
          className="flex-1 bg-transparent text-xs text-[#1a1612] placeholder-[#8a7f73] focus:outline-none"
        />
        <button
          type="button"
          onClick={onClose}
          className="text-[#8a7f73] hover:text-[#1a1612] p-1 rounded"
          title="Close picker"
        >
          ✕
        </button>
      </div>

      {/* Figures Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f5f1eb] p-1">
        {/* Section 1: This page figures (Spec §7.6) */}
        {!searchQuery && thisPageFigures.length > 0 && (
          <div className="pb-2">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              This page
            </div>
            {thisPageFigures.map(f => (
              <button
                key={`thispage-${f.key}`}
                type="button"
                onClick={() => {
                  onSelectFigure(f);
                  onClose();
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#fcf8f2] rounded flex items-center justify-between group transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-medium text-[#1a1612] group-hover:text-[#8a6a36] truncate">
                    {f.label}
                  </div>
                  <div className="text-[10.5px] text-[#8a7f73] truncate">
                    {f.notes || f.subject}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="font-serif text-[13px] text-[#1a1612]">
                    {f.displayValue}
                  </span>
                  {f.status === 'waiting' && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-[#f5e7c6] text-[#785b1a] uppercase font-semibold">
                      waiting
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Section 2: Grouped by Subject (Spec §7.6) */}
        {groupedBySubject.map(([subject, figures]) => (
          <div key={subject} className="py-2">
            <div className="px-3 py-1 text-[10.5px] font-semibold text-[#8a7f73] uppercase tracking-wider">
              {subject}
            </div>
            {figures.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  onSelectFigure(f);
                  onClose();
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#fcf8f2] rounded flex items-center justify-between group transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-medium text-[#1a1612] group-hover:text-[#8a6a36] truncate">
                    {f.label}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="font-serif text-[13px] text-[#1a1612]">
                    {f.displayValue}
                  </span>
                  {f.status === 'waiting' && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-[#f5e7c6] text-[#785b1a] uppercase font-semibold">
                      waiting
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ))}

        {filteredFigures.length === 0 && (
          <div className="p-6 text-center text-[#8a7f73]">
            No figure matches your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default FigurePickerPopover;
