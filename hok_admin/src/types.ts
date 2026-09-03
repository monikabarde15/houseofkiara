export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  isDefault?: boolean;
}

export interface CustomerOccasion {
  id: string;
  occasion: string;
  date?: string;
}

export interface Customer {
  id: string;
  customerId?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  ordersCount: number;
  lifetimeValue: number;
  totalSpent?: number;
  lastOrderDate: string;
  wishlistCount: number;
  joinedDate: string;
  status: 'Active' | 'Suspended';
  address?: string;
  gstin?: string;
  instagram?: string;
  birthDate?: string;
  referrer?: string;
  source?: string;
  flagReason?: string;
  preferences?: {
    preferredSize: string;
    preferredOccasions?: string;
    preferredSilhouettes: string;
    newsletter: boolean;
    whatsappNotifications: boolean;
    marketingOptIn?: boolean;
  };
  addresses?: SavedAddress[];
  occasions?: CustomerOccasion[];
  internalNotes?: string;
}

export interface Product {
  id?: string;
  listerId?: string;
  listerName?: string;
  name: string;
  designer?: string;
  description?: string;
  category?: string;
  occasion?: string;
  material?: string;
  embellishments?: string;
  sizes?: string[];
  listingModes?: string[];
  condition?: string;
  availability?: string;
  status?: string;
  rentalPrice?: number;
  securityDeposit?: number;
  listingPrice?: number;
  commissionRate?: number;
  minimumDurationDays?: number;
  extensionWindowDays?: number;
  cleaningBufferDays?: number;
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  urlSlug?: string;
  blockedDates?: { from: string; to: string; reason: string }[];
  bookingHistory?: { orderId: string; customerName?: string; date?: string; amount?: number; status?: string }[];
  sku?: string; color?: string; craft?: string; technique?: string; story?: string; tags?: string[]; measurements?: Record<string, string>;
  taxRate?: number; gstRate?: number; cleaningFee?: number; extensionPrice?: number; payoutPercentage?: number; relatedProductIds?: string[];
  _id?: string; productId?: string; reviewCount?: number; rentalStatus?: string; currentRenterName?: string; currentOrderId?: string; rentUntil?: string; nextFreeDate?: string; earnedAmount?: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  productName: string;
  invoiceNo?: string;
  invoiceDate?: string;
  items?: { productName: string; productId?: string; mode?: string; amount?: number; deposit?: number }[];
  designer: string;
  mode: 'Rental' | 'Preloved' | 'Buy';
  amount: number;
  deposit: number;
  discount: number;
  grandTotal: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
  status: 'Confirmed' | 'Dispatched' | 'Shipped' | 'Delivered' | 'Return Sent' | 'Returned' | 'Complete' | 'Processed';
  address: string;
  dispatchDetails?: {
    dispatchedBy: string;
    date: string;
    trackingNumber: string;
    courierPartner: string;
  };
  returnLogistics?: {
    returnDate: string;
    returnMethod: string;
    courierPartner: string;
    trackingNumber?: string;
  };
  conditionAssessment?: {
    receivedDate: string;
    receivedBy: string;
    grade: 'A' | 'B' | 'C' | 'D'; // A: Excellent, B: Good, C: Damaged, D: Signif. Damage
    notes: string;
  };
  depositDecision?: {
    status: 'Released' | 'Partial' | 'Forfeited' | 'Pending';
    releasedAmount: number;
    deductedAmount: number;
    reason: string;
    date?: string;
  };
  logs: { date: string; message: string; user: string }[];
  internalNotes?: string;
}

export interface Offer {
  id: string;
  backendId?: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  marketPrice: number;
  offerPrice: number;
  askPercentage: number;
  date: string;
    status: 'Pending' | 'Accepted' | 'Declined' | 'Countered' | 'Expired' | 'On Hold' | 'Enquiry';
    counterPrice?: number;
    channel?: string;
    phone?: string;
    note?: string;
}

export interface Designer {
  id: string;
  name: string;
  slug: string;
  activeListings: number;
  featured: boolean;
  status: 'Active' | 'Suspended';
  bio?: string;
  foundedYear?: string;
  website?: string;
  instagram?: string;
  location?: string;
  accountManager?: string;
  contactEmail?: string;
  contactPhone?: string;
  commissionOverride?: string;
  payoutTerms?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Lister {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  listingsCount: number;
  totalEarnings: number;
  totalEarned?: number;
  pendingPayout: number;
  status: 'Active' | 'Pending Review' | 'Suspended';
  joinedDate: string;
  instagram?: string;
  referrer?: string;
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  verified?: boolean;
  internalNotes?: string;
}

export interface ListerSubmission {
  id: string;
  listerName: string;
  listerId: string;
  productName: string;
  category: string;
  retailPrice: number;
  originalYear: string;
  condition: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  description: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountValue: number;
  discountType: 'Percentage' | 'Flat';
  minOrderValue: number;
  usageCount: number;
  maxUses: number;
  expiryDate: string;
  status: 'Active' | 'Expired';
  applicableModes: ('Rental' | 'Preloved' | 'Buy')[];
  maxUsesPerCustomer: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface AnnouncementMessage {
  id: string;
  status: string;
  scope: string;
  text: string;
  printItalicSerif: boolean;
  showsOn: string;
  link: string;
  goLiveDate: string;
  expiresDate: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  whatsappNumber: string;
  instagramHandle: string;
  logoUrl?: string;
  faviconUrl?: string;
  announcementBar: {
    text: string;
    enabled: boolean;
    howItMoves?: string;
    loopTime?: number;
    pauseOnHover?: boolean;
    backgroundColor: string;
    textColor: string;
    italicColor?: string;
    separator?: string;
    messages?: AnnouncementMessage[];
  };
  header?: {
    shopByCategoryItems?: any[];
    shopByDesignerItems?: any[];
    navigationBlocks?: any[];
    searchPlaceholder?: string;
    bagCartLabel?: string;
    headerStaysFixed?: boolean;
    showTaglineUnderWordmark?: boolean;
    reducedHeader?: {
      backLinkText?: string;
      securityLineText?: string;
      pagesUsingReducedHeader?: string;
    };
  };
  footer?: {
    columns?: any[];
    legalRowLinks?: any[];
    taglineWordmarkText?: string;
    copyrightLineYear?: string;
    copyrightHolderText?: string;
    trustBadgesText?: string;
    paymentMethodsText?: string;
    showNewsletterBlock?: boolean;
  };
  mobileBar?: {
    bottomBarItems?: any[];
    drawerItems?: any[];
    showMobileSearchTop?: boolean;
    showMobileModeShortcuts?: boolean;
  };
}

export interface HomepageEditor {
  hero: {
    heading: string;
    subheading: string;
    primaryCtaLabel: string;
    primaryCtaUrl: string;
    secondaryCtaLabel: string;
    secondaryCtaUrl: string;
    backgroundImageUrl?: string;
  };
  testimonials: { id: string; author: string; role: string; text: string; rating: number }[];
}
