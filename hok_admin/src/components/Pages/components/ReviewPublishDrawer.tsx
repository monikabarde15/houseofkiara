/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ReviewPublishDrawer (Spec §10.2, Screens 18, 19, 64)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { FigureItem } from '../types';
import { ReviewSheetFiguresSection } from './ReviewSheetFiguresSection';
import { ReviewSheetWordsSection } from './ReviewSheetWordsSection';
import { ReviewSheetVersionsSection } from './ReviewSheetVersionsSection';

interface ReviewPublishDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  figures: FigureItem[];
  accessLevel: 'Full Access' | 'Edit' | 'View Only';
  onConfirmPublish: () => void;
  onDiscardFigureChange?: (key: string) => void;
}

export const ReviewPublishDrawer: React.FC<ReviewPublishDrawerProps> = ({
  isOpen,
  onClose,
  figures,
  accessLevel,
  onConfirmPublish,
  onDiscardFigureChange
}) => {
  const [exampleTicked, setExampleTicked] = useState(true);

  if (!isOpen) return null;

  const canPublish = accessLevel === 'Full Access';
  const hasBlocker = !exampleTicked;

  const sampleEdits = [
    {
      id: 'we_1',
      pageName: 'Refund & Cancellation Policy',
      location: 'Hero › Line under the heading',
      kind: 'edited' as const,
      beforeText: 'Plans change, and we understand. Before you order or after...',
      afterText: 'Plans change, and we understand. Before you order or after, here is exactly what happens when they do, in plain words and with no surprises.'
    }
  ];

  const versionImpacts = [
    {
      pageName: 'Refund & Cancellation Policy',
      fromVersion: 'Version 7',
      toVersion: 'Version 8',
      effectiveDate: 'Today, 20 October 2026',
      summary: [
        'Free delivery from: updated threshold',
        '2 edits to the words: Hero line, Answers'
      ]
    }
  ];

  const scheduledItems = [
    {
      id: 'sch_1',
      title: 'Free delivery threshold change to ₹6,000',
      targetDate: '1 December 2026',
      who: 'Anita Sen'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-xl h-full sm:h-auto sm:max-h-[92vh] bg-white sm:rounded-[10px] shadow-2xl border border-[#ebe5dc] flex flex-col overflow-hidden text-xs text-[#1a1612]">
        {/* 1. Header (Spec §10.2) */}
        <div className="p-5 border-b border-[#f0eae1] bg-[#faf7f2]/60 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif text-[20px] text-[#1a1612] font-normal leading-snug">
              Review before it goes live
            </h2>
            <p className="text-[11.5px] text-[#73675a] mt-0.5">
              1 figure change and 2 edits to the words waiting. Nothing here is live until it is published.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a7f73] hover:text-[#1a1612] p-1.5 rounded"
          >
            ✕
          </button>
        </div>

        {/* 2. Scrollable Body Sections */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f7f2ea]/30">
          {/* Figures with sentence diffs (Screen 18) */}
          <ReviewSheetFiguresSection
            figures={figures}
            onDiscardFigureChange={onDiscardFigureChange}
          />

          {/* Words diffs & example verification (Screen 19) */}
          <ReviewSheetWordsSection
            edits={sampleEdits}
            exampleTicked={exampleTicked}
            onToggleExampleTick={() => setExampleTicked(!exampleTicked)}
          />

          {/* New version numbers & scheduled changes */}
          <ReviewSheetVersionsSection
            versionImpacts={versionImpacts}
            scheduledItems={scheduledItems}
            canCancelScheduled={canPublish}
          />
        </div>

        {/* 3. Footer with Blockers & Permission Enforcement (Spec §10.2, Screen 64) */}
        <div className="p-4 border-t border-[#f0eae1] bg-[#faf7f2]/80 space-y-3 shrink-0">
          {/* Blocker alert if example not checked */}
          {hasBlocker && (
            <div className="p-2.5 rounded bg-[#fff0f0] border border-[#f5c6c6] text-[11.5px] text-[#993d3d]">
              <strong>Before publishing: </strong>
              The Deposit Policy worked example must be confirmed.
            </div>
          )}

          {/* Edit role notice (Screen 64) */}
          {!canPublish && (
            <div className="p-2.5 rounded bg-[#fff9ea] border border-[#f0deaa] text-[11.5px] text-[#785b1a]">
              Publishing needs Full Access to Pages. These changes wait here for someone who has it.
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-[#e6dccb] bg-white hover:bg-[#faf7f2] text-xs font-medium text-[#73675a] hover:text-[#1a1612]"
            >
              Keep editing
            </button>

            <button
              type="button"
              disabled={!canPublish || hasBlocker}
              onClick={() => {
                onConfirmPublish();
                onClose();
              }}
              className="px-4 py-2 rounded bg-[#1a1612] text-white text-xs font-medium hover:bg-[#332e27] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Publish 3 changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPublishDrawer;
