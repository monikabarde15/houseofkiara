/**
 * House of Kaira - Privacy Policy Synonyms & Keywords Dictionary
 * Section 8.6 & 5.4 of Build Specification v2.0
 */

export const PRIVACY_SYNONYMS = {
  delete: ['delete', 'erase', 'remove'],
  erase: ['erase', 'delete'],
  remove: ['remove', 'delete', 'erase'],
  forget: ['forget', 'erase', 'delete'],
  data: ['data', 'personal', 'information'],
  information: ['information', 'data', 'personal'],
  personal: ['personal', 'data'],
  privacy: ['privacy', 'data', 'personal'],
  share: ['share', 'shared', 'sharing', 'disclose'],
  sell: ['sell', 'promise', 'share'],
  third: ['third', 'share', 'partners'],
  cookie: ['cookie', 'cookies', 'tracking'],
  tracking: ['tracking', 'cookies', 'analytics'],
  analytics: ['analytics', 'cookies', 'usage'],
  aadhaar: ['aadhaar', 'identity', 'id'],
  kyc: ['kyc', 'identity', 'verify'],
  id: ['id', 'identity'],
  identity: ['identity', 'verify'],
  card: ['card', 'payment', 'cvv'],
  upi: ['upi', 'payment', 'bank'],
  bank: ['bank', 'payout', 'upi'],
  payment: ['payment', 'card', 'upi'],
  pan: ['pan', 'tax', 'payout'],
  whatsapp: ['whatsapp', 'messages'],
  sms: ['sms', 'messages'],
  email: ['email', 'messages'],
  marketing: ['marketing', 'messages', 'offers'],
  unsubscribe: ['unsubscribe', 'marketing', 'stop'],
  spam: ['spam', 'marketing', 'messages'],
  notifications: ['notifications', 'messages'],
  child: ['child', 'children', 'minor'],
  minor: ['minor', 'children', 'age'],
  age: ['age', 'children'],
  kids: ['kids', 'children'],
  breach: ['breach', 'hack', 'leak'],
  hack: ['hack', 'breach'],
  leak: ['leak', 'breach'],
  hacked: ['hacked', 'breach'],
  complaint: ['complaint', 'grievance'],
  grievance: ['grievance', 'complaint', 'officer'],
  nominee: ['nominee', 'nominate'],
  death: ['death', 'nominate'],
  died: ['died', 'nominate'],
  abroad: ['abroad', 'outside', 'india'],
  overseas: ['overseas', 'abroad', 'outside'],
  transfer: ['transfer', 'abroad'],
  keep: ['keep', 'retain', 'retention'],
  retention: ['retention', 'keep'],
  long: ['long', 'keep'],
  photo: ['photo', 'photographs', 'images'],
  picture: ['picture', 'photographs'],
  video: ['video', 'photographs'],
  google: ['google', 'sign'],
  login: ['login', 'sign', 'account'],
  password: ['password', 'account', 'otp'],
  otp: ['otp', 'one', 'code'],
  location: ['location', 'ip', 'address'],
  ip: ['ip', 'device', 'usage'],
  address: ['address', 'delivery'],
  lister: ['lister', 'listing'],
  seller: ['seller', 'lister'],
  recording: ['recording', 'calls'],
  call: ['call', 'calls', 'recording'],
  law: ['law', 'laws', 'court'],
  dpdp: ['dpdp', 'digital', 'protection'],
  board: ['board', 'protection'],
  language: ['language', 'hindi', 'translation'],
  hindi: ['hindi', 'language']
};

export const IGNORED_COMMON_WORDS = new Set([
  'the', 'and', 'can', 'my', 'is', 'it', 'do', 'if', 'of', 'to', 'in', 'on', 'for',
  'what', 'how', 'an', 'get', 'does', 'will', 'am', 'me', 'at', 'or', 'be', 'a', 'i'
]);

export const POPULAR_SEARCH_LINKS = [
  { label: 'What you give us', clauseNumber: 7, anchor: '#c-given' },
  { label: 'Between Listers and customers', clauseNumber: 21, anchor: '#c-between' },
  { label: 'Erasing your data', clauseNumber: 36, anchor: '#c-erase' },
  { label: 'Cookies and similar technologies', clauseNumber: 17, anchor: '#c-cookies' }
];

export const WHERE_TO_START_CARDS = [
  {
    tag: 'EVERYTHING WE HOLD, AND WHY',
    title: 'What we collect',
    range: 'Clauses 6 to 11',
    startClause: 6,
    endClause: 11,
    anchor: '#p-collect'
  },
  {
    tag: 'COURIERS, PAYMENTS AND THE LAW',
    title: 'Who sees it',
    range: 'Clauses 18 to 26',
    startClause: 18,
    endClause: 26,
    anchor: '#p-share'
  },
  {
    tag: 'SEE, CORRECT, ERASE OR WITHDRAW',
    title: 'Your rights',
    range: 'Clauses 34 to 39',
    startClause: 34,
    endClause: 39,
    anchor: '#p-rights'
  }
];

export default {
  PRIVACY_SYNONYMS,
  IGNORED_COMMON_WORDS,
  POPULAR_SEARCH_LINKS,
  WHERE_TO_START_CARDS
};
