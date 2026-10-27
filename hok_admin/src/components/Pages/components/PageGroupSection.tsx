/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageGroupSection (Spec §4, Screen 01 & 02)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData, PageGroupMeta } from '../types';
import { PageCard } from './PageCard';

interface PageGroupSectionProps {
  group: PageGroupMeta;
  pages: PageCardData[];
  onSelectPage: (slug: string) => void;
}

export const PageGroupSection: React.FC<PageGroupSectionProps> = ({
  group,
  pages,
  onSelectPage
}) => {
  if (pages.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 last:mb-0">
      {/* Group Header: Title in serif, count, and descriptive line */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3.5">
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

      {/* Cards 3-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(page => (
          <PageCard
            key={page.slug}
            page={page}
            onClick={onSelectPage}
          />
        ))}
      </div>
    </section>
  );
};

export default PageGroupSection;
