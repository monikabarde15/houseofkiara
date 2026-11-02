/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: NoSearchPaperSection (Spec § 8.19, Screen 60)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useEffect } from 'react';
import { NO_SEARCH_SCENARIOS, NoSearchScenario } from '../../data/noSearchResultsData';
import NoSearchScenarioSwitcher from './NoSearchScenarioSwitcher';
import NoSearchInvitationCard from './NoSearchInvitationCard';
import NoSearchConciergeBand from './NoSearchConciergeBand';
import NoSearchOccasionsGrid from './NoSearchOccasionsGrid';
import NoSearchTrendingSection from './NoSearchTrendingSection';
import { EditableFieldProps } from '../types';

export interface NoSearchPaperSectionProps extends EditableFieldProps {
  page: any;
  activePartId?: string;
  onSelectPart?: (partId: string) => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const NoSearchPaperSection: React.FC<NoSearchPaperSectionProps> = ({
  activePartId = 'the-page',
  onSelectPart,
  onSelectFigure,
  onNavigateToPage,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('misspelling');

  const scenario: NoSearchScenario =
    NO_SEARCH_SCENARIOS.find((s) => s.id === selectedScenarioId) || NO_SEARCH_SCENARIOS[1];

  useEffect(() => {
    if (!activePartId) return;
    const el = document.getElementById(activePartId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activePartId]);

  return (
    <div className="max-w-[780px] mx-auto w-full space-y-6 pt-2 pb-16">
      {/* 1. Scenario Switcher */}
      <NoSearchScenarioSwitcher
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={setSelectedScenarioId}
      />

      {/* 2. Main Framed Card */}
      <section
        id="the-page"
        onClick={() => onSelectPart?.('the-page')}
        className={`transition-all rounded-[10px] cursor-pointer ${
          activePartId === 'the-page'
            ? 'ring-2 ring-[#bda67b] ring-offset-4 ring-offset-[#fffefb]'
            : 'hover:ring-1 hover:ring-[#bda67b]/50'
        }`}
      >
        <NoSearchInvitationCard
          scenario={scenario}
          fieldValues={fieldValues}
          onFieldChange={onFieldChange}
          onFocusField={onFocusField}
        />
      </section>

      {/* 3. WhatsApp Concierge Band */}
      <NoSearchConciergeBand
        onSelectFigure={onSelectFigure}
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
      />

      {/* 4. Occasions Grid */}
      <NoSearchOccasionsGrid
        onNavigateToPage={onNavigateToPage}
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
      />

      {/* 5. Trending Section */}
      <section
        id="trending"
        onClick={() => onSelectPart?.('trending')}
        className={`transition-all rounded-[10px] cursor-pointer ${
          activePartId === 'trending'
            ? 'ring-2 ring-[#bda67b] ring-offset-4 ring-offset-[#fffefb]'
            : 'hover:ring-1 hover:ring-[#bda67b]/50'
        }`}
      >
        <NoSearchTrendingSection
          fieldValues={fieldValues}
          onFieldChange={onFieldChange}
          onFocusField={onFocusField}
        />
      </section>

      {/* Footer Hint */}
      <p className="text-center text-xs text-[#8a7f73] italic pt-2">
        Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
      </p>
    </div>
  );
};

export default NoSearchPaperSection;
