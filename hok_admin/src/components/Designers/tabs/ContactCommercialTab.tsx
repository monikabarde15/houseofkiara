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
  onChange?: (updated: Partial<Designer>) => void;
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
  data,
  isSuperAdmin = true,
  onSave,
  onChange,
}) => {
  const commTerms = designer?.commercialTerms || {};
  const initialData: ContactCommercialData = data || {
    isBuyNewPartner: commTerms.suppliesFreshStockBuyNow || false,
    commissionPercent: commTerms.commissionRateBuyNow || '',
    paymentTerms: (commTerms.paymentTerms as PaymentTerms) || 'Standard T+3',
    fulfilmentReturnsPolicy: commTerms.brandFulfilmentPolicy || '',
    accountManagerName: commTerms.accountManagerName || '',
    contactEmail: commTerms.contactEmail || '',
    contactPhone: commTerms.contactPhone || '',
    internalNotes: commTerms.internalNotes || '',
  };

  const [isBuyNewPartner, setIsBuyNewPartner] = useState(initialData.isBuyNewPartner);
  const [commissionPercent, setCommissionPercent] = useState(initialData.commissionPercent);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>(initialData.paymentTerms);
  const [fulfilmentReturnsPolicy, setFulfilmentReturnsPolicy] = useState(initialData.fulfilmentReturnsPolicy);
  const [accountManagerName, setAccountManagerName] = useState(initialData.accountManagerName);
  const [contactEmail, setContactEmail] = useState(initialData.contactEmail);
  const [contactPhone, setContactPhone] = useState(initialData.contactPhone);
  const [internalNotes, setInternalNotes] = useState(initialData.internalNotes);

  const fieldsLocked = !isSuperAdmin;

  const notifyChange = (fieldUpdates: any) => {
    onChange?.({
      commercialTerms: {
        suppliesFreshStockBuyNow: isBuyNewPartner,
        commissionRateBuyNow: commissionPercent,
        paymentTerms,
        brandFulfilmentPolicy: fulfilmentReturnsPolicy,
        accountManagerName,
        contactEmail,
        contactPhone,
        internalNotes,
        ...fieldUpdates
      }
    });
  };

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
            onClick={() => {
              if (fieldsLocked) return;
              const val = !isBuyNewPartner;
              setIsBuyNewPartner(val);
              notifyChange({ suppliesFreshStockBuyNow: val });
            }}
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
            onChange={(e) => {
              setCommissionPercent(e.target.value);
              notifyChange({ commissionRateBuyNow: e.target.value });
            }}
            disabled={fieldsLocked || !isBuyNewPartner}
          />
          <p className="form-hint">Overrides global Buy New commission for this designer only</p>
        </div>

        <div className="form-field">
          <label className="form-label">PAYMENT TERMS</label>
          <select
            className="form-select"
            value={paymentTerms}
            onChange={(e) => {
              const val = e.target.value as PaymentTerms;
              setPaymentTerms(val);
              notifyChange({ paymentTerms: val });
            }}
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
            onChange={(e) => {
              setFulfilmentReturnsPolicy(e.target.value);
              notifyChange({ brandFulfilmentPolicy: e.target.value });
            }}
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
            onChange={(e) => {
              setAccountManagerName(e.target.value);
              notifyChange({ accountManagerName: e.target.value });
            }}
            disabled={fieldsLocked}
          />
        </div>

        <div className="form-field">
          <label className="form-label">CONTACT EMAIL</label>
          <input
            className="form-input"
            placeholder="brand@email.com"
            value={contactEmail}
            onChange={(e) => {
              setContactEmail(e.target.value);
              notifyChange({ contactEmail: e.target.value });
            }}
            disabled={fieldsLocked}
          />
        </div>

        <div className="form-field">
          <label className="form-label">CONTACT PHONE</label>
          <input
            className="form-input"
            placeholder="+91 XXXXX XXXXX"
            value={contactPhone}
            onChange={(e) => {
              setContactPhone(e.target.value);
              notifyChange({ contactPhone: e.target.value });
            }}
            disabled={fieldsLocked}
          />
        </div>

        <div className="form-field form-field-full">
          <label className="form-label">INTERNAL NOTES (PARTNERSHIP TERMS, CONTACT HISTORY, SPECIAL ARRANGEMENTS)</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. agreed 28% commission Q1 2026, renewal in June..."
            value={internalNotes}
            onChange={(e) => {
              setInternalNotes(e.target.value);
              notifyChange({ internalNotes: e.target.value });
            }}
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