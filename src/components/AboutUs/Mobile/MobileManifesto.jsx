import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/mobile/manifesto-mobile.css";

const MobileManifesto = () => {
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
      { threshold: 0.12 } // Mobile threshold per spec
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
      <blockquote className="mob-manifesto__blockquote">
        Every garment deserves a second <em>standing ovation</em>.
      </blockquote>
      
      {/* Supporting Paragraph - Mobile: 15px */}
      <p className="mob-manifesto__paragraph">
        We don't sell clothes — we give them somewhere to go next. 
        A lehenga that watched one wedding doesn't retire after it. 
        It waits, carefully kept, for its next entrance.
      </p>

    </section>
  );
};

export default MobileManifesto;