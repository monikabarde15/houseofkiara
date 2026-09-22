// src/components/FAQ/Policies/PoliciesLine.jsx
// Policies line (E1) per Section E1 & Appendix F
import React from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_FIGURES } from "../../../data/faq/adminFigures";

const POLICY_LINKS = [
  { label: "Deposit Policy", path: "/deposit-policy" },
  { label: "Refund & Cancellation Policy", path: "/refunds-cancellations" },
  { label: "Care, Cleaning & Damage Policy", path: "/care-cleaning-damage" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
];

export default function PoliciesLine({ onShowToast }) {
  const navigate = useNavigate();

  const handlePolicyClick = (path, label) => {
    // Navigate or show toast if page route doesn't exist yet
    navigate(path);
  };

  return (
    <section className="pol" aria-label="Policies summary">
      <div className="pol-in">
        <b>The full policies</b>
        {POLICY_LINKS.map((link) => (
          <button
            key={link.label}
            type="button"
            className="pol-link"
            onClick={() => handlePolicyClick(link.path, link.label)}
          >
            {link.label}
          </button>
        ))}
      </div>
      <p>
        These answers explain our policies in plain words. Where the two ever differ, the full policy applies. Last reviewed {ADMIN_FIGURES.last_reviewed_date}.
      </p>
    </section>
  );
}
