/**
 * House of Kaira: Shipping & Delivery Policy Registry
 * Sections 08, 09 & 10 of Build Specification v2 (hok_shipping_policy_v3)
 */

import { SHIPPING_TOKENS } from "./shippingSettings";

export const SHIPPING_BREADCRUMB = {
  homeLabel: "Home",
  homePath: "/",
  supportLabel: "Support",
  supportPath: "/faqs",
  currentLabel: "Shipping & Delivery Policy"
};

export const SHIPPING_HERO = {
  eyebrow: "Delivered with care",
  titlePrefix: "Shipping & ",
  italicWord: "delivery",
  subtitle:
    "Every piece is prepared by hand and planned to reach you in good time for your celebration. Here is exactly how delivery and returns work, for every rental and every preloved piece."
};

export const SHIPPING_POPULAR_QUESTIONS = [
  { id: "w-how", text: "How does the rental window work?" },
  { id: "c-free", text: "When is delivery free?" },
  { id: "r-how", text: "How does my rental go back?" },
  { id: "i-where", text: "Do you deliver outside India?" }
];

export const SHIPPING_RENTAL_WINDOW_CARD = {
  title: "How your rental window works",
  hint: "Your exact dates are always shown before you pay.",
  days: [
    {
      label: "DAY 1",
      title: "It arrives",
      line: "The day before your celebration",
      isCelebration: false
    },
    {
      label: "DAY 2",
      title: "Your celebration",
      line: "Wear it, and enjoy every moment",
      isCelebration: true
    },
    {
      label: "DAY 3",
      title: "It goes back",
      line: "We collect it from your door",
      isCelebration: false
    }
  ],
  bracketDaysLabel: `Standard rental window · ${SHIPPING_TOKENS.window_standard} · one price`,
  extraDays: {
    label: "EXTRA DAYS",
    title: "Need it longer?",
    line: "Add days when you book, at the piece's daily rate."
  },
  bracketExtraLabel: "Optional · daily rate",
  note1: {
    title: "For example",
    text: "A celebration on the 5th: your piece arrives on the 4th and goes back on the 6th."
  },
  note2: {
    title: "More than one day of celebrations?",
    textPrefix: "Add one extra day for each additional day. ",
    linkText: "See how it works",
    targetAnswerId: "w-wedding"
  }
};

export const SHIPPING_INTRO = {
  text: "Every House of Kaira piece is prepared by hand before it travels: pressed, wrapped in tissue, placed in its garment bag and boxed with care. Rentals are planned around your celebration, and standard delivery is ",
  emphasis: `free on every order of ${SHIPPING_TOKENS.free_delivery_min} or more`,
  suffix: ", including a rental's journey back to us."
};

export const SHIPPING_WAYS_WE_DELIVER = {
  titlePrefix: "Ways we ",
  italicWord: "deliver",
  subline: "Times are counted from the day your piece leaves us.",
  options: [
    {
      id: "opt-standard",
      place: "ACROSS INDIA",
      name: "Standard",
      time: SHIPPING_TOKENS.standard_delivery,
      tag: { text: `Free from ${SHIPPING_TOKENS.free_delivery_min}`, tone: "yes" },
      note: "Below that, worked out for your address and shown before you pay. For a rental, the journey back is included.",
      linkText: "Details",
      targetAnswerId: "c-free"
    },
    {
      id: "opt-express",
      place: "MOST PINCODES IN INDIA",
      name: "Express",
      time: SHIPPING_TOKENS.express_delivery,
      tag: { text: "Quoted at checkout", tone: "mid" },
      note: "Priced for your address, never a flat fee, and charged even when standard delivery is free.",
      linkText: "Details",
      targetAnswerId: "c-express"
    },
    {
      id: "opt-same-day",
      place: "WITHIN INDORE",
      name: "Same day",
      time: "The same day",
      tag: { text: "Quoted at checkout", tone: "mid" },
      note: "For rentals and preloved pieces, shown at checkout whenever it is available for your order.",
      linkText: "Details",
      targetAnswerId: "c-same"
    },
    {
      id: "opt-international",
      place: "WORLDWIDE",
      name: "International",
      time: "Within 10 business days",
      tag: { text: "Quoted at checkout", tone: "mid" },
      note: "For preloved pieces only. Customs duties and import taxes are paid by you on arrival.",
      linkText: "Details",
      targetAnswerId: "i-where"
    }
  ],
  footnote:
    "For a rental, the day your piece arrives is set by your celebration, whichever option you choose. Express and same day delivery simply let you book closer to your date."
};

export const SHIPPING_SECTIONS = [
  {
    num: "01",
    id: "s-window",
    barLabel: "Rental window",
    titlePrefix: "Your rental ",
    italicWord: "window",
    desc: "Planned around your celebration: when your piece arrives, and when it goes back.",
    questions: [
      {
        id: "w-how",
        question: "How does the rental window work?",
        tag: { text: SHIPPING_TOKENS.window_standard, tone: "mid" },
        keywords: "rental window how long days arrive return day before after period",
        paragraphs: [
          `Every rental comes with a standard rental window of ${SHIPPING_TOKENS.window_standard}: your piece arrives the day before your celebration, is yours for the day itself, and goes back the day after. The rental price shown on each piece covers the whole window.`,
          "For a celebration on the 5th, your piece arrives on the 4th and goes back on the 6th. The day before gives you time to try it on at leisure, so the day itself is simply yours to enjoy."
        ],
        cardLink: { text: "See it at a glance", target: "card:window" }
      },
      {
        id: "w-dates",
        question: "Which dates do I choose when I book?",
        tag: null,
        keywords: "dates choose book booking calendar event date start end which travel travelling outstation destination journey",
        paragraphs: [
          "Simply the date of your celebration. We plan everything around it: the day your piece arrives and the day it goes back are shown in your booking summary before you pay, and again in your confirmation.",
          "Celebrating over more than one day? Choose the date of your first function and your last, and we plan around both.",
          "Travelling for your celebration, within India or abroad? Message us before you book, and we will plan your dates around your journey."
        ],
        links: [
          { text: "we plan around both", target: "q:w-wedding" },
          { text: "within India or abroad", target: "q:i-rentabroad" }
        ]
      },
      {
        id: "w-wedding",
        question: "My wedding has functions over several days. How does that work?",
        tag: { text: "One delivery, one pickup", tone: "yes" },
        keywords: "wedding several days functions haldi mehendi sangeet multiple outfits pieces together",
        paragraphs: [
          "Simply add one extra day for each additional day of celebrations. Your pieces arrive the day before your first function and go back the day after your last, so everything you need is with you from start to finish.",
          `With a haldi and sangeet on one day and the wedding the next, for example, you need 4 days: your standard ${SHIPPING_TOKENS.window_standard}, plus 1 extra day at the piece's daily rate. The extra day is shown in your booking summary before you pay.`,
          "Every piece booked for the same celebration travels together and comes back together, in one delivery and one pickup, so nothing ever needs sending back in the middle of your festivities."
        ],
        links: [{ text: "1 extra day", target: "q:w-extra" }]
      },
      {
        id: "w-extra",
        question: "Can I keep a piece for longer?",
        tag: { text: "Add days when you book", tone: "mid" },
        keywords: "keep longer extra days extend extension more days fitting try on early",
        paragraphs: [
          "Of course. Add extra days when you book, at the piece's daily rate shown on its product page. A day at the start is lovely for a relaxed fitting.",
          `Once your piece is with you, message us before your Return Date if you would like it a little longer. If no one has booked it straight after you, we extend your rental at the same daily rate, plus ${SHIPPING_TOKENS.gst_rental} GST.`
        ]
      },
      {
        id: "w-book",
        question: "How far ahead should I book?",
        tag: null,
        keywords: "how far ahead advance book early lead time season peak last minute",
        paragraphs: [
          `As early as you can, especially in wedding season, ${SHIPPING_TOKENS.peak_months}, when we suggest booking ${SHIPPING_TOKENS.peak_lead_time} ahead, as the most loved pieces are reserved early.`,
          "Our booking calendar only shows dates we can deliver to your pincode in good time, so any date you can choose is one we can meet. Booking close to your celebration? Express or, within Indore, same day delivery can open up nearer dates."
        ],
        links: [
          { text: "Express", target: "q:c-express" },
          { text: "same day delivery", target: "q:c-same" }
        ]
      },
      {
        id: "w-holiday",
        question: "What if my dates fall on a Sunday or a public holiday?",
        tag: null,
        keywords: "sunday public holiday festival courier closed delivery pickup weekend",
        paragraphs: [
          "Our delivery partners do not always deliver or collect on Sundays and public holidays. If the day your piece is due to arrive is one of them, it reaches you a day earlier, at no extra cost. If your Return Date is one of them, we book your pickup for the next day they collect, and that extra day is never charged."
        ]
      }
    ]
  },
  {
    num: "02",
    id: "s-charges",
    barLabel: "Charges",
    titlePrefix: "Delivery ",
    italicWord: "charges",
    desc: "What delivery costs, and when it is on us.",
    questions: [
      {
        id: "c-free",
        question: "When is delivery free?",
        tag: { text: `From ${SHIPPING_TOKENS.free_delivery_min}`, tone: "yes" },
        keywords: "free delivery shipping threshold minimum order cost charges",
        paragraphs: [
          `Standard delivery is free on every order of ${SHIPPING_TOKENS.free_delivery_min} or more, measured on the price of your pieces before GST. For a rental, that covers both journeys: to you, and back to us.`,
          "Your security deposit is not counted towards it, as it is held separately from your order."
        ]
      },
      {
        id: "c-below",
        question: "What does delivery cost on smaller orders?",
        tag: null,
        keywords: "delivery cost charge small order below threshold how much shipping fee",
        paragraphs: [
          "It is worked out for your delivery address and shown at checkout before you pay. For a rental, the amount already covers the journey back to us, so there is never anything more to pay when your piece comes back."
        ]
      },
      {
        id: "c-return",
        question: "Do I pay anything to send my rental back?",
        tag: { text: "Nothing more", tone: "yes" },
        keywords: "return shipping cost pay label prepaid send back charge",
        paragraphs: [
          "No. Your return label comes prepaid in your packaging, and the journey back is already part of your delivery. Nothing is collected at your door, and nothing is taken from your deposit for it.",
          "The only exception is a second pickup, if the first is missed on your side."
        ],
        links: [{ text: "missed on your side", target: "q:r-missed" }]
      },
      {
        id: "c-express",
        question: "How much does express delivery cost?",
        tag: { text: "Quoted before you pay", tone: "mid" },
        keywords: "express faster quick delivery cost fee price urgent",
        paragraphs: [
          "It depends on where your piece is travelling, so we never quote a flat fee. You will see the exact amount at checkout, before you pay.",
          `Express is a faster service on top of standard delivery, so it is charged even when standard delivery is free. For a preloved piece it usually takes ${SHIPPING_TOKENS.express_delivery} once dispatched; for a rental, it lets you book closer to your date.`
        ]
      },
      {
        id: "c-same",
        question: "Do you deliver on the same day?",
        tag: { text: "Within Indore", tone: "mid" },
        keywords: "same day today indore local fast urgent delivery",
        paragraphs: [
          "Yes, within Indore, for rentals and preloved pieces alike. Whenever it is available for your order, you will see it at checkout with its charge, before you pay."
        ]
      },
      {
        id: "c-several",
        question: "I am ordering several pieces. Is delivery charged on each?",
        tag: null,
        keywords: "several pieces multiple orders together delivery charge each one",
        paragraphs: [
          "No. Pieces that travel together, such as everything booked for the same celebration, are delivered together and count as one order towards free delivery."
        ]
      },
      {
        id: "c-refund",
        question: "Are delivery charges ever refunded?",
        tag: null,
        keywords: "delivery charge refunded refund shipping fee cancel back",
        paragraphs: [
          "Yes, whenever an order is cancelled before dispatch, and whenever we are the reason something went wrong. Once a piece has been delivered as ordered, delivery charges are not refunded. Our Refund & Cancellation Policy explains every case."
        ],
        pageLinks: [{ text: "Refund & Cancellation Policy", pageKey: "refund-policy" }]
      }
    ]
  },
  {
    num: "03",
    id: "s-preloved",
    barLabel: "Preloved",
    titlePrefix: "A preloved piece, on its ",
    italicWord: "way",
    desc: "When a preloved piece leaves us, and how long it takes to reach you.",
    questions: [
      {
        id: "p-when",
        question: "When will my preloved piece be dispatched?",
        tag: { text: `Within ${SHIPPING_TOKENS.preloved_dispatch}`, tone: "mid" },
        keywords: "dispatch preloved when ship leave send buy order",
        paragraphs: [
          `Within ${SHIPPING_TOKENS.preloved_dispatch} of your order, for most pieces. The dispatch date for your piece is always shown on its product page and in your order summary before you pay, and we message you the moment it leaves us.`,
          "A few pieces take a little longer, either because they are kept by their owners or because they have rentals booked first."
        ],
        links: [
          { text: "kept by their owners", target: "q:p-owner" },
          { text: "rentals booked first", target: "q:p-booked" }
        ]
      },
      {
        id: "p-clean",
        question: "Is my preloved piece cleaned before it is sent?",
        tag: { text: "Checked and pressed", tone: "yes" },
        keywords: "clean cleaned fresh preloved pressed hygiene dry clean",
        paragraphs: [
          "Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed. A piece that has never been worn is checked and pressed instead of cleaned, so it stays exactly as new."
        ]
      },
      {
        id: "p-owner",
        question: "Why do some pieces take longer to leave you?",
        tag: { text: `Within ${SHIPPING_TOKENS.owner_dispatch}`, tone: "mid" },
        keywords: "longer slow owner lister kept home why delay dispatch",
        paragraphs: [
          "Some pieces stay with their owners until they find a new home. When you order one, it comes to us first, so it can be prepared like every other piece before it travels on to you.",
          `These pieces leave us within ${SHIPPING_TOKENS.owner_dispatch}, and their product page says so clearly before you pay.`
        ]
      },
      {
        id: "p-booked",
        question: "The piece I want to buy has rentals booked. When will it reach me?",
        tag: null,
        keywords: "rentals booked before buy piece rented sold after later dispatch both",
        paragraphs: [
          "Some pieces can be rented as well as bought. If yours already has rentals booked, those celebrations go ahead first, and your piece is dispatched once it has come back from the last one and been cleaned and checked. You will see that dispatch date before you pay.",
          "If anything were to happen to it in the meantime, we would tell you straight away, and you could choose a full refund."
        ]
      },
      {
        id: "p-time",
        question: "How long does delivery take once it has left you?",
        tag: { text: SHIPPING_TOKENS.standard_delivery, tone: "mid" },
        keywords: "how long delivery take days transit arrive preloved standard express",
        paragraphs: [
          `Standard delivery usually takes ${SHIPPING_TOKENS.standard_delivery} from dispatch, and express ${SHIPPING_TOKENS.express_delivery}. Within Indore, same day delivery is often possible.`,
          "These are our delivery partners' usual times, and a few remote pincodes can take a little longer."
        ],
        links: [{ text: "same day delivery", target: "q:c-same" }]
      },
      {
        id: "p-business",
        question: "What do you mean by business days?",
        tag: null,
        keywords: "business days working days what counts weekend saturday sunday",
        paragraphs: [
          `${SHIPPING_TOKENS.business_days}. Dispatch and delivery times are counted in business days, though our team tries to be available every day of the week.`
        ]
      }
    ]
  },
  {
    num: "04",
    id: "s-arrival",
    barLabel: "Arrival",
    titlePrefix: "When your piece ",
    italicWord: "arrives",
    desc: "Following it, receiving it, and what to check when it reaches you.",
    questions: [
      {
        id: "a-track",
        question: "How do I follow my delivery?",
        tag: null,
        keywords: "track tracking where is my order status follow delivery",
        paragraphs: [
          "The moment your piece is on its way, we send you its tracking details on WhatsApp and by email. You can also follow every order and booking in My Account."
        ]
      },
      {
        id: "a-pack",
        question: "How will my piece be packed?",
        tag: null,
        keywords: "packed packaging box garment bag tissue how arrive",
        paragraphs: [
          "Each piece is wrapped in tissue inside a House of Kaira garment bag and placed in a protective box, so it arrives just as it should.",
          "If you are renting, please keep the box and garment bag safe: your piece goes back to us in them."
        ]
      },
      {
        id: "a-where",
        question: "Can you deliver to a hotel, a venue or another city?",
        tag: { text: "Anywhere in India", tone: "yes" },
        keywords: "hotel venue destination wedding another city different address deliver where outstation travel",
        paragraphs: [
          "Yes. We deliver anywhere in India our delivery partners reach, including your hotel or venue for a destination wedding. Just add the name and phone number of the person receiving it.",
          "For a rental, we collect it from the same place on your Return Date, unless you let us know otherwise before then. For some high value pieces, we may first ask for ID, as our Deposit Policy explains.",
          "Would you rather take your piece with you? We can plan for that too."
        ],
        pageLinks: [{ text: "Deposit Policy", pageKey: "deposit-policy" }],
        links: [{ text: "We can plan for that too", target: "q:w-dates" }]
      },
      {
        id: "a-receive",
        question: "Does someone need to be there to receive it?",
        tag: null,
        keywords: "someone home receive accept delivery available sign person",
        paragraphs: [
          "Yes, please. Your piece is handed over in person, so you, or the person named on your order, will need to be there to receive it. If you know you will be away, tell us before dispatch and we will arrange a better time, or someone else to receive it."
        ]
      },
      {
        id: "a-missed",
        question: "I missed my delivery",
        tag: null,
        keywords: "missed delivery not home failed attempt redelivery second delivery charge",
        paragraphs: [
          "Message us straight away and we will arrange a second delivery. If the first attempt was missed because no one was available, a redelivery charge applies: our delivery partner's charge to us, plus GST, shown to you before it is booked.",
          "For a rental, if a second delivery cannot reach you before your celebration, the rental fee cannot be refunded, as our Refund & Cancellation Policy explains. Your deposit comes back in full once the piece is back with us, unworn."
        ],
        pageLinks: [{ text: "Refund & Cancellation Policy", pageKey: "refund-policy" }]
      },
      {
        id: "a-address",
        question: "Can I change my delivery address?",
        tag: null,
        keywords: "change address update wrong address redirect",
        paragraphs: [
          "Yes, as long as your piece has not been dispatched. Message us with your order number and the new address. Once it is on its way, we will do our best, though a change cannot always be made."
        ]
      },
      {
        id: "a-check",
        question: "What should I check when my piece arrives?",
        tag: { text: `Within ${SHIPPING_TOKENS.issue_window}`, tone: "mid" },
        keywords: "check arrival inspect try on not right fit wrong missing report",
        paragraphs: [
          `Open it as soon as you can and try it on. If anything is not right, whether it does not fit, is not as described, is the wrong piece or is missing something the listing includes, message us within ${SHIPPING_TOKENS.issue_window} of delivery with photographs, so we can help while there is still time.`,
          "How to look after your piece from there is in our Care, Cleaning & Damage Policy."
        ],
        pageLinks: [{ text: "Care, Cleaning & Damage Policy", pageKey: "care-policy" }]
      },
      {
        id: "a-damaged",
        question: "The parcel arrived damaged or looks tampered with",
        tag: { text: `Tell us within ${SHIPPING_TOKENS.issue_window}`, tone: "mid" },
        keywords: "parcel damaged box torn tampered opened broken",
        paragraphs: [
          `Take photographs of the packaging before you open it, and message us within ${SHIPPING_TOKENS.issue_window} of delivery. If you can, record a short video as you unpack it, which helps us settle things with our delivery partner quickly.`,
          "If the piece itself has been harmed, we replace it if we can reach you in time, or refund you in full, as our Refund & Cancellation Policy explains."
        ],
        pageLinks: [{ text: "Refund & Cancellation Policy", pageKey: "refund-policy" }]
      },
      {
        id: "a-refuse",
        question: "Can I refuse the parcel at the door?",
        tag: null,
        keywords: "refuse parcel reject delivery door return to sender",
        paragraphs: [
          "You can, but refusing a parcel counts as cancelling after dispatch, which our Refund & Cancellation Policy covers.",
          "If you are refusing it because the parcel looks damaged or tampered with, take a photograph and message us straight away. That is different, and we will look after you."
        ],
        pageLinks: [{ text: "Refund & Cancellation Policy", pageKey: "refund-policy" }],
        links: [{ text: "we will look after you", target: "q:a-damaged" }]
      }
    ]
  },
  {
    num: "05",
    id: "s-return",
    barLabel: "Returns",
    titlePrefix: "Sending a rental ",
    italicWord: "back",
    desc: "How your piece goes back to us, and when it counts as on time.",
    questions: [
      {
        id: "r-how",
        question: "How does my rental go back?",
        tag: { text: "We collect it", tone: "yes" },
        keywords: "return send back how pickup collect courier drop off office label",
        paragraphs: [
          "We book a pickup from your door for your Return Date, the day after your celebration, and confirm the time with you on WhatsApp. Simply pack your piece as it arrived and hand it to our delivery partner.",
          "If it suits you better, you can drop it at our delivery partner's nearest office instead, using the prepaid label in your packaging. Either way, keep the receipt you are given until your deposit is back."
        ]
      },
      {
        id: "r-pack",
        question: "How do I pack it?",
        tag: null,
        keywords: "pack packing how return box garment bag tissue clean wash steam",
        paragraphs: [
          "Just as it arrived: wrapped in its tissue, in its garment bag, inside its box, with every part of the outfit and anything else that came with it.",
          "Please do not wash, steam or clean it first. Professional cleaning after every rental is taken care of by us, and home remedies can harm delicate work. Our Care, Cleaning & Damage Policy explains more."
        ],
        pageLinks: [{ text: "Care, Cleaning & Damage Policy", pageKey: "care-policy" }]
      },
      {
        id: "r-ontime",
        question: "When does my piece count as returned on time?",
        tag: { text: "Handed over by your Return Date", tone: "mid" },
        keywords: "on time return date deadline counts when late",
        paragraphs: [
          "When it is handed to our delivery partner, at your door or at their office, on or before your Return Date. The time it then spends on its way to us is never counted against you."
        ]
      },
      {
        id: "r-resp",
        question: "Who is responsible for the piece on its way back?",
        tag: { text: "We are", tone: "yes" },
        keywords: "responsible journey back lost in transit receipt who after handover",
        paragraphs: [
          "We are, from the moment you hand it to our delivery partner and receive a receipt. If anything happens to it after that, you are never charged for it. That is why the receipt matters: please keep it until your deposit is back."
        ]
      },
      {
        id: "r-missed",
        question: "I missed my pickup",
        tag: null,
        keywords: "missed pickup slot not home reschedule second pickup charge",
        paragraphs: [
          "Simply message us and we will arrange a second pickup, or you are welcome to drop the piece off at our delivery partner's office instead, at no cost.",
          "If the first pickup was missed because no one was available, a re-pickup charge applies to the second one: our delivery partner's charge to us, plus GST, shown to you before it is booked. This is not a late return charge, because you are not keeping the piece to wear it."
        ]
      },
      {
        id: "r-ourlate",
        question: "The pickup was late on your side",
        tag: { text: "No charge", tone: "yes" },
        keywords: "pickup late delayed your side courier did not come",
        paragraphs: [
          "You are never charged. Late charges only apply when a return is held up on your side, never when we or our delivery partner are running late."
        ]
      },
      {
        id: "r-late",
        question: "What if I return it late?",
        tag: { text: "Daily rate plus GST", tone: "no" },
        keywords: "late return extra day fee charge delay keep longer",
        paragraphs: [
          `Each extra day is charged at the piece's daily rate plus ${SHIPPING_TOKENS.gst_rental} GST, exactly like an extra day of rental, because someone else may be waiting for it. Our Deposit Policy explains how it is settled.`,
          "If you think you may be late, please tell us before your Return Date. An extension costs the same and keeps everyone's plans on track."
        ],
        pageLinks: [{ text: "Deposit Policy", pageKey: "deposit-policy" }],
        links: [{ text: "An extension", target: "q:w-extra" }]
      },
      {
        id: "r-label",
        question: "I have lost the return label or garment bag",
        tag: null,
        keywords: "lost label garment bag packaging print copy misplaced",
        paragraphs: [
          "Your return label comes printed in your packaging. If it goes missing, simply message us and we will send you a copy to print. Any clean, sturdy bag will do for the journey back."
        ]
      },
      {
        id: "r-notret",
        question: "When is a piece treated as not returned?",
        tag: { text: `After ${SHIPPING_TOKENS.not_returned_after}`, tone: "no" },
        keywords: "not returned kept never sent back how long days",
        paragraphs: [
          `If it has not been handed to our delivery partner ${SHIPPING_TOKENS.not_returned_after} after your Return Date, and you have not agreed a new date with us, it is treated as not returned. We will always try to reach you before then, and our Deposit Policy explains what follows.`
        ],
        pageLinks: [{ text: "Deposit Policy", pageKey: "deposit-policy" }]
      }
    ]
  },
  {
    num: "06",
    id: "s-abroad",
    barLabel: "Outside India",
    titlePrefix: "Beyond ",
    italicWord: "India",
    desc: "Preloved pieces travel the world. Rentals are delivered within India, and can travel with you when we plan it together.",
    questions: [
      {
        id: "i-where",
        question: "Do you deliver outside India?",
        tag: { text: "Preloved, worldwide", tone: "yes" },
        keywords: "international outside india abroad overseas ship worldwide countries",
        paragraphs: [
          "Yes, for preloved pieces: we ship them worldwide. The delivery charge for your country is shown at checkout, before you pay.",
          "Rentals are delivered within India, though a rental can travel with you when we plan it together."
        ],
        links: [{ text: "travel with you", target: "q:i-rentabroad" }]
      },
      {
        id: "i-cost",
        question: "How much does international delivery cost?",
        tag: { text: "Quoted before you pay", tone: "mid" },
        keywords: "international delivery cost shipping price abroad fee",
        paragraphs: [
          "It depends on the country and the weight of your piece, so it is quoted for your address at checkout, before you pay. International delivery is never part of free delivery."
        ]
      },
      {
        id: "i-duties",
        question: "Will I pay customs duties?",
        tag: { text: "Paid on arrival", tone: "no" },
        keywords: "customs duties import taxes vat tariff fees international",
        paragraphs: [
          "Customs duties and import taxes are set by the country your piece is going to, and are paid by you when it arrives. They are not part of your order total, and we cannot predict them exactly, so it is worth checking with your local customs office before you order."
        ]
      },
      {
        id: "i-time",
        question: "How long does international delivery take?",
        tag: { text: `Within ${SHIPPING_TOKENS.intl_delivery}`, tone: "mid" },
        keywords: "international how long delivery time days abroad customs faster express urgent sooner quick",
        paragraphs: [
          `Your piece reaches you within ${SHIPPING_TOKENS.intl_delivery} of leaving us, though customs in some countries can occasionally add a few days.`,
          "It leaves us on the same timeline as any preloved order, and a little later if it is kept by its owner, so do allow for that when you order.",
          "Need it sooner? Faster international delivery is available at an extra charge, quoted for your country before you pay."
        ],
        links: [
          { text: "any preloved order", target: "q:p-when" },
          { text: "kept by its owner", target: "q:p-owner" }
        ]
      },
      {
        id: "i-see",
        question: "Can I see the piece properly before it is sent abroad?",
        tag: { text: "Video call or photographs", tone: "yes" },
        keywords: "see view video call real photos pictures images light lighting condition before dispatch inspect check trust record recording abroad international",
        paragraphs: [
          "Yes, and we would love you to. Before any piece leaves for another country, we show it to you however you would like: on a video call, in photographs taken in different light, or up close on any detail you want to see. We tell you honestly about its condition, too.",
          "A journey back across borders is a long one, and every journey has a footprint, so we would much rather you are completely sure before your piece travels. With your permission, we record the call, so we both have a record of exactly what you were shown."
        ]
      },
      {
        id: "i-issue",
        question: "What if something is not right with an international order?",
        tag: { text: "Full refund", tone: "yes" },
        keywords: "international problem not as described wrong return abroad refund different condition",
        paragraphs: [
          `It rarely happens, because you will have seen your piece properly before it leaves us. If what arrives still does not match what we showed and told you, message us within ${SHIPPING_TOKENS.issue_window} of delivery with photographs, just as for any order.`,
          "We will refund you in full and arrange your piece's journey back to us, at our cost.",
          "Customs duties and import taxes are charged by your country, not by us, so we are unable to refund them."
        ],
        links: [{ text: "seen your piece properly", target: "q:i-see" }]
      },
      {
        id: "i-rentabroad",
        question: "Can I take a rental abroad?",
        tag: { text: "Ask us first", tone: "mid" },
        keywords: "take rental abroad travel travelling overseas destination wedding outside india carry outstation journey",
        paragraphs: [
          "Rentals are delivered within India, but if your celebration is abroad, we would love to help you make it work. Message us before you book with your dates and where you are travelling, and we will work out the right window for your journey with you.",
          "Your piece is still delivered and collected within India, so the window simply covers your time away."
        ]
      }
    ]
  },
  {
    num: "07",
    id: "s-onus",
    barLabel: "When it is on us",
    titlePrefix: "When it is on ",
    italicWord: "us",
    desc: "If we or our delivery partner let you down, you never pay for it.",
    questions: [
      {
        id: "o-late",
        question: "My rental did not arrive in time for my celebration",
        tag: { text: "Full refund", tone: "yes" },
        keywords: "late delivery did not arrive in time missed event delayed after celebration",
        paragraphs: [
          "If your piece reaches you after your celebration because of us or our delivery partner, you receive a full refund of your rental fee and delivery charges, and your deposit in full.",
          "If it arrives later than promised but still before your celebration, tell us and we will make it right, as our Refund & Cancellation Policy explains."
        ],
        pageLinks: [{ text: "Refund & Cancellation Policy", pageKey: "refund-policy" }]
      },
      {
        id: "o-lost",
        question: "My parcel was lost on its way to me",
        tag: { text: "Full refund", tone: "yes" },
        keywords: "courier lost parcel never arrived missing delivery transit",
        paragraphs: [
          `Then it is entirely on us. You are refunded in full, delivery charges included, and if you have already paid a deposit, it comes back in full within ${SHIPPING_TOKENS.deposit_refund_window} of the loss being confirmed.`,
          "For a rental, we will also do everything we can to find you something just as beautiful in time."
        ]
      },
      {
        id: "o-wrong",
        question: "I received the wrong piece",
        tag: null,
        keywords: "wrong piece different item mistake received incorrect",
        paragraphs: [
          "Please message us straight away with a photograph, and do not wear it. We put it right as our Refund & Cancellation Policy explains, and you never pay for our mistake: the journey back is on us, and nothing is ever taken from your deposit."
        ],
        pageLinks: [{ text: "Refund & Cancellation Policy", pageKey: "refund-policy" }]
      },
      {
        id: "o-dispatch",
        question: "My preloved piece has not left you by the date you gave",
        tag: null,
        keywords: "preloved not dispatched late delayed dispatch date missed",
        paragraphs: [
          "We are so sorry. Some pieces stay with their owners until they find a new home, and once in a while something unforeseen holds one up on its way to us. If that happens, we will let you know straight away, keep you updated until it reaches you, and do everything we can to speed it on its way.",
          "If you would rather not wait, you can cancel for a full refund."
        ]
      },
      {
        id: "o-unhappy",
        question: "I am not happy with how my delivery was handled",
        tag: null,
        keywords: "unhappy complaint escalate grievance officer not happy delivery",
        paragraphs: [
          `We are sorry to hear that, and we would like to put it right. Reply on WhatsApp or email ${SHIPPING_TOKENS.support_email}, and we will look into it with care.`,
          `For a formal complaint, please write to our Grievance Officer, whose details are on our Contact page. We acknowledge every complaint within ${SHIPPING_TOKENS.grievance_ack} and aim to resolve it within ${SHIPPING_TOKENS.grievance_resolve}.`
        ],
        pageLinks: [{ text: "Contact page", pageKey: "contact" }]
      },
      {
        id: "o-rights",
        question: "Does this policy affect my legal rights?",
        tag: null,
        keywords: "legal rights consumer law terms conditions policy changes",
        paragraphs: [
          "No. This page explains how we deliver, and nothing in it limits your rights under Indian consumer law. Where this page and our Terms & Conditions ever differ, the Terms apply.",
          "The policy in place when you place your order is the one that applies to it, and the date this page was last reviewed is shown at the bottom."
        ],
        pageLinks: [{ text: "Terms & Conditions", pageKey: "terms" }]
      }
    ]
  }
];

export const SHIPPING_RELATED_POLICIES = [
  { key: "refund-policy", label: "Refund & Cancellation Policy", path: "/refunds" },
  { key: "deposit-policy", label: "Deposit Policy", path: "/deposit" },
  { key: "care-policy", label: "Care, Cleaning & Damage Policy", path: "/care-policy" },
  { key: "terms", label: "Terms & Conditions", path: "/terms" },
  { key: "seller-guidelines", label: "Seller Guidelines", path: "/seller-guidelines" },
  { key: "faq", label: "Help & FAQs", path: "/faqs" }
];

export const SHIPPING_FINE_PRINT = {
  text: "This page explains how we deliver, in plain words. Where it ever differs from our Terms & Conditions, the Terms apply. Last reviewed 10 October 2026.",
  printAction: "Print or save as PDF"
};

export const SHIPPING_CLOSING_BAND = {
  eyebrow: "We are here for you",
  titlePrefix: "Can't find your ",
  italicWord: "answer?",
  paragraph:
    "Every celebration is planned a little differently. If your question is not covered here, or you would like help choosing dates around your functions, message us. We would much rather help you directly than have you worry, and nothing is too small to ask.",
  signOff: "With love, the House of Kaira team",
  buttons: [
    {
      label: "Message us on WhatsApp",
      type: "whatsapp",
      greeting: "Hello House of Kaira, I have a question about delivery."
    },
    {
      label: "Write to us",
      type: "email",
      email: SHIPPING_TOKENS.support_email,
      subject: "A question about delivery"
    }
  ],
  channels: [
    {
      name: "WhatsApp",
      detail:
        "The fastest way to reach us. Seven days a week, 10 AM to 8 PM IST, with replies usually within 2 hours.",
      actionLabel: "Start a chat",
      type: "whatsapp",
      greeting: "Hello House of Kaira, I have a question about delivery."
    },
    {
      name: "Email",
      detail: `${SHIPPING_TOKENS.support_email}. Best when you want to send photographs of a parcel or a piece.`,
      actionLabel: "Send an email",
      type: "email",
      email: SHIPPING_TOKENS.support_email,
      subject: "A question about delivery"
    },
    {
      name: "Every delivery, in one place",
      detail:
        "Follow each order and booking, with its dates and tracking, in My Account.",
      actionLabel: "Go to my account",
      type: "link",
      path: "/account"
    }
  ]
};
