import React, { useState } from 'react';
import './tabs.css';
import { Designer } from '../types/designer.types';

export type PaymentTerms = 'Standard T+3' | 'Standard T+7' | 'Standard T+15' | 'Advance' | 'On Delivery';

export interface ContactCommercialData {
  isBuyNewPartner: boolean;
  commissionPercent: string;
  paymentTerms: PaymentTerms;
  fulfilmentReturnsPolicy: string;
  accountManagerName: string;
  contactEmail: string;
  contactPhone: string;
  internalNotes: string;
}

interface ContactCommercialTabProps {
  designer: Designer;
  data?: ContactCommercialData;
  /** Gates editing — the tab is marked "Super Admin only" in the design. */
  isSuperAdmin?: boolean;
  onSave?: (data: ContactCommercialData) => void;
}

const DEFAULT_DATA: ContactCommercialData = {
  isBuyNewPartner: false,
  commissionPercent: '',
  paymentTerms: 'Standard T+3',
  fulfilmentReturnsPolicy: '',
  accountManagerName: '',
  contactEmail: '',
  contactPhone: '',
  internalNotes: '',
};

// The design only shows "Standard T+3" selected — the rest of this list is
// my best guess at sibling options, not confirmed. Swap in the real set once
// you have it.
const PAYMENT_TERMS_OPTIONS: PaymentTerms[] = [
  'Standard T+3',
  'Standard T+7',
  'Standard T+15',
  'Advance',
  'On Delivery',
];

const ContactCommercialTab: React.FC<ContactCommercialTabProps> = ({
  designer,
  data = DEFAULT_DATA,
  isSuperAdmin = true,
  onSave,
}) => {
  const [isBuyNewPartner, setIsBuyNewPartner] = useState(data.isBuyNewPartner);
  const [commissionPercent, setCommissionPercent] = useState(data.commissionPercent);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>(data.paymentTerms);
  const [fulfilmentReturnsPolicy, setFulfilmentReturnsPolicy] = useState(data.fulfilmentReturnsPolicy);
  const [accountManagerName, setAccountManagerName] = useState(data.accountManagerName);
  const [contactEmail, setContactEmail] = useState(data.contactEmail);
  const [contactPhone, setContactPhone] = useState(data.contactPhone);
  const [internalNotes, setInternalNotes] = useState(data.internalNotes);

  const fieldsLocked = !isSuperAdmin;

  const handleSave = () => {
    onSave?.({
      isBuyNewPartner,
      commissionPercent,
      paymentTerms,
      fulfilmentReturnsPolicy,
      accountManagerName,
      contactEmail,
      contactPhone,
      internalNotes,
    });
  };

  return (
    <div className="tab-card">
      <div className="section-header-row">
        <span className="section-header-title">COMMERCIAL TERMS</span>
        <span className="super-admin-badge">Super Admin only</span>
      </div>

      <div className="form-field">
        <label className="form-label">BUY NEW PARTNER</label>
        <label className="toggle-row">
          <span
            className={`toggle ${isBuyNewPartner ? 'on' : ''}`}
            onClick={() => !fieldsLocked && setIsBuyNewPartner(!isBuyNewPartner)}
          >
            <span className="toggle-knob" />
          </span>
          <span className="toggle-label">This brand supplies fresh stock for Buy New</span>
        </label>
        <p className="form-hint">
          Buy New pieces are fulfilled from designer-partner stock. Rental and preloved economics are per-lister
          and are not affected by anything on this tab.
        </p>
      </div>

      <div className="tab-form-grid">
        <div className="form-field">
          <label className="form-label">COMMISSION % (BUY NEW)</label>
          <input
            className="form-input"
            placeholder="e.g. 30"
            value={commissionPercent}
            onChange={(e) => setCommissionPercent(e.target.value)}
            disabled={fieldsLocked || !isBuyNewPartner}
          />
          <p className="form-hint">Overrides global Buy New commission for this designer only</p>
        </div>

        <div className="form-field">
          <label className="form-label">PAYMENT TERMS</label>
          <select
            className="form-select"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
            disabled={fieldsLocked || !isBuyNewPartner}
          >
            {PAYMENT_TERMS_OPTIONS.map((term) => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>

        <div className="form-field form-field-full">
          <label className="form-label">BRAND FULFILMENT &amp; RETURNS POLICY (QUOTED TO CUSTOMERS &amp; CS)</label>
          <textarea
            className="form-textarea"
            placeholder="Availability, made-to-order lead times, and the brand's return terms — this backs the 'availability and returns follow the brand's policy' line on Buy New PDPs."
            value={fulfilmentReturnsPolicy}
            onChange={(e) => setFulfilmentReturnsPolicy(e.target.value)}
            disabled={fieldsLocked || !isBuyNewPartner}
            rows={3}
          />
        </div>
      </div>

      <hr className="authentication-divider" />

      <div className="form-field">
        <label className="form-label">INTERNAL CONTACT (NOT SHOWN PUBLICLY)</label>
      </div>

      <div className="tab-form-grid">
        <div className="form-field">
          <label className="form-label">ACCOUNT MANAGER / CONTACT NAME</label>
          <input
            className="form-input"
            placeholder="Our point of contact at the brand"
            value={accountManagerName}
            onChange={(e) => setAccountManagerName(e.target.value)}
            disabled={fieldsLocked}
          />
        </div>

        <div className="form-field">
          <label className="form-label">CONTACT EMAIL</label>
          <input
            className="form-input"
            placeholder="brand@email.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            disabled={fieldsLocked}
          />
        </div>

        <div className="form-field">
          <label className="form-label">CONTACT PHONE</label>
          <input
            className="form-input"
            placeholder="+91 XXXXX XXXXX"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            disabled={fieldsLocked}
          />
        </div>

        <div className="form-field form-field-full">
          <label className="form-label">INTERNAL NOTES (PARTNERSHIP TERMS, CONTACT HISTORY, SPECIAL ARRANGEMENTS)</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. agreed 28% commission Q1 2026, renewal in June..."
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            disabled={fieldsLocked}
            rows={3}
          />
        </div>
      </div>

      <div className="tab-form-footer">
        <button className="btn btn-primary-small" onClick={handleSave} disabled={fieldsLocked}>Save</button>
      </div>
    </div>
  );
};

export default ContactCommercialTab;