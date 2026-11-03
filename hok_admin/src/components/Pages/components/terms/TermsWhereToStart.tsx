/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsWhereToStart (Spec §8.9 Part 02, Screen 49)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface TermsWhereToStartProps extends EditableFieldProps {
  hidden?: boolean;
  onOpenClauseRange?: (start: number, end: number) => void;
}

export const TermsWhereToStart: React.FC<TermsWhereToStartProps> = ({
  fieldValues,
  onFieldChange,
  onFocusField,
  hidden,
  onOpenClauseRange
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  const cards = [
    {
      id: 'c1',
      tag: 'FOR EVERY RENTAL',
      title: 'Renting a piece',
      range: 'CLAUSES 18 TO 28',
      start: 18,
      end: 28
    },
    {
      id: 'c2',
      tag: 'FOR EVERY PRELOVED PIECE',
      title: 'Buying preloved',
      range: 'CLAUSES 29 TO 32',
      start: 29,
      end: 32
    },
    {
      id: 'c3',
      tag: 'FOR EVERY PIECE YOU LIST',
      title: 'Listing a piece',
      range: 'CLAUSES 33 TO 38',
      start: 33,
      end: 38
    }
  ];

  return (
    <section
      id="where-to-start"
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 transition-opacity duration-200 ${
        hidden ? 'opacity-40 grayscale' : 'opacity-100'
      }`}
    >
      {cards.map(card => (
        <div
          key={card.id}
          onClick={() => onOpenClauseRange?.(card.start, card.end)}
          className="p-5 bg-white border border-[#ebe5dc] rounded-[8px] shadow-2xs hover:border-[#bda67b] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <span
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocusField?.({ fieldId: `terms_card_${card.id}_tag`, fieldName: `${card.title} tag`, helpText: 'Small tag over card title' })}
              onBlur={e => onFieldChange?.(`terms_card_${card.id}_tag`, e.currentTarget.textContent || '')}
              className="text-[10px] tracking-[0.2em] uppercase text-[#8a6a36] font-medium outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded block mb-1"
            >
              {getVal(`terms_card_${card.id}_tag`, card.tag)}
            </span>

            <h3
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocusField?.({ fieldId: `terms_card_${card.id}_title`, fieldName: `${card.title} heading`, helpText: 'Card title' })}
              onBlur={e => onFieldChange?.(`terms_card_${card.id}_title`, e.currentTarget.textContent || '')}
              className="font-serif text-lg text-[#1a1612] font-normal outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded"
            >
              {getVal(`terms_card_${card.id}_title`, card.title)}
            </h3>
          </div>

          <div className="pt-4 border-t border-[#f0ebe3] mt-4 flex items-center justify-between text-[11px] text-[#8a7f73] font-mono">
            <span>{card.range}</span>
            <span className="text-[#8a6a36]">→</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TermsWhereToStart;
