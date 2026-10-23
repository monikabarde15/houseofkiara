/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigurePickerPopover (Spec §7.4 Add a Figure Picker)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Hash, X } from 'lucide-react';
import { FigureItem } from '../../types';
import { SEED_FIGURES } from '../../data';

interface FigurePickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFigure: (figure: FigureItem) => void;
  position?: { top: number; left: number };
}

export const FigurePickerPopover: React.FC<FigurePickerPopoverProps> = ({
  isOpen,
  onClose,
  onSelectFigure,
  position
}) => {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

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

  const filteredFigures = useMemo(() => {
    if (!query.trim()) return SEED_FIGURES.slice(0, 8);
    const q = query.toLowerCase().trim();
    return SEED_FIGURES.filter(
      f =>
        f.label.toLowerCase().includes(q) ||
        f.key.toLowerCase().includes(q) ||
        f.displayValue.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      style={position ? { top: `${position.top}px`, left: `${position.left}px` } : undefined}
      className={`${
        position ? 'absolute' : 'fixed inset-0 m-auto'
      } w-80 bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_12px_36px_rgba(26,22,18,0.14)] z-50 overflow-hidden flex flex-col max-h-96 animate-in fade-in zoom-in-95 duration-100 text-xs`}
    >
      {/* Header */}
      <div className="p-2.5 border-b border-[#e6dccb] flex items-center gap-2 bg-[#fffefb]">
        <Hash className="w-3.5 h-3.5 text-[#8a6a36]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search 90 figures to insert..."
          className="flex-1 bg-transparent text-xs text-[#1a1612] placeholder-[#6e6358] focus:outline-none"
        />
        <button
          onClick={onClose}
          className="text-[#6e6358] hover:text-[#1a1612] p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="overflow-y-auto p-1.5 divide-y divide-[#e6dccb]/50">
        {filteredFigures.map(fig => (
          <button
            key={fig.key}
            onClick={() => {
              onSelectFigure(fig);
              onClose();
            }}
            className="w-full p-2 text-left hover:bg-[#f5edd8]/60 rounded-[4px] transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <div className="font-semibold text-xs text-[#1a1612] truncate">
                {fig.label}
              </div>
              <div className="text-[10px] font-mono text-[#6e6358] truncate">
                {fig.key}
              </div>
            </div>
            <span className="shrink-0 font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#f5edd8] text-[#8a6a36] border border-[#c9a96e]/40">
              {fig.displayValue}
            </span>
          </button>
        ))}

        {filteredFigures.length === 0 && (
          <div className="p-4 text-center text-[#6e6358] text-[11px]">
            No matching figures found.
          </div>
        )}
      </div>

      <div className="p-2 border-t border-[#e6dccb] bg-[#f7f2ea] text-[10px] text-[#6e6358] flex justify-between">
        <span>Inserts live bound token</span>
        <span>Esc to close</span>
      </div>
    </div>
  );
};

export default FigurePickerPopover;
