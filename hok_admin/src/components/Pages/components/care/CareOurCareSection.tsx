/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CareOurCareSection (Spec § 8.14 Part 07)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { OUR_CARE_DATA } from '../../data/careRegistry';

export const CareOurCareSection: React.FC = () => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 shadow-xs space-y-5">
      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#935b1e] block mb-1">
          Our care
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">
          {OUR_CARE_DATA.beforeAfter.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {OUR_CARE_DATA.beforeAfter.notes.map((note: string, idx: number) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-[#fcfaf7] border border-[#f2ede4] flex items-start gap-3"
          >
            <span className="text-[#935b1e] font-mono font-semibold text-xs mt-0.5">
              0{idx + 1}
            </span>
            <p className="text-xs sm:text-[13px] text-[#44403c] leading-relaxed">
              {note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareOurCareSection;
