import React from "react";
import { Plus, Star } from "lucide-react";

export const CONDITION_DOT_COLOR = {
  pristine: "#6B7E5A",
  excellent: "#C9A96E",
  "very good": "#8C9A6E",
  good: "#B85C38",
  fair: "#9E6B52",
};

export const CONDITION_LABEL = {
  pristine: "PRISTINE CONDITION",
  excellent: "EXCELLENT CONDITION",
  "very good": "VERY GOOD CONDITION",
  good: "GOOD CONDITION",
  fair: "FAIR CONDITION",
};

export const CONDITION_GRADE_CONFIG = {
  pristine: {
    label: "PRISTINE",
    color: "#6B7E5A",
    desc: "Unworn or worn once for a short photoshoot. Tags may be attached. No visible wear whatsoever.",
  },
  excellent: {
    label: "EXCELLENT",
    color: "#C9A96E",
    desc: "Worn once for a full-day event. Professionally cleaned. No visible damage, alteration, or significant bead loss. Any minor imperfections are fully disclosed and photographed above.",
  },
  "very good": {
    label: "VERY GOOD",
    color: "#8C9A6E",
    desc: "Worn gently 1–2 times and professionally cleaned. Light signs of wear only upon close inspection, fully disclosed in listing notes.",
  },
  good: {
    label: "GOOD",
    color: "#B85C38",
    desc: "Worn 2–3 times. Any minor imperfections clearly photographed and disclosed in listing notes.",
  },
  fair: {
    label: "FAIR",
    color: "#9E6B52",
    desc: "Noticeable signs of archival wear appropriate to age or multiple rentals; maintained cleanly for event wear.",
  },
};

export const formatRatingValue = (rating) => {
  const num = Number(rating);
  if (!Number.isFinite(num) || num <= 0) return "0.0";
  return num.toFixed(1);
};

export function getMetaRatingSegments(
  product,
  { grade = "", showRentedCount = false, staticBadge = "" } = {},
) {
  if (!product) return [];
  const ratingVal = Number(product?.rating) || 0;
  const reviewCountVal = Number(product?.reviewCount ?? product?.reviews) || 0;
  const rentedCountVal =
    Number(product?.rentInfo?.rentedCount ?? product?.timesRented) || 0;

  const segments = [];
  if (ratingVal > 0) {
    segments.push({ type: "rating", value: ratingVal });
  }
  if (reviewCountVal > 0) {
    segments.push({ type: "reviews", value: reviewCountVal });
  }
  const normalizedGrade = String(grade || "").trim().toLowerCase();
  if (staticBadge) {
    segments.push({ type: "staticBadge", label: staticBadge });
  } else if (normalizedGrade && CONDITION_LABEL[normalizedGrade]) {
    segments.push({
      type: "grade",
      grade: normalizedGrade,
      label: CONDITION_LABEL[normalizedGrade],
      color: CONDITION_DOT_COLOR[normalizedGrade] || "#6B7E5A",
    });
  }
  if (showRentedCount && rentedCountVal > 0) {
    segments.push({ type: "rentedCount", value: rentedCountVal });
  }
  return segments;
}

export function ProductMetaRatingRow({
  product,
  grade = "",
  showRentedCount = false,
  staticBadge = "",
  classes = {},
}) {
  const segments = getMetaRatingSegments(product, {
    grade,
    showRentedCount,
    staticBadge,
  });

  if (segments.length === 0) return null;

  return (
    <div className={classes.row}>
      {segments.map((seg, idx) => (
        <React.Fragment key={seg.type}>
          {idx > 0 && classes.separator ? (
            <span className={classes.separator} />
          ) : null}
          {seg.type === "rating" && (
            <>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  className={classes.star}
                  key={s}
                  size={16}
                  fill={seg.value >= s ? "#c5a46d" : "none"}
                  stroke="#c5a46d"
                  strokeWidth={1.5}
                />
              ))}
              <span className={classes.ratingText}>
                {formatRatingValue(seg.value)}
              </span>
            </>
          )}
          {seg.type === "reviews" && (
            <span className={classes.reviews}>
              {seg.value} {seg.value === 1 ? "review" : "reviews"}
            </span>
          )}
          {seg.type === "staticBadge" && (
            <span className={classes.badge}>{seg.label}</span>
          )}
          {seg.type === "grade" && (
            <span
              className={classes.badge}
              style={{ "--dot-color": seg.color }}
            >
              {seg.label}
            </span>
          )}
          {seg.type === "rentedCount" && (
            <span className={classes.rentedCount}>Rented {seg.value}×</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export const cleanText = (val) => {
  if (val === undefined || val === null) return "";
  const str = String(val).trim();
  if (!str) return "";
  const lower = str.toLowerCase();
  if (lower === "none" || lower === "null" || lower === "undefined") return "";
  return str;
};

const toTitleCaseCondition = (val) => {
  const s = cleanText(val);
  if (!s) return "";
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

const humanizeCareId = (val) => {
  const s = cleanText(val);
  if (!s) return "";
  return s
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const formatInch = (val) => {
  const s = cleanText(val);
  if (!s) return "";
  return /^\d+(\.\d+)?$/.test(s) ? `${s}"` : s;
};

const formatCm = (val) => {
  const s = cleanText(val);
  if (!s) return "";
  return /^\d+(\.\d+)?$/.test(s) ? `${s} cm` : s;
};

const MEASUREMENT_FIELDS = [
  { key: "bust", label: "Bust (blouse)" },
  { key: "waist", label: "Waist (skirt)" },
  { key: "hips", label: "Hips (skirt fall)" },
  { key: "length", label: "Length (skirt)" },
];

export function buildProductDetailRows(product, { includeDisclosure = true } = {}) {
  if (!product) return [];

  const details = product.details || {};
  const sizesList = (Array.isArray(product.sizes) ? product.sizes : [])
    .map((s) => cleanText(typeof s === "object" ? s?.label || s?.size : s))
    .filter(Boolean);
  const tagsList = (Array.isArray(product.tags) ? product.tags : [])
    .map(cleanText)
    .filter(Boolean);

  const rawWeight = cleanText(details.weight || product.weight);
  const formattedWeight = rawWeight
    ? /^\d+(\.\d+)?$/.test(rawWeight)
      ? `${rawWeight} g`
      : rawWeight
    : "";

  const rawCondition =
    typeof product.condition === "object"
      ? product.condition?.label || product.condition?.grade
      : product.condition;
  const conditionText = toTitleCaseCondition(details.condition || rawCondition);

  const candidates = [
    { key: "designer", label: "Designer", value: cleanText(details.designer || product.designer) },
    { key: "category", label: "Category", value: cleanText(details.category || product.category) },
    { key: "occasion", label: "Occasion(s)", value: cleanText(details.occasion || product.occasion) },
    { key: "fabric", label: "Fabric / Material", value: cleanText(details.fabric || product.material || product.fabric) },
    { key: "color", label: "Colour", value: cleanText(details.color || product.color) },
    { key: "craft", label: "Craft", value: cleanText(details.craft || product.craft) },
    { key: "technique", label: "Technique", value: cleanText(details.technique || product.technique || product.craftTechnique) },
    { key: "embellishments", label: "Embroidery Details", value: cleanText(details.embellishments || product.embellishments) },
    { key: "thread", label: "Thread / Yarn Detail", value: cleanText(details.thread || product.threadYarnDetail || product.threadWork) },
    { key: "includes", label: "Set Includes", value: cleanText(details.includes || product.setIncludes || product.includes) },
    { key: "origin", label: "Origin", value: cleanText(details.origin || product.origin) },
    { key: "size", label: "Size", value: sizesList.join(", ") },
    { key: "weight", label: "Weight", value: formattedWeight },
    { key: "delivery", label: "Delivery Timing", value: cleanText(details.delivery || product.deliveryTiming || product.delivery) },
    { key: "condition", label: "Condition", value: conditionText },
    { key: "sku", label: "SKU", value: cleanText(details.sku) },
    { key: "tags", label: "Tags", value: tagsList.join(", ") },
  ];

  if (includeDisclosure) {
    candidates.push({
      key: "honestDisclosure",
      label: "Honest Disclosure",
      value: cleanText(product.honestDisclosure || product.disclosure),
    });
  }

  return candidates.filter((row) => Boolean(row.value));
}

const DEFAULT_CRAFT_COPY =
  "Each piece in the House of Kaira rental archive begins as an exclusive conversation between master designer and artisan karigars. Handcrafted over weeks in artisanal ateliers, every motif is meticulously stitched to perfection.";

export default function ProductCoreAccordions({
  product,
  isOpen,
  toggle,
  classes,
  showConditionGradeAccordion = false,
  includeDisclosureInDetails = true,
  showStoryAlways = false,
  defaultCraftCopy = DEFAULT_CRAFT_COPY,
  shippingMode = "table",
}) {
  if (!product) return null;

  const detailRows = buildProductDetailRows(product, {
    includeDisclosure: includeDisclosureInDetails,
  });

  const craftText = cleanText(product.details?.craft || product.craft);
  const techniqueText = cleanText(
    product.details?.technique || product.technique || product.craftTechnique,
  );
  const embroideryText = cleanText(
    product.details?.embellishments || product.embellishments,
  );
  const threadText = cleanText(
    product.details?.thread || product.threadYarnDetail || product.threadWork,
  );
  const craftSummaryParts = [
    craftText ? `Craft: ${craftText}` : "",
    techniqueText ? `Technique: ${techniqueText}` : "",
    embroideryText ? `Embroidery: ${embroideryText}` : "",
    threadText ? `Thread: ${threadText}` : "",
  ].filter(Boolean);

  const storyText = cleanText(product.story || product.craftStory);
  const stylingNote = cleanText(product.stylingNote);

  const sizesList = (Array.isArray(product.sizes) ? product.sizes : [])
    .map((s) => cleanText(typeof s === "object" ? s?.label || s?.size : s))
    .filter(Boolean);
  const sizeGuideIntro = cleanText(product.sizeGuide || product.sizeNote);

  const measurements = product.measurements || {};
  const measurementsCm = product.measurementsCm || {};
  const bestSuitedForHeight = cleanText(product.bestSuitedForHeight);

  const measurementRows = MEASUREMENT_FIELDS.map((field) => ({
    key: field.key,
    label: field.label,
    inches: formatInch(measurements[field.key]),
    cm: formatCm(measurementsCm[field.key]),
  })).filter((r) => Boolean(r.inches || r.cm));

  const realSizeTable = Array.isArray(product.sizeTable)
    ? product.sizeTable.filter(
        (row) =>
          row &&
          Boolean(
            cleanText(row.bust) ||
              cleanText(row.waist) ||
              cleanText(row.hips) ||
              cleanText(row.height),
          ),
      )
    : [];

  const careItems = (Array.isArray(product.care) ? product.care : [])
    .map(cleanText)
    .filter(Boolean);
  const careByFabricFallback =
    careItems.length === 0 ? humanizeCareId(product.careByFabric) : "";

  const shippingItems = Array.isArray(product.shipping)
    ? product.shipping.filter((item) => {
        if (!item) return false;
        if (typeof item === "string") return Boolean(cleanText(item));
        return Boolean(
          cleanText(item.method) || cleanText(item.time) || cleanText(item.cost),
        );
      })
    : [];
  const packagingItems = (
    Array.isArray(product.packaging) ? product.packaging : []
  )
    .map(cleanText)
    .filter(Boolean);
  const deliveryTiming = cleanText(
    product.details?.delivery || product.deliveryTiming || product.delivery,
  );

  const activeGrade = cleanText(
    typeof product.condition === "object"
      ? product.condition?.grade
      : product.condition,
  ).toLowerCase();

  return (
    <div className={classes.accordion}>
      {/* ================= PRODUCT DETAILS ================= */}
      <div className={classes.item}>
        <div className={classes.header} onClick={() => toggle("details")}>
          <span>PRODUCT DETAILS</span>
          <Plus className={`${classes.icon} ${isOpen("details") ? "open" : ""}`} />
        </div>

        {isOpen("details") && (
          <div className={classes.content}>
            {detailRows.length > 0 ? (
              <div className={classes.grid}>
                {detailRows.map((row) => (
                  <div key={row.key} className={classes.row}>
                    <span className={classes.label}>{row.label}</span>
                    {row.swatches ? (
                      <p
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "8px 12px",
                        }}
                      >
                        {row.swatches.map((sw, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {sw.hex && (
                              <span
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: sw.hex,
                                  border: "1px solid rgba(26,22,18,0.2)",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <span>{sw.name}</span>
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p style={row.key === "honestDisclosure" ? { whiteSpace: "pre-line" } : undefined}>
                        {row.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className={classes.sizeIntro} style={{ margin: 0 }}>
                No additional details added for this piece.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ================= THE CRAFT ================= */}
      <div className={classes.item}>
        <div className={classes.header} onClick={() => toggle("craft")}>
          <span>THE CRAFT</span>
          <Plus className={`${classes.icon} ${isOpen("craft") ? "open" : ""}`} />
        </div>

        {isOpen("craft") && (
          <div className={classes.content}>
            {craftText.length >= 60 ? (
              <p className={classes.craftText} style={{ whiteSpace: "pre-line", margin: 0 }}>
                {craftText}
              </p>
            ) : (
              <>
                {craftSummaryParts.length > 0 && (
                  <p
                    className={classes.craftText}
                    style={{
                      fontStyle: "normal",
                      color: "#1A1612",
                      marginBottom: 10,
                    }}
                  >
                    {craftSummaryParts.join(" · ")}
                  </p>
                )}
                <p className={classes.craftText} style={{ margin: 0 }}>
                  {defaultCraftCopy}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ================= THE STORY OF THIS PIECE ================= */}
      {(storyText || stylingNote || showStoryAlways) && (
        <div className={classes.item}>
          <div className={classes.header} onClick={() => toggle("story")}>
            <span>THE STORY OF THIS PIECE</span>
            <Plus className={`${classes.icon} ${isOpen("story") ? "open" : ""}`} />
          </div>

          {isOpen("story") && (
            <div className={classes.content}>
              {storyText ? (
                <p className={classes.craftText} style={{ whiteSpace: "pre-line", margin: 0 }}>
                  {storyText}
                </p>
              ) : (
                <p className={classes.sizeIntro} style={{ margin: 0 }}>
                  No story has been added for this piece yet.
                </p>
              )}
              {stylingNote && (
                <p className={classes.storyNote || classes.sizeIntro} style={{ marginTop: 12, marginBottom: 0 }}>
                  {stylingNote}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= SIZE & FIT ================= */}
      <div className={classes.item} data-size-guide>
        <div className={classes.header} onClick={() => toggle("size")}>
          <span>SIZE & FIT</span>
          <Plus className={`${classes.icon} ${isOpen("size") ? "open" : ""}`} />
        </div>

        {isOpen("size") && (
          <div className={classes.content}>
            {sizesList.length > 0 && (
              <p className={classes.sizeIntro} style={{ marginBottom: measurementRows.length > 0 || sizeGuideIntro ? 10 : 0 }}>
                <strong>Garment Size:</strong> {sizesList.join(", ")}
              </p>
            )}

            {sizeGuideIntro && (
              <p className={classes.sizeIntro} style={{ marginBottom: measurementRows.length > 0 ? 12 : 0 }}>
                {sizeGuideIntro}
              </p>
            )}

            {measurementRows.length > 0 || bestSuitedForHeight ? (
              <table className={classes.sizeTable}>
                <thead>
                  <tr>
                    <th>Measurement</th>
                    <th>Inches</th>
                    <th>Centimetres</th>
                  </tr>
                </thead>
                <tbody>
                  {measurementRows.map((row) => (
                    <tr key={row.key}>
                      <td>{row.label}</td>
                      <td>{row.inches || "—"}</td>
                      <td>{row.cm || "—"}</td>
                    </tr>
                  ))}
                  {bestSuitedForHeight && (
                    <tr className={classes.activeRow}>
                      <td>Best suited for height</td>
                      <td colSpan={2}>{bestSuitedForHeight}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : realSizeTable.length > 0 ? (
              <table className={classes.sizeTable}>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust</th>
                    <th>Waist</th>
                    <th>Hips</th>
                    <th>Height</th>
                  </tr>
                </thead>
                <tbody>
                  {realSizeTable.map((row, i) => (
                    <tr key={i} className={row.recommended ? classes.activeRow : ""}>
                      <td>{cleanText(row.size || row.label) || "—"}</td>
                      <td>{cleanText(row.bust) || "—"}</td>
                      <td>{cleanText(row.waist) || "—"}</td>
                      <td>{cleanText(row.hips) || "—"}</td>
                      <td>{cleanText(row.height) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : !sizeGuideIntro && sizesList.length === 0 ? (
              <p className={classes.sizeIntro} style={{ margin: 0 }}>
                No measurements added for this piece yet.
              </p>
            ) : null}
          </div>
        )}
      </div>

      {/* ================= CONDITION GRADE (PRELOVED) ================= */}
      {showConditionGradeAccordion && (
        <div className={classes.item}>
          <div className={classes.header} onClick={() => toggle("condition")}>
            <span>CONDITION GRADE</span>
            <Plus className={`${classes.icon} ${isOpen("condition") ? "open" : ""}`} />
          </div>

          {isOpen("condition") && (
            <div className={classes.content}>
              {Object.keys(CONDITION_GRADE_CONFIG).map((key) => {
                const item = CONDITION_GRADE_CONFIG[key];
                const isActive = activeGrade === key;
                return (
                  <div
                    key={key}
                    className={`${classes.gradeItem} ${isActive ? "active" : ""}`}
                  >
                    <div className={classes.gradeHeader}>
                      <span
                        className={classes.gradeDot}
                        style={{ background: item.color }}
                      />
                      <span className={classes.gradeName}>
                        {item.label}
                        {isActive && " ← THIS PIECE"}
                      </span>
                    </div>
                    <p className={classes.gradeDesc}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= CARE INSTRUCTIONS ================= */}
      <div className={classes.item}>
        <div className={classes.header} onClick={() => toggle("care")}>
          <span>CARE INSTRUCTIONS</span>
          <Plus className={`${classes.icon} ${isOpen("care") ? "open" : ""}`} />
        </div>

        {isOpen("care") && (
          <div className={classes.content}>
            {careItems.length > 0 ? (
              classes.careList ? (
                <ul className={classes.careList}>
                  {careItems.map((item, i) => (
                    <li key={i}>
                      <span className={classes.careDash}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                careItems.map((item, i) => (
                  <p key={i} className={classes.careItem}>
                    <span className={classes.careDash}>—</span>
                    <span>{item}</span>
                  </p>
                ))
              )
            ) : careByFabricFallback ? (
              classes.careList ? (
                <ul className={classes.careList}>
                  <li>
                    <span className={classes.careDash}>—</span>
                    <span>{careByFabricFallback}</span>
                  </li>
                </ul>
              ) : (
                <p className={classes.careItem}>
                  <span className={classes.careDash}>—</span>
                  <span>{careByFabricFallback}</span>
                </p>
              )
            ) : (
              <p className={classes.sizeIntro} style={{ margin: 0 }}>
                No care instructions specified for this piece.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ================= SHIPPING & DELIVERY ================= */}
      <div className={classes.item}>
        <div className={classes.header} onClick={() => toggle("shipping")}>
          <span>SHIPPING & DELIVERY</span>
          <Plus className={`${classes.icon} ${isOpen("shipping") ? "open" : ""}`} />
        </div>

        {isOpen("shipping") && (
          <div className={classes.content}>
            {shippingMode === "table" ? (
              <>
                {shippingItems.length > 0 ? (
                  <table className={classes.shippingTable}>
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Estimated time</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingItems.map((item, i) => (
                        <tr key={i}>
                          <td>{cleanText(typeof item === "string" ? "Shipping" : item.method) || "—"}</td>
                          <td>{cleanText(typeof item === "string" ? item : item.time) || "—"}</td>
                          <td className={classes.shippingCost}>{cleanText(typeof item === "string" ? "" : item.cost) || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : deliveryTiming ? (
                  <table className={classes.shippingTable}>
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Estimated time</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Delivery Timing</td>
                        <td>{deliveryTiming}</td>
                        <td className={classes.shippingCost}>—</td>
                      </tr>
                    </tbody>
                  </table>
                ) : packagingItems.length === 0 ? (
                  <p className={classes.sizeIntro} style={{ margin: 0 }}>
                    Standard shipping &amp; delivery timelines apply.
                  </p>
                ) : null}
                {packagingItems.map((text, i) => (
                  <p key={i} className={classes.sizeIntro} style={{ marginTop: 10, marginBottom: 0 }}>
                    {text}
                  </p>
                ))}
              </>
            ) : (
              <>
                {shippingItems.length > 0 ? (
                  shippingItems.map((item, i) => (
                    <p key={i} className={classes.shippingItem}>
                      <span className={classes.shippingDash}>—</span>
                      <span>
                        {typeof item === "string"
                          ? item
                          : `${cleanText(item.method) || "Shipping"}: ${cleanText(item.time)}${cleanText(item.cost) ? `, ${cleanText(item.cost)}` : ""}`}
                      </span>
                    </p>
                  ))
                ) : deliveryTiming ? (
                  <p className={classes.shippingItem}>
                    <span className={classes.shippingDash}>—</span>
                    <span>Delivery Timing: {deliveryTiming}</span>
                  </p>
                ) : null}
                {packagingItems.map((text, i) => (
                  <p key={i} className={classes.shippingPackaging}>
                    {text}
                  </p>
                ))}
                {shippingItems.length === 0 && !deliveryTiming && packagingItems.length === 0 && (
                  <p className={classes.sizeIntro} style={{ margin: 0 }}>
                    Standard shipping &amp; delivery timelines apply.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
