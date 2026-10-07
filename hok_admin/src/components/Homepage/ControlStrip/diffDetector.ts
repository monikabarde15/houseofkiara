/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · DIFF DETECTOR
   Spec Section 14 (v213) — Deep comparison by band
========================================================= */

import { HomepageRegistry, BandId } from '../types/homepage.types';

export interface ChangedBandInfo {
  bandId: BandId | 'order' | 'vis';
  bandName: string;
}

const BAND_DISPLAY_NAMES: { [key in BandId]: string } = {
  hero: 'Hero',
  hiw: 'How It Works',
  featured: 'Featured Pieces',
  category: 'Shop by Category',
  occasions: 'Shop by Occasion',
  commit: 'Our Commitment',
  designers: 'Featured Designers',
  testi: 'Testimonials',
  insta: 'Instagram'
};

export const detectHomepageDiffs = (
  current: HomepageRegistry,
  baseline: HomepageRegistry
): ChangedBandInfo[] => {
  const changes: ChangedBandInfo[] = [];

  // 1. Check each band's content and visibility
  (Object.keys(BAND_DISPLAY_NAMES) as BandId[]).forEach((bandId) => {
    const currStr = JSON.stringify(current[bandId]);
    const baseStr = JSON.stringify(baseline[bandId]);
    const currVis = current.vis?.[bandId];
    const baseVis = baseline.vis?.[bandId];
    if (currStr !== baseStr || currVis !== baseVis) {
      changes.push({
        bandId,
        bandName: BAND_DISPLAY_NAMES[bandId]
      });
    }
  });

  // 2. Check Band Order
  const currentOrder = current.bands.map((b) => b.id).join(',');
  const baselineOrder = baseline.bands.map((b) => b.id).join(',');
  if (currentOrder !== baselineOrder) {
    if (!changes.some((c) => c.bandId === 'order')) {
      changes.push({
        bandId: 'order',
        bandName: 'Band Order'
      });
    }
  }

  return changes;
};
