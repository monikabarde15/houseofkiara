/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsOpening (Spec §8.9 Part 03, Screen 49)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface TermsOpeningProps extends EditableFieldProps {
  hidden?: boolean;
}

export const TermsOpening: React.FC<TermsOpeningProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  return (
    <section
      id="opening"
      className={`pt-6 transition-opacity duration-200 ${hidden ? 'opacity-40 grayscale' : 'opacity-100'}`}
    >
      <p
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onFocusField?.({ fieldId: 'terms_opening_text', fieldName: 'Opening paragraph', helpText: 'Opening introductory statement for Terms' })}
        onBlur={e => onFieldChange?.('terms_opening_text', e.currentTarget.textContent || '')}
        className="font-serif text-lg md:text-xl text-[#1a1612] leading-relaxed max-w-2xl outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
      >
        {getVal(
          'terms_opening_text',
          'These Terms are the agreement between you and House of Kaira. We have written them to be read, in plain words, with every clause numbered so it is easy to find and share. They protect every piece, everyone who wears one, and every Lister who trusts us with theirs.'
        )}
      </p>
    </section>
  );
};

export default TermsOpening;
