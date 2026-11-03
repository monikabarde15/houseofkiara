/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NoSearchScenarioSwitcher (Spec § 8.19, Screen 60)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { NO_SEARCH_SCENARIOS } from '../../data/noSearchResultsData';

export interface NoSearchScenarioSwitcherProps {
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
}

export const NoSearchScenarioSwitcher: React.FC<NoSearchScenarioSwitcherProps> = ({
  selectedScenarioId,
  onSelectScenario
}) => {
  return (
    <div className="bg-[#fcfaf7] border border-dashed border-[#ded8cf] rounded-[10px] p-4 sm:p-5 space-y-2.5">
      <div className="text-[11px] font-mono text-[#8a7f73] uppercase tracking-wider">
        Showing the page for
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {NO_SEARCH_SCENARIOS.map((sc) => {
          const isActive = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScenario(sc.id)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'bg-white text-[#57534e] border border-[#ded8cf] hover:border-[#c5ad7d] hover:text-[#1c1917]'
              }`}
            >
              {sc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NoSearchScenarioSwitcher;
