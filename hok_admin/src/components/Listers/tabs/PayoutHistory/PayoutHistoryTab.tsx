// src/components/Listers/tabs/PayoutHistory/PayoutHistoryTab.tsx

import React from 'react';
import { Lister, PayoutTransaction, ListerLedger } from '../../types/lister.types';
import { TaxStrip } from './TaxStrip';
import { PayoutStats } from './PayoutStats';
import { PayoutTable } from './PayoutTable';
// src/components/Listers/tabs/PayoutHistory/PayoutHistoryTab.tsx

import React from 'react';
import { Lister, PayoutTransaction, ListerLedger } from '../../types/lister.types';
import { TaxStrip } from './TaxStrip';
import { PayoutStats } from './PayoutStats';
import { PayoutTable } from './PayoutTable';
import { usePayouts } from '../../hooks/usePayouts';
import toast from 'react-hot-toast';
import './styles/PayoutHistoryTab.css';

interface PayoutHistoryTabProps {
  payouts: PayoutTransaction[];
  ledger: ListerLedger;
  lister: Lister | null;
  isCreateMode?: boolean;
  setView?: (view: string) => void;
}

export const PayoutHistoryTab: React.FC<PayoutHistoryTabProps> = ({
  payouts,
  ledger,
  lister,
  isCreateMode = false,
  setView,
}) => {
  const { sendStatementWhatsApp, exportCSV, loading } = usePayouts(lister?.id || '', lister);

  const handleStatementWhatsApp = async () => {
    if (!lister) return;
    try {
      await sendStatementWhatsApp(lister.name, lister.phone);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send statement');
    }
  };

  const handleExportCSV = () => {
    if (!lister) return;
    exportCSV(lister.name);
  };

  if (isCreateMode || !lister) {
    return (
      <div className="payout-history-tab">
        <div className="payout-stats">
          <div className="psc">
            <div className="psc-label">TOTAL EARNED</div>
            <div className="psc-value">—</div>
          </div>
          <div className="psc">
            <div className="psc-label">AVG PAYOUT %</div>
            <div className="psc-value">—</div>
          </div>
          <div className="psc">
            <div className="psc-label">TRANSACTION COUNT</div>
            <div className="psc-value">—</div>
          </div>
          <div className="psc">
            <div className="psc-label">PENDING AMOUNT</div>
            <div className="psc-value">—</div>
          </div>
        </div>

        <div className="listers-table-card card" style={{ marginTop: '16px' }}>
          <div className="listers-table-loading" style={{ padding: '32px', textAlign: 'center', fontSize: '11px', color: '#8A7E72' }}>
            No payout transactions yet.
          </div>
        </div>
        <div style={{ fontSize: '10px', color: '#8A7E72', marginTop: '8px' }}>
          Payout percentages vary per transaction. See Master Data for defaults.
        </div>
      </div>
    );
  }

  const pendingCount = payouts.filter(p => 
    p.status === 'Pending Approval' || p.status === 'Approved' || p.status === 'On Hold'
  ).length;

  return (
    <div className="payout-history-tab">
      {/* Tax Strip + Statement Button */}
      <div className="payout-history-header">
        <TaxStrip lister={lister} />
        <div className="payout-history-actions">
          <button 
            className="btn btn-sec btn-sm"
            onClick={handleStatementWhatsApp}
            disabled={loading || !lister}
          >
            Statement → WhatsApp
          </button>
          <button 
            className="btn btn-sec btn-sm"
            onClick={handleExportCSV}
            disabled={loading || payouts.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <PayoutStats ledger={ledger} pendingCount={pendingCount} />

      {/* Payout Table */}
      <PayoutTable payouts={payouts} setView={setView} />
    </div>
  );
};

export default PayoutHistoryTab;