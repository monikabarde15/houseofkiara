// components/LiveLink.tsx
import React from 'react';
import './styles/LiveLink.css';

interface LiveLinkProps {
  to: string;
  section: string;
  tab?: string;
  children: React.ReactNode;
  className?: string;
}

export const LiveLink: React.FC<LiveLinkProps> = ({
  to,
  section,
  tab,
  children,
  className = '',
}) => {
  const handleClick = () => {
    // Adds current place to back journey
    // Navigates to section, opens tab
    console.log(`Navigate to: ${section} → ${tab || 'default'} → ${to}`);
  };

  return (
    <span
      className={`msg-live-link ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={`Go to ${section}`}
    >
      {children}
    </span>
  );
};