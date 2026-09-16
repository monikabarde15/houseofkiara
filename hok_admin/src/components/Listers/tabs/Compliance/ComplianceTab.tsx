// src/components/Listers/tabs/Compliance/ComplianceTab.tsx

import React, { useState } from 'react';
import { Lister, ListerStatus } from '../../types/lister.types';
import { LISTER_STATUSES } from '../../utils/constants';
import { inr } from '../../utils/formatter';
import './styles/ComplianceTab.css';

interface ComplianceTabProps {
  lister: Lister | null;
  onSave: () => void;
  isCreateMode?: boolean;
}

export const ComplianceTab: React.FC<ComplianceTabProps> = ({
  lister,
  onSave,
  isCreateMode = false,
}) => {
  const [status, setStatus] = useState<ListerStatus>(lister?.status || 'Verified');
  const [statusReason, setStatusReason] = useState(lister?.statusReason || '');
  const [notes, setNotes] = useState(lister?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (value: ListerStatus) => {
    setStatus(value);
    if (value === 'Verified' || value === 'Pending Review') {
      setStatusReason('');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { listerService } = await import('../../services/listerService');
      if (lister?.id && !isCreateMode) {
        await listerService.updateLister(lister.id, {
          status,
          statusReason,
          notes,
        });
      }
      onSave();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compliance-tab">
      <div className="compliance-card card">
        <div className="card-hd">
          <span className="card-title">Account Settings</span>
        </div>

        <div className="card-bd">
          <div className="compliance-status-row">
            <div className="fld">
              <label className="fld-label">Account Status</label>
              <select
                className="fld-input"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as ListerStatus)}
              >
                {LISTER_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="fld-hint">
                Suspended pauses every live piece (existing bookings honored). Exited runs the offboarding check below first.
              </div>
            </div>

            <div className="fld">
              <label className="fld-label">
                Status Reason <span className="fld-label-internal">– internal, on the record</span>
              </label>
              <input
                type="text"
                className="fld-input"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="e.g. repeated late handovers"
              />
            </div>
          </div>

          <div className="compliance-authority-note">
            Payout splits are never set at the lister level — the piece default suggests, the deal may pre-decide, and payout approval is the only binding moment. Anything negotiated with this lister belongs on the piece or the transaction.
          </div>

          <div className="compliance-terms-line">
            <span className="terms-label">Lister Terms</span>
            <span className="terms-value">
              {lister?.terms?.version || 'LST-2026-01'} accepted {lister?.terms?.acceptedAt ? new Date(lister.terms.acceptedAt).toLocaleDateString() : '12 Mar 2024'} via {lister?.terms?.channel || 'Website (List Your Piece)'} — the lister-side mirror of the customer DPDP trail.
            </span>
          </div>

          <div className="compliance-offboarding-line">
            <span className="offboarding-label">Offboarding readiness</span>
            <span className="offboarding-value">
              pending payouts {inr(0)} · pieces in HOK custody 0. Both must read zero before Exited is honest.
            </span>
          </div>

          <div className="fld">
            <label className="fld-label">Internal Notes</label>
            <textarea
              className="fld-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes here..."
              rows={4}
            />
          </div>
        </div>

        <div className="card-ft">
          <button className="btn btn-danger btn-sm">Suspend Account</button>
          <button
            className="btn btn-gold btn-sm"
            onClick={handleSave}
            disabled={loading}
          >
            Save
            <span className="save-check"> ✓</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTab;