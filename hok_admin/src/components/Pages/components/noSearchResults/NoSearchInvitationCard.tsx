/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NoSearchInvitationCard (Spec § 8.19, Screen 60)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { NoSearchScenario } from '../../data/noSearchResultsData';
import { EditableFieldProps } from '../types';

export interface NoSearchInvitationCardProps extends EditableFieldProps {
  scenario: NoSearchScenario;
}

export const NoSearchInvitationCard: React.FC<NoSearchInvitationCardProps> = ({
  scenario,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const eyebrowKey = `no_search_${scenario.id}_eyebrow`;
  const headingPrefixKey = `no_search_${scenario.id}_prefix`;
  const subtitleKey = `no_search_${scenario.id}_subtitle`;

  const eyebrow = fieldValues[eyebrowKey] || scenario.eyebrow;
  const headingPrefix = fieldValues[headingPrefixKey] || scenario.headingPrefix;
  const subtitle = fieldValues[subtitleKey] || scenario.subtitle;

  return (
    <div className="relative bg-[#fffdfa] border border-[#ebe5dc] rounded-[10px] p-8 sm:p-14 text-center shadow-xs space-y-6">
      {/* Inner keyline */}
      <div
        className="absolute inset-2.5 sm:inset-3 border border-[#ede3cf] rounded-[6px] pointer-events-none"
        aria-hidden="true"
      />
      {/* Top diamond */}
      <div
        className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#fffdfa] border border-[#c5ad7d] rotate-45 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Eyebrow */}
      <div className="relative z-10">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField(eyebrowKey)}
          onBlur={(e) => onFieldChange(eyebrowKey, e.currentTarget.textContent || '')}
          className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#935b1e] font-semibold cursor-pointer hover:bg-[#fbf4ea] px-1.5 py-0.5 rounded transition-colors focus:outline-none"
        >
          {eyebrow}
        </span>
      </div>

      {/* Heading */}
      <h1 className="relative z-10 font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal leading-tight">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField(headingPrefixKey)}
          onBlur={(e) => onFieldChange(headingPrefixKey, e.currentTarget.textContent || '')}
          className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
        >
          {headingPrefix}
        </span>
        <span className="bg-[#f5f1eb] px-1.5 py-0.5 rounded font-mono text-xl sm:text-2xl text-[#785b1a] border border-dashed border-[#d6cfc4] mx-1">
          {scenario.queryPlaceholder}
        </span>
        <span>{scenario.headingSuffix}</span>
      </h1>

      {/* Subtitle */}
      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField(subtitleKey)}
        onBlur={(e) => onFieldChange(subtitleKey, e.currentTarget.textContent || '')}
        className="relative z-10 max-w-lg mx-auto text-xs sm:text-sm text-[#57534e] leading-relaxed cursor-pointer hover:bg-[#fbf4ea] p-1 rounded transition-colors focus:outline-none"
      >
        {subtitle}
      </p>

      {/* Widen notice (if asked to rent) */}
      {scenario.widenNotice && (
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#faf6ee] text-[#935b1e] border border-[#e8dfcf] rounded-full text-xs font-medium cursor-pointer hover:bg-[#f5eedf]">
            <span>🔍</span>
            <span>{scenario.widenNotice}</span>
          </span>
        </div>
      )}

      {/* Search Input Box */}
      <div className="relative z-10 max-w-md mx-auto flex items-stretch gap-2 pt-1">
        <div className="relative flex-1">
          <input
            type="text"
            readOnly
            value={scenario.searchInputValue}
            placeholder="Search designers, pieces, occasions"
            className="w-full bg-white border border-[#ded8cf] rounded-[6px] pl-9 pr-3 py-2 text-xs text-[#1c1917] font-serif italic placeholder-[#a8a29e] focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8a7f73]">
            🔍
          </span>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-[#1c1917] text-white text-[11px] uppercase font-mono tracking-wider font-semibold rounded-[6px] hover:bg-[#322e2a] transition-colors cursor-pointer"
        >
          SEARCH
        </button>
      </div>

      {/* Did You Mean Suggestion */}
      {scenario.didYouMean && (
        <div className="relative z-10 text-xs text-[#73675a]">
          <span>Did you mean </span>
          <span className="underline italic text-[#935b1e] cursor-pointer font-serif">
            "{scenario.didYouMean}"
          </span>
          <span>?</span>
        </div>
      )}

      {/* Word Chips */}
      {scenario.wordChips && scenario.wordChips.length > 0 && (
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-[#8a7f73] italic">These words find pieces on their own:</span>
          {scenario.wordChips.map((chip) => (
            <span
              key={chip}
              className="px-2.5 py-1 rounded bg-[#f5f1eb] text-[#57534e] border border-[#ded8cf] text-xs font-medium"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* Designer Link */}
      {scenario.designerLink && (
        <div className="relative z-10 text-xs text-[#935b1e]">
          <span className="underline cursor-pointer hover:text-[#785b1a]">
            {scenario.designerLink}
          </span>
        </div>
      )}
    </div>
  );
};

export default NoSearchInvitationCard;
