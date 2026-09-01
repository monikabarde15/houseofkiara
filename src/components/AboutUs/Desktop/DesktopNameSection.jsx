import React, { useState, useEffect, useRef } from "react";
import "../../../styles/aboutus/desktop/name-section-desktop.css";
import { showToast } from "../shared/Toast";

const DesktopNameSection = () => {
  const [activeLetter, setActiveLetter] = useState("K");
  const [displayWord, setDisplayWord] = useState("Keepsake");
  const [displayDesc, setDisplayDesc] = useState(
    "Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard."
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);

  // Letter data 
  const letterData = {
    K: {
      word: "Keepsake",
      desc: "Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard."
    },
    A: {
      word: "Adored",
      desc: "Beloved. Adored. Those are the words we keep coming back to. Every piece here was loved once, and is built to be adored all over again."
    },
    I: {
      word: "Inherited",
      desc: "Memory, craft, and emotion are stitched into every piece. We don't let that get lost — we carry it forward, to whoever wears it next."
    },
    R: {
      word: "Renewed",
      desc: "Renewed purpose is the whole idea. A garment's first chapter was never meant to be its last."
    },
    A2: {
      word: "Always",
      desc: "Quietly distinctive, always. That is the kind of beloved House of Kaira was built to protect."
    }
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
      { threshold: 0.15 }
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
          <span>THE NAME</span>
          <span className="au-name__eyebrow-line"></span>
        </div>
        <h2 className="au-name__title">
          Where the story <em>begins</em>
        </h2>
        <p className="au-name__sub">
          Every house carries the meaning of its name. Ours carries five letters — 
          and every one of them means something to us. Tap each one.
        </p>
      </div>

      {/* Letters -  */}
      <div className="au-name__letters reveal">
        {["K", "A", "I", "R", "A2"].map((letter, index) => {
          const displayLetter = letter === "A2" ? "A" : letter;
          return (
            <button
              key={letter}
              className={`au-name__letter ${activeLetter === (letter === "A2" ? "A2" : letter) ? "active" : ""}`}
              onMouseEnter={() => handleLetterInteraction(letter === "A2" ? "A2" : letter)}
              onClick={() => handleLetterInteraction(letter === "A2" ? "A2" : letter)}
              onFocus={() => handleLetterInteraction(letter === "A2" ? "A2" : letter)}
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
          <p className={`au-name__display-word ${isAnimating ? "fade-out" : "fade-in"}`}>
            {displayWord}
          </p>
          <p className={`au-name__display-desc ${isAnimating ? "fade-out" : "fade-in"}`}>
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
          Beloved. Meaningful. Quietly distinctive. House of Kaira was created as a home 
          for beloved pieces — garments carrying memory, craft, and emotion, reimagined 
          for a longer, more meaningful life.
        </p>
        
        {/* Etymology Footnote - */}
        <p className="au-name__definition-footnote">
          <em>The name itself travels widely</em> — Sanskrit for peaceful, unique, 
          a ray of sunlight; Arabic for goodness and purity; <em>Latin carus</em> for 
          beloved; <em>Greek kairos</em> for the right moment. Many languages, it turns out, 
          were already circling the same feeling.
        </p>
      </div>

    </section>
  );
};

export default DesktopNameSection;