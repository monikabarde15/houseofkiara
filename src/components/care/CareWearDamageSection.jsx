/**
 * House of Kaira - Care Policy "Normal wear, or damage?" (Component C10)
 * Sections 5.10, 7.6 of Build Specification 2.0
 */

import React from "react";
import { WEAR_VS_DAMAGE_DATA } from "../../data/care/careRegistry";

export default function CareWearDamageSection({ renderQuestions }) {
  return (
    <section className="mod wd-sec" id="mod-line" aria-labelledby="wear-damage-title">
      <div className="mod-hd">
        <h2 id="wear-damage-title">
          Normal wear, or <em>damage?</em>
        </h2>
        <p>{WEAR_VS_DAMAGE_DATA.lead}</p>
      </div>

      <div className="wd-test">
        <p className="wd-t1">{WEAR_VS_DAMAGE_DATA.testSentence1}</p>
        <p className="wd-t2">{WEAR_VS_DAMAGE_DATA.testSentence2}</p>
      </div>

      <div className="wd-cols">
        {/* Left Column: Always on us */}
        <div className="wd-col ok">
          <h3 className="wd-h">{WEAR_VS_DAMAGE_DATA.alwaysOnUs.title}</h3>
          <p className="wd-def">{WEAR_VS_DAMAGE_DATA.alwaysOnUs.definition}</p>
          <ul className="wd-list">
            {WEAR_VS_DAMAGE_DATA.alwaysOnUs.items.map((item, idx) => (
              <li key={idx}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Assessed with care */}
        <div className="wd-col no">
          <h3 className="wd-h">{WEAR_VS_DAMAGE_DATA.assessedWithCare.title}</h3>
          <p className="wd-def">{WEAR_VS_DAMAGE_DATA.assessedWithCare.definition}</p>
          <ul className="wd-list">
            {WEAR_VS_DAMAGE_DATA.assessedWithCare.items.map((item, idx) => (
              <li key={idx}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Perspiration callout */}
      <div className="wd-sweat">
        <strong>One thing is always on us:</strong> natural perspiration, even
        when it needs more than our regular cleaning. A celebration is warm,
        joyful and full of dancing, and that is exactly how it should be.
      </div>

      {/* Pre-dispatch photographic note */}
      <div className="wd-foot">
        {WEAR_VS_DAMAGE_DATA.preDispatchLine}
      </div>

      {/* Questions about wear and damage */}
      <div className="mod-qs">
        <h4 className="q-lbl">Questions about wear and damage</h4>
        {renderQuestions && renderQuestions(WEAR_VS_DAMAGE_DATA.questionIds)}
      </div>
    </section>
  );
}
