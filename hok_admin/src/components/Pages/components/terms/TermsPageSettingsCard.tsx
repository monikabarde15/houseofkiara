/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsPageSettingsCard (Spec §8.9 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import TermsSettingsHeroStart from './TermsSettingsHeroStart';
import TermsSettingsPoliciesQuestions from './TermsSettingsPoliciesQuestions';

interface TermsPageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  onOpenClausesView?: () => void;
}

export const TermsPageSettingsCard: React.FC<TermsPageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {},
  onOpenClausesView
}) => {
  const [activeGroup, setActiveGroup] = useState<'hero' | 'policies'>('hero');

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
          01-04 · Hero, Start & Essentials
        </button>

        <button
          type="button"
          onClick={() => setActiveGroup('policies')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeGroup === 'policies'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          06-07 · Policies & Questions
        </button>

        {onOpenClausesView && (
          <button
            type="button"
            onClick={onOpenClausesView}
            className="ml-auto text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
          >
            Manage 59 clauses →
          </button>
        )}
      </div>

      {activeGroup === 'hero' && (
        <TermsSettingsHeroStart
          hiddenParts={hiddenParts}
          onTogglePartHidden={onTogglePartHidden}
        />
      )}

      {activeGroup === 'policies' && (
        <TermsSettingsPoliciesQuestions
          hiddenParts={hiddenParts}
          onTogglePartHidden={onTogglePartHidden}
        />
      )}
    </div>
  );
};

export default TermsPageSettingsCard;
