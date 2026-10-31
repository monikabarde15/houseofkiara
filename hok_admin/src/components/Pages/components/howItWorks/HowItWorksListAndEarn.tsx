/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksListAndEarn (Spec §7.4, §8.7 Part 06, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface HowItWorksListAndEarnProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToPage?: (slug: string) => void;
  onSelectFigure?: (key: string) => void;
  isHidden?: boolean;
}

const LISTER_STEPS = [
  { num: '01', title: 'Photograph & Submit', body: 'Send clear photographs and details through our simple digital intake form.', pill: 'Step 1' },
  { num: '02', title: 'Curation & Pricing', body: 'Our Indore atelier team evaluates authenticity and agrees on pricing within 24 hours.', pill: 'Step 2' },
  { num: '03', title: 'Storage & Care', body: 'We store, care for, surgically clean, and dispatch every time your piece is booked.', pill: 'Step 3' },
  { num: '04', title: 'Relax & Earn', body: 'Receive direct bank transfers every time your piece is rented or bought.', pill: 'Step 4' }
];

export const HowItWorksListAndEarn: React.FC<HowItWorksListAndEarnProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onNavigateToPage,
  onSelectFigure,
  isHidden = false
}) => {
  const isSelected = activePartId === 'list-and-earn';

  return (
    <section
      id="list-and-earn"
      onClick={() => onSelectPart('list-and-earn')}
      className={`mt-10 relative rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-12 overflow-hidden transition-all cursor-pointer ${
        isHidden ? 'opacity-50 ring-1 ring-dashed ring-[#b85c38]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'}`}
    >
      <div className="absolute right-4 bottom-2 text-[#2b241b] font-serif text-[120px] select-none pointer-events-none font-bold opacity-30 leading-none">
        Earn
      </div>

      {isHidden && (
        <div className="absolute top-4 right-5 z-10">
          <span className="text-[11px] font-medium text-[#f5d77f] bg-[#2b241b] border border-[#b85c38] px-2.5 py-0.5 rounded-full">
            List & Earn · hidden on the page
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <span
              onClick={e => { e.stopPropagation(); onFieldFocus('list-and-earn', 'hiw_earn_eyebrow', 'Eyebrow', 'List and earn eyebrow'); }}
              contentEditable={focusedField?.fieldId === 'hiw_earn_eyebrow'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_earn_eyebrow', e.currentTarget.textContent || '')}
              className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
                focusedField?.fieldId === 'hiw_earn_eyebrow' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-[#f5d77f] outline-none' : 'text-[#d4af37] hover:ring-1 hover:ring-[#d4af37]/40'
              }`}
            >
              {getVal('hiw_earn_eyebrow', 'LIST & EARN')}
            </span>

            <h2
              onClick={e => { e.stopPropagation(); onFieldFocus('list-and-earn', 'hiw_earn_heading', 'Heading', 'List and earn heading', true); }}
              contentEditable={focusedField?.fieldId === 'hiw_earn_heading'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_earn_heading', e.currentTarget.textContent || '')}
              className={`font-serif text-[28px] md:text-[34px] font-normal leading-tight text-[#f7f2ea] cursor-text p-1 rounded ${
                focusedField?.fieldId === 'hiw_earn_heading' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/30'
              }`}
            >
              Your wardrobe has been waiting <span className="italic text-[#d4af37]">for this</span>.
            </h2>

            <p
              onClick={e => { e.stopPropagation(); onFieldFocus('list-and-earn', 'hiw_earn_lead', 'Line under heading', 'List and earn lead'); }}
              contentEditable={focusedField?.fieldId === 'hiw_earn_lead'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_earn_lead', e.currentTarget.textContent || '')}
              className={`text-xs text-[#dcd4c7] leading-relaxed cursor-text p-1 rounded ${
                focusedField?.fieldId === 'hiw_earn_lead' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-white outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/30'
              }`}
            >
              {getVal('hiw_earn_lead', 'The wedding lehenga in the back of your cupboard. The bridal set that deserves another evening. Every designer piece you loved and wore once is a piece someone is searching for right now.')}
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div onClick={e => { e.stopPropagation(); onSelectFigure?.('lister_share_rental'); }} className="flex items-center justify-between p-3 rounded bg-[#241e17] border border-[#332b21] cursor-pointer hover:border-[#d4af37]">
              <div><div className="font-medium text-[#f7f2ea]">Rental listing</div><div className="text-[11px] text-[#a89d8d]">Per booking, to you</div></div>
              <span className="font-serif text-[18px] text-[#f5d77f] font-semibold">40%</span>
            </div>

            <div onClick={e => { e.stopPropagation(); onSelectFigure?.('lister_share_preloved'); }} className="flex items-center justify-between p-3 rounded bg-[#241e17] border border-[#332b21] cursor-pointer hover:border-[#d4af37]">
              <div><div className="font-medium text-[#f7f2ea]">Preloved resale</div><div className="text-[11px] text-[#a89d8d]">Of sale price, to you</div></div>
              <span className="font-serif text-[18px] text-[#f5d77f] font-semibold">75%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-[#241e17] border border-[#332b21]">
              <div><div className="font-medium text-[#f7f2ea]">Consignment care</div><div className="text-[11px] text-[#a89d8d]">Dry cleaning and storage</div></div>
              <span className="font-serif text-[18px] text-[#f5d77f] font-semibold">Included</span>
            </div>

            <div onClick={e => { e.stopPropagation(); onSelectFigure?.('payout_cycle'); }} className="flex items-center justify-between p-3 rounded bg-[#241e17] border border-[#332b21] cursor-pointer hover:border-[#d4af37]">
              <div><div className="font-medium text-[#f7f2ea]">Payout schedule</div><div className="text-[11px] text-[#a89d8d]">Bank transfer turnaround</div></div>
              <span className="font-serif text-[18px] text-[#f5d77f] font-semibold">T+3 days</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onNavigateToPage?.('/list-your-piece'); }}
              className="px-6 py-2.5 rounded-[4px] bg-[#d4af37] text-[#1a1612] text-xs font-semibold uppercase tracking-wider hover:bg-[#c29f2f] transition cursor-pointer"
            >
              START LISTING →
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#d4af37]">HOW LISTING WORKS</div>
          <div className="space-y-3">
            {LISTER_STEPS.map((step, idx) => (
              <div key={step.num} className="p-4 rounded-[8px] bg-[#241e17] border border-[#332b21] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-serif text-sm text-[#f5d77f] font-bold">{step.num}</span>
                    <h4
                      onClick={e => { e.stopPropagation(); onFieldFocus('list-and-earn', `hiw_lstep_${idx}_title`, 'Title', `Lister step ${step.num} title`); }}
                      contentEditable={focusedField?.fieldId === `hiw_lstep_${idx}_title`}
                      suppressContentEditableWarning
                      onInput={e => onFieldChange(`hiw_lstep_${idx}_title`, e.currentTarget.textContent || '')}
                      className="font-serif text-[16px] text-[#f7f2ea] cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#d4af37]/30"
                    >
                      {getVal(`hiw_lstep_${idx}_title`, step.title)}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#2b241b] border border-[#332b21] text-[10px] text-[#a89d8d] font-mono">{step.pill}</span>
                </div>
                <p
                  onClick={e => { e.stopPropagation(); onFieldFocus('list-and-earn', `hiw_lstep_${idx}_body`, 'Body', `Lister step ${step.num} body`); }}
                  contentEditable={focusedField?.fieldId === `hiw_lstep_${idx}_body`}
                  suppressContentEditableWarning
                  onInput={e => onFieldChange(`hiw_lstep_${idx}_body`, e.currentTarget.textContent || '')}
                  className="text-xs text-[#dcd4c7] leading-relaxed cursor-text p-0.5 rounded hover:ring-1 hover:ring-[#d4af37]/30"
                >
                  {getVal(`hiw_lstep_${idx}_body`, step.body)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksListAndEarn;
