/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AnswersHeaderStrip (Spec §7.8, Screen 26)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../types/pages.types';

interface AnswersHeaderStripProps {
  page: PageCardData;
  answersCount: number;
  onBackToPaperView: () => void;
  onBackToAllPages: () => void;
}

export const AnswersHeaderStrip: React.FC<AnswersHeaderStripProps> = ({
  page,
  answersCount,
  onBackToPaperView,
  onBackToAllPages
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#faf7f2] border-b border-[#e6dccb] px-6 py-3 shadow-2xs">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToPaperView}
            className="text-xs text-[#8a6a36] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>‹ Back to Paper view</span>
          </button>
          <span className="text-[#d6ccbd]">|</span>
          <span className="text-xs text-[#73675a]">
            {page.name}
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#f0eae1] text-[#73675a] font-medium">
            Answers view ({answersCount})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToPaperView}
            className="px-3 py-1 text-xs rounded border border-[#e6dccb] bg-white hover:bg-[#faf7f2] text-[#1a1612] font-medium transition-colors"
          >
            View on paper
          </button>
          <button
            type="button"
            onClick={onBackToAllPages}
            className="text-xs text-[#73675a] hover:text-[#1a1612]"
          >
            All pages
          </button>
        </div>
      </div>
    </header>
  );
};

export default AnswersHeaderStrip;
