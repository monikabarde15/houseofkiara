import React from 'react';
import './Checkbox.css';
import { CheckboxTickIcon } from '../icons/SiteSettingsIcons';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  hint?: string;
  tickedHint?: string;
  untickedHint?: string;
  className?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  hint,
  tickedHint,
  untickedHint,
  className = '',
  disabled = false
}) => {
  const activeHint = hint || (checked ? tickedHint : untickedHint);

  return (
    <div
      className={`hok-checkbox-container ${className}`.trim()}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      data-hint={activeHint}
      role="checkbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!disabled) onChange(!checked);
        }
      }}
    >
      <div className={`hok-checkbox-box ${checked ? 'is-checked' : ''}`}>
        {checked && <CheckboxTickIcon />}
      </div>
      {label && <span className="hok-checkbox-label">{label}</span>}
    </div>
  );
};
