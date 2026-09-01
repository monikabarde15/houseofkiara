// src/components/Listers/tabs/TheirListings/UtilizationChips.tsx

import React from 'react';
import { pluralize } from '../../utils/formatter';
import './styles/UtilizationChips.css';

interface UtilizationChipsProps {
  utilization: {
    live: number;
    paused: number;
    draft: number;
    sold: number;
    archived: number;
    stale: number;
    lifetimeRentals: number;
    atHOK: number;
    withLister: number;
    withCustomer: number;
  };
}

export const UtilizationChips: React.FC<UtilizationChipsProps> = ({ utilization }) => {
  const chips: Array<{ label: string; count: number; className?: string }> = [];

  if (utilization.live > 0) {
    chips.push({ label: 'live', count: utilization.live });
  }
  if (utilization.paused > 0) {
    chips.push({ label: 'paused', count: utilization.paused });
  }
  if (utilization.draft > 0) {
    chips.push({ label: 'draft', count: utilization.draft });
  }
  if (utilization.sold > 0) {
    chips.push({ label: 'sold', count: utilization.sold });
  }
  if (utilization.archived > 0) {
    chips.push({ label: 'archived', count: utilization.archived });
  }
  if (utilization.stale > 0) {
    chips.push({ label: 'stale', count: utilization.stale, className: 'ret-chip-gold' });
  }
  if (utilization.lifetimeRentals > 0) {
    chips.push({ label: 'lifetime rentals', count: utilization.lifetimeRentals });
  }
  if (utilization.atHOK > 0) {
    chips.push({ label: 'at HOK', count: utilization.atHOK });
  }
  if (utilization.withLister > 0) {
    chips.push({ label: 'with lister', count: utilization.withLister });
  }
  if (utilization.withCustomer > 0) {
    chips.push({ label: 'with customer', count: utilization.withCustomer });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="utilization-chips">
      {chips.map((chip, index) => (
        <span 
          key={index} 
          className={`ret-chip ${chip.className || ''}`}
        >
          {pluralize(chip.count, chip.label)}
        </span>
      ))}
    </div>
  );
};

export default UtilizationChips;