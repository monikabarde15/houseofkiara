import fs from 'fs';

const CARE_SETTINGS = {
  support_whatsapp: '+91 93401 39300',
  support_whatsapp_raw: '919340139300',
  support_email: 'hello@houseofkaira.com',
  support_sla: '2 hours',
  support_days: 'Seven days a week',
  support_hours: '10 AM to 8 PM IST',
  arrive_before: '1 day',
  issue_window: '24 hours',
  inspect_within: '24 hours',
  deposit_refund_window: '3 to 5 business days',
  balance_due: '7 days',
  deduction_notice_within: '2 business days',
  deduction_reply_within: '2 business days',
  last_reviewed: '7 October 2026'
};

const questions = JSON.parse(fs.readFileSync('scratch/care_questions_parsed.json', 'utf-8'));
const momentTabs = eval(fs.readFileSync('scratch/moment_tabs.json', 'utf-8'));
const wearDamage = eval('(' + fs.readFileSync('scratch/WEAR_VS_DAMAGE_DATA.txt', 'utf-8') + ')');
const pieceByPiece = eval(fs.readFileSync('scratch/PIECE_BY_PIECE_DATA.txt', 'utf-8'));
const ourCare = eval('(' + fs.readFileSync('scratch/OUR_CARE_DATA.txt', 'utf-8') + ')');
const piecesYouOwn = eval('(' + fs.readFileSync('scratch/PIECES_YOU_OWN_DATA.txt', 'utf-8') + ')');

const code = `/**
 * House of Kaira · Admin Panel
 * Care, Cleaning & Damage Policy Registry
 * Spec § 8.14
 */

import { CARE_SETTINGS } from './careSettings';

export const CARE_POPULAR_LINKS = [
  { label: 'How do you decide which it is?', targetId: 'l-test' },
  { label: 'Can I use safety pins or fashion tape?', targetId: 'w-pins' },
  { label: 'Can I steam or iron out a crease?', targetId: 'a-crease' },
  { label: 'I spilled something on it', targetId: 'h-spill' }
];

export const FIRST_AID_STEPS = [
  {
    num: 1,
    title: 'Blot, never rub',
    line: 'Press a clean tissue gently onto a spill to lift what you can. Water, rubbing and home remedies can set a mark for good.',
    opens: 'h-spill'
  },
  {
    num: 2,
    title: 'Send us a photo',
    line: 'Message us on WhatsApp straight away, even late at night. Telling us early never counts against you.',
    opens: 'h-tell'
  },
  {
    num: 3,
    title: 'Leave the rest to us',
    line: 'Please do not fix, stitch or clean it yourself. A safety pin through the lining can hold a loose hook until we take over.',
    opens: 'h-tear'
  }
];

export const MOMENT_TABS = ${JSON.stringify(momentTabs, null, 2)};

export const WEAR_VS_DAMAGE_DATA = ${JSON.stringify(wearDamage, null, 2)};

export const PIECE_BY_PIECE_DATA = ${JSON.stringify(pieceByPiece, null, 2)};

export const OUR_CARE_DATA = ${JSON.stringify(ourCare, null, 2)};

export const PIECES_YOU_OWN_DATA = ${JSON.stringify(piecesYouOwn, null, 2)};

export const ALL_QUESTIONS = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync('hok_admin/src/components/Pages/data/careRegistry.ts', code, 'utf-8');
console.log('Created hok_admin/src/components/Pages/data/careRegistry.ts');
