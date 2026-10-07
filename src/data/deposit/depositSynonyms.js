/**
 * House of Kaira - Deposit Policy Search Synonyms & Stop Words
 * Section 6.6 & 7.9 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

export const DEPOSIT_STOP_WORDS = new Set([
  'the', 'and', 'can', 'my', 'is', 'it', 'do', 'if', 'of', 'to', 'in', 'on', 'for',
  'what', 'how', 'an', 'get', 'does', 'will', 'am', 'me', 'at', 'or', 'be', 'a', 'i'
]);

export const DEPOSIT_SEARCH_SYNONYMS = {
  deposit: ['security'],
  security: ['deposit'],
  refund: ['back'],
  back: ['refund'],
  money: ['refund', 'deposit'],
  pay: ['payment', 'upi', 'transfer'],
  payment: ['pay'],
  upi: ['transfer', 'pay'],
  transfer: ['upi', 'neft', 'rtgs', 'imps', 'bank'],
  bank: ['account', 'transfer'],
  account: ['bank'],
  late: ['delay', 'extra'],
  delay: ['late'],
  lost: ['missing', 'stolen'],
  missing: ['lost'],
  stolen: ['theft', 'lost'],
  theft: ['stolen'],
  damage: ['stain', 'tear'],
  stain: ['spill', 'mark', 'damage'],
  mark: ['stain'],
  tear: ['damage'],
  gst: ['tax'],
  tax: ['gst'],
  id: ['identity', 'aadhaar'],
  aadhaar: ['identity', 'id'],
  cancel: ['cancellation'],
  due: ['deadline'],
  deadline: ['due'],
  courier: ['pickup', 'parcel'],
  parcel: ['courier'],
  deduction: ['deduct', 'taken'],
  deduct: ['deduction'],
  invoice: ['receipt', 'statement'],
  receipt: ['acknowledgement', 'invoice'],
  track: ['tracker', 'status'],
  tracker: ['track'],
  extend: ['extension', 'longer'],
  wear: ['normal'],
  replacement: ['value'],
  value: ['replacement'],
  cash: ['indore'],
  carry: ['next', 'another'],
  police: ['report', 'stolen'],
  label: ['print'],
  pickup: ['courier', 'missed'],
  business: ['working'],
  restore: ['restoring', 'restoration', 'deduction'],
  returned: ['refund', 'back']
};

export default {
  DEPOSIT_STOP_WORDS,
  DEPOSIT_SEARCH_SYNONYMS
};
