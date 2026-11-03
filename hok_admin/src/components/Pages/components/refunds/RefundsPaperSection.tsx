/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsPaperSection (Spec §8.12, Screen 49/58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import RefundsHero from './RefundsHero';
import RefundsTwoPoliciesCards from './RefundsTwoPoliciesCards';
import RefundsOpening from './RefundsOpening';
import RefundsPolicyInBrief from './RefundsPolicyInBrief';
import RefundsSectionsList from './RefundsSectionsList';
import RefundsAnswersLaunchCard from './RefundsAnswersLaunchCard';
import RefundsRelatedPolicies from './RefundsRelatedPolicies';
import RefundsCantFindItBand from './RefundsCantFindItBand';
import { EditableFieldProps } from '../types';

interface RefundsPaperSectionProps extends EditableFieldProps {
  page: any;
  onOpenAnswersView: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onNavigateToPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
}

export const RefundsPaperSection: React.FC<RefundsPaperSectionProps> = ({
  page,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {},
  onOpenAnswersView,
  onSelectFigure,
  onNavigateToPage,
  hiddenParts = {}
}) => {
  const [activeTab, setActiveTab] = useState<'rental' | 'preloved'>('rental');

  return (
    <div className="max-w-[780px] mx-auto w-full space-y-6 pt-2 pb-16">
      {/* Part 01: Hero */}
      {!hiddenParts['hero'] && (
        <RefundsHero
          fieldValues={fieldValues}
          onFieldChange={onFieldChange}
          onFocusField={onFocusField}
          onSelectQuestion={() => onOpenAnswersView()}
        />
      )}

      {/* Part 02: Two policies */}
      {!hiddenParts['two-policies'] && (
        <RefundsTwoPoliciesCards
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Part 03: Opening */}
      {!hiddenParts['opening'] && (
        <RefundsOpening
          activeTab={activeTab}
          fieldValues={fieldValues}
          onFieldChange={onFieldChange}
          onFocusField={onFocusField}
        />
      )}

      {/* Part 04: The policy in brief */}
      {!hiddenParts['the-policy-in-brief'] && (
        <RefundsPolicyInBrief
          activeTab={activeTab}
          onSelectFigure={onSelectFigure}
          onOpenRowAnswer={() => onOpenAnswersView()}
        />
      )}

      {/* Part 05: Sections */}
      {!hiddenParts['sections'] && (
        <RefundsSectionsList
          activeTab={activeTab}
          onSelectSection={() => onOpenAnswersView()}
        />
      )}

      {/* Part 06: Answers quick launch */}
      {!hiddenParts['answers'] && (
        <RefundsAnswersLaunchCard
          onOpenAnswersView={onOpenAnswersView}
        />
      )}

      {/* Part 07: Related policies */}
      {!hiddenParts['related-policies'] && (
        <RefundsRelatedPolicies
          onNavigateToPage={onNavigateToPage}
        />
      )}

      {/* Part 08: Can't find it closing band */}
      {!hiddenParts['cant-find-it'] && (
        <RefundsCantFindItBand />
      )}
    </div>
  );
};

export default RefundsPaperSection;
