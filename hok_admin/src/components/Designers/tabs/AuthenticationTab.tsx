import React, { useState } from 'react';
import './tabs.css';
import { Designer } from '../types/designer.types';

export type CounterfeitRiskTier = 'Low' | 'Medium' | 'High';

export interface AuthenticationData {
  riskTier: CounterfeitRiskTier;
  checklist: string;
  brandWebsite: string;
  brandInstagram: string;
}

interface AuthenticationTabProps {
  designer: Designer;
  authentication?: AuthenticationData;
  onSave?: (data: AuthenticationData) => void;
  onChange?: (updated: Partial<Designer>) => void;
}

const DEFAULT_AUTHENTICATION: AuthenticationData = {
  riskTier: 'Low',
  checklist: '',
  brandWebsite: '',
  brandInstagram: '',
};

const RISK_TIER_HINTS: Record<CounterfeitRiskTier, React.ReactNode> = {
  Low: 'Low = standard single-check approval flow.',
  Medium: 'Medium = second check recommended for high-value pieces before approval.',
  High: (
    <>
      High = mandatory second check by a different team member + purchase-proof request (via the More Info
      WhatsApp flow) before any piece under this label is approved.
    </>
  ),
};

const AuthenticationTab: React.FC<AuthenticationTabProps> = ({
  designer,
  authentication,
  onSave,
  onChange,
}) => {
  const initialAuth = authentication || {
    riskTier: (designer as any)?.counterfeitRiskTier || 'Low',
    checklist: (designer as any)?.authenticationChecklist || '',
    brandWebsite: (designer as any)?.websiteUrl || '',
    brandInstagram: (designer as any)?.instagramHandle || '',
  };

  const [riskTier, setRiskTier] = useState<CounterfeitRiskTier>(initialAuth.riskTier);
  const [checklist, setChecklist] = useState(initialAuth.checklist);
  const [brandWebsite, setBrandWebsite] = useState(initialAuth.brandWebsite);
  const [brandInstagram, setBrandInstagram] = useState(initialAuth.brandInstagram);

  const notifyChange = (fieldUpdates: any) => {
    onChange?.({
      counterfeitRiskTier: riskTier as any,
      authenticationChecklist: checklist,
      websiteUrl: brandWebsite,
      instagramHandle: brandInstagram,
      ...fieldUpdates
    });
  };

  const handleSave = () => {
    onSave?.({ riskTier, checklist, brandWebsite, brandInstagram });
  };

  return (
    <div className="tab-card">
      <div className="internal-eyebrow">INTERNAL — NEVER SHOWN PUBLICLY</div>

      <div className="form-field">
        <label className="form-label">COUNTERFEIT RISK TIER</label>
        <select
          className="form-select"
          value={riskTier}
          onChange={(e) => {
            const val = e.target.value as CounterfeitRiskTier;
            setRiskTier(val);
            notifyChange({ counterfeitRiskTier: val });
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <p className="form-hint">{RISK_TIER_HINTS[riskTier]}</p>
      </div>

      <div className="form-field">
        <label className="form-label">AUTHENTICATION CHECKLIST (BRAND-SPECIFIC VERIFICATION POINTS)</label>
        <textarea
          className="form-textarea"
          value={checklist}
          onChange={(e) => {
            setChecklist(e.target.value);
            notifyChange({ authenticationChecklist: e.target.value });
          }}
          rows={4}
        />
        <p className="form-hint">
          Surfaces automatically inside LYP Submissions review and product approval for every piece mapped to this
          designer — this is the working checklist behind the "hand-verified" promise on the storefront.
        </p>
      </div>

      <hr className="authentication-divider" />

      <div className="form-field">
        <label className="form-label">OFFICIAL BRAND REFERENCES (VERIFICATION SOURCES)</label>
      </div>

      <div className="tab-form-grid">
        <div className="form-field">
          <label className="form-label">BRAND WEBSITE</label>
          <input
            className="form-input"
            value={brandWebsite}
            onChange={(e) => {
              setBrandWebsite(e.target.value);
              notifyChange({ websiteUrl: e.target.value });
            }}
          />
          <p className="form-hint">Cross-check collections, price points and product codes when verifying pieces</p>
        </div>

        <div className="form-field">
          <label className="form-label">BRAND INSTAGRAM</label>
          <input
            className="form-input"
            value={brandInstagram}
            onChange={(e) => {
              setBrandInstagram(e.target.value);
              notifyChange({ instagramHandle: e.target.value });
            }}
          />
          <p className="form-hint">Official posts are the fastest visual reference for embroidery and label details</p>
        </div>
      </div>

      <div className="tab-form-footer">
        <button className="btn btn-primary-small" onClick={handleSave}>Save Authentication</button>
      </div>
    </div>
  );
};

export default AuthenticationTab;