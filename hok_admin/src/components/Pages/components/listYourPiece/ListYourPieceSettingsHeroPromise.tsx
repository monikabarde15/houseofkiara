/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceSettingsHeroPromise (Spec §8.8 Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface ListYourPieceSettingsHeroPromiseProps {
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
  showTicker: boolean;
  onToggleTicker: () => void;
}

export const ListYourPieceSettingsHeroPromise: React.FC<ListYourPieceSettingsHeroPromiseProps> = ({
  hiddenParts,
  onTogglePartHidden,
  showTicker,
  onToggleTicker
}) => {
  return (
    <div className="space-y-6">
      {/* 01 Hero Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 01 · Hero</div>
            <div className="text-[11px] text-[#73675a]">Ticker, headline, two buttons and three figures</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['hero']}
              onChange={() => onTogglePartHidden('hero')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#5c5248]">Show the ticker line</span>
            <input
              type="checkbox"
              checked={showTicker}
              onChange={onToggleTicker}
              className="accent-[#b89047] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] text-[#8a7f73] mb-1">First Button</label>
              <input
                type="text"
                defaultValue="START YOUR SUBMISSION ↓"
                className="w-full px-2.5 py-1.5 border border-[#dcd4c7] rounded text-xs text-[#1a1612]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#8a7f73] mb-1">Second Button</label>
              <input
                type="text"
                defaultValue="HOW IT WORKS ↓"
                className="w-full px-2.5 py-1.5 border border-[#dcd4c7] rounded text-xs text-[#1a1612]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 02 The Lister's Promise Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 02 · The Lister's Promise</div>
            <div className="text-[11px] text-[#73675a]">One pulled quote and four assurance cards</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['the-listers-promise']}
              onChange={() => onTogglePartHidden('the-listers-promise')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] text-[#8a7f73]">Assurance cards (4 in order):</div>
          {['Safe & Secure Storage', 'White-Glove Care', 'Recall Anytime', 'Transparent Earnings'].map((t, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <span className="text-[#1a1612] font-medium">0{idx + 1}. {t}</span>
              <span className="text-[11px] text-[#8a7f73]">Card {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 03 Three Promises Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 03 · Three Promises</div>
            <div className="text-[11px] text-[#73675a]">Commercial commitments, each heading in three parts</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['three-promises']}
              onChange={() => onTogglePartHidden('three-promises')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-2">
          {['Ownership Guarantee', 'Fast Direct Payouts', 'Full Replacement Security'].map((p, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 px-2.5 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <span className="text-[#1a1612] font-medium">Promise 0{idx + 1}: {p}</span>
              <span className="text-[11px] text-[#8a6a36]">Middle in gold</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListYourPieceSettingsHeroPromise;
