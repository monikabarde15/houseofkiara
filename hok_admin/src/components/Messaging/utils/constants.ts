// utils/constants.ts

export const MESSAGE_GROUPS = [
  'Customer - Account',
  'Customer - Orders',
  'Customer - Returns',
  'Customer - Deposits',
  'Customer - Receivables',
  'Customer - Offers',
  'Customer - Keeping in touch',
  'Quick notes',
  'Lister',
  'Designer partners',
  'Your own desk',
] as const;

export const AUDIENCES = ['Customer', 'Lister', 'Designer', 'You'] as const;
export const MESSAGE_CLASSES = ['Required', 'Optional', 'Marketing'] as const;
export const MESSAGE_STATUSES = ['Live', 'Paused', 'Not written'] as const;
export const CHANNELS = ['email', 'whatsapp', 'website'] as const;

export const CHANNEL_LABELS: Record<string, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  website: 'Website',
};

export const STATUS_PILL_MAP: Record<string, 'green' | 'amber' | 'grey' | 'blue' | 'terracotta'> = {
  'Live': 'green',
  'Opened': 'green',
  'Delivered': 'blue',
  'Paused': 'amber',
  'Held': 'amber',
  'Not written': 'grey',
  'Not sent': 'grey',
  'Bounced': 'terracotta',
  'Required': 'green',
  'Optional': 'amber',
  'Marketing': 'grey',
  'Yours': 'blue',
};

export const WORD_GROUPS = [
  'global', 'customer', 'order', 'item', 'rental', 'deposit', 'shipping',
  'customfit', 'lister', 'payout', 'offer', 'auth', 'receivable',
  'internal', 'designer', 'promo',
] as const;

export const QUICK_LISTS: Record<string, string[]> = {
  customer: ['Saved a piece', 'Occasion within 60 days', 'Left something in the bag', 'Everyone who said yes'],
  order: ['Still open', 'Out with the customer', 'Return due soon', 'Overdue'],
  offer: ['Waiting on us', 'Countered', 'Accepted', 'All offers'],
  payout: ['Waiting to be paid', 'Already paid', 'Damage compensation', 'Everything'],
  piece: ['Live on the site', 'Not live yet', 'Paused', 'Everything'],
  submission: ['Still to decide', 'Approved', 'Declined', 'Everything'],
  lister: ['Has a piece live', 'Everyone'],
  latefee: ['Still owed', 'Everything'],
  studioorder: ['Waiting on the studio', 'Past its dispatch date', 'Everything'],
} as const;

export const UNAVAILABLE_REASONS = [
  'Has not agreed to hear from us',
  'No phone number',
  'No email address',
  'WhatsApp switched off on her record',
  'Email switched off on her record',
  'Account blocked',
  'Nothing saved by this designer',
  'Nothing saved in this category',
  'Nothing saved of this piece',
  'Code is only for NAME',
  'First order only, she has ordered before',
  'Code expired on DATE',
  'No tracking number yet',
  'No studio contact address',
  'Not a Buy New partner',
  'No contact details',
] as const;

export const DOCUMENT_CONDITIONS = [
  { value: 'always', label: 'Always' },
  { value: 'rental', label: 'Rentals only' },
  { value: 'preloved', label: 'Preloved orders only' },
  { value: 'buynew', label: 'Buy New orders only' },
  { value: 'demandsPayment', label: 'When the wording names a figure to pay' },
  { value: 'invokesAgreement', label: 'When the wording leans on the agreement' },
] as const;

export const DOCUMENT_KINDS = [
  'Insert', 'Statement', 'Agreement', 'Logistics', 'Evidence', 'Commercial',
] as const;

export const RECORD_KINDS = [
  { value: 'customer', label: 'Customer' },
  { value: 'order', label: 'Order' },
  { value: 'offer', label: 'Offer' },
  { value: 'payout', label: 'Payout' },
  { value: 'piece', label: 'Piece' },
  { value: 'submission', label: 'Submission' },
  { value: 'lister', label: 'Lister' },
  { value: 'latefee', label: 'Late Fee' },
  { value: 'studioorder', label: 'Studio Order' },
] as const;

export const SEND_CHANNELS = ['whatsapp', 'email'] as const;

// SLA Constants (from LYP spec)
export const SUB_SLA_HOURS = 48;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;

// Date formats
export const DATE_FORMAT = 'DD MMM YYYY';
export const DATE_TIME_FORMAT = 'DD MMM YYYY, HH:mm';