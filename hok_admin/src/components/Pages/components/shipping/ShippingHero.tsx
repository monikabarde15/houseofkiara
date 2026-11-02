/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: ShippingHero (Spec § 8.15 Part 01, Screen 54)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { SHIPPING_HERO, SHIPPING_POPULAR_QUESTIONS } from '../../data/shippingRegistry';

export interface ShippingHeroProps {
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldId: string, val: string) => void;
  onFocusField?: (field: any) => void;
  onSelectQuestion?: (q: string) => void;
}

export const ShippingHero: React.FC<ShippingHeroProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onSelectQuestion
}) => {
  const [isEditingEyebrow, setIsEditingEyebrow] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);

  const eyebrow = fieldValues['shipping_hero_eyebrow'] || SHIPPING_HERO.eyebrow;
  const headingPrefix = fieldValues['shipping_hero_prefix'] || SHIPPING_HERO.headingPrefix;
  const headingItalic = fieldValues['shipping_hero_italic'] || SHIPPING_HERO.headingItalic;
  const lead = fieldValues['shipping_hero_lead'] || SHIPPING_HERO.subtitle;

  return (
    <div className="text-center max-w-2xl mx-auto pt-4 pb-6 space-y-4">
      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#c5ad7d]" />
        {isEditingEyebrow ? (
          <input
            type="text"
            value={eyebrow}
            autoFocus
            onBlur={() => setIsEditingEyebrow(false)}
            onChange={(e) => onFieldChange('shipping_hero_eyebrow', e.target.value)}
            className="text-[11px] uppercase tracking-[0.2em] text-[#935b1e] font-semibold bg-white border border-[#c5ad7d] rounded px-2 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-[#c5ad7d]"
          />
        ) : (
          <span
            onClick={() => {
              setIsEditingEyebrow(true);
              onFocusField('shipping_hero_eyebrow');
            }}
            className="text-[11px] uppercase tracking-[0.2em] text-[#935b1e] font-semibold cursor-pointer hover:bg-[#fbf4ea] px-2 py-0.5 rounded transition-colors"
          >
            {eyebrow}
          </span>
        )}
        <span className="h-px w-8 bg-[#c5ad7d]" />
      </div>

      {/* Main Title */}
      <h1 className="font-serif text-4xl sm:text-[44px] text-[#1c1917] font-normal tracking-[-0.01em] leading-tight">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('shipping_hero_prefix')}
          onBlur={(e) => onFieldChange('shipping_hero_prefix', e.currentTarget.textContent || '')}
          className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:bg-[#fbf4ea] focus:outline-none"
        >
          {headingPrefix}
        </span>
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('shipping_hero_italic')}
          onBlur={(e) => onFieldChange('shipping_hero_italic', e.currentTarget.textContent || '')}
          className="italic text-[#935b1e] font-serif cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:bg-[#fbf4ea] focus:outline-none"
        >
          {headingItalic}
        </span>
      </h1>

      {/* Subtitle / Lead */}
      <div className="pt-1">
        {isEditingLead ? (
          <textarea
            value={lead}
            autoFocus
            rows={3}
            onBlur={() => setIsEditingLead(false)}
            onChange={(e) => onFieldChange('shipping_hero_lead', e.target.value)}
            className="w-full text-sm sm:text-base text-[#57534e] font-normal leading-relaxed text-center bg-white border border-[#c5ad7d] rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#c5ad7d]"
          />
        ) : (
          <p
            onClick={() => {
              setIsEditingLead(true);
              onFocusField('shipping_hero_lead');
            }}
            className="text-sm sm:text-base text-[#57534e] font-normal leading-relaxed cursor-pointer hover:bg-[#fbf4ea] p-1.5 rounded transition-colors"
          >
            {lead}
          </p>
        )}
      </div>

      {/* Search Input Box */}
      <div className="pt-2 max-w-xl mx-auto">
        <div className="relative flex items-center">
          <svg
            className="w-4 h-4 text-[#8a7f73] absolute left-3.5 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-2.85z" />
          </svg>
          <input
            type="text"
            readOnly
            placeholder="Search delivery, like &quot;pincode&quot; or &quot;return pickup&quot;"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dcd7ce] rounded-full text-xs sm:text-sm text-[#1c1917] placeholder-[#a8a29e] shadow-xs cursor-default"
          />
        </div>
      </div>

      {/* Popular Question Shortcuts */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#78716c]">
        <span className="font-serif italic text-[#8a7f73] mr-1">Popular:</span>
        {SHIPPING_POPULAR_QUESTIONS.map((q, idx) => (
          <React.Fragment key={q.id}>
            <button
              type="button"
              onClick={() => onSelectQuestion?.(q.id)}
              className="text-[#57534e] hover:text-[#935b1e] hover:underline cursor-pointer transition-colors"
            >
              {q.text}
            </button>
            {idx < SHIPPING_POPULAR_QUESTIONS.length - 1 && (
              <span className="text-[#dcd7ce] mx-1">·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ShippingHero;
