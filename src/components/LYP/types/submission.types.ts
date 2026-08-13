// src/components/LYP/types/submission.types.ts

export type Channel = 'Website' | 'WhatsApp' | 'Instagram' | 'In Person';
export type Intent = 'Rent it' | 'Sell it' | 'Open to both';
export type Mode = 'Rental' | 'Preloved' | 'Rental/Preloved';
export type Grade = 'Pristine' | 'Excellent' | 'Good' | 'Fair';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Custom / Free Size' | 'Free Size';
export type Category = 
  | 'Bridal Lehenga' 
  | 'Reception Lehenga' 
  | 'Saree' 
  | 'Anarkali / Gown' 
  | 'Sherwani' 
  | 'Indo-Western' 
  | 'Suit Set' 
  | 'Other Occasion Wear';
export type Colour = 
  | 'Red / Maroon' 
  | 'Pink / Blush' 
  | 'Ivory / Cream' 
  | 'Gold / Champagne' 
  | 'Pastel Mint / Sage' 
  | 'Blue / Teal' 
  | 'Purple / Mauve' 
  | 'Black / Charcoal' 
  | 'Multi-colour';
export type TimesWorn = 'Never worn (tags on)' | 'Worn once' | 'Worn 2-3 times' | 'Worn 4+ times';
export type RejectReasonCode = 
  | 'Authenticity could not be verified' 
  | 'Condition below platform standard' 
  | 'Category not accepted' 
  | 'Outside serviceable cities' 
  | 'Expectations misaligned on pricing' 
  | 'Duplicate submission' 
  | 'Other';
export type VerificationMethod = 'Invoice seen' | 'Retail listing' | 'Brand confirmation' | 'Lister attested';
export type ListerStatus = 'Verified' | 'Pending Review' | 'Paused' | 'Suspended' | 'Rejected' | 'Exited';

export interface Measurements {
  bust?: string;
  waist?: string;
  hips?: string;
  shoulder?: string;
  length?: string;
  sleeve?: string;
  notes?: string;
}

export interface Media {
  name: string;
  url: string;
  kind: 'image' | 'video';
}

export interface TermsAcceptance {
  version: string;
  acceptedAt: string;
  ownership?: boolean;
}

export interface MoreInfo {
  on: string;
  lastNudge: string | null;
}

export interface Decision {
  what: 'Approved' | 'Rejected' | 'Withdrawn' | 'Expired';
  on: string;
  by: string;
  reasonCode?: string;
  reason?: string;
}

export interface Assessment {
  sku: string;
  name: string;
  mode: Mode;
  grade: Grade;
  sizeLabel: Size;
  measurements: Measurements | null;
  priceStd: number;
  priceExt: number;
  perDay: number;
  minDays: number;
  deposit: number;
  resalePrice: number;
  minOffer: number;
  retailPrice: number;
  retailVerifiedVia: VerificationMethod | null;
  payoutPctRental: number;
  payoutPctResale: number;
}

export interface HistoryEntry {
  c: 'gold' | 'sage' | 'terra' | 'muted';
  e: string;
  t: string;
}

export interface Lister {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  status: ListerStatus;
  initials: string;
}

export interface Submission {
  subid: string;
  listerID: string;
  channel: Channel;
  submittedAt: string;
  piece: string;
  designer: string;
  category: Category | string;
  colour: Colour | string;
  size: Size | string;
  measurements: Measurements | null;
  timesWorn: TimesWorn | string;
  yearOfPurchase: string;
  originalPrice: string;
  intent: Intent;
  expectation: { rent: string | null; sell: string | null };
  selfGrade: string;
  conditionClaim: string;
  story: string;
  notes: string;
  city: string;
  photos: number;
  videos: number;
  media: Media[];
  terms: TermsAcceptance | null;
  moreInfo: MoreInfo | null;
  replyAt: string | null;
  decision: Decision | null;
  assessment: Assessment;
  history: HistoryEntry[];
  email?: string | null;
  phone?: string | null;
}

export interface SubmissionFilters {
  search?: string;
  status?: string;
  intent?: Intent;
  channel?: Channel;
  dateFrom?: string;
  dateTo?: string;
  view?: 'review' | 'reply' | 'apps' | 'pieces' | 'apprmonth' | 'slowfirst';
}

export interface SubmissionStats {
  awaitingReview: number;
  awaitingReply: number;
  approvedThisMonth: number;
  medianFirstResponse: number | null;
  oldestHours: number;
  longestWaitDays: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}