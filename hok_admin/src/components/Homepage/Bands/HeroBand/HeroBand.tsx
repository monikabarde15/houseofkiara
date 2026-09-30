/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · HERO BAND (Spec 8.1)
========================================================= */

import React, { useState } from 'react';
import './HeroBand.css';
import { HeroSettings, HealthIssue } from '../../types/homepage.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { ReadsAsMirror } from '../../shared/ReadsAsMirror/ReadsAsMirror';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { MediaSlot } from '../../shared/MediaSlot/MediaSlot';
import { Deck } from '../../shared/Deck/Deck';
import { DeckTileItem } from '../../shared/Deck/DeckTile';
import { Inspector } from '../../shared/Deck/Inspector';
import { PieceCard } from '../../shared/PieceCard/PieceCard';

interface HeroBandProps {
  settings: HeroSettings;
  isShown: boolean;
  onToggleShown: (shown: boolean) => void;
  onChange: (updated: HeroSettings) => void;
  issues: HealthIssue[];
  onNavigateToModule?: (mod: string) => void;
}

const SAMPLE_PIECES = [
  {
    sku: 'HOK-SAB-002',
    name: 'Gulabi Silk Bridal Lehenga',
    designer: 'Sabyasachi',
    category: 'Bridal Lehenga',
    size: 'M',
    status: 'Live' as const,
    priceStd: 6400,
    minDays: 3,
    resalePrice: 110000,
    mode: 'Rental/Preloved'
  },
  {
    sku: 'HOK-MM-001',
    name: 'Ivory Embroidered Sherwani',
    designer: 'Manish Malhotra',
    category: 'Sherwani',
    size: '40',
    status: 'Sold' as const,
    resalePrice: 38000,
    mode: 'Preloved'
  },
  {
    sku: 'HOK-TT-001',
    name: 'Midnight Blue Crepe Saree',
    designer: 'Tarun Tahiliani',
    category: 'Saree',
    size: 'Free',
    status: 'Live' as const,
    resalePrice: 24500,
    mode: 'Preloved'
  },
  {
    sku: 'HOK-AD-001',
    name: 'Rose Georgette Anarkali',
    designer: 'Anita Dongre',
    category: 'Anarkali',
    size: 'S',
    status: 'Live' as const,
    priceStd: 4500,
    minDays: 3,
    mode: 'Rental'
  }
];

export const HeroBand: React.FC<HeroBandProps> = ({
  settings,
  isShown,
  onToggleShown,
  onChange,
  issues,
  onNavigateToModule
}) => {
  const [selectedStatIndex, setSelectedStatIndex] = useState<number | null>(null);

  // Stats deck items
  const statDeckItems: DeckTileItem[] = settings.stats.map((st, idx) => ({
    id: st.id,
    position: idx + 1,
    title: `${st.val} ${st.lbl}`,
    sub: `Source: ${st.src}`,
    pictureHeight: 52
  }));

  const selectedStat = selectedStatIndex !== null ? settings.stats[selectedStatIndex] : null;

  // Selected Piece for Badge
  const badgePiece = settings.badge.sku
    ? SAMPLE_PIECES.find((p) => p.sku === settings.badge.sku) || null
    : null;

  return (
    <div className="hok-hero-band">
      {/* 7. Editor Shell Top */}
      <div className="hok-hp-editor-heading-row">
        <h2 className="hok-hp-editor-band-title">Hero</h2>
        <span className="hok-hp-editor-band-counter">Band 1 of 9</span>
      </div>

      <p className="hok-hp-editor-band-desc">
        The first screen. One picture, with the words either beside it or over it — desktop and the app choose separately.
      </p>

      {/* 7.1 Visibility Row */}
      <div className="hok-hp-visibility-row" id="hero-visibility">
        <div className="hok-hp-visibility-left">
          <PillToggle
            checked={isShown}
            onChange={onToggleShown}
            label="Show this band on the homepage"
          />
        </div>
        <span className="hok-hp-visibility-consequence">
          {isShown
            ? 'Showing on the live homepage, in position 1.'
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

      {/* Card 1 — The words */}
      <Card
        id="hero-words-card"
        title="The words"
        sub="The eyebrow, the headline and the line under it."
      >
        {/* Eyebrow */}
        <div id="hero-eyebrow">
          <Field
            label="Eyebrow"
            hint="The small capitals above the headline, with a rule to its left."
          >
            <input
              type="text"
              className="hok-field-input"
              value={settings.eyebrow}
              onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
            />
          </Field>
        </div>

        {/* Headline */}
        <div id="hero-heading">
          <Field
            label="Headline"
            hint="A line break starts a new line. Wrap one word in *asterisks* to set it in the italic gold serif, the way the storefront does."
          >
            <textarea
              className="hok-field-textarea"
              rows={2}
              value={settings.heading}
              onChange={(e) => onChange({ ...settings, heading: e.target.value })}
            />
          </Field>
          <ReadsAsMirror text={settings.heading} />
        </div>

        {/* Headline on mobile */}
        <div id="hero-heading-mob">
          <Field
            label="Headline on mobile"
            hint="The app sets it on one line where the desktop page breaks it in two. Leave blank to use the desktop headline."
          >
            <textarea
              className="hok-field-textarea"
              rows={2}
              value={settings.headingMob}
              onChange={(e) => onChange({ ...settings, headingMob: e.target.value })}
            />
          </Field>
          <ReadsAsMirror text={settings.headingMob || settings.heading.replace(/\n/g, ' ')} />
        </div>

        {/* Sub-heading */}
        <div id="hero-sub">
          <Field
            label="Sub-heading"
            tokenCapable
            value={settings.sub}
            onTokenInsert={(val) => onChange({ ...settings, sub: val })}
          >
            <textarea
              className="hok-field-textarea"
              rows={2}
              value={settings.sub}
              onChange={(e) => onChange({ ...settings, sub: e.target.value })}
            />
          </Field>
        </div>

        {/* Sub-heading on mobile */}
        <div id="hero-sub-mob">
          <Field
            label="Sub-heading on mobile"
            tokenCapable
            value={settings.subMob}
            onTokenInsert={(val) => onChange({ ...settings, subMob: val })}
            hint="Blank uses the desktop line, which is what the current app build does. An earlier build carried a shorter one: Rent, buy preloved, or discover new designer pieces — curated for India's most discerning occasions."
          >
            <textarea
              className="hok-field-textarea"
              rows={2}
              value={settings.subMob}
              onChange={(e) => onChange({ ...settings, subMob: e.target.value })}
              placeholder={settings.subMobV3}
            />
          </Field>
        </div>
      </Card>

      {/* Card 2 — Buttons */}
      <Card id="hero-buttons-card" title="Buttons">
        <div className="hok-hero-grid-2col">
          <div id="hero-cta-a">
            <Field label="Primary label">
              <input
                type="text"
                className="hok-field-input"
                value={settings.ctaA.lbl}
                onChange={(e) =>
                  onChange({ ...settings, ctaA: { ...settings.ctaA, lbl: e.target.value } })
                }
              />
            </Field>
          </div>
          <div>
            <Field label="Primary link">
              <input
                type="text"
                className="hok-field-input"
                value={settings.ctaA.url}
                onChange={(e) =>
                  onChange({ ...settings, ctaA: { ...settings.ctaA, url: e.target.value } })
                }
              />
            </Field>
          </div>
        </div>

        <div className="hok-hero-grid-2col">
          <div id="hero-cta-b">
            <Field label="Secondary label">
              <input
                type="text"
                className="hok-field-input"
                value={settings.ctaB.lbl}
                onChange={(e) =>
                  onChange({ ...settings, ctaB: { ...settings.ctaB, lbl: e.target.value } })
                }
              />
            </Field>
          </div>
          <div>
            <Field label="Secondary link">
              <input
                type="text"
                className="hok-field-input"
                value={settings.ctaB.url}
                onChange={(e) =>
                  onChange({ ...settings, ctaB: { ...settings.ctaB, url: e.target.value } })
                }
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Card 3 — The figures under the buttons */}
      <Card
        id="hero-stats-toggle"
        title="The figures under the buttons"
        sub="Not on the hero at the moment. The figures are kept here so the row can come back without being retyped."
      >
        <PillToggle
          checked={settings.statsOn}
          onChange={(checked) => onChange({ ...settings, statsOn: checked })}
          label="Show the figures"
          hint={
            settings.statsOn
              ? 'Showing 3 figures below the buttons on the live hero.'
              : 'Switched off, so nothing renders between the buttons and the foot of the band.'
          }
        />

        {settings.statsOn && (
          <div style={{ marginTop: 14 }}>
            <Deck
              items={statDeckItems}
              selectedIndex={selectedStatIndex}
              onSelectIndex={setSelectedStatIndex}
              arrangement="d3"
              onMoveEarlier={(idx) => {
                if (idx > 0) {
                  const updated = [...settings.stats];
                  const temp = updated[idx];
                  updated[idx] = updated[idx - 1];
                  updated[idx - 1] = temp;
                  onChange({ ...settings, stats: updated });
                  setSelectedStatIndex(idx - 1);
                }
              }}
              onMoveLater={(idx) => {
                if (idx < settings.stats.length - 1) {
                  const updated = [...settings.stats];
                  const temp = updated[idx];
                  updated[idx] = updated[idx + 1];
                  updated[idx + 1] = temp;
                  onChange({ ...settings, stats: updated });
                  setSelectedStatIndex(idx + 1);
                }
              }}
              onRemove={(idx) => {
                const updated = settings.stats.filter((_, i) => i !== idx);
                onChange({ ...settings, stats: updated });
                setSelectedStatIndex(null);
              }}
              onAddTile={() => {
                const newStat = {
                  id: `stat-${settings.stats.length + 1}`,
                  val: '100+',
                  lbl: 'New Figure',
                  lblMob: 'Figure',
                  src: 'Typed' as const
                };
                onChange({ ...settings, stats: [...settings.stats, newStat] });
                setSelectedStatIndex(settings.stats.length);
              }}
              addLabel="Add a figure"
            />

            <div style={{ marginTop: 12 }}>
              <Inspector
                isOpen={selectedStatIndex !== null}
                kicker={`EDITING FIGURE ${selectedStatIndex !== null ? selectedStatIndex + 1 : ''}`}
                itemName={selectedStat?.lbl}
                emptyText="Pick a figure above to set its number, label and source."
              >
                {selectedStat && (
                  <>
                    <Field label="Where the figure comes from">
                      <select
                        className="hok-field-select"
                        value={selectedStat.src}
                        onChange={(e) => {
                          const src = e.target.value as any;
                          const updated = [...settings.stats];
                          updated[selectedStatIndex!] = {
                            ...selectedStat,
                            src,
                            val: src === 'Live pieces' ? '5 Live pieces' : src === 'Active designers' ? '11 Designers' : selectedStat.val
                          };
                          onChange({ ...settings, stats: updated });
                        }}
                      >
                        <option value="Typed">Typed</option>
                        <option value="Live pieces">Live pieces (Catalogue count)</option>
                        <option value="Active designers">Active designers (Designer count)</option>
                      </select>
                    </Field>

                    <div className="hok-hero-grid-2col">
                      <Field
                        label="Figure"
                        hint={selectedStat.src !== 'Typed' ? 'Counted automatically from the catalogue.' : undefined}
                      >
                        <input
                          type="text"
                          className="hok-field-input"
                          disabled={selectedStat.src !== 'Typed'}
                          value={selectedStat.val}
                          onChange={(e) => {
                            const updated = [...settings.stats];
                            updated[selectedStatIndex!] = { ...selectedStat, val: e.target.value };
                            onChange({ ...settings, stats: updated });
                          }}
                        />
                      </Field>

                      <Field label="Label">
                        <input
                          type="text"
                          className="hok-field-input"
                          value={selectedStat.lbl}
                          onChange={(e) => {
                            const updated = [...settings.stats];
                            updated[selectedStatIndex!] = { ...selectedStat, lbl: e.target.value };
                            onChange({ ...settings, stats: updated });
                          }}
                        />
                      </Field>
                    </div>

                    <Field label="Label in the app">
                      <input
                        type="text"
                        className="hok-field-input"
                        value={selectedStat.lblMob}
                        onChange={(e) => {
                          const updated = [...settings.stats];
                          updated[selectedStatIndex!] = { ...selectedStat, lblMob: e.target.value };
                          onChange({ ...settings, stats: updated });
                        }}
                        placeholder="The app has less room. Blank uses the desktop label."
                      />
                    </Field>
                  </>
                )}
              </Inspector>
            </div>
          </div>
        )}
      </Card>

      {/* Card 4 — The picture (Desktop) */}
      <Card
        id="hero-picture"
        title="The picture"
        sub="One picture, not a grid. Either the words sit beside it, or it runs the full width with the words over the top."
      >
        <div id="hero-layout" className="hok-hero-grid-2col">
          <Field
            label="Desktop layout"
            hint={
              settings.layout === 'Split'
                ? 'The words sit on a cream panel, the picture fills the other half.'
                : 'The picture fills the band and the words sit over it.'
            }
          >
            <select
              className="hok-field-select"
              value={settings.layout}
              onChange={(e) => onChange({ ...settings, layout: e.target.value as any })}
            >
              <option value="Split">Split</option>
              <option value="Full bleed">Full bleed</option>
            </select>
          </Field>

          {settings.layout === 'Split' ? (
            <Field label="Picture sits on the">
              <select
                className="hok-field-select"
                value={settings.side}
                onChange={(e) => onChange({ ...settings, side: e.target.value as any })}
              >
                <option value="Right">Right</option>
                <option value="Left">Left</option>
              </select>
            </Field>
          ) : (
            <Field
              label="Darkening behind the words (%)"
              hint="Higher is darker. Too low and the headline stops being readable over a busy picture."
            >
              <input
                type="number"
                min={0}
                max={100}
                className="hok-field-input"
                value={settings.dim}
                onChange={(e) => onChange({ ...settings, dim: parseInt(e.target.value) || 0 })}
              />
            </Field>
          )}
        </div>

        {/* Media Slot Desktop */}
        <MediaSlot
          name="Desktop picture"
          needed
          value={settings.img.img}
          altText={settings.img.alt}
          onAltTextChange={(alt) =>
            onChange({ ...settings, img: { ...settings.img, alt } })
          }
          onUpload={(img) =>
            onChange({ ...settings, img: { ...settings.img, img } })
          }
          onRemove={() =>
            onChange({ ...settings, img: { ...settings.img, img: '' } })
          }
          width={settings.layout === 'Full bleed' ? 200 : 132}
          height={settings.layout === 'Full bleed' ? 116 : 176}
          specLine={
            settings.layout === 'Split'
              ? 'Portrait, 1200×1600 or larger. It fills half the band, so the piece should sit in the middle of the frame.'
              : 'Landscape, 2400×1400 or larger. The words sit over it, so keep one side quiet.'
          }
        />

        <Field
          label="Keep this part of the picture in frame"
          hint="Which part survives when the band is cropped on a shorter screen."
        >
          <select
            className="hok-field-select"
            value={settings.img.focal}
            onChange={(e) =>
              onChange({ ...settings, img: { ...settings.img, focal: e.target.value as any } })
            }
          >
            <option value="Top">Top</option>
            <option value="Centre">Centre</option>
            <option value="Bottom">Bottom</option>
          </select>
        </Field>
      </Card>

      {/* Card 5 — The picture — mobile */}
      <Card
        id="hero-picture-mob"
        title="The picture — mobile"
        sub="A phone needs its own crop, so the app carries its own picture rather than squeezing the desktop one."
      >
        <div className="hok-hero-grid-2col">
          <Field label="App layout">
            <select
              className="hok-field-select"
              value={settings.layoutMob}
              onChange={(e) => onChange({ ...settings, layoutMob: e.target.value as any })}
            >
              <option value="Full bleed">Full bleed</option>
              <option value="Split">Split</option>
            </select>
          </Field>

          <Field label="Darkening behind the words (%)">
            <input
              type="number"
              min={0}
              max={100}
              className="hok-field-input"
              value={settings.dimMob}
              onChange={(e) => onChange({ ...settings, dimMob: parseInt(e.target.value) || 0 })}
            />
          </Field>
        </div>

        {/* Media Slot Mobile */}
        <MediaSlot
          name="App picture"
          needed
          value={settings.imgMob.img}
          altText={settings.imgMob.alt}
          onAltTextChange={(alt) =>
            onChange({ ...settings, imgMob: { ...settings.imgMob, alt } })
          }
          onUpload={(img) =>
            onChange({ ...settings, imgMob: { ...settings.imgMob, img } })
          }
          onRemove={() =>
            onChange({ ...settings, imgMob: { ...settings.imgMob, img: '' } })
          }
          width={110}
          height={176}
          specLine="Portrait, 1080×1620 or larger. The words sit over it on the phone, so keep the middle quiet."
        />

        <Field label="Keep this part of the picture in frame">
          <select
            className="hok-field-select"
            value={settings.imgMob.focal}
            onChange={(e) =>
              onChange({ ...settings, imgMob: { ...settings.imgMob, focal: e.target.value as any } })
            }
          >
            <option value="Top">Top</option>
            <option value="Centre">Centre</option>
            <option value="Bottom">Bottom</option>
          </select>
        </Field>
      </Card>

      {/* Card 6 — Badge */}
      <Card
        id="hero-badge"
        title="Badge"
        sub="The small card over the corner of the hero picture. Each device carries it separately — the current app build shows it, an earlier one did not."
      >
        <PillToggle
          checked={settings.badge.on}
          onChange={(checked) =>
            onChange({ ...settings, badge: { ...settings.badge, on: checked } })
          }
          label="Show the badge on desktop"
        />

        <PillToggle
          checked={settings.badge.mob}
          onChange={(checked) =>
            onChange({ ...settings, badge: { ...settings.badge, mob: checked } })
          }
          label="Show the badge in the app"
          hint="The current app build carries it over the picture. An earlier build did not."
        />

        {(settings.badge.on || settings.badge.mob) && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="What it carries">
              <select
                className="hok-field-select"
                value={settings.badge.mode}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    badge: { ...settings.badge, mode: e.target.value as any }
                  })
                }
              >
                <option value="Piece">Piece (Read from catalogue)</option>
                <option value="Message">Message (Typed headline & sub)</option>
              </select>
            </Field>

            {settings.badge.mode === 'Piece' ? (
              <div>
                <Field label="Piece">
                  <select
                    className="hok-field-select"
                    value={settings.badge.sku || ''}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        badge: { ...settings.badge, sku: e.target.value }
                      })
                    }
                  >
                    <option value="">— pick a piece —</option>
                    {SAMPLE_PIECES.map((p) => (
                      <option key={p.sku} value={p.sku}>
                        {p.name} · {p.designer} {p.status !== 'Live' ? `(${p.status})` : ''}
                      </option>
                    ))}
                  </select>
                </Field>

                {badgePiece && (
                  <div className="hok-hero-badge-readback">
                    <PieceCard
                      piece={badgePiece}
                      sku={badgePiece.sku}
                      onOpenPiece={() => onNavigateToModule && onNavigateToModule('Products')}
                    />
                    <div className="hok-hero-badge-renders-as">
                      The badge renders as <span className="hok-hero-badge-renders-bold">{badgePiece.name} · {badgePiece.designer} · Rent ₹6,400 / 3 days · Buy ₹1,10,000</span>. Both lines are read from the piece, so the badge cannot quote a price the catalogue disagrees with.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hok-hero-grid-2col">
                <Field label="Badge title">
                  <input
                    type="text"
                    className="hok-field-input"
                    value={settings.badge.title || ''}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        badge: { ...settings.badge, title: e.target.value }
                      })
                    }
                    placeholder="e.g. Wedding Season Special"
                  />
                </Field>
                <Field label="Second line">
                  <input
                    type="text"
                    className="hok-field-input"
                    value={settings.badge.sub || ''}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        badge: { ...settings.badge, sub: e.target.value }
                      })
                    }
                    placeholder="e.g. Up to 70% Off Retail"
                  />
                </Field>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
