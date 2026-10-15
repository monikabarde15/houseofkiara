// src/data/pricing/pricingRegistry.js
// Complete registry for House of Kaira Pricing & Fees specification (Spec v2)
// Exactly 13 sections, 52 questions matching Section 9 Copy Deck

import { PRICING_TOKENS } from "./pricingSettings";

export const PRICING_BREADCRUMBS = [
  { label: "Home", path: "/" },
  { label: "Support", path: "/faqs" },
  { label: "Pricing & Fees", path: "/pricing-fees" },
];

export const PRICING_HERO = {
  eyebrow: "CLEAR FROM THE START",
  titlePrefix: "Pricing & ",
  italicWord: "fees",
  subtitle:
    "Every price, every charge and every share, explained plainly for renting, buying and listing with us, so that nothing ever comes as a surprise.",
};

export const PRICING_POPULAR_QUERIES = [
  { id: "r-price", side: "pay", text: "How is a rental priced?" },
  { id: "c-free", side: "pay", text: "When is delivery free?" },
  { id: "x-late", side: "pay", text: "What does a late return cost?" },
  { id: "e-how", side: "earn", text: "How is my share decided?" },
];

export const PRICING_LEDGER = {
  tabs: [
    { id: "pay", label: "Renting or buying", title: "What you pay" },
    { id: "earn", label: "Listing your pieces", title: "What you earn" },
  ],
  pay: {
    title: "Every charge, at a glance",
    hint: "Each piece shows its own prices before you book or buy.",
    columnHeaders: ["Renting", "Buying preloved"],
    rows: [
      {
        name: "The piece",
        rental: {
          figure: "One price for 3 days",
          line: "Your standard rental window: it arrives the day before your celebration and goes back the day after.",
          targetId: "r-price",
        },
        preloved: {
          figure: "The price shown",
          line: "Or the offer we accept from you.",
          targetId: "p-price",
        },
      },
      {
        name: "Extra days",
        rental: {
          figure: "The daily rate, per day",
          line: "Shown on every piece. Add days when you book, or keep it longer if it is free.",
          targetId: "r-extra",
        },
        preloved: {
          figure: "Not applicable",
          line: "(not applicable)",
          targetId: null,
          isNa: true,
        },
      },
      {
        name: "GST",
        rental: {
          figure: "18% on the rental fee",
          line: "Added at checkout, and shown before you pay.",
          targetId: "r-gst",
        },
        preloved: {
          figure: "5% on the price",
          line: "Added at checkout, and shown before you pay.",
          targetId: "p-price",
        },
      },
      {
        name: "Deposit",
        rental: {
          figure: "Refundable, set for each piece",
          line: "Shown before you book and paid separately. It carries no GST.",
          targetId: "d-what",
        },
        preloved: {
          figure: "None",
          line: "(not applicable)",
          targetId: null,
          isNa: true,
        },
      },
      {
        name: "Delivery in India",
        rental: {
          figure: "Free from ₹5,000",
          line: "Covering both journeys. On smaller orders, quoted at checkout.",
          targetId: "c-free",
        },
        preloved: {
          figure: "Free from ₹5,000",
          line: "On smaller orders, quoted at checkout.",
          targetId: "c-free",
        },
      },
      {
        name: "Faster delivery",
        rental: {
          figure: "Quoted before you pay",
          line: "Express, or the same day within Indore.",
          targetId: "c-express",
        },
        preloved: {
          figure: "Quoted before you pay",
          line: "Express, the same day within Indore, or anywhere in the world.",
          targetId: "c-intl",
        },
      },
      {
        name: "Cleaning and care",
        rental: {
          figure: "Always included",
          line: "Professional cleaning before and after every rental.",
          targetId: "r-included",
        },
        preloved: {
          figure: "Always included",
          line: "Checked and pressed, and professionally cleaned if it has been worn.",
          targetId: "p-included",
        },
      },
      {
        name: "Changing your mind",
        rental: {
          figure: "Free until 7 days before it starts",
          line: "With everything refunded. Closer to your dates, see what applies.",
          targetId: "k-rent-early",
        },
        preloved: {
          figure: "Free until it is dispatched",
          line: "Then a final sale, unless it is not as described.",
          targetId: "k-pre",
        },
      },
    ],
    footText:
      "No convenience fee, no platform fee, and nothing extra for paying by card or UPI. ",
    footLinkText: "Every way to pay",
    footTargetId: "y-ways",
  },
  earn: {
    title: "Your earnings, at a glance",
    hint: "Every share is agreed with you, piece by piece.",
    rows: [
      {
        name: "Your share",
        figure: "Set for each piece",
        line:
          "By its value and the work it takes to rent or sell it, so that you recover a meaningful part of what you invested.",
        targetId: "e-how",
      },
      {
        name: "Never part of it",
        figure: "GST, deposits and delivery",
        line: "And our promo codes never reduce your share.",
        targetId: "e-on",
      },
      {
        name: "Listing your piece",
        figure: "Free",
        line:
          "Collection, photography, cleaning and every delivery to renters and buyers are on us.",
        targetId: "e-free",
      },
      {
        name: "When you are paid",
        figure: "Within 3 working days",
        line:
          "Once a rental is back with us and inspected, or once a buyer has received the piece.",
        targetId: "e-when",
      },
      {
        name: "Where it goes",
        figure: "Your own account",
        line:
          "A bank account or UPI ID in your name, with a statement for every payout.",
        targetId: "e-where",
      },
      {
        name: "Costs that can be yours",
        figure: "Only four, each agreed first",
        line:
          "A repair to make it ready, an early return, a missed collection, or delivery when you borrow it back.",
        targetId: "e-costs",
      },
    ],
    footText:
      "Your share and your prices are confirmed in your piece's Listing Terms before it goes live, as our ",
    footLinkText: "Seller Guidelines",
    footPath: "/seller-guidelines",
  },
};

export const PRICING_SIDE_INTROS = {
  pay:
    "Every rental is priced for its window, and every preloved piece at the price agreed with its owner. GST is added at checkout, standard delivery is free on every order of ₹5,000 or more, and a deposit is simply held in safekeeping until your piece is home with us.",
  earn:
    "When your piece is rented or sold, you receive a share of what it earns, agreed with you for that piece before it goes live, so that you recover a meaningful part of what you invested in it. Listing is free, and your earnings reach your own account within 3 working days.",
};

export const PRICING_WORKED_EXAMPLES = {
  titlePrefix: "Your order, in ",
  italicWord: "numbers",
  subline:
    "One rental and one preloved piece, added up line by line. Every piece shows its own prices before you book or buy.",
  examples: [
    {
      id: "rental",
      tabLabel: "A rental",
      lead:
        "A bridal lehenga priced at ₹18,000 for its standard window of 3 days, with a daily rate of ₹3,500 and a deposit of ₹20,000.",
      choiceLabel: "DAYS OF CELEBRATIONS",
      choices: [
        { id: "one", label: "One day", extraDays: 0 },
        { id: "two", label: "Two days", extraDays: 1, isDefault: true },
        { id: "three", label: "Three days", extraDays: 2 },
      ],
      windowPrice: 18000,
      dailyRate: 3500,
      depositAmount: 20000,
      note:
        "If it comes back after its Return Date, each late day costs ₹3,500 plus GST, exactly like an extra day.",
      depositNote:
        "Returned within 3 to 5 business days of inspection, to the account it came from.",
    },
    {
      id: "preloved",
      tabLabel: "A preloved piece",
      lead:
        "A designer saree listed at ₹60,000, on which an offer of ₹54,000 has been accepted.",
      choiceLabel: "BOUGHT AT",
      choices: [
        { id: "list", label: "The listed price", price: 60000, isDefault: true },
        { id: "offer", label: "The accepted offer", price: 54000 },
      ],
      note: "No deposit, and nothing more to pay once it is yours.",
    },
  ],
};

export const PRICING_SECTION_BAR_ITEMS = {
  pay: [
    { id: "numbers", label: "In numbers", tooltip: "Your order, in numbers" },
    { id: "s-renting", label: "Renting", tooltip: "Renting a piece" },
    { id: "s-preloved", label: "Preloved", tooltip: "Buying preloved" },
    { id: "s-deposit", label: "Deposit", tooltip: "Your deposit" },
    { id: "s-delivery", label: "Delivery", tooltip: "Delivery charges" },
    { id: "s-extras", label: "Extra days", tooltip: "Extra days and late returns" },
    { id: "s-cancel", label: "Cancellations", tooltip: "Cancellations and refunds" },
    { id: "s-damage", label: "Damage and loss", tooltip: "If something happens" },
    { id: "s-paying", label: "Paying", tooltip: "How you pay" },
  ],
  earn: [
    { id: "s-share", label: "Your share", tooltip: "Your share" },
    { id: "s-costs", label: "Costs", tooltip: "What listing costs" },
    { id: "s-payouts", label: "Payouts", tooltip: "Your payouts" },
    { id: "s-tax", label: "Tax", tooltip: "Tax and your PAN" },
    { id: "s-prices", label: "Prices and offers", tooltip: "Prices and offers" },
  ],
};

export const PRICING_SECTIONS = [
  {
    "id": "s-renting",
    "side": "pay",
    "number": "01",
    "title": "Renting a piece",
    "italic": "piece",
    "barLabel": "Renting",
    "summary": "How a rental is priced, and everything its price includes.",
    "questions": [
      {
        "id": "r-price",
        "side": "pay",
        "sectionId": "s-renting",
        "question": "How is a rental priced?",
        "tag": {
          "text": "One price for 3 days",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Every rental piece has one price for its standard rental window of 3 days: it arrives the day",
        "content": [
          {
            "type": "paragraph",
            "text": "Every rental piece has one price for its standard rental window of 3 days: it arrives the day"
          },
          {
            "type": "paragraph",
            "text": "before your celebration, is yours for the day itself, and goes back the day after. Here is how the window works"
          },
          {
            "type": "paragraph",
            "text": "[opens page shipping-policy]."
          },
          {
            "type": "paragraph",
            "text": "Each piece also has a daily rate for every additional day, shown on its page. Both are set for each piece, by its"
          },
          {
            "type": "paragraph",
            "text": "designer, its value and its condition, and your booking summary adds everything up before you pay."
          }
        ],
        "keywords": [
          "price",
          "rental",
          "cost",
          "how",
          "much",
          "window",
          "daily",
          "rate",
          "days",
          "per",
          "day",
          "charge",
          "fee",
          "priced"
        ]
      },
      {
        "id": "r-extra",
        "side": "pay",
        "sectionId": "s-renting",
        "question": "How do extra days work?",
        "tag": {
          "text": "Daily rate per day",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Simply add one extra day for each additional day of celebrations, at the piece's daily rate. With a haldi and sangeet",
        "content": [
          {
            "type": "paragraph",
            "text": "Simply add one extra day for each additional day of celebrations, at the piece's daily rate. With a haldi and sangeet"
          },
          {
            "type": "paragraph",
            "text": "on one day and the wedding the next, you would book your standard 3 days plus 1 extra day."
          },
          {
            "type": "paragraph",
            "text": "See it in numbers [scrolls to In numbers]."
          },
          {
            "type": "paragraph",
            "text": "Once your piece is with you, you can still ask to keep it longer [opens answer x-extend]. If no one has booked it"
          },
          {
            "type": "paragraph",
            "text": "straight after you, each extra day costs the same daily rate."
          }
        ],
        "keywords": [
          "extra",
          "days",
          "longer",
          "extend",
          "extension",
          "more",
          "days",
          "wedding",
          "functions",
          "haldi",
          "sangeet",
          "mehendi",
          "multiple",
          "add",
          "week"
        ]
      },
      {
        "id": "r-included",
        "side": "pay",
        "sectionId": "s-renting",
        "question": "What is included in the rental price?",
        "tag": {
          "text": "Always included",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Everything that keeps the piece at its best, and everything you need to enjoy it:",
        "content": [
          {
            "type": "paragraph",
            "text": "Everything that keeps the piece at its best, and everything you need to enjoy it:"
          },
          {
            "type": "list",
            "items": [
              "professional cleaning before your rental, and again after it",
              "pressing, careful checks and any small touch-ups",
              "its garment bag and box, wrapped in tissue",
              "a prepaid return label, so sending it back costs nothing more"
            ]
          },
          {
            "type": "paragraph",
            "text": "You never pay for cleaning, and please never clean the piece yourself. Our Care, Cleaning & Damage Policy"
          },
          {
            "type": "paragraph",
            "text": "[opens page care-policy] explains why."
          }
        ],
        "keywords": [
          "included",
          "cleaning",
          "dry",
          "clean",
          "pressing",
          "packaging",
          "garment",
          "bag",
          "box",
          "return",
          "label",
          "what",
          "is",
          "included",
          "free"
        ]
      },
      {
        "id": "r-gst",
        "side": "pay",
        "sectionId": "s-renting",
        "question": "Is GST included in the rental price?",
        "tag": {
          "text": "18% at checkout",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Rental prices are shown before GST. GST at 18% is added to your rental fee at checkout, and you",
        "content": [
          {
            "type": "paragraph",
            "text": "Rental prices are shown before GST. GST at 18% is added to your rental fee at checkout, and you"
          },
          {
            "type": "paragraph",
            "text": "see the exact amount before you pay."
          },
          {
            "type": "paragraph",
            "text": "Your deposit carries no GST, because it is held for you rather than paid to us."
          }
        ],
        "keywords": [
          "gst",
          "tax",
          "included",
          "exclusive",
          "inclusive",
          "18",
          "percent",
          "rental",
          "price"
        ]
      },
      {
        "id": "r-several",
        "side": "pay",
        "sectionId": "s-renting",
        "question": "I am renting several pieces for the same celebration",
        "tag": {
          "text": "One delivery",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Each piece has its own price for the window you share, and every piece booked for the same dates travels",
        "content": [
          {
            "type": "paragraph",
            "text": "Each piece has its own price for the window you share, and every piece booked for the same dates travels"
          },
          {
            "type": "paragraph",
            "text": "together: one delivery and one pickup, counted as one order towards free delivery [opens answer c-free]. Each"
          },
          {
            "type": "paragraph",
            "text": "piece also has its own deposit."
          },
          {
            "type": "paragraph",
            "text": "The price of a preloved piece, offers, and buying from outside India."
          }
        ],
        "keywords": [
          "several",
          "pieces",
          "multiple",
          "outfits",
          "family",
          "same",
          "celebration",
          "together",
          "delivery",
          "each",
          "order"
        ]
      }
    ]
  },
  {
    "id": "s-preloved",
    "side": "pay",
    "number": "02",
    "title": "Buying preloved",
    "italic": "preloved",
    "barLabel": "Preloved",
    "summary": "The price of a preloved piece, offers, and buying from outside India.",
    "questions": [
      {
        "id": "p-price",
        "side": "pay",
        "sectionId": "s-preloved",
        "question": "How is a preloved piece priced?",
        "tag": {
          "text": "5% at checkout",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Every preloved piece has one price, agreed with its owner and shown on its page. It reflects the piece's designer",
        "content": [
          {
            "type": "paragraph",
            "text": "Every preloved piece has one price, agreed with its owner and shown on its page. It reflects the piece's designer"
          },
          {
            "type": "paragraph",
            "text": "and its condition, and every detail of that condition is disclosed alongside it."
          },
          {
            "type": "paragraph",
            "text": "GST at 5% is added at checkout, and you see the exact amount before you pay."
          }
        ],
        "keywords": [
          "preloved",
          "price",
          "how",
          "priced",
          "cost",
          "value",
          "resale",
          "second",
          "hand",
          "gst",
          "tax",
          "5",
          "percent"
        ]
      },
      {
        "id": "p-offer",
        "side": "pay",
        "sectionId": "s-preloved",
        "question": "Can I make an offer?",
        "tag": {
          "text": "Preloved only",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Yes, on any preloved piece. Offers are never taken on rentals.",
        "content": [
          {
            "type": "paragraph",
            "text": "Yes, on any preloved piece. Offers are never taken on rentals."
          },
          {
            "type": "paragraph",
            "text": "Name your price on the piece's page, and our team replies within 24 hours. If we accept your offer,"
          },
          {
            "type": "paragraph",
            "text": "it becomes your price, and GST and delivery are added at checkout in the usual way."
          },
          {
            "type": "paragraph",
            "text": "An offer does not reserve the piece, so it stays available to others until a purchase is complete."
          }
        ],
        "keywords": [
          "offer",
          "make",
          "an",
          "offer",
          "negotiate",
          "bargain",
          "lower",
          "price",
          "quote",
          "counter",
          "name",
          "your",
          "price"
        ]
      },
      {
        "id": "p-included",
        "side": "pay",
        "sectionId": "s-preloved",
        "question": "Is cleaning included when I buy a preloved piece?",
        "tag": {
          "text": "Always included",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Yes. Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed. A piece",
        "content": [
          {
            "type": "paragraph",
            "text": "Yes. Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed. A piece"
          },
          {
            "type": "paragraph",
            "text": "that has never been worn is checked and pressed instead of cleaned, so it stays exactly as new."
          }
        ],
        "keywords": [
          "preloved",
          "cleaned",
          "cleaning",
          "pressed",
          "checked",
          "packed",
          "included",
          "condition",
          "unworn"
        ]
      },
      {
        "id": "p-abroad",
        "side": "pay",
        "sectionId": "s-preloved",
        "question": "I am buying from outside India",
        "tag": {
          "text": "Prices in rupees",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "the amount and may add a charge of its own.",
        "content": [
          {
            "type": "paragraph",
            "text": "the amount and may add a charge of its own."
          },
          {
            "type": "paragraph",
            "text": "International delivery is quoted for your country at checkout, and customs duties and import taxes are paid by you"
          },
          {
            "type": "paragraph",
            "text": "when your piece arrives. Before any piece travels abroad, we show it to you properly first, as our Shipping &"
          },
          {
            "type": "paragraph",
            "text": "Delivery Policy [opens page shipping-policy] explains."
          },
          {
            "type": "paragraph",
            "text": "Held in safekeeping while a rental is in your care, and returned once it is home with us."
          }
        ],
        "keywords": [
          "international",
          "abroad",
          "outside",
          "india",
          "overseas",
          "currency",
          "dollars",
          "pounds",
          "customs",
          "duty",
          "import",
          "tax",
          "foreign",
          "card"
        ]
      }
    ]
  },
  {
    "id": "s-deposit",
    "side": "pay",
    "number": "03",
    "title": "Your deposit",
    "italic": "deposit",
    "barLabel": "Deposit",
    "summary": "Held in safekeeping while a rental is in your care, and returned once it is home with us.",
    "questions": [
      {
        "id": "d-what",
        "side": "pay",
        "sectionId": "s-deposit",
        "question": "How much is the deposit?",
        "tag": {
          "text": "Set for each piece",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Each rental piece has its own deposit, set to protect it and shown on its page before you book. It is held in",
        "content": [
          {
            "type": "paragraph",
            "text": "Each rental piece has its own deposit, set to protect it and shown on its page before you book. It is held in"
          },
          {
            "type": "paragraph",
            "text": "safekeeping while the piece is in your care, and returned once it is home with us."
          },
          {
            "type": "paragraph",
            "text": "It is never a charge: it carries no GST, and it is never put towards your rental fee."
          }
        ],
        "keywords": [
          "deposit",
          "security",
          "how",
          "much",
          "amount",
          "refundable",
          "gst"
        ]
      },
      {
        "id": "d-pay",
        "side": "pay",
        "sectionId": "s-deposit",
        "question": "When and how do I pay the deposit?",
        "tag": {
          "text": "Paid separately",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Separately from your order, never at checkout. Our team arranges it with you on WhatsApp, and you pay it by UPI",
        "content": [
          {
            "type": "paragraph",
            "text": "Separately from your order, never at checkout. Our team arranges it with you on WhatsApp, and you pay it by UPI"
          },
          {
            "type": "paragraph",
            "text": "or bank transfer, 10 days before your piece is dispatched. For a booking made closer to the"
          },
          {
            "type": "paragraph",
            "text": "date, it is due within 48 hours of our request, and always before dispatch."
          },
          {
            "type": "paragraph",
            "text": "Cash is welcome only for bookings made in person with us in Indore. We confirm receipt in writing within 48 hours"
          },
          {
            "type": "paragraph",
            "text": "."
          }
        ],
        "keywords": [
          "deposit",
          "pay",
          "when",
          "how",
          "upi",
          "bank",
          "transfer",
          "cash",
          "whatsapp",
          "due",
          "before",
          "dispatch",
          "checkout"
        ]
      },
      {
        "id": "d-back",
        "side": "pay",
        "sectionId": "s-deposit",
        "question": "When is my deposit returned?",
        "tag": {
          "text": "Within 3 to 5 business days",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Within 3 to 5 business days of your piece being inspected on its return, and always to the",
        "content": [
          {
            "type": "paragraph",
            "text": "Within 3 to 5 business days of your piece being inspected on its return, and always to the"
          },
          {
            "type": "paragraph",
            "text": "account it came from. If all is well, it comes back in full."
          }
        ],
        "keywords": [
          "deposit",
          "back",
          "refund",
          "return",
          "when",
          "how",
          "long",
          "account"
        ]
      },
      {
        "id": "d-deduct",
        "side": "pay",
        "sectionId": "s-deposit",
        "question": "Can anything be taken from my deposit?",
        "tag": {
          "text": "Only beyond normal wear",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Only what a rental genuinely leaves behind: late days [opens answer x-late] at the daily rate, or the cost of",
        "content": [
          {
            "type": "paragraph",
            "text": "Only what a rental genuinely leaves behind: late days [opens answer x-late] at the daily rate, or the cost of"
          },
          {
            "type": "paragraph",
            "text": "restoring damage beyond normal wear [opens answer l-damage], decided on evidence. We tell you within 2 days"
          },
          {
            "type": "paragraph",
            "text": "of the piece reaching us, with photographs, and give you 2 days"
          },
          {
            "type": "paragraph",
            "text": "to reply before anything is settled."
          },
          {
            "type": "paragraph",
            "text": "Normal wear, and our cleaning after every rental, are never taken from it. Our Deposit Policy [opens page deposit-"
          },
          {
            "type": "paragraph",
            "text": "policy] explains every step."
          },
          {
            "type": "paragraph",
            "text": "When delivery is on us, and what faster delivery costs."
          }
        ],
        "keywords": [
          "deposit",
          "deduction",
          "deduct",
          "taken",
          "kept",
          "withheld",
          "damage",
          "late",
          "charges"
        ]
      }
    ]
  },
  {
    "id": "s-delivery",
    "side": "pay",
    "number": "04",
    "title": "Delivery charges",
    "italic": "charges",
    "barLabel": "Delivery",
    "summary": "When delivery is on us, and what faster delivery costs.",
    "questions": [
      {
        "id": "c-free",
        "side": "pay",
        "sectionId": "s-delivery",
        "question": "When is delivery free?",
        "tag": {
          "text": "Free from \u20b95,000",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Standard delivery within India is free on every order of \u20b95,000 or more, measured on the price",
        "content": [
          {
            "type": "paragraph",
            "text": "Standard delivery within India is free on every order of \u20b95,000 or more, measured on the price"
          },
          {
            "type": "paragraph",
            "text": "of your pieces before GST. For a rental, that covers both journeys: to you, and back to us."
          },
          {
            "type": "paragraph",
            "text": "Your deposit is not counted towards it, as it is held separately from your order."
          }
        ],
        "keywords": [
          "free",
          "delivery",
          "shipping",
          "threshold",
          "minimum",
          "order",
          "both",
          "ways"
        ]
      },
      {
        "id": "c-below",
        "side": "pay",
        "sectionId": "s-delivery",
        "question": "What does delivery cost on smaller orders?",
        "tag": null,
        "summary": "It is worked out for your delivery address and shown at checkout, before you pay. For a rental, it already covers",
        "content": [
          {
            "type": "paragraph",
            "text": "It is worked out for your delivery address and shown at checkout, before you pay. For a rental, it already covers"
          },
          {
            "type": "paragraph",
            "text": "the journey back to us, so there is nothing more to pay when your piece comes home."
          }
        ],
        "keywords": [
          "delivery",
          "cost",
          "charge",
          "small",
          "order",
          "below",
          "threshold",
          "how",
          "much",
          "shipping",
          "fee"
        ]
      },
      {
        "id": "c-express",
        "side": "pay",
        "sectionId": "s-delivery",
        "question": "What do express and same day delivery cost?",
        "tag": {
          "text": "Quoted before you pay",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "They depend on where your piece is travelling, so we never quote a flat fee. Whenever they are available for your",
        "content": [
          {
            "type": "paragraph",
            "text": "They depend on where your piece is travelling, so we never quote a flat fee. Whenever they are available for your"
          },
          {
            "type": "paragraph",
            "text": "order, you see the exact charge at checkout, before you pay."
          },
          {
            "type": "paragraph",
            "text": "Both are faster services on top of standard delivery, so they are charged even when standard delivery is free."
          },
          {
            "type": "paragraph",
            "text": "Same day delivery is offered within Indore."
          }
        ],
        "keywords": [
          "express",
          "faster",
          "quick",
          "same",
          "day",
          "indore",
          "urgent",
          "delivery",
          "cost",
          "price"
        ]
      },
      {
        "id": "c-intl",
        "side": "pay",
        "sectionId": "s-delivery",
        "question": "What does international delivery cost?",
        "tag": {
          "text": "Quoted for your country",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "It depends on the country and the weight of your piece, so it is quoted for your address at checkout, before you",
        "content": [
          {
            "type": "paragraph",
            "text": "It depends on the country and the weight of your piece, so it is quoted for your address at checkout, before you"
          },
          {
            "type": "paragraph",
            "text": "pay. International delivery is for preloved pieces, and it is never part of free delivery."
          },
          {
            "type": "paragraph",
            "text": "Faster international delivery is available at an extra charge, also quoted before you pay. Customs duties and"
          },
          {
            "type": "paragraph",
            "text": "import taxes are charged by your country, and paid when your piece arrives."
          },
          {
            "type": "paragraph",
            "text": "Keeping a piece longer, returning it late, and missed deliveries or pickups."
          }
        ],
        "keywords": [
          "international",
          "delivery",
          "cost",
          "abroad",
          "worldwide",
          "shipping",
          "price",
          "country",
          "customs"
        ]
      }
    ]
  },
  {
    "id": "s-extras",
    "side": "pay",
    "number": "05",
    "title": "Extra days and late returns",
    "italic": "late returns",
    "barLabel": "Extra days",
    "summary": "Keeping a piece longer, returning it late, and missed deliveries or pickups.",
    "questions": [
      {
        "id": "x-extend",
        "side": "pay",
        "sectionId": "s-extras",
        "question": "I would like to keep my piece a little longer",
        "tag": {
          "text": "Daily rate plus GST",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Message us before your Return Date. If no one has booked the piece straight after you, we extend your rental at",
        "content": [
          {
            "type": "paragraph",
            "text": "Message us before your Return Date. If no one has booked the piece straight after you, we extend your rental at"
          },
          {
            "type": "paragraph",
            "text": "its daily rate, plus 18% GST, for each extra day."
          }
        ],
        "keywords": [
          "keep",
          "longer",
          "extend",
          "extension",
          "extra",
          "day",
          "after",
          "delivery",
          "more",
          "time"
        ]
      },
      {
        "id": "x-late",
        "side": "pay",
        "sectionId": "s-extras",
        "question": "What does a late return cost?",
        "tag": {
          "text": "Daily rate plus GST",
          "tone": "caution",
          "color": "terracotta"
        },
        "summary": "Each extra day is charged at the piece's daily rate plus 18% GST, exactly like an extra day of rental,",
        "content": [
          {
            "type": "paragraph",
            "text": "Each extra day is charged at the piece's daily rate plus 18% GST, exactly like an extra day of rental,"
          },
          {
            "type": "paragraph",
            "text": "because someone else may be waiting for it. There is no separate late fee."
          },
          {
            "type": "paragraph",
            "text": "You are never charged when a delay is ours or our delivery partner's. If a piece has not been handed back 5 days"
          },
          {
            "type": "paragraph",
            "text": "after its Return Date, it is treated as not returned [opens answer l-loss]."
          }
        ],
        "keywords": [
          "late",
          "return",
          "fee",
          "charge",
          "penalty",
          "overdue",
          "delay",
          "extra",
          "day",
          "after",
          "return",
          "date"
        ]
      },
      {
        "id": "x-missed",
        "side": "pay",
        "sectionId": "s-extras",
        "question": "I missed a delivery or a pickup",
        "tag": null,
        "summary": "Simply message us and we will arrange another. If the first was missed because no one was available, the second",
        "content": [
          {
            "type": "paragraph",
            "text": "Simply message us and we will arrange another. If the first was missed because no one was available, the second"
          },
          {
            "type": "paragraph",
            "text": "carries a charge: our delivery partner's charge to us, plus GST, shown to you before it is booked."
          },
          {
            "type": "paragraph",
            "text": "For a pickup, you are also welcome to drop the piece at our delivery partner's nearest office instead, at no cost. A"
          },
          {
            "type": "paragraph",
            "text": "missed pickup is a delivery charge, never a late return."
          }
        ],
        "keywords": [
          "missed",
          "delivery",
          "not",
          "home",
          "redelivery",
          "second",
          "delivery",
          "pickup",
          "missed",
          "re",
          "pickup",
          "charge"
        ]
      },
      {
        "id": "x-change",
        "side": "pay",
        "sectionId": "s-extras",
        "question": "Can I change my dates?",
        "tag": {
          "text": "Usually possible",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Usually, yes, as long as your piece has not been dispatched. Message us with your new dates. If the piece is free,",
        "content": [
          {
            "type": "paragraph",
            "text": "Usually, yes, as long as your piece has not been dispatched. Message us with your new dates. If the piece is free,"
          },
          {
            "type": "paragraph",
            "text": "we move your booking and settle any difference in price, with no charge for the change itself."
          },
          {
            "type": "paragraph",
            "text": "If your celebration has moved rather than been called off, changing your dates is almost always better than"
          },
          {
            "type": "paragraph",
            "text": "cancelling."
          },
          {
            "type": "paragraph",
            "text": "What comes back to you if your plans change, and how quickly."
          }
        ],
        "keywords": [
          "change",
          "dates",
          "move",
          "booking",
          "postpone",
          "reschedule",
          "different",
          "date",
          "swap",
          "piece"
        ]
      }
    ]
  },
  {
    "id": "s-cancel",
    "side": "pay",
    "number": "06",
    "title": "Cancellations and refunds",
    "italic": "refunds",
    "barLabel": "Cancellations",
    "summary": "What comes back to you if your plans change, and how quickly.",
    "questions": [
      {
        "id": "k-rent-early",
        "side": "pay",
        "sectionId": "s-cancel",
        "question": "I cancel a rental more than 7 days before it starts",
        "tag": {
          "text": "Full refund",
          "tone": "good",
          "color": "sage"
        },
        "summary": "You receive a full refund: your rental fee, the GST on it, and any delivery charge you paid. If your deposit has",
        "content": [
          {
            "type": "paragraph",
            "text": "You receive a full refund: your rental fee, the GST on it, and any delivery charge you paid. If your deposit has"
          },
          {
            "type": "paragraph",
            "text": "already been paid, it comes back in full too."
          },
          {
            "type": "paragraph",
            "text": "Your rental starts on the day your piece arrives, the day before your celebration."
          }
        ],
        "keywords": [
          "cancel",
          "rental",
          "early",
          "more",
          "than",
          "week",
          "full",
          "refund"
        ]
      },
      {
        "id": "k-rent-late",
        "side": "pay",
        "sectionId": "s-cancel",
        "question": "I cancel a rental within 7 days of its start, before it is dispatched",
        "tag": {
          "text": "70% refunded",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "By then, your piece has been turned away from everyone else and is being prepared for you. You receive 70%",
        "content": [
          {
            "type": "paragraph",
            "text": "By then, your piece has been turned away from everyone else and is being prepared for you. You receive 70%"
          },
          {
            "type": "paragraph",
            "text": "of your rental fee back, with the GST paid on it, and any delivery charge and deposit"
          },
          {
            "type": "paragraph",
            "text": "in full."
          },
          {
            "type": "paragraph",
            "text": "If your celebration has simply moved, change your dates [opens answer x-change] instead: there is no charge, and"
          },
          {
            "type": "paragraph",
            "text": "nothing is lost."
          }
        ],
        "keywords": [
          "cancel",
          "rental",
          "late",
          "within",
          "week",
          "last",
          "minute",
          "partial",
          "refund",
          "percent"
        ]
      },
      {
        "id": "k-rent-sent",
        "side": "pay",
        "sectionId": "s-cancel",
        "question": "I cancel a rental after it has been dispatched",
        "tag": {
          "text": "No refund",
          "tone": "caution",
          "color": "terracotta"
        },
        "summary": "Once a rental is on its way, it can no longer be cancelled or refunded, as the next celebration is planned around its",
        "content": [
          {
            "type": "paragraph",
            "text": "Once a rental is on its way, it can no longer be cancelled or refunded, as the next celebration is planned around its"
          },
          {
            "type": "paragraph",
            "text": "return. Your deposit comes back as usual, once the piece is home with us."
          },
          {
            "type": "paragraph",
            "text": "If something is wrong when it arrives, message us within 24 hours of delivery, and we will put it"
          },
          {
            "type": "paragraph",
            "text": "right."
          }
        ],
        "keywords": [
          "cancel",
          "after",
          "dispatch",
          "shipped",
          "on",
          "the",
          "way",
          "rental"
        ]
      },
      {
        "id": "k-pre",
        "side": "pay",
        "sectionId": "s-cancel",
        "question": "I cancel a preloved order",
        "tag": {
          "text": "Free until dispatch",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Until your piece is dispatched, you can cancel for a full refund, including GST and delivery.",
        "content": [
          {
            "type": "paragraph",
            "text": "Until your piece is dispatched, you can cancel for a full refund, including GST and delivery."
          },
          {
            "type": "paragraph",
            "text": "Once it is on its way, a preloved purchase is final, as every piece is one of a kind. If it is not as described,"
          },
          {
            "type": "paragraph",
            "text": "message us within 24 hours of delivery, or within 30 days for a flaw that could not"
          },
          {
            "type": "paragraph",
            "text": "have been seen on arrival, and our Refund & Cancellation Policy [opens page refund-policy] applies."
          }
        ],
        "keywords": [
          "cancel",
          "preloved",
          "order",
          "refund",
          "final",
          "sale",
          "return",
          "change",
          "of",
          "mind"
        ]
      },
      {
        "id": "k-we",
        "side": "pay",
        "sectionId": "s-cancel",
        "question": "What if House of Kaira has to cancel?",
        "tag": {
          "text": "Full refund",
          "tone": "good",
          "color": "sage"
        },
        "summary": "You receive everything you paid, automatically. And if we cancel at a time when cancelling yourself would have",
        "content": [
          {
            "type": "paragraph",
            "text": "You receive everything you paid, automatically. And if we cancel at a time when cancelling yourself would have"
          },
          {
            "type": "paragraph",
            "text": "cost you something, we pay you that same amount on top, as our Terms & Conditions [opens page terms] promise."
          }
        ],
        "keywords": [
          "house",
          "of",
          "kaira",
          "cancels",
          "you",
          "cancel",
          "unavailable",
          "compensation",
          "matching"
        ]
      },
      {
        "id": "k-time",
        "side": "pay",
        "sectionId": "s-cancel",
        "question": "How long does a refund take?",
        "tag": {
          "text": "Within 7 to 14 days",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "We start your refund the moment a cancellation is confirmed. It reaches the payment method you used at",
        "content": [
          {
            "type": "paragraph",
            "text": "We start your refund the moment a cancellation is confirmed. It reaches the payment method you used at"
          },
          {
            "type": "paragraph",
            "text": "checkout within 7 to 14 days, depending on your bank. A deposit always goes back to the"
          },
          {
            "type": "paragraph",
            "text": "account it came from."
          },
          {
            "type": "paragraph",
            "text": "Normal wear is never charged. Here is what applies beyond it."
          }
        ],
        "keywords": [
          "refund",
          "how",
          "long",
          "time",
          "days",
          "bank",
          "original",
          "payment",
          "method"
        ]
      }
    ]
  },
  {
    "id": "s-damage",
    "side": "pay",
    "number": "07",
    "title": "If something happens",
    "italic": "happens",
    "barLabel": "Damage and loss",
    "summary": "Normal wear is never charged. Here is what applies beyond it.",
    "questions": [
      {
        "id": "l-wear",
        "side": "pay",
        "sectionId": "s-damage",
        "question": "Will I be charged for normal wear?",
        "tag": {
          "text": "Never charged",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Never. If our regular cleaning and small touch-ups after every rental put it right, it is normal wear, and it is",
        "content": [
          {
            "type": "paragraph",
            "text": "Never. If our regular cleaning and small touch-ups after every rental put it right, it is normal wear, and it is"
          },
          {
            "type": "paragraph",
            "text": "never charged. Natural perspiration is never charged either."
          },
          {
            "type": "paragraph",
            "text": "If it needs specialist stain treatment, a karigar's repair or new materials, or cannot be put right at all, it is damage,"
          },
          {
            "type": "paragraph",
            "text": "and here is what applies [opens answer l-damage]."
          }
        ],
        "keywords": [
          "normal",
          "wear",
          "stain",
          "perspiration",
          "sweat",
          "makeup",
          "charged",
          "loose",
          "thread",
          "crease",
          "what",
          "counts"
        ]
      },
      {
        "id": "l-damage",
        "side": "pay",
        "sectionId": "s-damage",
        "question": "What if my piece is damaged?",
        "tag": {
          "text": "Restoration only",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Tell us straight away, and please do not try to fix it yourself. The cost of restoring it is taken from your deposit,",
        "content": [
          {
            "type": "paragraph",
            "text": "Tell us straight away, and please do not try to fix it yourself. The cost of restoring it is taken from your deposit,"
          },
          {
            "type": "paragraph",
            "text": "decided against the photographs and video we take before dispatch, and shared with you first. It carries no GST,"
          },
          {
            "type": "paragraph",
            "text": "because it restores the piece rather than paying for anything."
          },
          {
            "type": "paragraph",
            "text": "If the cost is more than your deposit, the balance is settled within 7 days of our written statement,"
          },
          {
            "type": "paragraph",
            "text": "once we have talked it through with you. Our Care, Cleaning & Damage Policy [opens page care-policy] explains"
          },
          {
            "type": "paragraph",
            "text": "more."
          }
        ],
        "keywords": [
          "damage",
          "tear",
          "stain",
          "repair",
          "cost",
          "charge",
          "karigar",
          "restoration",
          "deposit",
          "burn"
        ]
      },
      {
        "id": "l-loss",
        "side": "pay",
        "sectionId": "s-damage",
        "question": "What if a piece is lost or not returned?",
        "tag": {
          "text": "Replacement Value",
          "tone": "caution",
          "color": "terracotta"
        },
        "summary": "Every rental piece has a Replacement Value, shown in your booking summary before you pay. If a piece is lost,",
        "content": [
          {
            "type": "paragraph",
            "text": "Every rental piece has a Replacement Value, shown in your booking summary before you pay. If a piece is lost,"
          },
          {
            "type": "paragraph",
            "text": "stolen, not returned or damaged beyond repair, its Replacement Value is owed, less your deposit, with no GST"
          },
          {
            "type": "paragraph",
            "text": "and no late days on top."
          },
          {
            "type": "paragraph",
            "text": "We always talk it through with you first. Our Deposit Policy [opens page deposit-policy] explains every step."
          },
          {
            "type": "paragraph",
            "text": "Ways to pay, promo codes and your GST invoice."
          }
        ],
        "keywords": [
          "lost",
          "stolen",
          "not",
          "returned",
          "replacement",
          "value",
          "missing",
          "theft",
          "beyond",
          "repair"
        ]
      }
    ]
  },
  {
    "id": "s-paying",
    "side": "pay",
    "number": "08",
    "title": "How you pay",
    "italic": "pay",
    "barLabel": "Paying",
    "summary": "Ways to pay, promo codes and your GST invoice.",
    "questions": [
      {
        "id": "y-ways",
        "side": "pay",
        "sectionId": "s-paying",
        "question": "How can I pay?",
        "tag": null,
        "summary": "Securely through Razorpay, by UPI, debit or credit card, or net banking.",
        "content": [
          {
            "type": "paragraph",
            "text": "Securely through Razorpay, by UPI, debit or credit card, or net banking."
          },
          {
            "type": "paragraph",
            "text": "Your card and UPI details are never stored by us. Your deposit is the one amount paid separately, as arranged"
          },
          {
            "type": "paragraph",
            "text": "with you [opens answer d-pay]."
          }
        ],
        "keywords": [
          "pay",
          "payment",
          "methods",
          "upi",
          "card",
          "credit",
          "debit",
          "net",
          "banking",
          "emi",
          "razorpay",
          "secure"
        ]
      },
      {
        "id": "y-fees",
        "side": "pay",
        "sectionId": "s-paying",
        "question": "Are there any other fees?",
        "tag": {
          "text": "None",
          "tone": "good",
          "color": "sage"
        },
        "summary": "No. There is no convenience fee, no platform fee and nothing extra for paying by card or UPI. Every charge that",
        "content": [
          {
            "type": "paragraph",
            "text": "No. There is no convenience fee, no platform fee and nothing extra for paying by card or UPI. Every charge that"
          },
          {
            "type": "paragraph",
            "text": "can ever apply is on this page, and everything for your order is shown before you pay."
          }
        ],
        "keywords": [
          "convenience",
          "fee",
          "platform",
          "fee",
          "hidden",
          "charges",
          "extra",
          "fees",
          "service",
          "charge",
          "card",
          "fee",
          "surcharge"
        ]
      },
      {
        "id": "y-promo",
        "side": "pay",
        "sectionId": "s-paying",
        "question": "How do promo codes work?",
        "tag": null,
        "summary": "Enter your code at checkout, and you see the saving before you pay. A promo code applies to the price of your",
        "content": [
          {
            "type": "paragraph",
            "text": "Enter your code at checkout, and you see the saving before you pay. A promo code applies to the price of your"
          },
          {
            "type": "paragraph",
            "text": "pieces, never to a deposit."
          }
        ],
        "keywords": [
          "promo",
          "code",
          "discount",
          "coupon",
          "offer",
          "code",
          "voucher"
        ]
      },
      {
        "id": "y-invoice",
        "side": "pay",
        "sectionId": "s-paying",
        "question": "Will I receive a GST invoice?",
        "tag": null,
        "summary": "Yes, for every order, with the GST on each charge set out clearly. If you are buying for a business, add your",
        "content": [
          {
            "type": "paragraph",
            "text": "Yes, for every order, with the GST on each charge set out clearly. If you are buying for a business, add your"
          },
          {
            "type": "paragraph",
            "text": "GSTIN at checkout and it appears on your invoice."
          },
          {
            "type": "paragraph",
            "text": "W H A T  Y O U  E A R N"
          },
          {
            "type": "paragraph",
            "text": "How your share is set, and what it is calculated on."
          }
        ],
        "keywords": [
          "gst",
          "invoice",
          "bill",
          "receipt",
          "gstin",
          "business",
          "company",
          "tax",
          "invoice"
        ]
      }
    ]
  },
  {
    "id": "s-share",
    "side": "earn",
    "number": "01",
    "title": "Your share",
    "italic": "share",
    "barLabel": "Your share",
    "summary": "How your share is set, and what it is calculated on.",
    "questions": [
      {
        "id": "e-how",
        "side": "earn",
        "sectionId": "s-share",
        "question": "How is my share decided?",
        "tag": null,
        "summary": "Your share is set for each piece and discussed openly with you before it goes live. It reflects your piece's value",
        "content": [
          {
            "type": "paragraph",
            "text": "Your share is set for each piece and discussed openly with you before it goes live. It reflects your piece's value"
          },
          {
            "type": "paragraph",
            "text": "and condition, and the effort it takes from our team to rent or sell it: collecting and cleaning it, photographing it"
          },
          {
            "type": "paragraph",
            "text": "beautifully, and marketing it to the right people."
          },
          {
            "type": "paragraph",
            "text": "Whatever the piece, our aim stays the same: that you recover a meaningful part of what you invested in it,"
          },
          {
            "type": "paragraph",
            "text": "and that we keep only what truly reflects our work for it. Your share is then confirmed in its Listing Terms."
          }
        ],
        "keywords": [
          "share",
          "how",
          "decided",
          "set",
          "percentage",
          "commission",
          "per",
          "piece",
          "value",
          "condition",
          "effort",
          "marketing",
          "listing",
          "terms"
        ]
      },
      {
        "id": "e-fixed",
        "side": "earn",
        "sectionId": "s-share",
        "question": "Is there a fixed share for every piece?",
        "tag": {
          "text": "Agreed piece by piece",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "No, and that is deliberate. Every piece is different: some find their first renter almost at once, while others need",
        "content": [
          {
            "type": "paragraph",
            "text": "No, and that is deliberate. Every piece is different: some find their first renter almost at once, while others need"
          },
          {
            "type": "paragraph",
            "text": "more of our time, care and marketing to reach the right person."
          },
          {
            "type": "paragraph",
            "text": "So rather than one figure for everyone, we agree a share for your piece with you before it goes live, and every"
          },
          {
            "type": "paragraph",
            "text": "payout statement shows exactly how it was worked out. Here is how your share is decided [opens answer e-how]."
          }
        ],
        "keywords": [
          "fixed",
          "typical",
          "standard",
          "same",
          "every",
          "piece",
          "share",
          "percentage",
          "rate",
          "how",
          "much",
          "keep",
          "earn",
          "commission",
          "cut"
        ]
      },
      {
        "id": "e-on",
        "side": "earn",
        "sectionId": "s-share",
        "question": "What is my share calculated on?",
        "tag": null,
        "summary": "On the rental fee of each booking, and on the final price of a sale, including an offer we have accepted.",
        "content": [
          {
            "type": "paragraph",
            "text": "On the rental fee of each booking, and on the final price of a sale, including an offer we have accepted."
          },
          {
            "type": "paragraph",
            "text": "GST, deposits and delivery charges are never part of it: GST goes to the government, a deposit is the renter's own"
          },
          {
            "type": "paragraph",
            "text": "money held in safekeeping, and delivery pays for the journey."
          }
        ],
        "keywords": [
          "calculated",
          "on",
          "paid",
          "on",
          "gst",
          "deposit",
          "delivery",
          "base",
          "what",
          "counts",
          "rental",
          "fee",
          "final",
          "price"
        ]
      },
      {
        "id": "e-promo",
        "side": "earn",
        "sectionId": "s-share",
        "question": "Do promo codes reduce my share?",
        "tag": {
          "text": "Never",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Never. When we run a promo code, we fund it ourselves, so your share is worked out on the price before the code.",
        "content": [
          {
            "type": "paragraph",
            "text": "Never. When we run a promo code, we fund it ourselves, so your share is worked out on the price before the code."
          },
          {
            "type": "paragraph",
            "text": "Listing is free. These are the only costs that can ever be yours."
          }
        ],
        "keywords": [
          "promo",
          "code",
          "discount",
          "reduce",
          "share",
          "sale",
          "marketing"
        ]
      }
    ]
  },
  {
    "id": "s-costs",
    "side": "earn",
    "number": "02",
    "title": "What listing costs",
    "italic": "costs",
    "barLabel": "Costs",
    "summary": "Listing is free. These are the only costs that can ever be yours.",
    "questions": [
      {
        "id": "e-free",
        "side": "earn",
        "sectionId": "s-costs",
        "question": "Does it cost anything to list a piece?",
        "tag": {
          "text": "Nothing upfront",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Nothing upfront. Listing is free, and collection, photography, cleaning and every delivery to renters and buyers are",
        "content": [
          {
            "type": "paragraph",
            "text": "Nothing upfront. Listing is free, and collection, photography, cleaning and every delivery to renters and buyers are"
          },
          {
            "type": "paragraph",
            "text": "on us."
          }
        ],
        "keywords": [
          "cost",
          "to",
          "list",
          "listing",
          "fee",
          "free",
          "upfront",
          "charge",
          "photography",
          "collection"
        ]
      },
      {
        "id": "e-costs",
        "side": "earn",
        "sectionId": "s-costs",
        "question": "Which costs can ever be mine?",
        "tag": null,
        "summary": "Only these, and you always know them in advance:",
        "content": [
          {
            "type": "paragraph",
            "text": "Only these, and you always know them in advance:"
          },
          {
            "type": "list",
            "items": [
              "a repair your piece needs to be ready to rent or sell, agreed with you first and taken from its payout",
              "the return delivery, if you take your piece back within 90 days of it going live",
              "a second collection, if the first is missed because no one was available",
              "the delivery both ways when you borrow your piece back to wear"
            ]
          },
          {
            "type": "paragraph",
            "text": "A renter's damage is never taken from your payout."
          }
        ],
        "keywords": [
          "costs",
          "mine",
          "pay",
          "repair",
          "return",
          "delivery",
          "collection",
          "borrow",
          "which",
          "costs",
          "charged"
        ]
      },
      {
        "id": "e-clean",
        "side": "earn",
        "sectionId": "s-costs",
        "question": "Who pays for cleaning?",
        "tag": {
          "text": "Always on us",
          "tone": "good",
          "color": "sage"
        },
        "summary": "We do, always: after every rental, when a preloved piece first comes to us, and when you borrow your piece back",
        "content": [
          {
            "type": "paragraph",
            "text": "We do, always: after every rental, when a preloved piece first comes to us, and when you borrow your piece back"
          },
          {
            "type": "paragraph",
            "text": "to wear, both before it goes to you and when it returns."
          }
        ],
        "keywords": [
          "cleaning",
          "cost",
          "dry",
          "clean",
          "who",
          "pays",
          "borrow",
          "back",
          "intake"
        ]
      },
      {
        "id": "e-repair",
        "side": "earn",
        "sectionId": "s-costs",
        "question": "Who pays if my piece needs a repair?",
        "tag": null,
        "summary": "Work needed to bring your piece up to our standard is yours. We agree it with you first, carry it out once someone",
        "content": [
          {
            "type": "paragraph",
            "text": "Work needed to bring your piece up to our standard is yours. We agree it with you first, carry it out once someone"
          },
          {
            "type": "paragraph",
            "text": "is interested in your piece, and take it from that piece's payout, so nothing is charged upfront."
          },
          {
            "type": "paragraph",
            "text": "Damage that happens during a rental is ours to deal with, from the renter's deposit. Our Seller Guidelines [opens"
          },
          {
            "type": "paragraph",
            "text": "page seller-guidelines] explain how your piece is looked after."
          },
          {
            "type": "paragraph",
            "text": "When you are paid, where, and with what record."
          }
        ],
        "keywords": [
          "repair",
          "damage",
          "who",
          "pays",
          "karigar",
          "fix",
          "restore",
          "standard"
        ]
      }
    ]
  },
  {
    "id": "s-payouts",
    "side": "earn",
    "number": "03",
    "title": "Your payouts",
    "italic": "payouts",
    "barLabel": "Payouts",
    "summary": "When you are paid, where, and with what record.",
    "questions": [
      {
        "id": "e-when",
        "side": "earn",
        "sectionId": "s-payouts",
        "question": "When will I be paid?",
        "tag": {
          "text": "Within 3 working days",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Within 3 working days. For a rental, that is once it has ended and your piece is back with us and",
        "content": [
          {
            "type": "paragraph",
            "text": "Within 3 working days. For a rental, that is once it has ended and your piece is back with us and"
          },
          {
            "type": "paragraph",
            "text": "inspected. For a sale, it is once the buyer has received the piece."
          }
        ],
        "keywords": [
          "when",
          "paid",
          "payout",
          "payment",
          "timeline",
          "days",
          "rental",
          "sale"
        ]
      },
      {
        "id": "e-where",
        "side": "earn",
        "sectionId": "s-payouts",
        "question": "Where is my payout sent?",
        "tag": {
          "text": "Your own account",
          "tone": "good",
          "color": "sage"
        },
        "summary": "Into a bank account or UPI ID in your own name. To keep your earnings safe, we cannot pay into anyone else's",
        "content": [
          {
            "type": "paragraph",
            "text": "Into a bank account or UPI ID in your own name. To keep your earnings safe, we cannot pay into anyone else's"
          },
          {
            "type": "paragraph",
            "text": "account."
          }
        ],
        "keywords": [
          "where",
          "bank",
          "account",
          "upi",
          "name",
          "own",
          "transfer"
        ]
      },
      {
        "id": "e-statement",
        "side": "earn",
        "sectionId": "s-payouts",
        "question": "Will I see how my payout is worked out?",
        "tag": null,
        "summary": "Yes. Every payout comes with a statement showing the price, your share and anything deducted from it.",
        "content": [
          {
            "type": "paragraph",
            "text": "Yes. Every payout comes with a statement showing the price, your share and anything deducted from it."
          }
        ],
        "keywords": [
          "statement",
          "record",
          "breakdown",
          "payout",
          "history",
          "how",
          "worked",
          "out"
        ]
      },
      {
        "id": "e-deduct",
        "side": "earn",
        "sectionId": "s-payouts",
        "question": "Can anything be deducted from my payout?",
        "tag": null,
        "summary": "Only what you have agreed to, or what the law requires: one of the costs that can be yours [opens answer e-costs],",
        "content": [
          {
            "type": "paragraph",
            "text": "Only what you have agreed to, or what the law requires: one of the costs that can be yours [opens answer e-costs],"
          },
          {
            "type": "paragraph",
            "text": "tax the law requires us to deduct, or an amount you owe under our Lister Terms [opens page lister-terms], such as"
          },
          {
            "type": "paragraph",
            "text": "for a sale reversed because something was not disclosed."
          },
          {
            "type": "paragraph",
            "text": "GST, tax deducted from payouts, and the tax on your own earnings."
          }
        ],
        "keywords": [
          "deduct",
          "deduction",
          "taken",
          "from",
          "payout",
          "less",
          "reduce",
          "owe"
        ]
      }
    ]
  },
  {
    "id": "s-tax",
    "side": "earn",
    "number": "04",
    "title": "Tax and your PAN",
    "italic": "your PAN",
    "barLabel": "Tax",
    "summary": "GST, tax deducted from payouts, and the tax on your own earnings.",
    "questions": [
      {
        "id": "e-gst",
        "side": "earn",
        "sectionId": "s-tax",
        "question": "Is GST taken from my share?",
        "tag": {
          "text": "Never from your share",
          "tone": "good",
          "color": "sage"
        },
        "summary": "No. GST is paid by the renter or buyer on top of the price, and we pay it to the government. Your share is worked",
        "content": [
          {
            "type": "paragraph",
            "text": "No. GST is paid by the renter or buyer on top of the price, and we pay it to the government. Your share is worked"
          },
          {
            "type": "paragraph",
            "text": "out on the price before GST."
          }
        ],
        "keywords": [
          "gst",
          "my",
          "share",
          "tax",
          "renter",
          "buyer",
          "pays",
          "government"
        ]
      },
      {
        "id": "e-pan",
        "side": "earn",
        "sectionId": "s-tax",
        "question": "Why do you ask for my PAN?",
        "tag": null,
        "summary": "We ask for your PAN before your piece goes live, together with your payout details, because the law can require",
        "content": [
          {
            "type": "paragraph",
            "text": "We ask for your PAN before your piece goes live, together with your payout details, because the law can require"
          },
          {
            "type": "paragraph",
            "text": "us to deduct tax from some payouts. When it does, we deduct it and send you the certificate, so you can claim it in"
          },
          {
            "type": "paragraph",
            "text": "your income tax return."
          },
          {
            "type": "paragraph",
            "text": "We never ask for your full Aadhaar number."
          }
        ],
        "keywords": [
          "pan",
          "tds",
          "tax",
          "deducted",
          "source",
          "certificate",
          "aadhaar",
          "income",
          "tax"
        ]
      },
      {
        "id": "e-owntax",
        "side": "earn",
        "sectionId": "s-tax",
        "question": "Do I pay tax on my earnings?",
        "tag": null,
        "summary": "You are responsible for any tax on your earnings, and your payout statements give you a clear record for your",
        "content": [
          {
            "type": "paragraph",
            "text": "You are responsible for any tax on your earnings, and your payout statements give you a clear record for your"
          },
          {
            "type": "paragraph",
            "text": "return. If you are unsure how your earnings are treated, a tax adviser can guide you."
          },
          {
            "type": "paragraph",
            "text": "How the price of your piece is set, and how offers work."
          }
        ],
        "keywords": [
          "tax",
          "my",
          "earnings",
          "income",
          "tax",
          "responsible",
          "return",
          "adviser"
        ]
      }
    ]
  },
  {
    "id": "s-prices",
    "side": "earn",
    "number": "05",
    "title": "Prices and offers",
    "italic": "offers",
    "barLabel": "Prices and offers",
    "summary": "How the price of your piece is set, and how offers work.",
    "questions": [
      {
        "id": "e-price",
        "side": "earn",
        "sectionId": "s-prices",
        "question": "Who sets the price of my piece?",
        "tag": {
          "text": "Agreed with you",
          "tone": "good",
          "color": "sage"
        },
        "summary": "We agree it with you. We suggest a rental price, a daily rate and a sale price from your piece's designer, condition",
        "content": [
          {
            "type": "paragraph",
            "text": "We agree it with you. We suggest a rental price, a daily rate and a sale price from your piece's designer, condition"
          },
          {
            "type": "paragraph",
            "text": "and demand, and nothing goes live until you are happy with them."
          },
          {
            "type": "paragraph",
            "text": "We never lower a price on our own, and there is no fixed listing period and no automatic markdown. A price"
          },
          {
            "type": "paragraph",
            "text": "changes only when you agree."
          }
        ],
        "keywords": [
          "price",
          "set",
          "who",
          "decides",
          "my",
          "piece",
          "value",
          "rental",
          "price",
          "daily",
          "rate",
          "sale",
          "price",
          "markdown"
        ]
      },
      {
        "id": "e-offers",
        "side": "earn",
        "sectionId": "s-prices",
        "question": "How do offers on my piece work?",
        "tag": {
          "text": "Preloved only",
          "tone": "neutral",
          "color": "gold-deep"
        },
        "summary": "Offers are taken only on pieces for sale, never on rentals. We agree with you the lowest offer we can accept, and",
        "content": [
          {
            "type": "paragraph",
            "text": "Offers are taken only on pieces for sale, never on rentals. We agree with you the lowest offer we can accept, and"
          },
          {
            "type": "paragraph",
            "text": "only ever accept offers at or above it. Your share is then calculated on the price the buyer pays."
          }
        ],
        "keywords": [
          "offer",
          "offers",
          "negotiate",
          "lowest",
          "minimum",
          "accept",
          "make",
          "an",
          "offer"
        ]
      },
      {
        "id": "e-partner",
        "side": "earn",
        "sectionId": "s-prices",
        "question": "I am a designer or a boutique",
        "tag": null,
        "summary": "We would love to hear from you. Designers and boutiques listing a collection work with us as Designer Partners,",
        "content": [
          {
            "type": "paragraph",
            "text": "We would love to hear from you. Designers and boutiques listing a collection work with us as Designer Partners,"
          },
          {
            "type": "paragraph",
            "text": "and our Designer Partners [opens page designer-partners] page explains how."
          },
          {
            "type": "paragraph",
            "text": "9.6 The way across"
          },
          {
            "type": "paragraph",
            "text": "Element End of What you pay End of What you earn"
          },
          {
            "type": "paragraph",
            "text": "Line Listing a piece of your own? Renting or buying with us?"
          },
          {
            "type": "paragraph",
            "text": "Link See what you earn (opens What you earn) See what you pay (opens What you pay)"
          },
          {
            "type": "paragraph",
            "text": "9.7 Related policies and fine print"
          },
          {
            "type": "paragraph",
            "text": "Element Copy"
          },
          {
            "type": "paragraph",
            "text": "Label Related policies"
          },
          {
            "type": "paragraph",
            "text": "Link (refund-policy) Refund & Cancellation Policy"
          },
          {
            "type": "paragraph",
            "text": "Link (deposit-policy) Deposit Policy"
          },
          {
            "type": "paragraph",
            "text": "Link (shipping-policy) Shipping & Delivery Policy"
          },
          {
            "type": "paragraph",
            "text": "Link (care-policy) Care, Cleaning & Damage Policy"
          },
          {
            "type": "paragraph",
            "text": "Link (seller-guidelines) Seller Guidelines"
          },
          {
            "type": "paragraph",
            "text": "Link (terms) Terms & Conditions"
          },
          {
            "type": "paragraph",
            "text": "Link (faq) Help & FAQs"
          },
          {
            "type": "paragraph",
            "text": "Fine print This page explains our prices, charges and shares in plain words. Where it ever differs"
          },
          {
            "type": "paragraph",
            "text": "from our Terms & Conditions, the Terms apply. Last reviewed 11 October 2026."
          },
          {
            "type": "paragraph",
            "text": "Print link Print or save as PDF"
          },
          {
            "type": "paragraph",
            "text": "9.8 A question about a price?"
          },
          {
            "type": "paragraph",
            "text": "Element Copy"
          },
          {
            "type": "paragraph",
            "text": "Eyebrow We are here for you"
          },
          {
            "type": "paragraph",
            "text": "Title A question about a price? (italic: price?)"
          },
          {
            "type": "paragraph",
            "text": "Paragraph Every piece has its own story, and its own prices. If you would like the exact figures for"
          },
          {
            "type": "paragraph",
            "text": "a piece, help planning a rental around your celebrations, or a word about listing with us,"
          },
          {
            "type": "paragraph",
            "text": "message us. We would much rather help you directly, and nothing is too small to ask."
          },
          {
            "type": "paragraph",
            "text": "Buttons Message us on WhatsApp"
          },
          {
            "type": "paragraph",
            "text": "Write to us"
          },
          {
            "type": "paragraph",
            "text": "Channel: WhatsApp The fastest way to reach us. Seven days a week, 10 AM to 8 PM IST, with replies"
          },
          {
            "type": "paragraph",
            "text": "usually within 2 hours."
          },
          {
            "type": "paragraph",
            "text": "Action: Start a chat"
          },
          {
            "type": "paragraph",
            "text": "Channel: Email hello@houseofkaira.com. Best for anything you would like in writing, such as an invoice"
          },
          {
            "type": "paragraph",
            "text": "or a payout statement."
          },
          {
            "type": "paragraph",
            "text": "Action: Send an email"
          },
          {
            "type": "paragraph",
            "text": "Channel: Every order and payout, in"
          },
          {
            "type": "paragraph",
            "text": "one place"
          },
          {
            "type": "paragraph",
            "text": "Your bookings, receipts, deposits and payouts, in My Account."
          },
          {
            "type": "paragraph",
            "text": "Action: Go to my account"
          },
          {
            "type": "paragraph",
            "text": "9.9 Messages"
          },
          {
            "type": "paragraph",
            "text": "When Copy"
          },
          {
            "type": "paragraph",
            "text": "Result count \"<n> answers\" or \"1 answer\", then \", showing the closest <k>\" when more than 8 match"
          },
          {
            "type": "paragraph",
            "text": "Result line under each question <side> \u00b7 <section title>, for example \"What you pay \u00b7 Extra days and late returns\""
          },
          {
            "type": "paragraph",
            "text": "No results We could not find that one"
          },
          {
            "type": "paragraph",
            "text": "Ask us directly and we will answer it personally."
          },
          {
            "type": "paragraph",
            "text": "Button: Ask on WhatsApp"
          },
          {
            "type": "paragraph",
            "text": "Answer footer Still unsure? Ask us about this"
          },
          {
            "type": "paragraph",
            "text": "Copy link"
          },
          {
            "type": "paragraph",
            "text": "After Copy link (toast) Link copied. Paste it anywhere to share this answer."
          },
          {
            "type": "paragraph",
            "text": "WhatsApp message, from an"
          },
          {
            "type": "paragraph",
            "text": "answer or no results"
          },
          {
            "type": "paragraph",
            "text": "Email subject A question about pricing"
          },
          {
            "type": "paragraph",
            "text": "Ledger cell, accessible name <column>. <row>: <figure>. <line> Opens the full answer. (the column only on What"
          },
          {
            "type": "paragraph",
            "text": "you pay)"
          },
          {
            "type": "paragraph",
            "text": "priced, GST, deposits, delivery, extra days, cancellations, and how listers' shares are"
          },
          {
            "type": "paragraph",
            "text": "agreed and when they are paid."
          }
        ],
        "keywords": [
          "designer",
          "boutique",
          "brand",
          "label",
          "collection",
          "partner",
          "multiple",
          "pieces"
        ]
      }
    ]
  }
];

export const PRICING_WAY_ACROSS = {
  pay: {
    line: "Listing a piece of your own?",
    linkText: "See what you earn",
    targetSide: "earn",
  },
  earn: {
    line: "Renting or buying with us?",
    linkText: "See what you pay",
    targetSide: "pay",
  },
};

export const PRICING_RELATED_POLICIES = [
  { label: "Refund & Cancellation Policy", path: "/refunds" },
  { label: "Deposit Policy", path: "/deposit-policy" },
  { label: "Shipping & Delivery Policy", path: "/shipping-policy" },
  { label: "Care, Cleaning & Damage Policy", path: "/care-policy" },
  { label: "Seller Guidelines", path: "/seller-guidelines" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Help & FAQs", path: "/faqs" },
];

export const PRICING_CLOSING_BAND = {
  eyebrow: "We are here for you",
  titlePrefix: "A question about a ",
  italicWord: "price?",
  paragraph:
    "Every piece has its own story, and its own prices. If you would like the exact figures for a piece, help planning a rental around your celebrations, or a word about listing with us, message us. We would much rather help you directly, and nothing is too small to ask.",
  signOff: "With love, the House of Kaira team",
  whatsappUrl:
    `https://wa.me/${PRICING_TOKENS.support_whatsapp_raw}?text=Hello%20House%20of%20Kaira%2C%20I%20have%20a%20question%20about%20pricing.`,
  emailUrl:
    `mailto:${PRICING_TOKENS.support_email}?subject=A%20question%20about%20pricing`,
  channels: [
    {
      id: "whatsapp",
      name: "WhatsApp",
      detail:
        "The fastest way to reach us. Seven days a week, 10 AM to 8 PM IST, with replies usually within 2 hours.",
      action: "Start a chat",
      isExternal: true,
    },
    {
      id: "email",
      name: "Email",
      detail:
        `${PRICING_TOKENS.support_email}. Best for anything you would like in writing, such as an invoice or a payout statement.`,
      action: "Send an email",
      isExternal: false,
    },
    {
      id: "account",
      name: "Every order and payout, in one place",
      detail: "Your bookings, receipts, deposits and payouts, in My Account.",
      action: "Go to my account",
      path: "/profile",
      isExternal: false,
    },
  ],
};
