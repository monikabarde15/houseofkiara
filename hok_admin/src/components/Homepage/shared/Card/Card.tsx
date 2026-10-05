/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · CARD (Spec 4.1)
========================================================= */

import React from 'react';
import './Card.css';
import { DoorArrowIcon } from '../icons/HomepageIcons';

interface CardProps {
  id?: string;
  title: string;
  sub?: string;
  doorLabel?: string;
  onDoorClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  id,
  title,
  sub,
  doorLabel,
  onDoorClick,
  children,
  className = ''
}) => {
  return (
    <div className={`hok-card ${className}`.trim()} id={id}>
      <div className="hok-card-header">
        <div className="hok-card-header-text">
          <h3 className="hok-card-title">{title}</h3>
          {sub && <p className="hok-card-sub">{sub}</p>}
        </div>

        {doorLabel && onDoorClick && (
          <button
            type="button"
            className="hok-card-door-btn"
            onClick={onDoorClick}
          >
            <span>{doorLabel}</span>
            <DoorArrowIcon size={9} />
          </button>
        )}
      </div>

      <div className="hok-card-body">{children}</div>
    </div>
  );
};
