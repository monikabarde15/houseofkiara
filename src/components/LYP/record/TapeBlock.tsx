// src/components/LYP/record/TapeBlock.tsx

import React from 'react';
import { Measurements } from '../types/submission.types';
import './styles/TapeBlock.css';

interface TapeBlockProps {
  measurements: Measurements | null;
  onChange: (measurements: Measurements) => void;
}

export const TapeBlock: React.FC<TapeBlockProps> = ({ measurements, onChange }) => {
  const handleChange = (field: keyof Measurements, value: string) => {
    const updated = { ...(measurements || {}), [field]: value };
    onChange(updated);
  };

  const handleNotesChange = (value: string) => {
    const updated = { ...(measurements || {}), notes: value };
    onChange(updated);
  };

  const hasValues = measurements && Object.keys(measurements).some(
    k => k !== 'notes' && measurements[k as keyof Measurements]
  );

  return (
    <div className="tape-block">
      <div className="tape-header">
        <span className="tape-header-label">MEASUREMENTS — AS FITTED (INCHES)</span>
        {hasValues && (
          <span className="tape-header-echo">— they said {formatMeasurementEcho(measurements)}</span>
        )}
      </div>

      <div className="tape-grid">
        <div className="tape-field">
          <label className="fld-label">Bust</label>
          <input
            type="text"
            className="fld-input"
            value={measurements?.bust || ''}
            onChange={(e) => handleChange('bust', e.target.value)}
            placeholder="e.g. 36"
          />
        </div>

        <div className="tape-field">
          <label className="fld-label">Waist</label>
          <input
            type="text"
            className="fld-input"
            value={measurements?.waist || ''}
            onChange={(e) => handleChange('waist', e.target.value)}
            placeholder="e.g. 30"
          />
        </div>

        <div className="tape-field">
          <label className="fld-label">Hips</label>
          <input
            type="text"
            className="fld-input"
            value={measurements?.hips || ''}
            onChange={(e) => handleChange('hips', e.target.value)}
            placeholder="e.g. 40"
          />
        </div>

        <div className="tape-field">
          <label className="fld-label">Shoulder</label>
          <input
            type="text"
            className="fld-input"
            value={measurements?.shoulder || ''}
            onChange={(e) => handleChange('shoulder', e.target.value)}
            placeholder="e.g. 14.5"
          />
        </div>

        <div className="tape-field">
          <label className="fld-label">Length</label>
          <input
            type="text"
            className="fld-input"
            value={measurements?.length || ''}
            onChange={(e) => handleChange('length', e.target.value)}
            placeholder="e.g. 42"
          />
        </div>

        <div className="tape-field">
          <label className="fld-label">Sleeve</label>
          <input
            type="text"
            className="fld-input"
            value={measurements?.sleeve || ''}
            onChange={(e) => handleChange('sleeve', e.target.value)}
            placeholder="e.g. 18"
          />
        </div>
      </div>

      <div className="tape-field-full">
        <label className="fld-label">Fit Notes</label>
        <input
          type="text"
          className="fld-input"
          value={measurements?.notes || ''}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Let-out margins, blouse fit, alteration room — storefront-worthy honesty"
        />
      </div>
    </div>
  );
};

// Helper function to format measurement echo
const formatMeasurementEcho = (measurements: Measurements | null): string => {
  if (!measurements) return '';
  const parts: string[] = [];
  const keys: (keyof Measurements)[] = ['bust', 'waist', 'hips', 'shoulder', 'length', 'sleeve'];
  for (const key of keys) {
    if (measurements[key]) {
      parts.push(`${(key as string).charAt(0).toUpperCase()} ${measurements[key]}"`);
    }
  }
  return parts.join(' · ');
};