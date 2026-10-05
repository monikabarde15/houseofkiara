import React from 'react';
import './LegalRegion.css';
import { LegalSettings, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';

interface LegalRegionProps {
  settings: LegalSettings;
  googleAnalyticsCode?: string;
  metaPixelCode?: string;
  onChange: (updated: LegalSettings) => void;
  issues: HealthIssue[];
  onNavigateToGoogle?: () => void;
  onNavigateToDPDPTrail?: () => void;
}

export const LegalRegion: React.FC<LegalRegionProps> = ({
  settings,
  googleAnalyticsCode,
  metaPixelCode,
  onChange,
  issues,
  onNavigateToGoogle,
  onNavigateToDPDPTrail
}) => {
  const hasGA = !!googleAnalyticsCode?.trim();
  const hasPixel = !!metaPixelCode?.trim();
  const onlyEssential = !hasGA && !hasPixel;

  const handleUpdateEntity = (field: keyof typeof settings.registeredEntity, val: string) => {
    onChange({
      ...settings,
      registeredEntity: {
        ...settings.registeredEntity,
        [field]: val
      }
    });
  };

  const handleUpdateCookie = (field: keyof typeof settings.cookieConsent, val: any) => {
    onChange({
      ...settings,
      cookieConsent: {
        ...settings.cookieConsent,
        [field]: val
      }
    });
  };

  const handleUpdateCategory = (cat: 'essential' | 'analytics' | 'marketing', val: string) => {
    onChange({
      ...settings,
      cookieConsent: {
        ...settings.cookieConsent,
        categories: {
          ...settings.cookieConsent.categories,
          [cat]: val
        }
      }
    });
  };

  return (
    <div className="hok-legal-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Legal & consent</h2>
        <span className="hok-editor-attribution">Soumya · 12 days ago</span>
      </div>
      <p className="hok-editor-description">
        The registered entity, and the cookie banner the storefront does not have yet.
      </p>

      {/* 8.2 Issues for Legal */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
        />
      ))}

      {/* Card 1 — Registered Entity */}
      <Card
        isFirst
        title="Registered entity"
        subtitle="Printed on invoices and the legal pages, not in the storefront chrome."
        id="legal-registered-entity-card"
      >
        <div className="hok-two-column-group">
          <div id="legal-registered-name">
            <Field label="Registered name">
              <input
                type="text"
                className="hok-field-input"
                value={settings.registeredEntity.registeredName}
                onChange={(e) => handleUpdateEntity('registeredName', e.target.value)}
              />
            </Field>
          </div>

          <div id="legal-gstin">
            <Field label="GSTIN">
              <input
                type="text"
                className="hok-field-input"
                value={settings.registeredEntity.gstin}
                onChange={(e) => handleUpdateEntity('gstin', e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="hok-two-column-group">
          <div id="legal-cin">
            <Field label="CIN">
              <input
                type="text"
                className="hok-field-input"
                value={settings.registeredEntity.cin}
                onChange={(e) => handleUpdateEntity('cin', e.target.value)}
              />
            </Field>
          </div>

          <div id="legal-registered-address">
            <Field label="Registered address">
              <input
                type="text"
                className="hok-field-input"
                value={settings.registeredEntity.registeredAddress}
                onChange={(e) => handleUpdateEntity('registeredAddress', e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Card 2 — Cookie Consent */}
      <Card
        title="Cookie consent"
        subtitle="The footer links to a Cookie Policy on every page, but no banner exists on the storefront yet."
        id="legal-cookie-banner"
      >
        <PillToggle
          checked={settings.cookieConsent.showBanner}
          onChange={(checked) => handleUpdateCookie('showBanner', checked)}
          label="Show the consent banner"
        />

        <div className="hok-two-column-group" style={{ marginTop: '11px' }}>
          <Field label="Heading">
            <input
              type="text"
              className="hok-field-input"
              value={settings.cookieConsent.heading}
              onChange={(e) => handleUpdateCookie('heading', e.target.value)}
            />
          </Field>

          <div id="legal-cookie-position">
            <Field label="Position">
              <select
                className="hok-field-select"
                value={settings.cookieConsent.position}
                onChange={(e) =>
                  handleUpdateCookie(
                    'position',
                    e.target.value as 'Bottom bar' | 'Bottom-left card' | 'Centre modal'
                  )
                }
              >
                <option value="Bottom bar">Bottom bar</option>
                <option value="Bottom-left card">Bottom-left card</option>
                <option value="Centre modal">Centre modal</option>
              </select>
            </Field>
          </div>
        </div>

        <Field label="Body">
          <textarea
            className="hok-field-textarea"
            value={settings.cookieConsent.body}
            onChange={(e) => handleUpdateCookie('body', e.target.value)}
          />
        </Field>

        <div className="hok-three-column-group">
          <Field label="Accept">
            <input
              type="text"
              className="hok-field-input"
              value={settings.cookieConsent.acceptLabel}
              onChange={(e) => handleUpdateCookie('acceptLabel', e.target.value)}
            />
          </Field>

          <Field label="Reject">
            <input
              type="text"
              className="hok-field-input"
              value={settings.cookieConsent.rejectLabel}
              onChange={(e) => handleUpdateCookie('rejectLabel', e.target.value)}
            />
          </Field>

          <Field label="Manage">
            <input
              type="text"
              className="hok-field-input"
              value={settings.cookieConsent.manageLabel}
              onChange={(e) => handleUpdateCookie('manageLabel', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Policy link">
          <input
            type="text"
            className="hok-field-input"
            value={settings.cookieConsent.policyLink}
            onChange={(e) => handleUpdateCookie('policyLink', e.target.value)}
          />
        </Field>

        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
          Decisions are recorded against the customer record.{' '}
          <button
            type="button"
            className="hok-btn-text-action"
            onClick={onNavigateToDPDPTrail}
            data-hint="See the DPDP trail"
          >
            See the DPDP trail
          </button>
        </div>
      </Card>

      {/* Card 3 — Behind the "Manage" button */}
      <Card
        title="Behind the “Manage” button"
        subtitle="The choices a customer gets. Which rows appear is worked out from the tracking codes on Google — there is no point offering a choice about something the site does not run."
        id="legal-cookie-categories"
      >
        {/* Essential Category */}
        <div className="hok-consent-category-block">
          <div className="hok-consent-cat-header">
            <span className="hok-consent-cat-title">Essential</span>
            <span className="hok-consent-cat-status">
              Always on — the site cannot work without these
            </span>
          </div>
          <textarea
            className="hok-field-textarea"
            value={settings.cookieConsent.categories.essential}
            onChange={(e) => handleUpdateCategory('essential', e.target.value)}
          />
        </div>

        {/* Analytics Category */}
        <div className={`hok-consent-category-block ${!hasGA ? 'is-dimmed' : ''}`}>
          <div className="hok-consent-cat-header">
            <span className="hok-consent-cat-title">Analytics</span>
            <span className="hok-consent-cat-status">
              {hasGA
                ? 'shown, because Google Analytics is set'
                : 'Hidden, because no Google Analytics code is set'}
            </span>
          </div>
          <textarea
            className="hok-field-textarea"
            value={settings.cookieConsent.categories.analytics}
            onChange={(e) => handleUpdateCategory('analytics', e.target.value)}
          />
        </div>

        {/* Marketing Category */}
        <div className={`hok-consent-category-block ${!hasPixel ? 'is-dimmed' : ''}`}>
          <div className="hok-consent-cat-header">
            <span className="hok-consent-cat-title">Marketing</span>
            <span className="hok-consent-cat-status">
              {hasPixel
                ? 'shown, because the Meta Pixel is set'
                : 'Hidden, because no Meta Pixel code is set'}
            </span>
          </div>
          <textarea
            className="hok-field-textarea"
            value={settings.cookieConsent.categories.marketing}
            onChange={(e) => handleUpdateCategory('marketing', e.target.value)}
          />
        </div>

        {onlyEssential && (
          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '9px' }}>
            Only Essential runs today, so “Manage” would open a panel with one row and nothing to decide. Set a tracking code and the other rows appear on their own.{' '}
            <button
              type="button"
              className="hok-btn-text-action"
              onClick={onNavigateToGoogle}
            >
              Google
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
