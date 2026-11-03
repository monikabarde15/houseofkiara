/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerHero (Spec § 8.17 Part 01)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { SELLER_HERO } from '../../data/sellerRegistry';
import { EditableFieldProps } from '../types';

export interface SellerHeroProps extends EditableFieldProps {
  onSelectQuestion?: (query: string) => void;
  onOpenProtection?: () => void;
}

export const SellerHero: React.FC<SellerHeroProps> = ({
  onSelectQuestion,
  onOpenProtection,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const eyebrow = fieldValues['seller_hero_eyebrow'] || SELLER_HERO.eyebrow;
  const title = fieldValues['seller_hero_title'] || SELLER_HERO.title;
  const lead = fieldValues['seller_hero_lead'] || SELLER_HERO.lead;

  return (
    <div className="space-y-6 pt-2 pb-6">
      {/* Eyebrow */}
      <div className="flex items-center justify-between">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('seller_hero_eyebrow')}
          onBlur={(e) => onFieldChange('seller_hero_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] font-mono tracking-widest text-[#935b1e] uppercase font-semibold cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
        >
          {eyebrow}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="font-serif text-3xl sm:text-5xl text-[#1c1917] tracking-tight font-normal">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('seller_hero_title')}
          onBlur={(e) => onFieldChange('seller_hero_title', e.currentTarget.textContent || '')}
          className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
        >
          {title}
        </span>
      </h1>

      {/* Subtitle / Lead */}
      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField('seller_hero_lead')}
        onBlur={(e) => onFieldChange('seller_hero_lead', e.currentTarget.textContent || '')}
        className="text-sm sm:text-base text-[#57534e] leading-relaxed max-w-2xl cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
      >
        {lead}
      </p>

      {/* Read Lister Terms Action */}
      <div className="pt-1">
        <a
          href="/terms#lister-terms"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#935b1e] hover:underline font-medium cursor-pointer"
        >
          <span>{SELLER_HERO.listerTermsLabel}</span>
          <span className="font-serif italic">↗</span>
        </a>
      </div>

      {/* Search Box & Quick Chips */}
      <div className="pt-2 space-y-3">
        <div className="relative max-w-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={SELLER_HERO.searchPlaceholder}
            className="w-full bg-[#fdfbf7] border border-[#ded8cf] rounded-[8px] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#935b1e] transition-colors shadow-2xs"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8a7f73]">
            🔍
          </span>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#8a7f73] font-serif italic text-xs">Try:</span>
          {SELLER_HERO.quickQueries.map((query) => (
            <button
              key={query}
              type="button"
              onClick={() => {
                setSearchQuery(query);
                onSelectQuestion?.(query);
              }}
              className="px-2.5 py-1 rounded bg-[#f5f1eb] text-[#57534e] hover:bg-[#ede6dc] hover:text-[#1c1917] transition-colors cursor-pointer text-xs font-medium"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerHero;
