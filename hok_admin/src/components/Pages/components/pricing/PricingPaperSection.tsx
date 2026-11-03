/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PricingPaperSection (Spec § 8.16, Screens 56 & 57)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useEffect } from 'react';
import PricingHero from './PricingHero';
import PricingTwoSides from './PricingTwoSides';
import PricingLedgerSection from './PricingLedgerSection';
import PricingIntroSection from './PricingIntroSection';
import PricingWorkedExamplesSection from './PricingWorkedExamplesSection';
import PricingSectionsList from './PricingSectionsList';
import PricingAnswersLaunchCard from './PricingAnswersLaunchCard';
import PricingRelatedPolicies from './PricingRelatedPolicies';
import PricingCantFindItBand from './PricingCantFindItBand';
import { EditableFieldProps } from '../types';

interface PricingPaperSectionProps extends EditableFieldProps {
  page: any;
  activePartId?: string;
  onSelectPart?: (partId: string) => void;
  onOpenAnswersView: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
}

export const PricingPaperSection: React.FC<PricingPaperSectionProps> = ({
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
      {/* 01: Hero */}
      {!hiddenParts['hero'] && (
        <section
          id="hero"
          onClick={() => onSelectPart?.('hero')}
          className={getSectionClasses('hero')}
        >
          <PricingHero
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onSelectQuestion={() => onOpenAnswersView()}
          />
        </section>
      )}

      {/* 02: Two sides */}
      {!hiddenParts['two-sides'] && (
        <section
          id="two-sides"
          onClick={() => onSelectPart?.('two-sides')}
          className={getSectionClasses('two-sides')}
        >
          <PricingTwoSides
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 03: At a glance (Screen 56) */}
      {!hiddenParts['at-a-glance'] && (
        <section
          id="at-a-glance"
          onClick={() => onSelectPart?.('at-a-glance')}
          className={getSectionClasses('at-a-glance')}
        >
          <PricingLedgerSection
            onSelectFigure={onSelectFigure}
            onOpenQuestion={() => onOpenAnswersView()}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 04: Opening */}
      {!hiddenParts['opening'] && (
        <section
          id="opening"
          onClick={() => onSelectPart?.('opening')}
          className={getSectionClasses('opening')}
        >
          <PricingIntroSection
            onSelectFigure={onSelectFigure}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 05: Worked examples (Screen 57) */}
      {!hiddenParts['worked-examples'] && (
        <section
          id="worked-examples"
          onClick={() => onSelectPart?.('worked-examples')}
          className={getSectionClasses('worked-examples')}
        >
          <PricingWorkedExamplesSection
            onSelectFigure={onSelectFigure}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 06: Sections list */}
      {!hiddenParts['sections'] && (
        <section
          id="sections"
          onClick={() => onSelectPart?.('sections')}
          className={getSectionClasses('sections')}
        >
          <PricingSectionsList
            onOpenAnswersView={onOpenAnswersView}
            onOpenSection={() => onOpenAnswersView()}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 07: Answers launch card */}
      {!hiddenParts['answers'] && (
        <section
          id="answers"
          onClick={() => onOpenAnswersView()}
          className={getSectionClasses('answers')}
        >
          <PricingAnswersLaunchCard onOpenAnswersView={onOpenAnswersView} />
        </section>
      )}

      {/* 08: Related policies */}
      {!hiddenParts['related-policies'] && (
        <section
          id="related-policies"
          onClick={() => onSelectPart?.('related-policies')}
          className={getSectionClasses('related-policies')}
        >
          <PricingRelatedPolicies onNavigateToPage={onNavigateToPage} />
        </section>
      )}

      {/* 09: Can't find it / A question for us */}
      {!hiddenParts['cant-find-it'] && (
        <section
          id="cant-find-it"
          onClick={() => onSelectPart?.('cant-find-it')}
          className={getSectionClasses('cant-find-it')}
        >
          <PricingCantFindItBand onSelectFigure={onSelectFigure} />
        </section>
      )}
    </div>
  );
};

export default PricingPaperSection;
