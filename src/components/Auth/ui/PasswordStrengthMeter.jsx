import React, { useState, useEffect } from 'react';
import '../../../styles/Auth/ui/PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [score, setScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (password && password.length > 0) {
      setIsVisible(true);
      calculateStrength(password);
    } else {
      setIsVisible(false);
      setStrength(0);
      setScore(0);
    }
  }, [password]);

  const calculateStrength = (pwd) => {
    let newScore = 0;
    
    // Score increments by 1 for each condition
    if (pwd.length >= 8) newScore += 1;
    if (pwd.length >= 12) newScore += 1;
    if (/[A-Z]/.test(pwd)) newScore += 1;
    if (/\d/.test(pwd)) newScore += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) newScore += 1;
    
    setScore(newScore);
    
    // Convert score to strength level (0-5)
    setStrength(newScore);
  };

  const getStrengthConfig = () => {
    switch(score) {
      case 1:
        return { label: 'Very Weak', width: '20%', color: '#C0392B' };
      case 2:
        return { label: 'Weak', width: '40%', color: '#E67E22' };
      case 3:
        return { label: 'Fair', width: '60%', color: '#F1C40F' };
      case 4:
        return { label: 'Strong', width: '80%', color: '#27AE60' };
      case 5:
        return { label: 'Very Strong', width: '100%', color: '#1E8449' };
      default:
        return { label: '', width: '0%', color: '#E8E0D4' };
    }
  };

  const config = getStrengthConfig();

  if (!isVisible) return null;

  return (
    <div className="hok-auth-password-strength">
      <div className="hok-auth-strength-bar-container">
        <div 
          className="hok-auth-strength-bar-fill"
          style={{
            width: config.width,
            backgroundColor: config.color
          }}
        />
      </div>
      <div 
        className="hok-auth-strength-label"
        style={{ color: config.color }}
      >
        {config.label}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;