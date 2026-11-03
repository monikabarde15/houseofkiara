/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperWhatWeBelieve (Spec §7.4, §8.6 Part 04, Screens 44 & 45)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperWhatWeBelieveProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  isHidden?: boolean;
}

const BELIEFS = [
  {
    id: 'b1',
    icon: '✦',
    firstHalf: 'Celebration,',
    secondHalf: 'not ownership',
    paragraph: 'You do not need to own a moment to live it fully. Wear the showstopper for the night it was made for, then let it move on to someone else’s celebration.'
  },
  {
    id: 'b2',
    icon: '❖',
    firstHalf: 'Curation,',
    secondHalf: 'not catalogue',
    paragraph: 'Every piece is chosen, not just accepted. If it does not meet our standard of craft and condition, it does not make it onto House of Kaira, no exceptions.'
  },
  {
    id: 'b3',
    icon: '◈',
    firstHalf: 'Turnaround,',
    secondHalf: 'not warehouse',
    paragraph: 'Pieces belong on women at celebrations, not resting in dark boxes. Fast dispatch, fast cleaning, and pieces back on the rack within 48 hours.'
  },
  {
    id: 'b4',
    icon: '✧',
    firstHalf: 'Care,',
    secondHalf: 'first always',
    paragraph: 'A lehenga returns from a wedding with memories, and sometimes turmeric. Our Indore atelier treats every fabric with museum grade attention before it departs again.'
  }
];

export const AboutPaperWhatWeBelieve: React.FC<AboutPaperWhatWeBelieveProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  isHidden = false
}) => {
  const isSelected = activePartId === 'what-we-believe';

  return (
    <section
      id="what-we-believe"
      onClick={() => onSelectPart('what-we-believe')}
      className={`mt-10 relative rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-12 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 ring-1 ring-dashed ring-[#b85c38]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#f5d77f] bg-[#2b241b] border border-[#b85c38] px-2.5 py-0.5 rounded-full">
            What We Believe · hidden on the page
          </span>
        </div>
      )}

      <div className="text-center space-y-3 mb-10">
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('what-we-believe', 'about_believe_eyebrow', 'Eyebrow', 'Small label above section title');
          }}
          contentEditable={focusedField?.fieldId === 'about_believe_eyebrow'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_believe_eyebrow', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'about_believe_eyebrow'
              ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-[#f5d77f] outline-none'
              : 'text-[#d4af37] hover:ring-1 hover:ring-[#d4af37]/40'
          }`}
        >
          {getVal('about_believe_eyebrow', 'WHAT WE BELIEVE')}
        </span>

        <h2
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('what-we-believe', 'about_believe_heading', 'Heading', 'Four ideas heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'about_believe_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_believe_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[26px] md:text-[32px] font-normal leading-tight text-[#f7f2ea] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_believe_heading'
              ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none'
              : 'hover:ring-1 hover:ring-[#d4af37]/40'
          }`}
        >
          Four ideas we will <span className="italic text-[#d4af37]">never</span> compromise on
        </h2>
      </div>

      {/* 2x2 Grid of Beliefs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        {BELIEFS.map(b => (
          <div key={b.id} className="space-y-2 p-4 rounded bg-[#241e17] border border-[#332b21]">
            <div className="text-[#d4af37] text-base">{b.icon}</div>
            <div className="font-serif text-[18px] text-[#f7f2ea] leading-snug">
              <span
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('what-we-believe', `about_b_${b.id}_h1`, `${b.firstHalf} first half`, 'Belief title first half');
                }}
                contentEditable={focusedField?.fieldId === `about_b_${b.id}_h1`}
                suppressContentEditableWarning
                onInput={e => onFieldChange(`about_b_${b.id}_h1`, e.currentTarget.textContent || '')}
                className={`cursor-text p-0.5 rounded ${
                  focusedField?.fieldId === `about_b_${b.id}_h1`
                    ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none'
                    : 'hover:ring-1 hover:ring-[#d4af37]/30'
                }`}
              >
                {getVal(`about_b_${b.id}_h1`, b.firstHalf)}
              </span>{' '}
              <span
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('what-we-believe', `about_b_${b.id}_h2`, `${b.secondHalf} second half`, 'Belief title second half in gold italic');
                }}
                contentEditable={focusedField?.fieldId === `about_b_${b.id}_h2`}
                suppressContentEditableWarning
                onInput={e => onFieldChange(`about_b_${b.id}_h2`, e.currentTarget.textContent || '')}
                className={`italic text-[#d4af37] cursor-text p-0.5 rounded ${
                  focusedField?.fieldId === `about_b_${b.id}_h2`
                    ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none'
                    : 'hover:ring-1 hover:ring-[#d4af37]/30'
                }`}
              >
                {getVal(`about_b_${b.id}_h2`, b.secondHalf)}
              </span>
            </div>
            <p
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('what-we-believe', `about_b_${b.id}_p`, `${b.firstHalf} paragraph`, 'Belief paragraph explanation');
              }}
              contentEditable={focusedField?.fieldId === `about_b_${b.id}_p`}
              suppressContentEditableWarning
              onInput={e => onFieldChange(`about_b_${b.id}_p`, e.currentTarget.textContent || '')}
              className={`text-[#dcd4c7] leading-relaxed cursor-text p-1 rounded ${
                focusedField?.fieldId === `about_b_${b.id}_p`
                  ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none'
                  : 'hover:ring-1 hover:ring-[#d4af37]/30'
              }`}
            >
              {getVal(`about_b_${b.id}_p`, b.paragraph)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutPaperWhatWeBelieve;
