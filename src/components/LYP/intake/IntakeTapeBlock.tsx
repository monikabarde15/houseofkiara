// src/components/LYP/intake/IntakeTapeBlock.tsx

import React from 'react';
import { Measurements } from '../types/submission.types';
import './styles/IntakeTapeBlock.css';

interface IntakeTapeBlockProps {
  measurements: Measurements | null;
  onChange: (measurements: Measurements) => void;
}

export const IntakeTapeBlock: React.FC<IntakeTapeBlockProps> = ({
  measurements,
  onChange,
}) => {
  const handleChange = (field: keyof Measurements, value: string) => {
    const updated = { ...(measurements || {}), [field]: value };
    onChange(updated);
  };

  const handleNotesChange = (value: string) => {
    const updated = { ...(measurements || {}), notes: value };
    onChange(updated);
  };

  return (
    <div className="intake-tape-block">
      <div className="intake-tape-header">
        MEASUREMENTS — AS TOLD (INCHES)
      </div>

      <div className="intake-tape-grid">
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
          placeholder="Let-out margins, blouse fit — as they described"
        />
      </div>
    </div>
  );
};