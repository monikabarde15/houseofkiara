import React from 'react';
import './PillToggle.css';

interface PillToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export const PillToggle: React.FC<PillToggleProps> = ({
  checked,
  onChange,
  label,
  hint,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`hok-pill-toggle-container ${className}`.trim()}>
      <div
        className="hok-pill-toggle-row"
        onClick={() => {
          if (!disabled) onChange(!checked);
        }}
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
      >
        <div className={`hok-pill-toggle-track ${checked ? 'is-checked' : ''}`}>
          <div className="hok-pill-toggle-knob" />
        </div>
        <span className="hok-pill-toggle-label">{label}</span>
      </div>
      {hint && <div className="hok-pill-toggle-hint">{hint}</div>}
    </div>
  );
};
