/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · DECK TILE (Spec 4.10)
========================================================= */

import React from 'react';
import './Deck.css';
import { HomepageLineIcon } from '../icons/HomepageIcons';
import { StatusPill } from '../StatusPill/StatusPill';

export interface DeckTileItem {
  id: string;
  position: number;
  title: string;
  sub?: string;
  pictureUrl?: string;
  iconName?: string;
  initials?: string;
  pictureHeight?: number;
  cornerFlag?: {
    type: 'need' | 'off' | 'status';
    label: string;
  };
  dimmed?: boolean;
}

interface DeckTileProps {
  item: DeckTileItem;
  isSelected: boolean;
  onSelect: () => void;
  onMoveEarlier?: () => void;
  onMoveLater?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export const DeckTile: React.FC<DeckTileProps> = ({
  item,
  isSelected,
  onSelect,
  onMoveEarlier,
  onMoveLater,
  onRemove,
  removeLabel = 'Remove',
  isFirst = false,
  isLast = false
}) => {
  const height = item.pictureHeight || 108;

  return (
    <div
      className={`hok-deck-tile ${isSelected ? 'is-selected' : ''} ${item.dimmed ? 'is-dimmed' : ''}`}
      onClick={onSelect}
    >
      {/* Position Badge */}
      <div className="hok-deck-pos-badge">{item.position}</div>

      {/* Corner Flag */}
      {item.cornerFlag && (
        <div className="hok-deck-corner-flag">
          {item.cornerFlag.type === 'status' ? (
            <StatusPill status={item.cornerFlag.label} />
          ) : (
            <span className={`hok-deck-flag-${item.cornerFlag.type}`}>
              {item.cornerFlag.label}
            </span>
          )}
        </div>
      )}

      {/* Picture Area */}
      <div
        className={`hok-deck-tile-picture ${!item.pictureUrl ? 'no-pic' : ''}`}
        style={{
          height: `${height}px`,
          backgroundImage: item.pictureUrl ? `url(${item.pictureUrl})` : undefined
        }}
      >
        {!item.pictureUrl && (
          <>
            {item.iconName ? (
              <span style={{ color: 'var(--gold)' }}>
                <HomepageLineIcon name={item.iconName} size={26} />
              </span>
            ) : item.initials ? (
              <span className="hok-deck-tile-initials">{item.initials}</span>
            ) : (
              <div className="hok-deck-tile-no-pic-label">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>No picture</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="hok-deck-tile-content">
        <span className="hok-deck-tile-title">{item.title}</span>
        {item.sub && <span className="hok-deck-tile-sub">{item.sub}</span>}
      </div>

      {/* Controls Row */}
      <div
        className="hok-deck-tile-controls"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hok-deck-reorder-btns">
          <button
            type="button"
            className="hok-deck-arrow-btn"
            disabled={isFirst}
            onClick={onMoveEarlier}
            title="Move step earlier"
          >
            ▲
          </button>
          <button
            type="button"
            className="hok-deck-arrow-btn"
            disabled={isLast}
            onClick={onMoveLater}
            title="Move step later"
          >
            ▼
          </button>
        </div>

        {onRemove && (
          <button
            type="button"
            className="hok-deck-remove-btn"
            onClick={onRemove}
          >
            {removeLabel}
          </button>
        )}
      </div>
    </div>
  );
};
