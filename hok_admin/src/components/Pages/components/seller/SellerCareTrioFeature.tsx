/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerCareTrioFeature (Spec § 8.17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { CARE_TRIO_FEATURE } from '../../data/sellerRegistry';

export const SellerCareTrioFeature: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 pb-4">
      {CARE_TRIO_FEATURE.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-[#ebe5dc] rounded-[8px] p-4.5 space-y-2 shadow-xs hover:border-[#c5ad7d] transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#935b1e] font-semibold">
              0{idx + 1}
            </span>
            <h4 className="font-serif text-sm sm:text-base text-[#1c1917] font-medium">
              {card.title}
            </h4>
          </div>
          <p className="text-xs text-[#57534e] leading-relaxed">
            {card.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SellerCareTrioFeature;
