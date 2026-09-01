// src/components/LYP/utils/constants.ts

import { 
  Channel, Intent, Mode, Category, Colour, Size, TimesWorn, Grade, 
  RejectReasonCode, VerificationMethod 
} from '../types/submission.types';

export const SUB_SLA_HOURS = 48;

export const CHANNELS: Channel[] = ['Website', 'WhatsApp', 'Instagram', 'In Person'];
export const INTENTS: Intent[] = ['Rent it', 'Sell it', 'Open to both'];
export const MODES: Mode[] = ['Rental', 'Preloved', 'Rental/Preloved'];
export const GRADES: Grade[] = ['Pristine', 'Excellent', 'Good', 'Fair'];
export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom / Free Size'];

export const CATEGORIES: Category[] = [
  'Bridal Lehenga',
  'Reception Lehenga',
  'Saree',
  'Anarkali / Gown',
  'Sherwani',
  'Indo-Western',
  'Suit Set',
  'Other Occasion Wear'
];

export const COLOURS: Colour[] = [
  'Red / Maroon',
  'Pink / Blush',
  'Ivory / Cream',
  'Gold / Champagne',
  'Pastel Mint / Sage',
  'Blue / Teal',
  'Purple / Mauve',
  'Black / Charcoal',
  'Multi-colour'
];

export const TIMES_WORN: TimesWorn[] = [
  'Never worn (tags on)',
  'Worn once',
  'Worn 2-3 times',
  'Worn 4+ times'
];

export const SELF_GRADE_OPTIONS: string[] = [
  'Pristine - unworn, tags intact',
  'Excellent - worn once, no visible wear',
  'Good - worn 2-3 times, minor wear',
  'Fair - some wear, best for rental'
];

export const REJECT_REASON_CODES: RejectReasonCode[] = [
  'Authenticity could not be verified',
  'Condition below platform standard',
  'Category not accepted',
  'Outside serviceable cities',
  'Expectations misaligned on pricing',
  'Duplicate submission',
  'Other'
];

export const VERIFICATION_METHODS: VerificationMethod[] = [
  'Invoice seen',
  'Retail listing',
  'Brand confirmation',
  'Lister attested'
];

export const STATUS_LABELS: Record<string, string> = {
  'New': 'New',
  'In Review': 'In Review',
  'Awaiting Reply': 'Awaiting Reply',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Withdrawn': 'Withdrawn',
  'Expired': 'Expired'
};

export const STATUS_CLASSES: Record<string, string> = {
  'New': 's-pend',
  'In Review': 's-pend',
  'Awaiting Reply': 's-pend',
  'Approved': 's-live',
  'Rejected': 's-sold',
  'Withdrawn': 's-draft',
  'Expired': 's-draft'
};

export const CHANNEL_CLASSES: Record<Channel, string> = {
  'WhatsApp': 't-r',
  'Instagram': 't-p',
  'Website': 't-n',
  'In Person': 't-n'
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  'WhatsApp': 'WhatsApp',
  'Instagram': 'Instagram',
  'Website': 'Website',
  'In Person': 'In Person'
};