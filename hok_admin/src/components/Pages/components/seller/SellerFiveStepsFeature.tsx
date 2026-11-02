/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerFiveStepsFeature (Spec § 8.17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FIVE_STEPS_FEATURE } from '../../data/sellerRegistry';

export const SellerFiveStepsFeature: React.FC = () => {
  return (
    <div className="pt-2 pb-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {FIVE_STEPS_FEATURE.map((step) => (
          <div
            key={step.step}
            className="bg-white border border-[#ebe5dc] rounded-[8px] p-4 space-y-2 shadow-xs hover:border-[#c5ad7d] transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#f5f1eb] text-[#935b1e] font-mono text-xs font-semibold flex items-center justify-center">
                {step.step}
              </span>
              <h4 className="font-serif text-sm text-[#1c1917] font-medium">
                {step.title}
              </h4>
            </div>
            <p className="text-xs text-[#57534e] leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerFiveStepsFeature;
