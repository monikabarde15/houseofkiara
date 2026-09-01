// src/components/Listers/components/UI.tsx

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
  const chipClass = variant || 's-draft';
  return <span className={`s-chip ${chipClass}`}>{status}</span>;
};

// Channel Tag Component
interface ChannelTagProps {
  channel: string;
  type?: 'r' | 'p' | 'n';
}

export const ChannelTag: React.FC<ChannelTagProps> = ({ channel, type = 'n' }) => {
  return <span className={`tag t-${type}`}>{channel}</span>;
};

// SubId Chip Component
interface SubIdChipProps {
  subid: string;
  onClick?: () => void;
}

export const SubIdChip: React.FC<SubIdChipProps> = ({ subid, onClick }) => {
  return (
    <span className="subid-chip" onClick={onClick}>
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

// Empty State Component
interface EmptyStateProps {
  type?: 'inline' | 'boxed';
  children: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type = 'inline', children }) => {
  const classes = type === 'boxed' ? 'empty-state-boxed' : 'empty-state-inline';
  return <div className={classes}>{children}</div>;
};