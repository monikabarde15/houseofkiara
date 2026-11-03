/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperWhyWeBuiltIt (Spec §7.4, §8.6 Part 07, Screen 44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperWhyWeBuiltItProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  showMark?: boolean;
  isHidden?: boolean;
}

export const AboutPaperWhyWeBuiltIt: React.FC<AboutPaperWhyWeBuiltItProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  showMark = true,
  isHidden = false
}) => {
  const isSelected = activePartId === 'why-we-built-it';

  return (
    <section
      id="why-we-built-it"
      onClick={() => onSelectPart('why-we-built-it')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-12 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            Why We Built It · hidden on the page
          </span>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Left: Circular Diagram / Mark (Spec §8.6 Part 07) */}
        {showMark && (
          <div className="shrink-0 w-56 h-56 relative flex items-center justify-center bg-[#faf7f2] rounded-full border border-[#e6dccb]">
            <div className="absolute inset-4 rounded-full border border-dashed border-[#bda67b]/60 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#1a1612] text-[#f5d77f] font-serif text-sm font-semibold flex items-center justify-center shadow-xs">
                HOK
              </div>
            </div>
            {/* Orbit nodes */}
            <div className="absolute top-2 text-[10.5px] font-semibold text-[#8a6a36] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#bda67b]/50 shadow-2xs">
              Rent
            </div>
            <div className="absolute bottom-2 text-[10.5px] font-semibold text-[#8a6a36] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#bda67b]/50 shadow-2xs">
              Return & Care
            </div>
            <div className="absolute right-2 text-[10.5px] font-semibold text-[#8a6a36] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#bda67b]/50 shadow-2xs">
              Wear
            </div>
          </div>
        )}

        {/* Right: Market Argument Paragraphs */}
        <div className="space-y-4 max-w-xl text-xs text-[#5c5248] leading-relaxed">
          <div>
            <span
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('why-we-built-it', 'about_orbit_eyebrow', 'Eyebrow', 'Market argument eyebrow');
              }}
              contentEditable={focusedField?.fieldId === 'about_orbit_eyebrow'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_orbit_eyebrow', e.currentTarget.textContent || '')}
              className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
                focusedField?.fieldId === 'about_orbit_eyebrow'
                  ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none'
                  : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
              }`}
            >
              {getVal('about_orbit_eyebrow', 'THE MARKET ARGUMENT')}
            </span>

            <h2
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('why-we-built-it', 'about_orbit_heading', 'Heading', 'Why we built it heading', true);
              }}
              contentEditable={focusedField?.fieldId === 'about_orbit_heading'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_orbit_heading', e.currentTarget.textContent || '')}
              className={`font-serif text-[24px] md:text-[28px] font-normal text-[#1a1612] mt-1 cursor-text p-1 rounded ${
                focusedField?.fieldId === 'about_orbit_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
              }`}
            >
              Circularity is the mechanism, <span className="italic text-[#8a6a36]">joy is the point</span>.
            </h2>
          </div>

          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('why-we-built-it', 'about_orbit_p1', 'Paragraph 1', 'First paragraph of market argument');
            }}
            contentEditable={focusedField?.fieldId === 'about_orbit_p1'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_orbit_p1', e.currentTarget.textContent || '')}
            className={`cursor-text p-1 rounded ${
              focusedField?.fieldId === 'about_orbit_p1' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#1a1612] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal(
              'about_orbit_p1',
              'In India, wedding and festive occasions demand distinction, but traditional fast rental models failed on garment hygiene, fitting accuracy, and designer respect.'
            )}
          </p>

          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('why-we-built-it', 'about_orbit_p2', 'Paragraph 2', 'Second paragraph of market argument');
            }}
            contentEditable={focusedField?.fieldId === 'about_orbit_p2'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_orbit_p2', e.currentTarget.textContent || '')}
            className={`cursor-text p-1 rounded ${
              focusedField?.fieldId === 'about_orbit_p2' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#1a1612] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal(
              'about_orbit_p2',
              'By establishing studio grade ozone sterilization, personalized tailor fitting consultation, and bank grade deposit escrows, we created the platform we wished existed for our own celebrations.'
            )}
          </p>

          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('why-we-built-it', 'about_orbit_p3', 'Paragraph 3', 'Third paragraph of market argument');
            }}
            contentEditable={focusedField?.fieldId === 'about_orbit_p3'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_orbit_p3', e.currentTarget.textContent || '')}
            className={`cursor-text p-1 rounded ${
              focusedField?.fieldId === 'about_orbit_p3' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#1a1612] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal(
              'about_orbit_p3',
              'Circularity is not a marketing afterthought for us, it is the fundamental architecture of our business. Keeping garments in circulation reduces the ecological footprint of luxury fashion while democratizing access to iconic design.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPaperWhyWeBuiltIt;
