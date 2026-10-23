/**
 * House of Kaira - Deposit Policy Registry
 * Section 7 of Build Specification v2.0 (hok_deposit_policy_v2)
 *
 * 9 Sections (01 to 09), 61 Questions and Answers, 6 Glance rows, 5 Tracker steps, 4 Popular links.
 * All figures read directly from DEPOSIT_SETTINGS.
 */

import { DEPOSIT_SETTINGS } from './depositSettings.js';

export const DEPOSIT_POPULAR_LINKS = [
  { text: 'When is my deposit due?', anchor: '#p-when' },
  { text: 'When do I get my deposit back?', anchor: '#f-when' },
  { text: 'What counts as normal wear?', anchor: '#h-wear' },
  { text: 'How is a deduction worked out?', anchor: '#x-amount' }
];

export const DEPOSIT_TRACKER_STEPS = [
  { number: 1, name: 'Deposit requested', timing: `Due ${DEPOSIT_SETTINGS.deposit_due_before} before dispatch`, opens: '#p-when' },
  { number: 2, name: 'Deposit received', timing: `Acknowledged within ${DEPOSIT_SETTINGS.deposit_receipt_within}`, opens: '#p-receipt' },
  { number: 3, name: 'Piece received', timing: 'Handed to our courier by your Return Date', opens: '#r-ontime' },
  { number: 4, name: 'Inspected', timing: `With care, within ${DEPOSIT_SETTINGS.inspect_within} of arriving`, opens: '#f-inspect' },
  { number: 5, name: 'Refunded', timing: `Within ${DEPOSIT_SETTINGS.deposit_refund_window} of inspection`, opens: '#f-when' }
];

export const DEPOSIT_GLANCE_ROWS = [
  { text: 'Your deposit amount', tag: 'Shown on every piece', tagType: 'neutral', opens: '#d-amount' },
  { text: 'When it is due', tag: `${DEPOSIT_SETTINGS.deposit_due_before} before dispatch`, tagType: 'neutral', opens: '#p-when' },
  { text: 'How to pay it', tag: 'UPI or bank transfer', tagType: 'neutral', opens: '#p-how' },
  { text: 'When it is returned', tag: `${DEPOSIT_SETTINGS.deposit_refund_window} after inspection`, tagType: 'positive', opens: '#f-when' },
  { text: 'Gentle signs of wear', tag: 'Never deducted', tagType: 'positive', opens: '#h-wear' },
  { text: 'GST on your deposit', tag: 'None', tagType: 'positive', opens: '#d-gst' }
];

export const DEPOSIT_SECTIONS = [
  // SECTION 01
  {
    id: 's-about',
    number: '01',
    title: 'Understanding your deposit',
    italicWord: 'deposit',
    barLabel: 'About',
    description: 'What it protects, how it is set, and what it is never used for.',
    questions: [
      {
        id: 'd-what',
        question: 'What is the security deposit?',
        tag: null,
        tagType: null,
        keywords: 'security deposit what is it why refundable protect fee',
        content: [
          { type: 'p', text: 'It is a fully refundable amount we hold in safekeeping while a piece is with you, so that it is protected for the next person who wears it. It is never a fee, and never a payment for your rental. When your piece returns on time and as it left us, every rupee is returned to you.' },
          { type: 'p', text: 'A deposit applies to rentals only. Preloved purchases never need one.' }
        ]
      },
      {
        id: 'd-amount',
        question: 'How much is my deposit?',
        tag: 'Shown on every piece',
        tagType: 'neutral',
        keywords: 'how much amount deposit size value price set',
        content: [
          { type: 'p', text: "Each piece has its own deposit, set with care, because a heavily embroidered bridal lehenga and a light festive set need very different protection. You will find it beside the rental price on the piece's page, in your booking summary before you pay, and in your confirmation." },
          {
            type: 'p',
            text: "Once you have booked, it stays the same. If you choose a different piece instead, the deposit becomes that piece's amount, as ",
            links: [{ label: 'changing your booking', anchor: '#p-change', suffix: ' explains.' }]
          }
        ]
      },
      {
        id: 'd-gst',
        question: 'Is there GST on my deposit?',
        tag: 'No GST',
        tagType: 'positive',
        keywords: 'gst tax deposit charged',
        content: [
          { type: 'p', text: 'No. Your deposit is held in safekeeping and is not a payment for your rental, so no GST is charged on it.' },
          {
            type: 'p',
            text: 'GST only applies if a charge for an extra day or a second pickup is taken from it, because those pay for something you receive. See ',
            links: [{ label: 'which amounts carry GST', anchor: '#g-gst', suffix: '.' }]
          }
        ]
      },
      {
        id: 'd-interest',
        question: 'Does my deposit earn interest?',
        tag: 'No',
        tagType: 'caution',
        keywords: 'interest earn deposit',
        content: [
          { type: 'p', text: 'No. It is held only for the length of your rental and returned to you, less any amount agreed with you, so no interest is paid on it.' }
        ]
      },
      {
        id: 'd-several',
        question: 'I am renting more than one piece. How does the deposit work?',
        tag: 'One per piece',
        tagType: 'neutral',
        keywords: 'several pieces multiple more than one deposit each order',
        content: [
          { type: 'p', text: 'Each piece carries its own deposit, shown on its own page. Each one is requested, held and returned separately, so if one piece comes back sooner, its deposit is returned sooner too.' },
          {
            type: 'p',
            text: 'If your bookings fall on different dates, a single deposit can often cover both: see ',
            links: [{ label: 'carrying a deposit forward', anchor: '#p-next', suffix: '.' }]
          }
        ]
      },
      {
        id: 'd-replace',
        question: 'What is Replacement Value?',
        tag: null,
        tagType: null,
        keywords: 'replacement value worth lost stolen total loss what is',
        content: [
          { type: 'p', text: 'It is what a piece is worth to us: what it would take to replace it. It only matters in the rare event that a piece is lost, stolen, not returned or damaged beyond repair, as a deposit cannot cover a loss of that size.' },
          {
            type: 'p',
            text: "You will see each piece's Replacement Value in your booking summary before you pay, and again in your confirmation, so it is never a surprise. Read ",
            links: [
              { label: 'how it is set', anchor: '#l-value', suffix: ', or ' },
              { label: 'see an example', anchor: '#examples', exampleTab: 'lost-or-not-returned', suffix: '.' }
            ]
          }
        ]
      },
      {
        id: 'd-id',
        question: 'Will you ask for my ID?',
        tag: null,
        tagType: null,
        keywords: 'id identity document aadhaar proof verification high value',
        content: [
          {
            type: 'p',
            text: 'Only for a few high value pieces. If yours is one of them, our team will ask for it on WhatsApp, keep it only while the piece is with you, and delete it once the piece is back with us. The one exception is a piece that is not returned or comes back damaged, when we may need it to recover the cost. Our ',
            links: [{ label: 'Privacy Policy', path: '/privacy', suffix: ' explains this in full.' }]
          }
        ]
      }
    ]
  },

  // SECTION 02
  {
    id: 's-paying',
    number: '02',
    title: 'Paying your deposit',
    italicWord: 'deposit',
    barLabel: 'Paying',
    description: 'When it is due, how to pay it, and how we confirm its arrival.',
    questions: [
      {
        id: 'p-when',
        question: 'When is my deposit due?',
        tag: `${DEPOSIT_SETTINGS.deposit_due_before} before dispatch`,
        tagType: 'neutral',
        keywords: 'when due deadline date pay deposit by',
        content: [
          { type: 'p', text: `${DEPOSIT_SETTINGS.deposit_due_before} before your piece is dispatched. There is nothing to work out: the exact date appears in your booking confirmation, in our WhatsApp messages about your deposit, and in the Deposit Tracker in My Account.` },
          { type: 'p', text: `For example, if your piece is dispatched on ${DEPOSIT_SETTINGS.ex_dispatch}, your deposit is due by ${DEPOSIT_SETTINGS.ex_due}. You are welcome to pay sooner; simply message us and we will share our details.` }
        ]
      },
      {
        id: 'p-how',
        question: 'How do I pay it?',
        tag: 'UPI or bank transfer',
        tagType: 'neutral',
        keywords: 'how pay upi bank transfer neft rtgs imps cash card',
        content: [
          { type: 'p', text: 'Whichever you prefer, directly to our account. Our team shares the details with you on WhatsApp before your due date.' },
          {
            type: 'ul',
            items: [
              'UPI: pay our UPI ID from any UPI app.',
              'Bank transfer: send it by NEFT, RTGS or IMPS to our bank account.'
            ]
          },
          { type: 'p', text: 'Both are equally welcome. Some banks limit how much can be sent by UPI in a day, so for a larger deposit, a bank transfer is often the simpler choice.' },
          { type: 'p', text: `If you book with us in person in Indore, you may also pay in cash, for deposits under ${DEPOSIT_SETTINGS.cash_deposit_limit} in total. We do not accept deposits by card.` }
        ]
      },
      {
        id: 'p-account',
        question: 'Whose account will I be paying?',
        tag: null,
        tagType: null,
        keywords: 'account name whose account payee upi name shows business sebshine',
        content: [
          { type: 'p', text: `Our account is held in the name of ${DEPOSIT_SETTINGS.deposit_account_name}, the owner of ${DEPOSIT_SETTINGS.deposit_business_name}, the registered business behind House of Kaira. This is the name your banking app will show, whether you pay by UPI or bank transfer.` },
          {
            type: 'note',
            text: `We only ever share payment details from our official WhatsApp number, ${DEPOSIT_SETTINGS.support_whatsapp}. If anyone asks you to pay a deposit elsewhere, or to a different name, please do not pay, and message us first.`
          }
        ]
      },
      {
        id: 'p-why',
        question: 'Why is the deposit not taken at checkout?',
        tag: null,
        tagType: null,
        keywords: 'why not checkout separate razorpay card gateway',
        content: [
          { type: 'p', text: 'Because it is not a payment. A deposit is held for you and returned to you, so we keep it entirely separate from what you pay for your rental. It travels directly between your account and ours, in both directions.' }
        ]
      },
      {
        id: 'p-receipt',
        question: 'How will I know you have received it?',
        tag: `Within ${DEPOSIT_SETTINGS.deposit_receipt_within}`,
        tagType: 'positive',
        keywords: 'receipt confirmation received acknowledgement proof',
        content: [
          { type: 'p', text: `We confirm it in writing on WhatsApp within ${DEPOSIT_SETTINGS.deposit_receipt_within} of it reaching our account, usually much sooner, and your Deposit Tracker moves to Deposit received.` },
          { type: 'p', text: 'Please keep your payment reference safe until your deposit is back with you.' }
        ]
      },
      {
        id: 'p-late',
        question: 'I booked close to my dates. When is my deposit due?',
        tag: `Within ${DEPOSIT_SETTINGS.deposit_late_booking}`,
        tagType: 'neutral',
        keywords: 'last minute late booking close dates urgent short notice',
        content: [
          { type: 'p', text: `If you book after the usual due date has passed, your deposit is due within ${DEPOSIT_SETTINGS.deposit_late_booking} of our request, and always before your piece is dispatched. We share our details as soon as your booking is confirmed.` }
        ]
      },
      {
        id: 'p-unpaid',
        question: 'What if my deposit is not paid by the due date?',
        tag: 'Booking may be cancelled',
        tagType: 'caution',
        keywords: 'not paid unpaid missed due date deadline cancel booking',
        content: [
          {
            type: 'p',
            text: 'Your piece can only leave us once your deposit has arrived. If it has not reached us by the due date, we may cancel your booking so the piece can go to someone else. This is treated as a cancellation by you on the day we cancel, under our ',
            links: [{ label: 'Refund & Cancellation Policy', path: '/refunds', suffix: '.' }]
          },
          { type: 'p', text: `If we cancel more than ${DEPOSIT_SETTINGS.rental_cancel_full} before your rental begins, your rental fee is refunded in full.` },
          { type: 'p', text: 'If something is holding you up, do message us before the due date and we will do our best to help.' }
        ]
      },
      {
        id: 'p-someone',
        question: 'Can someone else pay my deposit?',
        tag: 'Yes',
        tagType: 'positive',
        keywords: 'someone else pay parent friend family pays deposit',
        content: [
          { type: 'p', text: 'Of course. A family member or friend is welcome to pay it for you; simply let us know who is paying, so we can match it to your booking.' },
          { type: 'p', text: 'A deposit is always returned to the account it came from, so in this case it goes back to them, not to you.' }
        ]
      },
      {
        id: 'p-change',
        question: 'If I change my booking, what happens to my deposit?',
        tag: null,
        tagType: null,
        keywords: 'change dates swap piece different deposit difference move booking',
        content: [
          { type: 'p', text: 'If you move your dates, your deposit stays the same and its due date moves with your new dispatch date.' },
          { type: 'p', text: `If you choose a different piece, the deposit becomes that piece's amount. If it is higher, we ask for the difference before dispatch. If it is lower and you have already paid, we return the difference within ${DEPOSIT_SETTINGS.deposit_refund_window}.` }
        ]
      },
      {
        id: 'p-cancel',
        question: 'If I cancel, do I get my deposit back?',
        tag: 'Yes, in full',
        tagType: 'positive',
        keywords: 'cancel booking deposit back cancellation refund',
        content: [
          { type: 'p', text: `Yes, in full, whenever you cancel before your piece is dispatched. It is returned within ${DEPOSIT_SETTINGS.deposit_refund_window}, to the account it came from. A deposit is only ever held against the condition of a piece, never against a cancellation.` },
          {
            type: 'p',
            text: 'Your rental fee is refunded as our ',
            links: [{ label: 'Refund & Cancellation Policy', path: '/refunds', suffix: ' explains.' }]
          }
        ]
      },
      {
        id: 'p-use',
        question: 'Can my deposit be used towards my rental fee?',
        tag: 'No',
        tagType: 'caution',
        keywords: 'use deposit towards rental fee pay adjust',
        content: [
          { type: 'p', text: 'No. It is kept apart from every payment and always returns to you, less any amount agreed with you. Keeping it separate keeps everything simple and transparent.' }
        ]
      },
      {
        id: 'p-next',
        question: 'I have another booking soon after. Do I pay a second deposit?',
        tag: 'One deposit can cover both',
        tagType: 'positive',
        keywords: 'another booking next booking second deposit carry over forward roll over back to back',
        content: [
          { type: 'p', text: 'Not if your bookings do not overlap. Once your first piece is back with us and inspected, we can carry the same deposit forward to your next booking, rather than returning it and asking for it again. We only do this with your agreement.' },
          { type: 'p', text: `If the next piece's deposit is higher, you pay only the difference, by its due date. If it is lower, we return the difference within ${DEPOSIT_SETTINGS.deposit_refund_window} of inspection. And if anything is deducted from the first booking, we will ask you to top the deposit up before your next piece is dispatched.` },
          { type: 'p', text: 'If two pieces will be with you at the same time, each needs its own deposit.' }
        ]
      },
      {
        id: 'p-promo',
        question: 'Do promo codes apply to the deposit?',
        tag: 'No',
        tagType: 'caution',
        keywords: 'promo code coupon discount offer deposit',
        content: [
          { type: 'p', text: 'No. Promo codes and offers apply to rental fees only, so your deposit is always the full amount shown on the piece.' }
        ]
      }
    ]
  },

  // SECTION 03
  {
    id: 's-holding',
    number: '03',
    title: 'While the piece is in your care',
    italicWord: 'care',
    barLabel: 'In your care',
    description: 'Your deposit rests with us, exactly as you paid it.',
    questions: [
      {
        id: 'h-held',
        question: 'Where is my deposit while I have the piece?',
        tag: null,
        tagType: null,
        keywords: 'where is my deposit held safe safekeeping while i have piece',
        content: [
          { type: 'p', text: 'Safely in our account, recorded against your booking and never treated as income. It stays exactly as you paid it until your piece is back with us and inspected, and your Deposit Tracker shows Deposit received throughout.' }
        ]
      },
      {
        id: 'h-wear',
        question: 'What counts as normal wear?',
        tag: 'Never deducted',
        tagType: 'positive',
        keywords: 'normal wear tear loose thread crease small bead gentle signs',
        content: [
          { type: 'p', text: 'The gentle signs of a piece being worn and enjoyed: a few loose threads, a little embellishment loss, light creasing. These are expected, and they are never taken from your deposit.' },
          {
            type: 'p',
            text: 'Our ',
            links: [{ label: 'Care, Cleaning & Damage Policy', path: '/care-damage', suffix: ' explains what counts as damage, and how to look after your piece while it is with you.' }]
          }
        ]
      },
      {
        id: 'h-damage',
        question: 'What counts as damage?',
        tag: null,
        tagType: null,
        keywords: 'damage what counts stain tear burn alteration',
        content: [
          { type: 'p', text: 'Anything beyond normal wear, such as stains, tears, burns, significant bead or embroidery loss, or any alteration to the piece. It is assessed when the piece returns to us, against the photographs and video we take before dispatch.' }
        ]
      },
      {
        id: 'h-accident',
        question: 'Something happened to the piece while I was wearing it',
        tag: null,
        tagType: null,
        keywords: 'spill stain accident happened wearing tear fix',
        content: [
          { type: 'p', text: 'Please tell us straight away, and do not try to fix or clean it yourself, as home remedies can set a mark for good. For a spill, gently blot it with a clean tissue and avoid rubbing.' },
          { type: 'p', text: 'The sooner we know, the more our specialists can usually save, which keeps any cost to you as small as possible.' }
        ]
      },
      {
        id: 'h-mark',
        question: 'I noticed a mark when the piece arrived',
        tag: `Tell us within ${DEPOSIT_SETTINGS.issue_window}`,
        tagType: 'neutral',
        keywords: 'mark arrived already damaged existing before wearing',
        content: [
          { type: 'p', text: `Please message us within ${DEPOSIT_SETTINGS.issue_window} of delivery with a photograph, before you wear it. We will note it on your booking, so it is never counted against your deposit.` },
          {
            type: 'note',
            text: "Anything already photographed or noted on the listing is part of the piece's history, and is never counted against you either."
          }
        ]
      },
      {
        id: 'h-extend',
        question: 'I would like to keep the piece longer',
        tag: null,
        tagType: null,
        keywords: 'extend keep longer extra days extension',
        content: [
          { type: 'p', text: "Please message us before your Return Date. If no one has booked the piece straight after you, we will happily extend your rental at the piece's daily rate plus GST, and your deposit simply stays with us a little longer." },
          { type: 'p', text: 'An agreed extra day costs exactly the same as a late one, so it is always worth asking.' }
        ]
      }
    ]
  },

  // SECTION 04
  {
    id: 's-return',
    number: '04',
    title: 'Returning the piece',
    italicWord: 'piece',
    barLabel: 'Returning',
    description: 'Two easy ways to send it back, and when it counts as on time.',
    questions: [
      {
        id: 'r-how',
        question: 'How do I send the piece back?',
        tag: null,
        tagType: null,
        keywords: 'send back return how drop off pickup courier label',
        content: [
          { type: 'p', text: 'Whichever suits you best:' },
          {
            type: 'ul',
            items: [
              "Drop it off at the courier's nearest office, using the prepaid label in your packaging.",
              'Book a pickup from your door: message us and we will arrange it.'
            ]
          },
          { type: 'p', text: "Either way, please pack the piece as it arrived, in its garment bag, and keep the courier's receipt until your deposit is back with you." }
        ]
      },
      {
        id: 'r-ontime',
        question: 'When does my piece count as returned on time?',
        tag: 'Handed over by your Return Date',
        tagType: 'neutral',
        keywords: 'on time return date deadline counts when late',
        content: [
          { type: 'p', text: 'Once it is handed to our courier, at their office or at your door, on or before your Return Date. The time it then spends travelling to us is never counted against you.' }
        ]
      },
      {
        id: 'r-resp',
        question: 'Who is responsible for the piece on its way back?',
        tag: 'We are',
        tagType: 'positive',
        keywords: 'responsible journey back lost in transit courier receipt who',
        content: [
          { type: 'p', text: 'We are, from the moment you hand it to our courier and receive a receipt. If anything happens to it after that, you are never charged for it, and your deposit is protected. That is why the receipt matters: please keep it until your deposit is back with you.' }
        ]
      },
      {
        id: 'r-late',
        question: 'What if I return it late?',
        tag: 'Daily rate plus GST',
        tagType: 'caution',
        keywords: 'late return extra day fee charge delay',
        content: [
          {
            type: 'p',
            text: `Each extra day is charged at the piece's daily rental rate plus ${DEPOSIT_SETTINGS.gst_rental} GST, exactly like an extra day of rental, because the piece stays with you and another customer may be waiting for it. We always show you the amount first, and take it from your deposit unless you would rather pay it separately. `,
            links: [{ label: 'See an example', anchor: '#examples', exampleTab: 'one-day-late', suffix: '.' }]
          },
          {
            type: 'p',
            text: 'If you think you may be late, please tell us before your Return Date. ',
            links: [{ label: 'An extension', anchor: '#h-extend', suffix: " costs the same and keeps everyone's plans on track." }]
          }
        ]
      },
      {
        id: 'r-delay',
        question: 'The pickup was late on your side',
        tag: 'No charge',
        tagType: 'positive',
        keywords: 'pickup late missed courier delayed your side',
        content: [
          { type: 'p', text: 'You are never charged. Late charges only apply when a return is held up on your side, never when we or our courier are running late.' }
        ]
      },
      {
        id: 'r-missed',
        question: 'I missed my pickup slot',
        tag: null,
        tagType: null,
        keywords: 'missed pickup slot not home reschedule second pickup',
        content: [
          { type: 'p', text: "Simply message us and we will arrange a second pickup, or you are welcome to drop the piece off at the courier's office instead, at no cost." },
          { type: 'p', text: "If the first pickup was missed because no one was available, a re-pickup charge applies to the second one: the courier's charge to us, plus GST, shown to you before it is booked. This is not a late return charge, because you are not keeping the piece to wear it." }
        ]
      },
      {
        id: 'r-label',
        question: 'I have lost the return label or garment bag',
        tag: null,
        tagType: null,
        keywords: 'lost label garment bag packaging print copy',
        content: [
          { type: 'p', text: 'Your return label comes printed in your packaging. If it goes missing, simply message us and we will send you a copy to print. Any clean, sturdy bag will do for the journey back.' }
        ]
      },
      {
        id: 'r-clean',
        question: 'Should I clean it before sending it back?',
        tag: 'Please do not',
        tagType: 'caution',
        keywords: 'wash clean before returning dry clean steam iron',
        content: [
          { type: 'p', text: 'Please do not. Professional cleaning after every rental is taken care of by us and included in your rental fee. Washing, steaming or spot cleaning at home can harm delicate work, and damage caused this way is treated like any other damage.' }
        ]
      }
    ]
  },

  // SECTION 05
  {
    id: 's-refund',
    number: '05',
    title: 'Your deposit, returned',
    italicWord: 'returned',
    barLabel: 'Getting it back',
    description: 'How each piece is inspected, and when your deposit comes back to you.',
    questions: [
      {
        id: 'f-inspect',
        question: 'How is my piece inspected?',
        tag: `Within ${DEPOSIT_SETTINGS.inspect_within}`,
        tagType: 'positive',
        keywords: 'inspection inspect check how photos video',
        content: [
          { type: 'p', text: `Within ${DEPOSIT_SETTINGS.inspect_within} of your piece reaching us, our team examines it carefully against the photographs and video we take of every piece before it is dispatched. Comparing the two is what keeps every decision fair to you.` }
        ]
      },
      {
        id: 'f-when',
        question: 'When do I get my deposit back?',
        tag: DEPOSIT_SETTINGS.deposit_refund_window,
        tagType: 'positive',
        keywords: 'when deposit back refund returned how long days time',
        content: [
          { type: 'p', text: `If all is well, within ${DEPOSIT_SETTINGS.deposit_refund_window} of inspection, and we will confirm on WhatsApp once it is on its way. Inspection happens within ${DEPOSIT_SETTINGS.inspect_within} of your piece reaching us, so the only part we cannot predict is how long the courier takes to bring it.` },
          { type: 'p', text: `By business days, we mean ${DEPOSIT_SETTINGS.business_days}. We still try to be available every day of the week.` }
        ]
      },
      {
        id: 'f-where',
        question: 'Where does my deposit go back to?',
        tag: 'The account it came from',
        tagType: 'neutral',
        keywords: 'deposit refunded returned where which account source different account',
        content: [
          { type: 'p', text: 'Always to the account it was paid from. If someone else paid it for you, it is returned to them.' },
          { type: 'p', text: 'A deposit paid in cash is returned by UPI or bank transfer to an account in your name, never in cash. For your security, we cannot send a deposit anywhere else or convert it into store credit.' }
        ]
      },
      {
        id: 'f-track',
        question: 'How can I follow my deposit?',
        tag: null,
        tagType: null,
        keywords: 'track follow deposit tracker status my account',
        content: [
          { type: 'p', text: 'In the Deposit Tracker in My Account, which shows each step as it happens: Deposit requested, Deposit received, Piece received, Inspected, and finally Refunded, Partly refunded, Carried over or Used in full.' },
          { type: 'p', text: 'We will also message you on WhatsApp when your deposit is received and when it is returned.' }
        ]
      },
      {
        id: 'f-slow',
        question: 'My deposit has not come back yet',
        tag: null,
        tagType: null,
        keywords: 'not received yet late delayed where is my deposit missing refund',
        content: [
          { type: 'p', text: `Please check your Deposit Tracker first, which shows exactly where it is. If more than ${DEPOSIT_SETTINGS.deposit_refund_window} have passed since your piece was inspected, message us with your booking number and we will share the bank reference (UTR), which your bank can use to trace it.` }
        ]
      },
      {
        id: 'f-early',
        question: 'If I send the piece back early, will my deposit come back sooner?',
        tag: 'Yes',
        tagType: 'positive',
        keywords: 'return early sooner faster deposit back',
        content: [
          { type: 'p', text: 'Yes. Your deposit follows the piece: the sooner it reaches us, the sooner it is inspected and returned. Your rental fee covers the full period you booked, so unused days are not refunded.' }
        ]
      },
      {
        id: 'f-bounce',
        question: 'My bank account has closed, or the refund bounced',
        tag: null,
        tagType: null,
        keywords: 'account closed bounced returned transfer failed refund',
        content: [
          { type: 'p', text: 'If a refund ever comes back to us, we will contact you straight away and resolve it together.' }
        ]
      }
    ]
  },

  // SECTION 06
  {
    id: 's-deduct',
    number: '06',
    title: 'When a piece needs restoring',
    italicWord: 'restoring',
    barLabel: 'Deductions',
    description: 'How any amount is worked out, shared with you and settled.',
    questions: [
      {
        id: 'x-what',
        question: 'What can be taken from my deposit?',
        tag: null,
        tagType: null,
        keywords: 'what can be deducted taken from deposit reasons deduction',
        content: [
          { type: 'p', text: 'Only something that happens while the piece is with you:' },
          {
            type: 'ul',
            items: [
              'a late return, charged like an extra day of rental',
              'a re-pickup charge, if a pickup is missed on your side',
              'damage beyond normal wear, such as a stain, tear, burn or significant embellishment loss',
              'a part of the piece that does not come back, such as a dupatta',
              'a piece that is lost, stolen, not returned or damaged beyond repair'
            ]
          },
          { type: 'p', text: 'Nothing else is ever taken from it.' }
        ]
      },
      {
        id: 'x-never',
        question: 'What is never taken from my deposit?',
        tag: 'Never deducted',
        tagType: 'positive',
        keywords: 'never deducted not charged free cleaning normal',
        content: [
          {
            type: 'ul',
            items: [
              'normal wear, such as a loose thread or light creasing',
              'our professional cleaning and pressing after every rental, which your rental fee already covers',
              'any delay caused by us or our courier',
              'anything already photographed or noted on the listing before your rental'
            ]
          }
        ]
      },
      {
        id: 'x-amount',
        question: 'How is a deduction worked out?',
        tag: null,
        tagType: null,
        keywords: 'how much deduction amount worked out calculated cost price repair restoration',
        content: [
          { type: 'p', text: 'It is the fair, reasonable cost of restoring the piece, considered case by case, because no two pieces or repairs are alike. It can include:' },
          {
            type: 'ul',
            items: [
              'specialist cleaning or repair',
              'materials, such as matching thread, beads or fabric',
              'the skilled hand work involved, which for intricate embellishment can take days'
            ]
          },
          {
            type: 'p',
            text: 'We only ever charge what restoring it truly costs, never a penalty, and we always show you how the amount was reached. ',
            links: [{ label: 'See an example', anchor: '#examples', exampleTab: 'stain-to-restore', suffix: '.' }]
          }
        ]
      },
      {
        id: 'x-notice',
        question: 'How will I hear about a deduction?',
        tag: `Within ${DEPOSIT_SETTINGS.deduction_notice_within}`,
        tagType: 'neutral',
        keywords: 'how will i know deduction notified told photos evidence',
        content: [
          { type: 'p', text: `Within ${DEPOSIT_SETTINGS.deduction_notice_within} of your piece reaching us, we will message you with:` },
          {
            type: 'ul',
            items: [
              'photographs and video of what we found',
              'our own photographs and video of the piece from just before dispatch, so you can compare the two',
              'the amount, and how it was worked out',
              'the invoice for the work, wherever there is one'
            ]
          },
          { type: 'p', text: 'Nothing is deducted before you have seen all of this.' }
        ]
      },
      {
        id: 'x-reply',
        question: 'Can I respond to a deduction?',
        tag: `${DEPOSIT_SETTINGS.deduction_reply_within} to reply`,
        tagType: 'neutral',
        keywords: 'disagree reply respond dispute challenge deduction unfair',
        content: [
          { type: 'p', text: `Of course. You have ${DEPOSIT_SETTINGS.deduction_reply_within} to share anything you would like us to consider, such as your own photographs from when the piece arrived. We review it against our records and then confirm the final amount. Where the photographs and video clearly show the damage, the deduction stands.` },
          {
            type: 'p',
            text: 'If you remain unhappy, you can write to our Grievance Officer, whose details are on our ',
            links: [{ label: 'Contact page', path: '/contact', suffix: '.' }]
          }
        ]
      },
      {
        id: 'x-rest',
        question: 'Do I have to wait for the rest of my deposit?',
        tag: 'Returned as usual',
        tagType: 'positive',
        keywords: 'wait rest remaining balance deposit refund partial',
        content: [
          { type: 'p', text: `No. Whatever is not in question is returned on the usual timeline, within ${DEPOSIT_SETTINGS.deposit_refund_window} of inspection. Only the amount being discussed waits for your reply, and any part of it we do not need comes back to you as soon as it is settled.` }
        ]
      },
      {
        id: 'x-long',
        question: 'What if the repair takes a while?',
        tag: null,
        tagType: null,
        keywords: 'repair takes long weeks estimate invoice later',
        content: [
          { type: 'p', text: 'Some hand work takes weeks. In that case, we hold only our estimate of the cost and return the rest of your deposit as usual. Once the work is complete, we settle the difference: if it cost less than the estimate, we return the difference; if it cost more, we share the invoice and talk it through with you first.' }
        ]
      },
      {
        id: 'x-part',
        question: 'A part of the piece did not come back',
        tag: null,
        tagType: null,
        keywords: 'missing part dupatta blouse belt not returned piece incomplete',
        content: [
          { type: 'p', text: 'Please tell us as soon as you notice. If it is found and sent back, only any late days apply. If it is lost, only the cost of replacing that part is deducted, never the value of the whole piece.' }
        ]
      }
    ]
  },

  // SECTION 07
  {
    id: 's-loss',
    number: '07',
    title: 'In the rare event of a loss',
    italicWord: 'loss',
    barLabel: 'Loss',
    description: 'When a deposit cannot cover what has happened, explained plainly.',
    questions: [
      {
        id: 'l-loss',
        question: 'What if the piece is lost, stolen or damaged beyond repair?',
        tag: null,
        tagType: null,
        keywords: 'lost stolen theft damaged beyond repair destroyed total loss police report',
        content: [
          {
            type: 'p',
            text: "Please tell us straight away. In these rare cases, the piece is treated as a total loss: your deposit is kept, and you are responsible for the piece's Replacement Value, less your deposit. We will always speak with you first and share how the amount was worked out. ",
            links: [{ label: 'See an example', anchor: '#examples', exampleTab: 'lost-or-not-returned', suffix: '.' }]
          },
          { type: 'p', text: 'We do not ask for a police report. If the piece was stolen, simply tell us what happened and we will work through it with you directly. If you do choose to report it, please share a copy with us, as it helps if the piece is ever found.' },
          {
            type: 'p',
            text: 'And if it went missing after you handed it to our courier, it is on us: see ',
            links: [{ label: 'who is responsible', anchor: '#r-resp', suffix: '.' }]
          }
        ]
      },
      {
        id: 'l-notret',
        question: 'When is a piece treated as not returned?',
        tag: `After ${DEPOSIT_SETTINGS.not_returned_after}`,
        tagType: 'caution',
        keywords: 'not returned kept never sent back how long days',
        content: [
          { type: 'p', text: `If it has not been handed to our courier ${DEPOSIT_SETTINGS.not_returned_after} after your Return Date, and you have not agreed a new date with us, it is treated as not returned and handled as a total loss. We will always try to reach you before that point.` },
          { type: 'p', text: 'Its Replacement Value then takes the place of any late charges, so you are never charged both.' },
          { type: 'p', text: 'If the piece does come back to us after all, the Replacement Value no longer applies. Instead, the days you kept it are charged as a late return, never more than its Replacement Value, along with any damage, and anything you have paid beyond that is returned to you.' }
        ]
      },
      {
        id: 'l-value',
        question: 'How is Replacement Value set?',
        tag: null,
        tagType: null,
        keywords: 'replacement value how set calculated decided',
        content: [
          { type: 'p', text: 'It is set for each piece before it is ever rented, from its designer, its original price and its condition today, so it reflects the piece as it truly is, never the price of a new one. You will see it in your booking summary before you pay, and in your confirmation.' }
        ]
      },
      {
        id: 'l-more',
        question: 'Is my deposit the most I could ever owe?',
        tag: 'Not always',
        tagType: 'neutral',
        keywords: 'most i could owe limit cap more than deposit balance pay extra',
        content: [
          { type: 'p', text: `Not always. The deposit is security, not a limit. If what is due for damage or loss is more than your deposit, we share our full written statement with you and talk it through, and any balance we then confirm is due within ${DEPOSIT_SETTINGS.balance_due} of that statement.` },
          { type: 'p', text: 'In practice, this only happens when a piece is lost, not returned or damaged beyond repair.' }
        ]
      }
    ]
  },

  // SECTION 08
  {
    id: 's-onus',
    number: '08',
    title: 'If the fault is ours',
    italicWord: 'ours',
    barLabel: 'If the fault is ours',
    description: 'If we or our courier let you down, your deposit is returned in full.',
    questions: [
      {
        id: 'o-cancel',
        question: 'What if House of Kaira has to cancel my booking?',
        tag: 'Returned in full',
        tagType: 'positive',
        keywords: 'you cancelled house of kaira cancels unavailable booking',
        content: [
          {
            type: 'p',
            text: `It is rare, but should it happen, your deposit is returned in full within ${DEPOSIT_SETTINGS.deposit_refund_window}, your rental fee is refunded in full as our `,
            links: [{ label: 'Refund & Cancellation Policy', path: '/refunds', suffix: ' explains, and we will help you find something just as beautiful.' }]
          }
        ]
      },
      {
        id: 'o-late',
        question: 'My piece arrived after my event, or it was the wrong piece',
        tag: 'Returned in full',
        tagType: 'positive',
        keywords: 'arrived late after event wrong piece delivery delayed',
        content: [
          {
            type: 'p',
            text: `If that was because of us or our courier, nothing is ever taken from your deposit. Simply send the piece back unworn, and your deposit is returned in full within ${DEPOSIT_SETTINGS.deposit_refund_window} of inspection. Your rental fee is refunded as our `,
            links: [{ label: 'Refund & Cancellation Policy', path: '/refunds', suffix: ' explains.' }]
          }
        ]
      },
      {
        id: 'o-transit',
        question: 'The courier lost my parcel before it reached me',
        tag: 'Returned in full',
        tagType: 'positive',
        keywords: 'courier lost parcel before reached me never arrived',
        content: [
          { type: 'p', text: `Then nothing is deducted. If you have already paid your deposit, it is returned in full within ${DEPOSIT_SETTINGS.deposit_refund_window} of the loss being confirmed.` }
        ]
      }
    ]
  },

  // SECTION 09
  {
    id: 's-fine',
    number: '09',
    title: 'GST, records & your rights',
    italicWord: 'rights',
    barLabel: 'GST and your rights',
    description: 'The detail behind every amount, and how to raise a concern.',
    questions: [
      {
        id: 'g-gst',
        question: 'Which amounts carry GST?',
        tag: null,
        tagType: null,
        keywords: 'gst tax which amounts invoice late charge damage',
        content: [
          {
            type: 'ul',
            items: [
              'Your deposit: no GST, because it is not a payment for your rental.',
              `A late return charge: ${DEPOSIT_SETTINGS.gst_rental} GST, because it is charged exactly like an extra day of rental.`,
              `A re-pickup charge: ${DEPOSIT_SETTINGS.gst_rental} GST, because it pays for an extra pickup arranged for you.`,
              'A deduction for damage or loss: no GST, because it restores or replaces the piece rather than paying for anything you receive.'
            ]
          },
          { type: 'p', text: 'Wherever GST applies, it is always shown separately.' }
        ]
      },
      {
        id: 'g-papers',
        question: 'What will I receive in writing?',
        tag: null,
        tagType: null,
        keywords: 'documents receipt invoice statement writing paperwork records',
        content: [
          {
            type: 'ul',
            items: [
              'When your deposit arrives: a written acknowledgement.',
              'If a late return or re-pickup charge applies: a GST invoice for it.',
              'If anything is deducted for damage or loss: a written statement with the photographs, the amount and how it was worked out.',
              'When your deposit is returned: a confirmation with the bank reference.'
            ]
          }
        ]
      },
      {
        id: 'g-unhappy',
        question: 'I am not happy with how my deposit was handled',
        tag: null,
        tagType: null,
        keywords: 'unhappy complaint escalate grievance officer not happy',
        content: [
          {
            type: 'p',
            text: `We are sorry to hear that, and we would like to put it right. Reply on WhatsApp or email ${DEPOSIT_SETTINGS.support_email}, and your case will be looked at again with care.`
          },
          {
            type: 'p',
            text: 'For a formal complaint, please write to our Grievance Officer, whose details are on our ',
            links: [{ label: 'Contact page', path: '/contact', suffix: `. We acknowledge every complaint within ${DEPOSIT_SETTINGS.grievance_ack} and aim to resolve it within ${DEPOSIT_SETTINGS.grievance_resolve}.` }]
          }
        ]
      },
      {
        id: 'g-rights',
        question: 'Does this policy affect my legal rights?',
        tag: null,
        tagType: null,
        keywords: 'legal rights consumer law terms conditions',
        content: [
          {
            type: 'p',
            text: 'No. This page explains how we look after deposits, and nothing in it limits your rights under Indian consumer law. Should this page and our ',
            links: [{ label: 'Terms & Conditions', path: '/terms', suffix: ' ever differ, the Terms apply.' }]
          }
        ]
      },
      {
        id: 'g-changes',
        question: 'What if this policy changes after I book?',
        tag: null,
        tagType: null,
        keywords: 'policy changes updated which version applies',
        content: [
          { type: 'p', text: 'The policy in place when you made your booking is the one that applies to it. Updates only apply to bookings made after they are published, and the date this page was last reviewed is shown at the bottom.' }
        ]
      }
    ]
  }
];

export const DEPOSIT_RELATED_POLICIES = [
  { label: 'Refund & Cancellation Policy', path: '/refunds' },
  { label: 'Care, Cleaning & Damage Policy', path: '/care-damage' },
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Help & FAQs', path: '/faqs' }
];

export default {
  DEPOSIT_POPULAR_LINKS,
  DEPOSIT_TRACKER_STEPS,
  DEPOSIT_GLANCE_ROWS,
  DEPOSIT_SECTIONS,
  DEPOSIT_RELATED_POLICIES
};
