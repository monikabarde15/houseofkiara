// src/data/faq/faqRegistry.js
// Complete FAQ Registry (Appendix A & B) with all 120 answers, moments, sections, and exact copy.
import { ADMIN_FIGURES } from "./adminFigures";

export const FAQ_MOMENTS = [
  {
    id: "before",
    cardTitle: "Before I book",
    kicker: "BEFORE YOU BOOK",
    title: "Before you book",
    italicWord: "book",
    subline: "Choosing a piece, getting the fit right, your rental dates, and paying.",
    appliesTo: "both", // 'both' | 'rent' | 'pre'
    appliesToLabel: "RENT & PRELOVED",
    bgGradient: "linear-gradient(162deg, #43322A 0%, #1B120D 100%)",
    answerCount: 46,
    sections: [
      {
        id: "choosing-a-piece",
        title: "Choosing a piece",
        count: 16,
        questions: [
          {
            id: "what-is-hok",
            code: "A001",
            question: "What is House of Kaira?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "House of Kaira is a curated home for designer Indian occasionwear. You can rent a piece for a celebration and send it back afterwards, or buy a preloved piece and keep it forever.",
                "Every piece is reviewed by our team before it goes live, and we handle the cleaning, packing, delivery and support, so you only ever deal with us.",
              ],
            },
          },
          {
            id: "rent-vs-buy",
            code: "A002",
            question: "What is the difference between renting and buying preloved?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Renting gives you a piece for a set window around your event. It arrives dry-cleaned and pressed, you wear it, and we collect it afterwards. A refundable security deposit applies.",
                "Buying preloved means the piece is yours to keep. You pay the listed price or make an offer, it is delivered to you, and there is nothing to send back.",
                "If you want a showstopper for one evening, renting is usually the way. If you have fallen for a piece and want it in your wardrobe for years, buy it.",
              ],
            },
          },
          {
            id: "hygiene",
            code: "A003",
            question: "How do you keep every piece clean and hygienic?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Hygiene is something we take most seriously at House of Kaira. Every rental piece is professionally dry-cleaned before it reaches you and again after your rental ends. Between every rental, our team also inspects and presses it, so it arrives fresh and ready to wear.",
                "Every preloved piece is professionally cleaned before it leaves us. Both arrive wrapped in tissue inside a House of Kaira garment bag, protected all the way to your door.",
              ],
            },
          },
          {
            id: "worn-before",
            code: "A004",
            question: "Someone has worn this piece before me. Is it really fresh?",
            appliesTo: "rent",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Yes. Renting means a piece is shared, and that is exactly why we are so careful with it. The moment a rental ends, the piece is professionally dry-cleaned, then inspected and pressed by our team before it is packed for you. Nothing is dispatched until it meets our standard.",
                "If anything about your piece does not feel fresh when it arrives, tell us straight away and we will put it right.",
              ],
            },
          },
          {
            id: "cleaner",
            code: "A005",
            question: "Who cleans the pieces?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Our pieces are cleaned by professional dry-cleaning specialists who are experienced with heavy embroidery, delicate fabrics and embellishment, so the craftsmanship is protected as carefully as the cleanliness.",
              ],
            },
          },
          {
            id: "both-modes",
            code: "A006",
            question: "Can the same piece be available to rent and to buy?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Yes. Some pieces are offered both ways, and the product page shows both options clearly. If someone buys the piece, it stops being available to rent.",
              ],
            },
          },
          {
            id: "authentic",
            code: "A007",
            question: "Are the designer pieces authentic?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Yes. Every piece is reviewed by our curation team before it goes live. Where available, we ask for provenance such as original receipts, care labels or designer certificates. Any listing found to misrepresent a piece is removed immediately.",
                "Preloved pieces carry the Authenticated by HOK mark once they pass our review.",
              ],
            },
          },
          {
            id: "who-owns",
            code: "A008",
            question: "Where do your pieces come from?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Our pieces come from the wardrobes of women across India and from designer boutiques who list with us. We review, photograph and look after every piece, and we manage every order ourselves, so you never have to deal with a stranger.",
              ],
            },
          },
          {
            id: "photos-real",
            code: "A009",
            question: "Are the photos an honest picture of the piece?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "They are. We photograph every piece as it is, and any imperfection is photographed and written into the listing. Colours can look slightly different from screen to screen, especially deep reds and pastels.",
                "If you would like to see a detail more closely, message us and we will happily send extra photos, or a short video, of the actual piece.",
              ],
            },
          },
          {
            id: "rental-condition",
            code: "A010",
            question: "What condition are rental pieces in?",
            appliesTo: "rent",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Every rental is professionally cleaned, pressed and inspected before each dispatch, and its condition grade is checked again after every return, so the grade you see is current.",
                "A few rental pieces carry the Fair grade. These are still in lovely condition, with slight signs of wear that are photographed and described in the listing, and they are offered for rent only.",
              ],
            },
          },
          {
            id: "try-on",
            code: "A011",
            question: "Can I try a piece on or see it in person first?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "We are an online house, so trials are not available at the moment. To help you choose with confidence, every listing shows the actual garment measurements, and our team is happy to check any detail on the real piece for you before you book or buy.",
              ],
            },
          },
          {
            id: "stylist",
            code: "A012",
            question: "Can someone help me choose the right piece?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Of course. Use Consult a Stylist on any product page, or message us on WhatsApp. Tell us the occasion, your size and your budget, and we will suggest pieces that suit you.",
              ],
            },
          },
          {
            id: "menswear",
            code: "A013",
            question: "Do you have menswear?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Yes. You will find sherwanis, bandhgalas, kurta sets and Indo western pieces under Men in the menu, for grooms and guests alike.",
              ],
            },
          },
          {
            id: "new-arrivals",
            code: "A014",
            question: "How often do new pieces arrive?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "New designer pieces arrive every Friday. Save the ones you love to your wishlist so they are easy to find again.",
              ],
            },
          },
          {
            id: "request-piece",
            code: "A015",
            question: "I am looking for something I cannot find. Can you help?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Tell us what you have in mind on WhatsApp: the designer, colour, silhouette or occasion. If we have something close, we will show you, and if a similar piece comes in, we will let you know.",
              ],
            },
          },
          {
            id: "wishlist",
            code: "A016",
            question: "How does the wishlist work?",
            appliesTo: "both",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Tap the heart on any piece to save it. You can save pieces without signing in, and they stay on that device. Sign in to keep your wishlist across all your devices.",
                "Saving a piece does not hold it or its dates for you.",
              ],
            },
          },
        ],
      },
      {
        id: "sizing-fit",
        title: "Sizing & fit",
        count: 6,
        questions: [
          {
            id: "fit",
            code: "A017",
            question: "How do I know a piece will fit me?",
            appliesTo: "both",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "Every listing shows the actual garment measurements, not just a label size, along with the height the piece suits best. Many Indian occasion pieces have blouse allowances or adjustable lehenga waists, and we note these in the listing.",
                `If you are unsure, message us on WhatsApp at ${ADMIN_FIGURES.support_whatsapp} before you book or buy. Sizing is the question we take most seriously.`,
              ],
            },
          },
          {
            id: "measure",
            code: "A018",
            question: "How should I take my measurements?",
            appliesTo: "both",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "Use a soft measuring tape, ideally over the kind of undergarments you plan to wear.",
              ],
              bullets: [
                "Bust: around the fullest part, keeping the tape level",
                "Waist: where you would wear the lehenga or skirt, which is often a little below the natural waist",
                "Hips: around the fullest part",
                "Length: from the waist to the floor, in the shoes you will wear",
              ],
              afterBullets: [
                "Compare these with the measurement table on the product page and leave a little room to breathe, dance and sit comfortably.",
              ],
            },
          },
          {
            id: "between-sizes",
            code: "A019",
            question: "What if I am between sizes?",
            appliesTo: "both",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "Go by the measurement table rather than the size label. Lehenga skirts often have a drawstring or an adjustable waist, and the listing tells you when a blouse has extra margin.",
                "Send us your measurements on WhatsApp and we will check them against the actual piece for you.",
              ],
            },
          },
          {
            id: "sizes-vary",
            code: "A020",
            question: "Do sizes vary between designers?",
            appliesTo: "both",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "They do, which is why we list the real measurements of each piece. A size M from one designer can fit quite differently from another, so the table is always your best guide.",
              ],
            },
          },
          {
            id: "altered-before",
            code: "A021",
            question: "How do I know if a piece has been altered before?",
            appliesTo: "both",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "Every listing discloses past alterations: what was changed, how much, and by whom where known. You will find this in the condition notes on the product page.",
              ],
            },
          },
          {
            id: "whats-included",
            code: "A022",
            question: "What is included with a piece?",
            appliesTo: "both",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "Everything included is listed on the product page, for example the lehenga, blouse and dupatta. Jewellery, footwear and accessories are not included unless the listing says so.",
              ],
            },
          },
        ],
      },
      {
        id: "rental-dates",
        title: "Rental dates",
        count: 14,
        hasRentalStrip: true,
        questions: [
          {
            id: "how-rent",
            code: "A023",
            question: "How does renting work?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              bullets: [
                "Choose your piece and size, then pick your dates on the availability calendar",
                "Pay the rental fee to confirm, and your dates are locked for you",
                "We arrange the refundable deposit, either at checkout or on WhatsApp, depending on the piece",
                `Your piece arrives dry-cleaned and pressed, ${ADMIN_FIGURES.arrive_before} before your event`,
                "Wear it, enjoy it, and we collect it after your window ends",
                "Once it is back and inspected, your deposit is refunded",
              ],
            },
          },
          {
            id: "lead-time",
            code: "A024",
            question: "How far in advance should I book?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                `We recommend booking at least ${ADMIN_FIGURES.lead_time} before your event. During peak wedding season, November to February, and April to June, booking ${ADMIN_FIGURES.peak_lead_time} ahead is wise for the most loved pieces.`,
                "Use the date planner above to see exactly when to book for your event. Once you book, your dates are locked and no one else can take that piece.",
              ],
            },
          },
          {
            id: "last-minute",
            code: "A025",
            question: "My event is in a few days. Can I still rent?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "Possibly. The calendar only shows dates we can still deliver for, based on where you are. If a piece shows your dates as available, you can book it. If you are unsure, message us and we will check what can reach you in time.",
              ],
            },
          },
          {
            id: "window",
            code: "A026",
            question: "How long can I keep a rental?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                `Most pieces offer a standard window of ${ADMIN_FIGURES.window_standard} and an extended window of ${ADMIN_FIGURES.window_extended}, which is ideal for destination weddings and multi-day functions. Each product page shows the windows and prices for that piece.`,
              ],
            },
          },
          {
            id: "window-start",
            code: "A027",
            question: "When does my rental window start and end?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                `Your window starts on the day your piece is delivered, which is ${ADMIN_FIGURES.arrive_before} before your event, and ends on your return date. Both dates are shown before you pay and again in your confirmation.`,
              ],
            },
          },
          {
            id: "greyed-dates",
            code: "A028",
            question: "Why are some dates greyed out?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "A greyed date means the piece is not free then. It may be booked by someone else, resting between rentals for cleaning and inspection, or too close for us to deliver to you in time.",
              ],
            },
          },
          {
            id: "multi-day",
            code: "A029",
            question: "I have several functions. How should I book?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "If you want to wear one piece across a few days, choose the extended window. If you want a different look for each function, book each piece for its own dates and message us: we can combine the deliveries wherever availability allows.",
              ],
            },
          },
          {
            id: "hold",
            code: "A030",
            question: "Can I hold a piece without paying?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "Dates are locked only when your booking is paid. Saving a piece to your wishlist does not hold it, so if you have found the one, it is best to book it.",
              ],
            },
          },
          {
            id: "same-piece-twice",
            code: "A031",
            question: "Can I rent the same piece for two different events?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "Yes. Each event is a separate booking with its own dates, as long as the piece is free for both.",
              ],
            },
          },
          {
            id: "several-pieces",
            code: "A032",
            question: "Can I rent more than one piece in one order?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "Yes. Add each piece to your bag with its own dates. Each piece is dispatched on its own schedule so it arrives in time for its event.",
              ],
            },
          },
          {
            id: "for-someone",
            code: "A033",
            question: "Can I rent for someone else or send it to a different address?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "Yes. Enter their delivery address at checkout, and make sure the WhatsApp number you give is one we can reach about delivery and pickup. The booking, and the deposit, stay in your name.",
              ],
            },
          },
          {
            id: "rental-included",
            code: "A034",
            question: "What is included in the rental price?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                `Professional cleaning before and after your rental, pressing, protective packaging and the return pickup are all included. Standard delivery is free on orders above ${ADMIN_FIGURES.free_delivery_min}, and GST at ${ADMIN_FIGURES.gst_rental} is added at checkout.`,
              ],
            },
          },
          {
            id: "shoot",
            code: "A035",
            question: "Can I rent for a photoshoot or pre-wedding shoot?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "Absolutely. Book it like any other occasion. Please take extra care with outdoor locations, as water, sand, mud and rough surfaces can cause damage that the deposit would need to cover.",
              ],
            },
          },
          {
            id: "will-they-know",
            code: "A036",
            question: "Will anyone know my outfit is rented?",
            appliesTo: "rent",
            adminTopic: "Choosing a piece",
            answer: {
              paragraphs: [
                "Only if you choose to tell them. Every piece arrives cleaned, pressed and ready to wear, looking exactly as it should on your big day.",
              ],
            },
          },
        ],
      },
      {
        id: "paying",
        title: "Paying",
        count: 10,
        questions: [
          {
            id: "pay-methods",
            code: "A037",
            question: "How can I pay?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                "You can pay by UPI (Google Pay, PhonePe, Paytm or any UPI app), credit or debit card (Visa, Mastercard, RuPay and American Express), net banking, or no-cost EMI on select cards.",
              ],
            },
          },
          {
            id: "emi",
            code: "A038",
            question: "Do you offer EMI?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                "Yes. No-cost EMI over 3, 6, 9 or 12 months is available on select cards. You will see the eligible options at checkout.",
              ],
            },
          },
          {
            id: "cod",
            code: "A039",
            question: "Can I pay cash on delivery?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                "Not at the moment. All orders are paid securely online at checkout.",
              ],
            },
          },
          {
            id: "secure",
            code: "A040",
            question: "Is my payment secure?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                "Yes. Payments are processed by Razorpay, which is PCI-DSS compliant, and every page is SSL encrypted. We never see or store your card or UPI details.",
              ],
            },
          },
          {
            id: "gst",
            code: "A041",
            question: "Are prices inclusive of GST?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                `Rental fees and preloved prices are shown before tax. GST is added at checkout, at ${ADMIN_FIGURES.gst_rental} on rentals and ${ADMIN_FIGURES.gst_preloved} on preloved pieces, and you see the full amount before you pay. The rental security deposit carries no GST.`,
              ],
            },
          },
          {
            id: "gst-invoice",
            code: "A042",
            question: "Can I get a GST invoice?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                "Yes. At checkout, tick I need a GST invoice and add your business name and GSTIN. You can download your invoice from your order confirmation, and we email it to you as well.",
              ],
            },
          },
          {
            id: "promo",
            code: "A043",
            question: "How do promo codes work?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                "Enter your code in your bag and the discount is applied before checkout. Codes apply to rental fees and prices, never to a security deposit, and each code has its own terms and expiry.",
              ],
            },
          },
          {
            id: "negotiable",
            code: "A044",
            question: "Are prices negotiable?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                "Rental prices are fixed. On preloved pieces, you are welcome to make an offer.",
              ],
              links: [
                {
                  text: "make an offer",
                  targetQuestionId: "offer-how",
                  targetMomentId: "pre",
                  targetSectionId: "offers",
                },
              ],
            },
          },
          {
            id: "payment-failed",
            code: "A045",
            question: "Money left my account but I did not get a confirmation. What now?",
            appliesTo: "both",
            adminTopic: "Payments & pricing",
            answer: {
              paragraphs: [
                "Give it a few minutes and check your email and WhatsApp, as banks sometimes confirm late. If you still have nothing, message us with the time and amount of the payment and we will check it straight away. If an order did not go through, your bank reverses the amount automatically.",
              ],
            },
          },
          {
            id: "deposit-when",
            code: "A046",
            question: "When and how do I pay the deposit?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            crossListed: "Sending it back > Your deposit",
            answer: {
              paragraphs: [
                "It depends on the piece, and the product page tells you which applies.",
                `For some pieces, the deposit is paid at checkout with your rental fee. For others, our team messages you on WhatsApp within ${ADMIN_FIGURES.deposit_contact} of your booking to arrange it by UPI or bank transfer. Your piece is dispatched once the deposit is received.`,
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "way",
    cardTitle: "It’s on its way",
    kicker: "ON ITS WAY",
    title: "It’s on its way",
    italicWord: "its way",
    subline: "When it arrives, how it travels, and what to do if something looks wrong.",
    appliesTo: "both",
    appliesToLabel: "RENT & PRELOVED",
    bgGradient: "linear-gradient(162deg, #353025 0%, #13100B 100%)",
    answerCount: 13,
    sections: [
      {
        id: "when-it-arrives",
        title: "When it arrives",
        count: 6,
        questions: [
          {
            id: "rental-arrive",
            code: "A047",
            question: "When will my rental arrive?",
            appliesTo: "rent",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                `Your rental arrives ${ADMIN_FIGURES.arrive_before} before your event, so you have time to try it on and settle in. This timing is fixed to your booking, so it is the same whichever delivery option you choose.`,
              ],
            },
          },
          {
            id: "preloved-arrive",
            code: "A048",
            question: "When will my preloved piece arrive?",
            appliesTo: "pre",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                `It is dispatched within ${ADMIN_FIGURES.preloved_dispatch} of your order. Standard delivery then takes ${ADMIN_FIGURES.standard_delivery}, and express delivery takes ${ADMIN_FIGURES.express_delivery}.`,
              ],
            },
          },
          {
            id: "same-day",
            code: "A049",
            question: "Do you offer same-day delivery?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                "Within Indore, same-day delivery is available on selected pieces, for rentals as well as preloved orders. If it is available for your order, you will see it at checkout.",
              ],
            },
          },
          {
            id: "delivery-cost",
            code: "A050",
            question: "How much does delivery cost?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                `Standard delivery is free on orders above ${ADMIN_FIGURES.free_delivery_min}. Express delivery is available at checkout for a small fee, and any delivery charge is always shown before you pay.`,
              ],
            },
          },
          {
            id: "where-deliver",
            code: "A051",
            question: "Where do you deliver?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                "We deliver across India. Enter your PIN code at checkout to confirm delivery to your address.",
              ],
            },
          },
          {
            id: "international",
            code: "A052",
            question: "Do you ship outside India?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                "Not yet. For now, we deliver within India only.",
              ],
            },
          },
        ],
      },
      {
        id: "tracking-delivery",
        title: "Tracking & delivery",
        count: 7,
        questions: [
          {
            id: "track",
            code: "A053",
            question: "How do I track my order?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                "The moment your piece is dispatched, we send the courier name and tracking number on WhatsApp and email. You can also follow every order and booking in My Account.",
              ],
            },
          },
          {
            id: "courier",
            code: "A054",
            question: "Which courier do you use?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                "We ship with trusted partners such as Blue Dart and Delhivery. Every shipment is insured and fully trackable.",
              ],
            },
          },
          {
            id: "packaging",
            code: "A055",
            question: "How will my piece be packed?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                "Each piece is wrapped in tissue inside a House of Kaira garment bag and placed in a protective box, so it arrives just as it should.",
              ],
            },
          },
          {
            id: "not-home",
            code: "A056",
            question: "What if I am not home when it is delivered?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                "If you know you will be away, tell us on WhatsApp and we will arrange a better time or someone else to receive it. For rentals especially, please make sure someone can accept the delivery so your dates are not affected.",
              ],
            },
          },
          {
            id: "change-address",
            code: "A057",
            question: "Can I change my delivery address after ordering?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                "Yes, as long as the piece has not been dispatched. Message us with your order number and the new address.",
              ],
            },
          },
          {
            id: "parcel-damaged",
            code: "A058",
            question: "What if my parcel arrives damaged or looks tampered with?",
            appliesTo: "both",
            adminTopic: "Delivery & tracking",
            answer: {
              paragraphs: [
                `Take photos of the packaging before opening it, and message us within ${ADMIN_FIGURES.issue_window} of delivery. We will look into it with the courier and help you straight away.`,
              ],
            },
          },
          {
            id: "not-fresh",
            code: "A059",
            question: "What if my piece does not feel fresh when it arrives?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            crossListed: "While I’m wearing it",
            answer: {
              paragraphs: [
                "It should never happen. Hygiene is not negotiable for us, and no piece leaves us without being professionally dry-cleaned and checked first.",
                `If anything ever feels less than fresh, we want to know straight away. Message us within ${ADMIN_FIGURES.issue_window} of delivery with a photo and we will put it right before your event.`,
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "wear",
    cardTitle: "While I’m wearing it",
    kicker: "WHILE IT’S WITH YOU",
    title: "While you’re wearing it",
    italicWord: "wearing it",
    subline: "Looking after your rental, from the first fitting to the last dance.",
    appliesTo: "rent",
    appliesToLabel: "RENTING",
    bgGradient: "linear-gradient(162deg, #432A2E 0%, #170B0E 100%)",
    answerCount: 12,
    hasCareNote: true,
    sections: [
      {
        id: "wearing-your-rental",
        title: "Wearing your rental",
        count: 12,
        questions: [
          {
            id: "care",
            code: "A060",
            question: "What do you ask of everyone who rents with us?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            crossListed: "Sending it back > Wear & damage",
            answer: {
              paragraphs: [
                "Simply this: treat the piece as your own. Every piece in our house was part of someone’s most special day, and it will be part of someone else’s next. We ask that you wear it with the same love and care it has always been given.",
                "In practice, that means:",
              ],
              bullets: [
                "Keep it on its padded hanger, in its garment bag, whenever you are not wearing it",
                "Keep food, drinks, perfume, mehendi and haldi at a gentle distance",
                "Never alter, wash, steam or iron it (fashion tape and gentle safety pins are fine)",
                "Tell us straight away if anything happens, however small, so we can help",
              ],
              afterBullets: [
                "Thank you for helping every piece stay beautiful for the next celebration.",
              ],
            },
          },
          {
            id: "on-arrival",
            code: "A061",
            question: "What should I do when my rental arrives?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                `Unpack it carefully, hang it on a padded hanger and try it on as soon as you can. If anything is not as expected, message us within ${ADMIN_FIGURES.issue_window} with a photo, so we can help while there is still time before your event.`,
              ],
            },
          },
          {
            id: "not-fresh-cross",
            originalId: "not-fresh",
            code: "A059",
            question: "What if my piece does not feel fresh when it arrives?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                "It should never happen. Hygiene is not negotiable for us, and no piece leaves us without being professionally dry-cleaned and checked first.",
                `If anything ever feels less than fresh, we want to know straight away. Message us within ${ADMIN_FIGURES.issue_window} of delivery with a photo and we will put it right before your event.`,
              ],
            },
          },
          {
            id: "rental-no-fit",
            code: "A062",
            question: "What if my rental does not fit when it arrives?",
            appliesTo: "rent",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "This is rare, because our quality team checks every piece against the measurements you give us. We know exactly how much these days matter to you.",
                `Your piece also arrives ${ADMIN_FIGURES.arrive_before} before your event, so there is time to try it on. If it does not fit, message us within ${ADMIN_FIGURES.issue_window} of delivery with a photo and we will arrange a swap with another piece that is free for your dates.`,
              ],
            },
          },
          {
            id: "alter-rental",
            code: "A063",
            question: "Can I alter a rental piece?",
            appliesTo: "rent",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "Rental pieces cannot be altered in any way, including stitching, hemming, cutting or taking in. Any alteration is treated as damage.",
                "Fashion tape and safety pins are absolutely fine for small adjustments on the day. Please use pins gently, as they sit in delicate fabric: if a pin marks, snags or tears the piece, that counts as damage.",
                "If fit is a concern, message us before you book and we will help you find a piece that works as it is.",
              ],
            },
          },
          {
            id: "steam",
            code: "A064",
            question: "Should I steam or iron the piece?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                "Please do not. Your piece arrives pressed and ready to wear. Heat can damage embroidery and delicate fabrics, so if you notice creases, hang it up for a few hours and they usually settle.",
              ],
            },
          },
          {
            id: "store",
            code: "A065",
            question: "How should I store it during my rental?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                "Keep it on a padded hanger in its garment bag, somewhere cool and away from direct sunlight, perfume and food.",
              ],
            },
          },
          {
            id: "perfume",
            code: "A066",
            question: "Can I wear perfume and makeup with my rental?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                "Yes, with a little care. Apply perfume and makeup before you dress and let them dry, and avoid spraying perfume directly onto the fabric. Take extra care around fresh mehendi, haldi and colour, which can stain.",
              ],
            },
          },
          {
            id: "spill",
            code: "A067",
            question: "What if I spill something on it?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                "Do not rub it or try any home remedy. Gently blot with a clean tissue, then let us know. Our cleaning specialists will handle it, and small marks from normal wear are not treated as damage.",
              ],
            },
          },
          {
            id: "multiple-wears",
            code: "A068",
            question: "Can I wear my rental more than once during my window?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                "Yes, it is yours to enjoy for the whole window. Just keep in mind that each wear is another chance for accidents, so treat it gently.",
              ],
            },
          },
          {
            id: "extend",
            code: "A069",
            question: "Can I extend my rental once I have it?",
            appliesTo: "rent",
            adminTopic: "Booking a rental",
            answer: {
              paragraphs: [
                "Message us before your return date. If nobody has booked the piece straight after you, we can extend your window, and the extra days are charged at the piece's daily rate.",
              ],
            },
          },
          {
            id: "insured",
            code: "A070",
            question: "Is the piece insured while I have it?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                "Pieces are insured while in transit. While the piece is with you, your security deposit is what covers accidental damage beyond normal wear.",
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "back",
    cardTitle: "Sending it back",
    kicker: "SENDING IT HOME",
    title: "Sending it home",
    italicWord: "home",
    subline: "Returning your rental, getting your deposit back, and what counts as damage.",
    appliesTo: "rent",
    appliesToLabel: "RENTING",
    bgGradient: "linear-gradient(162deg, #2B362F 0%, #0D1310 100%)",
    answerCount: 14,
    sections: [
      {
        id: "returning",
        title: "Returning",
        count: 5,
        questions: [
          {
            id: "return-how",
            code: "A071",
            question: "How do I return my rental?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "Returning is simple and prepaid, and you can choose whichever is easier for you.",
              ],
              bullets: [
                "Wrap the piece in the tissue it came in and place it in the House of Kaira garment bag",
                "Attach the prepaid return label from your package",
                `Either hand it to our courier at a pickup slot we confirm with you on WhatsApp, within ${ADMIN_FIGURES.pickup_within} of your return date, or drop it at your nearest Blue Dart centre`,
              ],
              afterBullets: [
                "Keep your pickup or drop-off receipt until your deposit is refunded.",
              ],
            },
          },
          {
            id: "return-clean",
            code: "A072",
            question: "Should I clean the piece before returning it?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "Please do not. Cleaning after your rental is handled entirely by us. Washing, steaming or spot cleaning at home can damage delicate work.",
              ],
            },
          },
          {
            id: "late-return",
            code: "A073",
            question: "What if I return my rental late?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "Late returns are charged at one day's rental rate for each extra day, because another customer may be waiting for the piece. If you think you may be late, tell us as early as you can.",
              ],
            },
          },
          {
            id: "pickup-delay",
            code: "A074",
            question: "What if the pickup is delayed on your side?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "If a pickup is delayed by us or our courier, you are not charged. Late fees never apply to a delay on our side.",
                "If our associate arrives at the slot we agreed and the piece cannot be handed over because nobody is available, late fees do apply, so please keep the slot we agree or tell us in advance if it needs to move.",
              ],
            },
          },
          {
            id: "lost-label",
            code: "A075",
            question: "I have lost the return label or garment bag. What do I do?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "Just message us. We will send you a new label, and any clean, sturdy bag will do for the journey back.",
              ],
            },
          },
        ],
      },
      {
        id: "your-deposit",
        title: "Your deposit",
        count: 4,
        questions: [
          {
            id: "deposit-what",
            code: "A076",
            question: "What is the security deposit?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "It is a refundable amount held against accidental damage beyond normal wear. The amount depends on the piece and is always shown on its product page. There is no GST on the deposit.",
              ],
            },
          },
          {
            id: "deposit-when-cross",
            originalId: "deposit-when",
            code: "A046",
            question: "When and how do I pay the deposit?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "It depends on the piece, and the product page tells you which applies.",
                `For some pieces, the deposit is paid at checkout with your rental fee. For others, our team messages you on WhatsApp within ${ADMIN_FIGURES.deposit_contact} of your booking to arrange it by UPI or bank transfer. Your piece is dispatched once the deposit is received.`,
              ],
            },
          },
          {
            id: "deposit-back",
            code: "A077",
            question: "When will I get my deposit back?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                `We inspect every piece within ${ADMIN_FIGURES.inspect_within} of receiving it. If all is well, your full deposit is refunded within ${ADMIN_FIGURES.deposit_refund_window}, and we confirm it on WhatsApp. You can follow its status in the Deposit Tracker in My Account.`,
              ],
            },
          },
          {
            id: "deposit-where",
            code: "A078",
            question: "Where will my deposit be refunded?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "A deposit paid at checkout goes back to your original payment method. A deposit paid by UPI or bank transfer goes back to the account it came from.",
              ],
            },
          },
        ],
      },
      {
        id: "wear-damage",
        title: "Wear & damage",
        count: 5,
        hasCareNote: true,
        questions: [
          {
            id: "care-cross",
            originalId: "care",
            code: "A060",
            question: "What do you ask of everyone who rents with us?",
            appliesTo: "rent",
            adminTopic: "Wearing your rental",
            answer: {
              paragraphs: [
                "Simply this: treat the piece as your own. Every piece in our house was part of someone’s most special day, and it will be part of someone else’s next. We ask that you wear it with the same love and care it has always been given.",
                "In practice, that means:",
              ],
              bullets: [
                "Keep it on its padded hanger, in its garment bag, whenever you are not wearing it",
                "Keep food, drinks, perfume, mehendi and haldi at a gentle distance",
                "Never alter, wash, steam or iron it (fashion tape and gentle safety pins are fine)",
                "Tell us straight away if anything happens, however small, so we can help",
              ],
              afterBullets: [
                "Thank you for helping every piece stay beautiful for the next celebration.",
              ],
            },
          },
          {
            id: "normal-wear",
            code: "A079",
            question: "What counts as normal wear?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "The small things that happen when a piece is worn and enjoyed: a few loose threads, a little embellishment loss, light creasing. These are expected and never deducted from your deposit.",
              ],
            },
          },
          {
            id: "damage-what",
            code: "A080",
            question: "What counts as damage?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "Damage is anything beyond normal wear, such as stains, tears, burns, significant bead or embroidery loss, or any alteration to the piece. It is assessed when the piece comes back to us.",
              ],
            },
          },
          {
            id: "damage-process",
            code: "A081",
            question: "What happens if my rental is damaged?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "Tell us straight away and please do not try to fix it yourself. When the piece is back, our team documents any damage with photographs and shares the details with you. We explain any deduction before a partial refund is processed, so there are no surprises.",
              ],
            },
          },
          {
            id: "damage-over",
            code: "A082",
            question: "What if the repair costs more than my deposit?",
            appliesTo: "rent",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "It is rare, but if repairs cost more than your deposit, the difference is charged to you.",
                "Every piece here belongs to someone who trusted us with something precious, and we have to be as fair to them as we are to you. We always share the full assessment, with photographs, before anything further is charged.",
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "pre",
    cardTitle: "Buying preloved",
    kicker: "BUYING PRELOVED",
    title: "Buying preloved",
    italicWord: "preloved",
    subline: "Condition grades, offers, and making a piece your own.",
    appliesTo: "pre",
    appliesToLabel: "PRELOVED",
    bgGradient: "linear-gradient(162deg, #4A3C2C 0%, #1B140E 100%)",
    answerCount: 20,
    sections: [
      {
        id: "buying",
        title: "Buying",
        count: 9,
        questions: [
          {
            id: "how-buy",
            code: "A083",
            question: "How does buying preloved work?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              bullets: [
                "Read the condition notes and look closely at the photographs",
                "Buy at the listed price, or make an offer",
                "Pay securely at checkout",
                `Your piece is dispatched within ${ADMIN_FIGURES.preloved_dispatch}`,
                "It arrives, and it is yours for keeps",
              ],
            },
          },
          {
            id: "preloved-meaning",
            code: "A084",
            question: "What does preloved mean at House of Kaira?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "It means the piece has been worn and loved by someone before you, usually for one or two occasions. Every preloved piece is professionally cleaned, reviewed, graded and photographed honestly, with the craftsmanship fully intact.",
              ],
            },
          },
          {
            id: "grades",
            code: "A085",
            question: "What do the condition grades mean?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "Pristine pieces are unworn or worn once for a short photoshoot, and may still have tags. Excellent pieces were worn once for a full day and show no visible damage. Good pieces have been worn two or three times, with any small imperfections photographed and disclosed.",
                "You will find the grade and the written condition notes on every product page.",
              ],
            },
          },
          {
            id: "retail-price",
            code: "A086",
            question: "Where does the original retail price come from?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "It comes from the lister's records, such as the original bill, and is shown for reference only when it is known.",
              ],
            },
          },
          {
            id: "preloved-clean",
            code: "A087",
            question: "Is a preloved piece cleaned before it reaches me?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "Yes. Every preloved piece is professionally cleaned and carefully packed before it is dispatched.",
              ],
            },
          },
          {
            id: "original-packaging",
            code: "A088",
            question: "Will it come with its original tags, box or certificate?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "Only if the listing says so. When a piece includes its original packaging, tags or a designer certificate, we mention it on the product page.",
              ],
            },
          },
          {
            id: "preloved-hold",
            code: "A089",
            question: "Can you keep a preloved piece aside for me?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "We cannot hold preloved pieces. Each one is a single piece, and it belongs to whoever completes the purchase first.",
              ],
            },
          },
          {
            id: "buy-rented",
            code: "A090",
            question: "I rented a piece and loved it. Can I buy it?",
            appliesTo: "both",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "If the piece is also listed for sale, you can buy it from its product page. If it is not, message us and we will ask whether its owner would consider selling.",
              ],
            },
          },
          {
            id: "gift",
            code: "A091",
            question: "Can I buy a preloved piece as a gift?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "Of course. Enter the recipient's address at checkout and the order confirmation and invoice will come to you.",
              ],
            },
          },
        ],
      },
      {
        id: "offers",
        title: "Offers",
        count: 6,
        questions: [
          {
            id: "offer-how",
            code: "A092",
            question: "How does Make an Offer work?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                `On any preloved product page, choose Make an offer, set your price and submit it. Our team reviews every offer and replies within ${ADMIN_FIGURES.offer_response} on WhatsApp or email, to accept it, suggest a counter offer, or let you know it is not possible this time.`,
              ],
            },
          },
          {
            id: "offer-reserve",
            code: "A093",
            question: "Does making an offer reserve the piece?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "No. The piece stays available until someone completes a purchase. If you would be heartbroken to lose it, buying at the listed price is the surest way to make it yours.",
              ],
            },
          },
          {
            id: "offer-accepted",
            code: "A094",
            question: "What happens if my offer is accepted?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "We send you a payment link to complete your purchase at the agreed price. The piece is yours the moment the payment is made.",
                "Until then it stays available to everyone else, and another shopper can still buy it, so it is worth completing quickly.",
              ],
            },
          },
          {
            id: "offer-min",
            code: "A095",
            question: "Is there a minimum offer?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "Yes. Each piece shows the lowest offer we can consider, so every offer you make is one we can seriously review.",
              ],
            },
          },
          {
            id: "offer-again",
            code: "A096",
            question: "Can I make more than one offer?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "Yes. If your first offer is not accepted, you are welcome to submit another.",
              ],
            },
          },
          {
            id: "offer-rental",
            code: "A097",
            question: "Can I make an offer on a rental?",
            appliesTo: "rent",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "No. Make an Offer is only available on preloved pieces. Rental prices are fixed.",
              ],
            },
          },
        ],
      },
      {
        id: "after-it-arrives",
        title: "After it arrives",
        count: 5,
        questions: [
          {
            id: "preloved-return",
            code: "A098",
            question: "Can I return a preloved piece?",
            appliesTo: "pre",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                "Preloved pieces are a final sale and cannot be returned or exchanged once dispatched. Please read the condition notes, look closely at the photographs and check the measurements before you buy. We are always happy to answer questions first.",
              ],
            },
          },
          {
            id: "not-as-described",
            code: "A099",
            question: "What if my preloved piece is not as described?",
            appliesTo: "pre",
            adminTopic: "Returns, deposits & damage",
            answer: {
              paragraphs: [
                `Message us on WhatsApp within ${ADMIN_FIGURES.issue_window} of delivery with photos, and we will look into it personally and do our best to put it right.`,
              ],
            },
          },
          {
            id: "preloved-no-fit",
            code: "A100",
            question: "What if a preloved piece does not fit?",
            appliesTo: "pre",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "Preloved pieces are a final sale, so they cannot be returned for fit. That is exactly why we share full measurements and are always happy to check them with you before you buy.",
                "If it needs a small adjustment, a good tailor can usually help. And if it is not meant to be, you can list it with us for its next chapter.",
              ],
              links: [
                {
                  text: "list it with us",
                  url: "/list-your-piece",
                },
              ],
            },
          },
          {
            id: "alter-preloved",
            code: "A101",
            question: "Can I alter a preloved piece after I buy it?",
            appliesTo: "pre",
            adminTopic: "Sizing & fit",
            answer: {
              paragraphs: [
                "Yes, once it is yours you are free to have it tailored. We would suggest a karigar who is experienced with heavy embroidery and delicate fabrics.",
              ],
            },
          },
          {
            id: "resell",
            code: "A102",
            question: "Can I sell a piece again later?",
            appliesTo: "pre",
            adminTopic: "Buying preloved",
            answer: {
              paragraphs: [
                "Yes. When you are ready for it to find its next home, you can list it with us.",
              ],
              links: [
                {
                  text: "list it with us",
                  url: "/list-your-piece",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "plans",
    cardTitle: "Plans have changed",
    kicker: "WHEN PLANS CHANGE",
    title: "When plans change",
    italicWord: "change",
    subline: "Cancelling, moving your dates, and how refunds work.",
    appliesTo: "both",
    appliesToLabel: "RENT & PRELOVED",
    bgGradient: "linear-gradient(162deg, #302B37 0%, #100D14 100%)",
    answerCount: 8,
    sections: [
      {
        id: "cancellations-changes",
        title: "Cancellations & changes",
        count: 8,
        questions: [
          {
            id: "cancel-rental",
            code: "A103",
            question: "Can I cancel a rental?",
            appliesTo: "rent",
            adminTopic: "Cancellations & changes",
            answer: {
              paragraphs: [
                "Yes. Go to My Account, open your booking and choose Cancel Booking, or message us.",
                `If you cancel more than ${ADMIN_FIGURES.rental_cancel_full} before your rental start date, you receive a full refund of your rental fee.`,
              ],
            },
          },
          {
            id: "cancel-late",
            code: "A104",
            question: `What if I cancel within ${ADMIN_FIGURES.rental_cancel_full} of my rental start date?`,
            appliesTo: "rent",
            adminTopic: "Cancellations & changes",
            answer: {
              paragraphs: [
                "By then your piece has been held back from other customers, and its cleaning and inspection have already been arranged, so a full refund is not possible.",
                "Do message us anyway. We will always help however we can, for example by moving your booking to another date.",
              ],
            },
          },
          {
            id: "cancel-dispatched",
            code: "A105",
            question: "Can I cancel after my rental has been dispatched?",
            appliesTo: "rent",
            adminTopic: "Cancellations & changes",
            answer: {
              paragraphs: [
                "Once a rental is on its way, it can no longer be cancelled or refunded.",
              ],
            },
          },
          {
            id: "change-dates",
            code: "A106",
            question: "Can I change my rental dates?",
            appliesTo: "rent",
            adminTopic: "Cancellations & changes",
            answer: {
              paragraphs: [
                "Yes, before your piece is dispatched. Message us with your new dates. If the piece is free, we move your booking and adjust any difference in price.",
              ],
            },
          },
          {
            id: "event-moved",
            code: "A107",
            question: "My event has been postponed. What now?",
            appliesTo: "rent",
            adminTopic: "Cancellations & changes",
            answer: {
              paragraphs: [
                "We understand, plans change. Tell us as early as you can. We will first try to move your booking to the new date, and if that is not possible, cancellation follows our usual policy.",
              ],
            },
          },
          {
            id: "cancel-preloved",
            code: "A108",
            question: "Can I cancel a preloved order?",
            appliesTo: "pre",
            adminTopic: "Cancellations & changes",
            answer: {
              paragraphs: [
                "Yes, as long as it has not been dispatched, and you receive a full refund. Once a preloved piece is on its way, the sale is final.",
              ],
            },
          },
          {
            id: "refund-time",
            code: "A109",
            question: "How long do refunds take?",
            appliesTo: "both",
            adminTopic: "Cancellations & changes",
            decisionNote: "The refund timeline is not stated anywhere in the storefront yet.",
            answer: {
              paragraphs: [
                `We process refunds as soon as a cancellation is confirmed. The money goes back to your original payment method and usually appears within ${ADMIN_FIGURES.refund_timeline}, depending on your bank.`,
              ],
            },
          },
          {
            id: "hok-cancels",
            code: "A110",
            question: "What if House of Kaira has to cancel my booking?",
            appliesTo: "rent",
            adminTopic: "Cancellations & changes",
            answer: {
              paragraphs: [
                "It is rare, but occasionally a piece becomes unavailable, for example if it is damaged before your dates. If that happens, we tell you immediately, refund you in full automatically, and help you find something just as lovely for your event.",
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "account",
    cardTitle: "Your account & help",
    kicker: "YOUR ACCOUNT",
    title: "Your account & help",
    italicWord: "& help",
    subline: "Signing in, your orders, your data, and how to reach us.",
    appliesTo: "both",
    appliesToLabel: "RENT & PRELOVED",
    answerCount: 10,
    isAccountOnly: true, // No card in hero row
    sections: [
      {
        id: "your-account-help",
        title: "Your account & help",
        count: 10,
        questions: [
          {
            id: "need-account",
            code: "A111",
            question: "Do I need an account to shop?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              paragraphs: [
                "You can browse and save pieces without one. To check out, sign in with your mobile number and a one-time code, your email, or Google.",
              ],
            },
          },
          {
            id: "my-orders",
            code: "A112",
            question: "Where can I see my bookings and orders?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              paragraphs: [
                "In My Account. Rentals show your dates, status and deposit, and orders show status and tracking.",
              ],
            },
          },
          {
            id: "statuses",
            code: "A113",
            question: "What does my booking status mean?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              bullets: [
                "Confirmed: your booking is paid and your dates are locked",
                "Dispatched: your piece is on its way",
                "Active: your piece is with you",
                "Returned: we have received your piece and are inspecting it",
                "Completed: all done, and your deposit is refunded",
                "Cancelled: the booking was cancelled, and any refund is shown on the booking",
              ],
            },
          },
          {
            id: "update-details",
            code: "A114",
            question: "How do I update my details or addresses?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              paragraphs: [
                "Go to My Account, where you can edit your profile and add, change or remove saved addresses. Orders already on their way are not affected.",
              ],
            },
          },
          {
            id: "notifications",
            code: "A115",
            question: "How will you keep in touch with me?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              paragraphs: [
                "We send booking, dispatch and return updates on WhatsApp, and confirmations and invoices by email. You can choose what you receive in your notification settings, and marketing messages are always optional.",
              ],
            },
          },
          {
            id: "data",
            code: "A116",
            question: "Is my personal information safe?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              paragraphs: [
                "Yes. We use your details only to fulfil your orders and keep you updated, and share them only with our courier and payment partners. We never sell your data. Read our Privacy Policy for more.",
              ],
              links: [
                {
                  text: "Privacy Policy",
                  url: "/privacy",
                },
              ],
            },
          },
          {
            id: "delete-account",
            code: "A117",
            question: "How do I delete my account?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            decisionNote: "Confirm deletion is held while a rental or deposit is open.",
            answer: {
              paragraphs: [
                "Go to My Account and choose Delete Account. This is permanent and removes your booking history and saved details. If you have a rental in progress or a deposit waiting to be refunded, we settle that first.",
              ],
            },
          },
          {
            id: "contact",
            code: "A118",
            question: "How can I reach you on WhatsApp or email?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              paragraphs: [
                `WhatsApp is fastest: ${ADMIN_FIGURES.support_whatsapp}, ${ADMIN_FIGURES.support_days}, ${ADMIN_FIGURES.support_hours}. We usually reply within ${ADMIN_FIGURES.support_sla}. You can also email ${ADMIN_FIGURES.support_email}, which is best when you want to send photos or documents.`,
              ],
            },
          },
          {
            id: "share-photos",
            code: "A119",
            question: "Can I share photos wearing my piece?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              paragraphs: [
                `We would love that. Tag us at ${ADMIN_FIGURES.instagram_handle} so we can celebrate your moment with you.`,
              ],
            },
          },
          {
            id: "list-mine",
            code: "A120",
            question: "I would like to rent out or sell my own piece. Where do I start?",
            appliesTo: "both",
            adminTopic: "Your account & help",
            answer: {
              paragraphs: [
                "We would love to see it. Start with List Your Piece, and read How It Works for everything about listing and earning with us.",
              ],
              links: [
                {
                  text: "List Your Piece",
                  url: "/list-your-piece",
                },
                {
                  text: "How It Works",
                  url: "/how-it-works",
                },
              ],
            },
          },
        ],
      },
    ],
  },
];

// Flat map of all questions for O(1) lookups by ID and search indexing
export const ALL_QUESTIONS = [];
export const QUESTION_MAP = {};

FAQ_MOMENTS.forEach((moment) => {
  moment.sections.forEach((sec) => {
    sec.questions.forEach((q, idx) => {
      const nextQ = sec.questions[idx + 1] || null;
      const enrichedQ = {
        ...q,
        momentId: moment.id,
        momentTitle: moment.title,
        momentKicker: moment.kicker,
        sectionId: sec.id,
        sectionTitle: sec.title,
        nextQuestion: nextQ
          ? {
              id: nextQ.id,
              question: nextQ.question,
              momentId: moment.id,
              sectionId: sec.id,
            }
          : null,
      };

      ALL_QUESTIONS.push(enrichedQ);
      QUESTION_MAP[q.id] = enrichedQ;
    });
  });
});

export default FAQ_MOMENTS;
