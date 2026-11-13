import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/mobile/founder-mobile.css";

const MobileFounder = ({ getVal }) => {
  const sectionRef = useRef(null);

  // Reveal animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 },
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="mob-founder" ref={sectionRef}>
      {/* Mobile Layout: Monogram centred at top, then copy below — fully stacked */}
      <div className="mob-founder__wrapper">
        {/* Monogram  */}
        <div className="mob-founder__monogram reveal">
          <div className="mob-founder__monogram-circle">
            <div className="mob-founder__monogram-inner"></div>
            <span className="mob-founder__monogram-letter">{getVal ? getVal("about_founder_initials", "S") : "S"}</span>
          </div>
          <div className="mob-founder__monogram-name">{getVal ? getVal("about_founder_name", "Soumya") : "Soumya"}</div>
          <div className="mob-founder__monogram-title">{getVal ? getVal("about_founder_role", "Founder, House of Kaira") : "Founder, House of Kaira"}</div>
        </div>

        {/* Copy Block  */}
        <div className="mob-founder__copy reveal">
          {/* Eyebrow */}
          <div className="mob-founder__eyebrow">
            <span className="mob-founder__eyebrow-line"></span>
            <span>{getVal ? getVal("about_founder_eyebrow", "From The Founder") : "From The Founder"}</span>
            <span className="mob-founder__eyebrow-line"></span>
          </div>

          {/* H2 */}
          <h2 className="mob-founder__title">{getVal && getVal("about_founder_heading", null) ? getVal("about_founder_heading") : <>Why I started <em>House of Kaira</em></>}</h2>

          {/* Body Paragraphs */}
          <p className="mob-founder__body">{getVal ? getVal("about_founder_p1", "Before I trained my eye on lehengas, I was trained to read a balance sheet.") : "Before I trained my eye on lehengas, I was trained to read a balance sheet."}</p>

          <p className="mob-founder__body">{getVal ? getVal("about_founder_p2", "Three years as a chartered accountant teach you to ask one question about anything of value: is it being used? An asset sitting idle, however expensive, is a number nobody wants to explain. When I left finance for a fashion business degree at the London College of Fashion, that question simply followed me into a new industry.") : "Three years as a chartered accountant teach you to ask one question about anything of value: is it being used? An asset sitting idle, however expensive, is a number nobody wants to explain. When I left finance for a fashion business degree at the London College of Fashion, that question simply followed me into a new industry."}</p>

          <p className="mob-founder__body">
            A bridal lehenga in India can cost as much as a small car, and is,
            more often than anyone likes to admit, worn exactly once. It doesn't
            stop being beautiful after the wedding. It just runs out of places
            to go.
          </p>

          <p className="mob-founder__body">{getVal ? getVal("about_founder_p3", "House of Kaira is the place I built for that lehenga to go next — a home for cherished beauty and renewed purpose, exactly the way the name was meant to be read. Some things are simply too beautiful to only get to live once.") : "House of Kaira is the place I built for that lehenga to go next — a home for cherished beauty and renewed purpose, exactly the way the name was meant to be read. Some things are simply too beautiful to only get to live once."}</p>

          {/* Sign-off */}
          <div className="mob-founder__signoff">
            <p className="mob-founder__signoff-name">{getVal ? getVal("about_founder_sig", getVal("about_founder_name", "Soumya")) : "Soumya"}</p>
            <p className="mob-founder__signoff-title">
              Founder, House of Kaira
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileFounder;
