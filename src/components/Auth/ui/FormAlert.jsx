import React, { useEffect, useRef } from 'react';
import '../../../styles/Auth/ui/FormAlert.css';

const FormAlert = ({ type = 'error', message, show = false }) => {
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef.current) {
      if (show && message) {
        alertRef.current.classList.add('show');
      } else {
        alertRef.current.classList.remove('show');
      }
    }
  }, [show, message]);

  if (!message) return null;

  return (
    <div 
      ref={alertRef}
      className={`hok-auth-form-alert hok-auth-alert-${type}`}
    >
      {message}
    </div>
  );
};

export default FormAlert;