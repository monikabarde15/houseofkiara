/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageSettingsHeader (Spec §7.9, Screen 28)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../types';

interface PageSettingsHeaderProps {
  page: PageCardData;
  onBackToPaper: () => void;
}

export const PageSettingsHeader: React.FC<PageSettingsHeaderProps> = ({
  page,
  onBackToPaper
}) => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
            {page.name}
          </span>
          <h1 className="font-serif text-[26px] md:text-[30px] text-[#1a1612] font-normal leading-snug">
            Page settings
          </h1>
        </div>
        <button
          type="button"
          onClick={onBackToPaper}
          className="px-3 py-1.5 rounded-[6px] border border-[#e6dccb] bg-white hover:bg-[#faf7f2] text-xs font-medium text-[#1a1612] transition-colors"
        >
          See it on the page
        </button>
      </div>

      <p className="text-[12.5px] text-[#5c5248] leading-relaxed">
        Everything that is not on the page itself: where its buttons and rows lead, which questions it lists, tones, pictures, words a customer reads only after a click, in a moment the page is not drawn in, or off the page itself, how it looks in a search result and when shared, the addresses it answers on, and its versions. Words on the page are changed on the page itself.
      </p>
    </div>
  );
};

export default PageSettingsHeader;
