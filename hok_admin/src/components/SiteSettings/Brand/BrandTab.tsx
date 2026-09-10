import React, { useRef, useState } from "react";
import "./BrandTab.css";

type AssetId =
  | "logoMark"
  | "wordmark"
  | "inverseMark"
  | "favicon"
  | "homeIcon"
  | "shareImage";

interface Asset {
  id: AssetId;
  name: string;
  description: string;
  dimensions: string;
  accepted: string;
  showsIn: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  src?: string;
  required?: boolean;
}

const initialAssets: Asset[] = [
  {
    id: "logoMark",
    name: "Logo mark",
    description: "The small emblem to the left of the name.",
    dimensions: "76 × 76",
    accepted: "SVG, or PNG at 500 × 500 or larger.",
    showsIn: "Header · Mobile header",
    fileName: "hk-logo.png",
    fileType: "PNG",
    fileSize: "2 KB",
    src: "",
  },
  {
    id: "wordmark",
    name: "Wordmark",
    description: "The words “House of Kaira” themselves.",
    dimensions: "150 × 52",
    accepted: "SVG preferred, transparent.",
    showsIn: "Header and footer",
  },
  {
    id: "inverseMark",
    name: "Inverse mark",
    description: "A light version of the mark, for placing on a dark background.",
    dimensions: "76 × 76",
    accepted: "Same shape as the mark, light ink.",
    showsIn: "Nothing carries the logo on dark today",
  },
  {
    id: "favicon",
    name: "Browser tab icon",
    description:
      "The tiny square in the browser tab beside the page name. With a dozen tabs open, it is how somebody finds you again.",
    dimensions: "32 × 32",
    accepted: "32 × 32 or larger square PNG.",
    showsIn: "Every page. Also bookmarks and browser history",
  },
  {
    id: "homeIcon",
    name: "Phone home screen icon",
    description:
      "When a customer taps “Add to Home Screen”, this becomes the app icon on their phone.",
    dimensions: "180 × 180",
    accepted: "180 × 180 PNG.",
    showsIn: "iPhone and Android home screens",
  },
  {
    id: "shareImage",
    name: "Link preview image",
    description:
      "The picture that appears when anybody pastes a link to the site into a chat.",
    dimensions: "1200 × 630",
    accepted: "1200 × 630 PNG or JPG.",
    showsIn:
      "WhatsApp, Instagram DMs, Facebook, LinkedIn — anywhere a link unfurls",
  },
];

const palette = [
  { name: "Charcoal", hex: "#1A1612" },
  { name: "Gold", hex: "#C9A96E" },
  { name: "Terracotta", hex: "#B85C38" },
  { name: "Sage", hex: "#6B7E5A" },
  { name: "Cream", hex: "#FAF7F2" },
  { name: "Warm white", hex: "#FFFEFB" },
];

const typefaces = [
  {
    name: "Cormorant Garamond",
    role: "Headlines and the wordmark",
    className: "serif-sample",
  },
  {
    name: "Inter",
    role: "Interface text, panel and storefront",
    className: "sans-sample",
  },
  {
    name: "DM Sans",
    role: "Named in the brand identity for storefront interface",
    className: "dm-sample",
  },
];

export default function BrandTab() {
  const [siteName, setSiteName] = useState("House of Kaira");
  const [tagline, setTagline] = useState("Circular Luxury Fashion");
  const [brandQuote, setBrandQuote] = useState(
    "Every outfit has a story. We make sure it’s never the last chapter."
  );

  const [assets, setAssets] = useState<Asset[]>(initialAssets);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState<AssetId | null>(null);

  const handleUploadClick = (assetId: AssetId) => {
    setUploadingAsset(assetId);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !uploadingAsset) return;

    const reader = new FileReader();

    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";

      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === uploadingAsset
            ? {
                ...asset,
                src,
                fileName: file.name,
                fileType: file.type
                  ? file.type.split("/")[1]?.toUpperCase()
                  : "FILE",
                fileSize: `${Math.max(
                  1,
                  Math.ceil(file.size / 1024)
                )} KB`,
              }
            : asset
        )
      );

      setUploadingAsset(null);
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = (assetId: AssetId) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              fileName: undefined,
              fileType: undefined,
              fileSize: undefined,
              src: undefined,
            }
          : asset
      )
    );
  };

  const handleUseLogoMark = (assetId: AssetId) => {
    const logo = assets.find((asset) => asset.id === "logoMark");

    if (!logo?.src) return;

    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              src: logo.src,
              fileName: "hk-logo.png",
              fileType: "PNG",
              fileSize: "2 KB",
            }
          : asset
      )
    );
  };

  const handleDownload = (asset: Asset) => {
    if (!asset.src) return;

    const link = document.createElement("a");
    link.href = asset.src;
    link.download = asset.fileName || "brand-asset";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAsset = (id: AssetId) =>
    assets.find((asset) => asset.id === id);

  return (
    <div className="brand-tab">
      {/* REGION HEADER */}
      <div className="brand-region-header">
        <div>
          <h2>Brand &amp; assets</h2>
          <p>
            The name, the marks, and the picture that appears when somebody
            shares a link.
          </p>
        </div>

        <div className="brand-region-meta">
          <span className="brand-user">
            Priya (Ops) · 2 days ago
          </span>

          <div className="brand-view-toggle">
            <button className="active">Desktop</button>
            <button>Mobile</button>
          </div>

          <span className="brand-viewing">VIEWING</span>

          <select defaultValue="All pages">
            <option>All pages</option>
            <option>Rent</option>
            <option>Buy Preloved</option>
            <option>Buy New</option>
          </select>

          <button className="brand-hide-preview">
            Hide
          </button>
        </div>
      </div>

      {/* WARNINGS */}
      <div className="brand-warning">
        <span>
          No share image is set. Every link shared to WhatsApp renders as a
          bare URL with no picture.
        </span>
      </div>

      <div className="brand-warning">
        <span>
          No favicon is set, so the browser tab shows a blank page icon.
          None of the storefront pages carries one today.
        </span>
      </div>

      {/* WORDS */}
      <section className="brand-card first-card">
        <div className="brand-card-header">
          <div>
            <h3>Words</h3>
          </div>
        </div>

        <div className="brand-card-body">
          <div className="brand-two-column">
            <div className="brand-field">
              <label>Site name</label>

              <input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            <div className="brand-field">
              <label>Tagline</label>

              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>
          </div>

          <div className="brand-field">
            <label>Brand quote</label>

            <textarea
              value={brandQuote}
              onChange={(e) => setBrandQuote(e.target.value)}
              rows={3}
            />

            <div className="brand-field-hint">
              Prints: {brandQuote || "nothing yet"}
              <button
                type="button"
                className="pointer-button"
                title="Pointer"
              >
                {"{}"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ASSETS */}
      <section className="brand-card">
        <div className="brand-card-header">
          <div>
            <h3>Assets</h3>
            <p>
              Replace a file here and every page picks it up. Nothing else
              needs touching.
            </p>
          </div>
        </div>

        <div className="brand-card-body asset-body">
          {assets.map((asset) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              logoMark={getAsset("logoMark")}
              onUpload={handleUploadClick}
              onRemove={handleRemove}
              onDownload={handleDownload}
              onUseLogoMark={handleUseLogoMark}
            />
          ))}
        </div>
      </section>

      {/* PALETTE & TYPE */}
      <section className="brand-card">
        <div className="brand-card-header">
          <div>
            <h3>Palette &amp; type</h3>
            <p>
              Built into the stylesheet, not switchable from here —
              changing one is a development change, not a setting. Listed so
              there is one place to read them off.
            </p>
          </div>
        </div>

        <div className="brand-card-body palette-body">
          <div className="palette-list">
            {palette.map((item) => (
              <div className="palette-chip" key={item.name}>
                <span
                  className="palette-swatch"
                  style={{ backgroundColor: item.hex }}
                />

                <span className="palette-name">
                  {item.name}
                </span>

                <span className="palette-hex">
                  {item.hex}
                </span>
              </div>
            ))}
          </div>

          <div className="typeface-grid">
            {typefaces.map((typeface) => (
              <div className="typeface-card" key={typeface.name}>
                <div className={`typeface-aa ${typeface.className}`}>
                  {typeface.name === "DM Sans" ? "—" : "Aa"}
                </div>

                <div className="typeface-info">
                  <strong>{typeface.name}</strong>
                  <span>{typeface.role}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="palette-note">
            The announcement bar colours on{" "}
            <strong>Announcement</strong> default to Charcoal and Gold from
            this palette.
          </div>
        </div>
      </section>

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        className="brand-file-input"
        onChange={handleFileChange}
      />
    </div>
  );
}

interface AssetRowProps {
  asset: Asset;
  logoMark?: Asset;
  onUpload: (assetId: AssetId) => void;
  onRemove: (assetId: AssetId) => void;
  onDownload: (asset: Asset) => void;
  onUseLogoMark: (assetId: AssetId) => void;
}

function AssetRow({
  asset,
  logoMark,
  onUpload,
  onRemove,
  onDownload,
  onUseLogoMark,
}: AssetRowProps) {
  const isFilled = Boolean(asset.src || asset.fileName);

  return (
    <div className={`asset-row ${isFilled ? "filled" : "empty"}`}>
      {/* PREVIEW */}
      <div className={`asset-preview preview-${asset.id}`}>
        {asset.src ? (
          <img src={asset.src} alt={asset.name} />
        ) : asset.id === "logoMark" ? (
          <div className="default-hk-mark">HK</div>
        ) : (
          <span>{asset.dimensions}</span>
        )}
      </div>

      {/* INFORMATION */}
      <div className="asset-info">
        <h4>{asset.name}</h4>

        <p className="asset-description">
          {asset.description}
        </p>

        <div className="shows-in">
          <span>SHOWS IN</span>
          <span>{asset.showsIn}</span>
        </div>

        {isFilled ? (
          <>
            <div className="asset-file-name">
              {asset.fileName}
            </div>

            <div className="asset-file-meta">
              {asset.dimensions} · {asset.fileSize} · added from the live site
            </div>
          </>
        ) : (
          <>
            <div className="asset-not-set">Not set</div>

            <div className="asset-requirement">
              {asset.accepted}
            </div>
          </>
        )}

        <div className="asset-actions">
          {isFilled ? (
            <>
              <button
                type="button"
                onClick={() => onUpload(asset.id)}
              >
                Replace
              </button>

              <button
                type="button"
                onClick={() => onDownload(asset)}
              >
                Download
              </button>

              <button
                type="button"
                onClick={() => onRemove(asset.id)}
              >
                Remove
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onUpload(asset.id)}
            >
              Upload
            </button>
          )}

          {(asset.id === "favicon" || asset.id === "homeIcon") &&
            !isFilled &&
            logoMark?.src && (
              <button
                type="button"
                className="use-logo-button"
                onClick={() => onUseLogoMark(asset.id)}
              >
                Use the logo mark
              </button>
            )}
        </div>

      {asset.id !== "logoMark" && (
  <div className="prepare-note">
    <span>WHAT TO PREPARE</span>

    <p>
      {asset.id === "wordmark" &&
        "Only if you want the lettering locked as artwork instead of live type. Most brands leave this empty."}

      {asset.id === "inverseMark" &&
        "Not needed yet. Prepare one when a dark section starts carrying the logo."}

      {asset.id === "favicon" &&
        "Your HK monogram, cropped square, on a solid background. No wordmark — at this size letters turn to mush."}

      {asset.id === "homeIcon" &&
        "The same monogram, larger, on a solid cream or charcoal square. No transparency — iPhones turn transparent areas black."}

      {asset.id === "shareImage" &&
        "Landscape artwork that reads at thumbnail size: the wordmark on cream, or one strong piece photographed wide."}
    </p>
  </div>
)}
      </div>

      {/* CONTEXT MOCKS */}
      {(asset.id === "favicon" ||
        asset.id === "homeIcon" ||
        asset.id === "shareImage") && (
        <AssetMock asset={asset} />
      )}
    </div>
  );
}

function AssetMock({ asset }: { asset: Asset }) {
  if (asset.id === "favicon") {
    return (
      <div className="asset-mock">
        <span className="mock-label">IN THE BROWSER TAB</span>

        <div className="browser-tabs">
          <div className="browser-tab active-tab">
            <span className="tiny-icon">HK</span>
            <span>House of Kaira</span>
          </div>

          <div className="browser-tab">
            <span className="tiny-icon muted-icon" />
            <span>Another...</span>
          </div>
        </div>

        <p className="mock-warning">
          Blank sheet is what customers see now.
        </p>
      </div>
    );
  }

  if (asset.id === "homeIcon") {
    return (
      <div className="asset-mock">
        <span className="mock-label">ON A PHONE HOME SCREEN</span>

        <div className="phone-icon">
          <div className="phone-icon-image">HK</div>
          <span>House</span>
        </div>

        <p className="mock-warning">
          A blurry screenshot of the page is used instead.
        </p>
      </div>
    );
  }

  return (
    <div className="asset-mock share-mock">
      <span className="mock-label">PASTED INTO A CHAT</span>

      <div className="chat-preview">
        <div className="chat-image">
          {asset.src ? (
            <img src={asset.src} alt="" />
          ) : (
            <span>no picture</span>
          )}
        </div>

        <div className="chat-title">
          House of Kaira — Rent, Buy &amp; List Luxury
        </div>

        <div className="chat-domain">
          houseofkaira.com
        </div>
      </div>

      <p className="mock-warning">
        Today the link arrives as a bare grey address.
      </p>
    </div>
  );
}