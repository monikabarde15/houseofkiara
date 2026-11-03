/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: ShippingWaysWeDeliver (Spec § 8.15 Part 04, Screen 54)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { SHIPPING_WAYS_WE_DELIVER } from '../../data/shippingRegistry';

export interface ShippingWaysWeDeliverProps {
  onSelectFigure?: (figureKey: string) => void;
  onOpenQuestion?: (questionId: string) => void;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldId: string, val: string) => void;
  onFocusField?: (field: any) => void;
}

export const ShippingWaysWeDeliver: React.FC<ShippingWaysWeDeliverProps> = ({
  onSelectFigure,
  onOpenQuestion,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const titlePrefix = fieldValues['shipping_ways_prefix'] || SHIPPING_WAYS_WE_DELIVER.titlePrefix;
  const italicWord = fieldValues['shipping_ways_italic'] || SHIPPING_WAYS_WE_DELIVER.italicWord;
  const subline = fieldValues['shipping_ways_subline'] || SHIPPING_WAYS_WE_DELIVER.subline;

  return (
    <div className="pt-2 pb-4 space-y-6">
      {/* Section Header */}
      <div className="border-t border-dashed border-[#dcd7ce] pt-8">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] font-normal">
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('shipping_ways_prefix')}
            onBlur={(e) => onFieldChange('shipping_ways_prefix', e.currentTarget.textContent || '')}
            className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
          >
            {titlePrefix}
          </span>
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('shipping_ways_italic')}
            onBlur={(e) => onFieldChange('shipping_ways_italic', e.currentTarget.textContent || '')}
            className="italic text-[#935b1e] cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
          >
            {italicWord}
          </span>
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('shipping_ways_subline')}
          onBlur={(e) => onFieldChange('shipping_ways_subline', e.currentTarget.textContent || '')}
          className="text-xs sm:text-sm text-[#57534e] mt-2 leading-relaxed cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors"
        >
          {subline}
        </p>
      </div>

      {/* 2x2 Grid of Delivery Options (Screen 54) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Standard */}
        <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 space-y-3.5 shadow-xs hover:border-[#c5ad7d] transition-colors">
          <span className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
            ACROSS INDIA
          </span>
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl text-[#1c1917] font-normal">
              Standard
            </h3>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => onSelectFigure?.('standard_delivery')}
                className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-2 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
              >
                3 to 5 business days
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10.5px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider bg-[#edf7ed] text-[#2e7d32] border border-[#c8e6c9] flex items-center gap-1">
              <span>●</span>
              <span>FREE FROM</span>
              <button
                type="button"
                onClick={() => onSelectFigure?.('free_delivery_min')}
                className="underline hover:text-[#1b5e20] ml-0.5"
              >
                ₹5,000
              </button>
            </span>
          </div>

          <p className="text-xs text-[#57534e] leading-relaxed pt-1">
            Below that, worked out for your address and shown before you pay. For a rental, the journey back is included.
          </p>
        </div>

        {/* Option 2: Express */}
        <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 space-y-3.5 shadow-xs hover:border-[#c5ad7d] transition-colors">
          <span className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
            MOST PINCODES IN INDIA
          </span>
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl text-[#1c1917] font-normal">
              Express
            </h3>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => onSelectFigure?.('express_delivery')}
                className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-2 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
              >
                1 to 2 business days
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10.5px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
              ● QUOTED AT CHECKOUT
            </span>
          </div>

          <p className="text-xs text-[#57534e] leading-relaxed pt-1">
            Priced for your address, never a flat fee, and charged even when standard delivery is free.
          </p>
        </div>

        {/* Option 3: Same day */}
        <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 space-y-3.5 shadow-xs hover:border-[#c5ad7d] transition-colors">
          <span className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
            WITHIN INDORE
          </span>
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl text-[#1c1917] font-normal">
              Same day
            </h3>
            <div className="text-xs font-medium text-[#1c1917] pt-1">
              The same day
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10.5px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
              ● QUOTED AT CHECKOUT
            </span>
          </div>

          <p className="text-xs text-[#57534e] leading-relaxed pt-1">
            For rentals and preloved pieces, shown at checkout whenever it is available for your order.
          </p>
        </div>

        {/* Option 4: International */}
        <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 space-y-3.5 shadow-xs hover:border-[#c5ad7d] transition-colors">
          <span className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
            WORLDWIDE
          </span>
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl text-[#1c1917] font-normal">
              International
            </h3>
            <div className="flex items-center gap-1.5 pt-0.5 text-xs text-[#1c1917]">
              <span>Within</span>
              <button
                type="button"
                onClick={() => onSelectFigure?.('intl_delivery')}
                className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-2 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-[#fef08a]"
              >
                10 business days
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10.5px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
              ● QUOTED AT CHECKOUT
            </span>
          </div>

          <p className="text-xs text-[#57534e] leading-relaxed pt-1">
            For preloved pieces only. Customs duties and import taxes are paid by you on arrival.
          </p>
        </div>
      </div>

      {/* Callout footnote box matching Screen 54 */}
      <div className="p-4 bg-[#faf7f2] border-l-2 border-[#935b1e] rounded-r-md">
        <p className="font-serif italic text-xs sm:text-[13.5px] text-[#785b1a] leading-relaxed">
          For a rental, the day your piece arrives is set by your celebration, whichever option you choose. Express and same day delivery simply let you book closer to your date.
        </p>
      </div>
    </div>
  );
};

export default ShippingWaysWeDeliver;
