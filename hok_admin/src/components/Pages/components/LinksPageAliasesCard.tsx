/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinksPageAliasesCard (Spec §6, Screen 17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageNameAliasItem } from '../types';

interface LinksPageAliasesCardProps {
  aliases: PageNameAliasItem[];
  onNavigateToPage?: (slug: string) => void;
}

export const LinksPageAliasesCard: React.FC<LinksPageAliasesCardProps> = ({
  aliases,
  onNavigateToPage
}) => {
  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] overflow-hidden shadow-2xs">
      {/* Card Header */}
      <div className="p-4 px-5 border-b border-[#f0ebe3]">
        <h2 className="text-[15px] font-semibold text-[#1a1612]">
          Names the built pages use for each page
        </h2>
        <p className="text-[12px] text-[#73675a] mt-0.5">
          The page files link to each other by name. Where two files use different names for the same page, both resolve here.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] divide-y divide-[#f0ebe3]">
          <thead className="bg-[#faf7f2] text-[#73675a] font-normal">
            <tr>
              <th className="py-2.5 px-5 font-normal w-1/3">Page</th>
              <th className="py-2.5 px-5 font-normal w-1/3">Name</th>
              <th className="py-2.5 px-5 font-normal w-1/3">Also written as</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe3] text-[#1a1612]">
            {aliases.map(item => (
              <tr key={item.id} className="hover:bg-[#fcfaf7] transition-colors">
                <td className="py-2.5 px-5 font-medium">
                  {onNavigateToPage && item.resolvedSlug ? (
                    <button
                      type="button"
                      onClick={() => onNavigateToPage(item.resolvedSlug)}
                      className="text-[#1a1612] hover:underline cursor-pointer text-left"
                    >
                      {item.page || item.resolvedTitle}
                    </button>
                  ) : (
                    item.page || item.resolvedTitle
                  )}
                </td>
                <td className="py-2.5 px-5 font-mono text-[11.5px] text-[#5c5248]">
                  {item.name || item.aliasName}
                </td>
                <td className="py-2.5 px-5 font-mono text-[11.5px] text-[#73675a]">
                  {item.alsoWrittenAs || 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinksPageAliasesCard;
