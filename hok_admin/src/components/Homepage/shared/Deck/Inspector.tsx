/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · INSPECTOR (Spec 4.10)
========================================================= */

import React from 'react';
import './Deck.css';

interface InspectorProps {
  kicker: string; // e.g. "EDITING TILE 2" or "Position 1 Gulabi Silk Bridal Lehenga"
  itemName?: string;
  children?: React.ReactNode;
  emptyText?: string;
  isOpen: boolean;
}

export const Inspector: React.FC<InspectorProps> = ({
  kicker,
  itemName,
  children,
  emptyText = 'Pick a tile above to set its picture, its label and its app kicker.',
  isOpen
}) => {
  if (!isOpen) {
    return (
      <div className="hok-inspector-empty">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="hok-inspector-container">
      <div className="hok-inspector-header">
        <span className="hok-inspector-kicker">{kicker}</span>
        {itemName && <span className="hok-inspector-item-name">{itemName}</span>}
      </div>

      <div className="hok-inspector-body">{children}</div>
    </div>
  );
};
