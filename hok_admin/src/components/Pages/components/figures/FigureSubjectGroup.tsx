/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureSubjectGroup (Spec §5.1, Page 10)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FigureItem } from '../../types';
import { FigureRow } from './FigureRow';

interface FigureSubjectGroupProps {
  id: string;
  label: string;
  description?: string;
  figures: FigureItem[];
  selectedFigureKey?: string | null;
  onInspectFigure: (figure: FigureItem) => void;
  defaultExpanded?: boolean;
}

export const FigureSubjectGroup: React.FC<FigureSubjectGroupProps> = ({
  label,
  description,
  figures,
  selectedFigureKey,
  onInspectFigure,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (figures.length === 0) return null;

  return (
    <div className="rounded-[8px] border border-[#e6dccb] bg-[#fffefb] overflow-hidden shadow-[0_1px_3px_rgba(26,22,18,0.02)]">
      {/* Subject Header (Spec §5.1: name in the serif and its line) */}
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full px-4 py-3 bg-[#fffefb] hover:bg-[#f7f2ea]/60 transition-colors flex items-center justify-between text-left cursor-pointer border-b border-[#e6dccb]/70"
      >
        <div className="flex items-baseline gap-2.5">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            {label}
          </h3>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-[4px] bg-[#efe7db] text-[#6e6358] border border-[#d9ccb6]">
            {figures.length}
          </span>
          {description && (
            <span className="hidden sm:inline text-xs text-[#6e6358]">
              — {description}
            </span>
          )}
        </div>

        <div className="text-[#6e6358] p-1">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Figures List */}
      {isExpanded && (
        <div className="divide-y divide-[#efe7da]">
          {figures.map(fig => (
            <FigureRow
              key={fig.id}
              figure={fig}
              isSelected={selectedFigureKey === fig.key}
              onInspect={onInspectFigure}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FigureSubjectGroup;
