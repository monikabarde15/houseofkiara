/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagesWorkspaceTab (Spec §4.1, §4.2, Screen 01 & 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';
import { PageCardData, PageStatsSummary } from '../types';
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
      pagesNeedLook: pages.filter(p => (p.highChecksCount > 0 || p.mediumChecksCount > 0)).length,
      scheduledChangesCount: pages.filter(p => p.hasScheduled).length
    };
  }, [pages]);

  // Compute filtered pages according to active filter tile (Spec §4.1)
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      if (filterNeedsLook) {
        return (page.highChecksCount > 0 || page.mediumChecksCount > 0);
      }
      if (activeGroupFilter === 'built') {
        return page.isBuilt;
      }
      if (activeGroupFilter === 'not-built') {
        return !page.isBuilt;
      }
      return true;
    });
  }, [pages, activeGroupFilter, filterNeedsLook]);

  return (
    <div className="space-y-6">
      {/* 1. Four Summary Stat Tiles (Spec §4.1) */}
      <PageStatTiles
        stats={stats}
        filterNeedsLook={filterNeedsLook}
        onToggleNeedsLook={() => {
          setActiveGroupFilter('all');
          setFilterNeedsLook(prev => !prev);
        }}
        activeFilterGroup={activeGroupFilter}
        onSelectFilterGroup={(group) => {
          setFilterNeedsLook(false);
          setActiveGroupFilter(group);
        }}
        onNavigateToFigures={onNavigateToFigures}
      />

      {/* 2. Notice above cards when a tile filter is active (Spec §4.1 & Screen 02) */}
      {(activeGroupFilter !== 'all' || filterNeedsLook) && (
        <div className="flex items-center gap-2 p-2.5 px-3.5 rounded-[6px] bg-[#f0f6fa] border border-[#d6e5ef] text-[12px] text-[#2c5270] shadow-2xs">
          <span className="text-[13px] leading-none select-none">ⓘ</span>
          <span>
            {filterNeedsLook
              ? 'Showing the pages that need a look.'
              : activeGroupFilter === 'built'
              ? 'Showing pages built.'
              : 'Showing pages linked but not built.'}
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveGroupFilter('all');
              setFilterNeedsLook(false);
            }}
            className="underline hover:text-[#18354c] cursor-pointer ml-0.5 font-medium"
          >
            Show every page
          </button>
        </div>
      )}

      {/* 3. Four Canonical Page Groups (Spec §1.2 & §4) */}
      <div className="space-y-2">
        {PAGE_GROUPS.map(group => {
          const groupPages = filteredPages.filter(p => p.group === group.id);
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
