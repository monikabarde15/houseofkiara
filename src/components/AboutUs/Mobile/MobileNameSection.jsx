import React, { useState, useEffect, useRef } from "react";
import "../../../styles/aboutus/mobile/name-section-mobile.css";
import { showToast } from "../shared/Toast";

const MobileNameSection = ({ getVal }) => {
  const [activeLetter, setActiveLetter] = useState("K");
  const [displayWord, setDisplayWord] = useState(() => getVal ? getVal("about_letter_word_0", "Keepsake") : "Keepsake");
  const [displayDesc, setDisplayDesc] = useState(() => getVal ? getVal("about_letter_meaning_0", "Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard.") : "Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard.");
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);

  // Letter data - same as desktop
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

  // Handle letter tap/click - Spec §18 (Mobile Interactions)
  const handleLetterInteraction = (letter) => {
    if (isAnimating || activeLetter === letter) return;

    setIsAnimating(true);

    const data = letterData[letter === "A2" ? "A2" : letter];

    setActiveLetter(letter);
    setDisplayWord(data.word);
    setDisplayDesc(data.desc);

    setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  // Reveal animation observer - Spec §02.3
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 }, // Mobile threshold per spec
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Set default active state on load
  useEffect(() => {
    setActiveLetter("K");
  }, []);

  return (
    <section className="mob-name" ref={sectionRef}>
      {/* Section Head - Mobile Spec §07.1 */}
      <div className="mob-name__head reveal">
        <div className="mob-name__eyebrow">
          <span className="mob-name__eyebrow-line"></span>
          <span>{getVal ? getVal("about_name_eyebrow", "THE NAME") : "THE NAME"}</span>
          <span className="mob-name__eyebrow-line"></span>
        </div>
        <h2 className="mob-name__title">{getVal && getVal("about_name_heading", null) ? getVal("about_name_heading") : <>Where the story <em>begins</em></>}</h2>
        <p className="mob-name__sub">{getVal ? getVal("about_name_lead", "Every house carries the meaning of its name. Ours carries five letters — and every one of them means something to us. Tap each one.") : "Every house carries the meaning of its name. Ours carries five letters — and every one of them means something to us. Tap each one."}</p>
      </div>

      {/* Letters - Mobile Spec §07.2 - Letter size 56px, gap 8px, horizontal scroll fallback */}
      <div className="mob-name__letters reveal">
        {["K", "A", "I", "R", "A2"].map((letter, index) => {
          const displayLetter = letter === "A2" ? "A" : letter;
          return (
            <button
              key={letter}
              className={`mob-name__letter ${activeLetter === (letter === "A2" ? "A2" : letter) ? "active" : ""}`}
              onClick={() =>
                handleLetterInteraction(letter === "A2" ? "A2" : letter)
              }
              onTouchStart={() =>
                handleLetterInteraction(letter === "A2" ? "A2" : letter)
              }
              aria-label={`Letter ${displayLetter}: ${letterData[letter === "A2" ? "A2" : letter].word}`}
              tabIndex={0}
            >
              {displayLetter}
              <span className="mob-name__letter-underline"></span>
            </button>
          );
        })}
      </div>

      {/* Display Area - Mobile Spec §07.4 */}
      <div className="mob-name__display reveal">
        <div className="mob-name__display-content">
          <p
            className={`mob-name__display-word ${isAnimating ? "fade-out" : "fade-in"}`}
          >
            {displayWord}
          </p>
          <p
            className={`mob-name__display-desc ${isAnimating ? "fade-out" : "fade-in"}`}
          >
            {displayDesc}
          </p>
        </div>

        {/* Hint Line - Mobile Spec §07.4 */}
        <p className="mob-name__hint">
          Keepsake · Adored · Inherited · Renewed · Always
        </p>
      </div>

      {/* Definition Block - Mobile Spec §07.5 */}
      <div className="mob-name__definition reveal">
        <p className="mob-name__definition-lede">
          "To us, <em>Kaira</em> means cherished beauty, renewed purpose, and
          garments that deserve more than one life."
        </p>
        <p className="mob-name__definition-sub">
          Beloved. Meaningful. Quietly distinctive. House of Kaira was created
          as a home for beloved pieces — garments carrying memory, craft, and
          emotion, reimagined for a longer, more meaningful life.
        </p>

        {/* Etymology Footnote - Mobile Spec §07.6 */}
        <p className="mob-name__definition-footnote">
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

export default MobileNameSection;
