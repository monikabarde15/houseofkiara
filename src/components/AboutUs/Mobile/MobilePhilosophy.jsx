import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/mobile/philosophy-mobile.css";
import { showToast } from "../shared/Toast";

const MobilePhilosophy = ({ getVal }) => {
  const sectionRef = useRef(null);

  // Reveal animation observer - Mobile Spec §02.3
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

    const elements = sectionRef.current?.querySelectorAll(
      ".reveal, .reveal-stagger",
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Philosophy cards data - Same as desktop
  const philosophyCards = [
    {
      id: 1,
      icon: "star",
      heading: `${getVal ? getVal("about_b_b1_h1", "Celebration,") : "Celebration,"} <em>${getVal ? getVal("about_b_b1_h2", "not ownership") : "not ownership"}</em>`,
      desc: getVal ? getVal("about_b_b1_p", "You don't need to own a moment to live it fully. Wear the showstopper for the night it was made for, then let it move on to someone else's celebration.") : "You don't need to own a moment to live it fully. Wear the showstopper for the night it was made for, then let it move on to someone else's celebration.",
    },
    {
      id: 2,
      icon: "document",
      heading: `${getVal ? getVal("about_b_b2_h1", "Curation,") : "Curation,"} <em>${getVal ? getVal("about_b_b2_h2", "not catalogue") : "not catalogue"}</em>`,
      desc: getVal ? getVal("about_b_b2_p", "Every piece is chosen, not just accepted. If it doesn't meet our standard of craft and condition, it doesn't make it onto House of Kaira — no exceptions.") : "Every piece is chosen, not just accepted. If it doesn't meet our standard of craft and condition, it doesn't make it onto House of Kaira — no exceptions.",
    },
    {
      id: 3,
      icon: "refresh",
      heading: `${getVal ? getVal("about_b_b3_h1", "Turnaround,") : "Turnaround,"} <em>${getVal ? getVal("about_b_b3_h2", "not warehouse") : "not warehouse"}</em>`,
      desc: getVal ? getVal("about_b_b3_p", "Pieces belong on women at celebrations, not resting in dark boxes. Fast dispatch, fast cleaning, and pieces back on the rack within 48 hours.") : "Pieces belong on women at celebrations, not resting in dark boxes. Fast dispatch, fast cleaning, and pieces back on the rack within 48 hours.",
    },
    {
      id: 4,
      icon: "trust",
      heading: `${getVal ? getVal("about_b_b4_h1", "Care,") : "Care,"} <em>${getVal ? getVal("about_b_b4_h2", "first always") : "first always"}</em>`,
      desc: getVal ? getVal("about_b_b4_p", "A lehenga returns from a wedding with memories, and sometimes turmeric. Our Indore atelier treats every fabric with museum grade attention before it departs again.") : "A lehenga returns from a wedding with memories, and sometimes turmeric. Our Indore atelier treats every fabric with museum grade attention before it departs again.",
    },
  ];

  // Icon SVG components - Same as desktop
  const renderIcon = (iconType) => {
    switch (iconType) {
      case "star":
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.4 9.2H22L16 13.6L18.3 20.7L12 16.3L5.7 20.7L8 13.6L2 9.2H9.6L12 2Z" />
          </svg>
        );
      case "document":
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5V6A2 2 0 0 1 6 4H18A2 2 0 0 1 20 6V19.5" />
            <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
            <path d="M9 7H15" />
            <path d="M9 11H15" />
          </svg>
        );
      case "refresh":
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 12A9 9 0 1 0 5.6 5.7" />
            <path d="M3 4.5V9H7.5" />
          </svg>
        );
      case "trust":
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3.5 19C3.5 16 6 13.8 9 13.8S14.5 16 14.5 19" />
            <circle cx="18" cy="9" r="2.4" />
            <path d="M15.8 13.6C18.1 16 17.9 17.8 20 18.2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="mob-philosophy" ref={sectionRef}>
      {/* Section Head - Mobile Spec §09.1 */}
      <div className="mob-philosophy__head reveal">
        <div className="mob-philosophy__eyebrow">
          <span className="mob-philosophy__eyebrow-line"></span>
          <span>{getVal ? getVal("about_believe_eyebrow", "What We Believe") : "What We Believe"}</span>
          <span className="mob-philosophy__eyebrow-line"></span>
        </div>
        <h2 className="mob-philosophy__title">{getVal && getVal("about_believe_heading", null) ? getVal("about_believe_heading") : <>Four ideas we will <em>never</em> compromise on</>}</h2>
      </div>

      {/* Card Grid - Mobile Spec §09.2: flex column, gap: 1px */}
      <div className="mob-philosophy__grid reveal-stagger">
        {philosophyCards.map((card, index) => (
          <div
            key={card.id}
            className="mob-philosophy__card"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {/* Icon - Mobile: 32x32px */}
            <div className="mob-philosophy__card-icon">
              {renderIcon(card.icon)}
            </div>

            {/* Heading - Mobile: 19px */}
            <h3
              className="mob-philosophy__card-heading"
              dangerouslySetInnerHTML={{ __html: card.heading }}
            />

            {/* Description - Mobile: 13px */}
            <p className="mob-philosophy__card-desc">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MobilePhilosophy;
