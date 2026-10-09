import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";
import "../../styles/contact/contact-answers.css";

const ArrowIcon = () => (
  <svg
    className="arr"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function ContactAnswersSection() {
  const { title, intro, pages } = CONTACT_CONTENT.answers;
  const rowsCount = Math.ceil(pages.length / 2);

  return (
    <section className="answers" aria-labelledby="answers-title">
      <div className="wrap">
        <div className="answers-head">
          <h2 id="answers-title">{title}</h2>
          <p>{intro}</p>
        </div>

        <ul className="index" style={{ "--rows": rowsCount }}>
          {pages.map((item, idx) => {
            const isColEnd =
              idx + 1 === rowsCount || idx + 1 === pages.length;

            return (
              <li key={item.id} className={isColEnd ? "col-end" : ""}>
                <Link to={item.path}>
                  <span className="ix-name">{item.name}</span>
                  <span className="ix-desc">{item.desc}</span>
                  <ArrowIcon />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
