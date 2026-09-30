/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · TESTIMONIALS (Spec 8.8)
========================================================= */

import React, { useState } from 'react';
import './TestimonialsBand.css';
import {
  TestimonialsSettings,
  TestimonialCard,
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
  DoorArrowIcon,
  PlusIcon
} from '../../shared/icons/HomepageIcons';

interface TestimonialsBandProps {
  settings: TestimonialsSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: TestimonialsSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

// Known orders in the store registry (for live validation)
const VERIFIED_ORDERS: { [orderId: string]: { customer: string; piece: string; date: string } } = {
  'HOK-ORD-001': { customer: 'Priya Rathore', piece: 'Sabyasachi Gulabi Silk Lehenga', date: '12 Sep 2026' },
  'HOK-ORD-002': { customer: 'Aishwarya Sharma', piece: 'Manish Malhotra Sherwani', date: '18 Aug 2026' },
  'HOK-ORD-003': { customer: 'Neha Kulkarni', piece: 'Tarun Tahiliani Crepe Saree', date: '24 Jul 2026' },
  'HOK-ORD-004': { customer: 'Ananya Mehta', piece: 'Anita Dongre Rose Anarkali', date: '05 Aug 2026' },
  'HOK-ORD-108': { customer: 'Tanvi Shah', piece: 'Rahul Mishra Cape Set', date: '02 Jun 2026' }
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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

  // Deck items representation
  const deckItems: DeckTileItem[] = settings.cards.map((c, idx) => ({
    id: c.id || `testi-card-${idx + 1}`,
    position: idx + 1,
    title: c.name || `Quote ${idx + 1}`,
    sub: `${c.city ? c.city + ' · ' : ''}${c.ctx || 'Customer review'}`,
    badge: c.src === 'Verified order' ? '✓ Verified' : c.src,
    initials: c.ini || getInitials(c.name || 'HOK')
  }));

  const selectedCard =
    selectedCardIndex !== null && selectedCardIndex < settings.cards.length
      ? settings.cards[selectedCardIndex]
      : null;

  // Handlers
  const handleUpdateCard = (index: number, patch: Partial<TestimonialCard>) => {
    const updated = [...settings.cards];
    const current = updated[index];
    const next = { ...current, ...patch };

    // Auto-update initials if name changed and initials were default
    if (patch.name && (!current.ini || current.ini === getInitials(current.name))) {
      next.ini = getInitials(patch.name);
    }

    updated[index] = next;
    onChange({ ...settings, cards: updated });
  };

  const handleMoveCard = (index: number, direction: 'earlier' | 'later') => {
    const target = direction === 'earlier' ? index - 1 : index + 1;
    if (target < 0 || target >= settings.cards.length) return;
    const updated = [...settings.cards];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, cards: updated });
    setSelectedCardIndex(target);
  };

  const handleAddCard = () => {
    const newCard: TestimonialCard = {
      id: `t-${Date.now()}`,
      on: true,
      name: 'New Customer',
      ini: 'NC',
      city: 'Mumbai',
      ctx: 'Rented for Wedding',
      stars: 5,
      src: 'Verified order',
      ref: 'HOK-ORD-004',
      q: 'The experience was seamless from fitting to return. Highly recommended!'
    };
    onChange({ ...settings, cards: [...settings.cards, newCard] });
    setSelectedCardIndex(settings.cards.length);
  };

  const handleRemoveCard = (index: number) => {
    const updated = settings.cards.filter((_, i) => i !== index);
    onChange({ ...settings, cards: updated });
    setSelectedCardIndex(null);
  };

  // Order validation info
  const verifiedOrderInfo =
    selectedCard && selectedCard.src === 'Verified order' && selectedCard.ref
      ? VERIFIED_ORDERS[selectedCard.ref] || null
      : null;

  return (
    <div className="hok-band-editor hok-testimonials-band">
      {/* Band Header Card */}
      <Card
        variant="elevated"
        header={{
          eyebrow: 'BAND 8 · TESTIMONIALS',
          title: 'Customer Testimonials',
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
          Customer social proof quotes, star ratings, occasion contexts, and verified order authentication badges.
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

      {/* Card 1: Headings & Layout */}
      <Card
        header={{
          eyebrow: 'BAND HEADINGS & LAYOUT',
          title: 'Heading, Eyebrow & Grid Arrangement',
          meta: 'Top text and column presentation'
        }}
      >
        <div className="hok-testi-words-grid">
          <Field
            label="Eyebrow"
            hint="Small caps kicker text"
          >
            <input
              id="testi-eyebrow"
              type="text"
              className="hok-input"
              value={settings.eyebrow}
              onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
              placeholder="Worn, Loved & Shared Across India"
            />
          </Field>

          <Field
            label="Main Heading"
            hint="Wrap *words in asterisks* for gold italic serif font"
          >
            <input
              id="testi-heading"
              type="text"
              className="hok-input"
              value={settings.heading}
              onChange={(e) => onChange({ ...settings, heading: e.target.value })}
              placeholder="What our customers *say*"
            />
          </Field>
        </div>

        <div className="hok-testi-mirror-box">
          <span className="hok-testi-mirror-label">Live Storefront Heading Preview</span>
          <ReadsAsMirror
            eyebrow={settings.eyebrow}
            heading={settings.heading}
            className="hok-testi-reads-as"
          />
        </div>

        <div className="hok-divider" />

        <div className="hok-testi-layout-grid">
          <Field
            label="Desktop Layout"
            hint="Arrangement on desktop screens"
          >
            <PillToggle
              options={[
                { label: 'Three across', value: 'Three across' },
                { label: 'Two across', value: 'Two across' }
              ]}
              value={settings.layout}
              onChange={(val) =>
                onChange({ ...settings, layout: val as 'Three across' | 'Two across' })
              }
            />
          </Field>

          <Field
            label="Mobile Layout"
            hint="Arrangement on compact viewports"
          >
            <PillToggle
              options={[
                { label: 'Swipe (Carousel)', value: 'Swipe' },
                { label: 'Stacked (Vertical)', value: 'Stacked' }
              ]}
              value={settings.layoutMob}
              onChange={(val) =>
                onChange({ ...settings, layoutMob: val as 'Swipe' | 'Stacked' })
              }
            />
          </Field>
        </div>
      </Card>

      {/* Card 2: 3-Quote Cards Deck & Inspector */}
      <div id="testi-quotes">
      <Card
        header={{
          eyebrow: 'TESTIMONIAL CARDS',
          title: 'Customer Review Quotes',
          meta: `${settings.cards.length} quotes configured · ${settings.layout} deck`,
          actions: (
            <button
              type="button"
              className="hok-testi-add-btn"
              onClick={handleAddCard}
            >
              <PlusIcon size={11} /> Add Testimonial
            </button>
          )
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Click any testimonial card below to edit customer details, star rating, verified order links, and quote wording.
        </p>

        <div className="hok-testi-deck-wrapper">
          <Deck
            arrangement="d3"
            items={deckItems}
            selectedIndex={selectedCardIndex}
            onSelect={(idx) => setSelectedCardIndex(idx)}
            renderCustomContent={(item, idx) => {
              const card = settings.cards[idx];
              return (
                <div className="hok-testi-tile">
                  <div className="hok-testi-tile-top">
                    <div className="hok-testi-avatar">{card.ini || getInitials(card.name)}</div>
                    <div className="hok-testi-author">
                      <div className="hok-testi-name">{card.name || 'Anonymous'}</div>
                      <div className="hok-testi-ctx">{card.city ? `${card.city} · ` : ''}{card.ctx}</div>
                    </div>
                  </div>

                  <div className="hok-testi-stars">
                    {'★'.repeat(card.stars || 5)}
                    {'☆'.repeat(5 - (card.stars || 5))}
                  </div>

                  <p className="hok-testi-quote">&ldquo;{card.q}&rdquo;</p>

                  <div className="hok-testi-tile-foot">
                    <span className={`hok-testi-src-pill is-${card.src.toLowerCase().replace(/\s+/g, '-')}`}>
                      {card.src === 'Verified order' ? '✓ Verified Order' : card.src}
                    </span>
                    {!card.on && <span className="hok-testi-hidden-tag">Hidden</span>}
                  </div>
                </div>
              );
            }}
          />

          {selectedCard && selectedCardIndex !== null && (
            <Inspector
              title={`Edit Testimonial ${selectedCardIndex + 1}: ${selectedCard.name}`}
              position={selectedCardIndex + 1}
              totalItems={settings.cards.length}
              onClose={() => setSelectedCardIndex(null)}
              onMoveUp={selectedCardIndex > 0 ? () => handleMoveCard(selectedCardIndex, 'earlier') : undefined}
              onMoveDown={
                selectedCardIndex < settings.cards.length - 1
                  ? () => handleMoveCard(selectedCardIndex, 'later')
                  : undefined
              }
            >
              <div className="hok-testi-inspector-content">
                <Field
                  label="Card Visibility"
                  hint="Show or hide this specific quote from the live storefront"
                >
                  <PillToggle
                    options={[
                      { label: 'Show', value: true },
                      { label: 'Hide', value: false }
                    ]}
                    value={selectedCard.on}
                    onChange={(val) => handleUpdateCard(selectedCardIndex, { on: Boolean(val) })}
                  />
                </Field>

                <div className="hok-testi-name-grid">
                  <Field
                    label="Customer Full Name"
                    hint="e.g. Priya Rathore"
                  >
                    <input
                      type="text"
                      className="hok-input"
                      value={selectedCard.name}
                      onChange={(e) => handleUpdateCard(selectedCardIndex, { name: e.target.value })}
                      placeholder="Priya Rathore"
                    />
                  </Field>

                  <Field
                    label="Initials"
                    hint="Avatar initials (e.g. 'PR')"
                  >
                    <input
                      type="text"
                      className="hok-input"
                      value={selectedCard.ini}
                      onChange={(e) =>
                        handleUpdateCard(selectedCardIndex, { ini: e.target.value.toUpperCase() })
                      }
                      maxLength={3}
                      placeholder="PR"
                    />
                  </Field>
                </div>

                <div className="hok-testi-location-grid">
                  <Field
                    label="City / Location"
                    hint="e.g. Mumbai, Delhi, London"
                  >
                    <input
                      type="text"
                      className="hok-input"
                      value={selectedCard.city}
                      onChange={(e) => handleUpdateCard(selectedCardIndex, { city: e.target.value })}
                      placeholder="Mumbai"
                    />
                  </Field>

                  <Field
                    label="Occasion / Context"
                    hint="e.g. Rented for a Wedding"
                  >
                    <input
                      type="text"
                      className="hok-input"
                      value={selectedCard.ctx}
                      onChange={(e) => handleUpdateCard(selectedCardIndex, { ctx: e.target.value })}
                      placeholder="Rented for a Wedding"
                    />
                  </Field>
                </div>

                <div className="hok-testi-stars-source-grid">
                  <Field
                    label="Star Rating"
                    hint="Rating out of 5 stars"
                  >
                    <select
                      className="hok-select"
                      value={selectedCard.stars || 5}
                      onChange={(e) =>
                        handleUpdateCard(selectedCardIndex, { stars: Number(e.target.value) })
                      }
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                      <option value={2}>★★☆☆☆ (2 Stars)</option>
                      <option value={1}>★☆☆☆☆ (1 Star)</option>
                    </select>
                  </Field>

                  <Field
                    label="Verification Source"
                    hint="Trust badge attached to the quote"
                  >
                    <select
                      className="hok-select"
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
                  <div className="hok-testi-order-auth-box">
                    <Field
                      label="Verified Order Number"
                      hint="Order reference in the HOK system"
                    >
                      <input
                        type="text"
                        className="hok-input hok-testi-order-input"
                        value={selectedCard.ref}
                        onChange={(e) =>
                          handleUpdateCard(selectedCardIndex, { ref: e.target.value.toUpperCase() })
                        }
                        placeholder="HOK-ORD-001"
                      />
                    </Field>

                    {verifiedOrderInfo ? (
                      <div className="hok-testi-order-status is-verified">
                        <span className="hok-testi-status-icon">✓</span>
                        <div className="hok-testi-status-text">
                          <strong>Verified Order:</strong> {verifiedOrderInfo.customer} · {verifiedOrderInfo.piece} ({verifiedOrderInfo.date})
                        </div>
                        {onNavigateToModule && (
                          <button
                            type="button"
                            className="hok-testi-order-door-btn"
                            onClick={() => onNavigateToModule('Orders')}
                          >
                            Open Order <DoorArrowIcon size={10} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="hok-testi-order-status is-unverified">
                        <span className="hok-testi-status-icon">⚠</span>
                        <div className="hok-testi-status-text">
                          Order ID not found in the orders registry. Please verify the order number.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Field
                  label="Customer Quote"
                  hint="The actual words spoken or written by the customer"
                >
                  <textarea
                    className="hok-textarea"
                    rows={4}
                    value={selectedCard.q}
                    onChange={(e) => handleUpdateCard(selectedCardIndex, { q: e.target.value })}
                    placeholder="I wore a Sabyasachi lehenga to my sister's wedding for a fraction of the retail price..."
                  />
                </Field>

                <div className="hok-testi-inspector-actions">
                  <button
                    type="button"
                    className="hok-testi-remove-btn"
                    onClick={() => handleRemoveCard(selectedCardIndex)}
                  >
                    Remove Testimonial
                  </button>
                </div>
              </div>
            </Inspector>
          )}
        </div>
      </Card>
      </div>
    </div>
  );
};
