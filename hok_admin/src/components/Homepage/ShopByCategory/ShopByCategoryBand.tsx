import React, { useMemo, useState } from "react";
import "./ShopByCategoryBand.css";

/* =====================================================
   TYPES
===================================================== */

interface CategoryTile {
  id: number;
  registryName: string; // owned by Master Data — singular, source of truth
  label: string; // what shows on the tile, blank falls back to registryName
  slug: string;
  live: number;
  hasPicture: boolean;
  altText: string;
  kicker: string;
}

interface HealthItem {
  id: string;
  tone: "warning" | "info";
  text: React.ReactNode;
  actionLabel?: string;
}

/* =====================================================
   MOCK DATA
   (Wire this up to the real homepage + master-data
   records once the API contracts land.)
===================================================== */

const initialTiles: CategoryTile[] = [
  {
    id: 1,
    registryName: "Bridal Lehenga",
    label: "Bridal Lehengas",
    slug: "/rent/bridal-lehenga",
    live: 3,
    hasPicture: false,
    altText: "Bridal lehengas",
    kicker: "Curated for every occasion",
  },
  {
    id: 2,
    registryName: "Sherwani",
    label: "Sherwanis",
    slug: "/rent/sherwani",
    live: 0,
    hasPicture: false,
    altText: "",
    kicker: "",
  },
  {
    id: 3,
    registryName: "Saree",
    label: "Sarees",
    slug: "/rent/saree",
    live: 1,
    hasPicture: false,
    altText: "",
    kicker: "",
  },
  {
    id: 4,
    registryName: "Anarkali",
    label: "Anarkalis",
    slug: "/rent/anarkali",
    live: 1,
    hasPicture: false,
    altText: "",
    kicker: "",
  },
  {
    id: 5,
    registryName: "Indo-Western",
    label: "Indo-Western",
    slug: "/rent/indo-western",
    live: 0,
    hasPicture: false,
    altText: "",
    kicker: "",
  },
];

const CATEGORIES_NOT_ON_HOMEPAGE = 2;
const BAND_POSITION = 4;
const BAND_TOTAL = 9;

/* =====================================================
   SMALL PIECES
===================================================== */

const Toggle: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label: React.ReactNode;
  hint?: string;
}> = ({ checked, onChange, label, hint }) => (
  <label className="sbc-toggle-row">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={["sbc-toggle", checked ? "sbc-toggle-on" : ""].join(" ")}
      onClick={() => onChange(!checked)}
    >
      <span className="sbc-toggle-knob" />
    </button>

    <span className="sbc-toggle-copy">
      <span className="sbc-toggle-label">{label}</span>
      {hint && <span className="sbc-toggle-hint">{hint}</span>}
    </span>
  </label>
);

/** Turns "Shop by *Category*" into the gold-italic storefront treatment. */
const renderHeadingPreview = (raw: string): React.ReactNode => {
  const lines = raw.split("\n");

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*[^*]+\*)/g).filter((part) => part !== "");

    return (
      <React.Fragment key={lineIndex}>
        {lineIndex > 0 && <br />}
        {parts.map((part, partIndex) => {
          if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
            return (
              <em className="sbc-heading-emphasis" key={partIndex}>
                {part.slice(1, -1)}
              </em>
            );
          }
          return <React.Fragment key={partIndex}>{part}</React.Fragment>;
        })}
      </React.Fragment>
    );
  });
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const ShopByCategoryBand: React.FC = () => {
  /* ---------------------------------------------------
     BAND VISIBILITY
  --------------------------------------------------- */
  const [bandVisible, setBandVisible] = useState(true);

  /* ---------------------------------------------------
     THE WORDS
  --------------------------------------------------- */
  const [eyebrow, setEyebrow] = useState("Curated for Every Occasion");
  const [heading, setHeading] = useState("Shop by *Category*");
  const [viewAllLabel, setViewAllLabel] = useState("View All →");
  const [viewAllLink, setViewAllLink] = useState("/categories");

  /* ---------------------------------------------------
     THE TILES
  --------------------------------------------------- */
  const [tiles, setTiles] = useState<CategoryTile[]>(initialTiles);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(1);

  const selectedTile = useMemo(
    () => tiles.find((tile) => tile.id === selectedTileId) ?? null,
    [tiles, selectedTileId]
  );

  const updateTile = (id: number, patch: Partial<CategoryTile>) => {
    setTiles((current) =>
      current.map((tile) => (tile.id === id ? { ...tile, ...patch } : tile))
    );
  };

  const moveTile = (id: number, direction: -1 | 1) => {
    setTiles((current) => {
      const index = current.findIndex((tile) => tile.id === id);
      const swapWith = index + direction;
      if (index === -1 || swapWith < 0 || swapWith >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  };

  const takeTileOff = (id: number) => {
    setTiles((current) => current.filter((tile) => tile.id !== id));
    setSelectedTileId((current) => (current === id ? null : current));
  };

  /* ---------------------------------------------------
     LAYOUT
  --------------------------------------------------- */
  const [desktopLayout, setDesktopLayout] = useState("mosaic");
  const [appLayout, setAppLayout] = useState("carousel");
  const [buttonWording, setButtonWording] = useState("Shop Now");
  const [showHeadingDesktop, setShowHeadingDesktop] = useState(true);
  const [showLiveCountDesktop, setShowLiveCountDesktop] = useState(false);
  const [showHeadingApp, setShowHeadingApp] = useState(false);
  const [showLiveCountApp, setShowLiveCountApp] = useState(true);

  /* ---------------------------------------------------
     HEALTH MESSAGES
     Derived from the tiles, in the order the person
     needs to act on them: whichever tile is live but
     empty first, then missing photography, then the
     quieter naming notes last.
  --------------------------------------------------- */
  const healthItems: HealthItem[] = useMemo(() => {
    const items: HealthItem[] = [];

    tiles.forEach((tile) => {
      if (tile.live === 0) {
        items.push({
          id: `empty-${tile.id}`,
          tone: "warning",
          text: (
            <>
              <strong>{tile.registryName}</strong> is on the homepage with
              nothing live behind it.
            </>
          ),
          actionLabel: "Open",
        });
      }

      if (!tile.hasPicture) {
        items.push({
          id: `picture-${tile.id}`,
          tone: "warning",
          text: (
            <>
              No picture set for the <strong>{tile.registryName}</strong>{" "}
              tile.
            </>
          ),
        });
      }
    });

    tiles.forEach((tile) => {
      if (tile.label && tile.label !== tile.registryName) {
        items.push({
          id: `label-${tile.id}`,
          tone: "info",
          text: (
            <>
              The tile reads <strong>{tile.label}</strong> while the registry
              calls it <strong>{tile.registryName}</strong>. The storefront
              sets these in the plural, so this is expected — clear the tile
              label to follow the registry instead.
            </>
          ),
        });
      }
    });

    return items;
  }, [tiles]);

  return (
    <div className="sbc-band">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="sbc-header">
        <div>
          <h2 className="sbc-title">Shop by Category</h2>
          <p className="sbc-subtitle">
            Which categories appear is decided in Master Data. How the tile
            reads — its picture, its label, its button — is decided here.
          </p>
        </div>

        <span className="sbc-position">
          Band {BAND_POSITION} of {BAND_TOTAL}
        </span>
      </div>

      {/* ===================================================
          VISIBILITY
      =================================================== */}

      <section className="sbc-panel sbc-visibility">
        <Toggle
          checked={bandVisible}
          onChange={setBandVisible}
          label="Show this band on the homepage"
        />

        <span className="sbc-visibility-status">
          {bandVisible
            ? `Showing on the live homepage, in position ${BAND_POSITION}.`
            : "Hidden from the live homepage."}
        </span>
      </section>

      {/* ===================================================
          HEALTH MESSAGES
      =================================================== */}

      {healthItems.length > 0 && (
        <section className="sbc-health-list">
          {healthItems.map((item) => (
            <div
              key={item.id}
              className={[
                "sbc-health-item",
                item.tone === "warning" ? "sbc-health-warning" : "",
              ].join(" ")}
            >
              <span className="sbc-health-text">{item.text}</span>

              {item.actionLabel && (
                <button type="button" className="sbc-health-action">
                  {item.actionLabel}
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ===================================================
          THE WORDS
      =================================================== */}

      <section className="sbc-panel">
        <h3 className="sbc-panel-title">The words</h3>

        <label className="sbc-field">
          <span className="sbc-field-label">Eyebrow</span>
          <input
            type="text"
            className="sbc-input"
            value={eyebrow}
            onChange={(event) => setEyebrow(event.target.value)}
          />
        </label>

        <label className="sbc-field">
          <span className="sbc-field-label">Heading</span>
          <textarea
            className="sbc-textarea"
            rows={2}
            value={heading}
            onChange={(event) => setHeading(event.target.value)}
          />
          <span className="sbc-field-hint">
            A line break starts a new line. Wrap one word in *asterisks* to
            set it in the italic gold serif, the way the storefront does.
          </span>
        </label>

        <div className="sbc-reads-as">
          <span className="sbc-field-label">Reads as</span>
          <p className="sbc-reads-as-preview">
            {renderHeadingPreview(heading)}
          </p>
        </div>

        <div className="sbc-field-row">
          <label className="sbc-field">
            <span className="sbc-field-label">View-all label</span>
            <input
              type="text"
              className="sbc-input"
              value={viewAllLabel}
              onChange={(event) => setViewAllLabel(event.target.value)}
            />
          </label>

          <label className="sbc-field">
            <span className="sbc-field-label">View-all link</span>
            <input
              type="text"
              className="sbc-input"
              value={viewAllLink}
              onChange={(event) => setViewAllLink(event.target.value)}
            />
          </label>
        </div>
      </section>

      {/* ===================================================
          THE TILES
      =================================================== */}

      <section className="sbc-panel">
        <div className="sbc-panel-header">
          <div>
            <h3 className="sbc-panel-title">The tiles</h3>
            <p className="sbc-panel-subtitle">
              Laid out the way the homepage lays them out. Click a tile to
              set its picture and wording.
            </p>
          </div>

          <button type="button" className="sbc-master-data-button">
            ↗ Open Master Data
          </button>
        </div>

        <div className="sbc-tile-grid">
          {tiles.map((tile, index) => {
            const isSelected = tile.id === selectedTileId;

            return (
              <button
                key={tile.id}
                type="button"
                className={[
                  "sbc-tile-card",
                  isSelected ? "sbc-tile-card-selected" : "",
                ].join(" ")}
                onClick={() => setSelectedTileId(tile.id)}
              >
                <div className="sbc-tile-top">
                  <span className="sbc-tile-number">{index + 1}</span>

                  {!tile.hasPicture && (
                    <span className="sbc-tile-badge">Needs a picture</span>
                  )}
                </div>

                <div className="sbc-tile-picture">
                  {tile.hasPicture ? (
                    <span className="sbc-tile-picture-fill" />
                  ) : (
                    <>
                      <span className="sbc-tile-picture-icon" aria-hidden>
                        ▢
                      </span>
                      <span className="sbc-tile-picture-label">
                        No picture
                      </span>
                    </>
                  )}
                </div>

                <div className="sbc-tile-meta">
                  <span className="sbc-tile-name">
                    {tile.label || tile.registryName}
                  </span>
                  <span className="sbc-tile-sub">
                    {tile.live} live · {tile.slug}
                  </span>
                </div>

                <div className="sbc-tile-footer">
                  <span
                    className="sbc-tile-reorder"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Move ${tile.label} up`}
                      disabled={index === 0}
                      onClick={() => moveTile(tile.id, -1)}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${tile.label} down`}
                      disabled={index === tiles.length - 1}
                      onClick={() => moveTile(tile.id, 1)}
                    >
                      ▼
                    </button>
                  </span>

                  <span
                    className="sbc-tile-take-off"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      takeTileOff(tile.id);
                    }}
                  >
                    Take off
                  </span>
                </div>
              </button>
            );
          })}

          <div className="sbc-tile-add">
            <span className="sbc-tile-add-icon">+</span>
            <span className="sbc-tile-add-label">Add a category</span>
            <span className="sbc-tile-add-hint">
              {CATEGORIES_NOT_ON_HOMEPAGE} not on the homepage
            </span>
          </div>
        </div>

        {/* ---------------------------------------------
            EDITING PANEL FOR THE SELECTED TILE
        --------------------------------------------- */}

        {selectedTile && (
          <div className="sbc-editing-panel">
            <div className="sbc-editing-header">
              <span className="sbc-editing-kicker">
                Editing tile{" "}
                {tiles.findIndex((tile) => tile.id === selectedTile.id) + 1}
              </span>
              <span className="sbc-editing-name">{selectedTile.label}</span>
            </div>

            <div className="sbc-editing-body">
              <div className="sbc-editing-picture">
                <div className="sbc-editing-picture-frame">
                  <span aria-hidden className="sbc-tile-picture-icon">
                    ▢
                  </span>
                  <span className="sbc-tile-picture-label">
                    Nothing uploaded yet
                  </span>
                </div>

                <button type="button" className="sbc-upload-button">
                  + Upload
                </button>
              </div>

              <div className="sbc-editing-fields">
                <div className="sbc-editing-picture-copy">
                  <span className="sbc-field-label sbc-field-label-inline">
                    Tile picture{" "}
                    {!selectedTile.hasPicture && (
                      <span className="sbc-needed-tag">Needed</span>
                    )}
                  </span>
                  <p className="sbc-field-hint">
                    Portrait, 700×1000 or larger. The name and the button sit
                    over the bottom of the picture, so keep that area quiet.
                  </p>
                </div>

                <label className="sbc-field">
                  <span className="sbc-field-label">Alt text</span>
                  <input
                    type="text"
                    className="sbc-input"
                    value={selectedTile.altText}
                    onChange={(event) =>
                      updateTile(selectedTile.id, {
                        altText: event.target.value,
                      })
                    }
                  />
                  <span className="sbc-field-hint">
                    What a screen reader announces, and what shows if the
                    picture fails to load.
                  </span>
                </label>

                <div className="sbc-field-row">
                  <label className="sbc-field">
                    <span className="sbc-field-label">Label on the tile</span>
                    <input
                      type="text"
                      className="sbc-input"
                      value={selectedTile.label}
                      onChange={(event) =>
                        updateTile(selectedTile.id, {
                          label: event.target.value,
                        })
                      }
                    />
                    <span className="sbc-field-hint">
                      Blank uses the registry name,{" "}
                      <strong>{selectedTile.registryName}</strong>. The
                      storefront sets these in the plural.
                    </span>
                  </label>

                  <label className="sbc-field">
                    <span className="sbc-field-label">Kicker — app only</span>
                    <input
                      type="text"
                      className="sbc-input"
                      value={selectedTile.kicker}
                      onChange={(event) =>
                        updateTile(selectedTile.id, {
                          kicker: event.target.value,
                        })
                      }
                    />
                    <span className="sbc-field-hint">
                      The small line above the name on the app carousel.
                      Desktop tiles carry none.
                    </span>
                  </label>
                </div>

                <p className="sbc-field-hint sbc-master-data-note">
                  The category itself — its name, slug and whether it is
                  active — belongs to{" "}
                  <button type="button" className="sbc-inline-link">
                    Master Data
                  </button>
                  . The picture, the label and the kicker have no home but
                  this one.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================================================
          LAYOUT
      =================================================== */}

      <section className="sbc-panel">
        <h3 className="sbc-panel-title">Layout</h3>

        <div className="sbc-field-row">
          <label className="sbc-field">
            <span className="sbc-field-label">Desktop</span>
            <select
              className="sbc-select"
              value={desktopLayout}
              onChange={(event) => setDesktopLayout(event.target.value)}
            >
              <option value="mosaic">Mosaic</option>
              <option value="grid">Grid</option>
            </select>
            <span className="sbc-field-hint">
              One wide tile and one tall, then three across. Needs exactly
              five tiles — there are {tiles.length}.
            </span>
          </label>

          <label className="sbc-field">
            <span className="sbc-field-label">App</span>
            <select
              className="sbc-select"
              value={appLayout}
              onChange={(event) => setAppLayout(event.target.value)}
            >
              <option value="carousel">Carousel</option>
              <option value="stack">Stack</option>
            </select>
            <span className="sbc-field-hint">
              Full-height slides with dots, as the app ships today.
            </span>
          </label>
        </div>

        <label className="sbc-field">
          <span className="sbc-field-label">Button wording</span>
          <input
            type="text"
            className="sbc-input"
            value={buttonWording}
            onChange={(event) => setButtonWording(event.target.value)}
          />
        </label>

        <div className="sbc-toggle-grid">
          <Toggle
            checked={showHeadingDesktop}
            onChange={setShowHeadingDesktop}
            label="Show the band heading on desktop"
          />
          <Toggle
            checked={showHeadingApp}
            onChange={setShowHeadingApp}
            label="Show the band heading in the app"
            hint="The app runs this band as a full-bleed carousel with no heading above it, which is how it ships."
          />
          <Toggle
            checked={showLiveCountDesktop}
            onChange={setShowLiveCountDesktop}
            label="Show the live piece count on desktop tiles"
          />
          <Toggle
            checked={showLiveCountApp}
            onChange={setShowLiveCountApp}
            label="Show the live piece count in the app"
          />
        </div>
      </section>
    </div>
  );
};

export default ShopByCategoryBand;