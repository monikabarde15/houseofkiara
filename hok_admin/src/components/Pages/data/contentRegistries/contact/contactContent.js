/**
 * House of Kaira: Contact Us Structured Content & Copy Deck
 * Section 16 of Build Specification v2
 * Strict rule: zero dashes used as punctuation.
 */

import { CONTACT_TOKENS } from "./contactSettings.js";

export const CONTACT_CONTENT = {
  // Breadcrumb
  breadcrumb: {
    homeLabel: "Home",
    homePath: "/",
    currentLabel: "Contact Us"
  },

  // Band 1: Hero & Ways to reach us
  hero: {
    eyebrow: "Contact Us",
    title: "We’d love to hear from you",
    lead: "Whether you are choosing a piece for a celebration, wearing one now, or thinking of listing your own, our team in Indore is here to help, personally."
  },

  liveStatus: {
    openTitle: "Our team is here now",
    openSub: `${CONTACT_TOKENS.support_days}, ${CONTACT_TOKENS.support_hours}.`,
    closedTitleTemplate: "We’re back {when} at {time} IST",
    closedSub: "Leave us a message, and we’ll reply as soon as we’re back."
  },

  reachCard: {
    title: "Ways to reach us",
    whatsapp: {
      name: "WhatsApp",
      value: CONTACT_TOKENS.support_whatsapp,
      rawNumber: CONTACT_TOKENS.support_whatsapp_raw,
      note: `The quickest way to reach us. During our hours, we usually reply within ${CONTACT_TOKENS.support_sla}.`,
      buttonLabel: "Message us on WhatsApp",
      greeting: "Hello House of Kaira, "
    },
    email: {
      name: "Email",
      value: CONTACT_TOKENS.support_email,
      note: `Best for photographs and documents, and for press and partnerships. We reply within ${CONTACT_TOKENS.email_sla}.`,
      subject: "A message for House of Kaira",
      copyLabel: "Copy",
      copiedLabel: "Copied",
      copyAriaName: "Copy email address",
      copiedToast: "Email address copied",
      copyFailToast: `Couldn’t copy it. Our email is ${CONTACT_TOKENS.support_email}.`
    },
    call: {
      name: "Call",
      value: CONTACT_TOKENS.support_phone,
      rawPhone: CONTACT_TOKENS.support_phone_raw,
      note: `${CONTACT_TOKENS.support_days}, ${CONTACT_TOKENS.support_hours}.`
    }
  },

  // Band 2: Answers, any time
  answers: {
    title: "Answers, any time",
    intro: "Most questions are answered on these pages, ready whenever you are.",
    pages: [
      {
        id: "faq",
        name: "Help & FAQs",
        desc: "Every question, from choosing your size to sending a piece back.",
        path: "/faqs"
      },
      {
        id: "shipping-policy",
        name: "Shipping & Delivery Policy",
        desc: "How your piece reaches you, and how a rental comes back to us.",
        path: "/shipping-policy"
      },
      {
        id: "deposit-policy",
        name: "Deposit Policy",
        desc: "When it is paid, how it is held, and when it comes back to you.",
        path: "/deposit"
      },
      {
        id: "care-policy",
        name: "Care, Cleaning & Damage Policy",
        desc: "Looking after a piece, and what happens if something goes wrong.",
        path: "/care-policy"
      },
      {
        id: "refund-policy",
        name: "Refund & Cancellation Policy",
        desc: "Changing your dates, cancelling, and how refunds work.",
        path: "/refunds"
      },
      {
        id: "seller-guidelines",
        name: "Seller Guidelines",
        desc: "Listing a piece with us, from pricing and payouts to how it is protected.",
        path: "/seller-guidelines"
      }
    ]
  },

  // Band 3: Write us a note
  write: {
    title: "Write us a note",
    intro: `Prefer to put it in writing? Send us a note here, and our team will reply by email within ${CONTACT_TOKENS.email_sla}.`,
    fields: {
      name: {
        id: "name",
        label: "Your name",
        required: true,
        placeholder: "",
        emptyMessage: "Please tell us your name."
      },
      email: {
        id: "email",
        label: "Email",
        required: true,
        placeholder: "",
        emptyMessage: "Please enter your email address.",
        badMessage: "Please check your email address. It should look like name@example.com."
      },
      phone: {
        id: "phone",
        label: "WhatsApp number",
        tag: "Optional",
        required: false,
        placeholder: "",
        hint: "If you’d like us to reply there instead.",
        badMessage: "Please check this number, or leave it blank."
      },
      topic: {
        id: "topic",
        label: "What is it about?",
        required: true,
        firstOption: "Choose one",
        options: [
          "Choosing a piece",
          "A booking or order",
          "Buying preloved",
          "Listing my piece",
          "Visiting you in Indore",
          "Something else"
        ],
        emptyMessage: "Please choose what your message is about."
      },
      orderRef: {
        id: "orderRef",
        label: "Order number or piece",
        tag: "Optional",
        required: false,
        placeholder: "",
        hint: "Your order number is on your confirmation, and in My Account.",
        accountPath: "/profile"
      },
      message: {
        id: "message",
        label: "Your message",
        required: true,
        placeholder: "",
        hint: "This note takes words only, so please send photographs on WhatsApp or by email.",
        emptyMessage: "Please write your message.",
        shortMessage: "Please tell us a little more, so we can help."
      }
    },
    privacyNotice: "We use these details only to reply to you, as our Privacy Policy explains.",
    privacyPath: "/privacy",
    buttonLabel: "Send your note",
    buttonSending: "Sending",
    checkLine: "Please check the highlighted fields.",
    failMessage: `Your note didn’t send. Please try again, or message us on WhatsApp at ${CONTACT_TOKENS.support_whatsapp}.`,
    thankYou: {
      titleTemplate: "Thank you, {first}.",
      textTemplate: `Your note is with our team. We’ll reply to {email} within ${CONTACT_TOKENS.email_sla}.`,
      soonerLine: "Need us sooner? Message us on WhatsApp.",
      buttonLabel: "Write another note"
    }
  },

  // Band 3 Aside: Visit us in Indore & Arrival Note
  side: {
    visit: {
      title: "Visit us in Indore",
      intro: "See pieces in person and talk through your occasion with our team. Visits are by appointment, so the pieces you’d like to see are ready and waiting for you.",
      place: CONTACT_TOKENS.visit_area,
      terms: "BY APPOINTMENT",
      buttonLabel: "Book a visit",
      greeting: "Hello House of Kaira, I’d like to book a visit to see some pieces in person."
    },
    arrival: {
      title: "Has a piece just arrived, and something isn’t right?",
      text: `Please tell us within ${CONTACT_TOKENS.issue_window} of delivery, with photographs, so we can put it right.`,
      linkText: "What happens next",
      linkPath: "/refunds"
    }
  },

  // Band 4: Raising a concern & Our details
  concern: {
    title: "Raising a concern",
    intro: "We’d always rather put things right in conversation, so please message us first. If you’re not happy with how we’ve handled something, write to our Grievance Officer.",
    rows: [
      { label: "Grievance Officer", value: `${CONTACT_TOKENS.grievance_name}, ${CONTACT_TOKENS.grievance_title}` },
      { label: "Email", value: CONTACT_TOKENS.grievance_email, isEmail: true },
      { label: "Phone", value: CONTACT_TOKENS.grievance_phone }
    ],
    promise: `We acknowledge every complaint within ${CONTACT_TOKENS.grievance_ack} and resolve it within ${CONTACT_TOKENS.grievance_resolve}.`,
    helplineText: `You can also contact the National Consumer Helpline on ${CONTACT_TOKENS.nch_phone}, on WhatsApp at ${CONTACT_TOKENS.nch_whatsapp}, or at ${CONTACT_TOKENS.nch_web}. Your rights are set out in our Terms & Conditions.`,
    termsPath: "/terms"
  },

  details: {
    title: "Our details",
    intro: `House of Kaira is a brand of ${CONTACT_TOKENS.trade_name}, ${CONTACT_TOKENS.legal_form} owned by ${CONTACT_TOKENS.legal_name}.`,
    rows: [
      { label: "Principal place of business", value: CONTACT_TOKENS.business_address },
      { label: "Website", value: CONTACT_TOKENS.site_url, isPlain: true }
    ],
    box: {
      title: "Sending something to us?",
      text: "Please speak to us before you send anything. Every return travels with our prepaid label or a collection we arrange, so it’s tracked and protected all the way."
    }
  }
};
