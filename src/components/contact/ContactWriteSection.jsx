import React from "react";
import ContactWriteForm from "./ContactWriteForm";
import ContactVisitCard from "./ContactVisitCard";
import ContactArrivalNote from "./ContactArrivalNote";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";
import "../../styles/contact/contact-write.css";

export default function ContactWriteSection({ showVisitCard = true }) {
  const { title, intro } = CONTACT_CONTENT.write;

  return (
    <section className="write" aria-labelledby="write-title">
      <div className="wrap">
        <div className="pair">
          {/* Left Column: Heading, Intro, and Writing Paper Form */}
          <div className="write-main">
            <h2 id="write-title">{title}</h2>
            <p className="write-sub">{intro}</p>
            <ContactWriteForm />
          </div>

          {/* Right Column: Side Aside for Visit and Arrival note (Section 13.1) */}
          <aside className="side" aria-label="Visits, and when a piece arrives">
            {showVisitCard && <ContactVisitCard />}
            <ContactArrivalNote />
          </aside>
        </div>
      </div>
    </section>
  );
}
