/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · INSTAGRAM BAND (Spec 8.9)
========================================================= */

import React, { useState } from 'react';
import './InstagramBand.css';
import {
  InstagramSettings,
  InstagramTile,
  HealthIssue
} from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { MediaSlot } from '../../shared/MediaSlot/MediaSlot';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';
import { DoorArrowIcon } from '../../shared/icons/HomepageIcons';

interface InstagramBandProps {
  settings: InstagramSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: InstagramSettings) => void;
  issues: HealthIssue[];
  onNavigateSiteSettings?: () => void;
}

const INSTAGRAM_HANDLE = '@houseofkiara';

export const InstagramBand: React.FC<InstagramBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateSiteSettings
}) => {
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  // Deck items representation
  const deckItems: DeckTileItem[] = settings.tiles.map((t, idx) => ({
    id: t.id || `insta-tile-${idx + 1}`,
    position: idx + 1,
    title: t.alt || `Tile ${idx + 1}`,
    sub: t.url ? (t.url.length > 28 ? t.url.slice(0, 28) + '…' : t.url) : 'No link set',
    imageUrl: t.img,
    noPicture: !t.img,
    pictureHeight: 110
  }));

  const selectedTile =
    selectedTileIndex !== null && selectedTileIndex < settings.tiles.length
      ? settings.tiles[selectedTileIndex]
      : null;

  // Handlers
  const handleUpdateTile = (index: number, patch: Partial<InstagramTile>) => {
    const updated = [...settings.tiles];
    updated[index] = { ...updated[index], ...patch };
    onChange({ ...settings, tiles: updated });
  };

  const handleMoveTile = (index: number, direction: 'earlier' | 'later') => {
    const target = direction === 'earlier' ? index - 1 : index + 1;
    if (target < 0 || target >= settings.tiles.length) return;
    const updated = [...settings.tiles];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, tiles: updated });
    setSelectedTileIndex(target);
  };

  return (
    <div className="hok-band-editor hok-instagram-band">
      {/* Band Header Card */}
      <Card
        variant="elevated"
        header={{
          eyebrow: 'BAND 9 · INSTAGRAM',
          title: 'Instagram & Social Feed',
          meta: isShown ? 'VISIBLE ON STOREFRONT' : 'HIDDEN',
          status: isShown ? 'live' : 'draft',
          actions: (
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={isShown}
              onChange={onToggleShown}
            />
          )
        }}
      >
        <p className="hok-band-intro">
          Six curated Instagram square posts or live feed tiles with account follow CTA strip. Instagram handle is owned exclusively by Site Settings.
        </p>

        {issues.length > 0 && (
          <div className="hok-band-issues">
            {issues.map((iss, i) => (
              <IssueStrip
                key={i}
                severity={iss.severity}
                message={iss.message}
                actionLabel={iss.actionLabel}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Card 1: Handle & Site Settings Door (Spec 8.9.1) */}
      <Card
        header={{
          eyebrow: 'ACCOUNT HANDLE (ONE TRUTH)',
          title: 'Instagram Handle & Follow Link',
          meta: 'Owned by Site Settings — never retyped here'
        }}
      >
        <div id="insta-handle" className="hok-insta-handle-door-box">
          <div className="hok-insta-handle-left">
            <span className="hok-insta-door-tag">CONNECTED INSTAGRAM ACCOUNT</span>
            <span className="hok-insta-door-handle">{INSTAGRAM_HANDLE}</span>
            <span className="hok-insta-door-sub">
              Changes to this handle apply globally across the header, footer, and emails.
            </span>
          </div>
          {onNavigateSiteSettings && (
            <button
              type="button"
              className="hok-insta-door-btn"
              onClick={onNavigateSiteSettings}
            >
              Open Socials in Site Settings <DoorArrowIcon size={10} />
            </button>
          )}
        </div>

        <div className="hok-divider" />

        <div id="insta-follow" className="hok-insta-strip-grid">
          <Field
            label="Desktop Follow Strip Prefix"
            hint="Text before the handle on desktop"
          >
            <input
              type="text"
              className="hok-input"
              value={settings.strip}
              onChange={(e) => onChange({ ...settings, strip: e.target.value })}
              placeholder="Follow our story at"
            />
          </Field>

          <Field
            label="Mobile Follow Strip Prefix"
            hint="Text before the handle on compact mobile screens"
          >
            <input
              type="text"
              className="hok-input"
              value={settings.stripMob}
              onChange={(e) => onChange({ ...settings, stripMob: e.target.value })}
              placeholder="Follow us at"
            />
          </Field>
        </div>
      </Card>

      {/* Card 2: Source & Headings */}
      <Card
        header={{
          eyebrow: 'BAND HEADINGS & FEED SOURCE',
          title: 'Headings and Content Source',
          meta: `${settings.source} active`
        }}
      >
        <div className="hok-insta-words-grid">
          <Field
            label="Eyebrow"
            hint="Small caps kicker text"
          >
            <input
              id="insta-eyebrow"
              type="text"
              className="hok-input"
              value={settings.eyebrow}
              onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
              placeholder="Our Community"
            />
          </Field>

          <Field
            label="Main Heading"
            hint="Wrap *words in asterisks* for gold italic serif font"
          >
            <input
              id="insta-heading"
              type="text"
              className="hok-input"
              value={settings.heading}
              onChange={(e) => onChange({ ...settings, heading: e.target.value })}
              placeholder="As seen on *Instagram*"
            />
          </Field>
        </div>

        <div className="hok-insta-mirror-box">
          <span className="hok-insta-mirror-label">Live Storefront Heading Preview</span>
          <ReadsAsMirror
            eyebrow={settings.eyebrow}
            heading={settings.heading}
            className="hok-insta-reads-as"
          />
        </div>

        <div className="hok-divider" />

        <div className="hok-insta-source-row">
          <Field
            label="Feed Source"
            hint="Choose whether tiles are manually curated or fetched via Instagram Graph API"
          >
            <PillToggle
              options={[
                { label: 'Manual tiles (Recommended)', value: 'Manual tiles' },
                { label: 'Live Instagram feed', value: 'Live Instagram feed' }
              ]}
              value={settings.source}
              onChange={(val) =>
                onChange({
                  ...settings,
                  source: val as 'Manual tiles' | 'Live Instagram feed'
                })
              }
            />
          </Field>
        </div>

        {settings.source === 'Live Instagram feed' && (
          <div className="hok-insta-feed-warning">
            <IssueStrip
              severity="info"
              message="Live API Feed requires a valid Meta Long-Lived User Access Token in Site Settings > Integrations. With Manual tiles, images are hosted in your media library and will never break if an access token expires."
              actionLabel="Configure API Token"
              onAction={onNavigateSiteSettings}
            />
          </div>
        )}
      </Card>

      {/* Card 3: 6 Instagram Tiles Deck & Inspector */}
      <Card
        header={{
          eyebrow: 'TILES GRID',
          title: '6 Instagram Grid Tiles',
          meta: `${settings.tiles.length} tiles · 6-across deck`
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Click any tile below to upload photos, set alt text for accessibility, or link directly to the Instagram post.
        </p>

        <div className="hok-insta-deck-wrapper">
          <Deck
            arrangement="d6"
            items={deckItems}
            selectedIndex={selectedTileIndex}
            onSelectIndex={(idx) => setSelectedTileIndex(idx)}
            onMoveEarlier={(idx) => handleMoveTile(idx, 'earlier')}
            onMoveLater={(idx) => handleMoveTile(idx, 'later')}
          />

          {selectedTile && selectedTileIndex !== null && (
            <Inspector
              title={`Edit Instagram Tile ${selectedTileIndex + 1}`}
              position={selectedTileIndex + 1}
              totalItems={settings.tiles.length}
              onClose={() => setSelectedTileIndex(null)}
              onMoveUp={selectedTileIndex > 0 ? () => handleMoveTile(selectedTileIndex, 'earlier') : undefined}
              onMoveDown={
                selectedTileIndex < settings.tiles.length - 1
                  ? () => handleMoveTile(selectedTileIndex, 'later')
                  : undefined
              }
            >
              <div className="hok-insta-inspector-content">
                <Field
                  label="Instagram Photo"
                  hint="Image Spec: 300 × 300 px (1:1 square crop)"
                >
                  <MediaSlot
                    imageUrl={selectedTile.img}
                    specDims="300 × 300 px (1:1)"
                    label={`Instagram post photo ${selectedTileIndex + 1}`}
                    onUpload={(url) => handleUpdateTile(selectedTileIndex, { img: url })}
                    onRemove={() => handleUpdateTile(selectedTileIndex, { img: '' })}
                  />
                </Field>

                <Field
                  label="Image Alt Text"
                  hint="Accessibility description of the outfit / post"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTile.alt}
                    onChange={(e) =>
                      handleUpdateTile(selectedTileIndex, { alt: e.target.value })
                    }
                    placeholder="e.g. Sabyasachi bridal lehenga on House of Kaira"
                  />
                </Field>

                <Field
                  label="Post Permalink / Destination URL"
                  hint="Clicking this tile opens the post or catalog page"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTile.url}
                    onChange={(e) =>
                      handleUpdateTile(selectedTileIndex, { url: e.target.value })
                    }
                    placeholder="https://instagram.com/p/Cxyz123 or /rent"
                  />
                </Field>
              </div>
            </Inspector>
          )}
        </div>
      </Card>
    </div>
  );
};
