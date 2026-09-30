/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · TYPES
   Spec Section 15 Data Model (v213)
========================================================= */

export type BandId =
  | 'hero'
  | 'hiw'
  | 'featured'
  | 'category'
  | 'occasions'
  | 'commit'
  | 'designers'
  | 'testi'
  | 'insta';

export interface BandMeta {
  id: BandId;
  lbl: string;
  ttl: string;
  grp?: string;
  sub?: string;
}

export type HealthSeverity = 'warn' | 'soon' | 'info';

export interface HealthIssue {
  id: string;
  band: BandId;
  sev: HealthSeverity;
  severity: HealthSeverity;
  msg: string;
  message: string;
  door?: string;
  doorLabel?: string;
  actionLabel?: string;
  doorUrl?: string;
  actionUrl?: string;
}

export interface SearchEntry {
  id: string;
  label: string;
  band: BandId;
  targetFieldId: string;
  synonyms?: string[];
}

/* 1. Hero Band */
export interface HeroStatItem {
  id: string;
  val: string;
  lbl: string;
  lblMob: string;
  src: 'Typed' | 'Live pieces' | 'Active designers';
}

export interface HeroSettings {
  eyebrow: string;
  heading: string;
  headingMob: string;
  sub: string;
  subMob: string;
  subMobV3: string;
  ctaA: { lbl: string; url: string };
  ctaB: { lbl: string; url: string };
  statsOn: boolean;
  stats: HeroStatItem[];
  layout: 'Split' | 'Full bleed';
  side: 'Right' | 'Left';
  dim: number; // 0-100%
  layoutMob: 'Full bleed' | 'Split';
  dimMob: number; // 0-100%
  img: {
    alt: string;
    img?: string;
    focal: 'Top' | 'Centre' | 'Bottom';
  };
  imgMob: {
    alt: string;
    img?: string;
    focal: 'Top' | 'Centre' | 'Bottom';
  };
  badge: {
    on: boolean;
    mob: boolean;
    mode: 'Piece' | 'Message';
    sku?: string;
    title?: string;
    sub?: string;
  };
}

/* 2. How It Works Band */
export interface HowItWorksStep {
  id: string;
  ico: string;
  t: string;
  d: string;
}

export interface HowItWorksSettings {
  eyebrow: string;
  heading: string;
  tabA: string;
  tabB: string;
  open: 'Shop' | 'Sell';
  shop: HowItWorksStep[];
  sell: HowItWorksStep[];
  sellCard: {
    on: boolean;
    head: string;
    body: string;
    quote: string;
    cta: { lbl: string; url: string };
  };
}

/* 3. Featured Pieces Band */
export interface FeaturedPiecesSettings {
  eyebrow: string;
  heading: string;
  viewAll: { lbl: string; url: string };
  slots: string[]; // SKU list
  shots: { [sku: string]: string };
  cap: number; // 8 max
  perRow: number; // 4 default
  perRowMob: number; // 2 default
  topUp: 'Off' | 'Top up automatically';
  topUpBy: 'Newest live' | 'Most rented' | 'Highest rated';
  showModeBadge: boolean;
  showWishlist: boolean;
  showWasPrice: boolean;
  showDuration: boolean;
}

/* 4. Shop by Category Band */
export interface CategoryTileConfig {
  alt: string;
  lbl: string;
  kickMob: string;
  img?: string;
}

export interface CategorySettings {
  eyebrow: string;
  heading: string;
  viewAll: { lbl: string; url: string };
  layout: 'Mosaic' | 'Even grid';
  layoutMob: 'Carousel' | 'Stacked';
  header: boolean;
  headerMob: boolean;
  ctaLbl: string;
  showCount: boolean;
  showCountMob: boolean;
  countLblMob: string;
  tiles: { [categoryId: string]: CategoryTileConfig };
}

/* 5. Shop by Occasion Band (Present but not built on storefront) */
export interface OccasionTileConfig {
  alt: string;
  lbl: string;
  kickMob?: string;
  img?: string;
}

export interface OccasionsSettings {
  eyebrow: string;
  heading: string;
  viewAll: { lbl: string; url: string };
  layout: 'Even grid' | 'Mosaic';
  ctaLbl: string;
  showCount: boolean;
  tiles?: { [occasionId: string]: OccasionTileConfig };
}

/* 6. Our Commitment Band */
export interface CommitmentPill {
  id: string;
  l: string;
  u: string;
  on: boolean;
}

export interface CommitmentCard {
  id: string;
  ico: string;
  mob: boolean;
  h: string;
  d: string;
}

export interface CommitmentSettings {
  eyebrow: string;
  heading: string;
  body: string;
  bodyMob: string;
  pills: CommitmentPill[];
  cards: CommitmentCard[];
}

export interface DesignerTileConfig {
  alt?: string;
  img?: string;
  lbl?: string;
}

export interface DesignersSettings {
  eyebrow: string;
  heading: string;
  viewAll: { lbl: string; url: string };
  layout: 'Grid' | 'Carousel';
  layoutMob: 'Carousel' | 'Grid';
  header: boolean;
  headerMob: boolean;
  slideKick: string;
  ctaLbl: string;
  showCount: boolean;
  countLbl: string;
  countLblMob: string;
  cap: number; // 6 default
  slots?: string[];
  tiles?: { [designerId: string]: DesignerTileConfig };
}

/* 8. Testimonials Band */
export interface TestimonialCard {
  id: string;
  on: boolean;
  name: string;
  ini: string;
  city: string;
  ctx: string;
  stars: number;
  src: 'Verified order' | 'Instagram' | 'Collected directly';
  ref: string;
  q: string;
}

export interface TestimonialsSettings {
  eyebrow: string;
  heading: string;
  layout: 'Three across' | 'Two across';
  layoutMob: 'Swipe' | 'Stacked';
  cards: TestimonialCard[];
}

/* 9. Instagram Band */
export interface InstagramTile {
  id: string;
  img?: string;
  alt: string;
  url: string;
}

export interface InstagramSettings {
  eyebrow: string;
  heading: string;
  viewAll: { lbl: string; url: string };
  viewAllMob: string;
  source: 'Manual tiles' | 'Live Instagram feed';
  strip: string;
  stripMob: string;
  tiles: InstagramTile[];
}

/* Master Registry Schema */
export interface HomepageRegistry {
  bands: BandMeta[];
  vis: { [key in BandId]: boolean };
  hero: HeroSettings;
  hiw: HowItWorksSettings;
  featured: FeaturedPiecesSettings;
  category: CategorySettings;
  occasions: OccasionsSettings;
  commit: CommitmentSettings;
  designers: DesignersSettings;
  testi: TestimonialsSettings;
  insta: InstagramSettings;
}
