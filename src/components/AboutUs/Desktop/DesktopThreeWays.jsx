import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/aboutus/desktop/three-ways-desktop.css";
import { showToast } from "../shared/Toast";

const DesktopThreeWays = ({ getVal }) => {
  const eyebrow = getVal ? getVal('about_three_eyebrow', 'How It Works') : 'How It Works';
  const title = getVal ? getVal('about_three_heading', 'Three ways to belong to the story') : 'Three ways to belong to the story';
  const lead = getVal ? getVal('about_three_lead', 'Every door leads to the same standard: curated pieces, honest condition, and a process built to feel as good as the clothes look.') : 'Every door leads to the same standard: curated pieces, honest condition, and a process built to feel as good as the clothes look.';
  const sectionRef = useRef(null);
  const navigate = useNavigate();

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
      { threshold: 0.15 },
    );

    const elements = sectionRef.current?.querySelectorAll(
      ".reveal, .reveal-stagger",
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Three Ways data
  const waysData = [
    {
      id: 1,
      numeral: "I",
      dotColor: "terracotta",
      heading: getVal ? getVal("about_door_0_title", "Rent") : "Rent",
      tagline: getVal ? getVal("about_door_0_lead", "For the night that deserves everything, and not a single thing more.") : "For the night that deserves everything, and not a single thing more.",
      description: getVal ? getVal("about_door_0_body", "Wear the showstopper. Send it back. No upkeep, no clutter, no compromise.") : "Wear the showstopper. Send it back. No upkeep, no clutter, no compromise.",
      linkLabel: "Explore Rentals",
      linkAction: "Opening Rent...",
    },
    {
      id: 2,
      numeral: "II",
      dotColor: "gold",
      heading: getVal ? getVal("about_door_1_title", "Buy Preloved") : "Buy Preloved",
      tagline: getVal ? getVal("about_door_1_lead", "A piece doesn't lose its story when it changes hands. It gains yours.") : "A piece doesn't lose its story when it changes hands. It gains yours.",
      description: getVal ? getVal("about_door_1_body", "Inspected, disclosed honestly, and priced like the treasure it already is.") : "Inspected, disclosed honestly, and priced like the treasure it already is.",
      linkLabel: "Shop Preloved",
      linkAction: "Opening Buy Preloved...",
    },
    {
      id: 3,
      numeral: "III",
      dotColor: "sage",
      heading: getVal ? getVal("about_door_2_title", "List Your Piece") : "List Your Piece",
      tagline: getVal ? getVal("about_door_2_lead", "Your wardrobe's finest shouldn't spend its life in the dark.") : "Your wardrobe's finest shouldn't spend its life in the dark.",
      description: getVal ? getVal("about_door_2_body", "We take care of every detail — cleaning, insurance, delivery, and payments.") : "We take care of every detail — cleaning, insurance, delivery, and payments.",
      linkLabel: "Become a Lister",
      linkAction: "Opening List Your Piece...",
    },
  ];

  // Handle link click
  const handleLinkClick = (way) => {
    showToast(way.linkAction);

    switch (way.id) {
      case 1:
        navigate("/main-page?section=rent");
        break;

      case 2:
        navigate("/main-page?section=preloved");
        break;

      case 3:
        navigate("/list-your-piece");
        break;

      default:
        break;
    }

    window.scrollTo(0, 0);
  };

  return (
    <section className="au-ways" ref={sectionRef}>
      {/* Section Head -*/}
      <div className="au-ways__head reveal">
        <div className="au-ways__eyebrow">
          <span className="au-ways__eyebrow-line"></span>
          <span>{eyebrow}</span>
          <span className="au-ways__eyebrow-line"></span>
        </div>
        <h2 className="au-ways__title">{title}</h2>
        <p className="au-ways__sub">{lead}</p>
      </div>

      {/* Card Grid  */}
      <div className="au-ways__grid reveal-stagger">
        {waysData.map((way, index) => (
          <div
            key={way.id}
            className={`au-ways__card au-ways__card--${way.dotColor}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Top Row: Numeral + Dot - */}
            <div className="au-ways__card-top">
              <span className="au-ways__card-numeral">{way.numeral}</span>
              <span
                className={`au-ways__card-dot au-ways__card-dot--${way.dotColor}`}
              ></span>
            </div>

            {/* Heading */}
            <h3 className="au-ways__card-heading">{way.heading}</h3>

            {/* Tagline - */}
            <p className="au-ways__card-tagline">{way.tagline}</p>

            {/* Description -  */}
            <p className="au-ways__card-desc">{way.description}</p>

            {/* Link - */}
            <button
              className="au-ways__card-link"
              onClick={() => handleLinkClick(way)}
            >
              {way.linkLabel}
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M13 6L19 12L13 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Note -  */}
      <p className="au-ways__note">
        A fourth way, Buy New, joins the house soon.
      </p>
    </section>
  );
};

export default DesktopThreeWays;
