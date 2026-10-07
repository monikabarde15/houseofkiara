/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · LEFT NAVIGATOR
   Spec Section 6 & 9.2 (v213)
========================================================= */

import React from 'react';
import './HomepageNavigator.css';
import { HomepageRegistry, BandId, HealthSeverity } from '../types/homepage.types';

interface HomepageNavigatorProps {
  registry: HomepageRegistry;
  activeBand: BandId;
  onSelectBand: (bandId: BandId) => void;
  onReorderBand?: (fromIndex: number, toIndex: number) => void;
  highestSeverityByBand: { [key in BandId]?: HealthSeverity };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  deviceMode: 'Desktop' | 'Mobile';
  onChangeDeviceMode: (mode: 'Desktop' | 'Mobile') => void;
  onNavigateToSiteSettings: () => void;
}

export const HomepageNavigator: React.FC<HomepageNavigatorProps> = ({
  registry,
  activeBand,
  onSelectBand,
  onReorderBand,
  highestSeverityByBand,
  isCollapsed,
  onToggleCollapse,
  deviceMode,
  onChangeDeviceMode,
  onNavigateToSiteSettings
}) => {
  const { bands, vis, hero, hiw, featured, category, occasions, commit, designers, testi, insta } = registry;

  // Render structural sketch per band (Spec 9.2)
  const renderBandSketch = (bandId: BandId) => {
    const isShown = vis[bandId];
    if (!isShown) {
      return (
        <div className="hok-hp-sketch-box is-hatched">
          {bandId === 'occasions'
            ? 'Shop by Occasion — not showing (not built)'
            : `${registry.bands.find((b) => b.id === bandId)?.lbl} — not showing`}
        </div>
      );
    }

    switch (bandId) {
      case 'hero': {
        const headline =
          deviceMode === 'Mobile' && hero.headlineMob
            ? hero.headlineMob
            : hero.headline || 'Wear it with *love.*\nPass it on.';
        const parts = headline.split(/(\*[^*]+\*)/g);
        const layout = deviceMode === 'Mobile' ? (hero.layoutMob || 'Full bleed') : (hero.layout || 'Split');
        const showFigures = deviceMode === 'Mobile' ? hero.figuresOnMob : hero.figuresOn;
        const showBadge = deviceMode === 'Mobile' ? hero.badgeMob : hero.badge;
        const side = hero.side || 'Picture on the right';

        return (
          <div className="hok-hp-sketch-box">
            {hero.eyebrow && (
              <span className="hok-hp-sketch-kicker">{hero.eyebrow}</span>
            )}
            <span className="hok-hp-sketch-headline">
              {parts.map((p, i) =>
                p.startsWith('*') && p.endsWith('*') ? (
                  <span key={i} className="hok-hp-sketch-gold">
                    {p.slice(1, -1)}
                  </span>
                ) : (
                  p
                )
              )}
            </span>
            <div style={{ marginTop: 2 }}>
              <div
                style={{
                  backgroundColor: 'var(--charcoal)',
                  color: '#ffffff',
                  fontSize: '6.5px',
                  fontWeight: 600,
                  padding: '2px 5px',
                  borderRadius: 2,
                  display: 'inline-block',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px'
                }}
              >
                {hero.cta?.lbl || 'EXPLORE COLLECTION'}
              </div>
            </div>
            {showFigures && (
              <span style={{ fontSize: '7px', color: 'var(--muted)', display: 'block', marginTop: 2 }}>
                3 figures · live
              </span>
            )}
            {layout === 'Split' ? (
              <div style={{ marginTop: 3 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, height: 18 }}>
                  {side === 'Picture on the left' ? (
                    <>
                      <div style={{ border: '1px dashed var(--ib)', borderRadius: 1 }} />
                      <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--cb)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6.5px', color: 'var(--muted)' }}>
                        words
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--cb)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6.5px', color: 'var(--muted)' }}>
                        words
                      </div>
                      <div style={{ border: '1px dashed var(--ib)', borderRadius: 1 }} />
                    </>
                  )}
                </div>
                <span style={{ fontSize: '6.5px', color: 'var(--muted)', display: 'block', marginTop: 2 }}>
                  Split · {side.toLowerCase()}
                </span>
              </div>
            ) : (
              <div style={{ marginTop: 3 }}>
                <div style={{ height: 18, border: '1px dashed var(--ib)', borderRadius: 1 }} />
                <span style={{ fontSize: '6.5px', color: 'var(--muted)', display: 'block', marginTop: 2 }}>
                  Full bleed · words over the picture
                </span>
              </div>
            )}
            {showBadge && (
              <span style={{ fontSize: '6.5px', color: 'var(--muted)', display: 'block', marginTop: 1 }}>
                Badge · carrying Ivory Embroidered Sherwani
              </span>
            )}
          </div>
        );
      }

      case 'hiw': {
        const headline = hiw.heading || 'How House of Kaira *works*';
        const parts = headline.split(/(\*[^*]+\*)/g);
        return (
          <div className="hok-hp-sketch-box">
            {hiw.eyebrow && (
              <span className="hok-hp-sketch-kicker">{hiw.eyebrow}</span>
            )}
            <span className="hok-hp-sketch-headline">
              {parts.map((p, i) =>
                p.startsWith('*') && p.endsWith('*') ? (
                  <span key={i} className="hok-hp-sketch-gold">
                    {p.slice(1, -1)}
                  </span>
                ) : (
                  p
                )
              )}
            </span>
            <div style={{ fontSize: '7.5px', color: 'var(--muted)', margin: '2px 0' }}>
              I want to shop | I want to sell
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ height: 12, backgroundColor: 'var(--canvas)', border: '1px solid var(--ib)', borderRadius: 1 }} />
              ))}
            </div>
          </div>
        );
      }

      case 'featured': {
        const headline = featured.heading || 'Featured *Pieces*';
        const parts = headline.split(/(\*[^*]+\*)/g);
        const cardsPerRow = deviceMode === 'Mobile' ? (featured.cardsPerRowMob || 2) : (featured.cardsPerRow || 4);
        const slotsCount = featured.slots?.length || 4;
        const slotsToShow = (featured.slots || []).slice(0, cardsPerRow);

        return (
          <div className="hok-hp-sketch-box">
            {featured.eyebrow && (
              <span className="hok-hp-sketch-kicker">{featured.eyebrow}</span>
            )}
            <span className="hok-hp-sketch-headline">
              {parts.map((p, i) =>
                p.startsWith('*') && p.endsWith('*') ? (
                  <span key={i} className="hok-hp-sketch-gold">
                    {p.slice(1, -1)}
                  </span>
                ) : (
                  p
                )
              )}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`, gap: 2, marginTop: 2 }}>
              {slotsToShow.map((slotSku, i) => {
                const isBad = i === 3 || slotSku === 'HOK-SKU-004';
                return (
                  <div
                    key={i}
                    style={{
                      height: 12,
                      backgroundColor: isBad ? '#FDF1EE' : 'var(--charcoal)',
                      border: isBad ? '1px solid var(--terra)' : '1px solid var(--charcoal)',
                      borderRadius: 1
                    }}
                  />
                );
              })}
            </div>
            <span style={{ fontSize: '7px', color: 'var(--muted)', display: 'block', marginTop: 2 }}>
              {slotsCount} of 8 slots used
            </span>
          </div>
        );
      }

      case 'category': {
        const showHeader = deviceMode === 'Mobile' ? category.headerMob : category.header;
        const headline = category.heading || 'Shop by *Category*';
        const parts = headline.split(/(\*[^*]+\*)/g);
        const layout = deviceMode === 'Mobile' ? (category.layoutMob || 'Carousel') : (category.layout || 'Mosaic');

        return (
          <div className="hok-hp-sketch-box">
            {showHeader && (
              <>
                {category.eyebrow && (
                  <span className="hok-hp-sketch-kicker">{category.eyebrow}</span>
                )}
                <span className="hok-hp-sketch-headline">
                  {parts.map((p, i) =>
                    p.startsWith('*') && p.endsWith('*') ? (
                      <span key={i} className="hok-hp-sketch-gold">
                        {p.slice(1, -1)}
                      </span>
                    ) : (
                      p
                    )
                  )}
                </span>
              </>
            )}
            {deviceMode === 'Mobile' ? (
              <div style={{ display: 'flex', gap: 2, margin: '2px 0' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ flex: 1, height: 12, backgroundColor: 'var(--canvas)', border: '1px solid var(--ib)', borderRadius: 1 }} />
                ))}
              </div>
            ) : layout === 'Mosaic' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 2, margin: '2px 0' }}>
                <div style={{ height: 14, backgroundColor: 'var(--canvas)', border: '1px solid var(--ib)', borderRadius: 1 }} />
                <div style={{ height: 14, backgroundColor: 'var(--canvas)', border: '1px solid var(--ib)', borderRadius: 1 }} />
                <div style={{ height: 14, backgroundColor: 'var(--canvas)', border: '1px solid var(--ib)', borderRadius: 1 }} />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, margin: '2px 0' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ height: 12, backgroundColor: 'var(--canvas)', border: '1px solid var(--ib)', borderRadius: 1 }} />
                ))}
              </div>
            )}
            <div style={{ fontSize: '6.5px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Bridal Lehengas · Sherwanis · Sarees · Anarkalis · Indo-Western
            </div>
            <span style={{ fontSize: '7px', color: 'var(--muted)', display: 'block', marginTop: 1 }}>
              5 tiles · {layout}
            </span>
          </div>
        );
      }

      case 'occasions': {
        const headline = occasions?.heading || 'Shop by *Occasion*';
        const parts = headline.split(/(\*[^*]+\*)/g);
        const layout = occasions?.layout || 'Even grid';

        return (
          <div className="hok-hp-sketch-box">
            {occasions?.eyebrow && (
              <span className="hok-hp-sketch-kicker">{occasions.eyebrow}</span>
            )}
            <span className="hok-hp-sketch-headline">
              {parts.map((p, i) =>
                p.startsWith('*') && p.endsWith('*') ? (
                  <span key={i} className="hok-hp-sketch-gold">
                    {p.slice(1, -1)}
                  </span>
                ) : (
                  p
                )
              )}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: layout === 'Mosaic' ? '2fr 1fr 1fr' : 'repeat(6, 1fr)', gap: 2, margin: '2px 0' }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ height: 12, backgroundColor: 'var(--canvas)', border: '1px solid var(--ib)', borderRadius: 1 }} />
              ))}
            </div>
            <span style={{ fontSize: '7px', color: 'var(--muted)', display: 'block', marginTop: 1 }}>
              6 occasions · {layout}
            </span>
          </div>
        );
      }

      case 'commit': {
        const commitHead = commit.heading || 'Fashion that gives *back*';
        const parts = commitHead.split(/(\*[^*]+\*)/g);
        const enabledPills = commit.pills.filter((p) => p.on);
        const visibleCards = deviceMode === 'Mobile' ? commit.cards.filter((c) => c.mob) : commit.cards;
        return (
          <div className="hok-hp-sketch-box">
            {commit.eyebrow && (
              <span className="hok-hp-sketch-kicker">{commit.eyebrow}</span>
            )}
            <span className="hok-hp-sketch-headline">
              {parts.map((p, i) =>
                p.startsWith('*') && p.endsWith('*') ? (
                  <span key={i} className="hok-hp-sketch-gold">
                    {p.slice(1, -1)}
                  </span>
                ) : (
                  p
                )
              )}
            </span>
            {enabledPills.length > 0 && (
              <div style={{ fontSize: '8px', color: 'var(--muted)', margin: '2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {enabledPills.map((p) => p.l).join(' · ')}
              </div>
            )}
            <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
              {visibleCards.map((c, i) => (
                <div
                  key={c.id || i}
                  style={{
                    flex: 1,
                    height: 12,
                    backgroundColor: 'var(--canvas)',
                    border: '1px solid var(--ib)',
                    borderRadius: 2
                  }}
                />
              ))}
            </div>
          </div>
        );
      }

      case 'designers': {
        const isHeaderOn = deviceMode === 'Mobile' ? designers.headerMob : designers.header;
        const desHead = designers.heading || 'Featured *Designers*';
        const parts = desHead.split(/(\*[^*]+\*)/g);
        const slotsCount = designers.slots && designers.slots.length > 0 ? designers.slots.length : 7;
        const shownCount = Math.min(slotsCount, designers.cap || 6);

        if (deviceMode === 'Mobile') {
          return (
            <div className="hok-hp-sketch-box">
              {isHeaderOn && (
                <span className="hok-hp-sketch-headline">
                  {parts.map((p, i) =>
                    p.startsWith('*') && p.endsWith('*') ? (
                      <span key={i} className="hok-hp-sketch-gold">
                        {p.slice(1, -1)}
                      </span>
                    ) : (
                      p
                    )
                  )}
                </span>
              )}
              <div
                style={{
                  height: 18,
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--ib)',
                  borderRadius: 2,
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '7.5px',
                  color: 'var(--muted)'
                }}
              >
                1 slide · Carousel
              </div>
              <span style={{ fontSize: '7px', color: 'var(--muted)', display: 'block', marginTop: 2 }}>
                {shownCount} shown · Carousel
              </span>
            </div>
          );
        }

        return (
          <div className="hok-hp-sketch-box">
            {isHeaderOn && (
              <span className="hok-hp-sketch-headline">
                {parts.map((p, i) =>
                  p.startsWith('*') && p.endsWith('*') ? (
                    <span key={i} className="hok-hp-sketch-gold">
                      {p.slice(1, -1)}
                    </span>
                  ) : (
                    p
                  )
                )}
              </span>
            )}
            <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
              {Array.from({ length: shownCount }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 12,
                    backgroundColor: i === 1 || i === 4 || i === 5 ? '#FDF1EE' : 'var(--canvas)',
                    border: i === 1 || i === 4 || i === 5 ? '1px solid var(--terra)' : '1px solid var(--ib)',
                    borderRadius: 2
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '7px', color: 'var(--muted)', display: 'block', marginTop: 2 }}>
              {shownCount} shown · {designers.layout || 'Grid'}
            </span>
          </div>
        );
      }

      case 'testi': {
        const testiHead = testi.heading || 'What our customers *say*';
        const parts = testiHead.split(/(\*[^*]+\*)/g);
        const enabledQuotes = testi.cards.filter((c) => c.on);
        const shownQuotes = enabledQuotes.slice(0, 3);
        return (
          <div className="hok-hp-sketch-box">
            {testi.eyebrow && (
              <span className="hok-hp-sketch-kicker">{testi.eyebrow}</span>
            )}
            <span className="hok-hp-sketch-headline">
              {parts.map((p, i) =>
                p.startsWith('*') && p.endsWith('*') ? (
                  <span key={i} className="hok-hp-sketch-gold">
                    {p.slice(1, -1)}
                  </span>
                ) : (
                  p
                )
              )}
            </span>
            <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
              {shownQuotes.map((c, i) => (
                <div
                  key={c.id || i}
                  style={{
                    flex: 1,
                    height: 12,
                    backgroundColor: 'var(--canvas)',
                    border: '1px solid var(--ib)',
                    borderRadius: 2
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '7px', color: 'var(--muted)', display: 'block', marginTop: 2 }}>
              {enabledQuotes.length} quotes
            </span>
          </div>
        );
      }

      case 'insta': {
        const headline = insta.heading || 'As seen on *Instagram*';
        const parts = headline.split(/(\*[^*]+\*)/g);
        const tiles = insta.tiles || [];
        const followPrefix =
          deviceMode === 'Mobile' && insta.stripMob
            ? insta.stripMob
            : insta.strip || 'Follow our story at';
        const followLine = `${followPrefix} @house_of_kaira`;

        return (
          <div className="hok-hp-sketch-box">
            {insta.eyebrow && (
              <span className="hok-hp-sketch-kicker">{insta.eyebrow}</span>
            )}
            <span className="hok-hp-sketch-headline">
              {parts.map((p, i) =>
                p.startsWith('*') && p.endsWith('*') ? (
                  <span key={i} className="hok-hp-sketch-gold">
                    {p.slice(1, -1)}
                  </span>
                ) : (
                  p
                )
              )}
            </span>
            <div style={{ display: 'flex', gap: 2, margin: '2px 0' }}>
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const t = tiles[i];
                const hasImg = t && !!t.img;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 10,
                      backgroundColor: hasImg ? 'var(--canvas)' : 'transparent',
                      border: hasImg ? '1px solid var(--ib)' : '1px dashed var(--ib)',
                      borderRadius: 1
                    }}
                  />
                );
              })}
            </div>
            <span style={{ fontSize: '7px', color: 'var(--muted)', display: 'block' }}>
              {followLine}
            </span>
          </div>
        );
      }

      default:
        return null;
    }
  };

  /* 6.2 Collapsed Focus Mode Spine */
  if (isCollapsed) {
    return (
      <div className="hok-hp-spine-container">
        <button
          type="button"
          className="hok-hp-nav-collapse-btn"
          onClick={onToggleCollapse}
          title="Expand Navigator"
        >
          »
        </button>

        {bands.map((band, idx) => {
          const isSelected = activeBand === band.id;
          const isShown = vis[band.id];
          const sev = highestSeverityByBand[band.id];
          return (
            <button
              key={band.id}
              type="button"
              className={`hok-hp-spine-btn ${isSelected ? 'is-selected' : ''} ${!isShown ? 'is-hidden' : ''}`}
              onClick={() => onSelectBand(band.id)}
              title={`${band.lbl} (Band ${idx + 1})`}
            >
              <span>{idx + 1}</span>
              {sev && <span className={`hok-hp-spine-dot hok-hp-issue-dot is-${sev}`} />}
            </button>
          );
        })}
      </div>
    );
  }

  /* 6.1 Full Navigator */
  return (
    <div className={`hok-hp-nav-container ${deviceMode === 'Mobile' ? 'is-mobile' : ''}`}>
      {/* Header */}
      <div className="hok-hp-nav-header">
        <span className="hok-hp-nav-the-page-label">THE PAGE</span>

        <div className="hok-hp-nav-device-switcher">
          <button
            type="button"
            className={`hok-hp-nav-device-btn ${deviceMode === 'Desktop' ? 'is-active' : ''}`}
            onClick={() => onChangeDeviceMode('Desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            className={`hok-hp-nav-device-btn ${deviceMode === 'Mobile' ? 'is-active' : ''}`}
            onClick={() => onChangeDeviceMode('Mobile')}
          >
            Mobile
          </button>
        </div>

        <button
          type="button"
          className="hok-hp-nav-collapse-btn"
          onClick={onToggleCollapse}
          title="Collapse Navigator (Focus Mode)"
        >
          «
        </button>
      </div>

      {/* Top Chrome Strip */}
      <div
        className="hok-hp-chrome-strip"
        onClick={onNavigateToSiteSettings}
        title="Edit in Site Settings"
      >
        <span>ANNOUNCEMENT · HEADER</span>
        <span className="hok-hp-chrome-tag">Site Settings →</span>
      </div>

      {/* 9 Bands */}
      <div className="hok-hp-bands-list">
        {bands.map((band, idx) => {
          const isSelected = activeBand === band.id;
          const isShown = vis[band.id];
          const sev = highestSeverityByBand[band.id];

          return (
            <div
              key={band.id}
              className={`hok-hp-band-row-card ${isSelected ? 'is-selected' : ''} ${!isShown ? 'is-hidden' : ''}`}
              onClick={() => onSelectBand(band.id)}
            >
              <div className="hok-hp-band-card-top">
                <div className="hok-hp-band-label-group">
                  <span className="hok-hp-band-num">{idx + 1}</span>

                  {/* Reorder Arrows on the left (Spec 6.1, 6.2) */}
                  <div
                    className="hok-hp-reorder-group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="hok-hp-band-arrow-btn"
                      disabled={idx === 0}
                      onClick={() => onReorderBand && onReorderBand(idx, idx - 1)}
                      title="Move band up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="hok-hp-band-arrow-btn"
                      disabled={idx === bands.length - 1}
                      onClick={() => onReorderBand && onReorderBand(idx, idx + 1)}
                      title="Move band down"
                    >
                      ▼
                    </button>
                  </div>

                  <span className="hok-hp-band-title-text">{band.ttl}</span>
                  {sev && <span className={`hok-hp-issue-dot is-${sev}`} title={`Severity: ${sev}`} />}
                </div>
              </div>

              {/* Mini Structural Sketch */}
              {renderBandSketch(band.id)}
            </div>
          );
        })}
      </div>

      {/* Bottom Chrome Strip */}
      <div
        className="hok-hp-chrome-strip"
        onClick={onNavigateToSiteSettings}
        title="Edit in Site Settings"
      >
        <span>FOOTER</span>
        <span className="hok-hp-chrome-tag">Site Settings →</span>
      </div>

      {/* Footnote */}
      <div className="hok-hp-nav-footnote">
        {deviceMode === 'Mobile'
          ? 'The page in order. Click a band to edit it; use the arrows on the left of a band to move it. The hero, categories and designers are laid out differently in the app; the rest is the same page. '
          : 'The page in order. Click a band to edit it; use the arrows on the left of a band to move it. Photography is drawn where the band carries it. '}
        <span
          className="hok-hp-nav-footnote-door"
          onClick={onNavigateToSiteSettings}
        >
          Site Settings
        </span>
      </div>
    </div>
  );
};
