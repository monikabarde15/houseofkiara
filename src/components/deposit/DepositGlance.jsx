/**
 * House of Kaira - Your Deposit at a Glance Component (D7 & D8)
 * Section 5 (D7, D8) & 7.4 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import { DEPOSIT_GLANCE_ROWS } from '../../data/deposit/depositRegistry.js';
import DepositVerdictTag from './DepositVerdictTag.jsx';

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const DepositGlance = ({ onSelectRow }) => {
  return (
    <section className="glance" aria-labelledby="deposit-glance-heading">
      <span id="deposit-glance-heading" className="ey">
        Your deposit at a glance
      </span>

      <ul className="glance-list">
        {DEPOSIT_GLANCE_ROWS.map((row) => (
          <li key={row.opens}>
            <button
              type="button"
              className="g-row"
              onClick={() => onSelectRow && onSelectRow(row.opens)}
              aria-label={`${row.text}: ${row.tag}. Click to view full answer.`}
            >
              <span className="g-sit">{row.text}</span>
              <DepositVerdictTag label={row.tag} type={row.tagType} />
              <ChevronIcon />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default React.memo(DepositGlance);
