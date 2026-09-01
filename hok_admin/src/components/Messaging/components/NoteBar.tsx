// components/NoteBar.tsx
import React from 'react';
import './styles/NoteBar.css';

interface NoteBarProps {
  type?: 'info' | 'problem';
  heading?: string;
  children: React.ReactNode;
  className?: string;
}

export const NoteBar: React.FC<NoteBarProps> = ({
  type = 'info',
  heading,
  children,
  className = '',
}) => {
  return (
    <div className={`msg-note-bar msg-note-bar--${type} ${className}`}>
      {type === 'info' && (
        <svg className="msg-note-bar-icon" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="7.5" cy="7.5" r="6.5" />
          <line x1="7.5" y1="6.5" x2="7.5" y2="10.5" />
          <line x1="7.5" y1="3.5" x2="7.5" y2="4.5" />
        </svg>
      )}
      <div className="msg-note-bar-content">
        {heading && <div className="msg-note-bar-heading">{heading}</div>}
        <div className="msg-note-bar-body">{children}</div>
      </div>
    </div>
  );
};