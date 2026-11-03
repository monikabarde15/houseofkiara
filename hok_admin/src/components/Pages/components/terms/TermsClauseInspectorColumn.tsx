/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsClauseInspectorColumn (Spec §7.8, Screen 50)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { TERMS_PARTS } from '../../data/termsRegistry';

interface TermsClauseInspectorColumnProps {
  selectedClauseNum: number;
  onClose?: () => void;
}

export const TermsClauseInspectorColumn: React.FC<TermsClauseInspectorColumnProps> = ({
  selectedClauseNum,
  onClose
}) => {
  const activePart = TERMS_PARTS.find(p => p.clauses.some(c => c.number === selectedClauseNum)) || TERMS_PARTS[8];
  const activeClause = activePart.clauses.find(c => c.number === selectedClauseNum) || activePart.clauses[1];

  const [searchWords, setSearchWords] = useState('my photos reviews story licence consent use m');
  const [linkName, setLinkName] = useState('your-content');

  return (
    <div className="w-80 shrink-0 bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-5 text-xs max-h-[820px] overflow-y-auto">
      {/* Header & Meta */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-[#73675a]">
          <span>Clause {activeClause.number}, in {activePart.title}</span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#8a7f73] hover:text-[#1a1612] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <h3 className="font-serif text-lg text-[#1a1612] mt-1 font-normal">
          {activeClause.title}
        </h3>
        <p className="text-[11px] text-[#8a7f73] mt-1.5 leading-relaxed">
          Numbered by its place, never typed. Other clauses point at it as a reference that renumbers itself if clauses move.
        </p>
      </div>

      {/* Actions (Screen 50) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#f0ebe3]">
        <button
          type="button"
          className="px-2.5 py-1 bg-[#faf7f2] border border-[#dcd4c7] rounded text-[11px] text-[#5c5248] hover:text-[#1a1612] cursor-pointer"
        >
          Move earlier
        </button>
        <button
          type="button"
          className="px-2.5 py-1 bg-[#faf7f2] border border-[#dcd4c7] rounded text-[11px] text-[#5c5248] hover:text-[#1a1612] cursor-pointer"
        >
          Move later
        </button>
        <button
          type="button"
          className="px-2.5 py-1 bg-[#faf7f2] border border-[#dcd4c7] rounded text-[11px] text-[#5c5248] hover:text-[#1a1612] cursor-pointer"
        >
          Add a clause after
        </button>
        <button
          type="button"
          className="px-2.5 py-1 text-[11px] text-[#b85c38] hover:underline cursor-pointer ml-auto"
        >
          Delete
        </button>
      </div>

      {/* Finding it Section (Screen 50) */}
      <div className="space-y-3 pt-3 border-t border-[#f0ebe3]">
        <h4 className="font-semibold text-[#1a1612] text-xs">Finding it</h4>

        <div>
          <label className="block text-[11px] text-[#5c5248] mb-1">Search words</label>
          <input
            type="text"
            value={searchWords}
            onChange={e => setSearchWords(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-[#dcd4c7] rounded text-xs text-[#1a1612] focus:outline-none focus:border-[#8a6a36]"
          />
          <p className="text-[10.5px] text-[#8a7f73] mt-1">
            Words a customer might type that are not in the clause. Never shown.
          </p>
        </div>

        <div>
          <label className="block text-[11px] text-[#5c5248] mb-1">Link name</label>
          <input
            type="text"
            value={linkName}
            onChange={e => setLinkName(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white border border-[#dcd4c7] rounded text-xs font-mono text-[#1a1612] focus:outline-none focus:border-[#8a6a36]"
          />
          <p className="text-[10.5px] text-[#8a7f73] mt-1">
            Written as <code className="bg-[#faf7f2] px-1 py-0.2 rounded border border-[#e6dccb]">{`[[c:${linkName}]]`}</code> in other clauses, it prints "clause {activeClause.number}".
          </p>
        </div>
      </div>

      {/* Sub-clauses Management Section (Screen 50) */}
      <div className="space-y-3 pt-3 border-t border-[#f0ebe3]">
        <h4 className="font-semibold text-[#1a1612] text-xs">Sub-clauses</h4>

        <div className="space-y-2">
          {activeClause.subclauses && activeClause.subclauses.map((sub, idx) => (
            <div key={idx} className="p-2.5 bg-[#faf7f2] border border-[#e6dccb] rounded space-y-1.5">
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <span className="font-mono text-[#8a7f73] font-semibold">{activeClause.number}.{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button type="button" className="p-0.5 text-[#8a7f73] hover:text-[#1a1612] cursor-pointer">▲</button>
                  <button type="button" className="p-0.5 text-[#8a7f73] hover:text-[#1a1612] cursor-pointer">▼</button>
                  <button type="button" className="p-0.5 text-[#b85c38] hover:text-[#943818] cursor-pointer">🗑</button>
                </div>
              </div>
              <p className="text-[11px] text-[#5c5248] line-clamp-2">
                {typeof sub === 'string' ? sub : (sub as any).text}
              </p>
              <button
                type="button"
                className="text-[10.5px] text-[#8a6a36] hover:underline cursor-pointer block"
              >
                Turn it into a list with (a), (b)
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full py-1.5 bg-[#faf7f2] border border-[#dcd4c7] rounded text-center text-xs text-[#5c5248] hover:text-[#1a1612] hover:bg-[#f0ebe3] cursor-pointer transition-colors"
        >
          + Add a sub-clause
        </button>
      </div>
    </div>
  );
};

export default TermsClauseInspectorColumn;
