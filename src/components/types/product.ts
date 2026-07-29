// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  designer: string;
  listerId?: string;
  listerName?: string;
  description: string;
  category: string;
  occasion: string;
  material: string;
  embellishments: string;
  sizes: string[];
  listingModes: ('Rental' | 'Preloved' | 'Buy')[];
  condition: string;
  availability: string;
  status: 'Live' | 'Archived' | 'Review';
  rentalPrice: number;
  securityDeposit: number;
  listingPrice: number;
  commissionRate: number;
  minimumDurationDays: number;
  extensionWindowDays: number;
  cleaningBufferDays: number;
  images: string[];
  seoTitle?: string;
  seoDescription?: string;
  urlSlug?: string;
  sku?: string;
  color?: string;
  craft?: string;
  technique?: string;
  story?: string;
  tags?: string[];
  taxRate?: number;
  gstRate?: number;
  cleaningFee?: number;
  extensionPrice?: number;
  measurements?: {
    bust?: string;
    waist?: string;
    hips?: string;
    length?: string;
  };
  relatedProductIds?: string[];
  blockedDates?: BlockedDate[];
  bookingHistory?: BookingHistory[];
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

export interface Lister {
  id: string;
  name: string;
  email?: string;
  phone?: string;
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
}

export interface ActivityLog {
  action: string;
  remarks: string;
  user: string;
  timestamp: string;
}

export type ProductTab = 
  | 'Core' 
  | 'Pricing' 
  | 'Images' 
  | 'Related Products'
  | 'SEO' 
  | 'Calendar' 
  |  'Payout History'
  | 'Activity Log';