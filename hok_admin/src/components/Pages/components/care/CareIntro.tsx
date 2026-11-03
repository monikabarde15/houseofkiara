/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CareIntro (Spec § 8.14 Part 03)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

export const CareIntro: React.FC<EditableFieldProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const introBody = fieldValues['care_intro_body'] ??
    'We ask one thing of everyone who rents with us: treat the piece as your own. It was part of someone\'s most special day, and it will be part of someone else\'s next. The cleaning is always ours, and so are the gentle signs of a wonderful evening.';

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[10px] p-6 sm:p-8 shadow-xs">
      <div className="text-[11px] font-mono tracking-widest uppercase text-[#935b1e] mb-3">
        Our one request
      </div>
      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField('care_intro_body')}
        onBlur={(e) => onFieldChange('care_intro_body', e.currentTarget.textContent || '')}
        className="font-serif text-lg sm:text-xl text-[#292524] leading-relaxed outline-hidden hover:bg-[#fbf9f5] rounded p-1 -m-1 transition-colors"
      >
        {introBody}
      </p>
    </div>
  );
};

export default CareIntro;
