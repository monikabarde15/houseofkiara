export type DesignerType = 
  | 'Couture House' 
  | 'Contemporary Label' 
  | 'Heritage Weave' 
  | 'Indie Designer' 
  | 'Unclassified';

export type CounterfeitRiskTier = 'High' | 'Medium' | 'Low';

export interface UnmappedLabel {
  id: string;
  name: string;
  skuCode: string;
  pieceCount: number;
}

export interface CommercialTerms {
  suppliesFreshStockBuyNow: boolean;
  commissionRateBuyNow: string;
  paymentTerms: string;
  brandFulfilmentPolicy: string;
  accountManagerName: string;
  contactEmail: string;
  contactPhone: string;
  internalNotes: string;
}

export interface Designer {
  id: string;
  name: string;
  slug: string;
  shortBio: string;
  type: DesignerType;
  joinedDate: string; // e.g. "01/09/2025" or "2026-03-01"
  inNewToHok: boolean;
  featured: boolean;
  featuredRank?: number; // e.g. 1, 2, 3...
  sortOrder: number;
  status: 'Active' | 'Suspended';
  activeListingsCount: number;
  totalPiecesCount: number;
  
  // Auth & Risk
  counterfeitRiskTier: CounterfeitRiskTier;
  authenticationChecklist: string;
  websiteUrl: string;
  instagramHandle: string;
  
  // Commercial
  commercialTerms: CommercialTerms;
}

export interface ListerSupplyRecord {
  listerId: string;
  listerName: string;
  piecesCount: number;
  livePiecesCount: number;
  lifetimeRentals: number;
}

export interface DesignerPiece {
  id: string;
  sku: string;
  name: string;
  listerName: string;
  images: string[];
  listingModes: ('Rental' | 'Preloved' | 'Buy')[];
  status: 'Live' | 'Review' | 'Off-live';
  rentalPriceText: string;
  rentalCountText: string;
  sellingPriceText?: string;
}

export interface DesignerPerformance {
  livePieces: number;
  lifetimeRentals: number;
  rentalRevenueBooked: string; // e.g. "₹71,000"
  prelovedGmvBooked: string;   // e.g. "₹95,000"
  supplyNetwork: ListerSupplyRecord[];
  supplyConcentrationNote: string;
  pricingBand: string;          // e.g. "₹6,400 - ₹9,900"
  averageRental: string;        // e.g. "₹8,267"
  averageRentalSubtext: string; // e.g. "6x rented"
  depositsBand: string;         // e.g. "₹20,000 - ₹25,000"
  velocity: string;             // e.g. "~1.8 / piece / mo"
  ratingText: string;           // e.g. "4.8 ★ 53 reviews"
  returnsAssessed: number;
  returnsWithIssues: number;
  returnsNote: string;
  distinctCustomers: number;
  repeatCustomers: number;
  topCustomerName: string;
  topCustomerOrders: string;
  offersEnquiriesText: string;  // e.g. "6 • 4 open"
  pieces: DesignerPiece[];
}

export interface AteliersPiece {
  id: string;
  rank: number;
  pieceName: string;
  designerName: string;
  joinedDate?: string;
}

export interface CurationState {
  featuredDesignerIds: string[];
  discoverByType: Record<DesignerType, string[]>;
  newToHokDesignerIds: string[];
  ateliersPinnedPieces: AteliersPiece[];
}
