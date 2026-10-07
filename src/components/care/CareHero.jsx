/**
 * House of Kaira - Care Policy Hero Band (Component C2)
 * Section 5.2 & 7.1 of Build Specification 2.0
 */

import React from "react";
import CareSearchBox from "./CareSearchBox";

export default function CareHero({ onSelectQuestion }) {
  return (
    <header className="dp-hero">
      <div className="dp-hero-inner">
        <div className="fq-eyebrow enter">
          <i aria-hidden="true" />
          <span>Our promise to every piece</span>
          <i aria-hidden="true" />
        </div>

        <h1 className="dp-h1 enter e2">
          Care, cleaning &amp; <em>damage</em>
        </h1>

        <p className="dp-sub enter e3">
          How we look after every piece, how you can too, and what happens in the
          rare moment something goes wrong, explained simply and fairly.
        </p>

        <CareSearchBox onSelectQuestion={onSelectQuestion} />
      </div>
    </header>
  );
}
