export type RegionId =
  | 'announcement'
  | 'header'
  | 'footer'
  | 'mobile'
  | 'brand'
  | 'contact'
  | 'google'
  | 'legal'
  | 'regional'
  | 'maintenance';

export type UserRole = 'SUPER_ADMIN' | 'OPERATIONS_MANAGER';

export type ScopeOption =
  | 'All pages'
  | 'Rent'
  | 'Preloved'
  | 'Buy New'
  | 'List Your Piece'
  | 'Account';

export type MessageState = 'Live' | 'Scheduled' | 'Expired' | 'Off';

export interface AnnouncementMessageItem {
  id: string;
  text: string;
  italicSerif: boolean;
  showsOn: ScopeOption;
  link: string;
  goLiveDate: string; // YYYY-MM-DD or blank
  expiresDate: string; // YYYY-MM-DD or blank
  enabled: boolean;
}

export interface AnnouncementSettings {
  showAcrossSite: boolean;
  howItMoves: 'Scrolling loop' | 'Static row';
  loopTimeSeconds: number;
  pauseOnHover: boolean;
  backgroundColor: string;
  textColor: string;
  italicLineColor: string;
  separator: 'Dot' | 'Middle dot' | 'Slash' | 'None';
  messages: AnnouncementMessageItem[];
}

export interface MenuItemLink {
  id: string;
  label: string;
  path: string;
  position?: 'last'; // sits under divider at bottom
  hidden?: boolean;
}

export interface MenuColumn {
  id: string;
  heading: string;
  links: MenuItemLink[];
  hidden?: boolean;
}

export interface NavItem {
  id: string;
  shown: boolean;
  label: string;
  link: string;
  badge: string;
  style: 'Plain' | 'Accent' | 'Highlight';
  hasMenu: boolean;
  menuEnabled: boolean;
  menuColumns: MenuColumn[];
  isExpanded?: boolean;
}

export interface HeaderSettings {
  navItems: NavItem[];
  searchPlaceholder: string;
  bagCartLabel: 'Cart' | 'Bag';
  stickyHeader: boolean;
  showTagline: boolean;
  reducedHeader: {
    backLink: string;
    securityLine: string;
    pagesUsingIt: string;
  };
}

export interface FooterLinkColumn {
  id: string;
  heading: string;
  links: { id: string; label: string; path: string }[];
}

export interface FooterSettings {
  linkColumns: FooterLinkColumn[];
  legalRow: { id: string; label: string; path: string }[];
  blurbUnderWordmark: string;
  copyrightLine: string;
  trustBadges: string;
  paymentMethods: {
    [key: string]: boolean; // upi, visa, mastercard, rupay, netbanking, paytm, amex, nocost_emi
  };
  newsletter: {
    show: boolean;
    heading?: string;
    buttonLabel?: string;
    body?: string;
    consentLine?: string;
  };
}

export interface MobileBarTabItem {
  id: string;
  label: string;
  path: string;
  shown: boolean;
  isBagTab?: boolean;
}

export interface MobileBarSettings {
  tabs: MobileBarTabItem[];
  drawer: {
    showSearchField: boolean;
    showModeShortcuts: boolean;
    itemVisibility: { [navItemId: string]: boolean };
  };
}

export interface BrandAssetSlot {
  file: string; // filename or empty
  dataUrl?: string;
  dimensions?: string;
  sizeKb?: number;
  addedBy?: string;
  addedWhen?: string;
}

export interface BrandSettings {
  siteName: string;
  tagline: string;
  brandQuote: string;
  assets: {
    logoMark: BrandAssetSlot;
    wordmark: BrandAssetSlot;
    inverseMark: BrandAssetSlot;
    browserTabIcon: BrandAssetSlot;
    phoneHomeScreenIcon: BrandAssetSlot;
    linkPreviewImage: BrandAssetSlot;
  };
}

export interface ReturnsAddress {
  addressedTo: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
  contactNumber: string;
}

export interface ContactSettings {
  supportEmail: string;
  phone: string;
  whatsApp: string;
  daysOpen: string;
  hours: string;
  replyWithinHrs: number;
  returnsAddress: ReturnsAddress;
  whatsAppButton: {
    show: boolean;
    tooltip: string;
    preFilledMessage: string;
  };
  social: {
    instagram: string;
    followLabel: string;
    facebook: string;
    pinterest: string;
    youTube: string;
    linkedIn: string;
  };
}

export interface GoogleSettings {
  headline: string;
  description: string;
  allowSearchEngines: boolean;
  tracking: {
    googleAnalytics: string;
    metaPixel: string;
    googleSearchConsole: string;
  };
  devSettings: {
    titleTemplate: string;
    separator: string;
    canonicalAddress: string;
    publishSitemap: boolean;
  };
}

export interface LegalSettings {
  registeredEntity: {
    registeredName: string;
    gstin: string;
    cin: string;
    registeredAddress: string;
  };
  cookieConsent: {
    showBanner: boolean;
    heading: string;
    position: 'Bottom bar' | 'Bottom-left card' | 'Centre modal';
    body: string;
    acceptLabel: string;
    rejectLabel: string;
    manageLabel: string;
    policyLink: string;
    categories: {
      essential: string;
      analytics: string;
      marketing: string;
    };
  };
}

export interface RegionalSettings {
  timezone: 'Asia/Kolkata (IST)' | 'Asia/Dubai (GST)' | 'Europe/London (GMT)';
  currency: 'INR ₹' | 'USD $' | 'AED د.إ' | 'GBP £';
  dateFormat: 'DD MMM YYYY' | 'DD/MM/YYYY' | 'MMM DD, YYYY' | 'YYYY-MM-DD';
  numberFormat: 'Indian — lakh and crore' | 'International — thousand and million';
}

export interface SiteStatusSettings {
  maintenance: {
    enabled: boolean;
    heading: string;
    expectedBack: string;
    body: string;
    allowList: string;
  };
  notFoundPage: {
    heading: string;
    body: string;
    suggestedLinks: string;
  };
}

export interface SiteSettingsRegistry {
  announcement: AnnouncementSettings;
  header: HeaderSettings;
  footer: FooterSettings;
  mobile: MobileBarSettings;
  brand: BrandSettings;
  contact: ContactSettings;
  google: GoogleSettings;
  legal: LegalSettings;
  regional: RegionalSettings;
  maintenance: SiteStatusSettings;
}

export type HealthSeverity = 'Warning' | 'Soon' | 'Information' | 'None';

export interface HealthIssue {
  id: string;
  region: RegionId;
  severity: HealthSeverity;
  message: string;
  actionModule?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface SearchResultItem {
  id: string;
  name: string;
  regionId: RegionId;
  targetFieldId: string;
}
