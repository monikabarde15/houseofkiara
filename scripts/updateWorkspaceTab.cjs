const fs = require('fs');
const filePath = 'hok_admin/src/components/Pages/components/PagesWorkspaceTab.tsx';

const newContent = `/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagesWorkspaceTab (Spec §4.1, §4.2, Screen 01 & 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';
import { Plus, FileText, Sparkles } from 'lucide-react';
import { PageCardData, PageStatsSummary } from '../types';
import { PAGE_GROUPS } from '../data';
import { PageStatTiles } from './PageStatTiles';
import { PageGroupSection } from './PageGroupSection';

interface PagesWorkspaceTabProps {
  pages: PageCardData[];
  onSelectPage: (slug: string) => void;
  onNavigateToFigures?: () => void;
  onOpenAddPage?: () => void;
  onSeedAllPolicies?: () => void | Promise<void>;
}

export const PagesWorkspaceTab: React.FC<PagesWorkspaceTabProps> = ({
  pages,
  onSelectPage,
  onNavigateToFigures,
  onOpenAddPage,
  onSeedAllPolicies
}) => {
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>('all');
  const [filterNeedsLook, setFilterNeedsLook] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState(false);

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

  const handleSeedAll = async () => {
    if (!onSeedAllPolicies) return;
    setIsSeeding(true);
    try {
      await onSeedAllPolicies();
    } finally {
      setIsSeeding(false);
    }
  };

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
        <div className="flex items-center justify-between p-2.5 px-3.5 rounded-[6px] bg-[#f0f6fa] border border-[#d6e5ef] text-[12px] text-[#2c5270] shadow-2xs">
          <div className="flex items-center gap-2">
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
          {onOpenAddPage && (
            <button
              onClick={onOpenAddPage}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a6a36] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Policy</span>
            </button>
          )}
        </div>
      )}

      {/* 3. Empty State OR Four Canonical Page Groups */}
      {pages.length === 0 ? (
        <div className="bg-[#fffefb] border border-[#e8e0d6] rounded-xl p-10 text-center shadow-xs my-6">
          <div className="w-14 h-14 rounded-full bg-[#f7f2ea] border border-[#d9ccb6] flex items-center justify-center mx-auto mb-4 text-[#8a6a36]">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-[22px] text-[#1a1612] mb-2 font-normal">
            No policies or pages added yet
          </h3>
          <p className="text-[13px] text-[#73675a] max-w-lg mx-auto mb-6 leading-relaxed">
            Database empty he. Aap yahan se directly koi bhi specific policy select karke add kar sakte hain, ya phir ek click me sabhi standard policies ko database me add kar sakte hain.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenAddPage && (
              <button
                type="button"
                onClick={onOpenAddPage}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#b89047] hover:bg-[#a67e37] text-white text-[13px] font-semibold transition cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Policy</span>
              </button>
            )}
            {onSeedAllPolicies && (
              <button
                type="button"
                onClick={handleSeedAll}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-[#faf7f2] border border-[#d9ccb6] text-[#2c2926] text-[13px] font-medium transition cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#8a6a36]" />
                <span>{isSeeding ? 'Populating Database...' : 'Populate All Standard Policies'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#e6dccb]">
            <p className="text-xs text-[#73675a]">
              Showing {filteredPages.length} of {pages.length} pages
            </p>
            {onOpenAddPage && (
              <button
                onClick={onOpenAddPage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#2c2926] hover:bg-[#1a1612] text-white text-xs font-medium cursor-pointer shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5 text-[#e5ddd3]" />
                <span>+ Add Policy</span>
              </button>
            )}
          </div>
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
      )}
    </div>
  );
};

export default PagesWorkspaceTab;
`;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('PagesWorkspaceTab updated successfully!');

