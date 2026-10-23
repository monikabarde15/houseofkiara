/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: WorkspaceHeader (Spec §3.1 & §7.2, Pages 8, 16 & 17)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Search, Calendar, Sparkles, CheckCircle2, ChevronDown, Settings } from 'lucide-react';
import { PageCardData, WorkspaceTab } from '../../types';

interface WorkspaceHeaderProps {
  page: PageCardData;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onBackToLevelOne: () => void;
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
  onPublish?: () => void;
  onOpenSettings?: () => void;
  showMode?: 'changes' | 'live' | 'date';
  onShowModeChange?: (mode: 'changes' | 'live' | 'date') => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  page,
  activeTab,
  onTabChange,
  onBackToLevelOne,
  onOpenSettings,
  showMode = 'changes',
  onShowModeChange
}) => {
  const [isShowMenuOpen, setIsShowMenuOpen] = useState(false);
  const [selectedShowMode, setSelectedShowMode] = useState<'changes' | 'live' | 'date'>(showMode);

  // Status badge style
  const getStatusBadge = () => {
    if (!page.isBuilt) {
      return (
        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#efe7db] text-[#6e6358] border border-[#d9ccb6]">
          Not built
        </span>
      );
    }
    if (page.group === 'system') {
      return (
        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#f7f2ea] text-[#5c5248] border border-[#e6dccb]">
          System page
        </span>
      );
    }
    return (
      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#f5edd8] text-[#8a6a36] border border-[#c9a96e]/50">
        Live
      </span>
    );
  };

  // Date metadata (Spec §3.1)
  const getDateMetadata = () => {
    if (page.group === 'policies' || page.slug === '/faqs') {
      return `Version ${page.version.replace('v', '')}, reviewed ${page.lastPublished}`;
    }
    return `Edited ${page.lastPublished}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-[#fffefb] border-b border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)]">
      {/* Line 1: Breadcrumb Trail & Level Two Actions (Spec §3.1, Page 8) */}
      <div className="px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Trail & Page Info */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {/* Back to Level One */}
          <button
            onClick={onBackToLevelOne}
            className="flex items-center gap-1 text-xs text-[#8a6a36] hover:text-[#1a1612] transition-colors cursor-pointer mr-1"
            title="Back to All pages"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-medium">Pages</span>
          </button>

          <span className="text-[#b4a99e]">/</span>

          {/* Page Name */}
          <h1 className="font-serif text-base font-medium text-[#1a1612] truncate">
            {page.title}
          </h1>

          {/* Status Badge */}
          {getStatusBadge()}

          {/* Version / Review Date */}
          <span className="text-xs text-[#6e6358] hidden sm:inline">
            · {getDateMetadata()}
          </span>
        </div>

        {/* Right Actions: Find on any page, Scheduled, Review */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Find on any page */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6e6358] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Find on any page"
              className="pl-7 pr-3 py-1 rounded-[6px] bg-[#f7f2ea] border border-[#d9ccb6] text-xs text-[#1a1612] placeholder-[#6e6358] focus:outline-none focus:border-[#8a6a36]"
            />
          </div>

          {/* Scheduled Chip */}
          {page.hasScheduled && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-[#3d6e8e] bg-[#3d6e8e]/10 border border-[#3d6e8e]/30 px-2 py-1 rounded-[6px]">
              <Calendar className="w-3 h-3 text-[#3d6e8e]" />
              <span>1 scheduled</span>
            </span>
          )}

          {/* Changes / Review & Publish */}
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs font-medium bg-[#f7f2ea] text-[#6e6358] border border-[#d9ccb6] hover:bg-[#efe7db] transition-colors cursor-pointer">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#6b7e5a]" />
            <span>No changes waiting</span>
          </button>
        </div>
      </div>

      {/* Line 2: The Strip (Spec §7.2, Page 17) */}
      <div className="px-6 py-2 flex items-center justify-between text-xs border-t border-[#efe7da] overflow-x-auto bg-[#fffefb]">
        {/* The parts in page order */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onTabChange('edit')}
            className={`pb-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'edit'
                ? 'border-b-2 border-[#c9a96e] text-[#1a1612] font-semibold'
                : 'border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            01 Header
          </button>

          <button
            onClick={() => onTabChange('edit')}
            className="pb-1 border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612] font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            02 Policy in brief
          </button>

          <button
            onClick={() => onTabChange('edit')}
            className="pb-1 border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612] font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            03 Sections
          </button>

          <button
            onClick={() => onTabChange('preview')}
            className={`pb-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-b-2 border-[#c9a96e] text-[#1a1612] font-semibold'
                : 'border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Answers {page.wordsCount > 2000 ? '103' : '24'}
          </button>
        </div>

        {/* Right side controls of the strip: Show dropdown, Figures count, To look at, Page settings */}
        <div className="flex items-center gap-5 shrink-0 pl-4">
          {/* Show dropdown (Spec §7.2: With the changes waiting / As it is live now / As on a date) */}
          <div className="relative">
            <button
              onClick={() => setIsShowMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 text-xs text-[#5c5248] hover:text-[#1a1612] cursor-pointer"
            >
              <span>
                Show: {selectedShowMode === 'changes' ? 'With changes waiting' : selectedShowMode === 'live' ? 'As it is live now' : 'As on a date'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#6e6358]" />
            </button>

            {isShowMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-[#fffefb] border border-[#e6dccb] rounded-[6px] shadow-lg py-1 z-40 text-xs">
                <button
                  onClick={() => {
                    setSelectedShowMode('changes');
                    onShowModeChange?.('changes');
                    setIsShowMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#f7f2ea] ${selectedShowMode === 'changes' ? 'font-semibold text-[#8a6a36]' : 'text-[#1a1612]'}`}
                >
                  With the changes waiting
                </button>
                <button
                  onClick={() => {
                    setSelectedShowMode('live');
                    onShowModeChange?.('live');
                    setIsShowMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#f7f2ea] ${selectedShowMode === 'live' ? 'font-semibold text-[#8a6a36]' : 'text-[#1a1612]'}`}
                >
                  As it is live now
                </button>
                <button
                  onClick={() => {
                    setSelectedShowMode('date');
                    onShowModeChange?.('date');
                    setIsShowMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#f7f2ea] ${selectedShowMode === 'date' ? 'font-semibold text-[#8a6a36]' : 'text-[#1a1612]'}`}
                >
                  As on a date...
                </button>
              </div>
            )}
          </div>

          {/* Figures count on this page */}
          <button
            onClick={() => onTabChange('reach')}
            className={`text-xs hover:text-[#1a1612] cursor-pointer ${activeTab === 'reach' ? 'text-[#1a1612] font-semibold underline' : 'text-[#6e6358]'}`}
          >
            {page.figuresCount} figures
          </button>

          {/* To look at (checks) */}
          <button
            onClick={() => onTabChange('checks')}
            className={`text-xs cursor-pointer ${
              page.checksCount > 0 ? 'text-[#a4512f] font-medium' : 'text-[#6b7e5a]'
            }`}
          >
            {page.checksCount > 0 ? `${page.checksCount} to look at` : 'Nothing to look at'}
          </button>

          {/* Page settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 text-xs text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
          >
            <Settings className="w-3 h-3 text-[#8a6a36]" />
            <span>Page settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
