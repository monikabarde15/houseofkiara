/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositFiveSteps (Spec § 8.13 Part 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { DEPOSIT_TRACKER_STEPS } from '../../data/depositRegistry';
import { EditableFieldProps } from '../types';

interface DepositFiveStepsProps extends EditableFieldProps {
  onSelectStep?: (opensAnchor: string) => void;
  onSelectFigure?: (figureKey: string) => void;
}

export const DepositFiveSteps: React.FC<DepositFiveStepsProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onSelectStep,
  onSelectFigure
}) => {
  const trackerTitle = fieldValues['tracker_title'] ?? 'Your deposit, every step of the way';
  const trackerLead = fieldValues['tracker_lead'] ?? 'Follow the same five steps in the Deposit Tracker in My Account.';

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 border-b border-[#f1eee8]">
        <h2
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('tracker_title')}
          onBlur={(e) => onFieldChange('tracker_title', e.currentTarget.textContent || '')}
          className="font-serif text-2xl text-[#1c1917] outline-hidden hover:bg-[#fbf9f5] rounded px-1 -mx-1"
        >
          {trackerTitle}
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField('tracker_lead')}
          onBlur={(e) => onFieldChange('tracker_lead', e.currentTarget.textContent || '')}
          className="text-xs text-[#8a7f73] outline-hidden hover:bg-[#fbf9f5] rounded px-1 -mx-1"
        >
          {trackerLead}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-6">
        {DEPOSIT_TRACKER_STEPS.map((step) => (
          <div
            key={step.number}
            onClick={() => onSelectStep?.(step.opens)}
            className="group cursor-pointer p-3 rounded-lg border border-[#f4f0eb] hover:border-[#dbc8af] hover:bg-[#fcfaf7] transition-all flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-xs font-semibold text-[#935b1e] tracking-wider block mb-1.5">
                0{step.number}
              </span>
              <h4 className="font-serif text-[15px] font-medium text-[#1c1917] group-hover:text-[#935b1e] transition-colors leading-snug">
                {step.name}
              </h4>
            </div>
            <p className="text-[11px] text-[#6d665d] mt-2 leading-relaxed">
              {step.timing}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositFiveSteps;
