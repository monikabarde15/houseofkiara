/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperHero (Spec §7.4, §8.6 Part 01, Screen 44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperHeroProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  isHidden?: boolean;
}

export const AboutPaperHero: React.FC<AboutPaperHeroProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  isHidden = false
}) => {
  const isSelected = activePartId === 'hero';

  return (
    <section
      id="hero"
      onClick={() => onSelectPart('hero')}
      className={`relative rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-12 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 ring-1 ring-dashed ring-[#b85c38]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#f5d77f] bg-[#2b241b] border border-[#b85c38] px-2.5 py-0.5 rounded-full">
            Hero · hidden on the page
          </span>
        </div>
      )}

      <div className="max-w-2xl space-y-4">
        {/* Eyebrow */}
        <div>
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'about_eyebrow', 'Eyebrow', 'Small label above main headline');
            }}
            contentEditable={focusedField?.fieldId === 'about_eyebrow'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_eyebrow', e.currentTarget.textContent || '')}
            className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'about_eyebrow'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-[#f5d77f] outline-none'
                : 'text-[#d4af37] hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            {getVal('about_eyebrow', 'ABOUT HOUSE OF KAIRA')}
          </span>
        </div>

        {/* Headline */}
        <div>
          <h1
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'about_heading', 'Headline', 'Main hero statement on About HOK', true);
            }}
            contentEditable={focusedField?.fieldId === 'about_heading'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_heading', e.currentTarget.textContent || '')}
            className={`font-serif text-[32px] md:text-[40px] font-normal leading-tight text-[#f7f2ea] cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'about_heading'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none'
                : 'hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            A home for <span className="italic text-[#d4af37]">beloved</span> things.
          </h1>
        </div>

        {/* Lead line */}
        <div>
          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'about_lead', 'Line under the heading', 'Explains circular luxury in motion');
            }}
            contentEditable={focusedField?.fieldId === 'about_lead'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_lead', e.currentTarget.textContent || '')}
            className={`text-[13.5px] text-[#dcd4c7] leading-relaxed cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'about_lead'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none'
                : 'hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            {getVal(
              'about_lead',
              'We do not sell clothes, we give them somewhere to go next. For someone wearing a piece once, or someone letting it earn from their wardrobe, our home in Indore is where luxury stays in motion.'
            )}
          </p>
        </div>

        {/* Three Facts Row (Spec §8.6 Part 01) */}
        <div className="pt-6 border-t border-[#332b21] grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="space-y-1">
            <div className="font-serif text-[15px] text-[#f5d77f]">
              {getVal('about_fact1_title', '100% genuine')}
            </div>
            <div className="text-[11.5px] text-[#a89d8d]">
              {getVal('about_fact1_desc', 'Authenticated before every wear')}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-[15px] text-[#f5d77f]">
              {getVal('about_fact2_title', 'Complimentary care')}
            </div>
            <div className="text-[11.5px] text-[#a89d8d]">
              {getVal('about_fact2_desc', 'Surgically cleaned, always')}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-[15px] text-[#f5d77f]">
              {getVal('about_fact3_title', 'Door to door')}
            </div>
            <div className="text-[11.5px] text-[#a89d8d]">
              {getVal('about_fact3_desc', 'Direct delivery across India')}
            </div>
          </div>
        </div>

        {/* Brand Film Slot (Spec §8.6 Part 01) */}
        <div className="pt-4 border-t border-[#332b21]/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#2b241b] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-[10px]">
              ▶
            </span>
            <span
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('hero', 'about_film_slot', 'What it says while there is no film', 'Brand film status text');
              }}
              contentEditable={focusedField?.fieldId === 'about_film_slot'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_film_slot', e.currentTarget.textContent || '')}
              className={`text-[#c5ad7d] cursor-text p-1 rounded ${
                focusedField?.fieldId === 'about_film_slot'
                  ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none text-white'
                  : 'hover:ring-1 hover:ring-[#d4af37]/30'
              }`}
            >
              {getVal('about_film_slot', 'Brand film: Indore atelier · Coming with autumn collection')}
            </span>
          </div>
          <span className="text-[11px] text-[#8a7f73]">Film in production</span>
        </div>

        {/* Scroll cue */}
        <div className="pt-3 text-center">
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'about_scroll_cue', 'Word under the hero', 'Scroll invitation cue');
            }}
            contentEditable={focusedField?.fieldId === 'about_scroll_cue'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_scroll_cue', e.currentTarget.textContent || '')}
            className={`text-[11px] text-[#8a7f73] italic cursor-text p-1 rounded ${
              focusedField?.fieldId === 'about_scroll_cue'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none text-white'
                : 'hover:ring-1 hover:ring-[#d4af37]/30'
            }`}
          >
            {getVal('about_scroll_cue', 'Scroll to read the story ↓')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default AboutPaperHero;
