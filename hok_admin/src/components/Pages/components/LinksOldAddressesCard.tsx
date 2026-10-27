/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: LinksOldAddressesCard (Spec §6, Screen 17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { OldAddressItem } from '../types';

interface LinksOldAddressesCardProps {
  items: OldAddressItem[];
  onNavigateToPage?: (slug: string) => void;
}

export const LinksOldAddressesCard: React.FC<LinksOldAddressesCardProps> = ({
  items: initialItems,
  onNavigateToPage
}) => {
  const [items, setItems] = useState<OldAddressItem[]>(initialItems);

  const toggleAddressState = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
      )
    );
  };

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] overflow-hidden shadow-2xs">
      {/* Card Header */}
      <div className="p-4 px-5 border-b border-[#f0ebe3]">
        <h2 className="text-[15px] font-semibold text-[#1a1612]">
          Old addresses sent to a page
        </h2>
        <p className="text-[12px] text-[#73675a] mt-0.5">
          {items.length} addresses. Each is set in its page's Page settings, under Address, so a page knows every address that reaches it.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] divide-y divide-[#f0ebe3]">
          <thead className="bg-[#faf7f2] text-[#73675a] font-normal">
            <tr>
              <th className="py-2.5 px-5 font-normal w-1/3">Old address</th>
              <th className="py-2.5 px-5 font-normal w-1/2">Sends people to</th>
              <th className="py-2.5 px-5 font-normal text-right">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe3] text-[#1a1612]">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-[#fcfaf7] transition-colors">
                <td className="py-2.5 px-5 font-mono text-[11.5px] text-[#5c5248]">
                  {item.oldPath}
                </td>
                <td className="py-2.5 px-5">
                  <button
                    type="button"
                    onClick={() => onNavigateToPage && onNavigateToPage(item.targetSlug)}
                    className="text-[#1a1612] hover:underline cursor-pointer text-left"
                  >
                    <span className="font-medium">{item.targetPageTitle}</span>{' '}
                    <span className="font-mono text-[11px] text-[#73675a]">{item.targetSlug}</span>
                  </button>
                </td>
                <td className="py-2.5 px-5 text-right">
                  <button
                    type="button"
                    onClick={() => toggleAddressState(item.id)}
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                      item.isEnabled
                        ? 'bg-[#eaf4e6] text-[#40562e] hover:bg-[#dfead9]'
                        : 'bg-[#f4f2ee] text-[#73675a] hover:bg-[#ebe8e4]'
                    }`}
                  >
                    {item.isEnabled ? 'On' : 'Off'}
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

export default LinksOldAddressesCard;
