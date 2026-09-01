import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/desktop/philosophy-desktop.css";
import { showToast } from "../shared/Toast";

const DesktopPhilosophy = () => {
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
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal, .reveal-stagger");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Philosophy cards data 
  const philosophyCards = [
    {
      id: 1,
      icon: "star",
      heading: 'Celebration, <em>not ownership</em>',
      desc: "You don't need to own a moment to live it fully. Wear the showstopper for the night it was made for, then let it move on to someone else's celebration.",
    },
    {
      id: 2,
      icon: "document",
      heading: 'Curation, <em>not catalogue</em>',
      desc: "Every piece is chosen, not just accepted. If it doesn't meet our standard of craft and condition, it doesn't make it onto House of Kaira — no exceptions.",
    },
    {
      id: 3,
      icon: "refresh",
      heading: 'Renewal, <em>not relinquishment</em>',
      desc: "Preloved, never pre-owned. Every piece that passes through House of Kaira leaves more storied than it arrived, never less valuable.",
    },
    {
      id: 4,
      icon: "trust",
      heading: 'Trust, <em>both ways</em>',
      desc: "A bride trusts us with her biggest day. A lister trusts us with her wardrobe's legacy. We hold both with exactly the same care.",
    },
  ];

  // Icon SVG components - 
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
    <section className="au-philosophy" ref={sectionRef}>
      
      {/* Section Head -  */}
      <div className="au-philosophy__head reveal">
        <div className="au-philosophy__eyebrow">
          <span className="au-philosophy__eyebrow-line"></span>
          <span>What We Believe</span>
          <span className="au-philosophy__eyebrow-line"></span>
        </div>
        <h2 className="au-philosophy__title">
          Four ideas we will <em>never</em> compromise on
        </h2>
      </div>

      {/* Card Grid -  */}
      <div className="au-philosophy__grid reveal-stagger">
        {philosophyCards.map((card, index) => (
          <div 
            key={card.id} 
            className="au-philosophy__card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Icon */}
            <div className="au-philosophy__card-icon">
              {renderIcon(card.icon)}
            </div>
            
            {/* Heading */}
            <h3 
              className="au-philosophy__card-heading"
              dangerouslySetInnerHTML={{ __html: card.heading }}
            />
            
            {/* Description */}
            <p className="au-philosophy__card-desc">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default DesktopPhilosophy;