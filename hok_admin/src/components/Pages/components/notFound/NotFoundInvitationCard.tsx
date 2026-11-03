/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NotFoundInvitationCard (Spec § 8.18, Screen 59)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import {
  NotFoundScenario,
  NOT_FOUND_QUIET_LINKS
} from '../../data/pageNotFoundData';
import { EditableFieldProps } from '../types';

export interface NotFoundInvitationCardProps extends EditableFieldProps {
  scenario: NotFoundScenario;
  onNavigateToPage?: (slug: string) => void;
}

export const NotFoundInvitationCard: React.FC<NotFoundInvitationCardProps> = ({
  scenario,
  onNavigateToPage,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const eyebrowKey = `not_found_${scenario.id}_eyebrow`;
  const headingPrefixKey = `not_found_${scenario.id}_heading_prefix`;
  const headingItalicKey = `not_found_${scenario.id}_heading_italic`;
  const bodyKey = `not_found_${scenario.id}_body`;

  const eyebrow = fieldValues[eyebrowKey] || scenario.eyebrow;
  const headingPrefix = fieldValues[headingPrefixKey] || scenario.headingPrefix;
  const headingItalic = fieldValues[headingItalicKey] || scenario.headingGoldItalic;
  const body = fieldValues[bodyKey] || scenario.body;

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
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField(headingItalicKey)}
          onBlur={(e) => onFieldChange(headingItalicKey, e.currentTarget.textContent || '')}
          className="italic text-[#935b1e] cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
        >
          {headingItalic}
        </span>
      </h1>

      {/* Body Text */}
      <div className="relative z-10 max-w-xl mx-auto text-xs sm:text-sm text-[#57534e] leading-relaxed">
        {scenario.hasPieceToken ? (
          <p>
            <span>The </span>
            <span className="bg-[#f5f1eb] px-1.5 py-0.5 rounded font-mono text-[11px] text-[#785b1a] border border-dashed border-[#d6cfc4]">
              the piece
            </span>
            <span> by </span>
            <span className="bg-[#f5f1eb] px-1.5 py-0.5 rounded font-mono text-[11px] text-[#785b1a] border border-dashed border-[#d6cfc4]">
              the designer
            </span>
            <span> now belongs to someone who will treasure it. Here are pieces in the same spirit, or our team can look for one like it for you.</span>
          </p>
        ) : (
          <p
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField(bodyKey)}
            onBlur={(e) => onFieldChange(bodyKey, e.currentTarget.textContent || '')}
            className="cursor-pointer hover:bg-[#fbf4ea] p-1 rounded transition-colors focus:outline-none"
          >
            {body}
          </p>
        )}
      </div>

      {/* Search Field & Search Button */}
      <div className="relative z-10 max-w-md mx-auto flex items-stretch gap-2 pt-2">
        <div className="relative flex-1">
          <input
            type="text"
            readOnly
            placeholder="Search designers, pieces, occasions"
            className="w-full bg-white border border-[#ded8cf] rounded-[6px] pl-9 pr-3 py-2 text-xs text-[#1c1917] placeholder-[#a8a29e] focus:outline-none"
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

      {/* Query Suggestion */}
      {scenario.suggestQuery && (
        <div className="relative z-10 text-xs text-[#73675a]">
          <span>Or search for </span>
          <span className="underline italic text-[#935b1e] cursor-pointer font-serif">
            "{scenario.suggestQuery}"
          </span>
        </div>
      )}

      {/* Two Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          className="px-5 py-2.5 bg-[#1c1917] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-[6px] hover:bg-[#322e2a] transition-colors cursor-pointer shadow-xs"
        >
          BROWSE RENTALS
        </button>
        <button
          type="button"
          className="px-5 py-2.5 bg-white text-[#1c1917] border border-[#1c1917] text-xs font-mono uppercase tracking-wider font-semibold rounded-[6px] hover:bg-[#faf7f2] transition-colors cursor-pointer"
        >
          SHOP PRELOVED
        </button>
      </div>

      {/* Quiet Links Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-4 text-xs text-[#73675a]">
        {NOT_FOUND_QUIET_LINKS.map((link, idx) => (
          <React.Fragment key={link.label}>
            <button
              type="button"
              onClick={() => onNavigateToPage?.(link.href)}
              className="hover:text-[#1c1917] hover:underline cursor-pointer"
            >
              {link.label}
            </button>
            {idx < NOT_FOUND_QUIET_LINKS.length - 1 && (
              <span className="text-[#ded8cf]">·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NotFoundInvitationCard;
