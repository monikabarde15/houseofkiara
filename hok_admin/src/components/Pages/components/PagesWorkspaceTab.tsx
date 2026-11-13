/* =========================================================
   HOUSE OF KAIRA – ADMIN PANEL – THE PAGES SECTION
   Component: PagesWorkspaceTab (Spec §4.1, §4.2, Screen 01 & 02)
   Admin panel v217 – 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, FileText, Sparkles } from 'lucide-react';
import { PageCardData, PageStatsSummary } from '../types';
import { PAGE_GROUPS } from '../data';
import { PageStatTiles } from './PageStatTiles';
import { PageGroupSection } from './PageGroupSection';

interface PagesWorkspaceTabProps {
  pages: PageCardData[];
  onSelectPage: (slug: string) => void;
  onNavigateToFigures?: () => void;
  onOpenAddPage?: (group?: string) => void;
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6); // 6 cards fits 2 complete rows in 3-col grid

  // Helper to determine if a page needs attention / look
  const isPageNeedLook = (p: PageCardData): boolean => {
    const high = Number(p.highChecksCount) || 0;
    const med = Number(p.mediumChecksCount) || 0;
    const total = Number(p.checksCount) || 0;
    return (
      p.health === 'needs-attention' ||
      p.health === 'critical' ||
      high > 0 ||
      med > 0 ||
      total > 0
    );
  };

  // Compute live stats summary based on current page states
  const stats: PageStatsSummary = useMemo(() => {
    return {
      pagesTotal: pages.length,
      pagesBuilt: pages.filter(p => p.isBuilt).length,
      pagesNotBuilt: pages.filter(p => !p.isBuilt).length,
      pagesNeedLook: pages.filter(isPageNeedLook).length,
      scheduledChangesCount: pages.filter(p => p.hasScheduled).length
    };
  }, [pages]);

  // Compute filtered pages according to active filter tile (Spec §4.1)
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      if (filterNeedsLook) {
        return isPageNeedLook(page);
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

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeGroupFilter, filterNeedsLook, itemsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPages.length);

  const paginatedPages = useMemo(() => {
    return filteredPages.slice(startIndex, endIndex);
  }, [filteredPages, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

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
        <div className="flex items-center gap-2 p-2.5 px-3.5 rounded-[6px] bg-[#f0f6fa] border border-[#d6e5ef] text-[12px] text-[#2c5270] shadow-2xs">
          <span className="text-[13px] leading-none select-none">ℹ</span>
          <span>
            {filterNeedsLook
              ? `Showing the ${stats.pagesNeedLook} page${stats.pagesNeedLook === 1 ? '' : 's'} that need a look.`
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

      {/* 3. Quick Action Strip above groups */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-1">
        <div className="text-xs text-[#73675a] flex items-center gap-2">
          <span>
            Showing <b>{filteredPages.length > 0 ? `${startIndex + 1}–${endIndex}` : '0'}</b> of <b>{filteredPages.length}</b> pages
            {filteredPages.length !== pages.length && ` (filtered from ${pages.length})`}
          </span>
          {(activeGroupFilter !== 'all' || filterNeedsLook) && (
            <button
              type="button"
              onClick={() => {
                setActiveGroupFilter('all');
                setFilterNeedsLook(false);
              }}
              className="text-[#8a6a36] hover:underline font-medium text-[11.5px] ml-1 cursor-pointer"
            >
              (Clear filter)
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Items per page selector */}
          <div className="flex items-center gap-1.5 text-xs text-[#73675a]">
            <span>Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-white border border-[#d9ccb6] rounded px-2 py-0.5 text-xs text-[#1a1612] cursor-pointer focus:outline-none focus:border-[#8a6a36]"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>

          {onOpenAddPage && (
            <button
              type="button"
              onClick={() => onOpenAddPage(activeGroupFilter !== 'all' ? activeGroupFilter : undefined)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#b89047] hover:bg-[#a67e37] text-white text-[12px] font-semibold transition cursor-pointer shadow-2xs"
              title="Add a new page or policy"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Add Page</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Empty State OR Canonical Page Groups */}
      {filteredPages.length === 0 ? (
        <div className="bg-[#fffefb] border border-[#e8e0d6] rounded-xl p-8 text-center shadow-xs my-4">
          <div className="w-12 h-12 rounded-full bg-[#f7f2ea] border border-[#d9ccb6] flex items-center justify-center mx-auto mb-3 text-[#8a6a36]">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-[20px] text-[#1a1612] mb-1.5 font-normal">
            {activeGroupFilter === 'not-built'
              ? 'No unbuilt pages found'
              : filterNeedsLook
                ? 'No pages currently need attention'
                : pages.length === 0
                  ? 'No policies or pages added yet'
                  : 'No pages found in this view'}
          </h3>
          <p className="text-[12.5px] text-[#73675a] max-w-md mx-auto mb-5 leading-relaxed">
            {activeGroupFilter === 'not-built'
              ? 'Every page linked across the site currently has a built destination, or you can add a new page draft here.'
              : filterNeedsLook
                ? 'All published pages are currently healthy with no outstanding checks.'
                : 'You can add a new page or policy directly to this section, or view all pages.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveGroupFilter('all');
                  setFilterNeedsLook(false);
                }}
                className="px-4 py-2 rounded-lg bg-white hover:bg-[#faf7f2] border border-[#d9ccb6] text-[#2c2926] text-[12px] font-medium transition cursor-pointer shadow-2xs"
              >
                Show All Pages
              </button>
            )}
            {onOpenAddPage && (
              <button
                type="button"
                onClick={() => onOpenAddPage(activeGroupFilter !== 'all' ? activeGroupFilter : undefined)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#b89047] hover:bg-[#a67e37] text-white text-[12px] font-semibold transition cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Add Page</span>
              </button>
            )}
            {pages.length === 0 && onSeedAllPolicies && (
              <button
                type="button"
                onClick={handleSeedAll}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#faf7f2] border border-[#d9ccb6] text-[#2c2926] text-[12px] font-medium transition cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8a6a36]" />
                <span>{isSeeding ? 'Populating Database...' : 'Populate All Standard Policies'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {PAGE_GROUPS.map(group => {
              const groupPages = paginatedPages.filter(p => p.group === group.id);
              if (groupPages.length === 0) return null;
              return (
                <PageGroupSection
                  key={group.id}
                  group={group}
                  pages={groupPages}
                  onSelectPage={onSelectPage}
                  onOpenAddPage={onOpenAddPage}
                />
              );
            })}
          </div>

          {/* 5. Pagination Controls Bar */}
          {filteredPages.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-[#e8e0d6]">
              {/* Range summary */}
              <div className="text-xs text-[#73675a]">
                Showing <b>{startIndex + 1}</b> to <b>{endIndex}</b> of <b>{filteredPages.length}</b> pages
              </div>

              {/* Numbered buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-1.5 rounded-md border border-[#d9ccb6] bg-white text-xs font-medium text-[#2c2926] hover:bg-[#faf7f2] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                  aria-label="Previous page"
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-md text-xs font-semibold flex items-center justify-center transition cursor-pointer ${currentPage === pageNum
                        ? 'bg-[#1a1612] text-white shadow-2xs'
                        : 'border border-[#d9ccb6] bg-white text-[#5c5248] hover:bg-[#faf7f2] hover:text-[#1a1612]'
                      }`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-1.5 rounded-md border border-[#d9ccb6] bg-white text-xs font-medium text-[#2c2926] hover:bg-[#faf7f2] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PagesWorkspaceTab;
