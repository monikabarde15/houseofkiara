/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPiecePageSettingsCard (Spec §8.8 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import ListYourPieceSettingsHeroPromise from './ListYourPieceSettingsHeroPromise';
import ListYourPieceSettingsStepsForm from './ListYourPieceSettingsStepsForm';
import ListYourPieceSettingsBoutiqueFAQ from './ListYourPieceSettingsBoutiqueFAQ';

interface ListYourPiecePageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  onOpenAnswersView?: () => void;
  onNavigateToLYP?: () => void;
}

export const ListYourPiecePageSettingsCard: React.FC<ListYourPiecePageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {},
  onOpenAnswersView,
  onNavigateToLYP
}) => {
  const [activeGroup, setActiveGroup] = useState<'hero' | 'form' | 'boutique'>('hero');
  const [showTicker, setShowTicker] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Subtab navigation */}
      <div className="flex items-center gap-2 border-b border-[#ebe5dc] pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveGroup('hero')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeGroup === 'hero'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          01-03 · Hero & Promises
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('form')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeGroup === 'form'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          04-06 · Steps & The Form
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('boutique')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeGroup === 'boutique'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          07-08 · Boutiques & FAQ
        </button>
      </div>

      {/* Panels */}
      {activeGroup === 'hero' && (
        <ListYourPieceSettingsHeroPromise
          hiddenParts={hiddenParts}
          onTogglePartHidden={onTogglePartHidden}
          showTicker={showTicker}
          onToggleTicker={() => setShowTicker(prev => !prev)}
        />
      )}

      {activeGroup === 'form' && (
        <ListYourPieceSettingsStepsForm
          hiddenParts={hiddenParts}
          onTogglePartHidden={onTogglePartHidden}
          onNavigateToLYP={onNavigateToLYP}
        />
      )}

      {activeGroup === 'boutique' && (
        <ListYourPieceSettingsBoutiqueFAQ
          hiddenParts={hiddenParts}
          onTogglePartHidden={onTogglePartHidden}
          onOpenAnswersView={onOpenAnswersView}
        />
      )}
    </div>
  );
};

export default ListYourPiecePageSettingsCard;
