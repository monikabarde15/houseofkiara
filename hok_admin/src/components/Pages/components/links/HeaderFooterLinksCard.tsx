/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HeaderFooterLinksCard (Spec §6, Card 1)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { ExternalLink, AlertCircle, ArrowUpRight } from 'lucide-react';
import { HeaderFooterLinkItem } from '../../types/links.types';

interface HeaderFooterLinksCardProps {
  links: HeaderFooterLinkItem[];
  onNavigateToPage?: (slug: string) => void;
}

export const HeaderFooterLinksCard: React.FC<HeaderFooterLinksCardProps> = ({
  links,
  onNavigateToPage
}) => {
  const linksNowhereCount = links.filter(l => l.targetType === 'nowhere').length;

  return (
    <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_1px_3px_rgba(26,22,18,0.02)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#efe7da] flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 bg-[#fffefb]">
        <div>
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Links in the header and footer
          </h3>
          <p className="text-xs text-[#6e6358] mt-0.5">
            Every link in Site Settings’ header, footer columns, footer policy row and mobile bar.
            {linksNowhereCount > 0 && (
              <span className="text-[#a4512f] font-medium ml-1.5">
                · {linksNowhereCount} {linksNowhereCount === 1 ? 'link leads' : 'links lead'} nowhere
              </span>
            )}
          </p>
        </div>

        <button className="flex items-center gap-1.5 text-xs text-[#8a6a36] font-medium hover:underline self-start sm:self-auto cursor-pointer">
          <span>Open Site Settings</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Links Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f7f2ea] text-[#6e6358] font-medium border-b border-[#e6dccb]">
            <tr>
              <th className="py-2.5 px-4">Where it sits</th>
              <th className="py-2.5 px-4">Label</th>
              <th className="py-2.5 px-4">Address</th>
              <th className="py-2.5 px-4">Where it leads</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efe7da]">
            {links.map(link => {
              const leadsNowhere = link.targetType === 'nowhere';

              return (
                <tr key={link.id} className="hover:bg-[#f7f2ea]/40 transition-colors">
                  <td className="py-2.5 px-4 text-[#6e6358]">
                    {link.location}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#1a1612]">
                    {link.label}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-[#6e6358]">
                    {link.address}
                  </td>
                  <td className="py-2.5 px-4">
                    {leadsNowhere ? (
                      <span className="text-[#a4512f] font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Nowhere (Not built)</span>
                      </span>
                    ) : link.targetType === 'catalogue' ? (
                      <span className="text-[#6e6358]">Catalogue filter</span>
                    ) : (
                      <span className="text-[#6b7e5a] font-medium">Page built</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {link.targetSlug ? (
                      <button
                        onClick={() => onNavigateToPage?.(link.targetSlug!)}
                        className="text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
                      >
                        Open page
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#b4a99e]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeaderFooterLinksCard;
