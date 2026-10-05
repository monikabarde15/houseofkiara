import React from 'react';
import './HeaderRegion.css';
import { HeaderSettings, NavItem, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { AddControl } from '../../shared/AddControl/AddControl';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { NavItemRow } from './NavItemRow';

interface HeaderRegionProps {
  settings: HeaderSettings;
  onChange: (updated: HeaderSettings) => void;
  issues: HealthIssue[];
  onNavigateModule?: (moduleName: string) => void;
}

export const HeaderRegion: React.FC<HeaderRegionProps> = ({
  settings,
  onChange,
  issues,
  onNavigateModule
}) => {
  const handleUpdateNavItem = (index: number, updatedItem: NavItem) => {
    const updated = [...settings.navItems];
    updated[index] = updatedItem;
    onChange({ ...settings, navItems: updated });
  };

  const handleDeleteNavItem = (index: number) => {
    const updated = settings.navItems.filter((_, i) => i !== index);
    onChange({ ...settings, navItems: updated });
  };

  const handleMoveNavItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= settings.navItems.length) return;
    const updated = [...settings.navItems];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    onChange({ ...settings, navItems: updated });
  };

  const handleToggleExpand = (index: number) => {
    const updated = settings.navItems.map((item, i) => {
      if (i === index) {
        return { ...item, isExpanded: !item.isExpanded };
      }
      // One item is expanded at a time (Spec 10.2 Menu editing)
      return { ...item, isExpanded: false };
    });
    onChange({ ...settings, navItems: updated });
  };

  const handleAddNavItem = () => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      shown: true,
      label: 'New Link',
      link: '/new-link',
      badge: '',
      style: 'Plain',
      hasMenu: false,
      menuEnabled: false,
      menuColumns: [],
      isExpanded: false
    };
    onChange({ ...settings, navItems: [...settings.navItems, newItem] });
  };

  return (
    <div className="hok-header-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Header</h2>
        <span className="hok-editor-attribution">Soumya · 1 day ago</span>
      </div>
      <p className="hok-editor-description">
        The modern navigation for the whole storefront. Changes appear immediately on desktop and mobile.
      </p>

      {/* 8.2 Health issues for Header */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
          onAction={
            issue.actionModule && onNavigateModule
              ? () => onNavigateModule(issue.actionModule!)
              : undefined
          }
        />
      ))}

      {/* Card 1 — Navigation (Spec 10.2, 16.2 & 18.2) */}
      <Card
        isFirst
        title="Navigation"
        subtitle="Untick anything you are out of stock on and it leaves the storefront menu — the row stays here so you can put it back."
        id="header-nav-items"
      >
        <div className="hok-nav-table">
          {/* Table Header */}
          <div className="hok-nav-table-head">
            <div className="hok-nav-col-shown">SHOWN</div>
            <div className="hok-nav-col-order">ORDER</div>
            <div className="hok-nav-col-label">LABEL</div>
            <div className="hok-nav-col-link">LINK</div>
            <div className="hok-nav-col-badge">BADGE</div>
            <div className="hok-nav-col-menu">MENU</div>
            <div className="hok-nav-col-style">STYLE</div>
            <div className="hok-nav-col-remove"></div>
          </div>

          {/* Table Rows */}
          {settings.navItems.map((item, idx) => (
            <NavItemRow
              key={item.id}
              navItem={item}
              index={idx}
              totalCount={settings.navItems.length}
              onChange={(updated) => handleUpdateNavItem(idx, updated)}
              onDelete={() => handleDeleteNavItem(idx)}
              onMoveUp={() => handleMoveNavItem(idx, idx - 1)}
              onMoveDown={() => handleMoveNavItem(idx, idx + 1)}
              onToggleExpand={() => handleToggleExpand(idx)}
            />
          ))}
        </div>

        <AddControl
          label="+ Add item"
          onClick={handleAddNavItem}
        />
      </Card>

      {/* Card 2 — Behaviour (Spec 10.2 & 16.2) */}
      <Card title="Behaviour" id="header-behaviour-card">
        {/* Search Placeholder */}
        <div id="header-search-placeholder">
          <Field
            label="Search placeholder"
            hints="Uses the same wording as the desktop search box: “Search lehengas, designers, occasions…”."
          >
            <input
              type="text"
              className="hok-field-input"
              value={settings.searchPlaceholder}
              onChange={(e) =>
                onChange({ ...settings, searchPlaceholder: e.target.value })
              }
            />
          </Field>
        </div>

        {/* Bag / Cart Label */}
        <div id="header-bag-cart-label">
          <Field
            label="Bag / Cart label"
            hints="One word, used on desktop and on the mobile bar."
          >
            <select
              className="hok-field-select"
              value={settings.bagCartLabel}
              data-hint="This one follows the Bag / Cart setting in Header, so the two words can never disagree. Change it there."
              onChange={(e) =>
                onChange({
                  ...settings,
                  bagCartLabel: e.target.value as 'Cart' | 'Bag'
                })
              }
            >
              <option value="Cart">Cart</option>
              <option value="Bag">Bag</option>
            </select>
          </Field>
        </div>

        {/* Sticky Header Toggle */}
        <div id="header-sticky-toggle">
          <PillToggle
            checked={settings.stickyHeader}
            onChange={(checked) => onChange({ ...settings, stickyHeader: checked })}
            label="Header stays fixed while scrolling"
          />
        </div>

        {/* Tagline Toggle */}
        <div id="header-show-tagline">
          <PillToggle
            checked={settings.showTagline}
            onChange={(checked) => onChange({ ...settings, showTagline: checked })}
            label="Show the tagline under the wordmark"
          />
        </div>
      </Card>

      {/* Card 3 — Reduced Header (Spec 10.2 & 16.2) */}
      <Card
        title="Reduced header"
        subtitle="Checkout drops the menu so nothing pulls a shopper out mid-payment."
        id="header-reduced-card"
      >
        <div className="hok-two-column-group">
          <div id="header-reduced-back">
            <Field label="Back link">
              <input
                type="text"
                className="hok-field-input"
                value={settings.reducedHeader.backLink}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    reducedHeader: {
                      ...settings.reducedHeader,
                      backLink: e.target.value
                    }
                  })
                }
              />
            </Field>
          </div>

          <div id="header-reduced-security">
            <Field label="Security line">
              <input
                type="text"
                className="hok-field-input"
                value={settings.reducedHeader.securityLine}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    reducedHeader: {
                      ...settings.reducedHeader,
                      securityLine: e.target.value
                    }
                  })
                }
              />
            </Field>
          </div>
        </div>

        <div id="header-reduced-pages">
          <Field label="Pages using it" hints="Comma separated.">
            <input
              type="text"
              className="hok-field-input"
              value={settings.reducedHeader.pagesUsingIt}
              onChange={(e) =>
                onChange({
                  ...settings,
                  reducedHeader: {
                    ...settings.reducedHeader,
                    pagesUsingIt: e.target.value
                  }
                })
              }
            />
          </Field>
        </div>
      </Card>
    </div>
  );
};
