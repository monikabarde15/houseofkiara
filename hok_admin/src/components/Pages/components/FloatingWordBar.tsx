/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FloatingWordBar (Spec §7.5, Screen 22)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';

export interface FloatingWordBarProps {
  isHeading?: boolean;
  isListLine?: boolean;
  listKind?: 'paragraph' | 'bullet' | 'note';
  onBoldClick: () => void;
  onLinkClick: () => void;
  onAddFigureClick?: () => void;
  onGoldItalicClick?: () => void;
  onListKindChange?: (kind: 'paragraph' | 'bullet' | 'note') => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddLineAfter?: () => void;
  onRemoveLine?: () => void;
  selectionEmpty?: boolean;
  style?: React.CSSProperties;
}

export const FloatingWordBar: React.FC<FloatingWordBarProps> = ({
  isHeading = false,
  isListLine = false,
  listKind = 'paragraph',
  onBoldClick,
  onLinkClick,
  onAddFigureClick,
  onGoldItalicClick,
  onListKindChange,
  onMoveUp,
  onMoveDown,
  onAddLineAfter,
  onRemoveLine,
  selectionEmpty = true,
  style
}) => {
  const [showBoldTooltip, setShowBoldTooltip] = useState(false);

  const handleBold = () => {
    if (selectionEmpty) {
      setShowBoldTooltip(true);
      setTimeout(() => setShowBoldTooltip(false), 2400);
    } else {
      onBoldClick();
    }
  };

  return (
    <div
      style={style}
      className="absolute z-40 flex items-center gap-1 px-2 py-1 bg-[#1a1612] text-white rounded-[6px] shadow-2xl border border-[#332e27] text-xs select-none transition-all duration-150 animate-in fade-in"
    >
      {/* Tooltip when Bold is clicked with nothing selected */}
      {showBoldTooltip && (
        <div className="absolute -top-8 left-0 px-2 py-1 bg-[#2e2924] border border-[#4a4238] text-[11px] text-[#f7f2ea] rounded shadow-md whitespace-nowrap z-50">
          Select the words to set in bold first.
        </div>
      )}

      {isHeading ? (
        /* Heading options: Gold italic (Spec §7.5) */
        <button
          type="button"
          onClick={onGoldItalicClick}
          className="px-2 py-1 rounded hover:bg-[#2d2720] text-[#c5ad7d] italic font-serif flex items-center gap-1 transition-colors"
          title="Set the selected words in gold italic"
        >
          <span>Gold italic</span>
        </button>
      ) : (
        /* Paragraph / Sentence options (Spec §7.5) */
        <>
          <button
            type="button"
            onClick={handleBold}
            className="px-2 py-1 rounded hover:bg-[#2d2720] text-white font-bold transition-colors"
            title="Bold selected words"
          >
            B
          </button>

          <button
            type="button"
            onClick={onLinkClick}
            className="px-2 py-1 rounded hover:bg-[#2d2720] text-white/90 hover:text-white transition-colors flex items-center gap-1"
            title="Make selected words a link"
          >
            <span>Link</span>
          </button>

          {onAddFigureClick && (
            <button
              type="button"
              onClick={onAddFigureClick}
              className="ml-1 px-2.5 py-0.5 rounded bg-[#c5ad7d] hover:bg-[#d8c399] text-[#1a1612] font-medium text-[11px] transition-colors flex items-center gap-1"
              title="Put a figure in at the cursor"
            >
              <span>Add a figure</span>
            </button>
          )}
        </>
      )}

      {/* List item extra controls (Spec §7.5) */}
      {isListLine && (
        <>
          <div className="h-4 w-px bg-white/20 mx-1" />

          {/* Kind selector: Paragraph, Bullet, Note */}
          <div className="flex items-center gap-0.5 bg-[#2d2720] p-0.5 rounded text-[11px]">
            {(['paragraph', 'bullet', 'note'] as const).map(k => (
              <button
                key={k}
                type="button"
                onClick={() => onListKindChange && onListKindChange(k)}
                className={`px-1.5 py-0.5 rounded capitalize transition-colors ${
                  listKind === k ? 'bg-[#c5ad7d] text-[#1a1612] font-medium' : 'text-white/70 hover:text-white'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/20 mx-0.5" />

          {/* Move up / down / add / remove */}
          <button
            type="button"
            onClick={onMoveUp}
            className="px-1.5 py-0.5 rounded hover:bg-[#2d2720] text-white/80 hover:text-white"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            className="px-1.5 py-0.5 rounded hover:bg-[#2d2720] text-white/80 hover:text-white"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onAddLineAfter}
            className="px-1.5 py-0.5 rounded hover:bg-[#2d2720] text-white/80 hover:text-white text-[11px]"
            title="Add one after this"
          >
            + Add
          </button>
          <button
            type="button"
            onClick={onRemoveLine}
            className="px-1.5 py-0.5 rounded hover:bg-[#993d3d] text-white/80 hover:text-white text-[11px]"
            title="Remove line"
          >
            Remove
          </button>
        </>
      )}
    </div>
  );
};

export default FloatingWordBar;
