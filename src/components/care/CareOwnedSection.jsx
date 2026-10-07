/**
 * House of Kaira - Care Policy "A piece that is yours to keep" (Component C13)
 * Sections 5.13, 6.5, 7.9, 7.10 of Build Specification 2.0
 */

import React from "react";
import CareNotesList from "./CareNotesList";
import { PIECES_YOU_OWN_DATA } from "../../data/care/careRegistry";

export default function CareOwnedSection({ renderQuestions }) {
  return (
    <section className="ow" id="mod-owned" aria-labelledby="owned-title">
      <div className="ow-grid" id="ow-grid-block">
        {/* Left Column: Heading and Lead Paragraphs */}
        <div className="ow-col-info">
          <h2 id="owned-title">
            A piece that is <em>yours to keep</em>
          </h2>

          <p className="ow-lead">
            A preloved piece is yours for every celebration to come.{" "}
            <strong>
              Every one is professionally cleaned before it leaves us, and arrives checked and pressed.
            </strong>{" "}
            A piece that has never been worn is checked and pressed instead of cleaned, so it stays exactly as new.
          </p>

          <p className="ow-lead">
            Because each piece is made differently, its own care notes are on its page, written for its fabric and craftsmanship, and you can open it any time from your order in My Account. A few things hold true for every one of them.
          </p>
        </div>

        {/* Right Column: 6 Preloved Care Notes */}
        <div className="ow-col-notes">
          <CareNotesList notes={PIECES_YOU_OWN_DATA.notes} />
        </div>
      </div>

      {/* Questions about pieces you own */}
      <div className="mod-qs">
        <h4 className="q-lbl">Questions about pieces you own</h4>
        {renderQuestions && renderQuestions(PIECES_YOU_OWN_DATA.questionIds)}
      </div>
    </section>
  );
}
