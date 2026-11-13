import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/desktop/manifesto-desktop.css";

const DesktopManifesto = ({ getVal }) => {
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
      { threshold: 0.15 },
    );

    // Observe the entire section
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="au-manifesto reveal" ref={sectionRef}>
      {/* Quote Mark */}
      <div className="au-manifesto__quote-mark">"</div>

      {/* Blockquote */}
      <blockquote className="au-manifesto__blockquote">{quote}</blockquote>

      {/* Supporting Paragraph  */}
      <p className="au-manifesto__paragraph">{para}</p>
    </section>
  );
};

export default DesktopManifesto;
