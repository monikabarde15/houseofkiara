/* =========================================================
   HOUSE OF KAIRA – ADMIN PANEL – THE PAGES SECTION
   Component: PageGroupSection (Spec A 4, Screen 01 & 02)
   Admin panel v217 – 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { Plus } from 'lucide-react';
import { PageCardData, PageGroupMeta } from '../types';
import { PageCard } from './PageCard';

interface PageGroupSectionProps {
  group: PageGroupMeta;
  pages: PageCardData[];
  onSelectPage: (slug: string) => void;
  onOpenAddPage?: (group?: string) => void;
}

export const PageGroupSection: React.FC<PageGroupSectionProps> = ({
  group,
  pages,
  onSelectPage,
  onOpenAddPage
}) => {
  if (pages.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 last:mb-0">
      {/* Group Header: Title in serif, count, and descriptive line + Add button */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-3.5 pb-1 border-b border-[#eee7dc]/80">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-serif text-[20px] font-normal text-[#1a1612]">
            {group.label}
          </h2>
          <span className="text-[13px] text-[#8a7f73] font-normal">
            {pages.length}
          </span>
          <p className="text-[12px] text-[#73675a]">
            {group.description}
          </p>
        </div>

        {onOpenAddPage && (
          <button
            type="button"
            onClick={() => onOpenAddPage(group.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-medium text-[#8a6a36] hover:text-[#1a1612] bg-[#f7f2ea] hover:bg-[#ede5d8] border border-[#d9ccb6] rounded-md transition cursor-pointer shadow-2xs"
            title={`Add a new page to ${group.label}`}
          >
            <Plus className="w-3.5 h-3.5 text-[#8a6a36]" />
            <span>Add to {group.label}</span>
          </button>
        )}
      </div>

      {/* Cards 3-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(page => (
          <PageCard
            key={page.slug}
            page={page}
            onClick={onSelectPage}
          />
        ))}

        {/* Quick Add Card inside grid */}
        {onOpenAddPage && (
          <button
            type="button"
            onClick={() => onOpenAddPage(group.id)}
            className="h-full min-h-[160px] border border-dashed border-[#d9ccb6] hover:border-[#8a6a36] hover:bg-[#faf7f2]/80 bg-white/40 rounded-[8px] p-5 flex flex-col items-center justify-center gap-2 text-[#8a7f72] hover:text-[#1a1612] transition cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-full bg-[#f7f2ea] group-hover:bg-[#ede5d8] flex items-center justify-center text-[#8a6a36] transition">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[12.5px] font-medium text-[#5c5248] group-hover:text-[#1a1612]">
              Add page to {group.label}
            </span>
          </button>
        )}
      </div>
    </section>
  );
};

export default PageGroupSection;
