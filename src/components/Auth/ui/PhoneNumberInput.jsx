import React, { useState, useEffect } from 'react';
import FieldLabel from './FieldLabel';
import '../../../styles/Auth/ui/PhoneNumberInput.css';

const PhoneNumberInput = ({
  id,
  name,
  label,
  required = false,
  placeholder,
  value,
  onChange,
  onBlur,
  error = '',
  success = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    setHasError(!!error);
    setErrorMessage(error);
  }, [error]);

  const handleInput = (e) => {
    // Strip all non-numeric characters
    const rawValue = e.target.value.replace(/\D/g, '');
    const truncatedValue = rawValue.slice(0, 10); // Max 10 digits
    setDisplayValue(truncatedValue);
    
    if (hasError) {
      setHasError(false);
      setErrorMessage('');
    }
    
    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: truncatedValue } });
    }
  };

  return (
    <div className="hok-auth-field-container">
      {label && (
        <FieldLabel htmlFor={id} text={label} required={required} />
      )}
      <div className={`
        hok-auth-phone-wrapper
        ${hasError ? 'hok-auth-phone-error' : ''}
        ${success ? 'hok-auth-phone-success' : ''}
      `}>
        <div className="hok-auth-phone-prefix">
          {/* Indian Flag SVG */}
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="16" height="11" fill="white"/>
            <rect y="0" width="16" height="3.67" fill="#FF9933"/>
            <rect y="7.33" width="16" height="3.67" fill="#138808"/>
            <circle cx="8" cy="5.5" r="2.2" stroke="#000080" strokeWidth="0.8" fill="none"/>
            <path d="M8 3.3 L8.5 4.5 L9.5 4.2 L8.8 5.3 L9.5 6.5 L8 6 L6.5 6.5 L7.2 5.3 L6.5 4.2 L7.5 4.5 L8 3.3Z" fill="#000080"/>
          </svg>
          <span className="hok-auth-phone-country-code">+91</span>
        </div>
        <input
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInput}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength="10"
          className="hok-auth-phone-input"
        />
      </div>
      {hasError && errorMessage && (
        <div className="hok-auth-field-error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInput;