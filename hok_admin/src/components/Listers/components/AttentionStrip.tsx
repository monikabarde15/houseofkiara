// src/components/Listers/components/AttentionStrip.tsx

import React from 'react';
import { AttentionFlag } from '../types/lister.types';
import './styles/AttentionStrip.css';

interface AttentionStripProps {
  flags: AttentionFlag[];
  listerId: string;
  onFlagClick?: (flag: AttentionFlag) => void;
}

export const AttentionStrip: React.FC<AttentionStripProps> = ({ 
  flags, 
  listerId, 
  onFlagClick 
}) => {
  if (!flags || flags.length === 0) {
    return null;
  }

  const handleFlagClick = (flag: AttentionFlag) => {
    if (onFlagClick) {
      onFlagClick(flag);
    }
  };

  return (
    <div className="attention-strip">
      <span className="attention-strip-label">Needs Attention</span>
      {flags.map((flag, index) => (
        <span 
          key={index} 
          className="attn-pill attn-go"
          onClick={() => handleFlagClick(flag)}
        >
          {flag.text} →
        </span>
      ))}
    </div>
  );
};

export default AttentionStrip;