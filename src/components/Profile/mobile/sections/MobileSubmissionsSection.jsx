import { useState } from "react";

import MobileSectionLabel from "../ui/MobileSectionLabel";
import MobileSubmissionRow from "../rows/MobileSubmissionRow";
import MobileSubmissionDetailSheet from "../sheets/MobileSubmissionDetailSheet";

import "../../../../styles/Profile/mobile/sections/MobileSubmissionsSection.css";

const MobileSubmissionsSection = ({ submissions }) => {
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const submissionsList = Array.isArray(submissions) ? submissions : [];

  return (
    <>
      <section className="profile-mobile-submissions-section">
        <MobileSectionLabel
          title="MY SUBMISSIONS"
          count={submissionsList.length}
        />

        {submissionsList.length === 0 ? (
          <div className="profile-sub-empty" style={{ margin: "10px 0" }}>
            <div className="profile-se-h">No submissions yet</div>
            <div className="profile-se-s">
              Submit your designer outfits for rental and resale curation.
            </div>
          </div>
        ) : (
          <div className="profile-mobile-submissions-list">
            {submissionsList.map(
              (submission) => (
                <MobileSubmissionRow
                  key={submission.id}
                  submission={
                    submission
                  }
                  onClick={() =>
                    setSelectedSubmission(
                      submission
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </section>

      <MobileSubmissionDetailSheet
        isOpen={
          !!selectedSubmission
        }
        onClose={() =>
          setSelectedSubmission(
            null
          )
        }
        submission={
          selectedSubmission
        }
      />
    </>
  );
};

export default MobileSubmissionsSection;