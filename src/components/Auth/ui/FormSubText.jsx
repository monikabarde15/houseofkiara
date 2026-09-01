import React from 'react';
import '../../../styles/Auth/ui/FormSubText.css';

const FormSubText = ({ children }) => {
  return (
    <p className="hok-auth-form-sub-text">
      {children}
    </p>
  );
};

export default FormSubText;