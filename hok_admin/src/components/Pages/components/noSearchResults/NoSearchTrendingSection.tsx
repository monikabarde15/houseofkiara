/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NoSearchTrendingSection (Spec § 8.19, Screen 60)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { NO_SEARCH_TRENDING_CHIPS } from '../../data/noSearchResultsData';
import { EditableFieldProps } from '../types';

export interface NoSearchTrendingSectionProps extends EditableFieldProps {}

export const NoSearchTrendingSection: React.FC<NoSearchTrendingSectionProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const eyebrow = fieldValues['no_search_trending_eyebrow'] || 'TRENDING NOW';

  return (
    <div id="trending" className="pt-6 pb-4 space-y-4 text-center">
      <div className="border-t border-dashed border-[#ded8cf] pt-6 mb-4">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('no_search_trending_eyebrow')}
          onBlur={(e) => onFieldChange('no_search_trending_eyebrow', e.currentTarget.textContent || '')}
          className="text-[10.5px] font-mono tracking-widest text-[#935b1e] uppercase font-semibold cursor-pointer hover:bg-[#fbf4ea] px-1 py-0.5 rounded transition-colors inline-block focus:outline-none"
        >
          {eyebrow}
        </span>
      </div>

      {/* Trending Search Chips Grid */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto">
        {NO_SEARCH_TRENDING_CHIPS.map((chip) => (
          <div
            key={chip}
            className="px-4 py-2 bg-white border border-[#ded8cf] rounded-[6px] text-xs sm:text-[13px] text-[#44403c] font-serif hover:border-[#c5ad7d] hover:text-[#935b1e] transition-colors cursor-pointer shadow-2xs"
          >
            {chip}
          </div>
        ))}
      </div>

      <p className="text-xs text-[#8a7f73] italic pt-2">
        Read from the one list in Site Settings, under Header. The label above it is a line on this page.
      </p>
    </div>
  );
};

export default NoSearchTrendingSection;
