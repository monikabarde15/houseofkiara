/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositAtAGlance (Spec § 8.13 Part 04)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { DEPOSIT_GLANCE_ROWS } from '../../data/depositRegistry';

interface DepositAtAGlanceProps {
  onSelectRow?: (opensAnchor: string) => void;
  onSelectFigure?: (figureKey: string) => void;
}

export const DepositAtAGlance: React.FC<DepositAtAGlanceProps> = ({
  onSelectRow,
  onSelectFigure
}) => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-7 shadow-xs">
      <div className="text-[11px] font-mono tracking-widest uppercase text-[#935b1e] mb-4">
        Your deposit at a glance
      </div>

      <div className="divide-y divide-[#f4f0eb]">
        {DEPOSIT_GLANCE_ROWS.map((row) => {
          const isPositive = row.tagType === 'positive';
          return (
            <div
              key={row.text}
              onClick={() => onSelectRow?.(row.opens)}
              className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#fcfaf7] px-2 rounded-md transition-colors group"
            >
              <span className="font-serif text-[15px] text-[#1c1917] group-hover:text-[#935b1e] transition-colors">
                {row.text}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded font-medium ${
                    isPositive
                      ? 'bg-[#edf7ed] text-[#2e7d32] border border-[#c8e6c9]'
                      : 'bg-[#f5f2ec] text-[#44403c] border border-[#e5dfd5]'
                  }`}
                >
                  {row.tag}
                </span>
                <span className="text-stone-400 group-hover:text-stone-600 text-sm">
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepositAtAGlance;
