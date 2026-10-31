/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperTwoSides (Spec §7.4, §8.6 Part 05, Screen 44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperTwoSidesProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  isHidden?: boolean;
}

export const AboutPaperTwoSides: React.FC<AboutPaperTwoSidesProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  isHidden = false
}) => {
  const [activeSide, setActiveSide] = useState<'celebrating' | 'earning'>('celebrating');
  const isSelected = activePartId === 'two-sides';

  return (
    <section
      id="two-sides"
      onClick={() => onSelectPart('two-sides')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-12 text-center space-y-6 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            Two Sides · hidden on the page
          </span>
        </div>
      )}

      <div className="space-y-2 max-w-xl mx-auto">
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('two-sides', 'about_sides_eyebrow', 'Eyebrow', 'Small label above section title');
          }}
          contentEditable={focusedField?.fieldId === 'about_sides_eyebrow'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_sides_eyebrow', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'about_sides_eyebrow'
              ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none'
              : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('about_sides_eyebrow', 'FOR CELEBRANTS & LISTERS')}
        </span>

        <h2
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('two-sides', 'about_sides_heading', 'Heading', 'Two sides section heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'about_sides_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('about_sides_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[28px] md:text-[34px] font-normal text-[#1a1612] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'about_sides_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          Which side of the <span className="italic text-[#8a6a36]">story</span> are you on?
        </h2>

        {/* Switcher tabs */}
        <div className="pt-3 flex justify-center items-center gap-2">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setActiveSide('celebrating');
            }}
            className={`px-4 py-2 rounded-[6px] text-xs font-medium transition cursor-pointer ${
              activeSide === 'celebrating'
                ? 'bg-[#1a1612] text-white shadow-xs'
                : 'bg-[#faf7f2] border border-[#e6dccb] text-[#5c5248] hover:text-[#1a1612]'
            }`}
          >
            <span
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('two-sides', 'about_sides_tab1', 'First tab', 'Renter side tab name');
              }}
              contentEditable={focusedField?.fieldId === 'about_sides_tab1'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_sides_tab1', e.currentTarget.textContent || '')}
              className="cursor-text"
            >
              {getVal('about_sides_tab1', 'Celebrating')}
            </span>
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setActiveSide('earning');
            }}
            className={`px-4 py-2 rounded-[6px] text-xs font-medium transition cursor-pointer ${
              activeSide === 'earning'
                ? 'bg-[#1a1612] text-white shadow-xs'
                : 'bg-[#faf7f2] border border-[#e6dccb] text-[#5c5248] hover:text-[#1a1612]'
            }`}
          >
            <span
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('two-sides', 'about_sides_tab2', 'Second tab', 'Lister side tab name');
              }}
              contentEditable={focusedField?.fieldId === 'about_sides_tab2'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_sides_tab2', e.currentTarget.textContent || '')}
              className="cursor-text"
            >
              {getVal('about_sides_tab2', 'Letting your piece earn')}
            </span>
          </button>
        </div>
      </div>

      {/* Active Side Card Content */}
      <div className="max-w-xl mx-auto p-6 bg-[#faf7f2] rounded-[8px] border border-[#f0ebe3] space-y-3">
        {activeSide === 'celebrating' ? (
          <div>
            <h3
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('two-sides', 'about_side1_heading', 'Heading', 'Celebrating heading', true);
              }}
              contentEditable={focusedField?.fieldId === 'about_side1_heading'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_side1_heading', e.currentTarget.textContent || '')}
              className={`font-serif italic text-[22px] text-[#8a6a36] cursor-text p-1 rounded inline-block ${
                focusedField?.fieldId === 'about_side1_heading' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
              }`}
            >
              {getVal('about_side1_heading', 'The lehenga you wear for the night, not forever')}
            </h3>
            <p
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('two-sides', 'about_side1_body', 'Body', 'Celebrating body explanation');
              }}
              contentEditable={focusedField?.fieldId === 'about_side1_body'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_side1_body', e.currentTarget.textContent || '')}
              className={`text-xs text-[#5c5248] leading-relaxed cursor-text p-1 rounded mt-2 ${
                focusedField?.fieldId === 'about_side1_body' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
              }`}
            >
              {getVal(
                'about_side1_body',
                'Wear pristine couture by Sabyasachi, Manish Malhotra, and Seema Gujral at a fraction of retail. Dry cleaning and fitting adjustments are handled completely by our atelier.'
              )}
            </p>
          </div>
        ) : (
          <div>
            <h3
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('two-sides', 'about_side2_heading', 'Heading', 'Lister side heading', true);
              }}
              contentEditable={focusedField?.fieldId === 'about_side2_heading'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_side2_heading', e.currentTarget.textContent || '')}
              className={`font-serif italic text-[22px] text-[#8a6a36] cursor-text p-1 rounded inline-block ${
                focusedField?.fieldId === 'about_side2_heading' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
              }`}
            >
              {getVal('about_side2_heading', 'Let your treasured pieces earn from your closet')}
            </h3>
            <p
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('two-sides', 'about_side2_body', 'Body', 'Lister side body explanation');
              }}
              contentEditable={focusedField?.fieldId === 'about_side2_body'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_side2_body', e.currentTarget.textContent || '')}
              className={`text-xs text-[#5c5248] leading-relaxed cursor-text p-1 rounded mt-2 ${
                focusedField?.fieldId === 'about_side2_body' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
              }`}
            >
              {getVal(
                'about_side2_body',
                'Your designer wardrobe can generate predictable passive income while remaining in museum condition. We photograph, store, and look after every wear.'
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutPaperTwoSides;
