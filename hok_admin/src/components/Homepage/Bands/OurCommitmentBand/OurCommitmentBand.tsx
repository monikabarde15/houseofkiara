/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · OUR COMMITMENT (Spec 8.6)
   Spec Section 8.6 (v213)
========================================================= */

import React, { useState } from 'react';
import './OurCommitmentBand.css';
import { CommitmentSettings, CommitmentCard, HealthIssue } from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';
import { HomepageLineIcon, ICON_NAMES } from '../../shared/icons/HomepageIcons';
import { resolveHomepageTokens } from '../../shared/TokenPicker/TokenPicker';

interface OurCommitmentBandProps {
  settings: CommitmentSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: CommitmentSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

export const OurCommitmentBand: React.FC<OurCommitmentBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const deckItems: DeckTileItem[] = settings.cards.map((c, idx) => ({
    id: `commit-card-${idx + 1}`,
    position: idx + 1,
    title: c.h,
    sub: `${c.ico} · ${c.mob ? 'desktop and app' : 'desktop only'}`,
    iconName: c.ico,
    pictureHeight: 62,
    cornerFlag: !c.mob ? { type: 'off', label: 'DESKTOP ONLY' } : undefined
  }));

  const selectedCard =
    selectedCardIndex !== null && selectedCardIndex < settings.cards.length
      ? settings.cards[selectedCardIndex]
      : null;

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

  const handleRemoveCard = (index: number) => {
    const updated = settings.cards.filter((_, idx) => idx !== index);
    onChange({ ...settings, cards: updated });
    if (selectedCardIndex === index) {
      setSelectedCardIndex(null);
    } else if (selectedCardIndex !== null && selectedCardIndex > index) {
      setSelectedCardIndex(selectedCardIndex - 1);
    }
  };

  const handleAddCard = () => {
    if (settings.cards.length >= 6) return;
    const newCard: CommitmentCard = {
      id: `c-${Date.now()}`,
      ico: 'shield',
      mob: true,
      h: 'Circular Fashion Integrity',
      d: 'Each rental preserves resources and supports authentic Indian craftsmanship.'
    };
    const updated = [...settings.cards, newCard];
    onChange({ ...settings, cards: updated });
    setSelectedCardIndex(updated.length - 1);
  };

  const handleUpdatePill = (index: number, patch: { l?: string; u?: string; on?: boolean }) => {
    const updated = [...settings.pills];
    updated[index] = { ...updated[index], ...patch };
    onChange({ ...settings, pills: updated });
  };

  const handleAddPill = () => {
    const updated = [...settings.pills, { id: `pill-${Date.now()}`, l: 'New Mode', u: '/mode', on: true }];
    onChange({ ...settings, pills: updated });
  };

  const handleRemovePill = (index: number) => {
    const updated = settings.pills.filter((_, idx) => idx !== index);
    onChange({ ...settings, pills: updated });
  };

  return (
    <div className="hok-commitment-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">Our Commitment</h2>
        <span className="hok-hp-editor-band-counter">Band 6 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        The four modes as pills, and the cards that carry the argument. Desktop shows four cards, the app shows three.
      </p>

      {/* 7.1 Visibility Row */}
      <div className="hok-hp-visibility-row" id="commit-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
        </div>
        <span className="hok-hp-visibility-consequence">
          {isShown
            ? 'Showing on the live homepage, in position 6.'
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

      {/* Card 1 — The words (Spec 8.6.1) */}
      <Card
        id="commit-words-card"
        title="The words"
      >
        <div className="hok-com-field-stack">
          <div id="commit-eyebrow">
            <Field label="Eyebrow">
              <input
                type="text"
                className="hok-field-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Our Commitment"
              />
            </Field>
          </div>

          <div id="commit-heading">
            <Field
              label="Heading"
              hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
            >
              <textarea
                className="hok-field-textarea"
                rows={2}
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Fashion that gives *back*"
              />
            </Field>
            <ReadsAsMirror text={settings.heading} />
          </div>

          <div id="commit-body">
            <Field
              label="Body"
              tokenCapable
              value={settings.body}
              onTokenInsert={(tok) =>
                onChange({
                  ...settings,
                  body: settings.body ? `${settings.body} ${tok}` : tok
                })
              }
            >
              <textarea
                className="hok-field-textarea"
                rows={3}
                value={settings.body}
                onChange={(e) => onChange({ ...settings, body: e.target.value })}
                placeholder="Every outfit rented or resold keeps textile waste out of landfill..."
              />
            </Field>
          </div>

          <Field
            label="Body on mobile"
            tokenCapable
            value={settings.bodyMob || settings.body}
            onTokenInsert={(tok) =>
              onChange({
                ...settings,
                bodyMob: settings.bodyMob ? `${settings.bodyMob} ${tok}` : tok
              })
            }
            hint="Blank uses the desktop line."
          >
            <textarea
              className="hok-field-textarea"
              rows={2}
              value={settings.bodyMob}
              onChange={(e) => onChange({ ...settings, bodyMob: e.target.value })}
              placeholder="Blank uses the desktop line."
            />
          </Field>
        </div>
      </Card>

      {/* Card 2 — The mode pills (Spec 8.6.2) */}
      <div id="commit-pills">
        <Card
          title="The mode pills"
          sub="The row of dots under the body. Each one should go somewhere — a pill that reads like a link and does nothing is worse than no pill."
        >
          <div className="hok-com-pills-table">
            <div className="hok-com-pills-header">
              <span style={{ width: 60 }}>Shows</span>
              <span style={{ flex: 1 }}>Label</span>
              <span style={{ flex: 1.5 }}>Destination</span>
              <span style={{ width: 70 }}></span>
            </div>

            {settings.pills.map((pill, idx) => {
              const hasMissingDest = pill.on && !pill.u.trim();
              return (
                <div key={idx} className="hok-com-pill-row">
                  <div style={{ width: 60 }}>
                    <PillToggle
                      checked={pill.on}
                      onChange={(checked) => handleUpdatePill(idx, { on: checked })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="hok-field-input"
                      value={pill.l}
                      onChange={(e) => handleUpdatePill(idx, { l: e.target.value })}
                      placeholder="Label"
                    />
                  </div>
                  <div style={{ flex: 1.5 }}>
                    <input
                      type="text"
                      className={`hok-field-input ${hasMissingDest ? 'has-warning' : ''}`}
                      value={pill.u}
                      onChange={(e) => handleUpdatePill(idx, { u: e.target.value })}
                      placeholder="/destination"
                    />
                  </div>
                  <div style={{ width: 70, textAlign: 'right' }}>
                    <button
                      type="button"
                      className="hok-com-pill-remove-btn"
                      onClick={() => handleRemovePill(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className="hok-com-add-pill-btn"
              onClick={handleAddPill}
            >
              + Add a pill
            </button>
          </div>
        </Card>
      </div>

      {/* Card 3 — The cards (Spec 8.6.3) */}
      <div id="commit-cards">
        <Card
          title="The cards"
          sub="4 on desktop, 3 in the app. The app switch on each card is what decides which ones travel."
        >
          <div className="hok-com-deck-wrapper">
            <Deck
              arrangement="d4"
              items={deckItems}
              selectedIndex={selectedCardIndex}
              onSelectIndex={setSelectedCardIndex}
              onMoveEarlier={(idx) => handleMoveCard(idx, 'up')}
              onMoveLater={(idx) => handleMoveCard(idx, 'down')}
              onRemove={handleRemoveCard}
              removeLabel="Remove"
              onAddTile={handleAddCard}
              addLabel="Add a card"
              maxReached={settings.cards.length >= 6}
            />

            {/* Inspector */}
            <Inspector
              kicker={`EDITING CARD ${selectedCardIndex !== null ? selectedCardIndex + 1 : 1}`}
              itemName={selectedCard ? selectedCard.h : undefined}
              isOpen={selectedCardIndex !== null && !!selectedCard}
              emptyText="Pick a card above to edit its headline, body, icon and mobile visibility."
            >
              {selectedCard && selectedCardIndex !== null && (
                <div className="hok-com-inspector-fields">
                  <Field label="Headline">
                    <textarea
                      className="hok-field-textarea"
                      rows={2}
                      value={selectedCard.h}
                      onChange={(e) =>
                        handleUpdateCard(selectedCardIndex, { h: e.target.value })
                      }
                      placeholder="Every piece rented is one less outfit the world needed to make."
                    />
                  </Field>

                  <Field
                    label="Body"
                    tokenCapable
                    value={selectedCard.d}
                    onTokenInsert={(tok) =>
                      handleUpdateCard(selectedCardIndex, {
                        d: selectedCard.d ? `${selectedCard.d} ${tok}` : tok
                      })
                    }
                  >
                    <textarea
                      className="hok-field-textarea"
                      rows={3}
                      value={selectedCard.d}
                      onChange={(e) =>
                        handleUpdateCard(selectedCardIndex, { d: e.target.value })
                      }
                      placeholder="At HOK, choosing to rent isn't a compromise — it's a quiet act of intention."
                    />
                  </Field>

                  <Field
                    label="Icon"
                    hint="The storefront draws stroked line icons. There is no emoji anywhere on the page."
                  >
                    <div className="hok-com-icon-grid">
                      {ICON_NAMES.map((ico) => {
                        const isSelected = selectedCard.ico === ico;
                        return (
                          <button
                            key={ico}
                            type="button"
                            className={`hok-com-icon-btn ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => handleUpdateCard(selectedCardIndex, { ico })}
                            title={ico}
                          >
                            <HomepageLineIcon name={ico} size={14} />
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  <PillToggle
                    checked={selectedCard.mob}
                    onChange={(checked) =>
                      handleUpdateCard(selectedCardIndex, { mob: checked })
                    }
                    label="Show this card in the app as well as on desktop"
                    hint="Desktop shows every card. The app has room for fewer, so each card decides for itself."
                  />
                </div>
              )}
            </Inspector>
          </div>
        </Card>
      </div>
    </div>
  );
};
