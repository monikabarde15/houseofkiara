import React, { useState } from 'react';
import '../../../styles/Auth/ui/PrimaryButton.css';

const PrimaryButton = ({ 
  children, 
  onClick, 
  isLoading = false, 
  disabled = false,
  type = 'button'
}) => {
  const [isLoadingState, setIsLoadingState] = useState(false);

  const handleClick = async (e) => {
    if (isLoading || isLoadingState || disabled) return;
    
    if (onClick) {
      setIsLoadingState(true);
      try {
        await onClick(e);
      } finally {
        setIsLoadingState(false);
      }
    }
  };

  const loading = isLoading || isLoadingState;

  return (
    <button
      type={type}
      className={`hok-auth-btn-primary ${loading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={loading || disabled}
    >
      <span className="hok-auth-btn-text">{children}</span>
      {loading && <span className="hok-auth-btn-spinner"></span>}
    </button>
  );
};

export default PrimaryButton;