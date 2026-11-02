/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CarePaperSection (Spec § 8.14, Screen 52)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useEffect } from 'react';
import CareHero from './CareHero';
import CareFirstAidCard from './CareFirstAidCard';
import CareIntro from './CareIntro';
import CareMomentsSection from './CareMomentsSection';
import CareWearDamageSection from './CareWearDamageSection';
import CarePieceByPieceSection from './CarePieceByPieceSection';
import CareOurCareSection from './CareOurCareSection';
import CareRestoringSection from './CareRestoringSection';
import CareOwnedSection from './CareOwnedSection';
import CareAnswersLaunchCard from './CareAnswersLaunchCard';
import CareRelatedPolicies from './CareRelatedPolicies';
import CareCantFindItBand from './CareCantFindItBand';
import { EditableFieldProps } from '../types';

interface CarePaperSectionProps extends EditableFieldProps {
  page: any;
  activePartId?: string;
  onSelectPart?: (partId: string) => void;
  onOpenAnswersView: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
}

export const CarePaperSection: React.FC<CarePaperSectionProps> = ({
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
          <CareHero
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onSelectQuestion={() => onOpenAnswersView()}
          />
        </section>
      )}

      {/* 02: If something happens */}
      {!hiddenParts['if-something-happens'] && (
        <section
          id="if-something-happens"
          onClick={() => onSelectPart?.('if-something-happens')}
          className={getSectionClasses('if-something-happens')}
        >
          <CareFirstAidCard
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onSelectStep={() => onOpenAnswersView()}
          />
        </section>
      )}

      {/* 03: Our one request */}
      {!hiddenParts['our-one-request'] && (
        <section
          id="our-one-request"
          onClick={() => onSelectPart?.('our-one-request')}
          className={getSectionClasses('our-one-request')}
        >
          <CareIntro
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 04: Moment by moment */}
      {!hiddenParts['moment-by-moment'] && (
        <section
          id="moment-by-moment"
          onClick={() => onSelectPart?.('moment-by-moment')}
          className={getSectionClasses('moment-by-moment')}
        >
          <CareMomentsSection
            onSelectFigure={onSelectFigure}
            onOpenQuestion={() => onOpenAnswersView()}
          />
        </section>
      )}

      {/* 05: Wear or damage */}
      {!hiddenParts['wear-or-damage'] && (
        <section
          id="wear-or-damage"
          onClick={() => onSelectPart?.('wear-or-damage')}
          className={getSectionClasses('wear-or-damage')}
        >
          <CareWearDamageSection
            onOpenQuestion={() => onOpenAnswersView()}
          />
        </section>
      )}

      {/* 06: Piece by piece */}
      {!hiddenParts['piece-by-piece'] && (
        <section
          id="piece-by-piece"
          onClick={() => onSelectPart?.('piece-by-piece')}
          className={getSectionClasses('piece-by-piece')}
        >
          <CarePieceByPieceSection />
        </section>
      )}

      {/* 07: Our care */}
      {!hiddenParts['our-care'] && (
        <section
          id="our-care"
          onClick={() => onSelectPart?.('our-care')}
          className={getSectionClasses('our-care')}
        >
          <CareOurCareSection />
        </section>
      )}

      {/* 08: Restoring */}
      {!hiddenParts['restoring'] && (
        <section
          id="restoring"
          onClick={() => onSelectPart?.('restoring')}
          className={getSectionClasses('restoring')}
        >
          <CareRestoringSection />
        </section>
      )}

      {/* 09: Pieces you own */}
      {!hiddenParts['pieces-you-own'] && (
        <section
          id="pieces-you-own"
          onClick={() => onSelectPart?.('pieces-you-own')}
          className={getSectionClasses('pieces-you-own')}
        >
          <CareOwnedSection />
        </section>
      )}

      {/* 10: Answers quick launch */}
      {!hiddenParts['answers'] && (
        <section
          id="answers"
          onClick={() => onSelectPart?.('answers')}
          className={getSectionClasses('answers')}
        >
          <CareAnswersLaunchCard
            onOpenAnswersView={onOpenAnswersView}
          />
        </section>
      )}

      {/* 11: Related policies */}
      {!hiddenParts['related-policies'] && (
        <section
          id="related-policies"
          onClick={() => onSelectPart?.('related-policies')}
          className={getSectionClasses('related-policies')}
        >
          <CareRelatedPolicies
            onNavigateToPage={onNavigateToPage}
          />
        </section>
      )}

      {/* 12: Can't find it closing band */}
      {!hiddenParts['cant-find-it'] && (
        <section
          id="cant-find-it"
          onClick={() => onSelectPart?.('cant-find-it')}
          className={getSectionClasses('cant-find-it')}
        >
          <CareCantFindItBand />
        </section>
      )}
    </div>
  );
};

export default CarePaperSection;
