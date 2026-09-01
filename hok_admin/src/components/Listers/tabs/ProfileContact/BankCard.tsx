// src/components/Listers/tabs/ProfileContact/BankCard.tsx

import React, { useState } from 'react';
import { Lister } from '../../types/lister.types';
import { validatePAN, validateGSTIN } from '../../utils/validators';
import './styles/BankCard.css';

interface BankCardProps {
  lister: Lister | null;
  onUpdate: (updates: Partial<Lister>) => void;
  isCreateMode?: boolean;
}

const EMPTY_BANK = {
  holder: '',
  accct: '',
  ifsc: '',
  branch: '',
  upi: '',
  verified: false,
};

export const BankCard: React.FC<BankCardProps> = ({
  lister,
  onUpdate,
  isCreateMode = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGSTIN, setShowGSTIN] = useState(lister?.gstReg || false);

  if (!lister && !isCreateMode) return null;

  const bank = lister?.bank || EMPTY_BANK;

  const updateBank = (field: string, value: any) => {
    onUpdate({
      bank: {
        ...bank,
        [field]: value,
      },
    });
  };

  const handleToggle = (field: string, value: boolean) => {
    switch (field) {
      case 'bank.verified':
        updateBank('verified', value);
        break;

      case 'panVerified':
        onUpdate({ panVerified: value });
        break;

      case 'gstReg':
        setShowGSTIN(value);

        if (!value) {
          onUpdate({
            gstReg: false,
            gstin: null,
          });
        } else {
          onUpdate({
            gstReg: true,
          });
        }
        break;

      default:
        onUpdate({
          [field]: value,
        });
    }
  };

  const handlePAN = (value: string) => {
    const pan = value.toUpperCase();

    if (pan && !validatePAN(pan)) {
      setErrors((p) => ({
        ...p,
        pan: 'Invalid PAN format.',
      }));
    } else {
      setErrors((p) => ({
        ...p,
        pan: '',
      }));
    }

    onUpdate({ pan });
  };

  const handleGST = (value: string) => {
    const gstin = value.toUpperCase();

    if (gstin && !validateGSTIN(gstin)) {
      setErrors((p) => ({
        ...p,
        gstin: 'Invalid GSTIN.',
      }));
    } else {
      setErrors((p) => ({
        ...p,
        gstin: '',
      }));
    }

    onUpdate({
      gstin,
    });
  };

  return (
    <div className="bank-card card">

      <div className="card-hd">
        <span className="card-title">
          Bank, UPI & Tax
        </span>
      </div>

      <div className="card-bd">

        {/* Account Holder */}

        <div className="fld">
          <label className="fld-label">
            Account Holder Name
          </label>

          <input
            type="text"
            className="fld-input"
            placeholder="Enter account holder name"
            value={bank.holder || ''}
            onChange={(e) =>
              updateBank('holder', e.target.value)
            }
          />
        </div>

        {/* Row */}

        <div className="fld g2">

          <div className="fld-group">
            <label className="fld-label">
              Account Number
            </label>

            <input
              type="text"
              className="fld-input fld-monospace"
              placeholder="Enter account number"
              value={bank.accct || ''}
              onChange={(e) =>
                updateBank('accct', e.target.value)
              }
            />
          </div>

          <div className="fld-group">
            <label className="fld-label">
              IFSC
            </label>

            <input
              type="text"
              className="fld-input fld-monospace"
              placeholder="HDFC0001234"
              value={bank.ifsc || ''}
              onChange={(e) =>
                updateBank('ifsc', e.target.value)
              }
            />
          </div>

        </div>

        {/* Branch + UPI */}

        <div className="fld g2">

          <div className="fld-group">

            <label className="fld-label">
              Bank & Branch
            </label>

            <input
              type="text"
              className="fld-input"
              placeholder="Enter bank & branch"
              value={bank.branch || ''}
              onChange={(e) =>
                updateBank('branch', e.target.value)
              }
            />

          </div>

          <div className="fld-group">

            <label className="fld-label">
              UPI ID
            </label>

            <input
              type="text"
              className="fld-input fld-monospace"
              placeholder="name@bank"
              value={bank.upi || ''}
              onChange={(e) =>
                updateBank('upi', e.target.value)
              }
            />

            <div className="fld-hint">
              Payouts run UPI-first — keep this current.
            </div>

          </div>

        </div>

        {/* Verified + PAN */}

        <div className="fld g2">

          <div className="fld-group">

            <label className="fld-label">
              Bank Account Verified
            </label>

            <div className="fld-toggle">

              <button
                type="button"
                className={`tgl-track ${
                  bank.verified ? 'tgl-on' : ''
                }`}
                onClick={() =>
                  handleToggle(
                    'bank.verified',
                    !bank.verified
                  )
                }
              >
                <span className="tgl-knob" />
              </button>

              <span className="tgl-label">
                {bank.verified
                  ? 'Verified'
                  : 'Unverified'}
              </span>

            </div>

            <div className="fld-hint">
              Unverified bank = every payout for this
              lister holds at the payment step.
            </div>

          </div>

                    {/* PAN */}

          <div className="fld-group">

            <label className="fld-label">
              PAN{" "}
              <span className="fld-label-required">
                — required for TDS u/s 194-O
              </span>
            </label>

            <input
              type="text"
              maxLength={10}
              className={`fld-input fld-monospace ${
                errors.pan ? "fld-error" : ""
              }`}
              placeholder="ABCDE1234F"
              value={lister?.pan || ""}
              onChange={(e) => handlePAN(e.target.value)}
            />

            {errors.pan && (
              <div className="fld-error-text">
                {errors.pan}
              </div>
            )}

            <div className="fld-toggle">

              <button
                type="button"
                className={`tgl-track ${
                  lister?.panVerified ? "tgl-on" : ""
                }`}
                onClick={() =>
                  handleToggle(
                    "panVerified",
                    !lister?.panVerified
                  )
                }
              >
                <span className="tgl-knob" />
              </button>

              <span className="tgl-label">
                {lister?.panVerified
                  ? "PAN verified"
                  : "PAN unverified"}
              </span>

            </div>

          </div>

        </div>

        {/* GST */}

        <div className="fld">

          <div className="fld-toggle-group">

            <label className="fld-label">
              GST Registered
            </label>

            <div className="fld-toggle">

              <button
                type="button"
                className={`tgl-track ${
                  lister?.gstReg ? "tgl-on" : ""
                }`}
                onClick={() =>
                  handleToggle(
                    "gstReg",
                    !lister?.gstReg
                  )
                }
              >
                <span className="tgl-knob" />
              </button>

              <span className="tgl-label">
                {lister?.gstReg
                  ? "Registered"
                  : "Not registered"}
              </span>

            </div>

          </div>

        </div>

        {/* GSTIN */}

        {showGSTIN && (

          <div className="fld">

            <label className="fld-label">
              GSTIN
            </label>

            <input
              type="text"
              className={`fld-input fld-monospace ${
                errors.gstin ? "fld-error" : ""
              }`}
              placeholder="22ABCDE1234F1Z5"
              value={lister?.gstin || ""}
              onChange={(e) =>
                handleGST(e.target.value)
              }
            />

            {errors.gstin && (
              <div className="fld-error-text">
                {errors.gstin}
              </div>
            )}

            <div className="fld-hint">
              Registered listers receive commission
              invoices against this GSTIN.
            </div>

          </div>

        )}

      </div>

      <div className="card-ft">

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={() => onUpdate({})}
        >
          Save
        </button>

      </div>

    </div>
  );
};

export default BankCard;