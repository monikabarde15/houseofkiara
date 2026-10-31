/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsClausesListColumn (Spec §7.8, Screen 50)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { TERMS_PARTS } from '../../data/termsRegistry';

interface TermsClausesListColumnProps {
  selectedClauseNum: number;
  onSelectClause: (clauseNum: number) => void;
}

export const TermsClausesListColumn: React.FC<TermsClausesListColumnProps> = ({
  selectedClauseNum,
  onSelectClause
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <div className="w-64 md:w-72 shrink-0 bg-white border border-[#ebe5dc] rounded-[8px] p-4 shadow-2xs space-y-4 max-h-[820px] overflow-y-auto text-xs">
      {/* Search Clause */}
      <div>
        <label className="block text-[11px] font-mono uppercase text-[#73675a] mb-1">
          Find a clause
        </label>
        <div className="relative">
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="A word or a clause number"
            className="w-full pl-3 pr-8 py-1.5 bg-[#faf7f2] border border-[#dcd4c7] rounded text-xs text-[#1a1612] placeholder-[#8a7f73] focus:outline-none focus:border-[#8a6a36]"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#8a7f73] hover:text-[#1a1612]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 12 Parts & Clauses List */}
      <div className="space-y-4 pt-1">
        {TERMS_PARTS.map(part => {
          const matchingClauses = part.clauses.filter(c =>
            filterQuery === '' ||
            c.number.toString().includes(filterQuery) ||
            c.title.toLowerCase().includes(filterQuery.toLowerCase())
          );

          if (filterQuery !== '' && matchingClauses.length === 0) return null;

          const isPartActive = part.clauses.some(c => c.number === selectedClauseNum);

          return (
            <div key={part.partNumber} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#73675a] py-0.5 border-b border-[#f0ebe3]">
                <span className="truncate pr-1">{part.title}</span>
                <span className="font-mono text-[10px] text-[#8a7f73] shrink-0">
                  {part.startClause} to {part.endClause}
                </span>
              </div>

              <div className="space-y-0.5 pt-0.5">
                {matchingClauses.map(clause => {
                  const isSelected = clause.number === selectedClauseNum;
                  return (
                    <button
                      key={clause.number}
                      type="button"
                      onClick={() => onSelectClause(clause.number)}
                      className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between gap-2 cursor-pointer transition-colors text-xs ${
                        isSelected
                          ? 'bg-[#faf1da] text-[#8a6a36] font-medium'
                          : 'hover:bg-[#faf7f2] text-[#1a1612]'
                      }`}
                    >
                      <span className="truncate">
                        <strong className="font-mono font-normal mr-1.5 text-[11px] text-[#8a7f73]">
                          {clause.number}
                        </strong>
                        {clause.title}
                      </span>
                      {isSelected && <span className="text-[#8a6a36] text-[10px]">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TermsClausesListColumn;
