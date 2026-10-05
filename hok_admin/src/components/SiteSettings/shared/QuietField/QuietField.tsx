import React from 'react';
import './QuietField.css';

interface QuietFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'secondary' | 'heading';
  isMuted?: boolean;
}

export const QuietField: React.FC<QuietFieldProps> = ({
  variant = 'default',
  isMuted = false,
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'secondary'
      ? 'is-secondary'
      : variant === 'heading'
      ? 'is-heading'
      : '';
  const mutedClass = isMuted ? 'is-muted' : '';

  return (
    <input
      type="text"
      className={`hok-quiet-field ${variantClass} ${mutedClass} ${className}`.trim()}
      {...props}
    />
  );
};
