import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sanitizeRichHtml } from "../../utils/sanitizeRichHtml";
import "../../styles/custom-page-sections.css";
import "../../styles/dynamic-service-page.css";

const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap";

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="hok-dyn-faq-chev" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function DynamicServicePage({ slug, pageData }) {
  const [openFaqIds, setOpenFaqIds] = useState(() => new Set());
  const [activeTabByBlock, setActiveTabByBlock] = useState({});

  const dyn = pageData?.settings?.dynamicPage || {};
  const styleCfg = pageData?.settings?.style || {};

  const displayTitle =
    String(dyn.title || "").trim() ||
    String(pageData?.title || "").trim() ||
    String(slug || "")
      .replace(/^\/+/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "House of Kaira";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = `${displayTitle} | House of Kaira`;
    if (
      (styleCfg.headingFont || styleCfg.bodyFont) &&
      !document.getElementById("hok-dynamic-google-fonts")
    ) {
      const link = document.createElement("link");
      link.id = "hok-dynamic-google-fonts";
      link.rel = "stylesheet";
      link.href = GOOGLE_FONTS_HREF;
      document.head.appendChild(link);
    }
  }, [displayTitle, styleCfg.headingFont, styleCfg.bodyFont]);

  const toggleFaq = (qId) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const bgColor = styleCfg.bgColor || "#FAF7F2";
  const textColor = styleCfg.textColor || "#1E1412";
  const accentColor = styleCfg.accentColor || "#C5A880";
  const headingFont = styleCfg.headingFont || "'Cormorant Garamond', Georgia, serif";
  const bodyFont = styleCfg.bodyFont || "'DM Sans', 'Inter', sans-serif";

  const rootStyle = {
    "--dyn-bg": bgColor,
    "--dyn-ink": textColor,
    "--dyn-accent": accentColor,
    "--dyn-serif": headingFont,
    "--dyn-sans": bodyFont,
    backgroundColor: bgColor,
    color: textColor,
    fontFamily: bodyFont,
  };

  const blocks = Array.isArray(dyn.blocks)
    ? dyn.blocks.filter((b) => b && !b.hidden)
    : [];
  const hasHero = Boolean(
    String(dyn.eyebrow || "").trim() ||
      String(dyn.title || "").trim() ||
      String(dyn.subtitle || "").trim()
  );
  const normSlug = String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  const isFullBleed =
    Boolean(dyn.fullBleed) ||
    (!hasHero &&
      (normSlug === "about" || normSlug === "about-us") &&
      blocks.length > 0);

  return (
    <main
      className={`hok-dyn-page${!hasHero ? " is-no-hero" : ""}${
        isFullBleed ? " is-full-bleed" : ""
      }`}
      style={rootStyle}
    >
      {/* Breadcrumb */}
      {!isFullBleed && (
        <nav className="hok-dyn-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{displayTitle}</span>
        </nav>
      )}

      {/* Hero Header */}
      {hasHero && (
        <header className="hok-dyn-hero">
          {String(dyn.eyebrow || "").trim() && (
            <div className="hok-dyn-eyebrow">{dyn.eyebrow}</div>
          )}
          {String(dyn.title || "").trim() && (
            <h1 className="hok-dyn-title">{dyn.title}</h1>
          )}
          {String(dyn.subtitle || "").trim() && (
            <p className="hok-dyn-subtitle">{dyn.subtitle}</p>
          )}
        </header>
      )}

      {/* Dynamic Content Blocks */}
      <div className="hok-dyn-body">
        {blocks.length === 0 ? (
          <div className="hok-dyn-empty">
            No sections published on this page yet.
          </div>
        ) : (
          blocks.map((block, bIdx) => {
            const heading = String(block.heading || "").trim();
            const subtitle = String(block.subtitle || "").trim();

            if (block.type === "rich") {
              const cleanHtml = sanitizeRichHtml(block.htmlContent || "");
              return (
                <section
                  key={block.id || `dyn-rich-${bIdx}`}
                  id={block.id || `dyn-rich-${bIdx}`}
                  className="hok-dyn-block"
                >
                  {(heading || subtitle) && (
                    <div className="hok-dyn-block-hd">
                      {heading && <h2>{heading}</h2>}
                      {subtitle && <p>{subtitle}</p>}
                    </div>
                  )}
                  {cleanHtml && (
                    <div
                      className="hok-rich-content"
                      dangerouslySetInnerHTML={{ __html: cleanHtml }}
                    />
                  )}
                </section>
              );
            }

            if (block.type === "table") {
              const isTwoCol = Number(block.columnsCount) === 2;
              const rows = Array.isArray(block.rows) ? block.rows : [];
              return (
                <section
                  key={block.id || `dyn-table-${bIdx}`}
                  id={block.id || `dyn-table-${bIdx}`}
                  className="hok-dyn-block"
                >
                  {(heading || subtitle) && (
                    <div className="hok-dyn-block-hd">
                      {heading && <h2>{heading}</h2>}
                      {subtitle && <p>{subtitle}</p>}
                    </div>
                  )}

                  <div className="hok-dyn-table-card">
                    <div className="hok-dyn-table-grid">
                      {(block.col1Header || (!isTwoCol && block.col2Header)) && (
                        <div
                          className={`hok-dyn-table-row is-head${
                            isTwoCol ? " is-two-col" : ""
                          }`}
                        >
                          <div className="hok-dyn-table-ch" />
                          <div className="hok-dyn-table-ch">
                            {block.col1Header || ""}
                          </div>
                          {!isTwoCol && (
                            <div className="hok-dyn-table-ch">
                              {block.col2Header || ""}
                            </div>
                          )}
                        </div>
                      )}

                      {rows.map((row, rIdx) => (
                        <div
                          key={row.id || `row-${rIdx}`}
                          className={`hok-dyn-table-row${
                            isTwoCol ? " is-two-col" : ""
                          }`}
                        >
                          <div className="hok-dyn-table-label">
                            {row.label || ""}
                          </div>
                          <div className="hok-dyn-table-cell">
                            <span className="hok-dyn-table-cell-title">
                              {row.col1Title || ""}
                            </span>
                            {row.col1Note && (
                              <span className="hok-dyn-table-cell-note">
                                {row.col1Note}
                              </span>
                            )}
                          </div>
                          {!isTwoCol && (
                            <div className="hok-dyn-table-cell">
                              <span className="hok-dyn-table-cell-title">
                                {row.col2Title || ""}
                              </span>
                              {row.col2Note && (
                                <span className="hok-dyn-table-cell-note">
                                  {row.col2Note}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            if (block.type === "faq") {
              const items = Array.isArray(block.items) ? block.items : [];
              return (
                <section
                  key={block.id || `dyn-faq-${bIdx}`}
                  id={block.id || `dyn-faq-${bIdx}`}
                  className="hok-dyn-block"
                >
                  {(heading || subtitle) && (
                    <div className="hok-dyn-block-hd">
                      {heading && <h2>{heading}</h2>}
                      {subtitle && <p>{subtitle}</p>}
                    </div>
                  )}

                  <div className="hok-dyn-faq-list">
                    {items.map((item, qIdx) => {
                      const qId = item.id || `faq-${bIdx}-${qIdx}`;
                      const isOpen = openFaqIds.has(qId);
                      const cleanAnswerHtml = sanitizeRichHtml(
                        item.answerHtml || ""
                      );
                      const tone = item.badgeTone || "neutral";

                      return (
                        <div
                          key={qId}
                          id={qId}
                          className={`hok-dyn-faq-item${isOpen ? " is-open" : ""}`}
                        >
                          <button
                            type="button"
                            className="hok-dyn-faq-btn"
                            aria-expanded={isOpen}
                            onClick={() => toggleFaq(qId)}
                          >
                            <span className="hok-dyn-faq-q">
                              {item.question || "Question"}
                            </span>
                            {item.badgeText ? (
                              <span className={`hok-dyn-faq-badge tone-${tone}`}>
                                {item.badgeText}
                              </span>
                            ) : (
                              <span />
                            )}
                            <ChevronIcon />
                          </button>

                          {isOpen && (
                            <div className="hok-dyn-faq-panel">
                              {cleanAnswerHtml ? (
                                <div
                                  className="hok-rich-content"
                                  dangerouslySetInnerHTML={{
                                    __html: cleanAnswerHtml,
                                  }}
                                />
                              ) : item.answerText ? (
                                <div className="hok-rich-content">
                                  <p>{item.answerText}</p>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }

            if (block.type === "tabs") {
              const tabs = Array.isArray(block.tabs) ? block.tabs : [];
              const blockKey = block.id || `dyn-tabs-${bIdx}`;
              const activeTab =
                tabs.find((t) => t.id === activeTabByBlock[blockKey]) || tabs[0];
              const tabStyle = block.tabStyle || "pill";
              const cleanIntro = sanitizeRichHtml(block.introHtml || "");
              const cleanContent = sanitizeRichHtml(activeTab?.contentHtml || "");
              const cleanFooter = sanitizeRichHtml(block.footerHtml || "");

              return (
                <section
                  key={blockKey}
                  id={block.id || undefined}
                  className={`hok-dyn-block hok-dyn-tabs-sec style-${tabStyle}`}
                >
                  {(heading || subtitle) && (
                    <div className="hok-dyn-block-hd">
                      {heading && <h2>{heading}</h2>}
                      {subtitle && <p>{subtitle}</p>}
                    </div>
                  )}

                  {cleanIntro && (
                    <div
                      className="hok-dyn-tabs-intro hok-rich-content"
                      dangerouslySetInnerHTML={{ __html: cleanIntro }}
                    />
                  )}

                  {tabs.length > 0 && (
                    <div
                      className={`hok-dyn-tabs-bar is-${tabStyle}`}
                      role="tablist"
                    >
                      {tabs.map((tab, tIdx) => {
                        const isActive = activeTab?.id === tab.id;
                        const activeColor =
                          tab.accentColor ||
                          (tabStyle === "letters" ? "#c9a96e" : "#1a1612");
                        const tabBtnStyle = isActive
                          ? tabStyle === "pill"
                            ? {
                                backgroundColor: activeColor,
                                borderColor: activeColor,
                                color: "#fffefb",
                              }
                            : tabStyle === "letters"
                            ? {
                                color: "#1A1612",
                                borderBottomColor: activeColor,
                              }
                            : {
                                color: "var(--dyn-ink)",
                                borderBottomColor: activeColor,
                              }
                          : undefined;

                        return (
                          <button
                            key={tab.id || `tab-${tIdx}`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            className={`hok-dyn-tab-btn is-${tabStyle}${
                              isActive ? " is-active" : ""
                            }`}
                            style={tabBtnStyle}
                            onClick={() =>
                              setActiveTabByBlock((prev) => ({
                                ...prev,
                                [blockKey]: tab.id,
                              }))
                            }
                            onMouseEnter={
                              tabStyle === "letters"
                                ? () =>
                                    setActiveTabByBlock((prev) => ({
                                      ...prev,
                                      [blockKey]: tab.id,
                                    }))
                                : undefined
                            }
                          >
                            <span className="hok-dyn-tab-label">
                              {tab.label || `Tab ${tIdx + 1}`}
                            </span>
                            {tabStyle === "underline" && tab.sublabel && (
                              <span className="hok-dyn-tab-sublabel">
                                {tab.sublabel}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {activeTab && (
                    <div className="hok-dyn-tab-panel" role="tabpanel">
                      {cleanContent ? (
                        <div
                          className="hok-rich-content"
                          dangerouslySetInnerHTML={{ __html: cleanContent }}
                        />
                      ) : null}
                    </div>
                  )}

                  {cleanFooter && (
                    <div
                      className="hok-dyn-tabs-footer hok-rich-content"
                      dangerouslySetInnerHTML={{ __html: cleanFooter }}
                    />
                  )}
                </section>
              );
            }

            return null;
          })
        )}
      </div>
    </main>
  );
}
