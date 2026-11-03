/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsClausePaperColumn (Spec §7.8, Screen 50)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { TERMS_PARTS } from '../../data/termsRegistry';
import { EditableFieldProps } from '../types';

interface TermsClausePaperColumnProps extends EditableFieldProps {
  selectedClauseNum: number;
}

export const TermsClausePaperColumn: React.FC<TermsClausePaperColumnProps> = ({
  selectedClauseNum,
  fieldValues,
  onFieldChange,
  onFocusField
}) => {
  const getVal = (key: string, fallback: string) => fieldValues[key] ?? fallback;

  // Find part containing this clause
  const activePart = TERMS_PARTS.find(p => p.clauses.some(c => c.number === selectedClauseNum)) || TERMS_PARTS[8];
  const activeClause = activePart.clauses.find(c => c.number === selectedClauseNum) || activePart.clauses[1];

  return (
    <div className="flex-1 min-w-0 max-w-[680px] bg-white border border-[#ebe5dc] rounded-[10px] p-8 md:p-12 shadow-sm space-y-8">
      {/* Part Header (Screen 50) */}
      <div className="space-y-1.5 border-b border-[#f0ebe3] pb-4">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#8a7f73]">
          CLAUSES {activePart.startClause} TO {activePart.endClause}
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-[#1a1612]">
          <span>{activePart.title.replace(activePart.italicWord || '', '')}</span>
          {activePart.italicWord && (
            <span className="italic text-[#8a6a36] font-normal">
              {activePart.italicWord}
            </span>
          )}
        </h2>
        <p className="text-xs text-[#5c5248] leading-relaxed">
          {activePart.description}
        </p>
      </div>

      {/* Clause Title & Numeral */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl md:text-2xl text-[#1a1612] flex items-baseline gap-2">
          <span className="text-[#8a6a36] font-normal">{activeClause.number}</span>
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField?.({ fieldId: `terms_clause_${activeClause.number}_title`, fieldName: `Clause ${activeClause.number} Title`, helpText: 'Title of this clause' })}
            onBlur={e => onFieldChange?.(`terms_clause_${activeClause.number}_title`, e.currentTarget.textContent || '')}
            className="outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
          >
            {getVal(`terms_clause_${activeClause.number}_title`, activeClause.title)}
          </span>
        </h3>

        {/* Sub-clauses (Screen 50) */}
        <div className="space-y-4 pt-2">
          {activeClause.subclauses && activeClause.subclauses.length > 0 ? (
            activeClause.subclauses.map((sub, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-[#1a1612]">
                <span className="font-mono text-[#8a7f73] shrink-0 pt-0.5 text-[11px]">
                  {activeClause.number}.{idx + 1}
                </span>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => onFocusField?.({ fieldId: `terms_sub_${activeClause.number}_${idx + 1}`, fieldName: `Sub-clause ${activeClause.number}.${idx + 1}`, helpText: 'Text of this sub-clause' })}
                  onBlur={e => onFieldChange?.(`terms_sub_${activeClause.number}_${idx + 1}`, e.currentTarget.textContent || '')}
                  className="flex-1 outline-none focus:ring-1 focus:ring-[#c5ad7d] px-1 rounded cursor-text"
                >
                  {getVal(`terms_sub_${activeClause.number}_${idx + 1}`, typeof sub === 'string' ? sub : (sub as any).text)}
                </p>
              </div>
            ))
          ) : (
            <div className="text-xs text-[#5c5248] leading-relaxed">
              No sub-clauses defined. Click below to add one.
            </div>
          )}
        </div>

        {/* Add sub-clause button */}
        <div className="pt-2">
          <button
            type="button"
            className="text-xs text-[#8a6a36] hover:underline cursor-pointer font-medium"
          >
            + Add a sub-clause
          </button>
        </div>
      </div>

      {/* Footer helper note */}
      <div className="pt-8 border-t border-[#f0ebe3] text-[11px] text-[#8a7f73] italic">
        Click a clause in the list to open it here. Every word on the paper is edited where it prints.
      </div>
    </div>
  );
};

export default TermsClausePaperColumn;
