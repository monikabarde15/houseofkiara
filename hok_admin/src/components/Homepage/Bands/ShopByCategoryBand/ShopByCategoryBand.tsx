/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · SHOP BY CATEGORY BAND
   Spec Section 8.4 (v213)
========================================================= */

import React, { useState } from 'react';
import './ShopByCategoryBand.css';
import {
  CategorySettings,
  CategoryTileConfig,
  HealthIssue
} from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { MediaSlot } from '../../shared/MediaSlot/MediaSlot';
import { Deck, DeckArrangement } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';

interface ShopByCategoryBandProps {
  settings: CategorySettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: CategorySettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

// Master Category definitions (derived from Master Data)
const MASTER_CATEGORIES = [
  { id: 'bridal-lehenga', name: 'Bridal Lehenga', defaultLabel: 'Bridal Lehengas', slug: '/rent/bridal-lehenga', liveCount: 3 },
  { id: 'sherwani', name: 'Sherwani', defaultLabel: 'Sherwanis', slug: '/rent/sherwani', liveCount: 0 },
  { id: 'saree', name: 'Saree', defaultLabel: 'Sarees', slug: '/rent/saree', liveCount: 1 },
  { id: 'anarkali', name: 'Anarkali', defaultLabel: 'Anarkalis', slug: '/rent/anarkali', liveCount: 1 },
  { id: 'indo-western', name: 'Indo-Western', defaultLabel: 'Indo-Western', slug: '/rent/indo-western', liveCount: 0 }
];

export const ShopByCategoryBand: React.FC<ShopByCategoryBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  const categoryKeys = Object.keys(settings.tiles || {});

  // Build deck items
  const deckItems: DeckTileItem[] = categoryKeys.map((catKey, idx) => {
    const tileConfig = settings.tiles[catKey] || { alt: '', lbl: '', img: '' };
    const master = MASTER_CATEGORIES.find((m) => m.id === catKey);
    const displayName = tileConfig.lbl || master?.defaultLabel || catKey;
    const count = master?.liveCount ?? 0;
    const slug = master?.slug || `/rent/${catKey}`;

    return {
      id: `cat-tile-${catKey}`,
      position: idx + 1,
      title: displayName,
      sub: `${count} live · ${slug}`,
      pictureUrl: tileConfig.img || undefined,
      pictureHeight: idx === 0 && settings.layout === 'Mosaic' ? 132 : 96,
      cornerFlag: !tileConfig.img ? { type: 'need', label: 'NEEDS A PICTURE' } : undefined
    };
  });

  const selectedCatKey =
    selectedTileIndex !== null && selectedTileIndex < categoryKeys.length
      ? categoryKeys[selectedTileIndex]
      : null;

  const selectedMaster = selectedCatKey
    ? MASTER_CATEGORIES.find((m) => m.id === selectedCatKey)
    : null;

  const selectedTileConfig = selectedCatKey
    ? settings.tiles[selectedCatKey] || { alt: '', img: '', lbl: '', kickMob: '' }
    : null;

  const handleUpdateTile = (catKey: string, patch: Partial<CategoryTileConfig>) => {
    onChange({
      ...settings,
      tiles: {
        ...settings.tiles,
        [catKey]: {
          ...(settings.tiles[catKey] || { alt: '', img: '', lbl: '', kickMob: '' }),
          ...patch
        }
      }
    });
  };

  const handleMoveTile = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= categoryKeys.length) return;
    const entries = Object.entries(settings.tiles);
    const temp = entries[index];
    entries[index] = entries[target];
    entries[target] = temp;

    const reordered: { [k: string]: CategoryTileConfig } = {};
    entries.forEach(([k, v]) => {
      reordered[k] = v;
    });
    onChange({ ...settings, tiles: reordered });
    setSelectedTileIndex(target);
  };

  const handleRemoveTile = (index: number) => {
    const keyToRemove = categoryKeys[index];
    const newTiles = { ...settings.tiles };
    delete newTiles[keyToRemove];
    onChange({ ...settings, tiles: newTiles });
    setSelectedTileIndex(null);
  };

  const arrangement: DeckArrangement = settings.layout === 'Mosaic' ? 'mosaic' : 'd4';

  return (
    <div className="hok-category-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">Shop by Category</h2>
        <span className="hok-hp-editor-band-counter">Band 4 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        Which categories appear is decided in Master Data. How the tile reads — its picture, its label, its button — is decided here.
      </p>

      {/* 7.1 Visibility Row */}
      <div className="hok-hp-visibility-row" id="category-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
        </div>
        <span className="hok-hp-visibility-consequence">
          {isShown
            ? 'Showing on the live homepage, in position 4.'
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

      {/* Card 1 — The words (Spec 8.4.1) */}
      <Card
        id="category-words-card"
        title="The words"
      >
        <div className="hok-cat-field-stack">
          <div id="category-eyebrow">
            <Field label="Eyebrow">
              <input
                type="text"
                className="hok-field-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Curated for Every Occasion"
              />
            </Field>
          </div>

          <div id="category-heading">
            <Field
              label="Heading"
              hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
            >
              <textarea
                className="hok-field-textarea"
                rows={2}
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Shop by *Category*"
              />
            </Field>
            <ReadsAsMirror text={settings.heading} />
          </div>

          <div className="hok-cat-grid-2col">
            <Field label="View-all label">
              <input
                type="text"
                className="hok-field-input"
                value={settings.viewAll.lbl}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    viewAll: { ...settings.viewAll, lbl: e.target.value }
                  })
                }
                placeholder="View All →"
              />
            </Field>

            <Field label="View-all link">
              <input
                type="text"
                className="hok-field-input"
                value={settings.viewAll.url}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    viewAll: { ...settings.viewAll, url: e.target.value }
                  })
                }
                placeholder="/categories"
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Card 2 — The tiles (Spec 8.4.2) */}
      <Card
        title="The tiles"
        sub="Laid out the way the homepage lays them out. Click a tile to set its picture and wording."
        doorLabel="Open Master Data"
        onDoorClick={() => onNavigateToModule && onNavigateToModule('Master Data')}
      >
        <div className="hok-cat-deck-wrapper">
          <Deck
            arrangement={arrangement}
            items={deckItems}
            selectedIndex={selectedTileIndex}
            onSelectIndex={setSelectedTileIndex}
            onMoveEarlier={(idx) => handleMoveTile(idx, 'up')}
            onMoveLater={(idx) => handleMoveTile(idx, 'down')}
            onRemove={handleRemoveTile}
            removeLabel="Take off"
            onAddTile={() => onNavigateToModule && onNavigateToModule('Categories')}
            addLabel="Add a category"
            addCountText="2 not on the homepage"
            maxReached={categoryKeys.length >= 6}
          />

          {/* Inspector */}
          <Inspector
            kicker={`EDITING TILE ${selectedTileIndex !== null ? selectedTileIndex + 1 : 1}`}
            itemName={selectedTileConfig?.lbl || selectedMaster?.name || selectedCatKey || undefined}
            isOpen={selectedTileIndex !== null && !!selectedCatKey}
            emptyText="Pick a tile above to set its picture, its label and its app kicker."
          >
            {selectedCatKey && selectedTileConfig && (
              <div className="hok-cat-inspector-fields">
                <MediaSlot
                  title="Tile picture"
                  specText="Portrait, 700×1000 or larger. The name and the button sit over the bottom of the picture, so keep that area quiet."
                  imageUrl={selectedTileConfig.img}
                  altText={selectedTileConfig.alt}
                  onUpload={(url) => handleUpdateTile(selectedCatKey, { img: url })}
                  onRemove={() => handleUpdateTile(selectedCatKey, { img: '' })}
                  onChangeAlt={(alt) => handleUpdateTile(selectedCatKey, { alt })}
                  previewWidth={120}
                  previewHeight={160}
                  required
                />

                <Field
                  label="Label on the tile"
                  hint={`Blank uses the registry name, ${selectedMaster?.name || selectedCatKey}. The storefront sets these in the plural.`}
                >
                  <input
                    type="text"
                    className="hok-field-input"
                    value={selectedTileConfig.lbl}
                    onChange={(e) => handleUpdateTile(selectedCatKey, { lbl: e.target.value })}
                    placeholder={selectedMaster?.defaultLabel || selectedCatKey}
                  />
                </Field>

                <Field
                  label="Kicker — app only"
                  hint="The small line above the name on the app carousel. Desktop tiles carry none."
                >
                  <input
                    type="text"
                    className="hok-field-input"
                    value={selectedTileConfig.kickMob || ''}
                    onChange={(e) =>
                      handleUpdateTile(selectedCatKey, { kickMob: e.target.value })
                    }
                    placeholder="Curated for every occasion"
                  />
                </Field>

                <div className="hok-cat-meta-footer">
                  <span>The category itself — its name, slug and whether it is active — belongs to Master Data. The picture, the label and the kicker have no home but this one.</span>
                </div>
              </div>
            )}
          </Inspector>
        </div>
      </Card>

      {/* Card 3 — Layout (Spec 8.4.3) */}
      <div id="category-layout">
        <Card title="Layout">
          <div className="hok-cat-field-stack">
            <div className="hok-cat-grid-2col">
              <Field
                label="Desktop"
                hint={
                  settings.layout === 'Mosaic'
                    ? 'One wide tile and one tall, then three across. Needs exactly five tiles — there are 5.'
                    : 'Equal tiles across in a grid.'
                }
              >
                <select
                  className="hok-field-select"
                  value={settings.layout}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      layout: e.target.value as 'Mosaic' | 'Even grid'
                    })
                  }
                >
                  <option value="Mosaic">Mosaic</option>
                  <option value="Even grid">Even grid</option>
                </select>
              </Field>

              <Field
                label="App"
                hint="Full-height slides with dots, as the app ships today."
              >
                <select
                  className="hok-field-select"
                  value={settings.layoutMob}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      layoutMob: e.target.value as 'Carousel' | 'Stacked'
                    })
                  }
                >
                  <option value="Carousel">Carousel</option>
                  <option value="Stacked">Stacked</option>
                </select>
              </Field>
            </div>

            <div id="category-cta">
              <Field label="Button wording">
                <input
                  type="text"
                  className="hok-field-input"
                  value={settings.ctaLbl}
                  onChange={(e) => onChange({ ...settings, ctaLbl: e.target.value })}
                  placeholder="Shop Now"
                />
              </Field>
            </div>

            <div className="hok-cat-toggles-grid">
              <PillToggle
                checked={settings.header}
                onChange={(checked) => onChange({ ...settings, header: checked })}
                label="Show the band heading on desktop"
              />

              <PillToggle
                checked={settings.headerMob}
                onChange={(checked) => onChange({ ...settings, headerMob: checked })}
                label="Show the band heading in the app"
                hint="The app sets this in a full-bleed carousel with no heading above it, which is how it ships."
              />

              <PillToggle
                checked={settings.showCount}
                onChange={(checked) => onChange({ ...settings, showCount: checked })}
                label="Show the live piece count on desktop tiles"
              />

              <PillToggle
                checked={settings.showCountMob}
                onChange={(checked) => onChange({ ...settings, showCountMob: checked })}
                label="Show the live piece count in the app"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
