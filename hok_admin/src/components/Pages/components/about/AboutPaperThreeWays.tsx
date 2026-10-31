/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperThreeWays (Spec §7.4, §8.6 Part 08, Screen 44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperThreeWaysProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToPage?: (slug: string) => void;
  showFourthWayLine?: boolean;
  isHidden?: boolean;
}

const DOORS = [
  {
    num: '01',
    title: 'Rent',
    lead: 'For the night you will remember forever.',
    body: 'Choose from verified couture pieces for 3, 5, or 7 days, complete with complimentary fitting consultations and return dry cleaning.',
    btn: 'BROWSE RENTALS →',
    slug: '/catalogue'
  },
  {
    num: '02',
    title: 'Buy Preloved',
    lead: 'Acquire archived designer pieces to keep.',
    body: 'Pristine condition garments from private collections, authenticated and certified, ready to add to your permanent heritage collection.',
    btn: 'SHOP PRELOVED →',
    slug: '/preloved'
  },
  {
    num: '03',
    title: 'List to Earn',
    lead: 'Turn your couture into passive revenue.',
    body: 'Monetize your unworn luxury wedding and occasion wear. We handle photography, storage, dry cleaning, dispatch, and guarantee 100% on-time payouts.',
    btn: 'START LISTING →',
    slug: '/list-your-piece'
  }
];

export const AboutPaperThreeWays: React.FC<AboutPaperThreeWaysProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onNavigateToPage,
  showFourthWayLine = true,
  isHidden = false
}) => {
  const isSelected = activePartId === 'three-ways';

  return (
    <section
      id="three-ways"
      onClick={() => onSelectPart('three-ways')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-12 text-center space-y-8 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            Three Ways · hidden on the page
          </span>
        </div>
      )}

      <div className="space-y-2 max-w-xl mx-auto">
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('three-ways', 'about_three_eyebrow', 'Eyebrow', 'Three ways section eyebrow');
          }}
          contentEditable={focusedField?.fieldId === 'about_three_eyebrow'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_three_eyebrow', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'about_three_eyebrow'
              ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none'
              : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('about_three_eyebrow', 'THREE WAYS TO ENGAGE')}
        </span>

        <h2
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('three-ways', 'about_three_heading', 'Heading', 'Three ways heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'about_three_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_three_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[28px] md:text-[34px] font-normal text-[#1a1612] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_three_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          Three ways to belong to <span className="italic text-[#8a6a36]">the story</span>
        </h2>

        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('three-ways', 'about_three_lead', 'Line under the heading', 'Three ways subtitle');
          }}
          contentEditable={focusedField?.fieldId === 'about_three_lead'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_three_lead', e.currentTarget.textContent || '')}
          className={`text-xs text-[#73675a] leading-relaxed cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_three_lead' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal(
            'about_three_lead',
            'Every wardrobe and every occasion has a place here, tailored to how you love to dress.'
          )}
        </p>
      </div>

      {/* Three Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {DOORS.map((door, idx) => (
          <div
            key={door.num}
            className="p-6 rounded-[8px] bg-[#faf7f2] border border-[#f0ebe3] flex flex-col justify-between space-y-4 hover:border-[#bda67b] transition-colors"
          >
            <div className="space-y-2">
              <span
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('three-ways', `about_door_${idx}_num`, 'Numeral', 'Door numeral');
                }}
                contentEditable={focusedField?.fieldId === `about_door_${idx}_num`}
                suppressContentEditableWarning
                onInput={e => onFieldChange(`about_door_${idx}_num`, e.currentTarget.textContent || '')}
                className="font-serif text-[18px] text-[#8a6a36] font-semibold cursor-text p-0.5 rounded"
              >
                {getVal(`about_door_${idx}_num`, door.num)}
              </span>
              <h3
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('three-ways', `about_door_${idx}_title`, 'Title', 'Door title');
                }}
                contentEditable={focusedField?.fieldId === `about_door_${idx}_title`}
                suppressContentEditableWarning
                onInput={e => onFieldChange(`about_door_${idx}_title`, e.currentTarget.textContent || '')}
                className="font-serif text-[20px] text-[#1a1612] cursor-text p-0.5 rounded"
              >
                {getVal(`about_door_${idx}_title`, door.title)}
              </h3>
              <p
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('three-ways', `about_door_${idx}_lead`, 'Lead line', 'Door lead summary');
                }}
                contentEditable={focusedField?.fieldId === `about_door_${idx}_lead`}
                suppressContentEditableWarning
                onInput={e => onFieldChange(`about_door_${idx}_lead`, e.currentTarget.textContent || '')}
                className="text-xs font-medium text-[#5c5248] cursor-text p-0.5 rounded"
              >
                {getVal(`about_door_${idx}_lead`, door.lead)}
              </p>
              <p
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('three-ways', `about_door_${idx}_body`, 'Body', 'Door full description');
                }}
                contentEditable={focusedField?.fieldId === `about_door_${idx}_body`}
                suppressContentEditableWarning
                onInput={e => onFieldChange(`about_door_${idx}_body`, e.currentTarget.textContent || '')}
                className="text-[11.5px] text-[#73675a] leading-relaxed cursor-text p-0.5 rounded"
              >
                {getVal(`about_door_${idx}_body`, door.body)}
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onNavigateToPage?.(door.slug);
                }}
                className="text-xs font-semibold text-[#8a6a36] hover:underline cursor-pointer tracking-wider"
              >
                {door.btn}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Line underneath (Spec §8.6 Part 08) */}
      {showFourthWayLine && (
        <div className="pt-2 text-xs text-[#8a7f73]">
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('three-ways', 'about_three_footer', 'Line', 'Closing question line');
            }}
            contentEditable={focusedField?.fieldId === 'about_three_footer'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_three_footer', e.currentTarget.textContent || '')}
            className="cursor-text p-1 rounded hover:ring-1 hover:ring-[#bda67b]/30"
          >
            {getVal('about_three_footer', 'Have a piece you are thinking about? Reach out to our team.')}
          </span>
        </div>
      )}
    </section>
  );
};

export default AboutPaperThreeWays;
