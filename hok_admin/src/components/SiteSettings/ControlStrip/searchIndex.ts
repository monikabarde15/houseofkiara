import { RegionId } from '../types/siteSettings.types';

export interface SearchEntry {
  name: string;
  synonyms?: string[];
  regionId: RegionId;
  targetFieldId: string;
  regionLabel: string;
}

// 76 distinct entries covering all ten regions (Spec 6.1 & 19)
export const SEARCH_INDEX: SearchEntry[] = [
  // 1. Announcement bar
  { name: 'Show the bar across the site', synonyms: ['announcement toggle', 'bar master switch', 'enable announcement'], regionId: 'announcement', targetFieldId: 'ann-show-across-site', regionLabel: 'Announcement' },
  { name: 'How it moves', synonyms: ['scrolling loop', 'static row', 'movement style'], regionId: 'announcement', targetFieldId: 'ann-how-it-moves', regionLabel: 'Announcement' },
  { name: 'Loop time (seconds)', synonyms: ['speed', 'duration', 'pass time'], regionId: 'announcement', targetFieldId: 'ann-loop-time', regionLabel: 'Announcement' },
  { name: 'Pause when the cursor is over it', synonyms: ['hover pause', 'stop on hover'], regionId: 'announcement', targetFieldId: 'ann-pause-on-hover', regionLabel: 'Announcement' },
  { name: 'Announcement messages', synonyms: ['messages list', 'phrases', 'bar items'], regionId: 'announcement', targetFieldId: 'ann-messages-card', regionLabel: 'Announcement' },
  { name: 'Announcement background colour', synonyms: ['bar background', 'announcement bg'], regionId: 'announcement', targetFieldId: 'ann-bg-color', regionLabel: 'Announcement' },
  { name: 'Announcement text colour', synonyms: ['bar text color', 'announcement text'], regionId: 'announcement', targetFieldId: 'ann-text-color', regionLabel: 'Announcement' },
  { name: 'Announcement italic line colour', synonyms: ['italic line color', 'serif color'], regionId: 'announcement', targetFieldId: 'ann-italic-color', regionLabel: 'Announcement' },
  { name: 'Announcement separator', synonyms: ['divider', 'middle dot', 'slash dot'], regionId: 'announcement', targetFieldId: 'ann-separator', regionLabel: 'Announcement' },

  // 2. Header
  { name: 'Navigation items', synonyms: ['menu list', 'nav links', 'main menu'], regionId: 'header', targetFieldId: 'header-nav-items', regionLabel: 'Header' },
  { name: 'Shop by Category menu', synonyms: ['categories menu', 'dropdown categories'], regionId: 'header', targetFieldId: 'header-menu-categories', regionLabel: 'Header' },
  { name: 'Shop by Designer menu', synonyms: ['designers menu', 'dropdown designers'], regionId: 'header', targetFieldId: 'header-menu-designers', regionLabel: 'Header' },
  { name: 'Search placeholder', synonyms: ['search input text', 'search box hint'], regionId: 'header', targetFieldId: 'header-search-placeholder', regionLabel: 'Header' },
  { name: 'Bag / Cart label', synonyms: ['cart', 'bag', 'cart label'], regionId: 'header', targetFieldId: 'header-bag-cart-label', regionLabel: 'Header' },
  { name: 'Header stays fixed while scrolling', synonyms: ['sticky header', 'fixed nav'], regionId: 'header', targetFieldId: 'header-sticky-toggle', regionLabel: 'Header' },
  { name: 'Show the tagline under the wordmark', synonyms: ['header tagline', 'show tagline'], regionId: 'header', targetFieldId: 'header-show-tagline', regionLabel: 'Header' },
  { name: 'Reduced header back link', synonyms: ['checkout back link', 'return to cart'], regionId: 'header', targetFieldId: 'header-reduced-back', regionLabel: 'Header' },
  { name: 'Reduced header security line', synonyms: ['ssl line', 'secured by razorpay'], regionId: 'header', targetFieldId: 'header-reduced-security', regionLabel: 'Header' },
  { name: 'Reduced header pages', synonyms: ['pages using reduced header', 'checkout header'], regionId: 'header', targetFieldId: 'header-reduced-pages', regionLabel: 'Header' },

  // 3. Footer
  { name: 'Footer link columns', synonyms: ['footer shop', 'footer columns', 'footer navigation'], regionId: 'footer', targetFieldId: 'footer-link-columns', regionLabel: 'Footer' },
  { name: 'Footer legal row', synonyms: ['policy links', 'terms link', 'privacy link', 'footer policies'], regionId: 'footer', targetFieldId: 'footer-legal-row', regionLabel: 'Footer' },
  { name: 'Blurb under the wordmark', synonyms: ['footer blurb', 'footer quote'], regionId: 'footer', targetFieldId: 'footer-blurb', regionLabel: 'Footer' },
  { name: 'Copyright line', synonyms: ['copyright', 'all rights reserved', 'footer copyright'], regionId: 'footer', targetFieldId: 'footer-copyright', regionLabel: 'Footer' },
  { name: 'Trust badges', synonyms: ['secure payments', 'circular fashion badge'], regionId: 'footer', targetFieldId: 'footer-trust-badges', regionLabel: 'Footer' },
  { name: 'Payment methods', synonyms: ['upi', 'visa', 'mastercard', 'rupay', 'netbanking', 'paytm', 'amex', 'no-cost emi'], regionId: 'footer', targetFieldId: 'footer-payment-methods', regionLabel: 'Footer' },
  { name: 'Newsletter block', synonyms: ['newsletter toggle', 'subscribe block', 'email signup'], regionId: 'footer', targetFieldId: 'footer-newsletter', regionLabel: 'Footer' },

  // 4. Mobile bar
  { name: 'Mobile bottom bar tabs', synonyms: ['mobile tabs', 'bottom nav', 'home browse wishlist bag account'], regionId: 'mobile', targetFieldId: 'mobile-tabs', regionLabel: 'Mobile bar' },
  { name: 'Mobile search field', synonyms: ['drawer search', 'hamburger search'], regionId: 'mobile', targetFieldId: 'mobile-drawer-search', regionLabel: 'Mobile bar' },
  { name: 'Mobile mode shortcuts', synonyms: ['drawer mode shortcuts', 'rent preloved buy new chips'], regionId: 'mobile', targetFieldId: 'mobile-drawer-shortcuts', regionLabel: 'Mobile bar' },
  { name: 'Hamburger drawer items', synonyms: ['drawer menu', 'mobile menu rows'], regionId: 'mobile', targetFieldId: 'mobile-drawer-items', regionLabel: 'Mobile bar' },

  // 5. Brand & assets
  { name: 'Site name', synonyms: ['brand name', 'store name', 'house of kaira'], regionId: 'brand', targetFieldId: 'brand-site-name', regionLabel: 'Brand & assets' },
  { name: 'Tagline', synonyms: ['brand tagline', 'circular luxury fashion'], regionId: 'brand', targetFieldId: 'brand-tagline', regionLabel: 'Brand & assets' },
  { name: 'Brand quote', synonyms: ['brand mission', 'every outfit has a story'], regionId: 'brand', targetFieldId: 'brand-quote', regionLabel: 'Brand & assets' },
  { name: 'Logo mark', synonyms: ['logo', 'emblem', 'mark', 'brand mark'], regionId: 'brand', targetFieldId: 'brand-asset-logo-mark', regionLabel: 'Brand & assets' },
  { name: 'Wordmark', synonyms: ['brand wordmark', 'lettering', 'logo lettering'], regionId: 'brand', targetFieldId: 'brand-asset-wordmark', regionLabel: 'Brand & assets' },
  { name: 'Inverse mark', synonyms: ['white logo', 'dark background mark'], regionId: 'brand', targetFieldId: 'brand-asset-inverse-mark', regionLabel: 'Brand & assets' },
  { name: 'Browser tab icon', synonyms: ['favicon', 'tab icon', 'browser icon'], regionId: 'brand', targetFieldId: 'brand-asset-browser-tab-icon', regionLabel: 'Brand & assets' },
  { name: 'Phone home screen icon', synonyms: ['app icon', 'touch icon', 'home screen icon'], regionId: 'brand', targetFieldId: 'brand-asset-phone-icon', regionLabel: 'Brand & assets' },
  { name: 'Link preview image', synonyms: ['share image', 'og:image', 'social preview', 'social image'], regionId: 'brand', targetFieldId: 'brand-asset-link-preview', regionLabel: 'Brand & assets' },
  { name: 'Palette & type reference', synonyms: ['colors reference', 'typefaces', 'cormorant garamond', 'inter'], regionId: 'brand', targetFieldId: 'brand-palette-type', regionLabel: 'Brand & assets' },

  // 6. Contact & social
  { name: 'Support email', synonyms: ['contact email', 'help email', 'hello@houseofkaira.com'], regionId: 'contact', targetFieldId: 'contact-support-email', regionLabel: 'Contact & social' },
  { name: 'Support phone', synonyms: ['phone number', 'call support'], regionId: 'contact', targetFieldId: 'contact-support-phone', regionLabel: 'Contact & social' },
  { name: 'WhatsApp number', synonyms: ['whatsapp', 'support whatsapp'], regionId: 'contact', targetFieldId: 'contact-support-whatsapp', regionLabel: 'Contact & social' },
  { name: 'Days open', synonyms: ['opening days', '7 days a week', 'working days'], regionId: 'contact', targetFieldId: 'contact-days-open', regionLabel: 'Contact & social' },
  { name: 'Support hours', synonyms: ['opening hours', '10 AM – 8 PM IST', 'timing'], regionId: 'contact', targetFieldId: 'contact-hours', regionLabel: 'Contact & social' },
  { name: 'Reply within (hrs)', synonyms: ['response time', 'sla', 'reply time'], regionId: 'contact', targetFieldId: 'contact-reply-within', regionLabel: 'Contact & social' },
  { name: 'Returns address', synonyms: ['return address', 'courier address', 'pickup address', '14 vijay nagar'], regionId: 'contact', targetFieldId: 'contact-returns-address', regionLabel: 'Contact & social' },
  { name: 'Returns PIN code', synonyms: ['returns pincode', 'postal code', '452010'], regionId: 'contact', targetFieldId: 'contact-returns-pin', regionLabel: 'Contact & social' },
  { name: 'Floating WhatsApp button', synonyms: ['whatsapp widget', 'chat with us button'], regionId: 'contact', targetFieldId: 'contact-whatsapp-button', regionLabel: 'Contact & social' },
  { name: 'Instagram handle', synonyms: ['instagram', '@house_of_kaira', 'insta'], regionId: 'contact', targetFieldId: 'contact-instagram', regionLabel: 'Contact & social' },
  { name: 'Social channels', synonyms: ['facebook', 'pinterest', 'youtube', 'linkedin'], regionId: 'contact', targetFieldId: 'contact-social-channels', regionLabel: 'Contact & social' },

  // 7. Google & sharing
  { name: 'Google headline', synonyms: ['meta title', 'google title', 'serp headline'], regionId: 'google', targetFieldId: 'google-headline', regionLabel: 'Google & sharing' },
  { name: 'Google description', synonyms: ['meta description', 'serp description', 'snippets'], regionId: 'google', targetFieldId: 'google-description', regionLabel: 'Google & sharing' },
  { name: 'Allow Google and other search engines', synonyms: ['search indexing', 'robots', 'noindex', 'let google list'], regionId: 'google', targetFieldId: 'google-indexing-toggle', regionLabel: 'Google & sharing' },
  { name: 'Google Analytics', synonyms: ['ga4', 'tracking code', 'measurement id', 'g-xxxxxxxxxx'], regionId: 'google', targetFieldId: 'google-analytics', regionLabel: 'Google & sharing' },
  { name: 'Meta Pixel', synonyms: ['facebook pixel', 'pixel id', 'meta tracking'], regionId: 'google', targetFieldId: 'google-meta-pixel', regionLabel: 'Google & sharing' },
  { name: 'Google Search Console', synonyms: ['gsc', 'verification tag', 'html tag method'], regionId: 'google', targetFieldId: 'google-search-console', regionLabel: 'Google & sharing' },
  { name: 'Title template', synonyms: ['seo template', 'page title template', 'developer handle'], regionId: 'google', targetFieldId: 'google-title-template', regionLabel: 'Google & sharing' },
  { name: 'Canonical address', synonyms: ['canonical domain', 'site real address'], regionId: 'google', targetFieldId: 'google-canonical-address', regionLabel: 'Google & sharing' },
  { name: 'Publish sitemap.xml', synonyms: ['sitemap', 'sitemap toggle'], regionId: 'google', targetFieldId: 'google-sitemap', regionLabel: 'Google & sharing' },

  // 8. Legal & consent
  { name: 'Registered company name', synonyms: ['legal name', 'house of kaira retail pvt ltd'], regionId: 'legal', targetFieldId: 'legal-registered-name', regionLabel: 'Legal & consent' },
  { name: 'GSTIN', synonyms: ['gst number', 'gst tax id', '23AABCH1234K1ZV'], regionId: 'legal', targetFieldId: 'legal-gstin', regionLabel: 'Legal & consent' },
  { name: 'CIN', synonyms: ['corporate identity number', 'cin number'], regionId: 'legal', targetFieldId: 'legal-cin', regionLabel: 'Legal & consent' },
  { name: 'Registered address', synonyms: ['official address', 'invoice address'], regionId: 'legal', targetFieldId: 'legal-registered-address', regionLabel: 'Legal & consent' },
  { name: 'Cookie consent banner', synonyms: ['cookie banner', 'show consent banner', 'gdpr banner', 'dpdp'], regionId: 'legal', targetFieldId: 'legal-cookie-banner', regionLabel: 'Legal & consent' },
  { name: 'Cookie banner position', synonyms: ['bottom bar', 'bottom-left card', 'centre modal'], regionId: 'legal', targetFieldId: 'legal-cookie-position', regionLabel: 'Legal & consent' },
  { name: 'Cookie consent categories', synonyms: ['essential cookies', 'analytics cookies', 'marketing cookies'], regionId: 'legal', targetFieldId: 'legal-cookie-categories', regionLabel: 'Legal & consent' },

  // 9. Regional
  { name: 'Timezone', synonyms: ['asia/kolkata', 'ist', 'gst', 'gmt', 'time zone'], regionId: 'regional', targetFieldId: 'regional-timezone', regionLabel: 'Regional' },
  { name: 'Currency', synonyms: ['inr', 'usd', 'aed', 'gbp', 'rupee symbol'], regionId: 'regional', targetFieldId: 'regional-currency', regionLabel: 'Regional' },
  { name: 'Date format', synonyms: ['dd mmm yyyy', 'dd/mm/yyyy', 'date display'], regionId: 'regional', targetFieldId: 'regional-date-format', regionLabel: 'Regional' },
  { name: 'Number format', synonyms: ['lakh and crore', 'thousand and million', 'indian number format'], regionId: 'regional', targetFieldId: 'regional-number-format', regionLabel: 'Regional' },

  // 10. Site status
  { name: 'Maintenance mode', synonyms: ['take site down', 'holding page', 'maintenance toggle'], regionId: 'maintenance', targetFieldId: 'status-maintenance-toggle', regionLabel: 'Maintenance' },
  { name: 'Maintenance expected back', synonyms: ['expected back time', 'downtime notice'], regionId: 'maintenance', targetFieldId: 'status-maintenance-expected', regionLabel: 'Maintenance' },
  { name: 'Maintenance allow list', synonyms: ['whitelisted accounts', 'ops bypass'], regionId: 'maintenance', targetFieldId: 'status-maintenance-allow-list', regionLabel: 'Maintenance' },
  { name: '404 not found page', synonyms: ['404 page', 'error page', 'this piece has moved on'], regionId: 'maintenance', targetFieldId: 'status-404-page', regionLabel: 'Maintenance' }
];

export function searchSettingsIndex(query: string): SearchEntry[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const matched: SearchEntry[] = [];
  const seenTargets = new Set<string>();

  for (const item of SEARCH_INDEX) {
    if (seenTargets.has(item.targetFieldId)) continue;

    const nameMatch = item.name.toLowerCase().includes(clean);
    const synMatch = item.synonyms?.some((s) => s.toLowerCase().includes(clean));

    if (nameMatch || synMatch) {
      matched.push(item);
      seenTargets.add(item.targetFieldId);
      if (matched.length >= 7) break; // Maximum of seven results (Spec 6.1)
    }
  }

  return matched;
}
