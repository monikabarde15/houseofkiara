/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinksNotBuiltCard (Spec §6, Screen 17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { LinkedNotBuiltItem } from '../types';

interface LinksNotBuiltCardProps {
  items: LinkedNotBuiltItem[];
  onNavigateToPage?: (slug: string) => void;
}

export const LinksNotBuiltCard: React.FC<LinksNotBuiltCardProps> = ({
  items,
  onNavigateToPage
}) => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] overflow-hidden shadow-2xs">
      {/* Card Header */}
      <div className="p-4 px-5 border-b border-[#f0ebe3]">
        <h2 className="text-[15px] font-semibold text-[#1a1612]">
          Pages linked but not built
        </h2>
        <p className="text-[12px] text-[#73675a] mt-0.5">
          Each one with every link that points at it. Build it, send its address to another page, or take the links away before launch.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] divide-y divide-[#f0ebe3]">
          <thead className="bg-[#faf7f2] text-[#73675a] font-normal">
            <tr>
              <th className="py-2.5 px-5 font-normal w-1/4">Page</th>
              <th className="py-2.5 px-5 font-normal w-1/2">Linked from</th>
              <th className="py-2.5 px-5 font-normal w-1/4">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe3] text-[#1a1612]">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-[#fcfaf7] transition-colors align-top">
                <td className="py-3 px-5">
                  <button
                    type="button"
                    onClick={() => onNavigateToPage && onNavigateToPage(item.slug)}
                    className="font-medium text-[#1a1612] hover:underline cursor-pointer text-left block"
                  >
                    {item.title}
                  </button>
                  <span className="font-mono text-[11px] text-[#73675a] block mt-0.5">
                    {item.slug}
                  </span>
                </td>
                <td className="py-3 px-5 space-y-1">
                  {item.linksPointingAtIt.map((l, lIdx) => (
                    <div key={lIdx} className="text-[#5c5248] text-[11.5px] leading-relaxed">
                      <span className="text-[#73675a]">{l.location}</span> · <span>{l.label}</span>
                    </div>
                  ))}
                </td>
                <td className="py-3 px-5 text-[#5c5248]">
                  {item.decision || 'Undecided'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinksNotBuiltCard;
