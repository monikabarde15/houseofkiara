import React, { useState } from "react";
import "./ShopByOccasion.css";

/* =====================================================
   TYPES
===================================================== */

interface OccasionEntry {
  id: string;
  number: number;
  name: string;
  livePieces: number;
  featured: boolean;
}

interface ShopByOccasionProps {
  onOpenMasterData?: () => void;
}

/* =====================================================
   HELPERS
===================================================== */

// Turns "Shop by *Occasion*" into styled markup: a line break on
// every "\n", and *word* wrapped in the italic gold serif — the
// same tiny markup language the storefront reads.
const renderHeadingPreview = (raw: string) => {
  const lines = raw.split("\n");

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);

    return (
      <React.Fragment key={lineIndex}>
        {parts.map((part, partIndex) => {
          if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            return (
              <em className="occasion-accent" key={partIndex}>
                {part.slice(1, -1)}
              </em>
            );
          }
          return <React.Fragment key={partIndex}>{part}</React.Fragment>;
        })}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

/* =====================================================
   COMPONENT
===================================================== */

const ShopByOccasion: React.FC<ShopByOccasionProps> = ({
  onOpenMasterData,
}) => {

  /* ---------------------------------------------------
     BAND VISIBILITY (storefront has no markup yet, so
     this switch has nothing to turn on)
  --------------------------------------------------- */

  const [showOnHomepage] = useState(false);


  /* ---------------------------------------------------
     THE WORDS
  --------------------------------------------------- */

  const [eyebrow, setEyebrow] = useState("Dressed for the Day");
  const [heading, setHeading] = useState("Shop by *Occasion*");
  const [viewAllLabel, setViewAllLabel] = useState("All Occasions →");
  const [viewAllLink, setViewAllLink] = useState("/occasions");


  /* ---------------------------------------------------
     WHICH OCCASIONS WOULD APPEAR
     (owned by the occasions registry in Master Data —
     this band only mirrors the Featured flag)
  --------------------------------------------------- */

  const [occasions, setOccasions] = useState<OccasionEntry[]>([
    { id: "wedding", number: 1, name: "Wedding", livePieces: 3, featured: true },
    { id: "sangeet", number: 2, name: "Sangeet", livePieces: 2, featured: true },
    { id: "reception", number: 3, name: "Reception", livePieces: 2, featured: true },
    { id: "mehendi", number: 4, name: "Mehendi", livePieces: 1, featured: true },
    { id: "cocktail", number: 5, name: "Cocktail", livePieces: 1, featured: false },
    { id: "engagement", number: 6, name: "Engagement", livePieces: 0, featured: true },
  ]);

  const featuredCount = occasions.filter((occasion) => occasion.featured).length;

  const toggleFeatured = (id: string) => {
    setOccasions((current) =>
      current.map((occasion) =>
        occasion.id === id
          ? { ...occasion, featured: !occasion.featured }
          : occasion
      )
    );
  };


  /* ---------------------------------------------------
     LAYOUT
  --------------------------------------------------- */

  const [desktopLayout, setDesktopLayout] = useState("even-grid");
  const [buttonWording, setButtonWording] = useState("Shop the Edit");
  const [showLivePieceCount, setShowLivePieceCount] = useState(true);


  return (
    <div className="occasion-editor">

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="occasion-editor-header">

        <div>
          <h2 className="occasion-editor-title">Shop by Occasion</h2>

          <p className="occasion-editor-context">
            Occasions are already marked as featured in Master Data,
            but the storefront has no band to put them in yet. The
            copy is ready; the front end is not.
          </p>
        </div>

        <span className="occasion-editor-band-count">Band 5 of 9</span>

      </header>


      {/* ===================================================
          VISIBILITY SWITCH
      =================================================== */}

      <section className="occasion-toggle-row">

        <div className="occasion-toggle-row-main">

          <label
            className="occasion-toggle occasion-toggle-disabled"
            title="The storefront has no markup for this band yet"
          >
            <input
              type="checkbox"
              checked={showOnHomepage}
              disabled
              readOnly
            />
            <span className="occasion-toggle-track">
              <span className="occasion-toggle-thumb" />
            </span>
          </label>

          <span className="occasion-toggle-text">
            Show this band on the homepage
          </span>

          <span className="occasion-pill-not-built">Not built</span>

        </div>

        <p className="occasion-toggle-note">
          The storefront has no markup for this band yet. Switching
          it on here will not make it appear.
        </p>

      </section>


      {/* ===================================================
          ALERT — flag says something, storefront doesn't
      =================================================== */}

      <section className="occasion-alert">

        <p className="occasion-alert-text">
          {featuredCount} occasion{featuredCount === 1 ? "" : "s"} are
          marked as featured in Master Data, but the homepage has no
          band showing them. Either build the band or untick them,
          so the flag means something.
        </p>

        <button
          type="button"
          className="occasion-alert-link"
          onClick={onOpenMasterData}
        >
          Open
        </button>

      </section>


      {/* ===================================================
          INFO — what's ready vs. what's built
      =================================================== */}

      <section className="occasion-info">
        <p>
          <strong>This band is not on the storefront yet.</strong> The
          occasions registry has carried a Featured flag since Master
          Data was built, and {featuredCount} occasion
          {featuredCount === 1 ? " is" : "s are"} ticked — but no band
          on the live homepage renders them. Everything below is
          ready for the day the front end is built. Until then the
          switch above has nothing to turn on.
        </p>
      </section>


      {/* ===================================================
          THE WORDS
      =================================================== */}

      <section className="occasion-card">

        <h3 className="occasion-card-title">The words</h3>

        <div className="occasion-field">
          <label htmlFor="occasion-eyebrow">Eyebrow</label>
          <input
            id="occasion-eyebrow"
            type="text"
            value={eyebrow}
            onChange={(event) => setEyebrow(event.target.value)}
          />
        </div>

        <div className="occasion-field">
          <label htmlFor="occasion-heading">Heading</label>
          <textarea
            id="occasion-heading"
            value={heading}
            onChange={(event) => setHeading(event.target.value)}
            rows={3}
          />
          <p className="occasion-field-hint">
            A line break starts a new line. Wrap one word in
            *asterisks* to set it in the italic gold serif, the way
            the storefront does.
          </p>
        </div>

        <div className="occasion-reads-as">
          <span className="occasion-reads-as-label">Reads as</span>
          <p className="occasion-reads-as-preview">
            {renderHeadingPreview(heading)}
          </p>
        </div>

        <div className="occasion-field-row">

          <div className="occasion-field">
            <label htmlFor="occasion-view-all-label">View-all label</label>
            <input
              id="occasion-view-all-label"
              type="text"
              value={viewAllLabel}
              onChange={(event) => setViewAllLabel(event.target.value)}
            />
          </div>

          <div className="occasion-field">
            <label htmlFor="occasion-view-all-link">View-all link</label>
            <input
              id="occasion-view-all-link"
              type="text"
              value={viewAllLink}
              onChange={(event) => setViewAllLink(event.target.value)}
            />
          </div>

        </div>

      </section>


      {/* ===================================================
          WHICH OCCASIONS WOULD APPEAR
      =================================================== */}

      <section className="occasion-card">

        <div className="occasion-card-header">

          <div>
            <h3 className="occasion-card-title">
              Which occasions would appear
            </h3>
            <p className="occasion-card-subtitle">
              Owned by the occasions registry.
            </p>
          </div>

          <button
            type="button"
            className="occasion-open-master-data"
            onClick={onOpenMasterData}
          >
            Open Master Data →
          </button>

        </div>

        <div className="occasion-grid">

          {occasions.map((occasion) => (
            <div className="occasion-tile" key={occasion.id}>

              <span className="occasion-tile-number">
                {occasion.number}
              </span>

              <span className="occasion-tile-body">
                <span className="occasion-tile-name">{occasion.name}</span>
                <span className="occasion-tile-count">
                  {occasion.livePieces} live piece
                  {occasion.livePieces === 1 ? "" : "s"}
                </span>
              </span>

              <button
                type="button"
                className={
                  occasion.featured
                    ? "occasion-tile-action"
                    : "occasion-tile-action occasion-tile-action-feature"
                }
                onClick={() => toggleFeatured(occasion.id)}
              >
                {occasion.featured ? "Take off" : "Feature"}
              </button>

            </div>
          ))}

        </div>

        <p className="occasion-card-footnote">
          The same Featured switch appears on the occasion card in
          Master Data. Each occasion already has its own landing
          page and its own meta title — this band would only be the
          door to them.
        </p>

      </section>


      {/* ===================================================
          LAYOUT
      =================================================== */}

      <section className="occasion-card">

        <h3 className="occasion-card-title">Layout</h3>

        <div className="occasion-field">
          <label htmlFor="occasion-desktop-layout">Desktop</label>
          <select
            id="occasion-desktop-layout"
            value={desktopLayout}
            onChange={(event) => setDesktopLayout(event.target.value)}
          >
            <option value="even-grid">Even grid</option>
            <option value="featured-first">Featured first</option>
            <option value="scroll-row">Scroll row</option>
          </select>
        </div>

        <div className="occasion-field">
          <label htmlFor="occasion-button-wording">Button wording</label>
          <input
            id="occasion-button-wording"
            type="text"
            value={buttonWording}
            onChange={(event) => setButtonWording(event.target.value)}
          />
        </div>

        <label className="occasion-switch-row">
          <span className="occasion-toggle occasion-toggle-small">
            <input
              type="checkbox"
              checked={showLivePieceCount}
              onChange={(event) =>
                setShowLivePieceCount(event.target.checked)
              }
            />
            <span className="occasion-toggle-track">
              <span className="occasion-toggle-thumb" />
            </span>
          </span>
          Show the live piece count
        </label>

      </section>

    </div>
  );
};

export default ShopByOccasion;