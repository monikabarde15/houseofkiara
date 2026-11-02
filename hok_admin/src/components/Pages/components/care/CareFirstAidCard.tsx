/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CareFirstAidCard (Spec § 8.14 Part 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FIRST_AID_STEPS } from '../../data/careRegistry';
import { EditableFieldProps } from '../types';

interface CareFirstAidCardProps extends EditableFieldProps {
  onSelectStep?: (opensAnchor: string) => void;
}

export const CareFirstAidCard: React.FC<CareFirstAidCardProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onSelectStep
}) => {
  const cardTitle = fieldValues['fa_title'] ?? 'If something happens';
  const cardLead = fieldValues['fa_lead'] ??
    'A spill at dinner, a snag on the dance floor, a hook that gives way. Most things can be beautifully restored when we hear about them early.';

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f1eee8]">
        <div>
          <h2
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('fa_title')}
            onBlur={(e) => onFieldChange('fa_title', e.currentTarget.textContent || '')}
            className="font-serif text-2xl text-[#1c1917] outline-hidden hover:bg-[#fbf9f5] rounded px-1 -mx-1"
          >
            {cardTitle}
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField('fa_lead')}
            onBlur={(e) => onFieldChange('fa_lead', e.currentTarget.textContent || '')}
            className="text-xs text-[#57534e] mt-1 outline-hidden hover:bg-[#fbf9f5] rounded px-1 -mx-1 leading-relaxed max-w-xl"
          >
            {cardLead}
          </p>
        </div>
        <a
          href="https://wa.me/919340139300"
          target="_blank"
          rel="noreferrer"
          className="bg-[#2e7d32] text-white hover:bg-[#256628] text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Message us on WhatsApp</span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6">
        {FIRST_AID_STEPS.map((step) => (
          <div
            key={step.num}
            onClick={() => onSelectStep?.(step.opens)}
            className="p-4 rounded-lg border border-[#f4f0eb] hover:border-[#dbc8af] hover:bg-[#fcfaf7] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-xs font-semibold text-[#935b1e] tracking-wider block mb-1.5">
                0{step.num}
              </span>
              <h3 className="font-serif text-base font-medium text-[#1c1917] group-hover:text-[#935b1e] transition-colors leading-snug">
                {step.title}
              </h3>
            </div>
            <p className="text-xs text-[#6d665d] mt-2.5 leading-relaxed">
              {step.line}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareFirstAidCard;
