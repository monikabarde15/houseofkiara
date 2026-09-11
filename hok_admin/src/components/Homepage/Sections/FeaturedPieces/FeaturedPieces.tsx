
import React, { useMemo, useState } from "react";
import "./FeaturedPieces.css";

type PieceMode = "Rental/Preloved" | "New";
type PieceStatus = "Live" | "Sold";

interface Piece {
  sku: string;
  name: string;
  designer: string;
  mode: PieceMode;
  status: PieceStatus;
  image: string;
  rent?: number;
  days?: number;
  buy?: number;
  retail?: number;
}

const initialPieces: Piece[] = [
  {
    sku: "HOK-SAB-002",
    name: "Gulabi Silk Bridal Lehenga",
    designer: "Sabyasachi",
    mode: "Rental/Preloved",
    status: "Live",
    image: "piece-brown",
    rent: 6400,
    days: 3,
    buy: 110000,
    retail: 180000,
  },
  {
    sku: "HOK-MM-001",
    name: "Ivory Embroidered Sherwani",
    designer: "Manish Malhotra",
    mode: "New",
    status: "Sold",
    image: "piece-grey",
    buy: 38000,
    retail: 52000,
  },
  {
    sku: "HOK-TT-001",
    name: "Midnight Blue Crepe Saree",
    designer: "Tarun Tahiliani",
    mode: "New",
    status: "Live",
    image: "piece-blue",
    buy: 24500,
  },
  {
    sku: "HOK-AD-001",
    name: "Rose Georgette Anarkali",
    designer: "Anita Dongre",
    mode: "Rental/Preloved",
    status: "Live",
    image: "piece-rose",
    rent: 4500,
    days: 1,
  },
  {
    sku: "HOK-SAB-003",
    name: "Crimson Zardozi Bridal Lehenga",
    designer: "Sabyasachi",
    mode: "Rental/Preloved",
    status: "Live",
    image: "piece-crimson",
    rent: 8500,
    days: 3,
  },
  {
    sku: "HOK-SAB-004",
    name: "Rajputana Silk Bridal Lehenga",
    designer: "Sabyasachi",
    mode: "New",
    status: "Live",
    image: "piece-rajputana",
    buy: 125000,
  },
];

const formatPrice = (price?: number) =>
  price ? `₹${price.toLocaleString("en-IN")}` : "";

const FeaturedPieces: React.FC = () => {
  const [eyebrow, setEyebrow] = useState("Handpicked for You");
  const [heading, setHeading] = useState("Featured *Pieces*");
  const [viewAllLabel, setViewAllLabel] = useState("View All →");
  const [viewAllLink, setViewAllLink] = useState("/rent/all");

  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selectedSku, setSelectedSku] = useState(initialPieces[0].sku);

  const [search, setSearch] = useState("");
  const [designer, setDesigner] = useState("All designers");
  const [mode, setMode] = useState("All modes");

  const [showBand, setShowBand] = useState(true);
  const [soldAction, setSoldAction] = useState("off");
  const [desktopCards, setDesktopCards] = useState(4);
  const [mobileCards, setMobileCards] = useState(2);

  const [showModeBadge, setShowModeBadge] = useState(true);
  const [showWishlist, setShowWishlist] = useState(true);
  const [showRetail, setShowRetail] = useState(true);
  const [showDuration, setShowDuration] = useState(true);

  const [catalogueOpen, setCatalogueOpen] = useState(true);

  const selectedPiece = pieces.find(
    (piece) => piece.sku === selectedSku
  );

  const livePieces = useMemo(() => {
    return pieces.filter((piece) => piece.status === "Live");
  }, [pieces]);

  const availablePieces = useMemo(() => {
    const query = search.toLowerCase().trim();

    return pieces.filter((piece) => {
      const matchesSearch =
        !query ||
        piece.name.toLowerCase().includes(query) ||
        piece.designer.toLowerCase().includes(query) ||
        piece.sku.toLowerCase().includes(query);

      const matchesDesigner =
        designer === "All designers" ||
        piece.designer === designer;

      const matchesMode =
        mode === "All modes" || piece.mode === mode;

      return (
        matchesSearch &&
        matchesDesigner &&
        matchesMode &&
        piece.status === "Live"
      );
    });
  }, [pieces, search, designer, mode]);

  const renderHeading = (value: string) => {
    const parts = value.split(/(\*[^*]+\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={index}>
            {part.slice(1, -1)}
          </em>
        );
      }

      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  const movePiece = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= pieces.length) return;

    const updated = [...pieces];
    [updated[index], updated[nextIndex]] = [
      updated[nextIndex],
      updated[index],
    ];

    setPieces(updated);
  };

  const removePiece = (sku: string) => {
    setPieces((current) =>
      current.filter((piece) => piece.sku !== sku)
    );

    if (selectedSku === sku) {
      const nextPiece = pieces.find((piece) => piece.sku !== sku);
      setSelectedSku(nextPiece?.sku || "");
    }
  };

  const addPiece = (piece: Piece) => {
    if (pieces.length >= 8) return;

    if (pieces.some((item) => item.sku === piece.sku)) {
      setSelectedSku(piece.sku);
      return;
    }

    setPieces((current) => [...current, piece]);
    setSelectedSku(piece.sku);
  };

  return (
    <div className="featured-editor">

      {/* EDITOR HEADER */}
      <div className="featured-editor-header">
        <div>
          <h2>Featured Pieces</h2>
          <p>
            Hand-picked pieces from the catalogue. Each slot holds a
            real SKU and reads its status back, so a sold piece cannot
            sit here unnoticed.
          </p>
        </div>

        <span className="featured-band-counter">
          Band 3 of 9
        </span>
      </div>

      {/* VISIBILITY */}
      <section className="featured-panel featured-visibility">
        <label className="featured-toggle-row">
          <input
            type="checkbox"
            checked={showBand}
            onChange={(event) => setShowBand(event.target.checked)}
          />

          <span className="featured-toggle" />

          <strong>Show this band on the homepage</strong>
        </label>

        <span className="featured-visibility-text">
          {showBand
            ? "Showing on the live homepage, in position 3."
            : "This band is hidden from the homepage."}
        </span>
      </section>

      {/* ISSUES */}
      {pieces.some((piece) => piece.status === "Sold") && (
        <div className="featured-alert featured-alert-danger">
          A featured slot is not shoppable:{" "}
          <strong>
            {pieces.find((piece) => piece.status === "Sold")?.name}
          </strong>{" "}
          — sold.
          <button type="button">Open</button>
        </div>
      )}

      {pieces.length < 4 && (
        <div className="featured-alert featured-alert-warning">
          {pieces.length} shoppable pieces against a row of 4 —
          the last row lands short. Either fill the row or let it
          top up automatically.
        </div>
      )}

      {/* THE WORDS */}
      <section className="featured-panel">
        <div className="featured-panel-heading">
          <h3>The words</h3>
        </div>

        <div className="featured-form-body">

          <label className="featured-field">
            <span>EYEBROW</span>
            <input
              value={eyebrow}
              onChange={(event) => setEyebrow(event.target.value)}
            />
          </label>

          <label className="featured-field">
            <span>HEADING</span>
            <textarea
              rows={3}
              value={heading}
              onChange={(event) => setHeading(event.target.value)}
            />
          </label>

          <p className="featured-help">
            A line break starts a new line. Wrap one word in
            *asterisks* to set it in the italic gold serif, the way
            the storefront does.
          </p>

          <div className="featured-reads-as">
            <span>READS AS</span>
            <div className="featured-live-heading">
              {renderHeading(heading)}
            </div>
          </div>

          <div className="featured-two-column">
            <label className="featured-field">
              <span>VIEW-ALL LABEL</span>
              <input
                value={viewAllLabel}
                onChange={(event) =>
                  setViewAllLabel(event.target.value)
                }
              />
            </label>

            <label className="featured-field">
              <span>VIEW-ALL LINK</span>
              <input
                value={viewAllLink}
                onChange={(event) =>
                  setViewAllLink(event.target.value)
                }
              />
            </label>
          </div>

        </div>
      </section>

      {/* THE PIECES */}
      <section className="featured-panel">
        <div className="featured-panel-heading">
          <h3>The pieces</h3>
          <p>
            Each slot holds a real SKU. The picture, designer, size,
            prices and status shown here are read from the piece record.
          </p>
        </div>

        <div className="featured-pieces-grid">
          {pieces.map((piece, index) => (
            <article
              key={piece.sku}
              className={[
                "featured-piece-card",
                selectedSku === piece.sku
                  ? "featured-piece-selected"
                  : "",
              ].join(" ")}
              onClick={() => setSelectedSku(piece.sku)}
            >
              <div className={`featured-piece-image ${piece.image}`}>
                <span className="featured-position-badge">
                  {index + 1}
                </span>

                <span
                  className={[
                    "featured-status-badge",
                    piece.status === "Live"
                      ? "featured-status-live"
                      : "featured-status-sold",
                  ].join(" ")}
                >
                  {piece.status.toUpperCase()}
                </span>
              </div>

              <div className="featured-piece-info">
                <h4>{piece.name}</h4>
                <p>{piece.designer}</p>

                <div className="featured-piece-price">
                  {piece.rent && (
                    <>
                      Rent {formatPrice(piece.rent)}
                      {piece.days && ` / ${piece.days} days`}
                    </>
                  )}

                  {!piece.rent && piece.buy && (
                    <>Buy {formatPrice(piece.buy)}</>
                  )}

                  {piece.retail && (
                    <del>{formatPrice(piece.retail)}</del>
                  )}
                </div>

                <div className="featured-piece-actions">
                  <div className="featured-move-buttons">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(event) => {
                        event.stopPropagation();
                        movePiece(index, -1);
                      }}
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={index === pieces.length - 1}
                      onClick={(event) => {
                        event.stopPropagation();
                        movePiece(index, 1);
                      }}
                    >
                      ↓
                    </button>
                  </div>

                  <button
                    type="button"
                    className="featured-remove-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removePiece(piece.sku);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}

          {pieces.length < 8 && (
            <button
              type="button"
              className="featured-add-tile"
              onClick={() => setCatalogueOpen(true)}
            >
              <strong>＋</strong>
              <span>Add a piece</span>
              <small>{8 - pieces.length} slots free</small>
            </button>
          )}
        </div>

        <div className="featured-section-footer">
          <span>{pieces.length} of 8 slots used</span>
          <span>
            The deck above matches the customer row — 4 across on
            desktop, 2 in the app.
          </span>
        </div>
      </section>

      {/* LIVE PIECES CATALOGUE */}
      {catalogueOpen && (
        <section className="featured-panel featured-catalogue">
          <div className="featured-catalogue-header">
            <div>
              <h3>Live pieces</h3>
              <span>{pieces.length} of 8 slots used</span>
            </div>

            <button
              type="button"
              onClick={() => setCatalogueOpen(false)}
            >
              Done
            </button>
          </div>

          <div className="featured-catalogue-filters">
            <input
              placeholder="Search by piece, designer, category or SKU"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={designer}
              onChange={(event) => setDesigner(event.target.value)}
            >
              <option>All designers</option>
              <option>Sabyasachi</option>
              <option>Manish Malhotra</option>
              <option>Tarun Tahiliani</option>
              <option>Anita Dongre</option>
            </select>

            <select
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              <option>All modes</option>
              <option>Rental/Preloved</option>
              <option>New</option>
            </select>
          </div>

          <div className="featured-catalogue-grid">
            {availablePieces.map((piece) => {
              const isAdded = pieces.some(
                (item) => item.sku === piece.sku
              );

              return (
                <button
                  type="button"
                  key={piece.sku}
                  className={[
                    "featured-catalogue-card",
                    isAdded ? "featured-catalogue-added" : "",
                  ].join(" ")}
                  onClick={() => addPiece(piece)}
                >
                  <div
                    className={`featured-catalogue-image ${piece.image}`}
                  />

                  {isAdded && (
                    <span>✓ ON THE HOMEPAGE</span>
                  )}

                  <strong>{piece.name}</strong>
                  <small>{piece.designer}</small>
                </button>
              );
            })}
          </div>

          <p className="featured-help">
            Only Live pieces appear here — a draft, paused or sold
            piece cannot be put on the homepage.
          </p>
        </section>
      )}

      {/* SELECTED PIECE INSPECTOR */}
      {selectedPiece && (
        <section className="featured-panel featured-inspector">
          <div className="featured-inspector-header">
            <span>POSITION {pieces.indexOf(selectedPiece) + 1}</span>
            <strong>{selectedPiece.name}</strong>
          </div>

          <div className="featured-inspector-body">
            <div
              className={`featured-inspector-image ${selectedPiece.image}`}
            />

            <div className="featured-inspector-content">
              <h3>Which photograph fronts this tile</h3>

              <p>
                Taken from the piece’s own gallery. The product page
                leads with its primary photograph, which is often a
                full front view — a detail or an on-model shot can
                read better in a row.
              </p>

              <div className="featured-photo-options">
                <span className={selectedPiece.image} />
                <span className={selectedPiece.image} />
                <span className={selectedPiece.image} />
                <span className={selectedPiece.image} />
              </div>

              <p className="featured-help">
                Showing On model. Clicking the one already chosen
                returns the tile to the primary photograph.
              </p>

              <dl className="featured-inspector-details">
                <div>
                  <dt>Designer</dt>
                  <dd>{selectedPiece.designer}</dd>
                </div>

                <div>
                  <dt>Mode</dt>
                  <dd>{selectedPiece.mode}</dd>
                </div>

                <div>
                  <dt>Status</dt>
                  <dd>{selectedPiece.status}</dd>
                </div>

                <div>
                  <dt>Price shown</dt>
                  <dd>
                    {selectedPiece.rent
                      ? `Rent ${formatPrice(selectedPiece.rent)} / ${selectedPiece.days} days`
                      : `Buy ${formatPrice(selectedPiece.buy)}`}
                  </dd>
                </div>
              </dl>

              <button type="button" className="featured-open-piece">
                ↗ Open piece
              </button>
            </div>
          </div>

          <p className="featured-help">
            {pieces.length} of 8 slots used. The deck above matches
            the customer row — 4 across on desktop, 2 in the app.
          </p>
        </section>
      )}

      {/* WHEN A PIECE SELLS */}
      <section className="featured-panel">
        <div className="featured-panel-heading">
          <h3>When a piece sells</h3>
          <p>
            A hand-picked grid empties itself over time. This decides
            what happens when it does.
          </p>
        </div>

        <div className="featured-form-body">
          <label className="featured-field">
            <span>IF A SLOT STOPS BEING SHOPPABLE</span>

            <select
              value={soldAction}
              onChange={(event) => setSoldAction(event.target.value)}
            >
              <option value="off">Off</option>
              <option value="topup">Top up automatically</option>
            </select>
          </label>

          <p className="featured-help">
            {soldAction === "off"
              ? "The tile is dropped and the row renders short until somebody notices."
              : "The next Live piece from the catalogue fills the empty slot automatically."}
          </p>

          {soldAction === "topup" && (
            <label className="featured-field">
              <span>FILL WITH</span>
              <select>
                <option>Newest live</option>
                <option>Most rented</option>
                <option>Highest rated</option>
              </select>
            </label>
          )}

          <div className="featured-two-column">
            <label className="featured-field">
              <span>CARDS PER ROW — DESKTOP</span>
              <input
                type="number"
                min={1}
                max={4}
                value={desktopCards}
                onChange={(event) =>
                  setDesktopCards(Number(event.target.value))
                }
              />
            </label>

            <label className="featured-field">
              <span>CARDS PER ROW — MOBILE</span>
              <input
                type="number"
                min={1}
                max={2}
                value={mobileCards}
                onChange={(event) =>
                  setMobileCards(Number(event.target.value))
                }
              />
            </label>
          </div>
        </div>
      </section>

      {/* CUSTOMER TILE OPTIONS */}
      <section className="featured-panel">
        <div className="featured-panel-heading">
          <h3>What the customer tile carries</h3>
          <p>
            Besides the photograph. All four are read from the piece
            record — these decide only whether they are drawn.
          </p>
        </div>

        <div className="featured-options-list">
          <label className="featured-option">
            <input
              type="checkbox"
              checked={showModeBadge}
              onChange={(event) => setShowModeBadge(event.target.checked)}
            />
            <span className="featured-toggle" />
            <div>
              <strong>Mode badge over the picture</strong>
              <p>
                RENT, PRELOVED or NEW, taken from the piece’s mode.
                Rent renders on charcoal, Preloved on terracotta,
                New on sage.
              </p>
            </div>
          </label>

          <label className="featured-option">
            <input
              type="checkbox"
              checked={showWishlist}
              onChange={(event) => setShowWishlist(event.target.checked)}
            />
            <span className="featured-toggle" />
            <div>
              <strong>Wishlist heart</strong>
              <p>
                Top right of the picture. Adds the piece to a shopper’s
                wishlist without opening it.
              </p>
            </div>
          </label>

          <label className="featured-option">
            <input
              type="checkbox"
              checked={showRetail}
              onChange={(event) => setShowRetail(event.target.checked)}
            />
            <span className="featured-toggle" />
            <div>
              <strong>Struck-through retail price</strong>
              <p>
                The piece’s retail price beside what HOK charges,
                struck through. It comes from the record.
              </p>
            </div>
          </label>

          <label className="featured-option">
            <input
              type="checkbox"
              checked={showDuration}
              onChange={(event) => setShowDuration(event.target.checked)}
            />
            <span className="featured-toggle" />
            <div>
              <strong>Rental duration beside the price</strong>
              <p>
                Reads as “₹12,000 / 4 days”. Drawn only on a piece
                that can be rented.
              </p>
            </div>
          </label>
        </div>
      </section>

    </div>
  );
};

export default FeaturedPieces;