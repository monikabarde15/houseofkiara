
import React, { useState } from "react";
import "./Instagram.css";

interface InstagramTile {
  id: number;
  title: string;
  altText: string;
  image: string | null;
  postUrl: string;
}

interface InstagramProps {
  homepage?: any;
  onUpdateHomepage?: (homepage: any) => void;
}

const createTile = (id: number): InstagramTile => ({
  id,
  title: `Tile ${id}`,
  altText: "",
  image: null,
  postUrl: "",
});

const Instagram: React.FC<InstagramProps> = ({
  homepage,
  onUpdateHomepage,
}) => {
  const [showBand, setShowBand] = useState(true);

  const [eyebrow, setEyebrow] = useState("Our Community");

  const [heading, setHeading] = useState("As seen on *Instagram*");

  const [followLinkLabel, setFollowLinkLabel] = useState("");

  const [followLink, setFollowLink] = useState("/rent");

  const [followLabelApp, setFollowLabelApp] = useState("");

  const [lineUnderTiles, setLineUnderTiles] =
    useState("Follow our story at");

  const [lineUnderTilesApp, setLineUnderTilesApp] =
    useState("Follow us at");

  const [source, setSource] = useState<
    "manual" | "live"
  >("manual");

  const [desktopLayout, setDesktopLayout] =
    useState("Three across");

  const [mobileLayout, setMobileLayout] =
    useState("Swipe");

  const [selectedTileId, setSelectedTileId] =
    useState(1);

  const [tiles, setTiles] = useState<InstagramTile[]>(
    [
      createTile(1),
      createTile(2),
      createTile(3),
      createTile(4),
      createTile(5),
      createTile(6),
    ]
  );

  const selectedTile =
    tiles.find((tile) => tile.id === selectedTileId) ||
    tiles[0];

  const updateTile = (
    field: keyof InstagramTile,
    value: string | null
  ) => {
    setTiles((previousTiles) =>
      previousTiles.map((tile) =>
        tile.id === selectedTileId
          ? {
              ...tile,
              [field]: value,
            }
          : tile
      )
    );
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    updateTile("image", imageUrl);
  };

  const addTile = () => {
    const nextId =
      tiles.length > 0
        ? Math.max(...tiles.map((tile) => tile.id)) + 1
        : 1;

    const newTile = createTile(nextId);

    setTiles((previousTiles) => [
      ...previousTiles,
      newTile,
    ]);

    setSelectedTileId(nextId);
  };

  const removeTile = (id: number) => {
    setTiles((previousTiles) =>
      previousTiles.filter((tile) => tile.id !== id)
    );

    if (selectedTileId === id) {
      const remainingTiles = tiles.filter(
        (tile) => tile.id !== id
      );

      if (remainingTiles.length > 0) {
        setSelectedTileId(remainingTiles[0].id);
      }
    }
  };

  const moveTile = (
    id: number,
    direction: "up" | "down"
  ) => {
    setTiles((previousTiles) => {
      const index = previousTiles.findIndex(
        (tile) => tile.id === id
      );

      if (index === -1) return previousTiles;

      const newIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        newIndex < 0 ||
        newIndex >= previousTiles.length
      ) {
        return previousTiles;
      }

      const updatedTiles = [...previousTiles];

      const [movedTile] = updatedTiles.splice(index, 1);

      updatedTiles.splice(newIndex, 0, movedTile);

      return updatedTiles;
    });
  };

  const publishChanges = () => {
    const updatedHomepage = {
      ...homepage,
      instagram: {
        showBand,
        eyebrow,
        heading,
        followLinkLabel,
        followLink,
        followLabelApp,
        lineUnderTiles,
        lineUnderTilesApp,
        source,
        desktopLayout,
        mobileLayout,
        tiles,
      },
    };

    onUpdateHomepage?.(updatedHomepage);

    console.log("Instagram changes:", updatedHomepage);
  };

  return (
    <div className="instagram-editor">

      {/* HEADER */}

      <div className="instagram-editor-header">

        <div>
          <h2>Instagram</h2>

          <p>
            Six tiles and the follow line. The handle itself
            belongs to Site Settings — this band reads it.
          </p>
        </div>

        <span className="instagram-band-count">
          Band 9 of 9
        </span>

      </div>

      {/* SHOW BAND */}

      <div className="instagram-show-band">

        <div className="instagram-toggle-row">

          <button
            type="button"
            className={`instagram-toggle ${
              showBand ? "active" : ""
            }`}
            onClick={() => setShowBand(!showBand)}
            aria-label="Toggle Instagram band"
            aria-pressed={showBand}
          >
            <span />
          </button>

          <span>
            Show this band on the homepage
          </span>

        </div>

        <span className="instagram-live-status">
          {showBand
            ? "Showing on the live homepage, in position 9."
            : "Hidden from the homepage."}
        </span>

      </div>

      {/* LIVE FEED WARNING */}

      {source === "live" && (
        <div className="instagram-warning">
          A live feed needs a Meta connection, which the
          platform does not have yet. Until it does, the band
          renders nothing. Manual tiles are the working option.
        </div>
      )}

      {/* WORDS */}

      <section className="instagram-card">

        <div className="instagram-card-title">
          The words
        </div>

        <div className="instagram-card-body">

          <div className="instagram-field">

            <label>EYEBROW</label>

            <input
              type="text"
              value={eyebrow}
              onChange={(event) =>
                setEyebrow(event.target.value)
              }
            />

            <small>
              Small uppercase text above the heading.
            </small>

          </div>

          <div className="instagram-field">

            <label>HEADING</label>

            <textarea
              value={heading}
              onChange={(event) =>
                setHeading(event.target.value)
              }
              rows={2}
            />

            <small>
              A line break starts a new line. Wrap one word
              in *asterisks* to set it in the italic gold serif.
            </small>

          </div>

          <div className="instagram-read-preview">

            <span>READS AS</span>

            <h3>
              {heading.replace(/\*/g, "")}
            </h3>

          </div>

          <div className="instagram-two-column">

            <div className="instagram-field">

              <label>DESKTOP</label>

              <select
                value={desktopLayout}
                onChange={(event) =>
                  setDesktopLayout(event.target.value)
                }
              >
                <option>Three across</option>
                <option>Four across</option>
                <option>Six across</option>
              </select>

            </div>

            <div className="instagram-field">

              <label>MOBILE</label>

              <select
                value={mobileLayout}
                onChange={(event) =>
                  setMobileLayout(event.target.value)
                }
              >
                <option>Swipe</option>
                <option>Two across</option>
                <option>Three across</option>
              </select>

            </div>

          </div>

        </div>

      </section>

      {/* FOLLOW LINK */}

      <section className="instagram-card">

        <div className="instagram-card-title">
          Follow link
        </div>

        <div className="instagram-card-body">

          <div className="instagram-two-column">

            <div className="instagram-field">

              <label>FOLLOW LINK LABEL</label>

              <input
                type="text"
                value={followLinkLabel}
                onChange={(event) =>
                  setFollowLinkLabel(event.target.value)
                }
              />

            </div>

            <div className="instagram-field">

              <label>FOLLOW LINK LINK</label>

              <input
                type="text"
                value={followLink}
                onChange={(event) =>
                  setFollowLink(event.target.value)
                }
              />

            </div>

          </div>

          <div className="instagram-field">

            <label>FOLLOW LABEL IN THE APP</label>

            <input
              type="text"
              value={followLabelApp}
              onChange={(event) =>
                setFollowLabelApp(event.target.value)
              }
            />

            <small>
              The app shortens it. Blank uses the desktop label.
            </small>

          </div>

          <div className="instagram-field">

            <label>LINE UNDER THE TILES</label>

            <input
              type="text"
              value={lineUnderTiles}
              onChange={(event) =>
                setLineUnderTiles(event.target.value)
              }
            />

            <small>
              The handle is added after this automatically.
            </small>

          </div>

          <div className="instagram-field">

            <label>LINE UNDER THE TILES — APP</label>

            <input
              type="text"
              value={lineUnderTilesApp}
              onChange={(event) =>
                setLineUnderTilesApp(event.target.value)
              }
            />

            <small>
              Blank uses the desktop line.
            </small>

          </div>

        </div>

      </section>

      {/* HANDLE */}

      <section className="instagram-card">

        <div className="instagram-card-title instagram-handle-title">

          <div>
            <h3>The handle</h3>

            <p>
              Owned by Site Settings, because order confirmations
              and the footer print it too.
            </p>
          </div>

          <button
            type="button"
            className="instagram-site-settings-button"
          >
            Open Site Settings →
          </button>

        </div>

        <div className="instagram-card-body">

          <div className="instagram-handle-display">

            <strong>@house_of_kaira</strong>

            <span>
              Site Settings · Contact & social
            </span>

          </div>

          <p className="instagram-helper-text">
            Change it once there and it changes in the footer,
            on this band, and in every message that carries it.
            There is no second copy to keep in step.
          </p>

        </div>

      </section>

      {/* WHERE TILES COME FROM */}

      <section className="instagram-card">

        <div className="instagram-card-title">
          Where the tiles come from
        </div>

        <div className="instagram-card-body">

          <div className="instagram-field">

            <label>SOURCE</label>

            <select
              value={source}
              onChange={(event) =>
                setSource(
                  event.target.value as "manual" | "live"
                )
              }
            >
              <option value="manual">
                Manual tiles
              </option>

              <option value="live">
                Live Instagram feed
              </option>
            </select>

            <small>
              Six pictures chosen by hand. They stay put until
              somebody changes them.
            </small>

          </div>

          {/* TILE GRID */}

          <div className="instagram-tiles-grid">

            {tiles.map((tile, index) => (

              <div
                key={tile.id}
                className={`instagram-tile ${
                  selectedTileId === tile.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedTileId(tile.id)
                }
              >

                <div className="instagram-tile-top">

                  <span className="instagram-tile-number">
                    {index + 1}
                  </span>

                  <span className="instagram-needs-picture">
                    {tile.image
                      ? "IMAGE ADDED"
                      : "NEEDS A PICTURE"}
                  </span>

                </div>

                <div className="instagram-tile-image">

                  {tile.image ? (
                    <img
                      src={tile.image}
                      alt={tile.altText || tile.title}
                    />
                  ) : (
                    <>
                      <span className="instagram-image-icon">
                        ▧
                      </span>

                      <span>No picture</span>
                    </>
                  )}

                </div>

                <div className="instagram-tile-details">

                  <strong>{tile.title}</strong>

                  <span>
                    links to the profile
                  </span>

                </div>

                <div className="instagram-tile-actions">

                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(event) => {
                      event.stopPropagation();
                      moveTile(tile.id, "up");
                    }}
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={index === tiles.length - 1}
                    onClick={(event) => {
                      event.stopPropagation();
                      moveTile(tile.id, "down");
                    }}
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    className="instagram-remove-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeTile(tile.id);
                    }}
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

            {/* ADD TILE */}

            <button
              type="button"
              className="instagram-add-tile"
              onClick={addTile}
            >
              <span>+</span>
              <strong>Add a tile</strong>
            </button>

          </div>

        </div>

      </section>

      {/* EDIT SELECTED TILE */}

      {selectedTile && source === "manual" && (

        <section className="instagram-card instagram-edit-card">

          <div className="instagram-card-title">

            <strong>
              EDITING TILE {selectedTileId}
            </strong>

            <span>
              {selectedTile.title}
            </span>

          </div>

          <div className="instagram-card-body">

            <div className="instagram-tile-editor">

              {/* IMAGE */}

              <div className="instagram-upload-preview">

                {selectedTile.image ? (
                  <img
                    src={selectedTile.image}
                    alt={selectedTile.altText || "Uploaded tile"}
                  />
                ) : (
                  <>
                    <span className="instagram-image-icon">
                      ▧
                    </span>

                    <span>
                      Nothing
                      <br />
                      uploaded yet
                    </span>
                  </>
                )}

              </div>

              <div className="instagram-upload-fields">

                <div className="instagram-field">

                  <label>TILE PICTURE</label>

                  <small>
                    Square, 1080×1080. Crop it the way it appears
                    in the feed.
                  </small>

                </div>

                <div className="instagram-field">

                  <label>ALT TEXT</label>

                  <input
                    type="text"
                    value={selectedTile.altText}
                    onChange={(event) =>
                      updateTile(
                        "altText",
                        event.target.value
                      )
                    }
                  />

                  <small>
                    What a screen reader announces, and what
                    shows if the picture fails to load.
                  </small>

                </div>

                <label className="instagram-upload-button">

                  + Upload

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />

                </label>

              </div>

            </div>

            {/* POST URL */}

            <div className="instagram-field">

              <label>OPENS</label>

              <input
                type="text"
                placeholder="https://instagram.com/p/..."
                value={selectedTile.postUrl}
                onChange={(event) =>
                  updateTile(
                    "postUrl",
                    event.target.value
                  )
                }
              />

              <small>
                The post this tile links to. Blank sends the
                tap to the profile instead.
              </small>

            </div>

          </div>

        </section>

      )}

      {/* SAVE */}

      <div className="instagram-save-row">

        <button
          type="button"
          className="instagram-save-button"
          onClick={publishChanges}
        >
          Save Changes
        </button>

      </div>

    </div>
  );
};

export default Instagram;