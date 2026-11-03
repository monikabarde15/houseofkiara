/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NoSearchOccasionsGrid (Spec § 8.19, Screen 60)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { NO_SEARCH_OCCASIONS } from '../../data/noSearchResultsData';
import { EditableFieldProps } from '../types';

export interface NoSearchOccasionsGridProps extends EditableFieldProps {
  onNavigateToPage?: (slug: string) => void;
}

export const NoSearchOccasionsGrid: React.FC<NoSearchOccasionsGridProps> = ({
  onNavigateToPage,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const eyebrow = fieldValues['no_search_occasions_eyebrow'] || 'ANOTHER WAY IN';
  const heading = fieldValues['no_search_occasions_heading'] || 'Or begin with the ';

  return (
    <div className="pt-2 pb-2 space-y-5 text-center">
      <div className="space-y-1">
        <div
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('no_search_occasions_eyebrow')}
          onBlur={(e) => onFieldChange('no_search_occasions_eyebrow', e.currentTarget.textContent || '')}
          className="text-[10.5px] font-mono tracking-widest text-[#935b1e] uppercase font-semibold cursor-pointer hover:bg-[#fbf4ea] px-1 py-0.5 rounded transition-colors inline-block focus:outline-none"
        >
          {eyebrow}
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('no_search_occasions_heading')}
            onBlur={(e) => onFieldChange('no_search_occasions_heading', e.currentTarget.textContent || '')}
            className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
          >
            {heading}
          </span>
          <span className="italic text-[#935b1e]">occasion</span>
        </h2>
      </div>

      {/* 8 Occasions Cards Grid (4 columns x 2 rows) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-left">
        {NO_SEARCH_OCCASIONS.map((item) => (
          <div
            key={item.title}
            onClick={() => onNavigateToPage?.(item.href)}
            className="bg-white border border-[#ebe5dc] rounded-[8px] p-4.5 space-y-2 hover:border-[#c5ad7d] transition-all cursor-pointer group shadow-2xs"
          >
            <div className="text-[11px] font-serif italic text-[#8a7f73]">
              {item.num}
            </div>
            <div className="font-serif text-base text-[#1c1917] group-hover:text-[#935b1e] transition-colors leading-snug">
              {item.title}
            </div>
            <div className="text-[10px] font-mono tracking-wider text-[#935b1e] font-semibold pt-1">
              {item.action}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#8a7f73] italic pt-1">
        The occasions are the catalogue’s own, so they are kept in Master Data.
      </p>
    </div>
  );
};

export default NoSearchOccasionsGrid;
