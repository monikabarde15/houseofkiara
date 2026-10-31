/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsHero (Spec §8.12 Part 01, Screen 49/58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

interface RefundsHeroProps extends EditableFieldProps {
  onSelectQuestion?: (question: string) => void;
}

export const RefundsHero: React.FC<RefundsHeroProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onSelectQuestion
}) => {
  const [isEditingEyebrow, setIsEditingEyebrow] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const eyebrow = fieldValues['refunds_hero_eyebrow'] ?? 'OUR COMMITMENT TO YOU';
  const lead = fieldValues['refunds_hero_lead'] ??
    'Plans change, and we understand. Before you order or after, here is exactly what happens when they do, in plain words and with no surprises.';

  const popularQuestions = [
    'What do I get back if I cancel more than 7 days before my rental starts?',
    'When do I get my deposit back?',
    'Can I cancel after it has been dispatched?',
    'How long does a refund take?'
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
            onChange={(e) => onFieldChange('refunds_hero_eyebrow', e.target.value)}
            className="text-[11px] font-semibold tracking-[0.2em] text-[#935b1e] uppercase text-center border-b border-[#935b1e] bg-transparent outline-none max-w-sm mx-auto"
          />
        ) : (
          <span
            onClick={() => {
              setIsEditingEyebrow(true);
              onFocusField('refunds_hero_eyebrow');
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
          onClick={() => onFocusField('refunds_hero_heading')}
          className="text-3xl md:text-[42px] font-serif text-[#1c1917] font-normal tracking-[-0.01em] cursor-pointer hover:bg-[#fbf4ea] px-3 py-1 rounded inline-block transition-colors"
          title="Click to focus heading"
        >
          <span>Refunds & </span>
          <span className="italic font-normal text-[#935b1e]">cancellations</span>
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
            onChange={(e) => onFieldChange('refunds_hero_lead', e.target.value)}
            className="text-[#57534e] text-sm text-center border border-[#935b1e] rounded p-2 bg-transparent outline-none w-full max-w-lg mx-auto"
          />
        ) : (
          <p
            onClick={() => {
              setIsEditingLead(true);
              onFocusField('refunds_hero_lead');
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
          <span className="text-[#a8a29e] text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search a question, like "late return" or "deposit"'
            className="w-full bg-transparent text-xs sm:text-sm text-[#1c1917] placeholder-[#a8a29e] outline-none"
          />
        </div>
      </div>

      {/* Popular Questions Picks */}
      <div className="max-w-xl mx-auto text-left text-xs space-y-1.5 pt-1">
        <div className="text-[11px] text-[#8a7f73] flex items-center gap-1.5">
          <span className="font-medium text-[#1c1917]">Popular:</span>
          <span>Up to four questions, picked and ordered in Page settings</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
          {popularQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectQuestion?.(q)}
              className="text-[#1c1917] hover:text-[#935b1e] hover:underline cursor-pointer transition-colors text-[11.5px]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefundsHero;
