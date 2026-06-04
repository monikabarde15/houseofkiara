import React, { useState, useRef, useEffect } from 'react';
import LeftEditorialPanel from './LeftEditorialPanel';
import RightFormPanel from './RightFormPanel';
import AuthFooter from './AuthFooter';
import SignInScreen from '../screens/SignInScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OtpScreen from '../screens/OtpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SuccessScreen from '../screens/SuccessScreen';
import '../../../styles/Auth/layout/AuthLayout.css';

const AuthLayout = ({ isMobile }) => {
  const [activeScreen, setActiveScreen] = useState('signin');
  const [otpSource, setOtpSource] = useState(null);
  const [userData, setUserData] = useState({}); // Empty object - no default flow
  
  // Refs for all screens
  const signinRef = useRef(null);
  const registerRef = useRef(null);
  const otpRef = useRef(null);
  const forgotRef = useRef(null);
  const resetRef = useRef(null);
  const successRef = useRef(null);

  const switchScreen = (screen, additionalData = {}) => {
    // Remove .active from all .auth-screen elements
    const allScreens = document.querySelectorAll('.hok-auth-screen');
    allScreens.forEach(screenEl => {
      screenEl.classList.remove('active');
    });
    
    // Add .active to target screen
    const targetScreen = document.getElementById(`screen-${screen}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }
    
    // Update state
    setActiveScreen(screen);
    if (additionalData.otpSource) {
      setOtpSource(additionalData.otpSource);
    }
    if (additionalData.userData) {
      setUserData(additionalData.userData);
    }
    
    clearAllErrors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const clearAllErrors = () => {
    const errorInputs = document.querySelectorAll('.hok-auth-error');
    errorInputs.forEach(input => {
      input.classList.remove('hok-auth-error');
    });
    
    const errorWraps = document.querySelectorAll('.hok-auth-phone-error');
    errorWraps.forEach(wrap => {
      wrap.classList.remove('hok-auth-phone-error');
    });
    
    const errorMessages = document.querySelectorAll('.hok-auth-field-error-message');
    errorMessages.forEach(msg => {
      msg.style.display = 'none';
    });
    
    const alerts = document.querySelectorAll('.hok-auth-form-alert');
    alerts.forEach(alert => {
      alert.classList.remove('show');
    });
  };
  
  useEffect(() => {
    const defaultScreen = document.getElementById('screen-signin');
    if (defaultScreen) {
      defaultScreen.classList.add('active');
    }
  }, []);

  return (
    <>
      <div className="hok-auth-layout">
        {!isMobile && <LeftEditorialPanel />}
        <RightFormPanel>
          <div 
            id="screen-signin" 
            ref={signinRef}
            className="hok-auth-screen"
          >
            <SignInScreen switchScreen={switchScreen} />
          </div>
          
          <div 
            id="screen-register" 
            ref={registerRef}
            className="hok-auth-screen"
          >
            <RegisterScreen switchScreen={switchScreen} />
          </div>
          
          <div 
            id="screen-otp" 
            ref={otpRef}
            className="hok-auth-screen"
          >
            <OtpScreen 
              switchScreen={switchScreen} 
              otpSource={otpSource}
              userData={userData}
            />
          </div>
          
          <div 
            id="screen-forgot" 
            ref={forgotRef}
            className="hok-auth-screen"
          >
            <ForgotPasswordScreen switchScreen={switchScreen} />
          </div>
          
          <div 
            id="screen-reset" 
            ref={resetRef}
            className="hok-auth-screen"
          >
            <ResetPasswordScreen switchScreen={switchScreen} />
          </div>
          
          <div 
            id="screen-success" 
            ref={successRef}
            className="hok-auth-screen"
          >
            {/* Only render SuccessScreen when we have valid navigation data */}
            {userData.flow ? (
              <SuccessScreen switchScreen={switchScreen} userData={userData} />
            ) : (
              <div className="hok-auth-placeholder" />
            )}
          </div>
        </RightFormPanel>
      </div>
      <AuthFooter />
    </>
  );
};

export default AuthLayout;