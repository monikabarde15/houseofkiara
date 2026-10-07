/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · HOW IT WORKS BAND
   Spec Section 8.2 & 12.1 (v213)
========================================================= */

import React, { useState } from 'react';
import './HowItWorksBand.css';
import { HowItWorksSettings, HowItWorksStep, HealthIssue } from '../../types/homepage.types';
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

interface HowItWorksBandProps {
  settings: HowItWorksSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: HowItWorksSettings) => void;
  issues: HealthIssue[];
  targetFieldId?: string | null;
  onNavigateToModule?: (mod: string) => void;
}

export const HowItWorksBand: React.FC<HowItWorksBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  targetFieldId,
  onNavigateToModule
}) => {
  // Active editing pane: Shop or Sell (Spec 12.1)
  const [activePane, setActivePane] = useState<'Shop' | 'Sell'>(settings.open || 'Shop');
  const [selectedShopIndex, setSelectedShopIndex] = useState<number | null>(null);
  const [selectedSellIndex, setSelectedSellIndex] = useState<number | null>(null);

  // Auto-switch pane when search target is inside that pane
  React.useEffect(() => {
    if (targetFieldId === 'hiw-sell-steps' || targetFieldId === 'hiw-sell-card') {
      setActivePane('Sell');
    } else if (targetFieldId === 'hiw-shop-steps') {
      setActivePane('Shop');
    }
  }, [targetFieldId]);

  // Shop Deck items (Spec 4.10, 8.2.2)
  const shopDeckItems: DeckTileItem[] = settings.shop.map((st, idx) => ({
    id: `shop-step-${idx + 1}`,
    position: idx + 1,
    title: st.t || `Step ${idx + 1}`,
    sub: st.d || '',
    iconName: st.ico || 'search',
    pictureHeight: 52
  }));

  // Sell Deck items (Spec 4.10, 8.2.2)
  const sellDeckItems: DeckTileItem[] = settings.sell.map((st, idx) => ({
    id: `sell-step-${idx + 1}`,
    position: idx + 1,
    title: st.t || `Step ${idx + 1}`,
    sub: st.d || '',
    iconName: st.ico || 'box',
    pictureHeight: 52
  }));

  const selectedShopStep =
    selectedShopIndex !== null && selectedShopIndex < settings.shop.length
      ? settings.shop[selectedShopIndex]
      : null;

  const selectedSellStep =
    selectedSellIndex !== null && selectedSellIndex < settings.sell.length
      ? settings.sell[selectedSellIndex]
      : null;

  // Handlers for Shop Steps
  const updateShopStep = (index: number, patch: Partial<HowItWorksStep>) => {
    const updated = [...settings.shop];
    updated[index] = { ...updated[index], ...patch };
    onChange({ ...settings, shop: updated });
  };

  const moveShopStep = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= settings.shop.length) return;
    const updated = [...settings.shop];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, shop: updated });
    setSelectedShopIndex(target);
  };

  const handleRemoveShopStep = (index: number) => {
    const updated = settings.shop.filter((_, idx) => idx !== index);
    onChange({ ...settings, shop: updated });
    if (selectedShopIndex === index) {
      setSelectedShopIndex(null);
    } else if (selectedShopIndex !== null && selectedShopIndex > index) {
      setSelectedShopIndex(selectedShopIndex - 1);
    }
  };

  const handleAddShopStep = () => {
    if (settings.shop.length >= 4) return;
    const newStep: HowItWorksStep = {
      id: `step-${Date.now()}`,
      ico: 'search',
      t: 'New Step',
      d: 'Describe this step for shoppers.'
    };
    const updated = [...settings.shop, newStep];
    onChange({ ...settings, shop: updated });
    setSelectedShopIndex(updated.length - 1);
  };

  // Handlers for Sell Steps
  const updateSellStep = (index: number, patch: Partial<HowItWorksStep>) => {
    const updated = [...settings.sell];
    updated[index] = { ...updated[index], ...patch };
    onChange({ ...settings, sell: updated });
  };

  const moveSellStep = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= settings.sell.length) return;
    const updated = [...settings.sell];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({ ...settings, sell: updated });
    setSelectedSellIndex(target);
  };

  const handleRemoveSellStep = (index: number) => {
    const updated = settings.sell.filter((_, idx) => idx !== index);
    onChange({ ...settings, sell: updated });
    if (selectedSellIndex === index) {
      setSelectedSellIndex(null);
    } else if (selectedSellIndex !== null && selectedSellIndex > index) {
      setSelectedSellIndex(selectedSellIndex - 1);
    }
  };

  const handleAddSellStep = () => {
    if (settings.sell.length >= 3) return;
    const newStep: HowItWorksStep = {
      id: `sell-${Date.now()}`,
      ico: 'box',
      t: 'New Step',
      d: 'Describe this step for listers.'
    };
    const updated = [...settings.sell, newStep];
    onChange({ ...settings, sell: updated });
    setSelectedSellIndex(updated.length - 1);
  };

  return (
    <div className="hok-hiw-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">How It Works</h2>
        <span className="hok-hp-editor-band-counter">Band 2 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        Two panes behind one toggle — one for somebody buying, one for somebody listing. The sell pane ends on a card, not a step.
      </p>

      {/* 7.1 Visibility Row */}
      <div className="hok-hp-visibility-row" id="hiw-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
        </div>
        <span className="hok-hp-visibility-consequence">
          {isShown
            ? 'Showing on the live homepage, in position 2.'
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

      {/* Top Segmented Pane Switcher (Spec 8.2, 12.1) */}
      <div className="hok-hiw-pane-switcher-bar">
        <div className="hok-hiw-switcher-left">
          <span className="hok-hiw-editing-label">EDITING</span>
          <div className="hok-hiw-segmented-tabs">
            <button
              type="button"
              className={`hok-hiw-tab-btn ${activePane === 'Shop' ? 'active' : ''}`}
              onClick={() => setActivePane('Shop')}
            >
              {settings.tabA || 'I want to shop'}
            </button>
            <button
              type="button"
              className={`hok-hiw-tab-btn ${activePane === 'Sell' ? 'active' : ''}`}
              onClick={() => setActivePane('Sell')}
            >
              {settings.tabB || 'I want to sell'}
            </button>
          </div>
        </div>
        <div className="hok-hiw-switcher-right">
          {activePane === 'Shop'
            ? 'What somebody buying sees. 4 steps.'
            : 'What somebody listing sees. 3 steps, then the card below — not a fourth step.'}
        </div>
      </div>

      {/* Card 1 — The words above both panes (Spec 8.2.1) */}
      <Card
        id="hiw-words-card"
        title="The words above both panes"
        sub="Shared by both. The tab labels are what the customer clicks between."
      >
        <div className="hok-hiw-field-stack">
          <div id="hiw-eyebrow">
            <Field label="Eyebrow">
              <input
                type="text"
                className="hok-field-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Simple by Design"
              />
            </Field>
          </div>

          <div id="hiw-heading">
            <Field
              label="Heading"
              hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
            >
              <textarea
                className="hok-field-textarea"
                rows={2}
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="How House of Kaira *works*"
              />
            </Field>
            <ReadsAsMirror text={settings.heading} />
          </div>

          <div className="hok-hiw-grid-2col">
            <div id="hiw-tab-a">
              <Field label="Left tab">
                <input
                  type="text"
                  className="hok-field-input"
                  value={settings.tabA}
                  onChange={(e) => onChange({ ...settings, tabA: e.target.value })}
                  placeholder="I want to shop"
                />
              </Field>
            </div>

            <div id="hiw-tab-b">
              <Field label="Right tab">
                <input
                  type="text"
                  className="hok-field-input"
                  value={settings.tabB}
                  onChange={(e) => onChange({ ...settings, tabB: e.target.value })}
                  placeholder="I want to sell"
                />
              </Field>
            </div>
          </div>

          <Field
            label="Which pane opens first"
            hint={`Whichever is open on load is the story most visitors read. Currently ${
              settings.open === 'Sell' ? settings.tabB || 'I want to sell' : settings.tabA || 'I want to shop'
            }.`}
          >
            <select
              className="hok-field-select"
              value={settings.open}
              onChange={(e) => onChange({ ...settings, open: e.target.value as 'Shop' | 'Sell' })}
            >
              <option value="Shop">Shop</option>
              <option value="Sell">Sell</option>
            </select>
          </Field>
        </div>
      </Card>

      {/* Card 2 — Steps Deck & Inspector for active pane (Spec 8.2.2 & 12.1) */}
      {activePane === 'Shop' ? (
        <>
          <Card
            id="hiw-shop-steps"
            title="“I want to shop” — the steps"
            sub="Four steps across on desktop, stacked in the app."
          >
            <Deck
              arrangement="d4"
              items={shopDeckItems}
              selectedIndex={selectedShopIndex}
              onSelectIndex={setSelectedShopIndex}
              onMoveEarlier={(idx) => moveShopStep(idx, 'up')}
              onMoveLater={(idx) => moveShopStep(idx, 'down')}
              onRemove={handleRemoveShopStep}
              removeLabel="Remove"
              onAddTile={handleAddShopStep}
              addLabel="Add a step"
              maxReached={settings.shop.length >= 4}
            />

            {settings.shop.length >= 4 && (
              <p className="hok-hiw-limit-note">
                4 steps is the most this row fits on the storefront. Remove one to add another.
              </p>
            )}

            <Inspector
              kicker={`EDITING STEP ${selectedShopIndex !== null ? selectedShopIndex + 1 : 1}`}
              itemName={selectedShopStep ? selectedShopStep.t : undefined}
              isOpen={selectedShopIndex !== null && !!selectedShopStep}
              emptyText="Pick a step above to set its icon, title and description."
            >
              {selectedShopStep && selectedShopIndex !== null && (
                <div className="hok-hiw-inspector-fields">
                  <Field label="Title">
                    <input
                      type="text"
                      className="hok-field-input"
                      value={selectedShopStep.t}
                      onChange={(e) => updateShopStep(selectedShopIndex, { t: e.target.value })}
                      placeholder="Browse & Discover"
                    />
                  </Field>

                  <Field
                    label="Description"
                    tokenCapable
                    value={selectedShopStep.d}
                    onTokenInsert={(tok) =>
                      updateShopStep(selectedShopIndex, {
                        d: selectedShopStep.d ? `${selectedShopStep.d} ${tok}` : tok
                      })
                    }
                  >
                    <textarea
                      className="hok-field-textarea"
                      rows={3}
                      value={selectedShopStep.d}
                      onChange={(e) => updateShopStep(selectedShopIndex, { d: e.target.value })}
                      placeholder="Explore thousands of designer pieces across rent, preloved, and new categories — filtered by occasion, budget, and aesthetic."
                    />
                  </Field>

                  <Field
                    label="Icon"
                    hint="The storefront draws stroked line icons. There is no emoji anywhere on the page."
                  >
                    <div className="hok-hiw-icon-grid">
                      {ICON_NAMES.map((ico) => {
                        const isSelected = selectedShopStep.ico === ico;
                        return (
                          <button
                            key={ico}
                            type="button"
                            className={`hok-hiw-icon-btn ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => updateShopStep(selectedShopIndex, { ico })}
                            title={ico}
                          >
                            <HomepageLineIcon name={ico} size={14} />
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              )}
            </Inspector>
          </Card>

          <div className="hok-hiw-bottom-note">
            The selling pane carries a card at the end instead of a fourth step. Switch to{' '}
            <button
              type="button"
              className="hok-hiw-switch-inline-link"
              onClick={() => setActivePane('Sell')}
            >
              "{settings.tabB || 'I want to sell'}"
            </button>{' '}
            above to edit it.
          </div>
        </>
      ) : (
        <>
          <Card
            id="hiw-sell-steps"
            title="“I want to sell” — the steps"
            sub="Three steps across, then the card below fills the fourth column."
          >
            <Deck
              arrangement="d4"
              items={sellDeckItems}
              selectedIndex={selectedSellIndex}
              onSelectIndex={setSelectedSellIndex}
              onMoveEarlier={(idx) => moveSellStep(idx, 'up')}
              onMoveLater={(idx) => moveSellStep(idx, 'down')}
              onRemove={handleRemoveSellStep}
              removeLabel="Remove"
              onAddTile={handleAddSellStep}
              addLabel="Add a step"
              maxReached={settings.sell.length >= 3}
            />

            {settings.sell.length >= 3 && (
              <p className="hok-hiw-limit-note">
                3 steps is the most this row fits on the storefront. Remove one to add another.
              </p>
            )}

            <Inspector
              kicker={`EDITING STEP ${selectedSellIndex !== null ? selectedSellIndex + 1 : 1}`}
              itemName={selectedSellStep ? selectedSellStep.t : undefined}
              isOpen={selectedSellIndex !== null && !!selectedSellStep}
              emptyText="Pick a step above to set its icon, title and description."
            >
              {selectedSellStep && selectedSellIndex !== null && (
                <div className="hok-hiw-inspector-fields">
                  <Field label="Title">
                    <input
                      type="text"
                      className="hok-field-input"
                      value={selectedSellStep.t}
                      onChange={(e) => updateSellStep(selectedSellIndex, { t: e.target.value })}
                      placeholder="Photograph & List"
                    />
                  </Field>

                  <Field
                    label="Description"
                    tokenCapable
                    value={selectedSellStep.d}
                    onTokenInsert={(tok) =>
                      updateSellStep(selectedSellIndex, {
                        d: selectedSellStep.d ? `${selectedSellStep.d} ${tok}` : tok
                      })
                    }
                  >
                    <textarea
                      className="hok-field-textarea"
                      rows={3}
                      value={selectedSellStep.d}
                      onChange={(e) => updateSellStep(selectedSellIndex, { d: e.target.value })}
                      placeholder="Upload a few photos of your piece, set your price, and go live in under 10 minutes."
                    />
                  </Field>

                  <Field
                    label="Icon"
                    hint="The storefront draws stroked line icons. There is no emoji anywhere on the page."
                  >
                    <div className="hok-hiw-icon-grid">
                      {ICON_NAMES.map((ico) => {
                        const isSelected = selectedSellStep.ico === ico;
                        return (
                          <button
                            key={ico}
                            type="button"
                            className={`hok-hiw-icon-btn ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => updateSellStep(selectedSellIndex, { ico })}
                            title={ico}
                          >
                            <HomepageLineIcon name={ico} size={14} />
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              )}
            </Inspector>
          </Card>

          {/* Card 3: The card at the end of this pane (Spec 8.2 & 12.1) */}
          <div id="hiw-sell-card">
            <Card
              title="The card at the end of this pane"
              sub="Not a step — the argument for listing, and the button that acts on it."
            >
              <div className="hok-hiw-field-stack">
                <PillToggle
                  checked={settings.sellCard.on}
                  onChange={(checked) =>
                    onChange({
                      ...settings,
                      sellCard: { ...settings.sellCard, on: checked }
                    })
                  }
                  label="Show the card"
                />

                <Field
                  label="Headline"
                  hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
                >
                  <textarea
                    className="hok-field-textarea"
                    rows={2}
                    value={settings.sellCard.head}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        sellCard: { ...settings.sellCard, head: e.target.value }
                      })
                    }
                    placeholder="The hours of *craftsmanship* on that piece deserve more than a dark wardrobe shelf."
                  />
                </Field>
                <ReadsAsMirror text={settings.sellCard.head} />

                <Field
                  label="Body"
                  tokenCapable
                  value={settings.sellCard.body}
                  onTokenInsert={(tok) =>
                    onChange({
                      ...settings,
                      sellCard: {
                        ...settings.sellCard,
                        body: settings.sellCard.body ? `${settings.sellCard.body} ${tok}` : tok
                      }
                    })
                  }
                >
                  <textarea
                    className="hok-field-textarea"
                    rows={2}
                    value={settings.sellCard.body}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        sellCard: { ...settings.sellCard, body: e.target.value }
                      })
                    }
                    placeholder="Give your occasion wear another life. Let someone else fall in love with it — and earn while you do."
                  />
                </Field>

                <Field
                  label="Pull quote"
                  hint="Set in italics under the body, in gold."
                >
                  <input
                    type="text"
                    className="hok-field-input"
                    value={settings.sellCard.quote}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        sellCard: { ...settings.sellCard, quote: e.target.value }
                      })
                    }
                    placeholder="“Every piece has a story. Don't let it end with you.”"
                  />
                </Field>

                <div className="hok-hiw-grid-2col">
                  <Field label="Button label">
                    <input
                      type="text"
                      className="hok-field-input"
                      value={settings.sellCard.cta.lbl}
                      onChange={(e) =>
                        onChange({
                          ...settings,
                          sellCard: {
                            ...settings.sellCard,
                            cta: { ...settings.sellCard.cta, lbl: e.target.value }
                          }
                        })
                      }
                      placeholder="List Your Piece →"
                    />
                  </Field>

                  <Field label="Button link">
                    <input
                      type="text"
                      className="hok-field-input"
                      value={settings.sellCard.cta.url}
                      onChange={(e) =>
                        onChange({
                          ...settings,
                          sellCard: {
                            ...settings.sellCard,
                            cta: { ...settings.sellCard.cta, url: e.target.value }
                          }
                        })
                      }
                      placeholder="/list-your-piece"
                    />
                  </Field>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
