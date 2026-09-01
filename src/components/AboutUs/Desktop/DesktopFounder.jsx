import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/desktop/founder-desktop.css";

const DesktopFounder = () => {
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

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="au-founder" ref={sectionRef}>
      
      {/* Grid Container */}
      <div className="au-founder__grid">
        
        {/* Monogram Column */}
        <div className="au-founder__monogram reveal">
          <div className="au-founder__monogram-circle">
            <div className="au-founder__monogram-inner"></div>
            <span className="au-founder__monogram-letter">S</span>
          </div>
          <div className="au-founder__monogram-name">Soumya</div>
          <div className="au-founder__monogram-title">Founder, House of Kaira</div>
        </div>

        {/* Copy Column - Spec §11.2 */}
        <div className="au-founder__copy reveal">
          
          {/* Eyebrow */}
          <div className="au-founder__eyebrow">
            <span className="au-founder__eyebrow-line"></span>
            <span>From The Founder</span>
            <span className="au-founder__eyebrow-line"></span>
          </div>

          {/* H2 */}
          <h2 className="au-founder__title">
            Why I started <em>House of Kaira</em>
          </h2>

          {/* Paragraphs - Spec §11.3 */}
          <p className="au-founder__body">
            Before I trained my eye on lehengas, I was trained to read a balance sheet.
          </p>

          <p className="au-founder__body">
            Three years as a chartered accountant teach you to ask one question about 
            anything of value: is it being used? An asset sitting idle, however expensive, 
            is a number nobody wants to explain. When I left finance for a fashion business 
            degree at the London College of Fashion, that question simply followed me into 
            a new industry.
          </p>

          <p className="au-founder__body">
            A bridal lehenga in India can cost as much as a small car, and is, more often 
            than anyone likes to admit, worn exactly once. It doesn't stop being beautiful 
            after the wedding. It just runs out of places to go.
          </p>

          <p className="au-founder__body">
            House of Kaira is the place I built for that lehenga to go next — a home for 
            cherished beauty and renewed purpose, exactly the way the name was meant to be 
            read. Some things are simply too beautiful to only get to live once.
          </p>

          {/* Sign-off - Spec §11.3 */}
          <div className="au-founder__signoff">
            <p className="au-founder__signoff-name">Soumya</p>
            <p className="au-founder__signoff-title">Founder, House of Kaira</p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default DesktopFounder;