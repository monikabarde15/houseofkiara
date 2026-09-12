
import React, { useState } from "react";
import "./FeaturedDesigners.css";

type Designer = {
  id: number;
  name: string;
  type: string;
  city: string;
  pieces: number;
  color: string;
  featured: boolean;
};

const initialDesigners: Designer[] = [
  {
    id: 1,
    name: "Sabyasachi",
    type: "Couture House",
    city: "Kolkata, India",
    pieces: 3,
    color: "#3b1c0b",
    featured: true,
  },
  {
    id: 2,
    name: "Manish Malhotra",
    type: "Couture House",
    city: "Mumbai, India",
    pieces: 0,
    color: "#999999",
    featured: true,
  },
  {
    id: 3,
    name: "Tarun Tahiliani",
    type: "Couture House",
    city: "New Delhi, India",
    pieces: 1,
    color: "#172815",
    featured: true,
  },
  {
    id: 4,
    name: "Anita Dongre",
    type: "Couture House",
    city: "Mumbai, India",
    pieces: 1,
    color: "#2c2110",
    featured: true,
  },
  {
    id: 5,
    name: "Raw Mango",
    type: "Contemporary Label",
    city: "New Delhi, India",
    pieces: 0,
    color: "#999999",
    featured: true,
  },
  {
    id: 6,
    name: "Abu Jani Sandeep",
    type: "Couture House",
    city: "Mumbai, India",
    pieces: 0,
    color: "#999999",
    featured: true,
  },
  {
    id: 7,
    name: "Torani",
    type: "Contemporary Label",
    city: "New Delhi, India",
    pieces: 0,
    color: "#999999",
    featured: true,
  },
  {
    id: 8,
    name: "Ekaya",
    type: "Heritage Weave",
    city: "New Delhi, India",
    pieces: 0,
    color: "#16232d",
    featured: false,
  },
  {
    id: 9,
    name: "Papa Don't Preach",
    type: "Contemporary Label",
    city: "Mumbai, India",
    pieces: 0,
    color: "#351b25",
    featured: false,
  },
  {
    id: 10,
    name: "Rahul Mishra",
    type: "Couture House",
    city: "New Delhi, India",
    pieces: 0,
    color: "#1c2529",
    featured: false,
  },
  {
    id: 11,
    name: "Rimzim Dadu",
    type: "Contemporary Label",
    city: "New Delhi, India",
    pieces: 0,
    color: "#29282c",
    featured: false,
  },
];

const initialCards = [
  { name: "Sabyasachi", pieces: 3 },
  { name: "Manish Malhotra", pieces: 0 },
  { name: "Tarun Tahiliani", pieces: 1 },
  { name: "Anita Dongre", pieces: 1 },
  { name: "Raw Mango", pieces: 0 },
  { name: "Abu Jani Sandeep", pieces: 0 },
  { name: "Torani", pieces: 0 },
];

const FeaturedDesigners: React.FC = () => {
  const [showBand, setShowBand] = useState(true);

  const [eyebrow, setEyebrow] = useState("Trusted Creators");
  const [heading, setHeading] = useState("Featured *Designers*");
  const [viewAllLabel, setViewAllLabel] =
    useState("All Designers →");
  const [viewAllLink, setViewAllLink] = useState("/designers");

  const [designers, setDesigners] =
    useState<Designer[]>(initialDesigners);

  const [cards, setCards] = useState(initialCards);

  const [desktopLayout, setDesktopLayout] = useState("Grid");
  const [appLayout, setAppLayout] = useState("Carousel");
  const [howMany, setHowMany] = useState("6");
  const [buttonWording, setButtonWording] =
    useState("Shop the Collection");
  const [desktopCount, setDesktopCount] =
    useState("{n} PIECES");
  const [appCount, setAppCount] =
    useState("{n} pieces available");
  const [carouselKicker, setCarouselKicker] =
    useState("Featured Designer");

  const [showDesktopHeading, setShowDesktopHeading] =
    useState(true);
  const [showAppHeading, setShowAppHeading] =
    useState(false);
  const [showPieceCount, setShowPieceCount] =
    useState(true);

  const [selectedDesigner, setSelectedDesigner] =
    useState(0);

  const [editingDesigner, setEditingDesigner] =
    useState<number | null>(null);

  const [showNotHomepage, setShowNotHomepage] =
    useState(true);

  const featured = designers.filter(
    (designer) => designer.featured
  );

  const available = designers.filter(
    (designer) => !designer.featured
  );

  const moveCard = (index: number, direction: number) => {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= cards.length) return;

    const updated = [...cards];

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setCards(updated);
  };

  const toggleFeatured = (id: number) => {
    setDesigners((current) =>
      current.map((designer) =>
        designer.id === id
          ? { ...designer, featured: !designer.featured }
          : designer
      )
    );
  };

  const moveDesigner = (id: number, direction: number) => {
    const index = designers.findIndex(
      (designer) => designer.id === id
    );

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= designers.length) return;

    const updated = [...designers];

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setDesigners(updated);
  };

  const selected = designers.find(
    (designer) => designer.id === selectedDesigner
  );

  return (
    <div className="featured-editor">

      {/* HEADER */}

      <div className="featured-heading-row">

        <div>
          <div className="featured-eyebrow">
            SITE SETTINGS
          </div>

          <h1>Featured Designers</h1>

          <p>
            Who appears is decided on the designer’s own
            profile. The band around them — heading, layout,
            button wording — is decided here.
          </p>
        </div>

        <span className="band-number">
          Band 7 of 9
        </span>

      </div>


      {/* TOP TOOLBAR */}

      <div className="featured-toolbar">

        <div className="preview-search">
          <span>⌕</span>
          <input
            placeholder='Find a setting — “hero”, “quotes”, “layout”'
          />
        </div>

        <span className="live-text">
          Everything here is live on the site
        </span>

        <button className="publish-button">
          Publish
        </button>

      </div>


      {/* PAGE PREVIEW TABS */}

      <div className="page-tabs">

        <span>THE PAGE</span>

        <button className="active-tab">
          Desktop
        </button>

        <button>
          Mobile
        </button>

        <button className="back-tab">
          «
        </button>

      </div>


      {/* SHOW BAND */}

      <div className="show-band-row">

        <button
          type="button"
          className={`hok-switch ${showBand ? "on" : ""}`}
          onClick={() => setShowBand(!showBand)}
        >
          <span />
        </button>

        <strong>
          Show this band on the homepage
        </strong>

        <span>
          {showBand
            ? "Showing on the live homepage, in position 7."
            : "This band is hidden from the homepage."}
        </span>

      </div>


      {/* WARNINGS */}

      <div className="featured-alert warning">
        <strong>
          7 designers are featured but the band shows 6.
          The last 1 will not appear.
        </strong>

        <button>Open</button>
      </div>

      <div className="featured-alert danger">
        <strong>
          3 featured designers are on the homepage with
          nothing live behind the tap.
        </strong>

        <button>Open</button>
      </div>

      <div className="featured-alert danger">
        <strong>
          Ritu Kumar is named on a piece but has no designer
          profile, so they can never be featured here however
          the band is set.
        </strong>

        <button>Open</button>
      </div>


      {/* THE WORDS */}

      <section className="featured-section">

        <h2>The words</h2>

        <div className="featured-form-grid">

          <div className="full-width">

            <label>EYEBROW</label>

            <input
              value={eyebrow}
              onChange={(event) =>
                setEyebrow(event.target.value)
              }
            />

          </div>

          <div className="full-width">

            <label>HEADING</label>

            <textarea
              value={heading}
              onChange={(event) =>
                setHeading(event.target.value)
              }
            />

            <p className="field-help">
              A line break starts a new line. Wrap one word
              in *asterisks* to set it in the italic gold serif,
              the way the storefront does.
            </p>

          </div>

          <div className="full-width">

            <label>READS AS</label>

            <div className="reads-preview">
              <span className="reads-label">
                READS AS
              </span>

              <h3>
                {heading
                  .replaceAll("*", "")
                  .split(" ")
                  .map((word, index) => (
                    <React.Fragment key={index}>
                      {word}{" "}
                    </React.Fragment>
                  ))}
              </h3>
            </div>

          </div>

          <div>

            <label>VIEW-ALL LABEL</label>

            <input
              value={viewAllLabel}
              onChange={(event) =>
                setViewAllLabel(event.target.value)
              }
            />

          </div>

          <div>

            <label>VIEW-ALL LINK</label>

            <input
              value={viewAllLink}
              onChange={(event) =>
                setViewAllLink(event.target.value)
              }
            />

          </div>

        </div>

      </section>


      {/* THE DESIGNERS */}

      <section className="featured-section">

        <div className="section-header">

          <div>
            <h2>The designers</h2>

            <p>
              Six across, the grid the homepage draws.
              Portraits are read from each designer’s record.
            </p>
          </div>

          <button className="outline-button">
            ↗ Open Designers
          </button>

        </div>


        <div className="designer-grid">

          {featured.map((designer, index) => (

            <article
              className={`designer-card ${
                selectedDesigner === designer.id
                  ? "selected"
                  : ""
              }`}
              key={designer.id}
              onClick={() => setSelectedDesigner(designer.id)}
            >

              <div
                className="designer-portrait"
                style={{
                  backgroundColor: designer.color,
                }}
              >

                <span className="designer-number">
                  {index + 1}
                </span>

                {designer.pieces === 0 && (
                  <span className="nothing-live">
                    NOTHING LIVE
                  </span>
                )}

              </div>

              <div className="designer-info">

                <h3>{designer.name}</h3>

                <p>
                  {showPieceCount
                    ? `${designer.pieces} live pieces`
                    : "Designer"}
                </p>

                <div className="designer-actions">

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      moveDesigner(designer.id, -1);
                    }}
                  >
                    ↑
                  </button>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      moveDesigner(designer.id, 1);
                    }}
                  >
                    ↓
                  </button>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFeatured(designer.id);
                    }}
                  >
                    Take off
                  </button>

                </div>

              </div>

            </article>

          ))}

          <button
            className="add-designer-card"
            onClick={() => setShowNotHomepage(true)}
          >
            <span>＋</span>
            <strong>Add a designer</strong>
            <small>
              {available.length} not on the homepage
            </small>
          </button>

        </div>

      </section>


      {/* DESIGNERS NOT ON HOMEPAGE */}

      {showNotHomepage && (

        <section className="featured-section not-homepage">

          <div className="section-header">

            <div>
              <h2>Designers not on the homepage</h2>
            </div>

            <div className="section-header-right">
              <span>{available.length} available</span>

              <button
                className="outline-button"
                onClick={() => setShowNotHomepage(false)}
              >
                Done
              </button>
            </div>

          </div>


          <div className="designer-grid">

            {available.map((designer) => (

              <article
                className="designer-card"
                key={designer.id}
              >

                <div
                  className="designer-portrait"
                  style={{
                    backgroundColor: designer.color,
                  }}
                />

                <div className="designer-info">

                  <h3>{designer.name}</h3>

                  <p>
                    {designer.pieces} live · {designer.type}
                  </p>

                  <div className="designer-actions">

                    <button
                      onClick={() =>
                        toggleFeatured(designer.id)
                      }
                    >
                      Add to homepage
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

          <p className="section-note">
            Adding one here sets the Featured switch on that
            designer’s own record — one switch, two doors.
            Only active designers appear.
          </p>

        </section>

      )}


      {/* POSITION DETAIL */}

      {selected && (

        <section className="featured-section position-detail">

          <div className="position-title">
            POSITION {featured.findIndex(
              (designer) => designer.id === selected.id
            ) + 1}

            <strong>{selected.name}</strong>
          </div>

          <div className="position-content">

            <div
              className="position-portrait"
              style={{
                backgroundColor: selected.color,
              }}
            />

            <div className="position-info">

              <h3>Portrait</h3>

              <p>
                Portrait, 2:3. The name, the piece count and
                the button sit over the bottom of it on the
                customer card, so keep that area quiet.
              </p>

              <p>
                Alt text on the record reads “{selected.name}
                — Designer Indian bridal and occasion wear
                on House of Kaira”.
              </p>

              <div className="position-table">

                <span>Type</span>
                <strong>{selected.type}</strong>

                <span>City</span>
                <strong>{selected.city}</strong>

                <span>Live pieces</span>
                <strong>{selected.pieces}</strong>

                <span>Card reads</span>
                <strong>
                  {selected.name} · {selected.pieces} PIECES
                </strong>

              </div>

              <div className="position-buttons">

                <button className="outline-button">
                  ↗ Open designer
                </button>

                <button className="outline-button">
                  ↗ See their pieces
                </button>

              </div>

            </div>

          </div>

          <p className="section-note">
            The portrait, the bio and the name belong to the
            designer record. Whether they appear here, and in
            what order, is the Featured switch on that same
            record — the buttons on the tile above write to it.
          </p>

        </section>

      )}


      {/* LAYOUT */}

      <section className="featured-section">

        <h2>Layout</h2>

        <div className="layout-grid">

          <div>

            <label>DESKTOP</label>

            <select
              value={desktopLayout}
              onChange={(event) =>
                setDesktopLayout(event.target.value)
              }
            >
              <option>Grid</option>
              <option>Carousel</option>
            </select>

            <p className="field-help">
              Six across today.
            </p>

          </div>

          <div>

            <label>APP</label>

            <select
              value={appLayout}
              onChange={(event) =>
                setAppLayout(event.target.value)
              }
            >
              <option>Carousel</option>
              <option>Grid</option>
            </select>

            <p className="field-help">
              Full-height slides with dots, as the app ships.
            </p>

          </div>

          <div>

            <label>HOW MANY TO SHOW</label>

            <input
              value={howMany}
              onChange={(event) =>
                setHowMany(event.target.value)
              }
            />

            <p className="field-warning">
              7 are featured — the last 1 will not appear.
            </p>

          </div>

          <div>

            <label>BUTTON WORDING</label>

            <input
              value={buttonWording}
              onChange={(event) =>
                setButtonWording(event.target.value)
              }
            />

          </div>

          <div>

            <label>COUNT WORDING — DESKTOP</label>

            <input
              value={desktopCount}
              onChange={(event) =>
                setDesktopCount(event.target.value)
              }
            />

            <p className="field-help">
              {"{n}"} is replaced by the live count.
            </p>

          </div>

          <div>

            <label>COUNT WORDING — APP</label>

            <input
              value={appCount}
              onChange={(event) =>
                setAppCount(event.target.value)
              }
            />

          </div>

          <div className="full-width">

            <label>CAROUSEL KICKER — APP ONLY</label>

            <input
              value={carouselKicker}
              onChange={(event) =>
                setCarouselKicker(event.target.value)
              }
            />

            <p className="field-help">
              The small line above the name on each app slide.
              The desktop grid carries none.
            </p>

          </div>

        </div>


        <div className="layout-toggles">

          <Toggle
            label="Show the band heading on desktop"
            checked={showDesktopHeading}
            onChange={setShowDesktopHeading}
          />

          <Toggle
            label="Show the band heading in the app"
            checked={showAppHeading}
            onChange={setShowAppHeading}
          />

          <Toggle
            label="Show each designer’s live piece count"
            checked={showPieceCount}
            onChange={setShowPieceCount}
          />

        </div>

        <p className="section-note">
          Counted from the catalogue. The storefront currently
          carries written-in figures such as “214 pieces”,
          which the catalogue cannot support — turning this
          on replaces them with the real count.
        </p>

      </section>

    </div>
  );
};


type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
}) => (
  <div className="toggle-field">

    <button
      type="button"
      className={`hok-switch ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
      aria-label={label}
    >
      <span />
    </button>

    <strong>{label}</strong>

  </div>
);

export default FeaturedDesigners;