
import React, { useState } from "react";
import "./OurCommitment.css";

const cards = [
  {
    headline:
      "Every piece rented is one less outfit the world needed to make.",
    body:
      "At HOK, choosing to rent isn't a compromise — it's a quiet act of intention. Wear beautifully, tread lightly.",
    icon: "♢",
    type: "shield",
    app: true,
  },
  {
    headline:
      "Designer craftsmanship should be experienced, not just owned.",
    body:
      "Discover exceptional pieces from trusted creators without the pressure of permanent ownership.",
    icon: "♡",
    type: "heart",
    app: true,
  },
  {
    headline:
      "Your wardrobe is an asset. It's time it started acting like one.",
    body:
      "Unlock more value from fashion through renting, reselling, and thoughtful circulation.",
    icon: "◷",
    type: "clock",
    app: false,
  },
  {
    headline: "Occasion wear that outlives the occasion.",
    body:
      "Beautiful clothes deserve more than one moment. Give every piece another story.",
    icon: "⇄",
    type: "refresh",
    app: true,
  },
];

const OurCommitment: React.FC = () => {
  const [showBand, setShowBand] = useState(true);

  const [eyebrow, setEyebrow] =
    useState("Our Commitment");

  const [heading, setHeading] =
    useState("Fashion that gives *back*");

  const [body, setBody] = useState(
    "Every outfit rented or resold keeps textile waste out of landfill. House of Kaira is building India's most loved circular fashion economy — one outfit at a time."
  );

  const [mobileBody, setMobileBody] = useState(
    "Every outfit rented or resold keeps textile waste out of landfill. Building India's most loved circular fashion economy — one outfit at a time."
  );

  // Editing Card 1 states

  const [cardHeadline, setCardHeadline] = useState(
    "Every piece rented is one less outfit the world needed to make."
  );

  const [cardBody, setCardBody] = useState(
    "At HOK, choosing to rent isn't a compromise — it's a quiet act of intention. Wear beautifully, tread lightly."
  );

  const [selectedIcon, setSelectedIcon] =
    useState("shield");

  const [showCardInApp, setShowCardInApp] =
    useState(true);

  return (
    <div className="commitment-editor">

      {/* HEADER */}

      <div className="editor-heading-row">

        <div>
          <h2>Our Commitment</h2>

          <p>
            The four modes as pills, and the cards that carry the argument.
          </p>
        </div>

        <span className="editor-band-count">
          Band 6 of 9
        </span>

      </div>


      {/* SHOW BAND */}

      <div className="editor-live-row">

        <button
          type="button"
          className={`hok-switch ${showBand ? "on" : ""}`}
          onClick={() => setShowBand((value) => !value)}
          aria-label="Toggle homepage band"
        >
          <span />
        </button>

        <strong>
          Show this band on the homepage
        </strong>

        <span>
          {showBand
            ? "Showing on the live homepage, in position 6."
            : "This band is hidden from the homepage."}
        </span>

      </div>


      {/* THE WORDS */}

      <section className="hok-editor-card">

        <h3>The words</h3>

        <label htmlFor="commitment-eyebrow">
          EYEBROW
        </label>

        <input
          id="commitment-eyebrow"
          value={eyebrow}
          onChange={(event) =>
            setEyebrow(event.target.value)
          }
        />


        <label htmlFor="commitment-heading">
          HEADING
        </label>

        <textarea
          id="commitment-heading"
          value={heading}
          onChange={(event) =>
            setHeading(event.target.value)
          }
        />

        <div className="hok-read-preview">
          {heading.replaceAll("*", "")}
        </div>


        <label htmlFor="commitment-body">
          BODY
        </label>

        <textarea
          id="commitment-body"
          value={body}
          onChange={(event) =>
            setBody(event.target.value)
          }
        />


        <label htmlFor="commitment-mobile-body">
          BODY ON MOBILE
        </label>

        <textarea
          id="commitment-mobile-body"
          value={mobileBody}
          onChange={(event) =>
            setMobileBody(event.target.value)
          }
        />

      </section>


      {/* MODE PILLS */}

      <section className="hok-editor-card">

        <h3>The mode pills</h3>

        {[
          "Rent",
          "Buy Preloved",
          "Buy New",
          "List & Sell",
        ].map((pill) => (

          <div className="hok-pill-row" key={pill}>

            <button
              type="button"
              className="hok-switch on"
              aria-label={`${pill} enabled`}
            >
              <span />
            </button>

            <strong>{pill}</strong>

            <span>
              /{pill.toLowerCase().replaceAll(" ", "-")}
            </span>

            <button
              type="button"
              className="hok-small-button"
            >
              ↑
            </button>

            <button
              type="button"
              className="hok-small-button"
            >
              ↓
            </button>

            <button
              type="button"
              className="hok-remove"
            >
              Remove
            </button>

          </div>

        ))}

        <button
          type="button"
          className="hok-add-button"
        >
          ＋ Add a pill
        </button>

      </section>


      {/* CARDS */}

      <section className="hok-editor-card">

        <h3>The cards</h3>

        <div className="hok-card-grid">

          {cards.map((card, index) => (

            <article
              className="commitment-card"
              key={card.headline}
            >

              <div className="commitment-card-top">

                <span className="card-number">
                  {index + 1}
                </span>

                <span className="commitment-icon">
                  {card.icon}
                </span>

              </div>


              <h4>
                {card.headline}
              </h4>

              <p>
                {card.type} ·{" "}
                {card.app
                  ? "desktop and app"
                  : "desktop only"}
              </p>


              <div className="commitment-card-actions">

                <button
                  type="button"
                  className="hok-small-button"
                >
                  ↑
                </button>

                <button
                  type="button"
                  className="hok-small-button"
                >
                  ↓
                </button>

                <button
                  type="button"
                  className="hok-remove"
                >
                  Remove
                </button>

              </div>

            </article>

          ))}

        </div>

        <button
          type="button"
          className="hok-add-button"
        >
          ＋ Add a card
        </button>

      </section>


      {/* =========================================
          EDITING CARD 1
      ========================================= */}

      <section className="editing-card-section">


        {/* CARD HEADER */}

        <div className="editing-card-header">

          <span>
            EDITING CARD 1
          </span>

          <h3>
            {cardHeadline}
          </h3>

        </div>


        {/* CARD CONTENT */}

        <div className="editing-card-content">


          {/* HEADLINE */}

          <label htmlFor="card-headline">
            HEADLINE
          </label>

          <textarea
            id="card-headline"
            value={cardHeadline}
            onChange={(event) =>
              setCardHeadline(event.target.value)
            }
          />


          {/* BODY */}

          <label htmlFor="card-body">
            BODY
          </label>

          <textarea
            id="card-body"
            value={cardBody}
            onChange={(event) =>
              setCardBody(event.target.value)
            }
          />


          {/* PRINT PREVIEW */}

          <p className="print-preview">

            Prints: {cardBody}

            <span>
              {" { } "}
            </span>

          </p>


          {/* ICON */}

          <label>
            ICON
          </label>

          <div className="icon-selection-row">

            {[
              { id: "search", symbol: "⌕" },
              { id: "location", symbol: "⌖" },
              { id: "gift", symbol: "♧" },
              { id: "heart", symbol: "♡" },
              { id: "image", symbol: "▧" },
              { id: "user", symbol: "♙" },
              { id: "card", symbol: "▤" },
              { id: "shield", symbol: "♢" },
              { id: "clock", symbol: "◷" },
              { id: "refresh", symbol: "⇄" },
              { id: "tag", symbol: "◇" },
              { id: "recycle", symbol: "♻" },
              { id: "diamond", symbol: "♢" },
              { id: "wallet", symbol: "▣" },
              { id: "infinity", symbol: "∞" },
              { id: "star", symbol: "☆" },
            ].map((icon) => (

              <button
                type="button"
                key={icon.id}
                className={`icon-button ${
                  selectedIcon === icon.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedIcon(icon.id)
                }
                aria-label={icon.id}
              >
                {icon.symbol}
              </button>

            ))}

          </div>


          <p className="icon-help-text">
            The storefront draws stroked line icons. There is no emoji anywhere on the page.
          </p>


          {/* SHOW IN APP */}

          <div className="show-card-row">

            <button
              type="button"
              className={`hok-switch ${
                showCardInApp ? "on" : ""
              }`}
              onClick={() =>
                setShowCardInApp((value) => !value)
              }
              aria-label="Show card in app"
            >
              <span />
            </button>

            <div>

              <strong>
                Show this card in the app as well as on desktop
              </strong>

              <p>
                Desktop shows every card. The app has room for fewer, so each card decides for itself.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default OurCommitment;