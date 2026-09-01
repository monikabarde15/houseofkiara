// src/components/LYP/intake/NewListerBlock.tsx

import React, { useState } from 'react';
import { useListers } from '../../Listers/hooks/useListers';
import { validatePhone, validateEmail } from '../utils/validators';
import './styles/NewListerBlock.css';

interface NewListerBlockProps {
  onSuccess: (listerId: string) => void;
  onCancel: () => void;
}

export const NewListerBlock: React.FC<NewListerBlockProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createLister } = useListers();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full Name is required.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'WhatsApp Number is required.';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const lister = await createLister({
        name,
        phone,
        city,
        email: email || null,
        status: 'Pending Review',
      });
      onSuccess(lister.id);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create lister' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-lister-block">
      <div className="new-lister-header">NEW LISTER — RIGHT HERE, ONE MOTION</div>

      <div className="new-lister-grid g2">
        <div className="fld">
          <label className="fld-label">Full Name *</label>
          <input
            type="text"
            className={`fld-input ${errors.name ? 'fld-error' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
          />
          {errors.name && <div className="fld-error-text">{errors.name}</div>}
        </div>

        <div className="fld">
          <label className="fld-label">WhatsApp Number *</label>
          <input
            type="tel"
            className={`fld-input ${errors.phone ? 'fld-error' : ''}`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91..."
          />
          {errors.phone && <div className="fld-error-text">{errors.phone}</div>}
        </div>

        <div className="fld">
          <label className="fld-label">City</label>
          <input
            type="text"
            className="fld-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Drives the pickup chips"
          />
        </div>

        <div className="fld">
          <label className="fld-label">Email</label>
          <input
            type="email"
            className={`fld-input ${errors.email ? 'fld-error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
          {errors.email && <div className="fld-error-text">{errors.email}</div>}
        </div>
      </div>

      <div className="new-lister-hint">
        Saves as Pending Review — this piece carries their application. Same number as an existing lister? The piece attaches to them instead. Bank, address & ID live on the full lister form <span className="qlnk">→</span>
      </div>

      {errors.submit && (
        <div className="new-lister-error">{errors.submit}</div>
      )}

      <div className="new-lister-actions">
        <button 
          className="btn btn-gold btn-sm" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Lister & Continue'}
        </button>
        <button 
          className="btn btn-sec btn-sm" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};