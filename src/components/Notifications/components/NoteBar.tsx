// src/components/Notifications/components/NoteBar.tsx
import React from 'react';
import './styles/NoteBar.css';

interface NoteBarProps {
  heading: string;
  children: React.ReactNode;
}

/**
 * The amber information note shape (§12) — an info-circle icon, a bold
 * heading on its own line, and a body paragraph. Used verbatim for Block 10
 * (the footer note card) and reusable anywhere else the panel needs the
 * same "amber panel" treatment the spec's own conventions call out (§0.1).
 */
export function NoteBar({ heading, children }: NoteBarProps) {
  return (
    <div className="prebuilt-note">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r="0.5" fill="#C9A96E" />
      </svg>
      <div>
        <strong>{heading}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}