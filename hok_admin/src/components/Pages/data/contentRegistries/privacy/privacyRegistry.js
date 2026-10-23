/**
 * House of Kaira - Privacy Policy Complete Content Registry
 * Complete Section 12 Word-for-Word Copy & Data Model
 * Build Specification v2.0 (hok_privacy_v2)
 */

import { PRIVACY_SETTINGS } from './privacySettings.js';

export const THE_ESSENTIALS = [
  {
    id: 1,
    text: "We never sell your personal data, or share it for anyone else’s marketing",
    reference: "Clause 18",
    clauseNumber: 18,
    anchor: "#c-promise"
  },
  {
    id: 2,
    text: "We never see or store your full card number, CVV, UPI PIN or banking passwords",
    reference: "Clause 7.4",
    clauseNumber: 7,
    subclauseNumber: "7.4",
    anchor: "#c-given-4"
  },
  {
    id: 3,
    text: "Your name and address are never shown to a Lister, and a Lister’s are never shown to you",
    reference: "Clause 21",
    clauseNumber: 21,
    anchor: "#c-between"
  },
  {
    id: 4,
    text: "Marketing reaches you only if you ask for it, and stops whenever you say",
    reference: "Clause 15",
    clauseNumber: 15,
    anchor: "#c-messages"
  },
  {
    id: 5,
    text: "You can see, correct and erase your data, and name someone to act for you",
    reference: "Clause 34",
    clauseNumber: 34,
    anchor: "#c-access"
  },
  {
    id: 6,
    text: "If your data is ever put at risk, we tell you without delay",
    reference: "Clause 29",
    clauseNumber: 29,
    anchor: "#c-breach"
  },
  {
    id: 7,
    text: "We keep your data only as long as we need it, or the law requires",
    reference: "Clause 30",
    clauseNumber: 30,
    anchor: "#c-keep-rule"
  },
  {
    id: 8,
    text: "Accounts are for adults, and we never track or target children",
    reference: "Clause 40",
    clauseNumber: 40,
    anchor: "#c-children"
  }
];

export const DEFINITIONS = [
  {
    term: "Consent",
    meaning: "Your agreement to our using your personal data for a purpose we have told you about, given freely and by a clear action of your own, such as ticking an empty box or switching on a setting."
  },
  {
    term: "Data Fiduciary",
    meaning: "The person or organisation that decides why and how personal data is used. For the Platform, that is us."
  },
  {
    term: "Data Processor",
    meaning: "A company that handles personal data on our behalf and only on our instructions, such as our cloud hosting provider."
  },
  {
    term: "Lister",
    meaning: "A person or business who lists a piece with us."
  },
  {
    term: "Personal data",
    meaning: "Any information about you from which you can be identified, on its own or together with other information, such as your name, mobile number, address or photograph."
  },
  {
    term: "Personal data breach",
    meaning: "Any unauthorised handling of personal data, or its accidental disclosure, sharing, use, alteration, destruction or loss of access to it, that compromises its confidentiality, integrity or availability."
  },
  {
    term: "Piece",
    meaning: "Any garment, set or item offered on the Platform, including everything its listing says is included."
  },
  {
    term: "Platform",
    meaning: "Our website, any app we offer, and our services on WhatsApp, Instagram, by phone and by email."
  },
  {
    term: "Processing",
    meaning: "Anything done with personal data, from collecting and storing it to using, sharing and erasing it."
  },
  {
    term: "Sensitive personal data",
    meaning: "The kinds of personal data the law protects more closely, including passwords, bank account and payment instrument details, health information and biometric information."
  },
  {
    term: "You",
    meaning: "The person the personal data is about, called the Data Principal in the Digital Personal Data Protection Act, 2023. Where a parent or lawful guardian acts for someone, “you” includes them."
  }
];

export const PRIVACY_PARTS = [
  {
    number: 1,
    title: "About this policy",
    italicWord: "policy",
    range: "Clauses 1 to 5",
    startClause: 1,
    endClause: 5,
    barLabel: "About",
    tooltip: "About this policy, clauses 1 to 5",
    description: "Who we are, what this policy covers, and the laws behind it.",
    anchor: "#p-about",
    clauses: [
      {
        number: 1,
        name: "who",
        title: "Who we are",
        anchor: "#c-who",
        keywords: "company legal name proprietor proprietorship trade name gst data fiduciary who decides responsible address contact body corporate",
        subclauses: [
          {
            number: "1.1",
            anchor: "#c-who-1",
            text: `House of Kaira is a curated home for designer Indian occasionwear, where you can rent a piece for a celebration, buy a preloved piece to keep, or list a piece of your own. It is a brand of ${PRIVACY_SETTINGS.trade_name}, ${PRIVACY_SETTINGS.legal_form} owned by ${PRIVACY_SETTINGS.legal_name}, with its principal place of business at ${PRIVACY_SETTINGS.business_address}.`
          },
          {
            number: "1.2",
            anchor: "#c-who-2",
            text: `We decide why and how your personal data is used on the Platform. That makes us the Data Fiduciary for it under the Digital Personal Data Protection Act, 2023, and the body corporate responsible for it under the Information Technology Act, 2000, which uses that term for sole proprietorships too. In this policy, “House of Kaira”, “HOK”, “we”, “us” and “our” mean ${PRIVACY_SETTINGS.legal_name}, trading as ${PRIVACY_SETTINGS.trade_name}.`
          },
          {
            number: "1.3",
            anchor: "#c-who-3",
            text: `For anything about your personal data, you can write to our Grievance Officer, who answers questions about it on our behalf, at ${PRIVACY_SETTINGS.grievance_email}, or message our team on WhatsApp at ${PRIVACY_SETTINGS.support_whatsapp} (${PRIVACY_SETTINGS.support_days}, ${PRIVACY_SETTINGS.support_hours}). The Grievance Officer’s full details are in clause 42.`
          }
        ]
      },
      {
        number: 2,
        name: "scope",
        title: "What this policy covers",
        anchor: "#c-scope",
        keywords: "scope website app whatsapp instagram phone email paper documents visitors listers customers job applicants not covered new service",
        subclauses: [
          {
            number: "2.1",
            anchor: "#c-scope-1",
            text: `This policy covers the personal data we handle when you use our website at ${PRIVACY_SETTINGS.site_url}, any app we offer, or our services on WhatsApp, Instagram, by phone or by email, which together we call the Platform. It applies whether you are browsing, renting, buying, making an offer, listing a piece or simply getting in touch.`
          },
          {
            number: "2.2",
            anchor: "#c-scope-2",
            text: "It covers personal data we hold in digital form, and paper documents you give us, such as the original bill for a piece, which we scan and then handle in exactly the same way."
          },
          {
            number: "2.3",
            anchor: "#c-scope-3",
            text: "It does not cover other companies’ websites and services, even when we link to them, as clause 47 explains. If you apply to work with us, we will give you a separate notice about the details you send."
          },
          {
            number: "2.4",
            anchor: "#c-scope-4",
            text: "When we introduce a new service, such as selling new pieces directly from designers, we will tell you about any new personal data it needs, and why, before you use it."
          }
        ]
      },
      {
        number: 3,
        name: "how-read",
        title: "How this policy works with our Terms",
        anchor: "#c-how-read",
        keywords: "terms conditions notice standalone conflict differ which applies cookie policy part of agreement",
        subclauses: [
          {
            number: "3.1",
            anchor: "#c-how-read-1",
            text: "This policy is our notice to you about your personal data. It is complete on its own, so you can understand it without reading anything else, and it also forms part of our Terms & Conditions."
          },
          {
            number: "3.2",
            anchor: "#c-how-read-2",
            text: "Our Cookie Policy lists each cookie we use, what it does and how long it lasts. clause 17 explains how we use cookies and the choices you have."
          },
          {
            number: "3.3",
            anchor: "#c-how-read-3",
            text: "If our Terms or any other policy ever say something different about your personal data, this policy applies."
          }
        ]
      },
      {
        number: 4,
        name: "defs",
        title: "Words with a special meaning",
        anchor: "#c-defs",
        keywords: "definitions meaning glossary personal data processing data fiduciary processor principal breach sensitive consent",
        hasDefinitions: true,
        subclauses: [
          {
            number: "4.1",
            anchor: "#c-defs-1",
            text: "Words in this policy have their everyday meaning, except these, which apply whether or not they begin with a capital letter:"
          },
          {
            number: "4.2",
            anchor: "#c-defs-2",
            text: "Words such as “including” and “for example” introduce examples, not a complete list."
          }
        ]
      },
      {
        number: 5,
        name: "laws",
        title: "The laws we follow",
        anchor: "#c-laws",
        keywords: "law dpdp act 2023 rules 2025 information technology act spdi rules intermediary rules cert-in consumer protection e-commerce tax in force compliance",
        subclauses: [
          {
            number: "5.1",
            anchor: "#c-laws-1",
            text: "We handle personal data in line with the laws of India, including:",
            list: [
              { letter: "(a)", text: "the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025;" },
              { letter: "(b)", text: "the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011;" },
              { letter: "(c)", text: "the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, under which we publish this policy, and the directions on cyber security issued by CERT-In, the national agency for cyber security incidents; and" },
              { letter: "(d)", text: "the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, and the tax laws that tell us which records we must keep." }
            ]
          },
          {
            number: "5.2",
            anchor: "#c-laws-2",
            text: "The Digital Personal Data Protection Act, 2023 and its Rules are coming into force in stages. We have written this policy, and built the Platform, to meet them in full from the day we open, rather than waiting for each stage."
          }
        ]
      }
    ]
  },
  {
    number: 2,
    title: "What we collect",
    italicWord: "collect",
    range: "Clauses 6 to 11",
    startClause: 6,
    endClause: 11,
    barLabel: "What we collect",
    tooltip: "What we collect, clauses 6 to 11",
    description: "Every kind of personal data we hold, why, on what basis, and for how long: the same honest disclosure we give every piece.",
    anchor: "#p-collect",
    clauses: [
      {
        number: 6,
        name: "approach",
        title: "How we decide what to ask for",
        anchor: "#c-approach",
        keywords: "minimum necessary only what we need optional fields required tell you at the time notice point of collection",
        subclauses: [
          {
            number: "6.1",
            anchor: "#c-approach-1",
            text: "We ask only for what we need for the purpose we tell you about. Optional fields are marked as optional, and leaving them empty never stops you renting, buying or listing."
          },
          {
            number: "6.2",
            anchor: "#c-approach-2",
            text: "When we collect personal data, we tell you at that moment what it is for and where to find this policy, whether on the Platform, in a message from our team, or at the start of a call."
          },
          {
            number: "6.3",
            anchor: "#c-approach-3",
            text: "If you choose not to give us something we need, such as a delivery address, we will explain what we cannot do without it."
          }
        ]
      },
      {
        number: 7,
        name: "given",
        title: "What you give us",
        anchor: "#c-given",
        keywords: "account name mobile email password google address delivery booking order offer payment refund deposit gstin identity id aadhaar listing lister photos bank upi pan payout messages calls recordings stylist reviews wishlist preferences choices",
        isRegisterClause: true,
        registerRows: [
          {
            title: "Your account",
            subclauseNumber: "7.1",
            anchor: "#c-given-1",
            rows: [
              { label: "What", text: "Your name, mobile number, email address and city. If you set a password, we store only a scrambled version of it that cannot be turned back into your password, even by us. If you sign in with Google, the name, email address and profile picture that Google shares with us." },
              { label: "Why", text: "To create your account, sign you in with a one-time code, your password or Google, keep your account secure, and show you your bookings, orders, offers, listings, deposits and payouts." },
              { label: "Basis", text: "Your consent, which you give when you create your account." },
              { label: "How long", text: `While your account is open. When you close it, we keep the details you registered with for ${PRIVACY_SETTINGS.reg_keep}, as the law requires, and then erase them.` }
            ]
          },
          {
            title: "Addresses and deliveries",
            subclauseNumber: "7.2",
            anchor: "#c-given-2",
            rows: [
              { label: "What", text: "Delivery and billing addresses and PIN codes, the phone number for each delivery, any delivery instructions, and the name, address and phone number of anyone you ask us to deliver to or collect from." },
              { label: "Why", text: "To check that we deliver to you, deliver and collect pieces, arrange pickups, and put the right address on your invoice." },
              { label: "Basis", text: "Your consent, given when you save an address or place a booking or order." },
              { label: "How long", text: "Saved addresses stay until you remove them or close your account. The address on a booking or order is kept with it, as clause 7.3 explains." }
            ]
          },
          {
            title: "Bookings, orders and offers",
            subclauseNumber: "7.3",
            anchor: "#c-given-3",
            rows: [
              { label: "What", text: "The pieces you rent or buy, their sizes, your rental dates and window, any event date you tell us, offers you make with the name and WhatsApp number you give, our replies, changes, extensions, cancellations, refunds and promo codes, and your invoices and credit notes." },
              { label: "Why", text: "To confirm and look after each booking, order and offer, handle changes, returns and refunds, keep our accounts and meet our tax obligations." },
              { label: "Basis", text: "Your consent, and the law, which requires us to keep invoices and accounting records." },
              { label: "How long", text: `For ${PRIVACY_SETTINGS.records_keep} after the end of the financial year in which the booking or order took place, as tax and accounting law require. An offer that does not become an order is kept for ${PRIVACY_SETTINGS.short_keep} after it closes.` }
            ]
          },
          {
            title: "Payments and refunds",
            subclauseNumber: "7.4",
            anchor: "#c-given-4",
            rows: [
              { label: "What", text: `Whether a payment succeeded, its amount, method and reference number, and the limited details ${PRIVACY_SETTINGS.payment_partner} shares with us, such as the last four digits of a card or the UPI ID you paid from. For a deposit, which is paid separately by UPI or bank transfer to our account after our team contacts you on WhatsApp, the payer’s name and the UPI ID or bank account it came from. If a refund cannot reach your original payment method, the bank account in your name that you ask us to use. For a GST invoice, your business name and GSTIN.` },
              { label: "Why", text: "To take payments, collect and refund deposits, send refunds to the right place, prevent payment fraud, reconcile our accounts and issue tax invoices." },
              { label: "Basis", text: "Your consent, and the law, which requires us to keep payment and tax records." },
              { label: "How long", text: "With the booking or order they belong to, as clause 7.3 explains." },
              { label: "Never", isNever: true, text: `Your full card number, expiry date or CVV, your UPI PIN, your net banking password or any one-time code. You enter these only with ${PRIVACY_SETTINGS.payment_partner} or your bank, and they never reach us.` }
            ]
          },
          {
            title: "Deposits and the condition of rental pieces",
            subclauseNumber: "7.5",
            anchor: "#c-given-5",
            rows: [
              { label: "What", text: "Your deposit and how it was paid and refunded; the record we make of a piece’s condition, with photographs, before dispatch and when it comes back; inspection notes; and any late return, damage or loss assessment, deduction or repair quote, with what you and we said about it." },
              { label: "Why", text: "To inspect every return fairly, refund your deposit, work out and explain any charge, and settle any disagreement or claim." },
              { label: "Basis", text: "Your consent, given when you book." },
              { label: "How long", text: `The deposit record is kept with your booking, as clause 7.3 explains. Inspection and damage records are kept until any charge is settled and any disagreement closed, and then for ${PRIVACY_SETTINGS.claims_keep}, the time within which a legal claim can usually be brought. Photographs of a piece itself stay in its history, without your details.` }
            ]
          },
          {
            title: "Identity checks for high-value rentals",
            subclauseNumber: "7.6",
            anchor: "#c-given-6",
            rows: [
              { label: "What", text: "Only for rentals of high-value pieces, and only when we ask on WhatsApp: a copy of a government-issued photo ID, confirmation of your address, and a note of a short call with our team." },
              { label: "Why", text: "To confirm who you are before we dispatch a high-value piece, and to protect every piece, and everyone who wears one, from fraud." },
              { label: "Basis", text: "Your consent, which we ask for at the time. If you would rather not give it, we may not be able to go ahead, and you receive a full refund of anything you have paid for that booking." },
              { label: "How long", text: "A copy of your document only while the piece is with you. We delete it once the piece is back with us, keeping only a note that your identity was confirmed. If a piece is not returned, or comes back with damage that is disputed, we keep it until that matter is closed." },
              { label: "Never", isNever: true, text: "Your full Aadhaar number. If you choose Aadhaar, please share a masked copy that shows only its last four digits." }
            ]
          },
          {
            title: "Listing a piece with us",
            subclauseNumber: "7.7",
            anchor: "#c-given-7",
            rows: [
              { label: "What", text: "Your name, city, mobile number, email address and pickup address; the details of your piece, such as its designer, size, colour, condition, how often it has been worn and its original price; the photographs, story and notes you send; proof of where it came from, such as the original bill, care labels or a designer certificate; your Listing Terms; and notes our team keeps of what we agree with you." },
              { label: "Why", text: "To review your submission, confirm your piece is genuine, collect and photograph it, agree its price with you, describe it honestly in a listing that never shows your name or anything else that identifies you, and then rent or sell it on your behalf and look after it." },
              { label: "Basis", text: "Your consent, given when you submit a piece." },
              { label: "How long", text: `While your piece is listed with us, and then with the records of its rentals and sales, as clause 7.3 explains. If we do not accept a piece, we delete its submission, photographs included, ${PRIVACY_SETTINGS.short_keep} after we tell you, unless you ask us to keep it for another look.` }
            ]
          },
          {
            title: "Payouts and tax, for Listers",
            subclauseNumber: "7.8",
            anchor: "#c-given-8",
            rows: [
              { label: "What", text: "The bank account number, IFSC and account holder’s name, or the UPI ID, in your own name, that you ask us to pay into; your PAN; your GSTIN if you are registered for GST; and the record of each payout, statement and any tax deducted." },
              { label: "Why", text: "To pay your share of each rental and sale into your own account, deduct and report tax where income tax law requires it, and send you statements." },
              { label: "Basis", text: "Your consent, and the law, which requires us to deduct and report tax on some payouts and to keep the records." },
              { label: "How long", text: `Your bank or UPI details, while you list with us. Payout and tax records, for ${PRIVACY_SETTINGS.records_keep} after the end of the financial year of each payout.` }
            ]
          },
          {
            title: "Messages, calls and styling help",
            subclauseNumber: "7.9",
            anchor: "#c-given-9",
            rows: [
              { label: "What", text: "What you tell us on WhatsApp, by email, by phone or on Instagram, including photographs and videos you send, such as of a piece as it arrived; feedback and survey replies; recordings of calls, made only when we have told you at the start and you have agreed; and what you share when you use Consult a Stylist or ask for a piece we do not have yet, such as your occasion, size, measurements and budget." },
              { label: "Why", text: "To help you, resolve concerns, keep an accurate record of what we agreed, suggest pieces that suit you, and tell you when a piece you asked about arrives, if you have asked us to." },
              { label: "Basis", text: "Your consent, given when you contact us, and for a recorded call, when you agree to the recording." },
              { label: "How long", text: `Until your question or concern is resolved, and then for ${PRIVACY_SETTINGS.claims_keep}. Call recordings, for ${PRIVACY_SETTINGS.recording_keep}, unless one is needed to settle a complaint or claim.` }
            ]
          },
          {
            title: "Reviews, photographs and testimonials",
            subclauseNumber: "7.10",
            anchor: "#c-given-10",
            rows: [
              { label: "What", text: "Reviews and ratings you post, photographs you share with us or tag us in, and testimonials you agree to give." },
              { label: "Why", text: "To publish reviews beside the pieces they describe and, only with your agreement, to feature your photographs or words on the Platform or in our marketing." },
              { label: "Basis", text: "Your consent. We never publish a photograph in which you or anyone else can be recognised, or use your name in our marketing, without it." },
              { label: "How long", text: `While they are published, and you can ask us to take any of them down at any time. We keep a note of any review we decline or remove, and why, for ${PRIVACY_SETTINGS.claims_keep}.` }
            ]
          },
          {
            title: "Your wishlist, preferences and choices",
            subclauseNumber: "7.11",
            anchor: "#c-given-11",
            rows: [
              { label: "What", text: "The pieces you save, the sizes, dates and filters you choose, your notification settings, and each choice you make about marketing and cookies, with when and how you made it." },
              { label: "Why", text: "To keep your wishlist, show you first the pieces available in your size and for your dates, send only the messages you have chosen, and honour every choice you make." },
              { label: "Basis", text: "Your consent. Keeping a record of your choices is also how we show that we respect them, as the law requires us to be able to do." },
              { label: "How long", text: `Until you change or remove them, or close your account. The record of a consent you gave or withdrew, for ${PRIVACY_SETTINGS.claims_keep} after that consent ends.` }
            ]
          }
        ]
      },
      {
        number: 8,
        name: "auto",
        title: "What we collect automatically",
        anchor: "#c-auto",
        keywords: "device browser ip address usage analytics location logs security records cookies local storage tracking",
        isRegisterClause: true,
        registerRows: [
          {
            title: "Device and usage details",
            subclauseNumber: "8.1",
            anchor: "#c-auto-1",
            rows: [
              { label: "What", text: "Your IP address; your device, browser and operating system; the pages and pieces you view, what you search for and how you move around the Platform; the page that brought you to us; dates and times; and an approximate location worked out from your IP address or PIN code." },
              { label: "Why", text: "To show you the Platform properly on your device, show delivery dates for your area, keep the Platform working and fix problems; and, only if you allow analytics cookies, to understand how the Platform is used so we can improve it." },
              { label: "Basis", text: "For analytics, your consent. For showing you the Platform and keeping it secure, the details your device sends when you open a page, which the law allows us to use for that purpose." },
              { label: "How long", text: `Analytics data, for no more than ${PRIVACY_SETTINGS.analytics_keep}. Other usage details, only as long as it takes to show you the Platform, unless they form part of the security records in clause 8.2.` }
            ]
          },
          {
            title: "Security records",
            subclauseNumber: "8.2",
            anchor: "#c-auto-2",
            rows: [
              { label: "What", text: "Records of sign-ins, one-time codes sent, changes to your account and other actions on the Platform, with the date, time and IP address; and our systems’ records of which member of our team, or which Data Processor, handled personal data and when." },
              { label: "Why", text: "To keep your account and the Platform secure, to detect, investigate and stop misuse or a personal data breach, and to meet our legal duties on cyber security." },
              { label: "Basis", text: "The law, including CERT-In’s directions on cyber security and the Digital Personal Data Protection Rules, 2025." },
              { label: "How long", text: `At least ${PRIVACY_SETTINGS.log_keep}, as CERT-In’s directions require, and records of how personal data was handled for at least ${PRIVACY_SETTINGS.processing_log_keep}, as the Digital Personal Data Protection Rules, 2025 require. We then erase them, unless they are needed for an investigation or a legal claim.` }
            ]
          },
          {
            title: "Cookies and similar technologies",
            subclauseNumber: "8.3",
            anchor: "#c-auto-3",
            rows: [
              { label: "What", text: "Cookies are small files your browser stores for a website. We also use similar tools, such as your browser’s local storage, to remember things like your sign-in, your bag, your cookie choices and, when you are not signed in, your wishlist on that device." },
              { label: "Why", text: "As clause 17 explains." },
              { label: "Basis", text: "Cookies that a feature you use cannot work without, such as your bag, are set when you use it. Every other cookie is set only with your consent." },
              { label: "How long", text: "As our Cookie Policy sets out for each cookie. A wishlist saved on a device stays there until you clear it or sign in." }
            ]
          }
        ]
      },
      {
        number: 9,
        name: "others",
        title: "What we receive from others",
        anchor: "#c-others",
        keywords: "third party google razorpay bank courier authenticator designer instagram someone else booked for me source",
        subclauses: [
          {
            number: "9.1",
            anchor: "#c-others-1",
            text: "We sometimes receive personal data about you from others:",
            list: [
              { letter: "(a)", text: "Google, if you choose to sign in with Google: your name, email address and profile picture. We never receive your Google password;" },
              { letter: "(b)", text: `Razorpay and banks: whether a payment or refund succeeded, its reference number, and the limited payment details in clause 7.4;` },
              { letter: "(c)", text: `our courier partners: delivery and pickup updates, proof of delivery, and anything that went wrong on the way;` },
              { letter: "(d)", text: "someone who books for you: your name, address and phone number, when they ask us to deliver a piece to you;" },
              { letter: "(e)", text: "a designer’s house or an independent authenticator, if we ask for their view on a piece you have listed or bought; and" },
              { letter: "(f)", text: "public sources, such as your public Instagram profile when you message us there or tag us." }
            ]
          },
          {
            number: "9.2",
            anchor: "#c-others-2",
            text: "We use what we receive only for the purposes in this policy, and handle it exactly as we handle what you give us."
          }
        ]
      },
      {
        number: 10,
        name: "people",
        title: "Details you give us about other people",
        anchor: "#c-people",
        keywords: "someone else friend mother family recipient gift delivery photo other person permission",
        subclauses: [
          {
            number: "10.1",
            anchor: "#c-people-1",
            text: "When you give us someone else’s details, for example the person you are renting for, the address you want a piece delivered to, or a person who appears in a photograph you send, you confirm that they are happy for you to share them with us, and for us to use them to deliver your booking or order or answer your message."
          },
          {
            number: "10.2",
            anchor: "#c-people-2",
            text: "We use their details only for that purpose. When we contact them, for example about a delivery, we let them know where to find this policy."
          },
          {
            number: "10.3",
            anchor: "#c-people-3",
            text: "If you are a parent or lawful guardian, clause 40 and clause 41 explain how we handle the details of the person you act for."
          }
        ]
      },
      {
        number: 11,
        name: "never",
        title: "What we never ask for",
        anchor: "#c-never",
        keywords: "sensitive health medical religion caste community biometric sexual orientation political views aadhaar full number card cvv pin password otp pregnant allergy occasion",
        subclauses: [
          {
            number: "11.1",
            anchor: "#c-never-1",
            text: "We never ask for, and never collect:",
            list: [
              { letter: "(a)", text: "your full card number, CVV, UPI PIN, net banking password or any one-time code;" },
              { letter: "(b)", text: "your full Aadhaar number, or any biometric information, such as fingerprints or face scans; or" },
              { letter: "(c)", text: "information about your health, medical history, sexual orientation, religion, caste, community or political views." }
            ]
          },
          {
            number: "11.2",
            anchor: "#c-never-2",
            text: "If you choose to tell us something sensitive, for example that you are expecting and would like a comfortable fit, or that you react to a particular fabric or dye, we use it only to help with that request. We do not add it to your account or use it for anything else."
          },
          {
            number: "11.3",
            anchor: "#c-never-3",
            text: "The occasions you shop for, such as a wedding or a festival, help us show you the right pieces. We never use them, or anything else you tell us, to work out your religion, caste, community or any other sensitive characteristic."
          },
          {
            number: "11.4",
            anchor: "#c-never-4",
            text: "Passwords and bank or UPI details are sensitive personal data under Indian law. We collect them only with your consent, for the purposes in clause 7, and protect them as clause 27 explains."
          }
        ]
      }
    ]
  },
  {
    number: 3,
    title: "How we use it",
    italicWord: "use",
    range: "Clauses 12 to 17",
    startClause: 12,
    endClause: 17,
    barLabel: "How we use it",
    tooltip: "How we use it, clauses 12 to 17",
    description: "Why we use your personal data, the basis for each use, and how your consent works.",
    anchor: "#p-use",
    clauses: [
      {
        number: 12,
        name: "purposes",
        title: "Why we use your personal data",
        anchor: "#c-purposes",
        keywords: "purpose why use reasons account booking order deposit delivery listing payout invoice support marketing fraud security analytics legal",
        subclauses: [
          {
            number: "12.1",
            anchor: "#c-purposes-1",
            text: "We use your personal data only for these purposes, each tied to the details in clause 7, clause 8 and clause 9:",
            list: [
              { letter: "(a)", text: "to create and run your account, and sign you in securely;" },
              { letter: "(b)", text: "to show you which pieces are available for your dates, and where we deliver;" },
              { letter: "(c)", text: "to confirm and look after your bookings, orders and offers, including changes, extensions, cancellations and refunds;" },
              { letter: "(d)", text: "to collect, hold and refund deposits, and to inspect every returned piece and settle any charge fairly;" },
              { letter: "(e)", text: "to deliver and collect pieces with our courier partners;" },
              { letter: "(f)", text: "for Listers, to review, authenticate, collect, photograph, price, list, rent and sell your piece, look after it, and pay you;" },
              { letter: "(g)", text: "to take payments, issue invoices, and keep the accounts and records that tax and company law require;" },
              { letter: "(h)", text: "to answer your questions, give styling help, and resolve concerns and complaints;" },
              { letter: "(i)", text: "to send you messages about what you have asked us for, as clause 15 explains;" },
              { letter: "(j)", text: "to send you marketing, only if you have chosen to receive it;" },
              { letter: "(k)", text: "to confirm your identity where clause 7.6 says we may, and to prevent fraud and misuse;" },
              { letter: "(l)", text: "to keep the Platform and your personal data secure, and to find and fix problems;" },
              { letter: "(m)", text: "to understand how the Platform is used and improve it, using analytics only if you allow them;" },
              { letter: "(n)", text: "to understand and plan our service from booking and order records, for example which designers and sizes are most in demand, using information that no longer identifies you wherever we can;" },
              { letter: "(o)", text: "to enforce our Terms, recover a piece that is not returned or an amount that is owed, and establish, bring or defend legal claims; and" },
              { letter: "(p)", text: "to meet our legal obligations, including to tax authorities, courts and other authorities, as clause 23 explains." }
            ]
          },
          {
            number: "12.2",
            anchor: "#c-purposes-2",
            text: "We do not use your personal data for any other purpose without telling you first and, where the law needs it, asking for your consent."
          }
        ]
      },
      {
        number: 13,
        name: "basis",
        title: "The basis on which we use it",
        anchor: "#c-basis",
        keywords: "lawful basis legal ground consent legitimate use section 7 law court order emergency sensitive written consent",
        subclauses: [
          {
            number: "13.1",
            anchor: "#c-basis-1",
            text: "Indian law allows us to use your personal data only with your consent, or for a small number of legitimate uses that the Digital Personal Data Protection Act, 2023 sets out. For each kind of personal data, clause 7 and clause 8 show which we rely on."
          },
          {
            number: "13.2",
            anchor: "#c-basis-2",
            text: "Most of what we do rests on your consent. The legitimate uses we may also rely on are:",
            list: [
              { letter: "(a)", text: "using details you have chosen to give us for the purpose you gave them for, such as an address you enter for a delivery, unless you tell us you do not want them used that way;" },
              { letter: "(b)", text: "meeting a legal obligation to give information to the government or its agencies, such as in our tax filings;" },
              { letter: "(c)", text: "complying with a judgment, decree or order of a court or tribunal; and" },
              { letter: "(d)", text: "responding to a medical emergency that threatens someone’s life or health, or keeping people safe during a disaster or a breakdown of public order." }
            ]
          },
          {
            number: "13.3",
            anchor: "#c-basis-3",
            text: "Where we collect sensitive personal data, such as a password or your bank details, we ask for your consent, in writing or electronically, before we collect it, and tell you what it is for."
          }
        ]
      },
      {
        number: 14,
        name: "consent",
        title: "Your consent, and changing your mind",
        anchor: "#c-consent",
        keywords: "consent withdraw opt out change mind stop tick box pre ticked consent manager marketing cookies",
        subclauses: [
          {
            number: "14.1",
            anchor: "#c-consent-1",
            text: "When we ask for your consent, we tell you what it is for, and you give it by a clear action of your own, such as ticking an empty box or switching on a setting. We never treat silence, a box ticked for you, or simply using the Platform as consent, and we ask separately for anything optional, such as marketing or analytics cookies."
          },
          {
            number: "14.2",
            anchor: "#c-consent-2",
            text: "You can withdraw a consent at any time, as easily as you gave it: in My Account, through Cookie settings, which you can open from this page or our Cookie Policy, by replying to any marketing message, or by writing to our Grievance Officer."
          },
          {
            number: "14.3",
            anchor: "#c-consent-3",
            text: "Once you withdraw a consent, we stop using your personal data for that purpose within a reasonable time, and make sure our Data Processors stop too, unless the law requires or allows us to continue, for example to keep invoices."
          },
          {
            number: "14.4",
            anchor: "#c-consent-4",
            text: "Withdrawing consent does not affect anything we did with your consent before you withdrew it. If you withdraw a consent we need in order to provide a service, such as delivering a booking, we may not be able to provide it, and we will tell you what that means before you decide."
          },
          {
            number: "14.5",
            anchor: "#c-consent-5",
            text: "You may also give, manage, review or withdraw your consent to us through a Consent Manager registered with the Data Protection Board of India, once such Consent Managers are available."
          }
        ]
      },
      {
        number: 15,
        name: "messages",
        title: "The messages we send you",
        anchor: "#c-messages",
        keywords: "whatsapp sms email marketing unsubscribe stop promotional service updates notifications dnd trai open tracking",
        subclauses: [
          {
            number: "15.1",
            anchor: "#c-messages-1",
            text: "We send messages about what you have asked us for, such as bookings, orders, offers, deliveries, deposits, returns, listings, payouts and the security of your account, by WhatsApp, SMS, email or phone. They are part of the service, so they continue while you have anything open with us, whatever your marketing choices."
          },
          {
            number: "15.2",
            anchor: "#c-messages-2",
            text: "We send marketing, such as new arrivals, occasion edits and offers, only if you have chosen to receive it. You can stop it at any time in your notification settings, through the unsubscribe link in any marketing email, or by replying to any message. Promotional SMS messages and calls also follow the rules of the Telecom Regulatory Authority of India on commercial communications."
          },
          {
            number: "15.3",
            anchor: "#c-messages-3",
            text: "Our marketing emails contain a small image that tells us whether an email was opened. You can stop this by turning off automatic image loading in your email app."
          }
        ]
      },
      {
        number: 16,
        name: "personal",
        title: "Personalisation and automated decisions",
        anchor: "#c-personal",
        keywords: "recommended order personalised recommendations suggestions profiling automated decision algorithm ai size dates",
        subclauses: [
          {
            number: "16.1",
            anchor: "#c-personal-1",
            text: "Where you have told us your size or dates, we use them to show you first the pieces that are available to you, as the Recommended order in our Terms & Conditions describes."
          },
          {
            number: "16.2",
            anchor: "#c-personal-2",
            text: "If we introduce suggestions based on what you have saved, viewed or rented, we will ask for your consent first, and you will be able to switch them off at any time."
          },
          {
            number: "16.3",
            anchor: "#c-personal-3",
            text: "We do not make decisions that significantly affect you, such as declining a booking or closing an account, by automated means alone. Our systems may flag something unusual, such as repeated failed payments, but a member of our team reviews it and decides."
          }
        ]
      },
      {
        number: 17,
        name: "cookies",
        title: "Cookies and similar technologies",
        anchor: "#c-cookies",
        keywords: "cookies local storage tracking analytics google analytics pixel advertising do not track settings browser block delete instagram embed",
        subclauses: [
          {
            number: "17.1",
            anchor: "#c-cookies-1",
            text: "We use cookies and similar technologies, such as your browser’s local storage, in two ways:",
            list: [
              { letter: "(a)", text: "strictly necessary, to keep you signed in, remember your bag, keep the Platform secure, remember your cookie choices, and keep the pieces you save to your wishlist on that device when you are not signed in; and" },
              { letter: "(b)", text: "analytics, to understand how the Platform is used, through Google Analytics, only if you allow them." }
            ]
          },
          {
            number: "17.2",
            anchor: "#c-cookies-2",
            text: "We do not use cookies to show you advertising on other websites. If we ever want to, we will update our Cookie Policy first and ask for your consent."
          },
          {
            number: "17.3",
            anchor: "#c-cookies-3",
            text: "When you first visit, we ask which cookies you allow, and nothing beyond those that are strictly necessary is set until you choose. You can change your choice at any time in Cookie settings. You can also block or delete cookies in your browser, though some features, such as your bag, may then not work."
          },
          {
            number: "17.4",
            anchor: "#c-cookies-4",
            text: "Some pages show content from other services, such as posts from our Instagram. When it loads, that service may set its own cookies and receive details such as your IP address, under its own privacy policy, so we load it only once you have allowed it."
          },
          {
            number: "17.5",
            anchor: "#c-cookies-5",
            text: "Your browser may send a “Do Not Track” signal. There is no agreed standard for responding to it, so the Platform does not, but your cookie choices always apply."
          },
          {
            number: "17.6",
            anchor: "#c-cookies-6",
            text: "Our Cookie Policy lists each cookie, who sets it, what it does and how long it lasts."
          }
        ]
      }
    ]
  },
  {
    number: 4,
    title: "Who we share it with",
    italicWord: "share",
    range: "Clauses 18 to 26",
    startClause: 18,
    endClause: 26,
    barLabel: "Sharing",
    tooltip: "Who we share it with, clauses 18 to 26",
    description: "The only people who ever see your personal data, and why. We never sell it.",
    anchor: "#p-share",
    clauses: [
      {
        number: 18,
        name: "promise",
        title: "Our promise",
        anchor: "#c-promise",
        keywords: "sell never sell share third party marketing promise minimum",
        subclauses: [
          {
            number: "18.1",
            anchor: "#c-promise-1",
            text: "We never sell your personal data, and we never share it with anyone for their own marketing."
          },
          {
            number: "18.2",
            anchor: "#c-promise-2",
            text: "We share it only as this Part describes, only as much as each person needs for the purpose, and only with people who are bound to protect it."
          }
        ]
      },
      {
        number: 19,
        name: "processors",
        title: "Companies that work for us",
        anchor: "#c-processors",
        keywords: "service providers data processors razorpay courier blue dart delhivery cloud hosting storage email sms whatsapp google analytics cleaners repairers contract",
        subclauses: [
          {
            number: "19.1",
            anchor: "#c-processors-1",
            text: "Some companies handle personal data on our behalf, as our Data Processors, so that we can run the Platform:",
            list: [
              { letter: "(a)", text: `our payment partner, ${PRIVACY_SETTINGS.payment_partner}, to take payments and make refunds;` },
              { letter: "(b)", text: `our courier partners, such as ${PRIVACY_SETTINGS.courier_partners}, who receive the name, address, phone number and parcel details they need to deliver and collect;` },
              { letter: "(c)", text: "the cloud hosting, database and file storage providers that keep the Platform and its data running;" },
              { letter: "(d)", text: "the providers that deliver our emails, SMS messages, one-time codes and WhatsApp messages;" },
              { letter: "(e)", text: "Google, for analytics, only if you allow analytics cookies; and" },
              { letter: "(f)", text: "the specialist cleaners and repairers who look after pieces, who receive a piece with our own reference only, never your name or contact details." }
            ]
          },
          {
            number: "19.2",
            anchor: "#c-processors-2",
            text: "Each works under a written contract with us that lets them use personal data only on our instructions and for our purposes, requires them to protect it at least as well as we do, and requires them to erase or return it when their work is done. We remain responsible to you for what they do with it."
          }
        ]
      },
      {
        number: 20,
        name: "partners",
        title: "Partners who make their own decisions",
        anchor: "#c-partners",
        keywords: "razorpay bank card network upi app google sign in whatsapp instagram meta insurer independent own privacy policy",
        subclauses: [
          {
            number: "20.1",
            anchor: "#c-partners-1",
            text: "Some organisations receive personal data from us, or directly from you, and also decide for themselves how to use it, under their own privacy policies and the laws that apply to them:",
            list: [
              { letter: "(a)", text: `${PRIVACY_SETTINGS.payment_partner}, banks, card networks and UPI apps, which process your payment and keep their own records under banking rules;` },
              { letter: "(b)", text: "Google, when you sign in with Google;" },
              { letter: "(c)", text: "WhatsApp and Instagram, services of Meta, which carry the messages you exchange with us there; and" },
              { letter: "(d)", text: "insurers, when we claim for a piece lost or damaged in transit." }
            ]
          },
          {
            number: "20.2",
            anchor: "#c-partners-2",
            text: "We choose partners who take privacy seriously, but how they handle personal data under their own policies is their responsibility, and we encourage you to read those policies."
          }
        ]
      },
      {
        number: 21,
        name: "between",
        title: "Between Listers and customers",
        anchor: "#c-between",
        keywords: "lister see my name address renter buyer anonymous private who rented discreet confidential",
        subclauses: [
          {
            number: "21.1",
            anchor: "#c-between-1",
            text: "We rent and sell every piece in our own name, so Listers and customers never need each other’s details. We never show your name, address or contact details to the Lister of a piece you rent, buy or make an offer on, and we never show a Lister’s to you, on the Platform or on your invoice."
          },
          {
            number: "21.2",
            anchor: "#c-between-2",
            text: "We tell a Lister what they need to know about their own piece: when it is booked or sold, its dates, its condition when it comes back, and their earnings. If you make an offer, we may tell the Lister its amount, but not who made it."
          },
          {
            number: "21.3",
            anchor: "#c-between-3",
            text: "We do not tell anyone else what you have rented or bought."
          },
          {
            number: "21.4",
            anchor: "#c-between-4",
            text: "The only exceptions are where a court or the law requires us to share these details, or where they are needed to bring or defend a legal claim about the piece, as clause 24 explains."
          }
        ]
      },
      {
        number: 22,
        name: "public",
        title: "What others can see",
        anchor: "#c-public",
        keywords: "public reviews name visible testimonials photos shared wishlist link everyone",
        subclauses: [
          {
            number: "22.1",
            anchor: "#c-public-1",
            text: "Reviews you post, and the name shown with them, can be seen by everyone who visits the Platform. So can photographs and testimonials we feature with your agreement."
          },
          {
            number: "22.2",
            anchor: "#c-public-2",
            text: "If you share your wishlist, anyone with the link can see the pieces in it."
          },
          {
            number: "22.3",
            anchor: "#c-public-3",
            text: "Everything else in your account is visible only to you and to the members of our team who need it for their work."
          }
        ]
      },
      {
        number: 23,
        name: "authorities",
        title: "Authorities, and when the law requires it",
        anchor: "#c-authorities",
        keywords: "police government court law enforcement tax authorities gst income tax cert-in lawful request order disclosure investigation",
        subclauses: [
          {
            number: "23.1",
            anchor: "#c-authorities-1",
            text: "We share personal data with government authorities, regulators and courts only where the law requires or allows it, for example with:",
            list: [
              { letter: "(a)", text: "tax authorities, when we file GST returns with invoice details, and returns of tax deducted from Listers’ payouts with their PAN;" },
              { letter: "(b)", text: "an agency lawfully authorised to prevent or investigate offences, or to protect cyber security, when it sends us a lawful order or written request;" },
              { letter: "(c)", text: "CERT-In, when we report a cyber security incident;" },
              { letter: "(d)", text: "the Data Protection Board of India, a Consumer Disputes Redressal Commission or a court, in a matter in which we are involved; and" },
              { letter: "(e)", text: "the police, if a piece is not returned or is stolen, as our Terms explain." }
            ]
          },
          {
            number: "23.2",
            anchor: "#c-authorities-2",
            text: "We check that each request is lawful, share only what it covers, and tell you about it where the law allows. A government agency that asks for sensitive personal data must do so in writing and state its purpose."
          }
        ]
      },
      {
        number: 24,
        name: "rights-protect",
        title: "Protecting pieces, people and our rights",
        anchor: "#c-rights-protect",
        keywords: "unreturned piece recovery lawyer police court chargeback bank dispute fraud safety legal claim auditors chartered accountant",
        subclauses: [
          {
            number: "24.1",
            anchor: "#c-rights-protect-1",
            text: "We may share personal data where it is needed to:",
            list: [
              { letter: "(a)", text: "recover a piece that is not returned, or an amount that is owed, with our lawyers and, where needed, the police and the courts;" },
              { letter: "(b)", text: "respond to a payment dispute you raise with your bank, by sharing the records of your booking or order, including your acceptance of our Terms;" },
              { letter: "(c)", text: "prevent or investigate fraud, or protect anyone’s safety; and" },
              { letter: "(d)", text: "establish, bring or defend a legal claim, with our lawyers and other professional advisers, who keep it confidential." }
            ]
          },
          {
            number: "24.2",
            anchor: "#c-rights-protect-2",
            text: "Our auditors and chartered accountants see accounting records, which can include personal data, when they audit or prepare our accounts, and they too are bound to keep them confidential."
          }
        ]
      },
      {
        number: 25,
        name: "transfer",
        title: "If House of Kaira changes hands",
        anchor: "#c-transfer",
        keywords: "merger acquisition sale business transfer successor reorganisation",
        subclauses: [
          {
            number: "25.1",
            anchor: "#c-transfer-1",
            text: "If House of Kaira is reorganised, merged with or acquired by another business, or its assets are transferred, personal data may pass to the business that takes it over. That business must keep using it only as this policy describes, your rights under it continue, and we will tell you when it happens."
          }
        ]
      },
      {
        number: 26,
        name: "abroad",
        title: "When personal data leaves India",
        anchor: "#c-abroad",
        keywords: "outside india abroad overseas cross border transfer servers country location storage cloud",
        subclauses: [
          {
            number: "26.1",
            anchor: "#c-abroad-1",
            text: "We keep your personal data in India wherever we reasonably can. Some of our Data Processors, such as email and analytics providers, may store or handle it in other countries."
          },
          {
            number: "26.2",
            anchor: "#c-abroad-2",
            text: "We transfer personal data outside India only:",
            list: [
              { letter: "(a)", text: "to a country to which the Central Government has not restricted such transfers under the Digital Personal Data Protection Act, 2023;" },
              { letter: "(b)", text: "to a company bound by contract to protect it to at least the standard Indian law requires; and" },
              { letter: "(c)", text: "where it is needed to provide the Platform and our services to you, or you have consented to it." }
            ]
          },
          {
            number: "26.3",
            anchor: "#c-abroad-3",
            text: "Records the law requires us to keep in India, such as records of payments, stay in India."
          }
        ]
      }
    ]
  },
  {
    number: 5,
    title: "Keeping it safe",
    italicWord: "safe",
    range: "Clauses 27 to 29",
    startClause: 27,
    endClause: 29,
    barLabel: "Keeping it safe",
    tooltip: "Keeping it safe, clauses 27 to 29",
    description: "How we protect your personal data, what we ask of you, and what we do if something goes wrong.",
    anchor: "#p-security",
    clauses: [
      {
        number: 27,
        name: "protect",
        title: "How we protect it",
        anchor: "#c-protect",
        keywords: "security safe secure encryption ssl https access control password hashing two step verification logs monitoring backups contracts information security programme",
        subclauses: [
          {
            number: "27.1",
            anchor: "#c-protect-1",
            text: "We protect personal data with security measures suited to what it is and how much harm its misuse could cause, including:",
            list: [
              { letter: "(a)", text: "encryption, so that every page is served over a secure connection and personal data is protected both as it travels between you and us and on the systems that store it;" },
              { letter: "(b)", text: "passwords stored only in a scrambled form that cannot be turned back into the password;" },
              { letter: "(c)", text: "access limited to the members of our team, and the Data Processors, who need it for their work, each with their own sign-in and two-step verification for our systems;" },
              { letter: "(d)", text: "records of who accessed personal data and when, which we monitor and review so that we can detect, investigate and stop misuse;" },
              { letter: "(e)", text: "regular backups, so that personal data can be restored if it is lost or damaged; and" },
              { letter: "(f)", text: "written contracts that require our Data Processors to protect personal data in the same way." }
            ]
          },
          {
            number: "27.2",
            anchor: "#c-protect-2",
            text: "These measures form part of a documented information security programme, with policies and controls covering our people, our systems and our premises, which we review regularly and whenever something changes."
          },
          {
            number: "27.3",
            anchor: "#c-protect-3",
            text: "No system is completely secure, but we work to protect your personal data as the law requires and as you would expect."
          }
        ]
      },
      {
        number: 28,
        name: "you-help",
        title: "How you can help",
        anchor: "#c-you-help",
        keywords: "otp password phishing scam fraud fake call official numbers account misuse protect yourself",
        subclauses: [
          {
            number: "28.1",
            anchor: "#c-you-help-1",
            text: "Keep your one-time codes and password private, and never share them with anyone, including anyone who says they are from House of Kaira."
          },
          {
            number: "28.2",
            anchor: "#c-you-help-2",
            text: "We will never ask for your card details, UPI PIN, net banking password or one-time codes, by any channel. We contact you only from the numbers, email addresses and accounts on our Contact page. If anyone claiming to be us asks for these, or asks you to pay into an account that is not ours, please do not respond, and tell us straight away."
          },
          {
            number: "28.3",
            anchor: "#c-you-help-3",
            text: "If you think someone has used your account, change your password if you use one, and tell us at once so that we can secure it."
          }
        ]
      },
      {
        number: 29,
        name: "breach",
        title: "If something goes wrong",
        anchor: "#c-breach",
        keywords: "breach data breach hack leak compromised incident notify tell me cert-in board",
        subclauses: [
          {
            number: "29.1",
            anchor: "#c-breach-1",
            text: "If a personal data breach affects you, we will tell you without delay, in plain words, through your account or the contact details you have given us. We will tell you:",
            list: [
              { letter: "(a)", text: "what happened, including when, where and how far it reached;" },
              { letter: "(b)", text: "what it is likely to mean for you;" },
              { letter: "(c)", text: "what we have done, and are doing, to limit the harm;" },
              { letter: "(d)", text: "what you can do to protect yourself; and" },
              { letter: "(e)", text: "who to contact with questions." }
            ]
          },
          {
            number: "29.2",
            anchor: "#c-breach-2",
            text: "We also report personal data breaches to the Data Protection Board of India, and cyber security incidents to CERT-In, within the times the law sets."
          },
          {
            number: "29.3",
            anchor: "#c-breach-3",
            text: "We keep a record of every personal data breach and of what we did about it."
          }
        ]
      }
    ]
  },
  {
    number: 6,
    title: "How long we keep it",
    italicWord: "keep",
    range: "Clauses 30 to 33",
    startClause: 30,
    endClause: 33,
    barLabel: "How long",
    tooltip: "How long we keep it, clauses 30 to 33",
    description: "We keep personal data only for as long as we need it, or the law requires, and then erase it.",
    anchor: "#p-keeping",
    clauses: [
      {
        number: 30,
        name: "keep-rule",
        title: "Our rule for keeping data",
        anchor: "#c-keep-rule",
        keywords: "retention how long keep store delete erase legal records tax invoices law requires minimum",
        subclauses: [
          {
            number: "30.1",
            anchor: "#c-keep-rule-1",
            text: "We keep personal data only while we need it for the purpose we collected it for and you have not withdrawn your consent, unless the law requires us to keep it for longer. Then we erase it, or make sure it can no longer identify you. clause 7 and clause 8 show how long we keep each kind."
          },
          {
            number: "30.2",
            anchor: "#c-keep-rule-2",
            text: "Some records must be kept even after you close your account or withdraw a consent, because the law requires it:",
            list: [
              { letter: "(a)", text: `invoices, payment, payout and tax records, for ${PRIVACY_SETTINGS.records_keep} after the end of the financial year they relate to;` },
              { letter: "(b)", text: `the details you registered with, for ${PRIVACY_SETTINGS.reg_keep} after you close your account;` },
              { letter: "(c)", text: `security records, for at least ${PRIVACY_SETTINGS.log_keep}; and` },
              { letter: "(d)", text: `personal data we have processed, with the records of how we processed it, for at least ${PRIVACY_SETTINGS.processing_log_keep} from the time we processed it, which the Digital Personal Data Protection Rules, 2025 require us to hold for purposes the law sets out, such as lawful requests from the government.` }
            ]
          },
          {
            number: "30.3",
            anchor: "#c-keep-rule-3",
            text: "Records we keep only because the law requires it are used for that reason and nothing else."
          },
          {
            number: "30.4",
            anchor: "#c-keep-rule-4",
            text: "If information is needed for a complaint, claim, investigation or legal proceedings, we keep it until that matter, and any appeal, is finished, even if it would otherwise have been erased."
          }
        ]
      },
      {
        number: 31,
        name: "closing",
        title: "When you close your account",
        anchor: "#c-closing",
        keywords: "delete account close remove erase what happens invoices download",
        subclauses: [
          {
            number: "31.1",
            anchor: "#c-closing-1",
            text: "You can close your account from My Account at any time. If a rental is in progress, a deposit is waiting to be refunded, a payout is due or an amount is owed, we settle that first."
          },
          {
            number: "31.2",
            anchor: "#c-closing-2",
            text: "When your account closes, we erase your profile, saved addresses, wishlist and preferences, and stop all marketing. We keep only the records in clause 30.2, for the periods set out there, and then erase them."
          },
          {
            number: "31.3",
            anchor: "#c-closing-3",
            text: "Closing your account also ends your access to past bookings and orders. If you would like copies of your invoices, please download them, or ask us for them, before you close it."
          }
        ]
      },
      {
        number: 32,
        name: "inactive",
        title: "If your account is not used",
        anchor: "#c-inactive",
        keywords: "inactive dormant unused old account automatic deletion notice",
        subclauses: [
          {
            number: "32.1",
            anchor: "#c-inactive-1",
            text: `If you have not signed in, booked, ordered, made an offer, listed a piece or contacted us for ${PRIVACY_SETTINGS.inactive_after}, and have nothing open with us, we treat your account as no longer needed. We will write to you at least ${PRIVACY_SETTINGS.inactive_notice} before we close it and erase your details, and you can keep it simply by signing in.`
          },
          {
            number: "32.2",
            anchor: "#c-inactive-2",
            text: "Records the law requires us to keep are then kept for the periods in clause 30.2."
          }
        ]
      },
      {
        number: 33,
        name: "backups",
        title: "Backups and anonymised data",
        anchor: "#c-backups",
        keywords: "backup copies restore anonymised aggregated statistics",
        subclauses: [
          {
            number: "33.1",
            anchor: "#c-backups-1",
            text: `Erased personal data can remain in our secure backups for up to ${PRIVACY_SETTINGS.backup_cycle}, until they are overwritten. We restore from a backup only to recover the Platform after a failure, and if that ever brings back erased data, we erase it again.`
          },
          {
            number: "33.2",
            anchor: "#c-backups-2",
            text: "We may keep information that has been anonymised so that it can no longer identify anyone, such as how many pieces were rented in a month, and use it to understand and improve our service."
          }
        ]
      }
    ]
  },
  {
    number: 7,
    title: "Your rights and choices",
    italicWord: "rights",
    range: "Clauses 34 to 39",
    startClause: 34,
    endClause: 39,
    barLabel: "Your rights",
    tooltip: "Your rights and choices, clauses 34 to 39",
    description: "What you can ask of us, how to ask, and how quickly we respond.",
    anchor: "#p-rights",
    clauses: [
      {
        number: 34,
        name: "access",
        title: "Seeing what we hold",
        anchor: "#c-access",
        keywords: "access copy my data summary what do you have know who shared download information",
        subclauses: [
          {
            number: "34.1",
            anchor: "#c-access-1",
            text: "You can ask us for:",
            list: [
              { letter: "(a)", text: "a summary of the personal data we hold about you, and of how we use it;" },
              { letter: "(b)", text: "the names of the other Data Fiduciaries and the Data Processors we have shared it with, and a description of what we shared; and" },
              { letter: "(c)", text: "any other information about your personal data that the law entitles you to." }
            ]
          },
          {
            number: "34.2",
            anchor: "#c-access-2",
            text: "We will not include information we have shared with an agency authorised by law to prevent, detect or investigate offences, where the law does not allow us to tell you."
          }
        ]
      },
      {
        number: 35,
        name: "correct",
        title: "Correcting and updating",
        anchor: "#c-correct",
        keywords: "correct update change wrong inaccurate details complete fix",
        subclauses: [
          {
            number: "35.1",
            anchor: "#c-correct-1",
            text: "You can correct or update most of your details yourself in My Account. For anything else, ask us, and we will correct, complete or update it."
          },
          {
            number: "35.2",
            anchor: "#c-correct-2",
            text: "If we believe something you have asked us to change is already accurate, for example a condition record you disagree with, we will explain why and, if you ask, keep a note of your view with it."
          },
          {
            number: "35.3",
            anchor: "#c-correct-3",
            text: "Before we use your personal data to make a decision about you, such as a deduction from your deposit, or share it with another Data Fiduciary, we take care that it is complete, accurate and consistent."
          }
        ]
      },
      {
        number: 36,
        name: "erase",
        title: "Erasing your data",
        anchor: "#c-erase",
        keywords: "erase delete remove forget right to be forgotten erasure",
        subclauses: [
          {
            number: "36.1",
            anchor: "#c-erase-1",
            text: "You can ask us to erase your personal data. We will, unless we still need it for the purpose you gave it for, such as a booking in progress, or the law requires us to keep it. If we must keep anything, we tell you what, why and for how long."
          },
          {
            number: "36.2",
            anchor: "#c-erase-2",
            text: "When we erase your personal data, we have our Data Processors erase any copy they hold too."
          },
          {
            number: "36.3",
            anchor: "#c-erase-3",
            text: "Erasing your personal data closes your account, as clause 31 explains."
          }
        ]
      },
      {
        number: 37,
        name: "nominate",
        title: "Nominating someone to act for you",
        anchor: "#c-nominate",
        keywords: "nominee nominate death incapacity family representative after i die",
        subclauses: [
          {
            number: "37.1",
            anchor: "#c-nominate-1",
            text: "You can nominate one or more people to exercise your rights under this policy if you die, or become unable to exercise them yourself because of illness, injury or any other condition of body or mind."
          },
          {
            number: "37.2",
            anchor: "#c-nominate-2",
            text: "To make, change or cancel a nomination, write to our Grievance Officer from the email address or mobile number on your account, with your nominee’s name, relationship to you and contact details."
          },
          {
            number: "37.3",
            anchor: "#c-nominate-3",
            text: "When a nominee asks to act for you, we will ask for reasonable proof, such as a death certificate or a medical certificate, and proof of their own identity, before we act on their request."
          }
        ]
      },
      {
        number: 38,
        name: "ask",
        title: "How to make a request",
        anchor: "#c-ask",
        keywords: "request how to ask email whatsapp my account identity verify free time how long reply identifiers",
        subclauses: [
          {
            number: "38.1",
            anchor: "#c-ask-1",
            text: "You can make a request about your personal data, or withdraw a consent, in any of these ways:",
            list: [
              { letter: "(a)", text: "in My Account, for your details, addresses and notification choices, and to close your account;" },
              { letter: "(b)", text: `by email to our Grievance Officer at ${PRIVACY_SETTINGS.grievance_email}; or` },
              { letter: "(c)", text: `on WhatsApp at ${PRIVACY_SETTINGS.support_whatsapp}.` }
            ]
          },
          {
            number: "38.2",
            anchor: "#c-ask-2",
            text: "Please make your request from the mobile number or email address on your account, and give us your booking, order or listing number if your request is about one. These are the details we use to identify you. If we need to confirm that it is really you, we will send a one-time code to your registered mobile number or email, and we will never ask for more than we need to be sure."
          },
          {
            number: "38.3",
            anchor: "#c-ask-3",
            text: `We acknowledge every request within ${PRIVACY_SETTINGS.grievance_ack} and respond within ${PRIVACY_SETTINGS.grievance_resolve}. Making a request is free.`
          },
          {
            number: "38.4",
            anchor: "#c-ask-4",
            text: "If we cannot do everything you ask, we explain why, and tell you how to take it further, as clause 42 explains. Every reply we send about your personal data includes our Grievance Officer’s contact details."
          }
        ]
      },
      {
        number: 39,
        name: "duties",
        title: "What the law asks of you",
        anchor: "#c-duties",
        keywords: "duties obligations data principal impersonate false complaint penalty",
        subclauses: [
          {
            number: "39.1",
            anchor: "#c-duties-1",
            text: "When you use your rights, the Digital Personal Data Protection Act, 2023 asks you to:",
            list: [
              { letter: "(a)", text: "follow the law;" },
              { letter: "(b)", text: "not pretend to be someone else when you give us personal data;" },
              { letter: "(c)", text: "not hold back important information when you give personal data for any document, unique identifier, or proof of identity or address issued by the government;" },
              { letter: "(d)", text: "not make a false or frivolous complaint; and" },
              { letter: "(e)", text: "give only information that can be verified as genuine when you ask us to correct or erase your personal data." }
            ]
          },
          {
            number: "39.2",
            anchor: "#c-duties-2",
            text: `The Data Protection Board of India can impose a penalty of up to ${PRIVACY_SETTINGS.duty_penalty} for a breach of these duties.`
          }
        ]
      }
    ]
  },
  {
    number: 8,
    title: "Children, and those who need a guardian",
    italicWord: "guardian",
    range: "Clauses 40 to 41",
    startClause: 40,
    endClause: 41,
    barLabel: "Children",
    tooltip: "Children, and those who need a guardian, clauses 40 to 41",
    description: "Accounts are for adults. How we look after the details of anyone a parent or guardian acts for.",
    anchor: "#p-minors",
    clauses: [
      {
        number: 40,
        name: "children",
        title: "Children",
        anchor: "#c-children",
        keywords: "child children minor under 18 parent guardian kids age teenager daughter son",
        subclauses: [
          {
            number: "40.1",
            anchor: "#c-children-1",
            text: `You must be at least ${PRIVACY_SETTINGS.age_min} old to create an account, place a booking or order, make an offer or list a piece, and we do not knowingly collect personal data from anyone younger.`
          },
          {
            number: "40.2",
            anchor: "#c-children-2",
            text: "A parent or guardian may rent or buy a piece for a child, as our Terms explain. We do not need the child’s details for this, because the booking and its delivery are in the parent’s or guardian’s name. Please do not send us a child’s photograph or other details; if you do, we use them only to answer your message, and do not keep them afterwards."
          },
          {
            number: "40.3",
            anchor: "#c-children-3",
            text: "We never track or monitor the behaviour of children, direct advertising at them, or use personal data in any way likely to harm a child’s well-being."
          },
          {
            number: "40.4",
            anchor: "#c-children-4",
            text: "If you believe we hold a child’s personal data without a parent’s or guardian’s consent, tell our Grievance Officer, and we will erase it."
          }
        ]
      },
      {
        number: 41,
        name: "guardian",
        title: "Acting for an adult with a disability",
        anchor: "#c-guardian",
        keywords: "lawful guardian disability consent on behalf court appointed",
        subclauses: [
          {
            number: "41.1",
            anchor: "#c-guardian-1",
            text: "If you are the lawful guardian of an adult with a disability, appointed by a court or under the law that applies to them, you may give consent, and exercise their rights under this policy, on their behalf."
          },
          {
            number: "41.2",
            anchor: "#c-guardian-2",
            text: "We will ask for reasonable proof that you are their lawful guardian before we act on your instructions."
          }
        ]
      }
    ]
  },
  {
    number: 9,
    title: "Questions & complaints",
    italicWord: "complaints",
    range: "Clauses 42 to 44",
    startClause: 42,
    endClause: 44,
    barLabel: "Complaints",
    tooltip: "Questions & complaints, clauses 42 to 44",
    description: "Who to talk to, how quickly we respond, and where to go if we cannot resolve it together.",
    anchor: "#p-complaints",
    clauses: [
      {
        number: 42,
        name: "officer",
        title: "Our Grievance Officer",
        anchor: "#c-officer",
        keywords: "grievance officer complaint privacy officer dpo data protection officer contact escalate formal",
        subclauses: [
          {
            number: "42.1",
            anchor: "#c-officer-1",
            text: `Our Grievance Officer handles every question, request and complaint about your personal data: ${PRIVACY_SETTINGS.grievance_name}, ${PRIVACY_SETTINGS.grievance_title}, House of Kaira, ${PRIVACY_SETTINGS.business_address}. Email ${PRIVACY_SETTINGS.grievance_email}. Phone ${PRIVACY_SETTINGS.grievance_phone}.`
          },
          {
            number: "42.2",
            anchor: "#c-officer-2",
            text: `We acknowledge every complaint within ${PRIVACY_SETTINGS.grievance_ack} of receiving it, give you a reference number and a copy of your complaint as we have recorded it, and keep you updated. We resolve complaints within ${PRIVACY_SETTINGS.grievance_resolve} of receiving them, or within any shorter time the law sets for a particular kind of complaint.`
          },
          {
            number: "42.3",
            anchor: "#c-officer-3",
            text: "For a concern about something other than your personal data, such as a piece or an order, our Terms & Conditions explain every option open to you, including the National Consumer Helpline."
          }
        ]
      },
      {
        number: 43,
        name: "board",
        title: "The Data Protection Board of India",
        anchor: "#c-board",
        keywords: "data protection board complaint escalate regulator authority not satisfied",
        subclauses: [
          {
            number: "43.1",
            anchor: "#c-board-1",
            text: "If you are not satisfied with how we have handled your complaint, you may complain to the Data Protection Board of India, which works as a digital office. The law asks you to use our grievance process first, so please give us the chance to put things right."
          },
          {
            number: "43.2",
            anchor: "#c-board-2",
            text: "Nothing in this policy limits your right to complain to the Board, or any other right you have under the law."
          }
        ]
      },
      {
        number: 44,
        name: "law",
        title: "The law that applies",
        anchor: "#c-law",
        keywords: "governing law jurisdiction courts indore madhya pradesh dispute board",
        subclauses: [
          {
            number: "44.1",
            anchor: "#c-law-1",
            text: "This policy is governed by the laws of India."
          },
          {
            number: "44.2",
            anchor: "#c-law-2",
            text: "Matters that the Digital Personal Data Protection Act, 2023 gives the Data Protection Board of India to decide are for the Board. For anything else, and subject to your rights as a consumer, the courts at Indore, Madhya Pradesh, have jurisdiction, as our Terms & Conditions provide."
          }
        ]
      }
    ]
  },
  {
    number: 10,
    title: "Changes & everything else",
    italicWord: "else",
    range: "Clauses 45 to 47",
    startClause: 45,
    endClause: 47,
    barLabel: "General",
    tooltip: "Changes & everything else, clauses 45 to 47",
    description: "How this policy changes, the languages it is available in, and the other services we link to.",
    anchor: "#p-general",
    clauses: [
      {
        number: 45,
        name: "changes",
        title: "When this policy changes",
        anchor: "#c-changes",
        keywords: "update change version notice new purpose consent earlier versions annual reminder",
        subclauses: [
          {
            number: "45.1",
            anchor: "#c-changes-1",
            text: "We may update this policy to reflect changes in the law, in our services or in how we handle personal data. The version and date of the current policy are shown at the top of this page."
          },
          {
            number: "45.2",
            anchor: "#c-changes-2",
            text: "When a change matters to you, we tell you before it takes effect, by email, WhatsApp or a notice on the Platform."
          },
          {
            number: "45.3",
            anchor: "#c-changes-3",
            text: "If a change means using your personal data for a new purpose that needs your consent, we ask for it first. Continuing to use the Platform is never treated as that consent."
          },
          {
            number: "45.4",
            anchor: "#c-changes-4",
            text: `We remind you of this policy, and of any change to it, at least ${PRIVACY_SETTINGS.annual_notice}.`
          },
          {
            number: "45.5",
            anchor: "#c-changes-5",
            text: "We keep every earlier version of this policy, and send you any of them if you ask."
          }
        ]
      },
      {
        number: 46,
        name: "language",
        title: "This policy in your language",
        anchor: "#c-language",
        keywords: "language hindi marathi bengali tamil telugu gujarati translation eighth schedule regional",
        subclauses: [
          {
            number: "46.1",
            anchor: "#c-language-1",
            text: `This policy is written in English. You can ask for it in any of the ${PRIVACY_SETTINGS.schedule_langs} languages in the Eighth Schedule to the Constitution of India, such as Hindi, Marathi or Bengali, by writing to our Grievance Officer or messaging us on WhatsApp, and we will send it to you.`
          },
          {
            number: "46.2",
            anchor: "#c-language-2",
            text: "We take care that every version says the same thing. If a translation ever differs from the English, we will not rely on the difference against you."
          }
        ]
      },
      {
        number: 47,
        name: "elsewhere",
        title: "Other websites and services",
        anchor: "#c-elsewhere",
        keywords: "third party links websites razorpay whatsapp instagram google their privacy policy",
        subclauses: [
          {
            number: "47.1",
            anchor: "#c-elsewhere-1",
            text: `The Platform links to, and shows content from, other websites and services, such as ${PRIVACY_SETTINGS.payment_partner}, WhatsApp, Instagram and Google. They have their own privacy policies, and we are not responsible for how they handle personal data, so please read their policies before you give them your details.`
          }
        ]
      }
    ]
  }
];

// Flat list of all 47 clauses
export const ALL_PRIVACY_CLAUSES = PRIVACY_PARTS.flatMap(part => 
  part.clauses.map(clause => ({
    ...clause,
    partNumber: part.number,
    partName: part.title,
    partAnchor: part.anchor
  }))
);

// Flat list of all register rows (14 items from clauses 7 & 8)
export const ALL_REGISTER_ROWS = ALL_PRIVACY_CLAUSES
  .filter(c => c.isRegisterClause && c.registerRows)
  .flatMap(c => c.registerRows.map(row => ({
    ...row,
    clauseNumber: c.number,
    clauseTitle: c.title,
    clauseAnchor: c.anchor,
    partNumber: c.partNumber,
    partName: c.partName
  })));

export default {
  THE_ESSENTIALS,
  DEFINITIONS,
  PRIVACY_PARTS,
  ALL_PRIVACY_CLAUSES,
  ALL_REGISTER_ROWS
};
