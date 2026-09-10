import React, { useState } from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  const [showBand, setShowBand] = useState(true);
  const [showFigures, setShowFigures] = useState(false);
  const [showDesktopBadge, setShowDesktopBadge] = useState(false);
  const [showAppBadge, setShowAppBadge] = useState(false);

  const [desktopLayout, setDesktopLayout] = useState("Split");
  const [pictureSide, setPictureSide] = useState("Right");

  const [appLayout, setAppLayout] = useState("Full bleed");
  const [darkening, setDarkening] = useState("52");

  return (
    <div className="hero-editor">

      {/* =====================================================
          HERO EDITOR HEADER
      ===================================================== */}

      <div className="hero-editor-heading">

        <div>
          <h2>Hero</h2>

          <p>
            The first screen. One picture, with the words either
            beside it or over it — desktop and the app choose separately.
          </p>
        </div>

        <span className="hero-band-counter">
          Band 1 of 9
        </span>

      </div>


      {/* =====================================================
          SHOW THIS BAND
      ===================================================== */}

      <div className="hero-visibility-row">

        <div className="hero-visibility-left">

          <button
            type="button"
            className={`hero-toggle ${
              showBand ? "hero-toggle-active" : ""
            }`}
            onClick={() => setShowBand(!showBand)}
            aria-label="Show this band on homepage"
          >
            <span />
          </button>

          <span>
            Show this band on the homepage
          </span>

        </div>

        <span className="hero-visibility-status">
          {showBand
            ? "Showing on the live homepage, in position 1."
            : "Hidden from the live homepage."}
        </span>

      </div>


      {/* =====================================================
          DESKTOP IMAGE WARNING
      ===================================================== */}

      <div className="hero-info-strip">
        No desktop hero picture uploaded yet.
      </div>


      {/* =====================================================
          APP HERO WARNING
      ===================================================== */}

      <div className="hero-warning-strip">
        The app hero runs full bleed with no picture behind it.
      </div>


      {/* =====================================================
          THE WORDS
      ===================================================== */}

      <section className="hero-card">

        <div className="hero-card-header">

          <h3>
            The words
          </h3>

          <p>
            The eyebrow, the headline and the line under it.
          </p>

        </div>


        <div className="hero-card-body">

          {/* EYEBROW */}

          <div className="hero-field">

            <label>
              EYEBROW
            </label>

            <input
              type="text"
              defaultValue="India's Premier Circular Fashion Platform"
            />

            <span className="hero-help-text">
              The small capitals above the headline, with a rule to its left.
            </span>

          </div>


          {/* HEADLINE */}

          <div className="hero-field">

            <label>
              HEADLINE
            </label>

            <textarea
              rows={3}
              defaultValue={`Wear it with *love.*\nPass it on.`}
            />

            <span className="hero-help-text">
              A line break starts a new line. Wrap one word in
              *asterisks* to set it in the italic gold serif,
              the way the storefront does.
            </span>

          </div>


          {/* DESKTOP HEADLINE PREVIEW */}

          <div className="hero-read-preview">

            <span className="hero-preview-label">
              READS AS
            </span>

            <div className="hero-preview-headline">
              Wear it with <em>love.</em>
              <br />
              Pass it on.
            </div>

          </div>


          {/* MOBILE HEADLINE */}

          <div className="hero-field">

            <label>
              HEADLINE ON MOBILE
            </label>

            <textarea
              rows={2}
              defaultValue="Wear it with *love.* Pass it on."
            />

            <span className="hero-help-text">
              The app sets it on one line where the desktop page
              breaks it in two. Leave blank to use the desktop headline.
            </span>

          </div>


          {/* MOBILE PREVIEW */}

          <div className="hero-read-preview">

            <span className="hero-preview-label">
              READS AS
            </span>

            <div className="hero-preview-headline hero-preview-mobile">
              Wear it with <em>love.</em> Pass it on.
            </div>

          </div>


          {/* SUB HEADING */}

          <div className="hero-field">

            <label>
              SUB-HEADING
            </label>

            <textarea
              rows={3}
              defaultValue="Rent, buy preloved, or discover new designer pieces — all in one curated destination for India's most discerning occasions."
            />

            <span className="hero-print-line">
              Prints: Rent, buy preloved, or discover new designer pieces —
              all in one curated destination for India's most discerning occasions.
            </span>

          </div>


          {/* MOBILE SUB HEADING */}

          <div className="hero-field">

            <label>
              SUB-HEADING ON MOBILE
            </label>

            <textarea rows={3} />

            <span className="hero-print-line">
              Prints:
            </span>

            <span className="hero-help-text">
              Blank uses the desktop line, which is what the current app
              build does. An earlier build carried a shorter one.
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <section className="hero-card">

        <div className="hero-card-header">

          <h3>
            Buttons
          </h3>

        </div>


        <div className="hero-card-body">

          <div className="hero-two-column">

            <div className="hero-field">

              <label>
                PRIMARY LABEL
              </label>

              <input
                type="text"
                defaultValue="Explore Collection"
              />

            </div>


            <div className="hero-field">

              <label>
                PRIMARY LINK
              </label>

              <input
                type="text"
                defaultValue="/rent"
              />

            </div>


            <div className="hero-field">

              <label>
                SECONDARY LABEL
              </label>

              <input
                type="text"
                defaultValue="How It Works"
              />

            </div>


            <div className="hero-field">

              <label>
                SECONDARY LINK
              </label>

              <input
                type="text"
                defaultValue="/how-it-works"
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FIGURES
      ===================================================== */}

      <section className="hero-card">

        <div className="hero-card-header">

          <h3>
            The figures under the buttons
          </h3>

          <p>
            Not on the hero at the moment. The figures are kept here
            so the row can come back without being retyped.
          </p>

        </div>


        <div className="hero-card-body">

          <div className="hero-toggle-row">

            <button
              type="button"
              className={`hero-toggle ${
                showFigures ? "hero-toggle-active" : ""
              }`}
              onClick={() => setShowFigures(!showFigures)}
            >
              <span />
            </button>

            <span>
              Show the figures
            </span>

          </div>


          <p className="hero-state-note">
            {showFigures
              ? "Switched on, so the figures will render between the buttons and the foot of the band."
              : "Switched off, so nothing renders between the buttons and the foot of the band."}
          </p>

        </div>

      </section>


      {/* =====================================================
          THE PICTURE — DESKTOP
      ===================================================== */}

      <section className="hero-card">

        <div className="hero-card-header">

          <h3>
            The picture
          </h3>

          <p>
            One picture, not a grid. Either the words sit beside it,
            or it runs the full width with the words over the top.
          </p>

        </div>


        <div className="hero-card-body">

          {/* LAYOUT SELECTORS */}

          <div className="hero-two-column">

            <div className="hero-field">

              <label>
                DESKTOP LAYOUT
              </label>

              <select
                value={desktopLayout}
                onChange={(event) =>
                  setDesktopLayout(event.target.value)
                }
              >
                <option>Split</option>
                <option>Full bleed</option>
              </select>

              <span className="hero-help-text">
                The words sit on a cream panel, the picture fills the other half.
              </span>

            </div>


            <div className="hero-field">

              <label>
                PICTURE SITS ON THE
              </label>

              <select
                value={pictureSide}
                onChange={(event) =>
                  setPictureSide(event.target.value)
                }
              >
                <option>Right</option>
                <option>Left</option>
              </select>

            </div>

          </div>


          {/* DESKTOP UPLOAD */}

          <div className="hero-upload-card">

            <div className="hero-upload-placeholder">

              <div className="hero-upload-icon">
                ♧
              </div>

              <span>
                Nothing
                <br />
                uploaded yet
              </span>

            </div>


            <div className="hero-upload-content">

              <div className="hero-upload-title">

                <strong>
                  Desktop picture
                </strong>

                <span className="hero-required">
                  NEEDED
                </span>

              </div>

              <p>
                Portrait, 1200×1600 or larger. It fills half the band,
                so the piece should sit in the middle of the frame.
              </p>


              <div className="hero-field">

                <label>
                  ALT TEXT
                </label>

                <input
                  type="text"
                  defaultValue="Bridal lehenga on House of Kaira"
                />

                <span className="hero-help-text">
                  What a screen reader announces, and what shows if
                  the picture fails to load.
                </span>

              </div>


              <button
                type="button"
                className="hero-upload-button"
              >
                +&nbsp; Upload
              </button>

            </div>

          </div>


          {/* FRAME POSITION */}

          <div className="hero-field hero-frame-field">

            <label>
              KEEP THIS PART OF THE PICTURE IN FRAME
            </label>

            <select defaultValue="Centre">
              <option>Centre</option>
              <option>Top</option>
              <option>Bottom</option>
            </select>

            <span className="hero-help-text">
              Which part survives when the band is cropped on a shorter screen.
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          THE PICTURE — MOBILE
      ===================================================== */}

      <section className="hero-card">

        <div className="hero-card-header">

          <h3>
            The picture — mobile
          </h3>

          <p>
            A phone needs its own crop, so the app carries its own picture
            rather than squeezing the desktop one.
          </p>

        </div>


        <div className="hero-card-body">

          <div className="hero-two-column">

            <div className="hero-field">

              <label>
                APP LAYOUT
              </label>

              <select
                value={appLayout}
                onChange={(event) =>
                  setAppLayout(event.target.value)
                }
              >
                <option>Full bleed</option>
                <option>Split</option>
              </select>

            </div>


            <div className="hero-field">

              <label>
                DARKENING BEHIND THE WORDS (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={darkening}
                onChange={(event) =>
                  setDarkening(event.target.value)
                }
              />

            </div>

          </div>


          {/* APP UPLOAD */}

          <div className="hero-upload-card">

            <div className="hero-upload-placeholder">

              <div className="hero-upload-icon">
                ♧
              </div>

              <span>
                Nothing
                <br />
                uploaded yet
              </span>

            </div>


            <div className="hero-upload-content">

              <div className="hero-upload-title">

                <strong>
                  App picture
                </strong>

                <span className="hero-required">
                  NEEDED
                </span>

              </div>

              <p>
                Portrait, 1080×1620 or larger. The words sit over it
                on the phone, so keep the middle quiet.
              </p>


              <div className="hero-field">

                <label>
                  ALT TEXT
                </label>

                <input
                  type="text"
                  defaultValue="Bridal lehenga on House of Kaira"
                />

                <span className="hero-help-text">
                  What a screen reader announces, and what shows if
                  the picture fails to load.
                </span>

              </div>


              <button
                type="button"
                className="hero-upload-button"
              >
                +&nbsp; Upload
              </button>

            </div>

          </div>


          {/* MOBILE FRAME */}

          <div className="hero-field hero-frame-field">

            <label>
              KEEP THIS PART OF THE PICTURE IN FRAME
            </label>

            <select defaultValue="Centre">
              <option>Centre</option>
              <option>Top</option>
              <option>Bottom</option>
            </select>

            <span className="hero-help-text">
              Which part survives when the band is cropped on a shorter screen.
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          BADGE
      ===================================================== */}

      <section className="hero-card">

        <div className="hero-card-header">

          <h3>
            Badge
          </h3>

          <p>
            The small card over the corner of the hero picture.
            Each device carries it separately — the current app
            build shows it, an earlier one did not.
          </p>

        </div>


        <div className="hero-card-body">

          <div className="hero-toggle-row">

            <button
              type="button"
              className={`hero-toggle ${
                showDesktopBadge ? "hero-toggle-active" : ""
              }`}
              onClick={() =>
                setShowDesktopBadge(!showDesktopBadge)
              }
            >
              <span />
            </button>

            <span>
              Show the badge on desktop
            </span>

          </div>


          <div className="hero-toggle-row">

            <button
              type="button"
              className={`hero-toggle ${
                showAppBadge ? "hero-toggle-active" : ""
              }`}
              onClick={() =>
                setShowAppBadge(!showAppBadge)
              }
            >
              <span />
            </button>

            <span>
              Show the badge in the app
            </span>

          </div>


          <p className="hero-state-note">
            The current app build carries it over the picture.
            An earlier build did not.
          </p>

        </div>

      </section>

    </div>
  );
};

export default Hero;