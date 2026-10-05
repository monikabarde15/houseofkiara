import React from 'react';
import './Field.css';

interface FieldProps {
  label?: string;
  labelRight?: React.ReactNode;
  hints?: string | string[];
  warningHint?: string;
  className?: string;
  id?: string;
  onPointerClick?: (targetElem: HTMLElement) => void;
  pointerHint?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  labelRight,
  hints,
  warningHint,
  className = '',
  id,
  onPointerClick,
  pointerHint = 'Insert a live value — it prints the current figure wherever this appears',
  children
}) => {
  const hintsArray = Array.isArray(hints) ? hints : hints ? [hints] : [];

  return (
    <div className={`hok-field-wrapper ${className}`.trim()} id={id}>
      {(label || labelRight) && (
        <div className="hok-field-label-row">
          {label && <label className="hok-field-label">{label}</label>}
          {labelRight && <div>{labelRight}</div>}
        </div>
      )}

      <div className="hok-field-input-container">
        {children}
        {onPointerClick && (
          <button
            type="button"
            className="hok-pointer-btn"
            data-hint={pointerHint}
            onClick={(e) => onPointerClick(e.currentTarget)}
          >
            {'{ }'}
          </button>
        )}
      </div>

      {(hintsArray.length > 0 || warningHint) && (
        <div className="hok-field-hints">
          {warningHint && <div className="hok-field-hint is-warning">{warningHint}</div>}
          {hintsArray.map((hintText, idx) => (
            <div key={idx} className="hok-field-hint">
              {hintText}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
