import React from 'react';
import './AddControl.css';

interface AddControlProps {
  onClick: () => void;
  label: string;
  hint?: string;
  className?: string;
}

export const AddControl: React.FC<AddControlProps> = ({
  onClick,
  label,
  hint,
  className = ''
}) => {
  return (
    <button
      type="button"
      className={`hok-add-control ${className}`.trim()}
      onClick={onClick}
      data-hint={hint}
    >
      {label}
    </button>
  );
};
