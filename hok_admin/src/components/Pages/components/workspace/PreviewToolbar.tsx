/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PreviewToolbar (Spec §7.6 & §13 Preview Controls)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { Monitor, Tablet, Smartphone, Calendar, ExternalLink, ArrowLeft, ZoomIn } from 'lucide-react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface PreviewToolbarProps {
  viewport: ViewportMode;
  onViewportChange: (viewport: ViewportMode) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isSimulatingScheduled: boolean;
  onToggleSimulateScheduled: (simulating: boolean) => void;
  hasScheduledChanges?: boolean;
  scheduledDate?: string;
  onSwitchToEdit: () => void;
  slug: string;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  viewport,
  onViewportChange,
  zoom,
  onZoomChange,
  isSimulatingScheduled,
  onToggleSimulateScheduled,
  hasScheduledChanges,
  scheduledDate = '01 Nov 2026',
  onSwitchToEdit,
  slug
}) => {
  return (
    <div className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[8px] p-3 shadow-[0_1px_3px_rgba(26,22,18,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs select-none">
      {/* Left: Return to edit & slug */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onSwitchToEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#f7f2ea] hover:bg-[#efe7db] border border-[#d9ccb6] text-xs font-semibold text-[#1a1612] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Paper</span>
        </button>

        <span className="font-mono text-[11px] text-[#6e6358] bg-[#f7f2ea] px-2 py-1 rounded-[4px] border border-[#e6dccb] hidden sm:inline">
          {slug}
        </span>
      </div>

      {/* Middle: Viewport Switcher & Zoom */}
      <div className="flex items-center justify-center gap-3">
        {/* Viewport device buttons */}
        <div className="flex items-center bg-[#f7f2ea] p-0.5 rounded-[6px] border border-[#d9ccb6]">
          <button
            onClick={() => onViewportChange('desktop')}
            className={`p-1.5 rounded-[4px] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium ${
              viewport === 'desktop'
                ? 'bg-[#1a1612] text-white shadow-2xs'
                : 'text-[#6e6358] hover:text-[#1a1612]'
            }`}
            title="Desktop view (1200px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => onViewportChange('tablet')}
            className={`p-1.5 rounded-[4px] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium ${
              viewport === 'tablet'
                ? 'bg-[#1a1612] text-white shadow-2xs'
                : 'text-[#6e6358] hover:text-[#1a1612]'
            }`}
            title="Tablet view (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => onViewportChange('mobile')}
            className={`p-1.5 rounded-[4px] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium ${
              viewport === 'mobile'
                ? 'bg-[#1a1612] text-white shadow-2xs'
                : 'text-[#6e6358] hover:text-[#1a1612]'
            }`}
            title="Mobile phone view (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Zoom Selector */}
        <div className="flex items-center gap-1 text-xs">
          <select
            value={zoom}
            onChange={e => onZoomChange(Number(e.target.value))}
            className="px-2 py-1 rounded-[4px] bg-[#f7f2ea] border border-[#d9ccb6] text-[11px] font-mono text-[#1a1612] focus:outline-none cursor-pointer"
          >
            <option value={1}>100%</option>
            <option value={0.85}>85%</option>
            <option value={0.75}>75%</option>
            <option value={0.65}>65%</option>
          </select>
        </div>
      </div>

      {/* Right: Scheduled Timeline Simulator (Spec §13) */}
      <div className="flex items-center justify-end gap-2">
        {hasScheduledChanges ? (
          <div className="flex items-center bg-[#f7f2ea] p-0.5 rounded-[6px] border border-[#d9ccb6] text-[11px]">
            <button
              onClick={() => onToggleSimulateScheduled(false)}
              className={`px-2 py-1 rounded-[4px] transition-colors cursor-pointer font-medium ${
                !isSimulatingScheduled
                  ? 'bg-[#1a1612] text-white shadow-2xs'
                  : 'text-[#6e6358] hover:text-[#1a1612]'
              }`}
            >
              Live Today
            </button>
            <button
              onClick={() => onToggleSimulateScheduled(true)}
              className={`px-2 py-1 rounded-[4px] transition-colors cursor-pointer font-medium flex items-center gap-1 ${
                isSimulatingScheduled
                  ? 'bg-[#3d6e8e] text-white shadow-2xs'
                  : 'text-[#3d6e8e] hover:bg-[#3d6e8e]/10'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{scheduledDate.split(',')[0]}</span>
            </button>
          </div>
        ) : (
          <a
            href={slug}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-[#8a6a36] hover:underline"
          >
            <span>Open live URL</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default PreviewToolbar;
