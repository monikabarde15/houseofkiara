import React from 'react';
import './Card.css';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  isFirst?: boolean;
  className?: string;
  bodyClassName?: string;
  id?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  footer,
  isFirst = false,
  className = '',
  bodyClassName = '',
  id,
  children
}) => {
  return (
    <div id={id} className={`hok-card ${isFirst ? 'is-first' : ''} ${className}`.trim()}>
      {(title || subtitle || headerAction) && (
        <div className="hok-card-header">
          <div className="hok-card-header-titles">
            {title && <h3 className="hok-card-title">{title}</h3>}
            {subtitle && <p className="hok-card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="hok-card-header-actions">{headerAction}</div>}
        </div>
      )}
      <div className={`hok-card-body ${bodyClassName}`.trim()}>{children}</div>
      {footer && <div className="hok-card-footer">{footer}</div>}
    </div>
  );
};
