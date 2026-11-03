/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Data: FAQ Answers Part 2 (Spec §8.4, Screens 26, 41)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem } from '../../types';

export const FAQ_ANSWERS_PART_2: AnswerItem[] = [
  {
    id: "gst",
    question: "Are prices inclusive of GST?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "gst_p1", kind: "paragraph", text: "Rental fees and preloved prices are shown before tax. GST is added at checkout, at ${ADMIN_FIGURES.gst_rental} on rentals and ${ADMIN_FIGURES.gst_preloved} on preloved pieces, and you see the full amount before you pay. The rental security deposit carries no GST." }
    ],
    searchWords: "gst",
    linkName: "gst",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 41
  },
  {
    id: "gst-invoice",
    question: "Can I get a GST invoice?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "gst-invoice_p1", kind: "paragraph", text: "Yes. At checkout, tick I need a GST invoice and add your business name and GSTIN. You can download your invoice from your order confirmation, and we email it to you as well." }
    ],
    searchWords: "gst invoice",
    linkName: "gst-invoice",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 42
  },
  {
    id: "promo",
    question: "How do promo codes work?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "promo_p1", kind: "paragraph", text: "Enter your code in your bag and the discount is applied before checkout. Codes apply to rental fees and prices, never to a security deposit, and each code has its own terms and expiry." }
    ],
    searchWords: "promo",
    linkName: "promo",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 43
  },
  {
    id: "negotiable",
    question: "Are prices negotiable?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "negotiable_p1", kind: "paragraph", text: "Rental prices are fixed. On preloved pieces, you are welcome to make an offer." }
    ],
    searchWords: "negotiable",
    linkName: "negotiable",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 44
  },
  {
    id: "payment-failed",
    question: "Money left my account but I did not get a confirmation. What now?",
    section: "Payments & pricing",
    side: "both",
    paragraphs: [
      { id: "payment-failed_p1", kind: "paragraph", text: "Give it a few minutes and check your email and WhatsApp, as banks sometimes confirm late. If you still have nothing, message us with the time and amount of the payment and we will check it straight away. If an order did not go through, your bank reverses the amount automatically." }
    ],
    searchWords: "payment failed",
    linkName: "payment-failed",
    teamNote: "",
    appearsIn: ["Help & FAQs, Payments & pricing"],
    orderIndex: 45
  },
  {
    id: "deposit-when",
    question: "When and how do I pay the deposit?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "deposit-when_p1", kind: "paragraph", text: "It depends on the piece, and the product page tells you which applies." },
      { id: "deposit-when_p2", kind: "paragraph", text: "For some pieces, the deposit is paid at checkout with your rental fee. For others, our team messages you on WhatsApp within 2 hours of your booking to arrange it by UPI or bank transfer. Your piece is dispatched once the deposit is received." }
    ],
    searchWords: "deposit when",
    linkName: "deposit-when",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 46
  },
  {
    id: "rental-arrive",
    question: "When will my rental arrive?",
    section: "Delivery & tracking",
    side: "rentals",
    paragraphs: [
      { id: "rental-arrive_p1", kind: "paragraph", text: "Your rental arrives ${ADMIN_FIGURES.arrive_before} before your event, so you have time to try it on and settle in. This timing is fixed to your booking, so it is the same whichever delivery option you choose." }
    ],
    searchWords: "rental arrive",
    linkName: "rental-arrive",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 47
  },
  {
    id: "preloved-arrive",
    question: "When will my preloved piece arrive?",
    section: "Delivery & tracking",
    side: "preloved",
    paragraphs: [
      { id: "preloved-arrive_p1", kind: "paragraph", text: "It is dispatched within ${ADMIN_FIGURES.preloved_dispatch} of your order. Standard delivery then takes ${ADMIN_FIGURES.standard_delivery}, and express delivery takes ${ADMIN_FIGURES.express_delivery}." }
    ],
    searchWords: "preloved arrive",
    linkName: "preloved-arrive",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 48
  },
  {
    id: "same-day",
    question: "Do you offer same-day delivery?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "same-day_p1", kind: "paragraph", text: "Within Indore, same-day delivery is available on selected pieces, for rentals as well as preloved orders. If it is available for your order, you will see it at checkout." }
    ],
    searchWords: "same day",
    linkName: "same-day",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 49
  },
  {
    id: "delivery-cost",
    question: "How much does delivery cost?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "delivery-cost_p1", kind: "paragraph", text: "Standard delivery is free on orders above ₹5,000. Express delivery is available at checkout for a small fee, and any delivery charge is always shown before you pay." }
    ],
    searchWords: "delivery cost",
    linkName: "delivery-cost",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 50
  },
  {
    id: "where-deliver",
    question: "Where do you deliver?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "where-deliver_p1", kind: "paragraph", text: "We deliver across India. Enter your PIN code at checkout to confirm delivery to your address." }
    ],
    searchWords: "where deliver",
    linkName: "where-deliver",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 51
  },
  {
    id: "international",
    question: "Do you ship outside India?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "international_p1", kind: "paragraph", text: "Not yet. For now, we deliver within India only." }
    ],
    searchWords: "international",
    linkName: "international",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 52
  },
  {
    id: "track",
    question: "How do I track my order?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "track_p1", kind: "paragraph", text: "The moment your piece is dispatched, we send the courier name and tracking number on WhatsApp and email. You can also follow every order and booking in My Account." }
    ],
    searchWords: "track",
    linkName: "track",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 53
  },
  {
    id: "courier",
    question: "Which courier do you use?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "courier_p1", kind: "paragraph", text: "We ship with trusted partners such as Blue Dart and Delhivery. Every shipment is insured and fully trackable." }
    ],
    searchWords: "courier",
    linkName: "courier",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 54
  },
  {
    id: "packaging",
    question: "How will my piece be packed?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "packaging_p1", kind: "paragraph", text: "Each piece is wrapped in tissue inside a House of Kaira garment bag and placed in a protective box, so it arrives just as it should." }
    ],
    searchWords: "packaging",
    linkName: "packaging",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 55
  },
  {
    id: "not-home",
    question: "What if I am not home when it is delivered?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "not-home_p1", kind: "paragraph", text: "If you know you will be away, tell us on WhatsApp and we will arrange a better time or someone else to receive it. For rentals especially, please make sure someone can accept the delivery so your dates are not affected." }
    ],
    searchWords: "not home",
    linkName: "not-home",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 56
  },
  {
    id: "change-address",
    question: "Can I change my delivery address after ordering?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "change-address_p1", kind: "paragraph", text: "Yes, as long as the piece has not been dispatched. Message us with your order number and the new address." }
    ],
    searchWords: "change address",
    linkName: "change-address",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 57
  },
  {
    id: "parcel-damaged",
    question: "What if my parcel arrives damaged or looks tampered with?",
    section: "Delivery & tracking",
    side: "both",
    paragraphs: [
      { id: "parcel-damaged_p1", kind: "paragraph", text: "Take photos of the packaging before opening it, and message us within ${ADMIN_FIGURES.issue_window} of delivery. We will look into it with the courier and help you straight away." }
    ],
    searchWords: "parcel damaged",
    linkName: "parcel-damaged",
    teamNote: "",
    appearsIn: ["Help & FAQs, Delivery & tracking"],
    orderIndex: 58
  },
  {
    id: "not-fresh",
    question: "What if my piece does not feel fresh when it arrives?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "not-fresh_p1", kind: "paragraph", text: "It should never happen. Hygiene is not negotiable for us, and no piece leaves us without being professionally dry-cleaned and checked first." },
      { id: "not-fresh_p2", kind: "paragraph", text: "If anything ever feels less than fresh, we want to know straight away. Message us within ${ADMIN_FIGURES.issue_window} of delivery with a photo and we will put it right before your event." }
    ],
    searchWords: "not fresh",
    linkName: "not-fresh",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 59
  },
  {
    id: "care",
    question: "What do you ask of everyone who rents with us?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "care_p1", kind: "paragraph", text: "Simply this: treat the piece as your own. Every piece in our house was part of someone’s most special day, and it will be part of someone else’s next. We ask that you wear it with the same love and care it has always been given." },
      { id: "care_p2", kind: "paragraph", text: "In practice, that means:" }
    ],
    searchWords: "care",
    linkName: "care",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 60
  },
  {
    id: "on-arrival",
    question: "What should I do when my rental arrives?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "on-arrival_p1", kind: "paragraph", text: "Unpack it carefully, hang it on a padded hanger and try it on as soon as you can. If anything is not as expected, message us within ${ADMIN_FIGURES.issue_window} with a photo, so we can help while there is still time before your event." }
    ],
    searchWords: "on arrival",
    linkName: "on-arrival",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 61
  },
  {
    id: "rental-no-fit",
    question: "What if my rental does not fit when it arrives?",
    section: "Sizing & fit",
    side: "rentals",
    paragraphs: [
      { id: "rental-no-fit_p1", kind: "paragraph", text: "This is rare, because our quality team checks every piece against the measurements you give us. We know exactly how much these days matter to you." },
      { id: "rental-no-fit_p2", kind: "paragraph", text: "Your piece also arrives ${ADMIN_FIGURES.arrive_before} before your event, so there is time to try it on. If it does not fit, message us within ${ADMIN_FIGURES.issue_window} of delivery with a photo and we will arrange a swap with another piece that is free for your dates." }
    ],
    searchWords: "rental no fit",
    linkName: "rental-no-fit",
    teamNote: "",
    appearsIn: ["Help & FAQs, Sizing & fit"],
    orderIndex: 62
  },
  {
    id: "alter-rental",
    question: "Can I alter a rental piece?",
    section: "Sizing & fit",
    side: "rentals",
    paragraphs: [
      { id: "alter-rental_p1", kind: "paragraph", text: "Rental pieces cannot be altered in any way, including stitching, hemming, cutting or taking in. Any alteration is treated as damage." },
      { id: "alter-rental_p2", kind: "paragraph", text: "Fashion tape and safety pins are absolutely fine for small adjustments on the day. Please use pins gently, as they sit in delicate fabric: if a pin marks, snags or tears the piece, that counts as damage." },
      { id: "alter-rental_p3", kind: "paragraph", text: "If fit is a concern, message us before you book and we will help you find a piece that works as it is." }
    ],
    searchWords: "alter rental",
    linkName: "alter-rental",
    teamNote: "",
    appearsIn: ["Help & FAQs, Sizing & fit"],
    orderIndex: 63
  },
  {
    id: "steam",
    question: "Should I steam or iron the piece?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "steam_p1", kind: "paragraph", text: "Please do not. Your piece arrives pressed and ready to wear. Heat can damage embroidery and delicate fabrics, so if you notice creases, hang it up for a few hours and they usually settle." }
    ],
    searchWords: "steam",
    linkName: "steam",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 64
  },
  {
    id: "store",
    question: "How should I store it during my rental?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "store_p1", kind: "paragraph", text: "Keep it on a padded hanger in its garment bag, somewhere cool and away from direct sunlight, perfume and food." }
    ],
    searchWords: "store",
    linkName: "store",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 65
  },
  {
    id: "perfume",
    question: "Can I wear perfume and makeup with my rental?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "perfume_p1", kind: "paragraph", text: "Yes, with a little care. Apply perfume and makeup before you dress and let them dry, and avoid spraying perfume directly onto the fabric. Take extra care around fresh mehendi, haldi and colour, which can stain." }
    ],
    searchWords: "perfume",
    linkName: "perfume",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 66
  },
  {
    id: "spill",
    question: "What if I spill something on it?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "spill_p1", kind: "paragraph", text: "Do not rub it or try any home remedy. Gently blot with a clean tissue, then let us know. Our cleaning specialists will handle it, and small marks from normal wear are not treated as damage." }
    ],
    searchWords: "spill",
    linkName: "spill",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 67
  },
  {
    id: "multiple-wears",
    question: "Can I wear my rental more than once during my window?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "multiple-wears_p1", kind: "paragraph", text: "Yes, it is yours to enjoy for the whole window. Just keep in mind that each wear is another chance for accidents, so treat it gently." }
    ],
    searchWords: "multiple wears",
    linkName: "multiple-wears",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 68
  },
  {
    id: "extend",
    question: "Can I extend my rental once I have it?",
    section: "Booking a rental",
    side: "rentals",
    paragraphs: [
      { id: "extend_p1", kind: "paragraph", text: "Message us before your return date. If nobody has booked the piece straight after you, we can extend your window, and the extra days are charged at the piece's daily rate." }
    ],
    searchWords: "extend",
    linkName: "extend",
    teamNote: "",
    appearsIn: ["Help & FAQs, Booking a rental"],
    orderIndex: 69
  },
  {
    id: "insured",
    question: "Is the piece insured while I have it?",
    section: "Wearing your rental",
    side: "rentals",
    paragraphs: [
      { id: "insured_p1", kind: "paragraph", text: "Pieces are insured while in transit. While the piece is with you, your security deposit is what covers accidental damage beyond normal wear." }
    ],
    searchWords: "insured",
    linkName: "insured",
    teamNote: "",
    appearsIn: ["Help & FAQs, Wearing your rental"],
    orderIndex: 70
  },
  {
    id: "return-how",
    question: "How do I return my rental?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "return-how_p1", kind: "paragraph", text: "Returning is simple and prepaid, and you can choose whichever is easier for you." }
    ],
    searchWords: "return how",
    linkName: "return-how",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 71
  },
  {
    id: "return-clean",
    question: "Should I clean the piece before returning it?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "return-clean_p1", kind: "paragraph", text: "Please do not. Cleaning after your rental is handled entirely by us. Washing, steaming or spot cleaning at home can damage delicate work." }
    ],
    searchWords: "return clean",
    linkName: "return-clean",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 72
  },
  {
    id: "late-return",
    question: "What if I return my rental late?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "late-return_p1", kind: "paragraph", text: "Late returns are charged at one day's rental rate for each extra day, because another customer may be waiting for the piece. If you think you may be late, tell us as early as you can." }
    ],
    searchWords: "late return",
    linkName: "late-return",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 73
  },
  {
    id: "pickup-delay",
    question: "What if the pickup is delayed on your side?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "pickup-delay_p1", kind: "paragraph", text: "If a pickup is delayed by us or our courier, you are not charged. Late fees never apply to a delay on our side." },
      { id: "pickup-delay_p2", kind: "paragraph", text: "If our associate arrives at the slot we agreed and the piece cannot be handed over because nobody is available, late fees do apply, so please keep the slot we agree or tell us in advance if it needs to move." }
    ],
    searchWords: "pickup delay",
    linkName: "pickup-delay",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 74
  },
  {
    id: "lost-label",
    question: "I have lost the return label or garment bag. What do I do?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "lost-label_p1", kind: "paragraph", text: "Just message us. We will send you a new label, and any clean, sturdy bag will do for the journey back." }
    ],
    searchWords: "lost label",
    linkName: "lost-label",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 75
  },
  {
    id: "deposit-what",
    question: "What is the security deposit?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "deposit-what_p1", kind: "paragraph", text: "It is a refundable amount held against accidental damage beyond normal wear. The amount depends on the piece and is always shown on its product page. There is no GST on the deposit." }
    ],
    searchWords: "deposit what",
    linkName: "deposit-what",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 76
  },
  {
    id: "deposit-back",
    question: "When will I get my deposit back?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "deposit-back_p1", kind: "paragraph", text: "We inspect every piece within ${ADMIN_FIGURES.inspect_within} of receiving it. If all is well, your full deposit is refunded within ${ADMIN_FIGURES.deposit_refund_window}, and we confirm it on WhatsApp. You can follow its status in the Deposit Tracker in My Account." }
    ],
    searchWords: "deposit refund when get money back",
    linkName: "deposit-back",
    teamNote: "Never shown on the site",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 77
  },
  {
    id: "deposit-where",
    question: "Where will my deposit be refunded?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "deposit-where_p1", kind: "paragraph", text: "A deposit paid at checkout goes back to your original payment method. A deposit paid by UPI or bank transfer goes back to the account it came from." }
    ],
    searchWords: "deposit where",
    linkName: "deposit-where",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 78
  },
  {
    id: "normal-wear",
    question: "What counts as normal wear?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "normal-wear_p1", kind: "paragraph", text: "The small things that happen when a piece is worn and enjoyed: a few loose threads, a little embellishment loss, light creasing. These are expected and never deducted from your deposit." }
    ],
    searchWords: "normal wear",
    linkName: "normal-wear",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 79
  },
  {
    id: "damage-what",
    question: "What counts as damage?",
    section: "Returns, deposits & damage",
    side: "rentals",
    paragraphs: [
      { id: "damage-what_p1", kind: "paragraph", text: "Damage is anything beyond normal wear, such as stains, tears, burns, significant bead or embroidery loss, or any alteration to the piece. It is assessed when the piece comes back to us." }
    ],
    searchWords: "damage what",
    linkName: "damage-what",
    teamNote: "",
    appearsIn: ["Help & FAQs, Returns, deposits & damage"],
    orderIndex: 80
  },
];
