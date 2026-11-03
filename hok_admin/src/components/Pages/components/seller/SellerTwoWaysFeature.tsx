/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerTwoWaysFeature (Spec § 8.17, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { TWO_WAYS_FEATURE } from '../../data/sellerRegistry';

export const SellerTwoWaysFeature: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 pb-4">
      {/* Card 1: Keep it with you */}
      <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 space-y-4 shadow-xs hover:border-[#c5ad7d] transition-all">
        <div className="space-y-1">
          <h3 className="font-serif text-xl text-[#1c1917] font-normal">
            {TWO_WAYS_FEATURE.keep.title}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#57534e] leading-relaxed">
            {TWO_WAYS_FEATURE.keep.summary}
          </p>
        </div>

        <div className="space-y-3 pt-2 text-xs border-t border-[#f5f1eb]">
          {TWO_WAYS_FEATURE.keep.rows.map((row) => (
            <div key={row.label} className="space-y-0.5">
              <span className="font-serif italic text-[#935b1e] font-medium mr-1.5">
                {row.label}
              </span>
              <span className="text-[#44403c] leading-relaxed">{row.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Send it to us */}
      <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 space-y-4 shadow-xs hover:border-[#c5ad7d] transition-all">
        <div className="space-y-1">
          <h3 className="font-serif text-xl text-[#1c1917] font-normal">
            {TWO_WAYS_FEATURE.send.title}
          </h3>
          <p className="text-xs sm:text-[13px] text-[#57534e] leading-relaxed">
            {TWO_WAYS_FEATURE.send.summary}
          </p>
        </div>

        <div className="space-y-3 pt-2 text-xs border-t border-[#f5f1eb]">
          {TWO_WAYS_FEATURE.send.rows.map((row) => (
            <div key={row.label} className="space-y-0.5">
              <span className="font-serif italic text-[#935b1e] font-medium mr-1.5">
                {row.label}
              </span>
              <span className="text-[#44403c] leading-relaxed">{row.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerTwoWaysFeature;
