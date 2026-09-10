import React, { useState } from "react";
import "./HowItWorks.css";

type Pane = "shop" | "sell";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const HowItWorks: React.FC = () => {
  /* =====================================================
     BASIC STATE
  ===================================================== */

  const [activePane, setActivePane] = useState<Pane>("shop");
  const [showBand, setShowBand] = useState(true);

  /* =====================================================
     WORDS
  ===================================================== */

  const [eyebrow, setEyebrow] = useState("Simple by Design");

  const [heading, setHeading] = useState(
    "How House of Kaira *works*"
  );

  const [shopTab, setShopTab] = useState("I want to shop");
  const [sellTab, setSellTab] = useState("I want to sell");

  const [openPane, setOpenPane] = useState<Pane>("shop");

  /* =====================================================
     SHOP STEPS
  ===================================================== */

  const [shopSteps, setShopSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Browse & Discover",
      description:
        "Explore thousands of designer pieces across rent, preloved, and new categories — filtered by occasion, budget, and aesthetic.",
      icon: "search",
    },
    {
      id: 2,
      title: "Pick Your Path",
      description:
        "Choose to rent for the occasion, buy preloved, or discover something new.",
      icon: "location",
    },
    {
      id: 3,
      title: "Doorstep Delivery",
      description:
        "Your look arrives dry-cleaned, pressed, and ready for your occasion.",
      icon: "package",
    },
    {
      id: 4,
      title: "Wear, Love, Repeat",
      description:
        "Enjoy your look. For rentals, we collect it after your occasion.",
      icon: "heart",
    },
  ]);

  /* =====================================================
     SELL STEPS
  ===================================================== */

  const [sellSteps, setSellSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Photograph & List",
      description:
        "Upload a few photos of your piece, set your price, and go live in under 10 minutes.",
      icon: "image",
    },
    {
      id: 2,
      title: "We Review & Feature",
      description:
        "Our team reviews your listing and promotes it to the right audience.",
      icon: "users",
    },
    {
      id: 3,
      title: "Ship & Get Paid",
      description:
        "Once sold, ship it out. Payment lands in your account.",
      icon: "card",
    },
  ]);

  /* =====================================================
     SELL CLOSING CARD
  ===================================================== */

  const [showSellCard, setShowSellCard] = useState(true);

  const [sellCardHeadline, setSellCardHeadline] = useState(
    "The hours of *craftsmanship* on that piece deserve more than a dark wardrobe shelf."
  );

  const [sellCardBody, setSellCardBody] = useState(
    "Give your occasion wear another life. Let someone else fall in love with it — and earn while you do."
  );

  const [sellCardQuote, setSellCardQuote] = useState(
    '"Every piece has a story. Don’t let it end with you."'
  );

  const [sellCardButton, setSellCardButton] = useState(
    "List Your Piece →"
  );

  const [sellCardLink, setSellCardLink] = useState(
    "/list-your-piece"
  );

  /* =====================================================
     SELECTED STEP
  ===================================================== */

  const [selectedStep, setSelectedStep] = useState(0);

  const activeSteps =
    activePane === "shop" ? shopSteps : sellSteps;

  const selectedStepData = activeSteps[selectedStep];

  /* =====================================================
     HEADING FORMATTER
  ===================================================== */

  const renderFormattedText = (text: string) => {
    const parts = text.split("*");

    if (parts.length === 3) {
      return (
        <>
          {parts[0]}
          <em>{parts[1]}</em>
          {parts[2]}
        </>
      );
    }

    return text;
  };

  /* =====================================================
     CHANGE PANE
  ===================================================== */

  const changePane = (pane: Pane) => {
    setActivePane(pane);
    setSelectedStep(0);
  };

  /* =====================================================
     UPDATE STEP
  ===================================================== */

  const updateStep = (
    field: "title" | "description",
    value: string
  ) => {
    if (activePane === "shop") {
      setShopSteps((previous) =>
        previous.map((step, index) =>
          index === selectedStep
            ? { ...step, [field]: value }
            : step
        )
      );
    } else {
      setSellSteps((previous) =>
        previous.map((step, index) =>
          index === selectedStep
            ? { ...step, [field]: value }
            : step
        )
      );
    }
  };

  /* =====================================================
     MOVE STEP
  ===================================================== */

  const moveStep = (direction: "up" | "down") => {
    const currentSteps =
      activePane === "shop" ? [...shopSteps] : [...sellSteps];

    const newIndex =
      direction === "up"
        ? selectedStep - 1
        : selectedStep + 1;

    if (newIndex < 0 || newIndex >= currentSteps.length) {
      return;
    }

    [
      currentSteps[selectedStep],
      currentSteps[newIndex],
    ] = [
      currentSteps[newIndex],
      currentSteps[selectedStep],
    ];

    const reordered = currentSteps.map((step, index) => ({
      ...step,
      id: index + 1,
    }));

    if (activePane === "shop") {
      setShopSteps(reordered);
    } else {
      setSellSteps(reordered);
    }

    setSelectedStep(newIndex);
  };

  /* =====================================================
     REMOVE STEP
  ===================================================== */

  const removeStep = () => {
    const currentSteps =
      activePane === "shop" ? [...shopSteps] : [...sellSteps];

    if (currentSteps.length <= 1) {
      return;
    }

    const filtered = currentSteps
      .filter((_, index) => index !== selectedStep)
      .map((step, index) => ({
        ...step,
        id: index + 1,
      }));

    if (activePane === "shop") {
      setShopSteps(filtered);
    } else {
      setSellSteps(filtered);
    }

    setSelectedStep(
      Math.min(selectedStep, filtered.length - 1)
    );
  };

  return (
    <div className="hiw-editor">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="hiw-editor-heading">

        <div>
          <h2>How It Works</h2>

          <p>
            Two panes behind one toggle — one for somebody
            buying, one for somebody listing. The sell pane
            ends on a card, not a step.
          </p>
        </div>

        <span className="hiw-band-counter">
          Band 2 of 9
        </span>

      </div>


      {/* =====================================================
          VISIBILITY
      ===================================================== */}

      <div className="hiw-visibility-row">

        <div className="hiw-visibility-left">

          <button
            type="button"
            className={
              showBand
                ? "hiw-toggle hiw-toggle-active"
                : "hiw-toggle"
            }
            onClick={() => setShowBand(!showBand)}
            aria-label="Toggle homepage band visibility"
          >
            <span />
          </button>

          <span>
            Show this band on the homepage
          </span>

        </div>

        <span className="hiw-visibility-consequence">
          {showBand
            ? "Showing on the live homepage, in position 2."
            : "Hidden from the live homepage."}
        </span>

      </div>


      {/* =====================================================
          PANE SWITCH BAR
      ===================================================== */}

      <div className="hiw-mode-bar">

        <span className="hiw-mode-label">
          EDITING
        </span>

        <div className="hiw-mode-tabs">

          <button
            type="button"
            className={
              activePane === "shop"
                ? "hiw-mode-tab hiw-mode-tab-active"
                : "hiw-mode-tab"
            }
            onClick={() => changePane("shop")}
          >
            {shopTab}
          </button>

          <button
            type="button"
            className={
              activePane === "sell"
                ? "hiw-mode-tab hiw-mode-tab-active"
                : "hiw-mode-tab"
            }
            onClick={() => changePane("sell")}
          >
            {sellTab}
          </button>

        </div>

        <span className="hiw-mode-description">
          {activePane === "shop"
            ? "What somebody buying sees. 4 steps."
            : "What somebody selling sees. 3 steps + card."}
        </span>

      </div>


      {/* =====================================================
          WORDS
      ===================================================== */}

      <section className="hiw-card">

        <div className="hiw-card-header">

          <h3>
            The words above both panes
          </h3>

          <p>
            Shared by both. The tab labels are what the
            customer clicks between.
          </p>

        </div>


        <div className="hiw-card-body">

          {/* EYEBROW */}

          <div className="hiw-field">

            <label>EYEBROW</label>

            <input
              type="text"
              value={eyebrow}
              onChange={(event) =>
                setEyebrow(event.target.value)
              }
            />

          </div>


          {/* HEADING */}

          <div className="hiw-field">

            <label>HEADING</label>

            <textarea
              value={heading}
              onChange={(event) =>
                setHeading(event.target.value)
              }
              rows={3}
            />

            <p className="hiw-helper">
              A line break starts a new line. Wrap one word
              in *asterisks* to set it in the italic gold serif,
              the way the storefront does.
            </p>

          </div>


          {/* READS AS */}

          <div className="hiw-reads-card">

            <span className="hiw-reads-label">
              READS AS
            </span>

            <div className="hiw-reads-heading">
              {renderFormattedText(heading)}
            </div>

          </div>


          {/* TABS */}

          <div className="hiw-tab-fields">

            <div className="hiw-field">

              <label>LEFT TAB</label>

              <input
                type="text"
                value={shopTab}
                onChange={(event) =>
                  setShopTab(event.target.value)
                }
              />

            </div>


            <div className="hiw-field">

              <label>RIGHT TAB</label>

              <input
                type="text"
                value={sellTab}
                onChange={(event) =>
                  setSellTab(event.target.value)
                }
              />

            </div>

          </div>


          {/* OPEN FIRST */}

          <div className="hiw-field">

            <label>
              WHICH PANE OPENS FIRST
            </label>

            <select
              className="hiw-select"
              value={openPane}
              onChange={(event) =>
                setOpenPane(event.target.value as Pane)
              }
            >
              <option value="shop">
                Shop
              </option>

              <option value="sell">
                Sell
              </option>
            </select>

            <p className="hiw-helper">
              Whichever is open on load is the story most
              visitors read. Currently{" "}
              {openPane === "shop"
                ? "I want to shop."
                : "I want to sell."}
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          STEPS
      ===================================================== */}

      <section className="hiw-card">

        <div className="hiw-card-header">

          <h3>
            {activePane === "shop"
              ? "“I want to shop” — the steps"
              : "“I want to sell” — the steps"}
          </h3>

          <p>
            {activePane === "shop"
              ? "Four steps across on desktop, stacked in the app."
              : "Three steps across, then the card below fills the fourth column."}
          </p>

        </div>


        <div className="hiw-card-body">

          {/* STEP DECK */}

          <div
            className={
              activePane === "shop"
                ? "hiw-step-deck hiw-step-deck-shop"
                : "hiw-step-deck hiw-step-deck-sell"
            }
          >

            {activeSteps.map((step, index) => (

              <article
                key={step.id}
                className={
                  index === selectedStep
                    ? "hiw-step-tile hiw-step-tile-selected"
                    : "hiw-step-tile"
                }
                onClick={() => setSelectedStep(index)}
              >

                <div className="hiw-step-top">

                  <span className="hiw-step-number">
                    {step.id}
                  </span>

                  <div
                    className={`hiw-step-icon hiw-icon-${step.icon}`}
                  />

                </div>


                <h4>
                  {step.title}
                </h4>


                <p>
                  {step.description}
                </p>


                <div className="hiw-step-actions">

                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(event) => {
                      event.stopPropagation();
                      moveStep("up");
                    }}
                    title="Move earlier"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={
                      index === activeSteps.length - 1
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      moveStep("down");
                    }}
                    title="Move later"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeStep();
                    }}
                    title="Remove"
                    className="hiw-remove-button"
                  >
                    Remove
                  </button>

                </div>

              </article>

            ))}

          </div>


          <p className="hiw-step-note">
            {activePane === "shop"
              ? "4 steps is the most this row fits on the storefront. Remove one to add another."
              : "3 steps is the most this row fits on the storefront. Remove one to add another."}
          </p>


          {/* =================================================
              STEP INSPECTOR
          ================================================= */}

          {selectedStepData && (

            <div className="hiw-inspector">

              <div className="hiw-inspector-header">

                <span>
                  EDITING STEP {selectedStepData.id}
                </span>

                <strong>
                  {selectedStepData.title}
                </strong>

              </div>


              <div className="hiw-inspector-fields">

                {/* TITLE */}

                <div className="hiw-field">

                  <label>TITLE</label>

                  <input
                    type="text"
                    value={selectedStepData.title}
                    onChange={(event) =>
                      updateStep(
                        "title",
                        event.target.value
                      )
                    }
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="hiw-field">

                  <label>DESCRIPTION</label>

                  <textarea
                    value={selectedStepData.description}
                    onChange={(event) =>
                      updateStep(
                        "description",
                        event.target.value
                      )
                    }
                    rows={4}
                  />

                  <p className="hiw-helper">
                    Accepts {"{{tokens}}"}.
                  </p>

                </div>


                {/* ICON */}

                <div className="hiw-field">

                  <label>ICON</label>

                  <div className="hiw-icon-options">

                    {[
                      "search",
                      "location",
                      "package",
                      "heart",
                      "image",
                      "users",
                      "card",
                    ].map((icon) => (

                      <button
                        type="button"
                        key={icon}
                        className={
                          selectedStepData.icon === icon
                            ? "hiw-icon-option hiw-icon-option-active"
                            : "hiw-icon-option"
                        }
                        onClick={() => {

                          const update =
                            activePane === "shop"
                              ? shopSteps.map(
                                  (step, index) =>
                                    index === selectedStep
                                      ? { ...step, icon }
                                      : step
                                )
                              : sellSteps.map(
                                  (step, index) =>
                                    index === selectedStep
                                      ? { ...step, icon }
                                      : step
                                );

                          if (activePane === "shop") {
                            setShopSteps(update);
                          } else {
                            setSellSteps(update);
                          }
                        }}
                      >
                        <span
                          className={`hiw-small-icon hiw-icon-${icon}`}
                        />
                      </button>

                    ))}

                  </div>

                  <p className="hiw-helper">
                    The storefront draws stroked line icons.
                    There is no emoji anywhere on the page.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              SELL CLOSING CARD
          ================================================= */}

          {activePane === "sell" && (

            <div className="hiw-sell-card">

              <div className="hiw-card-header">

                <h3>
                  The card at the end of this pane
                </h3>

                <p>
                  Not a step — the argument for listing,
                  and the button that acts on it.
                </p>

              </div>


              <div className="hiw-sell-card-body">

                {/* SHOW CARD */}

                <div className="hiw-sell-toggle-row">

                  <button
                    type="button"
                    className={
                      showSellCard
                        ? "hiw-toggle hiw-toggle-active"
                        : "hiw-toggle"
                    }
                    onClick={() =>
                      setShowSellCard(!showSellCard)
                    }
                  >
                    <span />
                  </button>

                  <span>
                    Show the card
                  </span>

                </div>


                {showSellCard && (
                  <>
                    {/* HEADLINE */}

                    <div className="hiw-field">

                      <label>HEADLINE</label>

                      <textarea
                        value={sellCardHeadline}
                        onChange={(event) =>
                          setSellCardHeadline(
                            event.target.value
                          )
                        }
                        rows={3}
                      />

                      <p className="hiw-helper">
                        A line break starts a new line. Wrap
                        one word in *asterisks* for italic gold serif.
                      </p>

                    </div>


                    {/* READS AS */}

                    <div className="hiw-reads-card">

                      <span className="hiw-reads-label">
                        READS AS
                      </span>

                      <div className="hiw-reads-heading hiw-sell-preview">
                        {renderFormattedText(
                          sellCardHeadline
                        )}
                      </div>

                    </div>


                    {/* BODY */}

                    <div className="hiw-field">

                      <label>BODY</label>

                      <textarea
                        value={sellCardBody}
                        onChange={(event) =>
                          setSellCardBody(
                            event.target.value
                          )
                        }
                        rows={3}
                      />

                    </div>


                    {/* QUOTE */}

                    <div className="hiw-field">

                      <label>PULL QUOTE</label>

                      <input
                        type="text"
                        value={sellCardQuote}
                        onChange={(event) =>
                          setSellCardQuote(
                            event.target.value
                          )
                        }
                      />

                      <p className="hiw-helper">
                        Set in italics under the body, in gold.
                      </p>

                    </div>


                    {/* BUTTON */}

                    <div className="hiw-two-column-fields">

                      <div className="hiw-field">

                        <label>BUTTON LABEL</label>

                        <input
                          type="text"
                          value={sellCardButton}
                          onChange={(event) =>
                            setSellCardButton(
                              event.target.value
                            )
                          }
                        />

                      </div>


                      <div className="hiw-field">

                        <label>BUTTON LINK</label>

                        <input
                          type="text"
                          value={sellCardLink}
                          onChange={(event) =>
                            setSellCardLink(
                              event.target.value
                            )
                          }
                        />

                      </div>

                    </div>
                  </>
                )}

              </div>

            </div>

          )}

        </div>

      </section>

    </div>
  );
};

export default HowItWorks;