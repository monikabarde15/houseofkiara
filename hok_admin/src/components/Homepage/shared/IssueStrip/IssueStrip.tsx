/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · ISSUE STRIP (Spec 4.7)
========================================================= */

import React from 'react';
import './IssueStrip.css';
import { HealthSeverity } from '../../types/homepage.types';
import { DoorArrowIcon } from '../icons/HomepageIcons';

interface IssueStripProps {
  severity: HealthSeverity;
  message: string;
  doorLabel?: string;
  onDoorClick?: () => void;
  className?: string;
}

export const IssueStrip: React.FC<IssueStripProps> = ({
  severity,
  message,
  doorLabel,
  onDoorClick,
  className = ''
}) => {
  return (
    <div className={`hok-issue-strip is-${severity} ${className}`.trim()}>
      <span className="hok-issue-message">{message}</span>

      {doorLabel && onDoorClick && (
        <button
          type="button"
          className="hok-issue-door-btn"
          onClick={onDoorClick}
        >
          <span>{doorLabel}</span>
          <DoorArrowIcon size={8} />
        </button>
      )}
    </div>
  );
};
