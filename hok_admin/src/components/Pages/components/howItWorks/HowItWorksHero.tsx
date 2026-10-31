/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksHero (Spec §7.4, §8.7 Part 01, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface HowItWorksHeroProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onJumpToPart?: (partId: string) => void;
  isHidden?: boolean;
}

export const HowItWorksHero: React.FC<HowItWorksHeroProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onJumpToPart,
  isHidden = false
}) => {
  const isSelected = activePartId === 'hero';

  return (
    <section
      id="hero"
      onClick={() => onSelectPart('hero')}
      className={`relative rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-12 overflow-hidden transition-all cursor-pointer ${
        isHidden ? 'opacity-50 ring-1 ring-dashed ring-[#b85c38]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'}`}
    >
      {/* Subtle HOK Watermark */}
      <div className="absolute right-4 bottom-2 text-[#2b241b] font-serif text-[110px] select-none pointer-events-none font-bold opacity-30 leading-none">
        HOK
      </div>

      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5 z-10">
          <span className="text-[11px] font-medium text-[#f5d77f] bg-[#2b241b] border border-[#b85c38] px-2.5 py-0.5 rounded-full">
            Hero · hidden on the page
          </span>
        </div>
      )}

      <div className="max-w-2xl space-y-4 relative z-10">
        {/* Kicker */}
        <div>
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'hiw_kicker', 'Kicker', 'Eyebrow kicker above headline');
            }}
            contentEditable={focusedField?.fieldId === 'hiw_kicker'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('hiw_kicker', e.currentTarget.textContent || '')}
            className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'hiw_kicker'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-[#f5d77f] outline-none'
                : 'text-[#d4af37] hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            {getVal('hiw_kicker', 'SIMPLE BY DESIGN')}
          </span>
        </div>

        {/* Headline */}
        <div>
          <h1
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'hiw_heading', 'Headline', 'Main page headline', true);
            }}
            contentEditable={focusedField?.fieldId === 'hiw_heading'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('hiw_heading', e.currentTarget.textContent || '')}
            className={`font-serif text-[32px] md:text-[40px] font-normal leading-tight text-[#f7f2ea] cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'hiw_heading'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none'
                : 'hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            Fashion that moves <span className="italic text-[#d4af37]">beautifully</span>, and keeps moving.
          </h1>
        </div>

        {/* Line under heading */}
        <div>
          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'hiw_lead', 'Line under the heading', 'Subtitle explaining circular ecosystem');
            }}
            contentEditable={focusedField?.fieldId === 'hiw_lead'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('hiw_lead', e.currentTarget.textContent || '')}
            className={`text-[13.5px] text-[#dcd4c7] leading-relaxed cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'hiw_lead'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none'
                : 'hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            {getVal(
              'hiw_lead',
              'Everything you need to know about shopping, renting, selling, and giving beautiful pieces a longer life in one place, laid out clearly.'
            )}
          </p>
        </div>

        {/* Two intent buttons jumping down page (Spec §8.7 Part 01) */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onJumpToPart?.('shopping-steps');
            }}
            className="px-5 py-2.5 rounded-[4px] bg-[#d4af37] text-[#1a1612] text-xs font-semibold tracking-wider uppercase hover:bg-[#c29f2f] transition cursor-pointer flex items-center gap-1.5"
          >
            <span>{getVal('hiw_btn_shop', 'I WANT TO SHOP')}</span>
            <span>↓</span>
          </button>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onJumpToPart?.('list-and-earn');
            }}
            className="px-5 py-2.5 rounded-[4px] bg-[#2b241b] border border-[#4a3f33] text-xs font-semibold text-[#f7f2ea] tracking-wider uppercase hover:bg-[#342c23] transition cursor-pointer flex items-center gap-1.5"
          >
            <span>{getVal('hiw_btn_earn', 'I WANT TO LIST & EARN')}</span>
            <span>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHero;
