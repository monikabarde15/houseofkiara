/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ReviewSheetWordsSection (Spec §10.2, Screens 18, 19)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';

interface WordEditItem {
  id: string;
  pageName: string;
  location: string;
  kind: 'added' | 'removed' | 'order-changed' | 'edited';
  beforeText?: string;
  afterText: string;
}

interface ReviewSheetWordsSectionProps {
  edits: WordEditItem[];
  exampleTicked: boolean;
  onToggleExampleTick: () => void;
  onDiscardPageEdits?: (pageName: string) => void;
  onNavigateToWords?: (location: string) => void;
}

export const ReviewSheetWordsSection: React.FC<ReviewSheetWordsSectionProps> = ({
  edits,
  exampleTicked,
  onToggleExampleTick,
  onDiscardPageEdits,
  onNavigateToWords
}) => {
  return (
    <div className="space-y-5">
      {/* 1. Examples to check by hand (Spec §10.2, Screen 19) */}
      <div className="p-4 rounded-[8px] bg-[#fff9ea] border border-[#f0deaa] space-y-2.5">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#785b1a]">
          Examples to check by hand (1)
        </div>
        <p className="text-[11.5px] text-[#5c4614] leading-relaxed">
          The Deposit Policy worked example was written for an earlier threshold. Verify that the calculations reflect the updated figures.
        </p>

        <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={exampleTicked}
            onChange={onToggleExampleTick}
            className="mt-0.5 rounded border-[#c5ad7d] text-[#1a1612] focus:ring-[#bda67b]"
          />
          <span className="text-[11.5px] text-[#3d362e] leading-snug">
            The dates in this example are worked out by hand. I have read it against the new figure and it is right.
          </span>
        </label>
      </div>

      {/* 2. Edits to the words by page (Spec §10.2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Edits to the words ({edits.length})
          </span>
          {onDiscardPageEdits && (
            <button
              type="button"
              onClick={() => onDiscardPageEdits('Refund & Cancellation Policy')}
              className="text-xs text-[#993d3d] hover:underline"
            >
              Discard these
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {edits.map(edit => (
            <div key={edit.id} className="p-3.5 bg-white border border-[#ebe5dc] rounded-[8px] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs border-b border-[#f0eae1] pb-1.5">
                <span className="font-semibold text-[#1a1612]">
                  {edit.pageName} · {edit.location}
                </span>
                {onNavigateToWords && (
                  <button
                    type="button"
                    onClick={() => onNavigateToWords(edit.location)}
                    className="text-xs text-[#8a6a36] hover:underline"
                  >
                    Open
                  </button>
                )}
              </div>

              {/* Word-by-word diff preview */}
              <div className="text-[11.5px] leading-relaxed space-y-1">
                {edit.beforeText && (
                  <div className="line-through text-[#993d3d] bg-[#fdf2f2] p-1.5 rounded">
                    {edit.beforeText}
                  </div>
                )}
                <div className="text-[#2c5e2e] bg-[#eef7ee] p-1.5 rounded font-medium">
                  {edit.afterText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSheetWordsSection;
