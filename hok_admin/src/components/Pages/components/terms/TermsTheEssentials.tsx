/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsTheEssentials (Spec §8.9 Part 04, Page 37)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface TermsTheEssentialsProps extends EditableFieldProps {
  hidden?: boolean;
  onOpenClause?: (clauseNumber: number) => void;
}

export const TermsTheEssentials: React.FC<TermsTheEssentialsProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden,
  onOpenClause
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  const essentials = [
    { num: 12, title: 'How House of Kaira works', text: 'Your agreement is with House of Kaira, while each piece belongs to its Lister until it is sold' },
    { num: 23, title: 'Responsibility for the piece', text: 'A rental piece is your responsibility from delivery until our courier collects it' },
    { num: 20, title: 'Your security deposit', text: 'Your deposit is fully refundable after inspection, and is security rather than a limit' },
    { num: 26, title: 'Late returns', text: "A late return costs one day's rental rate for each extra day" },
    { num: 32, title: 'Not as described protection', text: 'Preloved pieces are a final sale once dispatched, and you are protected if one is not as described' },
    { num: 13, title: 'Authenticity promise', text: 'Every designer piece is reviewed, and refunded in full if it is ever shown not to be genuine' },
    { num: 34, title: 'What listers promise', text: 'Listers promise every piece is theirs, genuine and honestly described' },
    { num: 43, title: 'Cancellations by us', text: 'If we have to cancel, you never pay for it' }
  ];

  return (
    <section
      id="the-essentials"
      className={`p-6 md:p-8 bg-white border border-[#ebe5dc] rounded-[8px] shadow-2xs space-y-5 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      <div>
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'terms_essentials_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker for essentials' })}
          onBlur={e => onFieldChange?.('terms_essentials_eyebrow', e.currentTarget.textContent || '')}
          className="text-[10.5px] tracking-[0.2em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded block"
        >
          {getVal('terms_essentials_eyebrow', 'THE ESSENTIALS')}
        </span>
        <h2 className="font-serif text-2xl text-[#1a1612] font-normal mt-0.5">
          Eight points that each open a clause
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {essentials.map((item, idx) => (
          <div
            key={item.num}
            onClick={() => onOpenClause?.(item.num)}
            className="p-3.5 bg-[#faf7f2] rounded-[6px] border border-[#eadecc] hover:border-[#bda67b] cursor-pointer transition-colors flex flex-col justify-between"
          >
            <p className="text-xs text-[#1a1612] leading-snug">
              {item.text}
            </p>
            <div className="pt-2 mt-2 border-t border-[#f0ebe3] flex items-center justify-between text-[11px] text-[#8a6a36] font-mono">
              <span>Clause {item.num} · {item.title}</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[#8a7f73] italic pt-1">
        Each point links directly to the full numbered clause in the agreement below.
      </p>
    </section>
  );
};

export default TermsTheEssentials;
