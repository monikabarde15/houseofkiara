/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsOpening (Spec §8.12 Part 03)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { EditableFieldProps } from '../types';

interface RefundsOpeningProps extends EditableFieldProps {
  activeTab: 'rental' | 'preloved';
}

export const RefundsOpening: React.FC<RefundsOpeningProps> = ({
  activeTab,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const defaultRental =
    'When you rent with House of Kaira, your piece is held for you alone: turned away from everyone else, then cleaned, pressed and packed for your dates. Our policy is built to be fair to you and to the next person waiting to wear it. And whenever something is on us, you never pay for it.';

  const defaultPreloved =
    'Every preloved piece on House of Kaira is authenticated, cleaned and carefully presented before it is listed. Because each is a unique piece sold by its owner, our cancellation and return policy balances fairness to buyers with certainty for sellers.';

  const key = activeTab === 'rental' ? 'refunds_opening_rental' : 'refunds_opening_preloved';
  const text = fieldValues[key] ?? (activeTab === 'rental' ? defaultRental : defaultPreloved);

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 md:p-8 shadow-2xs space-y-3 transition-all hover:border-[#dbc8af]">
      <div className="text-[10px] font-semibold tracking-[0.2em] text-[#935b1e] uppercase">
        {activeTab === 'rental' ? 'RENTAL POLICY' : 'PRELOVED POLICY'}
      </div>

      <div>
        {isEditing ? (
          <textarea
            value={text}
            autoFocus
            rows={4}
            onBlur={() => setIsEditing(false)}
            onChange={(e) => onFieldChange(key, e.target.value)}
            className="w-full text-base md:text-[17px] font-serif leading-relaxed text-[#1c1917] border border-[#935b1e] rounded p-2 bg-transparent outline-none"
          />
        ) : (
          <p
            onClick={() => {
              setIsEditing(true);
              onFocusField(key);
            }}
            className="text-base md:text-[17px] font-serif leading-relaxed text-[#1c1917] cursor-pointer hover:bg-[#fbf4ea] p-1.5 rounded transition-colors"
            title="Click to edit opening paragraph"
          >
            {activeTab === 'rental' ? (
              <>
                When you rent with House of Kaira, your piece is held for you alone: turned away from everyone else, then cleaned, pressed and packed for your dates. Our policy is built to be fair to you and to the next person waiting to wear it. And whenever something is on us, <strong className="font-semibold text-[#1c1917]">you never pay for it.</strong>
              </>
            ) : (
              text
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default RefundsOpening;
