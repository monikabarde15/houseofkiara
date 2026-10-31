/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksPageSettingsCard (Spec §8.7, Pages 33-35)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../../types';
import { HowItWorksSettingsHeroSteps } from './HowItWorksSettingsHeroSteps';
import { HowItWorksSettingsModesCraft } from './HowItWorksSettingsModesCraft';
import { HowItWorksSettingsPoliciesFAQ } from './HowItWorksSettingsPoliciesFAQ';

interface HowItWorksPageSettingsCardProps {
  page: PageCardData;
  onJumpToPart: (partId: string) => void;
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
  showLoopCard: boolean;
  onToggleLoopCard: () => void;
  showInstagramLine: boolean;
  onToggleInstagramLine: () => void;
}

export const HowItWorksPageSettingsCard: React.FC<HowItWorksPageSettingsCardProps> = ({
  onJumpToPart,
  hiddenParts,
  onTogglePartHidden,
  showLoopCard,
  onToggleLoopCard,
  showInstagramLine,
  onToggleInstagramLine
}) => {
  return (
    <div className="space-y-6">
      {/* 01 Hero, 02 What's on this page, 03 Shopping steps */}
      <HowItWorksSettingsHeroSteps
        onJumpToPart={onJumpToPart}
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        showLoopCard={showLoopCard}
        onToggleLoopCard={onToggleLoopCard}
      />

      {/* 04 Two ways to shop, 05 The Craft divider, 06 List & Earn */}
      <HowItWorksSettingsModesCraft
        onJumpToPart={onJumpToPart}
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
      />

      {/* 07 Good to Know, 08 FAQ, 09 Closing */}
      <HowItWorksSettingsPoliciesFAQ
        onJumpToPart={onJumpToPart}
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        showInstagramLine={showInstagramLine}
        onToggleInstagramLine={onToggleInstagramLine}
      />
    </div>
  );
};

export default HowItWorksPageSettingsCard;
