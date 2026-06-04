import React, { useState } from 'react';
import FormEyebrow from '../ui/FormEyebrow';
import FormHeading from '../ui/FormHeading';
import FormSubText from '../ui/FormSubText';
import PasswordInput from '../ui/PasswordInput';
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import PrimaryButton from '../ui/PrimaryButton';
import FormAlert from '../ui/FormAlert';
import '../../../styles/Auth/screens/ResetPasswordScreen.css';

const ResetPasswordScreen = ({ switchScreen }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate new password (≥ 8 characters)
  const validateNewPassword = () => {
    if (!newPassword) {
      setNewPasswordError('Password must be at least 8 characters.');
      return false;
    } else if (newPassword.length < 8) {
      setNewPasswordError('Password must be at least 8 characters.');
      return false;
    } else {
      setNewPasswordError('');
      return true;
    }
  };

  // Validate confirm password (must match new password)
  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  // Live error clearing
  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    if (newPasswordError) {
      setNewPasswordError('');
      setGeneralError('');
    }
    if (confirmPasswordError && confirmPassword === value) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
      setGeneralError('');
    }
  };

  // Validate both fields on CTA click
  const validateAllFields = () => {
    const isNewPasswordValid = validateNewPassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    return isNewPasswordValid && isConfirmPasswordValid;
  };

  // Handle form submission
  const handleSetNewPassword = async () => {
    setGeneralError('');
    const isValid = validateAllFields();
    
    if (!isValid) {
      return;
    }

    setIsLoading(true);

    // Simulate API call - 1,200ms loading state
    setTimeout(() => {
      // Navigate to Success Screen
      switchScreen('success', {
        userData: {
          flow: 'reset'
        }
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="hok-auth-reset-screen">
      {/* Section 11 - No back link (accessed via email link) */}
      
      <FormEyebrow text="NEW PASSWORD" />
      <FormHeading text="Create new " italicText="password" />
      <FormSubText>
        Your new password must be different from your previous one.
      </FormSubText>

      <FormAlert type="error" message={generalError} show={!!generalError} />

      {/* Field 1 - New Password */}
      <PasswordInput
        id="new-password"
        name="newPassword"
        label="NEW PASSWORD"
        required={true}
        placeholder="Create a new password"
        value={newPassword}
        onChange={(e) => handleNewPasswordChange(e.target.value)}
        onBlur={validateNewPassword}
        error={newPasswordError}
        autoComplete="new-password"
      />

      {/* Password Strength Meter - appears on first keystroke */}
      <PasswordStrengthMeter password={newPassword} />

      {/* Field 2 - Confirm Password */}
      <PasswordInput
        id="confirm-password"
        name="confirmPassword"
        label="CONFIRM PASSWORD"
        required={true}
        placeholder="Repeat your new password"
        value={confirmPassword}
        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
        onBlur={validateConfirmPassword}
        error={confirmPasswordError}
        autoComplete="new-password"
      />

      <PrimaryButton onClick={handleSetNewPassword} isLoading={isLoading}>
        SET NEW PASSWORD
      </PrimaryButton>
    </div>
  );
};

export default ResetPasswordScreen;