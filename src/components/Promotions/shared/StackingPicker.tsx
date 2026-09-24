/* ========================================
   Promotions Module - Stacking Picker
   Partner code picker with mates line
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.8
   ======================================== */

import React, { useState, useCallback } from 'react';
import './styles/StackingPicker.css';
import { Switch } from '../components/UI';
import { STACKING_LABELS } from '../utils/constants';

interface StackingPickerProps {
  stacked: boolean;
  partners: string[];
  availableCodes: { code: string; offer: string }[];
  onStackingChange: (stacked: boolean) => void;
  onPartnersChange: (partners: string[]) => void;
  platformStacking: 'single' | 'stackable';
  disabled?: boolean;
}

export const StackingPicker: React.FC<StackingPickerProps> = ({
  stacked,
  partners,
  availableCodes,
  onStackingChange,
  onPartnersChange,
  platformStacking,
  disabled = false,
}) => {
  const [selectedCode, setSelectedCode] = useState('');

  const addPartner = useCallback(() => {
    if (selectedCode && !partners.includes(selectedCode)) {
      onPartnersChange([...partners, selectedCode]);
      setSelectedCode('');
    }
  }, [selectedCode, partners, onPartnersChange]);

  const removePartner = useCallback((code: string) => {
    onPartnersChange(partners.filter(p => p !== code));
  }, [partners, onPartnersChange]);

  const available = availableCodes.filter(c => !partners.includes(c.code));

  const matesLine = partners.length === 0
    ? 'No partners picked yet — it stacks with nothing until you add a code below.'
    : `Stacks at checkout with ${partners.join(' · ')} and no other code.`;

  const linksMatter = platformStacking === 'stackable';
  const hint = linksMatter
    ? 'Links apply on Save — the partner code\'s page updates automatically, because a link is one fact shared by both codes.'
    : 'Platform policy is one code per order right now — links only matter once stacking is enabled in Checkout Rules on the Promotions page.';

  return (
    <div className="stacking-picker">
      <div className="stacking-picker__switch-row">
        <Switch
          checked={stacked}
          onChange={onStackingChange}
          disabled={disabled}
          label={stacked ? STACKING_LABELS.on : STACKING_LABELS.off}
        />
      </div>

      {stacked && (
        <div className="stacking-picker__partners">
          <div className="stacking-picker__add-row">
            <select
              className="stacking-picker__select"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              disabled={disabled}
            >
              <option value="">Select a code to add...</option>
              {available.map(code => (
                <option key={code.code} value={code.code}>
                  {code.code} — {code.offer}
                </option>
              ))}
            </select>
            <button
              className="stacking-picker__add-btn"
              onClick={addPartner}
              disabled={!selectedCode || disabled}
            >
              Add
            </button>
          </div>

          <div className="stacking-picker__chips">
            {partners.map(partner => (
              <span key={partner} className="stacking-picker__chip">
                <span className="stacking-picker__chip-link">{partner}</span>
                <button
                  className="stacking-picker__chip-remove"
                  onClick={() => removePartner(partner)}
                  disabled={disabled}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className={`stacking-picker__mates ${partners.length === 0 ? 'empty' : ''}`}>
            {matesLine}
          </div>

          <div className="stacking-picker__hint">{hint}</div>
        </div>
      )}
    </div>
  );
};