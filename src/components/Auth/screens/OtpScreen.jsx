import React, { useState, useEffect, useRef } from 'react';
import BackLink from '../ui/BackLink';
import FormEyebrow from '../ui/FormEyebrow';
import FormHeading from '../ui/FormHeading';
import PrimaryButton from '../ui/PrimaryButton';
import '../../../styles/Auth/screens/OtpScreen.css';

const OtpScreen = ({ switchScreen, otpSource = 'register', userData = {} }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Get the phone number for display
  const phoneNumber = userData?.mobile || userData?.otpDestination;
const formattedPhone = phoneNumber ? (phoneNumber.startsWith('+91') ? phoneNumber : `+91 ${phoneNumber}`) : '';
  // Section 9.4 - Timer logic (30 seconds countdown)
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  // Section 9.1 - Back link logic (checks otpSource)
  const handleBack = () => {
    // Clear OTP timer
    setTimer(30);
    setCanResend(false);
    
    if (otpSource === 'register') {
      switchScreen('register');
    } else if (otpSource === 'signin') {
      switchScreen('signin');
    } else {
      switchScreen('signin');
    }
  };

  // Section 9.3 - Auto-advance on digit entry
  const handleInputChange = (index, value) => {
    // Strip non-numeric characters
    const cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = cleanedValue;
    setOtp(newOtp);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    // Remove error class from all boxes when typing
    const boxes = document.querySelectorAll('.hok-auth-otp-input');
    boxes.forEach(box => box.classList.remove('error'));
    
    // Auto-advance to next box
    if (cleanedValue && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    // Section 9.3 - Auto-submit when all 6 boxes are filled
    const allFilled = newOtp.every(digit => digit !== '');
    if (allFilled) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  // Section 9.3 - Backspace on empty box
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Section 9.3 - Paste support (paste into first box)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (pastedDigits.length === 6) {
      const newOtp = pastedDigits.split('');
      setOtp(newOtp);
      
      // Auto-fill all boxes
      newOtp.forEach((digit, idx) => {
        if (inputRefs.current[idx]) {
          inputRefs.current[idx].value = digit;
        }
      });
      
      // Section 9.3 - Auto-trigger verification
      handleVerifyOtp(pastedDigits);
    }
  };

  // Section 9.5 - OTP Validation
  const handleVerifyOtp = async (otpValue = null) => {
    const otpToVerify = otpValue || otp.join('');
    
    // Check if all boxes are filled
    if (otpToVerify.length !== 6) {
      return;
    }
    
    // Remove error class at start of verification attempt
    const boxes = document.querySelectorAll('.hok-auth-otp-input');
    boxes.forEach(box => box.classList.remove('error'));
    
    setIsLoading(true);
    
    // Section 9.5 - Simulate API verification
    setTimeout(() => {
      // Section 9.5 - Correct OTP (prototype): "123456"
      if (otpToVerify === '123456') {
        // Clear timer interval
        setCanResend(true);
        
        // Navigate to Success Screen
        switchScreen('success', {
          userData: {
            ...userData,
            flow: otpSource === 'register' ? 'register' : 'otp-signin'
          }
        });
      } else {
        // Wrong OTP - add error state to all 6 boxes
        boxes.forEach(box => box.classList.add('error'));
        setError('Incorrect OTP. Please try again.');
        setIsLoading(false);
      }
    }, 1200);
  };

  // Section 9.4 - Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    
    // Clear all OTP boxes
    setOtp(['', '', '', '', '', '']);
    setError('');
    
    // Clear input fields
    inputRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });
    
    // Reset timer
    setTimer(30);
    setCanResend(false);
    
    // Show "Sent!" temporarily
    const resendButton = document.querySelector('.hok-auth-resend-btn');
    if (resendButton) {
      const originalText = resendButton.textContent;
      resendButton.textContent = 'Sent!';
      setTimeout(() => {
        resendButton.textContent = originalText;
      }, 2000);
    }
    
    // Focus on first input
    inputRefs.current[0]?.focus();
  };

  // Section 9.1 - Method hint (dynamic based on otpSource)
  const getMethodHint = () => {
    if (otpSource === 'register') {
      return `We've sent a 6-digit OTP to ${formattedPhone} via SMS to verify your mobile number`;
    } else {
      return `We've sent a 6-digit OTP to ${formattedPhone} via SMS`;
    }
  };

  return (
    <div className="hok-auth-otp-screen">
      {/* Section 9.1 - Screen Header */}
      <BackLink onClick={handleBack} label=" BACK" />
      <FormEyebrow text="VERIFICATION" />
      <FormHeading text="Enter " italicText="OTP" />
      
      {/* Method hint - Section 9.1 */}
      <p className="hok-auth-otp-method-hint">
        {getMethodHint()}
      </p>

      {/* Section 9.2 - OTP Input Grid */}
      <div className="hok-auth-otp-grid">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength="1"
            className={`hok-auth-otp-input ${digit ? 'filled' : ''}`}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
          />
        ))}
      </div>

      {/* Section 9.5 - Field-level error */}
      {error && (
        <div className="hok-auth-otp-error">
          {error}
        </div>
      )}

      {/* Section 9.4 - OTP Footer Row */}
      <div className="hok-auth-otp-footer">
        <div className="hok-auth-otp-footer-left">
          {!canResend ? (
            <span className="hok-auth-timer">Resend in {timer}s</span>
          ) : (
            <button 
              className="hok-auth-resend-btn"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          )}
        </div>
        <div className="hok-auth-otp-footer-right">
          <span className="hok-auth-demo-hint">Code: 123456 (demo)</span>
        </div>
      </div>

      {/* Section 9.6 - Verify & Continue CTA */}
      <PrimaryButton 
        onClick={() => handleVerifyOtp()} 
        isLoading={isLoading}
      >
        VERIFY & CONTINUE
      </PrimaryButton>
    </div>
  );
};

export default OtpScreen;