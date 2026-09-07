import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'global_settings', unique: true },
  siteName: { type: String, default: 'House of Kaira' },
  tagline: { type: String, default: 'Curation of designer luxury dress rentals' },
  supportEmail: { type: String, default: 'support@houseofkaira.com' },
  whatsappNumber: { type: String, default: '+91 98765 43210' },
  instagramHandle: { type: String, default: '@houseofkaira' },
  
  // 1. Announcement Bar
  announcementBar: {
    text: { type: String, default: '' },
    enabled: { type: Boolean, default: false },
    howItMoves: { type: String, default: 'Scrolling loop' },
    loopTime: { type: Number, default: 28 },
    pauseOnHover: { type: Boolean, default: true },
    backgroundColor: { type: String, default: '#fdfbf7' },
    textColor: { type: String, default: '#332f2b' },
    italicColor: { type: String, default: '#786e65' },
    separator: { type: String, default: 'Dot' },
    messages: { type: Array, default: [] }
  },

  // 2. Header Navigation
  header: {
    shopByCategoryItems: { type: Array, default: [] },
    shopByDesignerItems: { type: Array, default: [] },
    navigationBlocks: { type: Array, default: [] },
    searchPlaceholder: { type: String, default: 'Search lehengas, designers, occasions...' },
    bagCartLabel: { type: String, default: 'Cart' },
    headerStaysFixed: { type: Boolean, default: true },
    showTaglineUnderWordmark: { type: Boolean, default: false },
    reducedHeader: {
      backLinkText: { type: String, default: 'Back to cart' },
      securityLineText: { type: String, default: 'SSL encrypted · Secured by Razorpay' },
      pagesUsingReducedHeader: { type: String, default: 'Checkout, Payment, Order confirmation' }
    }
  },

  // 3. Footer Navigation
  footer: {
    columns: { type: Array, default: [] },
    legalRowLinks: { type: Array, default: [] },
    taglineWordmarkText: { type: String, default: 'Prints: Circular Luxury Fashion (i)' },
    copyrightLineYear: { type: String, default: '2026' },
    copyrightHolderText: { type: String, default: 'House of Kaira. All rights reserved. Indore, India.' },
    trustBadgesText: { type: String, default: 'Secure Payments, Circular Fashion' },
    paymentMethodsText: { type: String, default: 'UPI, Visa, Mastercard, RuPay, Net Banking, Paytm, Amex' },
    showNewsletterBlock: { type: Boolean, default: false }
  },

  // 4. Mobile Bar & Drawer
  mobileBar: {
    bottomBarItems: { type: Array, default: [] },
    drawerItems: { type: Array, default: [] },
    showMobileSearchTop: { type: Boolean, default: true },
    showMobileModeShortcuts: { type: Boolean, default: true }
  }
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
