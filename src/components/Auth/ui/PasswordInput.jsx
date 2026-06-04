import React, { useState, useEffect } from 'react';
import FieldLabel from './FieldLabel';
import '../../../styles/Auth/ui/PasswordInput.css';

const PasswordInput = ({
  id,
  name,
  label,
  required = false,
  placeholder,
  value,
  onChange,
  onBlur,
  error = '',
  success = false,
  autoComplete = 'off'
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setHasError(!!error);
    setErrorMessage(error);
  }, [error]);

  const handleInput = (e) => {
    if (hasError) {
      setHasError(false);
      setErrorMessage('');
    }
    if (onChange) {
      onChange(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="hok-auth-field-container">
      {label && (
        <FieldLabel htmlFor={id} text={label} required={required} />
      )}
      <div className="hok-auth-password-wrapper">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleInput}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            hok-auth-text-input
            hok-auth-password-input
            ${hasError ? 'hok-auth-error' : ''}
            ${success ? 'hok-auth-success' : ''}
          `}
        />
        <button
          type="button"
          className="hok-auth-password-toggle"
          onClick={togglePasswordVisibility}
          tabIndex="-1"
        >
          {showPassword ? (
            // Eye closed SVG (crossed)
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6.712 6.712C4.124 8.5 2 12 2 12C2 12 5.5 19 12 19C13.772 19 15.362 18.472 16.712 17.712" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9.5 9.5C8.5 10.5 8 11.5 8 12C8 14.2 9.8 16 12 16C12.5 16 13.5 15.5 14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15.5 12C15.5 10.1 13.9 8.5 12 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M17.822 6.178C19.5 7.5 21 9.5 22 12C22 12 20 16 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            // Eye open SVG
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      {hasError && errorMessage && (
        <div className="hok-auth-field-error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;