/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceHero (Spec §8.8 Part 01, Pages 35-37)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface ListYourPieceHeroProps extends EditableFieldProps {
  hidden?: boolean;
  onOpenCheck?: (check: any) => void;
  onJumpToForm?: () => void;
  onJumpToHowItWorks?: () => void;
}

export const ListYourPieceHero: React.FC<ListYourPieceHeroProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  highlightedFigureKey,
  onSelectFigure,
  hidden,
  onOpenCheck,
  onJumpToForm,
  onJumpToHowItWorks
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  return (
    <section
      id="hero"
      className={`relative p-8 md:p-12 bg-[#1a1612] text-white rounded-[10px] border border-[#2b241c] overflow-hidden transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      {/* Ticker Band (Spec §8.8) */}
      <div className="mb-6 py-1.5 px-3 bg-[#241e18] border border-[#382f25] rounded-[6px] flex items-center justify-between text-[11px] text-[#c5ad7d]">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5ad7d] animate-pulse" />
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField?.({ fieldId: 'lyp_hero_ticker', fieldName: 'Ticker lines', helpText: 'Looping ticker announcement for listers' })}
            onBlur={e => onFieldChange?.('lyp_hero_ticker', e.currentTarget.textContent || '')}
            className="outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
          >
            {getVal('lyp_hero_ticker', 'Authenticity verified · 100% insured transit · Zero upfront fee · Payout within 3 working days')}
          </span>
        </div>
        <span className="text-[10px] text-[#8a7f73] uppercase tracking-wider shrink-0 font-mono">Live ticker</span>
      </div>

      {/* Eyebrow & Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_hero_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker above hero headline' })}
          onBlur={e => onFieldChange?.('lyp_hero_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] tracking-[0.2em] uppercase text-[#c5ad7d] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_hero_eyebrow', 'ACQUISITION · LIST YOUR PIECE')}
        </span>
        <span className="text-[11px] text-[#8a7f73] font-mono">Home / List Your Piece</span>
      </div>

      {/* Main Headline */}
      <h1
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField?.({ fieldId: 'lyp_hero_headline', fieldName: 'Headline', helpText: 'Primary hero headline for List Your Piece' })}
        onBlur={e => onFieldChange?.('lyp_hero_headline', e.currentTarget.textContent || '')}
        className="font-serif text-3xl md:text-5xl text-[#faf7f2] font-normal leading-tight tracking-tight mb-4 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
      >
        {getVal('lyp_hero_headline', "Your wardrobe's next life starts here.")}
      </h1>

      {/* Lead Paragraph */}
      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField?.({ fieldId: 'lyp_hero_lead', fieldName: 'Line under heading', helpText: 'Lead paragraph under hero headline' })}
        onBlur={e => onFieldChange?.('lyp_hero_lead', e.currentTarget.textContent || '')}
        className="text-[#c7beaf] text-sm md:text-base leading-relaxed max-w-2xl mb-8 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
      >
        {getVal('lyp_hero_lead', "Give the pieces you have celebrated in a second standing ovation. Earn on every booking without lifting a finger.")}
      </p>

      {/* Three Hero Figures (Spec §8.8) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pt-6 border-t border-[#2b241c]">
        {/* Figure 1: Lister share */}
        <div className="p-3 bg-[#241e18] border border-[#382f25] rounded-[6px]">
          <div className="text-[11px] text-[#8a7f73] mb-1">Earn up to</div>
          <div className="flex items-center gap-2">
            <span
              onClick={() => onSelectFigure?.('lister_share')}
              className={`font-serif text-2xl text-[#c5ad7d] px-1 rounded cursor-pointer transition-colors ${
                highlightedFigureKey === 'lister_share' ? 'ring-2 ring-[#c5ad7d] bg-[#332b21]' : 'hover:bg-[#332b21]'
              }`}
            >
              75%
            </span>
            <span className="text-[10px] text-[#b85c38] bg-[#382019] px-1.5 py-0.5 rounded border border-[#592c20]">
              Never printed
            </span>
          </div>
          <div className="text-[11px] text-[#c7beaf] mt-1">of rental or resale value</div>
        </div>

        {/* Figure 2: Payout */}
        <div className="p-3 bg-[#241e18] border border-[#382f25] rounded-[6px]">
          <div className="text-[11px] text-[#8a7f73] mb-1">Payout in</div>
          <div className="flex items-center gap-2">
            <span
              onClick={() => onSelectFigure?.('payout_cycle')}
              className={`font-serif text-2xl text-[#c5ad7d] px-1 rounded cursor-pointer transition-colors ${
                highlightedFigureKey === 'payout_cycle' ? 'ring-2 ring-[#c5ad7d] bg-[#332b21]' : 'hover:bg-[#332b21]'
              }`}
            >
              3 working days
            </span>
          </div>
          <div className="text-[11px] text-[#c7beaf] mt-1">direct bank transfer</div>
        </div>

        {/* Figure 3: Upfront fee */}
        <div className="p-3 bg-[#241e18] border border-[#382f25] rounded-[6px]">
          <div className="text-[11px] text-[#8a7f73] mb-1">Upfront listing fee</div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl text-[#c5ad7d] px-1">Zero</span>
          </div>
          <div className="text-[11px] text-[#c7beaf] mt-1">listing or storage fees</div>
        </div>
      </div>

      {/* Two Intent Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onJumpToForm}
          className="px-5 py-2.5 rounded-[6px] bg-[#b89047] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#a67e37] transition cursor-pointer shadow-sm"
        >
          {getVal('lyp_hero_btn_submit', 'START YOUR SUBMISSION ↓')}
        </button>
        <button
          type="button"
          onClick={onJumpToHowItWorks}
          className="px-5 py-2.5 rounded-[6px] border border-[#4a3f32] bg-[#241e18] text-[#c7beaf] text-xs font-medium tracking-wider uppercase hover:text-white hover:border-[#635544] transition cursor-pointer"
        >
          {getVal('lyp_hero_btn_process', 'HOW IT WORKS ↓')}
        </button>
      </div>
    </section>
  );
};

export default ListYourPieceHero;
