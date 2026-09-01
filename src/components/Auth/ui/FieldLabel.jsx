import React from 'react';
import '../../../styles/Auth/ui/FieldLabel.css';

const FieldLabel = ({ htmlFor, text, required = false }) => {
  return (
    <label htmlFor={htmlFor} className="hok-auth-field-label">
      {text}
      {required && <span className="hok-auth-required-asterisk"> *</span>}
    </label>
  );
};

export default FieldLabel;