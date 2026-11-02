/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: ShippingPaperSection (Spec § 8.15, Screen 54)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useEffect } from 'react';
import ShippingHero from './ShippingHero';
import ShippingRentalWindowCard from './ShippingRentalWindowCard';
import ShippingIntro from './ShippingIntro';
import ShippingWaysWeDeliver from './ShippingWaysWeDeliver';
import ShippingSectionsList from './ShippingSectionsList';
import ShippingAnswersLaunchCard from './ShippingAnswersLaunchCard';
import ShippingRelatedPolicies from './ShippingRelatedPolicies';
import ShippingCantFindItBand from './ShippingCantFindItBand';
import { EditableFieldProps } from '../types';

interface ShippingPaperSectionProps extends EditableFieldProps {
  page: any;
  activePartId?: string;
  onSelectPart?: (partId: string) => void;
  onOpenAnswersView: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
}

export const ShippingPaperSection: React.FC<ShippingPaperSectionProps> = ({
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
          <ShippingHero
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onSelectQuestion={() => onOpenAnswersView()}
          />
        </section>
      )}

      {/* 02: Rental Window */}
      {!hiddenParts['rental-window'] && (
        <section
          id="rental-window"
          onClick={() => onSelectPart?.('rental-window')}
          className={getSectionClasses('rental-window')}
        >
          <ShippingRentalWindowCard
            onSelectFigure={onSelectFigure}
            onOpenQuestion={() => onOpenAnswersView()}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 03: Opening statement */}
      {!hiddenParts['opening'] && (
        <section
          id="opening"
          onClick={() => onSelectPart?.('opening')}
          className={getSectionClasses('opening')}
        >
          <ShippingIntro
            onSelectFigure={onSelectFigure}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 04: Ways we deliver (Screen 54) */}
      {!hiddenParts['ways-we-deliver'] && (
        <section
          id="ways-we-deliver"
          onClick={() => onSelectPart?.('ways-we-deliver')}
          className={getSectionClasses('ways-we-deliver')}
        >
          <ShippingWaysWeDeliver
            onSelectFigure={onSelectFigure}
            onOpenQuestion={() => onOpenAnswersView()}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 05: Sections list */}
      {!hiddenParts['sections'] && (
        <section
          id="sections"
          onClick={() => onSelectPart?.('sections')}
          className={getSectionClasses('sections')}
        >
          <ShippingSectionsList
            onOpenAnswersView={onOpenAnswersView}
            onOpenSection={() => onOpenAnswersView()}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
          />
        </section>
      )}

      {/* 06: Answers launch card */}
      {!hiddenParts['answers'] && (
        <section
          id="answers"
          onClick={() => onSelectPart?.('answers')}
          className={getSectionClasses('answers')}
        >
          <ShippingAnswersLaunchCard onOpenAnswersView={onOpenAnswersView} />
        </section>
      )}

      {/* 07: Related policies */}
      {!hiddenParts['related-policies'] && (
        <section
          id="related-policies"
          onClick={() => onSelectPart?.('related-policies')}
          className={getSectionClasses('related-policies')}
        >
          <ShippingRelatedPolicies onNavigateToPage={onNavigateToPage} />
        </section>
      )}

      {/* 08: Can't find it band */}
      {!hiddenParts['cant-find-it'] && (
        <section
          id="cant-find-it"
          onClick={() => onSelectPart?.('cant-find-it')}
          className={getSectionClasses('cant-find-it')}
        >
          <ShippingCantFindItBand onSelectFigure={onSelectFigure} />
        </section>
      )}
    </div>
  );
};

export default ShippingPaperSection;
