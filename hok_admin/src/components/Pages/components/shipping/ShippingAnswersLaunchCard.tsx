/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: ShippingAnswersLaunchCard (Spec § 8.15 Part 06)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

export interface ShippingAnswersLaunchCardProps {
  onOpenAnswersView: () => void;
}

export const ShippingAnswersLaunchCard: React.FC<ShippingAnswersLaunchCardProps> = ({
  onOpenAnswersView
}) => {
  const categories = [
    { label: 'Rental window', count: 7 },
    { label: 'Charges', count: 7 },
    { label: 'Preloved', count: 6 },
    { label: 'Arrival', count: 9 },
    { label: 'Returns', count: 8 },
    { label: 'Outside India', count: 6 },
    { label: 'When it is on us', count: 7 }
  ];

  return (
    <div className="pt-2 pb-2">
      <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-[10px] p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-[#44403c] leading-relaxed">
              <span className="font-semibold text-[#1c1917]">50 answers</span>, each a question the page opens as it is asked. They are written in the Answers view, with a list of hints.
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAnswersView}
            className="px-4 py-2 bg-[#1c1917] text-white text-xs sm:text-sm rounded-md font-medium hover:bg-[#322e2a] transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Open the answers →
          </button>
        </div>

        {/* Section Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#ede6dc]">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={onOpenAnswersView}
              className="text-xs px-2.5 py-1 rounded bg-white border border-[#ded8cf] text-[#57534e] hover:border-[#c5ad7d] hover:text-[#935b1e] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{cat.label}</span>
              <span className="text-[10.5px] font-mono text-[#8a7f73]">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingAnswersLaunchCard;
