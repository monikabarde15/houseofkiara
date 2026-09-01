import { MessageCircle } from "lucide-react";

import MobileBottomSheet from "./MobileBottomSheet";

import "../../../../styles/Profile/mobile/sheets/MobileSubmissionDetailSheet.css";

const MobileSubmissionDetailSheet = ({
  isOpen,
  onClose,
  submission
}) => {
  if (!submission) {
    return null;
  }

  const detailRows = [
    ["Piece Type", submission.pieceType],
    ["Designer / Brand", submission.designer],
    ["Colour Family", submission.colourFamily],
    ["Size", submission.size],
    ["Condition", submission.condition],
    ["Times Worn", submission.timesWorn],
    [
      "Original Price (Approx.)",
      `₹${submission.originalPrice.toLocaleString()}`
    ],
    [
      "Preferred Outcome",
      submission.preferredOutcome
    ],
    [
      "Photos Submitted",
      submission.photosSubmitted
    ],
    ["Pickup City", submission.pickupCity]
  ];

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={submission.name}
    >
      {/* Product Header */}

      <div className="profile-mobile-sheet-product">
        <div
          className="profile-mobile-sheet-product-img"
          style={{
            "--sheet-bg":
              submission.imageGradient
          }}
        />

        <div className="profile-mobile-sheet-product-info">
          <div className="profile-mobile-sub-status">
            <span className="profile-mobile-sub-dot" />

            <span className="profile-mobile-sub-badge">
              Under Review
            </span>
          </div>

          <div className="profile-mobile-sheet-product-name">
            {submission.name}
          </div>

          <div className="profile-mobile-sheet-product-meta">
            Submitted{" "}
            {
              submission.submittedDate
            }{" "}
            · #
            {submission.id}
          </div>
        </div>
      </div>

      {/* Detail Rows */}

      <div className="profile-mobile-sheet-detail-body">
        {detailRows.map(
          ([label, value]) => (
            <div
              key={label}
              className="profile-mobile-sub-drow"
            >
              <div className="profile-mobile-sub-dl">
                {label}
              </div>

              <div className="profile-mobile-sub-dv">
                {value}
              </div>
            </div>
          )
        )}

        {/* Note */}

        <div className="profile-mobile-sub-note">
          <div className="profile-mobile-sub-note-title">
            What Happens Next
          </div>

          <div className="profile-mobile-sub-note-text">
            Our curation team
            reviews submissions
            within 48 hours and
            coordinates next
            steps on WhatsApp.
            This submission is
            non-binding.
          </div>
        </div>

        {/* Buttons */}

        <button
          type="button"
          className="profile-mobile-sbtn-p"
        >
          <MessageCircle
            size={11}
            strokeWidth={1.8}
          />

          WhatsApp Team
        </button>

        <button
          type="button"
          className="profile-mobile-sbtn-s"
        >
          Withdraw Submission
        </button>
      </div>
    </MobileBottomSheet>
  );
};

export default MobileSubmissionDetailSheet;