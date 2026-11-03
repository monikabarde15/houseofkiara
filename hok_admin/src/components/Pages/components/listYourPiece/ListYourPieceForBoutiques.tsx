/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceForBoutiques (Spec §8.8 Part 07, Page 36)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface ListYourPieceForBoutiquesProps extends EditableFieldProps {
  hidden?: boolean;
}

export const ListYourPieceForBoutiques: React.FC<ListYourPieceForBoutiquesProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  return (
    <section
      id="for-boutiques"
      className={`p-8 md:p-10 bg-[#faf7f2] rounded-[10px] border border-[#eadecc] space-y-6 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField?.({ fieldId: 'lyp_btq_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker for boutique partnership' })}
            onBlur={e => onFieldChange?.('lyp_btq_eyebrow', e.currentTarget.textContent || '')}
            className="text-[11px] tracking-[0.2em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
          >
            {getVal('lyp_btq_eyebrow', 'FOR DESIGNERS & BOUTIQUES')}
          </span>
          <h2
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField?.({ fieldId: 'lyp_btq_heading', fieldName: 'Heading', helpText: 'Headline for boutique pitch' })}
            onBlur={e => onFieldChange?.('lyp_btq_heading', e.currentTarget.textContent || '')}
            className="font-serif text-2xl md:text-3xl text-[#1a1612] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
          >
            {getVal('lyp_btq_heading', 'Partner with House of Kaira')}
          </h2>
        </div>

        <button
          type="button"
          className="px-5 py-2.5 rounded-[6px] bg-[#1a1612] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#332b21] transition cursor-pointer shrink-0"
        >
          {getVal('lyp_btq_btn', 'PARTNER WITH US →')}
        </button>
      </div>

      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField?.({ fieldId: 'lyp_btq_body', fieldName: 'Body text', helpText: 'Main pitch for designer partners' })}
        onBlur={e => onFieldChange?.('lyp_btq_body', e.currentTarget.textContent || '')}
        className="text-xs md:text-sm text-[#5c5248] leading-relaxed max-w-2xl outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
      >
        {getVal('lyp_btq_body', 'Monetise archival collections, past-season samples, and surplus inventory through our circular luxury platform. We handle curation, photography, dry cleaning, and door-to-door insured logistics.')}
      </p>

      {/* 3 Boutique Figures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#ebe5dc]">
        <div className="p-4 bg-white rounded-[6px] border border-[#ebe5dc]">
          <div className="font-serif text-2xl text-[#8a6a36]">30+</div>
          <div className="text-xs font-medium text-[#1a1612] mt-1">Designer houses partnered</div>
          <div className="text-[11px] text-[#8a7f73] mt-0.5">Across India and South Asia</div>
        </div>

        <div className="p-4 bg-white rounded-[6px] border border-[#ebe5dc]">
          <div className="font-serif text-2xl text-[#8a6a36]">100%</div>
          <div className="text-xs font-medium text-[#1a1612] mt-1">White-glove management</div>
          <div className="text-[11px] text-[#8a7f73] mt-0.5">Insured climate-controlled vault</div>
        </div>

        <div className="p-4 bg-white rounded-[6px] border border-[#ebe5dc]">
          <div className="font-serif text-2xl text-[#8a6a36]">T+3 days</div>
          <div className="text-xs font-medium text-[#1a1612] mt-1">Consolidated monthly payout</div>
          <div className="text-[11px] text-[#8a7f73] mt-0.5">Automated GST compliance</div>
        </div>
      </div>
    </section>
  );
};

export default ListYourPieceForBoutiques;
