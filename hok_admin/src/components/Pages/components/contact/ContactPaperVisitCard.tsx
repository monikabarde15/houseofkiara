/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperVisitCard (Spec §7.4, §8.5 Part 06, Screen 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface ContactPaperVisitCardProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure?: (figureKey: string) => void;
  onOpenCheck?: () => void;
}

export const ContactPaperVisitCard: React.FC<ContactPaperVisitCardProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure,
  onOpenCheck
}) => {
  const isSelected = activePartId === 'visit-us';

  return (
    <section
      id="visit-us"
      onClick={() => onSelectPart('visit-us')}
      className={`mt-12 relative rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-9 shadow-md transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'
      }`}
    >
      {/* Margin indicator for check (Spec §7.5, Screen 42) */}
      <div
        onClick={e => {
          e.stopPropagation();
          onOpenCheck?.();
        }}
        title="1 check to look at: Where visits happen figure waiting for a decision"
        className="absolute -right-11 md:-right-14 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#d19a3c] ring-4 ring-[#f7f2ea] shadow-xs cursor-pointer hover:scale-125 transition-transform"
      />

      <div className="max-w-xl space-y-3">
        <h3
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('visit-us', 'contact_visit_heading', 'Heading', 'Visit card heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'contact_visit_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_visit_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[24px] text-[#f7f2ea] cursor-text p-0.5 rounded inline-block ${
            focusedField?.fieldId === 'contact_visit_heading' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/40'
          }`}
        >
          {getVal('contact_visit_heading', 'Visit us in Indore')}
        </h3>

        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('visit-us', 'contact_visit_lead', 'Line under heading', 'Explains visits by appointment');
          }}
          contentEditable={focusedField?.fieldId === 'contact_visit_lead'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_visit_lead', e.currentTarget.textContent || '')}
          className={`text-xs text-[#dcd4c7] leading-relaxed cursor-text p-0.5 rounded ${
            focusedField?.fieldId === 'contact_visit_lead' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/40'
          }`}
        >
          {getVal(
            'contact_visit_lead',
            'See pieces in person and talk through your occasion with our team. Visits are by appointment, so the pieces you’d like to see are ready and waiting for you.'
          )}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <span
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('visit_area');
            }}
            className="px-2.5 py-1 rounded bg-[#2b241b] border border-dashed border-[#d4af37] text-[#f5d77f] font-mono text-xs cursor-pointer hover:bg-[#382f23] transition-colors"
          >
            Old Palasiya, Indore
          </span>

          <span className="text-[10px] font-semibold tracking-wider text-[#a89d8d] uppercase px-2 py-0.5 rounded border border-[#4a3f33]">
            BY APPOINTMENT
          </span>
        </div>

        <div className="pt-3">
          <button
            type="button"
            className="px-5 py-2 rounded-[4px] bg-[#2a241d] border border-[#d4af37]/60 text-xs font-semibold text-[#f5d77f] hover:bg-[#342c23] transition cursor-pointer"
          >
            BOOK A VISIT
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactPaperVisitCard;
