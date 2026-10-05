import React from 'react';
import './BrandRegion.css';
import { Card } from '../../shared/Card/Card';

const PALETTE_DATA = [
  { name: 'Charcoal', hex: '#1A1612', used: 'Body text, the announcement bar, dark bands' },
  { name: 'Gold', hex: '#C9A96E', used: 'Accents, the Rent link, active states' },
  { name: 'Terracotta', hex: '#B85C38', used: 'Warnings, missing values, destructive hover' },
  { name: 'Sage', hex: '#6B7E5A', used: 'Positive states and the List Your Piece link' },
  { name: 'Cream', hex: '#FAF7F2', used: 'Page background' },
  { name: 'Warm white', hex: '#FFFEFB', used: 'Cards and raised surfaces' }
];

const TYPEFACES_DATA = [
  {
    name: 'Cormorant Garamond',
    role: 'Headlines and the wordmark',
    sample: 'Aa',
    status: 'Yes — “Aa” in that face',
    fontFamily: 'var(--serif)'
  },
  {
    name: 'Inter',
    role: 'Interface text, panel and storefront',
    sample: 'Aa',
    status: 'Yes — “Aa” in that face',
    fontFamily: 'var(--sans)'
  },
  {
    name: 'DM Sans',
    role: 'Named in the brand identity for storefront interface. Not loaded here, so no sample is shown.',
    sample: '—',
    status: 'No — the face is not loaded in the panel',
    fontFamily: 'sans-serif'
  }
];

export const PaletteAndTypeCard: React.FC = () => {
  return (
    <Card
      title="Palette & type"
      subtitle="Built into the stylesheet, not switchable from here — changing one is a development change, not a setting. Listed so there is one place to read them off."
      id="brand-palette-type"
    >
      {/* 6 Colour Chips */}
      <div className="hok-palette-chips-grid">
        {PALETTE_DATA.map((color) => (
          <div key={color.name} className="hok-palette-chip-item">
            <div
              className="hok-palette-swatch-box"
              style={{ backgroundColor: color.hex }}
            />
            <span className="hok-palette-chip-name">{color.name}</span>
            <span className="hok-palette-chip-hex">{color.hex}</span>
            <span className="hok-palette-chip-used">{color.used}</span>
          </div>
        ))}
      </div>

      {/* 3 Typeface Cards */}
      <div className="hok-type-cards-grid">
        {TYPEFACES_DATA.map((type) => (
          <div key={type.name} className="hok-type-card-item">
            <div
              className="hok-type-sample-glyph"
              style={{ fontFamily: type.fontFamily }}
            >
              {type.sample}
            </div>
            <span className="hok-type-card-name">{type.name}</span>
            <span className="hok-type-card-role">{type.role}</span>
            <span className="hok-type-card-status">{type.status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
