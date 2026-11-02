/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PageNotFoundPaperSection (Spec § 8.18, Screen 59)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { NOT_FOUND_SCENARIOS, NotFoundScenario } from '../../data/pageNotFoundData';
import NotFoundScenarioSwitcher from './NotFoundScenarioSwitcher';
import NotFoundInvitationCard from './NotFoundInvitationCard';
import NotFoundPiecesBand from './NotFoundPiecesBand';
import NotFoundConciergeBand from './NotFoundConciergeBand';
import { EditableFieldProps } from '../types';

export interface PageNotFoundPaperSectionProps extends EditableFieldProps {
  page: any;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const PageNotFoundPaperSection: React.FC<PageNotFoundPaperSectionProps> = ({
  onSelectFigure,
  onNavigateToPage,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sold');

  const scenario: NotFoundScenario =
    NOT_FOUND_SCENARIOS.find((s) => s.id === selectedScenarioId) || NOT_FOUND_SCENARIOS[0];

  return (
    <div className="max-w-[780px] mx-auto w-full space-y-6 pt-2 pb-16">
      {/* 1. Scenario Switcher Banner */}
      <NotFoundScenarioSwitcher
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={setSelectedScenarioId}
      />

      {/* 2. Framed Invitation Card */}
      <NotFoundInvitationCard
        scenario={scenario}
        onNavigateToPage={onNavigateToPage}
        fieldValues={fieldValues}
        onFieldChange={onFieldChange}
        onFocusField={onFocusField}
      />

      {/* 3. Still Available Pieces Band */}
      <NotFoundPiecesBand scenario={scenario} />

      {/* 4. WhatsApp Concierge Band */}
      <NotFoundConciergeBand
        scenario={scenario}
        onSelectFigure={onSelectFigure}
      />

      {/* 5. Footer Hint Caption */}
      <p className="text-center text-xs text-[#8a7f73] italic pt-2">
        Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
      </p>
    </div>
  );
};

export default PageNotFoundPaperSection;
