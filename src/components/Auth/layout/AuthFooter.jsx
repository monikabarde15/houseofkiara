import React from 'react';
import '../../../styles/Auth/layout/AuthFooter.css';

const AuthFooter = () => {
  const handlePolicyClick = (policy) => {
    // Developer to implement actual navigation to policy pages
    console.log(`Navigate to ${policy} page`);
  };

  return (
    <footer className="hok-auth-footer">
      <div className="hok-auth-footer-content">
        {/* Left side - Policy Links */}
        <div className="hok-auth-footer-links">
          <button 
            className="hok-auth-footer-link"
            onClick={() => handlePolicyClick('TERMS & CONDITIONS')}
          >
            TERMS & CONDITIONS
          </button>
          <button 
            className="hok-auth-footer-link"
            onClick={() => handlePolicyClick('PRIVACY POLICY')}
          >
            PRIVACY POLICY
          </button>
          <button 
            className="hok-auth-footer-link"
            onClick={() => handlePolicyClick('REFUND & CANCELLATION')}
          >
            REFUND & CANCELLATION
          </button>
          <button 
            className="hok-auth-footer-link"
            onClick={() => handlePolicyClick('COOKIE POLICY')}
          >
            COOKIE POLICY
          </button>
        </div>

        {/* Right side - Copyright */}
        <div className="hok-auth-footer-copyright">
          © 2025 House of Kaira. All rights reserved. Indore, India.
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;