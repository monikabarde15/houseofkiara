// src/components/LYP/record/ApplicantBanner.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { getFirstName } from '../utils/formatter';
import './styles/ApplicantBanner.css';

interface ApplicantBannerProps {
  submission: Submission;
}

export const ApplicantBanner: React.FC<ApplicantBannerProps> = ({ submission }) => {
  const firstName = getFirstName(submission.listerID);

  return (
    <div className="applicant-banner">
      <strong>This piece carries {firstName}'s application.</strong> Approving it verifies them as a lister; declining or closing it decides the application with it.
    </div>
  );
};