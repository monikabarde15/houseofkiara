// src/components/LYP/record/FactsRight.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { Photographs } from './Photographs';
import './styles/FactsRight.css';

interface FactsRightProps {
  submission: Submission;
  onUpdate: () => void;
}

export const FactsRight: React.FC<FactsRightProps> = ({ submission, onUpdate }) => {
  return (
    <div className="facts-right">
      {/* PHOTOGRAPHS - §6.4 - Right column ONLY */}
      <Photographs submission={submission} onUpdate={onUpdate} />
    </div>
  );
};