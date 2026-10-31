/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsPageSettingsCard (Spec §8.12 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import RefundsSettingsHeroBrief from './RefundsSettingsHeroBrief';
import RefundsSettingsSections from './RefundsSettingsSections';

interface RefundsPageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  onOpenAnswersView?: () => void;
}

export const RefundsPageSettingsCard: React.FC<RefundsPageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {},
  onOpenAnswersView
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'brief' | 'sections'>('hero');

  return (
    <div className="space-y-6 text-xs">
      {/* Subtab navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#ebe5dc] pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'hero' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Hero
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('brief')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'brief' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          The policy in brief
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'sections' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Sections
        </button>

        {onOpenAnswersView && (
          <button
            type="button"
            onClick={onOpenAnswersView}
            className="ml-auto text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
          >
            Answers (103) →
          </button>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'sections' ? (
        <RefundsSettingsSections />
      ) : (
        <RefundsSettingsHeroBrief activeTab={activeTab} />
      )}
    </div>
  );
};

export default RefundsPageSettingsCard;
