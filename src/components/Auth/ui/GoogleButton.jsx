import React, { useState } from 'react';
import '../../../styles/Auth/ui/GoogleButton.css';

const GoogleButton = ({ onClick, marginTop = '10px' }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    
    if (onClick) {
      await onClick();
    }
    
    // Simulated delay for demo
    setTimeout(() => {
      setIsRedirecting(false);
    }, 1000);
  };

  return (
    <button 
      className="hok-auth-btn-google"
      onClick={handleClick}
      disabled={isRedirecting}
      style={{ marginTop }}
    >
      {/* Google G Icon */}
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.1 9.2C17.1 8.5 17 7.9 16.9 7.4H9V10.9H13.5C13.3 12 12.6 13 11.5 13.6V15.8H14.4C16.1 14.3 17.1 11.9 17.1 9.2Z" fill="#4285F4"/>
        <path d="M9 18C11.5 18 13.6 17.1 15.4 15.8L12.5 13.6C11.5 14.2 10.3 14.6 9 14.6C6.5 14.6 4.4 12.9 3.7 10.6H0.7V12.9C2.5 16.4 6.1 18 9 18Z" fill="#34A853"/>
        <path d="M3.7 10.6C3.5 9.9 3.4 9.2 3.4 8.5C3.4 7.8 3.5 7.1 3.7 6.4V4.1H0.7C0 5.5 0 7.2 0 8.5C0 9.8 0 11.5 0.7 12.9L3.7 10.6Z" fill="#FBBC05"/>
        <path d="M9 2.4C10.5 2.4 11.8 2.9 12.9 3.9L15.4 1.4C13.6 -0.1 11.5 -0.9 9 -0.9C6.1 -0.9 2.5 0.7 0.7 4.1L3.7 6.4C4.4 4.1 6.5 2.4 9 2.4Z" fill="#EA4335"/>
      </svg>
      <span>{isRedirecting ? 'Redirecting to Google...' : 'Continue with Google'}</span>
    </button>
  );
};

export default GoogleButton;