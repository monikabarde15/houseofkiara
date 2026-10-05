/**
 * House of Kaira - Cookie Banner Toggle Switch
 * Section 6.3 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

import React from 'react';

const CookieSwitch = ({
  checked = false,
  onChange,
  disabled = false,
  label = '',
  id
}) => {
  const handleToggle = (e) => {
    e.preventDefault();
    if (disabled) return;
    if (onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (onChange) {
        onChange(!checked);
      }
    }
  };

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`cb-switch-track cb-focusable ${checked ? 'cb-switch-on' : 'cb-switch-off'}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      <span className={`cb-switch-knob ${checked ? 'cb-knob-on' : 'cb-knob-off'}`} aria-hidden="true" />
    </button>
  );
};

export default React.memo(CookieSwitch);
