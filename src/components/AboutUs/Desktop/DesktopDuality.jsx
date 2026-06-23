import React, { useState, useEffect, useRef } from "react";
import "../../../styles/aboutus/desktop/duality-desktop.css";
import { Navigate, useNavigate } from "react-router-dom";
import { showToast } from "../shared/Toast";

const DesktopDuality = () => {
  const [activeTab, setActiveTab] = useState("renter");
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
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Handle tab switch 
  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  // Handle CTA clicks
  const handleRenterCTA = () => {
    showToast("Opening Collection...");

    navigate("/main-page");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  const handleListerCTA = () => {
    showToast("Opening List Your Piece...");
    navigate("/list-your-piece");
  };

  return (
    <section className="au-duality" ref={sectionRef}>
      
      {/* Section Head */}
      <div className="au-duality__head reveal">
        <div className="au-duality__eyebrow">
          <span className="au-duality__eyebrow-line"></span>
          <span>Two Sides, One Wardrobe</span>
          <span className="au-duality__eyebrow-line"></span>
        </div>
        <h2 className="au-duality__title">
          Whichever side of the <em>story</em> you're on
        </h2>
      </div>

      {/* Toggle Control  */}
      <div className="au-duality__toggle-wrapper reveal">
        <div className="au-duality__toggle" role="tablist">
          
          {/* Sliding Pill */}
          <div 
            className={`au-duality__slider ${activeTab === "lister" ? "right" : ""}`}
          ></div>
          
          {/* Tab 1: Renter */}
          <button
            className={`au-duality__tab ${activeTab === "renter" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "renter"}
            onClick={() => handleTabSwitch("renter")}
          >
            I'm celebrating
          </button>
          
          {/* Tab 2: Lister */}
          <button
            className={`au-duality__tab ${activeTab === "lister" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "lister"}
            onClick={() => handleTabSwitch("lister")}
          >
            I'm giving it new life
          </button>
          
        </div>
      </div>

      {/* Panels  */}
      <div className="au-duality__panels reveal">
        
        {/* Renter Panel */}
        <div className={`au-duality__panel ${activeTab === "renter" ? "active" : ""}`} id="panel-renter">
          <p className="au-duality__panel-label au-duality__panel-label--renter">
            For the bride, the groom, the guest of honour
          </p>
          <p className="au-duality__panel-body">
            Maybe it's your wedding. Maybe it's your best friend's. Whatever the occasion, 
            you deserve a piece worthy of it — without it living in your cupboard for the 
            other 364 days of the year. Rent it, buy it preloved, or buy it new: House of 
            Kaira holds every option to the same standard, exceptional design, honestly 
            presented, beautifully delivered.
          </p>
          <button 
            className="au-duality__cta au-duality__cta--renter"
            onClick={handleRenterCTA}
          >
            Start Browsing
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M13 6L19 12L13 18" />
            </svg>
          </button>
        </div>

        {/* Lister Panel */}
        <div className={`au-duality__panel ${activeTab === "lister" ? "active" : ""}`} id="panel-lister">
          <p className="au-duality__panel-label au-duality__panel-label--lister">
            For the keeper of something beautiful
          </p>
          <p className="au-duality__panel-body">
            Somewhere in your wardrobe is a lehenga that gave you the best night of your 
            life, and has done nothing since. List it with House of Kaira and let it earn 
            its place again, or sell it on, with full transparency, careful handling, and 
            a payout you can trust. Your only job is to say yes. We handle the rest.
          </p>
          <button 
            className="au-duality__cta au-duality__cta--lister"
            onClick={handleListerCTA}
          >
            List Your Piece
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M13 6L19 12L13 18" />
            </svg>
          </button>
        </div>

      </div>

    </section>
  );
};

export default DesktopDuality;