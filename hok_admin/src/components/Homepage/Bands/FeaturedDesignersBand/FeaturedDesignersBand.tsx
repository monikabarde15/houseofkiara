/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · FEATURED DESIGNERS (Spec 8.7)
========================================================= */

import React, { useState } from 'react';
import './FeaturedDesignersBand.css';
import {
  DesignersSettings,
  DesignerTileConfig,
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
import {
  DoorArrowIcon,
  PlusIcon,
  SearchMagnifierIcon
} from '../../shared/icons/HomepageIcons';

interface FeaturedDesignersBandProps {
  settings: DesignersSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: DesignersSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

// Master Designers data registry (derived values owned by Master Data)
const MASTER_DESIGNERS = [
  { id: 'sabyasachi', name: 'Sabyasachi', type: 'Couture House', city: 'Kolkata', livePieces: 14, initials: 'SB', slug: '/designers/sabyasachi' },
  { id: 'manish-malhotra', name: 'Manish Malhotra', type: 'Couture House', city: 'Mumbai', livePieces: 9, initials: 'MM', slug: '/designers/manish-malhotra' },
  { id: 'tarun-tahiliani', name: 'Tarun Tahiliani', type: 'Couture House', city: 'New Delhi', livePieces: 7, initials: 'TT', slug: '/designers/tarun-tahiliani' },
  { id: 'anita-dongre', name: 'Anita Dongre', type: 'Couture House', city: 'Mumbai', livePieces: 8, initials: 'AD', slug: '/designers/anita-dongre' },
  { id: 'rahul-mishra', name: 'Rahul Mishra', type: 'Couture House', city: 'New Delhi', livePieces: 6, initials: 'RM', slug: '/designers/rahul-mishra' },
  { id: 'ridhi-mehra', name: 'Ridhi Mehra', type: 'Contemporary Label', city: 'New Delhi', livePieces: 5, initials: 'RM', slug: '/designers/ridhi-mehra' },
  { id: 'seema-gujral', name: 'Seema Gujral', type: 'Couture House', city: 'Noida', livePieces: 4, initials: 'SG', slug: '/designers/seema-gujral' },
  { id: 'amit-aggarwal', name: 'Amit Aggarwal', type: 'Contemporary Label', city: 'New Delhi', livePieces: 3, initials: 'AA', slug: '/designers/amit-aggarwal' },
  { id: 'raw-mango', name: 'Raw Mango', type: 'Heritage Label', city: 'New Delhi', livePieces: 4, initials: 'RM', slug: '/designers/raw-mango' },
  { id: 'torani', name: 'Torani', type: 'Heritage Wear', city: 'New Delhi', livePieces: 3, initials: 'TR', slug: '/designers/torani' }
];

const DEFAULT_SLOTS = [
  'sabyasachi',
  'manish-malhotra',
  'tarun-tahiliani',
  'anita-dongre',
  'rahul-mishra',
  'ridhi-mehra'
];

export const FeaturedDesignersBand: React.FC<FeaturedDesignersBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const slots = settings.slots && settings.slots.length > 0 ? settings.slots : DEFAULT_SLOTS;
  const tilesConfig = settings.tiles || {};

  // Deck items representation
  const deckItems: DeckTileItem[] = slots.map((designerId, idx) => {
    const master = MASTER_DESIGNERS.find((m) => m.id === designerId);
    const tileConf = tilesConfig[designerId] || {};
    const displayName = tileConf.lbl || master?.name || designerId;
    const pieces = master?.livePieces ?? 0;

    return {
      id: `designer-slot-${designerId}-${idx}`,
      position: idx + 1,
      title: displayName,
      sub: `${master?.type || 'Designer'} · ${master?.city || 'India'}`,
      badge: settings.showCount ? `${pieces} PIECES` : undefined,
      imageUrl: tileConf.img,
      noPicture: !tileConf.img,
      initials: master?.initials || displayName.slice(0, 2).toUpperCase(),
      pictureHeight: 110
    };
  });

  const selectedDesignerId =
    selectedSlotIndex !== null && selectedSlotIndex < slots.length
      ? slots[selectedSlotIndex]
      : null;

  const selectedMaster = selectedDesignerId
    ? MASTER_DESIGNERS.find((m) => m.id === selectedDesignerId)
    : null;

  const selectedTileConfig = selectedDesignerId
    ? tilesConfig[selectedDesignerId] || { alt: '', img: '', lbl: '' }
    : null;

  // Handlers
  const handleUpdateTileConfig = (designerId: string, patch: Partial<DesignerTileConfig>) => {
    const current = tilesConfig[designerId] || { alt: '', img: '', lbl: '' };
    onChange({
      ...settings,
      tiles: {
        ...tilesConfig,
        [designerId]: {
          ...current,
          ...patch
        }
      }
    });
  };

  const handleSwapSlot = (index: number, newDesignerId: string) => {
    const updated = [...slots];
    updated[index] = newDesignerId;
    onChange({ ...settings, slots: updated });
  };

  const handleMoveSlot = (index: number, direction: 'earlier' | 'later') => {
    const target = direction === 'earlier' ? index - 1 : index + 1;
    if (target < 0 || target >= slots.length) return;
    const updated = [...slots];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, slots: updated });
    setSelectedSlotIndex(target);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = slots.filter((_, i) => i !== index);
    onChange({ ...settings, slots: updated });
    setSelectedSlotIndex(null);
  };

  const handleAddSlot = (designerId: string) => {
    if (slots.length >= (settings.cap || 6)) return;
    if (slots.includes(designerId)) return;
    onChange({ ...settings, slots: [...slots, designerId] });
    setIsPickerOpen(false);
  };

  const filteredPickerDesigners = MASTER_DESIGNERS.filter((d) => {
    if (slots.includes(d.id)) return false;
    if (!pickerSearch) return true;
    const q = pickerSearch.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="hok-band-editor hok-featured-designers-band">
      {/* Band Header Card */}
      <Card
        variant="elevated"
        header={{
          eyebrow: 'BAND 7 · FEATURED DESIGNERS',
          title: 'Featured Designers',
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
          Six featured luxury Indian couture houses and contemporary designer labels. Live piece counts are read directly from active catalogue inventory.
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
          title: 'Heading, "View all" Link and Header Controls',
          meta: 'Top text and CTA options'
        }}
      >
        <div className="hok-des-words-grid">
          <Field
            label="Eyebrow"
            hint="Small caps kicker text"
          >
            <input
              id="designers-eyebrow"
              type="text"
              className="hok-input"
              value={settings.eyebrow}
              onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
              placeholder="Trusted Creators"
            />
          </Field>

          <Field
            label="Main Heading"
            hint="Wrap *words in asterisks* for gold italic serif font"
          >
            <input
              id="designers-heading"
              type="text"
              className="hok-input"
              value={settings.heading}
              onChange={(e) => onChange({ ...settings, heading: e.target.value })}
              placeholder="Featured *Designers*"
            />
          </Field>
        </div>

        <div className="hok-des-mirror-box">
          <span className="hok-des-mirror-label">Live Storefront Heading Preview</span>
          <ReadsAsMirror
            eyebrow={settings.eyebrow}
            heading={settings.heading}
            className="hok-des-reads-as"
          />
        </div>

        <div className="hok-divider" />

        <div id="designers-kick" className="hok-des-links-grid">
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
              placeholder="All Designers →"
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
              placeholder="/designers"
            />
          </Field>

          <Field
            label="Tile Hover CTA"
            hint="Button label shown on designer cards"
          >
            <input
              type="text"
              className="hok-input"
              value={settings.ctaLbl}
              onChange={(e) => onChange({ ...settings, ctaLbl: e.target.value })}
              placeholder="Shop the Collection"
            />
          </Field>
        </div>

        <div className="hok-divider" />

        <div className="hok-des-header-toggles-grid">
          <div className="hok-des-header-toggle-item">
            <div className="hok-des-toggle-text">
              <span className="hok-des-toggle-title">Show header on Desktop</span>
              <span className="hok-des-toggle-desc">Renders eyebrow, heading, and "View all" link on desktop</span>
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

          <div className="hok-des-header-toggle-item">
            <div className="hok-des-toggle-text">
              <span className="hok-des-toggle-title">Show header on Mobile</span>
              <span className="hok-des-toggle-desc">Renders section heading above carousel on mobile</span>
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

      {/* Card 2: 6 Designers Deck & Inspector */}
      <Card
        header={{
          eyebrow: 'DESIGNER SLOTS',
          title: '6 Featured Designer Slots',
          meta: `${slots.length} of ${settings.cap || 6} slots filled · 6-across deck`,
          actions:
            slots.length < (settings.cap || 6) ? (
              <button
                type="button"
                className="hok-des-add-slot-btn"
                onClick={() => setIsPickerOpen(true)}
              >
                <PlusIcon size={11} /> Add Designer
              </button>
            ) : undefined
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Click any designer tile below to configure portrait imagery, custom display label, or swap with another designer.
        </p>

        <div className="hok-des-deck-wrapper">
          <Deck
            arrangement="d6"
            items={deckItems}
            selectedIndex={selectedSlotIndex}
            onSelectIndex={(idx) => setSelectedSlotIndex(idx)}
            onMoveEarlier={(idx) => handleMoveSlot(idx, 'earlier')}
            onMoveLater={(idx) => handleMoveSlot(idx, 'later')}
          />

          {selectedDesignerId && selectedMaster && selectedSlotIndex !== null && (
            <Inspector
              title={`Edit Designer Slot ${selectedSlotIndex + 1}: ${selectedMaster.name}`}
              position={selectedSlotIndex + 1}
              totalItems={slots.length}
              onClose={() => setSelectedSlotIndex(null)}
              onMoveUp={selectedSlotIndex > 0 ? () => handleMoveSlot(selectedSlotIndex, 'earlier') : undefined}
              onMoveDown={
                selectedSlotIndex < slots.length - 1
                  ? () => handleMoveSlot(selectedSlotIndex, 'later')
                  : undefined
              }
            >
              <div className="hok-des-inspector-content">
                {/* Designer Master Data Door */}
                <div className="hok-des-master-door">
                  <div className="hok-des-door-left">
                    <span className="hok-des-door-tag">MASTER DATA RECORD</span>
                    <span className="hok-des-door-name">{selectedMaster.name}</span>
                    <span className="hok-des-door-meta">
                      {selectedMaster.type} · {selectedMaster.city} · {selectedMaster.livePieces} active pieces
                    </span>
                  </div>
                  {onNavigateToModule && (
                    <button
                      type="button"
                      className="hok-des-door-btn"
                      onClick={() => onNavigateToModule('Designers')}
                    >
                      Open in Designers <DoorArrowIcon size={10} />
                    </button>
                  )}
                </div>

                <Field
                  label="Switch Designer"
                  hint="Select a different designer for this slot"
                >
                  <select
                    className="hok-select"
                    value={selectedDesignerId}
                    onChange={(e) => handleSwapSlot(selectedSlotIndex, e.target.value)}
                  >
                    {MASTER_DESIGNERS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.livePieces} live pieces)
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Custom Display Name"
                  hint="What appears on the tile (falls back to designer name)"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTileConfig?.lbl || ''}
                    onChange={(e) =>
                      handleUpdateTileConfig(selectedDesignerId, { lbl: e.target.value })
                    }
                    placeholder={selectedMaster.name}
                  />
                </Field>

                <Field
                  label="Portrait Image"
                  hint="Image Spec: 220 × 280 px (portrait portrait card)"
                >
                  <MediaSlot
                    imageUrl={selectedTileConfig?.img}
                    specDims="220 × 280 px"
                    label={`Portrait for ${selectedMaster.name}`}
                    onUpload={(url) => handleUpdateTileConfig(selectedDesignerId, { img: url })}
                    onRemove={() => handleUpdateTileConfig(selectedDesignerId, { img: '' })}
                  />
                </Field>

                <Field
                  label="Image Alt Text"
                  hint="Accessibility description"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedTileConfig?.alt || ''}
                    onChange={(e) =>
                      handleUpdateTileConfig(selectedDesignerId, { alt: e.target.value })
                    }
                    placeholder={`e.g. ${selectedMaster.name} couture runway on House of Kaira`}
                  />
                </Field>

                <div className="hok-des-inspector-actions">
                  <button
                    type="button"
                    className="hok-des-remove-slot-btn"
                    onClick={() => handleRemoveSlot(selectedSlotIndex)}
                  >
                    Remove from Featured
                  </button>
                </div>
              </div>
            </Inspector>
          )}
        </div>
      </Card>

      {/* Card 3: Layout & Derived Piece Counts */}
      <Card
        header={{
          eyebrow: 'LAYOUT & LIVE INVENTORY COUNTS',
          title: 'Layout & Count Formatting',
          meta: 'Grid presentation and piece count badges'
        }}
      >
        <div className="hok-des-layout-grid">
          <Field
            label="Desktop Layout"
            hint="Display style on desktop viewports"
          >
            <PillToggle
              options={[
                { label: 'Grid (6 Across)', value: 'Grid' },
                { label: 'Carousel (Slide)', value: 'Carousel' }
              ]}
              value={settings.layout}
              onChange={(val) => onChange({ ...settings, layout: val as 'Grid' | 'Carousel' })}
            />
          </Field>

          <Field
            label="Mobile Layout"
            hint="Display style on mobile viewports"
          >
            <PillToggle
              options={[
                { label: 'Carousel (Swipe)', value: 'Carousel' },
                { label: 'Grid (2 Columns)', value: 'Grid' }
              ]}
              value={settings.layoutMob}
              onChange={(val) => onChange({ ...settings, layoutMob: val as 'Carousel' | 'Grid' })}
            />
          </Field>

          <Field
            label="Slide Kicker"
            hint="Tagline shown in mobile carousel view"
          >
            <input
              type="text"
              className="hok-input"
              value={settings.slideKick}
              onChange={(e) => onChange({ ...settings, slideKick: e.target.value })}
              placeholder="Featured Designer"
            />
          </Field>
        </div>

        <div className="hok-divider" />

        <div className="hok-des-counts-grid">
          <div className="hok-des-count-toggle-item">
            <div className="hok-des-toggle-text">
              <span className="hok-des-toggle-title">Show live piece counts on tiles</span>
              <span className="hok-des-toggle-desc">Displays derived piece count badge (e.g. "14 PIECES")</span>
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

          <Field
            label="Desktop Count Format"
            hint="Use {n} for number placeholder (e.g. '{n} PIECES')"
          >
            <input
              type="text"
              className="hok-input"
              value={settings.countLbl}
              onChange={(e) => onChange({ ...settings, countLbl: e.target.value })}
              placeholder="{n} PIECES"
            />
          </Field>

          <Field
            label="Mobile Count Format"
            hint="Use {n} for number placeholder (e.g. '{n} pieces available')"
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
      </Card>

      {/* Add Designer Modal */}
      {isPickerOpen && (
        <div className="hok-modal-overlay" onClick={() => setIsPickerOpen(false)}>
          <div className="hok-des-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hok-des-modal-header">
              <div>
                <h3 className="hok-des-modal-title">Add Designer to Featured</h3>
                <p className="hok-des-modal-sub">Select an active designer from the master catalogue</p>
              </div>
              <button
                type="button"
                className="hok-des-modal-close-btn"
                onClick={() => setIsPickerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="hok-des-modal-search">
              <SearchMagnifierIcon size={14} className="hok-des-modal-search-icon" />
              <input
                type="text"
                className="hok-input hok-des-modal-search-input"
                placeholder="Search by designer name, type, or city..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="hok-des-modal-list">
              {filteredPickerDesigners.length === 0 ? (
                <div className="hok-des-modal-empty">All eligible designers are already added or no results match.</div>
              ) : (
                filteredPickerDesigners.map((d) => (
                  <div key={d.id} className="hok-des-modal-item">
                    <div className="hok-des-modal-item-info">
                      <span className="hok-des-modal-item-name">{d.name}</span>
                      <span className="hok-des-modal-item-sub">
                        {d.type} · {d.city} · {d.livePieces} pieces live
                      </span>
                    </div>
                    <button
                      type="button"
                      className="hok-des-modal-select-btn"
                      onClick={() => handleAddSlot(d.id)}
                    >
                      Add Slot
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
