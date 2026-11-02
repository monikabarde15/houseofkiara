/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PricingSectionsList (Spec § 8.16 Part 06)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PRICING_SECTIONS_LIST } from '../../data/pricingRegistry';

export interface PricingSectionsListProps {
  onOpenAnswersView?: () => void;
  onOpenSection?: (sectionId: string) => void;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldId: string, val: string) => void;
  onFocusField?: (field: any) => void;
}

export const PricingSectionsList: React.FC<PricingSectionsListProps> = ({
  onOpenAnswersView,
  onOpenSection,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  return (
    <div className="pt-2 pb-4 space-y-6">
      <div className="border-t border-dashed border-[#dcd7ce] pt-8 mb-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">
          Thirteen sections, <span className="italic text-[#935b1e]">every charge</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#57534e] mt-1.5 leading-relaxed">
          From standard windows and extra days to lister shares, payouts and taxes.
        </p>
      </div>

      <div className="space-y-4">
        {PRICING_SECTIONS_LIST.map((sec) => (
          <div
            key={sec.id}
            className="bg-white border border-[#ebe5dc] rounded-[10px] p-5 sm:p-6 shadow-xs hover:border-[#c5ad7d] transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-[#935b1e] font-semibold">
                  {sec.num}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-[#1c1917] font-normal group-hover:text-[#935b1e] transition-colors">
                  {sec.title}
                </h3>
                <span className="text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 rounded bg-[#f5f1eb] text-[#785b1a]">
                  {sec.side === 'pay' ? 'What you pay' : 'What you earn'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenSection) onOpenSection(sec.id);
                  else if (onOpenAnswersView) onOpenAnswersView();
                }}
                className="text-[11px] px-2.5 py-1 rounded bg-[#f5f1eb] text-[#785b1a] font-mono font-medium hover:bg-[#ede6dc] transition-colors cursor-pointer self-start sm:self-auto"
              >
                {sec.count} questions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingSectionsList;
