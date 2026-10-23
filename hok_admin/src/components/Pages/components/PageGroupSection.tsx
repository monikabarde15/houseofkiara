/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageGroupSection (Spec §4.2 & §8)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { PageCardData } from '../types';
import { PageCard } from './PageCard';

interface PageGroupSectionProps {
  id: string;
  title: string;
  count: number;
  description: string;
  pages: PageCardData[];
  onSelectPage: (slug: string) => void;
}

export const PageGroupSection: React.FC<PageGroupSectionProps> = ({
  title,
  count,
  description,
  pages,
  onSelectPage
}) => {
  if (pages.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-1 border-b border-[#e6dccb]/70">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-lg font-normal text-[#1a1612]">
            {title}
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-[#efe7db] text-[#6e6358] border border-[#d9ccb6]">
            {count}
          </span>
        </div>
        <p className="text-xs text-[#6e6358]">
          {description}
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {pages.map(page => (
          <PageCard
            key={page.id}
            page={page}
            onSelect={onSelectPage}
          />
        ))}
      </div>
    </section>
  );
};

export default PageGroupSection;
