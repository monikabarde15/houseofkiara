/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPieceSettingsBoutiqueFAQ (Spec §8.8 Settings)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface ListYourPieceSettingsBoutiqueFAQProps {
  hiddenParts: Record<string, boolean>;
  onTogglePartHidden: (partId: string) => void;
  onOpenAnswersView?: () => void;
}

export const ListYourPieceSettingsBoutiqueFAQ: React.FC<ListYourPieceSettingsBoutiqueFAQProps> = ({
  hiddenParts,
  onTogglePartHidden,
  onOpenAnswersView
}) => {
  return (
    <div className="space-y-6">
      {/* 07 For Boutiques Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 07 · For Boutiques</div>
            <div className="text-[11px] text-[#73675a]">The designer and boutique partner pitch</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['for-boutiques']}
              onChange={() => onTogglePartHidden('for-boutiques')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div>
          <label className="block text-[11px] text-[#8a7f73] mb-1">Button text</label>
          <input
            type="text"
            defaultValue="PARTNER WITH US →"
            className="w-full px-2.5 py-1.5 border border-[#dcd4c7] rounded text-xs text-[#1a1612]"
          />
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] text-[#8a7f73]">Key partner figures (3 in order):</div>
          <div className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
            <span className="font-medium text-[#1a1612]">30+</span>
            <span className="text-[11px] text-[#8a7f73]">Designer houses partnered</span>
          </div>
          <div className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
            <span className="font-medium text-[#1a1612]">100%</span>
            <span className="text-[11px] text-[#8a7f73]">White-glove management</span>
          </div>
          <div className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
            <span className="font-medium text-[#1a1612]">T+3 days</span>
            <span className="text-[11px] text-[#8a7f73]">Monthly reconciliation</span>
          </div>
        </div>
      </div>

      {/* 08 FAQ Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f0ebe3] pb-3">
          <div>
            <div className="font-semibold text-[#1a1612] text-sm">Part 08 · FAQ</div>
            <div className="text-[11px] text-[#73675a]">6 questions picked from Help & FAQs and Seller Guidelines</div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#73675a]">Show band</span>
            <input
              type="checkbox"
              checked={!hiddenParts['faq']}
              onChange={() => onTogglePartHidden('faq')}
              className="accent-[#b89047] cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-2">
          {[
            'How is the rental price determined?',
            'What happens if a piece gets damaged or stained?',
            'Can I get my piece back whenever I want?',
            'Who pays for dry cleaning and maintenance?',
            'How and when do I get paid?',
            'Do you accept unbranded or bespoke designer pieces?'
          ].map((q, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 px-2 bg-[#faf7f2] rounded border border-[#ebe5dc]">
              <span className="text-[#1a1612] truncate max-w-[280px]">
                {idx + 1}. {q}
              </span>
              <span className="text-[10px] text-[#8a6a36] font-mono shrink-0">Picked</span>
            </div>
          ))}
        </div>

        {onOpenAnswersView && (
          <button
            type="button"
            onClick={onOpenAnswersView}
            className="w-full py-2 bg-[#faf7f2] border border-[#e6dccb] rounded text-center text-xs font-medium text-[#8a6a36] hover:bg-[#f2ece1] cursor-pointer transition-colors"
          >
            + Add or manage questions in Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default ListYourPieceSettingsBoutiqueFAQ;
