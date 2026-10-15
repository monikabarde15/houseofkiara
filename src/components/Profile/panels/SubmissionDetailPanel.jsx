import React from 'react';
import { X } from 'lucide-react';
import "../../../styles/Profile/panels/SubmissionDetailPanel.css";

const SubmissionDetailPanel = ({ submission, isOpen, onClose }) => {
  if (!submission) return null;

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
    <div className={`profile-sub-dpane ${isOpen ? 'open' : ''}`}>
      {/* Panel Header */}
      <div className="profile-sub-dpn">
        <div className="profile-sub-dpn-title">{submission.name}</div>
        <button className="profile-sub-dpn-close" onClick={onClose}>
          Close
          <X size={13} strokeWidth={1.5} />
        </button>
      </div>

      {/* Panel Body */}
      <div className="profile-sub-dpb">
        {/* Image Cell */}
        <div className="profile-sub-dp-img-cell" style={{ background: submission.imageGradient }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="4" width="28" height="28" stroke="currentColor" strokeWidth="1" opacity="0.18" />
          </svg>
        </div>

        {/* Info Area */}
        <div className="profile-sub-dp-info">
          {/* Badge Row with date */}
          <div className="profile-sub-dp-badge-row">
            <span className={`profile-sub-badge ${getStatusClass()}`}>
              {submission.status}
            </span>
            <span className="profile-sub-dp-date">Submitted {submission.submittedDate}</span>
          </div>

          <div className="profile-sub-dp-name">{submission.name}</div>
          <div className="profile-sub-dp-des">Submission #{submission.id}</div>

          {/* Detail Rows */}
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Piece Type</div>
            <div className="profile-sub-dp-rv">{submission.pieceType}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Designer / Brand</div>
            <div className="profile-sub-dp-rv">{submission.designer}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Colour Family</div>
            <div className="profile-sub-dp-rv">{submission.colourFamily}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Size</div>
            <div className="profile-sub-dp-rv">{submission.size}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Condition</div>
            <div className="profile-sub-dp-rv">{submission.condition}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Times Worn</div>
            <div className="profile-sub-dp-rv">{submission.timesWorn}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Original Price (Approx.)</div>
            <div className="profile-sub-dp-rv">₹{submission.originalPrice}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Preferred Outcome</div>
            <div className="profile-sub-dp-rv">{submission.preferredOutcome}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Photos Submitted</div>
            <div className="profile-sub-dp-rv">{submission.photosSubmitted}</div>
          </div>
          <div className="profile-sub-dp-row">
            <div className="profile-sub-dp-rl">Pickup City</div>
            <div className="profile-sub-dp-rv">{submission.pickupCity}</div>
          </div>

          {/* Note Block */}
          <div className="profile-sub-dp-note">
            <div className="profile-sub-dp-note-h">What Happens Next</div>
            <div className="profile-sub-dp-note-t">
              Our curation team will review your piece and reach out on WhatsApp within 48 hours with pricing guidance and next steps. Submission is non-binding — nothing is locked in until you confirm.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-sub-dp-btns">
            <button className="profile-sub-btn-p">WhatsApp Team</button>
            <button className="profile-sub-btn-s">Withdraw Submission</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPanel;