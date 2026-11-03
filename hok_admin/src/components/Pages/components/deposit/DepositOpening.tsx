/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositOpening (Spec § 8.13 Part 03)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

export const DepositOpening: React.FC<EditableFieldProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const openingText = fieldValues['opening_body'] ??
    'Every piece at House of Kaira carries a story, often one its owner holds dear. Your refundable security deposit keeps that story safe for the next person who wears it. It remains yours throughout: when your piece returns on time and as it left us, every rupee is returned to you.';

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 shadow-xs">
      <div className="text-[11px] font-mono tracking-widest uppercase text-[#935b1e] mb-3">
        Opening note
      </div>
      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField('opening_body')}
        onBlur={(e) => onFieldChange('opening_body', e.currentTarget.textContent || '')}
        className="font-serif text-lg sm:text-xl text-[#292524] leading-relaxed outline-hidden hover:bg-[#fbf9f5] rounded p-1 -m-1 transition-colors"
      >
        {openingText}
      </p>
    </div>
  );
};

export default DepositOpening;
