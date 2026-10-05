import React from 'react';
import './DesktopMock.css';
import { SiteSettingsRegistry, RegionId } from '../types/siteSettings.types';
import { LIVE_POINTERS } from '../shared/PointerPicker/PointerPicker';

interface DesktopMockProps {
  registry: SiteSettingsRegistry;
  activeRegion: RegionId;
  activePage: string;
}

export const DesktopMock: React.FC<DesktopMockProps> = ({
  registry,
  activeRegion,
  activePage
}) => {
  const { announcement, header, footer, brand } = registry;

  // Evaluate pointers in string safely
  const evaluatePointers = (text?: string): string => {
    if (!text) return '';
    let res = text;
    LIVE_POINTERS.forEach((p) => {
      if (res.includes(p.code)) {
        res = res.split(p.code).join(p.printsToday);
      }
    });
    return res;
  };

  // Active announcement messages
  const activeMessages = (announcement?.messages || []).filter((m) => m.enabled);

  // Visible Nav Items
  const visibleNav = (header?.navItems || []).filter((i) => i.shown !== false);
  const sitLastNav = visibleNav.filter((i) => i.style === 'Highlight');
  const mainNav = visibleNav.filter((i) => i.style !== 'Highlight');

  // Active mega menu column preview
  const expandedNav = (header?.navItems || []).find((i) => i.isExpanded) || header?.navItems?.[0];

  const paymentKeyLabels: { [key: string]: string } = {
    upi: 'UPI',
    visa: 'Visa',
    mastercard: 'Mastercard',
    rupay: 'RuPay',
    netbanking: 'Netbanking',
    paytm: 'Paytm',
    amex: 'Amex',
    nocost_emi: 'No Cost EMI'
  };

  return (
    <div className="hok-desktop-mock">
      {/* 1. Announcement Bar */}
      {announcement?.showAcrossSite ? (
        <div
          className="hok-mock-announcement-bar"
          style={{
            backgroundColor: announcement.backgroundColor || '#0F172A',
            color: announcement.textColor || '#FFFFFF'
          }}
        >
          {announcement.howItMoves === 'Scrolling loop' && (
            <>
              <div className="hok-mock-announcement-fade-left" />
              <div className="hok-mock-announcement-fade-right" />
            </>
          )}

          <div
            className={`hok-mock-announcement-content ${
              announcement.howItMoves === 'Scrolling loop' ? 'is-looping' : ''
            }`}
          >
            {activeMessages.length > 0 ? (
              activeMessages.map((msg, idx) => (
                <span key={msg.id} className="hok-mock-ann-item">
                  <span className={msg.italicSerif ? 'hok-mock-ann-serif' : ''}>
                    {evaluatePointers(msg.text)}
                  </span>
                  {idx < activeMessages.length - 1 && (
                    <span className="hok-mock-ann-sep">
                      {announcement.separator === 'Slash' ? '/' : announcement.separator === 'None' ? ' ' : '•'}
                    </span>
                  )}
                </span>
              ))
            ) : (
              <span>Complimentary dry cleaning & express shipping</span>
            )}
          </div>
        </div>
      ) : (
        <div className="hok-mock-announcement-bar is-disabled">
          Announcement bar is disabled
        </div>
      )}

      {/* 2. Header */}
      <div className="hok-mock-header">
        <div className="hok-mock-header-top">
          <div className="hok-mock-logo-text">
            {brand?.siteName || 'HOUSE OF KIARA'}
          </div>

          <div className="hok-mock-header-utilities">
            <span>Search</span>
            <span>Wishlist</span>
            <span className="hok-mock-header-bag">
              {header?.bagCartLabel || 'Cart'} (0)
            </span>
          </div>
        </div>

        {/* Navigation row */}
        <div className="hok-mock-nav-row">
          {mainNav.slice(0, 5).map((item) => {
            const itemLabel = item.label || '';
            const isActive = activePage && itemLabel && activePage.toLowerCase() === itemLabel.toLowerCase();
            return (
              <div
                key={item.id}
                className={`hok-mock-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <span>{itemLabel}</span>
                {item.badge && (
                  <span
                    className={`hok-mock-nav-badge ${
                      item.badge.toLowerCase() === 'sale' ? 'is-sale' : 'is-new'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}

          {sitLastNav.map((item) => (
            <div key={item.id} className="hok-mock-nav-item is-sit-last">
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Mega Menu Overlay */}
        {activeRegion === 'header' && expandedNav && expandedNav.menuColumns && expandedNav.menuColumns.length > 0 && (
          <div className="hok-mock-mega-menu">
            {expandedNav.menuColumns.slice(0, 3).map((col) => (
              <div key={col.id} className="hok-mock-mega-col">
                <div className="hok-mock-mega-col-title">{col.heading}</div>
                {(col.links || []).slice(0, 3).map((lnk) => (
                  <div key={lnk.id} className="hok-mock-mega-col-link">
                    {lnk.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Body Content Placeholder */}
      <div className="hok-mock-body">
        <div className="hok-mock-body-hero">
          <h3 className="hok-mock-hero-title">
            {activePage === 'All pages' ? 'Luxury Fashion on Rent' : activePage}
          </h3>
          <p className="hok-mock-hero-sub">
            Authentic designer couture delivered to your door
          </p>
        </div>

        <div className="hok-mock-cards-grid">
          <div className="hok-mock-product-card">
            <div className="hok-mock-card-img-placeholder">Sabyasachi Lehenga</div>
            <div className="hok-mock-card-details">
              <div className="hok-mock-card-title">Crimson Bridal Silk</div>
              <div className="hok-mock-card-price">₹12,500 / 4 days</div>
            </div>
          </div>
          <div className="hok-mock-product-card">
            <div className="hok-mock-card-img-placeholder">Manish Malhotra</div>
            <div className="hok-mock-card-details">
              <div className="hok-mock-card-title">Sequin Gala Gown</div>
              <div className="hok-mock-card-price">₹8,000 / 4 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer */}
      <div className="hok-mock-footer">
        <div className="hok-mock-footer-columns">
          {(footer?.linkColumns || []).slice(0, 2).map((col) => (
            <div key={col.id} className="hok-mock-footer-col">
              <div className="hok-mock-footer-col-title">{col.heading}</div>
              {(col.links || []).slice(0, 3).map((lnk) => (
                <span key={lnk.id} className="hok-mock-footer-link">
                  {lnk.label}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Payment badges */}
        <div className="hok-mock-footer-badges">
          {Object.entries(footer?.paymentMethods || {})
            .filter(([_, isEnabled]) => isEnabled)
            .slice(0, 5)
            .map(([key]) => (
              <span key={key} className="hok-mock-payment-chip">
                {paymentKeyLabels[key] || key.toUpperCase()}
              </span>
            ))}
        </div>

        {/* Copyright */}
        <div className="hok-mock-footer-copyright">
          {evaluatePointers(footer?.copyrightLine || '© 2026 House of Kiara')}
        </div>
      </div>
    </div>
  );
};
