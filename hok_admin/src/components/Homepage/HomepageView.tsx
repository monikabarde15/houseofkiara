import React, { useState } from "react";
import "./HomepageView.css";
import Hero from "./Sections/Hero/Hero";
import HowItWorks from "./Sections/HowItWorks/HowItWorks";
import FeaturedPieces from "./Sections/FeaturedPieces/FeaturedPieces";
import ShopByCategoryBand from "./ShopByCategory/ShopByCategoryBand";
import ShopByOccasion from "./Shopbyoccasion/Shopbyoccasion";
interface HomepageViewProps {
  homepage?: any;
  onUpdateHomepage?: (homepage: any) => void;
}

const HomepageView: React.FC<HomepageViewProps> = ({
  homepage,
  onUpdateHomepage,
}) => {

  /* =====================================================
     SELECTED HOMEPAGE BAND
  ===================================================== */

  const [selectedBand, setSelectedBand] = useState("hero");


  /* =====================================================
     HOMEPAGE BANDS
  ===================================================== */

  const homepageBands = [
    {
      id: "hero",
      number: 1,
      title: "HERO",
      eyebrow: "INDIA'S PREMIER CIRCULAR FASHION PLATFORM",
      preview: (
        <>
          Wear it with <em>love.</em>
          <br />
          Pass it on.
        </>
      ),
      status: "issue",
    },

    {
      id: "how-it-works",
      number: 2,
      title: "HOW IT WORKS",
      eyebrow: "SIMPLE BY DESIGN",
      preview: (
        <>
          How House of Kaira <em>works</em>
        </>
      ),
      status: "clean",
    },

    {
      id: "featured-pieces",
      number: 3,
      title: "FEATURED PIECES",
      eyebrow: "HANDPICKED FOR YOU",
      preview: (
        <>
          Featured <em>Pieces</em>
        </>
      ),
      status: "issue",
    },

    {
      id: "shop-by-category",
      number: 4,
      title: "SHOP BY CATEGORY",
      eyebrow: "CURATED FOR EVERY OCCASION",
      preview: (
        <>
          Shop by <em>Category</em>
        </>
      ),
      status: "issue",
    },

    {
      id: "shop-by-occasion",
      number: 5,
      title: "SHOP BY OCCASION",
      eyebrow: "",
      preview: (
        <>
          Shop by Occasion —{" "}
          <em>not showing (not built)</em>
        </>
      ),
      status: "soon",
      hidden: true,
    },

    {
      id: "our-commitment",
      number: 6,
      title: "OUR COMMITMENT",
      eyebrow: "OUR COMMITMENT",
      preview: (
        <>
          Fashion that gives <em>back</em>
        </>
      ),
      status: "clean",
    },

    {
      id: "featured-designers",
      number: 7,
      title: "FEATURED DESIGNERS",
      eyebrow: "TRUSTED CREATORS",
      preview: (
        <>
          Featured <em>Designers</em>
        </>
      ),
      status: "issue",
    },

    {
      id: "testimonials",
      number: 8,
      title: "TESTIMONIALS",
      eyebrow: "WORN, LOVED & SHARED ACROSS INDIA",
      preview: (
        <>
          What our customers <em>say</em>
        </>
      ),
      status: "clean",
    },

    {
      id: "instagram",
      number: 9,
      title: "INSTAGRAM",
      eyebrow: "OUR COMMUNITY",
      preview: (
        <>
          As seen on <em>Instagram</em>
        </>
      ),
      status: "info",
    },
  ];


  /* =====================================================
     RENDER SELECTED BAND
  ===================================================== */

  const renderSelectedBand = () => {

    switch (selectedBand) {
//Hero Section
      case "hero":
        return <Hero />;
        
//How it works Section
      case "how-it-works":
  return <HowItWorks />;

      case "featured-pieces":
  return <FeaturedPieces />;

      case "shop-by-category":
        return <ShopByCategoryBand />
        
      case "shop-by-occasion":
        return <ShopByOccasion />;

      case "our-commitment":
        return (
          <div className="homepage-coming-soon">
            <h2>Our Commitment</h2>
            <p>
              Our Commitment editor will be implemented next.
            </p>
          </div>
        );

      case "featured-designers":
        return (
          <div className="homepage-coming-soon">
            <h2>Featured Designers</h2>
            <p>
              Featured Designers editor will be implemented next.
            </p>
          </div>
        );

      case "testimonials":
        return (
          <div className="homepage-coming-soon">
            <h2>Testimonials</h2>
            <p>
              Testimonials editor will be implemented next.
            </p>
          </div>
        );

      case "instagram":
        return (
          <div className="homepage-coming-soon">
            <h2>Instagram</h2>
            <p>
              Instagram editor will be implemented next.
            </p>
          </div>
        );

      default:
        return <Hero />;
    }
  };


  return (
    <div className="homepage-view">

      {/* =====================================================
          HOMEPAGE TOP BAR
      ===================================================== */}

      <header className="homepage-topbar">

        <div className="homepage-topbar-left">

          <button
            type="button"
            className="homepage-back-button"
          >
            <span className="back-icon">
              ‹
            </span>

            <span>
              Back to Dashboard
            </span>
          </button>


          <span className="homepage-page-name">
            Homepage
          </span>

        </div>


        <div className="homepage-topbar-right">

          <button
            type="button"
            className="homepage-topbar-button"
          >
            <span>
              ↗
            </span>

            View Live Site
          </button>


          <button
            type="button"
            className="homepage-topbar-button homepage-notification-button"
          >
            <span>
              ♧
            </span>

            Notifications

            <span className="homepage-notification-count">
              12
            </span>

          </button>


          <button
            type="button"
            className="homepage-save-button"
          >
            Save Changes
          </button>

        </div>

      </header>


      {/* =====================================================
          HOMEPAGE CONTENT
      ===================================================== */}

      <main className="homepage-main">


        {/* ===================================================
            PAGE INTRO
        =================================================== */}

        <section className="homepage-intro">

          <div className="homepage-intro-eyebrow">
            SITE SETTINGS
          </div>


          <h1>
            Homepage
          </h1>


          <p>
            Everything between the header and the footer.
            Pick a band, change it, watch the preview. The top
            bar, the menu and the footer are the chrome and live
            in Site Settings; anything another module owns is
            pointed at here, never retyped.
          </p>

        </section>


        {/* ===================================================
            HOMEPAGE TOOLBAR
        =================================================== */}

        <section className="homepage-toolbar">

          <div className="homepage-search-wrapper">

            <span className="homepage-search-icon">
              ⌕
            </span>


            <input
              type="text"
              placeholder='Find a setting — “hero”, “quotes”, “layout”'
              className="homepage-search-input"
            />

          </div>


          <div className="homepage-save-status">
            Everything here is live on the site
          </div>


          <button
            type="button"
            className="homepage-publish-button"
          >
            Publish
          </button>

        </section>


        {/* ===================================================
            WORKSPACE
        =================================================== */}

        <section className="homepage-workspace">


          {/* =================================================
              LEFT NAVIGATOR
          ================================================= */}

          <aside className="homepage-navigator">


            {/* NAVIGATOR HEADER */}

            <div className="homepage-navigator-header">

              <span className="homepage-navigator-label">
                THE PAGE
              </span>


              <div className="homepage-device-switcher">

                <button
                  type="button"
                  className="homepage-device-active"
                >
                  Desktop
                </button>


                <button
                  type="button"
                >
                  Mobile
                </button>

              </div>


              <button
                type="button"
                className="homepage-collapse-button"
              >
                «
              </button>

            </div>


            {/* =================================================
                PAGE MAP
            ================================================= */}

            <div className="homepage-page-preview">


              {/* TOP CHROME */}

              <div className="homepage-preview-chrome">
                ANNOUNCEMENT · HEADER
              </div>


              {/* =================================================
                  HOMEPAGE BANDS
              ================================================= */}

              <div className="homepage-band-list">

                {homepageBands.map((band) => {

                  const isSelected =
                    selectedBand === band.id;


                  return (
                    <button
                      key={band.id}
                      type="button"
                      className={[
                        "homepage-band-item",

                        isSelected
                          ? "homepage-band-item-selected"
                          : "",

                        band.hidden
                          ? "homepage-band-item-hidden"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}

                      onClick={() =>
                        setSelectedBand(band.id)
                      }
                    >


                      {/* BAND NUMBER */}

                      <span className="homepage-band-number">
                        {band.number}
                      </span>


                      {/* BAND CONTENT */}

                      <span className="homepage-band-content">


                        {/* TITLE */}

                        <span className="homepage-band-title">
                          {band.title}
                        </span>


                        {/* EYEBROW */}

                        {band.eyebrow && (
                          <span className="homepage-band-eyebrow">
                            {band.eyebrow}
                          </span>
                        )}


                        {/* PREVIEW */}

                        <span className="homepage-band-preview">
                          {band.preview}
                        </span>


                        {/* HERO MINI PREVIEW */}

                        {band.id === "hero" && (
                          <>

                            <span className="homepage-band-cta">
                              EXPLORE COLLECTION
                            </span>


                            <span className="homepage-band-mini-layout">

                              <span>
                                words
                              </span>

                              <span />

                            </span>

                          </>
                        )}


                        {/* FEATURED PIECES MINI PREVIEW */}

                        {band.id === "featured-pieces" && (
                          <span className="homepage-band-swatches">

                            <span />
                            <span />
                            <span />
                            <span />

                          </span>
                        )}


                        {/* SHOP BY CATEGORY MINI PREVIEW */}

                        {band.id === "shop-by-category" && (
                          <>

                            <span className="homepage-band-category-grid">

                              <span />
                              <span />
                              <span />
                              <span />

                            </span>


                            <span className="homepage-band-meta">
                              Bridal Lehengas · Sherwanis · Sarees ·
                              Anarkalis · Indo-Western
                            </span>

                          </>
                        )}


                        {/* FEATURED DESIGNERS MINI PREVIEW */}

                        {band.id === "featured-designers" && (
                          <span className="homepage-band-designer-grid">

                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />

                          </span>
                        )}


                        {/* TESTIMONIALS MINI PREVIEW */}

                        {band.id === "testimonials" && (
                          <span className="homepage-band-placeholder-row">

                            <span />
                            <span />
                            <span />

                          </span>
                        )}


                        {/* INSTAGRAM MINI PREVIEW */}

                        {band.id === "instagram" && (
                          <span className="homepage-band-instagram-grid">

                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />

                          </span>
                        )}

                      </span>


                      {/* STATUS DOT */}

                      {band.status !== "clean" && (
                        <span
                          className={[
                            "homepage-band-status-dot",
                            `homepage-band-status-${band.status}`,
                          ].join(" ")}
                        />
                      )}


                      {/* REORDER ARROWS */}

                      <span
                        className="homepage-band-reorder"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >

                        <span>
                          ▲
                        </span>

                        <span>
                          ▼
                        </span>

                      </span>

                    </button>
                  );
                })}

              </div>


              {/* BOTTOM CHROME */}

              <div className="homepage-preview-chrome">
                FOOTER
              </div>

            </div>


            {/* NAVIGATOR HINT */}

            <p className="homepage-navigator-hint">
              The page in order. Click a band to edit it; use the
              arrows on the left of a band to move it. Photography
              is drawn where the band carries it.
            </p>

          </aside>


          {/* =================================================
              RIGHT EDITOR
          ================================================= */}

          <section className="homepage-editor">

            {renderSelectedBand()}

          </section>


        </section>

      </main>

    </div>
  );
};

export default HomepageView;