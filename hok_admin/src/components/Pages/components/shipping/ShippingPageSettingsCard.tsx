/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: ShippingPageSettingsCard (Spec § 8.15 Page Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { SHIPPING_POPULAR_QUESTIONS, SHIPPING_SECTIONS_LIST } from '../../data/shippingRegistry';

interface ShippingPageSettingsCardProps {
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  onOpenAnswersView?: () => void;
}

export const ShippingPageSettingsCard: React.FC<ShippingPageSettingsCardProps> = ({
  hiddenParts = {},
  onTogglePartHidden = () => {},
  onOpenAnswersView
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'ways' | 'sections'>('hero');

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
          Hero &amp; Window
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ways')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'ways' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Ways we deliver
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
            activeTab === 'sections' ? 'bg-[#1a1612] text-white shadow-2xs' : 'text-[#73675a] hover:bg-[#ebe5dc]/50'
          }`}
        >
          Sections (50)
        </button>
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Popular questions under search box
            </div>
            <p className="text-[11.5px] text-[#73675a] leading-relaxed">
              Up to four shortcuts shown under the search box.
            </p>
            <div className="space-y-1.5 pt-1">
              {SHIPPING_POPULAR_QUESTIONS.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-2.5 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] flex items-center justify-between text-[11.5px]"
                >
                  <span className="text-[#1a1612] font-medium truncate pr-2">
                    {idx + 1}. {q.text}
                  </span>
                  <span className="text-[10px] font-mono text-[#8a7f73]">
                    {q.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#f5f1eb]">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
              Rental window visual card
            </div>
            <div className="flex items-center justify-between text-[11.5px] p-2 bg-[#faf8f5] rounded border border-[#ebe5dc]">
              <span>Show rental window diagram</span>
              <input
                type="checkbox"
                checked={!hiddenParts['rental-window']}
                onChange={() => onTogglePartHidden('rental-window')}
                className="rounded accent-[#1a1612]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ways' && (
        <div className="space-y-4">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Delivery options configuration
          </div>
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            The four ways we deliver are rendered in a 2x2 grid with live figures: Standard, Express, Same day, and International.
          </p>
          <div className="space-y-2 pt-1">
            <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
              <div className="font-semibold text-[#1a1612]">Standard delivery</div>
              <div className="text-[#73675a] text-[11px]">Free from ₹5,000 across India. Return journey included for rentals.</div>
            </div>
            <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
              <div className="font-semibold text-[#1a1612]">Express &amp; Same day</div>
              <div className="text-[#73675a] text-[11px]">Quoted at checkout for applicable pincodes and Indore local orders.</div>
            </div>
            <div className="p-3 bg-[#faf8f5] border border-[#ebe5dc] rounded-[6px] space-y-1">
              <div className="font-semibold text-[#1a1612]">International delivery</div>
              <div className="text-[#73675a] text-[11px]">Within 10 business days for preloved pieces only.</div>
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
            {SHIPPING_SECTIONS_LIST.map((sec) => (
              <div
                key={sec.id}
                className="p-2.5 bg-white flex items-center justify-between text-[11.5px] hover:bg-[#faf8f5]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#935b1e] text-[11px] font-semibold">
                    {sec.num}
                  </span>
                  <span className="text-[#1a1612] font-medium">
                    {sec.barLabel}
                  </span>
                </div>
                <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#f5f1eb] font-mono text-[#785b1a]">
                  {sec.questionsCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingPageSettingsCard;
