// components/Pill.tsx
import React from 'react';
import './styles/Pill.css';

export type PillStatus = 'green' | 'amber' | 'grey' | 'blue' | 'terracotta';
export type PillType = 'status' | 'class';

interface PillProps {
  type?: PillType;
  status?: PillStatus;
  children: React.ReactNode;
  className?: string;
}

export const Pill: React.FC<PillProps> = ({
  type = 'status',
  status = 'grey',
  children,
  className = '',
}) => {
  return (
    <span className={`msg-pill msg-pill--${type} msg-pill--${status} ${className}`}>
      {children}
    </span>
  );
};