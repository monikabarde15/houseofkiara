/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: MarginCheckMark (Spec §7.11, Screen 32)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { CheckItem } from '../types/checks.types';

interface MarginCheckMarkProps {
  checks: CheckItem[];
  onClick: (check: CheckItem) => void;
}

export const MarginCheckMark: React.FC<MarginCheckMarkProps> = ({
  checks,
  onClick
}) => {
  if (!checks || checks.length === 0) return null;

  const highestImportance = checks.some(c => c.importance === 'high') ? 'high' : 'medium';
  const firstCheck = checks[0];

  return (
    <div className="absolute -right-8 top-1 z-20 group">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onClick(firstCheck);
        }}
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer transition-transform hover:scale-110 ${
          highestImportance === 'high'
            ? 'bg-[#993d3d] text-white ring-2 ring-[#fae8e8]'
            : 'bg-[#c5ad7d] text-[#1a1612] ring-2 ring-[#faf2e3]'
        }`}
        title={`${checks.length} item to look at: ${firstCheck.title}`}
      >
        {checks.length > 1 ? checks.length : '•'}
      </button>

      {/* Hover tooltip showing what the check says */}
      <div className="hidden group-hover:block absolute right-7 top-0 w-56 p-2 bg-[#1a1612] text-white rounded-[5px] text-[11px] shadow-lg pointer-events-none z-30">
        <div className="font-medium text-[#c5ad7d] mb-0.5">
          {firstCheck.title}
        </div>
        <div className="text-white/80 line-clamp-2">
          {firstCheck.detail || firstCheck.description}
        </div>
      </div>
    </div>
  );
};

export default MarginCheckMark;
