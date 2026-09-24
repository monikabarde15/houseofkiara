// src/components/Listers/components/CreateModeBanner.tsx

import React from 'react';
import './styles/CreateModeBanner.css';

export const CreateModeBanner: React.FC = () => {
  return (
    <div className="create-mode-banner">
      <strong>Creating a manual lister</strong> – most listers arrive through List Your Piece; this path is WhatsApp-first onboarding. Fill Contact Information and press Save to create the record (name and phone are required). Bank details start <strong>unverified</strong>, so payouts hold until you verify.
    </div>
  );
};

export default CreateModeBanner;