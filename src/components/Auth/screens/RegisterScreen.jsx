import React, { useState } from 'react';
import BackLink from '../ui/BackLink';
import FormEyebrow from '../ui/FormEyebrow';
import FormHeading from '../ui/FormHeading';
import FormSubText from '../ui/FormSubText';
import TextInput from '../ui/TextInput';
import PhoneNumberInput from '../ui/PhoneNumberInput';
import PasswordInput from '../ui/PasswordInput';
import CheckboxField from '../ui/CheckboxField';
import PrimaryButton from '../ui/PrimaryButton';
import GoogleButton from '../ui/GoogleButton';
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import FormAlert from '../ui/FormAlert';
import '../../../styles/Auth/screens/RegisterScreen.css';

const RegisterScreen = ({ switchScreen }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Validation functions
  const validateFirstName = () => {
    if (!formData.firstName.trim()) {
      setErrors(prev => ({ ...prev, firstName: 'First name is required.' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, firstName: '' }));
      return true;
    }
  };

  const validateLastName = () => {
    if (!formData.lastName.trim()) {
      setErrors(prev => ({ ...prev, lastName: 'Last name is required.' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, lastName: '' }));
      return true;
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
      return false;
    } else if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
      return true;
    }
  };

  const validateMobile = () => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile) {
      setErrors(prev => ({ ...prev, mobile: 'Please enter a valid 10-digit mobile number.' }));
      return false;
    } else if (!mobileRegex.test(formData.mobile)) {
      setErrors(prev => ({ ...prev, mobile: 'Please enter a valid 10-digit mobile number.' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, mobile: '' }));
      return true;
    }
  };

  const validatePassword = () => {
    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters.' }));
      return false;
    } else if (formData.password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters.' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
      return true;
    }
  };

  const validateTerms = () => {
    if (!termsAccepted) {
      setErrors(prev => ({ ...prev, terms: 'Please accept the terms to continue.' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, terms: '' }));
      return true;
    }
  };

  // Live error clearing
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      setGeneralError('');
    }
  };

  const handlePasswordChange = (value) => {
    setFormData(prev => ({ ...prev, password: value }));
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
      setGeneralError('');
    }
  };

  const handleTermsChange = (e) => {
  setTermsAccepted(e.target.checked);
  if (errors.terms) {
    setErrors(prev => ({ ...prev, terms: '' }));
    setGeneralError('');
  }
};

  // Validate all fields
  const validateAllFields = () => {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    const isMobileValid = validateMobile();
    const isPasswordValid = validatePassword();
    const isTermsValid = validateTerms();

    return isFirstNameValid && isLastNameValid && isEmailValid &&
      isMobileValid && isPasswordValid && isTermsValid;
  };

  // Section 8.5 - Create Account → OTP Flow
  const handleCreateAccount = async () => {
    setGeneralError('');

    // Step 1: All 6 fields valid + terms checked → CTA clicked
    const isValid = validateAllFields();

    if (!isValid) {
      return;
    }

    // Step 1: Button enters loading state (1,400ms)
    setIsLoading(true);

    // Step 2: Navigate to Screen 3 (OTP Verify) after 1,400ms
    // Section 8.5 - Step 2: Navigate to Screen 3 (OTP Verify)
    setTimeout(() => {
      switchScreen('otp', {
        otpSource: 'register',  // Identifies this came from register flow
        userData: {
          ...formData,
          marketingAccepted,
          flow: 'register',  // Add flow type for success screen
          otpDestination: `+91 ${formData.mobile}`
        }
      });
      setIsLoading(false);
    }, 1400);
  };

  return (
    <div className="hok-auth-register-screen">
      <BackLink onClick={() => switchScreen('signin')} label="BACK TO SIGN IN" />
      <FormEyebrow text="CREATE ACCOUNT" />
      <FormHeading text="Join " italicText="House of Kaira" />
      <FormSubText>
        Already have an account?{' '}
        <span className="hok-auth-link" onClick={() => switchScreen('signin')}>
          Sign in
        </span>
      </FormSubText>

      <FormAlert type="error" message={generalError} show={!!generalError} />

      <div className="hok-auth-name-row">
        <TextInput
          id="first-name"
          name="firstName"
          type="text"
          label="FIRST NAME"
          required={true}
          placeholder="Priya"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          onBlur={validateFirstName}
          error={errors.firstName}
          autoComplete="given-name"
        />

        <TextInput
          id="last-name"
          name="lastName"
          type="text"
          label="LAST NAME"
          required={true}
          placeholder="Sharma"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          onBlur={validateLastName}
          error={errors.lastName}
          autoComplete="family-name"
        />
      </div>

      <TextInput
        id="register-email"
        name="email"
        type="email"
        label="EMAIL ADDRESS"
        required={true}
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        onBlur={validateEmail}
        error={errors.email}
        autoComplete="email"
      />

      <PhoneNumberInput
        id="register-mobile"
        name="mobile"
        label="MOBILE NUMBER"
        required={true}
        placeholder="10-digit number (WhatsApp preferred)"
        value={formData.mobile}
        onChange={(e) => handleInputChange('mobile', e.target.value)}
        onBlur={validateMobile}
        error={errors.mobile}
      />

      <PasswordInput
        id="register-password"
        name="password"
        label="PASSWORD"
        required={true}
        placeholder="Create a strong password"
        value={formData.password}
        onChange={(e) => handlePasswordChange(e.target.value)}
        onBlur={validatePassword}
        error={errors.password}
        autoComplete="new-password"
      />

      <PasswordStrengthMeter password={formData.password} />

      <CheckboxField
        id="terms-checkbox"
        label="I agree to the Terms & Conditions and Privacy Policy. I understand my data will be used to manage my account and orders."
        checked={termsAccepted}
        onChange={handleTermsChange}
        error={errors.terms}
      />

      <CheckboxField
        id="marketing-checkbox"
        label="Receive updates on new arrivals, exclusive offers, and style guides via WhatsApp and email."
        checked={marketingAccepted}
        onChange={(e) => setMarketingAccepted(e.target.checked)}
      />

      <PrimaryButton onClick={handleCreateAccount} isLoading={isLoading}>
        CREATE ACCOUNT
      </PrimaryButton>

      <GoogleButton onClick={() => console.log('Google OAuth clicked')} marginTop="12px" />
    </div>
  );
};

export default RegisterScreen;