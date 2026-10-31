/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaperFromFounder (Spec §7.4, §8.6 Part 06, Screen 44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface AboutPaperFromFounderProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  isHidden?: boolean;
}

export const AboutPaperFromFounder: React.FC<AboutPaperFromFounderProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  isHidden = false
}) => {
  const isSelected = activePartId === 'from-the-founder';

  return (
    <section
      id="from-the-founder"
      onClick={() => onSelectPart('from-the-founder')}
      className={`mt-10 relative rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-12 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 ring-1 ring-dashed ring-[#b85c38]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#f5d77f] bg-[#2b241b] border border-[#b85c38] px-2.5 py-0.5 rounded-full">
            From The Founder · hidden on the page
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Founder Initials Circle / Portrait */}
        <div className="shrink-0 flex flex-col items-center text-center space-y-2">
          <div
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('from-the-founder', 'about_founder_initials', 'Initials', 'Initials shown until there is a portrait');
            }}
            contentEditable={focusedField?.fieldId === 'about_founder_initials'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_founder_initials', e.currentTarget.textContent || '')}
            className={`w-20 h-20 rounded-full border-2 border-[#d4af37]/60 flex items-center justify-center bg-[#2b241b] text-[#f5d77f] font-serif text-[32px] italic cursor-text ${
              focusedField?.fieldId === 'about_founder_initials' ? 'ring-2 ring-[#d4af37]' : ''
            }`}
          >
            {getVal('about_founder_initials', 'S')}
          </div>
          <div>
            <div
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('from-the-founder', 'about_founder_name', 'Name', 'Founder full name');
              }}
              contentEditable={focusedField?.fieldId === 'about_founder_name'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_founder_name', e.currentTarget.textContent || '')}
              className="font-serif text-[15px] text-[#f7f2ea] cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#d4af37]/30"
            >
              {getVal('about_founder_name', 'Soumya Agrawal')}
            </div>
            <div
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('from-the-founder', 'about_founder_role', 'Role', 'Founder title or role');
              }}
              contentEditable={focusedField?.fieldId === 'about_founder_role'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_founder_role', e.currentTarget.textContent || '')}
              className="text-[11px] text-[#a89d8d] cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#d4af37]/30"
            >
              {getVal('about_founder_role', 'Founder, House of Kaira')}
            </div>
          </div>
        </div>

        {/* Right: The Letter */}
        <div className="space-y-4 max-w-xl text-xs text-[#dcd4c7] leading-relaxed">
          <div>
            <span
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('from-the-founder', 'about_founder_eyebrow', 'Eyebrow', 'Founder section eyebrow');
              }}
              contentEditable={focusedField?.fieldId === 'about_founder_eyebrow'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_founder_eyebrow', e.currentTarget.textContent || '')}
              className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
                focusedField?.fieldId === 'about_founder_eyebrow'
                  ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-[#f5d77f] outline-none'
                  : 'text-[#d4af37] hover:ring-1 hover:ring-[#d4af37]/40'
              }`}
            >
              {getVal('about_founder_eyebrow', 'FROM THE FOUNDER')}
            </span>

            <h2
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('from-the-founder', 'about_founder_heading', 'Heading', 'Letter heading', true);
              }}
              contentEditable={focusedField?.fieldId === 'about_founder_heading'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('about_founder_heading', e.currentTarget.textContent || '')}
              className={`font-serif text-[24px] md:text-[28px] font-normal text-[#f7f2ea] mt-1 cursor-text p-1 rounded ${
                focusedField?.fieldId === 'about_founder_heading'
                  ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none'
                  : 'hover:ring-1 hover:ring-[#d4af37]/40'
              }`}
            >
              {getVal('about_founder_heading', 'Who founded House of Kaira')}
            </h2>
          </div>

          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('from-the-founder', 'about_founder_p1', 'Paragraph 1', 'First paragraph of letter');
            }}
            contentEditable={focusedField?.fieldId === 'about_founder_p1'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_founder_p1', e.currentTarget.textContent || '')}
            className="cursor-text p-1 rounded hover:ring-1 hover:ring-[#d4af37]/30"
          >
            {getVal(
              'about_founder_p1',
              'I started House of Kaira because Indian weddings and celebrations are magnificent, but the closets they leave behind are quiet. Masterpieces created by generational artisans sit in dark garment bags after being worn for five hours.'
            )}
          </p>

          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('from-the-founder', 'about_founder_p2', 'Paragraph 2', 'Second paragraph of letter');
            }}
            contentEditable={focusedField?.fieldId === 'about_founder_p2'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_founder_p2', e.currentTarget.textContent || '')}
            className="cursor-text p-1 rounded hover:ring-1 hover:ring-[#d4af37]/30"
          >
            {getVal(
              'about_founder_p2',
              'Our mission is simple: keep great craft in motion. When someone rents a piece from us, it brings delight to their occasion. When a lister trusts us with their wardrobe, it turns a sleeping asset into an enduring celebration.'
            )}
          </p>

          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('from-the-founder', 'about_founder_p3', 'Paragraph 3', 'Third paragraph of letter');
            }}
            contentEditable={focusedField?.fieldId === 'about_founder_p3'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_founder_p3', e.currentTarget.textContent || '')}
            className="cursor-text p-1 rounded hover:ring-1 hover:ring-[#d4af37]/30"
          >
            {getVal(
              'about_founder_p3',
              'Every silhouette we curate receives meticulous care at our Indore atelier. Thank you for belonging to our circle of circular luxury.'
            )}
          </p>

          <div
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('from-the-founder', 'about_founder_sig', 'Signature line', 'Closing signature');
            }}
            contentEditable={focusedField?.fieldId === 'about_founder_sig'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('about_founder_sig', e.currentTarget.textContent || '')}
            className="pt-2 font-serif italic text-sm text-[#f5d77f] cursor-text p-1 rounded hover:ring-1 hover:ring-[#d4af37]/30"
          >
            {getVal('about_founder_sig', 'Soumya')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPaperFromFounder;
