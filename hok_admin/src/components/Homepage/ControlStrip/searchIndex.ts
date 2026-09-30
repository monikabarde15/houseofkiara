/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · SEARCH INDEX
   Spec Section 13 (v213) — 38 indexed entries
========================================================= */

import { BandId } from '../types/homepage.types';

export interface HomepageSearchItem {
  id: string;
  label: string;
  band: BandId;
  bandTitle: string;
  targetFieldId: string;
  synonyms?: string[];
}

export const HOMEPAGE_SEARCH_INDEX: HomepageSearchItem[] = [
  // 1. Hero
  { id: 'hero-eyebrow', label: 'Hero eyebrow', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-eyebrow', synonyms: ['intro', 'tagline', 'small capitals'] },
  { id: 'hero-heading', label: 'Hero heading', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-heading', synonyms: ['title', 'headline', 'wear it with love'] },
  { id: 'hero-sub', label: 'Hero sub-heading', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-sub', synonyms: ['subtitle', 'description', 'tokens'] },
  { id: 'hero-sub-mob', label: 'Hero sub-heading (mobile)', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-sub-mob', synonyms: ['app subtitle', 'mobile sub'] },
  { id: 'hero-cta-a', label: 'Hero primary button', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-cta-a', synonyms: ['explore collection', 'primary link'] },
  { id: 'hero-cta-b', label: 'Hero secondary button', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-cta-b', synonyms: ['how it works', 'secondary link'] },
  { id: 'hero-stats', label: 'Hero stats', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-stats', synonyms: ['figures', 'numbers', 'live pieces count'] },
  { id: 'hero-stats-row', label: 'Hero stats row', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-stats-toggle', synonyms: ['figures toggle', 'show figures'] },
  { id: 'hero-badge', label: 'Hero badge', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-badge', synonyms: ['corner badge', 'piece badge', 'sku'] },
  { id: 'hero-picture', label: 'Hero picture', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-picture', synonyms: ['desktop image', 'desktop photo'] },
  { id: 'hero-picture-mob', label: 'Hero picture (mobile)', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-picture-mob', synonyms: ['app picture', 'mobile image'] },
  { id: 'hero-layout', label: 'Hero layout', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-layout', synonyms: ['split', 'full bleed', 'darkening'] },
  { id: 'hero-vis', label: 'Which bands show', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-visibility', synonyms: ['visibility', 'toggle band'] },
  { id: 'hero-order', label: 'Band order', band: 'hero', bandTitle: 'Hero', targetFieldId: 'hero-visibility', synonyms: ['reorder', 'move band'] },

  // 2. How It Works
  { id: 'hiw-heading', label: 'How It Works heading', band: 'hiw', bandTitle: 'How It Works', targetFieldId: 'hiw-heading', synonyms: ['how it works title', 'simple by design'] },
  { id: 'hiw-tab-a', label: 'Shop tab label', band: 'hiw', bandTitle: 'How It Works', targetFieldId: 'hiw-tab-a', synonyms: ['i want to shop', 'buyer tab'] },
  { id: 'hiw-tab-b', label: 'Sell tab label', band: 'hiw', bandTitle: 'How It Works', targetFieldId: 'hiw-tab-b', synonyms: ['i want to sell', 'lister tab'] },
  { id: 'hiw-shop-steps', label: 'Shop steps', band: 'hiw', bandTitle: 'How It Works', targetFieldId: 'hiw-shop-steps', synonyms: ['4 steps', 'browse discover', 'doorstep delivery'] },
  { id: 'hiw-sell-steps', label: 'Sell steps', band: 'hiw', bandTitle: 'How It Works', targetFieldId: 'hiw-sell-steps', synonyms: ['3 steps', 'photograph list', 'ship get paid'] },
  { id: 'hiw-sell-card', label: 'Sell card', band: 'hiw', bandTitle: 'How It Works', targetFieldId: 'hiw-sell-card', synonyms: ['craftsmanship card', 'pull quote', 'closing card'] },

  // 3. Featured Pieces
  { id: 'featured-heading', label: 'Featured Pieces heading', band: 'featured', bandTitle: 'Featured Pieces', targetFieldId: 'featured-heading', synonyms: ['handpicked for you', 'pieces title'] },
  { id: 'featured-slots', label: 'Featured pieces — the slots', band: 'featured', bandTitle: 'Featured Pieces', targetFieldId: 'featured-slots', synonyms: ['skus', 'catalogue picker', '4 pieces'] },
  { id: 'featured-topup', label: 'Top up automatically', band: 'featured', bandTitle: 'Featured Pieces', targetFieldId: 'featured-topup', synonyms: ['automatic top up', 'when piece sells', 'fill gap'] },

  // 4. Shop by Category
  { id: 'category-heading', label: 'Shop by Category heading', band: 'category', bandTitle: 'Shop by Category', targetFieldId: 'category-heading', synonyms: ['curated for every occasion', 'category title'] },
  { id: 'category-layout', label: 'Category layout', band: 'category', bandTitle: 'Shop by Category', targetFieldId: 'category-layout', synonyms: ['mosaic', 'even grid', 'carousel'] },
  { id: 'category-cta', label: 'Category button wording', band: 'category', bandTitle: 'Shop by Category', targetFieldId: 'category-cta', synonyms: ['shop now', 'button label'] },

  // 5. Shop by Occasion
  { id: 'occasions-heading', label: 'Shop by Occasion heading', band: 'occasions', bandTitle: 'Shop by Occasion', targetFieldId: 'occasions-heading', synonyms: ['dressed for the day', 'occasions title', 'not built'] },

  // 6. Our Commitment
  { id: 'commit-heading', label: 'Commitment heading', band: 'commit', bandTitle: 'Our Commitment', targetFieldId: 'commit-heading', synonyms: ['fashion that gives back', 'circular economy'] },
  { id: 'commit-body', label: 'Commitment body', band: 'commit', bandTitle: 'Our Commitment', targetFieldId: 'commit-body', synonyms: ['textile waste', 'landfill', 'body copy'] },
  { id: 'commit-pills', label: 'Mode pills', band: 'commit', bandTitle: 'Our Commitment', targetFieldId: 'commit-pills', synonyms: ['rent', 'buy preloved', 'buy new', 'list sell'] },
  { id: 'commit-cards', label: 'Commitment cards', band: 'commit', bandTitle: 'Our Commitment', targetFieldId: 'commit-cards', synonyms: ['4 cards', 'argument cards', 'shield icon'] },

  // 7. Featured Designers
  { id: 'designers-heading', label: 'Featured Designers heading', band: 'designers', bandTitle: 'Featured Designers', targetFieldId: 'designers-heading', synonyms: ['trusted creators', 'designers title'] },
  { id: 'designers-kick', label: 'Designer carousel wording', band: 'designers', bandTitle: 'Featured Designers', targetFieldId: 'designers-kick', synonyms: ['featured designer kicker', 'count wording'] },

  // 8. Testimonials
  { id: 'testi-heading', label: 'Testimonials heading', band: 'testi', bandTitle: 'Testimonials', targetFieldId: 'testi-heading', synonyms: ['what our customers say', 'reviews', 'quotes'] },
  { id: 'testi-quotes', label: 'Customer quotes', band: 'testi', bandTitle: 'Testimonials', targetFieldId: 'testi-quotes', synonyms: ['priya rathore', 'verified order', 'order number'] },

  // 9. Instagram
  { id: 'insta-heading', label: 'Instagram heading', band: 'insta', bandTitle: 'Instagram', targetFieldId: 'insta-heading', synonyms: ['our community', 'as seen on instagram'] },
  { id: 'insta-follow', label: 'Instagram follow line', band: 'insta', bandTitle: 'Instagram', targetFieldId: 'insta-follow', synonyms: ['follow our story at', 'handle line'] },
  { id: 'insta-handle', label: 'Instagram handle', band: 'insta', bandTitle: 'Instagram', targetFieldId: 'insta-handle', synonyms: ['@house_of_kaira', 'open site settings', 'social handle'] }
];

export const searchHomepageIndex = (query: string): HomepageSearchItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return HOMEPAGE_SEARCH_INDEX.filter((item) => {
    if (item.label.toLowerCase().includes(q)) return true;
    if (item.bandTitle.toLowerCase().includes(q)) return true;
    if (item.synonyms?.some((s) => s.toLowerCase().includes(q))) return true;
    return false;
  }).slice(0, 7);
};
