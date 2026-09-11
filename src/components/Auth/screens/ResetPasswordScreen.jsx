import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FormEyebrow from '../ui/FormEyebrow';
import FormHeading from '../ui/FormHeading';
import FormSubText from '../ui/FormSubText';
import PasswordInput from '../ui/PasswordInput';
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import PrimaryButton from '../ui/PrimaryButton';
import FormAlert from '../ui/FormAlert';
import '../../../styles/Auth/screens/ResetPasswordScreen.css';

const ResetPasswordScreen = ({ switchScreen, userData = {} }) => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetToken =
    userData?.token ||
    userData?.resetToken ||
    searchParams.get('token') ||
    searchParams.get('resetToken') ||
    '';

  useEffect(() => {
    if (!resetToken) {
      setGeneralError(
        'Password reset link is invalid or missing. Please request a new link from the forgot password page.'
      );
    } else {
      setGeneralError('');
    }
  }, [resetToken]);

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

    if (!resetToken) {
      setGeneralError('Password reset link is invalid or missing. Please request a new link.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/customer/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        setNewPassword('');
        setConfirmPassword('');
        // Navigate to Success Screen
        switchScreen('success', {
          userData: {
            flow: 'reset',
          },
        });
      } else {
        setGeneralError(result.message || 'Password reset token is invalid or has expired. Please request a new one.');
      }
    } catch (err) {
      setGeneralError('Network error. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
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