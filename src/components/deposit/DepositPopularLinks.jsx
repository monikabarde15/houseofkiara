/**
 * House of Kaira - Deposit Policy Popular Searches (D3)
 * Section 5 (D3) & 7.1 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import { DEPOSIT_POPULAR_LINKS } from '../../data/deposit/depositRegistry.js';

const DepositPopularLinks = ({ onSelectQuestion }) => {
  return (
    <div className="ch-pop dp-enter dp-e4" role="navigation" aria-label="Popular questions">
      <span className="ch-pop-label">Popular:</span>
      {DEPOSIT_POPULAR_LINKS.map((link) => (
        <button
          key={link.anchor}
          type="button"
          onClick={() => onSelectQuestion && onSelectQuestion(link.anchor)}
        >
          {link.text}
        </button>
      ))}
    </div>
  );
};

export default React.memo(DepositPopularLinks);
