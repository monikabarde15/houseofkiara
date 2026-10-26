/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PointerSiteSettingsPreview (Spec §12, Screens 72-76)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { ExternalLink, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import { FigureItem, PageCardData } from '../../types';
import { RegisterFigurePointer } from './RegisterFigurePointer';
import { RegisterPagePointer } from './RegisterPagePointer';

interface PointerSiteSettingsPreviewProps {
  figures: FigureItem[];
  pages: PageCardData[];
  onOpenFigure?: (key: string) => void;
  onOpenPage?: (slug: string) => void;
  onNavigateToLinks?: () => void;
}

export const PointerSiteSettingsPreview: React.FC<PointerSiteSettingsPreviewProps> = ({
  figures,
  pages,
  onOpenFigure,
  onOpenPage,
  onNavigateToLinks
}) => {
  const [trending, setTrending] = useState([
    'Sabyasachi bridal lehenga',
    'Tarun Tahiliani anarkali',
    'Sequin cocktail saree',
    'Manish Malhotra gown'
  ]);

  const [spellings] = useState([
    { typed: 'lehnga', finds: 'lehenga' },
    { typed: 'sherwani', finds: 'achkan sherwani' },
    { typed: 'sari', finds: 'saree' }
  ]);

  const freeDeliveryFig = figures.find(f => f.key === 'free_delivery_min') || {
    key: 'free_delivery_min',
    label: 'Free delivery from',
    subject: 'Shipping & Delivery',
    type: 'amount',
    displayValue: '₹5,000',
    owner: 'Pages',
    status: 'live',
    hasPendingChange: false
  };

  const maintenancePage = pages.find(p => p.slug === 'maintenance') || {
    id: 'p-maint',
    slug: 'maintenance',
    title: 'Maintenance Holding Page',
    canonicalGroup: 'System',
    status: 'live'
  };

  const notFoundPage = pages.find(p => p.slug === '404') || {
    id: 'p-404',
    slug: '404',
    title: 'Page Not Found',
    canonicalGroup: 'System',
    status: 'live'
  };

  return (
    <div className="space-y-6">
      {/* Screen 73: Messaging Documents Tax Invoice */}
      <div>
        <div className="border-b border-[#e8dfd2] pb-3 mb-4">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Messaging: Tax Invoice Template
          </h3>
          <p className="text-xs text-[#6e6358] mt-1">
            Screen 73. Tax invoice delivery charge line resolves dynamic tokens directly from the figure register.
          </p>
        </div>

        <div className="bg-[#fcfaf7] border border-[#e8dfd2] rounded-[8px] p-4 text-xs">
          <div className="text-[11px] font-mono text-[#8a7f72] uppercase tracking-wider mb-2">
            Invoice line 3: Delivery Charges
          </div>
          <div className="p-3 bg-white border border-[#eee5d8] rounded font-mono text-[#1a1612] text-xs">
            Free on orders of {freeDeliveryFig.displayValue} or more, otherwise 18% under SAC 996812
          </div>
          <div className="mt-2 text-[11px] text-[#6e6358] flex items-center justify-between">
            <span>Resolves token: &#123;&#123;free_delivery_min&#125;&#125;</span>
            <button
              type="button"
              onClick={() => onOpenFigure?.('free_delivery_min')}
              className="text-[#8a6a36] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Open the figure</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Screen 74: Site Settings Site Status */}
      <div className="pt-4 border-t border-[#eee5d8]">
        <div className="border-b border-[#e8dfd2] pb-3 mb-4">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Site Settings: Site Status Pointers
          </h3>
          <p className="text-xs text-[#6e6358] mt-1">
            Screen 74. Maintenance switch remains here, but copy and 404 words are edited in Pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegisterPagePointer
            page={maintenancePage}
            label="Holding page copy"
            hint="Words shown to customers when maintenance mode is active. Edited in Pages."
            onOpenPage={onOpenPage}
          />

          <RegisterPagePointer
            page={notFoundPage}
            label="404 Page copy"
            hint="Words shown when a URL is not found. Track lost addresses in Links and addresses tab."
            onOpenPage={onOpenPage}
            subLinkText="View lost addresses that led nowhere"
            onSubLinkClick={onNavigateToLinks}
          />
        </div>
      </div>

      {/* Screens 75 & 76: Site Settings Search Lists */}
      <div className="pt-4 border-t border-[#eee5d8]">
        <div className="border-b border-[#e8dfd2] pb-3 mb-4">
          <h3 className="font-serif text-lg font-normal text-[#1a1612]">
            Site Settings: Search Lists & Spellings
          </h3>
          <p className="text-xs text-[#6e6358] mt-1">
            Screens 75 and 76. Ordered trending searches and phonetic spellings read by header search and No Search Results page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trending Searches */}
          <div className="bg-[#fcfaf7] border border-[#e8dfd2] rounded-[8px] p-4 text-xs">
            <div className="font-medium text-[#1a1612] mb-2 flex items-center justify-between">
              <span>Trending searches</span>
              <span className="text-[11px] text-[#8a7f72] font-mono">{trending.length} items</span>
            </div>
            <div className="space-y-1.5">
              {trending.map((query, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-[#eee5d8]">
                  <span className="text-xs text-[#2c2926]">{idx + 1}. {query}</span>
                  <div className="flex items-center gap-1 text-[#8a7f72]">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spellings & short forms */}
          <div className="bg-[#fcfaf7] border border-[#e8dfd2] rounded-[8px] p-4 text-xs">
            <div className="font-medium text-[#1a1612] mb-2 flex items-center justify-between">
              <span>Spellings and short forms</span>
              <span className="text-[11px] text-[#8a7f72]">Customer typed to Word found</span>
            </div>
            <div className="space-y-1.5">
              {spellings.map((pair, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-[#eee5d8]">
                  <span className="font-mono text-[#8a6a36]">{pair.typed}</span>
                  <span className="text-[11px] text-[#8a7f72]">finds</span>
                  <span className="font-medium text-[#1a1612]">{pair.finds}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointerSiteSettingsPreview;
