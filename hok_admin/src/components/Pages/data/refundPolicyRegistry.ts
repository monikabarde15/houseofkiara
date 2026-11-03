/**
 * Complete Data Registry for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 13 & Appendices A & B
 * Total: 103 unique answers (68 Rental, 53 Preloved)
 */

export const POLICY_TABS = {
  rental: {
    id: "rental",
    kicker: "FOR EVERY RENTAL",
    title: "Rental policy",
    forQuery: "rental",
  },
  preloved: {
    id: "preloved",
    kicker: "FOR EVERY PRELOVED PIECE",
    title: "Preloved policy",
    forQuery: "preloved",
  },
};

export const POLICY_SECTIONS = {
  rental: [
    {
      id: "cancel",
      barLabel: "Cancelling",
      title: "Cancelling a *booking*",
      description: "What you receive depends on how close your rental start date is.",
    },
    {
      id: "change",
      barLabel: "Changes",
      title: "Changing your *booking*",
      description: "Moving dates, swapping a piece, or keeping it a little longer.",
    },
    {
      id: "arrival",
      barLabel: "Delivery",
      title: "Delivery & *arrival*",
      description: "If anything is not right when your piece reaches you.",
    },
    {
      id: "wearing",
      barLabel: "During & after",
      title: "During & after your *event*",
      description: "Returning it, and anything that happens in between.",
    },
    {
      id: "deposit",
      barLabel: "Deposit",
      title: "Your security *deposit*",
      description: "Fully refundable, and never a surprise.",
    },
    {
      id: "money",
      barLabel: "Refunds",
      title: "Refunds & *payments*",
      description: "Where your money goes, and how long it takes.",
    },
    {
      id: "onus",
      barLabel: "When it is on us",
      title: "When it is *on us*",
      description: "If we or our courier let you down, you never pay for it.",
    },
    {
      id: "concerns",
      barLabel: "Your rights",
      title: "Concerns & your *rights*",
      description: "If you disagree with a decision, or want to take something further.",
    },
  ],
  preloved: [
    {
      id: "cancel",
      barLabel: "Cancelling",
      title: "Cancelling or changing an *order*",
      description: "A full refund, right up until your piece is dispatched.",
    },
    {
      id: "arrival",
      barLabel: "Delivery",
      title: "Delivery & *arrival*",
      description: "If anything is not right when your piece reaches you.",
    },
    {
      id: "yours",
      barLabel: "Once it is yours",
      title: "Once it is *yours*",
      description: "Fit, second thoughts, and giving a piece its next chapter.",
    },
    {
      id: "claims",
      barLabel: "Approved returns",
      title: "How approved returns *work*",
      description: "For the rare times a return is agreed.",
    },
    {
      id: "money",
      barLabel: "Refunds",
      title: "Refunds & *payments*",
      description: "Where your money goes, and how long it takes.",
    },
    {
      id: "onus",
      barLabel: "When it is on us",
      title: "When it is *on us*",
      description: "If we or our courier let you down, you never pay for it.",
    },
    {
      id: "concerns",
      barLabel: "Your rights",
      title: "Concerns & your *rights*",
      description: "If you disagree with a decision, or want to take something further.",
    },
  ],
};

export const POLICY_INTROS = {
  rental:
    "When you rent with House of Kaira, your piece is held for you alone: turned away from everyone else, then cleaned, pressed and packed for your dates. Our policy is built to be fair to you and to the next person waiting to wear it. And whenever something is on us, **you never pay for it.**",
  preloved:
    "Every preloved piece is one of a kind, reviewed, cleaned and described honestly before it reaches you. Because there is only ever one, a sale is final once the piece is dispatched. But you are fully protected if a piece is not what we promised, and **whenever something is on us, you never pay for it.**",
};

export const POLICY_IN_BRIEF = {
  rental: [
    {
      situation: "Cancel more than {{rental_cancel_full}} before your rental starts",
      verdict: "Full refund",
      tone: "yes",
      opens: "r-cancel-early",
    },
    {
      situation: "Cancel within {{rental_cancel_full}}, before dispatch",
      verdict: "Message us first",
      tone: "mid",
      opens: "r-cancel-late",
    },
    {
      situation: "Cancel once your piece is dispatched",
      verdict: "No refund",
      tone: "no",
      opens: "r-cancel-dispatched",
    },
    {
      situation: "Change your dates or swap your piece, before dispatch",
      verdict: "Usually possible",
      tone: "yes",
      opens: "r-change-dates",
    },
    {
      situation: "Your security deposit",
      verdict: "Back in {{deposit_refund_window}}",
      tone: "yes",
      opens: "r-deposit-back",
    },
    {
      situation: "Late delivery, a wrong piece, or anything else on us",
      verdict: "Full refund",
      tone: "yes",
      opens: "r-late-arrival",
    },
  ],
  preloved: [
    {
      situation: "Cancel before your piece is dispatched",
      verdict: "Full refund",
      tone: "yes",
      opens: "p-cancel-before",
    },
    {
      situation: "Cancel after dispatch, a fit issue, or a change of heart",
      verdict: "Final sale",
      tone: "no",
      opens: "p-cancel-after",
    },
    {
      situation: "Not as described, damaged, or the wrong piece",
      verdict: "Tell us within {{issue_window}}",
      tone: "mid",
      opens: "p-not-described",
    },
    {
      situation: "A piece we cannot stand behind as authentic",
      verdict: "Full refund",
      tone: "yes",
      opens: "p-authentic",
    },
    {
      situation: "Anything that is on us",
      verdict: "Full refund",
      tone: "yes",
      opens: "p-hok-cancels",
    },
  ],
};

export const ALL_REFUND_QUESTIONS = [
  /* ==========================================================================
     RENTAL POLICY QUESTIONS (Appendix A)
     ========================================================================== */

  // Section 01: Cancelling a booking
  {
    id: "r-how-cancel",
    for: "rent",
    sec: "cancel",
    q: "How do I cancel a rental?",
    tag: null,
    a: [
      "Go to **My Account**, open your booking and choose **Cancel Booking**. You can also message us on WhatsApp with your booking number and we will do it for you.",
      "You will see what will be refunded before you confirm, and we send a confirmation on WhatsApp and email once it is done.",
    ],
    kw: "cancel how steps button account booking",
    rv: "Confirm the Cancel Booking flow shows the refund amount before the customer confirms, and what it shows inside the full refund window.",
  },
  {
    id: "r-cancel-early",
    for: "rent",
    sec: "cancel",
    q: "What do I get back if I cancel more than 7 days before my rental starts?",
    tag: { text: "Full refund", tone: "yes" },
    a: [
      "A full refund: your rental fee, the GST on it, and any delivery charge you paid. If your security deposit has already been collected, it comes back in full too.",
      "Your dates are then released so the piece can go to someone else.",
    ],
    tokens: ["rental_cancel_full"],
    kw: "cancel early refund full more than week",
    rv: "Confirm delivery charges are refunded on cancellations made more than 7 days ahead.",
  },
  {
    id: "r-cancel-window",
    for: "rent",
    sec: "cancel",
    q: "How are the 7 days counted?",
    tag: null,
    a: [
      "From the moment you cancel to your rental start date, which is the day your piece is delivered, 2 days before your event. Both dates are shown in your confirmation and in My Account.",
      "For example, if your event is on the 20th, your piece arrives on the 18th, so cancelling on or before the 10th gets you a full refund.",
    ],
    tokens: ["arrive_before", "rental_cancel_full"],
    kw: "how counted seven days cut off deadline start date",
    rv: "Confirm the cut off is by date (not to the hour) and in IST. The example assumes the current token values of 2 days and 7 days.",
  },
  {
    id: "r-cancel-late",
    for: "rent",
    sec: "cancel",
    q: "What if I cancel within 7 days of my rental start date?",
    tag: { text: "Message us first", tone: "mid" },
    a: [
      "By then your piece has been held back from other customers and is being prepared for you, so a full refund is not possible.",
      "Message us before you cancel. We will tell you exactly what can be refunded before anything goes through. If your event has simply moved, we will help you [change your dates](q:r-change-dates) instead, which usually avoids any loss.",
      "Your security deposit always comes back in full as long as the piece has not been dispatched.",
    ],
    tokens: ["rental_cancel_full"],
    kw: "cancel late last minute within week partial",
    rv: "Decide the refund, if any, for cancellations inside the 7 day window but before dispatch. A clear figure should replace “message us” before launch; it is the first thing customers look for.",
  },
  {
    id: "r-cancel-dispatched",
    for: "rent",
    sec: "cancel",
    q: "Can I cancel after my rental has been dispatched?",
    tag: { text: "No refund", tone: "no" },
    a: [
      "No. Once a rental is on its way, it cannot be cancelled or refunded. It has been cleaned, pressed and packed for you, and the next customer's booking is planned around its return.",
      "If something is wrong when it arrives, message us within 24 hours of delivery and we will help. See [Delivery & arrival](sec:arrival).",
    ],
    tokens: ["issue_window"],
    kw: "cancel after dispatch shipped on the way",
    rv: null,
  },
  {
    id: "r-cancel-one",
    for: "rent",
    sec: "cancel",
    q: "I booked several pieces. Can I cancel just one?",
    tag: { text: "Yes", tone: "yes" },
    a: [
      "Yes. Each piece is its own booking with its own dates, so you can cancel one and keep the rest. The policy applies to each piece based on its own rental start date.",
    ],
    kw: "several pieces multiple cancel one item part order",
    rv: null,
  },
  {
    id: "r-event-moved",
    for: "rent",
    sec: "cancel",
    q: "My event has been postponed or called off. What now?",
    tag: null,
    a: [
      "We understand, plans change. Tell us as early as you can.",
      "If the event has moved, we will first try to move your booking to the new date, and if the piece is free, there is nothing more to worry about. If it cannot be moved, or the event is off entirely, cancellation follows the usual policy, based on your original rental start date.",
    ],
    kw: "event postponed called off wedding cancelled date moved",
    rv: null,
  },
  {
    id: "r-emergency",
    for: "rent",
    sec: "cancel",
    q: "Something serious has happened in the family. Can you make an exception?",
    tag: null,
    a: [
      "We are so sorry. Please message us and share only what you are comfortable sharing. Situations like this are looked at personally and with care, and we will do whatever we reasonably can, whether that is moving your booking to a later date or finding another way to help.",
    ],
    kw: "emergency illness hospital bereavement death family exception compassion",
    rv: "Decide how far compassionate exceptions go and who approves them, so every customer is treated alike.",
  },
  {
    id: "r-someone-else",
    for: "rent",
    sec: "cancel",
    q: "I booked for someone else. Who can cancel, and where does the refund go?",
    tag: null,
    a: [
      "The booking and the deposit stay in your name, so cancellations and changes come from you, in My Account or from the WhatsApp number on the booking. Any refund goes back to the payment method used at checkout.",
    ],
    kw: "someone else booked for friend mother who can cancel refund to",
    rv: null,
  },

  // Section 02: Changing your booking
  {
    id: "r-change-dates",
    for: "rent",
    sec: "change",
    q: "Can I change my rental dates?",
    tag: { text: "Before dispatch", tone: "yes" },
    a: [
      "Yes, as long as your piece has not been dispatched. Message us with your new dates. If the piece is free, we move your booking and settle any difference in price, whichever way it falls.",
      "A date change is not a cancellation, so no cancellation charge applies.",
    ],
    kw: "change dates reschedule move booking new date",
    rv: "Confirm how many date changes are allowed, and that no cancellation charge applies to a change made inside the 7 day window.",
  },
  {
    id: "r-swap",
    for: "rent",
    sec: "change",
    q: "Can I swap to a different piece or size?",
    tag: { text: "Before dispatch", tone: "yes" },
    a: [
      "Yes, before dispatch, as long as the new piece is free for your dates. We settle the price difference either way, and the deposit changes if the new piece carries a different one.",
      "Inside the final 7 days it depends on whether the new piece can be prepared and reach you in time, so please message us as early as you can.",
    ],
    tokens: ["rental_cancel_full"],
    kw: "swap different piece size exchange change outfit",
    rv: "Decide whether a swap inside the 7 day window is treated as a change (no charge) or as a cancellation.",
  },
  {
    id: "r-shorter",
    for: "rent",
    sec: "change",
    q: "Can I switch to a shorter rental window for a lower price?",
    tag: { text: "Before dispatch", tone: "yes" },
    a: [
      "Before dispatch, yes. You can move from the extended window of 7 days to the standard window of 4 days, and we refund the difference. Once the piece is with you, returning it early does not reduce the rental fee.",
    ],
    tokens: ["window_extended", "window_standard"],
    kw: "shorter window downgrade fewer days cheaper",
    rv: "Confirm window downgrades before dispatch are refunded.",
  },
  {
    id: "r-extend",
    for: "rent",
    sec: "change",
    q: "Can I extend my rental?",
    tag: { text: "Ask before your return date", tone: "mid" },
    a: [
      "Message us before your return date. If nobody has booked the piece straight after you, we can extend your window, and the extra days are charged at the piece's daily rate. There is no penalty for asking.",
    ],
    kw: "extend keep longer extra days",
    rv: "Confirm extensions are allowed and how the extra days are paid.",
  },
  {
    id: "r-extend-refund",
    for: "rent",
    sec: "change",
    q: "I paid for an extension but returned it on my original date. Are the extra days refunded?",
    tag: { text: "No", tone: "no" },
    a: [
      "Once an extension is confirmed, those days are held for you and turned down for others, so they are not refunded if you return sooner. If your plans change before the extension begins, message us and we will see what we can do.",
    ],
    kw: "extension refund returned early extra days back",
    rv: "Confirm this position on unused extension days.",
  },
  {
    id: "r-change-address",
    for: "rent",
    sec: "change",
    q: "Can I change the delivery address?",
    tag: null,
    a: [
      "Yes, before your piece is dispatched. Message us with your booking number and the new address.",
      "Once it is on its way, we will ask the courier to redirect it, but we cannot promise they will, so please check your address carefully at checkout.",
    ],
    kw: "change address wrong address redirect location",
    rv: "Confirm whether our courier supports redirection after dispatch.",
  },

  // Section 03: Delivery & arrival (Rental)
  {
    id: "r-no-fit",
    for: "rent",
    sec: "arrival",
    q: "It does not fit",
    tag: { text: "Tell us within 24 hours", tone: "mid" },
    a: [
      "Your piece arrives 2 days before your event so there is time to try it on. If it does not fit, message us within 24 hours of delivery with a photo, and we will do everything we can to help, including suggesting another piece that is free for your dates.",
      "The surest way to avoid this is to check the actual garment measurements on the product page, or message us before you book if you are unsure.",
    ],
    tokens: ["arrive_before", "issue_window"],
    kw: "does not fit wrong size tight loose arrived",
    rv: "Decide the exchange policy for a rental that does not fit: swap only, partial refund, or none. (Same open decision as the FAQ.)",
  },
  {
    id: "r-not-fresh",
    for: "rent",
    sec: "arrival",
    q: "It is not fresh, or not as described in the listing",
    tag: { text: "Tell us within 24 hours", tone: "mid" },
    a: [
      "That should never happen, and we want to know straight away. Message us within 24 hours of delivery with photos, and we will make it right before your event.",
      "Anything already photographed and disclosed in the listing is part of the piece's condition, not a fault. The listing is always your reference.",
    ],
    tokens: ["issue_window"],
    kw: "not fresh smell stain dirty mark not as described different",
    rv: "Decide the remedy: a replacement piece, an express clean, or a refund. (Same open decision as the FAQ.)",
  },
  {
    id: "r-wrong-piece",
    for: "rent",
    sec: "arrival",
    q: "I received the wrong piece",
    tag: { text: "We make it right", tone: "yes" },
    a: [
      "We are so sorry. Message us within 24 hours with a photo. We will send the right piece by the fastest route and collect the wrong one at no cost to you.",
      "If the right piece cannot reach you in time, you receive a full refund, including your deposit.",
    ],
    tokens: ["issue_window"],
    kw: "wrong piece item different outfit sent",
    rv: "Confirm the remedy for a wrong piece.",
  },
  {
    id: "r-missing-part",
    for: "rent",
    sec: "arrival",
    q: "Something listed as included is missing",
    tag: { text: "Tell us within 24 hours", tone: "mid" },
    a: [
      "Check the product page for what is included, for example the lehenga, blouse and dupatta. Jewellery, footwear and accessories are only included when the listing says so.",
      "If a listed part is missing, message us within 24 hours of delivery. We will send it by the fastest route, and if it cannot reach you in time, we refund a fair share of the rental fee.",
    ],
    tokens: ["issue_window"],
    kw: "missing dupatta blouse part incomplete included",
    rv: "Decide how the partial refund is worked out when a missing part cannot reach the customer in time.",
  },
  {
    id: "r-parcel-damaged",
    for: "rent",
    sec: "arrival",
    q: "The parcel arrived damaged or looks tampered with",
    tag: { text: "Tell us within 24 hours", tone: "mid" },
    a: [
      "Take photos of the packaging before you open it, and message us within 24 hours of delivery. If you can, record a short video as you unpack it, which helps us settle things with the courier quickly.",
      "If the piece itself has been damaged, we replace it if we can reach you in time, or refund you in full.",
    ],
    tokens: ["issue_window"],
    kw: "parcel damaged box torn tampered opened",
    rv: "Confirm the remedy for transit damage: replacement first, full refund if no replacement can arrive in time.",
  },
  {
    id: "r-not-home",
    for: "rent",
    sec: "arrival",
    q: "What if nobody is home to receive it?",
    tag: null,
    a: [
      "If you know you will be away, tell us before dispatch and we will arrange a better time or someone else to receive it. The courier will also try to reach you on the day.",
      "If a delivery fails because nobody was available and it cannot be attempted again in time for your event, the rental fee cannot be refunded. Your deposit comes back in full once the piece is back with us, unworn.",
    ],
    kw: "not home missed delivery away nobody failed delivery",
    rv: "Confirm the rental fee is not refunded when delivery fails because the customer was unavailable.",
  },
  {
    id: "r-refuse",
    for: "rent",
    sec: "arrival",
    q: "Can I refuse the parcel at the door?",
    tag: null,
    a: [
      "You can, but a refused rental is treated as a cancellation after dispatch, so the rental fee is not refunded. Your deposit comes back in full once the piece is back with us.",
      "If you are refusing it because the parcel looks damaged or tampered with, take a photo and message us straight away. That is different, and we will look after you (→ [damaged parcel](q:r-parcel-damaged)).",
    ],
    kw: "refuse parcel reject delivery door",
    rv: "Confirm the position on refused rental deliveries.",
  },
  {
    id: "r-changed-mind",
    for: "rent",
    sec: "arrival",
    q: "I changed my mind about it, or did not end up wearing it",
    tag: { text: "No refund", tone: "no" },
    a: [
      "Because the piece was reserved, prepared and delivered for you, the rental fee cannot be refunded once it has arrived as described. We are always glad to help you style it.",
      "Please still return it on time, and your deposit will come back in full after inspection.",
    ],
    kw: "changed mind do not like did not wear unused not worn",
    rv: null,
  },

  // Section 04: During & after your event
  {
    id: "r-worn-damage",
    for: "rent",
    sec: "wearing",
    q: "Something happened to the piece while I was wearing it",
    tag: null,
    a: [
      "Tell us straight away, and please do not try to fix or clean it yourself. For a spill, gently blot with a clean tissue and do not rub.",
      "Small things like a loose thread, light creasing or a little embellishment loss are [normal wear](q:r-normal-wear) and are never deducted. Anything more is assessed when the piece comes back, and we always explain it to you first.",
    ],
    kw: "spill stain accident damage while wearing tear",
    rv: null,
  },
  {
    id: "r-pins",
    for: "rent",
    sec: "wearing",
    q: "Can I pin, tack or alter it to make it fit?",
    tag: null,
    a: [
      "Please do not alter a rental in any way, including stitching, hemming, cutting or taking in. Any alteration is treated as damage.",
      "If fit is a worry, message us before your event and we will help you find a way that works.",
    ],
    kw: "alter stitch pin tape tailor hem",
    rv: "Decide whether safety pins or fashion tape are allowed. (Same open decision as the FAQ.)",
  },
  {
    id: "r-early-return",
    for: "rent",
    sec: "wearing",
    q: "Can I return it early for a partial refund?",
    tag: { text: "No", tone: "no" },
    a: [
      "You are welcome to send it back early, and your deposit will be processed sooner, but the rental fee covers the whole window you booked, so unused days are not refunded.",
    ],
    kw: "return early partial refund unused days",
    rv: null,
  },
  {
    id: "r-late-return",
    for: "rent",
    sec: "wearing",
    q: "What if I return it late?",
    tag: { text: "Daily late fee", tone: "no" },
    a: [
      "Late returns are charged at one day's rental rate for each extra day, because another customer may be waiting for the piece. If you think you may be late, tell us as early as you can, as an [extension](q:r-extend) is usually kinder on both sides.",
      "Any late fee is shown to you first and taken from your deposit, unless you would rather pay it separately.",
    ],
    kw: "late return delay extra day fee",
    rv: "Confirm how late fees are collected: deducted from the deposit, or paid separately.",
  },
  {
    id: "r-pickup-delay",
    for: "rent",
    sec: "wearing",
    q: "The pickup was delayed on your side",
    tag: { text: "No charge", tone: "yes" },
    a: [
      "You will not be charged. Late fees only apply when a return is delayed by the renter, never when a pickup is delayed by us or our courier.",
    ],
    kw: "courier did not come pickup missed delayed your side",
    rv: "Confirm this commitment. (Same open decision as the FAQ.)",
  },
  {
    id: "r-missed-pickup",
    for: "rent",
    sec: "wearing",
    q: "I missed my pickup slot",
    tag: null,
    a: [
      "Message us and we will book the next available slot. If the pickup was missed because nobody was available, the extra days until the next pickup may be charged as a late return.",
    ],
    kw: "missed pickup slot not home return reschedule",
    rv: "Confirm late fees apply when the renter misses a confirmed pickup.",
  },
  {
    id: "r-lost-label",
    for: "rent",
    sec: "wearing",
    q: "I have lost the return label or garment bag",
    tag: null,
    a: [
      "Just message us. We will send you a new label, and any clean, sturdy bag will do for the journey back.",
    ],
    kw: "lost label garment bag packaging",
    rv: "Confirm a replacement label can be issued. (Same open decision as the FAQ.)",
  },
  {
    id: "r-clean-first",
    for: "rent",
    sec: "wearing",
    q: "Should I clean it before returning it?",
    tag: { text: "Please do not", tone: "no" },
    a: [
      "Please do not. Cleaning after your rental is handled entirely by us and included in the price. Washing, steaming or spot cleaning at home can damage delicate work, and damage caused that way is treated like any other damage.",
    ],
    kw: "wash clean before returning dry clean steam",
    rv: null,
  },
  {
    id: "r-lost-piece",
    for: "rent",
    sec: "wearing",
    q: "What if the piece is lost, stolen or not returned?",
    tag: null,
    a: [
      "Please tell us straight away. A piece that is lost, stolen or not returned is treated as a total loss: your deposit is held, and you are charged the piece's replacement value, less the deposit. We always speak with you first and share how the value was worked out.",
      "If it goes missing with our courier after pickup, you are not responsible, which is why we ask you to keep your pickup receipt.",
    ],
    kw: "lost stolen not returned missing piece theft",
    rv: "Decide how replacement value is set, when a late return becomes “not returned”, and whether a police report is needed for theft.",
  },

  // Section 05: Your security deposit
  {
    id: "r-deposit-what",
    for: "rent",
    sec: "deposit",
    q: "What is the security deposit for?",
    tag: null,
    a: [
      "It is a fully refundable amount held against accidental damage beyond normal wear, so the piece is protected for the next person who wears it. The amount depends on the piece and is always shown on its product page. There is no GST on the deposit.",
    ],
    kw: "security deposit what why amount gst",
    rv: null,
  },
  {
    id: "r-deposit-when",
    for: "rent",
    sec: "deposit",
    q: "When and how do I pay the deposit?",
    tag: null,
    a: [
      "It depends on the piece, and the product page tells you which applies.",
      "For some pieces, the deposit is paid at checkout with your rental fee. For others, our team messages you on WhatsApp within 24 hours of your booking to arrange it by UPI or bank transfer. Your piece is dispatched once the deposit is received.",
    ],
    tokens: ["deposit_contact"],
    kw: "pay deposit when how whatsapp upi transfer",
    rv: null,
  },
  {
    id: "r-deposit-unpaid",
    for: "rent",
    sec: "deposit",
    q: "What if my deposit is not received before dispatch?",
    tag: null,
    a: [
      "We will remind you in good time, because your piece can only be dispatched once the deposit is received. If it still has not arrived by the dispatch date, we may have to release your booking, and it is then treated as a cancellation on that date.",
    ],
    kw: "deposit not paid unpaid missed deposit booking safe",
    rv: "Confirm what happens when a WhatsApp deposit is not received before dispatch.",
  },
  {
    id: "r-deposit-back",
    for: "rent",
    sec: "deposit",
    q: "When do I get my deposit back?",
    tag: { text: "3 to 5 business days", tone: "yes" },
    a: [
      "We inspect every piece within 24 hours of receiving it. If all is well, your full deposit is refunded within 3 to 5 business days, and we confirm it on WhatsApp.",
      "You can follow each step in the Deposit Tracker in My Account.",
    ],
    tokens: ["inspect_within", "deposit_refund_window"],
    kw: "deposit refund when get money back",
    rv: null,
  },
  {
    id: "r-deposit-where",
    for: "rent",
    sec: "deposit",
    q: "Where does my deposit go back to?",
    tag: null,
    a: [
      "A deposit paid at checkout goes back to your original payment method. A deposit paid by UPI or bank transfer goes back to the account it came from.",
    ],
    kw: "deposit refunded which account source",
    rv: "Confirm refunds for WhatsApp collected deposits go back to the source account. (Same open decision as the FAQ.)",
  },
  {
    id: "r-deposit-cancel",
    for: "rent",
    sec: "deposit",
    q: "If I cancel, do I get my deposit back?",
    tag: { text: "Yes, in full", tone: "yes" },
    a: [
      "Yes, in full, whenever you cancel before the piece is dispatched. The deposit is only ever held against the condition of the piece, never against a cancellation.",
    ],
    kw: "cancel deposit back cancellation",
    rv: null,
  },
  {
    id: "r-deposit-slow",
    for: "rent",
    sec: "deposit",
    q: "My deposit has not come back yet",
    tag: null,
    a: [
      "Check the Deposit Tracker in My Account first, which shows each step. If it has been more than 3 to 5 business days since your piece was inspected, message us with your booking number and we will share the bank reference so you can trace it.",
    ],
    tokens: ["deposit_refund_window"],
    kw: "deposit not received late delayed where is my deposit",
    rv: null,
  },
  {
    id: "r-normal-wear",
    for: "rent",
    sec: "deposit",
    q: "What counts as normal wear?",
    tag: { text: "Never deducted", tone: "yes" },
    a: [
      "The small things that happen when a piece is worn and enjoyed: a few loose threads, a little embellishment loss, light creasing. These are expected and never deducted from your deposit.",
    ],
    kw: "normal wear small loose bead thread crease",
    rv: null,
  },
  {
    id: "r-damage-what",
    for: "rent",
    sec: "deposit",
    q: "What counts as damage?",
    tag: null,
    a: [
      "Anything beyond normal wear, such as stains, tears, burns, significant bead or embroidery loss, or any alteration to the piece. It is assessed when the piece comes back to us.",
    ],
    kw: "damage stain tear burn what counts",
    rv: null,
  },
  {
    id: "r-damage-process",
    for: "rent",
    sec: "deposit",
    q: "How is a deduction decided?",
    tag: null,
    a: [
      "Our team documents any damage with photographs and shares the details with you, along with the repair or cleaning cost. We explain any deduction before a partial refund is processed, so there are no surprises.",
      "> You will always see the evidence and the amount before anything is withheld.",
    ],
    kw: "damaged deduction withheld process photos",
    rv: null,
  },
  {
    id: "r-deposit-dispute",
    for: "rent",
    sec: "deposit",
    q: "I do not agree with a deduction",
    tag: null,
    a: [
      "Reply to our message and tell us why. A senior member of the team who was not part of the original inspection will review the photographs and your note, and come back to you. Nothing is finalised until you have had your say.",
    ],
    kw: "disagree deduction dispute unfair challenge",
    rv: "Confirm who reviews disputed deductions and how quickly.",
  },
  {
    id: "r-damage-over",
    for: "rent",
    sec: "deposit",
    q: "What if the repair costs more than my deposit?",
    tag: null,
    a: [
      "This is rare. If it happens, we share the full assessment with you and talk it through together before anything further is decided. We never charge you without a conversation first.",
    ],
    kw: "repair costs more than deposit pay extra",
    rv: "Decide the policy when repair costs exceed the deposit. (Same open decision as the FAQ.)",
  },
  {
    id: "r-deposit-use",
    for: "rent",
    sec: "deposit",
    q: "Can my deposit be used towards my rental fee or my next booking?",
    tag: { text: "No", tone: "no" },
    a: [
      "No. The deposit is held separately and always comes back to you, less any agreed deduction. Keeping it apart from payments keeps it simple and transparent.",
    ],
    kw: "use deposit towards rental fee next booking adjust roll over",
    rv: "Confirm deposits cannot be rolled over to a future booking.",
  },

  // Section 06: Refunds & payments (Shared + Rental specific)
  {
    id: "m-where",
    for: "both",
    sec: "money",
    q: "Where does my refund go?",
    tag: { text: "Original payment method", tone: "yes" },
    a: [
      "Back to the original payment method used at checkout: the same UPI account, card or net banking source. For your security, we cannot send it to a different account, pay it in cash, or give it as store credit.",
    ],
    kw: "refund where account card upi different account cash store credit",
    rv: "Confirm no store credit option is planned.",
  },
  {
    id: "m-time",
    for: "both",
    sec: "money",
    q: "How long does a refund take?",
    tag: { text: "5 to 7 business days", tone: "yes" },
    a: [
      "We start your refund as soon as a cancellation is confirmed, or as soon as an approved return reaches us and is checked. It usually appears within 5 to 7 business days, depending on your bank.",
      "UPI refunds are often quicker, while a credit card refund can take up to one billing cycle to show on your statement.",
      "[[steps]]",
    ],
    tokens: ["refund_timeline"],
    kw: "refund how long when days time",
    rv: null,
  },
  {
    id: "r-gst",
    for: "rent",
    sec: "money",
    q: "Is GST refunded too?",
    tag: { text: "Yes", tone: "yes" },
    a: [
      "Yes. The 18% GST you paid on your rental fee is refunded along with it, so you receive back the full amount you paid for whatever is being refunded.",
      "If you asked for a GST invoice, we issue a credit note for the refunded amount.",
    ],
    tokens: ["gst_rental"],
    kw: "gst tax refunded credit note invoice",
    rv: "Confirm credit notes are issued against GST invoices on every refund.",
  },
  {
    id: "r-partial",
    for: "rent",
    sec: "money",
    q: "What does a partial refund mean?",
    tag: null,
    a: [
      "It means part of what you paid is kept, usually because the piece had already been held and prepared for you, or because a deduction was agreed from your deposit. We always tell you the exact amount, and why, before anything goes through.",
    ],
    kw: "partial refund meaning why not full",
    rv: null,
  },
  {
    id: "r-two-refunds",
    for: "rent",
    sec: "money",
    q: "Why are my rental refund and my deposit arriving separately?",
    tag: null,
    a: [
      "They are two different amounts, sometimes paid in different ways, so they are processed separately. You can follow both in My Account.",
    ],
    kw: "two refunds separate deposit rental fee different times",
    rv: null,
  },
  {
    id: "m-track",
    for: "both",
    sec: "money",
    q: "How can I track my refund?",
    tag: null,
    a: [
      "Open your booking or order in My Account, where the refund amount and its status are shown. Once it has been sent, we can also share the bank reference number, which your bank can use to trace it.",
    ],
    kw: "track refund status reference utr arn",
    rv: "Confirm My Account shows refund status, and that the bank reference (UTR or ARN) can be shared.",
  },
  {
    id: "m-not-received",
    for: "both",
    sec: "money",
    q: "It has been longer than 5 to 7 business days and my refund has not arrived",
    tag: null,
    a: [
      "First check your statement for a credit from House of Kaira or our payment partner, as the name shown can differ. If it is not there, message us with your booking or order number and we will share the bank reference so your bank can trace it quickly.",
    ],
    tokens: ["refund_timeline"],
    kw: "refund not received missing delayed late",
    rv: null,
  },
  {
    id: "m-failed",
    for: "both",
    sec: "money",
    q: "Money left my account but I did not get a confirmation",
    tag: null,
    a: [
      "Give it a few minutes and check your email and WhatsApp, as banks sometimes confirm late. If you still have nothing, message us with the time and amount of the payment and we will check it straight away.",
      "If an order did not go through, your bank reverses the amount automatically, usually within 5 to 7 business days.",
    ],
    tokens: ["refund_timeline"],
    kw: "payment failed deducted money cut no confirmation",
    rv: null,
  },
  {
    id: "m-double",
    for: "both",
    sec: "money",
    q: "I was charged twice for the same order",
    tag: null,
    a: [
      "Message us with a screenshot of both charges. If a duplicate payment reached us, we refund it in full straight away. If your bank has only placed a temporary hold, it will drop off on its own.",
    ],
    kw: "charged twice double payment duplicate",
    rv: null,
  },
  {
    id: "m-emi",
    for: "both",
    sec: "money",
    q: "I paid with EMI. How is it refunded?",
    tag: null,
    a: [
      "The refund goes back to your card, and your bank then closes or adjusts the EMI plan. Any interest, processing fee or no cost EMI benefit is handled by your bank under its own terms, so it is worth checking with them.",
    ],
    kw: "emi instalment installment no cost refund",
    rv: null,
  },
  {
    id: "m-promo",
    for: "both",
    sec: "money",
    q: "I used a promo code. What happens to it?",
    tag: null,
    a: [
      "You are refunded the amount you actually paid. If the code is still valid, we will reinstate it for you; codes that have expired cannot be brought back. Promo codes never apply to a security deposit.",
    ],
    kw: "promo code coupon discount voucher reinstated",
    rv: "Decide whether used promo codes are reinstated after a cancellation.",
  },
  {
    id: "m-delivery-fee",
    for: "both",
    sec: "money",
    q: "Are delivery charges refunded?",
    tag: null,
    a: [
      "Yes, whenever an order is cancelled before dispatch, and whenever we are the reason something went wrong. Once a piece has been delivered as ordered, delivery charges are not refunded.",
    ],
    kw: "delivery charges shipping fee refunded",
    rv: "Confirm the delivery charge refund rules.",
  },
  {
    id: "m-closed",
    for: "both",
    sec: "money",
    q: "My card has expired or my bank account is closed",
    tag: null,
    a: [
      "Banks usually pass the refund on to your new card or account automatically. If it comes back to us instead, we will contact you, verify your details and transfer it to a bank account in your name.",
    ],
    kw: "card expired account closed blocked refund bounced",
    rv: "Confirm the process for refunds that bounce back.",
  },
  {
    id: "m-payer",
    for: "both",
    sec: "money",
    q: "Someone else paid for my order. Where does the refund go?",
    tag: null,
    a: [
      "Refunds always return to the payment method used at checkout, so it goes back to whoever paid.",
    ],
    kw: "someone else paid gift refund to who",
    rv: null,
  },

  // Section 07: When it is on us (Rental + Shared)
  {
    id: "r-late-arrival",
    for: "rent",
    sec: "onus",
    q: "My rental did not arrive in time for my event",
    tag: { text: "Full refund", tone: "yes" },
    a: [
      "If your piece reaches you after your event because of us or our courier, you receive a full refund of your rental fee and delivery charges, and your deposit in full.",
      "If it arrives later than promised but still before your event, tell us and we will make it right.",
    ],
    kw: "late delivery did not arrive in time missed event delayed",
    rv: "Decide what “make it right” means when a rental arrives late but still before the event.",
  },
  {
    id: "r-hok-cancels",
    for: "rent",
    sec: "onus",
    q: "What if House of Kaira has to cancel my booking?",
    tag: { text: "Full refund", tone: "yes" },
    a: [
      "It is rare, but occasionally a piece becomes unavailable, for example if it is damaged before your dates. If that happens, we tell you immediately, refund you in full, automatically, and help you find something just as lovely for your event.",
    ],
    kw: "you cancelled my booking unavailable house of kaira cancels",
    rv: null,
  },
  {
    id: "m-lost-transit",
    for: "both",
    sec: "onus",
    q: "The courier lost my parcel",
    tag: { text: "Full refund", tone: "yes" },
    a: [
      "Pieces are insured while in transit, so you never pay for a parcel the courier loses. We refund you in full as soon as the courier confirms it is lost, and for a rental, we will try to find you another piece in time for your event.",
    ],
    kw: "courier lost parcel missing in transit never arrived",
    rv: null,
  },
  {
    id: "m-force",
    for: "both",
    sec: "onus",
    q: "What if a strike, flood or lockdown stops delivery?",
    tag: null,
    a: [
      "Sometimes events outside anyone's control stop couriers from moving. If that happens before your piece is dispatched, you can choose a full refund or, for a rental, a later date. If it happens in transit, we keep you updated and make sure you are not left out of pocket.",
    ],
    kw: "strike flood lockdown weather force majeure courier stopped",
    rv: "Confirm the position for disruptions outside our control, including pieces already in transit.",
  },

  // Section 08: Concerns & your rights (Shared)
  {
    id: "c-unhappy",
    for: "both",
    sec: "concerns",
    q: "I am not happy with how my case was handled",
    tag: null,
    a: [
      "Please tell us. Reply on WhatsApp or email hello@houseofkaira.com, and your case will be reviewed by a senior member of the team. We would always rather put things right than lose your trust.",
    ],
    tokens: ["support_email"],
    kw: "unhappy not happy escalate complaint handled badly",
    rv: "Name who handles escalations.",
  },
  {
    id: "c-chargeback",
    for: "both",
    sec: "concerns",
    q: "Should I raise a dispute with my bank?",
    tag: null,
    a: [
      "You are always free to, but please talk to us first. A bank dispute can freeze a refund we are already processing, and it often takes weeks longer. Most issues are settled with us within a day or two.",
    ],
    kw: "chargeback dispute bank raise complaint card",
    rv: null,
  },
  {
    id: "c-grievance",
    for: "both",
    sec: "concerns",
    q: "How do I raise a formal complaint?",
    tag: null,
    a: [
      "Write to our Grievance Officer, whose name and contact details are on our Contact page. We acknowledge every complaint within 48 hours and aim to resolve it within one month, keeping you updated throughout.",
    ],
    tokens: ["grievance_ack", "grievance_resolve"],
    kw: "formal complaint grievance officer legal",
    rv: "Appoint a Grievance Officer and publish their name, designation and contact details on the Contact page, as Indian e-commerce rules require. Confirm the 48 hour and one month timelines.",
  },
  {
    id: "c-rights",
    for: "both",
    sec: "concerns",
    q: "Does this policy affect my legal rights?",
    tag: null,
    a: [
      "No. This page explains how we handle cancellations and refunds, and nothing in it limits your rights under Indian consumer law. Where this page and our Terms & Conditions ever differ, the Terms apply.",
    ],
    kw: "legal rights consumer law terms",
    rv: null,
  },
  {
    id: "c-changes",
    for: "both",
    sec: "concerns",
    q: "What if this policy changes after I order?",
    tag: null,
    a: [
      "The policy in place when you placed your order is the one that applies to it. Updates only apply to orders placed after they are published, and the date this page was last reviewed is shown at the bottom.",
    ],
    kw: "policy changes updated which policy applies",
    rv: "Confirm updates apply only to orders placed after publication.",
  },

  /* ==========================================================================
     PRELOVED POLICY QUESTIONS (Appendix B - Preloved specific)
     ========================================================================== */

  // Section 01: Cancelling or changing an order
  {
    id: "p-how-cancel",
    for: "pre",
    sec: "cancel",
    q: "How do I cancel a preloved order?",
    tag: null,
    a: [
      "Go to **My Account**, open your order and choose **Cancel Order**, or message us on WhatsApp with your order number. Please be quick, as preloved pieces are dispatched within 2 business days of your order.",
    ],
    tokens: ["preloved_dispatch"],
    kw: "cancel how steps button account order",
    rv: "Confirm the cancel button label and flow for preloved orders.",
  },
  {
    id: "p-cancel-before",
    for: "pre",
    sec: "cancel",
    q: "Can I cancel before my piece is dispatched?",
    tag: { text: "Full refund", tone: "yes" },
    a: [
      "Yes, and you receive a full refund: the price, the GST on it, and any delivery charge you paid.",
    ],
    kw: "cancel before dispatch refund full",
    rv: "Confirm a full refund on preloved cancellations before dispatch. (Same open decision as the FAQ.)",
  },
  {
    id: "p-cancel-after",
    for: "pre",
    sec: "cancel",
    q: "Can I cancel after it has been dispatched?",
    tag: { text: "Final sale", tone: "no" },
    a: [
      "No. Once a preloved piece is on its way, the sale is final. Every piece is one of a kind, so once it leaves our hands we cannot take it back for a change of heart.",
      "You are still fully protected if something is wrong. See [Delivery & arrival](sec:arrival).",
    ],
    kw: "cancel after dispatch shipped final sale",
    rv: null,
  },
  {
    id: "p-cancel-one",
    for: "pre",
    sec: "cancel",
    q: "I bought more than one piece. Can I cancel just one?",
    tag: { text: "Before dispatch", tone: "yes" },
    a: [
      "Yes, as long as that piece has not been dispatched. Each piece is refunded on its own.",
    ],
    kw: "two pieces several cancel one item part order",
    rv: null,
  },
  {
    id: "p-offer",
    for: "pre",
    sec: "cancel",
    q: "My offer was accepted. Can I still change my mind?",
    tag: null,
    a: [
      "If you have not completed payment, you can simply choose not to go ahead; there is no obligation until you pay. If you have paid and the piece has not been dispatched, you can cancel for a full refund.",
    ],
    kw: "offer accepted change mind not pay",
    rv: null,
  },
  {
    id: "p-wrong-choice",
    for: "pre",
    sec: "cancel",
    q: "I ordered the wrong piece or size by mistake",
    tag: null,
    a: [
      "If it has not been dispatched, cancel it for a full refund and order the right one. We cannot swap it on your existing order, because every piece is unique and sold on its own. Once dispatched, the sale is final.",
    ],
    kw: "ordered wrong piece size mistake by accident",
    rv: null,
  },
  {
    id: "p-change-address",
    for: "pre",
    sec: "cancel",
    q: "Can I change the delivery address?",
    tag: null,
    a: [
      "Yes, as long as the piece has not been dispatched. Message us with your order number and the new address.",
    ],
    kw: "change address wrong address redirect",
    rv: null,
  },
  {
    id: "p-express",
    for: "pre",
    sec: "cancel",
    q: "I paid for express delivery. Can I get that back?",
    tag: null,
    a: [
      "If you cancel before dispatch, yes, along with everything else. And if we miss the express delivery time of 1 to 2 business days, we refund the express charge.",
    ],
    tokens: ["express_delivery"],
    kw: "express delivery fee refund faster",
    rv: "Confirm the express charge is refunded when the express timeline is missed.",
  },

  // Section 02: Delivery & arrival (Preloved specific)
  {
    id: "p-not-described",
    for: "pre",
    sec: "arrival",
    q: "It is not as described in the listing",
    tag: { text: "Tell us within 24 hours", tone: "mid" },
    a: [
      "Message us within 24 hours of delivery with photos that show the difference. We will look into it personally.",
      "If it is genuinely not as described, for example an undisclosed flaw, a clearly different colour, or a different size from the one listed, you can return it for a full refund. If you would rather keep it, we can offer a fair partial refund instead.",
      "Anything photographed and disclosed in the listing is part of the piece's condition. The condition notes and photographs are your reference.",
    ],
    tokens: ["issue_window"],
    kw: "not as described different flaw undisclosed wrong size",
    rv: "Decide the remedies for a valid “not as described” claim: a full refund on return, and whether a partial refund to keep the piece is offered.",
  },
  {
    id: "p-wrong-item",
    for: "pre",
    sec: "arrival",
    q: "I received the wrong piece",
    tag: { text: "We make it right", tone: "yes" },
    a: [
      "We are so sorry. Message us within 24 hours with a photo. We collect it at no cost, and send the right piece or refund you in full, whichever you prefer.",
    ],
    tokens: ["issue_window"],
    kw: "wrong item different piece sent",
    rv: null,
  },
  {
    id: "p-missing",
    for: "pre",
    sec: "arrival",
    q: "Something listed as included is missing",
    tag: { text: "Tell us within 24 hours", tone: "mid" },
    a: [
      "Check the product page for what is included, such as a dupatta or blouse. Original tags, boxes or certificates are only included when the listing says so.",
      "If a listed part is missing, message us within 24 hours of delivery. We send it to you if we have it; if we do not, you can choose a fair partial refund or return the piece for a full refund.",
    ],
    tokens: ["issue_window"],
    kw: "missing dupatta blouse part incomplete included",
    rv: "Decide the remedy when a listed part cannot be supplied.",
  },
  {
    id: "p-parcel-damaged",
    for: "pre",
    sec: "arrival",
    q: "The parcel arrived damaged or looks tampered with",
    tag: { text: "Tell us within 24 hours", tone: "mid" },
    a: [
      "Take photos of the packaging before you open it, and message us within 24 hours of delivery. A short video as you unpack it helps us settle things with the courier quickly.",
      "If the piece itself has been damaged in transit, that is on us. We arrange a free pickup and refund you in full once it is back with us.",
    ],
    tokens: ["issue_window"],
    kw: "parcel damaged box torn tampered opened transit",
    rv: "Confirm the remedy for preloved transit damage.",
  },
  {
    id: "p-authentic",
    for: "pre",
    sec: "arrival",
    q: "I am not sure the piece is authentic",
    tag: { text: "Full refund if not genuine", tone: "yes" },
    a: [
      "Every preloved piece carries the Authenticated by HOK mark once it passes our review, and we stand behind it. If you have any doubt, message us with your reasons and photos.",
      "If we cannot stand behind a piece's authenticity, you receive a full refund.",
    ],
    kw: "fake authentic genuine real replica copy doubt",
    rv: "Decide the authenticity guarantee: how long it lasts (for example 30 days from delivery) and whether an independent expert opinion is accepted as evidence.",
  },
  {
    id: "p-colour",
    for: "pre",
    sec: "arrival",
    q: "The colour looks different from the photos",
    tag: null,
    a: [
      "Colours can look slightly different from screen to screen, especially deep reds and pastels, and a small difference is not a fault.",
      "If the colour is clearly different from the photographs, message us within 24 hours and we will treat it as [not as described](q:p-not-described).",
    ],
    tokens: ["issue_window"],
    kw: "colour color looks different screen photos shade",
    rv: null,
  },
  {
    id: "p-fresh",
    for: "pre",
    sec: "arrival",
    q: "It does not feel fresh",
    tag: null,
    a: [
      "Every preloved piece is professionally cleaned before it leaves us, so this should never happen. Message us within 24 hours with a photo and we will make it right.",
    ],
    tokens: ["issue_window"],
    kw: "not fresh smell dirty clean hygiene",
    rv: "Decide the remedy: a professional clean at our cost, or a return.",
  },
  {
    id: "p-not-home",
    for: "pre",
    sec: "arrival",
    q: "What if I miss the delivery?",
    tag: null,
    a: [
      "The courier will try again and contact you. If the parcel comes back to us because it could not be delivered, we will reach out to arrange it again. If you would rather not, we refund the price less the delivery charges both ways.",
    ],
    kw: "missed delivery not home failed returned to sender",
    rv: "Confirm the refund when an undelivered preloved parcel comes back to us.",
  },
  {
    id: "p-refuse",
    for: "pre",
    sec: "arrival",
    q: "Can I refuse the parcel at the door?",
    tag: null,
    a: [
      "Please only refuse a parcel that looks damaged or tampered with, and message us straight away with a photo. If a parcel in good condition is refused, we refund the price less the delivery charges both ways once it is back with us.",
    ],
    kw: "refuse parcel reject delivery door",
    rv: "Confirm the position on refused preloved deliveries.",
  },
  {
    id: "p-late",
    for: "pre",
    sec: "arrival",
    q: "My order is taking longer than expected",
    tag: null,
    a: [
      "Track it from your confirmation or My Account first. If it has gone past the delivery time shown at checkout, message us and we will chase the courier. If it turns out to be lost, you are [refunded in full](q:m-lost-transit).",
    ],
    kw: "late delayed taking long where is my order",
    rv: null,
  },
  {
    id: "p-later-flaw",
    for: "pre",
    sec: "arrival",
    q: "I found a flaw after the 24 hours had passed",
    tag: null,
    a: [
      "Please still tell us. Claims are usually made within 24 hours of delivery so pieces can be checked exactly as they arrived. But if you find something serious that was not disclosed, and the piece has not been worn, washed or altered, we will look at it fairly.",
    ],
    tokens: ["issue_window"],
    kw: "found flaw later after 24 hours missed window",
    rv: "Decide how late claims for undisclosed flaws are handled.",
  },

  // Section 03: Once it is yours (Preloved)
  {
    id: "p-why-final",
    for: "pre",
    sec: "yours",
    q: "Why are preloved pieces a final sale?",
    tag: null,
    a: [
      "Because every piece is unique, returns are not possible in the way they might be with new clothing made in multiples. Instead, we make sure you know exactly what you are buying: every listing shows the actual garment measurements, honest photographs, the condition grade and detailed condition notes. And we are always happy to answer questions before you buy.",
    ],
    kw: "why final sale no returns",
    rv: null,
  },
  {
    id: "p-no-fit",
    for: "pre",
    sec: "yours",
    q: "It does not fit",
    tag: { text: "Final sale", tone: "no" },
    a: [
      "Preloved pieces cannot be returned for fit, which is exactly why we share full measurements and are always happy to check them with you before you buy.",
      "A good tailor can often adjust Indian occasionwear beautifully. And if it is not meant to be, you can [list it with us](list-your-piece) for its next chapter.",
    ],
    kw: "does not fit return exchange wrong size",
    rv: null,
  },
  {
    id: "p-changed-mind",
    for: "pre",
    sec: "yours",
    q: "I have changed my mind. Can I return it?",
    tag: { text: "Final sale", tone: "no" },
    a: [
      "Once dispatched, a preloved piece cannot be returned for a change of heart. If you would like it to find a new home, you can [list it with us](q:p-relist) to rent out or sell.",
    ],
    kw: "changed mind return do not like second thoughts",
    rv: null,
  },
  {
    id: "p-exchange",
    for: "pre",
    sec: "yours",
    q: "Can I exchange it for a different piece?",
    tag: { text: "No", tone: "no" },
    a: [
      "We do not offer exchanges on preloved pieces, because a like for like swap is not possible when every item is unique. You can list this piece with us and choose a new one.",
    ],
    kw: "exchange swap different piece",
    rv: null,
  },
  {
    id: "p-gift",
    for: "pre",
    sec: "yours",
    q: "It was a gift and it is not quite right",
    tag: null,
    a: [
      "Preloved pieces cannot be returned or exchanged once dispatched, gifts included. The good news is that the piece can begin its next chapter: the recipient can list it with us to rent out or sell.",
    ],
    kw: "gift present recipient did not like",
    rv: null,
  },
  {
    id: "p-price-drop",
    for: "pre",
    sec: "yours",
    q: "The price dropped after I bought it. Can I get the difference?",
    tag: { text: "No", tone: "no" },
    a: [
      "We are not able to adjust prices after purchase, including when a promotion starts later or a similar piece is listed for less. The price agreed at checkout is final.",
    ],
    kw: "price drop lower cheaper difference sale later",
    rv: null,
  },
  {
    id: "p-altered",
    for: "pre",
    sec: "yours",
    q: "I had it altered, washed or worn, and then noticed an issue",
    tag: null,
    a: [
      "Once a piece has been altered, washed or worn beyond a quick try on, we can no longer accept a claim for it, because we cannot tell how it was when it arrived. Please check everything carefully before you take it to your tailor.",
    ],
    kw: "altered washed worn tailored claim issue",
    rv: "Confirm claims are refused once a piece has been altered, washed or worn.",
  },
  {
    id: "p-tag",
    for: "pre",
    sec: "yours",
    q: "Should I keep the tag on?",
    tag: null,
    a: [
      "Yes, please keep the House of Kaira tag attached until you are happy. If a return is ever agreed, the piece needs to come back with it, just as it arrived.",
    ],
    kw: "tag keep label remove",
    rv: "Confirm preloved pieces ship with a removable House of Kaira tag.",
  },
  {
    id: "p-relist",
    for: "pre",
    sec: "yours",
    q: "Can I sell or rent it out through House of Kaira?",
    tag: null,
    a: [
      "Yes, whenever you are ready. Once it is yours, you can list it with us to rent out or sell. Many of our pieces have had beautiful second and third chapters this way.",
    ],
    kw: "resell sell again list rent out next chapter",
    rv: null,
  },

  // Section 04: How approved returns work (Preloved)
  {
    id: "p-claim-need",
    for: "pre",
    sec: "claims",
    q: "What do you need from me to make a claim?",
    tag: null,
    a: [
      "Your order number, clear photos of the issue taken in daylight, and a photo of the tag. For parcel damage, include photos of the outer packaging, and an unboxing video if you have one.",
    ],
    kw: "claim what do you need proof photos evidence",
    rv: null,
  },
  {
    id: "p-claim-reply",
    for: "pre",
    sec: "claims",
    q: "How quickly will you reply to my claim?",
    tag: null,
    a: [
      "We reply on WhatsApp within 2 hours, Seven days a week, 10 AM to 8 PM IST, and usually give you a decision within 2 business days.",
    ],
    tokens: ["support_sla", "support_days", "support_hours", "claim_decision"],
    kw: "claim reply how quickly decision time",
    rv: null,
  },
  {
    id: "p-claim-steps",
    for: "pre",
    sec: "claims",
    q: "What happens once a return is agreed?",
    tag: null,
    a: [
      "- We book a free pickup and confirm the slot on WhatsApp",
      "- You pack the piece as it arrived, with its tag and any included parts",
      "- We check it within 24 hours of it reaching us",
      "- Your refund is started straight away, and usually appears within 5 to 7 business days",
    ],
    tokens: ["inspect_within", "refund_timeline"],
    kw: "return process pickup steps approved",
    rv: "Confirm the pickup and inspection steps for approved preloved returns.",
  },
  {
    id: "p-claim-no",
    for: "pre",
    sec: "claims",
    q: "What if my claim is not accepted?",
    tag: null,
    a: [
      "We explain why, with reference to the listing, photographs and condition notes. If you disagree, you can ask for a second review by a senior member of the team. See [Concerns & your rights](sec:concerns).",
    ],
    kw: "claim rejected refused not accepted declined",
    rv: null,
  },
  {
    id: "p-claim-refund",
    for: "pre",
    sec: "claims",
    q: "Do I get my refund before I send the piece back?",
    tag: null,
    a: [
      "For an approved return, your refund starts as soon as the piece reaches us and has been checked. For a parcel lost by the courier, there is nothing to send back, and you are refunded as soon as the loss is confirmed.",
    ],
    kw: "refund before return send back first",
    rv: null,
  },

  // Section 05 (Preloved): Refunds & payments (p-gst specific)
  {
    id: "p-gst",
    for: "pre",
    sec: "money",
    q: "Is GST refunded too?",
    tag: { text: "Yes", tone: "yes" },
    a: [
      "Yes. The 5% GST you paid on your purchase is refunded along with the price, so you receive back the full amount you paid.",
      "If you asked for a GST invoice, we issue a credit note for the refunded amount.",
    ],
    tokens: ["gst_preloved"],
    kw: "gst tax refunded credit note invoice",
    rv: "Confirm credit notes are issued against GST invoices on every refund.",
  },

  // Section 06 (Preloved): When it is on us (p-hok-cancels specific)
  {
    id: "p-hok-cancels",
    for: "pre",
    sec: "onus",
    q: "What if House of Kaira has to cancel my order?",
    tag: { text: "Full refund", tone: "yes" },
    a: [
      "It is rare. Because every piece is one of a kind, two people can occasionally check out at the same moment, or a piece may not pass our final check before dispatch. If that happens, we tell you straight away and refund you in full, automatically, and we are glad to help you find something similar.",
    ],
    kw: "you cancelled my order sold out unavailable house of kaira cancels",
    rv: null,
  },
];

/**
 * Returns list of questions filtered for a specific policy tab ('rental' or 'preloved')
 */
export const getQuestionsForPolicy = (policyTab) => {
  const isRental = policyTab === "rental";
  return ALL_REFUND_QUESTIONS.filter((q) => {
    if (q.for === "both") return true;
    if (isRental) return q.for === "rent";
    return q.for === "pre";
  });
};

/**
 * Returns questions grouped by section for a specific policy tab
 */
export const getSectionsWithQuestions = (policyTab) => {
  const sections = POLICY_SECTIONS[policyTab] || [];
  const policyQuestions = getQuestionsForPolicy(policyTab);

  return sections.map((sec, index) => {
    const questions = policyQuestions.filter((q) => q.sec === sec.id);
    return {
      ...sec,
      number: String(index + 1).padStart(2, "0"),
      questions,
    };
  });
};

/**
 * Finds a question by ID across the entire registry
 */
export const findQuestionById = (id) => {
  return ALL_REFUND_QUESTIONS.find((q) => q.id === id);
};
