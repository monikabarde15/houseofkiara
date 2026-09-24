// src/components/Listers/tabs/PayoutHistory/PayoutTable.tsx

import React from 'react';
import { PayoutTransaction } from '../../types/lister.types';
import { inr, formatDate, pluralize } from '../../utils/formatter';
import { PAYOUT_STATUS_CHIP_MAPPING } from '../../utils/constants';
import './styles/PayoutTable.css';

interface PayoutTableProps {
  payouts: PayoutTransaction[];
}

export const PayoutTable: React.FC<PayoutTableProps> = ({ payouts }) => {
  if (payouts.length === 0) {
    return (
      <div className="payout-table-card card">
        <div className="card-bd">
          <div className="payout-table-empty">No payout transactions yet.</div>
        </div>
      </div>
    );
  }

  const getTypeDisplay = (tx: PayoutTransaction) => {
    if (tx.isDamage) {
      return <span className="tag damage-tag">Damage Comp</span>;
    }
    return tx.type;
  };

  const getPayoutPercent = (tx: PayoutTransaction) => {
    if (tx.isDamage) {
      return `${tx.stdPct || 0}%+${tx.compPct || 0}% comp`;
    }
    return `${tx.pct}%`;
  };

  const getStatusChip = (status: string) => {
    const mapping = PAYOUT_STATUS_CHIP_MAPPING[status as keyof typeof PAYOUT_STATUS_CHIP_MAPPING];
    return mapping || PAYOUT_STATUS_CHIP_MAPPING['Pending Approval'];
  };

  const getStatusLabel = (status: string) => {
    if (status === 'Pending Approval' || status === 'Approved' || status === 'On Hold') {
      return 'Pending Approval';
    }
    return status;
  };

  const getAmountColor = (tx: PayoutTransaction) => {
    if (tx.isDamage) return 'payout-amount-damage';
    if (tx.status === 'Paid') return 'payout-amount-paid';
    return 'payout-amount-pending';
  };

  const isUndecided = (status: string) => {
    return status === 'Pending Approval' || status === 'Approved' || status === 'On Hold';
  };

  return (
    <div className="payout-table-card card">
      <div className="twrap">
        <table className="dt">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Product</th>
              <th>Type</th>
              <th>Transaction Value</th>
              <th>Payout %</th>
              <th>Payout Amount</th>
              <th>HOK Commission</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((tx) => {
              const statusChip = getStatusChip(tx.status);
              const statusLabel = getStatusLabel(tx.status);

              return (
                <tr key={tx.id} className="payout-row-clickable">
                  <td>
                    <span className="payout-order-id">{tx.orderId}</span>
                  </td>
                  <td>
                    <span className="payout-product-link qlnk">{tx.sku}</span>
                  </td>
                  <td>{getTypeDisplay(tx)}</td>
                  <td>{inr(tx.tv)}</td>
                  <td>{getPayoutPercent(tx)}</td>
                  <td className={getAmountColor(tx)}>{inr(tx.amount)}</td>
                  <td>{inr(tx.commission)}</td>
                  <td>
                    <span className={`s-chip ${statusChip.variant}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td>{formatDate(tx.date)}</td>
                  <td className="payout-action-cell">
                    {isUndecided(tx.status) ? (
                      <button className="btn btn-gold btn-xs">Review →</button>
                    ) : (
                      <button className="btn btn-sec btn-xs">View Payout →</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="ftot">
        <span>{pluralize(payouts.length, 'transaction')}</span>
      </div>
    </div>
  );
};

export default PayoutTable;