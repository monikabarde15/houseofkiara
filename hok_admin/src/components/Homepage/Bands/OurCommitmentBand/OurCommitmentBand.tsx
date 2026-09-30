/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · OUR COMMITMENT BAND (Spec 8.6)
========================================================= */

import React, { useState } from 'react';
import './OurCommitmentBand.css';
import {
  CommitmentSettings,
  CommitmentPill,
  CommitmentCard,
  HealthIssue
} from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';
import {
  HomepageLineIcon,
  ICON_NAMES,
  PlusIcon
} from '../../shared/icons/HomepageIcons';

interface OurCommitmentBandProps {
  settings: CommitmentSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: CommitmentSettings) => void;
  issues: HealthIssue[];
}

export const OurCommitmentBand: React.FC<OurCommitmentBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues
}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  // Deck items representation for the 4 argument cards
  const deckItems: DeckTileItem[] = settings.cards.map((c, idx) => ({
    id: c.id || `commit-card-${idx + 1}`,
    position: idx + 1,
    title: c.h || `Card ${idx + 1}`,
    sub: c.d ? (c.d.length > 50 ? c.d.slice(0, 50) + '…' : c.d) : 'Empty text',
    badge: c.mob ? undefined : 'DESKTOP ONLY'
  }));

  const selectedCard =
    selectedCardIndex !== null && selectedCardIndex < settings.cards.length
      ? settings.cards[selectedCardIndex]
      : null;

  // Handlers for Pills
  const handleUpdatePill = (index: number, patch: Partial<CommitmentPill>) => {
    const updated = [...settings.pills];
    updated[index] = { ...updated[index], ...patch };
    onChange({ ...settings, pills: updated });
  };

  const handleMovePill = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= settings.pills.length) return;
    const updated = [...settings.pills];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, pills: updated });
  };

  const handleAddPill = () => {
    const newPill: CommitmentPill = {
      id: `pill-${Date.now()}`,
      l: 'New Pill',
      u: '/rent',
      on: true
    };
    onChange({ ...settings, pills: [...settings.pills, newPill] });
  };

  const handleRemovePill = (index: number) => {
    const updated = settings.pills.filter((_, i) => i !== index);
    onChange({ ...settings, pills: updated });
  };

  // Handlers for Cards
  const handleUpdateCard = (index: number, patch: Partial<CommitmentCard>) => {
    const updated = [...settings.cards];
    updated[index] = { ...updated[index], ...patch };
    onChange({ ...settings, cards: updated });
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= settings.cards.length) return;
    const updated = [...settings.cards];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, cards: updated });
    setSelectedCardIndex(target);
  };

  return (
    <div className="hok-band-editor hok-our-commitment-band">
      {/* Band Header Card */}
      <Card
        variant="elevated"
        header={{
          eyebrow: 'BAND 6 · OUR COMMITMENT',
          title: 'Our Commitment',
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
          The sustainability mission statement, circular mode pills, and 4 core value proposition argument cards.
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

      {/* Card 1: Headings & Mission Narrative */}
      <Card
        header={{
          eyebrow: 'BAND HEADINGS & NARRATIVE',
          title: 'Mission Statement & Paragraph Copy',
          meta: 'Top text and supporting philosophy'
        }}
      >
        <div className="hok-commit-words-grid">
          <div id="commit-eyebrow">
            <Field
              label="Eyebrow"
              hint="Small caps kicker text"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Our Commitment"
              />
            </Field>
          </div>

          <div id="commit-heading">
            <Field
              label="Main Heading"
              hint="Wrap *words in asterisks* for gold italic serif font"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Fashion that gives *back*"
              />
            </Field>
          </div>
        </div>

        <div className="hok-commit-mirror-box">
          <span className="hok-commit-mirror-label">Live Storefront Heading Preview</span>
          <ReadsAsMirror
            eyebrow={settings.eyebrow}
            heading={settings.heading}
            className="hok-commit-reads-as"
          />
        </div>

        <div className="hok-divider" />

        <div id="commit-body" className="hok-commit-body-grid">
          <Field
            label="Desktop Narrative Copy"
            hint="Full circular fashion manifesto rendered on desktop view"
          >
            <textarea
              className="hok-textarea"
              rows={3}
              value={settings.body}
              onChange={(e) => onChange({ ...settings, body: e.target.value })}
              placeholder="Every outfit rented or resold keeps textile waste out of landfill. House of Kaira is building India's most loved circular fashion economy — one outfit at a time."
            />
          </Field>

          <Field
            label="Mobile Condensed Copy"
            hint="Streamlined paragraph rendered on compact mobile viewports"
          >
            <textarea
              className="hok-textarea"
              rows={3}
              value={settings.bodyMob}
              onChange={(e) => onChange({ ...settings, bodyMob: e.target.value })}
              placeholder="Every outfit rented or resold keeps textile waste out of landfill. Building India's most loved circular fashion economy — one outfit at a time."
            />
          </Field>
        </div>
      </Card>

      {/* Card 2: Mode / Impact Pills Row */}
      <Card
        header={{
          eyebrow: 'MODE PILLS ROW',
          title: 'Mode & Action Pills',
          meta: `${settings.pills.length} pills configured`,
          actions: (
            <button
              type="button"
              className="hok-commit-add-pill-btn"
              onClick={handleAddPill}
            >
              <PlusIcon size={11} /> Add Pill
            </button>
          )
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Horizontal pill bar rendered below the mission narrative to direct customers into primary platform modes.
        </p>

        <div id="commit-pills" className="hok-commit-pills-table">
          <div className="hok-commit-pills-header">
            <span className="hok-commit-col-idx">#</span>
            <span className="hok-commit-col-lbl">Pill Label</span>
            <span className="hok-commit-col-url">Target URL</span>
            <span className="hok-commit-col-vis">Storefront</span>
            <span className="hok-commit-col-actions">Order</span>
          </div>

          {settings.pills.map((pill, idx) => (
            <div key={pill.id} className="hok-commit-pill-row">
              <span className="hok-commit-col-idx">{idx + 1}</span>

              <div className="hok-commit-col-lbl">
                <input
                  type="text"
                  className="hok-input"
                  value={pill.l}
                  onChange={(e) => handleUpdatePill(idx, { l: e.target.value })}
                  placeholder="e.g. Rent"
                />
              </div>

              <div className="hok-commit-col-url">
                <input
                  type="text"
                  className="hok-input"
                  value={pill.u}
                  onChange={(e) => handleUpdatePill(idx, { u: e.target.value })}
                  placeholder="e.g. /rent"
                />
              </div>

              <div className="hok-commit-col-vis">
                <PillToggle
                  options={[
                    { label: 'Show', value: true },
                    { label: 'Hide', value: false }
                  ]}
                  value={pill.on}
                  onChange={(val) => handleUpdatePill(idx, { on: Boolean(val) })}
                />
              </div>

              <div className="hok-commit-col-actions">
                <button
                  type="button"
                  className="hok-commit-order-btn"
                  disabled={idx === 0}
                  onClick={() => handleMovePill(idx, 'up')}
                  title="Move Earlier"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="hok-commit-order-btn"
                  disabled={idx === settings.pills.length - 1}
                  onClick={() => handleMovePill(idx, 'down')}
                  title="Move Later"
                >
                  ↓
                </button>
                {settings.pills.length > 1 && (
                  <button
                    type="button"
                    className="hok-commit-del-pill-btn"
                    onClick={() => handleRemovePill(idx)}
                    title="Remove Pill"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Card 3: 4 Argument Cards Deck & Inspector */}
      <Card
        header={{
          eyebrow: 'VALUE PROPOSITION',
          title: '4 Argument Cards',
          meta: `${settings.cards.length} cards · 4-across deck`
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Click any card below to edit its icon, heading statement, description, and mobile visibility.
        </p>

        <div id="commit-cards" className="hok-commit-deck-wrapper">
          <Deck
            arrangement="d4"
            items={deckItems}
            selectedIndex={selectedCardIndex}
            onSelect={(idx) => setSelectedCardIndex(idx)}
            renderCustomContent={(item, idx) => {
              const card = settings.cards[idx];
              return (
                <div className="hok-commit-tile">
                  <div className="hok-commit-tile-top">
                    <div className="hok-commit-tile-icon-box">
                      <HomepageLineIcon name={card.ico} size={20} />
                    </div>
                    {!card.mob && (
                      <span className="hok-commit-tile-desktop-only">Desktop only</span>
                    )}
                  </div>
                  <div className="hok-commit-tile-head">{card.h || 'Untitled'}</div>
                  <p className="hok-commit-tile-desc">{card.d}</p>
                </div>
              );
            }}
          />

          {selectedCard && selectedCardIndex !== null && (
            <Inspector
              title={`Edit Card ${selectedCardIndex + 1}: ${selectedCard.h || 'Untitled'}`}
              position={selectedCardIndex + 1}
              totalItems={settings.cards.length}
              onClose={() => setSelectedCardIndex(null)}
              onMoveUp={selectedCardIndex > 0 ? () => handleMoveCard(selectedCardIndex, 'up') : undefined}
              onMoveDown={
                selectedCardIndex < settings.cards.length - 1
                  ? () => handleMoveCard(selectedCardIndex, 'down')
                  : undefined
              }
            >
              <div className="hok-commit-inspector-content">
                <Field
                  label="Card Icon"
                  hint="Pick 1 of 16 stroked line icons"
                >
                  <div className="hok-commit-icon-selector">
                    {ICON_NAMES.map((ico) => {
                      const isSelected = selectedCard.ico === ico;
                      return (
                        <button
                          key={ico}
                          type="button"
                          className={`hok-commit-icon-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => handleUpdateCard(selectedCardIndex, { ico })}
                          title={ico}
                        >
                          <HomepageLineIcon name={ico} size={16} />
                          <span className="hok-commit-icon-name">{ico}</span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field
                  label="Card Heading"
                  hint="Bold value statement (1–2 sentences)"
                >
                  <textarea
                    className="hok-textarea"
                    rows={2}
                    value={selectedCard.h}
                    onChange={(e) => handleUpdateCard(selectedCardIndex, { h: e.target.value })}
                    placeholder="Every piece rented is one less outfit the world needed to make."
                  />
                </Field>

                <Field
                  label="Card Description"
                  hint="Supporting explanation"
                >
                  <textarea
                    className="hok-textarea"
                    rows={3}
                    value={selectedCard.d}
                    onChange={(e) => handleUpdateCard(selectedCardIndex, { d: e.target.value })}
                    placeholder="At HOK, choosing to rent isn't a compromise — it's a quiet act of intention."
                  />
                </Field>

                <Field
                  label="Mobile Storefront Visibility"
                  hint="Include this card on compact mobile screens"
                >
                  <PillToggle
                    options={[
                      { label: 'Show on mobile', value: true },
                      { label: 'Desktop only', value: false }
                    ]}
                    value={selectedCard.mob}
                    onChange={(val) => handleUpdateCard(selectedCardIndex, { mob: Boolean(val) })}
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
