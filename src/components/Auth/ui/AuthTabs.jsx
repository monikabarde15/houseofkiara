import React from 'react';
import '../../../styles/Auth/ui/AuthTabs.css';

const AuthTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="hok-auth-tab-row">
      <button
        className={`hok-auth-tab ${activeTab === 'email' ? 'active' : ''}`}
        onClick={() => onTabChange('email')}
      >
        EMAIL
      </button>
      <button
        className={`hok-auth-tab ${activeTab === 'mobile' ? 'active' : ''}`}
        onClick={() => onTabChange('mobile')}
      >
        MOBILE / OTP
      </button>
    </div>
  );
};

export default AuthTabs;