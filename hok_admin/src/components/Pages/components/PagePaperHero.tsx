/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagePaperHero (Spec §7.1, §7.3, Screen 20)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from './PagePaperCanvas';
import { PageHeroContent } from '../data/pageContentRegistry';

interface PagePaperHeroProps {
  activePartId: string;
  heroContent: PageHeroContent;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
}

export const PagePaperHero: React.FC<PagePaperHeroProps> = ({
  activePartId,
  heroContent,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange
}) => {
  return (
    <section
      id="hero"
      onClick={() => onSelectPart('hero')}
      className={`relative space-y-3 cursor-pointer p-4 -m-4 rounded transition-colors ${
        activePartId === 'hero' ? 'ring-1 ring-[#bda67b]/50 bg-[#fffdfa]' : 'hover:bg-[#fcfaf7]'
      }`}
    >
      {/* Commitment tagline */}
      <div
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('hero', 'tagline', 'Tagline above heading', 'A short uppercase mark above the page heading.');
        }}
        className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-all p-1 rounded inline-block ${
          focusedField?.fieldId === 'tagline'
            ? 'ring-1 ring-[#bda67b] bg-white text-[#8a6a36]'
            : 'text-[#8a6a36] hover:bg-[#faf7f2]'
        }`}
      >
        {getVal('tagline', heroContent.tagline)}
      </div>

      {/* Heading */}
      <div
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('hero', 'heading', 'Heading', 'The main page heading. Words set in gold italic match the brand typography.', true);
        }}
        className={`font-serif text-[36px] md:text-[40px] font-normal text-[#1a1612] leading-tight transition-all p-1 rounded ${
          focusedField?.fieldId === 'heading' ? 'ring-1 ring-[#bda67b] bg-white' : 'hover:bg-[#faf7f2]'
        }`}
      >
        {heroContent.headingPrefix}
        <span className="italic text-[#8a6a36]">{heroContent.headingGoldItalic}</span>
        {heroContent.headingSuffix ? ` ${heroContent.headingSuffix}` : ''}
      </div>

      {/* Line under heading */}
      <div
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('hero', 'hero_lead', 'Line under the heading', 'Prints the standard window. Change the window in Figures and this follows.');
        }}
        className={`text-[14px] text-[#4a4238] leading-relaxed max-w-xl transition-all p-1.5 rounded ${
          focusedField?.fieldId === 'hero_lead' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:bg-[#faf7f2]'
        }`}
        contentEditable={focusedField?.fieldId === 'hero_lead'}
        suppressContentEditableWarning
        onBlur={e => onFieldChange('hero_lead', e.currentTarget.textContent || '')}
      >
        {getVal('hero_lead', heroContent.lead)}
      </div>

      {/* Search box on paper */}
      <div className="pt-2">
        <input
          type="text"
          readOnly
          placeholder={heroContent.searchPlaceholder}
          className="w-full max-w-lg p-2.5 px-3.5 bg-white border border-[#e6dccb] rounded-[6px] text-xs text-[#1a1612] placeholder-[#8a7f73] pointer-events-none"
        />
      </div>

      {/* Popular questions line */}
      {heroContent.popularQuestions && heroContent.popularQuestions.length > 0 && (
        <div className="text-[11.5px] text-[#73675a] pt-1">
          <span className="font-medium text-[#1a1612]">Popular: </span>
          {heroContent.popularQuestions.map((q, idx) => (
            <React.Fragment key={q}>
              <span className="hover:underline cursor-pointer">{q}</span>
              {idx < heroContent.popularQuestions.length - 1 && <span> · </span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
};

export default PagePaperHero;
