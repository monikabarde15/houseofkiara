/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksWhatsOnPage (Spec §7.4, §8.7 Part 02, Screen 47)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';

interface HowItWorksWhatsOnPageProps {
  activePartId: string;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onJumpToPart?: (partId: string) => void;
  isHidden?: boolean;
}

export const HowItWorksWhatsOnPage: React.FC<HowItWorksWhatsOnPageProps> = ({
  activePartId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  onFieldChange,
  onJumpToPart,
  isHidden = false
}) => {
  const isSelected = activePartId === 'whats-on-this-page';

  return (
    <section
      id="whats-on-this-page"
      onClick={() => onSelectPart('whats-on-this-page')}
      className={`mt-10 relative rounded-[10px] border border-[#e6dccb] bg-[#fffefb] p-8 md:p-10 transition-all cursor-pointer ${
        isHidden ? 'opacity-50 border-dashed border-[#b85c38]/40 bg-[#fdfaf7]' : ''
      } ${isSelected ? 'ring-2 ring-[#bda67b]' : 'hover:border-[#bda67b]'}`}
    >
      {/* Hidden status badge */}
      {isHidden && (
        <div className="absolute top-4 right-5">
          <span className="text-[11px] font-medium text-[#b85c38] bg-[#fbf2ed] border border-[#f0d8cc] px-2.5 py-0.5 rounded-full">
            What's on this page · hidden on the page
          </span>
        </div>
      )}

      {/* Index Heading */}
      <div className="text-center space-y-1 mb-8">
        <span
          onClick={e => {
            e.stopPropagation();
            onFieldFocus('whats-on-this-page', 'hiw_index_heading', 'Heading', 'Index heading');
          }}
          contentEditable={focusedField?.fieldId === 'hiw_index_heading'}
          suppressContentEditableWarning
          onInput={e => onFieldChange('hiw_index_heading', e.currentTarget.textContent || '')}
          className={`text-[11px] font-semibold tracking-widest uppercase inline-block cursor-text p-1 rounded transition-colors ${
            focusedField?.fieldId === 'hiw_index_heading'
              ? 'ring-1 ring-[#bda67b] bg-[#faf7f2] text-[#8a6a36] outline-none'
              : 'text-[#8a6a36] hover:ring-1 hover:ring-[#bda67b]/30'
          }`}
        >
          {getVal('hiw_index_heading', "WHAT'S ON THIS PAGE")}
        </span>
      </div>

      {/* Two columns of four steps each */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Shopping */}
        <div className="p-6 rounded-[8px] bg-[#faf7f2] border border-[#f0ebe3] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8a6a36]" />
            <span className="text-[11px] font-semibold tracking-wider text-[#8a6a36] uppercase">
              Shopping
            </span>
          </div>

          <h3
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('whats-on-this-page', 'hiw_left_col_title', 'Left column heading', 'Shopping column heading');
            }}
            contentEditable={focusedField?.fieldId === 'hiw_left_col_title'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('hiw_left_col_title', e.currentTarget.textContent || '')}
            className={`font-serif text-[18px] text-[#1a1612] cursor-text p-1 rounded ${
              focusedField?.fieldId === 'hiw_left_col_title' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal('hiw_left_col_title', 'Rent or buy preloved with confidence')}
          </h3>

          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#8a6a36] font-semibold">01</span>
              <span className="text-[#5c5248]">Browse & discover</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#8a6a36] font-semibold">02</span>
              <span className="text-[#5c5248]">Choose your mode</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#8a6a36] font-semibold">03</span>
              <span className="text-[#5c5248]">Checkout & confirm</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#8a6a36] font-semibold">04</span>
              <span className="text-[#5c5248]">Wear, return, or keep</span>
            </div>
          </div>
        </div>

        {/* Right Column: Listing */}
        <div className="p-6 rounded-[8px] bg-[#faf7f2] border border-[#f0ebe3] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1a1612]" />
            <span className="text-[11px] font-semibold tracking-wider text-[#1a1612] uppercase">
              Listing & Earning
            </span>
          </div>

          <h3
            onClick={e => {
              e.stopPropagation();
              onFieldFocus('whats-on-this-page', 'hiw_right_col_title', 'Right column heading', 'Listing column heading');
            }}
            contentEditable={focusedField?.fieldId === 'hiw_right_col_title'}
            suppressContentEditableWarning
            onInput={e => onFieldChange('hiw_right_col_title', e.currentTarget.textContent || '')}
            className={`font-serif text-[18px] text-[#1a1612] cursor-text p-1 rounded ${
              focusedField?.fieldId === 'hiw_right_col_title' ? 'ring-1 ring-[#bda67b] bg-white outline-none' : 'hover:ring-1 hover:ring-[#bda67b]/30'
            }`}
          >
            {getVal('hiw_right_col_title', 'Give your wardrobe a second life')}
          </h3>

          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#8a6a36] font-semibold">01</span>
              <span className="text-[#5c5248]">Submit your pieces</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#8a6a36] font-semibold">02</span>
              <span className="text-[#5c5248]">We handle the rest</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#8a6a36] font-semibold">03</span>
              <span className="text-[#5c5248]">Earn predictable payouts</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#8a6a36] font-semibold">04</span>
              <span className="text-[#5c5248]">Reclaim anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter tabs that follow the reader (Spec §8.7 Part 02) */}
      <div className="mt-8 pt-4 border-t border-[#f0ebe3] flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-[#8a7f73] mr-2 text-[11px] uppercase tracking-wider font-semibold">
          Jump to section:
        </span>
        {[
          { id: 'shopping-steps', label: 'Shopping' },
          { id: 'two-ways-to-shop', label: 'Modes' },
          { id: 'the-craft-divider', label: 'The Craft' },
          { id: 'list-and-earn', label: 'List & Earn' },
          { id: 'good-to-know', label: 'Policies' },
          { id: 'faq', label: 'FAQs' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={e => {
              e.stopPropagation();
              onJumpToPart?.(tab.id);
            }}
            className="px-3 py-1 rounded-full bg-[#faf7f2] border border-[#e6dccb] text-[#5c5248] hover:text-[#1a1612] hover:border-[#bda67b] transition-colors cursor-pointer text-[11.5px]"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksWhatsOnPage;
