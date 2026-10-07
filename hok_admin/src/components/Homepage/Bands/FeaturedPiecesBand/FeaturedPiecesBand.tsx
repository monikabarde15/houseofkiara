/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · FEATURED PIECES BAND
   Spec Section 8.3 & 12.4, 12.5 (v213)
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
import { SAMPLE_CATALOGUE_PIECES } from '../../data/cataloguePieces';
import { DoorArrowIcon, SearchMagnifierIcon, PlusIcon } from '../../shared/icons/HomepageIcons';

interface FeaturedPiecesBandProps {
  settings: FeaturedPiecesSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: FeaturedPiecesSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

const SHOT_OPTIONS = [
  { id: 'On model', label: 'On model' },
  { id: 'Flat lay', label: 'Flat lay' },
  { id: 'Ghost mannequin', label: 'Ghost mannequin' },
  { id: 'Detail shot', label: 'Detail shot' }
];

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
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerDesigner, setPickerDesigner] = useState('All');
  const [pickerMode, setPickerMode] = useState('All');

  const slots = settings.slots || [];
  const maxSlots = settings.cap || 8;

  // Find piece in catalogue
  const getPieceBySku = (sku: string) => {
    return SAMPLE_CATALOGUE_PIECES.find((p) => p.sku === sku) || null;
  };

  // Build deck items for Deck component
  const deckItems: DeckTileItem[] = slots.map((sku, idx) => {
    const piece = getPieceBySku(sku);
    const shot = settings.shots[sku] || 'On model';
    return {
      id: `feat-slot-${sku}-${idx}`,
      position: idx + 1,
      title: piece ? piece.name : sku,
      sub: piece ? piece.designer : 'Not in catalogue',
      pictureUrl: piece?.imageUrl || undefined,
      pictureHeight: 150,
      cornerFlag: piece
        ? {
            type: piece.status === 'Live' ? 'status' : 'need',
            label: piece.status === 'Live' ? 'LIVE' : piece.status.toUpperCase()
          }
        : { type: 'need', label: 'MISSING' },
      dimmed: piece ? piece.status !== 'Live' : true
    };
  });

  const selectedSku =
    selectedSlotIndex !== null && selectedSlotIndex < slots.length
      ? slots[selectedSlotIndex]
      : null;

  const selectedPiece = selectedSku ? getPieceBySku(selectedSku) : null;
  const currentShot = selectedSku ? settings.shots[selectedSku] || 'On model' : 'On model';

  const handleMoveSlot = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
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
    if (selectedSlotIndex === index) {
      setSelectedSlotIndex(null);
    } else if (selectedSlotIndex !== null && selectedSlotIndex > index) {
      setSelectedSlotIndex(selectedSlotIndex - 1);
    }
  };

  const handleTogglePieceInCatalogue = (sku: string) => {
    if (slots.includes(sku)) {
      handleRemoveSlot(slots.indexOf(sku));
    } else {
      if (slots.length >= maxSlots) return;
      const updated = [...slots, sku];
      onChange({ ...settings, slots: updated });
      setSelectedSlotIndex(updated.length - 1);
    }
  };

  const handleSetShot = (shot: string) => {
    if (!selectedSku) return;
    onChange({
      ...settings,
      shots: {
        ...settings.shots,
        [selectedSku]: shot
      }
    });
  };

  // Filter catalogue pieces for picker
  const filteredCatalogue = SAMPLE_CATALOGUE_PIECES.filter((p) => {
    if (pickerDesigner !== 'All' && p.designer !== pickerDesigner) return false;
    const pMode = p.mode || '';
    if (pickerMode !== 'All' && !pMode.toLowerCase().includes(pickerMode.toLowerCase())) return false;
    if (pickerSearch.trim()) {
      const q = pickerSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.designer.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const uniqueDesigners = Array.from(new Set(SAMPLE_CATALOGUE_PIECES.map((p) => p.designer)));

  return (
    <div className="hok-featured-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">Featured Pieces</h2>
        <span className="hok-hp-editor-band-counter">Band 3 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        Hand-picked pieces from the catalogue. Each slot holds a real SKU and reads its status back, so a sold piece cannot sit here unnoticed.
      </p>

      {/* 7.1 Visibility Row */}
      <div className="hok-hp-visibility-row" id="featured-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
        </div>
        <span className="hok-hp-visibility-consequence">
          {isShown
            ? 'Showing on the live homepage, in position 3.'
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

      {/* Card 1 — The words (Spec 8.3.1) */}
      <Card
        id="featured-words-card"
        title="The words"
      >
        <div className="hok-feat-field-stack">
          <div id="featured-eyebrow">
            <Field label="Eyebrow">
              <input
                type="text"
                className="hok-field-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Handpicked for You"
              />
            </Field>
          </div>

          <div id="featured-heading">
            <Field
              label="Heading"
              hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
            >
              <textarea
                className="hok-field-textarea"
                rows={2}
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Featured *Pieces*"
              />
            </Field>
            <ReadsAsMirror text={settings.heading} />
          </div>

          <div className="hok-feat-grid-2col">
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
                placeholder="/rent/all"
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Card 2 — The pieces (Spec 8.3.2) */}
      <div id="featured-slots">
        <Card
          title="The pieces"
          sub="Each slot holds a real SKU. The picture, designer, size, prices and status shown here are all read from the piece record — nothing about a piece is typed into the homepage."
        >
          <div className="hok-feat-deck-wrapper">
            <Deck
              arrangement="d4"
              items={deckItems}
              selectedIndex={selectedSlotIndex}
              onSelectIndex={setSelectedSlotIndex}
              onMoveEarlier={(idx) => handleMoveSlot(idx, 'up')}
              onMoveLater={(idx) => handleMoveSlot(idx, 'down')}
              onRemove={handleRemoveSlot}
              removeLabel="Remove"
              onAddTile={() => setIsCataloguePickerOpen(true)}
              addLabel="Add a piece"
              addCountText={`${maxSlots - slots.length} slots free`}
              maxReached={slots.length >= maxSlots}
            />

            {/* Below deck button and status line */}
            <div className="hok-feat-deck-footer">
              <button
                type="button"
                className="hok-feat-open-picker-btn"
                onClick={() => setIsCataloguePickerOpen(!isCataloguePickerOpen)}
              >
                <PlusIcon size={12} /> Choose pieces from the catalogue
              </button>
              <span className="hok-feat-live-count-note">
                5 pieces are Live and can go on the homepage today.
              </span>
            </div>

            {/* Catalogue Picker Dropdown / Modal (Spec 12.8) */}
            {isCataloguePickerOpen && (
              <div className="hok-feat-catalogue-picker-box">
                <div className="hok-feat-picker-header">
                  <span className="hok-feat-picker-title">Live pieces</span>
                  <span className="hok-feat-picker-sub">Select from active inventory</span>
                </div>

                <div className="hok-feat-picker-filter-bar">
                  <div className="hok-feat-search-wrap">
                    <SearchMagnifierIcon size={12} />
                    <input
                      type="text"
                      className="hok-feat-picker-search"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="Search by piece, designer, category or SKU"
                    />
                  </div>

                  <select
                    className="hok-field-select"
                    value={pickerDesigner}
                    onChange={(e) => setPickerDesigner(e.target.value)}
                  >
                    <option value="All">All designers</option>
                    {uniqueDesigners.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    className="hok-field-select"
                    value={pickerMode}
                    onChange={(e) => setPickerMode(e.target.value)}
                  >
                    <option value="All">All modes</option>
                    <option value="Rental">Rental</option>
                    <option value="Preloved">Preloved</option>
                    <option value="New">New</option>
                  </select>
                </div>

                <div className="hok-feat-picker-grid">
                  {filteredCatalogue.length > 0 ? (
                    filteredCatalogue.map((piece) => {
                      const isAssigned = slots.includes(piece.sku);
                      const isFull = slots.length >= maxSlots;
                      const isDisabled = isFull && !isAssigned;

                      return (
                        <div
                          key={piece.sku}
                          className={`hok-feat-picker-tile ${isAssigned ? 'is-selected' : ''}`}
                          style={{
                            opacity: isDisabled ? 0.4 : 1,
                            pointerEvents: isDisabled ? 'none' : 'auto',
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleTogglePieceInCatalogue(piece.sku)}
                        >
                          <div
                            className="hok-feat-picker-img"
                            style={{
                              backgroundImage: piece.imageUrl ? `url(${piece.imageUrl})` : undefined
                            }}
                          />
                          <div className="hok-feat-picker-info">
                            <span className="hok-feat-picker-name">{piece.name}</span>
                            <span className="hok-feat-picker-designer">{piece.designer}</span>
                            <span className="hok-feat-picker-price">
                              Rent ₹{piece.priceStd ? piece.priceStd.toLocaleString('en-IN') : '—'}
                            </span>
                          </div>
                          {isAssigned && (
                            <div className="hok-feat-picker-tag">ON THE HOMEPAGE</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="hok-feat-picker-empty">
                      <em>No live piece matches that.</em>
                    </div>
                  )}
                </div>

                <div className="hok-feat-picker-foot">
                  <span>
                    {slots.length >= maxSlots
                      ? 'All 8 slots are in use. Remove a piece from the deck to add another.'
                      : 'Only Live pieces appear here — a draft, paused or sold piece cannot go on the homepage.'}
                  </span>
                </div>
              </div>
            )}

            {/* Inspector for selected piece */}
            <Inspector
              kicker={`POSITION ${selectedSlotIndex !== null ? selectedSlotIndex + 1 : 1}`}
              itemName={selectedPiece ? selectedPiece.name : selectedSku || undefined}
              isOpen={selectedSlotIndex !== null && !!selectedSku}
              emptyText="Pick a piece above to see its catalogue record and choose which photograph fronts the tile."
            >
              {selectedSku && (
                <div className="hok-feat-inspector-content">
                  {selectedPiece ? (
                    <>
                      {/* Photo Selector */}
                      <div className="hok-feat-shot-selector">
                        <label className="hok-field-label">Which photograph fronts this tile</label>
                        <p className="hok-field-hint" style={{ marginTop: 2, marginBottom: 8 }}>
                          Taken from the piece’s own gallery. The product page leads with its primary photograph, which is often a full-front view — a detail or an on-model shot can read better in a row.
                        </p>

                        <div className="hok-feat-shot-swatches">
                          {SHOT_OPTIONS.map((shot) => {
                            const isChosen = currentShot === shot.id;
                            return (
                              <button
                                key={shot.id}
                                type="button"
                                className={`hok-feat-shot-btn ${isChosen ? 'is-chosen' : ''}`}
                                onClick={() => handleSetShot(shot.id)}
                              >
                                {shot.label}
                              </button>
                            );
                          })}
                        </div>
                        <p className="hok-field-hint" style={{ marginTop: 6 }}>
                          Showing {currentShot}. Clicking the one already chosen returns the tile to the primary photograph.
                        </p>
                      </div>

                      {/* Read-back Specs Row */}
                      <div className="hok-feat-piece-readback">
                        <div className="hok-feat-rb-row">
                          <span className="hok-feat-rb-lbl">Designer</span>
                          <span className="hok-feat-rb-val">{selectedPiece.designer}</span>
                        </div>
                        <div className="hok-feat-rb-row">
                          <span className="hok-feat-rb-lbl">Mode</span>
                          <span className="hok-feat-rb-val">{selectedPiece.mode || 'Rental/Preloved'}</span>
                        </div>
                        <div className="hok-feat-rb-row">
                          <span className="hok-feat-rb-lbl">Status</span>
                          <span className={`hok-feat-rb-pill is-${selectedPiece.status.toLowerCase()}`}>
                            {selectedPiece.status}
                          </span>
                        </div>
                        <div className="hok-feat-rb-row">
                          <span className="hok-feat-rb-lbl">Price shown</span>
                          <span className="hok-feat-rb-val">
                            {selectedPiece.priceStd ? `Rent ₹${selectedPiece.priceStd.toLocaleString('en-IN')} / ${selectedPiece.minDays || 3} days · ` : ''}
                            Buy ₹{(selectedPiece.resalePrice || selectedPiece.mrp || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Inline Replace with for non-Live piece (Spec 12.4) */}
                      {selectedPiece.status !== 'Live' && (
                        <div className="hok-feat-inline-replace" style={{ marginTop: 10 }}>
                          <Field label="Replace with" hint="Select a Live piece from the catalogue to replace this non-shoppable slot.">
                            <select
                              className="hok-field-select"
                              onChange={(e) => {
                                if (e.target.value) {
                                  const updated = [...slots];
                                  updated[selectedSlotIndex!] = e.target.value;
                                  onChange({ ...settings, slots: updated });
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="">— choose replacement piece —</option>
                              {SAMPLE_CATALOGUE_PIECES.filter((p) => p.status === 'Live').map((p) => (
                                <option key={p.sku} value={p.sku}>
                                  {p.name} · {p.designer}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      )}

                      {onNavigateToModule && (
                        <button
                          type="button"
                          className="hok-feat-open-piece-btn"
                          onClick={() => onNavigateToModule('Products')}
                        >
                          Open piece <DoorArrowIcon size={10} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="hok-feat-unresolved-sku">
                      <p style={{ color: 'var(--terra)', margin: 0, fontStyle: 'italic' }}>
                        Not in the catalogue — this tile will not render.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Inspector>

            {/* Capacity & customer row note below inspector (Spec 8.3.2) */}
            <div className="hok-feat-capacity-note" style={{ marginTop: 10, fontSize: '10.5px', color: 'var(--muted)', fontStyle: 'italic' }}>
              {slots.length} of {maxSlots} slots used. The deck above matches the customer row — {settings.perRow} across on desktop, {settings.perRowMob} in the app.
            </div>
          </div>
        </Card>
      </div>

      {/* Card 3 — When a piece sells (Spec 8.3.3 & 12.5) */}
      <div id="featured-topup">
        <Card
          title="When a piece sells"
          sub="A hand-picked grid empties itself over time. This decides what happens when it does."
        >
          <div className="hok-feat-field-stack">
            <Field
              label="If a slot stops being shoppable"
              hint={
                settings.topUp === 'Top up automatically'
                  ? 'The gap is filled from the catalogue, so the row always looks complete.'
                  : 'The tile is dropped and the row renders short until somebody notices.'
              }
            >
              <select
                className="hok-field-select"
                value={settings.topUp}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    topUp: e.target.value as 'Off' | 'Top up automatically'
                  })
                }
              >
                <option value="Off">Off</option>
                <option value="Top up automatically">Top up automatically</option>
              </select>
            </Field>

            {settings.topUp === 'Top up automatically' && (
              <Field
                label="Fill the gap with"
                hint="Only Live pieces are ever pulled in."
              >
                <select
                  className="hok-field-select"
                  value={settings.topUpBy}
                  onChange={(e) => onChange({ ...settings, topUpBy: e.target.value })}
                >
                  <option value="Newest live">Newest live</option>
                  <option value="Most rented">Most rented</option>
                  <option value="Highest rated">Highest rated</option>
                </select>
              </Field>
            )}

            <div className="hok-feat-grid-2col">
              <Field label="Cards per row — desktop">
                <input
                  type="number"
                  className="hok-field-input"
                  value={settings.perRow}
                  onChange={(e) =>
                    onChange({ ...settings, perRow: Number(e.target.value) || 4 })
                  }
                />
              </Field>

              <Field label="Cards per row — mobile">
                <input
                  type="number"
                  className="hok-field-input"
                  value={settings.perRowMob}
                  onChange={(e) =>
                    onChange({ ...settings, perRowMob: Number(e.target.value) || 2 })
                  }
                />
              </Field>
            </div>
          </div>
        </Card>
      </div>

      {/* Card 4 — What the customer tile carries (Spec 8.3.4) */}
      <Card
        title="What the customer tile carries"
        sub="Besides the photograph. All four are read from the piece record — these decide only whether they are drawn."
      >
        <div className="hok-feat-toggles-stack">
          <PillToggle
            checked={settings.showModeBadge}
            onChange={(checked) => onChange({ ...settings, showModeBadge: checked })}
            label="Mode badge over the picture"
            hint="RENT, PRELOVED or NEW, taken from the piece’s mode. Rent renders on charcoal, Preloved on terracotta, New on sage."
          />

          <PillToggle
            checked={settings.showWishlist}
            onChange={(checked) => onChange({ ...settings, showWishlist: checked })}
            label="Wishlist heart"
            hint="Top right of the picture. Adds the piece to a shopper’s wishlist without opening it."
          />

          <PillToggle
            checked={settings.showWasPrice}
            onChange={(checked) => onChange({ ...settings, showWasPrice: checked })}
            label="Struck-through retail price"
            hint="The piece’s retail price beside what HOK charges, struck through. It is what makes the saving legible, and it comes from the record — it cannot be written here."
          />

          <PillToggle
            checked={settings.showDuration}
            onChange={(checked) => onChange({ ...settings, showDuration: checked })}
            label="Rental duration beside the price"
            hint="Reads as “₹12,000 / 4 days”. Drawn only on a piece that can be rented; the number of days is the piece’s own minimum term."
          />
        </div>
      </Card>
    </div>
  );
};
