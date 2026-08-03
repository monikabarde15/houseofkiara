// src/components/Listers/components/BackButton.tsx

import React from 'react';
import { useJourneyStack } from '../hooks/useJourneyStack';
import './styles/BackButton.css';

export const BackButton: React.FC = () => {
  const { canGoBack, goBack, getBackDestination } = useJourneyStack();

  if (!canGoBack) {
    return null;
  }

  const destination = getBackDestination();

  return (
    <button className="back-button" onClick={goBack}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path 
          d="M8.5 1L3 5.5L8.5 10" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      Back to {destination}
    </button>
  );
};

export default BackButton;