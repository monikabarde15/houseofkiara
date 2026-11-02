/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: PricingPageSettingsCard (Spec § 8.16 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PRICING_POPULAR_QUERIES, PRICING_SECTIONS_LIST } from '../../data/pricingRegistry';

interface PricingPageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  onOpenAnswersView?: () => void;
}

export const PricingPageSettingsCard: React.FC<PricingPageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {},
  onOpenAnswersView
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'ledger' | 'sections'>('hero');

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
          Hero &amp; Sides
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'ledger' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Ledger &amp; Numbers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'sections' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Sections (52)
        </button>
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Popular queries under search box
            </div>
            <p className="text-[11.5px] text-[#73675a] leading-relaxed">
              Up to four shortcuts shown under the search box.
            </p>
            <div className="space-y-1.5 pt-1">
              {PRICING_POPULAR_QUERIES.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-2.5 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] flex items-center justify-between text-[11.5px]"
                >
                  <span className="text-[#1a1612] font-medium truncate pr-2">
                    {idx + 1}. {q.text}
                  </span>
                  <span className="text-[10px] font-mono text-[#8a7f73]">
                    {q.side} · {q.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#f5f1eb]">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Two sides switcher card
            </div>
            <div className="flex items-center justify-between text-[11.5px] p-2 bg-[#faf8f5] rounded border border-[#ebe5dc]">
              <span>Show two sides switch</span>
              <input
                type="checkbox"
                checked={!hiddenParts['two-sides']}
                onChange={() => onTogglePartHidden('two-sides')}
                className="rounded accent-[#1a1612]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Ledger &amp; Worked examples
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            The fee ledger and worked examples switch between What you pay (renting &amp; preloved) and What you earn (lister payout).
          </p>
          <div className="space-y-2 pt-1">
            <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
              <div className="font-semibold text-[#1a1612]">What you pay</div>
              <div className="text-[#73675a] text-[11px]">8 line charges: piece, extra days, GST, deposit, delivery, care and cancellations.</div>
            </div>
            <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
              <div className="font-semibold text-[#1a1612]">What you earn</div>
              <div className="text-[#73675a] text-[11px]">6 line rules: your share, excluded charges, free listing, payout in 3 working days.</div>
            </div>
            <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
              <div className="font-semibold text-[#1a1612]">Worked order statement</div>
              <div className="text-[#73675a] text-[11px]">Calculates lehenga rental checkout: ₹25,370 and preloved saree: ₹56,700.</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Page sections &amp; question counts
            </div>
            {onOpenAnswersView && (
              <button
                type="button"
                onClick={onOpenAnswersView}
                className="text-[11px] text-[#935b1e] hover:underline font-medium cursor-pointer"
              >
                Open workspace →
              </button>
            )}
          </div>

          <div className="divide-y divide-[#ebe5dc] border border-[#ebe5dc] rounded-[6px] overflow-hidden">
            {PRICING_SECTIONS_LIST.map((sec) => (
              <div
                key={sec.id}
                className="p-2.5 bg-white flex items-center justify-between text-[11.5px] hover:bg-[#faf8f5]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#935b1e] text-[11px] font-semibold">
                    {sec.num}
                  </span>
                  <span className="text-[#1a1612] font-medium">
                    {sec.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8a7f73] uppercase">
                    {sec.side}
                  </span>
                  <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#f5f1eb] font-mono text-[#785b1a]">
                    {sec.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPageSettingsCard;
