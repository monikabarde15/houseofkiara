import React, { useState, useEffect } from 'react';
import FieldLabel from './FieldLabel';
import '../../../styles/Auth/ui/TextInput.css';

const TextInput = ({
  id,
  name,
  type = 'text',
  label,
  required = false,
  placeholder,
  value,
  onChange,
  onBlur,
  error = '',
  success = false,
  autoComplete = 'off',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update error state when prop changes
  useEffect(() => {
    setHasError(!!error);
    setErrorMessage(error);
  }, [error]);

  // Live error clearing - remove error on input
  const handleInput = (e) => {
    if (hasError) {
      setHasError(false);
      setErrorMessage('');
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`hok-auth-field-container ${className}`}>
      {label && (
        <FieldLabel htmlFor={id} text={label} required={required} />
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleInput}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          hok-auth-text-input
          ${hasError ? 'hok-auth-error' : ''}
          ${success ? 'hok-auth-success' : ''}
        `}
      />
      {hasError && errorMessage && (
        <div className="hok-auth-field-error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default TextInput;