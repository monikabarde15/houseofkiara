/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · DECK (Spec 4.10)
========================================================= */

import React from 'react';
import './Deck.css';
import { DeckTile, DeckTileItem } from './DeckTile';
import { PlusIcon } from '../icons/HomepageIcons';

export type DeckArrangement = 'd3' | 'd4' | 'd6' | 'mosaic';

interface DeckProps {
  items: DeckTileItem[];
  selectedIndex: number | null;
  onSelectIndex: (index: number | null) => void;
  arrangement?: DeckArrangement;
  onMoveEarlier?: (index: number) => void;
  onMoveLater?: (index: number) => void;
  onRemove?: (index: number) => void;
  removeLabel?: string;
  onAddTile?: () => void;
  addLabel?: string;
  addCountText?: string;
  maxReached?: boolean;
}

export const Deck: React.FC<DeckProps> = ({
  items,
  selectedIndex,
  onSelectIndex,
  arrangement = 'd4',
  onMoveEarlier,
  onMoveLater,
  onRemove,
  removeLabel = 'Remove',
  onAddTile,
  addLabel = 'Add an item',
  addCountText,
  maxReached = false
}) => {
  return (
    <div className="hok-deck-container">
      <div className={`hok-deck-grid is-${arrangement}`}>
        {items.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <DeckTile
              key={item.id}
              item={item}
              isSelected={isSelected}
              onSelect={() => onSelectIndex(isSelected ? null : idx)}
              onMoveEarlier={() => onMoveEarlier && onMoveEarlier(idx)}
              onMoveLater={() => onMoveLater && onMoveLater(idx)}
              onRemove={() => onRemove && onRemove(idx)}
              removeLabel={removeLabel}
              isFirst={idx === 0}
              isLast={idx === items.length - 1}
            />
          );
        })}

        {/* Add Tile */}
        {onAddTile && !maxReached && (
          <div className="hok-deck-add-tile" onClick={onAddTile}>
            <PlusIcon size={14} />
            <span className="hok-deck-add-label">{addLabel}</span>
            {addCountText && <span className="hok-deck-add-count">{addCountText}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
