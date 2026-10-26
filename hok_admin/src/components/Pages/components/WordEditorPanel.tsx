/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: WordEditorPanel (Spec §7.4, §7.7, Screens 22 & 36)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';

export interface WordEditorPanelProps {
  partTitle: string;
  fieldName: string;
  helpText?: string;
  fieldValue: string;
  onUseFigure?: (detectedText: string, figureKey: string, figureLabel: string) => void;
  onCloseWords: () => void;
}

export const WordEditorPanel: React.FC<WordEditorPanelProps> = ({
  partTitle,
  fieldName,
  helpText = 'Prints the standard window. Change the window in Figures and this follows.',
  fieldValue,
  onUseFigure,
  onCloseWords
}) => {
  const [markedAsExample, setMarkedAsExample] = useState(false);
  const [substitutedNotice, setSubstitutedNotice] = useState<string | null>(null);

  // Spec §7.4 & Screen 36: Detect hand-typed figures
  const detectedHandTyped = (() => {
    if (markedAsExample || substitutedNotice) return null;
    if (fieldValue.includes('24 hours')) {
      return {
        matchedText: '24 hours',
        figureKey: 'order_cancel_window',
        figureLabel: 'Tell us about a problem within'
      };
    }
    if (fieldValue.includes('₹2,999')) {
      return {
        matchedText: '₹2,999',
        figureKey: 'free_delivery_min',
        figureLabel: 'Free delivery from'
      };
    }
    if (fieldValue.includes('7 days')) {
      return {
        matchedText: '7 days',
        figureKey: 'pre_rental_cancel_notice',
        figureLabel: 'Cancel without fee period'
      };
    }
    return null;
  })();

  const handleUseFigureClick = () => {
    if (!detectedHandTyped) return;
    if (onUseFigure) {
      onUseFigure(detectedHandTyped.matchedText, detectedHandTyped.figureKey, detectedHandTyped.figureLabel);
    }
    setSubstitutedNotice(`Now carries ${detectedHandTyped.figureLabel}. It changes when the figure does.`);
  };

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-[0_2px_12px_rgba(26,22,18,0.04)] space-y-5 text-xs text-[#1a1612]">
      {/* 1. Header with Part & Close Button (Spec §7.7) */}
      <div className="flex items-center justify-between border-b border-[#f5f1eb] pb-3">
        <div>
          <span className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
            {partTitle}
          </span>
          <h2 className="font-serif text-[17px] text-[#1a1612] font-normal leading-snug">
            {fieldName}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCloseWords}
          className="text-xs text-[#8a7f73] hover:text-[#1a1612] px-2 py-1 rounded hover:bg-[#f5f1eb] transition-colors"
        >
          Done
        </button>
      </div>

      {/* 2. Help note where words have one (Spec §7.7) */}
      {helpText && (
        <p className="text-[12px] text-[#73675a] leading-relaxed">
          {helpText}
        </p>
      )}

      {/* 3. Hints as the operator types (Spec §7.4, Screen 36) */}
      <div className="space-y-2 pt-1">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Hints in these words
        </div>

        {substitutedNotice && (
          <div className="p-3 bg-[#eef7ee] border border-[#bcdbb8] rounded-[6px] text-[11.5px] text-[#2c5e2e] leading-snug">
            {substitutedNotice}
          </div>
        )}

        {detectedHandTyped && !substitutedNotice && (
          <div className="p-3 bg-[#fff9ea] border border-[#f0deaa] rounded-[6px] space-y-2.5">
            <div className="text-[11.5px] text-[#785b1a] leading-snug">
              <span className="font-semibold">"{detectedHandTyped.matchedText}"</span> is typed by hand. It will not change when the figure does.
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleUseFigureClick}
                className="px-2.5 py-1 rounded bg-[#c5ad7d] text-[#1a1612] font-medium text-[11px] hover:bg-[#d8c399] transition-colors shadow-sm"
              >
                Use: {detectedHandTyped.figureLabel}
              </button>
              <button
                type="button"
                onClick={() => setMarkedAsExample(true)}
                className="px-2 py-1 text-[11px] text-[#785b1a] hover:underline"
              >
                It is an example
              </button>
            </div>
          </div>
        )}

        {!detectedHandTyped && !substitutedNotice && (
          <div className="text-[12px] text-[#8a7f73] italic">
            Nothing to look at in these words.
          </div>
        )}
      </div>

      {/* 4. Settings for the part (Spec §7.7) */}
      <div className="border-t border-[#f5f1eb] pt-4 space-y-3">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Settings for {partTitle}
        </div>

        {partTitle.toLowerCase().includes('hero') ? (
          <p className="text-[11.5px] text-[#73675a] leading-relaxed">
            Hero has no settings besides its words.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="text-[#4a4238]">Audience visibility</span>
              <span className="font-medium text-[#1a1612]">Both rental & preloved</span>
            </div>
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="text-[#4a4238]">Background wash</span>
              <span className="font-medium text-[#1a1612]">Warm paper (#faf7f2)</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. How it works reminder (Spec §7.7) */}
      <div className="border-t border-[#f5f1eb] pt-3 text-[11px] text-[#8a7f73] leading-relaxed">
        Click any words on the paper and type. Keystrokes are held as changes waiting until published.
      </div>
    </div>
  );
};

export default WordEditorPanel;
