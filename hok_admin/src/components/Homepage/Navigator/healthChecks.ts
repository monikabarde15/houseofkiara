/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · HEALTH CHECKS
   Spec Section 10 (v213) — Real-time condition evaluation
========================================================= */

import { HomepageRegistry, BandId, HealthIssue, HealthSeverity } from '../types/homepage.types';

// Real mock catalog and data for derived checks
const KNOWN_LIVE_SKUS = ['HOK-SAB-002', 'HOK-TT-001', 'HOK-AD-001', 'HOK-SAB-001', 'HOK-MM-002'];
const KNOWN_SOLD_SKUS = ['HOK-MM-001', 'HOK-MM-003'];

const CATEGORY_LIVE_COUNTS: { [key: string]: number } = {
  'bridal-lehenga': 3,
  'sherwani': 0,
  'saree': 1,
  'anarkali': 1,
  'indo-western': 0
};

const DESIGNER_LIVE_COUNTS: { [key: string]: number } = {
  'Sabyasachi': 3,
  'Manish Malhotra': 0,
  'Tarun Tahiliani': 1,
  'Anita Dongre': 1,
  'Raw Mango': 0,
  'Abu Jani Sandeep': 0,
  'Torani': 0
};

const FEATURED_DESIGNERS_LIST = [
  'Sabyasachi',
  'Manish Malhotra',
  'Tarun Tahiliani',
  'Anita Dongre',
  'Raw Mango',
  'Abu Jani Sandeep',
  'Torani'
];

export const evaluateHomepageHealthChecks = (registry: HomepageRegistry): {
  issuesByBand: { [key in BandId]: HealthIssue[] };
  highestSeverityByBand: { [key in BandId]?: HealthSeverity };
  allIssues: HealthIssue[];
} => {
  const issues: HealthIssue[] = [];

  // Helper to add issues
  const addIssue = (
    band: BandId,
    sev: HealthSeverity,
    msg: string,
    door?: string,
    doorLabel?: string,
    doorUrl?: string
  ) => {
    issues.push({
      id: `iss-${band}-${issues.length + 1}`,
      band,
      sev,
      severity: sev,
      msg,
      message: msg,
      door,
      doorLabel,
      actionLabel: doorLabel,
      doorUrl,
      actionUrl: doorUrl
    });
  };

  const { hero, hiw, featured, category, occasions, commit, designers, testi, insta, vis } = registry;

  /* 1. Hero Checks */
  if (vis.hero) {
    if (!hero.heading.trim()) {
      addIssue('hero', 'warn', 'Hero is switched on with an empty heading.');
    }
    if (hero.headingMob && hero.headingMob.trim() !== hero.heading.replace(/\n/g, ' ').trim()) {
      addIssue('hero', 'info', 'A mobile headline is set and differs from the desktop headline.');
    }
    if (!hero.img.img) {
      if (hero.layout === 'Full bleed') {
        addIssue('hero', 'warn', 'The desktop hero runs full bleed with no picture behind it.');
      } else {
        addIssue('hero', 'info', 'No desktop hero picture uploaded yet.');
      }
    }
    if (!hero.imgMob.img) {
      if (hero.layoutMob === 'Full bleed') {
        addIssue('hero', 'warn', 'The app hero runs full bleed with no picture behind it.');
      } else {
        addIssue('hero', 'info', 'No app hero picture uploaded yet.');
      }
    }
    if (hero.layout === 'Full bleed' && hero.dim < 25) {
      addIssue('hero', 'soon', 'Full bleed with darkening below 25%.');
    }
    if (hero.badge.on && hero.badge.mode === 'Piece' && hero.badge.sku) {
      if (!KNOWN_LIVE_SKUS.includes(hero.badge.sku) && !KNOWN_SOLD_SKUS.includes(hero.badge.sku)) {
        addIssue('hero', 'warn', 'Badge is in Piece mode and the SKU is not in the catalogue.', 'Products', 'Open Products', '/products');
      } else if (KNOWN_SOLD_SKUS.includes(hero.badge.sku)) {
        addIssue('hero', 'warn', 'Badge is in Piece mode and the piece is not Live.', 'Products', 'Open Products', '/products');
      }
    }
  }

  /* 2. How It Works Checks */
  if (vis.hiw) {
    if (!hiw.heading.trim()) {
      addIssue('hiw', 'warn', 'How It Works is switched on with an empty heading.');
    }
  }

  /* 3. Featured Pieces Checks */
  if (vis.featured) {
    if (!featured.heading.trim()) {
      addIssue('featured', 'warn', 'Featured Pieces is switched on with an empty heading.');
    }
    const soldSlots = featured.slots.filter((s) => KNOWN_SOLD_SKUS.includes(s));
    if (soldSlots.length > 0) {
      addIssue('featured', 'warn', 'A featured slot is not shoppable: Ivory Embroidered Sherwani — sold.', 'Products', 'Open Products', '/products');
    }
    const liveSlotsCount = featured.slots.filter((s) => KNOWN_LIVE_SKUS.includes(s)).length;
    if (liveSlotsCount % featured.perRow !== 0 && featured.topUp === 'Off') {
      addIssue(
        'featured',
        'soon',
        `${liveSlotsCount} shoppable pieces against a row of ${featured.perRow} — the last row lands short. Either fill the row or let it top up automatically.`
      );
    }
    if (featured.slots.length < featured.perRow) {
      addIssue('featured', 'soon', 'One or more slots are empty.');
    }
  }

  /* 4. Shop by Category Checks */
  if (vis.category) {
    if (!category.heading.trim()) {
      addIssue('category', 'warn', 'Shop by Category is switched on with an empty heading.');
    }
    const catKeys = Object.keys(category.tiles);
    if (catKeys.length === 0) {
      addIssue('category', 'warn', 'No category is ticked for the homepage.', 'Master Data', 'Open Master Data', '/master-data');
    }
    if (category.layout === 'Mosaic' && catKeys.length !== 5) {
      addIssue('category', 'warn', `Mosaic layout chosen and the ticked count is not exactly five (${catKeys.length} ticked).`, 'Master Data', 'Open Master Data', '/master-data');
    }
    // Check missing pictures and zero counts
    catKeys.forEach((k) => {
      const tile = category.tiles[k];
      if (!tile.img) {
        addIssue('category', 'info', `No picture set for the ${tile.lbl} tile.`);
      }
      if (CATEGORY_LIVE_COUNTS[k] === 0) {
        addIssue('category', 'warn', `${tile.lbl.replace(/s$/, '')} is on the homepage with nothing live behind it.`, 'Master Data', 'Open Master Data', '/master-data');
      }
    });

    // Dynamic Label difference notes
    const categoryRegistrySingular: { [k: string]: string } = {
      'bridal-lehenga': 'Bridal Lehenga',
      'sherwani': 'Sherwani',
      'saree': 'Saree',
      'anarkali': 'Anarkali',
      'indo-western': 'Indo-Western'
    };

    catKeys.forEach((k) => {
      const tile = category.tiles[k];
      const regName = categoryRegistrySingular[k];
      if (tile?.lbl && regName && tile.lbl !== regName) {
        addIssue(
          'category',
          'info',
          `The tile reads "${tile.lbl}" while the registry calls it "${regName}". The storefront sets these in the plural, so this is expected — clear the tile label to follow the registry instead.`
        );
      }
    });
  }

  /* 5. Shop by Occasion Checks */
  if (vis.occasions) {
    addIssue('occasions', 'warn', 'The band is switched on while no storefront implementation exists.');
  } else {
    addIssue('occasions', 'soon', '5 occasions are marked as featured in Master Data, but the homepage has no band showing them. Either build the band or untick them, so the flag means something.', 'Master Data', 'Open Master Data', '/master-data');
  }

  /* 6. Our Commitment Checks */
  if (vis.commit) {
    if (!commit.heading.trim()) {
      addIssue('commit', 'warn', 'Our Commitment is switched on with an empty heading.');
    }
    const emptyPills = commit.pills.filter((p) => p.on && !p.u.trim());
    if (emptyPills.length > 0) {
      addIssue('commit', 'soon', 'An enabled pill has no destination.');
    }
    const mobileCards = commit.cards.filter((c) => c.mob);
    if (mobileCards.length === 0) {
      addIssue('commit', 'warn', 'No card is set to show on mobile.');
    }
  }

  /* 7. Featured Designers Checks */
  if (vis.designers) {
    if (!designers.heading.trim()) {
      addIssue('designers', 'warn', 'Featured Designers is switched on with an empty heading.');
    }
    if (FEATURED_DESIGNERS_LIST.length > designers.cap) {
      addIssue('designers', 'soon', `${FEATURED_DESIGNERS_LIST.length} designers are featured but the band shows ${designers.cap}. The last ${FEATURED_DESIGNERS_LIST.length - designers.cap} will not appear.`, 'Designers', 'Open Designers', '/designers');
    }
    const zeroLive = FEATURED_DESIGNERS_LIST.slice(0, designers.cap).filter((d) => DESIGNER_LIVE_COUNTS[d] === 0);
    if (zeroLive.length > 0) {
      addIssue('designers', 'warn', `${zeroLive.length} featured designers are on the homepage with nothing live behind the tap.`, 'Designers', 'Open Designers', '/designers');
    }
    addIssue('designers', 'warn', 'Ritu Kumar is named on a piece but has no designer profile, so they can never be featured here however the band is set.', 'Designers', 'Open Designers', '/designers');
  }

  /* 8. Testimonials Checks */
  if (vis.testi) {
    if (!testi.heading.trim()) {
      addIssue('testi', 'warn', 'Testimonials is switched on with an empty heading.');
    }
    const enabledQuotes = testi.cards.filter((c) => c.on);
    if (enabledQuotes.length === 0) {
      addIssue('testi', 'warn', 'Every quote is switched off.');
    }
    const verifiedNoOrder = enabledQuotes.filter((c) => c.src === 'Verified order' && !c.ref.trim());
    if (verifiedNoOrder.length > 0) {
      addIssue('testi', 'soon', 'A quote is marked as a verified order but carries no order number.');
    }
  }

  /* 9. Instagram Checks */
  if (vis.insta) {
    if (!insta.heading.trim()) {
      addIssue('insta', 'warn', 'Instagram is switched on with an empty heading.');
    }
    if (insta.source === 'Live Instagram feed') {
      addIssue('insta', 'warn', 'Source is set to the live feed, which has no Meta connection.');
    } else {
      const hasPics = insta.tiles.some((t) => !!t.img);
      if (!hasPics) {
        addIssue('insta', 'info', 'No tiles uploaded yet — the band renders its placeholder squares.');
      }
    }
  }

  // Group by Band
  const issuesByBand: { [key in BandId]: HealthIssue[] } = {
    hero: [],
    hiw: [],
    featured: [],
    category: [],
    occasions: [],
    commit: [],
    designers: [],
    testi: [],
    insta: []
  };

  const severityWeight: { [key in HealthSeverity]: number } = {
    warn: 3,
    soon: 2,
    info: 1
  };

  const highestSeverityByBand: { [key in BandId]?: HealthSeverity } = {};

  issues.forEach((issue) => {
    issuesByBand[issue.band].push(issue);
    const currHigh = highestSeverityByBand[issue.band];
    if (!currHigh || severityWeight[issue.sev] > severityWeight[currHigh]) {
      highestSeverityByBand[issue.band] = issue.sev;
    }
  });

  return {
    issuesByBand,
    highestSeverityByBand,
    allIssues: issues
  };
};
