// components/Toggle.tsx
import React from 'react';
import './styles/Toggle.css';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  locked?: boolean;
  lockedLabel?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  locked = false,
  lockedLabel = '- always on',
  className = '',
}) => {
  const handleClick = () => {
    if (!locked) {
      onChange(!checked);
    }
  };

  return (
    <div className={`msg-toggle-row ${className}`}>
      <div 
        className={`msg-toggle ${locked ? 'msg-toggle--locked' : ''}`}
        onClick={handleClick}
        role="button"
        tabIndex={locked ? -1 : 0}
      >
        <div className={`msg-toggle-track ${checked ? 'msg-toggle-track--on' : ''}`}>
          <div className={`msg-toggle-knob ${checked ? 'msg-toggle-knob--on' : ''}`} />
        </div>
      </div>
      <span className="msg-toggle-label">
        {label}
        {locked && <span className="msg-toggle-locked-label"> {lockedLabel}</span>}
      </span>
    </div>
  );
};