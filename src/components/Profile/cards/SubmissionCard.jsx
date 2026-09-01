import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../styles/Profile/cards/SubmissionCard.css";

const SubmissionCard = ({ submission, isActive, onClick }) => {
  const getStatusClass = () => {
    switch(submission.status) {
      case 'Under Review': return 'profile-sb-rev';
      case 'Approved': return 'profile-sb-app';
      case 'Listed': return 'profile-sb-lst';
      case 'Rejected': return 'profile-sb-rej';
      default: return '';
    }
  };

  return (
    <div 
      className={`profile-sub-card ${isActive ? 'profile-sub-card-active' : ''}`}
      onClick={() => onClick(submission.id)}
    >
      {/* Thumbnail */}
      <div className="profile-sub-thumb" style={{ background: submission.imageGradient }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1" opacity="0.28" />
        </svg>
      </div>

      {/* Info */}
      <div className="profile-sub-info">
        {/* Top Row: Badge + Arrow */}
        <div className="profile-sub-top-row">
          <div className={`profile-sub-badge ${getStatusClass()}`}>
            {submission.status}
          </div>
          <div className="profile-sub-arr">
            <ChevronRight size={14} strokeWidth={1.5} />
          </div>
        </div>
        
        <div className="profile-sub-name">{submission.name}</div>
        <div className="profile-sub-meta">
          Submitted {submission.submittedDate} · Preferred outcome: {submission.preferredOutcome}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;