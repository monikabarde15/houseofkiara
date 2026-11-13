import React from "react";
import ContactWriteForm from "./ContactWriteForm";
import ContactVisitCard from "./ContactVisitCard";
import ContactArrivalNote from "./ContactArrivalNote";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";
import "../../styles/contact/contact-write.css";

export default function ContactWriteSection({
  showVisitCard = true,
  contactSettings,
  getVal,
}) {
  const { title, intro } = CONTACT_CONTENT.write;
  const writeTitle = getVal ? getVal("contact_write_heading", title) : title;
  const writeIntro = getVal
    ? (getVal("contact_write_lead", null) || getVal("contact_write_sub", intro))
    : intro;

  return (
    <section className="write" aria-labelledby="write-title">
      <div className="wrap">
        <div className="pair">
          {/* Left Column: Heading, Intro, and Writing Paper Form */}
          <div className="write-main">
            <h2 id="write-title">{writeTitle}</h2>
            <p className="write-sub">{writeIntro}</p>
            <ContactWriteForm getVal={getVal} />
          </div>

          {/* Right Column: Side Aside for Visit and Arrival note (Section 13.1) */}
          <aside className="side" aria-label="Visits, and when a piece arrives">
            {showVisitCard && (
              <ContactVisitCard
                getVal={getVal}
                contactSettings={contactSettings}
              />
            )}
            <ContactArrivalNote getVal={getVal} />
          </aside>
        </div>
      </div>
    </section>
  );
}
