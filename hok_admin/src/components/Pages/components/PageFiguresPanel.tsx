/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageFiguresPanel (Spec §7.7, Screen 33)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FigureItem } from '../types';

interface PageFiguresPanelProps {
  figures: FigureItem[];
  onOpenFigure: (key: string) => void;
  onClose: () => void;
}

export const PageFiguresPanel: React.FC<PageFiguresPanelProps> = ({
  figures,
  onOpenFigure,
  onClose
}) => {
  const handTypedItems = [
    { text: '24 hours', where: 'Opening statement', matches: 'order_cancel_window' },
    { text: '₹5,000', where: 'Opening statement', matches: 'free_delivery_min' }
  ];

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-5 text-xs text-[#1a1612] max-h-[calc(100vh-140px)] overflow-y-auto">
      {/* 1. Header (Spec §7.7, Screen 33) */}
      <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
        <div>
          <span className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
            Figure register
          </span>
          <h2 className="font-serif text-[17px] text-[#1a1612] font-normal leading-snug">
            Figures on this page ({figures.length})
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[#8a7f73] hover:text-[#1a1612] px-2 py-1 rounded hover:bg-[#f5f1eb] transition-colors"
        >
          Close
        </button>
      </div>

      <p className="text-[11.5px] text-[#73675a] leading-relaxed">
        Every figure the page prints. A figure is set once: change it here or in Figures, and every page that prints it follows on the same day.
      </p>

      {/* 2. Figures List */}
      <div className="space-y-1.5 pt-1">
        {figures.map(fig => (
          <div
            key={fig.key}
            onClick={() => onOpenFigure(fig.key)}
            className="p-3 rounded-[6px] hover:bg-[#faf7f2] border border-[#ebe5dc] cursor-pointer flex items-center justify-between gap-2 group transition-all"
          >
            <div className="min-w-0 pr-2">
              <div className="font-medium text-[#1a1612] group-hover:text-[#8a6a36] truncate text-[12.5px]">
                {fig.label}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f5efe6] text-[#73675a]">
                  {fig.owner}
                </span>
                <span className="text-[10.5px] text-[#8a7f73]">
                  Prints {fig.reachCount || 2} times
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="font-serif text-[14px] text-[#1a1612]">
                {fig.displayValue}
              </div>
              {fig.status === 'waiting' && (
                <span className="text-[9.5px] font-semibold text-[#8a6a36] uppercase">
                  waiting
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Typed by hand section (Spec §7.7, Screen 33) */}
      <div className="pt-4 border-t border-[#f0eae1] space-y-2.5">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Typed by hand
        </div>
        <p className="text-[11.5px] text-[#73675a] leading-relaxed">
          Words on this page that look like figures but are typed, so they do not move when the figure does.
        </p>

        <div className="space-y-1.5 pt-1">
          {handTypedItems.map(item => (
            <div key={item.text} className="p-2.5 rounded bg-[#fffdfa] border border-[#edd9b9] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#785b1a]">"{item.text}"</span>
                <span className="text-[10.5px] text-[#8a7f73] block">{item.where}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenFigure(item.matches)}
                className="text-xs text-[#8a6a36] hover:underline font-medium"
              >
                Use figure
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageFiguresPanel;
