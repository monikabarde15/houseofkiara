import React, { useState } from "react";
import "./GoogleTab.css";

export default function GoogleTab() {
  const [headline, setHeadline] = useState(
    "House of Kaira — Rent, Buy & List Luxury Indian Occasion Wear"
  );

  const [description, setDescription] = useState(
    "Discover India's most curated platform for luxury occasion wear — rent, buy preloved, or list your own Sabyasachi, Manish Malhotra, and more."
  );

  const [allowIndexing, setAllowIndexing] = useState(true);

  const [analytics, setAnalytics] = useState("");
  const [metaPixel, setMetaPixel] = useState("");
  const [searchConsole, setSearchConsole] = useState("");

  const [showDeveloperSetup, setShowDeveloperSetup] = useState(false);

  const headlineCount = headline.length;
  const descriptionCount = description.length;

  const truncatedHeadline =
    headline.length > 60
      ? `${headline.slice(0, 60)}…`
      : headline;

  const truncatedDescription =
    description.length > 155
      ? `${description.slice(0, 155)}…`
      : description;

  return (
    <div className="google-tab">
      {/* =========================
          REGION HEADER
      ========================= */}

      <div className="google-region-header">
        <div>
          <div className="google-title-row">
            <h2>Google &amp; sharing</h2>

            <span className="google-meta">
              Priya (Ops) · 2 days ago
            </span>
          </div>

          <p>
            What a search result looks like, whether Google is allowed to list
            you at all, and the tracking codes. Nothing here changes the
            storefront&apos;s own search box — that lives under Header.
          </p>
        </div>
      </div>

      {/* =========================
          WHAT PEOPLE SEE IN GOOGLE
      ========================= */}

      <section className="google-card">
        <div className="google-card-header">
          <h3>What people see in Google</h3>

          <p>
            The two lines under your name in a search result. The preview on
            the right shows exactly how it reads.
          </p>
        </div>

        <div className="google-card-body">
          {/* HEADLINE */}

          <div className="google-field">
            <label>HEADLINE</label>

            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            {headlineCount > 60 ? (
              <div className="google-field-hint warning">
                <span className="count-chip">
                  {headlineCount} / 60
                </span>

                <span>
                  Too long — Google shows about 60 characters, so the end will
                  be cut.
                </span>
              </div>
            ) : (
              <div className="google-field-hint">
                <span className="count-chip">
                  {headlineCount} / 60
                </span>

                <span>Google shows about 60 characters.</span>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}

          <div className="google-field google-description-field">
            <label>DESCRIPTION</label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="google-field-hint">
              <span className="count-chip">
                {descriptionCount} / 155
              </span>

              <span>
                Used on any page that has not written its own. Google shows
                about 155 characters.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          LINK PREVIEW IMAGE
      ========================= */}

      <section className="google-card">
        <div className="google-card-header">
          <h3>The picture when a link is shared</h3>
        </div>

        <div className="google-card-body">
          <div className="google-share-asset">
            <div className="google-share-thumbnail">
              <span>none</span>
            </div>

            <div className="google-share-info">
              <div className="google-share-title">
                Link preview image{" "}
                <strong>· not set</strong>
              </div>

              <p>
                No page carries one, so every link pasted into WhatsApp
                arrives as a bare grey address.
              </p>

              <button
                type="button"
                className="google-secondary-button"
              >
                Set it in Brand
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          LETTING GOOGLE LIST THE SITE
      ========================= */}

      <section className="google-card">
        <div className="google-card-header">
          <h3>Letting Google list the site</h3>
        </div>

        <div className="google-card-body">
          <label className="google-toggle-row">
            <button
              type="button"
              className={`google-toggle ${
                allowIndexing ? "on" : ""
              }`}
              onClick={() => setAllowIndexing((prev) => !prev)}
              aria-pressed={allowIndexing}
            >
              <span />
            </button>

            <span>
              Allow Google and other search engines to list the site
            </span>
          </label>

          {allowIndexing ? (
            <p className="google-toggle-hint">
              On, which is what you want once the site is live. Switching it
              off removes House of Kaira from Google within a few days.
            </p>
          ) : (
            <p className="google-toggle-hint warning-text">
              Off — nobody can find the site by searching for it.
            </p>
          )}
        </div>
      </section>

      {/* =========================
          TRACKING CODES
      ========================= */}

      <section className="google-card tracking-card">
        <div className="google-card-header">
          <h3>Tracking codes</h3>

          <p>
            Each is a short code you paste in once, from a free account you
            set up elsewhere. Leave any of them blank and nothing breaks —
            you simply get no data from that source.
          </p>
        </div>

        <div className="google-card-body tracking-body">
          <TrackingBlock
            name="Google Analytics"
            description="Tells you how many people visited, which pieces they looked at, and where they came from — Instagram, Google, a WhatsApp link."
            value={analytics}
            placeholder="G-XXXXXXXXXX"
            onChange={setAnalytics}
            hint="analytics.google.com → create a property for houseofkaira.com → copy the Measurement ID."
          />

          <TrackingBlock
            name="Meta Pixel"
            description="Lets you see which Instagram and Facebook posts led to a rental, and is required before you can run paid ads."
            value={metaPixel}
            placeholder="000000000000000"
            onChange={setMetaPixel}
            hint="business.facebook.com → Events Manager → create a pixel → copy the Pixel ID."
          />

          <TrackingBlock
            name="Google Search Console"
            description="Proves to Google that the site is yours, and then shows you what people typed to find it."
            value={searchConsole}
            placeholder="a long string of letters"
            onChange={setSearchConsole}
            hint="search.google.com/search-console → add the property → choose the HTML tag method → copy the content value."
          />

          <p className="tracking-cookie-hint">
            Anything set here places cookies on a visitor&apos;s device, which
            is what makes the consent banner under <strong>Legal</strong> a
            legal requirement rather than a nicety.
          </p>
        </div>
      </section>

      {/* =========================
          DEVELOPER SETUP
      ========================= */}

      <section
        className={`google-developer-card ${
          showDeveloperSetup ? "open" : ""
        }`}
      >
        <button
          type="button"
          className="google-developer-header"
          onClick={() =>
            setShowDeveloperSetup((prev) => !prev)
          }
        >
          <div>
            <h3>Set up once — your developer handles these</h3>

            <p>
              Nothing here needs changing during normal running. It is written
              down so there is one place to check it.
            </p>
          </div>

          <span>
            {showDeveloperSetup ? "hide" : "show"}
          </span>
        </button>

        {showDeveloperSetup && (
          <div className="google-developer-content">
            <div className="developer-explanation">
              Each page puts its own name first, then a separator, then the
              site name.
            </div>

            <div className="developer-example">
              <span>Example</span>
              <strong>
                Rent Sabyasachi — House of Kaira
              </strong>
            </div>

            <div className="developer-template">
              {"{{page_title}}"} — House of Kaira
            </div>

            <p>
              Only the words inside double braces are swapped out.
            </p>

            <div className="developer-row">
              <label>TITLE SEPARATOR</label>

              <input
                className="developer-input"
                value="—"
                readOnly
              />
            </div>

            <div className="developer-row">
              <label>CANONICAL DOMAIN</label>

              <input
                className="developer-input"
                value="https://houseofkaira.com"
                readOnly
              />
            </div>

            <div className="developer-row developer-sitemap">
              <label>
                <input type="checkbox" defaultChecked />
                <span>Generate sitemap</span>
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Values used by Google preview later */}
      <div
        className="google-preview-data"
        data-headline={truncatedHeadline}
        data-description={truncatedDescription}
      />
    </div>
  );
}

/* =========================
   TRACKING BLOCK
========================= */

interface TrackingBlockProps {
  name: string;
  description: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  hint: string;
}

function TrackingBlock({
  name,
  description,
  value,
  placeholder,
  onChange,
  hint,
}: TrackingBlockProps) {
  const connected = value.trim().length > 0;

  return (
    <div className="tracking-block">
      <div className="tracking-name-row">
        <h4>{name}</h4>

        <span
          className={`tracking-status ${
            connected ? "connected" : ""
          }`}
        >
          {connected ? "CONNECTED" : "NOT SET UP"}
        </span>
      </div>

      <p className="tracking-description">
        {description}
      </p>

      <input
        className="tracking-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="tracking-find">
        <span>WHERE TO FIND IT</span>

        <p>{hint}</p>
      </div>
    </div>
  );
}