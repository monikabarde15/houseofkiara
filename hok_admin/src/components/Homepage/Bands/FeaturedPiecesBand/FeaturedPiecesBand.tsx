/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · FEATURED PIECES BAND (Spec 8.3)
========================================================= */

import React, { useState } from 'react';
import './FeaturedPiecesBand.css';
import { FeaturedPiecesSettings, HealthIssue } from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';
import { PieceCard } from '../../shared/PieceCard/PieceCard';
import { SAMPLE_CATALOGUE_PIECES } from '../../data/cataloguePieces';
import { PlusIcon, SearchMagnifierIcon, SwapIcon } from '../../shared/icons/HomepageIcons';

interface FeaturedPiecesBandProps {
  settings: FeaturedPiecesSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: FeaturedPiecesSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

const SHOT_OPTIONS = ['On model', 'Flat lay', 'Ghost mannequin', 'Detail shot'] as const;

export const FeaturedPiecesBand: React.FC<FeaturedPiecesBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isCataloguePickerOpen, setIsCataloguePickerOpen] = useState(false);
  const [catalogueSearchQuery, setCatalogueSearchQuery] = useState('');

  // Find piece data for a given SKU
  const getPieceBySku = (sku: string) => {
    return SAMPLE_CATALOGUE_PIECES.find((p) => p.sku === sku) || null;
  };

  // Build deck items for the configured slots
  const slotDeckItems: DeckTileItem[] = settings.slots.map((sku, idx) => {
    const piece = getPieceBySku(sku);
    const shot = settings.shots[sku] || 'Default';
    return {
      id: `slot-${idx + 1}-${sku}`,
      position: idx + 1,
      title: piece ? piece.name : sku,
      sub: piece ? `${piece.designer} · ${piece.category}` : 'SKU not found in catalogue',
      badge: shot !== 'Default' ? shot : undefined
    };
  });

  const selectedSku =
    selectedSlotIndex !== null && selectedSlotIndex < settings.slots.length
      ? settings.slots[selectedSlotIndex]
      : null;

  const selectedPiece = selectedSku ? getPieceBySku(selectedSku) : null;
  const currentShot = selectedSku ? settings.shots[selectedSku] || 'On model' : 'On model';

  // Slot management functions
  const handleUpdateSku = (index: number, newSku: string) => {
    const updated = [...settings.slots];
    updated[index] = newSku.trim().toUpperCase();
    onChange({ ...settings, slots: updated });
  };

  const handleUpdateShot = (sku: string, shot: string) => {
    onChange({
      ...settings,
      shots: {
        ...settings.shots,
        [sku]: shot
      }
    });
  };

  const handleMoveSlot = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= settings.slots.length) return;
    const updated = [...settings.slots];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, slots: updated });
    setSelectedSlotIndex(target);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = settings.slots.filter((_, i) => i !== index);
    onChange({ ...settings, slots: updated });
    setSelectedSlotIndex(null);
  };

  const handleAddSlot = () => {
    if (settings.slots.length >= (settings.cap || 8)) return;
    // Find first available sample piece not already in slots
    const available = SAMPLE_CATALOGUE_PIECES.find((p) => !settings.slots.includes(p.sku));
    const newSku = available ? available.sku : `HOK-NEW-00${settings.slots.length + 1}`;
    onChange({ ...settings, slots: [...settings.slots, newSku] });
    setSelectedSlotIndex(settings.slots.length);
  };

  // Filter catalogue pieces for picker modal
  const filteredCataloguePieces = SAMPLE_CATALOGUE_PIECES.filter((p) => {
    if (!catalogueSearchQuery) return true;
    const q = catalogueSearchQuery.toLowerCase();
    return (
      p.sku.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.designer.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="hok-band-editor hok-featured-pieces-band">
      {/* Band Header Card */}
      <Card
        variant="elevated"
        header={{
          eyebrow: 'BAND 3 · FEATURED PIECES',
          title: 'Featured Pieces',
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
          Curated showcase of high-demand pieces. Configure primary SKU slots manually or let the platform top up automatically from active live inventory.
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

      {/* Card 1: Header & View All */}
      <Card
        header={{
          eyebrow: 'BAND HEADINGS & DESTINATION',
          title: 'Heading and "View all" Link',
          meta: 'Top text and destination action'
        }}
      >
        <div className="hok-feat-words-grid">
          <div id="featured-eyebrow">
            <Field
              label="Eyebrow"
              hint="Small caps kicker text"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Handpicked for You"
              />
            </Field>
          </div>

          <div id="featured-heading">
            <Field
              label="Main Heading"
              hint="Wrap *words in asterisks* for gold italic serif font"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Featured *Pieces*"
              />
            </Field>
          </div>
        </div>

        <div className="hok-feat-mirror-box">
          <span className="hok-feat-mirror-label">Live Storefront Heading Preview</span>
          <ReadsAsMirror
            eyebrow={settings.eyebrow}
            heading={settings.heading}
            className="hok-feat-reads-as"
          />
        </div>

        <div className="hok-divider" />

        <div className="hok-feat-viewall-grid">
          <Field
            label='"View all" Link Text'
            hint="Visible button or link label"
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
              placeholder="/rent/all"
            />
          </Field>
        </div>
      </Card>

      {/* Card 2: Slots Deck & Inspector */}
      <Card
        header={{
          eyebrow: 'SLOTS & PIECES',
          title: 'Primary Featured Slots',
          meta: `${settings.slots.length} of ${settings.cap || 8} slots filled · 4-across deck`,
          actions: settings.slots.length < (settings.cap || 8) ? (
            <button
              type="button"
              className="hok-feat-add-slot-btn"
              onClick={handleAddSlot}
            >
              <PlusIcon size={11} /> Add Slot
            </button>
          ) : undefined
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Each slot renders a full piece card on the storefront. Click a slot below to edit its SKU, choose preferred photo shot, or select from the catalogue.
        </p>

        <div id="featured-slots" className="hok-feat-deck-wrapper">
          <Deck
            arrangement="d4"
            items={slotDeckItems}
            selectedIndex={selectedSlotIndex}
            onSelect={(idx) => setSelectedSlotIndex(idx)}
            renderCustomContent={(item, idx) => {
              const sku = settings.slots[idx];
              const piece = getPieceBySku(sku);
              const shot = settings.shots[sku] || 'On model';
              return (
                <div className="hok-feat-slot-tile">
                  <div className="hok-feat-slot-num">SLOT {idx + 1}</div>
                  <PieceCard
                    sku={sku}
                    piece={piece}
                    onOpenPiece={() => {
                      if (onNavigateToModule) onNavigateToModule('Products');
                    }}
                  />
                  <div className="hok-feat-slot-shot-tag">
                    Shot: <strong>{shot}</strong>
                  </div>
                </div>
              );
            }}
          />

          {selectedSku && selectedSlotIndex !== null && (
            <Inspector
              title={`Edit Slot ${selectedSlotIndex + 1}: ${selectedSku}`}
              position={selectedSlotIndex + 1}
              totalItems={settings.slots.length}
              onClose={() => setSelectedSlotIndex(null)}
              onMoveUp={selectedSlotIndex > 0 ? () => handleMoveSlot(selectedSlotIndex, 'up') : undefined}
              onMoveDown={
                selectedSlotIndex < settings.slots.length - 1
                  ? () => handleMoveSlot(selectedSlotIndex, 'down')
                  : undefined
              }
            >
              <div className="hok-feat-inspector-content">
                <Field
                  label="Piece SKU"
                  hint="Type SKU directly or browse catalogue"
                >
                  <div className="hok-feat-sku-input-row">
                    <input
                      type="text"
                      className="hok-input hok-feat-sku-input"
                      value={selectedSku}
                      onChange={(e) => handleUpdateSku(selectedSlotIndex, e.target.value)}
                      placeholder="e.g. HOK-SAB-002"
                    />
                    <button
                      type="button"
                      className="hok-feat-browse-cat-btn"
                      onClick={() => setIsCataloguePickerOpen(true)}
                    >
                      <SearchMagnifierIcon size={12} /> Browse
                    </button>
                  </div>
                </Field>

                <div className="hok-feat-live-preview-box">
                  <span className="hok-feat-preview-label">Live Piece Snapshot</span>
                  <PieceCard
                    sku={selectedSku}
                    piece={selectedPiece}
                    onOpenPiece={() => {
                      if (onNavigateToModule) onNavigateToModule('Products');
                    }}
                  />
                </div>

                <Field
                  label="Preferred Shot / Angle"
                  hint="Storefront product image preference"
                >
                  <PillToggle
                    options={SHOT_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
                    value={currentShot}
                    onChange={(val) => handleUpdateShot(selectedSku, String(val))}
                  />
                </Field>

                <div className="hok-feat-inspector-actions">
                  <button
                    type="button"
                    className="hok-feat-remove-btn"
                    onClick={() => handleRemoveSlot(selectedSlotIndex)}
                  >
                    Remove this slot
                  </button>
                </div>
              </div>
            </Inspector>
          )}
        </div>
      </Card>

      {/* Card 3: Inventory & Top-up Rules */}
      <Card
        header={{
          eyebrow: 'INVENTORY & STOREFRONT BEHAVIOUR',
          title: 'Display Cap & Automatic Top-up',
          meta: 'Controls row distribution and fallback population'
        }}
      >
        <div className="hok-feat-rules-grid">
          <Field
            label="Maximum Pieces (Cap)"
            hint="Storefront ceiling (1 to 8 pieces)"
          >
            <input
              type="number"
              min={1}
              max={8}
              className="hok-input"
              value={settings.cap || 8}
              onChange={(e) =>
                onChange({ ...settings, cap: Math.min(8, Math.max(1, parseInt(e.target.value) || 8)) })
              }
            />
          </Field>

          <Field
            label="Desktop Per Row"
            hint="Columns on desktop view"
          >
            <PillToggle
              options={[
                { label: '3 Across', value: 3 },
                { label: '4 Across', value: 4 },
                { label: '6 Across', value: 6 }
              ]}
              value={settings.perRow || 4}
              onChange={(val) => onChange({ ...settings, perRow: Number(val) })}
            />
          </Field>

          <Field
            label="Mobile Per Row"
            hint="Columns on mobile view"
          >
            <PillToggle
              options={[
                { label: '1 Column', value: 1 },
                { label: '2 Columns', value: 2 }
              ]}
              value={settings.perRowMob || 2}
              onChange={(val) => onChange({ ...settings, perRowMob: Number(val) })}
            />
          </Field>
        </div>

        <div className="hok-divider" />

        <div id="featured-topup" className="hok-feat-topup-grid">
          <Field
            label="Top-up Mode"
            hint="Automatically backfill empty or out-of-stock slots"
          >
            <PillToggle
              options={[
                { label: 'Off', value: 'Off' },
                { label: 'Top up automatically', value: 'Top up automatically' }
              ]}
              value={settings.topUp}
              onChange={(val) =>
                onChange({ ...settings, topUp: val as 'Off' | 'Top up automatically' })
              }
            />
          </Field>

          {settings.topUp === 'Top up automatically' && (
            <Field
              label="Top-up Sort Strategy"
              hint="Rule for selecting backfill pieces"
            >
              <PillToggle
                options={[
                  { label: 'Newest live', value: 'Newest live' },
                  { label: 'Most rented', value: 'Most rented' },
                  { label: 'Highest rated', value: 'Highest rated' }
                ]}
                value={settings.topUpBy}
                onChange={(val) =>
                  onChange({
                    ...settings,
                    topUpBy: val as 'Newest live' | 'Most rented' | 'Highest rated'
                  })
                }
              />
            </Field>
          )}
        </div>
      </Card>

      {/* Card 4: Customer Tile Toggles */}
      <Card
        header={{
          eyebrow: 'PRODUCT CARD VISIBILITY',
          title: 'Storefront Tile Elements',
          meta: 'Toggle specific micro-elements on the customer-facing card'
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Control which auxiliary badges, actions, and price comparison lines render on each piece tile.
        </p>

        <div className="hok-feat-toggles-grid">
          <div className="hok-feat-toggle-item">
            <div className="hok-feat-toggle-info">
              <span className="hok-feat-toggle-title">Mode Badge</span>
              <span className="hok-feat-toggle-sub">Shows "Rental", "Preloved", or "Rental & Preloved" pill</span>
            </div>
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.showModeBadge}
              onChange={(val) => onChange({ ...settings, showModeBadge: Boolean(val) })}
            />
          </div>

          <div className="hok-feat-toggle-item">
            <div className="hok-feat-toggle-info">
              <span className="hok-feat-toggle-title">Wishlist Button</span>
              <span className="hok-feat-toggle-sub">Heart icon at the top right of each tile</span>
            </div>
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.showWishlist}
              onChange={(val) => onChange({ ...settings, showWishlist: Boolean(val) })}
            />
          </div>

          <div className="hok-feat-toggle-item">
            <div className="hok-feat-toggle-info">
              <span className="hok-feat-toggle-title">"Was" / Retail Comparison Price</span>
              <span className="hok-feat-toggle-sub">Original retail MRP with strike-through</span>
            </div>
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.showWasPrice}
              onChange={(val) => onChange({ ...settings, showWasPrice: Boolean(val) })}
            />
          </div>

          <div className="hok-feat-toggle-item">
            <div className="hok-feat-toggle-info">
              <span className="hok-feat-toggle-title">Rental Duration Pill</span>
              <span className="hok-feat-toggle-sub">Displays standard 3-day / 7-day duration note</span>
            </div>
            <PillToggle
              options={[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]}
              value={settings.showDuration}
              onChange={(val) => onChange({ ...settings, showDuration: Boolean(val) })}
            />
          </div>
        </div>
      </Card>

      {/* Catalogue Picker Modal */}
      {isCataloguePickerOpen && (
        <div className="hok-modal-overlay" onClick={() => setIsCataloguePickerOpen(false)}>
          <div className="hok-feat-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hok-feat-modal-header">
              <div>
                <h3 className="hok-feat-modal-title">Select Piece from Catalogue</h3>
                <p className="hok-feat-modal-sub">
                  Assigning to Slot {selectedSlotIndex !== null ? selectedSlotIndex + 1 : ''}
                </p>
              </div>
              <button
                type="button"
                className="hok-feat-modal-close-btn"
                onClick={() => setIsCataloguePickerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="hok-feat-modal-search">
              <SearchMagnifierIcon size={14} className="hok-feat-modal-search-icon" />
              <input
                type="text"
                className="hok-input hok-feat-modal-search-input"
                placeholder="Search by SKU, piece name, designer, or category..."
                value={catalogueSearchQuery}
                onChange={(e) => setCatalogueSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="hok-feat-modal-list">
              {filteredCataloguePieces.map((p) => {
                const isCurrent = p.sku === selectedSku;
                return (
                  <div
                    key={p.sku}
                    className={`hok-feat-modal-item ${isCurrent ? 'is-selected' : ''}`}
                    onClick={() => {
                      if (selectedSlotIndex !== null) {
                        handleUpdateSku(selectedSlotIndex, p.sku);
                      }
                      setIsCataloguePickerOpen(false);
                    }}
                  >
                    <div className="hok-feat-modal-item-left">
                      <PieceCard sku={p.sku} piece={p} />
                    </div>
                    <button type="button" className="hok-feat-modal-select-btn">
                      {isCurrent ? 'Current' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
