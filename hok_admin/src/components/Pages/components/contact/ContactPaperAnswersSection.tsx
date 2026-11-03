/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaperAnswersSection (Spec §7.4, §8.5 Part 04, Screen 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface ContactPaperAnswersSectionProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

const ANSWER_PAGES = [
  {
    id: 'faq',
    name: 'Help & FAQs',
    defaultDesc: 'Every question, from choosing your size to sending a piece back.',
    slug: '/faqs'
  },
  {
    id: 'shipping',
    name: 'Shipping & Delivery Policy',
    defaultDesc: 'How your piece reaches you, and how a rental comes back to us.',
    slug: '/shipping-delivery'
  },
  {
    id: 'deposit',
    name: 'Deposit Policy',
    defaultDesc: 'When it is paid, how it is held, and when it comes back to you.',
    slug: '/deposit-policy'
  },
  {
    id: 'care',
    name: 'Care, Cleaning & Damage Policy',
    defaultDesc: 'Looking after a piece, and what happens if something goes wrong.',
    slug: '/care-damage'
  },
  {
    id: 'refund',
    name: 'Refund & Cancellation Policy',
    defaultDesc: 'Changing your dates, cancelling, and how refunds work.',
    slug: '/refunds'
  },
  {
    id: 'seller',
    name: 'Seller Guidelines',
    defaultDesc: 'Listing a piece with us, from pricing and payouts to how it is protected.',
    slug: '/seller-guidelines'
  }
];

export const ContactPaperAnswersSection: React.FC<ContactPaperAnswersSectionProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onNavigateToPage
}) => {
  const isSelected = activePartId === 'answers-any-time';

  return (
    <section
      id="answers-any-time"
      onClick={() => onSelectPart('answers-any-time')}
      className={`mt-12 pt-8 border-t border-[#f0ebe3] space-y-5 transition-all cursor-pointer ${
        isSelected ? 'ring-1 ring-[#bda67b] p-3 -m-3 rounded-[8px]' : ''
      }`}
    >
      <div>
        <h3
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('answers-any-time', 'contact_answers_heading', 'Heading', 'Answers section heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'contact_answers_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_answers_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[24px] text-[#1a1612] cursor-text p-0.5 rounded inline-block ${
            focusedField?.fieldId === 'contact_answers_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_answers_heading', 'Answers, any time')}
        </h3>

        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('answers-any-time', 'contact_answers_sub', 'Line under heading', 'Explains that questions are answered on these pages');
          }}
          contentEditable={focusedField?.fieldId === 'contact_answers_sub'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('contact_answers_sub', e.currentTarget.textContent || '')}
          className={`mt-1 text-xs text-[#73675a] cursor-text p-0.5 rounded ${
            focusedField?.fieldId === 'contact_answers_sub' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#1a1612] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          {getVal('contact_answers_sub', 'Most questions are answered on these pages, ready whenever you are.')}
        </p>
      </div>

      <div className="space-y-4">
        {ANSWER_PAGES.map(page => (
          <div
            key={page.slug}
            className="group py-2 border-b border-[#f4ede2] flex flex-col md:flex-row md:items-baseline justify-between gap-1 hover:bg-[#fbf9f5] px-2 -mx-2 rounded transition-colors"
          >
            <div
              onClick={e => {
                e.stopPropagation();
                onNavigateToPage?.(page.slug);
              }}
              className="font-serif text-[16px] text-[#1a1612] group-hover:text-[#8a6a36] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{page.name}</span>
              <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity text-[#8a6a36]">↗</span>
            </div>

            <div
              onClick={e => {
                e.stopPropagation();
                onFieldFocus('answers-any-time', `contact_page_desc_${page.id}`, `${page.name} description`, 'Summary line on Contact Us');
              }}
              contentEditable={focusedField?.fieldId === `contact_page_desc_${page.id}`}
              suppressContentEditableWarning
              onInput={e => onFieldChange(`contact_page_desc_${page.id}`, e.currentTarget.textContent || '')}
              className={`text-xs text-[#73675a] md:text-right cursor-text p-0.5 rounded ${
                focusedField?.fieldId === `contact_page_desc_${page.id}`
                  ? 'ring-1 ring-[#bda67b] bg-white text-[#1a1612] outline-none'
                  : 'hover:ring-1 hover:ring-[#bda67b]/30'
              }`}
            >
              {getVal(`contact_page_desc_${page.id}`, page.defaultDesc)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactPaperAnswersSection;
