/**
 * House of Kaira - Care, Cleaning & Damage Policy Data Registry
 * Sections 5, 6, 7 of Build Specification 2.0
 *
 * Strict zero-dash copy constraint applied.
 * Dynamic settings referenced from CARE_SETTINGS.
 */

import { CARE_SETTINGS } from "./careSettings.js";

export const CARE_POPULAR_LINKS = [
  { label: "How do you decide which it is?", targetId: "l-test" },
  { label: "Can I use safety pins or fashion tape?", targetId: "w-pins" },
  { label: "Can I steam or iron out a crease?", targetId: "a-crease" },
  { label: "I spilled something on it", targetId: "h-spill" }
];

export const FIRST_AID_STEPS = [
  {
    num: 1,
    title: "Blot, never rub",
    line: "Press a clean tissue gently onto a spill to lift what you can. Water, rubbing and home remedies can set a mark for good.",
    opens: "h-spill"
  },
  {
    num: 2,
    title: "Send us a photo",
    line: "Message us on WhatsApp straight away, even late at night. Telling us early never counts against you.",
    opens: "h-tell"
  },
  {
    num: 3,
    title: "Leave the rest to us",
    line: "Please do not fix, stitch or clean it yourself. A safety pin through the lining can hold a loose hook until we take over.",
    opens: "h-tear"
  }
];

export const SECTION_BAR_LINKS = [
  { id: "faCard", label: "If something happens" },
  { id: "mod-moments", label: "Moment by moment" },
  { id: "mod-line", label: "Wear or damage" },
  { id: "mod-pieces", label: "Piece by piece" },
  { id: "mod-ours", label: "Our care" },
  { id: "mod-owned", label: "Pieces you own" }
];

export const MOMENT_TABS = [
  {
    id: "arrives",
    num: 1,
    title: "When it arrives",
    heading: "When your piece arrives",
    subheading: `It reaches you cleaned, pressed and ready to wear, ${CARE_SETTINGS.arrive_before} before your event.`,
    notes: [
      `Open it within ${CARE_SETTINGS.issue_window} of delivery, in good light, and look it over before you wear it.`,
      "Noticed a mark? Send us a photo before you wear it, and we note it on your booking, so it is never counted against you.",
      `Try it on the same day. If the fit is not right, message us within ${CARE_SETTINGS.issue_window} and we will arrange a swap.`,
      "Hang it on its padded hanger, inside its garment bag, somewhere cool, dry and out of direct sunlight.",
      "Keep the tissue and garment bag for the journey back."
    ],
    questionIds: ["a-check", "a-listed", "a-fit", "a-store", "a-crease", "a-fresh"]
  },
  {
    id: "ready",
    num: 2,
    title: "Getting ready",
    heading: "Getting ready",
    subheading: "A few small habits keep your piece as beautiful at the end of the night as at the start.",
    notes: [
      "Apply perfume, makeup and hairspray first, and let them dry before you dress.",
      "Never spray perfume directly onto the fabric.",
      "Put your jewellery on after you dress, and lift it clear of net and embroidery, where clasps catch.",
      "Fashion tape and safety pins are welcome. Pin gently through the lining or a plain area, never through embroidery.",
      "Please do not alter, stitch or hem it in any way."
    ],
    questionIds: ["w-makeup", "w-jewel", "w-pins", "w-alter", "w-mehendi"]
  },
  {
    id: "celebration",
    num: 3,
    title: "At the celebration",
    heading: "At the celebration",
    subheading: "Wear it, dance in it, enjoy every moment. Just keep an eye on the few things that leave a lasting mark.",
    notes: [
      "Keep red wine, coffee and rich gravies at a careful distance.",
      "At a haldi, mehendi or colour ceremony, keep your dupatta gathered close: turmeric, henna and sindoor set fast into silk.",
      "During the pheras, and near diyas, candles or sparklers, gather your dupatta and pallu close.",
      "Outdoors, lift your hem on grass, sand and steps, and keep the piece dry if it rains.",
      "If anything happens, blot gently, send us a photo, and enjoy the rest of your evening."
    ],
    questionIds: ["w-food", "w-colour", "w-fire", "w-outdoor", "w-twice", "h-spill", "h-tear", "h-tell", "h-night", "h-guest", "h-keep"]
  },
  {
    id: "after",
    num: 4,
    title: "After the celebration",
    heading: "After the celebration",
    subheading: "The cleaning is ours. All your piece needs now is a little air and a gentle fold.",
    notes: [
      "Take your jewellery off first, then open every hook and zip fully before you step out of it.",
      "Hang it overnight to air, away from sunlight and damp.",
      "Please do not wash, dry clean, spot clean, steam or iron it. All cleaning is ours, and included in your rental fee.",
      "If anything happened during the evening, tell us now with a photo, if you have not already."
    ],
    questionIds: ["af-air", "r-clean"]
  },
  {
    id: "sending",
    num: 5,
    title: "Sending it back",
    heading: "Sending it back",
    subheading: "Two easy ways, both with the prepaid label in your packaging.",
    notes: [
      "Pack it as it arrived, folded loosely in its tissue and garment bag.",
      "Fold along the plainer panels, never across heavy embroidery.",
      "Check that every part listed with your piece is there, such as the dupatta, blouse, belt, can-can or potli.",
      "Drop it at the courier's nearest office, or book a pickup from your door, by your Return Date.",
      "Keep the courier's receipt until your deposit is back with you."
    ],
    questionIds: ["r-how", "r-pack", "r-parts", "x-part", "r-label", "r-resp"]
  }
];

export const WEAR_VS_DAMAGE_DATA = {
  heading: "Normal wear, or damage?",
  lead: "Every piece comes home to us with a little of its evening on it, and that is exactly as it should be. One simple test decides the rest.",
  testSentence1: "If our regular cleaning and small touch-ups after every rental put it right, it is normal wear, and it is never charged.",
  testSentence2: "If it needs specialist stain treatment, a karigar's repair or new materials, or cannot be put right at all, it is damage.",
  alwaysOnUs: {
    title: "Always on us",
    definition: "The gentle signs of a piece being worn and enjoyed: a few loose threads, a little embellishment loss, light creasing.",
    items: [
      "Light makeup, perfume or deodorant marks that lift in our cleaning",
      "A hook, button or a few sequins that come loose",
      "Creases from wearing, sitting and travel",
      "The scent of the evening, from perfume, food or incense"
    ]
  },
  assessedWithCare: {
    title: "Assessed with care",
    definition: "Anything beyond normal wear, such as stains, tears, burns, significant bead or embroidery loss, or any alteration to the piece.",
    items: [
      "Stains that need specialist treatment, most often mehendi, haldi, sindoor, wine or oil",
      "Tears, burns and pulled threads that need a karigar's repair, including damage from a pin",
      "A patch of missing embroidery, zari or sequins",
      "Any stitching, hemming, cutting or taking in",
      "Harm from washing, steaming or ironing at home"
    ]
  },
  perspiration: "One thing is always on us: natural perspiration, even when it needs more than our regular cleaning. A celebration is warm, joyful and full of dancing, and that is exactly how it should be.",
  preDispatchLine: "We decide against the photographs and video we take of every piece just before dispatch, so only what is new is ever considered.",
  questionIds: ["l-wear", "l-damage", "l-test", "l-sweat", "l-marks", "l-small", "l-stains"]
};

export const PIECE_BY_PIECE_DATA = [
  {
    id: "lehenga",
    chip: "Lehengas",
    title: "Caring for a lehenga",
    targetId: "pc-lehenga",
    points: [
      "Hang the skirt by its inner loops, so its weight rests evenly and the waistband keeps its shape.",
      "Gather the skirt before you sit, and lift the hem on stairs, where heels catch the hem and can-can.",
      "Pin your dupatta through its plain edge or the blouse lining, never through the embroidered border.",
      "When you pack it, fold along the plainer panels, and send back the can-can and every layer with it."
    ]
  },
  {
    id: "saree",
    chip: "Sarees",
    title: "Caring for a saree",
    targetId: "pc-saree",
    points: [
      "A pre-draped or pre-stitched saree is set for you: wear it as it is, without re-pleating or re-stitching.",
      "Pin pleats and pallu through the plain fall or the lining, never through zari or embroidery.",
      "Keep the hem just off the floor, and lift it on stairs, where heels and jewellery snag a delicate border.",
      "Fold it loosely along its original lines, with tissue between the folds."
    ]
  },
  {
    id: "sets",
    chip: "Anarkalis & sets",
    title: "Caring for an anarkali, sharara or kurta set",
    targetId: "pc-sets",
    points: [
      "Slip an anarkali over your head with a light scarf over your face, so makeup stays off the neckline.",
      "Lift sharara and gharara flares on stairs and steps, and keep them clear of wet ground.",
      "Keep the dupatta, belt and every layer together, so each part comes back with the set."
    ]
  },
  {
    id: "gowns",
    chip: "Gowns & Indo-western",
    title: "Caring for a gown or Indo-western piece",
    targetId: "pc-gowns",
    points: [
      "Gather a train or long hem when you walk outdoors, and let it rest on a clean surface when you sit.",
      "Corsets, drapes and capes are shaped to fit as they are: please do not adjust their boning, seams or drapes.",
      "Hang it by its inner loops on its padded hanger, so the shoulders and bodice keep their shape."
    ]
  },
  {
    id: "men",
    chip: "Sherwanis & bandhgalas",
    title: "Caring for a sherwani or bandhgala",
    targetId: "pc-men",
    points: [
      "Button and unbutton slowly, especially on embroidered fronts, where the threads take the most strain.",
      "Let deodorant dry fully before you dress, as a close-fitting jacket meets it at every seam.",
      "Return everything listed with your outfit, such as a safa or stole.",
      "Hang it on its shaped hanger with the shoulders supported, and keep the buttons fastened."
    ]
  }
];

export const OUR_CARE_DATA = {
  beforeAfter: {
    heading: "Before you, and after you",
    notes: [
      "Professionally cleaned before and after every rental, by our partner specialists in couture care.",
      "Checked by hand and pressed before it leaves us.",
      "Photographed and filmed just before dispatch, so its condition is always on record.",
      "Packed in tissue, on its padded hanger, inside its garment bag.",
      "All of this is included in your rental fee, and never charged to you."
    ],
    questionIds: ["o-clean", "o-cost", "o-record", "o-repair"]
  },
  restoring: {
    heading: "If a piece needs restoring",
    steps: [
      {
        num: 1,
        title: "Inspected with care",
        line: `Within ${CARE_SETTINGS.inspect_within} of reaching us, against our photographs and video from before dispatch.`
      },
      {
        num: 2,
        title: "Shared with you",
        line: `Within ${CARE_SETTINGS.deduction_notice_within}: photographs, the amount and how it was worked out. Nothing is deducted before you see it.`
      },
      {
        num: 3,
        title: "Your reply",
        line: `You have ${CARE_SETTINGS.deduction_reply_within} to share anything you would like us to consider.`
      },
      {
        num: 4,
        title: "The rest returned",
        line: `Everything not in question comes back within ${CARE_SETTINGS.deposit_refund_window} of inspection.`
      }
    ],
    closingNote: "We only ever charge what restoring a piece truly costs, never a penalty. Every amount and timing is explained in our Deposit Policy.",
    questionIds: ["x-amount", "x-notice", "x-reply", "x-long"]
  }
};

export const PIECES_YOU_OWN_DATA = {
  heading: "A piece that is yours to keep",
  lead1: "A preloved piece is yours for every celebration to come. Every one is professionally cleaned before it leaves us, and arrives checked and pressed. A piece that has never been worn is checked and pressed instead of cleaned, so it stays exactly as new.",
  lead2: "Because each piece is made differently, its own care notes are on its page, written for its fabric and craftsmanship, and you can open it any time from your order in My Account. A few things hold true for every one of them.",
  notes: [
    "Store it in breathable cotton or muslin, never plastic, somewhere cool, dry and dark.",
    "Refold it along different lines every few months, so zari and embroidery never rest on one fold for long.",
    "Keep perfume, deodorant and hairspray off the fabric.",
    "Air it now and then, especially through the monsoon, and keep naphthalene or neem wrapped so it never touches the fabric.",
    "Clean it only when it needs it, with a dry cleaner who specialises in hand-embroidered pieces.",
    "Never pull a loose thread or bead. A karigar can secure it in minutes."
  ],
  questionIds: ["p-cleaned", "p-clean", "p-repair", "p-flaw", "p-next", "p-lister"]
};

export const RELATED_POLICIES_DATA = [
  { title: "Deposit Policy", href: "/deposit", desc: "Security deposit calculations, holding limits and return timelines." },
  { title: "Refund & Cancellation Policy", href: "/refunds", desc: "Cancellation windows, fit swaps and store credit rules." },
  { title: "Terms & Conditions", href: "/terms", desc: "Our platform agreement, rental rules and general site terms." },
  { title: "Privacy Policy", href: "/privacy", desc: "How we protect and manage your personal information." },
  { title: "Help & FAQs", href: "/faqs", desc: "Quick answers to common questions about booking and sizing." }
];

export const CLOSING_BAND_CHANNELS = [
  {
    type: "whatsapp",
    title: "WhatsApp",
    desc: `The quickest way to reach us, and the easiest way to send a photo. Seven days a week, ${CARE_SETTINGS.support_hours}, with replies usually within ${CARE_SETTINGS.support_sla}.`,
    actionText: "Start a chat",
    actionHref: `https://wa.me/${CARE_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent("Hello House of Kaira, I have a question about caring for my piece.")}`
  },
  {
    type: "email",
    title: "Email",
    desc: `${CARE_SETTINGS.support_email}. Ideal for sharing several photographs at once.`,
    actionText: "Send an email",
    actionHref: `mailto:${CARE_SETTINGS.support_email}?subject=${encodeURIComponent("A question about caring for my piece")}`
  },
  {
    type: "account",
    title: "Your rental, in one place",
    desc: "Follow your booking, your return and your deposit in My Account.",
    actionText: "Go to my account",
    actionHref: "/profile"
  }
];

export const ALL_QUESTIONS = [
  // 1. Normal wear, or damage? (Section 7.10)
  {
    id: "l-wear",
    section: "wear-damage",
    sectionName: "Wear or damage",
    title: "What counts as normal wear?",
    tag: { label: "Never charged", type: "sage" },
    answer: "The gentle signs of a piece being worn and enjoyed: a few loose threads, a little embellishment loss, light creasing. These are expected, and they are never taken from your deposit.\n\nOur simple test: if our regular cleaning and small touch-ups after every rental put it right, it is normal wear.",
    searchWords: "normal wear tear loose thread crease small bead gentle signs",
    sharedWithDeposit: true
  },
  {
    id: "l-damage",
    section: "wear-damage",
    sectionName: "Wear or damage",
    title: "What counts as damage?",
    tag: null,
    answer: "Anything beyond normal wear, such as stains, tears, burns, significant bead or embroidery loss, or any alteration to the piece. It is assessed when the piece returns to us, against the photographs and video we take before dispatch.\n\nPut simply, it is damage if it needs specialist stain treatment, a karigar's repair or new materials, or cannot be put right at all.",
    searchWords: "damage what counts stain tear burn alteration",
    sharedWithDeposit: true
  },
  {
    id: "l-test",
    section: "wear-damage",
    sectionName: "Wear or damage",
    title: "How do you decide which it is?",
    tag: null,
    answer: "With one simple test, applied to every piece in the same way. If our regular cleaning and small touch-ups after every rental put it right, it is normal wear, and it is never charged. If it needs specialist stain treatment, a karigar's repair or new materials, or cannot be put right at all, it is damage.\n\nWe decide against the photographs and video we take just before dispatch, so only what is new is ever considered.",
    searchWords: "decide which test how judge assess fair"
  },
  {
    id: "l-sweat",
    section: "wear-damage",
    sectionName: "Wear or damage",
    title: "What about perspiration?",
    tag: { label: "Never charged", type: "sage" },
    answer: "Never charged, even when it needs more than our regular cleaning. A celebration is warm, joyful and full of dancing, and natural perspiration is simply part of it.",
    searchWords: "perspiration sweat sweating underarm heat summer"
  },
  {
    id: "l-marks",
    section: "wear-damage",
    sectionName: "Wear or damage",
    title: "There is a makeup, perfume or deodorant mark on it",
    tag: { label: "Usually on us", type: "sage" },
    answer: "A light mark that lifts out in our regular cleaning is normal wear, and it is never charged. A heavy mark that needs specialist treatment, or one that will not lift at all, is assessed as damage.\n\nThe kindest protection is simple: dress once your makeup, perfume and deodorant have dried.",
    searchWords: "makeup foundation lipstick perfume deodorant mark stain kajal"
  },
  {
    id: "l-small",
    section: "wear-damage",
    sectionName: "Wear or damage",
    title: "A hook, button or a few sequins came loose",
    tag: { label: "Normal wear", type: "sage" },
    answer: "That is normal wear. We re-stitch hooks and buttons and replace a few beads or sequins as part of our care after every rental.\n\nIf you need to, hold it in place for the evening with a safety pin through the lining, and leave the rest to us.",
    searchWords: "hook button sequin bead came loose fell off popped thread"
  },
  {
    id: "l-stains",
    section: "wear-damage",
    sectionName: "Wear or damage",
    title: "Which marks are most often assessed as damage?",
    tag: null,
    answer: "The ones that set quickly into silk and fine embroidery: mehendi, haldi, sindoor, gulal and colour, red wine, oil and rich gravies. They usually need specialist treatment, and some cannot be fully lifted.\n\nA little care at those moments goes a long way: see what to do at a haldi or colour ceremony.",
    searchWords: "stains which worst mehendi haldi sindoor wine oil gravy colour holi gulal",
    jumpLink: { text: "what to do at a haldi or colour ceremony", targetId: "w-colour" }
  },

  // 2. Tab 1: When it arrives
  {
    id: "a-check",
    section: "arrives",
    sectionName: "When it arrives",
    title: "What should I do when my piece arrives?",
    tag: { label: "Within 24 hours", type: "gold" },
    answer: `Open it within ${CARE_SETTINGS.issue_window} of delivery, in good light, and look it over before you wear it: the front and back, the hem, the embroidery and every part listed with it.\n\nIf you notice a mark or anything amiss, send us a photo straight away, before you wear it. We note it on your booking, so it is never counted against you.`,
    searchWords: "arrives arrival check inspect open delivery look"
  },
  {
    id: "a-listed",
    section: "arrives",
    sectionName: "When it arrives",
    title: "There is a mark the listing already mentions",
    tag: { label: "Never counted against you", type: "sage" },
    answer: "Anything already photographed or noted on the listing is part of the piece's history, and it is never counted against you.",
    searchWords: "listing already mentioned disclosed photographed history existing mark"
  },
  {
    id: "a-fit",
    section: "arrives",
    sectionName: "When it arrives",
    title: "It does not fit",
    tag: { label: "Swap within 24 hours", type: "gold" },
    answer: `This is rare, because we check every piece against the measurements you share with us. Try it on the day it arrives, and if it does not fit, message us within ${CARE_SETTINGS.issue_window} of delivery with a photo, and we will arrange a swap.\n\nPlease do not alter it to make it fit. Our Refund & Cancellation Policy explains the rest.`,
    searchWords: "fit fitting size tight loose does not fit swap",
    pageLink: { text: "Refund & Cancellation Policy", href: "/refunds" }
  },
  {
    id: "a-store",
    section: "arrives",
    sectionName: "When it arrives",
    title: "How should I keep it until my event?",
    tag: null,
    answer: "On its padded hanger, inside its garment bag, somewhere cool and dry and away from direct sunlight. Keep it clear of pets, perfume bottles and anything damp.",
    searchWords: "store keep hang hanger until event where wardrobe"
  },
  {
    id: "a-crease",
    section: "arrives",
    sectionName: "When it arrives",
    title: "Can I steam or iron out a crease?",
    tag: { label: "Please do not", type: "terracotta" },
    answer: "Please do not. Your piece arrives pressed and ready to wear, and light creases from travel usually soften once it has hung for a few hours. Steam and heat can melt sequins, tarnish zari and mark delicate silk, so any harm from them is treated as damage.\n\nIf a crease still worries you, send us a photo and we will advise you.",
    searchWords: "steam iron press crease wrinkle travel creases"
  },
  {
    id: "a-fresh",
    section: "arrives",
    sectionName: "When it arrives",
    title: "It does not feel fresh",
    tag: { label: "Tell us within 24 hours", type: "gold" },
    answer: `That should never happen: every piece is professionally cleaned and checked before it leaves us. Message us within ${CARE_SETTINGS.issue_window} of delivery with a photo, and we will put it right before your event.`,
    searchWords: "fresh smell clean hygiene not clean odour"
  },

  // 3. Tab 2: Getting ready
  {
    id: "w-makeup",
    section: "ready",
    sectionName: "Getting ready",
    title: "Can I wear perfume and makeup?",
    tag: { label: "Yes, with care", type: "sage" },
    answer: "Of course. Apply perfume, makeup and hairspray before you dress and let them dry, and never spray perfume directly onto the fabric.\n\nFor a piece you slip over your head, a light scarf over your face keeps foundation and lipstick off the neckline.",
    searchWords: "perfume makeup hairspray foundation lipstick deodorant spray"
  },
  {
    id: "w-jewel",
    section: "ready",
    sectionName: "Getting ready",
    title: "Will my jewellery harm it?",
    tag: null,
    answer: "Heavy jewellery is one of the most common causes of pulled threads. Put it on after you dress, take it off before you undress, and lift it clear of net, organza and embroidery, where clasps and settings catch.",
    searchWords: "jewellery jewelry necklace earrings kundan polki bangles snag catch pull"
  },
  {
    id: "w-pins",
    section: "ready",
    sectionName: "Getting ready",
    title: "Can I use safety pins or fashion tape?",
    tag: { label: "Yes, gently", type: "sage" },
    answer: "Fashion tape and safety pins are absolutely fine for small adjustments on the day. Pin gently through the lining or a plain part of the fabric, never through embroidery, zari or sheer fabric, as a mark, snag or tear from a pin counts as damage.\n\nFashion tape works best on the lining, rather than on the outer fabric.",
    searchWords: "safety pin pins tape fashion tape adjust fit dupatta pallu"
  },
  {
    id: "w-alter",
    section: "ready",
    sectionName: "Getting ready",
    title: "Can I alter it to fit?",
    tag: { label: "Please do not", type: "terracotta" },
    answer: "Please do not alter it in any way, including stitching, hemming, cutting or taking in. Any alteration is treated as damage.\n\nIf the fit worries you, message us before your event and we will help you find a way that works.",
    searchWords: "alter alteration tailor stitch hem take in cut adjust"
  },
  {
    id: "w-mehendi",
    section: "ready",
    sectionName: "Getting ready",
    title: "I have fresh mehendi",
    tag: null,
    answer: "Wait until the paste is completely off before you dress, and keep the oils used to darken it away from the fabric. Fresh henna stains silk and embroidery for good, so it is worth the extra hour.",
    searchWords: "mehendi henna fresh paste hands oil dark"
  },

  // 4. Tab 3: At the celebration
  {
    id: "w-food",
    section: "celebration",
    sectionName: "At the celebration",
    title: "Can I eat and drink in it?",
    tag: null,
    answer: "Of course, it is a celebration. Keep deep colours like red wine, coffee and rich gravies at a careful distance, and if anything splashes, blot it straight away.",
    searchWords: "eat drink food wine coffee gravy dinner",
    jumpLink: { text: "blot it straight away", targetId: "h-spill" }
  },
  {
    id: "w-colour",
    section: "celebration",
    sectionName: "At the celebration",
    title: "I am wearing it to a haldi or a colour ceremony",
    tag: null,
    answer: "Turmeric, sindoor and colour are part of the joy, and they also set into silk faster than anything else. Keep your dupatta gathered close, stand back when colour is in the air, and blot any splash straight away.\n\nA mark that lifts in our regular cleaning is normal wear. One that needs specialist treatment is assessed like any other stain.",
    searchWords: "haldi holi colour color gulal turmeric sindoor ceremony"
  },
  {
    id: "w-fire",
    section: "celebration",
    sectionName: "At the celebration",
    title: "I will be near the sacred fire, diyas or sparklers",
    tag: null,
    answer: "Keep your dupatta and pallu gathered close during the pheras, and near diyas, candles and sparklers. Delicate net and organza can catch a spark in a moment, and a burn cannot be undone.",
    searchWords: "fire pheras diya candle sparkler havan flame burn"
  },
  {
    id: "w-outdoor",
    section: "celebration",
    sectionName: "At the celebration",
    title: "My celebration is outdoors",
    tag: null,
    answer: "Lift your hem on grass, sand and stone steps, keep the piece dry if it rains, and watch for rough surfaces, nails and chair edges. Water, mud and rough edges can harm a piece in a moment.",
    searchWords: "outdoor garden beach lawn rain monsoon sand grass destination"
  },
  {
    id: "w-twice",
    section: "celebration",
    sectionName: "At the celebration",
    title: "Can I wear it more than once?",
    tag: { label: "Yes", type: "sage" },
    answer: "Yes, it is yours to enjoy for your whole rental window. Hang it to air between wears, and tell us about anything that happened at the first event before the next one.",
    searchWords: "wear twice two functions more than once again"
  },
  {
    id: "h-spill",
    section: "celebration",
    sectionName: "At the celebration",
    title: "I spilled something on it",
    tag: { label: "Blot, never rub", type: "gold" },
    answer: "Press a clean tissue or cloth gently onto the spill to lift what you can, working from the outside in, and never rub. Please do not use water, soda, salt, talc or any home remedy, as they can set a mark for good.\n\nThen send us a photo on WhatsApp. The sooner we know, the more our specialists can usually save.",
    searchWords: "spill spilled stain wine food drink accident splash"
  },
  {
    id: "h-tear",
    section: "celebration",
    sectionName: "At the celebration",
    title: "Something tore, snagged or came loose",
    tag: null,
    answer: "Please do not pull a loose thread or try to stitch it. If you need to, hold it in place with a safety pin through the lining, and send us a photo.\n\nOur karigars can restore far more than you might expect, especially when they see it early.",
    searchWords: "tear torn snag snagged pulled thread rip loose"
  },
  {
    id: "h-tell",
    section: "celebration",
    sectionName: "At the celebration",
    title: "Should I tell you now, or wait until it is back?",
    tag: { label: "Tell us straight away", type: "gold" },
    answer: "Please tell us straight away. Telling us never counts against you, and the sooner we know, the more our specialists can usually save, which keeps any cost to you as small as possible.",
    searchWords: "tell inform report wait later now"
  },
  {
    id: "h-night",
    section: "celebration",
    sectionName: "At the celebration",
    title: "It happened late at night",
    tag: null,
    answer: `Send us the photo anyway. We reply from ${CARE_SETTINGS.support_hours}, and your message shows exactly when you told us, so you have told us straight away.`,
    searchWords: "night late hours closed reply weekend"
  },
  {
    id: "h-guest",
    section: "celebration",
    sectionName: "At the celebration",
    title: "Someone else spilled something on me",
    tag: null,
    answer: "It happens at every celebration, and we understand. While the piece is with you it is in your care, so it is looked at in the same way whoever caused it. Blot it, send us a photo, and we will do everything we can to restore it.",
    searchWords: "guest someone else caused not my fault spilled on me"
  },
  {
    id: "h-keep",
    section: "celebration",
    sectionName: "At the celebration",
    title: "Can I keep wearing it after a spill?",
    tag: null,
    answer: "Yes. Blot it, send us a photo, and enjoy the rest of your evening. Simply avoid touching or rubbing the mark.",
    searchWords: "keep wearing continue after spill rest of evening"
  },

  // 5. Tab 4: After the celebration
  {
    id: "af-air",
    section: "after",
    sectionName: "After the celebration",
    title: "What should I do with it after my event?",
    tag: null,
    answer: "Take your jewellery off first, open every hook and zip fully, and step out of it gently. Then hang it overnight on its padded hanger to air, away from sunlight and damp, before you pack it.\n\nThere is nothing to clean: all cleaning is ours.",
    searchWords: "after event take off undress hang air overnight",
    jumpLink: { text: "all cleaning is ours", targetId: "o-cost" }
  },
  {
    id: "r-clean",
    section: "after",
    sectionName: "After the celebration",
    title: "Should I clean it before sending it back?",
    tag: { label: "Please do not", type: "terracotta" },
    answer: "Please do not. Professional cleaning after every rental is taken care of by us and included in your rental fee. Washing, steaming or spot cleaning at home can harm delicate work, and damage caused this way is treated like any other damage.",
    searchWords: "wash clean before returning dry clean steam iron",
    sharedWithDeposit: true
  },

  // 6. Tab 5: Sending it back
  {
    id: "r-how",
    section: "sending",
    sectionName: "Sending it back",
    title: "How do I send the piece back?",
    tag: null,
    answer: "Whichever suits you best:\n• Drop it off at the courier's nearest office, using the prepaid label in your packaging.\n• Book a pickup from your door: message us and we will arrange it.\n\nEither way, please pack the piece as it arrived, in its garment bag, and keep the courier's receipt until your deposit is back with you.",
    searchWords: "send back return how drop off pickup courier label",
    sharedWithDeposit: true
  },
  {
    id: "r-pack",
    section: "sending",
    sectionName: "Sending it back",
    title: "How do I pack it?",
    tag: null,
    answer: "Let it air overnight on its hanger, then pack it as it arrived, folded loosely in its tissue and garment bag. Fold along the plainer panels rather than across heavy embroidery, and keep every part together.",
    searchWords: "pack packing fold tissue box garment bag"
  },
  {
    id: "r-parts",
    section: "sending",
    sectionName: "Sending it back",
    title: "What needs to go back?",
    tag: null,
    answer: "Everything that arrived with it: the piece itself and every part listed with it, such as the dupatta, blouse, belt, can-can or potli.",
    searchWords: "parts what goes back dupatta blouse belt potli can-can included"
  },
  {
    id: "x-part",
    section: "sending",
    sectionName: "Sending it back",
    title: "A part of the piece did not come back",
    tag: null,
    answer: "Please tell us as soon as you notice. If it is found and sent back, only any late days apply. If it is lost, only the cost of replacing that part is deducted, never the value of the whole piece.",
    searchWords: "missing part dupatta blouse belt not returned piece incomplete",
    sharedWithDeposit: true
  },
  {
    id: "r-label",
    section: "sending",
    sectionName: "Sending it back",
    title: "I have lost the return label or garment bag",
    tag: null,
    answer: "Your return label comes printed in your packaging. If it goes missing, simply message us and we will send you a copy to print. Any clean, sturdy bag will do for the journey back.",
    searchWords: "lost label garment bag packaging print copy",
    sharedWithDeposit: true
  },
  {
    id: "r-resp",
    section: "sending",
    sectionName: "Sending it back",
    title: "Who is responsible for the piece on its way back?",
    tag: { label: "We are", type: "sage" },
    answer: "We are, from the moment you hand it to our courier and receive a receipt. If anything happens to it after that, you are never charged for it, and your deposit is protected. That is why the receipt matters: please keep it until your deposit is back with you.",
    searchWords: "responsible journey back lost in transit courier receipt who",
    sharedWithDeposit: true
  },

  // 7. Piece by piece (Section 7.10)
  {
    id: "pc-lehenga",
    section: "pieces",
    sectionName: "Care, piece by piece",
    title: "Caring for a lehenga",
    tag: null,
    answer: "• Hang the skirt by its inner loops, so its weight rests evenly and the waistband keeps its shape.\n• Gather the skirt before you sit, and lift the hem on stairs, where heels catch the hem and can-can.\n• Pin your dupatta through its plain edge or the blouse lining, never through the embroidered border.\n• When you pack it, fold along the plainer panels, and send back the can-can and every layer with it.",
    searchWords: "lehenga skirt can-can bridal choli"
  },
  {
    id: "pc-saree",
    section: "pieces",
    sectionName: "Care, piece by piece",
    title: "Caring for a saree",
    tag: null,
    answer: "• A pre-draped or pre-stitched saree is set for you: wear it as it is, without re-pleating or re-stitching.\n• Pin pleats and pallu through the plain fall or the lining, never through zari or embroidery.\n• Keep the hem just off the floor, and lift it on stairs, where heels and jewellery snag a delicate border.\n• Fold it loosely along its original lines, with tissue between the folds.",
    searchWords: "saree sari drape pleats pallu pre-draped pre-stitched"
  },
  {
    id: "pc-sets",
    section: "pieces",
    sectionName: "Care, piece by piece",
    title: "Caring for an anarkali, sharara or kurta set",
    tag: null,
    answer: "• Slip an anarkali over your head with a light scarf over your face, so makeup stays off the neckline.\n• Lift sharara and gharara flares on stairs and steps, and keep them clear of wet ground.\n• Keep the dupatta, belt and every layer together, so each part comes back with the set.",
    searchWords: "anarkali sharara gharara kurta set suit"
  },
  {
    id: "pc-gowns",
    section: "pieces",
    sectionName: "Care, piece by piece",
    title: "Caring for a gown or Indo-western piece",
    tag: null,
    answer: "• Gather a train or long hem when you walk outdoors, and let it rest on a clean surface when you sit.\n• Corsets, drapes and capes are shaped to fit as they are: please do not adjust their boning, seams or drapes.\n• Hang it by its inner loops on its padded hanger, so the shoulders and bodice keep their shape.",
    searchWords: "gown indo-western indo western cape corset drape train"
  },
  {
    id: "pc-men",
    section: "pieces",
    sectionName: "Care, piece by piece",
    title: "Caring for a sherwani or bandhgala",
    tag: null,
    answer: "• Button and unbutton slowly, especially on embroidered fronts, where the threads take the most strain.\n• Let deodorant dry fully before you dress, as a close-fitting jacket meets it at every seam.\n• Return everything listed with your outfit, such as a safa or stole.\n• Hang it on its shaped hanger with the shoulders supported, and keep the buttons fastened.",
    searchWords: "sherwani bandhgala achkan jodhpuri menswear groom safa stole"
  },

  // 8. Our care (Section 7.10)
  {
    id: "o-clean",
    section: "our-care",
    sectionName: "Our care",
    title: "Who cleans the pieces?",
    tag: null,
    answer: "Our partner specialists in couture care clean every piece professionally before and after every rental. Each one is then checked by hand and pressed, and nothing is ever dispatched without it, because hygiene is never negotiable for us.",
    searchWords: "who cleans cleaning dry clean hygiene specialists partner"
  },
  {
    id: "o-cost",
    section: "our-care",
    sectionName: "Our care",
    title: "Do I pay for cleaning?",
    tag: { label: "Never", type: "sage" },
    answer: "Never. Our professional cleaning and pressing after every rental is included in your rental fee, and it is never taken from your deposit.",
    searchWords: "pay cleaning cost charge fee included free"
  },
  {
    id: "o-record",
    section: "our-care",
    sectionName: "Our care",
    title: "How do you know what happened during my rental?",
    tag: null,
    answer: "We photograph and film every piece just before it is dispatched. When it returns, we compare it with that record, so only what is new is ever considered, and you can see both side by side if we ever need to talk about a mark.",
    searchWords: "photos video record before dispatch evidence proof condition know"
  },
  {
    id: "o-repair",
    section: "our-care",
    sectionName: "Our care",
    title: "Who repairs a piece if it needs it?",
    tag: null,
    answer: "Our own trusted karigars and specialists, who work with couture every day. Please never take a rental to your own tailor or cleaner: we look after every repair ourselves.",
    searchWords: "repair who fixes karigar tailor own tailor"
  },

  // 9. If a piece needs restoring (Section 7.10)
  {
    id: "x-amount",
    section: "restoring",
    sectionName: "If a piece needs restoring",
    title: "How is a deduction worked out?",
    tag: null,
    answer: "It is the fair, reasonable cost of restoring the piece, considered case by case, because no two pieces or repairs are alike. It can include:\n• specialist cleaning or repair\n• materials, such as matching thread, beads or fabric\n• the skilled hand work involved, which for intricate embellishment can take days\n\nWe only ever charge what restoring it truly costs, never a penalty, and we always show you how the amount was reached. Our Deposit Policy shows a worked example.",
    searchWords: "how much deduction amount worked out calculated cost price repair restoration",
    sharedWithDeposit: true,
    pageLink: { text: "Deposit Policy", href: "/deposit" }
  },
  {
    id: "x-notice",
    section: "restoring",
    sectionName: "If a piece needs restoring",
    title: "How will I hear about a deduction?",
    tag: { label: "Within 2 business days", type: "gold" },
    answer: `Within ${CARE_SETTINGS.deduction_notice_within} of your piece reaching us, we will message you with:\n• photographs and video of what we found\n• our own photographs and video of the piece from just before dispatch, so you can compare the two\n• the amount, and how it was worked out\n• the invoice for the work, wherever there is one\n\nNothing is deducted before you have seen all of this.`,
    searchWords: "how will i know deduction notified told photos evidence",
    sharedWithDeposit: true
  },
  {
    id: "x-reply",
    section: "restoring",
    sectionName: "If a piece needs restoring",
    title: "Can I respond to a deduction?",
    tag: { label: "2 business days to reply", type: "gold" },
    answer: `Of course. You have ${CARE_SETTINGS.deduction_reply_within} to share anything you would like us to consider, such as your own photographs from when the piece arrived. We review it against our records and then confirm the final amount. Where the photographs and video clearly show the damage, the deduction stands.\n\nIf you remain unhappy, you can write to our Grievance Officer, whose details are on our Contact page.`,
    searchWords: "disagree reply respond dispute challenge deduction unfair",
    sharedWithDeposit: true,
    pageLink: { text: "Contact page", href: "/contact-us" }
  },
  {
    id: "x-long",
    section: "restoring",
    sectionName: "If a piece needs restoring",
    title: "What if the repair takes a while?",
    tag: null,
    answer: "Some hand work takes weeks. In that case, we hold only our estimate of the cost and return the rest of your deposit as usual. Once the work is complete, we settle the difference: if it cost less than the estimate, we return the difference; if it cost more, we share the invoice and talk it through with you first.",
    searchWords: "repair takes long weeks estimate invoice later",
    sharedWithDeposit: true
  },

  // 10. A piece that is yours to keep (Section 7.10)
  {
    id: "p-care",
    section: "owned",
    sectionName: "A piece that is yours to keep",
    title: "How do I care for a preloved piece?",
    tag: null,
    answer: "Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed. Because each one is made differently, its own care notes are on its page, written for its fabric and craftsmanship. You can open it any time from your order in My Account.\n\nA few things hold true for every one of them:\n• Store it in breathable cotton or muslin, never plastic, somewhere cool, dry and dark.\n• Refold it along different lines every few months, so zari and embroidery never rest on one fold for long.\n• Keep perfume, deodorant and hairspray off the fabric.\n• Air it now and then, especially through the monsoon, and keep naphthalene or neem wrapped so it never touches the fabric.",
    searchWords: "preloved bought own care store storage muslin naphthalene neem"
  },
  {
    id: "p-cleaned",
    section: "owned",
    sectionName: "A piece that is yours to keep",
    title: "Is my preloved piece cleaned before it reaches me?",
    tag: { label: "Yes", type: "sage" },
    answer: "Yes. Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed.\n\nA piece that has never been worn is checked and pressed instead of cleaned, so it stays exactly as new.",
    searchWords: "cleaned before clean hygiene fresh preloved arrive dry clean washed worn unworn"
  },
  {
    id: "p-clean",
    section: "owned",
    sectionName: "A piece that is yours to keep",
    title: "How should I have it cleaned in future?",
    tag: null,
    answer: "Only when it needs it, and only by a dry cleaner who specialises in hand-embroidered pieces, as every clean is a little wear of its own. Do have it cleaned before you store it for a long while, as perspiration and small marks can set over time.",
    searchWords: "clean dry clean preloved how often specialist"
  },
  {
    id: "p-repair",
    section: "owned",
    sectionName: "A piece that is yours to keep",
    title: "A thread or bead has come loose",
    tag: null,
    answer: "Please do not pull it. A karigar can secure it in minutes, and the sooner it is done, the less there is to repair.",
    searchWords: "loose thread bead repair preloved fix karigar"
  },
  {
    id: "p-flaw",
    section: "owned",
    sectionName: "A piece that is yours to keep",
    title: "Something is not as described in the listing",
    tag: null,
    answer: "Please tell us straight away. Our Refund & Cancellation Policy explains exactly what to do, and how quickly to let us know.",
    searchWords: "not as described flaw defect hidden preloved claim",
    pageLink: { text: "Refund & Cancellation Policy", href: "/refunds" }
  },
  {
    id: "p-next",
    section: "owned",
    sectionName: "A piece that is yours to keep",
    title: "Can I rent it out or sell it through House of Kaira later?",
    tag: { label: "Yes", type: "sage" },
    answer: "Yes, and we would love to give it its next chapter. When you are ready, list your piece and our team will guide you through it.",
    searchWords: "sell rent list later next chapter resell",
    pageLink: { text: "list your piece", href: "/list-your-piece" }
  },
  {
    id: "p-lister",
    section: "owned",
    sectionName: "A piece that is yours to keep",
    title: "I list my pieces with House of Kaira. How is my piece protected?",
    tag: null,
    answer: "Our Seller Guidelines set out how we look after your piece while it is with us and with a renter, and how you are protected if it is ever damaged.",
    searchWords: "lister listing my piece protected damaged renter compensation",
    pageLink: { text: "Seller Guidelines", href: "/seller-guidelines" }
  }
];
