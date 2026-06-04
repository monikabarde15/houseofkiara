import React, { useState } from 'react';
import BackLink from '../ui/BackLink';
import FormEyebrow from '../ui/FormEyebrow';
import FormHeading from '../ui/FormHeading';
import FormSubText from '../ui/FormSubText';
import TextInput from '../ui/TextInput';
import PrimaryButton from '../ui/PrimaryButton';
import FormAlert from '../ui/FormAlert';
import '../../../styles/Auth/screens/ForgotPasswordScreen.css';

const ForgotPasswordScreen = ({ switchScreen }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);

  // Validate email format
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Please enter a valid email address.');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Live error clearing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
      setErrorMessage('');
    }
  };

  // Handle send reset link
  const handleSendResetLink = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate email
    const isValid = validateEmail();
    if (!isValid) {
      return;
    }

    setIsLoading(true);

    // Simulate API call - Section 10
    setTimeout(() => {
      // Success case
      setSuccessMessage(`A password reset link has been sent to ${email}. Please check your inbox.`);
      setIsLinkSent(true);
      setIsLoading(false);
      
      // Note: For production, handle server errors here
      // setErrorMessage('Server error message');
    }, 1400);
  };

  // Back link navigates to Sign In (Screen 1)
  const handleBack = () => {
    switchScreen('signin');
  };

  return (
    <div className="hok-auth-forgot-screen">
      {/* Section 10 - Back link */}
      <BackLink onClick={handleBack} label="BACK TO SIGN IN" />
      
      {/* Form Eyebrow */}
      <FormEyebrow text="PASSWORD RECOVERY" />
      
      {/* Form Heading */}
      <FormHeading text="Reset " italicText="password" />
      
      {/* Form Sub-text */}
      <FormSubText>
        Enter the email address associated with your account. We'll send you a reset link.
      </FormSubText>

      {/* Success Alert - Section 10 */}
      <FormAlert 
        type="success" 
        message={successMessage} 
        show={!!successMessage} 
      />

      {/* Error Alert - Section 10 (for server errors in production) */}
      <FormAlert 
        type="error" 
        message={errorMessage} 
        show={!!errorMessage} 
      />

      {/* Email Field */}
      <TextInput
        id="forgot-email"
        name="email"
        type="email"
        label="EMAIL ADDRESS"
        required={true}
        placeholder="you@example.com"
        value={email}
        onChange={handleEmailChange}
        onBlur={validateEmail}
        error={emailError}
        success={isLinkSent}
        autoComplete="email"
      />

      {/* CTA Button - Disabled after link sent */}
      <PrimaryButton 
        onClick={handleSendResetLink} 
        isLoading={isLoading}
        disabled={isLinkSent}
      >
        {isLinkSent ? 'Link sent' : 'SEND RESET LINK'}
      </PrimaryButton>
    </div>
  );
};

export default ForgotPasswordScreen;