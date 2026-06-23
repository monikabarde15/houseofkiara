import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/desktop/manifesto-desktop.css";

const DesktopManifesto = () => {
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
      <blockquote className="au-manifesto__blockquote">
        Every garment deserves a second <em>standing ovation</em>.
      </blockquote>
      
      {/* Supporting Paragraph  */}
      <p className="au-manifesto__paragraph">
        We don't sell clothes — we give them somewhere to go next. 
        A lehenga that watched one wedding doesn't retire after it. 
        It waits, carefully kept, for its next entrance.
      </p>

    </section>
  );
};

export default DesktopManifesto;