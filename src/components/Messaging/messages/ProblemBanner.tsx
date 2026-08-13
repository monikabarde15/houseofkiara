// messages/ProblemBanner.tsx
import React from 'react';
import './styles/ProblemBanner.css';

interface ProblemBannerProps {
  children: React.ReactNode;
}

export const ProblemBanner: React.FC<ProblemBannerProps> = ({ children }) => {
  return (
    <div className="msg-problem-banner">
      {children}
    </div>
  );
};