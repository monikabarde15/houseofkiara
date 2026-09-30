/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · HOW IT WORKS BAND (Spec 8.2)
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
import { HomepageLineIcon, ICON_NAMES, HomepageIconName } from '../../shared/icons/HomepageIcons';

interface HowItWorksBandProps {
  settings: HowItWorksSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: HowItWorksSettings) => void;
  issues: HealthIssue[];
}

export const HowItWorksBand: React.FC<HowItWorksBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues
}) => {
  const [selectedShopIndex, setSelectedShopIndex] = useState<number | null>(null);
  const [selectedSellIndex, setSelectedSellIndex] = useState<number | null>(null);

  // Shop Deck Items
  const shopDeckItems: DeckTileItem[] = settings.shop.map((st, idx) => ({
    id: st.id || `shop-${idx + 1}`,
    position: idx + 1,
    title: st.t || `Step ${idx + 1}`,
    sub: st.d ? (st.d.length > 40 ? st.d.slice(0, 40) + '…' : st.d) : 'Empty description',
    badge: `ico: ${st.ico || 'none'}`
  }));

  // Sell Deck Items
  const sellDeckItems: DeckTileItem[] = settings.sell.map((st, idx) => ({
    id: st.id || `sell-${idx + 1}`,
    position: idx + 1,
    title: st.t || `Step ${idx + 1}`,
    sub: st.d ? (st.d.length > 40 ? st.d.slice(0, 40) + '…' : st.d) : 'Empty description',
    badge: `ico: ${st.ico || 'none'}`
  }));

  const selectedShopStep = selectedShopIndex !== null ? settings.shop[selectedShopIndex] : null;
  const selectedSellStep = selectedSellIndex !== null ? settings.sell[selectedSellIndex] : null;

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

  return (
    <div className="hok-band-editor hok-how-it-works-band">
      {/* Band Header Card */}
      <Card
        variant="elevated"
        header={{
          eyebrow: 'BAND 2 · HOW IT WORKS',
          title: 'How House of Kaira Works',
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
          Dual-tab explainer with 4 shopping steps and 3 selling steps, plus the closing consignment teaser card.
          Asterisk wrapping like <code>*works*</code> renders in the live gold italic serif.
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

      {/* Card 1: The words above both panes */}
      <Card
        header={{
          eyebrow: 'BAND HEADINGS & TABS',
          title: 'The words above both panes',
          meta: 'Shared by both Shop and Sell panes'
        }}
      >
        <div className="hok-hiw-words-grid">
          <div id="hiw-eyebrow">
            <Field
              label="Eyebrow"
              hint="Small caps label above the main heading"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Simple by Design"
              />
            </Field>
          </div>

          <div id="hiw-heading">
            <Field
              label="Main Heading"
              hint="Wrap *words in asterisks* for gold italic serif font"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="How House of Kaira *works*"
              />
            </Field>
          </div>
        </div>

        <div className="hok-hiw-mirror-box">
          <span className="hok-hiw-mirror-label">Live Storefront Heading Preview</span>
          <ReadsAsMirror
            eyebrow={settings.eyebrow}
            heading={settings.heading}
            className="hok-hiw-reads-as"
          />
        </div>

        <div className="hok-divider" />

        <div className="hok-hiw-tabs-config">
          <div id="hiw-tab-a">
            <Field
              label="Tab 1 Label (Shopping)"
              hint="Customer facing label for the first tab"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.tabA}
                onChange={(e) => onChange({ ...settings, tabA: e.target.value })}
                placeholder="I want to shop"
              />
            </Field>
          </div>

          <div id="hiw-tab-b">
            <Field
              label="Tab 2 Label (Selling)"
              hint="Customer facing label for the second tab"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.tabB}
                onChange={(e) => onChange({ ...settings, tabB: e.target.value })}
                placeholder="I want to sell"
              />
            </Field>
          </div>

          <Field
            label="Default Open Pane"
            hint="Which tab is active on initial page load"
          >
            <PillToggle
              options={[
                { label: settings.tabA || 'Shop', value: 'Shop' },
                { label: settings.tabB || 'Sell', value: 'Sell' }
              ]}
              value={settings.open}
              onChange={(v) => onChange({ ...settings, open: v as 'Shop' | 'Sell' })}
            />
          </Field>
        </div>
      </Card>

      {/* Card 2: "I want to shop" pane */}
      <Card
        header={{
          eyebrow: 'TAB 1 · SHOPPING FLOW',
          title: `"${settings.tabA || 'I want to shop'}" Steps`,
          meta: `${settings.shop.length} steps configured · 4-across deck`
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 12 }}>
          Click any step tile below to edit its icon, title, description, and order.
        </p>

        <div id="hiw-shop-steps" className="hok-hiw-deck-wrapper">
          <Deck
            arrangement="d4"
            items={shopDeckItems}
            selectedIndex={selectedShopIndex}
            onSelect={(idx) => setSelectedShopIndex(idx)}
            renderCustomContent={(item, idx) => {
              const step = settings.shop[idx];
              return (
                <div className="hok-hiw-step-tile">
                  <div className="hok-hiw-tile-icon-box">
                    <HomepageLineIcon name={step.ico} size={20} />
                  </div>
                  <div className="hok-hiw-tile-step-num">STEP {idx + 1}</div>
                  <div className="hok-hiw-tile-step-title">{step.t || 'Untitled'}</div>
                  <p className="hok-hiw-tile-step-desc">{step.d}</p>
                </div>
              );
            }}
          />

          {selectedShopStep && selectedShopIndex !== null && (
            <Inspector
              title={`Edit Step ${selectedShopIndex + 1}: ${selectedShopStep.t || 'Untitled'}`}
              position={selectedShopIndex + 1}
              totalItems={settings.shop.length}
              onClose={() => setSelectedShopIndex(null)}
              onMoveUp={selectedShopIndex > 0 ? () => moveShopStep(selectedShopIndex, 'up') : undefined}
              onMoveDown={
                selectedShopIndex < settings.shop.length - 1
                  ? () => moveShopStep(selectedShopIndex, 'down')
                  : undefined
              }
            >
              <div className="hok-hiw-inspector-content">
                <Field
                  label="Step Icon"
                  hint="Pick 1 of 16 stroked line icons"
                >
                  <div className="hok-hiw-icon-selector">
                    {ICON_NAMES.map((ico) => {
                      const isSelected = selectedShopStep.ico === ico;
                      return (
                        <button
                          key={ico}
                          type="button"
                          className={`hok-hiw-icon-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => updateShopStep(selectedShopIndex, { ico })}
                          title={ico}
                        >
                          <HomepageLineIcon name={ico} size={16} />
                          <span className="hok-hiw-icon-name">{ico}</span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field
                  label="Step Title"
                  hint="Action title (e.g. 'Explore & select')"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedShopStep.t}
                    onChange={(e) => updateShopStep(selectedShopIndex, { t: e.target.value })}
                    placeholder="Explore & select"
                  />
                </Field>

                <Field
                  label="Step Description"
                  hint="Brief guidance explaining this step (1–2 sentences)"
                >
                  <textarea
                    className="hok-textarea"
                    rows={3}
                    value={selectedShopStep.d}
                    onChange={(e) => updateShopStep(selectedShopIndex, { d: e.target.value })}
                    placeholder="Browse our curated collection of designer wear for any occasion."
                  />
                </Field>
              </div>
            </Inspector>
          )}
        </div>
      </Card>

      {/* Card 3: "I want to sell" pane */}
      <Card
        header={{
          eyebrow: 'TAB 2 · SELLING FLOW',
          title: `"${settings.tabB || 'I want to sell'}" Steps`,
          meta: `${settings.sell.length} steps configured · 3-across deck`
        }}
      >
        <p className="hok-field-hint" style={{ marginBottom: 12 }}>
          Click any step tile below to edit its icon, title, description, and order.
        </p>

        <div id="hiw-sell-steps" className="hok-hiw-deck-wrapper">
          <Deck
            arrangement="d3"
            items={sellDeckItems}
            selectedIndex={selectedSellIndex}
            onSelect={(idx) => setSelectedSellIndex(idx)}
            renderCustomContent={(item, idx) => {
              const step = settings.sell[idx];
              return (
                <div className="hok-hiw-step-tile">
                  <div className="hok-hiw-tile-icon-box">
                    <HomepageLineIcon name={step.ico} size={20} />
                  </div>
                  <div className="hok-hiw-tile-step-num">STEP {idx + 1}</div>
                  <div className="hok-hiw-tile-step-title">{step.t || 'Untitled'}</div>
                  <p className="hok-hiw-tile-step-desc">{step.d}</p>
                </div>
              );
            }}
          />

          {selectedSellStep && selectedSellIndex !== null && (
            <Inspector
              title={`Edit Step ${selectedSellIndex + 1}: ${selectedSellStep.t || 'Untitled'}`}
              position={selectedSellIndex + 1}
              totalItems={settings.sell.length}
              onClose={() => setSelectedSellIndex(null)}
              onMoveUp={selectedSellIndex > 0 ? () => moveSellStep(selectedSellIndex, 'up') : undefined}
              onMoveDown={
                selectedSellIndex < settings.sell.length - 1
                  ? () => moveSellStep(selectedSellIndex, 'down')
                  : undefined
              }
            >
              <div className="hok-hiw-inspector-content">
                <Field
                  label="Step Icon"
                  hint="Pick 1 of 16 stroked line icons"
                >
                  <div className="hok-hiw-icon-selector">
                    {ICON_NAMES.map((ico) => {
                      const isSelected = selectedSellStep.ico === ico;
                      return (
                        <button
                          key={ico}
                          type="button"
                          className={`hok-hiw-icon-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => updateSellStep(selectedSellIndex, { ico })}
                          title={ico}
                        >
                          <HomepageLineIcon name={ico} size={16} />
                          <span className="hok-hiw-icon-name">{ico}</span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field
                  label="Step Title"
                  hint="Action title (e.g. 'Submit your pieces')"
                >
                  <input
                    type="text"
                    className="hok-input"
                    value={selectedSellStep.t}
                    onChange={(e) => updateSellStep(selectedSellIndex, { t: e.target.value })}
                    placeholder="Submit your pieces"
                  />
                </Field>

                <Field
                  label="Step Description"
                  hint="Brief guidance explaining this step (1–2 sentences)"
                >
                  <textarea
                    className="hok-textarea"
                    rows={3}
                    value={selectedSellStep.d}
                    onChange={(e) => updateSellStep(selectedSellIndex, { d: e.target.value })}
                    placeholder="Share photos and details of your authentic luxury Indian designer outfits."
                  />
                </Field>
              </div>
            </Inspector>
          )}
        </div>
      </Card>

      {/* Card 4: The card at the end of the selling pane */}
      <div id="hiw-sell-card">
        <Card
          header={{
            eyebrow: 'SELLING CALL TO ACTION',
            title: 'The card at the end of this pane',
            meta: settings.sellCard.on ? 'SHOWING' : 'HIDDEN',
            actions: (
              <PillToggle
                options={[
                  { label: 'Show', value: true },
                  { label: 'Hide', value: false }
                ]}
                value={settings.sellCard.on}
                onChange={(v) =>
                  onChange({
                    ...settings,
                    sellCard: { ...settings.sellCard, on: Boolean(v) }
                  })
                }
              />
            )
          }}
        >
        <p className="hok-field-hint" style={{ marginBottom: 14 }}>
          Closing teaser card rendered alongside or at the end of the selling steps encouraging consignors to apply.
        </p>

        <div className="hok-hiw-sellcard-grid">
          <div className="hok-hiw-sellcard-inputs">
            <Field
              label="Card Heading"
              hint="Main statement or prompt"
            >
              <input
                type="text"
                className="hok-input"
                value={settings.sellCard.head}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    sellCard: { ...settings.sellCard, head: e.target.value }
                  })
                }
                placeholder="Why consign with us?"
              />
            </Field>

            <Field
              label="Card Body"
              hint="Supporting sentence explaining the consignment benefit"
            >
              <textarea
                className="hok-textarea"
                rows={2}
                value={settings.sellCard.body}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    sellCard: { ...settings.sellCard, body: e.target.value }
                  })
                }
                placeholder="Join hundreds of owners earning passive income from their wardrobes."
              />
            </Field>

            <Field
              label="Consignor Quote / Testimonial"
              hint="Social proof snippet shown in italic"
            >
              <textarea
                className="hok-textarea"
                rows={2}
                value={settings.sellCard.quote}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    sellCard: { ...settings.sellCard, quote: e.target.value }
                  })
                }
                placeholder="House of Kaira made renting my bridal lehenga effortless."
              />
            </Field>

            <div className="hok-hiw-cta-row">
              <Field
                label="Button Label"
                hint="CTA text"
              >
                <input
                  type="text"
                  className="hok-input"
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
                  placeholder="Apply to Consign"
                />
              </Field>

              <Field
                label="Destination URL"
                hint="Relative link or modal trigger"
              >
                <input
                  type="text"
                  className="hok-input"
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
                  placeholder="/sell"
                />
              </Field>
            </div>
          </div>

          {/* Live Preview of Sell Card */}
          <div className="hok-hiw-sellcard-preview-wrap">
            <span className="hok-hiw-preview-tag">STOREFRONT CARD PREVIEW</span>
            <div className="hok-hiw-sellcard-preview">
              <div className="hok-hiw-sellcard-preview-head">{settings.sellCard.head || 'Why consign?'}</div>
              <div className="hok-hiw-sellcard-preview-body">{settings.sellCard.body}</div>
              {settings.sellCard.quote && (
                <div className="hok-hiw-sellcard-preview-quote">
                  &ldquo;{settings.sellCard.quote.replace(/^["“”]|["“”]$/g, '')}&rdquo;
                </div>
              )}
              {settings.sellCard.cta.lbl && (
                <div className="hok-hiw-sellcard-preview-btn">
                  {settings.sellCard.cta.lbl} →
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};
