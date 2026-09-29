import React from 'react';
import './ReorderArrows.css';

interface ReorderArrowsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  upHint?: string;
  downHint?: string;
  className?: string;
}

export const ReorderArrows: React.FC<ReorderArrowsProps> = ({
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  upHint,
  downHint,
  className = ''
}) => {
  return (
    <div className={`hok-reorder-arrows ${className}`.trim()}>
      <button
        type="button"
        className="hok-reorder-btn"
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        disabled={!canMoveUp}
        data-hint={canMoveUp ? upHint : undefined}
        aria-label="Move item earlier"
      >
        <div className="hok-reorder-glyph glyph-up" />
      </button>
      <button
        type="button"
        className="hok-reorder-btn"
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        disabled={!canMoveDown}
        data-hint={canMoveDown ? downHint : undefined}
        aria-label="Move item later"
      >
        <div className="hok-reorder-glyph glyph-down" />
      </button>
    </div>
  );
};
