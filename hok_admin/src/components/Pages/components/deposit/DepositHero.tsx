/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositHero (Spec § 8.13 Part 01, Screen 51)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

interface DepositHeroProps extends EditableFieldProps {
  onSelectQuestion?: (anchor: string) => void;
}

export const DepositHero: React.FC<DepositHeroProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onSelectQuestion
}) => {
  const [isEditingEyebrow, setIsEditingEyebrow] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const eyebrow = fieldValues['deposit_hero_eyebrow'] ?? 'A FULLY REFUNDABLE DEPOSIT';
  const headingPrefix = fieldValues['deposit_hero_heading_prefix'] ?? 'Security deposit ';
  const headingAccent = fieldValues['deposit_hero_heading_accent'] ?? 'policy';
  const lead = fieldValues['deposit_hero_lead'] ??
    'How your security deposit is held and returned at House of Kaira: when it is due, how to pay it, how each piece is inspected, and exactly what can and cannot be deducted.';

  const popularQuestions = [
    { text: 'When is my deposit due?', anchor: '#p-when' },
    { text: 'When do I get my deposit back?', anchor: '#f-when' },
    { text: 'What counts as normal wear?', anchor: '#h-wear' },
    { text: 'How is a deduction worked out?', anchor: '#x-amount' }
  ];

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-8 md:p-12 shadow-2xs text-center transition-all hover:border-[#dbc8af]">
      {/* Eyebrow */}
      <div className="mb-3">
        {isEditingEyebrow ? (
          <input
            type="text"
            value={eyebrow}
            autoFocus
            onBlur={() => setIsEditingEyebrow(false)}
            onChange={(e) => onFieldChange('deposit_hero_eyebrow', e.target.value)}
            className="text-[11px] font-semibold tracking-[0.2em] text-[#935b1e] uppercase text-center border-b border-[#935b1e] bg-transparent outline-none max-w-sm mx-auto"
          />
        ) : (
          <span
            onClick={() => {
              setIsEditingEyebrow(true);
              onFocusField('deposit_hero_eyebrow');
            }}
            className="text-[11px] font-semibold tracking-[0.2em] text-[#935b1e] uppercase cursor-pointer hover:bg-[#fbf4ea] px-2 py-0.5 rounded transition-colors"
            title="Click to edit eyebrow"
          >
            {eyebrow}
          </span>
        )}
      </div>

      {/* Main Heading */}
      <div className="mb-4">
        <h1
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('deposit_hero_heading')}
          onBlur={(e) => onFieldChange('deposit_hero_heading', e.currentTarget.textContent || '')}
          className="text-3xl md:text-[42px] font-serif text-[#1c1917] font-normal tracking-[-0.01em] cursor-text hover:bg-[#fbf4ea] px-3 py-1 rounded inline-block transition-colors outline-hidden"
          title="Click to edit heading"
        >
          <span>{headingPrefix}</span>
          <span className="italic font-normal text-[#935b1e]">{headingAccent}</span>
        </h1>
      </div>

      {/* Lead Subtitle */}
      <div className="mb-8">
        {isEditingLead ? (
          <textarea
            value={lead}
            autoFocus
            rows={2}
            onBlur={() => setIsEditingLead(false)}
            onChange={(e) => onFieldChange('deposit_hero_lead', e.target.value)}
            className="text-[#57534e] text-sm text-center border border-[#935b1e] rounded p-2 bg-transparent outline-none w-full max-w-lg mx-auto"
          />
        ) : (
          <p
            onClick={() => {
              setIsEditingLead(true);
              onFocusField('deposit_hero_lead');
            }}
            className="text-[#57534e] text-sm max-w-lg mx-auto leading-relaxed cursor-pointer hover:bg-[#fbf4ea] p-1.5 rounded transition-colors"
            title="Click to edit lead text"
          >
            {lead}
          </p>
        )}
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto mb-6">
        <div className="relative border-b border-[#1c1917]/20 pb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#8a7f73] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSelectQuestion?.(searchQuery);
              }
            }}
            placeholder="Search deposit questions, like 'when is it due' or 'normal wear'"
            className="w-full bg-transparent text-sm text-[#1c1917] placeholder:text-[#a8a29e] outline-none"
          />
        </div>
      </div>

      {/* Popular Links */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#73675a]">
        <span className="text-[#8a7f73]">Popular:</span>
        {popularQuestions.map((q) => (
          <button
            key={q.anchor}
            type="button"
            onClick={() => onSelectQuestion?.(q.anchor)}
            className="hover:text-[#935b1e] hover:underline transition-colors cursor-pointer text-left"
          >
            {q.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepositHero;
