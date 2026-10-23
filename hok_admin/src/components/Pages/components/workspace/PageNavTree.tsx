/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageNavTree (Spec §7.1 & §8.1 Left Zone 240px)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, X, FileText, CheckCircle2 } from 'lucide-react';
import { PageCardData, PageGroupId } from '../../types';
import { PAGE_GROUPS } from '../../data';

interface PageNavTreeProps {
  pages: PageCardData[];
  selectedSlug: string;
  onSelectPage: (slug: string) => void;
}

export const PageNavTree: React.FC<PageNavTreeProps> = ({
  pages,
  selectedSlug,
  onSelectPage
}) => {
  const [navSearch, setNavSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Filter pages by search
  const filteredPages = useMemo(() => {
    if (!navSearch.trim()) return pages;
    const q = navSearch.toLowerCase().trim();
    return pages.filter(p => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
  }, [pages, navSearch]);

  const getDotClass = (page: PageCardData) => {
    if (!page.isBuilt) return 'bg-[#b4a99e]';
    if (page.highChecksCount > 0) return 'bg-[#b85c38]';
    if (page.mediumChecksCount > 0) return 'bg-[#d19a3c]';
    if (page.lowChecksCount > 0) return 'bg-[#b4a99e]';
    return 'bg-[#6b7e5a]';
  };

  return (
    <aside className="w-[240px] shrink-0 bg-[#fffefb] border-r border-[#e6dccb] flex flex-col h-[calc(100vh-84px)] sticky top-[84px] select-none">
      {/* Search Input */}
      <div className="p-2.5 border-b border-[#e6dccb]/70">
        <div className="relative">
          <Search className="w-3 h-3 text-[#6e6358] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={navSearch}
            onChange={e => setNavSearch(e.target.value)}
            placeholder="Filter 23 pages..."
            className="w-full pl-7 pr-6 py-1 rounded-[4px] bg-[#f7f2ea] border border-[#d9ccb6] text-[11px] text-[#1a1612] placeholder-[#6e6358] focus:outline-none focus:border-[#8a6a36] transition-colors"
          />
          {navSearch && (
            <button
              onClick={() => setNavSearch('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#6e6358] hover:text-[#1a1612] p-0.5"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* Groups & Pages Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">
        {PAGE_GROUPS.map(group => {
          const groupPages = filteredPages.filter(p => p.group === group.id);
          if (groupPages.length === 0) return null;

          const isCollapsed = collapsedGroups[group.id];

          return (
            <div key={group.id} className="space-y-0.5">
              {/* Group Accordion Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-2 py-1 flex items-center justify-between text-[11px] font-medium text-[#6e6358] hover:text-[#1a1612] rounded-[4px] hover:bg-[#efe7db]/40 transition-colors cursor-pointer"
              >
                <span className="truncate">{group.label}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-[#b4a99e]">{groupPages.length}</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-[#b4a99e]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[#b4a99e]" />
                  )}
                </div>
              </button>

              {/* Group Pages List */}
              {!isCollapsed && (
                <div className="space-y-0.5 pl-1">
                  {groupPages.map(page => {
                    const isSelected = page.slug === selectedSlug;
                    const dotClass = getDotClass(page);

                    return (
                      <button
                        key={page.id}
                        onClick={() => onSelectPage(page.slug)}
                        className={`w-full px-2 py-1.5 rounded-[4px] text-left text-xs transition-colors flex items-center justify-between gap-1.5 cursor-pointer group ${
                          isSelected
                            ? 'bg-[#f5edd8] text-[#1a1612] font-semibold border-l-2 border-[#c9a96e]'
                            : 'text-[#5c5248] hover:bg-[#efe7db]/50 hover:text-[#1a1612]'
                        }`}
                        title={`${page.title} (${page.slug})`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotClass} shrink-0`} />
                          <span className="truncate">{page.title}</span>
                        </div>

                        {page.checksCount > 0 && !isSelected && (
                          <span className="text-[9px] font-mono text-[#a4512f] bg-[#a4512f]/10 px-1 rounded-full shrink-0">
                            {page.checksCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default PageNavTree;
