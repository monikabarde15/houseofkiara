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
  const { bands, vis, hero, hiw, featured, category, commit, designers, testi, insta } = registry;

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
      case 'hero':
        return (
          <div className="hok-hp-sketch-box">
            <span className="hok-hp-sketch-headline">
              Wear it with <span className="hok-hp-sketch-gold">love.</span>
            </span>
            <div className="hok-hp-sketch-pills-row">
              <span className="hok-hp-sketch-pill">Explore Collection</span>
              <span className="hok-hp-sketch-pill">How It Works</span>
            </div>
          </div>
        );
      case 'hiw':
        return (
          <div className="hok-hp-sketch-box">
            <span className="hok-hp-sketch-headline">
              How House of Kaira <span className="hok-hp-sketch-gold">works</span>
            </span>
            <div className="hok-hp-sketch-pills-row">
              <span className="hok-hp-sketch-pill">Browse</span>
              <span className="hok-hp-sketch-pill">Pick</span>
              <span className="hok-hp-sketch-pill">Doorstep</span>
              <span className="hok-hp-sketch-pill">Repeat</span>
            </div>
          </div>
        );
      case 'featured':
        return (
          <div className="hok-hp-sketch-box">
            <span className="hok-hp-sketch-headline">
              Featured <span className="hok-hp-sketch-gold">Pieces</span>
            </span>
            <div className="hok-hp-sketch-tiles-row">
              <div className="hok-hp-sketch-tile" />
              <div className="hok-hp-sketch-tile" />
              <div className="hok-hp-sketch-tile" />
              <div className="hok-hp-sketch-tile" />
            </div>
          </div>
        );
      case 'category':
        return (
          <div className="hok-hp-sketch-box">
            <span className="hok-hp-sketch-headline">
              Shop by <span className="hok-hp-sketch-gold">Category</span>
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 2 }}>
              <div style={{ height: 14, backgroundColor: 'var(--card)', border: '1px solid var(--cb)' }} />
              <div style={{ height: 14, backgroundColor: 'var(--card)', border: '1px solid var(--cb)' }} />
              <div style={{ height: 14, backgroundColor: 'var(--card)', border: '1px solid var(--cb)' }} />
            </div>
          </div>
        );
      case 'commit':
        return (
          <div className="hok-hp-sketch-box">
            <span className="hok-hp-sketch-headline">
              Fashion that gives <span className="hok-hp-sketch-gold">back</span>
            </span>
            <div className="hok-hp-sketch-pills-row">
              <span className="hok-hp-sketch-pill">• Rent</span>
              <span className="hok-hp-sketch-pill">• Preloved</span>
              <span className="hok-hp-sketch-pill">• New</span>
            </div>
          </div>
        );
      case 'designers':
        return (
          <div className="hok-hp-sketch-box">
            <span className="hok-hp-sketch-headline">
              Featured <span className="hok-hp-sketch-gold">Designers</span>
            </span>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5, 6].map((d) => (
                <div key={d} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--border)' }} />
              ))}
            </div>
          </div>
        );
      case 'testi':
        return (
          <div className="hok-hp-sketch-box">
            <span className="hok-hp-sketch-headline">
              What our customers <span className="hok-hp-sketch-gold">say</span>
            </span>
            <div className="hok-hp-sketch-pills-row">
              <span className="hok-hp-sketch-pill">“Priya” ★5</span>
              <span className="hok-hp-sketch-pill">“Aishwarya”</span>
            </div>
          </div>
        );
      case 'insta':
        return (
          <div className="hok-hp-sketch-box">
            <span className="hok-hp-sketch-headline">
              As seen on <span className="hok-hp-sketch-gold">Instagram</span>
            </span>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{ width: 8, height: 8, backgroundColor: 'var(--border)' }} />
              ))}
            </div>
          </div>
        );
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
          ›
        </button>

        {bands.map((band, idx) => {
          const isSelected = activeBand === band.id;
          const sev = highestSeverityByBand[band.id];
          return (
            <button
              key={band.id}
              type="button"
              className={`hok-hp-spine-btn ${isSelected ? 'is-selected' : ''}`}
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
    <div className="hok-hp-nav-container">
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
          ‹
        </button>
      </div>

      {/* Top Chrome Strip */}
      <div
        className="hok-hp-chrome-strip"
        onClick={onNavigateToSiteSettings}
        title="Edit in Site Settings"
      >
        <span>Announcement · Header</span>
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
                  <span className="hok-hp-band-title-text">{band.ttl}</span>
                  {sev && <span className={`hok-hp-issue-dot is-${sev}`} title={`Severity: ${sev}`} />}
                </div>

                {/* Reorder Arrows */}
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
        <span>Footer</span>
        <span className="hok-hp-chrome-tag">Site Settings →</span>
      </div>

      {/* Footnote */}
      <div className="hok-hp-nav-footnote">
        The page in order. Click a band to edit it; use the arrows on the left of a band to move it.
        Photography is drawn where the band carries it.{' '}
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
