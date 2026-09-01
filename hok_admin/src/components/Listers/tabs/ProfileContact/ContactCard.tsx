// src/components/Listers/tabs/ProfileContact/ContactCard.tsx

import React, { useState } from 'react';
import { Lister } from '../../types/lister.types';
import { validatePIN, validateEmail } from '../../utils/validators';
import { CHANNELS } from '../../utils/constants';
import './styles/ContactCard.css';

interface ContactCardProps {
  lister: Lister | null;
  onUpdate: (updates: Partial<Lister>) => void;
  isCreateMode?: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  lister,
  onUpdate,
  isCreateMode = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    // Validate PIN
    if (field === 'pin' || field === 'address.pin') {
      const pinValue = typeof value === 'object' ? value.pin : value;
      if (pinValue && pinValue.length > 0 && !validatePIN(pinValue)) {
        setErrors(prev => ({ ...prev, pin: 'PIN code must be 6 digits.' }));
      }
    }

    // Validate email
    if (field === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
    }

    onUpdate({ [field]: value });
  };

  const handleAddressChange = (field: string, value: string) => {
    const currentAddress = lister?.address || { line1: '', line2: null, city: '', state: '', pin: '' };
    const updatedAddress = { ...currentAddress, [field]: value };
    
    // Validate PIN
    if (field === 'pin' && value && !validatePIN(value)) {
      setErrors(prev => ({ ...prev, pin: 'PIN code must be 6 digits.' }));
    } else {
      setErrors(prev => ({ ...prev, pin: '' }));
    }
    
    onUpdate({ address: updatedAddress });
  };

  const handleReferralChange = (value: string) => {
    onUpdate({ referral: value });
  };

  if (!lister && !isCreateMode) {
    return null;
  }

  const address = lister?.address || { line1: '', line2: null, city: '', state: '', pin: '' };

  return (
    <div className="contact-card card">
      <div className="card-hd">
        <span className="card-title">Contact Information</span>
      </div>
      <div className="card-bd">
        <div className="fld g2">
          <div className="fld-group">
            <label className="fld-label">Full Name</label>
            <input
              type="text"
              className="fld-input"
              value={lister?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
              required={isCreateMode}
            />
          </div>
          <div className="fld-group">
            <label className="fld-label">Email</label>
            <input
              type="email"
              className={`fld-input ${errors.email ? 'fld-error' : ''}`}
              value={lister?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
            />
            {errors.email && <div className="fld-error-text">{errors.email}</div>}
          </div>
        </div>

        <div className="fld g2">
          <div className="fld-group">
            <label className="fld-label">Phone (WhatsApp)</label>
            <input
              type="tel"
              className="fld-input"
              value={lister?.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              required={isCreateMode}
            />
          </div>
          <div className="fld-group">
            <label className="fld-label">Instagram Handle</label>
            <input
              type="text"
              className="fld-input"
              value={lister?.insta || ''}
              onChange={(e) => handleChange('insta', e.target.value)}
              placeholder="@username"
            />
          </div>
        </div>

        <div className="fld">
          <label className="fld-label">Address Line 1</label>
          <input
            type="text"
            className="fld-input"
            value={address.line1 || ''}
            onChange={(e) => handleAddressChange('line1', e.target.value)}
            placeholder="House / flat, building, street"
          />
        </div>

        <div className="fld">
          <label className="fld-label">Address Line 2 <span className="fld-label-optional">— optional</span></label>
          <input
            type="text"
            className="fld-input"
            value={address.line2 || ''}
            onChange={(e) => handleAddressChange('line2', e.target.value)}
            placeholder="Area, locality, landmark"
          />
        </div>

        <div className="fld g2">
          <div className="fld-group">
            <label className="fld-label">City</label>
            <input
              type="text"
              className="fld-input"
              value={address.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Enter city"
            />
          </div>
          <div className="fld-group">
            <label className="fld-label">State</label>
            <input
              type="text"
              className="fld-input"
              value={address.state || ''}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="e.g. Maharashtra"
            />
          </div>
        </div>

        <div className="fld g2">
          <div className="fld-group">
            <label className="fld-label">PIN Code</label>
            <input
              type="text"
              className={`fld-input fld-monospace ${errors.pin ? 'fld-error' : ''}`}
              value={address.pin || ''}
              onChange={(e) => handleAddressChange('pin', e.target.value)}
              placeholder="452001"
              maxLength={6}
            />
            {errors.pin && <div className="fld-error-text">{errors.pin}</div>}
            <div className="fld-hint">6 digits — checked on save</div>
          </div>
          <div className="fld-group">
            <label className="fld-label">Referral Source</label>
            <input
              type="text"
              className="fld-input"
              value={lister?.referral || ''}
              onChange={(e) => handleReferralChange(e.target.value)}
              placeholder="e.g. Word of mouth, Instagram"
            />
          </div>
        </div>
      </div>
      <div className="card-ft">
        <button
          type="button"
          className="btn"
          onClick={() => onUpdate({})}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ContactCard;