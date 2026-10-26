/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: OtherSectionsPointersModal (Spec §12, Screens 65-76)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { X, Network, ExternalLink } from 'lucide-react';
import { FigureItem, PageCardData } from '../types';
import { PointerPromotionsPreview } from './pointers/PointerPromotionsPreview';
import { PointerMasterDataPreview } from './pointers/PointerMasterDataPreview';
import { PointerPlatformLegalPreview } from './pointers/PointerPlatformLegalPreview';
import { PointerSiteSettingsPreview } from './pointers/PointerSiteSettingsPreview';

interface OtherSectionsPointersModalProps {
  isOpen: boolean;
  onClose: () => void;
  figures: FigureItem[];
  pages: PageCardData[];
  onOpenFigure?: (key: string) => void;
  onOpenPage?: (slug: string) => void;
  onNavigateToLinks?: () => void;
}

type PointerTab = 'promotions' | 'master_data' | 'platform_legal' | 'site_settings';

export const OtherSectionsPointersModal: React.FC<OtherSectionsPointersModalProps> = ({
  isOpen,
  onClose,
  figures,
  pages,
  onOpenFigure,
  onOpenPage,
  onNavigateToLinks
}) => {
  const [activeTab, setActiveTab] = useState<PointerTab>('promotions');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#fffefb] border border-[#e8dfd2] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-[#1a1612]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e8dfd2] bg-[#fcfaf7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f4ece1] border border-[#e5ddd0] flex items-center justify-center text-[#8a6a36]">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-normal text-[#1a1612]">
                How other sections read the register
              </h2>
              <p className="text-xs text-[#6e6358] mt-0.5">
                Spec §12, Screens 65 to 76. Figures are set once here and pointers project them live across the admin panel.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#efe7dc] flex items-center justify-center text-[#6e6358] hover:text-[#1a1612] transition cursor-pointer"
            title="Close viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 px-6 border-b border-[#e8dfd2] bg-white text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('promotions')}
            className={`py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'promotions'
                ? 'border-[#8a6a36] text-[#1a1612] font-semibold'
                : 'border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Promotions (Screen 65)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('master_data')}
            className={`py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'master_data'
                ? 'border-[#8a6a36] text-[#1a1612] font-semibold'
                : 'border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Master Data (Screens 66, 67)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('platform_legal')}
            className={`py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'platform_legal'
                ? 'border-[#8a6a36] text-[#1a1612] font-semibold'
                : 'border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Platform & Legal (Screens 68 to 71)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('site_settings')}
            className={`py-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'site_settings'
                ? 'border-[#8a6a36] text-[#1a1612] font-semibold'
                : 'border-transparent text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Site Settings & Messaging (Screens 72 to 76)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === 'promotions' && (
            <PointerPromotionsPreview
              figures={figures}
              onOpenFigure={key => {
                onClose();
                onOpenFigure?.(key);
              }}
            />
          )}

          {activeTab === 'master_data' && (
            <PointerMasterDataPreview
              figures={figures}
              onOpenFigure={key => {
                onClose();
                onOpenFigure?.(key);
              }}
            />
          )}

          {activeTab === 'platform_legal' && (
            <PointerPlatformLegalPreview
              figures={figures}
              pages={pages}
              onOpenFigure={key => {
                onClose();
                onOpenFigure?.(key);
              }}
              onOpenPage={slug => {
                onClose();
                onOpenPage?.(slug);
              }}
            />
          )}

          {activeTab === 'site_settings' && (
            <PointerSiteSettingsPreview
              figures={figures}
              pages={pages}
              onOpenFigure={key => {
                onClose();
                onOpenFigure?.(key);
              }}
              onOpenPage={slug => {
                onClose();
                onOpenPage?.(slug);
              }}
              onNavigateToLinks={() => {
                onClose();
                onNavigateToLinks?.();
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e8dfd2] bg-[#fcfaf7] flex items-center justify-between text-xs text-[#6e6358]">
          <span>
            Clicking <span className="font-semibold text-[#1a1612]">Open the figure</span> opens the figure inspector in Pages with live editing.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-[#d9ccb6] bg-white text-xs font-medium text-[#1a1612] hover:bg-[#f7f2ea] transition cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherSectionsPointersModal;
