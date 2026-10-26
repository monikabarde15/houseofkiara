/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageStatTiles (Spec §4.1 & Screen 01)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageStatsSummary } from '../types';

interface PageStatTilesProps {
  stats: PageStatsSummary;
  filterNeedsLook: boolean;
  onToggleNeedsLook: () => void;
  activeFilterGroup: string;
  onSelectFilterGroup: (group: string) => void;
  onNavigateToFigures?: () => void;
}

export const PageStatTiles: React.FC<PageStatTilesProps> = ({
  stats,
  filterNeedsLook,
  onToggleNeedsLook,
  activeFilterGroup,
  onSelectFilterGroup,
  onNavigateToFigures
}) => {
  const isTile1Active = activeFilterGroup === 'built' && !filterNeedsLook;
  const isTile2Active = activeFilterGroup === 'not-built' && !filterNeedsLook;
  const isTile3Active = filterNeedsLook;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tile 1: Pages built (Spec §4.1) */}
      <button
        onClick={() => {
          if (isTile1Active) {
            onSelectFilterGroup('all');
          } else {
            onSelectFilterGroup('built');
            if (filterNeedsLook) onToggleNeedsLook();
          }
        }}
        className={`p-4 rounded-[6px] text-left transition-all cursor-pointer border ${
          isTile1Active
            ? 'bg-[#fffefb] border-[#1a1612] shadow-xs ring-1 ring-[#1a1612]/10'
            : 'bg-[#fffefb] border-[#e6dccb] hover:border-[#8a6a36]'
        }`}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-[28px] font-normal text-[#1a1612] leading-none">
            {stats.pagesBuilt}
          </span>
          <span className="font-semibold text-xs text-[#1a1612]">
            pages built
          </span>
        </div>
        <p className="mt-2 text-[11px] text-[#6e6358] leading-snug">
          Every one of them reads its figures from the register.
        </p>
      </button>

      {/* Tile 2: Linked but not built (Spec §4.1) */}
      <button
        onClick={() => {
          if (isTile2Active) {
            onSelectFilterGroup('all');
          } else {
            onSelectFilterGroup('not-built');
            if (filterNeedsLook) onToggleNeedsLook();
          }
        }}
        className={`p-4 rounded-[6px] text-left transition-all cursor-pointer border ${
          isTile2Active
            ? 'bg-[#fffefb] border-[#1a1612] shadow-xs ring-1 ring-[#1a1612]/10'
            : 'bg-[#fffefb] border-[#e6dccb] hover:border-[#8a6a36]'
        }`}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-[28px] font-normal text-[#1a1612] leading-none">
            {stats.pagesNotBuilt}
          </span>
          <span className="font-semibold text-xs text-[#1a1612]">
            linked but not built
          </span>
        </div>
        <p className="mt-2 text-[11px] text-[#6e6358] leading-snug">
          Linked from 10 places on the site.
        </p>
      </button>

      {/* Tile 3: Pages need a look (Spec §4.1: Drawn in terracotta when something to act on) */}
      <button
        onClick={() => {
          onToggleNeedsLook();
          if (activeFilterGroup !== 'all') onSelectFilterGroup('all');
        }}
        className={`p-4 rounded-[6px] text-left transition-all cursor-pointer border ${
          isTile3Active
            ? 'bg-[#fffefb] border-[#b85c38] shadow-xs ring-1 ring-[#b85c38]/20'
            : stats.pagesNeedLook > 0
            ? 'bg-[#fffefb] border-[#b85c38]/40 hover:border-[#b85c38]'
            : 'bg-[#fffefb] border-[#e6dccb] hover:border-[#8a6a36]'
        }`}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-[28px] font-normal text-[#b85c38] leading-none">
            {stats.pagesNeedLook}
          </span>
          <span className="font-semibold text-xs text-[#b85c38]">
            pages need a look
          </span>
        </div>
        <p className="mt-2 text-[11px] text-[#6e6358] leading-snug">
          Retired figures, typed figures, words to change.
        </p>
      </button>

      {/* Tile 4: Figures, each set once (Spec §4.1: Opens Figures view) */}
      <button
        onClick={() => {
          onNavigateToFigures?.();
        }}
        className="p-4 rounded-[6px] text-left transition-all cursor-pointer border bg-[#fffefb] border-[#e6dccb] hover:border-[#8a6a36] group"
      >
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-[28px] font-normal text-[#1a1612] group-hover:text-[#8a6a36] transition-colors leading-none">
            90
          </span>
          <span className="font-semibold text-xs text-[#1a1612] group-hover:text-[#8a6a36] transition-colors">
            figures, each set once
          </span>
        </div>
        <p className="mt-2 text-[11px] text-[#6e6358] leading-snug">
          6 waiting for a decision · 4 retired but still printed
        </p>
      </button>
    </div>
  );
};

export default PageStatTiles;
