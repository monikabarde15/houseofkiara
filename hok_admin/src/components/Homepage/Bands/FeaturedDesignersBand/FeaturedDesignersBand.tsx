/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · FEATURED DESIGNERS (Spec 8.7)
   Spec Section 8.7 (v213)
========================================================= */

import React, { useState } from 'react';
import './FeaturedDesignersBand.css';
import { DesignersSettings, HealthIssue } from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';
import { DoorArrowIcon } from '../../shared/icons/HomepageIcons';

interface FeaturedDesignersBandProps {
  settings: DesignersSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: DesignersSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

// Master Designers data registry (derived from Designers module)
const ALL_MASTER_DESIGNERS = [
  { id: 'sabyasachi', name: 'Sabyasachi', type: 'Couture House', city: 'Kolkata, India', livePieces: 3, initials: 'SB', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80' },
  { id: 'manish-malhotra', name: 'Manish Malhotra', type: 'Couture House', city: 'Mumbai, India', livePieces: 0, initials: 'MM', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'tarun-tahiliani', name: 'Tarun Tahiliani', type: 'Couture House', city: 'New Delhi, India', livePieces: 1, initials: 'TT', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'anita-dongre', name: 'Anita Dongre', type: 'Couture House', city: 'Mumbai, India', livePieces: 1, initials: 'AD', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { id: 'raw-mango', name: 'Raw Mango', type: 'Contemporary Label', city: 'New Delhi, India', livePieces: 0, initials: 'RM', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 'abu-jani-sandeep', name: 'Abu Jani Sandeep', type: 'Couture House', city: 'Mumbai, India', livePieces: 0, initials: 'AJ', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
  { id: 'torani', name: 'Torani', type: 'Contemporary Label', city: 'New Delhi, India', livePieces: 0, initials: 'TR', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { id: 'ekaya', name: 'Ekaya', type: 'Heritage Weave', city: 'New Delhi, India', livePieces: 0, initials: 'EK', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80' },
  { id: 'papa-dont-preach', name: "Papa Don't Preach", type: 'Contemporary Label', city: 'Mumbai, India', livePieces: 0, initials: 'PD', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80' },
  { id: 'rahul-mishra', name: 'Rahul Mishra', type: 'Couture House', city: 'New Delhi, India', livePieces: 0, initials: 'RM', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
  { id: 'rimzim-dadu', name: 'Rimzim Dadu', type: 'Contemporary Label', city: 'New Delhi, India', livePieces: 0, initials: 'RD', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80' }
];

const DEFAULT_SLOTS = [
  'sabyasachi',
  'manish-malhotra',
  'tarun-tahiliani',
  'anita-dongre',
  'raw-mango',
  'abu-jani-sandeep',
  'torani'
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
  const [showAddPanel, setShowAddPanel] = useState<boolean>(false);

  const slots = settings.slots && settings.slots.length > 0 ? settings.slots : DEFAULT_SLOTS;
  const cap = settings.cap || 6;
  const unfeaturedDesigners = ALL_MASTER_DESIGNERS.filter((d) => !slots.includes(d.id));

  // Deck items
  const deckItems: DeckTileItem[] = slots.map((designerId, idx) => {
    const master = ALL_MASTER_DESIGNERS.find((m) => m.id === designerId);
    const displayName = master?.name || designerId;
    const pieces = master?.livePieces ?? 0;
    const isPastCut = idx >= cap;

    let flag: { type: 'need' | 'off'; label: string } | undefined;
    if (isPastCut) {
      flag = { type: 'off', label: 'PAST THE CUT' };
    } else if (pieces === 0) {
      flag = { type: 'need', label: 'NOTHING LIVE' };
    }

    return {
      id: `designer-slot-${designerId}-${idx}`,
      position: idx + 1,
      title: displayName,
      sub: `${pieces} live pieces`,
      pictureUrl: master?.img,
      pictureHeight: 108,
      cornerFlag: flag,
      dimmed: isPastCut || pieces === 0
    };
  });

  const selectedDesignerId =
    selectedSlotIndex !== null && selectedSlotIndex < slots.length
      ? slots[selectedSlotIndex]
      : null;

  const selectedMaster = selectedDesignerId
    ? ALL_MASTER_DESIGNERS.find((m) => m.id === selectedDesignerId)
    : null;

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

  const handleAddDesigner = (designerId: string) => {
    if (slots.length >= 8) return;
    const updated = [...slots, designerId];
    onChange({ ...settings, slots: updated });
    setSelectedSlotIndex(updated.length - 1);
  };

  return (
    <div className="hok-designers-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">Featured Designers</h2>
        <span className="hok-hp-editor-band-counter">Band 7 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        Who appears is decided on the designer’s own profile. The band around them — heading, layout, button wording — is decided here.
      </p>

      {/* 7.1 Visibility Row */}
      <div className="hok-hp-visibility-row" id="designers-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
        </div>
        <span className="hok-hp-visibility-consequence">
          {isShown
            ? 'Showing on the live homepage, in position 7.'
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

      {/* Card 1 — The words (Spec 8.7.1) */}
      <Card
        id="designers-words-card"
        title="The words"
      >
        <div className="hok-des-field-stack">
          <div id="designers-eyebrow">
            <Field label="Eyebrow">
              <input
                type="text"
                className="hok-field-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Trusted Creators"
              />
            </Field>
          </div>

          <div id="designers-heading">
            <Field
              label="Heading"
              hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
            >
              <textarea
                className="hok-field-textarea"
                rows={2}
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Featured *Designers*"
              />
            </Field>
            <ReadsAsMirror text={settings.heading} />
          </div>

          <div className="hok-des-grid-2col">
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
                placeholder="All Designers →"
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
                placeholder="/designers"
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Card 2 — The designers (Spec 8.7.2) */}
      <Card
        title="The designers"
        sub="Six across, the grid the homepage draws. Portraits are read from each designer’s record."
        doorLabel="Open Designers"
        onDoorClick={() => onNavigateToModule && onNavigateToModule('Designers')}
      >
        <div className="hok-des-deck-wrapper">
          <Deck
            arrangement="d6"
            items={deckItems}
            selectedIndex={selectedSlotIndex}
            onSelectIndex={setSelectedSlotIndex}
            onMoveEarlier={(idx) => handleMoveSlot(idx, 'up')}
            onMoveLater={(idx) => handleMoveSlot(idx, 'down')}
            onRemove={handleRemoveSlot}
            removeLabel="Take off"
            onAddTile={() => setShowAddPanel(!showAddPanel)}
            addLabel="Add a designer"
            addCountText={`${unfeaturedDesigners.length} not on the homepage`}
            maxReached={slots.length >= 8}
          />

          {/* Screen 13: Designers not on the homepage panel */}
          {showAddPanel && (
            <div className="hok-des-not-homepage-panel">
              <div className="hok-des-panel-header">
                <span className="hok-des-panel-title">Designers not on the homepage</span>
                <div className="hok-des-panel-actions">
                  <span className="hok-des-available-count">{unfeaturedDesigners.length} available</span>
                  <button
                    type="button"
                    className="hok-des-done-btn"
                    onClick={() => setShowAddPanel(false)}
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="hok-des-available-grid">
                {unfeaturedDesigners.map((designer) => (
                  <div key={designer.id} className="hok-des-available-card">
                    <div
                      className="hok-des-available-portrait"
                      style={{
                        backgroundImage: designer.img ? `url(${designer.img})` : undefined
                      }}
                    >
                      {!designer.img && <span>{designer.initials}</span>}
                    </div>
                    <div className="hok-des-available-info">
                      <h4 className="hok-des-available-name">{designer.name}</h4>
                      <p className="hok-des-available-sub">
                        {designer.livePieces} live · {designer.type}
                      </p>
                      <button
                        type="button"
                        className="hok-des-add-btn"
                        onClick={() => handleAddDesigner(designer.id)}
                      >
                        Add to homepage
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hok-des-panel-footer-note">
                Adding one here sets the Featured switch on that designer’s own record — one switch, two doors. Only active designers appear.
              </div>
            </div>
          )}

          {/* Inspector */}
          <Inspector
            kicker={`POSITION ${selectedSlotIndex !== null ? selectedSlotIndex + 1 : 1}`}
            itemName={selectedMaster?.name || selectedDesignerId || undefined}
            isOpen={selectedSlotIndex !== null && !!selectedMaster}
            emptyText="Pick a designer above to see their profile details and inventory count."
          >
            {selectedMaster && (
              <div className="hok-des-inspector-content">
                <div className="hok-des-inspector-main">
                  {/* Left: 2:3 Portrait */}
                  <div
                    className="hok-des-inspector-portrait"
                    style={{
                      backgroundImage: selectedMaster.img ? `url(${selectedMaster.img})` : undefined
                    }}
                  >
                    {!selectedMaster.img && <span>{selectedMaster.initials}</span>}
                  </div>

                  {/* Right Details */}
                  <div className="hok-des-inspector-details">
                    <h4 className="hok-des-portrait-heading">Portrait</h4>
                    <p className="hok-des-portrait-sub">
                      Portrait, 2:3. The name, the piece count and the button sit over the bottom of it on the customer card, so keep that area quiet.
                    </p>
                    <p className="hok-des-alt-text">
                      Alt text on the record reads “{selectedMaster.name} — Designer Indian bridal and occasion wear on House of Kaira”.
                    </p>

                    <div className="hok-des-props-table">
                      <div className="hok-des-prop-row">
                        <span className="hok-des-prop-label">Type</span>
                        <span className="hok-des-prop-val">{selectedMaster.type}</span>
                      </div>
                      <div className="hok-des-prop-row">
                        <span className="hok-des-prop-label">City</span>
                        <span className="hok-des-prop-val">{selectedMaster.city}</span>
                      </div>
                      <div className="hok-des-prop-row">
                        <span className="hok-des-prop-label">Live pieces</span>
                        <span className="hok-des-prop-val">{selectedMaster.livePieces}</span>
                      </div>
                      <div className="hok-des-prop-row">
                        <span className="hok-des-prop-label">Card reads</span>
                        <span className="hok-des-prop-val">
                          {selectedMaster.name} · {selectedMaster.livePieces} PIECES
                        </span>
                      </div>
                    </div>

                    <div className="hok-des-inspector-doors">
                      {onNavigateToModule && (
                        <>
                          <button
                            type="button"
                            className="hok-des-door-btn"
                            onClick={() => onNavigateToModule('Designers')}
                          >
                            Open designer <DoorArrowIcon size={9} />
                          </button>
                          <button
                            type="button"
                            className="hok-des-door-btn"
                            onClick={() => onNavigateToModule('Products')}
                          >
                            See their pieces <DoorArrowIcon size={9} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="hok-des-meta-note">
                  The portrait, the bio and the name belong to the designer record. Whether they appear here, and in what order, is the Featured switch on that same record — the buttons on the tile above write to it.
                </div>
              </div>
            )}
          </Inspector>
        </div>
      </Card>

      {/* Card 3 — Layout (Spec 8.7.3) */}
      <Card title="Layout">
        <div className="hok-des-field-stack">
          {/* Row 1: Desktop & App selects */}
          <div className="hok-des-grid-2col">
            <Field
              label="Desktop"
              hint="Six across today."
            >
              <select
                className="hok-field-select"
                value={settings.layout}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    layout: e.target.value as 'Grid' | 'Carousel'
                  })
                }
              >
                <option value="Grid">Grid</option>
                <option value="Carousel">Carousel</option>
              </select>
            </Field>

            <Field
              label="App"
              hint="Full-height slides with dots, as the app ships."
            >
              <select
                className="hok-field-select"
                value={settings.layoutMob}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    layoutMob: e.target.value as 'Carousel' | 'Grid'
                  })
                }
              >
                <option value="Carousel">Carousel</option>
                <option value="Grid">Grid</option>
              </select>
            </Field>
          </div>

          {/* Row 2: How many to show & Button wording */}
          <div className="hok-des-grid-2col">
            <Field
              label="How many to show"
              hint={`${slots.length} are featured — the last ${Math.max(0, slots.length - cap)} will not appear.`}
            >
              <input
                type="number"
                className="hok-field-input"
                value={settings.cap || 6}
                onChange={(e) =>
                  onChange({ ...settings, cap: Number(e.target.value) || 6 })
                }
              />
            </Field>

            <Field label="Button wording">
              <input
                type="text"
                className="hok-field-input"
                value={settings.ctaLbl}
                onChange={(e) => onChange({ ...settings, ctaLbl: e.target.value })}
                placeholder="Shop the Collection"
              />
            </Field>
          </div>

          {/* Row 3: Count wording — desktop & Count wording — app */}
          <div className="hok-des-grid-2col">
            <Field
              label="Count wording — desktop"
              hint="{n} is replaced by the live count."
            >
              <input
                type="text"
                className="hok-field-input"
                value={settings.countLbl || '{n} PIECES'}
                onChange={(e) => onChange({ ...settings, countLbl: e.target.value })}
                placeholder="{n} PIECES"
              />
            </Field>

            <Field label="Count wording — app">
              <input
                type="text"
                className="hok-field-input"
                value={settings.countLblMob || '{n} pieces available'}
                onChange={(e) => onChange({ ...settings, countLblMob: e.target.value })}
                placeholder="{n} pieces available"
              />
            </Field>
          </div>

          {/* Row 4: Carousel kicker */}
          <div id="designers-kick">
            <Field
              label="Carousel kicker — app only"
              hint="The small line above the name on each app slide. The desktop grid carries none."
            >
              <input
                type="text"
                className="hok-field-input"
                value={settings.slideKick || 'Featured Designer'}
                onChange={(e) => onChange({ ...settings, slideKick: e.target.value })}
                placeholder="Featured Designer"
              />
            </Field>
          </div>

          {/* Row 5: Heading toggles */}
          <div className="hok-des-toggles-grid">
            <PillToggle
              checked={settings.header}
              onChange={(checked) => onChange({ ...settings, header: checked })}
              label="Show the band heading on desktop"
            />

            <PillToggle
              checked={settings.headerMob}
              onChange={(checked) => onChange({ ...settings, headerMob: checked })}
              label="Show the band heading in the app"
            />
          </div>

          {/* Row 6: Live piece count toggle */}
          <PillToggle
            checked={settings.showCount}
            onChange={(checked) => onChange({ ...settings, showCount: checked })}
            label="Show each designer’s live piece count"
            hint="Counted from the catalogue. The storefront currently carries written-in figures such as “214 pieces”, which the catalogue cannot support — turning this on replaces them with the real count."
          />
        </div>
      </Card>
    </div>
  );
};
