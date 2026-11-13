import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/mobile/manifesto-mobile.css";

const MobileManifesto = ({ getVal }) => {
  const quote = getVal ? getVal('about_manifesto_quote', 'Every garment deserves a second standing ovation.') : 'Every garment deserves a second standing ovation.';
  const para = getVal ? getVal('about_manifesto_body', "We don't sell clothes — we give them somewhere to go next. A lehenga that watched one wedding doesn't retire after it. It waits, carefully kept, for its next entrance.") : "We don't sell clothes — we give them somewhere to go next. A lehenga that watched one wedding doesn't retire after it. It waits, carefully kept, for its next entrance.";
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
      { threshold: 0.12 }, // Mobile threshold per spec
    );

    // Observe the entire section
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="mob-manifesto reveal" ref={sectionRef}>
      {/* Quote Mark - Mobile: 72px (vs 90px desktop) */}
      <div className="mob-manifesto__quote-mark">"</div>

      {/* Blockquote - Mobile: clamp(22px, 6vw, 32px) */}
      <blockquote className="mob-manifesto__blockquote">{quote}</blockquote>

      {/* Supporting Paragraph - Mobile: 15px */}
      <p className="mob-manifesto__paragraph">{para}</p>
    </section>
  );
};

export default MobileManifesto;
