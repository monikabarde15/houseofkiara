/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ReviewSheetFiguresSection (Spec §10.2, Screen 18)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { FigureItem } from '../types';

interface ReviewSheetFiguresSectionProps {
  figures: FigureItem[];
  onDiscardFigureChange?: (key: string) => void;
  onOpenFigure?: (key: string) => void;
}

export const ReviewSheetFiguresSection: React.FC<ReviewSheetFiguresSectionProps> = ({
  figures,
  onDiscardFigureChange,
  onOpenFigure
}) => {
  const [showAllSentences, setShowAllSentences] = useState<Record<string, boolean>>({});

  const changedFigures = figures.filter(f => f.hasPendingChange || f.status === 'waiting');

  if (changedFigures.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
        Figures waiting to change ({changedFigures.length})
      </div>

      <div className="space-y-4">
        {changedFigures.map(fig => {
          const waitingVal = fig.waitingChange?.value || fig.displayValue;
          const isScheduled = fig.waitingChange?.when === 'date';
          const scheduledDate = fig.waitingChange?.date || '1 December 2026';
          const isExpanded = Boolean(showAllSentences[fig.key]);

          const sampleSentences = [
            {
              page: 'Refund & Cancellation Policy',
              before: 'Free delivery applies on all rental orders of ₹5,000 or more nationwide.',
              after: `Free delivery applies on all rental orders of ${waitingVal} or more nationwide.`
            },
            {
              page: 'Shipping & Delivery Policy',
              before: 'Standard orders over ₹5,000 include complimentary courier transit.',
              after: `Standard orders over ${waitingVal} include complimentary courier transit.`
            }
          ];

          return (
            <div key={fig.key} className="p-4 bg-white border border-[#ebe5dc] rounded-[8px] space-y-3 shadow-2xs">
              {/* Figure header with values diff */}
              <div className="flex items-start justify-between gap-2 border-b border-[#f0eae1] pb-2.5">
                <div>
                  <h4 className="font-serif text-[16px] text-[#1a1612]">
                    {fig.label}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="line-through text-[#993d3d] text-xs font-serif">
                      {fig.displayValue}
                    </span>
                    <span className="text-xs text-[#73675a]">→</span>
                    <span className="text-[#2c5e2e] font-semibold text-xs font-serif bg-[#eef7ee] px-1.5 py-0.5 rounded">
                      {waitingVal}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenFigure && (
                    <button
                      type="button"
                      onClick={() => onOpenFigure(fig.key)}
                      className="text-xs text-[#8a6a36] hover:underline"
                    >
                      Change
                    </button>
                  )}
                  {onDiscardFigureChange && (
                    <button
                      type="button"
                      onClick={() => onDiscardFigureChange(fig.key)}
                      className="text-xs text-[#993d3d] hover:underline"
                    >
                      Discard
                    </button>
                  )}
                </div>
              </div>

              {/* Timing & Contractual Note (Spec §10.2) */}
              <div className="text-[11px] text-[#5c5248] space-y-1">
                <div>
                  <strong>When it changes: </strong>
                  {isScheduled
                    ? `From ${scheduledDate}. Until then the site keeps saying ${fig.displayValue}.`
                    : 'As soon as it is published.'}
                </div>
                <div className="text-[#8a7f73] italic">
                  Orders and bookings made before then keep the old figure.
                </div>
                {fig.waitingChange?.why && (
                  <div>
                    <strong>Why: </strong>
                    <span>{fig.waitingChange.why}</span>
                  </div>
                )}
              </div>

              {/* Sentences before and after diff (Spec §10.2) */}
              <div className="space-y-2 pt-2 border-t border-[#f0eae1]">
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73] flex items-center justify-between">
                  <span>Sentences that will change ({sampleSentences.length})</span>
                  <button
                    type="button"
                    onClick={() => setShowAllSentences(prev => ({ ...prev, [fig.key]: !isExpanded }))}
                    className="text-[10.5px] text-[#8a6a36] hover:underline cursor-pointer"
                  >
                    {isExpanded ? 'Show less' : 'Show all'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(isExpanded ? sampleSentences : sampleSentences.slice(0, 1)).map(s => (
                    <div key={s.page} className="p-2 rounded bg-[#fcfaf7] border border-[#f0eae1] text-[11px] space-y-1">
                      <div className="font-semibold text-[#8a6a36]">{s.page}</div>
                      <div className="line-through text-[#993d3d]">{s.before}</div>
                      <div className="text-[#2c5e2e]">{s.after}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSheetFiguresSection;
