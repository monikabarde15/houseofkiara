/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageSettingsWorkspaceView (Spec §7.9, Screens 28-30, 46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../types';
import { PageSettingsHeader } from './PageSettingsHeader';
import { PageSettingsPartsCard } from './PageSettingsPartsCard';
import { PageSettingsSearchCard } from './PageSettingsSearchCard';
import { PageSettingsAddressCard } from './PageSettingsAddressCard';
import { PageSettingsVersionsCard } from './PageSettingsVersionsCard';

interface PageSettingsWorkspaceViewProps {
  page: PageCardData;
  onBackToPaper: () => void;
  onOpenAnswersView?: () => void;
  onJumpToPart: (partId: string) => void;
  onReadAsOnDate: (date: string) => void;
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  showCircularMark?: boolean;
  onToggleCircularMark?: () => void;
  showFourthWayLine?: boolean;
  onToggleFourthWayLine?: () => void;
  showInstagramLine?: boolean;
  onToggleInstagramLine?: () => void;
}

export const PageSettingsWorkspaceView: React.FC<PageSettingsWorkspaceViewProps> = ({
  page,
  onBackToPaper,
  onOpenAnswersView,
  onJumpToPart,
  onReadAsOnDate,
  hiddenParts = {},
  onTogglePartHidden = () => {},
  showCircularMark = true,
  onToggleCircularMark = () => {},
  showFourthWayLine = true,
  onToggleFourthWayLine = () => {},
  showInstagramLine = true,
  onToggleInstagramLine = () => {}
}) => {
  const showVersions = page.group === 'policies' || page.slug === 'faqs';

  return (
    <div className="flex-1 min-w-0 flex flex-col items-center">
      {/* Desk Column container (max-w-[760px] in center of desk, Spec §7.9) */}
      <div className="w-full max-w-[760px] space-y-6 pb-12">
        {/* 1. Header Overview Card */}
        <PageSettingsHeader page={page} onBackToPaper={onBackToPaper} />

        {/* 2. Parts Settings Card (Screen 28, Screen 46) */}
        <PageSettingsPartsCard
          page={page}
          onOpenAnswersView={onOpenAnswersView}
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

        {/* 3. Search & Sharing Card (Screen 29) */}
        <PageSettingsSearchCard page={page} />

        {/* 4. Address Card (Screen 29) */}
        <PageSettingsAddressCard page={page} />

        {/* 5. Versions Card (Screen 30) */}
        {showVersions && (
          <PageSettingsVersionsCard
            page={page}
            onReadAsOnDate={onReadAsOnDate}
          />
        )}
      </div>
    </div>
  );
};

export default PageSettingsWorkspaceView;
