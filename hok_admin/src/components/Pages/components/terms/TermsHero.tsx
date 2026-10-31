/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsHero (Spec §8.9 Part 01, Screen 49)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

interface TermsHeroProps extends EditableFieldProps {
  hidden?: boolean;
  onSelectClauseByTitle?: (title: string) => void;
}

export const TermsHero: React.FC<TermsHeroProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden,
  onSelectClauseByTitle
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;
  const [searchTerm, setSearchTerm] = useState('');

  const popularClauses = [
    'Your security deposit',
    'Responsibility for the piece while it is with you',
    'Late returns',
    'If a preloved piece is not as described'
  ];

  return (
    <section
      id="hero"
      className={`space-y-4 transition-opacity duration-200 ${hidden ? 'opacity-40 grayscale' : 'opacity-100'}`}
    >
      {/* Eyebrow */}
      <div className="text-center">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'terms_hero_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker above terms heading' })}
          onBlur={e => onFieldChange?.('terms_hero_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] tracking-[0.25em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('terms_hero_eyebrow', 'THE AGREEMENT BETWEEN US')}
        </span>
      </div>

      {/* Heading */}
      <h1 className="font-serif text-3xl md:text-5xl text-center text-[#1a1612] font-normal leading-tight">
        <span>Terms & </span>
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'terms_hero_italic', fieldName: 'Heading gold italic', helpText: 'Gold italic emphasis in heading' })}
          onBlur={e => onFieldChange?.('terms_hero_italic', e.currentTarget.textContent || '')}
          className="italic text-[#8a6a36] outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('terms_hero_italic', 'conditions')}
        </span>
      </h1>

      {/* Lead Paragraph */}
      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField?.({ fieldId: 'terms_hero_lead', fieldName: 'Line under heading', helpText: 'Lead text under terms heading' })}
        onBlur={e => onFieldChange?.('terms_hero_lead', e.currentTarget.textContent || '')}
        className="text-xs md:text-sm text-[#5c5248] text-center max-w-xl mx-auto leading-relaxed outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
      >
        {getVal('terms_hero_lead', 'Everything you and House of Kaira agree to when you rent, buy or list with us. Written to be read, with every clause numbered so it is easy to find and share.')}
      </p>

      {/* Version and Dates Pill (Screen 49) */}
      <div className="flex items-center justify-center gap-2 text-xs flex-wrap pt-1">
        <span className="bg-[#faf1da] text-[#8a6a36] border border-[#e6d8b5] px-2 py-0.5 rounded-[4px] font-medium text-[11px]">
          Version 1.0
        </span>
        <span className="text-[#8a7f73]">·</span>
        <span className="text-[#5c5248]">
          In force from{' '}
          <span className="bg-[#faf1da] text-[#8a6a36] border border-[#e6d8b5] px-1.5 py-0.2 rounded font-serif">
            7 October 2026
          </span>
        </span>
        <span className="text-[#8a7f73]">·</span>
        <span className="text-[#5c5248]">
          Last updated{' '}
          <span className="bg-[#faf1da] text-[#8a6a36] border border-[#e6d8b5] px-1.5 py-0.2 rounded font-serif">
            26 September 2026
          </span>
        </span>
      </div>

      {/* Search Box (Screen 49) */}
      <div className="max-w-xl mx-auto pt-3">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7f73] text-sm">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search the terms, like "deposit", "late return" or a clause number'
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dcd4c7] rounded-[6px] text-xs text-[#1a1612] placeholder-[#8a7f73] focus:outline-none focus:border-[#8a6a36] shadow-2xs"
          />
        </div>

        {/* Popular Clauses Chips */}
        <div className="flex items-center gap-2 mt-2.5 text-[11px] text-[#8a7f73] flex-wrap justify-center">
          <span className="font-medium text-[#5c5248]">Popular:</span>
          {popularClauses.map((title, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>·</span>}
              <button
                type="button"
                onClick={() => onSelectClauseByTitle?.(title)}
                className="text-[#1a1612] hover:text-[#8a6a36] hover:underline cursor-pointer transition-colors"
              >
                {title}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsHero;
