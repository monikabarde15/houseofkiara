import React from 'react';
import PrimaryButton from '../ui/PrimaryButton';
import '../../../styles/Auth/screens/SuccessScreen.css';

const SuccessScreen = ({ switchScreen, userData = {} }) => {
  // userData.flow should always be valid when this renders
  const getContent = () => {
    const flow = userData.flow;
    
    switch(flow) {
      case 'signin':
        return {
          eyebrow: 'WELCOME BACK',
          heading: 'Good to see you, ',
          italicText: userData.name || 'Priya',
          subText: "You're signed in. Redirecting you to your House of Kaira account",
          ctaText: 'CONTINUE TO MY ACCOUNT',
          showEmailNote: false
        };
      case 'register':
        return {
          eyebrow: 'ACCOUNT CREATED',
          heading: 'Welcome to ',
          italicText: 'House of Kaira',
          subText: 'Your mobile number is verified and your account is ready',
          ctaText: 'CONTINUE TO HOUSE OF KAIRA',
          showEmailNote: true
        };
      case 'otp-signin':
        return {
          eyebrow: 'SIGNED IN',
          heading: 'Good to see you ',
          italicText: 'again',
          subText: "You're signed in. Redirecting you to your House of Kaira account",
          ctaText: 'CONTINUE TO MY ACCOUNT',
          showEmailNote: false
        };
      case 'reset':
        return {
          eyebrow: 'PASSWORD UPDATED',
          heading: 'Password reset ',
          italicText: 'successfully',
          subText: 'Your password has been updated. You can now sign in with your new password.',
          ctaText: 'SIGN IN TO HOUSE OF KAIRA',
          showEmailNote: false
        };
      // No default - if flow is invalid, this shouldn't render
    }
  };

  const content = getContent();
  
  // If content is undefined, don't render (should not happen with proper navigation)
  if (!content) {
    return null;
  }

  const handleContinue = () => {
    window.location.href = '/';
  };

  const handleSignIn = () => {
    switchScreen('signin');
  };

  const handleButtonClick = () => {
    if (userData.flow === 'reset') {
      handleSignIn();
    } else {
      handleContinue();
    }
  };

  return (
    <div className="hok-auth-success-screen">
      <div className="hok-auth-success-icon">
        <svg 
          width="26" 
          height="26" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline 
            points="20 6 9 17 4 12" 
            stroke="var(--success, #2E7D52)" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="hok-auth-success-eyebrow">
        {content.eyebrow}
      </div>

      <h2 className="hok-auth-success-heading">
        {content.heading}
        <em>{content.italicText}</em>
      </h2>

      <p className="hok-auth-success-sub-text">
        {content.subText}
      </p>

      {content.showEmailNote && (
        <div className="hok-auth-email-verification-note">
          We've also sent a verification link to your email address. 
          Click it whenever you're ready — it won't affect your access to the platform.
        </div>
      )}

      <PrimaryButton onClick={handleButtonClick}>
        {content.ctaText}
      </PrimaryButton>
    </div>
  );
};

export default SuccessScreen;