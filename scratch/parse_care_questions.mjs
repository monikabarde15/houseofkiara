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

const raw = fs.readFileSync('scratch/care_questions_raw.js', 'utf-8');
const questions = eval(raw);

console.log(`Parsed ${questions.length} questions`);

fs.writeFileSync('scratch/care_questions_parsed.json', JSON.stringify(questions, null, 2), 'utf-8');
console.log('Saved to scratch/care_questions_parsed.json');
