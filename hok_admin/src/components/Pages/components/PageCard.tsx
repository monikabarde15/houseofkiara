/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageCard (Spec §4.2, Screen 01 & 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../types';

interface PageCardProps {
  page: PageCardData;
  onClick: (slug: string) => void;
}

export const PageCard: React.FC<PageCardProps> = ({ page, onClick }) => {
  // 1. Status badge configuration
  const renderStatusBadge = () => {
    if (page.hasScheduled) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fdf8e6] text-[#8a6a36] text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8a6a36]" />
          1 waiting
        </span>
      );
    }

    if (!page.isBuilt) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fdf4eb] text-[#a25828] text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a25828]" />
          Not built
        </span>
      );
    }

    if (page.group === 'system') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f4f2ee] text-[#5c5248] text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5c5248]" />
          System
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f0f4ec] text-[#4a6b35] text-[11px] font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b35]" />
        Live
      </span>
    );
  };

  // 2. Format dates line: highlight version if present
  const renderDatesLine = () => {
    const text = page.datesLine || '';
    if (text.startsWith('Version ') || text.startsWith('v3 ')) {
      const parts = text.split(' · ');
      return (
        <span className="truncate block">
          <span className="font-semibold text-[#1a1612]">{parts[0]}</span>
          {parts.length > 1 && (
            <span className="text-[#4a4238]"> · {parts.slice(1).join(' · ')}</span>
          )}
        </span>
      );
    }
    return <span className="text-[#4a4238] truncate block">{text}</span>;
  };

  // 3. Health line and indicator dot (Spec §4.2)
  const renderHealthIndicator = () => {
    const high = page.highChecksCount || 0;
    const med = page.mediumChecksCount || 0;
    const low = page.lowChecksCount || 0;
    const total = page.checksCount || 0;

    if (high > 0) {
      return (
        <div className="flex items-center gap-2 text-[12px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b85c38] shrink-0" />
          <span className="text-[#b85c38] font-medium">
            {total} to look at
          </span>
          {low > 0 && (
            <span className="text-[#8a7f73]">
              · {low} small
            </span>
          )}
        </div>
      );
    }

    if (med > 0) {
      return (
        <div className="flex items-center gap-2 text-[12px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d19a3c] shrink-0" />
          <span className="text-[#b87c28] font-medium">
            {total} to look at
          </span>
          {low > 0 && (
            <span className="text-[#8a7f73]">
              · {low} small
            </span>
          )}
        </div>
      );
    }

    if (low > 0) {
      return (
        <div className="flex items-center gap-2 text-[12px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a89e93] shrink-0" />
          <span className="text-[#73675a]">
            {total} small things to look at
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-[12px]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5a7e48] shrink-0" />
        <span className="text-[#73675a]">Nothing to look at</span>
      </div>
    );
  };

  return (
    <div
      onClick={() => onClick(page.slug)}
      className="group bg-white border border-[#ebe5dc] rounded-[8px] p-4 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:border-[#c5b59f] hover:shadow-xs hover:bg-[#fffefc]"
    >
      <div>
        {/* Row 1: Title and Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-serif text-[16px] font-normal text-[#1a1612] truncate group-hover:text-[#8a6a36] transition-colors">
            {page.title}
          </h3>
          <div className="shrink-0">{renderStatusBadge()}</div>
        </div>

        {/* Row 2: Monospace Address */}
        <div className="text-[11.5px] font-mono text-[#8a7f73] mt-0.5 truncate">
          {page.slug}
        </div>

        {/* Row 3: Dates / Version Line */}
        <div className="text-[12px] mt-2.5">
          {renderDatesLine()}
        </div>

        {/* Row 4: Counts Line */}
        <div className="text-[12px] text-[#73675a] mt-1 truncate">
          {page.countsLine}
        </div>
      </div>

      {/* Row 5: Health Line Divider and Indicator */}
      <div className="border-t border-[#f0ebe3] mt-3.5 pt-2.5">
        {renderHealthIndicator()}
      </div>
    </div>
  );
};

export default PageCard;
