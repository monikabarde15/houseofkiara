/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: OldAddressesCard (Spec §6, Card 3)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { OldAddressItem } from '../../types/links.types';

interface OldAddressesCardProps {
  items: OldAddressItem[];
  onToggleAddress?: (id: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const OldAddressesCard: React.FC<OldAddressesCardProps> = ({
  items,
  onToggleAddress,
  onNavigateToPage
}) => {
  return (
    <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_1px_3px_rgba(26,22,18,0.02)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#efe7da] bg-[#fffefb]">
        <h3 className="font-serif text-lg font-normal text-[#1a1612]">
          Old addresses sent to a page
        </h3>
        <p className="text-xs text-[#6e6358] mt-0.5">
          Every old address across every page, with the page it leads to and whether it is on.
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-[#efe7da]">
        {items.map(item => (
          <div key={item.id} className="p-4 hover:bg-[#f7f2ea]/40 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <code className="text-xs font-mono text-[#1a1612] bg-[#f7f2ea] px-2 py-0.5 rounded-[4px] border border-[#d9ccb6]">
                {item.oldPath}
              </code>
              <ArrowRight className="w-3.5 h-3.5 text-[#b4a99e] shrink-0" />
              <button
                onClick={() => onNavigateToPage?.(item.targetSlug)}
                className="text-xs text-[#8a6a36] hover:underline font-medium truncate cursor-pointer"
              >
                {item.targetPageTitle} ({item.targetSlug})
              </button>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[11px] font-medium ${item.isEnabled ? 'text-[#6b7e5a]' : 'text-[#6e6358]'}`}>
                {item.isEnabled ? 'Active redirect' : 'Off'}
              </span>
              <button
                onClick={() => onToggleAddress?.(item.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.isEnabled ? 'bg-[#c9a96e]' : 'bg-[#e6dccb]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OldAddressesCard;
