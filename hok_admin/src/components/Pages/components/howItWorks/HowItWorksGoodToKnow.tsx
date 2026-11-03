/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksGoodToKnow (Spec §7.4, §8.7 Part 07, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface HowItWorksGoodToKnowProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToPage?: (slug: string) => void;
  isHidden?: boolean;
}

const POLICY_CARDS = [
  {
    id: 'deposits',
    title: 'Deposits & Refunds',
    link: 'Deposit Policy →',
    slug: '/deposit-policy',
    body: 'A refundable security deposit is charged at rental checkout. Once the piece is returned and inspected, your deposit is refunded within 3 working days.'
  },
  {
    id: 'care',
    title: 'Care & Cleaning',
    link: 'Care, Cleaning & Damage Policy →',
    slug: '/care-cleaning-damage',
    body: 'All rental pieces are professionally dry cleaned before dispatch. After your event, return the piece in its original packaging: post-rental cleaning is managed entirely by HOK.'
  },
  {
    id: 'disclosure',
    title: 'Honest Disclosure',
    link: 'Seller Guidelines →',
    slug: '/seller-guidelines',
    body: 'Every preloved listing requires a mandatory Honest Disclosure block: condition, wear count, alterations, and any repairs. You always know exactly what you are acquiring.'
  },
  {
    id: 'sizing',
    title: 'Fitting & Measurements',
    link: 'Size & Measurement Guide →',
    slug: '/size-guide',
    body: 'Every piece displays exact garment dimensions, not just vanity sizes. Blouse seam allowances and lehenga waistband margins are documented in full detail.'
  },
  {
    id: 'auth',
    title: 'Authenticity Guarantee',
    link: 'Terms & Conditions →',
    slug: '/terms',
    body: 'Every silhouette passes physical verification by our master craftsmen in Indore before dispatch. Zero counterfeit tolerance across rentals and preloved.'
  },
  {
    id: 'logistics',
    title: 'Nationwide Delivery',
    link: 'Shipping & Delivery Policy →',
    slug: '/shipping-delivery',
    body: 'Complimentary insured shipping on orders of ₹5,000 or more across India. Pre-paid tamper-evident return packaging included with every booking.'
  }
];

export const HowItWorksGoodToKnow: React.FC<HowItWorksGoodToKnowProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onNavigateToPage,
  isHidden = false
}) => {
  const isSelected = activePartId === 'good-to-know';

  return (
    <section
      id="good-to-know"
      onClick={() => onSelectPart('good-to-know')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-12 space-y-8 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            Good to Know · hidden on the page
          </span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2 max-w-xl mx-auto text-center">
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('good-to-know', 'hiw_gtk_eyebrow', 'Eyebrow', 'Good to know eyebrow');
          }}
          contentEditable={focusedField?.fieldId === 'hiw_gtk_eyebrow'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_gtk_eyebrow', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'hiw_gtk_eyebrow'
              ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none'
              : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('hiw_gtk_eyebrow', 'GOOD TO KNOW')}
        </span>

        <h2
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('good-to-know', 'hiw_gtk_heading', 'Heading', 'Good to know heading', true);
          }}
          contentEditable={focusedField?.fieldId === 'hiw_gtk_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_gtk_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[28px] md:text-[34px] font-normal text-[#1a1612] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'hiw_gtk_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          Everything in <span className="italic text-[#8a6a36]">plain sight</span>
        </h2>

        <p
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('good-to-know', 'hiw_gtk_lead', 'Line under the heading', 'Good to know lead');
          }}
          contentEditable={focusedField?.fieldId === 'hiw_gtk_lead'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_gtk_lead', e.currentTarget.textContent || '')}
          className={`text-xs text-[#73675a] leading-relaxed cursor-text p-1 rounded ${
            focusedField?.fieldId === 'hiw_gtk_lead' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal(
            'hiw_gtk_lead',
            'No hidden terms, no complicated clauses. Here is how we look after you.'
          )}
        </p>
      </div>

      {/* 6 Cards Grid (Spec §8.7 Part 07) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {POLICY_CARDS.map((card, idx) => (
          <div
            key={card.id}
            className="p-6 rounded-[8px] bg-[#faf7f2] border border-[#f0ebe3] space-y-3 flex flex-col justify-between hover:border-[#bda67b] transition-colors"
          >
            <div className="space-y-2">
              <h3
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('good-to-know', `hiw_card_${idx}_title`, 'Title', `Policy card ${idx + 1} title`);
                }}
                contentEditable={focusedField?.fieldId === `hiw_card_${idx}_title`}
                suppressContentEditableWarning
                onInput={e => onFieldChange(`hiw_card_${idx}_title`, e.currentTarget.textContent || '')}
                className="font-serif text-[18px] text-[#1a1612] cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#bda67b]/30"
              >
                {getVal(`hiw_card_${idx}_title`, card.title)}
              </h3>

              <p
                onClick={e => {
                  e.stopPropagation();
                  onFieldFocus('good-to-know', `hiw_card_${idx}_body`, 'Body', `Policy card ${idx + 1} description`);
                }}
                contentEditable={focusedField?.fieldId === `hiw_card_${idx}_body`}
                suppressContentEditableWarning
                onInput={e => onFieldChange(`hiw_card_${idx}_body`, e.currentTarget.textContent || '')}
                className="text-xs text-[#5c5248] leading-relaxed cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#bda67b]/30"
              >
                {getVal(`hiw_card_${idx}_body`, card.body)}
              </p>
            </div>

            <div className="pt-2 border-t border-[#ebe5dc]">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onNavigateToPage?.(card.slug);
                }}
                className="text-xs font-semibold text-[#8a6a36] hover:underline cursor-pointer"
              >
                {card.link}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksGoodToKnow;
