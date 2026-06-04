import React, { useState } from 'react';
import FormEyebrow from '../ui/FormEyebrow';
import FormHeading from '../ui/FormHeading';
import FormSubText from '../ui/FormSubText';
import AuthTabs from '../ui/AuthTabs';
import EmailSignInForm from '../forms/EmailSignInForm';
import MobileSignInForm from '../forms/MobileSignInForm';
import OrDivider from '../ui/OrDivider';
import GoogleButton from '../ui/GoogleButton';
import FormToggleNote from '../ui/FormToggleNote';
import '../../../styles/Auth/screens/SignInScreen.css';

const SignInScreen = ({ switchScreen }) => {
  const [activeTab, setActiveTab] = useState('email');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEmailSignInSuccess = (userData) => {
    switchScreen('success', {
      userData: {
        ...userData,
        flow: 'signin'
      }
    });
  };

  const handleSendOtp = (mobile) => {
    switchScreen('otp', {
      otpSource: 'signin',
      userData: { mobile }
    });
  };

  return (
    <div className="hok-auth-signin-screen">
      <FormEyebrow text="WELCOME BACK" />
      <FormHeading text="Sign " italicText="in" />
      <FormSubText>
        New to House of Kaira?{' '}
        <span 
          className="hok-auth-link" 
          onClick={() => switchScreen('register')}
        >
          Create an account
        </span>
      </FormSubText>

      <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'email' && (
        <EmailSignInForm
          switchScreen={switchScreen}
          onSuccess={handleEmailSignInSuccess}
        />
      )}

      {activeTab === 'mobile' && (
        <MobileSignInForm
          switchScreen={switchScreen}
          onSendOtp={handleSendOtp}
        />
      )}

      <OrDivider />
      <GoogleButton onClick={() => console.log('Google OAuth clicked')} marginTop="10px" />

      <FormToggleNote>
        Don't have an account?{' '}
        <span 
          className="hok-auth-link" 
          onClick={() => switchScreen('register')}
        >
          Create one — it's free
        </span>
      </FormToggleNote>
    </div>
  );
};

export default SignInScreen;