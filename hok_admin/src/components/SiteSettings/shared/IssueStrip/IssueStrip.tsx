import React from 'react';
import './IssueStrip.css';
import { HealthSeverity } from '../../types/siteSettings.types';

interface IssueStripProps {
  severity: HealthSeverity;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const IssueStrip: React.FC<IssueStripProps> = ({
  severity,
  message,
  actionLabel = 'Open',
  onAction,
  className = ''
}) => {
  const severityClass =
    severity === 'Warning'
      ? 'is-warning'
      : severity === 'Soon'
      ? 'is-soon'
      : 'is-information';

  return (
    <div className={`hok-issue-strip ${severityClass} ${className}`.trim()}>
      <div className="hok-issue-strip-content">{message}</div>
      {onAction && (
        <button type="button" className="hok-issue-strip-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
