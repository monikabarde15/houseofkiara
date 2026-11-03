/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperArrivalNote (Spec §7.4, §8.5 Part 07, Screen 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface ContactPaperArrivalNoteProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const ContactPaperArrivalNote: React.FC<ContactPaperArrivalNoteProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure,
  onNavigateToPage
}) => {
  const isSelected = activePartId === 'just-arrived';

  return (
    <section
      id="just-arrived"
      onClick={() => onSelectPart('just-arrived')}
      className={`mt-10 rounded-[8px] border border-[#e6dccb] bg-[#faf7f2]/60 p-6 space-y-2 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-[#bda67b] bg-[#fffdfa]' : 'hover:bg-[#faf7f2]'
      }`}
    >
      <h4
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('just-arrived', 'contact_arrival_heading', 'Heading', 'Just arrived card title', true);
        }}
        contentEditable={focusedField?.fieldId === 'contact_arrival_heading'}
        suppressContentEditableWarning
        onInput={e => onFieldChange('contact_arrival_heading', e.currentTarget.textContent || '')}
        className={`font-serif text-[18px] text-[#1a1612] cursor-text p-0.5 rounded inline-block ${
          focusedField?.fieldId === 'contact_arrival_heading' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
        }`}
      >
        {getVal('contact_arrival_heading', "Has a piece just arrived, and something isn’t right?")}
      </h4>

      <p className="text-xs text-[#5c5248] leading-relaxed">
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('just-arrived', 'contact_arrival_lead_before', 'Line before window token', 'Instruction text');
          }}
          contentEditable={focusedField?.fieldId === 'contact_arrival_lead_before'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_arrival_lead_before', e.currentTarget.textContent || '')}
          className={`cursor-text p-0.5 rounded ${
            focusedField?.fieldId === 'contact_arrival_lead_before' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('contact_arrival_lead_before', 'Please tell us within ')}
        </span>
        <span
          onClick={e => {
            e.stopPropagation();
            onSelectFigure?.('issue_window');
          }}
          className="px-1.5 py-0.5 rounded bg-white border border-[#bda67b]/50 text-[#8a6a36] font-mono text-[11px] cursor-pointer"
        >
          24 hours
        </span>{' '}
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('just-arrived', 'contact_arrival_lead_after', 'Line after window token', 'Instruction text');
          }}
          contentEditable={focusedField?.fieldId === 'contact_arrival_lead_after'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_arrival_lead_after', e.currentTarget.textContent || '')}
          className={`cursor-text p-0.5 rounded ${
            focusedField?.fieldId === 'contact_arrival_lead_after' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('contact_arrival_lead_after', 'of delivery, with photographs, so we can put it right.')}
        </span>
      </p>

      <div className="pt-1">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onNavigateToPage?.('/refunds');
          }}
          className="text-xs text-[#1a1612] underline hover:text-[#8a6a36] cursor-pointer font-medium"
        >
          What happens next
        </button>
      </div>
    </section>
  );
};

export default ContactPaperArrivalNote;
