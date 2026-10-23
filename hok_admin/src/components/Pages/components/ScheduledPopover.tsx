/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ScheduledPopover (Spec §3.1 & §13)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useRef, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, X } from 'lucide-react';

interface ScheduledPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onViewScheduledPage?: (slug: string) => void;
}

export const ScheduledPopover: React.FC<ScheduledPopoverProps> = ({
  isOpen,
  onClose,
  onViewScheduledPage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full mt-2 w-80 bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_8px_30px_rgba(26,22,18,0.12)] p-4 z-40 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#e6dccb]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#3d6e8e]">
          <Calendar className="w-3.5 h-3.5" />
          <span>Scheduled Changes (1)</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#6e6358] hover:text-[#1a1612] transition-colors p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-3">
        <div className="p-3 rounded-[6px] bg-[#f7f2ea] border border-[#e6dccb] hover:border-[#3d6e8e]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1a1612]">Terms & Conditions</span>
            <span className="text-[10px] font-mono text-[#3d6e8e] bg-[#3d6e8e]/10 px-1.5 py-0.5 rounded-[4px]">
              v5.0-scheduled
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#5c5248] mt-1.5">
            <Clock className="w-3 h-3 text-[#3d6e8e]" />
            <span>Goes live 01 Nov 2026, 00:00 IST</span>
          </div>

          <p className="text-[11px] text-[#6e6358] mt-2 leading-relaxed">
            Winter festive rental fee tier revisions and DPDP Act 2023 statutory clause alignment.
          </p>

          <button
            onClick={() => {
              onViewScheduledPage?.('/terms');
              onClose();
            }}
            className="mt-3 w-full py-1.5 text-center text-xs font-medium text-[#3d6e8e] hover:text-[#2d526b] hover:bg-[#3d6e8e]/10 rounded-[4px] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Inspect scheduled version</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-[#e6dccb] text-[10px] text-[#6e6358]">
        Scheduled changes publish automatically at midnight IST on the specified target date.
      </div>
    </div>
  );
};

export default ScheduledPopover;
