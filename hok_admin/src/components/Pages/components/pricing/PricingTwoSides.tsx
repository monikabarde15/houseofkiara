/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PricingTwoSides (Spec § 8.16 Part 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

export interface PricingTwoSidesProps {
  activeSide: 'pay' | 'earn';
  onSideChange: (side: 'pay' | 'earn') => void;
}

export const PricingTwoSides: React.FC<PricingTwoSidesProps> = ({
  activeSide,
  onSideChange
}) => {
  return (
    <div className="pt-2 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => onSideChange('pay')}
          className={`p-4 rounded-[10px] text-left transition-all cursor-pointer border ${
            activeSide === 'pay'
              ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-sm'
              : 'bg-white text-[#1c1917] border-[#ded8cf] hover:bg-[#faf8f5]'
          }`}
        >
          <span
            className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
              activeSide === 'pay' ? 'text-[#c5ad7d]' : 'text-[#8a7f73]'
            }`}
          >
            FOR EVERY RENTAL &amp; PURCHASE
          </span>
          <div className="font-serif text-lg font-normal mt-0.5">
            What you pay
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSideChange('earn')}
          className={`p-4 rounded-[10px] text-left transition-all cursor-pointer border ${
            activeSide === 'earn'
              ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-sm'
              : 'bg-white text-[#1c1917] border-[#ded8cf] hover:bg-[#faf8f5]'
          }`}
        >
          <span
            className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
              activeSide === 'earn' ? 'text-[#c5ad7d]' : 'text-[#8a7f73]'
            }`}
          >
            FOR EVERY LISTED PIECE
          </span>
          <div className="font-serif text-lg font-normal mt-0.5">
            What you earn
          </div>
        </button>
      </div>
    </div>
  );
};

export default PricingTwoSides;
