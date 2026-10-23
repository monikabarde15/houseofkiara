/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: WorkspacePreviewTab (Spec §7.6 & §13 Storefront Preview)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { PreviewToolbar, ViewportMode } from './PreviewToolbar';
import { StorefrontDocument } from './StorefrontDocument';

interface WorkspacePreviewTabProps {
  page: PageCardData;
  figures: FigureItem[];
  onSwitchToEdit: () => void;
}

export const WorkspacePreviewTab: React.FC<WorkspacePreviewTabProps> = ({
  page,
  figures,
  onSwitchToEdit
}) => {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [zoom, setZoom] = useState<number>(1);
  const [isSimulatingScheduled, setIsSimulatingScheduled] = useState<boolean>(false);

  // Determine container width based on viewport mode
  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      default:
        return 'w-full max-w-[960px]';
    }
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-150">
      {/* 1. Preview Controls Toolbar */}
      <PreviewToolbar
        viewport={viewport}
        onViewportChange={setViewport}
        zoom={zoom}
        onZoomChange={setZoom}
        isSimulatingScheduled={isSimulatingScheduled}
        onToggleSimulateScheduled={setIsSimulatingScheduled}
        hasScheduledChanges={page.hasScheduled}
        scheduledDate={page.scheduledDate}
        onSwitchToEdit={onSwitchToEdit}
        slug={page.slug}
      />

      {/* 2. Device Viewport Frame Area */}
      <div className="w-full flex justify-center overflow-x-auto pb-12 pt-2">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className={`transition-all duration-200 ${getContainerWidth()}`}
        >
          {viewport === 'mobile' ? (
            /* Mobile Device Bezel (375px) */
            <div className="rounded-[36px] border-[10px] border-[#1a1612] bg-[#1a1612] shadow-[0_20px_50px_rgba(26,22,18,0.25)] overflow-hidden">
              {/* Phone Speaker Notch */}
              <div className="h-6 bg-[#1a1612] flex items-center justify-center">
                <div className="w-16 h-3 bg-white/10 rounded-full" />
              </div>
              <div className="bg-[#fffefb] overflow-y-auto max-h-[720px] rounded-b-[26px]">
                <StorefrontDocument
                  page={page}
                  figures={figures}
                  isSimulatingScheduled={isSimulatingScheduled}
                />
              </div>
            </div>
          ) : viewport === 'tablet' ? (
            /* Tablet Device Bezel (768px) */
            <div className="rounded-[20px] border-[12px] border-[#2c241c] bg-[#2c241c] shadow-[0_16px_40px_rgba(26,22,18,0.2)] overflow-hidden">
              <div className="bg-[#fffefb] overflow-y-auto max-h-[800px] rounded-[10px]">
                <StorefrontDocument
                  page={page}
                  figures={figures}
                  isSimulatingScheduled={isSimulatingScheduled}
                />
              </div>
            </div>
          ) : (
            /* Desktop Browser Container (1200px / 960px) */
            <div className="rounded-[8px] border border-[#e6dccb] bg-[#fffefb] shadow-[0_8px_30px_rgba(26,22,18,0.08)] overflow-hidden">
              {/* Browser Window Chrome */}
              <div className="px-4 py-2.5 bg-[#f7f2ea] border-b border-[#e6dccb] flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a4512f]/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d19a3c]/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6b7e5a]/40" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-[#fffefb] border border-[#d9ccb6] rounded-[4px] px-3 py-0.5 text-[11px] font-mono text-[#6e6358] text-center truncate">
                  https://houseofkiara.com{page.slug}
                </div>
              </div>

              <StorefrontDocument
                page={page}
                figures={figures}
                isSimulatingScheduled={isSimulatingScheduled}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspacePreviewTab;
