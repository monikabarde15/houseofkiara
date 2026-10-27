/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageChecksPanel (Spec §9.1, §9.2, Screen 32)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { CheckItem } from '../types/checks.types';

interface PageChecksPanelProps {
  checks: CheckItem[];
  onOpenCheckWords: (check: CheckItem) => void;
  onOpenFigure?: (key: string) => void;
  onAcknowledgeCheck: (checkId: string, reason: string) => void;
  onClose: () => void;
}

export const PageChecksPanel: React.FC<PageChecksPanelProps> = ({
  checks,
  onOpenCheckWords,
  onOpenFigure,
  onAcknowledgeCheck,
  onClose
}) => {
  const [activeReasonPromptCheckId, setActiveReasonPromptCheckId] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  // Sort highest importance first (high, medium, low)
  const sortedChecks = [...checks].sort((a, b) => {
    const score = { high: 3, medium: 2, low: 1 };
    return (score[b.importance] || 1) - (score[a.importance] || 1);
  });

  const handleConfirmReason = (checkId: string) => {
    if (!reasonInput.trim()) return;
    onAcknowledgeCheck(checkId, reasonInput.trim());
    setActiveReasonPromptCheckId(null);
    setReasonInput('');
  };

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs text-[#1a1612] max-h-[calc(100vh-140px)] overflow-y-auto">
      {/* 1. Header (Spec §9.1, Screen 32) */}
      <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
        <div>
          <span className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
            Health checks
          </span>
          <h2 className="font-serif text-[17px] text-[#1a1612] font-normal leading-snug">
            To look at ({sortedChecks.length})
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[#8a7f73] hover:text-[#1a1612] px-2 py-1 rounded hover:bg-[#f5f1eb] transition-colors"
        >
          Close
        </button>
      </div>

      <p className="text-[11.5px] text-[#73675a] leading-relaxed">
        The panel reads every page all the time and lists what needs a look. Checks are worked out from the words, never kept by hand, and change the moment words change.
      </p>

      {/* 2. Checks List */}
      <div className="space-y-3 pt-1">
        {sortedChecks.map(c => {
          const isHigh = c.importance === 'high';
          const isMedium = c.importance === 'medium';

          return (
            <div
              key={c.id}
              className={`p-3.5 rounded-[6px] border space-y-2.5 transition-all ${
                isHigh
                  ? 'bg-[#fffdfd] border-[#f2c6c6]'
                  : isMedium
                  ? 'bg-[#fffdfa] border-[#edd9b9]'
                  : 'bg-[#faf7f2] border-[#ebe5dc]'
              }`}
            >
              {/* Badge & Location */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isHigh
                      ? 'bg-[#993d3d] text-white'
                      : isMedium
                      ? 'bg-[#c5ad7d] text-[#1a1612]'
                      : 'bg-[#ebe5dc] text-[#5c5248]'
                  }`}
                >
                  {c.importance}
                </span>
                <span className="text-[11px] text-[#8a7f73] truncate">
                  {c.location || c.part || 'On this page'}
                </span>
              </div>

              {/* Title & Detail */}
              <div>
                <div className="font-medium text-[#1a1612] text-[12.5px] leading-snug">
                  {c.title}
                </div>
                <div className="text-[11.5px] text-[#5c5248] mt-1 leading-relaxed">
                  {c.detail || c.description}
                </div>
              </div>

              {/* Surrounding words snippet */}
              {(c.surroundingWords || c.targetText) && (
                <div className="p-2 rounded bg-white border border-[#ebe5dc] text-[11px] text-[#3d362e] italic font-serif">
                  "{c.surroundingWords || c.targetText}"
                </div>
              )}

              {/* Reason Prompt Form (Spec §9.4) */}
              {activeReasonPromptCheckId === c.id ? (
                <div className="pt-2 border-t border-[#f0eae1] space-y-2">
                  <label className="block text-[11px] font-medium text-[#73675a]">
                    Why is this not a figure? For example: an example amount.
                  </label>
                  <input
                    type="text"
                    value={reasonInput}
                    onChange={e => setReasonInput(e.target.value)}
                    placeholder="Enter reason..."
                    autoFocus
                    className="w-full p-1.5 bg-white border border-[#e6dccb] rounded text-xs text-[#1a1612]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleConfirmReason(c.id)}
                      className="px-2.5 py-1 rounded bg-[#1a1612] text-white text-[11px] font-medium"
                    >
                      Save reason
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveReasonPromptCheckId(null)}
                      className="px-2 py-1 text-[11px] text-[#73675a] hover:text-[#1a1612]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Action buttons */
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#f0eae1]">
                  <button
                    type="button"
                    onClick={() => onOpenCheckWords(c)}
                    className="text-xs text-[#8a6a36] font-medium hover:underline cursor-pointer"
                  >
                    Open
                  </button>

                  {c.suggestedFigureKey && onOpenFigure && (
                    <button
                      type="button"
                      onClick={() => onOpenFigure(c.suggestedFigureKey!)}
                      className="text-xs text-[#1a1612] font-medium hover:underline cursor-pointer"
                    >
                      The figure
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveReasonPromptCheckId(c.id);
                      setReasonInput('');
                    }}
                    className="text-xs text-[#73675a] hover:text-[#1a1612] hover:underline cursor-pointer"
                  >
                    It is an example
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {sortedChecks.length === 0 && (
          <div className="p-8 text-center text-[#8a7f73] italic">
            Nothing to look at today. The page is clean.
          </div>
        )}
      </div>
    </div>
  );
};

export default PageChecksPanel;
