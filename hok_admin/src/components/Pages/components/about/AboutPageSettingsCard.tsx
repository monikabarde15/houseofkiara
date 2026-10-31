/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPageSettingsCard (Spec §8.6, Screen 46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../../types';
import { AboutSettingsHeroTheName } from './AboutSettingsHeroTheName';
import { AboutSettingsBeliefsSides } from './AboutSettingsBeliefsSides';
import { AboutSettingsWaysClosing } from './AboutSettingsWaysClosing';

interface AboutPageSettingsCardProps {
  page: PageCardData;
  onJumpToPart: (partId: string) => void;
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
  showCircularMark: boolean;
  onToggleCircularMark: () => void;
  showFourthWayLine: boolean;
  onToggleFourthWayLine: () => void;
  showInstagramLine: boolean;
  onToggleInstagramLine: () => void;
}

export const AboutPageSettingsCard: React.FC<AboutPageSettingsCardProps> = ({
  onJumpToPart,
  hiddenParts,
  onTogglePartHidden,
  showCircularMark,
  onToggleCircularMark,
  showFourthWayLine,
  onToggleFourthWayLine,
  showInstagramLine,
  onToggleInstagramLine
}) => {
  return (
    <div className="space-y-6">
      {/* 01 Hero, 02 The Name, 03 Manifesto */}
      <AboutSettingsHeroTheName
        onJumpToPart={onJumpToPart}
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
      />

      {/* 04 What We Believe, 05 Two Sides, 06 From The Founder */}
      <AboutSettingsBeliefsSides
        onJumpToPart={onJumpToPart}
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
      />

      {/* 07 Why We Built It, 08 Three Ways, 09 Closing */}
      <AboutSettingsWaysClosing
        onJumpToPart={onJumpToPart}
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        showCircularMark={showCircularMark}
        onToggleCircularMark={onToggleCircularMark}
        showFourthWayLine={showFourthWayLine}
        onToggleFourthWayLine={onToggleFourthWayLine}
        showInstagramLine={showInstagramLine}
        onToggleInstagramLine={onToggleInstagramLine}
      />
    </div>
  );
};

export default AboutPageSettingsCard;
