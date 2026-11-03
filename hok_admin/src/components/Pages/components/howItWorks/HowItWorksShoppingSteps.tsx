/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksShoppingSteps (Spec §7.4, §8.7 Part 03, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface HowItWorksShoppingStepsProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  showLoopCard?: boolean;
  isHidden?: boolean;
}

const STEPS = [
  {
    num: '01',
    title: 'Browse & Discover',
    body: 'Explore our curated collection of designer pieces. Filter by occasion, designer, size, and category to find exactly what you are looking for.',
    lines: ['Filter by occasion, designer, size and category', 'Save favourites to your personal wishlist', 'Live calendar availability for rentals']
  },
  {
    num: '02',
    title: 'Choose Your Mode',
    body: 'Decide whether to rent for a special occasion or buy preloved to keep forever. Every piece shows both options transparently.',
    lines: ['Rent for 3, 5, or 7 days starting at 20% of retail', 'Buy preloved at 30% to 70% below retail', 'Clear security deposit and return terms']
  },
  {
    num: '03',
    title: 'Checkout & Confirm',
    body: 'Review your order, select delivery dates, and complete payment. For rentals, the refundable deposit is held securely until return.',
    lines: ['Secure payment processing via Razorpay', 'Rental deposit held as collateral, not revenue', 'Instant order confirmation and delivery tracking']
  },
  {
    num: '04',
    title: 'Delivered, Ready to Wear',
    body: 'Your piece arrives professionally dry cleaned and hand pressed. Ready to wear straight out of the protective garment bag.',
    lines: ['Doorstep delivery in sustainable packaging', 'Pre-paid return packaging and pickup label included', 'House of Kaira atelier handles all cleaning']
  }
];

export const HowItWorksShoppingSteps: React.FC<HowItWorksShoppingStepsProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  showLoopCard = true,
  isHidden = false
}) => {
  const isSelected = activePartId === 'shopping-steps';

  return (
    <section
      id="shopping-steps"
      onClick={() => onSelectPart('shopping-steps')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-12 space-y-8 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            Shopping steps · hidden on the page
          </span>
        </div>
      )}

      <div className="space-y-2 max-w-xl mx-auto text-center">
        <span
          onClick={e => { e.stopPropagation(); onFieldFocus('shopping-steps', 'hiw_shop_eyebrow', 'Eyebrow', 'Shopping steps eyebrow'); }}
          contentEditable={focusedField?.fieldId === 'hiw_shop_eyebrow'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_shop_eyebrow', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'hiw_shop_eyebrow' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none' : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('hiw_shop_eyebrow', 'SHOPPING')}
        </span>

        <h2
          onClick={e => { e.stopPropagation(); onFieldFocus('shopping-steps', 'hiw_shop_heading', 'Heading', 'Shopping steps heading', true); }}
          contentEditable={focusedField?.fieldId === 'hiw_shop_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_shop_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[28px] md:text-[34px] font-normal text-[#1a1612] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'hiw_shop_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          From discovery to your <span className="italic text-[#8a6a36]">doorstep</span>
        </h2>

        <p
          onClick={e => { e.stopPropagation(); onFieldFocus('shopping-steps', 'hiw_shop_lead', 'Line under the heading', 'Subtitle for shopping steps'); }}
          contentEditable={focusedField?.fieldId === 'hiw_shop_lead'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_shop_lead', e.currentTarget.textContent || '')}
          className={`text-xs text-[#73675a] leading-relaxed cursor-text p-1 rounded ${
            focusedField?.fieldId === 'hiw_shop_lead' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('hiw_shop_lead', 'Everything you need to know about finding, renting, and returning pieces you will adore.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {STEPS.map((step, idx) => (
          <div key={step.num} className="p-6 rounded-[8px] bg-[#faf7f2] border border-[#f0ebe3] space-y-3 relative hover:border-[#bda67b] transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-serif text-[20px] text-[#8a6a36] font-semibold">{step.num}</span>
              <span className="text-[10px] text-[#8a7f73] uppercase tracking-wider font-mono">Step {idx + 1}</span>
            </div>

            <h3
              onClick={e => { e.stopPropagation(); onFieldFocus('shopping-steps', `hiw_step_${idx}_title`, 'Title', `Step ${step.num} title`); }}
              contentEditable={focusedField?.fieldId === `hiw_step_${idx}_title`}
              suppressContentEditableWarning
              onInput={e => onFieldChange(`hiw_step_${idx}_title`, e.currentTarget.textContent || '')}
              className="font-serif text-[18px] text-[#1a1612] cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#bda67b]/30"
            >
              {getVal(`hiw_step_${idx}_title`, step.title)}
            </h3>

            <p
              onClick={e => { e.stopPropagation(); onFieldFocus('shopping-steps', `hiw_step_${idx}_body`, 'Body', `Step ${step.num} description`); }}
              contentEditable={focusedField?.fieldId === `hiw_step_${idx}_body`}
              suppressContentEditableWarning
              onInput={e => onFieldChange(`hiw_step_${idx}_body`, e.currentTarget.textContent || '')}
              className="text-xs text-[#5c5248] leading-relaxed cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#bda67b]/30"
            >
              {getVal(`hiw_step_${idx}_body`, step.body)}
            </p>

            <ul className="space-y-1.5 pt-2 text-[11.5px] text-[#73675a] border-t border-[#ebe5dc]">
              {step.lines.map((line, lIdx) => (
                <li key={lIdx} className="flex items-start gap-2">
                  <span className="text-[#8a6a36]">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {showLoopCard && (
        <div className="rounded-[8px] bg-[#1a1612] text-[#f7f2ea] p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#332b21]">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-[#d4af37]">∞</span>
              <span
                onClick={e => { e.stopPropagation(); onFieldFocus('shopping-steps', 'hiw_loop_kicker', 'Kicker', 'Loop card kicker'); }}
                contentEditable={focusedField?.fieldId === 'hiw_loop_kicker'}
                suppressContentEditableWarning
                onInput={e => onFieldChange('hiw_loop_kicker', e.currentTarget.textContent || '')}
                className="text-[10.5px] uppercase tracking-widest font-semibold text-[#d4af37] cursor-text p-0.5 rounded"
              >
                {getVal('hiw_loop_kicker', 'THE LOOP')}
              </span>
            </div>

            <h3
              onClick={e => { e.stopPropagation(); onFieldFocus('shopping-steps', 'hiw_loop_heading', 'Heading', 'Loop card heading'); }}
              contentEditable={focusedField?.fieldId === 'hiw_loop_heading'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_loop_heading', e.currentTarget.textContent || '')}
              className="font-serif text-[20px] text-[#f7f2ea] cursor-text p-0.5 rounded"
            >
              {getVal('hiw_loop_heading', 'Wear it, love it. Relist.')}
            </h3>

            <p
              onClick={e => { e.stopPropagation(); onFieldFocus('shopping-steps', 'hiw_loop_body', 'Body', 'Loop card body'); }}
              contentEditable={focusedField?.fieldId === 'hiw_loop_body'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_loop_body', e.currentTarget.textContent || '')}
              className="text-xs text-[#dcd4c7] leading-relaxed cursor-text p-0.5 rounded"
            >
              {getVal('hiw_loop_body', 'After your event, return rental pieces easily, or list your own pieces to keep circular luxury in motion.')}
            </p>
          </div>

          <div className="shrink-0 text-center md:text-right">
            <span className="inline-block px-4 py-2 rounded bg-[#2b241b] border border-[#d4af37]/50 text-xs font-semibold text-[#f5d77f] uppercase tracking-wider">
              Circularity in Motion
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default HowItWorksShoppingSteps;
