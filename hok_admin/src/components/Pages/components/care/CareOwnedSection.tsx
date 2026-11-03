/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CareOwnedSection (Spec § 8.14 Part 09)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PIECES_YOU_OWN_DATA } from '../../data/careRegistry';

export const CareOwnedSection: React.FC = () => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#935b1e] block mb-1">
          Pieces you own
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal mb-2">
          {PIECES_YOU_OWN_DATA.heading}
        </h2>
        <p className="text-xs sm:text-[13px] text-[#57534e] leading-relaxed mb-3">
          {PIECES_YOU_OWN_DATA.lead1}
        </p>
        <p className="text-xs sm:text-[13px] text-[#57534e] leading-relaxed">
          {PIECES_YOU_OWN_DATA.lead2}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {PIECES_YOU_OWN_DATA.notes.map((note: string, idx: number) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-[#fcfaf7] border border-[#f2ede4] flex items-start gap-2.5"
          >
            <span className="text-[#935b1e] font-bold text-xs mt-0.5">•</span>
            <p className="text-xs text-[#44403c] leading-relaxed">
              {note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareOwnedSection;
