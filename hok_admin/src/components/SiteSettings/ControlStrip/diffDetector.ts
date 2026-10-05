import { SiteSettingsRegistry } from '../types/siteSettings.types';

// Human areas specified in UI Spec Section 6.2
export type ChangedAreaName =
  | 'Announcement bar'
  | 'Navigation'
  | 'Mobile bar'
  | 'Header'
  | 'Footer'
  | 'Brand'
  | 'Brand assets'
  | 'Contact'
  | 'Social'
  | 'Google & sharing'
  | 'Cookie consent'
  | 'Site status';

export function computeUnsavedChanges(
  current: SiteSettingsRegistry,
  baseline: SiteSettingsRegistry
): ChangedAreaName[] {
  const changes = new Set<ChangedAreaName>();

  // 1. Announcement bar
  if (JSON.stringify(current.announcement) !== JSON.stringify(baseline.announcement)) {
    changes.add('Announcement bar');
  }

  // 2. Navigation vs Header (longest matching prefix wins)
  if (JSON.stringify(current.header.navItems) !== JSON.stringify(baseline.header.navItems)) {
    changes.add('Navigation');
  }

  const currentHeaderOther = {
    searchPlaceholder: current.header.searchPlaceholder,
    bagCartLabel: current.header.bagCartLabel,
    stickyHeader: current.header.stickyHeader,
    showTagline: current.header.showTagline,
    reducedHeader: current.header.reducedHeader
  };
  const baselineHeaderOther = {
    searchPlaceholder: baseline.header.searchPlaceholder,
    bagCartLabel: baseline.header.bagCartLabel,
    stickyHeader: baseline.header.stickyHeader,
    showTagline: baseline.header.showTagline,
    reducedHeader: baseline.header.reducedHeader
  };
  if (JSON.stringify(currentHeaderOther) !== JSON.stringify(baselineHeaderOther)) {
    changes.add('Header');
  }

  // 3. Footer
  if (JSON.stringify(current.footer) !== JSON.stringify(baseline.footer)) {
    changes.add('Footer');
  }

  // 4. Mobile bar
  if (JSON.stringify(current.mobile) !== JSON.stringify(baseline.mobile)) {
    changes.add('Mobile bar');
  }

  // 5. Brand vs Brand assets
  if (
    current.brand.siteName !== baseline.brand.siteName ||
    current.brand.tagline !== baseline.brand.tagline ||
    current.brand.brandQuote !== baseline.brand.brandQuote
  ) {
    changes.add('Brand');
  }
  if (JSON.stringify(current.brand.assets) !== JSON.stringify(baseline.brand.assets)) {
    changes.add('Brand assets');
  }

  // 6. Contact vs Social
  const currentContactOnly = {
    supportEmail: current.contact.supportEmail,
    phone: current.contact.phone,
    whatsApp: current.contact.whatsApp,
    daysOpen: current.contact.daysOpen,
    hours: current.contact.hours,
    replyWithinHrs: current.contact.replyWithinHrs,
    returnsAddress: current.contact.returnsAddress,
    whatsAppButton: current.contact.whatsAppButton
  };
  const baselineContactOnly = {
    supportEmail: baseline.contact.supportEmail,
    phone: baseline.contact.phone,
    whatsApp: baseline.contact.whatsApp,
    daysOpen: baseline.contact.daysOpen,
    hours: baseline.contact.hours,
    replyWithinHrs: baseline.contact.replyWithinHrs,
    returnsAddress: baseline.contact.returnsAddress,
    whatsAppButton: baseline.contact.whatsAppButton
  };
  if (JSON.stringify(currentContactOnly) !== JSON.stringify(baselineContactOnly)) {
    changes.add('Contact');
  }
  if (JSON.stringify(current.contact.social) !== JSON.stringify(baseline.contact.social)) {
    changes.add('Social');
  }

  // 7. Google & sharing
  if (JSON.stringify(current.google) !== JSON.stringify(baseline.google)) {
    changes.add('Google & sharing');
  }

  // 8. Cookie consent & Legal
  if (JSON.stringify(current.legal) !== JSON.stringify(baseline.legal)) {
    changes.add('Cookie consent');
  }

  // 9. Site status & Regional
  if (
    JSON.stringify(current.maintenance) !== JSON.stringify(baseline.maintenance) ||
    JSON.stringify(current.regional) !== JSON.stringify(baseline.regional)
  ) {
    changes.add('Site status');
  }

  return Array.from(changes);
}
