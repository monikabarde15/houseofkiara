// src/components/Listers/tabs/PayoutHistory/PayoutStats.tsx

import React from 'react';
import { ListerLedger } from '../../types/lister.types';
import { inr } from '../../utils/formatter';
import './styles/PayoutStats.css';

interface PayoutStatsProps {
  ledger: ListerLedger;
  pendingCount: number;
}

export const PayoutStats: React.FC<PayoutStatsProps> = ({ ledger, pendingCount }) => {
  const stats = [
    {
      label: 'Total Earned',
      value: inr(ledger.paid),
      color: 'psc-sage',
    },
    {
      label: 'Avg Payout %',
      value: ledger.avgPct !== null ? `${ledger.avgPct}%` : '—',
      color: 'psc-gold',
    },
    {
      label: 'Transaction Count',
      value: ledger.paidCount,
      color: 'psc-charcoal',
    },
    {
      label: 'Pending Amount',
      value: inr(ledger.pending),
      color: 'psc-terra',
    },
  ];

  return (
    <div className="payout-stats">
      {stats.map((stat, index) => (
        <div key={index} className={`psc ${stat.color}`}>
          <div className="psc-label">{stat.label}</div>
          <div className="psc-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default PayoutStats;