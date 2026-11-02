/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Registry: Shipping Policy Answers (Spec § 8.15, 50 items)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem } from '../types/answers.types';

export const SHIPPING_ANSWERS: AnswerItem[] = [
  {
    "id": "w-how",
    "question": "How does the rental window work?",
    "section": "Rental window",
    "side": "both",
    "statusTag": {
      "label": "3 days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "w-how_p_0",
        "kind": "paragraph",
        "text": "Every rental comes with a standard rental window of 3 days: your piece arrives the day before your celebration, is yours for the day itself, and goes back the day after. The rental price shown on each piece covers the whole window."
      },
      {
        "id": "w-how_p_1",
        "kind": "paragraph",
        "text": "For a celebration on the 5th, your piece arrives on the 4th and goes back on the 6th. The day before gives you time to try it on at leisure, so the day itself is simply yours to enjoy."
      }
    ],
    "searchWords": "rental window how long days arrive return day before after period",
    "linkName": "w-how",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Rental window"
    ],
    "orderIndex": 1
  },
  {
    "id": "w-dates",
    "question": "Which dates do I choose when I book?",
    "section": "Rental window",
    "side": "both",
    "paragraphs": [
      {
        "id": "w-dates_p_0",
        "kind": "paragraph",
        "text": "Simply the date of your celebration. We plan everything around it: the day your piece arrives and the day it goes back are shown in your booking summary before you pay, and again in your confirmation."
      },
      {
        "id": "w-dates_p_1",
        "kind": "paragraph",
        "text": "Celebrating over more than one day? Choose the date of your first function and your last, and we plan around both."
      },
      {
        "id": "w-dates_p_2",
        "kind": "paragraph",
        "text": "Travelling for your celebration, within India or abroad? Message us before you book, and we will plan your dates around your journey."
      }
    ],
    "searchWords": "dates choose book booking calendar event date start end which travel travelling outstation destination journey",
    "linkName": "w-dates",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Rental window"
    ],
    "orderIndex": 2
  },
  {
    "id": "w-wedding",
    "question": "My wedding has functions over several days. How does that work?",
    "section": "Rental window",
    "side": "both",
    "statusTag": {
      "label": "One delivery, one pickup",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "w-wedding_p_0",
        "kind": "paragraph",
        "text": "Simply add one extra day for each additional day of celebrations. Your pieces arrive the day before your first function and go back the day after your last, so everything you need is with you from start to finish."
      },
      {
        "id": "w-wedding_p_1",
        "kind": "paragraph",
        "text": "With a haldi and sangeet on one day and the wedding the next, for example, you need 4 days: your standard 3 days, plus 1 extra day at the piece's daily rate. The extra day is shown in your booking summary before you pay."
      },
      {
        "id": "w-wedding_p_2",
        "kind": "paragraph",
        "text": "Every piece booked for the same celebration travels together and comes back together, in one delivery and one pickup, so nothing ever needs sending back in the middle of your festivities."
      }
    ],
    "searchWords": "wedding several days functions haldi mehendi sangeet multiple outfits pieces together",
    "linkName": "w-wedding",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Rental window"
    ],
    "orderIndex": 3
  },
  {
    "id": "w-extra",
    "question": "Can I keep a piece for longer?",
    "section": "Rental window",
    "side": "both",
    "statusTag": {
      "label": "Add days when you book",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "w-extra_p_0",
        "kind": "paragraph",
        "text": "Of course. Add extra days when you book, at the piece's daily rate shown on its product page. A day at the start is lovely for a relaxed fitting."
      },
      {
        "id": "w-extra_p_1",
        "kind": "paragraph",
        "text": "Once your piece is with you, message us before your Return Date if you would like it a little longer. If no one has booked it straight after you, we extend your rental at the same daily rate, plus 18% GST."
      }
    ],
    "searchWords": "keep longer extra days extend extension more days fitting try on early",
    "linkName": "w-extra",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Rental window"
    ],
    "orderIndex": 4
  },
  {
    "id": "w-book",
    "question": "How far ahead should I book?",
    "section": "Rental window",
    "side": "both",
    "paragraphs": [
      {
        "id": "w-book_p_0",
        "kind": "paragraph",
        "text": "As early as you can, especially in wedding season, November to February, and April to June, when we suggest booking 3 to 4 weeks ahead, as the most loved pieces are reserved early."
      },
      {
        "id": "w-book_p_1",
        "kind": "paragraph",
        "text": "Our booking calendar only shows dates we can deliver to your pincode in good time, so any date you can choose is one we can meet. Booking close to your celebration? Express or, within Indore, same day delivery can open up nearer dates."
      }
    ],
    "searchWords": "how far ahead advance book early lead time season peak last minute",
    "linkName": "w-book",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Rental window"
    ],
    "orderIndex": 5
  },
  {
    "id": "w-holiday",
    "question": "What if my dates fall on a Sunday or a public holiday?",
    "section": "Rental window",
    "side": "both",
    "paragraphs": [
      {
        "id": "w-holiday_p_0",
        "kind": "paragraph",
        "text": "Our delivery partners do not always deliver or collect on Sundays and public holidays. If the day your piece is due to arrive is one of them, it reaches you a day earlier, at no extra cost. If your Return Date is one of them, we book your pickup for the next day they collect, and that extra day is never charged."
      }
    ],
    "searchWords": "sunday public holiday festival courier closed delivery pickup weekend",
    "linkName": "w-holiday",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Rental window"
    ],
    "orderIndex": 6
  },
  {
    "id": "c-free",
    "question": "When is delivery free?",
    "section": "Charges",
    "side": "both",
    "statusTag": {
      "label": "From ₹5,000",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "c-free_p_0",
        "kind": "paragraph",
        "text": "Standard delivery is free on every order of ₹5,000 or more, measured on the price of your pieces before GST. For a rental, that covers both journeys: to you, and back to us."
      },
      {
        "id": "c-free_p_1",
        "kind": "paragraph",
        "text": "Your security deposit is not counted towards it, as it is held separately from your order."
      }
    ],
    "searchWords": "free delivery shipping threshold minimum order cost charges",
    "linkName": "c-free",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Charges"
    ],
    "orderIndex": 7
  },
  {
    "id": "c-below",
    "question": "What does delivery cost on smaller orders?",
    "section": "Charges",
    "side": "both",
    "paragraphs": [
      {
        "id": "c-below_p_0",
        "kind": "paragraph",
        "text": "It is worked out for your delivery address and shown at checkout before you pay. For a rental, the amount already covers the journey back to us, so there is never anything more to pay when your piece comes back."
      }
    ],
    "searchWords": "delivery cost charge small order below threshold how much shipping fee",
    "linkName": "c-below",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Charges"
    ],
    "orderIndex": 8
  },
  {
    "id": "c-return",
    "question": "Do I pay anything to send my rental back?",
    "section": "Charges",
    "side": "both",
    "statusTag": {
      "label": "Nothing more",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "c-return_p_0",
        "kind": "paragraph",
        "text": "No. Your return label comes prepaid in your packaging, and the journey back is already part of your delivery. Nothing is collected at your door, and nothing is taken from your deposit for it."
      },
      {
        "id": "c-return_p_1",
        "kind": "paragraph",
        "text": "The only exception is a second pickup, if the first is missed on your side."
      }
    ],
    "searchWords": "return shipping cost pay label prepaid send back charge",
    "linkName": "c-return",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Charges"
    ],
    "orderIndex": 9
  },
  {
    "id": "c-express",
    "question": "How much does express delivery cost?",
    "section": "Charges",
    "side": "both",
    "statusTag": {
      "label": "Quoted before you pay",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "c-express_p_0",
        "kind": "paragraph",
        "text": "It depends on where your piece is travelling, so we never quote a flat fee. You will see the exact amount at checkout, before you pay."
      },
      {
        "id": "c-express_p_1",
        "kind": "paragraph",
        "text": "Express is a faster service on top of standard delivery, so it is charged even when standard delivery is free. For a preloved piece it usually takes 1 to 2 business days once dispatched; for a rental, it lets you book closer to your date."
      }
    ],
    "searchWords": "express faster quick delivery cost fee price urgent",
    "linkName": "c-express",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Charges"
    ],
    "orderIndex": 10
  },
  {
    "id": "c-same",
    "question": "Do you deliver on the same day?",
    "section": "Charges",
    "side": "both",
    "statusTag": {
      "label": "Within Indore",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "c-same_p_0",
        "kind": "paragraph",
        "text": "Yes, within Indore, for rentals and preloved pieces alike. Whenever it is available for your order, you will see it at checkout with its charge, before you pay."
      }
    ],
    "searchWords": "same day today indore local fast urgent delivery",
    "linkName": "c-same",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Charges"
    ],
    "orderIndex": 11
  },
  {
    "id": "c-several",
    "question": "I am ordering several pieces. Is delivery charged on each?",
    "section": "Charges",
    "side": "both",
    "paragraphs": [
      {
        "id": "c-several_p_0",
        "kind": "paragraph",
        "text": "No. Pieces that travel together, such as everything booked for the same celebration, are delivered together and count as one order towards free delivery."
      }
    ],
    "searchWords": "several pieces multiple orders together delivery charge each one",
    "linkName": "c-several",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Charges"
    ],
    "orderIndex": 12
  },
  {
    "id": "c-refund",
    "question": "Are delivery charges ever refunded?",
    "section": "Charges",
    "side": "both",
    "paragraphs": [
      {
        "id": "c-refund_p_0",
        "kind": "paragraph",
        "text": "Yes, whenever an order is cancelled before dispatch, and whenever we are the reason something went wrong. Once a piece has been delivered as ordered, delivery charges are not refunded. Our Refund & Cancellation Policy explains every case."
      }
    ],
    "searchWords": "delivery charge refunded refund shipping fee cancel back",
    "linkName": "c-refund",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Charges"
    ],
    "orderIndex": 13
  },
  {
    "id": "p-when",
    "question": "When will my preloved piece be dispatched?",
    "section": "Preloved",
    "side": "both",
    "statusTag": {
      "label": "Within 2 business days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "p-when_p_0",
        "kind": "paragraph",
        "text": "Within 2 business days of your order, for most pieces. The dispatch date for your piece is always shown on its product page and in your order summary before you pay, and we message you the moment it leaves us."
      },
      {
        "id": "p-when_p_1",
        "kind": "paragraph",
        "text": "A few pieces take a little longer, either because they are kept by their owners or because they have rentals booked first."
      }
    ],
    "searchWords": "dispatch preloved when ship leave send buy order",
    "linkName": "p-when",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Preloved"
    ],
    "orderIndex": 14
  },
  {
    "id": "p-clean",
    "question": "Is my preloved piece cleaned before it is sent?",
    "section": "Preloved",
    "side": "both",
    "statusTag": {
      "label": "Checked and pressed",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "p-clean_p_0",
        "kind": "paragraph",
        "text": "Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed. A piece that has never been worn is checked and pressed instead of cleaned, so it stays exactly as new."
      }
    ],
    "searchWords": "clean cleaned fresh preloved pressed hygiene dry clean",
    "linkName": "p-clean",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Preloved"
    ],
    "orderIndex": 15
  },
  {
    "id": "p-owner",
    "question": "Why do some pieces take longer to leave you?",
    "section": "Preloved",
    "side": "both",
    "statusTag": {
      "label": "Within 10 business days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "p-owner_p_0",
        "kind": "paragraph",
        "text": "Some pieces stay with their owners until they find a new home. When you order one, it comes to us first, so it can be prepared like every other piece before it travels on to you."
      },
      {
        "id": "p-owner_p_1",
        "kind": "paragraph",
        "text": "These pieces leave us within 10 business days, and their product page says so clearly before you pay."
      }
    ],
    "searchWords": "longer slow owner lister kept home why delay dispatch",
    "linkName": "p-owner",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Preloved"
    ],
    "orderIndex": 16
  },
  {
    "id": "p-booked",
    "question": "The piece I want to buy has rentals booked. When will it reach me?",
    "section": "Preloved",
    "side": "both",
    "paragraphs": [
      {
        "id": "p-booked_p_0",
        "kind": "paragraph",
        "text": "Some pieces can be rented as well as bought. If yours already has rentals booked, those celebrations go ahead first, and your piece is dispatched once it has come back from the last one and been cleaned and checked. You will see that dispatch date before you pay."
      },
      {
        "id": "p-booked_p_1",
        "kind": "paragraph",
        "text": "If anything were to happen to it in the meantime, we would tell you straight away, and you could choose a full refund."
      }
    ],
    "searchWords": "rentals booked before buy piece rented sold after later dispatch both",
    "linkName": "p-booked",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Preloved"
    ],
    "orderIndex": 17
  },
  {
    "id": "p-time",
    "question": "How long does delivery take once it has left you?",
    "section": "Preloved",
    "side": "both",
    "statusTag": {
      "label": "3 to 5 business days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "p-time_p_0",
        "kind": "paragraph",
        "text": "Standard delivery usually takes 3 to 5 business days from dispatch, and express 1 to 2 business days. Within Indore, same day delivery is often possible."
      },
      {
        "id": "p-time_p_1",
        "kind": "paragraph",
        "text": "These are our delivery partners' usual times, and a few remote pincodes can take a little longer."
      }
    ],
    "searchWords": "how long delivery take days transit arrive preloved standard express",
    "linkName": "p-time",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Preloved"
    ],
    "orderIndex": 18
  },
  {
    "id": "p-business",
    "question": "What do you mean by business days?",
    "section": "Preloved",
    "side": "both",
    "paragraphs": [
      {
        "id": "p-business_p_0",
        "kind": "paragraph",
        "text": "Monday to Friday, 10 AM to 8 PM, excluding public holidays. Dispatch and delivery times are counted in business days, though our team tries to be available every day of the week."
      }
    ],
    "searchWords": "business days working days what counts weekend saturday sunday",
    "linkName": "p-business",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Preloved"
    ],
    "orderIndex": 19
  },
  {
    "id": "a-track",
    "question": "How do I follow my delivery?",
    "section": "Arrival",
    "side": "both",
    "paragraphs": [
      {
        "id": "a-track_p_0",
        "kind": "paragraph",
        "text": "The moment your piece is on its way, we send you its tracking details on WhatsApp and by email. You can also follow every order and booking in My Account."
      }
    ],
    "searchWords": "track tracking where is my order status follow delivery",
    "linkName": "a-track",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 20
  },
  {
    "id": "a-pack",
    "question": "How will my piece be packed?",
    "section": "Arrival",
    "side": "both",
    "paragraphs": [
      {
        "id": "a-pack_p_0",
        "kind": "paragraph",
        "text": "Each piece is wrapped in tissue inside a House of Kaira garment bag and placed in a protective box, so it arrives just as it should."
      },
      {
        "id": "a-pack_p_1",
        "kind": "paragraph",
        "text": "If you are renting, please keep the box and garment bag safe: your piece goes back to us in them."
      }
    ],
    "searchWords": "packed packaging box garment bag tissue how arrive",
    "linkName": "a-pack",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 21
  },
  {
    "id": "a-where",
    "question": "Can you deliver to a hotel, a venue or another city?",
    "section": "Arrival",
    "side": "both",
    "statusTag": {
      "label": "Anywhere in India",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "a-where_p_0",
        "kind": "paragraph",
        "text": "Yes. We deliver anywhere in India our delivery partners reach, including your hotel or venue for a destination wedding. Just add the name and phone number of the person receiving it."
      },
      {
        "id": "a-where_p_1",
        "kind": "paragraph",
        "text": "For a rental, we collect it from the same place on your Return Date, unless you let us know otherwise before then. For some high value pieces, we may first ask for ID, as our Deposit Policy explains."
      },
      {
        "id": "a-where_p_2",
        "kind": "paragraph",
        "text": "Would you rather take your piece with you? We can plan for that too."
      }
    ],
    "searchWords": "hotel venue destination wedding another city different address deliver where outstation travel",
    "linkName": "a-where",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 22
  },
  {
    "id": "a-receive",
    "question": "Does someone need to be there to receive it?",
    "section": "Arrival",
    "side": "both",
    "paragraphs": [
      {
        "id": "a-receive_p_0",
        "kind": "paragraph",
        "text": "Yes, please. Your piece is handed over in person, so you, or the person named on your order, will need to be there to receive it. If you know you will be away, tell us before dispatch and we will arrange a better time, or someone else to receive it."
      }
    ],
    "searchWords": "someone home receive accept delivery available sign person",
    "linkName": "a-receive",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 23
  },
  {
    "id": "a-missed",
    "question": "I missed my delivery",
    "section": "Arrival",
    "side": "both",
    "paragraphs": [
      {
        "id": "a-missed_p_0",
        "kind": "paragraph",
        "text": "Message us straight away and we will arrange a second delivery. If the first attempt was missed because no one was available, a redelivery charge applies: our delivery partner's charge to us, plus GST, shown to you before it is booked."
      },
      {
        "id": "a-missed_p_1",
        "kind": "paragraph",
        "text": "For a rental, if a second delivery cannot reach you before your celebration, the rental fee cannot be refunded, as our Refund & Cancellation Policy explains. Your deposit comes back in full once the piece is back with us, unworn."
      }
    ],
    "searchWords": "missed delivery not home failed attempt redelivery second delivery charge",
    "linkName": "a-missed",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 24
  },
  {
    "id": "a-address",
    "question": "Can I change my delivery address?",
    "section": "Arrival",
    "side": "both",
    "paragraphs": [
      {
        "id": "a-address_p_0",
        "kind": "paragraph",
        "text": "Yes, as long as your piece has not been dispatched. Message us with your order number and the new address. Once it is on its way, we will do our best, though a change cannot always be made."
      }
    ],
    "searchWords": "change address update wrong address redirect",
    "linkName": "a-address",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 25
  },
  {
    "id": "a-check",
    "question": "What should I check when my piece arrives?",
    "section": "Arrival",
    "side": "both",
    "statusTag": {
      "label": "Within 24 hours",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "a-check_p_0",
        "kind": "paragraph",
        "text": "Open it as soon as you can and try it on. If anything is not right, whether it does not fit, is not as described, is the wrong piece or is missing something the listing includes, message us within 24 hours of delivery with photographs, so we can help while there is still time."
      },
      {
        "id": "a-check_p_1",
        "kind": "paragraph",
        "text": "How to look after your piece from there is in our Care, Cleaning & Damage Policy."
      }
    ],
    "searchWords": "check arrival inspect try on not right fit wrong missing report",
    "linkName": "a-check",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 26
  },
  {
    "id": "a-damaged",
    "question": "The parcel arrived damaged or looks tampered with",
    "section": "Arrival",
    "side": "both",
    "statusTag": {
      "label": "Tell us within 24 hours",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "a-damaged_p_0",
        "kind": "paragraph",
        "text": "Take photographs of the packaging before you open it, and message us within 24 hours of delivery. If you can, record a short video as you unpack it, which helps us settle things with our delivery partner quickly."
      },
      {
        "id": "a-damaged_p_1",
        "kind": "paragraph",
        "text": "If the piece itself has been harmed, we replace it if we can reach you in time, or refund you in full, as our Refund & Cancellation Policy explains."
      }
    ],
    "searchWords": "parcel damaged box torn tampered opened broken",
    "linkName": "a-damaged",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 27
  },
  {
    "id": "a-refuse",
    "question": "Can I refuse the parcel at the door?",
    "section": "Arrival",
    "side": "both",
    "paragraphs": [
      {
        "id": "a-refuse_p_0",
        "kind": "paragraph",
        "text": "You can, but refusing a parcel counts as cancelling after dispatch, which our Refund & Cancellation Policy covers."
      },
      {
        "id": "a-refuse_p_1",
        "kind": "paragraph",
        "text": "If you are refusing it because the parcel looks damaged or tampered with, take a photograph and message us straight away. That is different, and we will look after you."
      }
    ],
    "searchWords": "refuse parcel reject delivery door return to sender",
    "linkName": "a-refuse",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Arrival"
    ],
    "orderIndex": 28
  },
  {
    "id": "r-how",
    "question": "How does my rental go back?",
    "section": "Returns",
    "side": "both",
    "statusTag": {
      "label": "We collect it",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "r-how_p_0",
        "kind": "paragraph",
        "text": "We book a pickup from your door for your Return Date, the day after your celebration, and confirm the time with you on WhatsApp. Simply pack your piece as it arrived and hand it to our delivery partner."
      },
      {
        "id": "r-how_p_1",
        "kind": "paragraph",
        "text": "If it suits you better, you can drop it at our delivery partner's nearest office instead, using the prepaid label in your packaging. Either way, keep the receipt you are given until your deposit is back."
      }
    ],
    "searchWords": "return send back how pickup collect courier drop off office label",
    "linkName": "r-how",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 29
  },
  {
    "id": "r-pack",
    "question": "How do I pack it?",
    "section": "Returns",
    "side": "both",
    "paragraphs": [
      {
        "id": "r-pack_p_0",
        "kind": "paragraph",
        "text": "Just as it arrived: wrapped in its tissue, in its garment bag, inside its box, with every part of the outfit and anything else that came with it."
      },
      {
        "id": "r-pack_p_1",
        "kind": "paragraph",
        "text": "Please do not wash, steam or clean it first. Professional cleaning after every rental is taken care of by us, and home remedies can harm delicate work. Our Care, Cleaning & Damage Policy explains more."
      }
    ],
    "searchWords": "pack packing how return box garment bag tissue clean wash steam",
    "linkName": "r-pack",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 30
  },
  {
    "id": "r-ontime",
    "question": "When does my piece count as returned on time?",
    "section": "Returns",
    "side": "both",
    "statusTag": {
      "label": "Handed over by your Return Date",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "r-ontime_p_0",
        "kind": "paragraph",
        "text": "When it is handed to our delivery partner, at your door or at their office, on or before your Return Date. The time it then spends on its way to us is never counted against you."
      }
    ],
    "searchWords": "on time return date deadline counts when late",
    "linkName": "r-ontime",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 31
  },
  {
    "id": "r-resp",
    "question": "Who is responsible for the piece on its way back?",
    "section": "Returns",
    "side": "both",
    "statusTag": {
      "label": "We are",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "r-resp_p_0",
        "kind": "paragraph",
        "text": "We are, from the moment you hand it to our delivery partner and receive a receipt. If anything happens to it after that, you are never charged for it. That is why the receipt matters: please keep it until your deposit is back."
      }
    ],
    "searchWords": "responsible journey back lost in transit receipt who after handover",
    "linkName": "r-resp",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 32
  },
  {
    "id": "r-missed",
    "question": "I missed my pickup",
    "section": "Returns",
    "side": "both",
    "paragraphs": [
      {
        "id": "r-missed_p_0",
        "kind": "paragraph",
        "text": "Simply message us and we will arrange a second pickup, or you are welcome to drop the piece off at our delivery partner's office instead, at no cost."
      },
      {
        "id": "r-missed_p_1",
        "kind": "paragraph",
        "text": "If the first pickup was missed because no one was available, a re-pickup charge applies to the second one: our delivery partner's charge to us, plus GST, shown to you before it is booked. This is not a late return charge, because you are not keeping the piece to wear it."
      }
    ],
    "searchWords": "missed pickup slot not home reschedule second pickup charge",
    "linkName": "r-missed",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 33
  },
  {
    "id": "r-ourlate",
    "question": "The pickup was late on your side",
    "section": "Returns",
    "side": "both",
    "statusTag": {
      "label": "No charge",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "r-ourlate_p_0",
        "kind": "paragraph",
        "text": "You are never charged. Late charges only apply when a return is held up on your side, never when we or our delivery partner are running late."
      }
    ],
    "searchWords": "pickup late delayed your side courier did not come",
    "linkName": "r-ourlate",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 34
  },
  {
    "id": "r-late",
    "question": "What if I return it late?",
    "section": "Returns",
    "side": "both",
    "statusTag": {
      "label": "Daily rate plus GST",
      "tone": "not-possible"
    },
    "paragraphs": [
      {
        "id": "r-late_p_0",
        "kind": "paragraph",
        "text": "Each extra day is charged at the piece's daily rate plus 18% GST, exactly like an extra day of rental, because someone else may be waiting for it. Our Deposit Policy explains how it is settled."
      },
      {
        "id": "r-late_p_1",
        "kind": "paragraph",
        "text": "If you think you may be late, please tell us before your Return Date. An extension costs the same and keeps everyone's plans on track."
      }
    ],
    "searchWords": "late return extra day fee charge delay keep longer",
    "linkName": "r-late",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 35
  },
  {
    "id": "r-label",
    "question": "I have lost the return label or garment bag",
    "section": "Returns",
    "side": "both",
    "paragraphs": [
      {
        "id": "r-label_p_0",
        "kind": "paragraph",
        "text": "Your return label comes printed in your packaging. If it goes missing, simply message us and we will send you a copy to print. Any clean, sturdy bag will do for the journey back."
      }
    ],
    "searchWords": "lost label garment bag packaging print copy misplaced",
    "linkName": "r-label",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 36
  },
  {
    "id": "r-notret",
    "question": "When is a piece treated as not returned?",
    "section": "Returns",
    "side": "both",
    "statusTag": {
      "label": "After 5 days",
      "tone": "not-possible"
    },
    "paragraphs": [
      {
        "id": "r-notret_p_0",
        "kind": "paragraph",
        "text": "If it has not been handed to our delivery partner 5 days after your Return Date, and you have not agreed a new date with us, it is treated as not returned. We will always try to reach you before then, and our Deposit Policy explains what follows."
      }
    ],
    "searchWords": "not returned kept never sent back how long days",
    "linkName": "r-notret",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Returns"
    ],
    "orderIndex": 37
  },
  {
    "id": "i-where",
    "question": "Do you deliver outside India?",
    "section": "Outside India",
    "side": "both",
    "statusTag": {
      "label": "Preloved, worldwide",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "i-where_p_0",
        "kind": "paragraph",
        "text": "Yes, for preloved pieces: we ship them worldwide. The delivery charge for your country is shown at checkout, before you pay."
      },
      {
        "id": "i-where_p_1",
        "kind": "paragraph",
        "text": "Rentals are delivered within India, though a rental can travel with you when we plan it together."
      }
    ],
    "searchWords": "international outside india abroad overseas ship worldwide countries",
    "linkName": "i-where",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Outside India"
    ],
    "orderIndex": 38
  },
  {
    "id": "i-cost",
    "question": "How much does international delivery cost?",
    "section": "Outside India",
    "side": "both",
    "statusTag": {
      "label": "Quoted before you pay",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "i-cost_p_0",
        "kind": "paragraph",
        "text": "It depends on the country and the weight of your piece, so it is quoted for your address at checkout, before you pay. International delivery is never part of free delivery."
      }
    ],
    "searchWords": "international delivery cost shipping price abroad fee",
    "linkName": "i-cost",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Outside India"
    ],
    "orderIndex": 39
  },
  {
    "id": "i-duties",
    "question": "Will I pay customs duties?",
    "section": "Outside India",
    "side": "both",
    "statusTag": {
      "label": "Paid on arrival",
      "tone": "not-possible"
    },
    "paragraphs": [
      {
        "id": "i-duties_p_0",
        "kind": "paragraph",
        "text": "Customs duties and import taxes are set by the country your piece is going to, and are paid by you when it arrives. They are not part of your order total, and we cannot predict them exactly, so it is worth checking with your local customs office before you order."
      }
    ],
    "searchWords": "customs duties import taxes vat tariff fees international",
    "linkName": "i-duties",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Outside India"
    ],
    "orderIndex": 40
  },
  {
    "id": "i-time",
    "question": "How long does international delivery take?",
    "section": "Outside India",
    "side": "both",
    "statusTag": {
      "label": "Within 10 business days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "i-time_p_0",
        "kind": "paragraph",
        "text": "Your piece reaches you within 10 business days of leaving us, though customs in some countries can occasionally add a few days."
      },
      {
        "id": "i-time_p_1",
        "kind": "paragraph",
        "text": "It leaves us on the same timeline as any preloved order, and a little later if it is kept by its owner, so do allow for that when you order."
      },
      {
        "id": "i-time_p_2",
        "kind": "paragraph",
        "text": "Need it sooner? Faster international delivery is available at an extra charge, quoted for your country before you pay."
      }
    ],
    "searchWords": "international how long delivery time days abroad customs faster express urgent sooner quick",
    "linkName": "i-time",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Outside India"
    ],
    "orderIndex": 41
  },
  {
    "id": "i-see",
    "question": "Can I see the piece properly before it is sent abroad?",
    "section": "Outside India",
    "side": "both",
    "statusTag": {
      "label": "Video call or photographs",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "i-see_p_0",
        "kind": "paragraph",
        "text": "Yes, and we would love you to. Before any piece leaves for another country, we show it to you however you would like: on a video call, in photographs taken in different light, or up close on any detail you want to see. We tell you honestly about its condition, too."
      },
      {
        "id": "i-see_p_1",
        "kind": "paragraph",
        "text": "A journey back across borders is a long one, and every journey has a footprint, so we would much rather you are completely sure before your piece travels. With your permission, we record the call, so we both have a record of exactly what you were shown."
      }
    ],
    "searchWords": "see view video call real photos pictures images light lighting condition before dispatch inspect check trust record recording abroad international",
    "linkName": "i-see",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Outside India"
    ],
    "orderIndex": 42
  },
  {
    "id": "i-issue",
    "question": "What if something is not right with an international order?",
    "section": "Outside India",
    "side": "both",
    "statusTag": {
      "label": "Full refund",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "i-issue_p_0",
        "kind": "paragraph",
        "text": "It rarely happens, because you will have seen your piece properly before it leaves us. If what arrives still does not match what we showed and told you, message us within 24 hours of delivery with photographs, just as for any order."
      },
      {
        "id": "i-issue_p_1",
        "kind": "paragraph",
        "text": "We will refund you in full and arrange your piece's journey back to us, at our cost."
      },
      {
        "id": "i-issue_p_2",
        "kind": "paragraph",
        "text": "Customs duties and import taxes are charged by your country, not by us, so we are unable to refund them."
      }
    ],
    "searchWords": "international problem not as described wrong return abroad refund different condition",
    "linkName": "i-issue",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Outside India"
    ],
    "orderIndex": 43
  },
  {
    "id": "i-rentabroad",
    "question": "Can I take a rental abroad?",
    "section": "Outside India",
    "side": "both",
    "statusTag": {
      "label": "Ask us first",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "i-rentabroad_p_0",
        "kind": "paragraph",
        "text": "Rentals are delivered within India, but if your celebration is abroad, we would love to help you make it work. Message us before you book with your dates and where you are travelling, and we will work out the right window for your journey with you."
      },
      {
        "id": "i-rentabroad_p_1",
        "kind": "paragraph",
        "text": "Your piece is still delivered and collected within India, so the window simply covers your time away."
      }
    ],
    "searchWords": "take rental abroad travel travelling overseas destination wedding outside india carry outstation journey",
    "linkName": "i-rentabroad",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "Outside India"
    ],
    "orderIndex": 44
  },
  {
    "id": "o-late",
    "question": "My rental did not arrive in time for my celebration",
    "section": "When it is on us",
    "side": "both",
    "statusTag": {
      "label": "Full refund",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "o-late_p_0",
        "kind": "paragraph",
        "text": "If your piece reaches you after your celebration because of us or our delivery partner, you receive a full refund of your rental fee and delivery charges, and your deposit in full."
      },
      {
        "id": "o-late_p_1",
        "kind": "paragraph",
        "text": "If it arrives later than promised but still before your celebration, tell us and we will make it right, as our Refund & Cancellation Policy explains."
      }
    ],
    "searchWords": "late delivery did not arrive in time missed event delayed after celebration",
    "linkName": "o-late",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "When it is on us"
    ],
    "orderIndex": 45
  },
  {
    "id": "o-lost",
    "question": "My parcel was lost on its way to me",
    "section": "When it is on us",
    "side": "both",
    "statusTag": {
      "label": "Full refund",
      "tone": "good-news"
    },
    "paragraphs": [
      {
        "id": "o-lost_p_0",
        "kind": "paragraph",
        "text": "Then it is entirely on us. You are refunded in full, delivery charges included, and if you have already paid a deposit, it comes back in full within 3 to 5 business days of the loss being confirmed."
      },
      {
        "id": "o-lost_p_1",
        "kind": "paragraph",
        "text": "For a rental, we will also do everything we can to find you something just as beautiful in time."
      }
    ],
    "searchWords": "courier lost parcel never arrived missing delivery transit",
    "linkName": "o-lost",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "When it is on us"
    ],
    "orderIndex": 46
  },
  {
    "id": "o-wrong",
    "question": "I received the wrong piece",
    "section": "When it is on us",
    "side": "both",
    "paragraphs": [
      {
        "id": "o-wrong_p_0",
        "kind": "paragraph",
        "text": "Please message us straight away with a photograph, and do not wear it. We put it right as our Refund & Cancellation Policy explains, and you never pay for our mistake: the journey back is on us, and nothing is ever taken from your deposit."
      }
    ],
    "searchWords": "wrong piece different item mistake received incorrect",
    "linkName": "o-wrong",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "When it is on us"
    ],
    "orderIndex": 47
  },
  {
    "id": "o-dispatch",
    "question": "My preloved piece has not left you by the date you gave",
    "section": "When it is on us",
    "side": "both",
    "paragraphs": [
      {
        "id": "o-dispatch_p_0",
        "kind": "paragraph",
        "text": "We are so sorry. Some pieces stay with their owners until they find a new home, and once in a while something unforeseen holds one up on its way to us. If that happens, we will let you know straight away, keep you updated until it reaches you, and do everything we can to speed it on its way."
      },
      {
        "id": "o-dispatch_p_1",
        "kind": "paragraph",
        "text": "If you would rather not wait, you can cancel for a full refund."
      }
    ],
    "searchWords": "preloved not dispatched late delayed dispatch date missed",
    "linkName": "o-dispatch",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "When it is on us"
    ],
    "orderIndex": 48
  },
  {
    "id": "o-unhappy",
    "question": "I am not happy with how my delivery was handled",
    "section": "When it is on us",
    "side": "both",
    "paragraphs": [
      {
        "id": "o-unhappy_p_0",
        "kind": "paragraph",
        "text": "We are sorry to hear that, and we would like to put it right. Reply on WhatsApp or email hello@houseofkaira.com, and we will look into it with care."
      },
      {
        "id": "o-unhappy_p_1",
        "kind": "paragraph",
        "text": "For a formal complaint, please write to our Grievance Officer, whose details are on our Contact page. We acknowledge every complaint within 24 hours and aim to resolve it within one month."
      }
    ],
    "searchWords": "unhappy complaint escalate grievance officer not happy delivery",
    "linkName": "o-unhappy",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "When it is on us"
    ],
    "orderIndex": 49
  },
  {
    "id": "o-rights",
    "question": "Does this policy affect my legal rights?",
    "section": "When it is on us",
    "side": "both",
    "paragraphs": [
      {
        "id": "o-rights_p_0",
        "kind": "paragraph",
        "text": "No. This page explains how we deliver, and nothing in it limits your rights under Indian consumer law. Where this page and our Terms & Conditions ever differ, the Terms apply."
      },
      {
        "id": "o-rights_p_1",
        "kind": "paragraph",
        "text": "The policy in place when you place your order is the one that applies to it, and the date this page was last reviewed is shown at the bottom."
      }
    ],
    "searchWords": "legal rights consumer law terms conditions policy changes",
    "linkName": "o-rights",
    "appearsIn": [
      "Shipping & Delivery Policy",
      "When it is on us"
    ],
    "orderIndex": 50
  }
];
