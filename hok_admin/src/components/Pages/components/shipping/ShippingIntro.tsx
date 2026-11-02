/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: ShippingIntro (Spec § 8.15 Part 03)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

export interface ShippingIntroProps {
  onSelectFigure?: (figureKey: string) => void;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldId: string, val: string) => void;
  onFocusField?: (field: any) => void;
}

export const ShippingIntro: React.FC<ShippingIntroProps> = ({
  onSelectFigure,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  return (
    <div className="pt-2 pb-2">
      <div className="border-t border-dashed border-[#dcd7ce] pt-6 pb-2">
        <p className="font-serif text-lg sm:text-xl text-[#1c1917] leading-relaxed">
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('shipping_intro_part1')}
            onBlur={(e) => onFieldChange('shipping_intro_part1', e.currentTarget.textContent || '')}
            className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:bg-[#fbf4ea] focus:outline-none"
          >
            {fieldValues['shipping_intro_part1'] ||
              'Every House of Kaira piece is prepared by hand before it travels: pressed, wrapped in tissue, placed in its garment bag and boxed with care. Rentals are planned around your celebration, and standard delivery is '}
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
            onFocus={() => onFocusField('shipping_intro_part2')}
            onBlur={(e) => onFieldChange('shipping_intro_part2', e.currentTarget.textContent || '')}
            className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:bg-[#fbf4ea] focus:outline-none"
          >
            {fieldValues['shipping_intro_part2'] ||
              ", including a rental's journey back to us."}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ShippingIntro;
