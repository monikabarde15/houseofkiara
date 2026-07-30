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
}

const DEFAULT_AUTHENTICATION: AuthenticationData = {
  riskTier: 'High',
  checklist:
    'Hologram + serial tag stitched inside the waistband (post-2017 pieces). Woven label — check spelling and stitch density; fakes fray at the corners. Zardozi work is dense and even; sparse metalwork is a red flag. For post-2019 pieces, request the purchase invoice before approval.',
  brandWebsite: 'https://www.sabyasachi.com',
  brandInstagram: 'https://instagram.com/sabyasachiofficial',
};

// The screenshot only shows copy for the "High" tier. Low/Medium hints below
// are my best-guess extrapolation of that pattern, not confirmed design —
// swap in the real copy once it exists.
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
  authentication = DEFAULT_AUTHENTICATION,
  onSave,
}) => {
  const [riskTier, setRiskTier] = useState<CounterfeitRiskTier>(authentication.riskTier);
  const [checklist, setChecklist] = useState(authentication.checklist);
  const [brandWebsite, setBrandWebsite] = useState(authentication.brandWebsite);
  const [brandInstagram, setBrandInstagram] = useState(authentication.brandInstagram);

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
          onChange={(e) => setRiskTier(e.target.value as CounterfeitRiskTier)}
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
          onChange={(e) => setChecklist(e.target.value)}
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
            onChange={(e) => setBrandWebsite(e.target.value)}
          />
          <p className="form-hint">Cross-check collections, price points and product codes when verifying pieces</p>
        </div>

        <div className="form-field">
          <label className="form-label">BRAND INSTAGRAM</label>
          <input
            className="form-input"
            value={brandInstagram}
            onChange={(e) => setBrandInstagram(e.target.value)}
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