/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceFAQ (Spec §8.8 Part 08, Page 36)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

interface ListYourPieceFAQProps extends EditableFieldProps {
  hidden?: boolean;
  onOpenAnswersView?: () => void;
}

export const ListYourPieceFAQ: React.FC<ListYourPieceFAQProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden,
  onOpenAnswersView
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = [
    {
      q: 'How is the rental price determined?',
      a: 'We evaluate the original retail price, current condition, designer demand, and seasonality. Typically, a 4-day rental is priced between 10% and 18% of original retail value.',
      source: 'Seller Guidelines §03'
    },
    {
      q: 'What happens if a piece gets damaged or stained?',
      a: 'Minor stains and loose threads are restored by our professional care team at no cost to you. If irreparable damage occurs, you receive agreed valuation compensation under our Lister Protection guarantee.',
      source: 'Care, Cleaning & Damage Policy'
    },
    {
      q: 'Can I get my piece back whenever I want?',
      a: 'Yes. You can recall your piece permanently or block out dates for personal wear by giving 48 hours notice between active rental bookings.',
      source: 'Seller Guidelines §07'
    },
    {
      q: 'Who pays for dry cleaning and maintenance?',
      a: 'House of Kaira absorbs all standard maintenance, including eco-friendly dry cleaning and delicate steam pressing after each rental cycle.',
      source: 'Seller Guidelines §05'
    },
    {
      q: 'How and when do I get paid?',
      a: 'Payouts are processed directly to your registered bank account within 3 working days following the safe return and inspection of your garment.',
      source: 'Seller Guidelines §08'
    },
    {
      q: 'Do you accept unbranded or bespoke designer pieces?',
      a: 'Yes. Exceptional craftsmanship and premium textiles are welcome. Our curation team will review photos and provenance during initial intake.',
      source: 'Help & FAQs'
    }
  ];

  return (
    <section
      id="faq"
      className={`p-8 md:p-10 bg-white rounded-[10px] border border-[#ebe5dc] shadow-2xs space-y-6 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField?.({ fieldId: 'lyp_faq_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker for lister FAQ' })}
            onBlur={e => onFieldChange?.('lyp_faq_eyebrow', e.currentTarget.textContent || '')}
            className="text-[11px] tracking-[0.2em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
          >
            {getVal('lyp_faq_eyebrow', 'ANSWERS FOR LISTERS')}
          </span>
          <h2
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField?.({ fieldId: 'lyp_faq_heading', fieldName: 'Heading', helpText: 'Headline for FAQ' })}
            onBlur={e => onFieldChange?.('lyp_faq_heading', e.currentTarget.textContent || '')}
            className="font-serif text-2xl md:text-3xl text-[#1a1612] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
          >
            {getVal('lyp_faq_heading', 'Questions listers ask most')}
          </h2>
          <p className="text-xs text-[#5c5248] mt-1">
            Picked from Help & FAQs and the Seller Guidelines. Edited where they live.
          </p>
        </div>

        {onOpenAnswersView && (
          <button
            type="button"
            onClick={onOpenAnswersView}
            className="text-xs text-[#8a6a36] hover:underline cursor-pointer shrink-0 font-medium"
          >
            Open in Answers →
          </button>
        )}
      </div>

      <div className="divide-y divide-[#f0ebe3] border-t border-b border-[#f0ebe3]">
        {questions.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-3.5">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <span className="font-serif text-base text-[#1a1612] font-normal hover:text-[#8a6a36] transition-colors">
                  {item.q}
                </span>
                <span className="text-[#8a7f73] font-mono text-sm shrink-0">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="mt-2.5 text-xs text-[#5c5248] leading-relaxed pr-6 space-y-2">
                  <p>{item.a}</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-[#8a7f73]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8a6a36]" />
                    <span>Source: {item.source}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ListYourPieceFAQ;
