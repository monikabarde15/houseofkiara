// src/components/LYP/record/AuthenticationStrip.tsx

import React from "react";
import { Submission } from "../types/submission.types";
import "./styles/AuthenticationStrip.css";

interface AuthenticationStripProps {
  submission: Submission;
}

export const AuthenticationStrip: React.FC<AuthenticationStripProps> = ({
  submission,
}) => {
  const designerName = submission.designer;

  if (!designerName) {
    return null;
  }

  const knownMapped = [
    "seema gujral",
    "gaurav gupta",
    "sabyasachi",
    "manish malhotra",
    "tarun tahiliani",
    "amit aggarwal",
    "ritukumar",
    "anamika khanna",
    "raw mango",
    "anushree reddy",
    "arpita mehta",
  ];

  const isMapped = knownMapped.some((d) =>
    designerName.toLowerCase().includes(d),
  );
  const riskLevel = "Low" as "High" | "Medium" | "Low";

  if (!isMapped) {
    return (
      <div className="auth-strip auth-strip-unmapped">
        <div className="auth-strip-text">
          <strong>“{designerName}”</strong> has no designer profile. The piece
          will file under Unmapped Labels — authentication has no named owner
          until the label is promoted.
        </div>
        <div className="auth-strip-action qlnk">
          Designers → Unmapped Labels
        </div>
      </div>
    );
  }

  const riskColor =
    riskLevel === "High"
      ? "auth-strip-high"
      : riskLevel === "Medium"
        ? "auth-strip-medium"
        : "auth-strip-low";

  return (
    <div className={`auth-strip ${riskColor}`}>
      <div className="auth-strip-row">
        <span className="auth-strip-risk">
          {riskLevel?.toUpperCase()}-RISK LABEL
        </span>
        <span className="auth-strip-designer qlnk">{designerName} →</span>
      </div>
      <div className="auth-strip-notes">
        No authentication notes on file yet — add them on the designer profile.
      </div>
      {riskLevel === "High" && (
        <div className="auth-strip-high-warning">
          High-risk brand — second check by another team member + purchase proof
          before approval.
        </div>
      )}
    </div>
  );
};
