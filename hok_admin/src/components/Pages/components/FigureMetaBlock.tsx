/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureMetaBlock (Spec §5.2, Screens 04 & 10)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FigureItem } from '../types';

interface FigureMetaBlockProps {
  figure: FigureItem;
  onOpenSection?: (sectionName: string) => void;
}

export const FigureMetaBlock: React.FC<FigureMetaBlockProps> = ({
  figure,
  onOpenSection
}) => {
  const drives = figure.drives || [
    'Cart: shows how much more brings the order to free delivery',
    'Checkout: the delivery line reads Free at or above it',
    'Promotions: the order calculator applies free delivery before any code',
    'Announcement bar: the free delivery message'
  ];

  const historyEntries = figure.history || [
    {
      value: figure.displayValue,
      dateInForce: 'since October 2026',
      who: 'Soumya',
      why: 'Raised with the Shipping & Delivery Policy, and counted before GST. For a rental it covers both journeys.',
      recordedAt: '2026-10-20'
    },
    {
      value: '₹2,999',
      dateInForce: 'from March 2026',
      who: 'Original',
      why: 'The figure the site was first built with.',
      recordedAt: '2026-03-01'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 1. What it drives behind the scenes (Spec §5.2, Screen 10) */}
      <div className="border-t border-[#f0ebe3] pt-4 space-y-2.5">
        <h3 className="text-[13.5px] font-semibold text-[#1a1612]">
          What it drives behind the scenes
        </h3>

        <div className="space-y-2">
          {drives.map((drive, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 text-[12px] text-[#4a4238]"
            >
              <div className="flex items-start gap-2">
                <span className="text-[#8a7f73] mt-0.5">→</span>
                <span>{drive}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenSection && onOpenSection(drive.split(':')[0])}
                className="text-[11.5px] text-[#8a6a36] hover:underline font-medium shrink-0 cursor-pointer"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. History Timeline (Spec §5.2, Screen 10) */}
      <div className="border-t border-[#f0ebe3] pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[13.5px] font-semibold text-[#1a1612]">
            History
          </h3>
          <button
            type="button"
            className="text-[11.5px] text-[#8a6a36] hover:underline cursor-pointer"
          >
            Read the pages as on a date
          </button>
        </div>

        <div className="space-y-3 text-[12px]">
          {historyEntries.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                idx === 0 ? 'bg-[#bda67b]' : 'border border-[#8a7f73] bg-white'
              }`} />
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-serif text-[14px] font-medium text-[#1a1612]">
                    {entry.value}
                  </span>
                  <span className="text-[11px] text-[#8a7f73]">
                    {entry.dateInForce} · {entry.who}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#5c5248] leading-relaxed">
                  {entry.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FigureMetaBlock;
