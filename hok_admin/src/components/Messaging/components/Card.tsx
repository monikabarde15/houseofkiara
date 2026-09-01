// components/Card.tsx
import React from 'react';
import './styles/Card.css';

interface CardProps {
  header?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerSubtitle?: string;
  footer?: React.ReactNode;
  footerLeft?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noBodyPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  header,
  headerRight,
  headerSubtitle,
  footer,
  footerLeft,
  children,
  className = '',
  noBodyPadding = false,
}) => {
  return (
    <div className={`msg-card ${className}`}>
      {(header || headerRight) && (
        <div className="msg-card-header">
          <div className="msg-card-header-left">
            <span className="msg-card-header-title">{header}</span>
            {headerSubtitle && (
              <span className="msg-card-header-subtitle">{headerSubtitle}</span>
            )}
          </div>
          {headerRight && <div className="msg-card-header-right">{headerRight}</div>}
        </div>
      )}
      <div className={`msg-card-body ${noBodyPadding ? 'msg-card-body--no-padding' : ''}`}>
        {children}
      </div>
      {(footer || footerLeft) && (
        <div className="msg-card-footer">
          {footerLeft && <div className="msg-card-footer-left">{footerLeft}</div>}
          {footer && <div className="msg-card-footer-right">{footer}</div>}
        </div>
      )}
    </div>
  );
};