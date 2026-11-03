/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PricingIntroSection (Spec § 8.16 Part 04)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PRICING_SIDE_INTROS } from '../../data/pricingRegistry';

export interface PricingIntroSectionProps {
  activeSide: 'pay' | 'earn';
  onSelectFigure?: (figureKey: string) => void;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldId: string, val: string) => void;
  onFocusField?: (field: any) => void;
}

export const PricingIntroSection: React.FC<PricingIntroSectionProps> = ({
  activeSide,
  onSelectFigure,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const isPay = activeSide === 'pay';
  const introKey = `pricing_intro_${activeSide}`;
  const introText = fieldValues[introKey] || PRICING_SIDE_INTROS[activeSide];

  return (
    <div className="pt-2 pb-2">
      <div className="border-t border-dashed border-[#dcd7ce] pt-6 pb-2 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#935b1e] font-semibold">
          {isPay ? 'WHAT YOU PAY' : 'WHAT YOU EARN'}
        </span>

        {isPay ? (
          <p className="font-serif text-lg sm:text-xl text-[#1c1917] leading-relaxed">
            <span
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocusField('pricing_intro_pay_p1')}
              onBlur={(e) => onFieldChange('pricing_intro_pay_p1', e.currentTarget.textContent || '')}
              className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
            >
              {fieldValues['pricing_intro_pay_p1'] ||
                'Every rental is priced for its window, and every preloved piece at the price agreed with its owner. GST is added at checkout, standard delivery is '}
            </span>
            <span className="font-semibold text-[#1c1917]">
              <span>free on every order of </span>
              <button
                type="button"
                onClick={() => onSelectFigure?.('free_delivery_min')}
                className="bg-[#fef9c3] text-[#854d0e] border border-[#fde047] px-1.5 py-0.5 rounded font-mono text-sm font-semibold cursor-pointer hover:bg-[#fef08a] inline-block"
              >
                ₹5,000
              </button>
              <span> or more</span>
            </span>
            <span
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocusField('pricing_intro_pay_p2')}
              onBlur={(e) => onFieldChange('pricing_intro_pay_p2', e.currentTarget.textContent || '')}
              className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
            >
              {fieldValues['pricing_intro_pay_p2'] ||
                ', and a deposit is simply held in safekeeping until your piece is home with us.'}
            </span>
          </p>
        ) : (
          <p
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField(introKey)}
            onBlur={(e) => onFieldChange(introKey, e.currentTarget.textContent || '')}
            className="font-serif text-lg sm:text-xl text-[#1c1917] leading-relaxed cursor-pointer hover:bg-[#fbf4ea] p-1 rounded transition-colors focus:outline-none"
          >
            {introText}
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingIntroSection;
