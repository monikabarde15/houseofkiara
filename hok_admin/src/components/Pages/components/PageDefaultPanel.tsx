/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageDefaultPanel (Spec §7.7, Screen 20)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../types';

interface PageDefaultPanelProps {
  page: PageCardData;
  onOpenFigure?: (key: string) => void;
  onOpenChecks?: () => void;
  onOpenSettings?: () => void;
  onMarkReviewed?: () => void;
}

export const PageDefaultPanel: React.FC<PageDefaultPanelProps> = ({
  page,
  onOpenFigure,
  onOpenChecks,
  onOpenSettings,
  onMarkReviewed
}) => {
  const sampleChecks = [
    { id: 'c1', type: 'high', title: 'Prints a retired figure: Extended rental window', location: 'Answers · Can I switch to a shorter rental window for a lower price?' },
    { id: 'c2', type: 'high', title: 'Prints a retired figure: Deposit arranged within', location: 'Answers · When and how do I pay the deposit?' },
    { id: 'c3', type: 'medium', title: 'A word the site never uses: insured, insurance', location: 'Answers · The courier lost my parcel' },
    { id: 'c4', type: 'medium', title: 'Prints a figure waiting for a decision: Decision on a claim within', location: 'Answers · How quickly will you reply to my claim?' },
    { id: 'c5', type: 'medium', title: 'A hand-written example to check', location: 'Answers · How are the 7 days counted?' }
  ];

  const topFigures = [
    { key: 'problem_window', label: 'Tell us about a problem within', value: '24 hours' },
    { key: 'full_refund_window', label: 'Full refund window, cancellations', value: '7 days' },
    { key: 'late_cancel_share', label: 'Refund inside that window, before dispatch', value: '70%' },
    { key: 'deposit_receipt_confirm', label: 'Deposit receipt confirmed within', value: '2 hours' }
  ];

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-5 text-xs">
      {/* 1. Page Header Metadata */}
      <div>
        <div className="text-[11.5px] text-[#73675a] capitalize">
          {page.group.replace('-', ' ')}
        </div>
        <h2 className="font-serif text-[22px] font-normal text-[#1a1612] mt-0.5">
          {page.title}
        </h2>
        <p className="text-[12px] text-[#5c5248] mt-1.5 leading-relaxed">
          {page.summary}
        </p>
      </div>

      {/* 2. Key Metadata Grid */}
      <div className="border-t border-[#f0ebe3] pt-3.5 space-y-2 text-[12px]">
        <div className="flex justify-between">
          <span className="text-[#8a7f73]">Address</span>
          <span className="font-mono text-[#1a1612]">{page.slug}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#8a7f73]">Version</span>
          <span className="text-[#1a1612]">{page.version || 'Version 7'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#8a7f73]">Last reviewed</span>
          <span className="text-[#1a1612]">{page.lastPublished || '23 September 2026'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#8a7f73]">Built from</span>
          <span className="font-mono text-[11px] text-[#5c5248]">{page.builtFrom || 'hok_refund_cancellation_v7'}</span>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={page.slug}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-1.5 px-3 bg-white border border-[#e6dccb] rounded-[4px] text-center text-xs text-[#1a1612] hover:bg-[#faf7f2] cursor-pointer transition-colors"
        >
          View on the site ↗
        </a>
        <button
          type="button"
          onClick={onMarkReviewed}
          className="flex-1 py-1.5 px-3 bg-white border border-[#e6dccb] rounded-[4px] text-xs text-[#1a1612] hover:bg-[#faf7f2] cursor-pointer transition-colors"
        >
          Mark as reviewed today
        </button>
      </div>

      {/* 4. Section: To look at (Spec §7.7) */}
      <div className="border-t border-[#f0ebe3] pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[12.5px] font-semibold text-[#1a1612]">
            To look at
          </h3>
          {onOpenChecks && (
            <button
              type="button"
              onClick={onOpenChecks}
              className="text-[#8a6a36] hover:underline cursor-pointer"
            >
              All {page.checksCount || sampleChecks.length}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {sampleChecks.map(check => (
            <div key={check.id} className="flex items-start gap-2">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                check.type === 'high' ? 'bg-[#b85c38]' : 'bg-[#d19a3c]'
              }`} />
              <div className="min-w-0">
                <div className="font-medium text-[#1a1612] leading-tight">
                  {check.title}
                </div>
                <div className="text-[11px] text-[#8a7f73] mt-0.5 truncate">
                  {check.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Section: Figures on this page (Spec §7.7) */}
      <div className="border-t border-[#f0ebe3] pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[12.5px] font-semibold text-[#1a1612]">
            Figures on this page
          </h3>
          <span className="text-[#8a7f73]">
            All {page.figuresCount || 23}
          </span>
        </div>

        <div className="space-y-2">
          {topFigures.map(fig => (
            <div
              key={fig.key}
              onClick={() => onOpenFigure && onOpenFigure(fig.key)}
              className="flex items-center justify-between gap-2 py-1 px-1.5 -mx-1.5 rounded hover:bg-[#faf7f2] cursor-pointer transition-colors"
            >
              <span className="text-[#5c5248] truncate">{fig.label}</span>
              <span className="font-serif text-[13.5px] text-[#1a1612] shrink-0">{fig.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Section: How it works (Spec §7.7) */}
      <div className="border-t border-[#f0ebe3] pt-4 space-y-2 text-[#73675a] text-[11.5px] leading-relaxed">
        <p>
          Click any words on the page and type. A sentence that carries a figure shows it in gold: click the gold word to see the figure and every page that prints it. The bar above a sentence makes words bold, adds a link or puts a figure in.
        </p>
        <p>
          Where buttons lead, which questions are listed, tones and pictures are in Page settings. Nothing goes live until it is published.
        </p>
      </div>
    </div>
  );
};

export default PageDefaultPanel;
