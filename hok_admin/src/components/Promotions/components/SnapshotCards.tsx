/* ========================================
   Promotions Module - Snapshot Cards
   4 stat cards: LIVE CODES, REDEMPTIONS, ORDER VALUE, DISCOUNT FUNDED
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.2
   ======================================== */

import React from 'react';
import './styles/SnapshotCards.css';
import { StatCard } from './UI';
import { SNAPSHOT_CARDS } from '../utils/constants';

interface SnapshotCardsProps {
  liveCodes: number;
  redemptions: number;
  orderValue: number;
  discountFunded: number;
  activeFilter: string | null;
  onFilterClick: (filter: string | null) => void;
}

export const SnapshotCards: React.FC<SnapshotCardsProps> = ({
  liveCodes,
  redemptions,
  orderValue,
  discountFunded,
  activeFilter,
  onFilterClick,
}) => {
  const cards = [
    {
      ...SNAPSHOT_CARDS[0],
      value: liveCodes,
      color: '#1A1612',
      filter: 'live',
    },
    {
      ...SNAPSHOT_CARDS[1],
      value: redemptions,
      color: '#6B7E5A',
      filter: 'redemptions',
    },
    {
      ...SNAPSHOT_CARDS[2],
      value: `₹${orderValue.toLocaleString('en-IN')}`,
      color: '#1A1612',
      filter: 'orderValue',
    },
    {
      ...SNAPSHOT_CARDS[3],
      value: `₹${discountFunded.toLocaleString('en-IN')}`,
      color: '#B85C38',
      filter: 'discountFunded',
    },
  ];

  const handleClick = (filter: string) => {
    onFilterClick(activeFilter === filter ? null : filter);
  };

  return (
    <div className="snapshot-cards">
      {cards.map(card => (
        <StatCard
          key={card.id}
          label={card.label}
          value={card.value}
          tooltip={card.tooltip}
          active={activeFilter === card.filter}
          onClick={() => handleClick(card.filter)}
          valueColor={card.color}
        />
      ))}
    </div>
  );
};