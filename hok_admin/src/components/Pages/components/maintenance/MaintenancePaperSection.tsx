/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: MaintenancePaperSection (Spec §8.20, Screen 61)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../../types';
import { MAINTENANCE_SCENARIOS, MaintenanceScenario } from '../../data/maintenanceData';
import { MaintenanceScenarioSwitcher } from './MaintenanceScenarioSwitcher';
import { MaintenanceCard } from './MaintenanceCard';
import { MaintenanceFooter } from './MaintenanceFooter';

interface MaintenancePaperSectionProps {
  page: PageCardData;
  fieldValues?: Record<string, string>;
  onFieldChange?: (fieldKey: string, value: string) => void;
  onFocusField?: (fieldKey: string, fieldTitle: string, initialValue: string) => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const MaintenancePaperSection: React.FC<MaintenancePaperSectionProps> = ({
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onSelectFigure = () => {}
}) => {
  // Scenario 2 ("late") is active by default to match Screen 61
  const [activeScenario, setActiveScenario] = useState<MaintenanceScenario>(
    MAINTENANCE_SCENARIOS[1]
  );

  return (
    <div id="the-page" className="w-full flex flex-col items-center">
      {/* 1. Scenario switcher */}
      <MaintenanceScenarioSwitcher
        activeScenarioId={activeScenario.id}
        onSelectScenario={(sc) => setActiveScenario(sc)}
      />

      {/* 2. Framed maintenance card */}
      <MaintenanceCard
        scenario={activeScenario}
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
        onSelectFigure={onSelectFigure}
      />

      {/* 3. Footer and refresh note */}
      <MaintenanceFooter
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
      />

      {/* 4. Canvas bottom helper prompt */}
      <div className="w-full text-center text-[11.5px] text-[#8a7f73] italic pt-4 pb-2 border-t border-[#f0eae1]">
        Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
      </div>
    </div>
  );
};

export default MaintenancePaperSection;
