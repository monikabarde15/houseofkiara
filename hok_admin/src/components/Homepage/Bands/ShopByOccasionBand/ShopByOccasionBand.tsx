/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · SHOP BY OCCASION (Spec 8.5)
   Note: Present in Admin, but Not Built on Storefront (vis.occasions = false)
========================================================= */

import React, { useState } from 'react';
import './ShopByOccasionBand.css';
import { OccasionsSettings, OccasionTileConfig, HealthIssue } from '../../types/homepage.types';
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

interface ShopByOccasionBandProps {
  settings: OccasionsSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: OccasionsSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

// Master Occasions registry definitions (derived values owned by Master Data)
const MASTER_OCCASIONS = [
  { id: 'wedding-guest', name: 'Wedding Guest', defaultLabel: 'Wedding Guest', slug: '/occasions/wedding-guest', liveCount: 8 },
  { id: 'sangeet', name: 'Sangeet & Cocktails', defaultLabel: 'Sangeet & Cocktails', slug: '/occasions/sangeet', liveCount: 6 },
  { id: 'mehendi', name: 'Mehendi & Haldi', defaultLabel: 'Mehendi & Haldi', slug: '/occasions/mehendi', liveCount: 5 },
  { id: 'reception', name: 'Reception Glam', defaultLabel: 'Reception Glam', slug: '/occasions/reception', liveCount: 4 },
  { id: 'pooja', name: 'Pooja & Festive', defaultLabel: 'Pooja & Festive', slug: '/occasions/pooja', liveCount: 3 },
  { id: 'resort', name: 'Destination & Resort', defaultLabel: 'Destination & Resort', slug: '/occasions/resort', liveCount: 2 },
  { id: 'cocktail', name: 'Cocktail Night', defaultLabel: 'Cocktail Night', slug: '/occasions/cocktail', liveCount: 3 },
  { id: 'bridal-shower', name: 'Bridal Shower', defaultLabel: 'Bridal Shower', slug: '/occasions/bridal-shower', liveCount: 2 }
];

const DEFAULT_OCCASION_KEYS = ['wedding-guest', 'sangeet', 'mehendi', 'reception', 'pooja', 'resort'];

export const ShopByOccasionBand: React.FC<ShopByOccasionBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  const tileSettings = settings.tiles || {};
  const occasionKeys = Object.keys(tileSettings).length > 0 ? Object.keys(tileSettings) : DEFAULT_OCCASION_KEYS;

  // Deck items representation
  const deckItems: DeckTileItem[] = occasionKeys.map((occKey, idx) => {
    const tileConfig = tileSettings[occKey] || { alt: '', lbl: '', img: '' };
    const master = MASTER_OCCASIONS.find((m) => m.id === occKey);
    const displayName = tileConfig.lbl || master?.defaultLabel || occKey;
    const count = master?.liveCount ?? 0;

    return {
      id: `occasion-tile-${occKey}`,
      position: idx + 1,
      title: displayName,
      sub: `${master?.name || occKey} · ${count} live`,
      imageUrl: tileConfig.img,
      noPicture: !tileConfig.img,
      pictureHeight: 100
    };
  });

  const selectedOccKey =
    selectedTileIndex !== null && selectedTileIndex < occasionKeys.length
      ? occasionKeys[selectedTileIndex]
      : null;

  const selectedTileConfig = selectedOccKey ? tileSettings[selectedOccKey] || { alt: '', lbl: '', img: '' } : null;
  const selectedMaster = selectedOccKey ? MASTER_OCCASIONS.find((m) => m.id === selectedOccKey) : null;

  // Handlers
  const handleUpdateTileConfig = (occKey: string, patch: Partial<OccasionTileConfig>) => {
    const current = tileSettings[occKey] || { alt: '', lbl: '', img: '' };
    onChange({
      ...settings,
      tiles: {
        ...tileSettings,
        [occKey]: {
          ...current,
          ...patch
        }
      }
    });
  };

  const handleSwapOccasion = (oldKey: string, newKey: string) => {
    const newTiles: { [k: string]: OccasionTileConfig } = {};
    occasionKeys.forEach((k) => {
      if (k === oldKey) {
        const master = MASTER_OCCASIONS.find((m) => m.id === newKey);
        newTiles[newKey] = {
          alt: `${master?.name || newKey} on House of Kaira`,
          lbl: master?.defaultLabel || newKey,
          img: ''
        };
      } else {
        newTiles[k] = tileSettings[k] || { alt: '', lbl: '', img: '' };
      }
    });
    onChange({ ...settings, tiles: newTiles });
  };

  const handleMoveTile = (index: number, direction: 'earlier' | 'later') => {
    const target = direction === 'earlier' ? index - 1 : index + 1;
    if (target < 0 || target >= occasionKeys.length) return;
    const newKeys = [...occasionKeys];
    const temp = newKeys[index];
    newKeys[index] = newKeys[target];
    newKeys[target] = temp;

    const reordered: { [k: string]: OccasionTileConfig } = {};
    newKeys.forEach((k) => {
      reordered[k] = tileSettings[k] || { alt: '', lbl: '', img: '' };
    });
    onChange({ ...settings, tiles: reordered });
    setSelectedTileIndex(target);
  };

  return (
    <div className="hok-band-editor hok-shop-by-occasion-band">
      {/* Band Status Notice (Spec 8.5) */}
      <div className="hok-sbo-not-built-banner">
        <div className="hok-sbo-banner-badge">NOT BUILT ON STOREFRONT</div>
        <div className="hok-sbo-banner-text">
          This band is fully configured in the Admin workspace, but the storefront layout template for <strong>Shop by Occasion</strong> is currently marked hidden and under engineering review (<code>vis.occasions = false</code>). Once enabled and deployed, it will render between Category and Our Commitment.
        </div>
      </div>

      {/* Band Header Card */}
      <Card
        variant="elevated"
        header={{
          eyebrow: 'BAND 5 · SHOP BY OCCASION',
          title: 'Shop by Occasion',
          meta: isShown ? 'VISIBLE ON STOREFRONT' : 'HIDDEN (DEFAULT)',
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
          Six curated occasion edits to guide customers looking for wedding guest, cocktail, sangeet, or festive looks.
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

      {/* Card 1: Headings & Navigation */}
      <Card
        header={{
          eyebrow: 'BAND HEADINGS & DESTINATION',
          title: 'Heading, Eyebrow and "View all" Link',
          meta: 'Top text and destination action'
        }}
      >
        <div className="hok-sbo-words-grid">
          <div id="occasions-eyebrow">
            <Field
              label="Eyebrow"
              hint="Small caps label above the main heading"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Dressed for the Day"
              />
            </Field>
          </div>

          <div id="occasions-heading">
            <Field
              label="Main Heading"
              hint="Wrap *words in asterisks* for gold italic serif font"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Shop by *Occasion*"
              />
            </Field>
          </div>
        </div>

        <div className="hok-sbo-mirror-box">
          <span className="hok-sbo-mirror-label">Live Storefront Heading Preview</span>
          <ReadsAsMirror
            eyebrow={settings.eyebrow}
            heading={settings.heading}
            className="hok-sbo-reads-as"
          />
        </div>

        <div className="hok-divider" />

        <div className="hok-sbo-links-grid">
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
              placeholder="All Occasions →"
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
              placeholder="/occasions"
            />
          </Field>

          <Field
            label="Tile Hover CTA"
            hint="Button label shown on individual occasion cards"
          >
            <input
              type="text"
              className="hok-input"
              value={settings.ctaLbl}
              onChange={(e) => onChange({ ...settings, ctaLbl: e.target.value })}
              placeholder="Shop the Edit"
            />
          </Field>
        </div>
      </Card>

      {/* Card 2: 6 Occasion Tiles Deck & Inspector */}
      <Card
        header={{
          eyebrow: 'OCCASION TILES',
          title: '6 Occasion Cards',
          meta: `${occasionKeys.length} occasions slotted · 6-across deck`
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Click any occasion tile below to configure imagery, display labels, and check live catalogue inventory.
        </p>

        <div className="hok-sbo-deck-wrapper">
          <Deck
            arrangement="d6"
            items={deckItems}
            selectedIndex={selectedTileIndex}
            onSelectIndex={(idx) => setSelectedTileIndex(idx)}
            onMoveEarlier={(idx) => handleMoveTile(idx, 'earlier')}
            onMoveLater={(idx) => handleMoveTile(idx, 'later')}
          />

          {selectedOccKey && selectedTileConfig && selectedTileIndex !== null && (
            <Inspector
              title={`Edit Occasion ${selectedTileIndex + 1}: ${selectedTileConfig.lbl || selectedOccKey}`}
              position={selectedTileIndex + 1}
              totalItems={occasionKeys.length}
              onClose={() => setSelectedTileIndex(null)}
              onMoveUp={selectedTileIndex > 0 ? () => handleMoveTile(selectedTileIndex, 'earlier') : undefined}
              onMoveDown={
                selectedTileIndex < occasionKeys.length - 1
                  ? () => handleMoveTile(selectedTileIndex, 'later')
                  : undefined
              }
            >
              <div className="hok-sbo-inspector-content">
                {/* Occasion Master Data Reference Door */}
                <div className="hok-sbo-master-door">
                  <div className="hok-sbo-door-left">
                    <span className="hok-sbo-door-tag">MASTER DATA OCCASION</span>
                    <span className="hok-sbo-door-name">{selectedMaster?.name || selectedOccKey}</span>
                    <span className="hok-sbo-door-slug">Slug: {selectedMaster?.slug || `/occasions/${selectedOccKey}`} · {selectedMaster?.liveCount ?? 0} pieces live</span>
                  </div>
                  {onNavigateToModule && (
                    <button
                      type="button"
                      className="hok-sbo-door-btn"
                      onClick={() => onNavigateToModule('Categories')}
                    >
                      Master Data <DoorArrowIcon size={10} />
                    </button>
                  )}
                </div>

                <Field
                  label="Occasion Selection"
                  hint="Switch which occasion occupies this slot"
                >
                  <select
                    className="hok-select"
                    value={selectedOccKey}
                    onChange={(e) => handleSwapOccasion(selectedOccKey, e.target.value)}
                  >
                    {MASTER_OCCASIONS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.liveCount} live pieces)
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Display Label"
                  hint="Visible card heading (e.g. 'Wedding Guest')"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTileConfig.lbl}
                    onChange={(e) => handleUpdateTileConfig(selectedOccKey, { lbl: e.target.value })}
                    placeholder={selectedMaster?.defaultLabel || 'e.g. Wedding Guest'}
                  />
                </Field>

                <Field
                  label="Occasion Picture"
                  hint="Image Spec: 320 × 420 px (portrait portrait tile)"
                >
                  <MediaSlot
                    imageUrl={selectedTileConfig.img}
                    specDims="320 × 420 px"
                    label={`Picture for ${selectedTileConfig.lbl || selectedOccKey}`}
                    onUpload={(url) => handleUpdateTileConfig(selectedOccKey, { img: url })}
                    onRemove={() => handleUpdateTileConfig(selectedOccKey, { img: '' })}
                  />
                </Field>

                <Field
                  label="Image Alt Text"
                  hint="Accessibility description"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTileConfig.alt}
                    onChange={(e) => handleUpdateTileConfig(selectedOccKey, { alt: e.target.value })}
                    placeholder={`e.g. ${selectedMaster?.name || 'Occasion outfit'} on House of Kaira`}
                  />
                </Field>
              </div>
            </Inspector>
          )}
        </div>
      </Card>

      {/* Card 3: Layout & Derived Piece Counts */}
      <Card
        header={{
          eyebrow: 'LAYOUT & INVENTORY COUNTS',
          title: 'Layout & Storefront Piece Counts',
          meta: 'Grid presentation and count indicator'
        }}
      >
        <div className="hok-sbo-rules-grid">
          <Field
            label="Layout Style"
            hint="Display pattern across breakpoints"
          >
            <PillToggle
              options={[
                { label: 'Even grid (6 Across)', value: 'Even grid' },
                { label: 'Mosaic (Asymmetrical)', value: 'Mosaic' }
              ]}
              value={settings.layout}
              onChange={(val) => onChange({ ...settings, layout: val as 'Even grid' | 'Mosaic' })}
            />
          </Field>

          <Field
            label="Live Piece Count Badges"
            hint="Show live piece count on each tile (e.g. '8 pieces')"
          >
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.showCount}
              onChange={(val) => onChange({ ...settings, showCount: Boolean(val) })}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
};
