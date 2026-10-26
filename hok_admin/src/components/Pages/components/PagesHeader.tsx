/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagesHeader (Spec §3.1 & Screen 01)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar, CheckCircle2, Sparkles, ExternalLink, Bell } from 'lucide-react';
import { TopLevelTab } from '../types';
import { FindPopover } from './FindPopover';
import { ScheduledPopover } from './ScheduledPopover';
import { PagesHeaderTabs } from './PagesHeaderTabs';

interface PagesHeaderProps {
  activeTab: TopLevelTab;
  onTabChange: (tab: TopLevelTab) => void;
  pagesCount: number;
  figuresCount: number;
  thingsToFixCount: number;
  hasScheduledChanges?: boolean;
  hasPendingChanges?: boolean;
  pendingChanges?: Array<{
    id: string;
    type: 'figure' | 'page' | 'check';
    title: string;
    details: string;
    source: string;
  }>;
  onConfirmPublish?: () => void;
  onSelectFigure?: (figureKey: string) => void;
  onSelectPage?: (slug: string) => void;
  userRole?: 'Super Admin' | 'Operations Manager' | 'Content Manager' | 'Viewer';
  onRoleChange?: (role: 'Super Admin' | 'Operations Manager' | 'Content Manager' | 'Viewer') => void;
  accessLevel?: 'Full Access' | 'Edit' | 'View Only';
  onBackToDashboard?: () => void;
}

export const PagesHeader: React.FC<PagesHeaderProps> = ({
  activeTab,
  onTabChange,
  pagesCount,
  figuresCount,
  thingsToFixCount,
  hasScheduledChanges = true,
  hasPendingChanges = false,
  pendingChanges = [],
  onConfirmPublish,
  onSelectFigure,
  onSelectPage,
  userRole = 'Super Admin',
  onRoleChange,
  accessLevel = 'Full Access',
  onBackToDashboard
}) => {
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [isScheduledOpen, setIsScheduledOpen] = useState(false);

  // Global shortcut: Cmd+K / Ctrl+K opens Find popover (Spec §3.4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsFindOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Level One Sticky Header Shell */}
      <header className="sticky top-0 z-30 bg-[#fffefb] shadow-[0_1px_3px_rgba(26,22,18,0.03)]">
        {/* Row 1: Admin Top Bar (Screen 01) */}
        <div className="h-[52px] border-b border-[#e8e0d6] bg-white px-6 flex items-center justify-between">
          {/* Left: Back button, Section breadcrumb & role selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onBackToDashboard ? onBackToDashboard() : window.history.back()}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3] bg-white px-3 text-[12px] font-medium text-[#5c5248] hover:text-[#1a1612] hover:bg-[#faf8f5] transition cursor-pointer shadow-2xs"
              title="Return to dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#5c5248]" />
              <span>Back to Dashboard</span>
            </button>

            <span className="text-[14px] font-semibold text-[#2c2926] font-sans">
              Pages
            </span>

            {/* Role Switcher for §11 verification */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#8a7f72] ml-2 pl-3 border-l border-[#e8e0d6]">
              <span className="text-[11px]">Role:</span>
              <select
                value={userRole}
                onChange={e => onRoleChange?.(e.target.value as any)}
                className="text-[11px] font-mono bg-[#f7f2ea] border border-[#d9ccb6] rounded px-2 py-0.5 text-[#1a1612] cursor-pointer focus:outline-none focus:border-[#8a6a36]"
                title="Switch role to verify access levels (Spec §11)"
              >
                <option value="Super Admin">Super Admin (Full Access)</option>
                <option value="Operations Manager">Operations Manager (Edit)</option>
                <option value="Content Manager">Content Manager (Full Access)</option>
                <option value="Viewer">Viewer (View Only)</option>
              </select>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('/', '_blank')}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3] bg-white px-3.5 text-[12px] font-medium text-[#38332d] hover:bg-[#faf8f5] transition cursor-pointer shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#6f675d]" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>

            <button
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3] bg-white px-3 text-[12px] font-medium text-[#38332d] hover:bg-[#faf8f5] transition cursor-pointer shadow-2xs"
              title="12 unread notifications"
            >
              <Bell className="h-3.5 w-3.5 text-[#6f675d]" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-semibold bg-[#b85c38] text-white rounded-full">
                12
              </span>
            </button>

            {accessLevel !== 'View Only' && (
              <button
                onClick={() => onConfirmPublish ? onConfirmPublish() : undefined}
                className="inline-flex h-8 items-center rounded-md bg-[#c7a55c] hover:bg-[#b9974b] px-4 text-[12px] font-semibold text-[#2a2118] transition cursor-pointer shadow-2xs"
              >
                {accessLevel === 'Edit' ? 'See the changes' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Section Heading, Verbatim Subtitle & Find/Status Row (Spec §3.1 & Screen 01) */}
        <div className="bg-[#f7f2ea] border-b border-[#e6dccb] pt-6 pb-0">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5">
              {/* Title & Description */}
              <div className="max-w-[680px]">
                <h1 className="font-serif text-[34px] font-normal text-[#1a1612] leading-tight tracking-tight">
                  Pages
                </h1>
                <p className="text-[13px] text-[#6e6358] leading-relaxed mt-1.5">
                  Every page the site serves apart from the homepage and the catalogue, and every figure those pages print. A figure is set once, and every sentence that prints it follows.
                </p>
              </div>

              {/* Find Box & Changes Status */}
              <div className="flex items-center flex-wrap gap-2.5 lg:self-center">
                {/* Search Box Trigger */}
                <div
                  onClick={() => setIsFindOpen(true)}
                  className="relative flex items-center w-full sm:w-[320px] lg:w-[360px] bg-white border border-[#d9ccb6] hover:border-[#8a6a36] rounded-[6px] px-3 py-2 cursor-pointer shadow-2xs transition-colors group"
                  title="Find a page, an answer or a figure (Cmd+K)"
                >
                  <Search className="w-3.5 h-3.5 text-[#8a6a36] mr-2 shrink-0 group-hover:scale-105 transition-transform" />
                  <span className="text-xs text-[#8a7f72] flex-1 select-none">
                    Find a page, an answer or a figure
                  </span>
                  <kbd className="text-[10px] font-mono bg-[#f7f2ea] text-[#6e6358] px-1.5 py-0.5 rounded border border-[#d9ccb6] shrink-0">
                    ⌘K
                  </kbd>
                </div>

                {/* Scheduled Pill (Screen 16) */}
                {hasScheduledChanges && (
                  <div className="relative">
                    <button
                      onClick={() => setIsScheduledOpen(prev => !prev)}
                      className="flex items-center gap-1.5 px-2.5 py-2 rounded-[6px] text-xs font-medium bg-[#3d6e8e]/10 text-[#3d6e8e] border border-[#3d6e8e]/30 hover:bg-[#3d6e8e]/15 transition-colors cursor-pointer shadow-2xs"
                      title="1 scheduled figure update pending"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#3d6e8e]" />
                      <span>1 scheduled</span>
                    </button>

                    <ScheduledPopover
                      isOpen={isScheduledOpen}
                      onClose={() => setIsScheduledOpen(false)}
                      onViewScheduledPage={slug => {
                        setIsScheduledOpen(false);
                        onSelectPage?.(slug);
                      }}
                    />
                  </div>
                )}

                {/* Status Indicator / Review & Publish */}
                {hasPendingChanges ? (
                  <button
                    onClick={() => onConfirmPublish ? onConfirmPublish() : undefined}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#c9a96e] hover:bg-[#b89558] text-[#1a1612] border border-[#b89558] transition-colors shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1a1612]" />
                    <span>
                      {accessLevel === 'Edit'
                        ? 'See the changes'
                        : accessLevel === 'View Only'
                        ? 'View changes waiting'
                        : 'Review and publish'}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-[#6e6358] px-3 py-2 bg-white/70 border border-[#e6dccb] rounded-[6px] shadow-2xs select-none">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6b7e5a]" />
                    <span>No changes waiting</span>
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Level One Tabs Strip (Spec §3.1 & Screen 01) */}
            <div className="border-t border-[#e6dccb] pt-1">
              <PagesHeaderTabs
                activeTab={activeTab}
                onTabChange={onTabChange}
                pagesCount={pagesCount}
                figuresCount={figuresCount}
                thingsToFixCount={thingsToFixCount}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Instant Find Popover Modal */}
      <FindPopover
        isOpen={isFindOpen}
        onClose={() => setIsFindOpen(false)}
        onSelectFigure={onSelectFigure}
        onSelectPage={onSelectPage}
      />
    </>
  );
};

export default PagesHeader;
