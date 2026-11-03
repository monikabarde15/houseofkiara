/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: DepositPageSettingsCard (Spec § 8.13 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { DEPOSIT_SECTIONS, DEPOSIT_POPULAR_LINKS, DEPOSIT_TRACKER_STEPS } from '../../data/depositRegistry';

interface DepositPageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  onOpenAnswersView?: () => void;
}

export const DepositPageSettingsCard: React.FC<DepositPageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {},
  onOpenAnswersView
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'example' | 'sections'>('hero');

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
          Hero &amp; steps
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('example')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'example' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Worked example
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
            Answers (61) →
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
              The four questions pinned directly below the search input.
            </p>
            <div className="space-y-1.5">
              {DEPOSIT_POPULAR_LINKS.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-stone-50 border border-stone-200/70"
                >
                  <span className="text-stone-700">{link.text}</span>
                  <span className="font-mono text-[10px] text-stone-400">{link.anchor}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold text-stone-900 block mb-1">
              Five tracker steps
            </span>
            <p className="text-[#78716c] text-[11px] mb-2.5">
              Reflects the customer journey in My Account.
            </p>
            <div className="space-y-1.5">
              {DEPOSIT_TRACKER_STEPS.map((st) => (
                <div
                  key={st.number}
                  className="flex items-center justify-between p-2 rounded bg-stone-50 border border-stone-200/70 text-[11px]"
                >
                  <span className="font-medium text-stone-900">0{st.number} {st.name}</span>
                  <span className="text-stone-500">{st.timing}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'example' && (
        <div className="space-y-4">
          <span className="font-semibold text-stone-900 block">
            Worked example default figures
          </span>
          <p className="text-[#78716c] text-[11px] leading-relaxed">
            These numbers are used as the live baseline on the customer facing page to calculate all four end of rental scenarios.
          </p>
          <div className="grid grid-cols-2 gap-2 text-stone-800">
            <div className="p-2.5 bg-stone-50 rounded border border-stone-200/70">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">Example piece</span>
              <span className="font-medium">Bridal lehenga</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded border border-stone-200/70">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">Rental length</span>
              <span className="font-medium">4 days</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded border border-stone-200/70">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">Daily rate</span>
              <span className="font-medium">₹2,500</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded border border-stone-200/70">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">Security deposit</span>
              <span className="font-medium">₹25,000</span>
            </div>
            <div className="col-span-2 p-2.5 bg-stone-50 rounded border border-stone-200/70">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">Replacement value</span>
              <span className="font-medium">₹1,80,000</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="space-y-2">
          <span className="font-semibold text-stone-900 block mb-1">
            Deposit Policy Sections (9)
          </span>
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {DEPOSIT_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                className="p-2.5 rounded bg-stone-50 border border-stone-200/70 flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-stone-400 mr-2 text-[10px]">{sec.number}</span>
                  <span className="font-medium text-stone-800">{sec.title}</span>
                </div>
                <span className="font-mono text-stone-500 text-[10px]">{sec.questions.length} Qs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositPageSettingsCard;
