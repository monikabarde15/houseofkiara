/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinkedNotBuiltCard (Spec §6, Card 2)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LinkedNotBuiltItem } from '../../types/links.types';

interface LinkedNotBuiltCardProps {
  items: LinkedNotBuiltItem[];
  onNavigateToPage?: (slug: string) => void;
}

export const LinkedNotBuiltCard: React.FC<LinkedNotBuiltCardProps> = ({
  items,
  onNavigateToPage
}) => {
  return (
    <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_1px_3px_rgba(26,22,18,0.02)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#efe7da] bg-[#fffefb]">
        <h3 className="font-serif text-lg font-normal text-[#1a1612]">
          Pages linked but not built
        </h3>
        <p className="text-xs text-[#6e6358] mt-0.5">
          Each page with nothing behind it, with every link that points at it.
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-[#efe7da]">
        {items.map(item => (
          <div key={item.id} className="p-4 hover:bg-[#f7f2ea]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs text-[#1a1612]">{item.title}</span>
                <code className="text-[11px] font-mono text-[#6e6358]">{item.slug}</code>
              </div>
              <div className="text-[11.5px] text-[#6e6358]">
                Linked from: {item.linksPointingAtIt.map(l => `${l.location} ("${l.label}")`).join(' · ')}
              </div>
            </div>

            <button
              onClick={() => onNavigateToPage?.(item.slug)}
              className="flex items-center gap-1 text-xs text-[#8a6a36] font-medium hover:underline self-start sm:self-auto cursor-pointer"
            >
              <span>Decide what address should do</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkedNotBuiltCard;
