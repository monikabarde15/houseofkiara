/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksTwoWaysToShop (Spec §7.4, §8.7 Part 04, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface HowItWorksTwoWaysToShopProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToPage?: (slug: string) => void;
  isHidden?: boolean;
}

export const HowItWorksTwoWaysToShop: React.FC<HowItWorksTwoWaysToShopProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onNavigateToPage,
  isHidden = false
}) => {
  const isSelected = activePartId === 'two-ways-to-shop';

  return (
    <section
      id="two-ways-to-shop"
      onClick={() => onSelectPart('two-ways-to-shop')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-12 space-y-8 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            Two ways to shop · hidden on the page
          </span>
        </div>
      )}

      <div className="space-y-2 max-w-xl mx-auto text-center">
        <span
          onClick={e => { e.stopPropagation(); onFieldFocus('two-ways-to-shop', 'hiw_modes_eyebrow', 'Eyebrow', 'Modes eyebrow'); }}
          contentEditable={focusedField?.fieldId === 'hiw_modes_eyebrow'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_modes_eyebrow', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'hiw_modes_eyebrow' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none' : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('hiw_modes_eyebrow', 'TWO WAYS TO WEAR')}
        </span>

        <h2
          onClick={e => { e.stopPropagation(); onFieldFocus('two-ways-to-shop', 'hiw_modes_heading', 'Heading', 'Modes heading', true); }}
          contentEditable={focusedField?.fieldId === 'hiw_modes_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_modes_heading', e.currentTarget.textContent || '')}
          className={`font-serif text-[28px] md:text-[34px] font-normal text-[#1a1612] cursor-text p-1 rounded ${
            focusedField?.fieldId === 'hiw_modes_heading' ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/40'
          }`}
        >
          Find what fits your <span className="italic text-[#8a6a36]">moment</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Rent */}
        <div className="p-8 rounded-[8px] bg-[#faf7f2] border border-[#f0ebe3] space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-4 text-[#e8dfcf] font-serif text-[72px] select-none pointer-events-none font-bold">R</div>
          <div className="space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#bda67b] text-[11px] font-semibold text-[#8a6a36] uppercase tracking-wider">
              Rent
            </span>
            <h3
              onClick={e => { e.stopPropagation(); onFieldFocus('two-ways-to-shop', 'hiw_rent_title', 'Heading', 'Rent column title'); }}
              contentEditable={focusedField?.fieldId === 'hiw_rent_title'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_rent_title', e.currentTarget.textContent || '')}
              className="font-serif text-[24px] text-[#1a1612] cursor-text p-0.5 rounded"
            >
              {getVal('hiw_rent_title', 'Access couture freely.')}
            </h3>
            <p
              onClick={e => { e.stopPropagation(); onFieldFocus('two-ways-to-shop', 'hiw_rent_lead', 'Lead line', 'Rent column lead'); }}
              contentEditable={focusedField?.fieldId === 'hiw_rent_lead'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_rent_lead', e.currentTarget.textContent || '')}
              className="text-xs font-medium text-[#5c5248] cursor-text p-0.5 rounded"
            >
              {getVal('hiw_rent_lead', 'The whole outfit. None of the storage.')}
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3"><span className="font-mono text-[#8a6a36] font-semibold">01</span><div><div className="font-medium text-[#1a1612]">Select rental dates</div><div className="text-[11.5px] text-[#73675a]">Choose 3, 5, or 7 days based on your event schedule.</div></div></div>
              <div className="flex items-start gap-3"><span className="font-mono text-[#8a6a36] font-semibold">02</span><div><div className="font-medium text-[#1a1612]">Secure with deposit</div><div className="text-[11.5px] text-[#73675a]">100% refundable deposit returned within 3 working days.</div></div></div>
              <div className="flex items-start gap-3"><span className="font-mono text-[#8a6a36] font-semibold">03</span><div><div className="font-medium text-[#1a1612]">Wear and celebrate</div><div className="text-[11.5px] text-[#73675a]">Complimentary sizing consultations and pristine cleaning included.</div></div></div>
              <div className="flex items-start gap-3"><span className="font-mono text-[#8a6a36] font-semibold">04</span><div><div className="font-medium text-[#1a1612]">Easy scheduled pickup</div><div className="text-[11.5px] text-[#73675a]">Pre-paid courier pickup from your home. No cleaning needed.</div></div></div>
            </div>
          </div>
          <div className="pt-4 border-t border-[#ebe5dc] relative z-10">
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onNavigateToPage?.('/catalogue'); }}
              className="w-full py-2.5 rounded-[4px] bg-[#1a1612] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#332e27] transition cursor-pointer"
            >
              BROWSE RENTALS →
            </button>
          </div>
        </div>

        {/* Right Column: Buy Preloved */}
        <div className="p-8 rounded-[8px] bg-[#1a1612] text-[#f7f2ea] border border-[#332b21] space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-4 text-[#2b241b] font-serif text-[72px] select-none pointer-events-none font-bold">P</div>
          <div className="space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#2b241b] border border-[#d4af37]/60 text-[11px] font-semibold text-[#f5d77f] uppercase tracking-wider">
              Buy Preloved
            </span>
            <h3
              onClick={e => { e.stopPropagation(); onFieldFocus('two-ways-to-shop', 'hiw_buy_title', 'Heading', 'Preloved column title'); }}
              contentEditable={focusedField?.fieldId === 'hiw_buy_title'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_buy_title', e.currentTarget.textContent || '')}
              className="font-serif text-[24px] text-[#f7f2ea] cursor-text p-0.5 rounded"
            >
              {getVal('hiw_buy_title', 'Own the craft. Not the retail.')}
            </h3>
            <p
              onClick={e => { e.stopPropagation(); onFieldFocus('two-ways-to-shop', 'hiw_buy_lead', 'Lead line', 'Preloved column lead'); }}
              contentEditable={focusedField?.fieldId === 'hiw_buy_lead'}
              suppressContentEditableWarning
              onInput={e => onFieldChange('hiw_buy_lead', e.currentTarget.textContent || '')}
              className="text-xs font-medium text-[#dcd4c7] cursor-text p-0.5 rounded"
            >
              {getVal('hiw_buy_lead', 'Acquire archived designer pieces to keep forever.')}
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3"><span className="font-mono text-[#d4af37] font-semibold">01</span><div><div className="font-medium text-[#f7f2ea]">Verified provenance</div><div className="text-[11.5px] text-[#a89d8d]">Receipts, designer tags, and physical inspection documented.</div></div></div>
              <div className="flex items-start gap-3"><span className="font-mono text-[#d4af37] font-semibold">02</span><div><div className="font-medium text-[#f7f2ea]">Honest condition report</div><div className="text-[11.5px] text-[#a89d8d]">Wear count, alterations, and close-up fabric inspection disclosed.</div></div></div>
              <div className="flex items-start gap-3"><span className="font-mono text-[#d4af37] font-semibold">03</span><div><div className="font-medium text-[#f7f2ea]">Exceptional value</div><div className="text-[11.5px] text-[#a89d8d]">Archived couture priced 30% to 70% below original boutique prices.</div></div></div>
              <div className="flex items-start gap-3"><span className="font-mono text-[#d4af37] font-semibold">04</span><div><div className="font-medium text-[#f7f2ea]">Direct delivery</div><div className="text-[11.5px] text-[#a89d8d]">Dispatched nationwide within 24 hours in archival preservation boxes.</div></div></div>
            </div>
          </div>
          <div className="pt-4 border-t border-[#332b21] relative z-10">
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onNavigateToPage?.('/preloved'); }}
              className="w-full py-2.5 rounded-[4px] bg-[#d4af37] text-[#1a1612] text-xs font-semibold uppercase tracking-wider hover:bg-[#c29f2f] transition cursor-pointer"
            >
              SHOP PRELOVED →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksTwoWaysToShop;
