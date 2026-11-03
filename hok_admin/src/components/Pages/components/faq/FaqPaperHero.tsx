/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FaqPaperHero (Spec §8.4, Screens 39, 40)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { Search } from 'lucide-react';
import { EditableFieldInfo } from './PagePaperCanvas';

interface FaqPaperHeroProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectQuestionId?: (qId: string) => void;
}

export const FaqPaperHero: React.FC<FaqPaperHeroProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectQuestionId
}) => {
  const popularPicks = [
    { id: 'fit-match', label: 'How do I know a piece will fit me?' },
    { id: 'deposit-back', label: 'When will I get my deposit back?' },
    { id: 'advance-booking', label: 'How far in advance should I book?' },
    { id: 'preloved-return', label: 'Can I return a preloved piece?' }
  ];

  return (
    <section
      id="hero"
      onClick={() => onSelectPart('hero')}
      className={`relative pt-2 pb-6 px-4 text-center cursor-pointer rounded transition-colors ${
        activePartId === 'hero' ? 'ring-1 ring-[#bda67b]/50 bg-[#fffdfa]' : 'hover:bg-[#fcfaf7]'
      }`}
    >
      {/* 1. Centered Greeting in Cormorant Garamond cursive style */}
      <div
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('hero', 'faq_greeting', 'Greeting', 'The greeting above the main heading in italic font.');
        }}
        className={`font-serif italic text-[22px] md:text-[24px] text-[#8a7f72] font-normal transition-all p-1 rounded inline-block ${
          focusedField?.fieldId === 'faq_greeting' ? 'ring-1 ring-[#bda67b] bg-white text-[#1a1612]' : ''
        }`}
      >
        {getVal('faq_greeting', "Hello, we're so glad you're here")}
      </div>

      {/* 2. Main Title with gold italic: What's on your mind? */}
      <div
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('hero', 'faq_heading', 'Heading', 'The main page heading. Words set in gold italic match the brand typography.', true);
        }}
        className={`font-serif text-[44px] md:text-[52px] font-normal text-[#1a1612] leading-tight mt-1 transition-all p-1 rounded inline-block ${
          focusedField?.fieldId === 'faq_heading' ? 'ring-1 ring-[#bda67b] bg-white' : ''
        }`}
      >
        <span>What&apos;s on </span>
        <span className="italic text-[#bda67b]">your mind?</span>
      </div>

      {/* 3. Search Box */}
      <div className="mt-6 max-w-[580px] mx-auto">
        <div
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('hero', 'faq_search_placeholder', 'Search box placeholder', 'The placeholder prompt inside the search box.');
          }}
          className={`flex items-center gap-3 bg-white border border-[#e5ddd0] hover:border-[#bda67b] rounded-[6px] px-4 py-3 shadow-2xs transition-colors cursor-text text-left ${
            focusedField?.fieldId === 'faq_search_placeholder' ? 'ring-2 ring-[#bda67b]/40 border-[#bda67b]' : ''
          }`}
        >
          <Search className="w-4 h-4 text-[#8a7f72] shrink-0" />
          <span className="text-[13px] text-[#8a7f72] select-none">
            {getVal('faq_search_placeholder', 'Ask anything: deposit, fit, late return, offer...')}
          </span>
        </div>
      </div>

      {/* 4. Popular Questions Row */}
      <div className="mt-5 text-[12.5px] text-[#6e6358] flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 max-w-2xl mx-auto">
        <span className="text-[#8a7f72] font-medium">Popular:</span>
        {popularPicks.map((pick, idx) => (
          <React.Fragment key={pick.id}>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onSelectQuestionId?.(pick.id);
              }}
              className="hover:text-[#1a1612] hover:underline underline-offset-2 cursor-pointer transition-colors"
            >
              {pick.label}
            </button>
            {idx < popularPicks.length - 1 && <span className="text-[#d8cfc4]">·</span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default FaqPaperHero;
