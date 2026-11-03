/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Registry: Pricing & Fees Policy Answers (Spec § 8.16, 52 items)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem } from '../types/answers.types';

export const PRICING_ANSWERS: AnswerItem[] = [
  {
    "id": "r-price",
    "question": "How is a rental priced?",
    "section": "Renting a piece",
    "side": "rentals",
    "statusTag": {
      "label": "One price for 3 days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "r-price_p_0",
        "kind": "paragraph",
        "text": "Every rental piece has one price for its standard rental window of 3 days: it arrives the day"
      },
      {
        "id": "r-price_p_1",
        "kind": "paragraph",
        "text": "before your celebration, is yours for the day itself, and goes back the day after. Here is how the window works"
      },
      {
        "id": "r-price_p_2",
        "kind": "paragraph",
        "text": "[opens page shipping-policy]."
      },
      {
        "id": "r-price_p_3",
        "kind": "paragraph",
        "text": "Each piece also has a daily rate for every additional day, shown on its page. Both are set for each piece, by its"
      },
      {
        "id": "r-price_p_4",
        "kind": "paragraph",
        "text": "designer, its value and its condition, and your booking summary adds everything up before you pay."
      }
    ],
    "searchWords": "price rental cost how much window daily rate days per day charge fee priced",
    "linkName": "r-price",
    "appearsIn": [
      "Pricing & Fees",
      "Renting a piece"
    ],
    "orderIndex": 1
  },
  {
    "id": "r-extra",
    "question": "How do extra days work?",
    "section": "Renting a piece",
    "side": "rentals",
    "statusTag": {
      "label": "Daily rate per day",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "r-extra_p_0",
        "kind": "paragraph",
        "text": "Simply add one extra day for each additional day of celebrations, at the piece's daily rate. With a haldi and sangeet"
      },
      {
        "id": "r-extra_p_1",
        "kind": "paragraph",
        "text": "on one day and the wedding the next, you would book your standard 3 days plus 1 extra day."
      },
      {
        "id": "r-extra_p_2",
        "kind": "paragraph",
        "text": "See it in numbers [scrolls to In numbers]."
      },
      {
        "id": "r-extra_p_3",
        "kind": "paragraph",
        "text": "Once your piece is with you, you can still ask to keep it longer [opens answer x-extend]. If no one has booked it"
      },
      {
        "id": "r-extra_p_4",
        "kind": "paragraph",
        "text": "straight after you, each extra day costs the same daily rate."
      }
    ],
    "searchWords": "extra days longer extend extension more days wedding functions haldi sangeet mehendi multiple add week",
    "linkName": "r-extra",
    "appearsIn": [
      "Pricing & Fees",
      "Renting a piece"
    ],
    "orderIndex": 2
  },
  {
    "id": "r-included",
    "question": "What is included in the rental price?",
    "section": "Renting a piece",
    "side": "rentals",
    "statusTag": {
      "label": "Always included",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "r-included_p_0",
        "kind": "paragraph",
        "text": "Everything that keeps the piece at its best, and everything you need to enjoy it:"
      },
      {
        "id": "r-included_p_1",
        "kind": "paragraph"
      },
      {
        "id": "r-included_p_2",
        "kind": "paragraph",
        "text": "You never pay for cleaning, and please never clean the piece yourself. Our Care, Cleaning & Damage Policy"
      },
      {
        "id": "r-included_p_3",
        "kind": "paragraph",
        "text": "[opens page care-policy] explains why."
      }
    ],
    "searchWords": "included cleaning dry clean pressing packaging garment bag box return label what is included free",
    "linkName": "r-included",
    "appearsIn": [
      "Pricing & Fees",
      "Renting a piece"
    ],
    "orderIndex": 3
  },
  {
    "id": "r-gst",
    "question": "Is GST included in the rental price?",
    "section": "Renting a piece",
    "side": "rentals",
    "statusTag": {
      "label": "18% at checkout",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "r-gst_p_0",
        "kind": "paragraph",
        "text": "Rental prices are shown before GST. GST at 18% is added to your rental fee at checkout, and you"
      },
      {
        "id": "r-gst_p_1",
        "kind": "paragraph",
        "text": "see the exact amount before you pay."
      },
      {
        "id": "r-gst_p_2",
        "kind": "paragraph",
        "text": "Your deposit carries no GST, because it is held for you rather than paid to us."
      }
    ],
    "searchWords": "gst tax included exclusive inclusive 18 percent rental price",
    "linkName": "r-gst",
    "appearsIn": [
      "Pricing & Fees",
      "Renting a piece"
    ],
    "orderIndex": 4
  },
  {
    "id": "r-several",
    "question": "I am renting several pieces for the same celebration",
    "section": "Renting a piece",
    "side": "rentals",
    "statusTag": {
      "label": "One delivery",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "r-several_p_0",
        "kind": "paragraph",
        "text": "Each piece has its own price for the window you share, and every piece booked for the same dates travels"
      },
      {
        "id": "r-several_p_1",
        "kind": "paragraph",
        "text": "together: one delivery and one pickup, counted as one order towards free delivery [opens answer c-free]. Each"
      },
      {
        "id": "r-several_p_2",
        "kind": "paragraph",
        "text": "piece also has its own deposit."
      },
      {
        "id": "r-several_p_3",
        "kind": "paragraph",
        "text": "The price of a preloved piece, offers, and buying from outside India."
      }
    ],
    "searchWords": "several pieces multiple outfits family same celebration together delivery each order",
    "linkName": "r-several",
    "appearsIn": [
      "Pricing & Fees",
      "Renting a piece"
    ],
    "orderIndex": 5
  },
  {
    "id": "p-price",
    "question": "How is a preloved piece priced?",
    "section": "Buying preloved",
    "side": "rentals",
    "statusTag": {
      "label": "5% at checkout",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "p-price_p_0",
        "kind": "paragraph",
        "text": "Every preloved piece has one price, agreed with its owner and shown on its page. It reflects the piece's designer"
      },
      {
        "id": "p-price_p_1",
        "kind": "paragraph",
        "text": "and its condition, and every detail of that condition is disclosed alongside it."
      },
      {
        "id": "p-price_p_2",
        "kind": "paragraph",
        "text": "GST at 5% is added at checkout, and you see the exact amount before you pay."
      }
    ],
    "searchWords": "preloved price how priced cost value resale second hand gst tax 5 percent",
    "linkName": "p-price",
    "appearsIn": [
      "Pricing & Fees",
      "Buying preloved"
    ],
    "orderIndex": 6
  },
  {
    "id": "p-offer",
    "question": "Can I make an offer?",
    "section": "Buying preloved",
    "side": "rentals",
    "statusTag": {
      "label": "Preloved only",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "p-offer_p_0",
        "kind": "paragraph",
        "text": "Yes, on any preloved piece. Offers are never taken on rentals."
      },
      {
        "id": "p-offer_p_1",
        "kind": "paragraph",
        "text": "Name your price on the piece's page, and our team replies within 24 hours. If we accept your offer,"
      },
      {
        "id": "p-offer_p_2",
        "kind": "paragraph",
        "text": "it becomes your price, and GST and delivery are added at checkout in the usual way."
      },
      {
        "id": "p-offer_p_3",
        "kind": "paragraph",
        "text": "An offer does not reserve the piece, so it stays available to others until a purchase is complete."
      }
    ],
    "searchWords": "offer make an offer negotiate bargain lower price quote counter name your price",
    "linkName": "p-offer",
    "appearsIn": [
      "Pricing & Fees",
      "Buying preloved"
    ],
    "orderIndex": 7
  },
  {
    "id": "p-included",
    "question": "Is cleaning included when I buy a preloved piece?",
    "section": "Buying preloved",
    "side": "rentals",
    "statusTag": {
      "label": "Always included",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "p-included_p_0",
        "kind": "paragraph",
        "text": "Yes. Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed. A piece"
      },
      {
        "id": "p-included_p_1",
        "kind": "paragraph",
        "text": "that has never been worn is checked and pressed instead of cleaned, so it stays exactly as new."
      }
    ],
    "searchWords": "preloved cleaned cleaning pressed checked packed included condition unworn",
    "linkName": "p-included",
    "appearsIn": [
      "Pricing & Fees",
      "Buying preloved"
    ],
    "orderIndex": 8
  },
  {
    "id": "p-abroad",
    "question": "I am buying from outside India",
    "section": "Buying preloved",
    "side": "rentals",
    "statusTag": {
      "label": "Prices in rupees",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "p-abroad_p_0",
        "kind": "paragraph",
        "text": "the amount and may add a charge of its own."
      },
      {
        "id": "p-abroad_p_1",
        "kind": "paragraph",
        "text": "International delivery is quoted for your country at checkout, and customs duties and import taxes are paid by you"
      },
      {
        "id": "p-abroad_p_2",
        "kind": "paragraph",
        "text": "when your piece arrives. Before any piece travels abroad, we show it to you properly first, as our Shipping &"
      },
      {
        "id": "p-abroad_p_3",
        "kind": "paragraph",
        "text": "Delivery Policy [opens page shipping-policy] explains."
      },
      {
        "id": "p-abroad_p_4",
        "kind": "paragraph",
        "text": "Held in safekeeping while a rental is in your care, and returned once it is home with us."
      }
    ],
    "searchWords": "international abroad outside india overseas currency dollars pounds customs duty import tax foreign card",
    "linkName": "p-abroad",
    "appearsIn": [
      "Pricing & Fees",
      "Buying preloved"
    ],
    "orderIndex": 9
  },
  {
    "id": "d-what",
    "question": "How much is the deposit?",
    "section": "Your deposit",
    "side": "rentals",
    "statusTag": {
      "label": "Set for each piece",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "d-what_p_0",
        "kind": "paragraph",
        "text": "Each rental piece has its own deposit, set to protect it and shown on its page before you book. It is held in"
      },
      {
        "id": "d-what_p_1",
        "kind": "paragraph",
        "text": "safekeeping while the piece is in your care, and returned once it is home with us."
      },
      {
        "id": "d-what_p_2",
        "kind": "paragraph",
        "text": "It is never a charge: it carries no GST, and it is never put towards your rental fee."
      }
    ],
    "searchWords": "deposit security how much amount refundable gst",
    "linkName": "d-what",
    "appearsIn": [
      "Pricing & Fees",
      "Your deposit"
    ],
    "orderIndex": 10
  },
  {
    "id": "d-pay",
    "question": "When and how do I pay the deposit?",
    "section": "Your deposit",
    "side": "rentals",
    "statusTag": {
      "label": "Paid separately",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "d-pay_p_0",
        "kind": "paragraph",
        "text": "Separately from your order, never at checkout. Our team arranges it with you on WhatsApp, and you pay it by UPI"
      },
      {
        "id": "d-pay_p_1",
        "kind": "paragraph",
        "text": "or bank transfer, 10 days before your piece is dispatched. For a booking made closer to the"
      },
      {
        "id": "d-pay_p_2",
        "kind": "paragraph",
        "text": "date, it is due within 48 hours of our request, and always before dispatch."
      },
      {
        "id": "d-pay_p_3",
        "kind": "paragraph",
        "text": "Cash is welcome only for bookings made in person with us in Indore. We confirm receipt in writing within 48 hours"
      },
      {
        "id": "d-pay_p_4",
        "kind": "paragraph",
        "text": "."
      }
    ],
    "searchWords": "deposit pay when how upi bank transfer cash whatsapp due before dispatch checkout",
    "linkName": "d-pay",
    "appearsIn": [
      "Pricing & Fees",
      "Your deposit"
    ],
    "orderIndex": 11
  },
  {
    "id": "d-back",
    "question": "When is my deposit returned?",
    "section": "Your deposit",
    "side": "rentals",
    "statusTag": {
      "label": "Within 3 to 5 business days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "d-back_p_0",
        "kind": "paragraph",
        "text": "Within 3 to 5 business days of your piece being inspected on its return, and always to the"
      },
      {
        "id": "d-back_p_1",
        "kind": "paragraph",
        "text": "account it came from. If all is well, it comes back in full."
      }
    ],
    "searchWords": "deposit back refund return when how long account",
    "linkName": "d-back",
    "appearsIn": [
      "Pricing & Fees",
      "Your deposit"
    ],
    "orderIndex": 12
  },
  {
    "id": "d-deduct",
    "question": "Can anything be taken from my deposit?",
    "section": "Your deposit",
    "side": "rentals",
    "statusTag": {
      "label": "Only beyond normal wear",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "d-deduct_p_0",
        "kind": "paragraph",
        "text": "Only what a rental genuinely leaves behind: late days [opens answer x-late] at the daily rate, or the cost of"
      },
      {
        "id": "d-deduct_p_1",
        "kind": "paragraph",
        "text": "restoring damage beyond normal wear [opens answer l-damage], decided on evidence. We tell you within 2 days"
      },
      {
        "id": "d-deduct_p_2",
        "kind": "paragraph",
        "text": "of the piece reaching us, with photographs, and give you 2 days"
      },
      {
        "id": "d-deduct_p_3",
        "kind": "paragraph",
        "text": "to reply before anything is settled."
      },
      {
        "id": "d-deduct_p_4",
        "kind": "paragraph",
        "text": "Normal wear, and our cleaning after every rental, are never taken from it. Our Deposit Policy [opens page deposit-"
      },
      {
        "id": "d-deduct_p_5",
        "kind": "paragraph",
        "text": "policy] explains every step."
      },
      {
        "id": "d-deduct_p_6",
        "kind": "paragraph",
        "text": "When delivery is on us, and what faster delivery costs."
      }
    ],
    "searchWords": "deposit deduction deduct taken kept withheld damage late charges",
    "linkName": "d-deduct",
    "appearsIn": [
      "Pricing & Fees",
      "Your deposit"
    ],
    "orderIndex": 13
  },
  {
    "id": "c-free",
    "question": "When is delivery free?",
    "section": "Delivery charges",
    "side": "rentals",
    "statusTag": {
      "label": "Free from ₹5,000",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "c-free_p_0",
        "kind": "paragraph",
        "text": "Standard delivery within India is free on every order of ₹5,000 or more, measured on the price"
      },
      {
        "id": "c-free_p_1",
        "kind": "paragraph",
        "text": "of your pieces before GST. For a rental, that covers both journeys: to you, and back to us."
      },
      {
        "id": "c-free_p_2",
        "kind": "paragraph",
        "text": "Your deposit is not counted towards it, as it is held separately from your order."
      }
    ],
    "searchWords": "free delivery shipping threshold minimum order both ways",
    "linkName": "c-free",
    "appearsIn": [
      "Pricing & Fees",
      "Delivery charges"
    ],
    "orderIndex": 14
  },
  {
    "id": "c-below",
    "question": "What does delivery cost on smaller orders?",
    "section": "Delivery charges",
    "side": "rentals",
    "paragraphs": [
      {
        "id": "c-below_p_0",
        "kind": "paragraph",
        "text": "It is worked out for your delivery address and shown at checkout, before you pay. For a rental, it already covers"
      },
      {
        "id": "c-below_p_1",
        "kind": "paragraph",
        "text": "the journey back to us, so there is nothing more to pay when your piece comes home."
      }
    ],
    "searchWords": "delivery cost charge small order below threshold how much shipping fee",
    "linkName": "c-below",
    "appearsIn": [
      "Pricing & Fees",
      "Delivery charges"
    ],
    "orderIndex": 15
  },
  {
    "id": "c-express",
    "question": "What do express and same day delivery cost?",
    "section": "Delivery charges",
    "side": "rentals",
    "statusTag": {
      "label": "Quoted before you pay",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "c-express_p_0",
        "kind": "paragraph",
        "text": "They depend on where your piece is travelling, so we never quote a flat fee. Whenever they are available for your"
      },
      {
        "id": "c-express_p_1",
        "kind": "paragraph",
        "text": "order, you see the exact charge at checkout, before you pay."
      },
      {
        "id": "c-express_p_2",
        "kind": "paragraph",
        "text": "Both are faster services on top of standard delivery, so they are charged even when standard delivery is free."
      },
      {
        "id": "c-express_p_3",
        "kind": "paragraph",
        "text": "Same day delivery is offered within Indore."
      }
    ],
    "searchWords": "express faster quick same day indore urgent delivery cost price",
    "linkName": "c-express",
    "appearsIn": [
      "Pricing & Fees",
      "Delivery charges"
    ],
    "orderIndex": 16
  },
  {
    "id": "c-intl",
    "question": "What does international delivery cost?",
    "section": "Delivery charges",
    "side": "rentals",
    "statusTag": {
      "label": "Quoted for your country",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "c-intl_p_0",
        "kind": "paragraph",
        "text": "It depends on the country and the weight of your piece, so it is quoted for your address at checkout, before you"
      },
      {
        "id": "c-intl_p_1",
        "kind": "paragraph",
        "text": "pay. International delivery is for preloved pieces, and it is never part of free delivery."
      },
      {
        "id": "c-intl_p_2",
        "kind": "paragraph",
        "text": "Faster international delivery is available at an extra charge, also quoted before you pay. Customs duties and"
      },
      {
        "id": "c-intl_p_3",
        "kind": "paragraph",
        "text": "import taxes are charged by your country, and paid when your piece arrives."
      },
      {
        "id": "c-intl_p_4",
        "kind": "paragraph",
        "text": "Keeping a piece longer, returning it late, and missed deliveries or pickups."
      }
    ],
    "searchWords": "international delivery cost abroad worldwide shipping price country customs",
    "linkName": "c-intl",
    "appearsIn": [
      "Pricing & Fees",
      "Delivery charges"
    ],
    "orderIndex": 17
  },
  {
    "id": "x-extend",
    "question": "I would like to keep my piece a little longer",
    "section": "Extra days and late returns",
    "side": "rentals",
    "statusTag": {
      "label": "Daily rate plus GST",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "x-extend_p_0",
        "kind": "paragraph",
        "text": "Message us before your Return Date. If no one has booked the piece straight after you, we extend your rental at"
      },
      {
        "id": "x-extend_p_1",
        "kind": "paragraph",
        "text": "its daily rate, plus 18% GST, for each extra day."
      }
    ],
    "searchWords": "keep longer extend extension extra day after delivery more time",
    "linkName": "x-extend",
    "appearsIn": [
      "Pricing & Fees",
      "Extra days and late returns"
    ],
    "orderIndex": 18
  },
  {
    "id": "x-late",
    "question": "What does a late return cost?",
    "section": "Extra days and late returns",
    "side": "rentals",
    "statusTag": {
      "label": "Daily rate plus GST",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "x-late_p_0",
        "kind": "paragraph",
        "text": "Each extra day is charged at the piece's daily rate plus 18% GST, exactly like an extra day of rental,"
      },
      {
        "id": "x-late_p_1",
        "kind": "paragraph",
        "text": "because someone else may be waiting for it. There is no separate late fee."
      },
      {
        "id": "x-late_p_2",
        "kind": "paragraph",
        "text": "You are never charged when a delay is ours or our delivery partner's. If a piece has not been handed back 5 days"
      },
      {
        "id": "x-late_p_3",
        "kind": "paragraph",
        "text": "after its Return Date, it is treated as not returned [opens answer l-loss]."
      }
    ],
    "searchWords": "late return fee charge penalty overdue delay extra day after return date",
    "linkName": "x-late",
    "appearsIn": [
      "Pricing & Fees",
      "Extra days and late returns"
    ],
    "orderIndex": 19
  },
  {
    "id": "x-missed",
    "question": "I missed a delivery or a pickup",
    "section": "Extra days and late returns",
    "side": "rentals",
    "paragraphs": [
      {
        "id": "x-missed_p_0",
        "kind": "paragraph",
        "text": "Simply message us and we will arrange another. If the first was missed because no one was available, the second"
      },
      {
        "id": "x-missed_p_1",
        "kind": "paragraph",
        "text": "carries a charge: our delivery partner's charge to us, plus GST, shown to you before it is booked."
      },
      {
        "id": "x-missed_p_2",
        "kind": "paragraph",
        "text": "For a pickup, you are also welcome to drop the piece at our delivery partner's nearest office instead, at no cost. A"
      },
      {
        "id": "x-missed_p_3",
        "kind": "paragraph",
        "text": "missed pickup is a delivery charge, never a late return."
      }
    ],
    "searchWords": "missed delivery not home redelivery second delivery pickup missed re pickup charge",
    "linkName": "x-missed",
    "appearsIn": [
      "Pricing & Fees",
      "Extra days and late returns"
    ],
    "orderIndex": 20
  },
  {
    "id": "x-change",
    "question": "Can I change my dates?",
    "section": "Extra days and late returns",
    "side": "rentals",
    "statusTag": {
      "label": "Usually possible",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "x-change_p_0",
        "kind": "paragraph",
        "text": "Usually, yes, as long as your piece has not been dispatched. Message us with your new dates. If the piece is free,"
      },
      {
        "id": "x-change_p_1",
        "kind": "paragraph",
        "text": "we move your booking and settle any difference in price, with no charge for the change itself."
      },
      {
        "id": "x-change_p_2",
        "kind": "paragraph",
        "text": "If your celebration has moved rather than been called off, changing your dates is almost always better than"
      },
      {
        "id": "x-change_p_3",
        "kind": "paragraph",
        "text": "cancelling."
      },
      {
        "id": "x-change_p_4",
        "kind": "paragraph",
        "text": "What comes back to you if your plans change, and how quickly."
      }
    ],
    "searchWords": "change dates move booking postpone reschedule different date swap piece",
    "linkName": "x-change",
    "appearsIn": [
      "Pricing & Fees",
      "Extra days and late returns"
    ],
    "orderIndex": 21
  },
  {
    "id": "k-rent-early",
    "question": "I cancel a rental more than 7 days before it starts",
    "section": "Cancellations and refunds",
    "side": "rentals",
    "statusTag": {
      "label": "Full refund",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "k-rent-early_p_0",
        "kind": "paragraph",
        "text": "You receive a full refund: your rental fee, the GST on it, and any delivery charge you paid. If your deposit has"
      },
      {
        "id": "k-rent-early_p_1",
        "kind": "paragraph",
        "text": "already been paid, it comes back in full too."
      },
      {
        "id": "k-rent-early_p_2",
        "kind": "paragraph",
        "text": "Your rental starts on the day your piece arrives, the day before your celebration."
      }
    ],
    "searchWords": "cancel rental early more than week full refund",
    "linkName": "k-rent-early",
    "appearsIn": [
      "Pricing & Fees",
      "Cancellations and refunds"
    ],
    "orderIndex": 22
  },
  {
    "id": "k-rent-late",
    "question": "I cancel a rental within 7 days of its start, before it is dispatched",
    "section": "Cancellations and refunds",
    "side": "rentals",
    "statusTag": {
      "label": "70% refunded",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "k-rent-late_p_0",
        "kind": "paragraph",
        "text": "By then, your piece has been turned away from everyone else and is being prepared for you. You receive 70%"
      },
      {
        "id": "k-rent-late_p_1",
        "kind": "paragraph",
        "text": "of your rental fee back, with the GST paid on it, and any delivery charge and deposit"
      },
      {
        "id": "k-rent-late_p_2",
        "kind": "paragraph",
        "text": "in full."
      },
      {
        "id": "k-rent-late_p_3",
        "kind": "paragraph",
        "text": "If your celebration has simply moved, change your dates [opens answer x-change] instead: there is no charge, and"
      },
      {
        "id": "k-rent-late_p_4",
        "kind": "paragraph",
        "text": "nothing is lost."
      }
    ],
    "searchWords": "cancel rental late within week last minute partial refund percent",
    "linkName": "k-rent-late",
    "appearsIn": [
      "Pricing & Fees",
      "Cancellations and refunds"
    ],
    "orderIndex": 23
  },
  {
    "id": "k-rent-sent",
    "question": "I cancel a rental after it has been dispatched",
    "section": "Cancellations and refunds",
    "side": "rentals",
    "statusTag": {
      "label": "No refund",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "k-rent-sent_p_0",
        "kind": "paragraph",
        "text": "Once a rental is on its way, it can no longer be cancelled or refunded, as the next celebration is planned around its"
      },
      {
        "id": "k-rent-sent_p_1",
        "kind": "paragraph",
        "text": "return. Your deposit comes back as usual, once the piece is home with us."
      },
      {
        "id": "k-rent-sent_p_2",
        "kind": "paragraph",
        "text": "If something is wrong when it arrives, message us within 24 hours of delivery, and we will put it"
      },
      {
        "id": "k-rent-sent_p_3",
        "kind": "paragraph",
        "text": "right."
      }
    ],
    "searchWords": "cancel after dispatch shipped on the way rental",
    "linkName": "k-rent-sent",
    "appearsIn": [
      "Pricing & Fees",
      "Cancellations and refunds"
    ],
    "orderIndex": 24
  },
  {
    "id": "k-pre",
    "question": "I cancel a preloved order",
    "section": "Cancellations and refunds",
    "side": "rentals",
    "statusTag": {
      "label": "Free until dispatch",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "k-pre_p_0",
        "kind": "paragraph",
        "text": "Until your piece is dispatched, you can cancel for a full refund, including GST and delivery."
      },
      {
        "id": "k-pre_p_1",
        "kind": "paragraph",
        "text": "Once it is on its way, a preloved purchase is final, as every piece is one of a kind. If it is not as described,"
      },
      {
        "id": "k-pre_p_2",
        "kind": "paragraph",
        "text": "message us within 24 hours of delivery, or within 30 days for a flaw that could not"
      },
      {
        "id": "k-pre_p_3",
        "kind": "paragraph",
        "text": "have been seen on arrival, and our Refund & Cancellation Policy [opens page refund-policy] applies."
      }
    ],
    "searchWords": "cancel preloved order refund final sale return change of mind",
    "linkName": "k-pre",
    "appearsIn": [
      "Pricing & Fees",
      "Cancellations and refunds"
    ],
    "orderIndex": 25
  },
  {
    "id": "k-we",
    "question": "What if House of Kaira has to cancel?",
    "section": "Cancellations and refunds",
    "side": "rentals",
    "statusTag": {
      "label": "Full refund",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "k-we_p_0",
        "kind": "paragraph",
        "text": "You receive everything you paid, automatically. And if we cancel at a time when cancelling yourself would have"
      },
      {
        "id": "k-we_p_1",
        "kind": "paragraph",
        "text": "cost you something, we pay you that same amount on top, as our Terms & Conditions [opens page terms] promise."
      }
    ],
    "searchWords": "house of kaira cancels you cancel unavailable compensation matching",
    "linkName": "k-we",
    "appearsIn": [
      "Pricing & Fees",
      "Cancellations and refunds"
    ],
    "orderIndex": 26
  },
  {
    "id": "k-time",
    "question": "How long does a refund take?",
    "section": "Cancellations and refunds",
    "side": "rentals",
    "statusTag": {
      "label": "Within 7 to 14 days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "k-time_p_0",
        "kind": "paragraph",
        "text": "We start your refund the moment a cancellation is confirmed. It reaches the payment method you used at"
      },
      {
        "id": "k-time_p_1",
        "kind": "paragraph",
        "text": "checkout within 7 to 14 days, depending on your bank. A deposit always goes back to the"
      },
      {
        "id": "k-time_p_2",
        "kind": "paragraph",
        "text": "account it came from."
      },
      {
        "id": "k-time_p_3",
        "kind": "paragraph",
        "text": "Normal wear is never charged. Here is what applies beyond it."
      }
    ],
    "searchWords": "refund how long time days bank original payment method",
    "linkName": "k-time",
    "appearsIn": [
      "Pricing & Fees",
      "Cancellations and refunds"
    ],
    "orderIndex": 27
  },
  {
    "id": "l-wear",
    "question": "Will I be charged for normal wear?",
    "section": "If something happens",
    "side": "rentals",
    "statusTag": {
      "label": "Never charged",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "l-wear_p_0",
        "kind": "paragraph",
        "text": "Never. If our regular cleaning and small touch-ups after every rental put it right, it is normal wear, and it is"
      },
      {
        "id": "l-wear_p_1",
        "kind": "paragraph",
        "text": "never charged. Natural perspiration is never charged either."
      },
      {
        "id": "l-wear_p_2",
        "kind": "paragraph",
        "text": "If it needs specialist stain treatment, a karigar's repair or new materials, or cannot be put right at all, it is damage,"
      },
      {
        "id": "l-wear_p_3",
        "kind": "paragraph",
        "text": "and here is what applies [opens answer l-damage]."
      }
    ],
    "searchWords": "normal wear stain perspiration sweat makeup charged loose thread crease what counts",
    "linkName": "l-wear",
    "appearsIn": [
      "Pricing & Fees",
      "If something happens"
    ],
    "orderIndex": 28
  },
  {
    "id": "l-damage",
    "question": "What if my piece is damaged?",
    "section": "If something happens",
    "side": "rentals",
    "statusTag": {
      "label": "Restoration only",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "l-damage_p_0",
        "kind": "paragraph",
        "text": "Tell us straight away, and please do not try to fix it yourself. The cost of restoring it is taken from your deposit,"
      },
      {
        "id": "l-damage_p_1",
        "kind": "paragraph",
        "text": "decided against the photographs and video we take before dispatch, and shared with you first. It carries no GST,"
      },
      {
        "id": "l-damage_p_2",
        "kind": "paragraph",
        "text": "because it restores the piece rather than paying for anything."
      },
      {
        "id": "l-damage_p_3",
        "kind": "paragraph",
        "text": "If the cost is more than your deposit, the balance is settled within 7 days of our written statement,"
      },
      {
        "id": "l-damage_p_4",
        "kind": "paragraph",
        "text": "once we have talked it through with you. Our Care, Cleaning & Damage Policy [opens page care-policy] explains"
      },
      {
        "id": "l-damage_p_5",
        "kind": "paragraph",
        "text": "more."
      }
    ],
    "searchWords": "damage tear stain repair cost charge karigar restoration deposit burn",
    "linkName": "l-damage",
    "appearsIn": [
      "Pricing & Fees",
      "If something happens"
    ],
    "orderIndex": 29
  },
  {
    "id": "l-loss",
    "question": "What if a piece is lost or not returned?",
    "section": "If something happens",
    "side": "rentals",
    "statusTag": {
      "label": "Replacement Value",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "l-loss_p_0",
        "kind": "paragraph",
        "text": "Every rental piece has a Replacement Value, shown in your booking summary before you pay. If a piece is lost,"
      },
      {
        "id": "l-loss_p_1",
        "kind": "paragraph",
        "text": "stolen, not returned or damaged beyond repair, its Replacement Value is owed, less your deposit, with no GST"
      },
      {
        "id": "l-loss_p_2",
        "kind": "paragraph",
        "text": "and no late days on top."
      },
      {
        "id": "l-loss_p_3",
        "kind": "paragraph",
        "text": "We always talk it through with you first. Our Deposit Policy [opens page deposit-policy] explains every step."
      },
      {
        "id": "l-loss_p_4",
        "kind": "paragraph",
        "text": "Ways to pay, promo codes and your GST invoice."
      }
    ],
    "searchWords": "lost stolen not returned replacement value missing theft beyond repair",
    "linkName": "l-loss",
    "appearsIn": [
      "Pricing & Fees",
      "If something happens"
    ],
    "orderIndex": 30
  },
  {
    "id": "y-ways",
    "question": "How can I pay?",
    "section": "How you pay",
    "side": "rentals",
    "paragraphs": [
      {
        "id": "y-ways_p_0",
        "kind": "paragraph",
        "text": "Securely through Razorpay, by UPI, debit or credit card, or net banking."
      },
      {
        "id": "y-ways_p_1",
        "kind": "paragraph",
        "text": "Your card and UPI details are never stored by us. Your deposit is the one amount paid separately, as arranged"
      },
      {
        "id": "y-ways_p_2",
        "kind": "paragraph",
        "text": "with you [opens answer d-pay]."
      }
    ],
    "searchWords": "pay payment methods upi card credit debit net banking emi razorpay secure",
    "linkName": "y-ways",
    "appearsIn": [
      "Pricing & Fees",
      "How you pay"
    ],
    "orderIndex": 31
  },
  {
    "id": "y-fees",
    "question": "Are there any other fees?",
    "section": "How you pay",
    "side": "rentals",
    "statusTag": {
      "label": "None",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "y-fees_p_0",
        "kind": "paragraph",
        "text": "No. There is no convenience fee, no platform fee and nothing extra for paying by card or UPI. Every charge that"
      },
      {
        "id": "y-fees_p_1",
        "kind": "paragraph",
        "text": "can ever apply is on this page, and everything for your order is shown before you pay."
      }
    ],
    "searchWords": "convenience fee platform fee hidden charges extra fees service charge card fee surcharge",
    "linkName": "y-fees",
    "appearsIn": [
      "Pricing & Fees",
      "How you pay"
    ],
    "orderIndex": 32
  },
  {
    "id": "y-promo",
    "question": "How do promo codes work?",
    "section": "How you pay",
    "side": "rentals",
    "paragraphs": [
      {
        "id": "y-promo_p_0",
        "kind": "paragraph",
        "text": "Enter your code at checkout, and you see the saving before you pay. A promo code applies to the price of your"
      },
      {
        "id": "y-promo_p_1",
        "kind": "paragraph",
        "text": "pieces, never to a deposit."
      }
    ],
    "searchWords": "promo code discount coupon offer code voucher",
    "linkName": "y-promo",
    "appearsIn": [
      "Pricing & Fees",
      "How you pay"
    ],
    "orderIndex": 33
  },
  {
    "id": "y-invoice",
    "question": "Will I receive a GST invoice?",
    "section": "How you pay",
    "side": "rentals",
    "paragraphs": [
      {
        "id": "y-invoice_p_0",
        "kind": "paragraph",
        "text": "Yes, for every order, with the GST on each charge set out clearly. If you are buying for a business, add your"
      },
      {
        "id": "y-invoice_p_1",
        "kind": "paragraph",
        "text": "GSTIN at checkout and it appears on your invoice."
      },
      {
        "id": "y-invoice_p_2",
        "kind": "paragraph",
        "text": "W H A T  Y O U  E A R N"
      },
      {
        "id": "y-invoice_p_3",
        "kind": "paragraph",
        "text": "How your share is set, and what it is calculated on."
      }
    ],
    "searchWords": "gst invoice bill receipt gstin business company tax invoice",
    "linkName": "y-invoice",
    "appearsIn": [
      "Pricing & Fees",
      "How you pay"
    ],
    "orderIndex": 34
  },
  {
    "id": "e-how",
    "question": "How is my share decided?",
    "section": "Your share",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-how_p_0",
        "kind": "paragraph",
        "text": "Your share is set for each piece and discussed openly with you before it goes live. It reflects your piece's value"
      },
      {
        "id": "e-how_p_1",
        "kind": "paragraph",
        "text": "and condition, and the effort it takes from our team to rent or sell it: collecting and cleaning it, photographing it"
      },
      {
        "id": "e-how_p_2",
        "kind": "paragraph",
        "text": "beautifully, and marketing it to the right people."
      },
      {
        "id": "e-how_p_3",
        "kind": "paragraph",
        "text": "Whatever the piece, our aim stays the same: that you recover a meaningful part of what you invested in it,"
      },
      {
        "id": "e-how_p_4",
        "kind": "paragraph",
        "text": "and that we keep only what truly reflects our work for it. Your share is then confirmed in its Listing Terms."
      }
    ],
    "searchWords": "share how decided set percentage commission per piece value condition effort marketing listing terms",
    "linkName": "e-how",
    "appearsIn": [
      "Pricing & Fees",
      "Your share"
    ],
    "orderIndex": 35
  },
  {
    "id": "e-fixed",
    "question": "Is there a fixed share for every piece?",
    "section": "Your share",
    "side": "earn",
    "statusTag": {
      "label": "Agreed piece by piece",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-fixed_p_0",
        "kind": "paragraph",
        "text": "No, and that is deliberate. Every piece is different: some find their first renter almost at once, while others need"
      },
      {
        "id": "e-fixed_p_1",
        "kind": "paragraph",
        "text": "more of our time, care and marketing to reach the right person."
      },
      {
        "id": "e-fixed_p_2",
        "kind": "paragraph",
        "text": "So rather than one figure for everyone, we agree a share for your piece with you before it goes live, and every"
      },
      {
        "id": "e-fixed_p_3",
        "kind": "paragraph",
        "text": "payout statement shows exactly how it was worked out. Here is how your share is decided [opens answer e-how]."
      }
    ],
    "searchWords": "fixed typical standard same every piece share percentage rate how much keep earn commission cut",
    "linkName": "e-fixed",
    "appearsIn": [
      "Pricing & Fees",
      "Your share"
    ],
    "orderIndex": 36
  },
  {
    "id": "e-on",
    "question": "What is my share calculated on?",
    "section": "Your share",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-on_p_0",
        "kind": "paragraph",
        "text": "On the rental fee of each booking, and on the final price of a sale, including an offer we have accepted."
      },
      {
        "id": "e-on_p_1",
        "kind": "paragraph",
        "text": "GST, deposits and delivery charges are never part of it: GST goes to the government, a deposit is the renter's own"
      },
      {
        "id": "e-on_p_2",
        "kind": "paragraph",
        "text": "money held in safekeeping, and delivery pays for the journey."
      }
    ],
    "searchWords": "calculated on paid on gst deposit delivery base what counts rental fee final price",
    "linkName": "e-on",
    "appearsIn": [
      "Pricing & Fees",
      "Your share"
    ],
    "orderIndex": 37
  },
  {
    "id": "e-promo",
    "question": "Do promo codes reduce my share?",
    "section": "Your share",
    "side": "earn",
    "statusTag": {
      "label": "Never",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-promo_p_0",
        "kind": "paragraph",
        "text": "Never. When we run a promo code, we fund it ourselves, so your share is worked out on the price before the code."
      },
      {
        "id": "e-promo_p_1",
        "kind": "paragraph",
        "text": "Listing is free. These are the only costs that can ever be yours."
      }
    ],
    "searchWords": "promo code discount reduce share sale marketing",
    "linkName": "e-promo",
    "appearsIn": [
      "Pricing & Fees",
      "Your share"
    ],
    "orderIndex": 38
  },
  {
    "id": "e-free",
    "question": "Does it cost anything to list a piece?",
    "section": "What listing costs",
    "side": "earn",
    "statusTag": {
      "label": "Nothing upfront",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-free_p_0",
        "kind": "paragraph",
        "text": "Nothing upfront. Listing is free, and collection, photography, cleaning and every delivery to renters and buyers are"
      },
      {
        "id": "e-free_p_1",
        "kind": "paragraph",
        "text": "on us."
      }
    ],
    "searchWords": "cost to list listing fee free upfront charge photography collection",
    "linkName": "e-free",
    "appearsIn": [
      "Pricing & Fees",
      "What listing costs"
    ],
    "orderIndex": 39
  },
  {
    "id": "e-costs",
    "question": "Which costs can ever be mine?",
    "section": "What listing costs",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-costs_p_0",
        "kind": "paragraph",
        "text": "Only these, and you always know them in advance:"
      },
      {
        "id": "e-costs_p_1",
        "kind": "paragraph"
      },
      {
        "id": "e-costs_p_2",
        "kind": "paragraph",
        "text": "A renter's damage is never taken from your payout."
      }
    ],
    "searchWords": "costs mine pay repair return delivery collection borrow which costs charged",
    "linkName": "e-costs",
    "appearsIn": [
      "Pricing & Fees",
      "What listing costs"
    ],
    "orderIndex": 40
  },
  {
    "id": "e-clean",
    "question": "Who pays for cleaning?",
    "section": "What listing costs",
    "side": "earn",
    "statusTag": {
      "label": "Always on us",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-clean_p_0",
        "kind": "paragraph",
        "text": "We do, always: after every rental, when a preloved piece first comes to us, and when you borrow your piece back"
      },
      {
        "id": "e-clean_p_1",
        "kind": "paragraph",
        "text": "to wear, both before it goes to you and when it returns."
      }
    ],
    "searchWords": "cleaning cost dry clean who pays borrow back intake",
    "linkName": "e-clean",
    "appearsIn": [
      "Pricing & Fees",
      "What listing costs"
    ],
    "orderIndex": 41
  },
  {
    "id": "e-repair",
    "question": "Who pays if my piece needs a repair?",
    "section": "What listing costs",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-repair_p_0",
        "kind": "paragraph",
        "text": "Work needed to bring your piece up to our standard is yours. We agree it with you first, carry it out once someone"
      },
      {
        "id": "e-repair_p_1",
        "kind": "paragraph",
        "text": "is interested in your piece, and take it from that piece's payout, so nothing is charged upfront."
      },
      {
        "id": "e-repair_p_2",
        "kind": "paragraph",
        "text": "Damage that happens during a rental is ours to deal with, from the renter's deposit. Our Seller Guidelines [opens"
      },
      {
        "id": "e-repair_p_3",
        "kind": "paragraph",
        "text": "page seller-guidelines] explain how your piece is looked after."
      },
      {
        "id": "e-repair_p_4",
        "kind": "paragraph",
        "text": "When you are paid, where, and with what record."
      }
    ],
    "searchWords": "repair damage who pays karigar fix restore standard",
    "linkName": "e-repair",
    "appearsIn": [
      "Pricing & Fees",
      "What listing costs"
    ],
    "orderIndex": 42
  },
  {
    "id": "e-when",
    "question": "When will I be paid?",
    "section": "Your payouts",
    "side": "earn",
    "statusTag": {
      "label": "Within 3 working days",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-when_p_0",
        "kind": "paragraph",
        "text": "Within 3 working days. For a rental, that is once it has ended and your piece is back with us and"
      },
      {
        "id": "e-when_p_1",
        "kind": "paragraph",
        "text": "inspected. For a sale, it is once the buyer has received the piece."
      }
    ],
    "searchWords": "when paid payout payment timeline days rental sale",
    "linkName": "e-when",
    "appearsIn": [
      "Pricing & Fees",
      "Your payouts"
    ],
    "orderIndex": 43
  },
  {
    "id": "e-where",
    "question": "Where is my payout sent?",
    "section": "Your payouts",
    "side": "earn",
    "statusTag": {
      "label": "Your own account",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-where_p_0",
        "kind": "paragraph",
        "text": "Into a bank account or UPI ID in your own name. To keep your earnings safe, we cannot pay into anyone else's"
      },
      {
        "id": "e-where_p_1",
        "kind": "paragraph",
        "text": "account."
      }
    ],
    "searchWords": "where bank account upi name own transfer",
    "linkName": "e-where",
    "appearsIn": [
      "Pricing & Fees",
      "Your payouts"
    ],
    "orderIndex": 44
  },
  {
    "id": "e-statement",
    "question": "Will I see how my payout is worked out?",
    "section": "Your payouts",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-statement_p_0",
        "kind": "paragraph",
        "text": "Yes. Every payout comes with a statement showing the price, your share and anything deducted from it."
      }
    ],
    "searchWords": "statement record breakdown payout history how worked out",
    "linkName": "e-statement",
    "appearsIn": [
      "Pricing & Fees",
      "Your payouts"
    ],
    "orderIndex": 45
  },
  {
    "id": "e-deduct",
    "question": "Can anything be deducted from my payout?",
    "section": "Your payouts",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-deduct_p_0",
        "kind": "paragraph",
        "text": "Only what you have agreed to, or what the law requires: one of the costs that can be yours [opens answer e-costs],"
      },
      {
        "id": "e-deduct_p_1",
        "kind": "paragraph",
        "text": "tax the law requires us to deduct, or an amount you owe under our Lister Terms [opens page lister-terms], such as"
      },
      {
        "id": "e-deduct_p_2",
        "kind": "paragraph",
        "text": "for a sale reversed because something was not disclosed."
      },
      {
        "id": "e-deduct_p_3",
        "kind": "paragraph",
        "text": "GST, tax deducted from payouts, and the tax on your own earnings."
      }
    ],
    "searchWords": "deduct deduction taken from payout less reduce owe",
    "linkName": "e-deduct",
    "appearsIn": [
      "Pricing & Fees",
      "Your payouts"
    ],
    "orderIndex": 46
  },
  {
    "id": "e-gst",
    "question": "Is GST taken from my share?",
    "section": "Tax and your PAN",
    "side": "earn",
    "statusTag": {
      "label": "Never from your share",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-gst_p_0",
        "kind": "paragraph",
        "text": "No. GST is paid by the renter or buyer on top of the price, and we pay it to the government. Your share is worked"
      },
      {
        "id": "e-gst_p_1",
        "kind": "paragraph",
        "text": "out on the price before GST."
      }
    ],
    "searchWords": "gst my share tax renter buyer pays government",
    "linkName": "e-gst",
    "appearsIn": [
      "Pricing & Fees",
      "Tax and your PAN"
    ],
    "orderIndex": 47
  },
  {
    "id": "e-pan",
    "question": "Why do you ask for my PAN?",
    "section": "Tax and your PAN",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-pan_p_0",
        "kind": "paragraph",
        "text": "We ask for your PAN before your piece goes live, together with your payout details, because the law can require"
      },
      {
        "id": "e-pan_p_1",
        "kind": "paragraph",
        "text": "us to deduct tax from some payouts. When it does, we deduct it and send you the certificate, so you can claim it in"
      },
      {
        "id": "e-pan_p_2",
        "kind": "paragraph",
        "text": "your income tax return."
      },
      {
        "id": "e-pan_p_3",
        "kind": "paragraph",
        "text": "We never ask for your full Aadhaar number."
      }
    ],
    "searchWords": "pan tds tax deducted source certificate aadhaar income tax",
    "linkName": "e-pan",
    "appearsIn": [
      "Pricing & Fees",
      "Tax and your PAN"
    ],
    "orderIndex": 48
  },
  {
    "id": "e-owntax",
    "question": "Do I pay tax on my earnings?",
    "section": "Tax and your PAN",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-owntax_p_0",
        "kind": "paragraph",
        "text": "You are responsible for any tax on your earnings, and your payout statements give you a clear record for your"
      },
      {
        "id": "e-owntax_p_1",
        "kind": "paragraph",
        "text": "return. If you are unsure how your earnings are treated, a tax adviser can guide you."
      },
      {
        "id": "e-owntax_p_2",
        "kind": "paragraph",
        "text": "How the price of your piece is set, and how offers work."
      }
    ],
    "searchWords": "tax my earnings income tax responsible return adviser",
    "linkName": "e-owntax",
    "appearsIn": [
      "Pricing & Fees",
      "Tax and your PAN"
    ],
    "orderIndex": 49
  },
  {
    "id": "e-price",
    "question": "Who sets the price of my piece?",
    "section": "Prices and offers",
    "side": "earn",
    "statusTag": {
      "label": "Agreed with you",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-price_p_0",
        "kind": "paragraph",
        "text": "We agree it with you. We suggest a rental price, a daily rate and a sale price from your piece's designer, condition"
      },
      {
        "id": "e-price_p_1",
        "kind": "paragraph",
        "text": "and demand, and nothing goes live until you are happy with them."
      },
      {
        "id": "e-price_p_2",
        "kind": "paragraph",
        "text": "We never lower a price on our own, and there is no fixed listing period and no automatic markdown. A price"
      },
      {
        "id": "e-price_p_3",
        "kind": "paragraph",
        "text": "changes only when you agree."
      }
    ],
    "searchWords": "price set who decides my piece value rental price daily rate sale price markdown",
    "linkName": "e-price",
    "appearsIn": [
      "Pricing & Fees",
      "Prices and offers"
    ],
    "orderIndex": 50
  },
  {
    "id": "e-offers",
    "question": "How do offers on my piece work?",
    "section": "Prices and offers",
    "side": "earn",
    "statusTag": {
      "label": "Preloved only",
      "tone": "worth-knowing"
    },
    "paragraphs": [
      {
        "id": "e-offers_p_0",
        "kind": "paragraph",
        "text": "Offers are taken only on pieces for sale, never on rentals. We agree with you the lowest offer we can accept, and"
      },
      {
        "id": "e-offers_p_1",
        "kind": "paragraph",
        "text": "only ever accept offers at or above it. Your share is then calculated on the price the buyer pays."
      }
    ],
    "searchWords": "offer offers negotiate lowest minimum accept make an offer",
    "linkName": "e-offers",
    "appearsIn": [
      "Pricing & Fees",
      "Prices and offers"
    ],
    "orderIndex": 51
  },
  {
    "id": "e-partner",
    "question": "I am a designer or a boutique",
    "section": "Prices and offers",
    "side": "earn",
    "paragraphs": [
      {
        "id": "e-partner_p_0",
        "kind": "paragraph",
        "text": "We would love to hear from you. Designers and boutiques listing a collection work with us as Designer Partners,"
      },
      {
        "id": "e-partner_p_1",
        "kind": "paragraph",
        "text": "and our Designer Partners [opens page designer-partners] page explains how."
      },
      {
        "id": "e-partner_p_2",
        "kind": "paragraph",
        "text": "9.6 The way across"
      },
      {
        "id": "e-partner_p_3",
        "kind": "paragraph",
        "text": "Element End of What you pay End of What you earn"
      },
      {
        "id": "e-partner_p_4",
        "kind": "paragraph",
        "text": "Line Listing a piece of your own? Renting or buying with us?"
      },
      {
        "id": "e-partner_p_5",
        "kind": "paragraph",
        "text": "Link See what you earn (opens What you earn) See what you pay (opens What you pay)"
      },
      {
        "id": "e-partner_p_6",
        "kind": "paragraph",
        "text": "9.7 Related policies and fine print"
      },
      {
        "id": "e-partner_p_7",
        "kind": "paragraph",
        "text": "Element Copy"
      },
      {
        "id": "e-partner_p_8",
        "kind": "paragraph",
        "text": "Label Related policies"
      },
      {
        "id": "e-partner_p_9",
        "kind": "paragraph",
        "text": "Link (refund-policy) Refund & Cancellation Policy"
      },
      {
        "id": "e-partner_p_10",
        "kind": "paragraph",
        "text": "Link (deposit-policy) Deposit Policy"
      },
      {
        "id": "e-partner_p_11",
        "kind": "paragraph",
        "text": "Link (shipping-policy) Shipping & Delivery Policy"
      },
      {
        "id": "e-partner_p_12",
        "kind": "paragraph",
        "text": "Link (care-policy) Care, Cleaning & Damage Policy"
      },
      {
        "id": "e-partner_p_13",
        "kind": "paragraph",
        "text": "Link (seller-guidelines) Seller Guidelines"
      },
      {
        "id": "e-partner_p_14",
        "kind": "paragraph",
        "text": "Link (terms) Terms & Conditions"
      },
      {
        "id": "e-partner_p_15",
        "kind": "paragraph",
        "text": "Link (faq) Help & FAQs"
      },
      {
        "id": "e-partner_p_16",
        "kind": "paragraph",
        "text": "Fine print This page explains our prices, charges and shares in plain words. Where it ever differs"
      },
      {
        "id": "e-partner_p_17",
        "kind": "paragraph",
        "text": "from our Terms & Conditions, the Terms apply. Last reviewed 11 October 2026."
      },
      {
        "id": "e-partner_p_18",
        "kind": "paragraph",
        "text": "Print link Print or save as PDF"
      },
      {
        "id": "e-partner_p_19",
        "kind": "paragraph",
        "text": "9.8 A question about a price?"
      },
      {
        "id": "e-partner_p_20",
        "kind": "paragraph",
        "text": "Element Copy"
      },
      {
        "id": "e-partner_p_21",
        "kind": "paragraph",
        "text": "Eyebrow We are here for you"
      },
      {
        "id": "e-partner_p_22",
        "kind": "paragraph",
        "text": "Title A question about a price? (italic: price?)"
      },
      {
        "id": "e-partner_p_23",
        "kind": "paragraph",
        "text": "Paragraph Every piece has its own story, and its own prices. If you would like the exact figures for"
      },
      {
        "id": "e-partner_p_24",
        "kind": "paragraph",
        "text": "a piece, help planning a rental around your celebrations, or a word about listing with us,"
      },
      {
        "id": "e-partner_p_25",
        "kind": "paragraph",
        "text": "message us. We would much rather help you directly, and nothing is too small to ask."
      },
      {
        "id": "e-partner_p_26",
        "kind": "paragraph",
        "text": "Buttons Message us on WhatsApp"
      },
      {
        "id": "e-partner_p_27",
        "kind": "paragraph",
        "text": "Write to us"
      },
      {
        "id": "e-partner_p_28",
        "kind": "paragraph",
        "text": "Channel: WhatsApp The fastest way to reach us. Seven days a week, 10 AM to 8 PM IST, with replies"
      },
      {
        "id": "e-partner_p_29",
        "kind": "paragraph",
        "text": "usually within 2 hours."
      },
      {
        "id": "e-partner_p_30",
        "kind": "paragraph",
        "text": "Action: Start a chat"
      },
      {
        "id": "e-partner_p_31",
        "kind": "paragraph",
        "text": "Channel: Email hello@houseofkaira.com. Best for anything you would like in writing, such as an invoice"
      },
      {
        "id": "e-partner_p_32",
        "kind": "paragraph",
        "text": "or a payout statement."
      },
      {
        "id": "e-partner_p_33",
        "kind": "paragraph",
        "text": "Action: Send an email"
      },
      {
        "id": "e-partner_p_34",
        "kind": "paragraph",
        "text": "Channel: Every order and payout, in"
      },
      {
        "id": "e-partner_p_35",
        "kind": "paragraph",
        "text": "one place"
      },
      {
        "id": "e-partner_p_36",
        "kind": "paragraph",
        "text": "Your bookings, receipts, deposits and payouts, in My Account."
      },
      {
        "id": "e-partner_p_37",
        "kind": "paragraph",
        "text": "Action: Go to my account"
      },
      {
        "id": "e-partner_p_38",
        "kind": "paragraph",
        "text": "9.9 Messages"
      },
      {
        "id": "e-partner_p_39",
        "kind": "paragraph",
        "text": "When Copy"
      },
      {
        "id": "e-partner_p_40",
        "kind": "paragraph",
        "text": "Result count \"<n> answers\" or \"1 answer\", then \", showing the closest <k>\" when more than 8 match"
      },
      {
        "id": "e-partner_p_41",
        "kind": "paragraph",
        "text": "Result line under each question <side> · <section title>, for example \"What you pay · Extra days and late returns\""
      },
      {
        "id": "e-partner_p_42",
        "kind": "paragraph",
        "text": "No results We could not find that one"
      },
      {
        "id": "e-partner_p_43",
        "kind": "paragraph",
        "text": "Ask us directly and we will answer it personally."
      },
      {
        "id": "e-partner_p_44",
        "kind": "paragraph",
        "text": "Button: Ask on WhatsApp"
      },
      {
        "id": "e-partner_p_45",
        "kind": "paragraph",
        "text": "Answer footer Still unsure? Ask us about this"
      },
      {
        "id": "e-partner_p_46",
        "kind": "paragraph",
        "text": "Copy link"
      },
      {
        "id": "e-partner_p_47",
        "kind": "paragraph",
        "text": "After Copy link (toast) Link copied. Paste it anywhere to share this answer."
      },
      {
        "id": "e-partner_p_48",
        "kind": "paragraph",
        "text": "WhatsApp message, from an"
      },
      {
        "id": "e-partner_p_49",
        "kind": "paragraph",
        "text": "answer or no results"
      },
      {
        "id": "e-partner_p_50",
        "kind": "paragraph",
        "text": "Email subject A question about pricing"
      },
      {
        "id": "e-partner_p_51",
        "kind": "paragraph",
        "text": "Ledger cell, accessible name <column>. <row>: <figure>. <line> Opens the full answer. (the column only on What"
      },
      {
        "id": "e-partner_p_52",
        "kind": "paragraph",
        "text": "you pay)"
      },
      {
        "id": "e-partner_p_53",
        "kind": "paragraph",
        "text": "priced, GST, deposits, delivery, extra days, cancellations, and how listers' shares are"
      },
      {
        "id": "e-partner_p_54",
        "kind": "paragraph",
        "text": "agreed and when they are paid."
      }
    ],
    "searchWords": "designer boutique brand label collection partner multiple pieces",
    "linkName": "e-partner",
    "appearsIn": [
      "Pricing & Fees",
      "Prices and offers"
    ],
    "orderIndex": 52
  }
];
