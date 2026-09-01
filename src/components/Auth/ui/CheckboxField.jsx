import React from 'react';
import '../../../styles/Auth/ui/CheckboxField.css';

const CheckboxField = ({
  id,
  name,
  label,
  checked,
  onChange,
  required = false,
  error = ''
}) => {
  return (
    <div className="hok-auth-checkbox-container">
      <div className="hok-auth-checkbox-wrapper">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="hok-auth-checkbox"
          required={required}
        />
        <label htmlFor={id} className="hok-auth-checkbox-label">
          {label}
        </label>
      </div>
      {error && (
        <div className="hok-auth-checkbox-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default CheckboxField;