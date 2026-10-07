/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · TESTIMONIALS (Spec 8.8)
   Spec Section 8.8 & 12.7 (v213)
========================================================= */

import React, { useState } from 'react';
import './TestimonialsBand.css';
import { TestimonialsSettings, TestimonialCard, HealthIssue } from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';

interface TestimonialsBandProps {
  settings: TestimonialsSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: TestimonialsSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

const SAMPLE_ORDERS: { [orderId: string]: string } = {
  'HOK-ORD-001': 'Matches Priya Rathore · Crimson Zardozi Bridal Lehenga · Rental.',
  'HOK-ORD-002': 'Matches Aishwarya Sharma · Ivory Embroidered Sherwani · Rental.',
  'HOK-ORD-003': 'Matches Neha Kulkarni · Midnight Blue Crepe Saree · Rental.'
};

export const TestimonialsBand: React.FC<TestimonialsBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const getInitials = (name: string, custom?: string) => {
    if (custom?.trim()) return custom.trim();
    if (!name?.trim()) return 'PR';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const deckItems: DeckTileItem[] = settings.cards.map((c, idx) => ({
    id: `testi-card-${c.id || idx + 1}`,
    position: idx + 1,
    title: c.name || `Quote ${idx + 1}`,
    sub: `${c.city ? c.city + ' · ' : ''}${c.ctx}`,
    initials: getInitials(c.name, c.ini),
    pictureHeight: 108,
    cornerFlag: !c.on ? { type: 'off', label: 'OFF' } : undefined,
    dimmed: !c.on
  }));

  const selectedCard =
    selectedCardIndex !== null && selectedCardIndex < settings.cards.length
      ? settings.cards[selectedCardIndex]
      : null;

  const handleUpdateCard = (index: number, patch: Partial<TestimonialCard>) => {
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
    const newCard: TestimonialCard = {
      id: `t-${Date.now()}`,
      on: true,
      name: 'Priya Rathore',
      ini: 'PR',
      city: 'Mumbai',
      ctx: 'Rented for a Wedding',
      stars: 5,
      src: 'Verified order',
      ref: 'HOK-ORD-001',
      q: 'The packaging and the designer fit made the celebration completely memorable.'
    };
    const updated = [...settings.cards, newCard];
    onChange({ ...settings, cards: updated });
    setSelectedCardIndex(updated.length - 1);
  };

  const orderMatchInfo = selectedCard?.ref ? SAMPLE_ORDERS[selectedCard.ref] : null;

  return (
    <div className="hok-testimonials-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">Testimonials</h2>
        <span className="hok-hp-editor-band-counter">Band 8 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        Customer quotes. Each one records where it came from, so a claim on the homepage can always be traced back to a real order.
      </p>

      {/* 7.1 Visibility Row */}
      <div className="hok-hp-visibility-row" id="testi-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
        </div>
        <span className="hok-hp-visibility-consequence">
          {isShown
            ? 'Showing on the live homepage, in position 8.'
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

      {/* Card 1 — The words (Spec 8.8.1) */}
      <Card
        id="testi-words-card"
        title="The words"
      >
        <div className="hok-testi-field-stack">
          <div id="testi-eyebrow">
            <Field
              label="Eyebrow"
              hint="Centred, with a rule on both sides."
            >
              <input
                type="text"
                className="hok-field-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Worn, Loved & Shared Across India"
              />
            </Field>
          </div>

          <div id="testi-heading">
            <Field
              label="Heading"
              hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
            >
              <textarea
                className="hok-field-textarea"
                rows={2}
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="What our customers *say*"
              />
            </Field>
            <ReadsAsMirror text={settings.heading} />
          </div>

          <div className="hok-testi-grid-2col">
            <Field label="Desktop">
              <select
                className="hok-field-select"
                value={settings.layout}
                onChange={(e) =>
                  onChange({ ...settings, layout: e.target.value as 'Three across' | 'Two across' })
                }
              >
                <option value="Three across">Three across</option>
                <option value="Two across">Two across</option>
              </select>
            </Field>

            <Field label="Mobile">
              <select
                className="hok-field-select"
                value={settings.layoutMob}
                onChange={(e) =>
                  onChange({ ...settings, layoutMob: e.target.value as 'Swipe' | 'Stacked' })
                }
              >
                <option value="Swipe">Swipe</option>
                <option value="Stacked">Stacked</option>
              </select>
            </Field>
          </div>
        </div>
      </Card>

      {/* Card 2 — The quotes (Spec 8.8.2) */}
      <div id="testi-quotes">
        <Card
          title="The quotes"
          sub="Each one records where it came from. A claim on the homepage that cannot be traced back to a real order is a claim worth not making."
        >
          <div className="hok-testi-deck-wrapper">
            <Deck
              arrangement="d3"
              items={deckItems}
              selectedIndex={selectedCardIndex}
              onSelectIndex={setSelectedCardIndex}
              onMoveEarlier={(idx) => handleMoveCard(idx, 'up')}
              onMoveLater={(idx) => handleMoveCard(idx, 'down')}
              onRemove={handleRemoveCard}
              removeLabel="Remove"
              onAddTile={handleAddCard}
              addLabel="Add a quote"
              maxReached={settings.cards.length >= 6}
            />

            {/* Inspector */}
            <Inspector
              kicker={`EDITING QUOTE ${selectedCardIndex !== null ? selectedCardIndex + 1 : 1}`}
              itemName={selectedCard ? selectedCard.name : undefined}
              isOpen={selectedCardIndex !== null && !!selectedCard}
              emptyText="Pick a quote above to edit the customer words, star rating and verified order connection."
            >
              {selectedCard && selectedCardIndex !== null && (
                <div className="hok-testi-inspector-fields">
                  <PillToggle
                    checked={selectedCard.on}
                    onChange={(checked) =>
                      handleUpdateCard(selectedCardIndex, { on: checked })
                    }
                    label="Show this quote on the homepage"
                  />

                  <Field label="Quote">
                    <textarea
                      className="hok-field-textarea"
                      rows={3}
                      value={selectedCard.q}
                      onChange={(e) =>
                        handleUpdateCard(selectedCardIndex, { q: e.target.value })
                      }
                      placeholder="I wore a Sabyasachi lehenga to my sister's wedding for a fraction of the retail price..."
                    />
                  </Field>

                  <div className="hok-testi-grid-2col">
                    <Field label="Name">
                      <input
                        type="text"
                        className="hok-field-input"
                        value={selectedCard.name}
                        onChange={(e) =>
                          handleUpdateCard(selectedCardIndex, { name: e.target.value })
                        }
                        placeholder="Priya Rathore"
                      />
                    </Field>

                    <Field
                      label="Initials on the avatar"
                      hint={`Blank takes the first letters of the name — currently ${getInitials(
                        selectedCard.name
                      )}.`}
                    >
                      <input
                        type="text"
                        className="hok-field-input"
                        value={selectedCard.ini || ''}
                        onChange={(e) =>
                          handleUpdateCard(selectedCardIndex, { ini: e.target.value })
                        }
                        placeholder={getInitials(selectedCard.name)}
                      />
                    </Field>
                  </div>

                  <div className="hok-testi-grid-2col">
                    <Field label="City">
                      <input
                        type="text"
                        className="hok-field-input"
                        value={selectedCard.city || ''}
                        onChange={(e) =>
                          handleUpdateCard(selectedCardIndex, { city: e.target.value })
                        }
                        placeholder="Mumbai"
                      />
                    </Field>

                    <Field
                      label="What they did"
                      hint={`Reads as “${selectedCard.city ? selectedCard.city + ' · ' : ''}${
                        selectedCard.ctx || 'Rented for a Wedding'
                      }”.`}
                    >
                      <input
                        type="text"
                        className="hok-field-input"
                        value={selectedCard.ctx}
                        onChange={(e) =>
                          handleUpdateCard(selectedCardIndex, { ctx: e.target.value })
                        }
                        placeholder="Rented for a Wedding"
                      />
                    </Field>
                  </div>

                  <div className="hok-testi-grid-2col">
                    <Field label="Stars">
                      <select
                        className="hok-field-select"
                        value={selectedCard.stars || 5}
                        onChange={(e) =>
                          handleUpdateCard(selectedCardIndex, {
                            stars: Number(e.target.value)
                          })
                        }
                      >
                        <option value={5}>5</option>
                        <option value={4}>4</option>
                        <option value={3}>3</option>
                        <option value={2}>2</option>
                        <option value={1}>1</option>
                      </select>
                    </Field>

                    <Field
                      label="Where it came from"
                      hint="Traceable to an order in the panel."
                    >
                      <select
                        className="hok-field-select"
                        value={selectedCard.src}
                        onChange={(e) =>
                          handleUpdateCard(selectedCardIndex, {
                            src: e.target.value as 'Verified order' | 'Instagram' | 'Collected directly'
                          })
                        }
                      >
                        <option value="Verified order">Verified order</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Collected directly">Collected directly</option>
                      </select>
                    </Field>
                  </div>

                  {selectedCard.src === 'Verified order' && (
                    <Field
                      label="Order number"
                      hint={
                        orderMatchInfo ||
                        (selectedCard.ref
                          ? 'No order with that number.'
                          : 'No order recorded, so this quote cannot be traced.')
                      }
                    >
                      <input
                        type="text"
                        className="hok-field-input"
                        value={selectedCard.ref || ''}
                        onChange={(e) =>
                          handleUpdateCard(selectedCardIndex, { ref: e.target.value })
                        }
                        placeholder="HOK-ORD-001"
                      />
                    </Field>
                  )}
                </div>
              )}
            </Inspector>
          </div>
        </Card>
      </div>
    </div>
  );
};
