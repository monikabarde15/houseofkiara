/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · SHOP BY CATEGORY (Spec 8.4)
========================================================= */

import React, { useState } from 'react';
import './ShopByCategoryBand.css';
import { CategorySettings, CategoryTileConfig, HealthIssue } from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { MediaSlot } from '../../shared/MediaSlot/MediaSlot';
import { Deck, DeckArrangement } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';
import { DoorArrowIcon } from '../../shared/icons/HomepageIcons';

interface ShopByCategoryBandProps {
  settings: CategorySettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: CategorySettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

// Master Data category definitions (derived values, owned by Master Data)
const MASTER_CATEGORIES = [
  { id: 'bridal-lehenga', name: 'Bridal Lehenga', defaultLabel: 'Bridal Lehengas', slug: '/rent/bridal-lehenga', liveCount: 3 },
  { id: 'sherwani', name: 'Sherwani', defaultLabel: 'Sherwanis', slug: '/rent/sherwani', liveCount: 2 },
  { id: 'saree', name: 'Saree', defaultLabel: 'Sarees', slug: '/rent/saree', liveCount: 4 },
  { id: 'anarkali', name: 'Anarkali', defaultLabel: 'Anarkalis', slug: '/rent/anarkali', liveCount: 3 },
  { id: 'indo-western', name: 'Indo-Western', defaultLabel: 'Indo-Western', slug: '/rent/indo-western', liveCount: 1 },
  { id: 'lehenga', name: 'Lehenga', defaultLabel: 'Lehengas', slug: '/rent/lehenga', liveCount: 5 },
  { id: 'sharara', name: 'Sharara', defaultLabel: 'Shararas', slug: '/rent/sharara', liveCount: 2 },
  { id: 'kurta-set', name: 'Kurta Set', defaultLabel: 'Kurta Sets', slug: '/rent/kurta-set', liveCount: 3 }
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

  const categoryKeys = Object.keys(settings.tiles);

  // Deck items representation
  const deckItems: DeckTileItem[] = categoryKeys.map((catKey, idx) => {
    const tileConfig = settings.tiles[catKey] || { alt: '', lbl: '', kickMob: '', img: '' };
    const master = MASTER_CATEGORIES.find((m) => m.id === catKey);
    const displayName = tileConfig.lbl || master?.defaultLabel || catKey;
    const count = master?.liveCount ?? 0;
    const isLead = idx === 0;

    return {
      id: `category-tile-${catKey}`,
      position: idx + 1,
      title: displayName,
      sub: `${master?.name || catKey} · ${count} live`,
      badge: isLead ? 'LEAD TILE' : undefined,
      imageUrl: tileConfig.img,
      noPicture: !tileConfig.img,
      pictureHeight: isLead ? 130 : 90
    };
  });

  const selectedCatKey =
    selectedTileIndex !== null && selectedTileIndex < categoryKeys.length
      ? categoryKeys[selectedTileIndex]
      : null;

  const selectedTileConfig = selectedCatKey ? settings.tiles[selectedCatKey] : null;
  const selectedMaster = selectedCatKey ? MASTER_CATEGORIES.find((m) => m.id === selectedCatKey) : null;

  // Handlers
  const handleUpdateTileConfig = (catKey: string, patch: Partial<CategoryTileConfig>) => {
    onChange({
      ...settings,
      tiles: {
        ...settings.tiles,
        [catKey]: {
          ...settings.tiles[catKey],
          ...patch
        }
      }
    });
  };

  const handleSwapCategory = (oldKey: string, newKey: string) => {
    const newTiles: { [k: string]: CategoryTileConfig } = {};
    categoryKeys.forEach((k) => {
      if (k === oldKey) {
        const master = MASTER_CATEGORIES.find((m) => m.id === newKey);
        newTiles[newKey] = {
          alt: `${master?.name || newKey} on House of Kaira`,
          lbl: master?.defaultLabel || newKey,
          kickMob: settings.tiles[oldKey]?.kickMob || 'Curated for every occasion',
          img: ''
        };
      } else {
        newTiles[k] = settings.tiles[k];
      }
    });
    onChange({ ...settings, tiles: newTiles });
  };

  const handleMoveTile = (index: number, direction: 'earlier' | 'later') => {
    const target = direction === 'earlier' ? index - 1 : index + 1;
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

  const arrangement: DeckArrangement = settings.layout === 'Mosaic' ? 'mosaic' : 'd4';

  return (
    <div className="hok-band-editor hok-shop-by-category-band">
      {/* Band Header Card */}
      <Card
        variant="elevated"
        header={{
          eyebrow: 'BAND 4 · SHOP BY CATEGORY',
          title: 'Shop by Category',
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
          Five categories in an asymmetrical mosaic or even grid layout. Live piece counts are read directly from the catalogue — never stored on the homepage record.
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

      {/* Card 1: Words, Link & Header Toggles */}
      <Card
        header={{
          eyebrow: 'BAND HEADINGS & DESTINATION',
          title: 'Heading, CTA and Header Visibility',
          meta: 'Top text and section header controls'
        }}
      >
        <div className="hok-sbc-words-grid">
          <div id="category-eyebrow">
            <Field
              label="Eyebrow"
              hint="Small caps kicker above main heading"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Curated for Every Occasion"
              />
            </Field>
          </div>

          <div id="category-heading">
            <Field
              label="Main Heading"
              hint="Wrap *words in asterisks* for gold italic serif font"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Shop by *Category*"
              />
            </Field>
          </div>
        </div>

        <div className="hok-sbc-mirror-box">
          <span className="hok-sbc-mirror-label">Live Storefront Heading Preview</span>
          <ReadsAsMirror
            eyebrow={settings.eyebrow}
            heading={settings.heading}
            className="hok-sbc-reads-as"
          />
        </div>

        <div className="hok-divider" />

        <div className="hok-sbc-links-grid">
          <Field
            label='"View all" Link Text'
            hint="Top right link label"
          >
            <input
              type="text"
              className="hok-input"
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

          <Field
            label="Destination URL"
            hint="Target path for the link"
          >
            <input
              type="text"
              className="hok-input"
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

          <div id="category-cta">
            <Field
              label="Tile CTA Label"
              hint="Hover button label on individual category cards"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.ctaLbl}
                onChange={(e) => onChange({ ...settings, ctaLbl: e.target.value })}
                placeholder="Shop Now"
              />
            </Field>
          </div>
        </div>

        <div className="hok-divider" />

        <div className="hok-sbc-header-toggles-grid">
          <div className="hok-sbc-header-toggle-item">
            <div className="hok-sbc-toggle-text">
              <span className="hok-sbc-toggle-title">Show header on Desktop</span>
              <span className="hok-sbc-toggle-desc">Renders eyebrow, heading, and "View all" link on desktop</span>
            </div>
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.header}
              onChange={(val) => onChange({ ...settings, header: Boolean(val) })}
            />
          </div>

          <div className="hok-sbc-header-toggle-item">
            <div className="hok-sbc-toggle-text">
              <span className="hok-sbc-toggle-title">Show header on Mobile</span>
              <span className="hok-sbc-toggle-desc">Renders heading section above carousel/stack on mobile</span>
            </div>
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.headerMob}
              onChange={(val) => onChange({ ...settings, headerMob: Boolean(val) })}
            />
          </div>
        </div>
      </Card>

      {/* Card 2: 5 Mosaic Tiles Deck & Inspector */}
      <Card
        header={{
          eyebrow: '5 CATEGORY TILES',
          title: 'Mosaic Tiles & Picture Setup',
          meta: `${categoryKeys.length} categories slotted · ${settings.layout} arrangement`
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Tile 1 is the large featured lead card on the left; Tiles 2–5 form the 2×2 grid on the right. Click any tile to configure imagery, custom labels, and kicker copy.
        </p>

        <div className="hok-sbc-deck-wrapper">
          <Deck
            arrangement={arrangement}
            items={deckItems}
            selectedIndex={selectedTileIndex}
            onSelectIndex={(idx) => setSelectedTileIndex(idx)}
            onMoveEarlier={(idx) => handleMoveTile(idx, 'earlier')}
            onMoveLater={(idx) => handleMoveTile(idx, 'later')}
          />

          {selectedCatKey && selectedTileConfig && selectedTileIndex !== null && (
            <Inspector
              title={`Edit Category Tile ${selectedTileIndex + 1}: ${selectedTileConfig.lbl || selectedCatKey}`}
              position={selectedTileIndex + 1}
              totalItems={categoryKeys.length}
              onClose={() => setSelectedTileIndex(null)}
              onMoveUp={selectedTileIndex > 0 ? () => handleMoveTile(selectedTileIndex, 'earlier') : undefined}
              onMoveDown={
                selectedTileIndex < categoryKeys.length - 1
                  ? () => handleMoveTile(selectedTileIndex, 'later')
                  : undefined
              }
            >
              <div className="hok-sbc-inspector-content">
                {/* Category Master Data Reference Door */}
                <div className="hok-sbc-master-door">
                  <div className="hok-sbc-door-left">
                    <span className="hok-sbc-door-tag">MASTER DATA CATEGORY</span>
                    <span className="hok-sbc-door-name">{selectedMaster?.name || selectedCatKey}</span>
                    <span className="hok-sbc-door-slug">Slug: {selectedMaster?.slug || `/rent/${selectedCatKey}`} · {selectedMaster?.liveCount ?? 0} pieces live</span>
                  </div>
                  {onNavigateToModule && (
                    <button
                      type="button"
                      className="hok-sbc-door-btn"
                      onClick={() => onNavigateToModule('Categories')}
                    >
                      Open in Categories <DoorArrowIcon size={10} />
                    </button>
                  )}
                </div>

                <Field
                  label="Category Selection"
                  hint="Switch which category occupies this slot"
                >
                  <select
                    className="hok-select"
                    value={selectedCatKey}
                    onChange={(e) => handleSwapCategory(selectedCatKey, e.target.value)}
                  >
                    {MASTER_CATEGORIES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.liveCount} live pieces)
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Custom Display Label"
                  hint="What appears on the tile (falls back to category name if blank)"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTileConfig.lbl}
                    onChange={(e) => handleUpdateTileConfig(selectedCatKey, { lbl: e.target.value })}
                    placeholder={selectedMaster?.defaultLabel || 'e.g. Bridal Lehengas'}
                  />
                </Field>

                <Field
                  label="Mobile Kicker / Tagline"
                  hint="Sub-line shown under title on mobile view"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTileConfig.kickMob}
                    onChange={(e) =>
                      handleUpdateTileConfig(selectedCatKey, { kickMob: e.target.value })
                    }
                    placeholder="Curated for every occasion"
                  />
                </Field>

                <Field
                  label="Category Picture"
                  hint={
                    selectedTileIndex === 0
                      ? 'Lead Tile Spec: 520 × 640 px (portrait banner)'
                      : 'Standard Tile Spec: 250 × 310 px (portrait card)'
                  }
                >
                  <MediaSlot
                    imageUrl={selectedTileConfig.img}
                    specDims={selectedTileIndex === 0 ? '520 × 640 px' : '250 × 310 px'}
                    label={`Picture for ${selectedTileConfig.lbl || selectedCatKey}`}
                    onUpload={(url) => handleUpdateTileConfig(selectedCatKey, { img: url })}
                    onRemove={() => handleUpdateTileConfig(selectedCatKey, { img: '' })}
                  />
                </Field>

                <Field
                  label="Image Alt Text"
                  hint="Required accessibility text describing the image"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTileConfig.alt}
                    onChange={(e) => handleUpdateTileConfig(selectedCatKey, { alt: e.target.value })}
                    placeholder={`e.g. ${selectedMaster?.name || 'Bridal outfit'} on House of Kaira`}
                  />
                </Field>
              </div>
            </Inspector>
          )}
        </div>
      </Card>

      {/* Card 3: Layout & Piece Count Rules */}
      <Card
        header={{
          eyebrow: 'LAYOUT & DERIVED PIECE COUNTS',
          title: 'Arrangement & Live Inventory Indicators',
          meta: 'Grid structure and customer piece counts'
        }}
      >
        <div id="category-layout" className="hok-sbc-layout-grid">
          <Field
            label="Desktop Layout"
            hint="Visual distribution on large screens"
          >
            <PillToggle
              options={[
                { label: 'Mosaic (1 Large + 4 Small)', value: 'Mosaic' },
                { label: 'Even grid (5 Columns)', value: 'Even grid' }
              ]}
              value={settings.layout}
              onChange={(val) => onChange({ ...settings, layout: val as 'Mosaic' | 'Even grid' })}
            />
          </Field>

          <Field
            label="Mobile Layout"
            hint="Visual distribution on mobile devices"
          >
            <PillToggle
              options={[
                { label: 'Carousel (Swipe)', value: 'Carousel' },
                { label: 'Stacked (Vertical)', value: 'Stacked' }
              ]}
              value={settings.layoutMob}
              onChange={(val) => onChange({ ...settings, layoutMob: val as 'Carousel' | 'Stacked' })}
            />
          </Field>
        </div>

        <div className="hok-divider" />

        <div className="hok-sbc-counts-grid">
          <div className="hok-sbc-count-toggle-item">
            <div className="hok-sbc-toggle-text">
              <span className="hok-sbc-toggle-title">Show piece count on Desktop</span>
              <span className="hok-sbc-toggle-desc">e.g. "3 live pieces" badge on category card</span>
            </div>
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.showCount}
              onChange={(val) => onChange({ ...settings, showCount: Boolean(val) })}
            />
          </div>

          <div className="hok-sbc-count-toggle-item">
            <div className="hok-sbc-toggle-text">
              <span className="hok-sbc-toggle-title">Show piece count on Mobile</span>
              <span className="hok-sbc-toggle-desc">Displays mobile count label below category name</span>
            </div>
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.showCountMob}
              onChange={(val) => onChange({ ...settings, showCountMob: Boolean(val) })}
            />
          </div>
        </div>

        {settings.showCountMob && (
          <div className="hok-sbc-template-row">
            <Field
              label="Mobile Count Label Template"
              hint="Use {n} as placeholder for live count (e.g. '{n} pieces available')"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.countLblMob}
                onChange={(e) => onChange({ ...settings, countLblMob: e.target.value })}
                placeholder="{n} pieces available"
              />
            </Field>
          </div>
        )}
      </Card>
    </div>
  );
};
