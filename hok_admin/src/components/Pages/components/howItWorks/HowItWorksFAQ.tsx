/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksFAQ (Spec §7.4, §8.7 Part 08, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface HowItWorksFAQProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onOpenAnswersView?: () => void;
  isHidden?: boolean;
}

const FAQS = [
  {
    q: 'What sizes are available? How do I know it will fit?',
    a: 'Every listing shows actual garment measurements, not just a label size. Many Indian occasion wear pieces have blouse allowances or lehenga adjustability that we detail in the listing. Sizing is the question we take most seriously.'
  },
  {
    q: 'How far in advance should I book a rental?',
    a: 'We recommend at least 7 to 10 days before your event for comfortable delivery logistics. During peak wedding season, booking 3 to 4 weeks ahead is advisable for the most in-demand pieces.'
  },
  {
    q: 'Can the same piece be listed for both rental and resale?',
    a: 'Yes. House of Kaira supports dual-mode listings: a single piece can be available for both rental and preloved sale simultaneously. If a sale completes, rental availability is automatically removed.'
  },
  {
    q: 'How do I know a preloved piece is authentic?',
    a: 'Every preloved listing is reviewed by our Indore atelier curation team before going live. Listers provide provenance where available: original receipts, care labels, or designer certificates.'
  },
  {
    q: 'When and how do I receive my payout as a lister?',
    a: 'Payouts are processed 3 working days after a rental piece is safely returned and assessed, or after a preloved buyer completes their 24-hour inspection window.'
  },
  {
    q: 'What happens if a rental piece is damaged?',
    a: 'Minor normal wear such as loose threads or minor hem dust is covered by our complimentary care. For significant tears or fabric staining, repair costs are deducted transparently from the security deposit.'
  }
];

export const HowItWorksFAQ: React.FC<HowItWorksFAQProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onOpenAnswersView,
  isHidden = false
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isSelected = activePartId === 'faq';

  return (
    <section
      id="faq"
      onClick={() => onSelectPart('faq')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-12 space-y-8 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            FAQ · hidden on the page
          </span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2 max-w-xl mx-auto text-center">
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('faq', 'hiw_faq_eyebrow', 'Eyebrow', 'FAQ section eyebrow');
          }}
          contentEditable={focusedField?.fieldId === 'hiw_faq_eyebrow'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_faq_eyebrow', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'hiw_faq_eyebrow'
              ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none'
              : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('hiw_faq_eyebrow', 'COMMON QUESTIONS')}
        </span>

        <h2
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('faq', 'hiw_faq_heading', 'Heading', 'FAQ section heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'hiw_faq_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_faq_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[28px] md:text-[34px] font-normal text-[#1a1612] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'hiw_faq_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          Questions you <span className="italic text-[#8a6a36]">probably have</span>
        </h2>
      </div>

      {/* Accordion Questions List (Spec §8.7 Part 08) */}
      <div className="max-w-2xl mx-auto space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-[8px] border border-[#e6dccb] bg-[#faf7f2] overflow-hidden"
            >
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setOpenIndex(isOpen ? null : idx);
                }}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-serif text-[15px] md:text-[16px] text-[#1a1612] hover:text-[#8a6a36] transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-xs text-[#8a7f73] shrink-0 font-mono">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-xs text-[#5c5248] leading-relaxed border-t border-[#f0ebe3] bg-white">
                  <p>{faq.a}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#8a7f73]">
                    <span>Linked from Help & FAQs</span>
                    {onOpenAnswersView && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onOpenAnswersView();
                        }}
                        className="text-[#8a6a36] hover:underline cursor-pointer"
                      >
                        Edit in Answers →
                      </button>
                    )}
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

export default HowItWorksFAQ;
