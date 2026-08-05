// src/components/LYP/record/WorksheetGrid.tsx

import React from 'react';
import { Submission, Assessment, Mode, Grade, Size, VerificationMethod } from '../types/submission.types';
import { GRADES, MODES, SIZES, VERIFICATION_METHODS } from '../utils/constants';
import { inr } from '../utils/formatter';
import './styles/WorksheetGrid.css';

interface WorksheetGridProps {
  assessment: Assessment;
  submission: Submission;
  onChange: (updates: Partial<Assessment>) => void;
}

export const WorksheetGrid: React.FC<WorksheetGridProps> = ({
  assessment,
  submission,
  onChange,
}) => {
  const isFair = assessment.grade === 'Fair';
  const isRental = assessment.mode === 'Rental' || assessment.mode === 'Rental/Preloved';
  const isPreloved = assessment.mode === 'Preloved' || assessment.mode === 'Rental/Preloved';
  const isCustomSize = assessment.sizeLabel === 'Custom / Free Size';

  const isRentalDeviation = assessment.payoutPctRental !== 40;
  const isPrelovedDeviation = assessment.payoutPctResale !== 75;

  const handleModeChange = (mode: Mode) => {
    if (isFair && (mode === 'Preloved' || mode === 'Rental/Preloved')) {
      // Fair grade forces Rental mode
      onChange({ mode: 'Rental' });
      return;
    }
    onChange({ mode });
  };

  const handleGradeChange = (grade: Grade) => {
    if (grade === 'Fair' && (assessment.mode === 'Preloved' || assessment.mode === 'Rental/Preloved')) {
      // Fair grade forces Rental mode
      onChange({ grade, mode: 'Rental' });
    } else {
      onChange({ grade });
    }
  };

  return (
    <div className="ws-grid">
      {/* SKU */}
      <div className="ws-field ws-field-sku">
        <label className="fld-label">SKU</label>
        <div className="ws-sku-row">
          <input
            type="text"
            className="fld-input"
            value={assessment.sku || ''}
            onChange={(e) => onChange({ sku: e.target.value })}
            placeholder="HOK-XXX-001"
          />
          <button className="btn btn-sec btn-sm" title="Fills the next free number in the house pattern — HOK-designer initials-nnn, collision-checked across catalogue and queue">
            Suggest
          </button>
        </div>
        <div className="fhint">House pattern HOK-initials-nnn — Suggest writes the next free number. Once written, a number is reserved forever — withdrawn pieces keep theirs on record.</div>
      </div>

      {/* Storefront Name */}
      <div className="ws-field">
        <label className="fld-label">Storefront Name</label>
        <input
          type="text"
          className="fld-input"
          value={assessment.name || submission.piece || ''}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      {/* Mode */}
      <div className="ws-field">
        <label className="fld-label">Mode</label>
        <select
          className={`fld-input ${isFair ? 'ws-disabled' : ''}`}
          value={assessment.mode}
          onChange={(e) => handleModeChange(e.target.value as Mode)}
          disabled={isFair}
        >
          {MODES.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {isFair && (
          <div className="fhint fhint-terra">Fair grade is rental-only — Preloved stays off until the grade improves at authentication.</div>
        )}
      </div>

      {/* Our Grade */}
      <div className="ws-field">
        <label className="fld-label">Our Grade — first read</label>
        <div className="fhint fhint-echo">They chose “{submission.selfGrade || '— not self-graded'}”</div>
        <select
          className="fld-input"
          value={assessment.grade}
          onChange={(e) => handleGradeChange(e.target.value as Grade)}
        >
          {GRADES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        {isFair && (
          <div className="fhint fhint-terra">Fair grade is rental-only — Preloved stays off until the grade improves at authentication.</div>
        )}
      </div>

      {/* Size */}
      <div className="ws-field">
        <label className="fld-label">Size — as verified</label>
        <div className="fhint fhint-echo">Lister said “{submission.size || '—'}” — corrections from the call land here and flow to the Draft.</div>
        <select
          className="fld-input"
          value={assessment.sizeLabel}
          onChange={(e) => onChange({ sizeLabel: e.target.value as Size })}
        >
          {SIZES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Rental — Standard (4 days) */}
      <div className="ws-field">
        <label className="fld-label">Rental — Standard (4 days)</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.priceStd || ''}
          onChange={(e) => onChange({ priceStd: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
        <div className="fhint">Customer pays this + 18% GST</div>
      </div>

      {/* Rental — Extended (8 days) */}
      <div className="ws-field">
        <label className="fld-label">Rental — Extended (8 days)</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.priceExt || ''}
          onChange={(e) => onChange({ priceExt: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
      </div>

      {/* Per Extra Day */}
      <div className="ws-field">
        <label className="fld-label">Per Extra Day</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.perDay || ''}
          onChange={(e) => onChange({ perDay: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
      </div>

      {/* Deposit */}
      <div className="ws-field">
        <label className="fld-label">Deposit</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.deposit || ''}
          onChange={(e) => onChange({ deposit: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
        <div className="fhint">Collected & released on WhatsApp / UPI</div>
      </div>

      {/* Preloved — Listed Price */}
      <div className="ws-field">
        <label className="fld-label">Preloved — Listed Price</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.resalePrice || ''}
          onChange={(e) => onChange({ resalePrice: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
        <div className="fhint">Customer pays this + 5% GST</div>
      </div>

      {/* Min Acceptable Offer */}
      <div className="ws-field">
        <label className="fld-label">Min Acceptable Offer</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.minOffer || ''}
          onChange={(e) => onChange({ minOffer: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
        <div className="fhint">Make an Offer floor — Preloved only</div>
      </div>

      {/* Original Purchase Price — verified */}
      <div className="ws-field">
        <label className="fld-label">Original Purchase Price — verified</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.retailPrice || ''}
          onChange={(e) => onChange({ retailPrice: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
        <div className="fhint">Lister claimed {submission.originalPrice || '—'} · bought {submission.yearOfPurchase || '—'} — this becomes the storefront strike-through.</div>
      </div>

      {/* Verified via */}
      <div className="ws-field">
        <label className="fld-label">Verified via</label>
        <select
          className="fld-input"
          value={assessment.retailVerifiedVia || ''}
          onChange={(e) => onChange({ retailVerifiedVia: e.target.value as VerificationMethod || null })}
        >
          <option value="">— not yet verified</option>
          {VERIFICATION_METHODS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Lister % — Rental */}
      <div className={`ws-field ${isRentalDeviation ? 'ws-dev' : ''}`}>
        <label className="fld-label">Lister % — Rental</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.payoutPctRental || 40}
          onChange={(e) => onChange({ payoutPctRental: parseFloat(e.target.value) || 40 })}
          min="0"
          max="100"
        />
        {isRentalDeviation && (
          <div className="ws-devnote">Non-standard split — platform standard is 40</div>
        )}
      </div>

      {/* Lister % — Preloved */}
      <div className={`ws-field ${isPrelovedDeviation ? 'ws-dev' : ''}`}>
        <label className="fld-label">Lister % — Preloved</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.payoutPctResale || 75}
          onChange={(e) => onChange({ payoutPctResale: parseFloat(e.target.value) || 75 })}
          min="0"
          max="100"
        />
        {isPrelovedDeviation && (
          <div className="ws-devnote">Non-standard split — platform standard is 75</div>
        )}
      </div>

      {/* Min Days */}
      <div className="ws-field">
        <label className="fld-label">Min Days</label>
        <input
          type="number"
          className="fld-input"
          value={assessment.minDays || 4}
          onChange={(e) => onChange({ minDays: parseFloat(e.target.value) || 4 })}
          min="1"
        />
      </div>
    </div>
  );
};