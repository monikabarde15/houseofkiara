/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ScheduledPopover (Spec §3.1 & §5.8, Screen 16)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useRef, useEffect } from 'react';
import { Calendar, X, ExternalLink } from 'lucide-react';

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
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-[380px] bg-[#fffefb] border border-[#d9ccb6] rounded-[8px] shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#e6dccb]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#3d6e8e]" />
          <h3 className="font-serif text-base font-normal text-[#1a1612]">
            Changes going live later
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[#6e6358] hover:text-[#1a1612] p-1 rounded hover:bg-[#efe7db] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {/* Scheduled Item 1: Free Delivery (Spec §5.8 & Screen 16) */}
        <div className="p-3 bg-[#f7f2ea] rounded-[6px] border border-[#e6dccb] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1a1612]">Free delivery from</span>
            <span className="text-[11px] font-mono text-[#3d6e8e] bg-[#3d6e8e]/10 px-2 py-0.5 rounded">
              From 1 Dec 2026
            </span>
          </div>

          <div className="text-xs text-[#5c5248]">
            <span className="line-through text-[#6e6358] mr-2">₹5,000</span>
            <span className="font-semibold text-[#1a1612]">₹6,000</span>
          </div>

          <p className="text-[11px] text-[#6e6358] leading-tight">
            Orders placed on or after 1 December will receive free delivery on orders of ₹6,000 or more.
          </p>

          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="text-[#6e6358]">Affects 5 pages</span>
            <button
              onClick={() => {
                onViewScheduledPage?.('shipping-policy');
                onClose();
              }}
              className="text-[#8a6a36] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View shipping policy</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#6e6358] leading-relaxed italic pt-1">
          Each scheduled change goes live automatically at midnight on its date, India time.
        </p>
      </div>
    </div>
  );
};

export default ScheduledPopover;
