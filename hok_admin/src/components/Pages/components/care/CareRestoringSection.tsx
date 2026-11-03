/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CareRestoringSection (Spec § 8.14 Part 08)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { OUR_CARE_DATA } from '../../data/careRegistry';

export const CareRestoringSection: React.FC = () => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#935b1e] block mb-1">
          Restoring
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">
          {OUR_CARE_DATA.restoring.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {OUR_CARE_DATA.restoring.steps.map((st: any) => (
          <div
            key={st.num}
            className="p-4 rounded-lg bg-[#fcfaf7] border border-[#f2ede4] flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-xs font-semibold text-[#935b1e] block mb-1">
                0{st.num}
              </span>
              <h3 className="font-serif text-sm font-medium text-[#1c1917] mb-2">
                {st.title}
              </h3>
            </div>
            <p className="text-[11px] text-[#57534e] leading-relaxed">
              {st.line}
            </p>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-[#b8860b] pl-3.5 py-1 text-xs text-[#57534e] leading-relaxed">
        {OUR_CARE_DATA.restoring.closingNote}
      </div>
    </div>
  );
};

export default CareRestoringSection;
