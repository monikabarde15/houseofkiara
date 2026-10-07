/**
 * House of Kaira - Care Policy "Our care, and If a piece needs restoring" (Component C12)
 * Sections 5.12, 7.8, 7.10 of Build Specification 2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import CareNotesList from "./CareNotesList";
import { OUR_CARE_DATA } from "../../data/care/careRegistry";

export default function CareRestoringSection({ renderQuestions }) {
  return (
    <section className="oc" id="mod-ours" aria-label="Our care and restoring">
      <div className="oc-grid">
        {/* Column 1: Before you, and after you */}
        <div className="oc-col">
          <h2>
            Before you, and <em>after you</em>
          </h2>
          <CareNotesList notes={OUR_CARE_DATA.beforeAfter.notes} />

          <h4 className="q-lbl">Questions about our care</h4>
          {renderQuestions &&
            renderQuestions(OUR_CARE_DATA.beforeAfter.questionIds)}
        </div>

        {/* Column 2: If a piece needs restoring */}
        <div className="oc-col">
          <h2>
            If a piece needs <em>restoring</em>
          </h2>

          <ol className="rs-steps">
            {OUR_CARE_DATA.restoring.steps.map((step) => (
              <li key={step.num}>
                <div className="rs-n" aria-hidden="true">
                  {step.num}
                </div>
                <h3 className="rs-k">{step.title}</h3>
                <p className="rs-d">{step.line}</p>
              </li>
            ))}
          </ol>

          <div className="rs-foot">
            We only ever charge what restoring a piece truly costs, never a penalty. Every amount and timing is explained in our{" "}
            <Link to="/deposit" className="lnk">
              Deposit Policy
            </Link>.
          </div>

          <h4 className="q-lbl">Questions about restoring</h4>
          {renderQuestions &&
            renderQuestions(OUR_CARE_DATA.restoring.questionIds)}
        </div>
      </div>
    </section>
  );
}
