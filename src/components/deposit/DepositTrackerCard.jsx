/**
 * House of Kaira - Deposit Tracker Card Component (D4)
 * Section 5 (D4) & 7.2 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import { DEPOSIT_TRACKER_STEPS } from '../../data/deposit/depositRegistry.js';

const DepositTrackerCard = ({ onSelectStep }) => {
  return (
    <section className="jr dp-enter dp-e3" aria-labelledby="deposit-tracker-title">
      {/* Header Row */}
      <div className="jr-hd">
        <h2 id="deposit-tracker-title">Your deposit, every step of the way</h2>
        <p>
          Follow the same five steps in the{' '}
          <a href="/profile" className="jr-hd-lnk" title="Go to My Account">
            Deposit Tracker in My Account
          </a>
          .
        </p>
      </div>

      {/* 5 Steps Ordered List */}
      <ol className="jr-steps">
        {DEPOSIT_TRACKER_STEPS.map((step) => (
          <li key={step.number} className="jr-step-item">
            <button
              type="button"
              className="jr-step"
              onClick={() => onSelectStep && onSelectStep(step.opens)}
              aria-label={`Step ${step.number}: ${step.name}. ${step.timing}. Click to view details.`}
            >
              <span className="jr-n" aria-hidden="true">
                {step.number}
              </span>
              <div className="jr-txt">
                <span className="jr-k">{step.name}</span>
                <span className="jr-d">{step.timing}</span>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default React.memo(DepositTrackerCard);
