/**
 * House of Kaira - Deposit Policy Related Policies & Last Reviewed (D12)
 * Section 5 (D12) & Section 7.8 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { DEPOSIT_SETTINGS } from '../../data/deposit/depositSettings.js';
import { DEPOSIT_RELATED_POLICIES } from '../../data/deposit/depositRegistry.js';

const DepositRelatedPolicies = () => {
  const handlePrint = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section className="pol" aria-label="Related policies and document metadata">
      <div className="pol-in">
        <b>Related policies</b>
        {DEPOSIT_RELATED_POLICIES.map((item, idx) => (
          <Link key={idx} to={item.path}>
            {item.label}
          </Link>
        ))}
      </div>

      <p>
        This page sets out our deposit policy in plain language. Should it ever differ from our Terms &amp; Conditions, the Terms apply. Last reviewed {DEPOSIT_SETTINGS.last_reviewed_date}.
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Print or save Deposit Policy as PDF"
        >
          Print or save as PDF
        </button>
      </p>
    </section>
  );
};

export default React.memo(DepositRelatedPolicies);
