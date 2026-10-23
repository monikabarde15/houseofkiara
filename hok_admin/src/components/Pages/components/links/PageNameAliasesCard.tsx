/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageNameAliasesCard (Spec §6, Card 5)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';
import { PageNameAliasItem } from '../../types/links.types';

interface PageNameAliasesCardProps {
  aliases: PageNameAliasItem[];
  onNavigateToPage?: (slug: string) => void;
}

export const PageNameAliasesCard: React.FC<PageNameAliasesCardProps> = ({
  aliases,
  onNavigateToPage
}) => {
  return (
    <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_1px_3px_rgba(26,22,18,0.02)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#efe7da] flex items-center justify-between bg-[#fffefb]">
        <div>
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Names the built pages use for each page
          </h3>
          <p className="text-xs text-[#6e6358] mt-0.5">
            The names the page files use to link to each other, and the page each name resolves to.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#efe7db] text-[#6e6358] border border-[#d9ccb6]">
          Read only
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f7f2ea] text-[#6e6358] font-medium border-b border-[#e6dccb]">
            <tr>
              <th className="py-2.5 px-4">Name in page files</th>
              <th className="py-2.5 px-4">Resolves to page</th>
              <th className="py-2.5 px-4">Address</th>
              <th className="py-2.5 px-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efe7da]">
            {aliases.map(alias => (
              <tr key={alias.id} className="hover:bg-[#f7f2ea]/40 transition-colors">
                <td className="py-2.5 px-4 font-mono text-[11px] text-[#8a6a36] font-medium">
                  {alias.aliasName}
                </td>
                <td className="py-2.5 px-4 font-medium text-[#1a1612]">
                  {alias.resolvedTitle}
                </td>
                <td className="py-2.5 px-4 font-mono text-[11px] text-[#6e6358]">
                  {alias.resolvedSlug}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <button
                    onClick={() => onNavigateToPage?.(alias.resolvedSlug)}
                    className="text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
                  >
                    Open page
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageNameAliasesCard;
