import React from 'react';
import './GoogleRegion.css';

interface TrackingCodeBlockProps {
  id: string;
  title: string;
  value: string;
  placeholder: string;
  description: string;
  whereToFindIt: string;
  onChange: (val: string) => void;
}

export const TrackingCodeBlock: React.FC<TrackingCodeBlockProps> = ({
  id,
  title,
  value,
  placeholder,
  description,
  whereToFindIt,
  onChange
}) => {
  const isConnected = !!value.trim();

  return (
    <div className="hok-tracking-block" id={id}>
      <div className="hok-tracking-header">
        <span className="hok-tracking-title">{title}</span>
        <span
          className={`hok-tracking-chip ${
            isConnected ? 'chip-connected' : 'chip-not-set'
          }`}
        >
          {isConnected ? 'connected' : 'not set up'}
        </span>
      </div>

      <p className="hok-tracking-desc">{description}</p>

      <div className="hok-tracking-quiet-box">
        <input
          type="text"
          className="hok-tracking-quiet-input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="hok-asset-tag-row">
        <span className="hok-asset-tag-chip chip-what-to-prepare">WHERE TO FIND IT</span>
        <span>{whereToFindIt}</span>
      </div>
    </div>
  );
};
