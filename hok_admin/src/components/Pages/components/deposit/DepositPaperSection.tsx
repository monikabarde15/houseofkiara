/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositPaperSection (Spec § 8.13, Screen 51)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useEffect } from 'react';
import DepositHero from './DepositHero';
import DepositFiveSteps from './DepositFiveSteps';
import DepositOpening from './DepositOpening';
import DepositAtAGlance from './DepositAtAGlance';
import DepositWorkedExample from './DepositWorkedExample';
import DepositSectionsList from './DepositSectionsList';
import DepositAnswersLaunchCard from './DepositAnswersLaunchCard';
import DepositRelatedPolicies from './DepositRelatedPolicies';
import DepositCantFindItBand from './DepositCantFindItBand';
import { EditableFieldProps } from '../types';

interface DepositPaperSectionProps extends EditableFieldProps {
  page: any;
  activePartId?: string;
  onSelectPart?: (partId: string) => void;
  onOpenAnswersView: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
}

export const DepositPaperSection: React.FC<DepositPaperSectionProps> = ({
  page,
  activePartId = 'hero',
  onSelectPart,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onOpenAnswersView,
  onSelectFigure,
  onNavigateToPage,
  hiddenParts = {}
}) => {
  useEffect(() => {
    if (!activePartId || activePartId === 'answers') return;
    const el = document.getElementById(activePartId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activePartId]);

  const getSectionClasses = (partId: string) => {
    const isSelected = activePartId === partId;
    return `transition-all rounded-[10px] cursor-pointer ${
      isSelected ? 'ring-2 ring-[#bda67b] ring-offset-4 ring-offset-[#fffefb]' : 'hover:ring-1 hover:ring-[#bda67b]/50'
    }`;
  };

  return (
    <div className="max-w-[780px] mx-auto w-full space-y-6 pt-2 pb-16">
      {/* Part 01: Hero */}
      {!hiddenParts['hero'] && (
        <section
          id="hero"
          onClick={() => onSelectPart?.('hero')}
          className={getSectionClasses('hero')}
        >
          <DepositHero
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onSelectQuestion={() => onOpenAnswersView()}
          />
        </section>
      )}

      {/* Part 02: Five steps */}
      {!hiddenParts['five-steps'] && (
        <section
          id="five-steps"
          onClick={() => onSelectPart?.('five-steps')}
          className={getSectionClasses('five-steps')}
        >
          <DepositFiveSteps
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onSelectStep={() => onOpenAnswersView()}
            onSelectFigure={onSelectFigure}
          />
        </section>
      )}

      {/* Part 03: Opening */}
      {!hiddenParts['opening'] && (
        <section
          id="opening"
          onClick={() => onSelectPart?.('opening')}
          className={getSectionClasses('opening')}
        >
          <DepositOpening
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* Part 04: At a glance */}
      {!hiddenParts['at-a-glance'] && (
        <section
          id="at-a-glance"
          onClick={() => onSelectPart?.('at-a-glance')}
          className={getSectionClasses('at-a-glance')}
        >
          <DepositAtAGlance
            onSelectRow={() => onOpenAnswersView()}
            onSelectFigure={onSelectFigure}
          />
        </section>
      )}

      {/* Part 05: Worked example */}
      {!hiddenParts['worked-example'] && (
        <section
          id="worked-example"
          onClick={() => onSelectPart?.('worked-example')}
          className={getSectionClasses('worked-example')}
        >
          <DepositWorkedExample
            onSelectFigure={onSelectFigure}
          />
        </section>
      )}

      {/* Part 06: Sections */}
      {!hiddenParts['sections'] && (
        <section
          id="sections"
          onClick={() => onSelectPart?.('sections')}
          className={getSectionClasses('sections')}
        >
          <DepositSectionsList
            onSelectSection={() => onOpenAnswersView()}
          />
        </section>
      )}

      {/* Part 07: Answers quick launch */}
      {!hiddenParts['answers'] && (
        <section
          id="answers"
          onClick={() => onSelectPart?.('answers')}
          className={getSectionClasses('answers')}
        >
          <DepositAnswersLaunchCard
            onOpenAnswersView={onOpenAnswersView}
          />
        </section>
      )}

      {/* Part 08: Related policies */}
      {!hiddenParts['related-policies'] && (
        <section
          id="related-policies"
          onClick={() => onSelectPart?.('related-policies')}
          className={getSectionClasses('related-policies')}
        >
          <DepositRelatedPolicies
            onNavigateToPage={onNavigateToPage}
          />
        </section>
      )}

      {/* Part 09: Can't find it closing band */}
      {!hiddenParts['cant-find-it'] && (
        <section
          id="cant-find-it"
          onClick={() => onSelectPart?.('cant-find-it')}
          className={getSectionClasses('cant-find-it')}
        >
          <DepositCantFindItBand />
        </section>
      )}
    </div>
  );
};

export default DepositPaperSection;
