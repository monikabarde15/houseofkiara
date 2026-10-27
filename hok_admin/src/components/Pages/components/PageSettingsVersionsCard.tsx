/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageSettingsVersionsCard (Spec §10.5, Screen 30)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../types';

interface PageSettingsVersionsCardProps {
  page: PageCardData;
  onReadAsOnDate: (date: string) => void;
}

interface VersionEntry {
  version: string;
  date: string;
  who: string;
  isScheduled?: boolean;
  changes: string[];
}

export const PageSettingsVersionsCard: React.FC<PageSettingsVersionsCardProps> = ({
  page,
  onReadAsOnDate
}) => {
  const [lastReviewed, setLastReviewed] = useState(page.lastReviewed || '23 October 2026');
  const [asOnDate, setAsOnDate] = useState('2026-08-12');

  const versionHistory: VersionEntry[] = [
    {
      version: 'Version 7 (Current)',
      date: '20 October 2026',
      who: 'Anita Sen',
      changes: [
        'Updated order cancel grace window from 12 hours to 24 hours',
        'Added Preloved return trial terms (48 hour ribbon window)',
        'Updated free delivery threshold to ₹5,000'
      ]
    },
    {
      version: 'Version 6',
      date: '14 August 2026',
      who: 'Priya Mehta',
      changes: [
        'Aligned normal wear definitions with Deposit Policy',
        'Clarified concierge WhatsApp claim procedure'
      ]
    },
    {
      version: 'Version 5',
      date: '28 May 2026',
      who: 'Anita Sen',
      changes: [
        'Initial release of dual rental and preloved policy tabs'
      ]
    }
  ];

  const handleMarkReviewed = () => {
    setLastReviewed('Today, 24 October 2026');
  };

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-6 text-xs text-[#1a1612]">
      {/* 1. Header */}
      <div className="border-b border-[#f0eae1] pb-3">
        <h3 className="font-serif text-[18px] text-[#1a1612]">
          Versions & legal audit trail
        </h3>
        <p className="text-[11.5px] text-[#73675a] mt-0.5">
          Customers are held to the version of a policy in force when they ordered. Every published change creates a dated version.
        </p>
      </div>

      {/* 2. This version status */}
      <div className="p-4 rounded-[6px] bg-[#faf7f2] border border-[#ebe5dc] space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium text-[13px] text-[#1a1612]">
            {page.version || 'Version 7'}
          </div>
          <button
            type="button"
            onClick={handleMarkReviewed}
            className="px-2.5 py-1 rounded bg-white border border-[#d6ccbd] text-xs font-medium text-[#8a6a36] hover:bg-[#faf7f2] shadow-2xs transition-colors"
          >
            Mark as reviewed today
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
          <div>
            <span className="text-[#8a7f73] block">In force from:</span>
            <span className="font-medium text-[#1a1612]">20 October 2026</span>
          </div>
          <div>
            <span className="text-[#8a7f73] block">Last updated:</span>
            <span className="font-medium text-[#1a1612]">{page.lastPublished || '20 October 2026'}</span>
          </div>
          <div>
            <span className="text-[#8a7f73] block">Last reviewed:</span>
            <span className="font-medium text-[#1a1612]">{lastReviewed}</span>
          </div>
        </div>
      </div>

      {/* 3. Read it as on a date (Spec §10.6, Screen 31) */}
      <div className="space-y-2 pt-2 border-t border-[#f0eae1]">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Read it as on a date
        </div>
        <p className="text-[11px] text-[#73675a]">
          Useful for disputes about what a policy stated when a customer booked. Shows past words and figure values.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <input
            type="date"
            value={asOnDate}
            onChange={e => setAsOnDate(e.target.value)}
            className="p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
          />
          <button
            type="button"
            onClick={() => onReadAsOnDate(asOnDate)}
            className="px-3 py-2 rounded bg-[#1a1612] text-white text-xs font-medium hover:bg-[#332e27] transition-colors"
          >
            Read it
          </button>
        </div>
      </div>

      {/* 4. Every version, newest first */}
      <div className="space-y-3 pt-3 border-t border-[#f0eae1]">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Every version, newest first
        </div>

        <div className="space-y-3">
          {versionHistory.map(entry => (
            <div key={entry.version} className="p-3.5 rounded bg-[#fcfaf7] border border-[#ebe5dc] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1a1612]">
                  {entry.version}
                </span>
                <span className="text-[#8a7f73] text-[11px]">
                  {entry.date} by {entry.who}
                </span>
              </div>
              <ul className="space-y-1 text-[11.5px] text-[#5c5248] pl-3 list-disc marker:text-[#c5ad7d]">
                {entry.changes.map(ch => (
                  <li key={ch}>{ch}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSettingsVersionsCard;
