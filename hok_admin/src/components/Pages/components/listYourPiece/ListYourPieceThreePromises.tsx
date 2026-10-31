/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceThreePromises (Spec §8.8 Part 03, Page 35)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface ListYourPieceThreePromisesProps extends EditableFieldProps {
  hidden?: boolean;
}

export const ListYourPieceThreePromises: React.FC<ListYourPieceThreePromisesProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  const promises = [
    {
      id: 'p1',
      kicker: 'PROMISE 01',
      p1: 'You own the piece, ',
      gold: 'always and completely',
      p3: ', without dispute.',
      body: 'We never take title or claim ownership. You set the dates you need it back, or recall it permanently whenever you choose.'
    },
    {
      id: 'p2',
      kicker: 'PROMISE 02',
      p1: 'Fast, transparent payouts ',
      gold: 'within 3 working days',
      p3: ' of each rental.',
      body: 'Money moves straight to your bank account as soon as the rental cycle completes and our quality check clears.'
    },
    {
      id: 'p3',
      kicker: 'PROMISE 03',
      p1: 'Full replacement security ',
      gold: 'if damage cannot be restored',
      p3: ', guaranteed.',
      body: 'Minor wear is on us. Irreparable damage triggers agreed valuation compensation covered under our Lister Protection guarantee.'
    }
  ];

  return (
    <section
      id="three-promises"
      className={`p-8 md:p-10 bg-white rounded-[10px] border border-[#ebe5dc] shadow-2xs space-y-6 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      {/* Header */}
      <div>
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_promises_eyebrow', fieldName: 'Eyebrow', helpText: 'Kicker for three promises' })}
          onBlur={e => onFieldChange?.('lyp_promises_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] tracking-[0.2em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_promises_eyebrow', 'THREE PROMISES')}
        </span>
        <h2
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_promises_heading', fieldName: 'Heading', helpText: 'Headline for three promises' })}
          onBlur={e => onFieldChange?.('lyp_promises_heading', e.currentTarget.textContent || '')}
          className="font-serif text-2xl md:text-3xl text-[#1a1612] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_promises_heading', 'What we guarantee to every lister')}
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_promises_lead', fieldName: 'Line under heading', helpText: 'Lead text for three promises' })}
          onBlur={e => onFieldChange?.('lyp_promises_lead', e.currentTarget.textContent || '')}
          className="text-xs text-[#5c5248] mt-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_promises_lead', 'Clear commitments, never fine print.')}
        </p>
      </div>

      {/* Promises List */}
      <div className="space-y-4 pt-2">
        {promises.map(item => (
          <div key={item.id} className="p-5 bg-[#faf7f2] rounded-[8px] border border-[#eadecc] space-y-2">
            <span className="text-[11px] font-mono text-[#8a6a36] tracking-wider font-semibold">
              {item.kicker}
            </span>
            <h3 className="font-serif text-lg md:text-xl text-[#1a1612] leading-snug">
              <span>{getVal(`lyp_${item.id}_p1`, item.p1)}</span>
              <span className="text-[#8a6a36] italic">{getVal(`lyp_${item.id}_gold`, item.gold)}</span>
              <span>{getVal(`lyp_${item.id}_p3`, item.p3)}</span>
            </h3>
            <p
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocusField?.({ fieldId: `lyp_${item.id}_body`, fieldName: `${item.kicker} Body`, helpText: 'Body text for commitment' })}
              onBlur={e => onFieldChange?.(`lyp_${item.id}_body`, e.currentTarget.textContent || '')}
              className="text-xs text-[#5c5248] leading-relaxed outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
            >
              {getVal(`lyp_${item.id}_body`, item.body)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListYourPieceThreePromises;
