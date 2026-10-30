/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Data: FAQ Answers Part 1 (Spec §8.4, Screens 26, 41)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem } from '../../types';

export const FAQ_ANSWERS_PART_1: AnswerItem[] = [
  {
    id: "what-is-hok",
    question: "What is House of Kaira?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "what-is-hok_p1", kind: "paragraph", text: "House of Kaira is a curated home for designer Indian occasionwear. You can rent a piece for a celebration and send it back afterwards, or buy a preloved piece and keep it forever." },
      { id: "what-is-hok_p2", kind: "paragraph", text: "Every piece is reviewed by our team before it goes live, and we handle the cleaning, packing, delivery and support, so you only ever deal with us." }
    ],
    searchWords: "what is hok",
    linkName: "what-is-hok",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 1
  },
  {
    id: "rent-vs-buy",
    question: "What is the difference between renting and buying preloved?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "rent-vs-buy_p1", kind: "paragraph", text: "Renting gives you a piece for a set window around your event. It arrives dry-cleaned and pressed, you wear it, and we collect it afterwards. A refundable security deposit applies." },
      { id: "rent-vs-buy_p2", kind: "paragraph", text: "Buying preloved means the piece is yours to keep. You pay the listed price or make an offer, it is delivered to you, and there is nothing to send back." },
      { id: "rent-vs-buy_p3", kind: "paragraph", text: "If you want a showstopper for one evening, renting is usually the way. If you have fallen for a piece and want it in your wardrobe for years, buy it." }
    ],
    searchWords: "rent vs buy",
    linkName: "rent-vs-buy",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 2
  },
  {
    id: "hygiene",
    question: "How do you keep every piece clean and hygienic?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "hygiene_p1", kind: "paragraph", text: "Hygiene is something we take most seriously at House of Kaira. Every rental piece is professionally dry-cleaned before it reaches you and again after your rental ends. Between every rental, our team also inspects and presses it, so it arrives fresh and ready to wear." },
      { id: "hygiene_p2", kind: "paragraph", text: "Every preloved piece is professionally cleaned before it leaves us. Both arrive wrapped in tissue inside a House of Kaira garment bag, protected all the way to your door." }
    ],
    searchWords: "hygiene",
    linkName: "hygiene",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 3
  },
  {
    id: "worn-before",
    question: "Someone has worn this piece before me. Is it really fresh?",
    section: "Choosing a piece",
    side: "rentals",
    paragraphs: [
      { id: "worn-before_p1", kind: "paragraph", text: "Yes. Renting means a piece is shared, and that is exactly why we are so careful with it. The moment a rental ends, the piece is professionally dry-cleaned, then inspected and pressed by our team before it is packed for you. Nothing is dispatched until it meets our standard." },
      { id: "worn-before_p2", kind: "paragraph", text: "If anything about your piece does not feel fresh when it arrives, tell us straight away and we will put it right." }
    ],
    searchWords: "worn before",
    linkName: "worn-before",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 4
  },
  {
    id: "cleaner",
    question: "Who cleans the pieces?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "cleaner_p1", kind: "paragraph", text: "Our pieces are cleaned by professional dry-cleaning specialists who are experienced with heavy embroidery, delicate fabrics and embellishment, so the craftsmanship is protected as carefully as the cleanliness." }
    ],
    searchWords: "cleaner",
    linkName: "cleaner",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 5
  },
  {
    id: "both-modes",
    question: "Can the same piece be available to rent and to buy?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "both-modes_p1", kind: "paragraph", text: "Yes. Some pieces are offered both ways, and the product page shows both options clearly. If someone buys the piece, it stops being available to rent." }
    ],
    searchWords: "both modes",
    linkName: "both-modes",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 6
  },
  {
    id: "authentic",
    question: "Are the designer pieces authentic?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "authentic_p1", kind: "paragraph", text: "Yes. Every piece is reviewed by our curation team before it goes live. Where available, we ask for provenance such as original receipts, care labels or designer certificates. Any listing found to misrepresent a piece is removed immediately." },
      { id: "authentic_p2", kind: "paragraph", text: "Preloved pieces carry the Authenticated by HOK mark once they pass our review." }
    ],
    searchWords: "authentic",
    linkName: "authentic",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 7
  },
  {
    id: "who-owns",
    question: "Where do your pieces come from?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "who-owns_p1", kind: "paragraph", text: "Our pieces come from the wardrobes of women across India and from designer boutiques who list with us. We review, photograph and look after every piece, and we manage every order ourselves, so you never have to deal with a stranger." }
    ],
    searchWords: "who owns",
    linkName: "who-owns",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 8
  },
  {
    id: "photos-real",
    question: "Are the photos an honest picture of the piece?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "photos-real_p1", kind: "paragraph", text: "They are. We photograph every piece as it is, and any imperfection is photographed and written into the listing. Colours can look slightly different from screen to screen, especially deep reds and pastels." },
      { id: "photos-real_p2", kind: "paragraph", text: "If you would like to see a detail more closely, message us and we will happily send extra photos, or a short video, of the actual piece." }
    ],
    searchWords: "photos real",
    linkName: "photos-real",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 9
  },
  {
    id: "rental-condition",
    question: "What condition are rental pieces in?",
    section: "Choosing a piece",
    side: "rentals",
    paragraphs: [
      { id: "rental-condition_p1", kind: "paragraph", text: "Every rental is professionally cleaned, pressed and inspected before each dispatch, and its condition grade is checked again after every return, so the grade you see is current." },
      { id: "rental-condition_p2", kind: "paragraph", text: "A few rental pieces carry the Fair grade. These are still in lovely condition, with slight signs of wear that are photographed and described in the listing, and they are offered for rent only." }
    ],
    searchWords: "rental condition",
    linkName: "rental-condition",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 10
  },
  {
    id: "try-on",
    question: "Can I try a piece on or see it in person first?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "try-on_p1", kind: "paragraph", text: "We are an online house, so trials are not available at the moment. To help you choose with confidence, every listing shows the actual garment measurements, and our team is happy to check any detail on the real piece for you before you book or buy." }
    ],
    searchWords: "try on",
    linkName: "try-on",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 11
  },
  {
    id: "stylist",
    question: "Can someone help me choose the right piece?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "stylist_p1", kind: "paragraph", text: "Of course. Use Consult a Stylist on any product page, or message us on WhatsApp. Tell us the occasion, your size and your budget, and we will suggest pieces that suit you." }
    ],
    searchWords: "stylist",
    linkName: "stylist",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 12
  },
  {
    id: "menswear",
    question: "Do you have menswear?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "menswear_p1", kind: "paragraph", text: "Yes. You will find sherwanis, bandhgalas, kurta sets and Indo western pieces under Men in the menu, for grooms and guests alike." }
    ],
    searchWords: "menswear",
    linkName: "menswear",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 13
  },
  {
    id: "new-arrivals",
    question: "How often do new pieces arrive?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "new-arrivals_p1", kind: "paragraph", text: "New designer pieces arrive every Friday. Save the ones you love to your wishlist so they are easy to find again." }
    ],
    searchWords: "new arrivals",
    linkName: "new-arrivals",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 14
  },
  {
    id: "request-piece",
    question: "I am looking for something I cannot find. Can you help?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "request-piece_p1", kind: "paragraph", text: "Tell us what you have in mind on WhatsApp: the designer, colour, silhouette or occasion. If we have something close, we will show you, and if a similar piece comes in, we will let you know." }
    ],
    searchWords: "request piece",
    linkName: "request-piece",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 15
  },
  {
    id: "wishlist",
    question: "How does the wishlist work?",
    section: "Choosing a piece",
    side: "both",
    paragraphs: [
      { id: "wishlist_p1", kind: "paragraph", text: "Tap the heart on any piece to save it. You can save pieces without signing in, and they stay on that device. Sign in to keep your wishlist across all your devices." },
      { id: "wishlist_p2", kind: "paragraph", text: "Saving a piece does not hold it or its dates for you." }
    ],
    searchWords: "wishlist",
    linkName: "wishlist",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 16
  },
  {
    id: "fit",
    question: "How do I know a piece will fit me?",
    section: "Sizing & fit",
    side: "both",
    paragraphs: [
      { id: "fit_p1", kind: "paragraph", text: "Every listing shows the actual garment measurements, not just a label size, along with the height the piece suits best. Many Indian occasion pieces have blouse allowances or adjustable lehenga waists, and we note these in the listing." },
      { id: "fit_p2", kind: "paragraph", text: "If you are unsure, message us on WhatsApp at +91 93401 39300 before you book or buy. Sizing is the question we take most seriously." }
    ],
    searchWords: "fit",
    linkName: "fit",
    teamNote: "",
    appearsIn: ["Help & FAQs, Sizing & fit"],
    orderIndex: 17
  },
  {
    id: "measure",
    question: "How should I take my measurements?",
    section: "Sizing & fit",
    side: "both",
    paragraphs: [
      { id: "measure_p1", kind: "paragraph", text: "Use a soft measuring tape, ideally over the kind of undergarments you plan to wear." }
    ],
    searchWords: "measure",
    linkName: "measure",
    teamNote: "",
    appearsIn: ["Help & FAQs, Sizing & fit"],
    orderIndex: 18
  },
  {
    id: "between-sizes",
    question: "What if I am between sizes?",
    section: "Sizing & fit",
    side: "both",
    paragraphs: [
      { id: "between-sizes_p1", kind: "paragraph", text: "Go by the measurement table rather than the size label. Lehenga skirts often have a drawstring or an adjustable waist, and the listing tells you when a blouse has extra margin." },
      { id: "between-sizes_p2", kind: "paragraph", text: "Send us your measurements on WhatsApp and we will check them against the actual piece for you." }
    ],
    searchWords: "between sizes",
    linkName: "between-sizes",
    teamNote: "",
    appearsIn: ["Help & FAQs, Sizing & fit"],
    orderIndex: 19
  },
  {
    id: "sizes-vary",
    question: "Do sizes vary between designers?",
    section: "Sizing & fit",
    side: "both",
    paragraphs: [
      { id: "sizes-vary_p1", kind: "paragraph", text: "They do, which is why we list the real measurements of each piece. A size M from one designer can fit quite differently from another, so the table is always your best guide." }
    ],
    searchWords: "sizes vary",
    linkName: "sizes-vary",
    teamNote: "",
    appearsIn: ["Help & FAQs, Sizing & fit"],
    orderIndex: 20
  },
  {
    id: "altered-before",
    question: "How do I know if a piece has been altered before?",
    section: "Sizing & fit",
    side: "both",
    paragraphs: [
      { id: "altered-before_p1", kind: "paragraph", text: "Every listing discloses past alterations: what was changed, how much, and by whom where known. You will find this in the condition notes on the product page." }
    ],
    searchWords: "altered before",
    linkName: "altered-before",
    teamNote: "",
    appearsIn: ["Help & FAQs, Sizing & fit"],
    orderIndex: 21
  },
  {
    id: "whats-included",
    question: "What is included with a piece?",
    section: "Sizing & fit",
    side: "both",
    paragraphs: [
      { id: "whats-included_p1", kind: "paragraph", text: "Everything included is listed on the product page, for example the lehenga, blouse and dupatta. Jewellery, footwear and accessories are not included unless the listing says so." }
    ],
    searchWords: "whats included",
    linkName: "whats-included",
    teamNote: "",
    appearsIn: ["Help & FAQs, Sizing & fit"],
    orderIndex: 22
  },
  {
    id: "how-rent",
    question: "How does renting work?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "how-rent_p1", kind: "paragraph", text: "Details for this question are being updated in accordance with house policies." }
    ],
    searchWords: "how rent",
    linkName: "how-rent",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 23
  },
  {
    id: "lead-time",
    question: "How far in advance should I book?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "lead-time_p1", kind: "paragraph", text: "We recommend booking at least ${ADMIN_FIGURES.lead_time} before your event. During peak wedding season, November to February, and April to June, booking ${ADMIN_FIGURES.peak_lead_time} ahead is wise for the most loved pieces." },
      { id: "lead-time_p2", kind: "paragraph", text: "Use the date planner above to see exactly when to book for your event. Once you book, your dates are locked and no one else can take that piece." }
    ],
    searchWords: "lead time",
    linkName: "lead-time",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 24
  },
  {
    id: "last-minute",
    question: "My event is in a few days. Can I still rent?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "last-minute_p1", kind: "paragraph", text: "Possibly. The calendar only shows dates we can still deliver for, based on where you are. If a piece shows your dates as available, you can book it. If you are unsure, message us and we will check what can reach you in time." }
    ],
    searchWords: "last minute",
    linkName: "last-minute",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 25
  },
  {
    id: "window",
    question: "How long can I keep a rental?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "window_p1", kind: "paragraph", text: "Most pieces offer a standard window of ${ADMIN_FIGURES.window_standard} and an extended window of ${ADMIN_FIGURES.window_extended}, which is ideal for destination weddings and multi-day functions. Each product page shows the windows and prices for that piece." }
    ],
    searchWords: "window",
    linkName: "window",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 26
  },
  {
    id: "window-start",
    question: "When does my rental window start and end?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "window-start_p1", kind: "paragraph", text: "Your window starts on the day your piece is delivered, which is ${ADMIN_FIGURES.arrive_before} before your event, and ends on your return date. Both dates are shown before you pay and again in your confirmation." }
    ],
    searchWords: "window start",
    linkName: "window-start",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 27
  },
  {
    id: "greyed-dates",
    question: "Why are some dates greyed out?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "greyed-dates_p1", kind: "paragraph", text: "A greyed date means the piece is not free then. It may be booked by someone else, resting between rentals for cleaning and inspection, or too close for us to deliver to you in time." }
    ],
    searchWords: "greyed dates",
    linkName: "greyed-dates",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 28
  },
  {
    id: "multi-day",
    question: "I have several functions. How should I book?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "multi-day_p1", kind: "paragraph", text: "If you want to wear one piece across a few days, choose the extended window. If you want a different look for each function, book each piece for its own dates and message us: we can combine the deliveries wherever availability allows." }
    ],
    searchWords: "multi day",
    linkName: "multi-day",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 29
  },
  {
    id: "hold",
    question: "Can I hold a piece without paying?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "hold_p1", kind: "paragraph", text: "Dates are locked only when your booking is paid. Saving a piece to your wishlist does not hold it, so if you have found the one, it is best to book it." }
    ],
    searchWords: "hold",
    linkName: "hold",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 30
  },
  {
    id: "same-piece-twice",
    question: "Can I rent the same piece for two different events?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "same-piece-twice_p1", kind: "paragraph", text: "Yes. Each event is a separate booking with its own dates, as long as the piece is free for both." }
    ],
    searchWords: "same piece twice",
    linkName: "same-piece-twice",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 31
  },
  {
    id: "several-pieces",
    question: "Can I rent more than one piece in one order?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "several-pieces_p1", kind: "paragraph", text: "Yes. Add each piece to your bag with its own dates. Each piece is dispatched on its own schedule so it arrives in time for its event." }
    ],
    searchWords: "several pieces",
    linkName: "several-pieces",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 32
  },
  {
    id: "for-someone",
    question: "Can I rent for someone else or send it to a different address?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "for-someone_p1", kind: "paragraph", text: "Yes. Enter their delivery address at checkout, and make sure the WhatsApp number you give is one we can reach about delivery and pickup. The booking, and the deposit, stay in your name." }
    ],
    searchWords: "for someone",
    linkName: "for-someone",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 33
  },
  {
    id: "rental-included",
    question: "What is included in the rental price?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "rental-included_p1", kind: "paragraph", text: "Professional cleaning before and after your rental, pressing, protective packaging and the return pickup are all included. Standard delivery is free on orders above ₹5,000, and GST at ${ADMIN_FIGURES.gst_rental} is added at checkout." }
    ],
    searchWords: "rental included",
    linkName: "rental-included",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 34
  },
  {
    id: "shoot",
    question: "Can I rent for a photoshoot or pre-wedding shoot?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "shoot_p1", kind: "paragraph", text: "Absolutely. Book it like any other occasion. Please take extra care with outdoor locations, as water, sand, mud and rough surfaces can cause damage that the deposit would need to cover." }
    ],
    searchWords: "shoot",
    linkName: "shoot",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 35
  },
  {
    id: "will-they-know",
    question: "Will anyone know my outfit is rented?",
    section: "Choosing a piece",
    side: "rentals",
    paragraphs: [
      { id: "will-they-know_p1", kind: "paragraph", text: "Only if you choose to tell them. Every piece arrives cleaned, pressed and ready to wear, looking exactly as it should on your big day." }
    ],
    searchWords: "will they know",
    linkName: "will-they-know",
    teamNote: "",
    appearsIn: ["Help & FAQs, Choosing a piece"],
    orderIndex: 36
  },
  {
    id: "pay-methods",
    question: "How can I pay?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "pay-methods_p1", kind: "paragraph", text: "You can pay by UPI (Google Pay, PhonePe, Paytm or any UPI app), credit or debit card (Visa, Mastercard, RuPay and American Express), net banking, or no-cost EMI on select cards." }
    ],
    searchWords: "pay methods",
    linkName: "pay-methods",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 37
  },
  {
    id: "emi",
    question: "Do you offer EMI?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "emi_p1", kind: "paragraph", text: "Yes. No-cost EMI over 3, 6, 9 or 12 months is available on select cards. You will see the eligible options at checkout." }
    ],
    searchWords: "emi",
    linkName: "emi",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 38
  },
  {
    id: "cod",
    question: "Can I pay cash on delivery?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "cod_p1", kind: "paragraph", text: "Not at the moment. All orders are paid securely online at checkout." }
    ],
    searchWords: "cod",
    linkName: "cod",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 39
  },
  {
    id: "secure",
    question: "Is my payment secure?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "secure_p1", kind: "paragraph", text: "Yes. Payments are processed by Razorpay, which is PCI-DSS compliant, and every page is SSL encrypted. We never see or store your card or UPI details." }
    ],
    searchWords: "secure",
    linkName: "secure",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 40
  },
];
