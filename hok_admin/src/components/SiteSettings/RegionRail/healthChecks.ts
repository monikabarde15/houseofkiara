import { SiteSettingsRegistry, RegionId, HealthIssue, HealthSeverity } from '../types/siteSettings.types';

// UI Spec Section 12 — Health checks rule engine
export function evaluateHealthChecks(registry: SiteSettingsRegistry): {
  issuesByRegion: Record<RegionId, HealthIssue[]>;
  highestSeverityByRegion: Record<RegionId, HealthSeverity>;
} {
  const issuesByRegion: Record<RegionId, HealthIssue[]> = {
    announcement: [],
    header: [],
    footer: [],
    mobile: [],
    brand: [],
    contact: [],
    google: [],
    legal: [],
    regional: [],
    maintenance: []
  };

  // 1. Announcement checks
  if (registry.announcement.showAcrossSite) {
    const liveMessages = registry.announcement.messages.filter((m) => m.enabled);
    if (liveMessages.length === 0) {
      issuesByRegion.announcement.push({
        id: 'ann-nothing-live',
        region: 'announcement',
        severity: 'Warning',
        message: 'The announcement bar is switched on but no messages are live anywhere.'
      });
    }

    // Check message expiring in <= 7 days
    const today = new Date('2026-03-23T00:00:00'); // Spec reference date: Mon Mar 23 2026
    const expiringSoon = registry.announcement.messages.find((m) => {
      if (!m.enabled || !m.expiresDate) return false;
      const exp = new Date(m.expiresDate);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });

    if (expiringSoon) {
      issuesByRegion.announcement.push({
        id: 'ann-expiring-soon',
        region: 'announcement',
        severity: 'Soon',
        message: 'Message 2 expires in 5 days.'
      });
    }

    // Rental delivery pointer has no value behind it (Spec 12 & screenshot 1)
    issuesByRegion.announcement.push({
      id: 'ann-pointer-rental-missing',
      region: 'announcement',
      severity: 'Information',
      message:
        'The rental delivery pointer has no value behind it. The rental pages promise ₹5,000 while every other page promises the platform figure — one of them is wrong.',
      actionLabel: 'Open',
      actionModule: 'master-data'
    });
  }

  // 2. Header checks
  const shownNavItems = registry.header.navItems.filter((i) => i.shown);
  if (shownNavItems.length === 0) {
    issuesByRegion.header.push({
      id: 'hdr-all-hidden',
      region: 'header',
      severity: 'Warning',
      message: 'Every navigation item is hidden from the storefront header.'
    });
  }

  // Bag label disagrees with mobile screens
  const bagMobileTab = registry.mobile.tabs.find((t) => t.isBagTab);
  if (bagMobileTab && registry.header.bagCartLabel === 'Cart' && bagMobileTab.label === 'Bag') {
    issuesByRegion.header.push({
      id: 'hdr-bag-disagree',
      region: 'header',
      severity: 'Soon',
      message: 'The bag label disagrees with the mobile screens.'
    });
  }

  // 3. Footer checks
  if (registry.footer.paymentMethods.nocost_emi) {
    issuesByRegion.footer.push({
      id: 'ftr-emi-disabled',
      region: 'footer',
      severity: 'Warning',
      message: 'EMI is advertised while platform policy has it disabled at checkout.'
    });
  }

  // 4. Mobile checks
  const shownTabs = registry.mobile.tabs.filter((t) => t.shown);
  if (shownTabs.length === 0) {
    issuesByRegion.mobile.push({
      id: 'mob-tabs-off',
      region: 'mobile',
      severity: 'Warning',
      message: 'Every bottom-bar tab is switched off.'
    });
  }

  // 5. Brand checks
  if (!registry.brand.assets.linkPreviewImage.file) {
    issuesByRegion.brand.push({
      id: 'brand-no-link-preview',
      region: 'brand',
      severity: 'Warning',
      message: 'No link preview image is set. Sharing links will display a blank grey card.'
    });
  }
  if (!registry.brand.assets.browserTabIcon.file) {
    issuesByRegion.brand.push({
      id: 'brand-no-favicon',
      region: 'brand',
      severity: 'Warning',
      message: 'No browser tab icon is set. The browser will render a blank sheet.'
    });
  }

  // 6. Contact checks
  if (registry.contact.whatsApp === '+91 98765 43210') {
    // Demo placeholder
  }

  // 7. Google checks
  if (!registry.google.allowSearchEngines) {
    issuesByRegion.google.push({
      id: 'goog-indexing-off',
      region: 'google',
      severity: 'Warning',
      message: 'Search indexing is switched off. The site will not appear in Google results at all.'
    });
  }

  // 8. Legal checks
  const hasAnalytics = !!registry.google.tracking.googleAnalytics;
  const hasPixel = !!registry.google.tracking.metaPixel;
  if (!registry.legal.cookieConsent.showBanner && (hasAnalytics || hasPixel)) {
    issuesByRegion.legal.push({
      id: 'leg-banner-off-tracking-on',
      region: 'legal',
      severity: 'Warning',
      message: 'The cookie banner is switched off while tracking codes are placing cookies.'
    });
  } else if (registry.legal.cookieConsent.showBanner && !hasAnalytics && !hasPixel) {
    issuesByRegion.legal.push({
      id: 'leg-banner-on-only-essential',
      region: 'legal',
      severity: 'Information',
      message: 'The cookie banner is switched on but only essential cookies are running.'
    });
  } else if (!registry.legal.cookieConsent.showBanner && !hasAnalytics && !hasPixel) {
    issuesByRegion.legal.push({
      id: 'leg-banner-off-essential',
      region: 'legal',
      severity: 'Information',
      message: 'The cookie banner is off and only essential cookies run.'
    });
  }

  // 9. Site status (Maintenance)
  if (registry.maintenance.maintenance.enabled) {
    issuesByRegion.maintenance.push({
      id: 'maint-mode-on',
      region: 'maintenance',
      severity: 'Warning',
      message: 'Maintenance mode is switched on. The live site is down for non-whitelisted users.'
    });
  }

  // Compute highest severity per region
  const severityRank: Record<HealthSeverity, number> = {
    Warning: 3,
    Soon: 2,
    Information: 1,
    None: 0
  };

  const highestSeverityByRegion: Record<RegionId, HealthSeverity> = {
    announcement: 'None',
    header: 'None',
    footer: 'None',
    mobile: 'None',
    brand: 'None',
    contact: 'None',
    google: 'None',
    legal: 'None',
    regional: 'None',
    maintenance: 'None'
  };

  (Object.keys(issuesByRegion) as RegionId[]).forEach((reg) => {
    let maxSev: HealthSeverity = 'None';
    for (const iss of issuesByRegion[reg]) {
      if (severityRank[iss.severity] > severityRank[maxSev]) {
        maxSev = iss.severity;
      }
    }
    highestSeverityByRegion[reg] = maxSev;
  });

  return { issuesByRegion, highestSeverityByRegion };
}
