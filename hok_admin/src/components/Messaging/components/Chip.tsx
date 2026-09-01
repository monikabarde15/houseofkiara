import React from 'react';
import './styles/Chip.css';

interface ChipProps {
  variant?: 'channel' | 'variable' | 'document' | 'wordgroup';
  active?: boolean;
  crossed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'channel',
  active = false,
  crossed = false,
  onClick,
  children,
  className = '',
}) => {
  const classes = [
    'msg-chip',
    `msg-chip--${variant}`,
    active ? 'msg-chip--active' : '',
    crossed ? 'msg-chip--crossed' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} onClick={onClick}>
      {children}
    </span>
  );
};
