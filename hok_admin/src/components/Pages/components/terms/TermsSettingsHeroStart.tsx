/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsSettingsHeroStart (Spec §8.9 Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface TermsSettingsHeroStartProps {
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
}

export const TermsSettingsHeroStart: React.FC<TermsSettingsHeroStartProps> = ({
  hiddenParts,
  onTogglePartHidden
}) => {
  return (
    <div className="space-y-6">
      {/* 01 Hero Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 01 · Hero</div>
            <div className="text-[11px] text-[#73675a]">Heading, search and popular clauses</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['hero']}
              onChange={() => onTogglePartHidden('hero')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] text-[#8a7f73]">Popular clauses (4 picks):</div>
          {[
            'Your security deposit',
            'Responsibility for the piece while it is with you',
            'Late returns',
            'If a preloved piece is not as described'
          ].map((title, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <span className="text-[#1a1612]">{idx + 1}. {title}</span>
              <span className="text-[10px] text-[#8a6a36] font-mono">Pick {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 02 Where to start Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 02 · Where to start</div>
            <div className="text-[11px] text-[#73675a]">Three quick entry cards jumping to parts</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['where-to-start']}
              onChange={() => onTogglePartHidden('where-to-start')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-2">
          {[
            { tag: 'For every rental', title: 'Renting a piece', target: 'Clauses 18 to 28' },
            { tag: 'For every preloved piece', title: 'Buying preloved', target: 'Clauses 29 to 32' },
            { tag: 'For every piece you list', title: 'Listing a piece', target: 'Clauses 33 to 38' }
          ].map((c, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 px-2.5 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <div>
                <div className="font-medium text-[#1a1612]">{c.title}</div>
                <div className="text-[10px] text-[#8a7f73]">{c.tag}</div>
              </div>
              <span className="text-[11px] font-mono text-[#8a6a36]">{c.target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 04 The Essentials Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 04 · The essentials</div>
            <div className="text-[11px] text-[#73675a]">Eight points each mapped to a clause</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['the-essentials']}
              onChange={() => onTogglePartHidden('the-essentials')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="text-[11px] text-[#8a7f73] leading-relaxed">
          Clauses are chosen from the 59 clauses and automatically renumber if clauses are inserted or removed.
        </div>
      </div>
    </div>
  );
};

export default TermsSettingsHeroStart;
