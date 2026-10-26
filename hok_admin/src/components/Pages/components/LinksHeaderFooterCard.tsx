/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinksHeaderFooterCard (Spec §6, Screen 17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { HeaderFooterLinkItem } from '../types';

interface LinksHeaderFooterCardProps {
  links: HeaderFooterLinkItem[];
  onOpenSiteSettings?: () => void;
  onNavigateToPage?: (slug: string) => void;
}

export const LinksHeaderFooterCard: React.FC<LinksHeaderFooterCardProps> = ({
  links,
  onOpenSiteSettings,
  onNavigateToPage
}) => {
  const nowhereCount = links.filter(l => l.targetType === 'nowhere').length;

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] overflow-hidden shadow-2xs">
      {/* Card Header */}
      <div className="p-4 px-5 border-b border-[#f0ebe3] flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[#1a1612]">
            Links in the header and footer
          </h2>
          <p className="text-[12px] text-[#73675a] mt-0.5">
            45 links.{' '}
            <span className="text-[#b85c38] font-medium">
              {nowhereCount} lead nowhere
            </span>
            . The 102 links inside the menus are catalogue filters and are counted separately.
          </p>
        </div>
        {onOpenSiteSettings && (
          <button
            type="button"
            onClick={onOpenSiteSettings}
            className="shrink-0 px-3 py-1.5 bg-white border border-[#e6dccb] rounded-[4px] text-xs text-[#1a1612] hover:bg-[#faf7f2] cursor-pointer transition-colors shadow-2xs"
          >
            Open Site Settings
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] divide-y divide-[#f0ebe3]">
          <thead className="bg-[#faf7f2] text-[#73675a] font-normal">
            <tr>
              <th className="py-2.5 px-5 font-normal">Where</th>
              <th className="py-2.5 px-5 font-normal">Label</th>
              <th className="py-2.5 px-5 font-normal">Address</th>
              <th className="py-2.5 px-5 font-normal">Leads to</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe3] text-[#1a1612]">
            {links.map(link => (
              <tr key={link.id} className="hover:bg-[#fcfaf7] transition-colors">
                <td className="py-2.5 px-5 text-[#5c5248]">
                  {link.where || link.location}
                </td>
                <td className="py-2.5 px-5 font-medium">
                  {link.label}
                </td>
                <td className="py-2.5 px-5 font-mono text-[11.5px] text-[#5c5248]">
                  {link.address}
                </td>
                <td className="py-2.5 px-5">
                  {link.targetType === 'nowhere' ? (
                    <span className="inline-flex items-center gap-1.5 text-[#b85c38] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b85c38]" />
                      {link.leadsTo}
                    </span>
                  ) : link.targetType === 'page' && link.targetSlug ? (
                    <button
                      type="button"
                      onClick={() => onNavigateToPage && onNavigateToPage(link.targetSlug!)}
                      className="text-[#1a1612] hover:underline cursor-pointer text-left"
                    >
                      {link.leadsTo || link.label}
                    </button>
                  ) : (
                    <span className="text-[#5c5248]">
                      {link.leadsTo}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinksHeaderFooterCard;
