// setup/SetupDrawer.tsx
import React, { useState } from 'react';
import './styles/SetupDrawer.css';

interface SetupDrawerProps {
  title: string;
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  footer?: React.ReactNode;
}

export const SetupDrawer: React.FC<SetupDrawerProps> = ({
  title,
  summary,
  children,
  defaultOpen = false,
  footer,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`msg-drawer ${isOpen ? 'msg-drawer--open' : ''}`}>
      <div className="msg-drawer-header" onClick={() => setIsOpen(!isOpen)}>
        <svg
          className={`msg-drawer-chevron ${isOpen ? 'msg-drawer-chevron--open' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="4,2 8,6 4,10" />
        </svg>
        <span className="msg-drawer-title">{title}</span>
        <span className="msg-drawer-summary">{summary}</span>
      </div>
      <div className="msg-drawer-body">
        {children}
        {footer && <div className="msg-drawer-footer">{footer}</div>}
      </div>
    </div>
  );
};