/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinksSummaryHeader (Spec §6.1)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { AlertCircle, ExternalLink, Link2, FileQuestion, Mail, DownloadCloud, CheckCircle2 } from 'lucide-react';

interface LinksSummaryHeaderProps {
  thingsToFixCount: number;
  externalBrokenCount: number;
  internalBrokenCount: number;
  notFoundCount: number;
  unverifiedAddressesCount: number;
  brokenDownloadsCount: number;
  activeCardFilter: string;
  onSelectCardFilter: (cardId: string) => void;
}

export const LinksSummaryHeader: React.FC<LinksSummaryHeaderProps> = ({
  thingsToFixCount,
  externalBrokenCount,
  internalBrokenCount,
  notFoundCount,
  unverifiedAddressesCount,
  brokenDownloadsCount,
  activeCardFilter,
  onSelectCardFilter
}) => {
  return (
    <div className="p-5 rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] space-y-4">
      {/* Top Title & Alert Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e6dccb]">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#8a6a36] font-medium">Link & Address Health</span>
          <h2 className="text-xl font-serif font-bold text-[#1a1612]">
            Links and Addresses
          </h2>
          <p className="text-xs text-[#5c5248] mt-0.5">
            Audit of external references, internal cross-links, 404 user requests, and customer contact endpoints.
          </p>
        </div>

        {thingsToFixCount > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#a4512f]/10 text-[#a4512f] border border-[#a4512f]/30 self-start sm:self-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-semibold">
              {thingsToFixCount} things to fix across 5 categories
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#6b7e5a]/10 text-[#6b7e5a] border border-[#6b7e5a]/30 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="text-xs font-semibold">
              All links and addresses verified
            </span>
          </div>
        )}
      </div>

      {/* 5 Category Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => onSelectCardFilter('all')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeCardFilter === 'all'
              ? 'bg-[#1a1612] text-white'
              : 'bg-[#f7f2ea] text-[#5c5248] hover:bg-[#efe7db] border border-[#d9ccb6]'
          }`}
        >
          All 5 cards
        </button>

        <button
          onClick={() => onSelectCardFilter('external')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeCardFilter === 'external'
              ? 'bg-[#1a1612] text-white'
              : 'bg-[#f7f2ea] text-[#5c5248] hover:bg-[#efe7db] border border-[#d9ccb6]'
          }`}
        >
          <ExternalLink className="w-3 h-3 text-[#8a6a36]" />
          <span>External links</span>
          {externalBrokenCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#a4512f] text-white font-mono">
              {externalBrokenCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectCardFilter('internal')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeCardFilter === 'internal'
              ? 'bg-[#1a1612] text-white'
              : 'bg-[#f7f2ea] text-[#5c5248] hover:bg-[#efe7db] border border-[#d9ccb6]'
          }`}
        >
          <Link2 className="w-3 h-3 text-[#8a6a36]" />
          <span>Internal links</span>
          {internalBrokenCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#a4512f] text-white font-mono">
              {internalBrokenCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectCardFilter('404')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeCardFilter === '404'
              ? 'bg-[#1a1612] text-white'
              : 'bg-[#f7f2ea] text-[#5c5248] hover:bg-[#efe7db] border border-[#d9ccb6]'
          }`}
        >
          <FileQuestion className="w-3 h-3 text-[#3d6e8e]" />
          <span>404 addresses</span>
          {notFoundCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#a4512f] text-white font-mono">
              {notFoundCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectCardFilter('contacts')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeCardFilter === 'contacts'
              ? 'bg-[#1a1612] text-white'
              : 'bg-[#f7f2ea] text-[#5c5248] hover:bg-[#efe7db] border border-[#d9ccb6]'
          }`}
        >
          <Mail className="w-3 h-3 text-[#6e6358]" />
          <span>Email & phones</span>
          {unverifiedAddressesCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#a4512f] text-white font-mono">
              {unverifiedAddressesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectCardFilter('downloads')}
          className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeCardFilter === 'downloads'
              ? 'bg-[#1a1612] text-white'
              : 'bg-[#f7f2ea] text-[#5c5248] hover:bg-[#efe7db] border border-[#d9ccb6]'
          }`}
        >
          <DownloadCloud className="w-3 h-3 text-[#6e6358]" />
          <span>Downloads</span>
          {brokenDownloadsCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#a4512f] text-white font-mono">
              {brokenDownloadsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default LinksSummaryHeader;
