import React from 'react';
import './DeleteCross.css';

interface DeleteCrossProps {
  onDelete: () => void;
  hint?: string;
  className?: string;
  isVisible?: boolean;
}

export const DeleteCross: React.FC<DeleteCrossProps> = ({
  onDelete,
  hint,
  className = '',
  isVisible = false
}) => {
  return (
    <button
      type="button"
      className={`hok-delete-cross ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      data-hint={hint}
      aria-label="Delete item"
    >
      ×
    </button>
  );
};
