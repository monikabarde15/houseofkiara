import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export default function ContactArrivalNote() {
  const { title, text, linkText, linkPath } = CONTACT_CONTENT.side.arrival;

  return (
    <div className="note" aria-labelledby="arrival-heading">
      <h3 id="arrival-heading">
        <ClockIcon />
        <span>{title}</span>
      </h3>
      <p>{text}</p>
      <Link to={linkPath} className="tl more">
        {linkText}
      </Link>
    </div>
  );
}
