import { MessageSquare } from "lucide-react";

import "../../../../styles/Profile/mobile/rows/MobileSubmissionRow.css";

const MobileSubmissionRow = ({
  submission,
  onClick
}) => {
  return (
    <button
      type="button"
      className="profile-mobile-sub-item"
      onClick={() =>
        onClick(submission)
      }
    >
      {/* Status */}

      <div className="profile-mobile-sub-status">
        <span className="profile-mobile-sub-dot" />

        <span className="profile-mobile-sub-badge">
          Under Review
        </span>
      </div>

      {/* Piece Name */}

      <div className="profile-mobile-sub-name">
        {submission.name}
      </div>

      {/* Meta */}

      <div className="profile-mobile-sub-meta">
        Submitted{" "}
        {
          submission.submittedDate
        }{" "}
        · Preferred outcome:{" "}
        {
          submission.preferredOutcome
        }
      </div>

      {/* Timeline */}

      <div className="profile-mobile-sub-timeline">
        Our team will review
        and be in touch within
        48 hours.
      </div>

      {/* Detail Rows */}

      <div className="profile-mobile-sub-drows">
        <div className="profile-mobile-sub-drow">
          <div className="profile-mobile-sub-dl">
            Submission ID
          </div>

          <div className="profile-mobile-sub-dv">
            #
            {submission.id}
          </div>
        </div>

        <div className="profile-mobile-sub-drow">
          <div className="profile-mobile-sub-dl">
            Listing Type
          </div>

          <div className="profile-mobile-sub-dv">
            Open to{" "}
            {
              submission.preferredOutcome
            }
          </div>
        </div>

        <div className="profile-mobile-sub-drow">
          <div className="profile-mobile-sub-dl">
            Piece Type
          </div>

          <div className="profile-mobile-sub-dv">
            {
              submission.pieceType
            }
          </div>
        </div>
      </div>

      {/* WhatsApp */}

      <button
        type="button"
        className="profile-mobile-sub-follow"
      >
        <MessageSquare />

        <span>
          Follow Up via
          WhatsApp
        </span>
      </button>
    </button>
  );
};

export default MobileSubmissionRow;