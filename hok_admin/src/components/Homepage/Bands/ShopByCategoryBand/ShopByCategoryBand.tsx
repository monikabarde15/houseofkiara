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
import { PlusIcon, SearchMagnifierIcon } from '../../shared/icons/HomepageIcons';
import { getCategorySection } from '../../../../services/homepageApi';
import { getCategories, Category } from '../../../../services/categoryApi';

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
  { id: 'bridal-lehenga', name: 'Bridal Lehenga', defaultLabel: 'Bridal Lehengas', slug: '/rent/bridal-lehenga', liveCount: 4 },
  { id: 'sherwani', name: 'Sherwani', defaultLabel: 'Sherwanis', slug: '/rent/sherwani', liveCount: 1 },
  { id: 'saree', name: 'Saree', defaultLabel: 'Sarees', slug: '/rent/saree', liveCount: 2 },
  { id: 'anarkali', name: 'Anarkali', defaultLabel: 'Anarkalis', slug: '/rent/anarkali', liveCount: 2 },
  { id: 'indo-western', name: 'Indo-Western', defaultLabel: 'Indo-Western', slug: '/rent/indo-western', liveCount: 1 }
];

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  'bridal-lehenga': '/uploads/sbc-1.jpg',
  'sherwani': '/uploads/sbc-2.jpg',
  'saree': '/uploads/sbc-3.jpg',
  'anarkali': '/uploads/sbc-4.jpg',
  'indo-western': '/uploads/sbc-5.jpg',
};

export const ShopByCategoryBand: React.FC<ShopByCategoryBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [dynamicStats, setDynamicStats] = useState<Record<string, { liveCount: number; img: string; name: string }>>({});
  const [masterCategoriesList, setMasterCategoriesList] = useState<Category[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // Fetch real-time live product counts and category images from backend
  React.useEffect(() => {
    let isMounted = true;
    getCategorySection().then((data: any) => {
      if (!isMounted || !data || !data.tiles) return;
      const stats: Record<string, { liveCount: number; img: string; name: string }> = {};
      for (const [key, val] of Object.entries(data.tiles as Record<string, any>)) {
        stats[key] = {
          liveCount: typeof val.liveCount === 'number' ? val.liveCount : 0,
          img: val.img || '',
          name: val.lbl || key,
        };
      }
      setDynamicStats(stats);
    }).catch((err) => {
      console.warn('Could not fetch dynamic category counts:', err);
    });

    getCategories().then((data) => {
      if (!isMounted || !Array.isArray(data)) return;
      setMasterCategoriesList(data);
    }).catch((err) => {
      console.warn('Could not fetch master categories:', err);
    });

    return () => { isMounted = false; };
  }, []);

  const categoryKeys = Object.keys(settings.tiles || {});

  // If there are no tiles selected yet, open the picker automatically
  React.useEffect(() => {
    if (categoryKeys.length === 0) {
      setIsPickerOpen(true);
    }
  }, [categoryKeys.length]);

  // Build deck items
  const deckItems: DeckTileItem[] = categoryKeys.map((catKey, idx) => {
    const tileConfig = settings.tiles[catKey] || { alt: '', lbl: '', img: '' };
    const master = MASTER_CATEGORIES.find((m) => m.id === catKey);
    const dynamic = dynamicStats[catKey];
    const displayName = tileConfig.lbl || master?.defaultLabel || catKey;
    const count = dynamic?.liveCount ?? master?.liveCount ?? 0;
    const slug = master?.slug || `/rent/${catKey}`;
    const pictureUrl = tileConfig.img || dynamic?.img || DEFAULT_CATEGORY_IMAGES[catKey] || undefined;

    return {
      id: `cat-tile-${catKey}`,
      position: idx + 1,
      title: displayName,
      sub: `${count} live · ${slug}`,
      pictureUrl,
      pictureHeight: idx === 0 && settings.layout === 'Mosaic' ? 132 : 96,
      cornerFlag: !pictureUrl ? { type: 'need', label: 'NEEDS A PICTURE' } : undefined
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

  // Combine Master Data categories
  const allAvailableCategories = React.useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      defaultLabel: string;
      slug: string;
      image: string;
      liveCount: number;
    }> = [];

    const seenIds = new Set<string>();

    // 1. Standard canonical categories
    for (const m of MASTER_CATEGORIES) {
      const dynamic = dynamicStats[m.id];
      const count = dynamic?.liveCount ?? m.liveCount ?? 0;
      const img = dynamic?.img || DEFAULT_CATEGORY_IMAGES[m.id] || '';
      list.push({
        id: m.id,
        name: m.name,
        defaultLabel: m.defaultLabel,
        slug: m.slug,
        image: img,
        liveCount: count,
      });
      seenIds.add(m.id);
      seenIds.add(m.id.toLowerCase());
      seenIds.add(m.name.toLowerCase());
      seenIds.add(m.defaultLabel.toLowerCase());
    }

    // 2. Extra DB categories from Master Data
    for (const c of masterCategoriesList) {
      const normKey = (c.slug || c.name).toLowerCase().replace(/^\/rent\//, '').replace(/\s+/g, '-').trim();
      const normName = c.name.toLowerCase().trim();
      if (seenIds.has(normKey) || seenIds.has(normName) || seenIds.has(normName.replace(/s$/, ''))) {
        continue;
      }
      seenIds.add(normKey);
      seenIds.add(normName);
      const dynamic = dynamicStats[normKey];
      const count = dynamic?.liveCount ?? 0;
      list.push({
        id: normKey,
        name: c.name,
        defaultLabel: c.name,
        slug: `/rent/${normKey}`,
        image: c.image || DEFAULT_CATEGORY_IMAGES[normKey] || '',
        liveCount: count,
      });
    }

    return list;
  }, [dynamicStats, masterCategoriesList]);

  const filteredCategories = allAvailableCategories.filter((cat) => {
    if (!pickerSearch.trim()) return true;
    const q = pickerSearch.toLowerCase().trim();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.defaultLabel.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q)
    );
  });

  const handleAddCategory = (cat: { id: string; name: string; defaultLabel: string; image: string }) => {
    if (categoryKeys.length >= 5) {
      return;
    }
    const catKey = cat.id;
    const img = DEFAULT_CATEGORY_IMAGES[catKey] || cat.image || '/uploads/sbc-1.jpg';
    const newTiles = {
      ...settings.tiles,
      [catKey]: {
        alt: cat.name,
        lbl: cat.defaultLabel || cat.name,
        kickMob: 'Curated for every occasion',
        img
      }
    };
    onChange({ ...settings, tiles: newTiles });
    setSelectedTileIndex(Object.keys(newTiles).length - 1);
  };

  const handleRestoreDefaults = () => {
    const defaultTiles = {
      'saree': { alt: 'Sarees', lbl: 'Sarees', kickMob: 'Timeless drapes', img: '/uploads/sbc-3.jpg' },
      'anarkali': { alt: 'Anarkalis', lbl: 'Anarkalis', kickMob: 'Ethereal silhouettes', img: '/uploads/sbc-4.jpg' },
      'sherwani': { alt: 'Sherwanis', lbl: 'Sherwanis', kickMob: 'For the groom', img: '/uploads/sbc-2.jpg' },
      'indo-western': { alt: 'Indo-Western', lbl: 'Indo-Western', kickMob: 'Modern fusion', img: '/uploads/sbc-5.jpg' },
      'bridal-lehenga': { alt: 'Bridal lehengas', lbl: 'Bridal Lehengas', kickMob: 'Curated for every occasion', img: '/uploads/sbc-1.jpg' }
    };
    onChange({ ...settings, tiles: defaultTiles });
    setSelectedTileIndex(0);
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
            onAddTile={() => setIsPickerOpen(true)}
            addLabel="Add a category"
            addCountText={categoryKeys.length >= 5 ? 'Limit reached (5 of 5)' : `${5 - categoryKeys.length} slots left`}
            maxReached={categoryKeys.length >= 5}
          />

          {/* Action Bar below Deck */}
          <div className="hok-cat-deck-footer">
            <div className="hok-cat-footer-actions">
              <button
                type="button"
                className="hok-cat-open-picker-btn"
                onClick={() => setIsPickerOpen(!isPickerOpen)}
              >
                <PlusIcon size={12} />
                {isPickerOpen ? 'Close Category Selector' : 'Choose / Add Category from Master Data'}
              </button>
              {categoryKeys.length < 5 && (
                <button
                  type="button"
                  className="hok-cat-restore-btn"
                  onClick={handleRestoreDefaults}
                  title="Restore the default 5 curated categories"
                >
                  Restore default 5 categories
                </button>
              )}
            </div>
            <span className="hok-cat-live-count-note">
              Mosaic layout displays exactly 5 tiles on desktop · {categoryKeys.length} of 5 chosen
            </span>
          </div>

          {/* Category Selector Box */}
          {isPickerOpen && (
            <div className="hok-cat-picker-box">
              <div className="hok-cat-picker-header">
                <div className="hok-cat-picker-title-group">
                  <span className="hok-cat-picker-title">Master Data Categories</span>
                  <span className="hok-cat-picker-sub">Select a category to place on the homepage tiles</span>
                </div>
                <span className="hok-cat-picker-slots-badge">
                  {5 - categoryKeys.length > 0 ? `${5 - categoryKeys.length} slots available` : '5 of 5 slots filled'}
                </span>
              </div>

              <div className="hok-cat-picker-filter-bar">
                <div className="hok-cat-search-wrap">
                  <SearchMagnifierIcon size={12} />
                  <input
                    type="text"
                    className="hok-cat-picker-search"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="Search category by name or slug..."
                  />
                </div>
              </div>

              <div className="hok-cat-picker-grid">
                {filteredCategories.map((cat) => {
                  const isAdded = categoryKeys.includes(cat.id);
                  const addedIndex = categoryKeys.indexOf(cat.id);
                  const thumb = cat.image || DEFAULT_CATEGORY_IMAGES[cat.id] || '/uploads/sbc-1.jpg';

                  return (
                    <div
                      key={cat.id}
                      className={`hok-cat-picker-card ${isAdded ? 'is-added' : ''}`}
                    >
                      <div className="hok-cat-picker-card-top">
                        <div
                          className="hok-cat-picker-thumb"
                          style={{ backgroundImage: `url(${thumb})` }}
                        />
                        <div className="hok-cat-picker-details">
                          <span className="hok-cat-picker-name">{cat.defaultLabel || cat.name}</span>
                          <span className="hok-cat-picker-slug">{cat.slug}</span>
                          <span className="hok-cat-picker-count">
                            {cat.liveCount > 0 ? `${cat.liveCount} live pieces` : '0 pieces'}
                          </span>
                        </div>
                      </div>

                      <div className="hok-cat-card-action">
                        {isAdded ? (
                          <div className="hok-cat-picker-added-row">
                            <span className="hok-cat-picker-added-pill">
                              ✓ Tile {addedIndex + 1}
                            </span>
                            <button
                              type="button"
                              className="hok-cat-picker-takeoff-btn"
                              onClick={() => handleRemoveTile(addedIndex)}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="hok-cat-picker-add-btn"
                            disabled={categoryKeys.length >= 5}
                            onClick={() => handleAddCategory(cat)}
                          >
                            {categoryKeys.length >= 5 ? 'Limit reached (5/5)' : '+ Add to Homepage'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                  imageUrl={selectedTileConfig.img || dynamicStats[selectedCatKey]?.img || DEFAULT_CATEGORY_IMAGES[selectedCatKey] || ''}
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
