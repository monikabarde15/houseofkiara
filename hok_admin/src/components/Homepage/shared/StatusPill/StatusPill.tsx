/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · STATUS PILL (Spec 4.6)
========================================================= */

import React from 'react';
import './StatusPill.css';

interface StatusPillProps {
  status: 'Live' | 'Sold' | 'Draft' | 'Paused' | 'Not built' | 'Needs a picture' | 'Desktop only' | string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, className = '' }) => {
  const norm = status.toLowerCase().replace(/\s+/g, '-');
  return (
    <span className={`hok-status-pill is-${norm} ${className}`.trim()}>
      {status}
    </span>
  );
};
