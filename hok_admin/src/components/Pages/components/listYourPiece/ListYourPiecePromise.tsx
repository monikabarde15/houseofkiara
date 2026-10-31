/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPiecePromise (Spec §8.8 Part 02, Page 35)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface ListYourPiecePromiseProps extends EditableFieldProps {
  hidden?: boolean;
}

export const ListYourPiecePromise: React.FC<ListYourPiecePromiseProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  const assurances = [
    {
      id: 'a1',
      title: 'Safe & Secure Storage',
      desc: 'Climate-controlled garment preservation in Indore with round the clock supervision.'
    },
    {
      id: 'a2',
      title: 'White-Glove Care',
      desc: 'Eco-dry cleaning and delicate steam pressing included between every rental booking.'
    },
    {
      id: 'a3',
      title: 'Recall Anytime',
      desc: 'Request your piece back whenever you wish with 48 hours notice between bookings.'
    },
    {
      id: 'a4',
      title: 'Transparent Earnings',
      desc: 'Real-time dashboard tracking views, rental requests, and automated direct payouts.'
    }
  ];

  return (
    <section
      id="the-listers-promise"
      className={`p-8 md:p-10 bg-white rounded-[10px] border border-[#ebe5dc] shadow-2xs space-y-8 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      {/* Pulled Quote */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <span
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_promise_eyebrow', fieldName: 'Quote Eyebrow', helpText: 'Kicker for the Lister Promise quote' })}
          onBlur={e => onFieldChange?.('lyp_promise_eyebrow', e.currentTarget.textContent || '')}
          className="text-[11px] tracking-[0.2em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          {getVal('lyp_promise_eyebrow', "THE LISTER'S PROMISE")}
        </span>

        <blockquote
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_promise_quote', fieldName: 'Quote Body', helpText: 'Main promise quote to listers' })}
          onBlur={e => onFieldChange?.('lyp_promise_quote', e.currentTarget.textContent || '')}
          className="font-serif text-xl md:text-2xl italic text-[#1a1612] leading-relaxed outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          "{getVal('lyp_promise_quote', 'We treat every piece entrusted to us as an heirloom in transit. Carefully authenticated, lovingly stored, and returned to you whenever you ask.')}"
        </blockquote>

        <div
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField?.({ fieldId: 'lyp_promise_author', fieldName: 'Quote Attribution', helpText: 'Author or source of the promise quote' })}
          onBlur={e => onFieldChange?.('lyp_promise_author', e.currentTarget.textContent || '')}
          className="text-xs text-[#8a7f73] font-mono outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
        >
          — {getVal('lyp_promise_author', 'House of Kaira Curation Standard')}
        </div>
      </div>

      {/* 4 Assurance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#f0ebe3]">
        {assurances.map((item, idx) => (
          <div key={item.id} className="p-4 bg-[#faf7f2] rounded-[8px] border border-[#eadecc]">
            <div className="text-[11px] text-[#8a6a36] font-mono mb-1">0{idx + 1}</div>
            <h4
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocusField?.({ fieldId: `lyp_assurance_${item.id}_title`, fieldName: `Assurance 0${idx+1} Title`, helpText: 'Title of assurance card' })}
              onBlur={e => onFieldChange?.(`lyp_assurance_${item.id}_title`, e.currentTarget.textContent || '')}
              className="text-sm font-semibold text-[#1a1612] mb-1.5 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
            >
              {getVal(`lyp_assurance_${item.id}_title`, item.title)}
            </h4>
            <p
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocusField?.({ fieldId: `lyp_assurance_${item.id}_desc`, fieldName: `Assurance 0${idx+1} Body`, helpText: 'Description of assurance card' })}
              onBlur={e => onFieldChange?.(`lyp_assurance_${item.id}_desc`, e.currentTarget.textContent || '')}
              className="text-xs text-[#5c5248] leading-relaxed outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
            >
              {getVal(`lyp_assurance_${item.id}_desc`, item.desc)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListYourPiecePromise;
