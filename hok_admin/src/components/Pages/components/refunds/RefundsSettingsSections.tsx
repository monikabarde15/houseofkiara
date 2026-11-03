/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsSettingsSections (Spec §8.12)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

export const RefundsSettingsSections: React.FC = () => {
  const sections = [
    'Cancelling a booking',
    'Changing your booking',
    'Delivery & arrival',
    'During & after your event',
    'Your security deposit',
    'Refunds & payments',
    'When it is on us',
    'Concerns & your rights'
  ];

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8a7f73] uppercase tracking-wider block">Part 05</span>
        <h3 className="font-serif text-[16px] text-[#1a1612] font-normal">Sections</h3>
        <p className="text-[12px] text-[#73675a] mt-0.5">8 sections for Rental, 7 for Preloved.</p>
      </div>

      <div className="space-y-2 pt-2 border-t border-[#f0ebe3]">
        {sections.map((s, idx) => (
          <div key={idx} className="p-2 border border-[#ebe5dc] rounded-[4px] bg-[#faf7f2] flex items-center justify-between text-xs">
            <span className="font-medium text-[#1c1917]">{idx + 1}. {s}</span>
            <span className="text-[10px] text-[#8a7f73]">Linked to answers</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundsSettingsSections;
