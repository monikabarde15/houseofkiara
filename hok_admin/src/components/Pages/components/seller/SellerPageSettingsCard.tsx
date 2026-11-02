/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerPageSettingsCard (Spec § 8.17 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { SELLER_CHAPTERS, SELLER_HERO } from '../../data/sellerRegistry';

interface SellerPageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  onOpenAnswersView?: () => void;
}

export const SellerPageSettingsCard: React.FC<SellerPageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {},
  onOpenAnswersView
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'chapters' | 'legal'>('hero');

  return (
    <div className="space-y-6 text-xs">
      {/* Subtab navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#ebe5dc] pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Hero &amp; Shield
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chapters')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'chapters'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Chapters (9)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('legal')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'legal'
              ? 'bg-[#1a1612] text-white shadow-2xs'
              : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Legal &amp; Closing
        </button>
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Search quick queries
            </div>
            <p className="text-[11.5px] text-[#73675a] leading-relaxed">
              Four quick queries shown under the search box.
            </p>
            <div className="space-y-1.5 pt-1">
              {SELLER_HERO.quickQueries.map((q, idx) => (
                <div
                  key={q}
                  className="p-2.5 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] flex items-center justify-between text-[11.5px]"
                >
                  <span className="text-[#1a1612] font-medium">
                    {idx + 1}. {q}
                  </span>
                  <span className="text-[10px] font-mono text-[#8a7f73]">
                    quick query
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#f5f1eb]">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Your piece, protected banner
            </div>
            <div className="flex items-center justify-between text-[11.5px] p-2 bg-[#faf8f5] rounded border border-[#ebe5dc]">
              <span>Show protection shield card</span>
              <input
                type="checkbox"
                checked={!hiddenParts['your-piece-protected']}
                onChange={() => onTogglePartHidden('your-piece-protected')}
                className="rounded accent-[#1a1612]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Guidelines chapters (45 questions)
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
            {SELLER_CHAPTERS.map((ch, idx) => (
              <div
                key={ch.id}
                className="p-2.5 bg-white flex items-center justify-between text-[11.5px] hover:bg-[#faf8f5]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#935b1e] text-[11px] font-semibold">
                    0{idx + 1}
                  </span>
                  <span className="text-[#1a1612] font-medium">
                    {ch.barLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#f5f1eb] font-mono text-[#785b1a]">
                    {ch.questionIds.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'legal' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Agreement &amp; Plain words disclosure
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            The closing section clarifies that guidelines explain listing in plain words, while the Lister Terms govern legally.
          </p>
          <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
            <div className="font-semibold text-[#1a1612]">WhatsApp Concierge</div>
            <div className="text-[#73675a] text-[11px]">+91 93401 39300 for piece reviews and listing consultation.</div>
          </div>
          <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
            <div className="font-semibold text-[#1a1612]">Linked Agreements</div>
            <div className="text-[#73675a] text-[11px]">Lister Terms, Pricing &amp; Fees, Care Policy, Deposit Policy.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPageSettingsCard;
