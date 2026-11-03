/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CareWearDamageSection (Spec § 8.14 Part 05)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { WEAR_VS_DAMAGE_DATA } from '../../data/careRegistry';

interface CareWearDamageSectionProps {
  onOpenQuestion?: (questionId: string) => void;
}

export const CareWearDamageSection: React.FC<CareWearDamageSectionProps> = ({
  onOpenQuestion
}) => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 shadow-xs space-y-7">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal mb-2">
          Normal wear, or <span className="italic text-[#935b1e]">damage?</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
          {WEAR_VS_DAMAGE_DATA.lead}
        </p>
      </div>

      {/* The Single Simple Test */}
      <div className="bg-[#fcfaf7] border border-[#f0ebe3] rounded-lg p-5 sm:p-6 space-y-3">
        <div className="border-l-2 border-[#2e7d32] pl-3.5 py-0.5 text-xs sm:text-[13px] text-[#2e7d32] font-medium leading-relaxed">
          {WEAR_VS_DAMAGE_DATA.testSentence1}
        </div>
        <div className="border-l-2 border-[#b85c38] pl-3.5 py-0.5 text-xs sm:text-[13px] text-[#854d0e] font-medium leading-relaxed">
          {WEAR_VS_DAMAGE_DATA.testSentence2}
        </div>
      </div>

      {/* Two Columns: Always on us / Assessed with care */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Column 1: Always on us */}
        <div className="rounded-lg border border-[#e2ece2] bg-[#f8fbf8] p-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[#2e7d32] uppercase block mb-1.5">
              {WEAR_VS_DAMAGE_DATA.alwaysOnUs.title}
            </span>
            <p className="text-xs text-[#44403c] mb-4 leading-relaxed">
              {WEAR_VS_DAMAGE_DATA.alwaysOnUs.definition}
            </p>
            <ul className="space-y-2">
              {WEAR_VS_DAMAGE_DATA.alwaysOnUs.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#2b2b2b] leading-relaxed">
                  <span className="text-[#2e7d32] font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 2: Assessed with care */}
        <div className="rounded-lg border border-[#f5e7e2] bg-[#fdf9f7] p-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono font-semibold tracking-wider text-[#b85c38] uppercase block mb-1.5">
              {WEAR_VS_DAMAGE_DATA.assessedWithCare.title}
            </span>
            <p className="text-xs text-[#44403c] mb-4 leading-relaxed">
              {WEAR_VS_DAMAGE_DATA.assessedWithCare.definition}
            </p>
            <ul className="space-y-2">
              {WEAR_VS_DAMAGE_DATA.assessedWithCare.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#2b2b2b] leading-relaxed">
                  <span className="text-[#b85c38] font-bold">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Perspiration Callout */}
      <div className="border-l-2 border-[#b8860b] pl-3.5 py-1 text-xs sm:text-[13px] text-[#57534e] leading-relaxed">
        {WEAR_VS_DAMAGE_DATA.perspiration}
      </div>

      {/* Pre-Dispatch Photographic Note */}
      <div className="text-[11px] text-[#8a7f73] italic pt-1 border-t border-[#f4f0eb]">
        {WEAR_VS_DAMAGE_DATA.preDispatchLine}
      </div>
    </div>
  );
};

export default CareWearDamageSection;
