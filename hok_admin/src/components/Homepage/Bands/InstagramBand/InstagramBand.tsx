/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · INSTAGRAM (Spec 8.9)
   Spec Section 8.9 & 12.6 (v213)
========================================================= */

import React, { useState } from 'react';
import './InstagramBand.css';
import { InstagramSettings, HealthIssue } from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { MediaSlot } from '../../shared/MediaSlot/MediaSlot';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';

interface InstagramBandProps {
  settings: InstagramSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: InstagramSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
  onNavigateSiteSettings?: () => void;
}

const INSTAGRAM_HANDLE = '@house_of_kaira';

export const InstagramBand: React.FC<InstagramBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule,
  onNavigateSiteSettings
}) => {
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  const tiles = settings.tiles || [];

  const deckItems: DeckTileItem[] = tiles.map((t, idx) => ({
    id: `insta-tile-${idx + 1}`,
    position: idx + 1,
    title: `Tile ${idx + 1}`,
    sub: t.url ? 'links to post' : 'links to the profile',
    pictureUrl: t.img || undefined,
    pictureHeight: 84,
    cornerFlag: !t.img ? { type: 'need', label: 'NEEDS A PICTURE' } : undefined
  }));

  const selectedTile =
    selectedTileIndex !== null && selectedTileIndex < tiles.length
      ? tiles[selectedTileIndex]
      : null;

  const handleUpdateTile = (index: number, patch: Partial<{ img: string; alt: string; url: string }>) => {
    const updated = [...tiles];
    updated[index] = { ...updated[index], ...patch };
    onChange({ ...settings, tiles: updated });
  };

  const handleMoveTile = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= tiles.length) return;
    const updated = [...tiles];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, tiles: updated });
    setSelectedTileIndex(target);
  };

  const handleRemoveTile = (index: number) => {
    const updated = tiles.filter((_, idx) => idx !== index);
    onChange({ ...settings, tiles: updated });
    if (selectedTileIndex === index) {
      setSelectedTileIndex(null);
    } else if (selectedTileIndex !== null && selectedTileIndex > index) {
      setSelectedTileIndex(selectedTileIndex - 1);
    }
  };

  const handleAddTile = () => {
    if (tiles.length >= 6) return;
    const newTile = { img: '', alt: '', url: '' };
    const updated = [...tiles, newTile];
    onChange({ ...settings, tiles: updated });
    setSelectedTileIndex(updated.length - 1);
  };

  return (
    <div className="hok-instagram-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">Instagram</h2>
        <span className="hok-hp-editor-band-counter">Band 9 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        Six tiles and the follow line. The handle itself belongs to Site Settings — this band reads it.
      </p>

      {/* 7.1 Visibility Row */}
      <div className="hok-hp-visibility-row" id="insta-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
        </div>
        <span className="hok-hp-visibility-consequence">
          {isShown
            ? 'Showing on the live homepage, in position 9.'
            : 'Hidden. The settings below are kept, so it can come back exactly as it was.'}
        </span>
      </div>

      {/* Issues Strip */}
      {issues.map((iss) => (
        <IssueStrip
          key={iss.id}
          severity={iss.sev}
          message={iss.msg}
          doorLabel={iss.doorLabel}
          onDoorClick={() => iss.door && onNavigateToModule && onNavigateToModule(iss.door)}
        />
      ))}

      {/* Card 1 — The words (Spec 8.9.1) */}
      <Card
        id="insta-words-card"
        title="The words"
      >
        <div className="hok-insta-field-stack">
          <div id="insta-eyebrow">
            <Field label="Eyebrow">
              <input
                type="text"
                className="hok-field-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Our Community"
              />
            </Field>
          </div>

          <div id="insta-heading">
            <Field
              label="Heading"
              hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
            >
              <textarea
                className="hok-field-textarea"
                rows={2}
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="As seen on *Instagram*"
              />
            </Field>
            <ReadsAsMirror text={settings.heading} />
          </div>

          <div className="hok-insta-grid-2col">
            <Field label="Follow link label">
              <input
                type="text"
                className="hok-field-input"
                value={settings.viewAll?.lbl || ''}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    viewAll: { ...(settings.viewAll || { url: '' }), lbl: e.target.value }
                  })
                }
              />
            </Field>

            <Field label="Follow link link">
              <input
                type="text"
                className="hok-field-input"
                value={settings.viewAll?.url || ''}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    viewAll: { ...(settings.viewAll || { lbl: '' }), url: e.target.value }
                  })
                }
                placeholder="/rent"
              />
            </Field>
          </div>

          <Field
            label="Follow label in the app"
            hint="The app shortens it. Blank uses the desktop label."
          >
            <input
              type="text"
              className="hok-field-input"
              value={settings.viewAllMob || ''}
              onChange={(e) => onChange({ ...settings, viewAllMob: e.target.value })}
            />
          </Field>

          <div id="insta-follow">
            <Field
              label="Line under the tiles"
              hint={`The handle is added after this automatically — it reads “${settings.strip || 'Follow our story at'} ${INSTAGRAM_HANDLE}”.`}
            >
              <input
                type="text"
                className="hok-field-input"
                value={settings.strip}
                onChange={(e) => onChange({ ...settings, strip: e.target.value })}
                placeholder="Follow our story at"
              />
            </Field>
          </div>

          <Field
            label="Line under the tiles — app"
            hint="The app shortens it. Blank uses the desktop line."
          >
            <input
              type="text"
              className="hok-field-input"
              value={settings.stripMob}
              onChange={(e) => onChange({ ...settings, stripMob: e.target.value })}
              placeholder="Follow us at"
            />
          </Field>
        </div>
      </Card>

      {/* Card 2 — The handle (Spec 8.9.2) */}
      <div id="insta-handle">
        <Card
          title="The handle"
          sub="Owned by Site Settings, because order confirmations and the footer print it too."
          doorLabel="Open Site Settings →"
          onDoorClick={() => onNavigateSiteSettings && onNavigateSiteSettings()}
        >
          <div className="hok-insta-handle-content">
            <div className="hok-insta-handle-row">
              <span className="hok-insta-handle-tag">{INSTAGRAM_HANDLE}</span>
              <span className="hok-insta-handle-src">Site Settings · Contact & social</span>
            </div>
            <p className="hok-insta-handle-note">
              Change it once there and it changes in the footer, on this band, and in every message that carries it. There is no second copy to keep in step.
            </p>
          </div>
        </Card>
      </div>

      {/* Card 3 — Where the tiles come from (Spec 8.9.3 & 12.6) */}
      <Card
        title="Where the tiles come from"
      >
        <div className="hok-insta-field-stack">
          <Field
            label="Source"
            hint={
              settings.source === 'Live Instagram feed'
                ? 'Needs a Meta connection the platform does not have yet.'
                : 'Six pictures chosen by hand. They stay put until somebody changes them.'
            }
          >
            <select
              className="hok-field-select"
              value={settings.source}
              onChange={(e) =>
                onChange({
                  ...settings,
                  source: e.target.value as 'Manual tiles' | 'Live Instagram feed'
                })
              }
            >
              <option value="Manual tiles">Manual tiles</option>
              <option value="Live Instagram feed">Live Instagram feed</option>
            </select>
          </Field>

          {settings.source === 'Live Instagram feed' ? (
            <div className="hok-insta-live-feed-note">
              Once a live feed is connected, the six most recent posts render here and these fields go away.
            </div>
          ) : (
            <div className="hok-insta-deck-wrapper">
              <Deck
                arrangement="d6"
                items={deckItems}
                selectedIndex={selectedTileIndex}
                onSelectIndex={setSelectedTileIndex}
                onMoveEarlier={(idx) => handleMoveTile(idx, 'up')}
                onMoveLater={(idx) => handleMoveTile(idx, 'down')}
                onRemove={handleRemoveTile}
                removeLabel="Remove"
                onAddTile={handleAddTile}
                addLabel="Add a tile"
              />

              {/* Inspector */}
              <Inspector
                kicker={`EDITING TILE ${selectedTileIndex !== null ? selectedTileIndex + 1 : 1}`}
                itemName={`Tile ${selectedTileIndex !== null ? selectedTileIndex + 1 : 1}`}
                isOpen={selectedTileIndex !== null && !!selectedTile}
                emptyText="Pick a tile above to set its picture and link destination."
              >
                {selectedTile && selectedTileIndex !== null && (
                  <div className="hok-insta-inspector-fields">
                    <MediaSlot
                      title="Tile picture"
                      specText="Square, 1080×1080. Crop it the way it appears on the feed."
                      imageUrl={selectedTile.img}
                      altText={selectedTile.alt}
                      altHint="What a screen reader announces, and what shows if the picture fails to load."
                      onUpload={(url) => handleUpdateTile(selectedTileIndex, { img: url })}
                      onRemove={() => handleUpdateTile(selectedTileIndex, { img: '' })}
                      onChangeAlt={(alt) => handleUpdateTile(selectedTileIndex, { alt })}
                      previewWidth={120}
                      previewHeight={120}
                    />

                    <Field
                      label="Opens"
                      hint="The post this tile links to. Blank sends the tap to the profile instead."
                    >
                      <input
                        type="text"
                        className="hok-field-input"
                        value={selectedTile.url}
                        onChange={(e) =>
                          handleUpdateTile(selectedTileIndex, { url: e.target.value })
                        }
                        placeholder="https://instagram.com/p/…"
                      />
                    </Field>
                  </div>
                )}
              </Inspector>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
