// src/components/LYP/components/UI.tsx

import React from 'react';
import './styles/UI.css';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'sec' | 'danger' | 'wa';
  size?: 'sm' | 'xs';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'sec',
  size,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    variant && `btn-${variant}`,
    size && `btn-${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

// Status Chip Component
interface StatusChipProps {
  status: string;
  variant?: 's-live' | 's-pend' | 's-paused' | 's-draft' | 's-sold';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, variant }) => {
  const chipClass = variant || getStatusClass(status);
  return <span className={`s-chip ${chipClass}`}>{status}</span>;
};

// Helper for status class
const getStatusClass = (status: string): string => {
  const mapping: Record<string, string> = {
    'New': 's-pend',
    'In Review': 's-pend',
    'Awaiting Reply': 's-pend',
    'Approved': 's-live',
    'Rejected': 's-sold',
    'Withdrawn': 's-draft',
    'Expired': 's-draft'
  };
  return mapping[status] || 's-pend';
};

// Channel Tag Component
interface ChannelTagProps {
  channel: string;
}

export const ChannelTag: React.FC<ChannelTagProps> = ({ channel }) => {
  const classMap: Record<string, string> = {
    'WhatsApp': 't-r',
    'Instagram': 't-p',
    'Website': 't-n',
    'In Person': 't-n'
  };
  return <span className={`tag ${classMap[channel] || 't-n'}`}>{channel}</span>;
};

// SUB-ID Component
interface SubIdProps {
  subid: string;
  onClick?: () => void;
  className?: string;
}

export const SubId: React.FC<SubIdProps> = ({ subid, onClick, className = '' }) => {
  return (
    <span className={`subid ${className}`} onClick={onClick}>
      {subid}
    </span>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

// Card Header
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, right }) => {
  return (
    <div className="card-hd">
      <div>
        <div className="card-title">{title}</div>
        {subtitle && <div className="card-sub">{subtitle}</div>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
};

// Card Body
interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`card-bd ${className}`}>{children}</div>;
};

// Card Footer
interface CardFooterProps {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return <div className="card-ft">{children}</div>;
};

// Age Chip
interface AgeChipProps {
  text: string;
  className?: string;
}

export const AgeChip: React.FC<AgeChipProps> = ({ text, className = '' }) => {
  return <span className={`agec ${className}`}>{text}</span>;
};

// Tooltip Chip
interface TChipProps {
  children: React.ReactNode;
  variant?: 'ok' | 'warn' | 'bad';
  onClick?: () => void;
  title?: string;
}

export const TChip: React.FC<TChipProps> = ({ 
  children, 
  variant = 'ok', 
  onClick, 
  title 
}) => {
  const classMap: Record<string, string> = {
    'ok': 'tchip ok',
    'warn': 'tchip warn',
    'bad': 'tchip bad'
  };
  return (
    <span 
      className={classMap[variant]} 
      onClick={onClick}
      title={title}
    >
      {children}
    </span>
  );
};