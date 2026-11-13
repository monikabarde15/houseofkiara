import React, { useState, useEffect, useRef } from "react";
import "../../../styles/aboutus/desktop/name-section-desktop.css";
import { showToast } from "../shared/Toast";

const DesktopNameSection = ({ getVal }) => {
  const [activeLetter, setActiveLetter] = useState("K");
  const [displayWord, setDisplayWord] = useState(() => getVal ? getVal("about_letter_word_0", "Keepsake") : "Keepsake");
  const [displayDesc, setDisplayDesc] = useState(() => getVal ? getVal("about_letter_meaning_0", "Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard.") : "Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard.");
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);

  // Letter data
  const letterData = {
    K: {
      word: getVal ? getVal("about_letter_word_0", "Keepsake") : "Keepsake",
      desc: getVal ? getVal("about_letter_meaning_0", "Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard.") : "Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard.",
    },
    A: {
      word: getVal ? getVal("about_letter_word_1", "Authentic") : "Authentic",
      desc: getVal ? getVal("about_letter_meaning_1", "Pristine condition guaranteed, verified by master artisans before every wear and documented in detail.") : "Pristine condition guaranteed, verified by master artisans before every wear and documented in detail.",
    },
    I: {
      word: getVal ? getVal("about_letter_word_2", "Inherited") : "Inherited",
      desc: getVal ? getVal("about_letter_meaning_2", "Honouring the craft and hand-loomed heritage passed down across celebrations and generations.") : "Honouring the craft and hand-loomed heritage passed down across celebrations and generations.",
    },
    R: {
      word: getVal ? getVal("about_letter_word_3", "Revolving") : "Revolving",
      desc: getVal ? getVal("about_letter_meaning_3", "Giving storied garments a second life and a new audience, keeping exceptional design in continuous motion.") : "Giving storied garments a second life and a new audience, keeping exceptional design in continuous motion.",
    },
    A2: {
      word: getVal ? getVal("about_letter_word_4", "Affection") : "Affection",
      desc: getVal ? getVal("about_letter_meaning_4", "Personal concierge care, bespoke fitting adjustments, and botanical restoration for every silhouette.") : "Personal concierge care, bespoke fitting adjustments, and botanical restoration for every silhouette.",
    },
  };

  // Handle letter click/hover/focus
  const handleLetterInteraction = (letter) => {
    if (isAnimating || activeLetter === letter) return;

    setIsAnimating(true);

    // Get data for this letter
    const data = letterData[letter === "A2" ? "A2" : letter];

    // Update display with animation
    setActiveLetter(letter);
    setDisplayWord(data.word);
    setDisplayDesc(data.desc);

    setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  // Reveal animation observer -
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

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Set default active state on load -
  useEffect(() => {
    // K is active by default
    setActiveLetter("K");
  }, []);

  return (
    <section className="au-name" ref={sectionRef}>
      {/* Section Head - */}
      <div className="au-name__head reveal">
        <div className="au-name__eyebrow">
          <span className="au-name__eyebrow-line"></span>
          <span>{getVal ? getVal("about_name_eyebrow", "THE NAME") : "THE NAME"}</span>
          <span className="au-name__eyebrow-line"></span>
        </div>
        <h2 className="au-name__title">
          {getVal && getVal("about_name_heading", null) ? getVal("about_name_heading") : <>Where the story <em>begins</em></>}
        </h2>
        <p className="au-name__sub">{getVal ? getVal("about_name_lead", "Every house carries the meaning of its name. Ours carries five letters — and every one of them means something to us. Tap each one.") : "Every house carries the meaning of its name. Ours carries five letters — and every one of them means something to us. Tap each one."}</p>
      </div>

      {/* Letters -  */}
      <div className="au-name__letters reveal">
        {["K", "A", "I", "R", "A2"].map((letter, index) => {
          const displayLetter = letter === "A2" ? "A" : letter;
          return (
            <button
              key={letter}
              className={`au-name__letter ${activeLetter === (letter === "A2" ? "A2" : letter) ? "active" : ""}`}
              onMouseEnter={() =>
                handleLetterInteraction(letter === "A2" ? "A2" : letter)
              }
              onClick={() =>
                handleLetterInteraction(letter === "A2" ? "A2" : letter)
              }
              onFocus={() =>
                handleLetterInteraction(letter === "A2" ? "A2" : letter)
              }
              aria-label={`Letter ${displayLetter}: ${letterData[letter === "A2" ? "A2" : letter].word}`}
              tabIndex={0}
            >
              {displayLetter}
              <span className="au-name__letter-underline"></span>
            </button>
          );
        })}
      </div>

      {/* Display Area -  */}
      <div className="au-name__display reveal">
        <div className="au-name__display-content">
          <p
            className={`au-name__display-word ${isAnimating ? "fade-out" : "fade-in"}`}
          >
            {displayWord}
          </p>
          <p
            className={`au-name__display-desc ${isAnimating ? "fade-out" : "fade-in"}`}
          >
            {displayDesc}
          </p>
        </div>

        {/* Hint Line - */}
        <p className="au-name__hint">
          Keepsake · Adored · Inherited · Renewed · Always
        </p>
      </div>

      {/* Definition Block - */}
      <div className="au-name__definition reveal">
        <p className="au-name__definition-lede">
          "To us, <em>Kaira</em> means cherished beauty, renewed purpose, and
          garments that deserve more than one life."
        </p>
        <p className="au-name__definition-sub">
          Beloved. Meaningful. Quietly distinctive. House of Kaira was created
          as a home for beloved pieces — garments carrying memory, craft, and
          emotion, reimagined for a longer, more meaningful life.
        </p>

        {/* Etymology Footnote - */}
        <p className="au-name__definition-footnote">
          <em>The name itself travels widely</em> — Sanskrit for peaceful,
          unique, a ray of sunlight; Arabic for goodness and purity;{" "}
          <em>Latin carus</em> for beloved; <em>Greek kairos</em> for the right
          moment. Many languages, it turns out, were already circling the same
          feeling.
        </p>
      </div>
    </section>
  );
};

export default DesktopNameSection;
