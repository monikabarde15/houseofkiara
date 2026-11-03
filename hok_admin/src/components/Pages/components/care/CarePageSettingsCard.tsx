/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: CarePageSettingsCard (Spec § 8.14 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { CARE_POPULAR_LINKS, FIRST_AID_STEPS, MOMENT_TABS } from '../../data/careRegistry';

interface CarePageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  onOpenAnswersView?: () => void;
}

export const CarePageSettingsCard: React.FC<CarePageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {},
  onOpenAnswersView
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'moments' | 'sections'>('hero');

  const sections = [
    { title: 'Wear or damage', count: 7 },
    { title: 'When it arrives', count: 6 },
    { title: 'Getting ready', count: 5 },
    { title: 'At the celebration', count: 11 },
    { title: 'After the celebration', count: 2 },
    { title: 'Sending it back', count: 6 },
    { title: 'Care, piece by piece', count: 5 },
    { title: 'Our care', count: 4 },
    { title: 'If a piece needs restoring', count: 4 },
    { title: 'A piece that is yours to keep', count: 7 }
  ];

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
          Hero &amp; First Aid
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('moments')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'moments' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Moments (5)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'sections' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Sections (10)
        </button>

        {onOpenAnswersView && (
          <button
            type="button"
            onClick={onOpenAnswersView}
            className="ml-auto text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
          >
            Answers (57) →
          </button>
        )}
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-5">
          <div>
            <span className="font-semibold text-stone-900 block mb-1">
              Popular questions on Hero
            </span>
            <p className="text-[#78716c] text-[11px] mb-2.5">
              Pinned directly below the search input.
            </p>
            <div className="space-y-1.5">
              {CARE_POPULAR_LINKS.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-stone-50 border border-stone-200/70"
                >
                  <span className="text-stone-700">{link.label}</span>
                  <span className="font-mono text-[10px] text-stone-400">#{link.targetId}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold text-stone-900 block mb-1">
              First aid steps (3)
            </span>
            <div className="space-y-1.5">
              {FIRST_AID_STEPS.map((st) => (
                <div
                  key={st.num}
                  className="p-2 rounded bg-stone-50 border border-stone-200/70 text-[11px]"
                >
                  <span className="font-medium text-stone-900 block">0{st.num} {st.title}</span>
                  <span className="text-stone-500 text-[10px]">{st.line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'moments' && (
        <div className="space-y-3">
          <span className="font-semibold text-stone-900 block">
            Five care moments
          </span>
          <p className="text-[#78716c] text-[11px] leading-relaxed">
            The chronological care journey from receipt to return.
          </p>
          <div className="space-y-2">
            {MOMENT_TABS.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded bg-stone-50 border border-stone-200/70"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-stone-800">{m.num}. {m.title}</span>
                  <span className="font-mono text-[10px] text-stone-400">{m.questionIds.length} Qs</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  {m.subheading}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="space-y-2">
          <span className="font-semibold text-stone-900 block mb-1">
            Care Policy Sections (10)
          </span>
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {sections.map((sec) => (
              <div
                key={sec.title}
                className="p-2.5 rounded bg-stone-50 border border-stone-200/70 flex items-center justify-between"
              >
                <span className="font-medium text-stone-800">{sec.title}</span>
                <span className="font-mono text-stone-500 text-[10px]">{sec.count} Qs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarePageSettingsCard;
