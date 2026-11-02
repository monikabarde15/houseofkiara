/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerProtectionSection (Spec § 8.17 Part 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { SELLER_PROTECTION_CARD } from '../../data/sellerRegistry';
import { EditableFieldProps } from '../types';

export interface SellerProtectionSectionProps extends EditableFieldProps {
  onScrollToProtect?: () => void;
}

export const SellerProtectionSection: React.FC<SellerProtectionSectionProps> = ({
  onScrollToProtect,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const title = fieldValues['seller_protect_title'] || SELLER_PROTECTION_CARD.title;
  const line = fieldValues['seller_protect_line'] || SELLER_PROTECTION_CARD.line;

  return (
    <div className="pt-2 pb-4">
      <div className="bg-[#faf6ee] border border-[#e8dfcf] rounded-[10px] p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm">🛡️</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">
              <span
                contentEditable
                suppressContentEditableWarning
                onFocus={() => onFocusField('seller_protect_title')}
                onBlur={(e) => onFieldChange('seller_protect_title', e.currentTarget.textContent || '')}
                className="cursor-pointer hover:bg-[#f3ebd9] px-1 rounded transition-colors focus:outline-none"
              >
                {title}
              </span>
            </h2>
          </div>
          <p
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('seller_protect_line')}
            onBlur={(e) => onFieldChange('seller_protect_line', e.currentTarget.textContent || '')}
            className="text-xs sm:text-sm text-[#73675a] leading-relaxed cursor-pointer hover:bg-[#f3ebd9] px-1 rounded transition-colors focus:outline-none"
          >
            {line}
          </p>
        </div>

        {/* Five Protection Points */}
        <ul className="space-y-3 text-xs sm:text-sm text-[#44403c]">
          {SELLER_PROTECTION_CARD.points.map((pt, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-4 h-4 rounded-full bg-[#1c1917] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </span>
              <span className="leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onScrollToProtect}
            className="text-xs font-medium text-[#935b1e] hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <span>{SELLER_PROTECTION_CARD.linkText}</span>
            <span className="font-serif italic">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProtectionSection;
