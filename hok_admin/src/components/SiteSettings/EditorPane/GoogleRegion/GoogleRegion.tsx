import React from 'react';
import './GoogleRegion.css';
import { GoogleSettings, BrandAssetSlot, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { TrackingCodeBlock } from './TrackingCodeBlock';
import { DeveloperSetupGroup } from './DeveloperSetupGroup';

interface GoogleRegionProps {
  settings: GoogleSettings;
  linkPreviewSlot?: BrandAssetSlot;
  onChange: (updated: GoogleSettings) => void;
  issues: HealthIssue[];
  onNavigateToBrand?: () => void;
  onNavigateToLegal?: () => void;
}

export const GoogleRegion: React.FC<GoogleRegionProps> = ({
  settings,
  linkPreviewSlot,
  onChange,
  issues,
  onNavigateToBrand,
  onNavigateToLegal
}) => {
  const headlineLen = settings.headline.length;
  const isHeadlineOver = headlineLen > 60;

  const descLen = settings.description.length;
  const isDescOver = descLen > 155;

  const isLinkPreviewSet = !!linkPreviewSlot?.file;

  return (
    <div className="hok-google-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Google & sharing</h2>
        <span className="hok-editor-attribution">Soumya · 12 days ago</span>
      </div>
      <p className="hok-editor-description">
        What a search result looks like, whether Google is allowed to list you at all, and the tracking codes. Nothing here changes the storefront’s own search box — that lives under Header.
      </p>

      {/* 8.2 Issues for Google */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
        />
      ))}

      {/* Card 1 — What People See in Google */}
      <Card
        isFirst
        title="What people see in Google"
        subtitle="The two lines under your name in a search result. The preview on the right shows exactly how it reads."
        id="google-what-people-see-card"
      >
        {/* Headline */}
        <div id="google-headline">
          <Field
            label="Headline"
            hints={
              isHeadlineOver
                ? `${headlineLen} / 60 Too long — Google shows about 60 characters, so the end will be cut.`
                : `${headlineLen} / 60`
            }
            warningHint={
              isHeadlineOver
                ? `${headlineLen} / 60 Too long — Google shows about 60 characters, so the end will be cut.`
                : undefined
            }
          >
            <input
              type="text"
              className="hok-field-input"
              value={settings.headline}
              onChange={(e) => onChange({ ...settings, headline: e.target.value })}
            />
          </Field>
        </div>

        {/* Description */}
        <div id="google-description">
          <Field
            label="Description"
            hints={[
              'Used on any page that has not written its own.',
              `${descLen} / 155 Google shows about 155 characters.`
            ]}
          >
            <textarea
              className="hok-field-textarea"
              value={settings.description}
              onChange={(e) => onChange({ ...settings, description: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      {/* Card 2 — The Picture When a Link is Shared */}
      <Card
        title="The picture when a link is shared"
        id="google-link-preview-report"
      >
        <div className="hok-share-picture-row">
          <div className="hok-share-picture-left">
            {isLinkPreviewSet ? (
              <img
                src={linkPreviewSlot?.dataUrl || '/og-image.jpg'}
                alt="link preview"
                className="hok-share-picture-thumb"
              />
            ) : (
              <div className="hok-share-picture-empty">1200 × 630</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--charcoal)' }}>
                {isLinkPreviewSet ? linkPreviewSlot?.file : 'No image set'}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                Brand holds every image file the site uses.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="hok-asset-btn"
            onClick={onNavigateToBrand}
            data-hint="Brand holds every image file the site uses"
          >
            Set it in Brand
          </button>
        </div>
      </Card>

      {/* Card 3 — Letting Google List the Site */}
      <Card title="Letting Google list the site" id="google-indexing-toggle">
        <PillToggle
          checked={settings.allowSearchEngines}
          onChange={(checked) => onChange({ ...settings, allowSearchEngines: checked })}
          label="Allow Google and other search engines to list the site"
          hint={
            settings.allowSearchEngines
              ? 'On, which is what you want once the site is live.'
              : 'On, which is what you want once the site is live. Switching it off removes House of Kaira from Google within a few days.'
          }
        />
      </Card>

      {/* Card 4 — Tracking Codes */}
      <Card
        title="Tracking codes"
        subtitle="Each is a short code you paste in once, from a free account you set up elsewhere. Leave any of them blank and nothing breaks — you simply get no data from that source."
        id="google-tracking-codes-card"
      >
        <TrackingCodeBlock
          id="google-analytics"
          title="Google Analytics"
          value={settings.tracking.googleAnalytics}
          placeholder="G-XXXXXXXXXX"
          description="Tells you how many people visited, which pieces they looked at, and where they came from — Instagram, Google, a WhatsApp link."
          whereToFindIt="analytics.google.com → create a property for houseofkiara.com → copy the Measurement ID."
          onChange={(val) =>
            onChange({
              ...settings,
              tracking: { ...settings.tracking, googleAnalytics: val }
            })
          }
        />

        <TrackingCodeBlock
          id="google-meta-pixel"
          title="Meta Pixel"
          value={settings.tracking.metaPixel}
          placeholder="000000000000000"
          description="Lets you see which Instagram and Facebook posts led to a rental, and is required before you can run paid ads."
          whereToFindIt="business.facebook.com → Events Manager → create a pixel → copy the Pixel ID."
          onChange={(val) =>
            onChange({
              ...settings,
              tracking: { ...settings.tracking, metaPixel: val }
            })
          }
        />

        <TrackingCodeBlock
          id="google-search-console"
          title="Google Search Console"
          value={settings.tracking.googleSearchConsole}
          placeholder="a long string of letters"
          description="Proves to Google that the site is yours, and then shows you what people typed to find it."
          whereToFindIt="search.google.com/search-console → add the property → choose the HTML tag method → copy the content value."
          onChange={(val) =>
            onChange({
              ...settings,
              tracking: { ...settings.tracking, googleSearchConsole: val }
            })
          }
        />

        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '11px' }}>
          Anything set here places cookies on a visitor’s device, which is what makes the consent banner under{' '}
          <button
            type="button"
            className="hok-btn-text-action"
            onClick={onNavigateToLegal}
          >
            Legal
          </button>{' '}
          a legal requirement rather than a nicety.
        </div>
      </Card>

      {/* Card 5 — Developer Collapsible Group */}
      <DeveloperSetupGroup
        devSettings={settings.devSettings}
        onChange={(updatedDev) =>
          onChange({ ...settings, devSettings: updatedDev })
        }
      />
    </div>
  );
};
