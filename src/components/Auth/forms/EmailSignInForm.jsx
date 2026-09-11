import React, { useState } from 'react';
import TextInput from '../ui/TextInput';
import PasswordInput from '../ui/PasswordInput';
import PrimaryButton from '../ui/PrimaryButton';
import FormAlert from '../ui/FormAlert';
import '../../../styles/Auth/forms/EmailSignInForm.css';

const EmailSignInForm = ({ switchScreen, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required.');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Live error clearing - Section 7.3A
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
      setFormError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
      setFormError('');
    }
  };

  const handleSignIn = async () => {
    setFormError('');
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    // Call backend API
    try {
      const response = await fetch('/api/customer/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setFormError(result.message || 'The email or password you entered is incorrect. Please try again.');
        setEmailError(' ');
        setPasswordError(' ');
      } else {
        const authStore = (await import('../../../store/authStore')).default;
        authStore.getState().login(result.data, result.data.token);
        onSuccess(result.data);
      }
    } catch (err) {
      setFormError('Network error. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hok-auth-email-signin-form">
      <FormAlert type="error" message={formError} show={!!formError} />

      <TextInput
        id="signin-email"
        name="email"
        type="email"
        label="EMAIL ADDRESS"
        required={true}
        placeholder="you@example.com"
        value={email}
        onChange={handleEmailChange}
        onBlur={validateEmail}
        error={emailError}
        autoComplete="email"
      />

      <PasswordInput
        id="signin-password"
        name="password"
        label="PASSWORD"
        required={true}
        placeholder="Your password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={validatePassword}
        error={passwordError}
        autoComplete="current-password"
      />

      {/* Section 7.3 - Forgot password link */}
      <div className="hok-auth-forgot-link">
        <a onClick={() => switchScreen('forgot')}>Forgot password?</a>
      </div>

      <PrimaryButton onClick={handleSignIn} isLoading={isLoading}>
        SIGN IN
      </PrimaryButton>
    </div>
  );
};

export default EmailSignInForm;