// src/components/LYP/record/FactsRight.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { Photographs } from './Photographs';
import { AuthenticationStrip } from './AuthenticationStrip';
import './styles/FactsRight.css';

interface FactsRightProps {
  submission: Submission;
  onUpdate: () => void;
}

export const FactsRight: React.FC<FactsRightProps> = ({ submission, onUpdate }) => {
  return (
    <div className="facts-right">
      {/* PHOTOGRAPHS — shown at top of right column */}
      <Photographs submission={submission} onUpdate={onUpdate} />

      {/* AUTHENTICATION ALERT — amber warning box below photos, as per design */}
      <AuthenticationStrip submission={submission} />
    </div>
  );
};