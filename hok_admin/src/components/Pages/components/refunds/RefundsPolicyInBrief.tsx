/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsPolicyInBrief (Spec §8.12 Part 04)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldProps } from '../types';

interface RefundsPolicyInBriefProps extends EditableFieldProps {
  activeTab: 'rental' | 'preloved';
  onSelectFigure?: (figureKey: string) => void;
  onOpenRowAnswer?: (answerId: string) => void;
}

export const RefundsPolicyInBrief: React.FC<RefundsPolicyInBriefProps> = ({
  activeTab,
  onSelectFigure,
  onOpenRowAnswer
}) => {
  const rentalRows = [
    {
      id: 'r1',
      hasFigure: true,
      figureKey: 'rental_cancel_full',
      figureValue: '7 days',
      prefix: 'Cancel more than ',
      suffix: ' before your rental starts',
      verdict: 'FULL REFUND',
      tone: 'good',
      opens: 'What do I get back if I cancel more than 7 days before my rental starts?'
    },
    {
      id: 'r2',
      hasFigure: true,
      figureKey: 'rental_cancel_full',
      figureValue: '7 days',
      prefix: 'Cancel within ',
      suffix: ', before dispatch',
      verdict: 'MESSAGE US FIRST',
      tone: 'mid',
      opens: 'What if I cancel within 7 days of my rental start date?'
    },
    {
      id: 'r3',
      text: 'Cancel once your piece is dispatched',
      verdict: 'NO REFUND',
      tone: 'no',
      opens: 'Can I cancel after my rental has been dispatched?'
    },
    {
      id: 'r4',
      text: 'Change your dates or swap your piece, before dispatch',
      verdict: 'USUALLY POSSIBLE',
      tone: 'good',
      opens: 'Can I swap to a different piece or size?'
    },
    {
      id: 'r5',
      hasFigure: true,
      figureKey: 'deposit_refund_window',
      figureValue: '3 TO 5 BUSINESS DAYS',
      prefix: 'Your security deposit',
      verdict: 'BACK IN 3 TO 5 BUSINESS DAYS',
      tone: 'mid',
      opens: 'When do I get my deposit back?'
    },
    {
      id: 'r6',
      text: 'Late delivery, a wrong piece, or anything else on us',
      verdict: 'FULL REFUND',
      tone: 'good',
      opens: 'My piece arrived damaged or stained'
    }
  ];

  const prelovedRows = [
    {
      id: 'p1',
      text: 'Cancel before your piece is dispatched',
      verdict: 'FULL REFUND',
      tone: 'good',
      opens: 'Can I cancel a preloved purchase before dispatch?'
    },
    {
      id: 'p2',
      text: 'Cancel once your piece is dispatched',
      verdict: 'CANNOT CANCEL',
      tone: 'no',
      opens: 'Can I cancel a preloved purchase after dispatch?'
    },
    {
      id: 'p3',
      text: 'If the piece is not as described, tell us within 24 hours',
      verdict: 'FULL REFUND OR EXCHANGE',
      tone: 'good',
      opens: 'What if my preloved piece is not as described?'
    },
    {
      id: 'p4',
      text: 'If the piece is delayed beyond the agreed window',
      verdict: 'FULL REFUND',
      tone: 'good',
      opens: 'What happens if a preloved delivery is delayed?'
    },
    {
      id: 'p5',
      text: 'If you simply change your mind after delivery',
      verdict: 'NOT RETURNABLE',
      tone: 'no',
      opens: 'Can I return a preloved piece if I change my mind?'
    }
  ];

  const rows = activeTab === 'rental' ? rentalRows : prelovedRows;

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 md:p-8 shadow-2xs space-y-4">
      {/* Header */}
      <div className="border-b border-[#1c1917] pb-3">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-[#935b1e] uppercase block">
          THE POLICY IN BRIEF
        </span>
        <span className="text-xs text-[#73675a] mt-0.5 block">
          {activeTab === 'rental' ? 'Rental policy' : 'Preloved policy'}
        </span>
      </div>

      {/* Rows Table */}
      <div className="divide-y divide-[#f0ebe3]">
        {rows.map((row) => (
          <div
            key={row.id}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-[#faf7f2]/50 px-2 rounded transition-colors"
          >
            {/* Situation statement with tokenized figures */}
            <div className="text-[#1c1917] font-normal leading-relaxed text-[13px]">
              {row.hasFigure ? (
                <span>
                  {row.prefix}
                  <button
                    type="button"
                    onClick={() => onSelectFigure?.(row.figureKey || 'rental_cancel_full')}
                    className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#faeedd] border border-[#d8c3a5] text-[#935b1e] font-medium hover:bg-[#f6e5cd] transition cursor-pointer mx-1 shadow-2xs"
                    title="Figure token: click to inspect and edit"
                  >
                    {row.figureValue}
                  </button>
                  {row.suffix}
                </span>
              ) : (
                <span>{row.text}</span>
              )}
            </div>

            {/* Verdict with tone indicator */}
            <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase">
              <span
                className={`w-2 h-2 rounded-full ${
                  row.tone === 'good'
                    ? 'bg-[#2e7d32]'
                    : row.tone === 'mid'
                    ? 'bg-[#c5ad7d]'
                    : 'bg-[#c62828]'
                }`}
              />
              <span
                className={
                  row.tone === 'good'
                    ? 'text-[#2e7d32]'
                    : row.tone === 'mid'
                    ? 'text-[#935b1e]'
                    : 'text-[#c62828]'
                }
              >
                {row.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundsPolicyInBrief;
