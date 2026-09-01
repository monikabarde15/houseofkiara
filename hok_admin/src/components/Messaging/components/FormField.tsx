// components/FormField.tsx
import React from 'react';
import './styles/FormField.css';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  hint,
  className = '',
}) => {
  return (
    <div className={`msg-field ${className}`}>
      <label className="msg-field-label">{label}</label>
      {children}
      {hint && <div className="msg-field-hint">{hint}</div>}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readOnly?: boolean;
}

export const Input: React.FC<InputProps> = ({ readOnly = false, className = '', ...props }) => {
  return (
    <input
      className={`msg-input ${readOnly ? 'msg-input--readonly' : ''} ${className}`}
      readOnly={readOnly}
      {...props}
    />
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  readOnly?: boolean;
  minHeight?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  readOnly = false,
  minHeight = 80,
  className = '',
  ...props
}) => {
  return (
    <textarea
      className={`msg-textarea ${readOnly ? 'msg-textarea--readonly' : ''} ${className}`}
      style={{ minHeight }}
      readOnly={readOnly}
      {...props}
    />
  );
};