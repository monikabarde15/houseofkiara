/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagesHeaderTabs (Spec §3.1, §3.2, Screen 01)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { TopLevelTab } from '../types';

interface PagesHeaderTabsProps {
  activeTab: TopLevelTab;
  onTabChange: (tab: TopLevelTab) => void;
  pagesCount: number;
  figuresCount: number;
  thingsToFixCount: number;
}

export const PagesHeaderTabs: React.FC<PagesHeaderTabsProps> = ({
  activeTab,
  onTabChange,
  pagesCount,
  figuresCount,
  thingsToFixCount
}) => {
  return (
    <div className="flex items-center gap-1">
      {/* 1. All pages tab */}
      <button
        onClick={() => onTabChange('pages')}
        className={`px-3.5 py-2 text-xs font-medium rounded-t-[6px] transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          activeTab === 'pages'
            ? 'border-[#1a1612] text-[#1a1612] bg-[#f7f2ea]'
            : 'border-transparent text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db]/40'
        }`}
      >
        <span>All pages</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10.5px] font-normal ${
            activeTab === 'pages' ? 'bg-[#1a1612] text-white' : 'bg-[#e6dccb] text-[#6e6358]'
          }`}
        >
          {pagesCount}
        </span>
      </button>

      {/* 2. Figures tab */}
      <button
        onClick={() => onTabChange('figures')}
        className={`px-3.5 py-2 text-xs font-medium rounded-t-[6px] transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          activeTab === 'figures'
            ? 'border-[#1a1612] text-[#1a1612] bg-[#f7f2ea]'
            : 'border-transparent text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db]/40'
        }`}
      >
        <span>Figures</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10.5px] font-normal ${
            activeTab === 'figures' ? 'bg-[#1a1612] text-white' : 'bg-[#e6dccb] text-[#6e6358]'
          }`}
        >
          {figuresCount}
        </span>
      </button>

      {/* 3. Links and addresses tab */}
      <button
        onClick={() => onTabChange('links')}
        className={`px-3.5 py-2 text-xs font-medium rounded-t-[6px] transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          activeTab === 'links'
            ? 'border-[#1a1612] text-[#1a1612] bg-[#f7f2ea]'
            : 'border-transparent text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db]/40'
        }`}
      >
        <span>Links and addresses</span>
        {thingsToFixCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10.5px] font-semibold bg-[#c5ad7d] text-[#1a1612]">
            {thingsToFixCount} to fix
          </span>
        )}
      </button>
    </div>
  );
};

export default PagesHeaderTabs;
