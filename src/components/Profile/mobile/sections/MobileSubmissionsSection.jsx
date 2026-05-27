import { useState } from "react";

import MobileSectionLabel from "../ui/MobileSectionLabel";
import MobileSubmissionRow from "../rows/MobileSubmissionRow";
import MobileSubmissionDetailSheet from "../sheets/MobileSubmissionDetailSheet";

import "../../../../styles/Profile/mobile/sections/MobileSubmissionsSection.css";

const MobileSubmissionsSection = () => {
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const submissions = [
    {
      id: "SUB-060525-001",
      name: "Red Bridal Lehenga",
      submittedDate: "6 May 2025",
      preferredOutcome: "Rent & Resale",
      pieceType: "Bridal Lehenga",
      designer: "Sabyasachi (bespoke)",
      colourFamily: "Red / Maroon",
      size: 'M (Blouse 36")',
      condition: "Excellent — worn once",
      timesWorn: "Worn once",
      originalPrice: 250000,
      photosSubmitted: "5 Photos",
      pickupCity: "Indore",
      imageGradient:
        "linear-gradient(160deg, #F0E8D8, #E0CDA8)"
    }
  ];

  return (
    <>
      <section className="profile-mobile-submissions-section">
        <MobileSectionLabel
          title="MY SUBMISSIONS"
          count={submissions.length}
        />

        <div className="profile-mobile-submissions-list">
          {submissions.map(
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