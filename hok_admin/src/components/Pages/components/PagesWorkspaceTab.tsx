/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagesWorkspaceTab (Spec §4 & Screens 01, 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';
import { PageCardData, PageGroupId, PageStatsSummary } from '../types';
import { PAGE_GROUPS } from '../data';
import { PageStatTiles } from './PageStatTiles';
import { PageGroupSection } from './PageGroupSection';

interface PagesWorkspaceTabProps {
  pages: PageCardData[];
  onSelectPage: (slug: string) => void;
  onNavigateToFigures?: () => void;
}

export const PagesWorkspaceTab: React.FC<PagesWorkspaceTabProps> = ({
  pages,
  onSelectPage,
  onNavigateToFigures
}) => {
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>('all');
  const [filterNeedsLook, setFilterNeedsLook] = useState<boolean>(false);

  // Compute live stats summary based on current page states
  const stats: PageStatsSummary = useMemo(() => {
    return {
      pagesTotal: pages.length,
      pagesBuilt: pages.filter(p => p.isBuilt).length,
      pagesNotBuilt: pages.filter(p => !p.isBuilt).length,
      pagesNeedLook: pages.filter(p => p.checksCount > 0).length,
      scheduledChangesCount: pages.filter(p => p.hasScheduled).length
    };
  }, [pages]);

  // Filter pages based on active group and needs-look toggle
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      // 1. Group / Built filter from tiles
      if (activeGroupFilter === 'built') {
        if (!page.isBuilt) return false;
      } else if (activeGroupFilter === 'not-built') {
        if (page.isBuilt) return false;
      } else if (activeGroupFilter !== 'all') {
        if (page.group !== activeGroupFilter) return false;
      }

      // 2. Needs a look filter
      if (filterNeedsLook && page.checksCount === 0) {
        return false;
      }

      return true;
    });
  }, [pages, activeGroupFilter, filterNeedsLook]);

  // Split filtered pages into the 4 canonical groups
  const pagesByGroup = useMemo(() => {
    return {
      'content-help': filteredPages.filter(p => p.group === 'content-help'),
      'policies': filteredPages.filter(p => p.group === 'policies'),
      'not-built': filteredPages.filter(p => p.group === 'not-built'),
      'system': filteredPages.filter(p => p.group === 'system')
    };
  }, [filteredPages]);

  return (
    <div className="space-y-6">
      {/* 1. Four Summary Stat Tiles (Spec §4.1 & Screen 01) */}
      <PageStatTiles
        stats={stats}
        filterNeedsLook={filterNeedsLook}
        onToggleNeedsLook={() => setFilterNeedsLook(prev => !prev)}
        activeFilterGroup={activeGroupFilter}
        onSelectFilterGroup={setActiveGroupFilter}
        onNavigateToFigures={onNavigateToFigures}
      />

      {/* Note above cards when a tile filter is active (Spec §4.1) */}
      {(activeGroupFilter !== 'all' || filterNeedsLook) && (
        <div className="flex items-center justify-between p-2.5 px-4 rounded-[6px] bg-[#fffefb] border border-[#e6dccb] text-xs text-[#5c5248] shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#1a1612]">Showing:</span>
            <span>
              {filterNeedsLook
                ? 'Pages that need a look'
                : activeGroupFilter === 'built'
                ? 'Pages built'
                : activeGroupFilter === 'not-built'
                ? 'Linked but not built'
                : PAGE_GROUPS.find(g => g.id === activeGroupFilter)?.label || 'Filtered results'}
              {` (${filteredPages.length})`}
            </span>
          </div>
          <button
            onClick={() => {
              setActiveGroupFilter('all');
              setFilterNeedsLook(false);
            }}
            className="text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
          >
            Show every page
          </button>
        </div>
      )}

      {/* 2. Group Sections (Spec §4 & §4.2, Screen 01) */}
      <div className="space-y-8">
        {PAGE_GROUPS.map(group => {
          const groupPages = pagesByGroup[group.id as PageGroupId] || [];
          if (groupPages.length === 0) return null;

          return (
            <PageGroupSection
              key={group.id}
              group={group}
              pages={groupPages}
              onSelectPage={onSelectPage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PagesWorkspaceTab;
