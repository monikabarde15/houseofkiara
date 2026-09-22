// src/components/Listers/types/lister.types.ts

export interface Address {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pin: string;
}

export interface BankDetails {
  holder: string;
  accct: string;
  ifsc: string;
  branch: string;
  upi: string;
  verified: boolean;
}

export interface TermsAcceptance {
  version: string;
  acceptedAt: string | null;
  channel: string | null;
}

export type ListerStatus = 
  | 'Verified'
  | 'Pending Review'
  | 'Paused'
  | 'Suspended'
  | 'Rejected'
  | 'Exited';

export type Channel = 'WhatsApp' | 'Instagram' | 'Website' | 'Walk-in';
export type Intent = 'Rent + Sell' | 'Rent only' | 'Sell only';
export type ConditionGrade = 'Pristine' | 'Excellent' | 'Good' | 'Fair';
export type PayoutStatus = 'Paid' | 'Pending Approval' | 'Approved' | 'On Hold';

export interface Media {
  name: string;
  url: string;
  kind: 'image' | 'video';
}

export interface Decision {
  what: 'Approved' | 'Rejected' | 'Withdrawn';
  on: string;
  by: string;
  reason: string | null;
}

export interface MoreInfo {
  on: string;
}

export interface Submission {
  subid: string;
  listerId: string;
  queueRow: number | null;
  piece: string;
  designer: string;
  category: string;
  submitted?: string;
  submittedAt?: string;
  createdAt?: string;
  channel: Channel;
  intent: Intent;
  askRent: string | null;
  askSell: string | null;
  conditionClaim: string;
  timesWorn: string;
  originalPrice: string;
  colour: string;
  size: string;
  photos: number;
  videos: number;
  media: Media[];
  notes: string | null;
  sku: string | null;
  decision?: Decision | null;
  moreInfo?: MoreInfo | null;
}

export interface Lister {
  id: string;
  slug: string;
  name: string;
  initials: string;
  phone: string;
  email: string | null;
  city: string;
  address: Address;
  insta: string | null;
  referral: string;
  source: 'Website (LXP)' | 'Manual (Admin)' | 'Website (LYP)';
  joined: string;
  status: ListerStatus;
  statusReason: string | null;
  pickup: Address;
  pickupPrefs: string | null;
  bank: BankDetails;
  gstReg: boolean;
  gstin: string | null;
  pan: string | null;
  panVerified: boolean;
  terms: TermsAcceptance;
  notes: string | null;
  customerId?: string | null;
}

export interface PayoutTransaction {
  id: string;
  listerId: string;
  orderId: string;
  sku: string;
  type: 'Rental' | 'Preloved Sale';
  tag: string;
  tv: number;
  pct: number;
  amount: number;
  commission: number;
  status: PayoutStatus;
  date: string;
  dueDate: string;
  ref: string | null;
  isDamage: boolean;
  stdPct: number | null;
  compPct: number | null;
  compAmount: number | null;
}

export interface ActivityEntry {
  c: 'sage' | 'gold' | 'terra' | 'muted';
  e: string;
  t: string;
}

export interface RecallRequest {
  id: string;
  pieceId: string;
  pieceName: string;
  status: 'Requested' | 'Scheduled' | 'Returned' | 'Declined';
  requestedDate: string;
  reason: string;
  scheduledDate: string | null;
  returnedDate: string | null;
  declinedDate: string | null;
  declinedReason: string | null;
}

export interface CommunicationEntry {
  id: string;
  channel: Channel;
  text: string;
  timestamp: string;
}

export interface ListerLedger {
  paid: number;
  pending: number;
  sales: number;
  rentals: number;
  tv: number;
  paidCount: number;
  avgPct: number | null;
}

export interface AttentionFlag {
  text: string;
  door: 'review' | 'payout' | 'profile' | 'listings' | 'submission' | null;
  target?: string;
}

export interface ListerFilters {
  status?: ListerStatus;
  search?: string;
  channel?: Channel;
  sortBy?: 'name' | 'listings' | 'earned' | 'pending' | 'joined';
  sortOrder?: 'asc' | 'desc';
}