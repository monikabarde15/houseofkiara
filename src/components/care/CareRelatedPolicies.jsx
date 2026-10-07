/**
 * House of Kaira - Care Policy Related Policies (Component C14)
 * Sections 5.14, 6.10, 7.11 of Build Specification 2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { RELATED_POLICIES_DATA } from "../../data/care/careRegistry";
import { CARE_SETTINGS } from "../../data/care/careSettings";

export default function CareRelatedPolicies() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="pol" aria-label="Related policies and terms">
      <div className="pol-in">
        <b>Related policies:</b>
        {RELATED_POLICIES_DATA.map((p) => (
          <Link key={p.href} to={p.href}>
            {p.title}
          </Link>
        ))}
      </div>

      <p>
        This page sets out how we care for every piece, and how wear and damage
        are decided, in plain language. Should it ever differ from our Terms
        &amp; Conditions, the Terms apply. Last reviewed{" "}
        {CARE_SETTINGS.last_reviewed}.{" "}
        <button type="button" onClick={handlePrint}>
          Print or save as PDF
        </button>
      </p>
    </section>
  );
}
