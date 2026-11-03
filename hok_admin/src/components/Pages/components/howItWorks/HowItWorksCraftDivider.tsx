/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksCraftDivider (Spec §7.4, §8.7 Part 05, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface HowItWorksCraftDividerProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onSelectFigure?: (key: string) => void;
  isHidden?: boolean;
}

export const HowItWorksCraftDivider: React.FC<HowItWorksCraftDividerProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onSelectFigure,
  isHidden = false
}) => {
  const isSelected = activePartId === 'the-craft-divider';

  return (
    <section
      id="the-craft-divider"
      onClick={() => onSelectPart('the-craft-divider')}
      className={`mt-10 relative rounded-[10px] bg-[#1a1612] text-[#f7f2ea] p-8 md:p-12 overflow-hidden transition-all cursor-pointer ${
        isHidden ? 'opacity-50 ring-1 ring-dashed ring-[#b85c38]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:ring-1 hover:ring-[#bda67b]/50'}`}
    >
      {/* Infinity watermark */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#2b241b] font-serif text-[130px] select-none pointer-events-none font-light opacity-30 leading-none">
        ∞
      </div>

      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5 z-10">
          <span className="text-[11px] font-medium text-[#f5d77f] bg-[#2b241b] border border-[#b85c38] px-2.5 py-0.5 rounded-full">
            The Craft divider · hidden on the page
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left: Pulled Quote */}
        <div className="max-w-xl space-y-3">
          <span
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('the-craft-divider', 'hiw_craft_eyebrow', 'Eyebrow', 'Craft divider eyebrow');
            }}
            contentEditable={focusedField?.fieldId === 'hiw_craft_eyebrow'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('hiw_craft_eyebrow', e.currentTarget.textContent || '')}
            className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
              focusedField?.fieldId === 'hiw_craft_eyebrow'
                ? 'ring-1 ring-[#d4af37] bg-[#2b241b] text-[#f5d77f] outline-none'
                : 'text-[#d4af37] hover:ring-1 hover:ring-[#d4af37]/40'
            }`}
          >
            {getVal('hiw_craft_eyebrow', 'THE CRAFT')}
          </span>

          <blockquote
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('the-craft-divider', 'hiw_craft_quote', 'Quote', 'Main craft pulled quote', true);
            }}
            contentEditable={focusedField?.fieldId === 'hiw_craft_quote'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('hiw_craft_quote', e.currentTarget.textContent || '')}
            className={`font-serif italic text-[20px] md:text-[23px] text-[#f7f2ea] leading-relaxed cursor-text p-1 rounded ${
              focusedField?.fieldId === 'hiw_craft_quote' ? 'ring-1 ring-[#d4af37] bg-[#2b241b] outline-none' : 'hover:ring-1 hover:ring-[#d4af37]/30'
            }`}
          >
            {getVal(
              'hiw_craft_quote',
              '“The zardozi on a Sabyasachi lehenga does not diminish because it has been worn once. Designer craftsmanship deserves to be experienced, not stored.”'
            )}
          </blockquote>
        </div>

        {/* Right: Three figures row (pointing at registered figures) */}
        <div className="grid grid-cols-3 gap-6 shrink-0 text-center border-t lg:border-t-0 lg:border-l border-[#332b21] pt-6 lg:pt-0 lg:pl-8">
          {/* Figure 1: 30 to 70% below retail */}
          <div
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('discount_preloved_range');
            }}
            className="space-y-1 cursor-pointer group"
          >
            <div className="font-serif text-[24px] text-[#f5d77f] font-normal group-hover:underline">
              30 to 70%
            </div>
            <div className="text-[11px] text-[#a89d8d]">
              Below retail, preloved
            </div>
          </div>

          {/* Figure 2: T+3 days deposit return */}
          <div
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('deposit_return_days');
            }}
            className="space-y-1 cursor-pointer group"
          >
            <div className="font-serif text-[24px] text-[#f5d77f] font-normal group-hover:underline">
              3 days
            </div>
            <div className="text-[11px] text-[#a89d8d]">
              Deposit return turnaround
            </div>
          </div>

          {/* Figure 3: 100% refundable deposit */}
          <div
            onClick={e => {
              e.stopPropagation();
              onSelectFigure?.('deposit_percent');
            }}
            className="space-y-1 cursor-pointer group"
          >
            <div className="font-serif text-[24px] text-[#f5d77f] font-normal group-hover:underline">
              100%
            </div>
            <div className="text-[11px] text-[#a89d8d]">
              Refundable security deposit
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCraftDivider;
