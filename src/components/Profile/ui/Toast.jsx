import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import "../../../styles/Profile/ui/Toast.css";

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2600);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="profile-toast">
      <Check size={12} strokeWidth={2} />
      <span>{message}</span>
    </div>
  );
};

export default Toast;