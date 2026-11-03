/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsQuestionsBand (Spec §8.9 Part 07, Page 37)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface TermsQuestionsBandProps extends EditableFieldProps {
  hidden?: boolean;
}

export const TermsQuestionsBand: React.FC<TermsQuestionsBandProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  highlightedFigureKey,
  onSelectFigure,
  hidden
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  return (
    <section
      id="questions"
      className={`p-8 md:p-10 bg-[#1a1612] text-white rounded-[10px] border border-[#2b241c] space-y-6 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      <div>
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'terms_q_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker for questions band' })}
          onBlur={e => onFieldChange?.('terms_q_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] tracking-[0.2em] uppercase text-[#c5ad7d] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('terms_q_eyebrow', 'QUESTIONS & CONCERNS')}
        </span>
        <h2
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'terms_q_heading', fieldName: 'Heading', helpText: 'Headline for questions band' })}
          onBlur={e => onFieldChange?.('terms_q_heading', e.currentTarget.textContent || '')}
          className="font-serif text-2xl md:text-3xl text-[#faf7f2] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('terms_q_heading', 'We are here to help clarify any term.')}
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'terms_q_lead', fieldName: 'Paragraph', helpText: 'Description in questions band' })}
          onBlur={e => onFieldChange?.('terms_q_lead', e.currentTarget.textContent || '')}
          className="text-xs md:text-sm text-[#c7beaf] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('terms_q_lead', 'If you have questions about your rental, deposit, or listing obligations, reach our team directly.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* WhatsApp Button */}
        <div className="p-4 bg-[#241e18] border border-[#382f25] rounded-[6px] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#8a7f73] uppercase tracking-wider font-mono">WhatsApp Concierge</div>
            <div
              onClick={() => onSelectFigure?.('support_whatsapp')}
              className={`font-serif text-base text-[#c5ad7d] cursor-pointer px-1 rounded ${
                highlightedFigureKey === 'support_whatsapp' ? 'ring-2 ring-[#c5ad7d] bg-[#332b21]' : 'hover:bg-[#332b21]'
              }`}
            >
              +91 93401 39300
            </div>
            <div className="text-[11px] text-[#c7beaf]">Usually replies within 2 hours</div>
          </div>
          <span className="text-[#c5ad7d] text-lg font-mono">→</span>
        </div>

        {/* Email Button */}
        <div className="p-4 bg-[#241e18] border border-[#382f25] rounded-[6px] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#8a7f73] uppercase tracking-wider font-mono">Grievance & Support Email</div>
            <div
              onClick={() => onSelectFigure?.('support_email')}
              className={`font-serif text-base text-[#c5ad7d] cursor-pointer px-1 rounded ${
                highlightedFigureKey === 'support_email' ? 'ring-2 ring-[#c5ad7d] bg-[#332b21]' : 'hover:bg-[#332b21]'
              }`}
            >
              hello@houseofkaira.com
            </div>
            <div className="text-[11px] text-[#c7beaf]">Official communication within 24 hours</div>
          </div>
          <span className="text-[#c5ad7d] text-lg font-mono">→</span>
        </div>
      </div>
    </section>
  );
};

export default TermsQuestionsBand;
