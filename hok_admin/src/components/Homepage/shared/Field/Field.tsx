/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · FIELD (Spec 4.2)
========================================================= */

import React, { useState, useRef } from 'react';
import './Field.css';
import { TokenPicker, resolveHomepageTokens } from '../TokenPicker/TokenPicker';

interface FieldProps {
  id?: string;
  label?: string;
  hint?: string;
  tokenCapable?: boolean;
  value?: string;
  onTokenInsert?: (insertedValue: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({
  id,
  label,
  hint,
  tokenCapable = false,
  value = '',
  onTokenInsert,
  children,
  className = ''
}) => {
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const tokenBtnRef = useRef<HTMLButtonElement>(null);

  const hasTokens = value && value.includes('{{');
  const resolvedPrints = hasTokens ? resolveHomepageTokens(value) : '';

  return (
    <div className={`hok-field ${className}`.trim()} id={id}>
      {label && (
        <div className="hok-field-label-row">
          <label className="hok-field-label">{label}</label>

          {tokenCapable && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="hok-field-token-btn"
                ref={tokenBtnRef}
                onClick={() => setShowTokenPicker(!showTokenPicker)}
                title="Insert live token"
              >
                {'{ }'}
              </button>

              {showTokenPicker && onTokenInsert && (
                <TokenPicker
                  targetRef={tokenBtnRef}
                  onClose={() => setShowTokenPicker(false)}
                  onSelectToken={(tok) => onTokenInsert(value ? `${value} ${tok}` : tok)}
                />
              )}
            </div>
          )}
        </div>
      )}

      {children}

      {hint && <div className="hok-field-hint">{hint}</div>}

      {tokenCapable && hasTokens && (
        <div className="hok-field-prints-row">
          Prints: {resolvedPrints}
        </div>
      )}
    </div>
  );
};
