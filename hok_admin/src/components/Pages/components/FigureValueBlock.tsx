/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureValueBlock (Spec §5.3, Screens 04, 06-09)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FigureItem } from '../types';
import { FigureSetHereEditor } from './FigureSetHereEditor';

interface FigureValueBlockProps {
  figure: FigureItem;
  onAddChange: (key: string, newValue: string, when: 'now' | 'date', date?: string, why?: string) => void;
  onDiscardChange: (key: string) => void;
  onReviewAndPublish?: () => void;
  onOpenSiteSettings?: () => void;
}

export const FigureValueBlock: React.FC<FigureValueBlockProps> = ({
  figure,
  onAddChange,
  onDiscardChange,
  onReviewAndPublish,
  onOpenSiteSettings
}) => {
  return (
    <div className="border-t border-[#f0ebe3] pt-4 space-y-3">
      {/* Block Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-[#1a1612]">
          Value
        </h3>
        <span className="text-[12px] text-[#73675a]">
          {figure.owner}
        </span>
      </div>

      {/* 1. Set here: Inputs & Validation (Spec §5.3, §5.4) */}
      {figure.owner === 'Set here' && (
        <FigureSetHereEditor
          figure={figure}
          onAddChange={onAddChange}
          onDiscardChange={onDiscardChange}
          onReviewAndPublish={onReviewAndPublish}
        />
      )}

      {/* 2. Site Settings pointer card (Spec §5.3, Screen 06) */}
      {figure.owner === 'Site Settings' && (
        <div className="bg-[#fffdfa] border border-[#ebe5dc] rounded-[6px] p-3.5 space-y-2">
          <div className="font-serif text-[20px] text-[#1a1612]">
            {figure.displayValue}
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11.5px] text-[#5c5248] leading-relaxed">
              Set in Site Settings, because the header, the footer and the WhatsApp button print it too. One place to change it, and every page follows.
            </p>
            {onOpenSiteSettings && (
              <button
                type="button"
                onClick={onOpenSiteSettings}
                className="shrink-0 px-3 py-1 bg-white border border-[#e6dccb] rounded-[4px] text-xs text-[#1a1612] hover:bg-[#faf7f2] cursor-pointer"
              >
                Open Site Settings
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. By law locked pointer (Spec §5.3, Screen 07) */}
      {figure.owner === 'By law' && (
        <div className="space-y-2">
          <div className="font-serif text-[22px] text-[#1a1612]">
            {figure.displayValue}
          </div>
          <div className="bg-[#fffdfa] border border-[#ebe5dc] rounded-[6px] p-3 text-[11.5px] text-[#5c5248] flex items-start gap-2 leading-relaxed">
            <svg className="w-4 h-4 text-[#73675a] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <span className="font-medium text-[#1a1612]">Locked.</span> Income Tax Act, 1961, sections 269SS and 269T: a deposit of this amount or more may not be taken or repaid in cash.{' '}
              <button type="button" className="underline hover:text-[#1a1612] cursor-pointer">
                Unlock to change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Counted live (Spec §5.3, Screen 08) */}
      {figure.owner === 'Counted' && (
        <div className="bg-[#fffdfa] border border-[#ebe5dc] rounded-[6px] p-3.5 space-y-1">
          <div className="font-serif text-[22px] text-[#1a1612]">
            {figure.displayValue}
          </div>
          <p className="text-[11.5px] text-[#5c5248]">
            Counted live from system records. It cannot be typed or go out of date.
          </p>
        </div>
      )}

      {/* 5. Each page stamps (Spec §5.3, Screen 09) */}
      {figure.owner === 'Each page' && (
        <div className="bg-[#fffdfa] border border-[#ebe5dc] rounded-[6px] p-3.5 space-y-2">
          <div className="font-serif text-[18px] text-[#1a1612]">
            Per page
          </div>
          <p className="text-[11.5px] text-[#5c5248]">
            Page dates and version stamps are managed in each page's settings, set when the page is published.
          </p>
        </div>
      )}
    </div>
  );
};

export default FigureValueBlock;
