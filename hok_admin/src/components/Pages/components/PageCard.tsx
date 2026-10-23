/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageCard (Spec §4.2, Page 9)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../types';

interface PageCardProps {
  page: PageCardData;
  onSelect: (slug: string) => void;
}

export const PageCard: React.FC<PageCardProps> = ({ page, onSelect }) => {
  // Spec §4.2 Line 5 Health Dot:
  // Red when anything is of high importance, amber when medium, grey for small things, green for nothing to look at.
  const getHealthDotColor = () => {
    if (page.checksCount === 0) {
      return 'bg-[#6b7e5a]'; // green
    }
    if (page.highChecksCount > 0) {
      return 'bg-[#b85c38]'; // red
    }
    if (page.mediumChecksCount > 0) {
      return 'bg-[#d19a3c]'; // amber
    }
    return 'bg-[#b4a99e]'; // grey for low/small things
  };

  const getStatusBadge = () => {
    if (!page.isBuilt) {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-[#efe7db] text-[#6e6358] border border-[#d9ccb6]">
          Not built
        </span>
      );
    }
    if (page.group === 'system') {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-[#f7f2ea] text-[#6e6358] border border-[#e6dccb]">
          System
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-[#e3f0da]/60 text-[#3b5e28] border border-[#6e8d58]/40">
        Live
      </span>
    );
  };

  const dotColor = getHealthDotColor();

  return (
    <div
      onClick={() => onSelect(page.slug)}
      className="group p-4 rounded-[8px] bg-[#fffefb] border border-[#e6dccb] hover:border-[#8a6a36] shadow-[0_1px_3px_rgba(26,22,18,0.03)] hover:shadow-[0_4px_16px_rgba(26,22,18,0.06)] transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Line 1: Name and status badge (Spec §4.2) */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-serif text-[17px] font-normal text-[#1a1612] group-hover:text-[#8a6a36] transition-colors leading-tight">
            {page.title}
          </h3>
          {getStatusBadge()}
        </div>

        {/* Line 2: Address in monospace face (Spec §4.2) */}
        <div className="mt-1">
          <code className="text-[11px] font-mono text-[#6e6358]">
            {page.slug}
          </code>
        </div>

        {/* Line 3: Dates / Details (Spec §4.2) */}
        <div className="mt-2.5 text-[11.5px] text-[#5c5248] line-clamp-1 leading-snug">
          {page.datesLine || page.summary}
        </div>

        {/* Line 4: Counts (Spec §4.2) */}
        <div className="mt-1.5 text-[11.5px] text-[#6e6358] line-clamp-1 leading-snug">
          {page.countsLine || `${page.figuresCount} figures`}
        </div>
      </div>

      {/* Line 5: Health (dot + text) (Spec §4.2) */}
      <div className="mt-3.5 pt-2.5 border-t border-[#efe7da] flex items-center gap-2 text-[11px]">
        <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
        <span className={page.checksCount === 0 ? 'text-[#6b7e5a]' : page.highChecksCount > 0 ? 'text-[#b85c38]' : 'text-[#6e6358]'}>
          {page.healthLine || (page.checksCount === 0 ? 'Nothing to look at' : `${page.checksCount} to look at`)}
        </span>
      </div>
    </div>
  );
};

export default PageCard;
