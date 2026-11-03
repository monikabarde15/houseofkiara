/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: MaintenanceScenarioSwitcher (Spec §8.20, Screen 61)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { MAINTENANCE_SCENARIOS, MaintenanceScenario } from '../../data/maintenanceData';

interface MaintenanceScenarioSwitcherProps {
  activeScenarioId: string;
  onSelectScenario: (scenario: MaintenanceScenario) => void;
}

export const MaintenanceScenarioSwitcher: React.FC<MaintenanceScenarioSwitcherProps> = ({
  activeScenarioId,
  onSelectScenario
}) => {
  return (
    <div className="w-full max-w-[700px] mx-auto mb-6 p-2 rounded-[6px] border border-dashed border-[#d8cfc0] bg-[#faf8f5]/60 flex items-center justify-center gap-3 text-xs">
      <span className="text-[#8a7f73] font-serif text-[12.5px] italic">
        Showing the page for
      </span>
      <div className="flex items-center gap-2">
        {MAINTENANCE_SCENARIOS.map((sc) => {
          const isActive = sc.id === activeScenarioId;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScenario(sc)}
              className={`px-3 py-1 rounded-[14px] text-[11.5px] transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1a1612] text-white shadow-xs font-medium'
                  : 'bg-white border border-[#e6dccb] text-[#5c5248] hover:border-[#bda67b] hover:text-[#1a1612]'
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

export default MaintenanceScenarioSwitcher;
