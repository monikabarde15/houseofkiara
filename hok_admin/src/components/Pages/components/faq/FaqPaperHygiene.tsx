/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FaqPaperHygiene (Spec §8.4, Screen 40)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface FaqPaperHygieneProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onOpenQuestionView?: (questionId: string) => void;
}

export const FaqPaperHygiene: React.FC<FaqPaperHygieneProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onOpenQuestionView
}) => {
  return (
    <section
      id="hygiene-promise"
      onClick={() => onSelectPart('hygiene-promise')}
      className={`relative mt-10 max-w-[760px] mx-auto bg-white border border-[#ece4d8] rounded-[6px] p-6 text-left shadow-2xs transition-colors ${
        activePartId === 'hygiene-promise' ? 'ring-1 ring-[#bda67b]/50' : 'hover:border-[#bda67b]'
      }`}
    >
      <div className="text-[10px] tracking-[0.2em] font-medium text-[#c5a86d] uppercase mb-1">
        OUR HYGIENE PROMISE
      </div>

      <h3
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('hygiene-promise', 'faq_hygiene_heading', 'Hygiene Heading', 'The main heading for our hygiene promise.');
        }}
        className={`font-serif text-[28px] text-[#1a1612] leading-tight mb-2 p-1 rounded transition-all cursor-pointer ${
          focusedField?.fieldId === 'faq_hygiene_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2]' : ''
        }`}
      >
        {getVal('faq_hygiene_heading', 'Every piece, cleaned and inspected by hand')}
      </h3>

      <p
        onClick={e => {
          e.stopPropagation();
          onFieldFocus('hygiene-promise', 'faq_hygiene_body', 'Hygiene Promise Text', 'Description of dry-cleaning and inspection commitment.');
        }}
        className={`text-[13px] text-[#6e6358] leading-relaxed mb-4 p-1 rounded transition-all cursor-pointer ${
          focusedField?.fieldId === 'faq_hygiene_body' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2]' : ''
        }`}
      >
        {getVal(
          'faq_hygiene_body',
          'Every rental is dry-cleaned before it arrives and again when it returns. If anything is not as fresh as you expect, we put it right.'
        )}
      </p>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onOpenQuestionView?.('hygiene');
        }}
        className="inline-flex items-center px-4 py-2 border border-[#d9ccb6] rounded-[4px] text-xs font-medium text-[#1a1612] hover:bg-[#faf7f2] transition-colors cursor-pointer"
      >
        {getVal('faq_hygiene_button', 'How we care for pieces')}
      </button>
    </section>
  );
};

export default FaqPaperHygiene;
