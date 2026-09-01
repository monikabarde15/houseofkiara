import React, { useState } from 'react';
import PhoneNumberInput from '../ui/PhoneNumberInput';
import PrimaryButton from '../ui/PrimaryButton';
import FormAlert from '../ui/FormAlert';
import '../../../styles/Auth/forms/MobileSignInForm.css';

const MobileSignInForm = ({ switchScreen, onSendOtp }) => {
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Section 7.4A - Mobile validation regex
  const validateMobile = () => {
    // Regex: 10 digits, must start with 6, 7, 8, or 9
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      return false;
    } else if (!mobileRegex.test(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      return false;
    } else {
      setMobileError('');
      return true;
    }
  };

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
    if (mobileError) {
      setMobileError('');
      setFormError('');
    }
  };

  const handleSendOtp = async () => {
    setFormError('');
    const isMobileValid = validateMobile();

    if (!isMobileValid) {
      return;
    }

    setIsLoading(true);

    // Section 7.4B - OTP Flow
    setTimeout(() => {
      onSendOtp(mobile);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="hok-auth-mobile-signin-form">
      <FormAlert type="error" message={formError} show={!!formError} />

      <PhoneNumberInput
        id="signin-mobile"
        name="mobile"
        label="MOBILE NUMBER"
        required={true}
        placeholder="10-digit mobile number"
        value={mobile}
        onChange={handleMobileChange}
        onBlur={validateMobile}
        error={mobileError}
      />

      <PrimaryButton onClick={handleSendOtp} isLoading={isLoading}>
        SEND OTP
      </PrimaryButton>
    </div>
  );
};

export default MobileSignInForm;