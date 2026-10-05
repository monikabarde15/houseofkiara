import React, { useState } from 'react';
import './BrandRegion.css';
import { BrandSettings, BrandAssetSlot, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { PointerPicker, POINTERS_INVENTORY } from '../../shared/PointerPicker/PointerPicker';
import { AssetSlotRow, AssetSlotConfig } from './AssetSlotRow';
import {
  TabIconContextMock,
  PhoneIconContextMock,
  LinkPreviewContextMock
} from './BrandContextMocks';
import { PaletteAndTypeCard } from './PaletteAndTypeCard';

interface BrandRegionProps {
  settings: BrandSettings;
  onChange: (updated: BrandSettings) => void;
  issues: HealthIssue[];
}

const ASSET_SLOTS_CONFIG: AssetSlotConfig[] = [
  {
    key: 'logoMark',
    label: 'Logo mark',
    previewWidth: 76,
    previewHeight: 76,
    required: 'Square. SVG, or PNG at 500 × 500 or larger.',
    showsIn: 'Header · Mobile header',
    acceptTypes: '.svg,.png'
  },
  {
    key: 'wordmark',
    label: 'Wordmark',
    previewWidth: 150,
    previewHeight: 52,
    required: 'SVG preferred, transparent.',
    showsIn: 'Header and footer — set in Cormorant Garamond today, not a file',
    whatToPrepare:
      'Only if you want the lettering locked as artwork instead of live type. Most brands leave this empty.',
    acceptTypes: '.svg,.png'
  },
  {
    key: 'inverseMark',
    label: 'Inverse mark',
    previewWidth: 76,
    previewHeight: 76,
    isInverse: true,
    required: 'Same shape as the mark, light ink.',
    showsIn:
      'Nothing carries the logo on dark today — the announcement bar and the sell band are charcoal but use text only',
    whatToPrepare: 'Not needed yet. Prepare one when a dark section starts carrying the logo.',
    acceptTypes: '.svg,.png'
  },
  {
    key: 'browserTabIcon',
    label: 'Browser tab icon',
    previewWidth: 44,
    previewHeight: 44,
    required: '32 × 32 or larger square PNG.',
    showsIn: 'Every page. Also bookmarks and browser history',
    whatToPrepare:
      'Your HK monogram, cropped square, on a solid background. No wordmark — at this size letters turn to mush.',
    acceptTypes: '.png,.ico',
    allowUseLogoMark: true,
    hasContextMock: 'tab'
  },
  {
    key: 'phoneHomeScreenIcon',
    label: 'Phone home screen icon',
    previewWidth: 60,
    previewHeight: 60,
    required: '180 × 180 PNG.',
    showsIn: 'iPhone and Android home screens',
    whatToPrepare:
      'The same monogram, larger, on a solid cream or charcoal square. No transparency — iPhones turn transparent areas black.',
    acceptTypes: '.png',
    allowUseLogoMark: true,
    hasContextMock: 'phone'
  },
  {
    key: 'linkPreviewImage',
    label: 'Link preview image',
    previewWidth: 150,
    previewHeight: 79,
    required: '1200 × 630 PNG or JPG.',
    showsIn: 'WhatsApp, Instagram DMs, Facebook, LinkedIn — anywhere a link unfurls',
    whatToPrepare:
      'Landscape artwork that reads at thumbnail size: the wordmark on cream, or one strong piece photographed wide. This is the fallback — a product page should send its own photograph instead.',
    acceptTypes: '.png,.jpg,.jpeg',
    hasContextMock: 'linkPreview'
  }
];

export const BrandRegion: React.FC<BrandRegionProps> = ({ settings, onChange, issues }) => {
  const [pointerTarget, setPointerTarget] = useState<HTMLElement | null>(null);

  // Evaluate pointers for brand quote
  const evaluatePointers = (text: string) => {
    if (!text) return '';
    let result = text;
    POINTERS_INVENTORY.forEach((p) => {
      result = result.split(p.code).join(p.printsToday);
    });
    return result;
  };

  const quotePrints = evaluatePointers(settings.brandQuote);

  const handlePointerSelect = (code: string) => {
    const newText = settings.brandQuote ? `${settings.brandQuote} ${code}` : code;
    onChange({ ...settings, brandQuote: newText });
  };

  const handleUpdateAsset = (key: keyof typeof settings.assets, updatedSlot: BrandAssetSlot) => {
    onChange({
      ...settings,
      assets: {
        ...settings.assets,
        [key]: updatedSlot
      }
    });
  };

  const handleUseLogoMark = (targetKey: keyof typeof settings.assets) => {
    const logoSlot = settings.assets.logoMark;
    if (!logoSlot.file) return;

    onChange({
      ...settings,
      assets: {
        ...settings.assets,
        [targetKey]: {
          file: logoSlot.file,
          dataUrl: logoSlot.dataUrl,
          dimensions: logoSlot.dimensions,
          sizeKb: logoSlot.sizeKb,
          addedBy: 'Soumya',
          addedWhen: 'Just now'
        }
      }
    });
  };

  return (
    <div className="hok-brand-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Brand & assets</h2>
        <span className="hok-editor-attribution">Soumya · 12 days ago</span>
      </div>
      <p className="hok-editor-description">
        Holds the words, the image files, and a reference list of the palette and typefaces. This is the only region in the section that uploads files; every other place that needs one reports it and links here.
      </p>

      {/* 8.2 Issues for Brand */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
        />
      ))}

      {/* Card 1 — Words (Spec 10.5 & 16.5) */}
      <Card isFirst title="Words" id="brand-words-card">
        <div className="hok-two-column-group">
          <div id="brand-site-name">
            <Field label="Site name">
              <input
                type="text"
                className="hok-field-input"
                value={settings.siteName}
                onChange={(e) => onChange({ ...settings, siteName: e.target.value })}
              />
            </Field>
          </div>

          <div id="brand-tagline">
            <Field label="Tagline">
              <input
                type="text"
                className="hok-field-input"
                value={settings.tagline}
                onChange={(e) => onChange({ ...settings, tagline: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div id="brand-quote">
          <Field
            label="Brand quote"
            hints={`Prints: ${quotePrints} { }`}
            onPointerClick={(elem) => setPointerTarget(elem)}
          >
            <textarea
              className="hok-field-textarea"
              value={settings.brandQuote}
              onChange={(e) => onChange({ ...settings, brandQuote: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      {/* Card 2 — Assets (Spec 10.5 & 16.5) */}
      <Card
        title="Assets"
        subtitle="Replace a file here and every page picks it up. Nothing else needs touching."
        id="brand-assets-card"
      >
        {ASSET_SLOTS_CONFIG.map((cfg) => {
          const slotKey = cfg.key as keyof typeof settings.assets;
          const slot = settings.assets[slotKey];

          return (
            <div key={cfg.key} style={{ marginBottom: 9 }}>
              <AssetSlotRow
                config={cfg}
                slot={slot}
                siteName={settings.siteName}
                onChange={(updated) => handleUpdateAsset(slotKey, updated)}
                onUseLogoMark={() => handleUseLogoMark(slotKey)}
              />

              {/* Context Mocks (Spec 10.5) */}
              {cfg.hasContextMock === 'tab' && (
                <TabIconContextMock slot={slot} siteName={settings.siteName} />
              )}
              {cfg.hasContextMock === 'phone' && (
                <PhoneIconContextMock slot={slot} siteName={settings.siteName} />
              )}
              {cfg.hasContextMock === 'linkPreview' && (
                <LinkPreviewContextMock slot={slot} headline={`${settings.siteName} — Rent, Buy & List Luxury Indian Occasion Wear`} />
              )}
            </div>
          );
        })}
      </Card>

      {/* Card 3 — Palette & Type */}
      <PaletteAndTypeCard />

      {/* Pointer Picker Popover */}
      {pointerTarget && (
        <PointerPicker
          targetElement={pointerTarget}
          onSelect={handlePointerSelect}
          onClose={() => setPointerTarget(null)}
        />
      )}
    </div>
  );
};
