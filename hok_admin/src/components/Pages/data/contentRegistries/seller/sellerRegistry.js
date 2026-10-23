/**
 * House of Kaira - Seller Guidelines Registry
 * Sections 2, 4, 8 of Build Specification 1.0
 *
 * Strict zero-dash copy constraint applied.
 * Dynamic settings referenced from SITE_TOKENS.
 */

import { SITE_TOKENS } from "./sellerSettings.js";

export const SELLER_PROTECTION_CARD = {
  title: "Your piece, protected",
  line: "However you list, these hold for every piece:",
  points: [
    "Every renter pays a refundable deposit before your piece is dispatched.",
    "For high value pieces, we confirm the renter’s identity and address first.",
    "Our specialists clean your piece before and after every rental.",
    "Damage during a rental is ours to put right, and never taken from your share.",
    "Your name and address are never shown to renters or buyers."
  ],
  link_text: "How we protect your piece",
  link_target: "#ch-protect"
};

export const SELLER_CLOSING_BAND = {
  title: "Still deciding, or curious about a particular piece?",
  lead: `Message us on WhatsApp at ${SITE_TOKENS.support_whatsapp}, and our team will talk it through with you, piece by piece.`,
  whatsapp_url: `https://wa.me/${SITE_TOKENS.support_whatsapp_raw}`,
  list_your_piece_url: "/list-your-piece",
  panel_title: "These guidelines and your agreement",
  panel_text:
    "These guidelines explain how listing works, in plain words. Your agreement with us is the Lister Terms in our Terms & Conditions, together with the Listing Terms we confirm for each of your pieces. If anything here ever reads differently, they apply.",
  panel_links: [
    { label: "Lister Terms", href: "/terms#lister-terms" },
    { label: "Pricing & Fees", href: "/terms#pricing-fees" },
    { label: "Care, Cleaning & Damage Policy", href: "/care-policy" },
    { label: "Deposit Policy", href: "/deposit" }
  ]
};

export const TWO_WAYS_FEATURE = {
  marker: "or",
  keep: {
    badge: "Keep it with you",
    title: "Keep it with you.",
    summary: "Your piece stays in your wardrobe until someone books or buys it.",
    rows: [
      { label: "You", desc: "Share clear photographs, a short video and exact measurements, and keep the piece ready to leave." },
      { label: "We", desc: "Write and publish your listing, and arrange collection the moment it is booked or sold." },
      { label: "It travels", desc: "To us first, so we can clean and check it before it goes to anyone." },
      { label: "Suits", desc: "Pieces you may still want to wear yourself." }
    ]
  },
  send: {
    badge: "Send it to us",
    title: "Send it to us.",
    summary: "Your piece comes to us once, and rests in our care, ready to leave.",
    rows: [
      { label: "You", desc: "Hand it to the courier we send. There is nothing else to prepare." },
      { label: "We", desc: "Measure and photograph it, care for it between celebrations, and handle every dispatch and return." },
      { label: "It travels", desc: "Straight to its renter or buyer, cleaned and checked, often on shorter notice." },
      { label: "Suits", desc: "Pieces you would like to earn with no effort on your part." }
    ]
  }
};

export const FIVE_STEPS_FEATURE = [
  {
    step: 1,
    title: "Share your piece",
    desc: "A few photographs and the details you know, through the List Your Piece form or on WhatsApp.",
    linkText: "List Your Piece",
    linkHref: "/list-your-piece"
  },
  {
    step: 2,
    title: "We review it",
    desc: `Our curation team replies on WhatsApp within ${SITE_TOKENS.submission_reply}.`
  },
  {
    step: 3,
    title: "Agree its Listing Terms",
    desc: "Its price, your share and its Replacement Value, confirmed to you in writing."
  },
  {
    step: 4,
    title: "We prepare the listing",
    desc: "Measurements, photographs and condition notes, which you see before anything goes live."
  },
  {
    step: 5,
    title: "It goes live",
    desc: "We send you the link, and you hear from us every time it earns."
  }
];

export const CARE_TRIO_FEATURE = [
  {
    title: "Before it leaves",
    desc: "Cleaned by our specialists, checked against its listing, then photographed and videoed, so we always know exactly how it left."
  },
  {
    title: "While it is away",
    desc: "The renter is responsible for your piece from delivery until it is back with our courier, having agreed to our care rules and paid a refundable deposit."
  },
  {
    title: "When it comes back",
    desc: "Inspected against that record, cleaned again, and any damage put right before its next celebration."
  }
];

export const SELLER_CHAPTERS = [
  {
    id: "ways",
    barLabel: "Two ways to list",
    title: "Two ways to list",
    intro: "Your piece stays yours either way. You simply choose where it waits for its next celebration, and tell us which suits you when we review it.",
    bg: "warm-white",
    feature: "ways",
    questionIds: ["keep-home", "send-us", "which-way", "wear-it"]
  },
  {
    id: "start",
    barLabel: "Getting started",
    title: "Before your piece goes live",
    intro: "From your first photographs to the day your listing goes live, here is what happens, and what we ask of you.",
    bg: "warm-white",
    feature: "steps",
    questionIds: ["who-can", "what-take", "cannot-take", "review-time", "listing-terms", "photos", "prepare", "grade", "disclose"]
  },
  {
    id: "price",
    barLabel: "Pricing & your share",
    title: "Pricing and your share",
    intro: "We price every piece so that it recovers a meaningful part of what you invested in it, while it goes on to be part of more celebrations. House of Kaira keeps only what its work on your piece justifies.",
    bg: "warm-white",
    feature: null,
    questionIds: ["who-prices", "my-share", "lower-price", "offers", "replacement-value", "cost-to-list", "both-modes"]
  },
  {
    id: "care",
    barLabel: "How we care",
    title: "How we look after your piece",
    intro: "Every piece on House of Kaira was part of someone’s most special day. We treat yours as our own, from the moment it reaches us to the moment it comes home.",
    bg: "warm-white",
    feature: "trio",
    questionIds: ["between-rentals", "renters", "normal-wear", "updates"]
  },
  {
    id: "protect",
    barLabel: "Your protection",
    title: "If something happens",
    intro: "Renting always carries some risk that no one can remove entirely, and listing a piece for rent means sharing it with us. We take every care to keep it small, because we know what your piece means to you. If something does go wrong, this is exactly what happens.",
    bg: "cream",
    feature: null,
    questionIds: ["damaged", "lost", "our-care", "insured", "disagree"]
  },
  {
    id: "selling",
    barLabel: "When it sells",
    title: "When your piece is sold",
    intro: "A sale is the start of your piece’s next chapter, with someone new. Here is what happens from the moment it is bought.",
    bg: "warm-white",
    feature: null,
    questionIds: ["sold", "not-as-described", "genuine"]
  },
  {
    id: "control",
    barLabel: "Staying in control",
    title: "Your piece, your decision",
    intro: "Listing a piece never means giving it up. You can pause, change or end its listing whenever you choose.",
    bg: "warm-white",
    feature: null,
    questionIds: ["take-back", "pause", "min-period", "elsewhere", "not-booked", "stop-listing"]
  },
  {
    id: "payouts",
    barLabel: "Payouts & tax",
    title: "Payouts and tax",
    intro: "Your earnings are paid promptly, into your own account, with a clear record of each payout.",
    bg: "warm-white",
    feature: null,
    questionIds: ["when-paid", "where-paid", "pan", "deductions"]
  },
  {
    id: "privacy",
    barLabel: "Privacy",
    title: "Privacy and photographs",
    intro: "Your piece is shown to the world. You are not, unless you choose to be.",
    bg: "warm-white",
    feature: null,
    questionIds: ["my-name", "photo-own", "ai-images"]
  }
];

export const SELLER_QUESTIONS = [
  {
    id: "keep-home",
    chapterId: "ways",
    title: "I would like to keep my piece at home. What do you need from me?",
    tag: null,
    tagTone: null,
    searchWords: ["home", "keep", "wardrobe", "photos", "video", "measurements", "collect", "collection", "ready", "handover", "booked"],
    body: [
      { type: "ul", items: [
          "Clear photographs in good daylight, front, back and close ups of the work, a short video of the piece, and its exact",
          "measurements. Please also tell us honestly about anything that affects its condition. We use all of this to write a listing that",
          "renters and buyers can trust.",
          "When your piece is booked or sold, we tell you on WhatsApp straight away and arrange its collection from your door, at no",
          `cost to you. Please have it ready to leave within ${SITE_TOKENS.handover_within} of our message, complete and exactly as your`,
          "photographs show it. If a collection is missed because nobody was available, the second one carries a delivery charge.",
          "It always comes to us first. We clean and check it before it goes to anyone, so every renter and buyer receives it at our",
          "standard."
        ] }
    ]
  },
  {
    id: "send-us",
    chapterId: "ways",
    title: "What happens if I send my piece to you?",
    tag: null,
    tagTone: null,
    searchWords: ["send", "courier", "collect", "collection", "studio", "photograph", "measure", "store", "care", "ready"],
    body: [
      { type: "ul", items: [
          "Once we have agreed its Listing Terms, we arrange collection from your door, at no cost to you. From then on, everything is",
          "done for you.",
          "We measure your piece, photograph it in our studio in Indore and write its listing. Between celebrations it rests in our care,",
          "and because it is ready to leave, we can offer earlier dates and quicker delivery, which often helps it find its next celebration",
          "sooner."
        ] }
    ]
  },
  {
    id: "which-way",
    chapterId: "ways",
    title: "How do I decide which option suits my piece?",
    tag: null,
    tagTone: null,
    searchWords: ["decide", "choose", "better", "option", "which"],
    body: [
      { type: "ul", items: [
          "If you may want to wear the piece again yourself, keeping it at home gives you the most freedom.",
          "If you would like it to earn with no effort on your part, send it to us. Professional photographs and a piece that is ready to",
          "leave usually help it find its next celebration sooner.",
          "Either way, it remains yours, and you can tell us your preference when we review it."
        ] }
    ]
  },
  {
    id: "wear-it",
    chapterId: "ways",
    title: "Can I still wear my piece myself while it is listed?",
    tag: "Yes",
    tagTone: "yes",
    searchWords: ["wear", "myself", "borrow", "back", "use", "family", "wedding", "block", "dates", "own", "event"],
    body: [
      { type: "ul", items: [
          "Of course. It is still your piece.",
          "If it is with you, tell us the dates you would like to keep it for, as early as you can. We block them on your listing so nobody",
          "can book them. A booking confirmed before you tell us must still be honoured.",
          `If it is with us, give us ${SITE_TOKENS.borrow_notice} notice for dates that are not already booked. We send it to you freshly cleaned`,
          "and clean it again when it returns, at our cost; only the delivery both ways is yours. It goes back on your listing as soon as it is",
          "home with us."
        ] }
    ]
  },
  {
    id: "who-can",
    chapterId: "start",
    title: "Who can list a piece with House of Kaira?",
    tag: null,
    tagTone: null,
    searchWords: ["who", "can", "eligible", "age", "adult", "india", "owner", "permission", "boutique", "designer", "studio", "business"],
    body: [
      { type: "ul", items: [
          `Anyone aged ${SITE_TOKENS.age_min} or over and based in India, who owns the piece or has the owner's permission to list it.`,
          "Boutiques and designers are very welcome too. These guidelines apply to every lister, and our Designer Partners [link:",
          "designer-partners] page explains how we work with studios listing several pieces."
        ] }
    ]
  },
  {
    id: "what-take",
    chapterId: "start",
    title: "What kind of pieces do you take?",
    tag: null,
    tagTone: null,
    searchWords: ["accept", "take", "kind", "pieces", "lehenga", "saree", "anarkali", "gown", "sherwani", "indo", "western", "suit", "bespoke", "designer", "unbranded", "compl", "ete", "dupatta", "blouse"],
    body: [
      { type: "ul", items: [
          "Occasionwear made to be remembered: bridal and reception lehengas, sarees, anarkalis and gowns, sherwanis, indo",
          "western pieces and suit sets, from leading designers or beautifully made bespoke.",
          "We look at the designer, the craftsmanship, the condition and the silhouette, and how much it will be loved today. Each piece",
          "should come complete, with every part of the look it was made with, such as its dupatta, blouse or stole."
        ] }
    ]
  },
  {
    id: "cannot-take",
    chapterId: "start",
    title: "Is there anything you cannot accept?",
    tag: null,
    tagTone: null,
    searchWords: ["cannot", "accept", "reject", "not", "allowed", "replica", "copy", "fake", "inspired", "stolen", "dispute", "damp", "mould", "smoke", "odour", "smell", "wildlif", "e"],
    body: [
      { type: "ul", items: [
          "We cannot list:",
          "copies, replicas, or pieces “inspired by” a designer and presented as the original",
          "pieces that are not yours to list, or that are part of a dispute",
          "pieces with damp, mould, smoke or lasting odours",
          "anything the law does not allow to be sold, such as materials from protected wildlife",
          "damage that cannot be repaired well or described honestly"
        ] }
    ]
  },
  {
    id: "review-time",
    chapterId: "start",
    title: "How long does the review take?",
    tag: `${SITE_TOKENS.submission_reply}`,
    tagTone: "mid",
    searchWords: ["review", "how", "long", "wait", "reply", "response", "approval", "decline", "rejected"],
    body: [
      { type: "ul", items: [
          `Our curation team replies on WhatsApp within ${SITE_TOKENS.submission_reply} of your submission, with our thoughts on your piece`,
          "and a suggested price.",
          "Submitting is free and commits you to nothing. Occasionally a piece is not right for us, and we may not always explain every",
          "reason, but we will always reply."
        ] }
    ]
  },
  {
    id: "listing-terms",
    chapterId: "start",
    title: "What are Listing Terms?",
    tag: null,
    tagTone: null,
    searchWords: ["listing", "terms", "agreement", "contract", "confirm", "writing", "details", "agreed"],
    body: [
      { type: "ul", items: [
          "They are the details we agree for each of your pieces, confirmed to you in writing on WhatsApp or by email:",
          "whether it will be rented, sold, or both",
          "its rental price and its sale price",
          "your share of each rental and sale",
          "its Replacement Value",
          "the lowest offer we can accept, if it is for sale",
          "where it will wait: with you, or with us",
          "anything else particular to your piece",
          "Nothing goes live until you have confirmed them, and they change only with your written agreement."
        ] }
    ]
  },
  {
    id: "photos",
    chapterId: "start",
    title: "Who takes the photographs for my listing?",
    tag: null,
    tagTone: null,
    searchWords: ["photographs", "photos", "pictures", "images", "shoot", "studio", "video", "editorial", "styled", "who", "takes"],
    body: [
      { type: "ul", items: [
          "If you send your piece to us, we photograph it in our studio. If you keep it at home, your own clear photographs and video are",
          "what we use.",
          "Our visual team may also create styled editorial images to show how your piece could be worn. These are always labelled,",
          "and never used to show its condition, colour or fit. You see your listing before it goes live."
        ] }
    ]
  },
  {
    id: "prepare",
    chapterId: "start",
    title: "Do I need to clean or repair my piece before listing it?",
    tag: "Cleaning is on us",
    tagTone: "mid",
    searchWords: ["clean", "dry", "clean", "wash", "prepare", "before", "repair", "fix", "mend", "embroidery", "hook", "lining", "cost", "upfront"],
    body: [
      { type: "ul", items: [
          "There is no need to clean it. Every piece is professionally cleaned by our specialists before it leaves us, at our cost.",
          "If your piece needs a repair to be ready for a renter or buyer, such as loose embroidery, a missing hook or a worn lining, we",
          "tell you what is needed and what it will cost before anything is done. Repairs are carried out once someone is interested in",
          "your piece, and their cost is yours, taken from that piece's payout, so there is nothing to pay upfront."
        ] }
    ]
  },
  {
    id: "grade",
    chapterId: "start",
    title: "How is the condition of my piece graded?",
    tag: null,
    tagTone: null,
    searchWords: ["condition", "grade", "grading", "pristine", "excellent", "good", "fair", "wear", "quality"],
    body: [
      { type: "ul", items: [
          "We grade every piece on House of Kaira in the same way, from what you tell us and our own inspection:",
          "Pristine: unworn, or worn once for a short photoshoot, with no visible wear",
          "Excellent: worn once for a full day, with no visible damage, alteration or significant bead loss",
          "Good: worn two or three times, with any minor imperfection photographed and disclosed",
          "Fair: still in lovely condition, with visible signs of wear that are photographed and described. Fair pieces are offered for",
          "rent only.",
          "You see your piece's grade before it goes live. Rental pieces are graded again after every return, and we tell you if the grade",
          "changes."
        ] }
    ]
  },
  {
    id: "disclose",
    chapterId: "start",
    title: "What do I need to tell you about my piece?",
    tag: null,
    tagTone: null,
    searchWords: ["tell", "disclose", "honest", "disclosure", "wears", "alteration", "repair", "flaw", "perfume", "smoke", "damp", "bill", "invoice", "receipt", "certificat", "e", "care", "label", "original", "price"],
    body: [
      { type: "ul", items: [
          "Everything a renter or buyer would want to know, honestly:",
          "how many times it has been worn",
          "any alteration or repair, what was changed and, if you know, by whom",
          "any flaw, however small",
          "anything else that affects it, such as perfume, smoke or damp",
          "Please send photographs exactly as the piece is, without filters or edits. If you have the original bill, care labels or a designer",
          "certificate, share them too. They help us stand behind your piece, and the original price may be shown on your listing.",
          "Honest disclosure protects you as well as the buyer. If a sale is reversed because something was not disclosed, no payout is",
          "due for it, as When your piece is sold [link: #q-not-as-described] explains."
        ] }
    ]
  },
  {
    id: "who-prices",
    chapterId: "price",
    title: "Who decides the price of my piece?",
    tag: null,
    tagTone: null,
    searchWords: ["price", "pricing", "who", "decides", "set", "suggest", "value", "rental", "price", "sale", "price", "window", "deposit"],
    body: [
      { type: "ul", items: [
          "We suggest a price, and agree it with you before anything goes live. We look at the designer, the original price, the condition",
          "and silhouette, and what similar pieces rent and sell for.",
          "Each rental piece also has its own rental windows and refundable deposit, which we set to protect it."
        ] }
    ]
  },
  {
    id: "my-share",
    chapterId: "price",
    title: "How much of each rental or sale do I keep?",
    tag: null,
    tagTone: null,
    searchWords: ["share", "commission", "cut", "percentage", "split", "earn", "earnings", "keep", "how", "much", "fee", "promo", "code", "gst", "deposit", "delivery"],
    body: [
      { type: "ul", items: [
          "Your share is decided for each piece, by its silhouette, value and condition and the work it needs from us, and confirmed in its",
          "Listing Terms. Pricing & Fees [link: pricing-fees] shows typical shares as a guide.",
          "It is calculated on the rental fee of each booking, and on the final price of a sale, including an offer we have accepted. GST,",
          "deposits and delivery charges are never part of it. When we run a promo code, we fund it ourselves, so it never reduces your",
          "share."
        ] }
    ]
  },
  {
    id: "lower-price",
    chapterId: "price",
    title: "Will you ever lower the price of my piece?",
    tag: "Never without you",
    tagTone: "yes",
    searchWords: ["lower", "reduce", "discount", "markdown", "sale", "price", "drop", "change", "price", "fixed", "period"],
    body: [
      { type: "ul", items: [
          "Never on our own. Your price changes only when you agree to it. If we think a different price would help your piece find its",
          "next celebration, we will suggest it, and the decision is always yours.",
          "There is no fixed listing period and no automatic markdown. Your piece stays yours, on your terms."
        ] }
    ]
  },
  {
    id: "offers",
    chapterId: "price",
    title: "Can buyers make an offer on my piece?",
    tag: "Preloved only",
    tagTone: "mid",
    searchWords: ["offer", "offers", "negotiate", "bargain", "lowest", "minimum", "accept", "make", "an", "offer"],
    body: [
      { type: "ul", items: [
          "Yes, if your piece is for sale. Offers are never taken on rentals.",
          "We agree with you the lowest offer we can accept, and only ever accept offers at or above it. Your share is then calculated on",
          "the price the buyer pays."
        ] }
    ]
  },
  {
    id: "replacement-value",
    chapterId: "price",
    title: "What is my piece's Replacement Value?",
    tag: null,
    tagTone: null,
    searchWords: ["replacement", "value", "worth", "lost", "stolen", "total", "loss", "agreed", "value"],
    body: [
      { type: "ul", items: [
          "It is the value we agree with you for your piece as it is today, from its designer, its original price and its condition. It is never",
          "the price of a new piece.",
          "Every renter sees it before they book, and it is what a renter owes if your piece is lost, stolen, not returned or damaged",
          "beyond repair."
        ] }
    ]
  },
  {
    id: "cost-to-list",
    chapterId: "price",
    title: "Does it cost anything to list a piece?",
    tag: "Nothing upfront",
    tagTone: "yes",
    searchWords: ["cost", "fee", "charge", "pay", "listing", "free", "upfront", "hidden", "expense", "return", "delivery"],
    body: [
      { type: "ul", items: [
          "Nothing upfront. Listing is free, collection, photography and cleaning are on us, and you never pay for a delivery to a renter or",
          "buyer.",
          "Only these costs are ever yours, and you always know them in advance:",
          "a repair your piece needs to be ready to rent or sell, agreed with you first and taken from its payout",
          "a second collection, if the first is missed because nobody was available",
          `the return delivery, if you take your piece back within ${SITE_TOKENS.free_return_after} of it going live`,
          "delivery both ways when you borrow your piece back to wear"
        ] }
    ]
  },
  {
    id: "both-modes",
    chapterId: "price",
    title: "Can my piece be rented and sold at the same time?",
    tag: "Yes",
    tagTone: "yes",
    searchWords: ["rent", "and", "sell", "both", "dual", "same", "time", "rental", "sale"],
    body: [
      { type: "ul", items: [
          "Yes. Many pieces are listed for both, so they earn from rentals while waiting for the right buyer.",
          "If someone wants to buy your piece while rentals are already booked, we honour those rentals first. The sale goes ahead",
          "once the last of them has ended and your piece has been cleaned and checked, unless we agree a different arrangement",
          "with you. Once a sale is agreed, your piece stops taking new rentals."
        ] }
    ]
  },
  {
    id: "between-rentals",
    chapterId: "care",
    title: "How is my piece looked after between rentals?",
    tag: null,
    tagTone: null,
    searchWords: ["care", "cleaning", "clean", "dry", "clean", "between", "rentals", "inspect", "inspection", "photographed", "video", "record", "storage", "time"],
    body: [
      { type: "ul", items: [
          "Our specialists professionally clean your piece before and after every rental, and our team inspects it every time it comes",
          "back. It is photographed and videoed before it leaves us, so we always know exactly how it left and how it returned.",
          "We allow time between bookings for cleaning and care, so your piece is never rushed from one celebration to the next."
        ] }
    ]
  },
  {
    id: "renters",
    chapterId: "care",
    title: "Who rents my piece, and what have they agreed to?",
    tag: null,
    tagTone: null,
    searchWords: ["renter", "who", "rents", "checks", "verification", "identity", "id", "address", "deposit", "agree", "rules", "responsible"],
    body: [
      { type: "ul", items: [
          "Every renter accepts our Terms & Conditions [link: terms] and our care rules before booking, and pays a refundable deposit",
          "before your piece is dispatched. For high value pieces, we also confirm the renter's identity and address.",
          "Each renter sees your piece's Replacement Value before booking, and is responsible for the piece from the moment it is",
          "delivered until it is handed back to our courier."
        ] }
    ]
  },
  {
    id: "normal-wear",
    chapterId: "care",
    title: "What counts as normal wear?",
    tag: null,
    tagTone: null,
    searchWords: ["normal", "wear", "tear", "crease", "thread", "sequin", "small", "signs", "touch", "up", "karigar", "damage", "test"],
    body: [
      { type: "ul", items: [
          "When a piece is worn and enjoyed, a few small signs are natural: light creasing, a loose thread, a sequin or two. If our",
          "cleaning and small touch ups put it right, it is normal wear. We take care of it as part of looking after your piece, and nobody",
          "is charged for it.",
          "Anything that needs specialist stain treatment, a karigar's repair or new materials is damage, and is handled as If something",
          "happens [link: #ch-protect] explains. Our Care, Cleaning & Damage Policy [link: care-policy] sets out the same test for renters.",
          "Over many celebrations, a piece naturally shows more of its life, which is why we grade rental pieces again after every return."
        ] }
    ]
  },
  {
    id: "updates",
    chapterId: "care",
    title: "How will I know how my piece is doing?",
    tag: null,
    tagTone: null,
    searchWords: ["updates", "know", "how", "doing", "whatsapp", "notification", "account", "dashboard", "earnings", "bookings"],
    body: [
      { type: "ul", items: [
          "We keep you updated on WhatsApp at every step: when your piece is booked, when it comes back, how it was found, and",
          "when your payout is sent.",
          "In My Account [link: account], you can see each of your pieces, its bookings and what it has earned."
        ] }
    ]
  },
  {
    id: "damaged",
    chapterId: "protect",
    title: "What happens if a renter damages my piece?",
    tag: "Never from your share",
    tagTone: "yes",
    searchWords: ["damage", "damaged", "stain", "tear", "burn", "broken", "ruined", "renter", "repair", "specialist", "deposit"],
    body: [
      { type: "ul", items: [
          "We assess it with photographs against the record we made before it left, and have it put right by our specialists. The cost is",
          "recovered from the renter's deposit, and it is never taken from your share.",
          "We tell you what happened and show you the piece before and after. If it cannot be repaired, it is treated as a loss, as the",
          "next answer explains."
        ] }
    ]
  },
  {
    id: "lost",
    chapterId: "protect",
    title: "What happens if my piece is lost, stolen or not returned?",
    tag: null,
    tagTone: null,
    searchWords: ["lost", "stolen", "theft", "missing", "not", "returned", "kept", "total", "loss", "replacement", "value", "shortfall", "share", "recover"],
    body: [
      { type: "ul", items: [
          "We hope you never need this answer, because we take every step to prevent it. If it does happen, the renter owes your",
          "piece's Replacement Value. We keep their deposit towards it, and pursue the rest in full, through every route the law allows.",
          "Everything we recover goes towards making it right for you. If anything still cannot be recovered, House of Kaira and you",
          "share that shortfall, in the way your Listing Terms set out. Every piece is one of a kind and of high value, so this rare risk is",
          "shared between us rather than carried by either of us alone."
        ] }
    ]
  },
  {
    id: "our-care",
    chapterId: "protect",
    title: "What if something happens while my piece is in your care?",
    tag: null,
    tagTone: null,
    searchWords: ["our", "care", "your", "care", "warehouse", "storage", "cleaner", "specialist", "courier", "transit", "hok", "fault", "lost", "damaged", "with", "you"],
    body: [
      { type: "ul", items: [
          "We look after every piece as if it were our own, because we know what it means to you. Our specialists clean it, our team",
          "handles it, and we send it only with couriers we trust.",
          "If something does go wrong while your piece is with us, our cleaning specialists or our couriers, we tell you straight away and",
          "do everything we reasonably can to put it right with you, fairly and in good faith."
        ] }
    ]
  },
  {
    id: "insured",
    chapterId: "protect",
    title: "Is my piece insured while it is listed?",
    tag: "No",
    tagTone: "no",
    searchWords: ["insurance", "insured", "cover", "covered", "policy"],
    body: [
      { type: "ul", items: [
          "No. House of Kaira does not insure listed pieces. Your piece is protected instead by every renter's deposit, our checks before",
          "high value rentals, the Replacement Value each renter sees before booking, and the renter's legal responsibility for the piece",
          "while it is with them.",
          "If you would like extra peace of mind, you may wish to check whether your own insurance covers it."
        ] }
    ]
  },
  {
    id: "disagree",
    chapterId: "protect",
    title: "What if I disagree with how my piece was assessed?",
    tag: null,
    tagTone: null,
    searchWords: ["disagree", "dispute", "assessment", "grade", "review", "unhappy", "complaint", "escalate", "senior"],
    body: [
      { type: "ul", items: [
          "Tell us. We share our photographs and records with you, and a senior member of our team who was not part of the original",
          "assessment looks at it again."
        ] }
    ]
  },
  {
    id: "sold",
    chapterId: "selling",
    title: "What happens when someone buys my piece?",
    tag: null,
    tagTone: null,
    searchWords: ["sold", "sale", "buy", "bought", "buyer", "dispatch", "collect", "ownership"],
    body: [
      { type: "ul", items: [
          "We tell you on WhatsApp straight away. If your piece is at home, we arrange its collection. Every piece comes to us before it",
          "goes to its buyer, so we can clean and check it, and then we dispatch it.",
          `The piece becomes the buyer's once it is delivered to them, and your payout follows within ${SITE_TOKENS.payout_cycle} of their`,
          "receiving it."
        ] }
    ]
  },
  {
    id: "not-as-described",
    chapterId: "selling",
    title: "What if the buyer says the piece is not as described?",
    tag: null,
    tagTone: null,
    searchWords: ["not", "as", "described", "return", "claim", "buyer", "complaint", "reversed", "refund", "flaw", "hidden"],
    body: [
      { type: "ul", items: [
          `Buyers tell us within ${SITE_TOKENS.issue_window} of delivery if something is wrong, and within ${SITE_TOKENS.latent_window} for a flaw that could`,
          "not have been seen on arrival. We look at every claim carefully against your listing and our records.",
          "If a claim is accepted because something was not disclosed, the sale is reversed and no payout is due for it. If you have",
          "already been paid, the amount is recovered from you or from your next payouts. If the issue arose while the piece was in our",
          "care, it is ours to resolve, never yours."
        ] }
    ]
  },
  {
    id: "genuine",
    chapterId: "selling",
    title: "How do you check that a piece is genuine?",
    tag: null,
    tagTone: null,
    searchWords: ["genuine", "authentic", "authenticity", "fake", "replica", "real", "original", "check", "verify", "certificate"],
    body: [
      { type: "ul", items: [
          "Our team examines every piece before it goes live: its craftsmanship, construction, materials and labels, along with any bill,",
          "care labels or certificate you share. We stand behind every designer piece on House of Kaira, so we only list a piece once we",
          "are confident it is genuine.",
          "If a piece is ever found not to be genuine, we remove it, return it to you at your cost, and hold its payouts to cover anything",
          "we must refund to customers."
        ] }
    ]
  },
  {
    id: "take-back",
    chapterId: "control",
    title: "Can I take my piece back?",
    tag: "Any time",
    tagTone: "yes",
    searchWords: ["take", "back", "withdraw", "remove", "unlist", "return", "home", "end", "stop", "notice"],
    body: [
      { type: "ul", items: [
          "Yes, whenever you like. Bookings and sales already confirmed are honoured first.",
          `If it is with us, give us ${SITE_TOKENS.withdraw_notice} notice and we will send it home to you, cleaned. Once it has been live for`,
          `${SITE_TOKENS.free_return_after}, its return delivery is on us. Before that, the return delivery is yours.`,
          "If it is with you, simply tell us and we take it off House of Kaira."
        ] }
    ]
  },
  {
    id: "pause",
    chapterId: "control",
    title: "Can I pause my listing for a while?",
    tag: "Yes",
    tagTone: "yes",
    searchWords: ["pause", "hide", "break", "hold", "temporarily", "unavailable"],
    body: [
      { type: "ul", items: [
          "Yes. Tell us, and we hide your piece from new bookings and buyers until you are ready. Anything already confirmed is still",
          "honoured.",
          "We may also pause a listing ourselves for a short time, for example while a piece is being cleaned or repaired."
        ] }
    ]
  },
  {
    id: "min-period",
    chapterId: "control",
    title: "Is there a minimum period my piece must stay listed?",
    tag: "None",
    tagTone: "yes",
    searchWords: ["minimum", "period", "how", "long", "lock", "in", "commitment", "duration", "months"],
    body: [
      { type: "ul", items: [
          "No. There is no fixed listing period. The only thing that changes with time is the return delivery, which is on us once your",
          `piece has been live for ${SITE_TOKENS.free_return_after}.`
        ] }
    ]
  },
  {
    id: "elsewhere",
    chapterId: "control",
    title: "Can I list my piece elsewhere at the same time?",
    tag: "No",
    tagTone: "no",
    searchWords: ["elsewhere", "other", "platform", "instagram", "sell", "somewhere", "else", "outside", "direct", "deal", "exclusive"],
    body: [
      { type: "ul", items: [
          "While your piece is listed with us, please do not rent or sell it anywhere else, so that every booking we confirm can be",
          "honoured. If you would like to, take it off House of Kaira first.",
          "Please also never arrange a rental or sale directly with someone you have met through House of Kaira. Keeping every",
          "arrangement with us is what protects you, your piece and every customer."
        ] }
    ]
  },
  {
    id: "not-booked",
    chapterId: "control",
    title: "What if my piece is not being booked?",
    tag: null,
    tagTone: null,
    searchWords: ["not", "booked", "no", "bookings", "not", "selling", "slow", "season", "waiting", "interest"],
    body: [
      { type: "ul", items: [
          "Some pieces wait for exactly the right moment, especially outside the wedding season. We look at its photographs, its price",
          "and the season, and suggest what might help. Nothing changes unless you agree, and you can always take your piece back."
        ] }
    ]
  },
  {
    id: "stop-listing",
    chapterId: "control",
    title: "What if you can no longer list my piece?",
    tag: null,
    tagTone: null,
    searchWords: ["no", "longer", "list", "standard", "retire", "worn", "out", "removed", "return"],
    body: [
      { type: "ul", items: [
          "After many celebrations, a piece may no longer meet our standard. If that happens, we tell you why and return it to you."
        ] }
    ]
  },
  {
    id: "when-paid",
    chapterId: "payouts",
    title: "When will I be paid?",
    tag: `${SITE_TOKENS.payout_cycle}`,
    tagTone: "mid",
    searchWords: ["when", "paid", "payout", "payment", "money", "earnings", "timeline", "days", "statement"],
    body: [
      { type: "ul", items: [
          `Within ${SITE_TOKENS.payout_cycle}. For a rental, that is once it has ended and your piece is back with us and inspected. For a sale, it is`,
          "once the buyer has received the piece.",
          "Every payout comes with a statement showing the price, your share and anything deducted from it."
        ] }
    ]
  },
  {
    id: "where-paid",
    chapterId: "payouts",
    title: "Where is my payout sent?",
    tag: "Your own account",
    tagTone: "mid",
    searchWords: ["where", "bank", "account", "upi", "transfer", "name", "own"],
    body: [
      { type: "ul", items: [
          "Into a bank account or UPI ID in your own name. To keep your earnings safe, we cannot pay into anyone else's account."
        ] }
    ]
  },
  {
    id: "pan",
    chapterId: "payouts",
    title: "Why do you ask for my PAN?",
    tag: null,
    tagTone: null,
    searchWords: ["pan", "tax", "tds", "income", "tax", "certificate", "aadhaar", "deduct", "deduction", "return", "itr"],
    body: [
      { type: "ul", items: [
          "We ask for your PAN before your piece goes live, together with your payout details, because the law can require us to deduct",
          "tax from some payouts. When it does, we deduct it and send you the certificate, so you can claim it in your income tax return.",
          "You are responsible for any tax on your earnings. We never ask for your full Aadhaar number."
        ] }
    ]
  },
  {
    id: "deductions",
    chapterId: "payouts",
    title: "Can anything be deducted from my payout?",
    tag: null,
    tagTone: null,
    searchWords: ["deduct", "deduction", "taken", "from", "payout", "less", "reduce", "owe"],
    body: [
      { type: "ul", items: [
          "Only what you have agreed to, or what the law requires:",
          "the cost of a repair your piece needed to be ready to rent or sell",
          "a second collection, if the first was missed because nobody was available",
          `the return delivery, if you take your piece back within ${SITE_TOKENS.free_return_after} of it going live`,
          "delivery both ways when you borrow your piece back to wear",
          "tax the law requires us to deduct",
          "an amount you owe under our Lister Terms [link: lister-terms], such as for a sale reversed because something was not",
          "disclosed",
          "A renter's damage is never taken from your payout."
        ] }
    ]
  },
  {
    id: "my-name",
    chapterId: "privacy",
    title: "Will renters and buyers see my name or address?",
    tag: "Never",
    tagTone: "yes",
    searchWords: ["name", "address", "phone", "number", "private", "privacy", "renter", "buyer", "contact", "see"],
    body: [
      { type: "ul", items: [
          "No. Every rental and sale is made with House of Kaira, in our name, so renters and buyers never see your name, number or",
          "address, and you never need to deal with them. We keep their details private in the same way."
        ] }
    ]
  },
  {
    id: "photo-own",
    chapterId: "privacy",
    title: "Who owns the photographs of my piece?",
    tag: null,
    tagTone: null,
    searchWords: ["photographs", "photos", "own", "ownership", "copyright", "archive", "story", "face", "marketing", "use"],
    body: [
      { type: "ul", items: [
          "Photographs we take of your piece belong to House of Kaira, and we may keep them in our archive of past pieces after it is",
          "sold or comes home.",
          "Photographs, video and the story of your piece that you share with us stay yours, and you allow us to use them in its listing",
          "and in our marketing. We never show your face or use your name without your permission."
        ] }
    ]
  },
  {
    id: "ai-images",
    chapterId: "privacy",
    title: "Will you create styled or AI images of my piece?",
    tag: null,
    tagTone: null,
    searchWords: ["ai", "artificial", "intelligence", "styled", "editorial", "images", "rendered", "generated", "digital"],
    body: [
      { type: "ul", items: [
          "We may create styled editorial images, including with digital tools such as artificial intelligence, to show how your piece could",
          "be worn. Every such image is labelled, sits alongside real photographs of your actual piece, and is never used to show its",
          "condition, colour or fit."
        ] }
    ]
  }
];

export function getChapterById(id) {
  return SELLER_CHAPTERS.find((ch) => ch.id === id);
}

export function getQuestionById(id) {
  return SELLER_QUESTIONS.find((q) => q.id === id);
}

export function getQuestionsByChapterId(chapterId) {
  return SELLER_QUESTIONS.filter((q) => q.chapterId === chapterId);
}

export default SELLER_QUESTIONS;
