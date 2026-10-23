/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FloatingFormatBar (Spec §7.4 Floating Format Bar)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import { Bold, Italic, Link2, Hash, Sparkles } from 'lucide-react';
import { FigureItem } from '../../types';
import { FigurePickerPopover } from './FigurePickerPopover';

interface FloatingFormatBarProps {
  onApplyFormat: (format: 'bold' | 'italic') => void;
  onInsertLink: (url: string) => void;
  onInsertFigure: (figure: FigureItem) => void;
  position?: { top: number; left: number };
}

export const FloatingFormatBar: React.FC<FloatingFormatBarProps> = ({
  onApplyFormat,
  onInsertLink,
  onInsertFigure
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isLinkPromptOpen, setIsLinkPromptOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl.trim()) {
      onInsertLink(linkUrl.trim());
      setLinkUrl('');
      setIsLinkPromptOpen(false);
    }
  };

  return (
    <div className="sticky top-2 z-20 flex items-center justify-center pointer-events-none mb-3">
      <div className="pointer-events-auto bg-[#1a1612] text-[#fffefb] rounded-[6px] px-2 py-1 shadow-[0_8px_24px_rgba(26,22,18,0.2)] border border-[#1a1612] flex items-center gap-1 text-xs select-none">
        {/* Bold Button */}
        <button
          onClick={() => onApplyFormat('bold')}
          className="p-1.5 rounded-[4px] hover:bg-[#fffefb]/15 text-[#fffefb] transition-colors cursor-pointer"
          title="Bold (⌘B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* Italic Button */}
        <button
          onClick={() => onApplyFormat('italic')}
          className="p-1.5 rounded-[4px] hover:bg-[#fffefb]/15 text-[#fffefb] transition-colors cursor-pointer"
          title="Italic (⌘I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        {/* Link Button */}
        <div className="relative">
          <button
            onClick={() => setIsLinkPromptOpen(prev => !prev)}
            className="p-1.5 rounded-[4px] hover:bg-[#fffefb]/15 text-[#fffefb] transition-colors cursor-pointer"
            title="Insert Link"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>

          {isLinkPromptOpen && (
            <form
              onSubmit={handleLinkSubmit}
              className="absolute left-0 top-full mt-2 w-64 bg-[#fffefb] text-[#1a1612] border border-[#e6dccb] rounded-[6px] p-2 shadow-lg flex items-center gap-1.5 z-40"
            >
              <input
                type="text"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="Enter URL or /page..."
                className="flex-1 px-2 py-1 bg-[#f7f2ea] border border-[#d9ccb6] rounded-[4px] text-xs focus:outline-none focus:border-[#8a6a36]"
                autoFocus
              />
              <button
                type="submit"
                className="px-2 py-1 bg-[#8a6a36] text-white text-xs font-semibold rounded-[4px]"
              >
                Add
              </button>
            </form>
          )}
        </div>

        <div className="h-4 w-px bg-[#fffefb]/20 mx-1" />

        {/* Add a Figure Button (Spec §7.4: Gold button) */}
        <div className="relative">
          <button
            onClick={() => setIsPickerOpen(prev => !prev)}
            className="px-2.5 py-1 rounded-[4px] bg-[#c9a96e] hover:bg-[#b89558] text-[#1a1612] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-xs"
            title="Insert live figure token"
          >
            <Hash className="w-3.5 h-3.5 text-[#1a1612]" />
            <span>Add a figure</span>
          </button>

          <FigurePickerPopover
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            onSelectFigure={onInsertFigure}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingFormatBar;
