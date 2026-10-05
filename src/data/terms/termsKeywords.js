/**
 * House of Kaira - Terms & Conditions Synonyms & Keywords Dictionary
 * Section 7.5 of Build Specification v3.0
 */

export const TERMS_SYNONYMS = {
  refund: ['reimburse'],
  money: ['refund', 'payment'],
  cancel: ['cancellation'],
  cancellation: ['cancel'],
  deposit: ['security'],
  security: ['deposit'],
  return: ['pickup'],
  late: ['delay'],
  delay: ['late'],
  lost: ['stolen', 'missing'],
  stolen: ['lost', 'theft'],
  theft: ['stolen'],
  damage: ['stain', 'tear'],
  stain: ['damage', 'spill'],
  fake: ['authentic', 'genuine', 'replica'],
  real: ['authentic', 'genuine'],
  genuine: ['authentic'],
  complaint: ['grievance'],
  grievance: ['complaint'],
  chargeback: ['dispute'],
  dispute: ['chargeback', 'court'],
  privacy: ['data', 'personal'],
  data: ['privacy'],
  lister: ['owner', 'seller'],
  seller: ['lister'],
  sell: ['list', 'lister'],
  payout: ['earnings', 'paid'],
  earnings: ['payout'],
  minor: ['age', 'guardian'],
  age: ['minor', 'guardian'],
  insurance: ['insured'],
  law: ['court', 'jurisdiction'],
  court: ['law', 'jurisdiction'],
  offer: ['negotiate'],
  negotiate: ['offer'],
  bargain: ['offer'],
  alter: ['alteration', 'tailor'],
  tailor: ['alter'],
  photo: ['photographs', 'images'],
  image: ['photographs', 'images'],
  ai: ['artificial', 'intelligence'],
  identity: ['verify', 'id'],
  kyc: ['identity', 'verify'],
  aadhaar: ['identity'],
  abroad: ['overseas', 'travel'],
  gst: ['tax', 'invoice'],
  tax: ['gst'],
  invoice: ['gst'],
  wedding: ['event'],
  event: ['wedding'],
  used: ['preloved', 'worn'],
  promo: ['code', 'coupon'],
  coupon: ['promo', 'code'],
  sort: ['order', 'recommended'],
  ranking: ['order', 'sort'],
};

export const IGNORED_COMMON_WORDS = new Set([
  'the', 'and', 'can', 'my', 'is', 'it', 'do', 'if', 'of', 'to', 'in', 'on', 'for', 
  'what', 'how', 'an', 'get', 'does', 'will', 'am', 'me', 'at', 'or', 'be', 'a', 'i'
]);

export const POPULAR_SEARCH_CLAUSES = [20, 23, 26, 32];
