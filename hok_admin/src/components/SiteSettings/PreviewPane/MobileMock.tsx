import React, { useState } from 'react';
import './MobileMock.css';
import { SiteSettingsRegistry, RegionId } from '../types/siteSettings.types';

interface MobileMockProps {
  registry: SiteSettingsRegistry;
  activeRegion: RegionId;
  activePage: string;
}

export const MobileMock: React.FC<MobileMockProps> = ({
  registry,
  activeRegion,
  activePage
}) => {
  const { mobile, header, brand } = registry;
  const [showDrawer, setShowDrawer] = useState(false);

  const tabs = mobile?.tabs || [];
  const headerNavs = (header?.navItems || []).filter((i) => i.shown !== false);

  return (
    <div className="hok-mobile-mock-container">
      <div className="hok-mobile-phone-frame">
        {/* Notch */}
        <div className="hok-mobile-notch" />

        {/* Top Header */}
        <div className="hok-mobile-header">
          <div className="hok-mobile-header-left">
            <div
              className="hok-mobile-hamburger"
              onClick={() => setShowDrawer(!showDrawer)}
              title="Toggle drawer preview"
              style={{ cursor: 'pointer' }}
            >
              <div className="hok-mobile-hamburger-line" />
              <div className="hok-mobile-hamburger-line" />
              <div className="hok-mobile-hamburger-line" />
            </div>
            <div className="hok-mobile-logo-mark">
              {brand?.siteName ? brand.siteName.substring(0, 8) : 'KIARA'}
            </div>
          </div>

          <div className="hok-mobile-header-right">
            <span>🔍</span>
            <span className="hok-mobile-cart-badge">
              {(header?.bagCartLabel || 'Cart').charAt(0)}
            </span>
          </div>
        </div>

        {/* Content View: Drawer or Main Body */}
        {showDrawer ? (
          <div className="hok-mobile-drawer-view">
            <div className="hok-mobile-drawer-heading">NAVIGATION DRAWER</div>
            {headerNavs.map((nav) => (
              <div key={nav.id} className="hok-mobile-drawer-item">
                <span>{nav.label}</span>
                {nav.badge && (
                  <span style={{ fontSize: '8px', color: 'var(--hok-accent-gold)' }}>
                    {nav.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="hok-mobile-body">
            <div className="hok-mobile-hero-banner">
              <h4 className="hok-mobile-hero-title">
                {activePage === 'All pages' ? (brand?.siteName || 'House of Kiara') : activePage}
              </h4>
              <p className="hok-mobile-hero-desc">Curated Luxury Wardrobe</p>
            </div>

            <div className="hok-mobile-cards-row">
              <div className="hok-mobile-card">
                <div className="hok-mobile-card-img">Rental Piece</div>
                <div className="hok-mobile-card-content">
                  <div className="hok-mobile-card-title">Anita Dongre Set</div>
                  <div className="hok-mobile-card-price">₹6,500</div>
                </div>
              </div>
              <div className="hok-mobile-card">
                <div className="hok-mobile-card-img">Preloved Piece</div>
                <div className="hok-mobile-card-content">
                  <div className="hok-mobile-card-title">Tarun Tahiliani</div>
                  <div className="hok-mobile-card-price">₹24,000</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Bottom Tab Bar */}
        <div className="hok-mobile-bottom-bar">
          {tabs.map((tab, idx) => (
            <div
              key={tab.id}
              className={`hok-mobile-tab-btn ${idx === 0 ? 'is-active' : ''}`}
            >
              <div className="hok-mobile-tab-dot" />
              <span>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
