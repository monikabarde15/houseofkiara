/* ========================================
   Promotions Module - UI Components
   Shared: Buttons, Chips, Badges, Switches, Cards, Links
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 4
   ======================================== */

import React, { ReactNode } from 'react';
import './styles/UI.css';

// --- Card (Section 4.1) ---
interface CardProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ header, footer, children, className = '' }) => (
  <div className={`card ${className}`}>
    {header && <div className="card__header">{header}</div>}
    {children && <div className="card__body">{children}</div>}
    {footer && <div className="card__footer">{footer}</div>}
  </div>
);

// --- Button (Section 4.3) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'default',
  className = '',
  children,
  ...props
}) => (
  <button
    className={`button button--${variant} button--${size} ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- Status Badge (Section 4.6) ---
interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isLive = status === 'Active';
  return (
    <span className={`status-badge ${isLive ? 'live' : 'neutral'}`}>
      {status}
    </span>
  );
};

// --- Chip (Section 4.6) ---
interface ChipProps {
  variant?: 'default' | 'positive' | 'warning';
  children: ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'default',
  children,
  className = '',
}) => (
  <span className={`chip chip--${variant} ${className}`}>
    {children}
  </span>
);

// --- Attention Pill (Section 4.6) ---
interface AttentionPillProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
}

export const AttentionPill: React.FC<AttentionPillProps> = ({
  children,
  onClick,
  className = '',
  title,
}) => (
  <span
    className={`attention-pill ${className}`}
    onClick={onClick}
    title={title}
  >
    {children}
  </span>
);

// --- Switch / Toggle (Section 4.5) ---
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelOn?: string;
  labelOff?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  labelOn,
  labelOff,
}) => {
  const displayLabel = label || (checked ? labelOn : labelOff);

  const renderLabel = (text: string) => {
    if (text && text.includes(' — ')) {
      const [boldPart, ...rest] = text.split(' — ');
      return (
        <>
          <strong>{boldPart}</strong> — {rest.join(' — ')}
        </>
      );
    }
    return text;
  };

  return (
    <div className="switch">
      <button
        type="button"
        className={`switch__toggle ${checked ? 'on' : 'off'}`}
        onClick={() => onChange(!checked)}
        disabled={disabled}
      >
        <span className="switch__track">
          <span className="switch__thumb" />
        </span>
      </button>
      {displayLabel && <span className="switch__label">{renderLabel(displayLabel)}</span>}
    </div>
  );
};

// --- Link / Door (Section 4.9) ---
interface LinkProps {
  onClick?: () => void;
  href?: string;
  children: ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({
  onClick,
  href,
  children,
  className = '',
}) => {
  if (href) {
    return (
      <a href={href} className={`link ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button className={`link ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

// --- Form Field (Section 4.4) ---
interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  error,
  children,
  className = '',
}) => (
  <div className={`form-field ${className}`}>
    <label className="form-field__label">{label}</label>
    {children}
    {hint && <div className="form-field__hint">{hint}</div>}
    {error && <div className="form-field__error">{error}</div>}
  </div>
);

// --- Definition Row (Section 4.12) ---
interface DefinitionRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export const DefinitionRow: React.FC<DefinitionRowProps> = ({
  label,
  value,
  className = '',
}) => (
  <div className={`definition-row ${className}`}>
    <span className="definition-row__label">{label}</span>
    <span className="definition-row__value">{value}</span>
  </div>
);

// --- Statistic Card (Section 4.2) ---
interface StatCardProps {
  label: string;
  value: string | number;
  tooltip?: string;
  active?: boolean;
  onClick?: () => void;
  valueColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  tooltip,
  active = false,
  onClick,
  valueColor = '--charcoal',
}) => (
  <div
    className={`stat-card ${active ? 'active' : ''}`}
    onClick={onClick}
    title={tooltip}
  >
    <div className="stat-card__label">{label}</div>
    <div className={`stat-card__value stat-card__value--${valueColor.replace('#', '')}`}>
      {value}
    </div>
  </div>
);