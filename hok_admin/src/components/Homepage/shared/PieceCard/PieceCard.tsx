/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · PIECE CARD (Spec 4.12)
========================================================= */

import React from 'react';
import './PieceCard.css';
import { StatusPill } from '../StatusPill/StatusPill';

export interface PieceCardData {
  sku: string;
  name: string;
  designer: string;
  category: string;
  size?: string;
  status: 'Live' | 'Sold' | 'Draft' | 'Paused';
  imageUrl?: string;
  priceStd?: number;
  minDays?: number;
  resalePrice?: number;
  mrp?: number;
  retailPrice?: number;
  mode?: string; // 'Rental', 'Preloved', 'Buy New'
}

// 5 fixed deterministic swatches for category fallback (Spec 4.12.2)
const CATEGORY_SWATCHES = [
  { bg: '#F3EADA', text: '#8A6E3E' },
  { bg: '#EDF1E9', text: '#4E6543' },
  { bg: '#EFE9E6', text: '#7A5346' },
  { bg: '#E9ECF0', text: '#4B5A6B' },
  { bg: '#F1ECF2', text: '#63527A' }
];

const getCategorySwatch = (category: string) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash + category.charCodeAt(i)) % CATEGORY_SWATCHES.length;
  }
  return CATEGORY_SWATCHES[hash];
};

const getDesignerInitials = (designer: string): string => {
  const parts = designer.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const formatINR = (val?: number): string => {
  if (!val) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
};

interface PieceCardProps {
  piece?: PieceCardData | null;
  sku: string;
  onOpenPiece?: () => void;
  className?: string;
}

export const PieceCard: React.FC<PieceCardProps> = ({
  piece,
  sku,
  onOpenPiece,
  className = ''
}) => {
  if (!piece) {
    return (
      <div className={`hok-piece-card is-dimmed ${className}`.trim()}>
        <div className="hok-piece-thumb is-unknown">
          <span style={{ fontSize: '9px', color: 'var(--terra)' }}>✕</span>
        </div>
        <div className="hok-piece-info">
          <div className="hok-piece-name-row">
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--terra)' }}>
              {sku}
            </span>
          </div>
          <div className="hok-piece-unknown-msg">
            Not in the catalogue — this tile will not render.
          </div>
        </div>
      </div>
    );
  }

  const isLive = piece.status === 'Live';
  const swatch = getCategorySwatch(piece.category || 'General');
  const initials = getDesignerInitials(piece.designer || 'HOK');

  // Compute price line (Spec 4.12.1)
  const priceSegments: string[] = [];
  if (piece.priceStd) {
    const days = piece.minDays || 3;
    priceSegments.push(`Rent ₹${formatINR(piece.priceStd)} / ${days} ${days === 1 ? 'day' : 'days'}`);
  }
  if (piece.resalePrice) {
    priceSegments.push(`Buy ₹${formatINR(piece.resalePrice)}`);
  } else if (piece.retailPrice && !piece.priceStd) {
    priceSegments.push(`Retail ₹${formatINR(piece.retailPrice)}`);
  }

  return (
    <div className={`hok-piece-card ${!isLive ? 'is-dimmed' : ''} ${className}`.trim()}>
      {/* Thumbnail */}
      <div
        className="hok-piece-thumb"
        style={{ opacity: isLive ? 1 : 0.55 }}
        title={!piece.imageUrl ? "No photograph on this piece yet — showing the designer's initials" : undefined}
      >
        {piece.imageUrl ? (
          <img
            src={piece.imageUrl}
            alt={piece.name}
            style={{ filter: isLive ? 'none' : 'grayscale(100%)' }}
          />
        ) : (
          <div
            className="hok-piece-initials-fallback"
            style={{ backgroundColor: swatch.bg, color: swatch.text }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="hok-piece-info">
        <div className="hok-piece-name-row">
          <span
            className="hok-piece-name"
            onClick={onOpenPiece}
            title="Open piece record"
          >
            {piece.name}
          </span>
          <StatusPill status={piece.status} />
        </div>

        <div className="hok-piece-meta">
          {piece.designer} · {piece.category} {piece.size ? `· Size ${piece.size}` : ''}
        </div>

        {priceSegments.length > 0 && (
          <div className="hok-piece-price-line">
            <span className="hok-piece-price-figures">
              {priceSegments.join(' · ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
