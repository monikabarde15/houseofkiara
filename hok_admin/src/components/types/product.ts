export interface Product {
  id?: string;
  productId?: string;
  _id?: string;
  name: string;
  designer?: string;
  subtitle?: string;
  description?: string;
  story?: string;
  category?: string;
  gender?: string;
  occasion?: string;
  material?: string;
  color?: string;
  colorFamily?: string;
  /** Structured colours picked in admin; first entry = primary colour */
  colors?: { name: string; hex: string; family: string }[];
  careByFabric?: string;
  care?: string[];
  craft?: string;
  technique?: string;
  embellishments?: string;
  threadYarnDetail?: string;
  threadWork?: string;
  setIncludes?: string;
  origin?: string;
  sizes?: string[];
  sizeGuide?: string;
  measurements?: {
    bust?: string;
    waist?: string;
    hips?: string;
    length?: string;
  };
  measurementsCm?: {
    bust?: string;
    waist?: string;
    hips?: string;
    length?: string;
  };
  bestSuitedForHeight?: string;
  weight?: string;
  set?: Array<{
    uid?: string;
    piece: string;
    name: string;
    m: Record<string, { v?: string; open?: string; take?: string }>;
    d: { padded?: string; cancan?: string; closure?: string };
  }>;
  fitDesc?: string;
  fitNote?: string;
  fitNotes?: string;
  measuredBy?: string;
  measuredOn?: string;
  designerLabel?: string;
  ownerSize?: string;
  heightFrom?: string;
  heightTo?: string;
  listingModes?: string[];
  availability?: string;
  status?: string;
  condition?: string;
  honestDisclosure?: string;
  rentalPrice?: number;
  securityDeposit?: number;
  listingPrice?: number;
  commissionRate?: number;
  minimumDurationDays?: number;
  extensionWindowDays?: number;
  cleaningBufferDays?: number;
  preRentalBufferDays?: number;
  postRentalBufferDays?: number;
  deliveryTiming?: string;
  taxRate?: number;
  gstRate?: number;
  cleaningFee?: number;
  extensionPrice?: number;
  listerId?: string;
  payoutPercentage?: number;
  payoutTerms?: string;
  rating?: number;
  reviewCount?: number;
  timesRented?: number;
  listerName?: string;
  rentalStatus?: string;
  currentRenterName?: string;
  currentOrderId?: string;
  rentUntil?: string;
  nextFreeDate?: string;
  earnedAmount?: number;
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  urlSlug?: string;
  tags?: string[];
  relatedProductIds?: string[];
  sku?: string;
  blockedDates?: Array<{
    from: string;
    to: string;
    reason: string;
  }>;
  bookingHistory?: Array<{
    orderId: string;
    customerName?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    amount?: number;
    deposit?: number;
    mode?: string;
    status?: string;
    source?: string;
    whatsappNumber?: string;
    city?: string;
    channel?: string;
    listerSplitPercent?: number;
    splitNote?: string;
    depositStatus?: string;
  }>;
  extendedWindowPrice?: number;
  perDayRate?: number;
  originalRetailPrice?: number;
  resalePayoutPercentage?: number;
  minimumOffer?: number;
  externalBookings?: any[];
  activityLog?: Array<{
    action: string;
    user?: string;
    createdAt?: string;
    remarks?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}
// Lister type
export interface Lister {
  id?: string;
  listerId?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  payoutPercentage?: number;
  status?: "active" | "inactive" | "pending";
  createdAt?: string;
  updatedAt?: string;
}
export interface BlockedDate {
  from: string;
  to: string;
  reason: string;
}

export interface BookingHistory {
  orderId: string;
  customerName: string;
  date: string;
  amount: number;
  status: string;
}

export interface PayoutRecord {
  id?: string;
  _id?: string;
  payoutId?: string;
  orderId: string;
  transactionAmount: number;
  netPayout?: number;
  listerShare?: number;
  hokCommission?: number;
  status: string;
  payoutPercent?: number;
  amount?: number;
  transactionValue?: number;
  transactionLabel?: string;
  date?: string;
  listerName?: string;
  type?: string;
}

export interface ActivityLog {
  action: string;
  remarks: string;
  user: string;
  timestamp: string;
}

export type ProductTab =
  | "Core"
  | "Pricing"
  | "Images"
  | "Related Products"
  | "SEO"
  | "Calendar"
  | "Payout History"
  | "Enquiry History"
  | "Activity Log";
