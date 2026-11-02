/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: ShippingRentalWindowCard (Spec § 8.15 Part 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { SHIPPING_RENTAL_WINDOW_CARD } from '../../data/shippingRegistry';

export interface ShippingRentalWindowCardProps {
  onSelectFigure?: (figureKey: string) => void;
  onOpenQuestion?: (questionId: string) => void;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldId: string, val: string) => void;
  onFocusField?: (field: any) => void;
}

export const ShippingRentalWindowCard: React.FC<ShippingRentalWindowCardProps> = ({
  onSelectFigure,
  onOpenQuestion,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const cardTitle = fieldValues['shipping_window_title'] || SHIPPING_RENTAL_WINDOW_CARD.title;
  const cardHint = fieldValues['shipping_window_hint'] || SHIPPING_RENTAL_WINDOW_CARD.hint;

  return (
    <div className="pt-2 pb-4">
      <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-[10px] p-6 sm:p-8 space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-1">
          <h2
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('shipping_window_title')}
            onBlur={(e) => onFieldChange('shipping_window_title', e.currentTarget.textContent || '')}
            className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal cursor-pointer hover:bg-white px-2 py-0.5 rounded inline-block"
          >
            {cardTitle}
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('shipping_window_hint')}
            onBlur={(e) => onFieldChange('shipping_window_hint', e.currentTarget.textContent || '')}
            className="text-xs sm:text-sm text-[#78716c] cursor-pointer hover:bg-white px-2 py-0.5 rounded inline-block"
          >
            {cardHint}
          </p>
        </div>

        {/* 3 Days + Extra Days Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {/* Day 1 */}
          <div className="bg-white border border-[#ded8cf] rounded-lg p-4 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a7f73] font-semibold">
              DAY 1
            </span>
            <div className="font-serif text-base text-[#1c1917] font-medium">
              It arrives
            </div>
            <p className="text-xs text-[#57534e]">
              The day before your celebration
            </p>
          </div>

          {/* Day 2 (Celebration) */}
          <div className="bg-[#fff9ea] border-2 border-[#c5ad7d] rounded-lg p-4 text-center space-y-1 shadow-sm relative">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#935b1e] font-bold">
              DAY 2 · CELEBRATION
            </span>
            <div className="font-serif text-base text-[#935b1e] font-semibold">
              Your celebration
            </div>
            <p className="text-xs text-[#785b1a]">
              Wear it, and enjoy every moment
            </p>
          </div>

          {/* Day 3 */}
          <div className="bg-white border border-[#ded8cf] rounded-lg p-4 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a7f73] font-semibold">
              DAY 3
            </span>
            <div className="font-serif text-base text-[#1c1917] font-medium">
              It goes back
            </div>
            <p className="text-xs text-[#57534e]">
              We collect it from your door
            </p>
          </div>

          {/* Extra Days */}
          <div className="bg-[#f5f1eb] border border-dashed border-[#c5ad7d] rounded-lg p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] font-semibold">
              EXTRA DAYS
            </span>
            <div className="font-serif text-base text-[#1c1917] font-medium">
              Need it longer?
            </div>
            <p className="text-xs text-[#57534e]">
              Add days when you book, at daily rate
            </p>
          </div>
        </div>

        {/* Brackets Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
          <div className="md:col-span-3 flex items-center justify-center gap-1.5 py-1.5 bg-white/70 border border-[#e5dfd4] rounded-md text-[#57534e]">
            <span>Standard rental window ·</span>
            <button
              type="button"
              onClick={() => onSelectFigure?.('rental_window_days')}
              className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold cursor-pointer hover:bg-[#fef08a]"
            >
              3 days
            </button>
            <span>· one price</span>
          </div>
          <div className="py-1.5 bg-white/70 border border-[#e5dfd4] rounded-md text-[#78716c]">
            Optional · daily rate
          </div>
        </div>

        {/* Two Explanatory Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#ebe5dc]">
          <div className="bg-white p-3.5 rounded-md border border-[#ebe5dc] space-y-1">
            <div className="font-serif text-xs font-semibold text-[#1c1917]">
              {SHIPPING_RENTAL_WINDOW_CARD.note1.title}
            </div>
            <p className="text-xs text-[#57534e] leading-relaxed">
              {SHIPPING_RENTAL_WINDOW_CARD.note1.text}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-md border border-[#ebe5dc] space-y-1">
            <div className="font-serif text-xs font-semibold text-[#1c1917]">
              {SHIPPING_RENTAL_WINDOW_CARD.note2.title}
            </div>
            <p className="text-xs text-[#57534e] leading-relaxed">
              {SHIPPING_RENTAL_WINDOW_CARD.note2.textPrefix}
              <button
                type="button"
                onClick={() => onOpenQuestion?.(SHIPPING_RENTAL_WINDOW_CARD.note2.targetAnswerId)}
                className="text-[#935b1e] underline hover:text-[#785b1a] ml-1 cursor-pointer font-medium"
              >
                {SHIPPING_RENTAL_WINDOW_CARD.note2.linkText}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingRentalWindowCard;
