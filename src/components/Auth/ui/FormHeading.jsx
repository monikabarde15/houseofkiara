import React from 'react';
import '../../../styles/Auth/ui/FormHeading.css';

const FormHeading = ({ text, italicText }) => {
  return (
    <h2 className="hok-auth-form-heading">
      {text} {italicText && <em>{italicText}</em>}
    </h2>
  );
};

export default FormHeading;