/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · TOGGLE (Spec 4.5)
========================================================= */

import React from 'react';
import './PillToggle.css';

interface PillToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export const PillToggle: React.FC<PillToggleProps> = ({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`hok-toggle-wrapper ${className}`.trim()}>
      <div
        className="hok-toggle-row"
        onClick={() => !disabled && onChange(!checked)}
        style={{ opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <div className={`hok-toggle-track ${checked ? 'is-on' : ''}`}>
          <div className="hok-toggle-knob" />
        </div>
        <span className="hok-toggle-label">{label}</span>
      </div>

      {hint && <div className="hok-toggle-hint">{hint}</div>}
    </div>
  );
};
