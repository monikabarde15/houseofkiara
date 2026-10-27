/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageLevelTwoHeader (Spec §3.1, §7.2, Screen 20)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../types';

interface PagePartItem {
  id: string;
  label: string;
  hasChecks?: boolean;
  count?: number;
}

interface PageLevelTwoHeaderProps {
  page: PageCardData;
  allPages: PageCardData[];
  onSelectPage: (slug: string) => void;
  onBackToPages: () => void;
  activePartId: string;
  onSelectPart: (partId: string) => void;
  parts: PagePartItem[];
  figuresCount: number;
  checksCount: number;
  activePanelTab: 'default' | 'figures' | 'checks' | 'settings';
  onSelectPanelTab: (tab: 'default' | 'figures' | 'checks' | 'settings') => void;
  showMode: 'waiting' | 'live' | 'date';
  onShowModeChange: (mode: 'waiting' | 'live' | 'date') => void;
}

export const PageLevelTwoHeader: React.FC<PageLevelTwoHeaderProps> = ({
  page,
  allPages,
  onSelectPage,
  onBackToPages,
  activePartId,
  onSelectPart,
  parts,
  figuresCount,
  checksCount,
  activePanelTab,
  onSelectPanelTab,
  showMode,
  onShowModeChange
}) => {
  const [isPageSwitcherOpen, setIsPageSwitcherOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#fffefb] border-b border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)]">
      {/* Row 1: Back to All pages & Breadcrumb (Screen 20) */}
      <div className="h-[48px] border-b border-[#f0ebe3] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToPages}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] border border-[#e6dccb] bg-white text-xs font-medium text-[#5c5248] hover:text-[#1a1612] hover:bg-[#faf7f2] transition cursor-pointer shadow-2xs"
          >
            <span>‹</span>
            <span>Back to All pages</span>
          </button>
          <span className="text-xs text-[#73675a]">Pages</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#5c5248]">
          <a
            href={page.slug}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#1a1612] transition-colors"
          >
            View Live Site ↗
          </a>
        </div>
      </div>

      {/* Row 2: Page Identity, Switcher, Version, and Search (Screen 20) */}
      <div className="py-2.5 px-6 flex items-center justify-between gap-4 border-b border-[#f0ebe3]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-[#8a7f73]">Pages</span>
          <span className="text-xs text-[#8a7f73]">/</span>

          {/* Page Title with Switcher dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPageSwitcherOpen(prev => !prev)}
              className="flex items-center gap-1.5 font-serif text-[22px] md:text-[24px] font-normal text-[#1a1612] hover:text-[#8a6a36] transition cursor-pointer"
            >
              <span>{page.title}</span>
              <span className="text-xs text-[#8a7f73]">∨</span>
            </button>

            {isPageSwitcherOpen && (
              <div className="absolute left-0 mt-1 w-64 max-h-80 overflow-y-auto bg-white border border-[#e6dccb] rounded-[8px] shadow-lg z-40 py-1">
                {allPages.map(p => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => {
                      onSelectPage(p.slug);
                      setIsPageSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between cursor-pointer hover:bg-[#f7f2ea] ${
                      p.slug === page.slug ? 'font-semibold text-[#8a6a36] bg-[#fbf9f5]' : 'text-[#1a1612]'
                    }`}
                  >
                    <span>{p.title}</span>
                    <span className="text-[11px] text-[#8a7f73] font-mono">{p.slug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f0f4ec] text-[#4a6b35] text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b35]" />
            Live
          </span>

          {/* Version line */}
          <span className="text-xs text-[#73675a]">
            {page.version ? `${page.version}, ` : ''}reviewed {page.lastPublished || '23 September 2026'}
          </span>
        </div>

        {/* Global Find Trigger */}
        <div className="text-xs text-[#73675a] flex items-center gap-3">
          <span className="hidden sm:inline">No changes waiting</span>
        </div>
      </div>

      {/* Row 3: Parts Strip (Spec §7.2, Screen 20) */}
      <div className="px-6 flex items-center justify-between gap-4 overflow-x-auto text-[12.5px]">
        {/* Left: The page's parts in order */}
        <div className="flex items-center gap-5 shrink-0 py-2.5">
          {parts.map(part => {
            const isActive = activePartId === part.id;
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => onSelectPart(part.id)}
                className={`relative flex items-center gap-1.5 pb-0.5 cursor-pointer transition-colors ${
                  isActive
                    ? 'border-b-2 border-[#bda67b] font-medium text-[#1a1612]'
                    : 'text-[#73675a] hover:text-[#1a1612]'
                }`}
              >
                <span>{part.label}</span>
                {part.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded bg-[#f4f0e8] text-[11px] text-[#5c5248]">
                    {part.count}
                  </span>
                )}
                {part.hasChecks && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b85c38]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Show dropdown, Figures, To look at, Page settings */}
        <div className="flex items-center gap-4 shrink-0 py-2.5 text-xs">
          {/* Show Mode Dropdown */}
          <select
            value={showMode}
            onChange={e => onShowModeChange(e.target.value as any)}
            className="bg-transparent text-[#73675a] hover:text-[#1a1612] cursor-pointer focus:outline-none"
          >
            <option value="waiting">With the changes waiting</option>
            <option value="live">As it is live now</option>
            <option value="date">As on a date</option>
          </select>

          {/* Figures button */}
          <button
            type="button"
            onClick={() => onSelectPanelTab(activePanelTab === 'figures' ? 'default' : 'figures')}
            className={`cursor-pointer transition-colors ${
              activePanelTab === 'figures'
                ? 'font-medium text-[#8a6a36]'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            {figuresCount} figures
          </button>

          {/* To look at button (terracotta when above nought) */}
          <button
            type="button"
            onClick={() => onSelectPanelTab(activePanelTab === 'checks' ? 'default' : 'checks')}
            className={`cursor-pointer transition-colors ${
              checksCount > 0 ? 'text-[#b85c38] font-medium' : 'text-[#73675a] hover:text-[#1a1612]'
            } ${activePanelTab === 'checks' ? 'underline' : ''}`}
          >
            {checksCount > 0 ? `${checksCount} to look at` : 'Nothing to look at'}
          </button>

          {/* Page settings */}
          <button
            type="button"
            onClick={() => onSelectPanelTab(activePanelTab === 'settings' ? 'default' : 'settings')}
            className={`cursor-pointer transition-colors ${
              activePanelTab === 'settings'
                ? 'font-medium text-[#8a6a36] border-b-2 border-[#bda67b]'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            Page settings
          </button>
        </div>
      </div>
    </header>
  );
};

export default PageLevelTwoHeader;
