/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · READS AS (Spec 4.3)
   Renders heading text with *asterisk* parsed into gold italic
========================================================= */

import React from 'react';
import './ReadsAsMirror.css';

interface ReadsAsMirrorProps {
  text?: string;
  className?: string;
}

export const ReadsAsMirror: React.FC<ReadsAsMirrorProps> = ({ text = '', className = '' }) => {
  if (!text) return null;

  // Split text by *word* to extract asterisks
  const parts = text.split(/(\*[^*]+\*)/g);

  return (
    <div className={`hok-reads-as-panel ${className}`.trim()}>
      <span className="hok-reads-as-caption">Reads as</span>
      <div className="hok-reads-as-content">
        {parts.map((part, index) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            const inner = part.slice(1, -1);
            return (
              <span key={index} className="hok-reads-as-italic-gold">
                {inner}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    </div>
  );
};
