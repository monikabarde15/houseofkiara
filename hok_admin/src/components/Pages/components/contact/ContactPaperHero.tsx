/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperHero (Spec §7.4, §8.5 Part 01, Screen 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface ContactPaperHeroProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
}

export const ContactPaperHero: React.FC<ContactPaperHeroProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange
}) => {
  const isSelected = activePartId === 'hero';

  return (
    <section
      id="hero"
      onClick={() => onSelectPart('hero')}
      className={`rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-10 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'
      }`}
    >
      <div className="max-w-2xl space-y-3">
        {/* Eyebrow */}
        <div>
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'contact_eyebrow', 'Eyebrow', 'Small label above main heading');
            }}
            contentEditable={focusedField?.fieldId === 'contact_eyebrow'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_eyebrow', e.currentTarget.textContent || '')}
            className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'contact_eyebrow'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-[#f5d77f] outline-none'
                : 'text-[#d4af37] hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            {getVal('contact_eyebrow', 'CONTACT US')}
          </span>
        </div>

        {/* Heading */}
        <div>
          <h1
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'contact_heading', 'Heading', 'Main hero heading on Contact Us', true);
            }}
            contentEditable={focusedField?.fieldId === 'contact_heading'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_heading', e.currentTarget.textContent || '')}
            className={`font-serif text-[28px] md:text-[34px] font-normal leading-tight text-[#f7f2ea] cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'contact_heading'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none'
                : 'hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            {getVal('contact_heading', 'We’d love to hear from you')}
          </h1>
        </div>

        {/* Lead line */}
        <div>
          <p
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('hero', 'contact_lead', 'Line under the heading', 'Explains who is on hand in Indore to help');
            }}
            contentEditable={focusedField?.fieldId === 'contact_lead'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('contact_lead', e.currentTarget.textContent || '')}
            className={`text-[13px] md:text-sm text-[#dcd4c7] leading-relaxed cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'contact_lead'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none'
                : 'hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            {getVal(
              'contact_lead',
              'Whether you are choosing a piece for a celebration, wearing one now, or thinking of listing your own, our team in Indore is here to help, personally.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactPaperHero;
