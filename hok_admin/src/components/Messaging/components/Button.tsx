// components/Button.tsx
import React from 'react';
import './styles/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small';
  children: React.ReactNode;
  icon?: React.ReactNode;
  saved?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'default',
  children,
  icon,
  saved = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`msg-btn msg-btn--${variant} msg-btn--${size} ${className}`}
      {...props}
    >
      {icon && <span className="msg-btn-icon">{icon}</span>}
      <span className="msg-btn-label">{children}</span>
      {saved && <span className="msg-btn-saved">Saved ✓</span>}
    </button>
  );
};