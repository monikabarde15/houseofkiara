/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · SHOP BY OCCASION (Spec 8.5)
   Note: Present in Admin, but Not Built on Storefront (vis.occasions = false)
========================================================= */

import React from 'react';
import './ShopByOccasionBand.css';
import { OccasionsSettings, HealthIssue } from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';

interface ShopByOccasionBandProps {
  settings: OccasionsSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: OccasionsSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

const MASTER_OCCASIONS = [
  { id: 'wedding', name: 'Wedding', liveCount: 3 },
  { id: 'sangeet', name: 'Sangeet', liveCount: 2 },
  { id: 'reception', name: 'Reception', liveCount: 2 },
  { id: 'mehendi', name: 'Mehendi', liveCount: 1 },
  { id: 'cocktail', name: 'Cocktail', liveCount: 1 },
  { id: 'engagement', name: 'Engagement', liveCount: 0 }
];

export const ShopByOccasionBand: React.FC<ShopByOccasionBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const deckItems: DeckTileItem[] = MASTER_OCCASIONS.map((occ, idx) => ({
    id: `occ-tile-${occ.id}`,
    position: idx + 1,
    title: occ.name,
    sub: `${occ.liveCount} live pieces`,
    pictureHeight: 60
  }));

  return (
    <div className="hok-occasions-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">Shop by Occasion</h2>
        <span className="hok-hp-editor-band-counter">Band 5 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        Occasions are already marked as featured in Master Data, but the storefront has no band to put them in yet. The copy is ready; the front end is not.
      </p>

      {/* 7.1 Visibility Row with "Not built" pill */}
      <div className="hok-hp-visibility-row" id="occasions-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
          <span className="hok-occ-not-built-pill">Not built</span>
        </div>
        <span className="hok-hp-visibility-consequence">
          The storefront has no markup for this band yet. Switching it on here will not make it appear.
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

      {/* Standing Information Block (Spec 8.5 & 12.1) */}
      <div className="hok-occ-standing-info">
        This band is not on the storefront yet. The occasions registry has carried a Featured flag since Master Data was built, and 5 occasions are ticked — but no band on the live homepage renders them. Everything below is ready for the day the front end is built. Until then the switch above has nothing to turn on.
      </div>

      {/* Card 1 — The words (Spec 8.5.1) */}
      <Card
        id="occasions-words-card"
        title="The words"
      >
        <div className="hok-occ-field-stack">
          <div id="occasions-eyebrow">
            <Field label="Eyebrow">
              <input
                type="text"
                className="hok-field-input"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                placeholder="Dressed for the Day"
              />
            </Field>
          </div>

          <div id="occasions-heading">
            <Field
              label="Heading"
              hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
            >
              <textarea
                className="hok-field-textarea"
                rows={2}
                value={settings.heading}
                onChange={(e) => onChange({ ...settings, heading: e.target.value })}
                placeholder="Shop by *Occasion*"
              />
            </Field>
            <ReadsAsMirror text={settings.heading} />
          </div>

          <div className="hok-occ-grid-2col">
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
                placeholder="All Occasions →"
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
                placeholder="/occasions"
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Card 2 — Which occasions would appear (Spec 8.5.2) */}
      <Card
        title="Which occasions would appear"
        sub="Owned by the occasions registry."
        doorLabel="Open Master Data"
        onDoorClick={() => onNavigateToModule && onNavigateToModule('Master Data')}
      >
        <div className="hok-occ-deck-wrapper">
          <Deck
            arrangement="d4"
            items={deckItems}
            selectedIndex={null}
            onSelectIndex={() => {}}
            onRemove={() => onNavigateToModule && onNavigateToModule('Master Data')}
            removeLabel="Take off"
          />

          <p className="hok-occ-note">
            The same Featured switch appears on the occasion card in Master Data. Each occasion already has its own landing page and its own meta title — this band would only be the door to them.
          </p>
        </div>
      </Card>

      {/* Card 3 — Layout (Spec 8.5.3) */}
      <Card title="Layout">
        <div className="hok-occ-field-stack">
          <PillToggle
            checked={settings.showCount}
            onChange={(checked) => onChange({ ...settings, showCount: checked })}
            label="Show the live piece count"
          />

          <div className="hok-occ-grid-2col">
            <Field label="Desktop">
              <select
                className="hok-field-select"
                value={settings.layout}
                onChange={(e) =>
                  onChange({ ...settings, layout: e.target.value as 'Even grid' | 'Mosaic' })
                }
              >
                <option value="Even grid">Even grid</option>
                <option value="Mosaic">Mosaic</option>
              </select>
            </Field>

            <Field label="Button wording">
              <input
                type="text"
                className="hok-field-input"
                value={settings.ctaLbl}
                onChange={(e) => onChange({ ...settings, ctaLbl: e.target.value })}
                placeholder="Shop the Edit"
              />
            </Field>
          </div>
        </div>
      </Card>
    </div>
  );
};
