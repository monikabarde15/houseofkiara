// src/components/Listers/utils/constants.ts
import { ConditionGrade, ListerStatus, Channel, Intent, PayoutStatus } from '../types/lister.types';

export const PLATFORM_CONSTANTS = {
  RENTAL_PAYOUT_SPLIT: { lister: 40, hok: 60 },
  RESALE_PAYOUT_SPLIT: { lister: 75, hok: 25 },
  PAYOUT_CYCLE: 'T+3 working days',
  TDS_PAN_ON_FILE: '1% u/s 194-O',
  TDS_NO_PAN: '5% u/s 206AA',
  LISTER_TERMS_VERSION: 'LST-2026-01',
  OPS_TODAY: '2026-03-23', // Production: use server now() in Asia/Kolkata
} as const;

export const CONDITION_GRADES: ConditionGrade[] = ['Pristine', 'Excellent', 'Good', 'Fair'];

export const LISTER_STATUSES: ListerStatus[] = [
  'Verified',
  'Pending Review',
  'Paused',
  'Suspended',
  'Rejected',
  'Exited'
];

export const CHANNELS: Channel[] = ['WhatsApp', 'Instagram', 'Website', 'Walk-in'];

export const INTENTS: Intent[] = ['Rent + Sell', 'Rent only', 'Sell only'];

export const STATUS_CHIP_MAPPING: Record<ListerStatus, { variant: string; bg: string; text: string }> = {
  'Verified': { variant: 's-live', bg: '#EAF0E5', text: '#3D6B30' },
  'Pending Review': { variant: 's-pend', bg: '#FDF5E7', text: '#8B6A1E' },
  'Paused': { variant: 's-paused', bg: '#F5EFE4', text: '#9A7E52' },
  'Suspended': { variant: 's-sold', bg: '#E9EFF6', text: '#3B5C8A' },
  'Rejected': { variant: 's-sold', bg: '#E9EFF6', text: '#3B5C8A' },
  'Exited': { variant: 's-draft', bg: '#F0EDE8', text: '#8A7E72' },
};

export const PAYOUT_STATUS_CHIP_MAPPING: Record<PayoutStatus, { variant: string; bg: string; text: string }> = {
  'Paid': { variant: 's-live', bg: '#EAF0E5', text: '#3D6B30' },
  'Pending Approval': { variant: 's-pend', bg: '#FDF5E7', text: '#8B6A1E' },
  'Approved': { variant: 's-pend', bg: '#FDF5E7', text: '#8B6A1E' },
  'On Hold': { variant: 's-pend', bg: '#FDF5E7', text: '#8B6A1E' },
};

export const CHANNEL_TAG_MAPPING: Record<Channel, { class: string; bg: string; text: string }> = {
  'WhatsApp': { class: 't-r', bg: '#E9F2EF', text: '#2D6B5C' },
  'Instagram': { class: 't-p', bg: '#F5EDE8', text: '#8B4A2E' },
  'Website': { class: 't-n', bg: '#E9EFF6', text: '#3B5C8A' },
  'Walk-in': { class: 't-n', bg: '#E9EFF6', text: '#3B5C8A' },
};