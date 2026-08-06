// src/components/Listers/components/ListerDetailHeader.tsx

import React from 'react';
import { Lister, ListerLedger, AttentionFlag } from '../types/lister.types';
import { inr, formatDate } from '../utils/formatter';
import { generateWhatsAppLink, getDefaultWhatsAppMessage } from '../utils/generators';
import { STATUS_CHIP_MAPPING } from '../utils/constants';
import './styles/ListerDetailHeader.css';

interface ListerDetailHeaderProps {
  lister: Lister | null;
  ledger: ListerLedger;
  attentionFlags: AttentionFlag[];
  onRefresh?: () => void;
  isCreateMode?: boolean;
}

const WaIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.51 5.83L.054 23.43a.5.5 0 0 0 .609.61l5.703-1.488A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.727 9.727 0 0 1-4.96-1.356l-.355-.212-3.683.961.984-3.594-.232-.368A9.728 9.728 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2 8 12 13 22 8"/>
  </svg>
);

export const ListerDetailHeader: React.FC<ListerDetailHeaderProps> = ({
  lister,
  ledger,
  attentionFlags,
  onRefresh,
  isCreateMode = false,
}) => {
  if (isCreateMode || !lister) {
    return (
      <div className="lh-header">
        <div className="lh-header-left">
          <div className="lh-avatar lh-avatar-create">+</div>
          <div className="lh-info">
            <div className="lh-name">New Lister</div>
            <div className="lh-meta">Fill in contact details below and save to create this lister</div>
            <div className="lh-stats">
              <div className="lh-stat">
                <div className="lh-stat-value">—</div>
                <div className="lh-stat-label">Listings</div>
              </div>
              <div className="lh-stat">
                <div className="lh-stat-value">—</div>
                <div className="lh-stat-label">Total Earned</div>
              </div>
              <div className="lh-stat">
                <div className="lh-stat-value">—</div>
                <div className="lh-stat-label">Pending</div>
              </div>
              <div className="lh-stat">
                <div className="lh-stat-value">—</div>
                <div className="lh-stat-label">Sales</div>
              </div>
            </div>
          </div>
        </div>
        <div className="lh-header-right">
          <div className="lh-right-top">
            <button className="lh-customer-chip">ALSO A CUSTOMER →</button>
          </div>
        </div>
      </div>
    );
  }

  const statusChip = STATUS_CHIP_MAPPING[lister?.status || 'Verified'] || { variant: 's-live' };
  const firstName = (lister?.name || '').split(' ')[0] || '';
  const waLink = generateWhatsAppLink(lister?.phone || '', getDefaultWhatsAppMessage(firstName));
  const isPendingReview = lister?.status === 'Pending Review';

  return (
    <div className="lh-header">
      <div className="lh-header-left">
        <div className="lh-avatar">{lister.initials}</div>
        <div className="lh-info">
          <div className="lh-name">{lister.name}</div>
          <div className="lh-meta">
            {lister.email && <span>{lister.email}</span>}
            {lister.email && lister.phone && <span className="lh-meta-sep">·</span>}
            {lister.phone && <span>{lister.phone}</span>}
            {lister.city && (
              <>
                <span className="lh-meta-sep">·</span>
                <span>{lister.city}</span>
              </>
            )}
            <span className="lh-meta-sep">·</span>
            <span>Joined {formatDate(lister.joined)}</span>
          </div>
          <div className="lh-stats">
            <div className="lh-stat">
              <div className="lh-stat-value">{lister.id ? '3' : '—'}</div>
              <div className="lh-stat-label">Listings</div>
            </div>
            <div className="lh-stat">
              <div className="lh-stat-value">{inr(ledger.paid)}</div>
              <div className="lh-stat-label">Paid to Date</div>
            </div>
            <div className="lh-stat">
              <div className={`lh-stat-value ${ledger.pending > 0 ? 'lh-stat-pending' : ''}`}>
                {inr(ledger.pending)}
              </div>
              <div className="lh-stat-label">Pending</div>
            </div>
            <div className="lh-stat">
              <div className="lh-stat-value">{ledger.sales}</div>
              <div className="lh-stat-label">Preloved Sales</div>
            </div>
          </div>
        </div>
      </div>
      <div className="lh-header-right">
        <div className="lh-right-top">
          {lister.customerId && (
            <button className="lh-customer-chip">ALSO A CUSTOMER →</button>
          )}
          <span className={`s-chip ${statusChip.variant}`}>{lister.status}</span>
        </div>
        <div className="lh-right-btns">
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm lh-btn-wa">
              <WaIcon />
              WhatsApp Lister
            </a>
          )}
          {lister.email && (
            <a href={`mailto:${lister.email}`} className="btn btn-ghost btn-sm lh-btn-email">
              <MailIcon />
              Email
            </a>
          )}
          {isPendingReview && (
            <button className="btn btn-gold btn-sm">Review submission →</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListerDetailHeader;