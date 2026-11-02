/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NoSearchPageSettingsCard (Spec § 8.19 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import {
  NO_SEARCH_SCENARIOS,
  NO_SEARCH_OCCASIONS,
  NO_SEARCH_TRENDING_CHIPS
} from '../../data/noSearchResultsData';

export const NoSearchPageSettingsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'occasions' | 'trending'>('scenarios');

  return (
    <div className="space-y-6 text-xs">
      {/* Subtab navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#ebe5dc] pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('scenarios')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'scenarios'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Scenarios (5)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('occasions')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'occasions'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Occasions (8)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('trending')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'trending'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Trending (8)
        </button>
      </div>

      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Search Result Fallbacks
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            When a query yields no matches, the system evaluates misspellings, multiple words, rental constraints, and designer availability to choose the most helpful response.
          </p>
          <div className="space-y-2 pt-1">
            {NO_SEARCH_SCENARIOS.map((sc, idx) => (
              <div
                key={sc.id}
                className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1a1612]">
                    {idx + 1}. {sc.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#935b1e] uppercase">
                    {sc.id}
                  </span>
                </div>
                <div className="text-[#73675a] text-[11px] leading-relaxed">
                  Formula: {sc.headingPrefix}[query]{sc.headingSuffix}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'occasions' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Occasion Discovery Grid
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            Eight catalogue occasions with Roman numeral badges allow shoppers to browse by event when specific searches fail.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {NO_SEARCH_OCCASIONS.map((occ) => (
              <div
                key={occ.title}
                className="p-2.5 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-0.5"
              >
                <div className="text-[10px] font-mono text-[#8a7f73]">{occ.num}</div>
                <div className="font-medium text-[#1a1612] text-[11.5px]">{occ.title}</div>
                <div className="text-[10px] font-mono text-[#935b1e]">{occ.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'trending' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Trending Searches Chips
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            Popular curated queries pulled from Site Settings header configuration to guide visitors toward current collections.
          </p>
          <div className="space-y-1.5 pt-1">
            {NO_SEARCH_TRENDING_CHIPS.map((chip, idx) => (
              <div
                key={chip}
                className="p-2.5 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] flex items-center justify-between text-[11.5px]"
              >
                <span className="text-[#1a1612] font-medium">{chip}</span>
                <span className="text-[10px] font-mono text-[#8a7f73]">
                  rank 0{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoSearchPageSettingsCard;
