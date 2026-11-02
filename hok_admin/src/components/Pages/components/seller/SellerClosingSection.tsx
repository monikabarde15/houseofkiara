/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerClosingSection (Spec § 8.17 Part 04)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { SELLER_CLOSING_BAND } from '../../data/sellerRegistry';
import { EditableFieldProps } from '../types';

export interface SellerClosingSectionProps extends EditableFieldProps {
  onNavigateToPage?: (slug: string) => void;
}

export const SellerClosingSection: React.FC<SellerClosingSectionProps> = ({
  onNavigateToPage,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const title = fieldValues['seller_closing_title'] || SELLER_CLOSING_BAND.title;
  const lead = fieldValues['seller_closing_lead'] || SELLER_CLOSING_BAND.lead;

  return (
    <div className="pt-4 pb-8 space-y-8">
      {/* Dark Closing Band */}
      <div className="bg-[#1c1917] text-white rounded-[10px] p-8 sm:p-10 space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5ad7d] font-semibold">
            WE'RE HERE FOR YOU
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            <span
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocusField('seller_closing_title')}
              onBlur={(e) => onFieldChange('seller_closing_title', e.currentTarget.textContent || '')}
              className="cursor-pointer hover:bg-white/10 px-1 rounded transition-colors focus:outline-none"
            >
              {title}
            </span>
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('seller_closing_lead')}
            onBlur={(e) => onFieldChange('seller_closing_lead', e.currentTarget.textContent || '')}
            className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl cursor-pointer hover:bg-white/10 px-1 rounded transition-colors focus:outline-none"
          >
            {lead}
          </p>
          <p className="text-xs italic text-[#c5ad7d] pt-1">
            With love, the House of Kaira curation team
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href={SELLER_CLOSING_BAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25d366] text-[#0f2415] text-xs font-semibold rounded-md hover:bg-[#20ba5a] transition-colors"
          >
            Message us on WhatsApp
          </a>
          <a
            href={SELLER_CLOSING_BAND.listYourPieceUrl}
            className="px-4 py-2 bg-white/10 text-white border border-white/20 text-xs font-medium rounded-md hover:bg-white/20 transition-colors"
          >
            List your piece
          </a>
        </div>
      </div>

      {/* Agreement & Related Policies Disclosure Panel */}
      <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-[10px] p-6 space-y-3">
        <h3 className="font-serif text-base text-[#1c1917] font-medium">
          {SELLER_CLOSING_BAND.panelTitle}
        </h3>
        <p className="text-xs text-[#57534e] leading-relaxed">
          {SELLER_CLOSING_BAND.panelText}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs pt-1 border-t border-[#ede6dc]">
          <span className="font-serif italic text-[#8a7f73]">Relevant agreements:</span>
          {SELLER_CLOSING_BAND.panelLinks.map((link, idx) => (
            <React.Fragment key={link.href}>
              <button
                type="button"
                onClick={() => onNavigateToPage?.(link.href)}
                className="text-[#935b1e] hover:underline cursor-pointer font-medium"
              >
                {link.label}
              </button>
              {idx < SELLER_CLOSING_BAND.panelLinks.length - 1 && (
                <span className="text-[#dcd7ce]">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerClosingSection;
