/**
 * House of Kaira - Terms & Conditions Complete Registry
 * Source of Truth from Build Specification v3.0 (hok_terms_v4)
 * Contains 12 Parts, 59 Clauses, 218 Sub-clauses, 12 Definitions, 8 Essentials
 */

export const OPENING_PARAGRAPH = "These Terms are the agreement between you and House of Kaira. We have written them to be read, in plain words, with every clause numbered so it is easy to find and share. They protect every piece, everyone who wears one, and every Lister who trusts us with theirs.";

export const THE_ESSENTIALS = [
  {
    "summary": "Your agreement is with House of Kaira, while each piece belongs to its Lister until it is sold",
    "clauseNumber": 12,
    "clauseTitle": "How House of Kaira works",
    "anchor": "#c-roles"
  },
  {
    "summary": "A rental piece is your responsibility from delivery until our courier collects it",
    "clauseNumber": 23,
    "clauseTitle": "Responsibility for the piece while it is with you",
    "anchor": "#c-risk"
  },
  {
    "summary": "Your deposit is fully refundable after inspection, and is security rather than a limit",
    "clauseNumber": 20,
    "clauseTitle": "Your security deposit",
    "anchor": "#c-deposit"
  },
  {
    "summary": "A late return costs one day’s rental rate for each extra day",
    "clauseNumber": 26,
    "clauseTitle": "Late returns",
    "anchor": "#c-late"
  },
  {
    "summary": "Preloved pieces are a final sale once dispatched, and you are protected if one is not as described",
    "clauseNumber": 32,
    "clauseTitle": "If a preloved piece is not as described",
    "anchor": "#c-pre-issue"
  },
  {
    "summary": "Every designer piece is reviewed, and refunded in full if it is ever shown not to be genuine",
    "clauseNumber": 13,
    "clauseTitle": "Our authenticity promise",
    "anchor": "#c-authentic"
  },
  {
    "summary": "Listers promise every piece is theirs, genuine and honestly described",
    "clauseNumber": 34,
    "clauseTitle": "What you promise us",
    "anchor": "#c-lister-promise"
  },
  {
    "summary": "If we have to cancel, you never pay for it",
    "clauseNumber": 43,
    "clauseTitle": "If we have to cancel",
    "anchor": "#c-we-cancel"
  }
];

export const WHERE_TO_START_CARDS = [
  {
    "tag": "For every rental",
    "title": "Renting a piece",
    "startClause": 18,
    "endClause": 28,
    "anchor": "#p-renting"
  },
  {
    "tag": "For every preloved piece",
    "title": "Buying preloved",
    "startClause": 29,
    "endClause": 32,
    "anchor": "#p-preloved"
  },
  {
    "tag": "For every piece you list",
    "title": "Listing a piece",
    "startClause": 33,
    "endClause": 38,
    "anchor": "#p-listing"
  }
];

export const DEFINITIONS = [
  {
    "term": "Booking",
    "meaning": "A confirmed rental of a rental piece for a Rental Period.",
    "anchor": "#d-booking"
  },
  {
    "term": "Deposit",
    "meaning": "The refundable security deposit for a rental piece, explained in clause 20.",
    "anchor": "#d-deposit"
  },
  {
    "term": "Lister",
    "meaning": "A person or business who lists a piece with us.",
    "anchor": "#d-lister"
  },
  {
    "term": "Listing",
    "meaning": "The page on the Platform that describes a piece, including its photographs, condition grade, condition notes, measurements and what is included.",
    "anchor": "#d-listing"
  },
  {
    "term": "Listing Terms",
    "meaning": "The commercial terms for a listed piece that we confirm to its Lister in writing when we accept it, as clause 33 explains.",
    "anchor": "#d-listing-terms"
  },
  {
    "term": "Order",
    "meaning": "A confirmed purchase of a preloved piece.",
    "anchor": "#d-order"
  },
  {
    "term": "Piece",
    "meaning": "Any garment, set or item offered on the Platform, including everything its listing says is included. A rental piece is offered for rent, and a preloved piece is offered for sale after being owned, and possibly worn, before.",
    "anchor": "#d-piece"
  },
  {
    "term": "Platform",
    "meaning": "Our website, any app we offer, and our services on WhatsApp, Instagram, by phone and by email.",
    "anchor": "#d-platform"
  },
  {
    "term": "Policies",
    "meaning": "The policies listed in clause 5.",
    "anchor": "#d-policies"
  },
  {
    "term": "Rental Period",
    "meaning": "The period that starts on the day a rental piece is delivered and ends on its Return Date.",
    "anchor": "#d-rental-period"
  },
  {
    "term": "Replacement Value",
    "meaning": "The value of a rental piece shown in your booking confirmation, explained in clause 27.5.",
    "anchor": "#d-replacement-value"
  },
  {
    "term": "Return Date",
    "meaning": "The date by which a rental piece must be handed back for its return, shown before you pay and in your confirmation.",
    "anchor": "#d-return-date"
  }
];

export const RELATED_POLICIES = [
  {
    "name": "Refund & Cancellation Policy",
    "path": "/refunds"
  },
  {
    "name": "Deposit Policy",
    "path": "#p-policies"
  },
  {
    "name": "Care, Cleaning & Damage Policy",
    "path": "#p-policies"
  },
  {
    "name": "Shipping & Delivery Policy",
    "path": "#p-policies"
  },
  {
    "name": "Privacy Policy",
    "path": "/privacy-policy"
  },
  {
    "name": "Cookie Policy",
    "path": "#p-policies"
  },
  {
    "name": "Help & FAQs",
    "path": "/faqs"
  }
];

export const TERMS_PARTS = [
  {
    "partNumber": 1,
    "title": "About these terms",
    "italicWord": "terms",
    "barLabel": "About",
    "anchor": "#p-about",
    "description": "Who we are, what this agreement covers, and how it works with our policies.",
    "startClause": 1,
    "endClause": 6,
    "clauses": [
      {
        "number": 1,
        "title": "Who we are",
        "anchor": "#c-who",
        "keywords": "company legal name address gstin cin operator contact who runs",
        "subclauses": [
          {
            "number": "1.1",
            "text": "House of Kaira is a curated home for designer Indian occasionwear, where you can rent a piece for \na celebration, buy a preloved piece to keep, or list a piece of your own. It is operated by [Registered \nlegal name], [its constitution, for example a private limited company incorporated under the \nCompanies Act, 2013], with its registered office at [Registered office address], Indore, Madhya \nPradesh (CIN [CIN], GSTIN [GSTIN]).",
            "hasList": false
          },
          {
            "number": "1.2",
            "text": "In these Terms, “House of Kaira”, “HOK”, “we”, “us” and “our” mean [Registered legal name]. “You” \nand “your” mean the person using the Platform and, where you act for a business such as a boutique \nthat lists with us, that business too.",
            "hasList": false
          },
          {
            "number": "1.3",
            "text": "You can reach us on WhatsApp at +91 93401 39300 (Seven days a week, 10 AM to 8 PM IST), by \nemail at hello@houseofkaira.com, or through our Grievance Officer, whose details are in clause 53.",
            "hasList": false
          }
        ]
      },
      {
        "number": 2,
        "title": "What these Terms cover",
        "anchor": "#c-scope",
        "keywords": "website app whatsapp instagram phone orders scope new services buy new",
        "subclauses": [
          {
            "number": "2.1",
            "text": "These Terms govern your use of our website at www.houseofkaira.com, any app we offer, and our \nservices on WhatsApp, Instagram, by phone and by email, which together we call the Platform. They \napply to every rental, purchase, offer and listing you make with us, however you make it.",
            "hasList": false
          },
          {
            "number": "2.2",
            "text": "Some Parts apply only to renting, buying preloved or listing a piece, and their titles make this clear. \nEverything else applies to everyone.",
            "hasList": false
          },
          {
            "number": "2.3",
            "text": "When we introduce a new service, for example selling new pieces directly from designers, we will \npublish the terms for it before it opens, and you will see them before you use it.",
            "hasList": false
          },
          {
            "number": "2.4",
            "text": "These Terms are an electronic record under the Information Technology Act, 2000 and the rules \nmade under it. They are generated by a computer system and need no physical or digital signature, \nand we publish them as rule 3(1) of the Information Technology (Intermediary Guidelines and Digital \nMedia Ethics Code) Rules, 2021 requires.",
            "hasList": false
          }
        ]
      },
      {
        "number": 3,
        "title": "How you accept these Terms",
        "anchor": "#c-accept",
        "keywords": "agree accept tick checkbox consent contract whatsapp order confirmation binding",
        "subclauses": [
          {
            "number": "3.1",
            "text": "You accept these Terms when you create an account, place an order or booking, make an offer, \nsubmit a piece to list, or otherwise use the Platform. Where we ask you to tick a box or press a \nbutton to confirm, doing so is your agreement. We never record your agreement with a box that has \nbeen ticked for you.",
            "hasList": false
          },
          {
            "number": "3.2",
            "text": "If you order through our team on WhatsApp, Instagram, by phone or by email, your confirmation will \ninclude a link to these Terms, and confirming or paying for that order is your acceptance of them.",
            "hasList": false
          },
          {
            "number": "3.3",
            "text": "An agreement made electronically in this way is valid and enforceable, as section 10A of the \nInformation Technology Act, 2000 provides.",
            "hasList": false
          },
          {
            "number": "3.4",
            "text": "If you do not agree with these Terms, please do not use the Platform.",
            "hasList": false
          }
        ]
      },
      {
        "number": 4,
        "title": "Words with a special meaning",
        "anchor": "#c-defs",
        "keywords": "definitions meaning glossary replacement value rental period return date lister listing",
        "subclauses": [
          {
            "number": "4.1",
            "text": "Words in these Terms have their everyday meaning, except these, which apply whether or not they begin with a capital letter:",
            "hasList": false
          },
          {
            "number": "4.2",
            "text": "Words such as “including” and “for example” introduce examples, not a complete list, and the \nsingular includes the plural.",
            "hasList": false
          }
        ],
        "definitions": [
          {
            "term": "Booking",
            "meaning": "A confirmed rental of a rental piece for a Rental Period.",
            "anchor": "#d-booking"
          },
          {
            "term": "Deposit",
            "meaning": "The refundable security deposit for a rental piece, explained in clause 20.",
            "anchor": "#d-deposit"
          },
          {
            "term": "Lister",
            "meaning": "A person or business who lists a piece with us.",
            "anchor": "#d-lister"
          },
          {
            "term": "Listing",
            "meaning": "The page on the Platform that describes a piece, including its photographs, condition grade, condition notes, measurements and what is included.",
            "anchor": "#d-listing"
          },
          {
            "term": "Listing Terms",
            "meaning": "The commercial terms for a listed piece that we confirm to its Lister in writing when we accept it, as clause 33 explains.",
            "anchor": "#d-listing-terms"
          },
          {
            "term": "Order",
            "meaning": "A confirmed purchase of a preloved piece.",
            "anchor": "#d-order"
          },
          {
            "term": "Piece",
            "meaning": "Any garment, set or item offered on the Platform, including everything its listing says is included. A rental piece is offered for rent, and a preloved piece is offered for sale after being owned, and possibly worn, before.",
            "anchor": "#d-piece"
          },
          {
            "term": "Platform",
            "meaning": "Our website, any app we offer, and our services on WhatsApp, Instagram, by phone and by email.",
            "anchor": "#d-platform"
          },
          {
            "term": "Policies",
            "meaning": "The policies listed in clause 5.",
            "anchor": "#d-policies"
          },
          {
            "term": "Rental Period",
            "meaning": "The period that starts on the day a rental piece is delivered and ends on its Return Date.",
            "anchor": "#d-rental-period"
          },
          {
            "term": "Replacement Value",
            "meaning": "The value of a rental piece shown in your booking confirmation, explained in clause 27.5.",
            "anchor": "#d-replacement-value"
          },
          {
            "term": "Return Date",
            "meaning": "The date by which a rental piece must be handed back for its return, shown before you pay and in your confirmation.",
            "anchor": "#d-return-date"
          }
        ]
      },
      {
        "number": 5,
        "title": "Our Policies, and which applies first",
        "anchor": "#c-policies",
        "keywords": "policies refund deposit care shipping privacy cookie faq precedence conflict differ",
        "subclauses": [
          {
            "number": "5.1",
            "text": "These Terms work together with our Policies, each of which forms part of your agreement with us:  \n(a) our Refund & Cancellation Policy, covering cancelling, changing and returning, and how refunds \nwork; \n(b) our Deposit Policy, covering how security deposits are collected, held and refunded;  \n(c) our Care, Cleaning & Damage Policy, covering caring for a rental piece, what counts as normal \nwear, and how damage is assessed; \n(d) our Shipping & Delivery Policy, covering where and how we deliver and collect; \n(e) our Privacy Policy and Cookie Policy, covering how we handle your personal data; and \n(f) the details on each piece’s listing, such as its condition, measurements, what is included, its \nrental windows and its deposit.",
            "hasList": true
          },
          {
            "number": "5.2",
            "text": "If they ever differ, what we have specifically agreed with you in writing for a booking or order applies \nfirst, then these Terms, then the Policies, then the listing. Where a Policy or a listing gives you a \nbetter position than these Terms, that better position applies.",
            "hasList": false
          },
          {
            "number": "5.3",
            "text": "Our Help & FAQs and other guides explain all of this in simpler words. They are there to help, but \nthey are not part of the agreement.",
            "hasList": false
          }
        ]
      },
      {
        "number": 6,
        "title": "When these Terms change",
        "anchor": "#c-changes",
        "keywords": "update change version notice previous old terms apply which version",
        "subclauses": [
          {
            "number": "6.1",
            "text": "We may update these Terms to reflect changes in the law, in our services or in how we work. The \nversion and date of the latest Terms are shown at the top of this page.",
            "hasList": false
          },
          {
            "number": "6.2",
            "text": "When a change matters to you, we will tell you before it takes effect, by email, WhatsApp or a notice \non the Platform.",
            "hasList": false
          },
          {
            "number": "6.3",
            "text": "A change never applies to a booking, order or listing already confirmed. Each is governed by the \nTerms in force when it was confirmed.",
            "hasList": false
          },
          {
            "number": "6.4",
            "text": "If you keep using the Platform after a change takes effect, the updated Terms apply to what you do \nfrom then on. If you do not agree with a change, you can stop using the Platform and close your \naccount at any time.",
            "hasList": false
          },
          {
            "number": "6.5",
            "text": "We keep every earlier version of these Terms, and we will send you the version that applied to your \nbooking, order or listing if you ask.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 2,
    "title": "Using House of Kaira",
    "italicWord": "Kaira",
    "barLabel": "Using HOK",
    "anchor": "#p-using",
    "description": "Who can use the Platform, your account, and what we ask of everyone.",
    "startClause": 7,
    "endClause": 11,
    "clauses": [
      {
        "number": 7,
        "title": "Who can use House of Kaira",
        "anchor": "#c-eligibility",
        "keywords": "age minor adult eligible india who can use guardian parent under",
        "subclauses": [
          {
            "number": "7.1",
            "text": "To create an account, place an order or booking, make an offer or list a piece, you must be at least \n18 years old and able to enter into a binding contract under the Indian Contract Act, 1872.",
            "hasList": false
          },
          {
            "number": "7.2",
            "text": "If you are under 18 years, a parent or guardian may rent or buy on your behalf. They are then our \ncustomer, and these Terms, including responsibility for any rental piece you wear, apply to them.",
            "hasList": false
          },
          {
            "number": "7.3",
            "text": "We deliver and collect only within India, so every delivery address must be in India and in an area \nwe serve. Listers must be based in India.",
            "hasList": false
          },
          {
            "number": "7.4",
            "text": "You may not use the Platform if we have closed an account of yours for a breach of these Terms, \nunless we agree in writing.",
            "hasList": false
          }
        ]
      },
      {
        "number": 8,
        "title": "Your account",
        "anchor": "#c-account",
        "keywords": "account sign in login otp one time code google email password delete close",
        "subclauses": [
          {
            "number": "8.1",
            "text": "You can browse and save pieces without an account. To check out, make an offer or list a piece, you \nsign in with your mobile number and a one-time code, your email, or Google.",
            "hasList": false
          },
          {
            "number": "8.2",
            "text": "Please give us accurate and complete details and keep them up to date. Your mobile number should \nbe one we can reach on WhatsApp, because that is how we arrange deliveries, deposits and \nreturns.",
            "hasList": false
          },
          {
            "number": "8.3",
            "text": "Your account is personal to you. Keep your one-time codes and password private, and do not let \nanyone else use your account. You are responsible for what is done through it, unless it was done \nby someone who got access through no fault of yours. Tell us straight away if you think someone \nelse has used it.",
            "hasList": false
          },
          {
            "number": "8.4",
            "text": "Please keep to one account each. We may combine or close duplicate accounts.",
            "hasList": false
          },
          {
            "number": "8.5",
            "text": "You can delete your account from My Account at any time. If a rental is in progress, a deposit is \nwaiting to be refunded, a payout is due or an amount is owed, we settle that first. We keep the \nrecords the law requires us to keep, such as tax invoices, for as long as it requires, as our Privacy \nPolicy explains.",
            "hasList": false
          }
        ]
      },
      {
        "number": 9,
        "title": "Confirming who you are",
        "anchor": "#c-verify",
        "keywords": "identity id proof verification kyc aadhaar pan verify fraud check",
        "subclauses": [
          {
            "number": "9.1",
            "text": "To protect every piece and everyone who wears one, we may ask you to confirm your identity before \nwe confirm or dispatch a rental, accept an offer, or make a payout. We may ask for a government -\nissued photo ID, confirmation of your address, or a short call with our team.",
            "hasList": false
          },
          {
            "number": "9.2",
            "text": "We only ask for what we need for this purpose. We will never ask for your full Aadhaar number; if \nyou use Aadhaar, please share a masked copy.",
            "hasList": false
          },
          {
            "number": "9.3",
            "text": "If we cannot reasonably confirm who you are, we may decline or cancel the booking or order, and \nyou receive a full refund of anything you have paid.",
            "hasList": false
          }
        ]
      },
      {
        "number": 10,
        "title": "What we ask of everyone",
        "anchor": "#c-conduct",
        "keywords": "rules prohibited misuse fraud scraping reviews abuse harassment content",
        "subclauses": [
          {
            "number": "10.1",
            "text": "Please use the Platform lawfully, honestly and kindly. In particular, you agree not to:  \n(a) give false information, pretend to be someone else, or use a payment method without its \nowner’s permission; \n(b) book dates or make offers you do not intend to honour, or hold pieces back from others by any \nother means; \n(c) arrange to rent or buy a piece you found on House of Kaira directly from its Lister, or otherwise \naway from the Platform; \n(d) copy, scrape or reuse our listings, photographs, prices or other content, including with \nautomated tools, except as these Terms allow; \n(e) interfere with the Platform’s security or operation, or upload anything harmful, such as a virus;  \n(f) raise a payment dispute or chargeback dishonestly, for example for a rental you received and \nwore; \n(g) post fake, paid or misleading reviews, or reviews of pieces you did not rent or buy; or  \n(h) harass, abuse or threaten our team, our Listers or other customers.",
            "hasList": true
          },
          {
            "number": "10.2",
            "text": "You also agree not to upload, share or send through the Platform anything that:  \n(a) belongs to someone else and that you have no right to share; \n(b) is obscene, pornographic, paedophilic, invasive of another person’s privacy including bodily \nprivacy, insulting or harassing on the basis of gender, racially or ethnically objectionable, \n\n \n \nrelating to or encouraging money laundering or gambling, or promoting enmity between groups \non the grounds of religion or caste with the intent to incite violence; \n(c) is harmful to a child; \n(d) infringes any patent, trade mark, copyright or other proprietary right; \n(e) deceives or misleads anyone about where it came from, or knowingly and intentionally \ncommunicates misinformation or information that is patently false and untrue or misleading;  \n(f) impersonates another person; \n(g) threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with \nother countries or public order, incites the commission of any cognisable offence, prevents the \ninvestigation of any offence, or insults any other nation; \n(h) contains a software virus or any other code designed to interrupt, destroy or limit the functioning \nof any computer resource; \n(i) has been created or altered, including with artificial intelligence, to misrepresent a real person, \nevent or piece; or \n(j) breaks any law for the time being in force.",
            "hasList": true
          },
          {
            "number": "10.3",
            "text": "If you break this clause, we may remove the content, suspend or close your account and cancel \nopen orders, as clause 56 explains. Breaking the law through the Platform may also make you liable \nto penalties or punishment under the Information Technology Act, 2000 and other laws, and where \nthe law requires it, we report offences to the authorities.",
            "hasList": false
          }
        ]
      },
      {
        "number": 11,
        "title": "How we keep in touch",
        "anchor": "#c-comms",
        "keywords": "whatsapp sms email calls messages marketing unsubscribe fraud scam official",
        "subclauses": [
          {
            "number": "11.1",
            "text": "We send messages about your bookings, orders, deposits, returns, offers, listings and payouts by \nWhatsApp, SMS, email or phone. They are part of how we look after what you have asked for, so \nthey continue while you have anything open with us.",
            "hasList": false
          },
          {
            "number": "11.2",
            "text": "We send marketing, such as new arrivals and offers, only if you have chosen to receive it, and you \ncan stop it at any time from your notification settings or by replying to any message.",
            "hasList": false
          },
          {
            "number": "11.3",
            "text": "Instructions and confirmations you send us from the phone number or email address on your \naccount, for example agreeing new dates or accepting a deduction, are treated as coming from you.",
            "hasList": false
          },
          {
            "number": "11.4",
            "text": "We only contact you from the numbers, email addresses and accounts listed on our Contact page, \nand we will never ask for your card details, UPI PIN or one-time codes. If anyone claiming to be us \nasks for these, or asks you to pay into an account that is not ours, please do not pay, and tell us \nstraight away. We are not responsible for a payment made to someone else, unless it happened \nbecause we failed to keep your information safe.",
            "hasList": false
          },
          {
            "number": "11.5",
            "text": "If we record a call, to keep an accurate note of what was agreed, we will tell you at the start of it.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 3,
    "title": "Pieces, listings & prices",
    "italicWord": "prices",
    "barLabel": "Pieces & prices",
    "anchor": "#p-pieces",
    "description": "Where our pieces come from, what we promise about them, and how we price and present them.",
    "startClause": 12,
    "endClause": 17,
    "clauses": [
      {
        "number": 12,
        "title": "How House of Kaira works",
        "anchor": "#c-roles",
        "keywords": "lister owner seller who contract responsible agent consignment invoice ownership",
        "subclauses": [
          {
            "number": "12.1",
            "text": "The pieces on House of Kaira come from the wardrobes of people across India and from designer \nboutiques who list with us, whom we call Listers. A Lister owns their piece until it is sold. \nOccasionally a piece belongs to House of Kaira itself, and these Terms apply to it in exactly the \nsame way.",
            "hasList": false
          },
          {
            "number": "12.2",
            "text": "We review, grade, photograph and look after every piece, and we rent and sell pieces on behalf of \ntheir Listers. When you rent or buy, we do so in our own name: your contract is with us, we take your \npayment, we issue your invoice, and we are responsible to you for your booking or order under these \nTerms. You never have to deal with a Lister.",
            "hasList": false
          },
          {
            "number": "12.3",
            "text": "When you rent a piece, ownership stays with its Lister throughout, and you have the right to use the \npiece for your Rental Period on these Terms. When you buy a preloved piece, ownership passes to \nyou as clause 31 explains.",
            "hasList": false
          }
        ]
      },
      {
        "number": 13,
        "title": "Our authenticity promise",
        "anchor": "#c-authentic",
        "keywords": "authentic genuine fake replica copy counterfeit authenticated by hok designer",
        "subclauses": [
          {
            "number": "13.1",
            "text": "Every piece is reviewed by our team before it goes live. We examine its craftsmanship, construction, \nmaterials and labels, and where they exist, we ask for provenance such as the original bill, care \nlabels or a designer certificate.",
            "hasList": false
          },
          {
            "number": "13.2",
            "text": "When a piece is listed under a designer’s name, or carries the Authenticated by HOK mark, we \nstand behind it as a genuine piece by that designer.",
            "hasList": false
          },
          {
            "number": "13.3",
            "text": "If it is ever shown that a piece is not what we said it was, you are entitled to a full refund. For a \npurchase, that is everything you paid for it, including GST and delivery, once the piece is returned to \nus in the condition it reached you, apart from normal wear. For a rental, it is your rental fee and \ndelivery charges, and your deposit in full.",
            "hasList": false
          },
          {
            "number": "13.4",
            "text": "To raise a concern, send us your reasons and photographs. We review every concern, and we \naccept a written opinion from the designer’s house or a recognised independent authenticator as \nevidence. This promise has no time limit.",
            "hasList": false
          },
          {
            "number": "13.5",
            "text": "Designer names are used only to describe pieces accurately. Unless we clearly say a designer is \none of our partners, House of Kaira is independent of, and not endorsed by, any designer whose \npieces appear on the Platform, and their names and trade marks belong to them.",
            "hasList": false
          }
        ]
      },
      {
        "number": 14,
        "title": "Condition, measurements and what is included",
        "anchor": "#c-condition",
        "keywords": "condition grade pristine excellent good fair wear flaw measurements size colour",
        "subclauses": [
          {
            "number": "14.1",
            "text": "Every listing shows the piece’s condition grade, written condition notes, actual garment \nmeasurements and what is included. We grade every piece in the same way:  \n(a) Pristine: unworn, or worn once for a short photoshoot, with no visible wear; tags may still be \nattached; \n(b) Excellent: worn once for a full-day event and professionally cleaned, with no visible damage, \nalteration or significant bead loss; any minor imperfection is disclosed and photographed;  \n(c) Good: worn two or three times, with any minor imperfection clearly photographed and \ndisclosed; and \n(d) Fair: showing visible signs of wear, which are photographed and described in the listing; offered \nfor rent only.",
            "hasList": true
          },
          {
            "number": "14.2",
            "text": "Rental pieces are graded again after every return, so the grade you see is current. Past alterations \nare disclosed in the condition notes: what was changed and, where we know, by whom.",
            "hasList": false
          },
          {
            "number": "14.3",
            "text": "The listing is always your reference. Anything photographed or written in the condition notes is part \nof the piece’s condition, not a fault.",
            "hasList": false
          },
          {
            "number": "14.4",
            "text": "Occasionwear is often made by hand, so small irregularities in embroidery, embellishment, weave or \ndye are part of its character, not faults. Colours can look slightly different from one screen to another, \nespecially deep reds and pastels. A difference clearly greater than this means the piece is not as \ndescribed.",
            "hasList": false
          },
          {
            "number": "14.5",
            "text": "Measurements are taken by our team from the actual piece, allowing for the small variation of \nmeasuring by hand. The height a piece suits best is given as a guide.",
            "hasList": false
          },
          {
            "number": "14.6",
            "text": "Only what the listing says is included comes with the piece. Jewellery, footwear, accessories, \noriginal tags, boxes and certificates are included only when the listing says so.",
            "hasList": false
          }
        ]
      },
      {
        "number": 15,
        "title": "Photographs and styled images",
        "anchor": "#c-imagery",
        "keywords": "photos images pictures ai artificial intelligence editorial styled render real actual",
        "subclauses": [
          {
            "number": "15.1",
            "text": "The photographs of a piece in its listing show that actual piece, and every imperfection we know of is \nphotographed and written into the listing.",
            "hasList": false
          },
          {
            "number": "15.2",
            "text": "Listings and other pages may also show styled or editorial images, including images created or \nenhanced with digital tools such as artificial intelligence, to suggest how a piece might be worn. \nEvery such image is labelled, is for illustration only, and is never the reference for a piece’s \ncondition, colour or fit. Jewellery, props and styling in any image are not included unless the listing \nsays so.",
            "hasList": false
          },
          {
            "number": "15.3",
            "text": "If you would like to see a detail more closely, ask us, and we will share further photographs of the \nactual piece.",
            "hasList": false
          }
        ]
      },
      {
        "number": 16,
        "title": "Prices, taxes and promo codes",
        "anchor": "#c-prices",
        "keywords": "price gst tax total charges hidden retail original discount reduction promo code",
        "subclauses": [
          {
            "number": "16.1",
            "text": "Prices are in Indian rupees. Rental fees and preloved prices are shown before GST, which is added \nat checkout at 18% on rentals and 5% on preloved pieces, and charged as the law requires for the \nplace of delivery. Before you pay, you see the full amount payable, including GST and any delivery \ncharge, and the deposit for a rental. Nothing is added afterwards.",
            "hasList": false
          },
          {
            "number": "16.2",
            "text": "Rental prices are fixed. Offers can be made only on preloved pieces, as clause 30 explains.",
            "hasList": false
          },
          {
            "number": "16.3",
            "text": "Where a listing shows a piece’s original retail price, it comes from the Lister’s records, such as the \noriginal bill, and is shown for reference only. It is not a price at which we have offered the piece.",
            "hasList": false
          },
          {
            "number": "16.4",
            "text": "If we reduce the price of a piece, we show its earlier price beside the new one, and the earlier price \nis the lowest price at which we offered that piece in the 30 days before the reduction.",
            "hasList": false
          },
          {
            "number": "16.5",
            "text": "A change in price never affects a booking or order already confirmed, and we cannot adjust the price \nof a piece after you have bought it.",
            "hasList": false
          },
          {
            "number": "16.6",
            "text": "If a price or another important detail is shown wrongly because of an obvious error, for example a \nmissing digit, we may cancel the booking or order before dispatch, tell you straight away, and refund \nyou in full. Such a cancellation is covered by clause 43.",
            "hasList": false
          },
          {
            "number": "16.7",
            "text": "Promo codes apply to rental fees and prices, never to a deposit. Each code has its own terms and \nexpiry, shown with it; it has no cash value, cannot be combined with another code unless its terms \nsay so, and may be withdrawn if it is misused.",
            "hasList": false
          }
        ]
      },
      {
        "number": 17,
        "title": "How pieces are ordered",
        "anchor": "#c-ranking",
        "keywords": "sort order ranking recommended search results sponsored featured paid",
        "subclauses": [
          {
            "number": "17.1",
            "text": "When you browse, you can choose to see pieces by price, by how recently they were listed, by \npopularity, by condition, or, for rentals, by how soon they are free.",
            "hasList": false
          },
          {
            "number": "17.2",
            "text": "If you do not choose, pieces appear in our Recommended order. Its main factors, from the most to \nthe least important, are: \n(a) whether a piece is available in your size and for your dates, where you have told us these;  \n(b) how closely it matches your search and filters; \n(c) our team’s curation, including new arrivals and seasonal edits; \n(d) how recently it was listed; and \n(e) how often it is saved, rented or bought.",
            "hasList": true
          },
          {
            "number": "17.3",
            "text": "No Lister or designer can pay to have a piece shown higher. If a piece is ever shown because \nsomeone has paid for it, it will be clearly labelled as sponsored.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 4,
    "title": "Renting a piece",
    "italicWord": "piece",
    "barLabel": "Renting",
    "anchor": "#p-renting",
    "description": "For every rental: booking, your deposit, caring for the piece, and returning it.",
    "startClause": 18,
    "endClause": 28,
    "clauses": [
      {
        "number": 18,
        "title": "Booking a rental",
        "anchor": "#c-booking",
        "keywords": "book booking confirm dates calendar hold reserve wishlist bag someone else",
        "subclauses": [
          {
            "number": "18.1",
            "text": "You choose a piece, its size and your dates on its availability calendar. The dates shown as \navailable are those we can still deliver for, based on where you are.",
            "hasList": false
          },
          {
            "number": "18.2",
            "text": "Your booking is confirmed once you have paid the rental fee, GST and any delivery charge and we \nhave sent your confirmation. From then, your dates are held for you alone. Saving a piece to your \nwishlist or adding it to your bag does not hold it.",
            "hasList": false
          },
          {
            "number": "18.3",
            "text": "Each piece is its own booking, with its own dates, even when you book several together.",
            "hasList": false
          },
          {
            "number": "18.4",
            "text": "Very rarely, two people pay for the same piece and dates at the same moment. The booking we \nreceived first stands, and the other is cancelled and refunded under clause 43.",
            "hasList": false
          },
          {
            "number": "18.5",
            "text": "You may book for someone else, for example your mother or a friend, and have the piece sent to \ntheir address. The booking and the deposit stay in your name, and you remain responsible for the \npiece under these Terms while it is with them.",
            "hasList": false
          }
        ]
      },
      {
        "number": 19,
        "title": "Your Rental Period",
        "anchor": "#c-period",
        "keywords": "window days standard extended start end return date extend extension early",
        "subclauses": [
          {
            "number": "19.1",
            "text": "Each piece offers a standard rental window, usually 4 days, and often an extended window, usually \n7 days. Its listing shows the windows and the price of each.",
            "hasList": false
          },
          {
            "number": "19.2",
            "text": "Your Rental Period starts on the day your piece is delivered, which is 2 days before your event, and \nends on your Return Date. Both dates are shown before you pay and in your confirmation.",
            "hasList": false
          },
          {
            "number": "19.3",
            "text": "You may wear the piece as often as you like during your Rental Period.",
            "hasList": false
          },
          {
            "number": "19.4",
            "text": "Changing your dates, swapping to another piece, moving to a shorter window, or extending your \nrental is handled as the Refund & Cancellation Policy explains. Extra days are charged at the piece’s \ndaily rate.",
            "hasList": false
          },
          {
            "number": "19.5",
            "text": "Returning a piece early does not reduce the rental fee.",
            "hasList": false
          }
        ]
      },
      {
        "number": 20,
        "title": "Your security deposit",
        "anchor": "#c-deposit",
        "keywords": "deposit security refundable amount upi bank transfer whatsapp deduction refund",
        "subclauses": [
          {
            "number": "20.1",
            "text": "Every rental piece carries a refundable security deposit, set for that piece and shown on its listing \nbefore you book. It carries no GST, and no interest is paid on it.",
            "hasList": false
          },
          {
            "number": "20.2",
            "text": "The listing tells you how the deposit is paid: at checkout with your rental fee, or by UPI or bank \ntransfer to our account after our team contacts you on WhatsApp within 24 hours of your booking. \nWe dispatch the piece only once the deposit has reached us. If it has not by the dispatch date, we \nmay release your booking, which is then treated as a cancellation by you on that date.",
            "hasList": false
          },
          {
            "number": "20.3",
            "text": "We hold the deposit as security for what you owe under these Terms, and may use it towards:  \n(a) late return charges under clause 26; \n(b) the cost of repair or specialist cleaning for damage beyond normal wear, under clause 27; \n(c) the cost of replacing a part of the piece that is missing; and \n(d) the Replacement Value of a piece that is lost, stolen, not returned or damaged beyond repair.",
            "hasList": true
          },
          {
            "number": "20.4",
            "text": "We inspect every piece within 24 hours of it reaching us. If all is well, your full deposit is refunded \nwithin 3 to 5 business days. A deposit paid at checkout goes back to your original payment method, \nand one paid by UPI or bank transfer goes back to the account it came from. You can follow each \nstep in the Deposit Tracker in My Account.",
            "hasList": false
          },
          {
            "number": "20.5",
            "text": "If a deduction is needed, we photograph and document the reason and tell you the amount before \nanything is deducted. If you disagree, a senior member of our team who was not part of the original \ninspection reviews it, and nothing is final until you have had your say.",
            "hasList": false
          },
          {
            "number": "20.6",
            "text": "Your deposit is security, not a limit on what you may owe. If the charges under clause 26 or clause \n27 add up to more than your deposit, we will first share the full assessment with you and talk it \nthrough. You agree to pay the difference we then confirm within 7 days of the date of our invoice. \nFor example, if a repair costs ₹22,000 and your deposit is ₹15,000, your deposit goes towards the \nrepair and you pay the remaining ₹7,000.",
            "hasList": false
          },
          {
            "number": "20.7",
            "text": "The deposit is kept apart from your other payments. It is never used towards a rental fee or a future \nbooking.",
            "hasList": false
          }
        ]
      },
      {
        "number": 21,
        "title": "Caring for the piece",
        "anchor": "#c-care",
        "keywords": "care look after store hanger perfume makeup mehendi haldi food drink alter wash",
        "subclauses": [
          {
            "number": "21.1",
            "text": "We ask one thing of everyone who rents with us: treat the piece as your own. It was part of \nsomeone’s most special day, and it will be part of someone else’s next.",
            "hasList": false
          },
          {
            "number": "21.2",
            "text": "While the piece is with you, you agree to: \n(a) keep it on its padded hanger in its garment bag, somewhere cool and away from direct sunlight, \nwhenever you are not wearing it; \n(b) keep food, drink, perfume, makeup, mehendi, haldi, sindoor and colour at a careful distance, \nand let perfume and makeup dry before you dress; \n(c) never alter it in any way, including stitching, hemming, cutting or taking it in, as any alteration is \ntreated as damage; \n(d) never wash, dry-clean, spot clean, steam or iron it, as all cleaning is done by us and is included \nin the price; \n(e) take extra care at outdoor venues and shoots, where water, sand, mud and rough surfaces can \ncause damage; and \n(f) tell us straight away if anything happens to it, however small, and not try to repair or clean it \nyourself. For a spill, gently blot it with a clean tissue and do not rub.",
            "hasList": true
          },
          {
            "number": "21.3",
            "text": "Our Care, Cleaning & Damage Policy explains how to look after each kind of piece.",
            "hasList": false
          }
        ]
      },
      {
        "number": 22,
        "title": "How a rental piece may be used",
        "anchor": "#c-use",
        "keywords": "use personal photoshoot pre wedding shoot commercial campaign lend sublet sub",
        "subclauses": [
          {
            "number": "22.1",
            "text": "A rental is for personal wear by you, or by the person you booked it for, at your own celebrations, \nincluding personal photoshoots such as a pre-wedding shoot.",
            "hasList": false
          },
          {
            "number": "22.2",
            "text": "You may not: \n(a) lend, sub-rent, sell, pawn or give the piece to anyone, or let anyone other than the person you \nbooked it for wear it; \n(b) use it for a paid or commercial purpose, such as a brand campaign, a paid collaboration, a film, \na show or a pageant, without our written consent; or \n(c) take it outside India, unless we agree in writing before dispatch.",
            "hasList": true
          },
          {
            "number": "22.3",
            "text": "If a piece is used in a way these Terms do not allow, you are responsible for any damage that \nfollows, whatever its cause, and we may end your rental and ask for the piece back straight away.",
            "hasList": false
          }
        ]
      },
      {
        "number": 23,
        "title": "Responsibility for the piece while it is with you",
        "anchor": "#c-risk",
        "keywords": "responsible liability loss theft stolen damage risk fault insurance section 152 bailment",
        "subclauses": [
          {
            "number": "23.1",
            "text": "The piece is your responsibility from the moment it is delivered to you, or to the person you asked us \nto deliver it to, until it is collected by our courier or dropped at the courier point we tell you to use.",
            "hasList": false
          },
          {
            "number": "23.2",
            "text": "During that time, you are responsible for any loss, theft, destruction of or damage to the piece, \nwhether or not you were at fault, except: \n(a) normal wear, as clause 27.1 describes; \n(b) anything recorded in its listing or in our record of its condition at dispatch; and  \n(c) damage caused by our packaging or handling.",
            "hasList": true
          },
          {
            "number": "23.3",
            "text": "This is a special contract for the purposes of section 152 of the Indian Contract Act, 1872. It means \nyou take on more responsibility for the piece than the law would otherwise place on you, which is \nwhy we ask you to take the care in clause 21 and to keep the piece with you or somewhere secure. \nYou may wish to check whether your own insurance covers items in your care.",
            "hasList": false
          },
          {
            "number": "23.4",
            "text": "Once our courier has collected the piece, or you have dropped it at the courier point we told you to \nuse, you are no longer responsible for anything that happens to it in transit. Keep your pickup or \ndrop-off receipt until your deposit is refunded.",
            "hasList": false
          },
          {
            "number": "23.5",
            "text": "We record the condition of every piece, with photographs, before it is dispatched. That record, the \nlisting and any photographs you send us on arrival are what every assessment is based on.",
            "hasList": false
          }
        ]
      },
      {
        "number": 24,
        "title": "When your piece arrives",
        "anchor": "#c-arrival",
        "keywords": "arrive delivery try on fit wrong piece missing not fresh damaged parcel tampered",
        "subclauses": [
          {
            "number": "24.1",
            "text": "Please unpack the piece carefully and try it on as soon as you can. If anything is not right, whether it \ndoes not fit, is not fresh, is not as described, is the wrong piece, or is missing something the listing \nincludes, message us within 24 hours of delivery with photographs, so we can help while there is still \ntime before your event.",
            "hasList": false
          },
          {
            "number": "24.2",
            "text": "If the parcel looks damaged or tampered with, photograph it before you open it, and record a short \nvideo as you unpack it if you can.",
            "hasList": false
          },
          {
            "number": "24.3",
            "text": "What we do in each case is set out in the Refund & Cancellation Policy. Telling us within 24 hours \nlets us put things right in time and assess the piece exactly as it arrived. If you tell us later, we will \nstill consider it fairly, though we may need more to show that the issue was there on delivery.",
            "hasList": false
          },
          {
            "number": "24.4",
            "text": "If the piece arrives as described, the rental fee is not refunded because you have changed your mind \nor decided not to wear it. Please still return it on time, and your deposit will come back in full after \ninspection.",
            "hasList": false
          }
        ]
      },
      {
        "number": 25,
        "title": "Returning the piece",
        "anchor": "#c-return",
        "keywords": "return pickup collect courier drop blue dart label garment bag pack missed pickup",
        "subclauses": [
          {
            "number": "25.1",
            "text": "Please return the piece by your Return Date in the way your confirmation sets out, either by handing \nit to our courier at the pickup we arrange with you, or by dropping it at the courier point we tell you to \nuse.",
            "hasList": false
          },
          {
            "number": "25.2",
            "text": "Wrap it in the tissue it came in, place it in its garment bag, and include every part of the outfit and \nanything else that came with it.",
            "hasList": false
          },
          {
            "number": "25.3",
            "text": "Please be available for your pickup, or reachable on the number on your booking. If a pickup is \nmissed because nobody was available, the days until the next pickup may be charged as a late \nreturn. If a pickup is delayed by us or our courier, you are never charged.",
            "hasList": false
          },
          {
            "number": "25.4",
            "text": "Hand the piece only to our courier, never to anyone else, and keep your receipt.",
            "hasList": false
          }
        ]
      },
      {
        "number": 26,
        "title": "Late returns",
        "anchor": "#c-late",
        "keywords": "late return extra day fee charge daily rate extension not returned delay",
        "subclauses": [
          {
            "number": "26.1",
            "text": "If a piece comes back after your Return Date because of you, a late return charge of one day’s rental \nrate applies for each extra day, because another customer may be waiting for it. This charge is our \ngenuine estimate of what a late return costs, not a penalty.",
            "hasList": false
          },
          {
            "number": "26.2",
            "text": "If you think you may be late, tell us as early as you can. An extension agreed before your Return \nDate is charged at the daily rate instead, and is usually kinder on both sides.",
            "hasList": false
          },
          {
            "number": "26.3",
            "text": "Any late charge is shown to you first, and is taken from your deposit unless you would rather pay it \nseparately.",
            "hasList": false
          },
          {
            "number": "26.4",
            "text": "If a piece has still not been returned 5 days after your Return Date, and you have not agreed a new \ndate with us, we treat it as not returned: it is then handled as a total loss under clause 27.4, and we \nmay take the steps in clause 28.",
            "hasList": false
          }
        ]
      },
      {
        "number": 27,
        "title": "Damage and loss",
        "anchor": "#c-damage",
        "keywords": "damage stain tear burn normal wear repair replacement value lost stolen total",
        "subclauses": [
          {
            "number": "27.1",
            "text": "Normal wear is expected and never charged: a few loose threads, a little embellishment loss, light \ncreasing, and the small things that happen when a piece is worn and enjoyed.",
            "hasList": false
          },
          {
            "number": "27.2",
            "text": "Damage is anything beyond normal wear, such as stains, tears, burns, significant bead or \nembroidery loss, or any alteration. We assess it when the piece comes back, as our Care, Cleaning \n& Damage Policy explains.",
            "hasList": false
          },
          {
            "number": "27.3",
            "text": "For damage that can be repaired or specially cleaned, you are responsible for the reasonable cost of \ndoing so, which we show you, with photographs, before anything is deducted. If a missing part can \nbe replaced, you are responsible for the reasonable cost of replacing that part, not the value of the \nwhole piece.",
            "hasList": false
          },
          {
            "number": "27.4",
            "text": "If a piece is lost, stolen, not returned or damaged beyond repair, it is treated as a total loss: your \ndeposit is held, and you are responsible for the piece’s Replacement Value, less your deposit. We \nalways speak with you first and show you how the amount was worked out.",
            "hasList": false
          },
          {
            "number": "27.5",
            "text": "A piece’s Replacement Value is shown in your booking confirmation. It reflects what it would cost to \nreplace the piece, taking into account its designer, its original price and its condition, and you are \nnever asked to pay more than it for the loss of the piece.",
            "hasList": false
          },
          {
            "number": "27.6",
            "text": "If a piece is stolen, please report the theft to the police and send us a copy of the report. It supports \nany insurance claim, and it protects you.",
            "hasList": false
          }
        ]
      },
      {
        "number": 28,
        "title": "If a piece is not returned",
        "anchor": "#c-recovery",
        "keywords": "not returned keep sell pawn police criminal breach of trust legal action court",
        "subclauses": [
          {
            "number": "28.1",
            "text": "Keeping a rental piece beyond your Rental Period without our agreement, or selling, pawning or \ngiving it away, is a breach of these Terms, and may also be criminal breach of trust or another \noffence under the Bharatiya Nyaya Sanhita, 2023.",
            "hasList": false
          },
          {
            "number": "28.2",
            "text": "We will always try to resolve it with you first. If we cannot, we may recover the piece, and any \namount you owe, through the courts, report the matter to the police, and share your details with them \nand with our lawyers for that purpose.",
            "hasList": false
          },
          {
            "number": "28.3",
            "text": "Amounts you owe under this Part are a debt you agree to pay, and we may ask a court to award us \nthe reasonable costs of recovering them.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 5,
    "title": "Buying a preloved piece",
    "italicWord": "piece",
    "barLabel": "Preloved",
    "anchor": "#p-preloved",
    "description": "For every preloved piece: buying, making an offer, delivery, and what happens once it is yours.",
    "startClause": 29,
    "endClause": 32,
    "clauses": [
      {
        "number": 29,
        "title": "Buying a preloved piece",
        "anchor": "#c-pre-buy",
        "keywords": "buy purchase preloved order dispatch one of a kind hold reserve keep aside",
        "subclauses": [
          {
            "number": "29.1",
            "text": "Every preloved piece is one of a kind. It becomes yours once you have completed payment and we \nhave confirmed your order; until then, including while it is in your bag, it remains available to others.",
            "hasList": false
          },
          {
            "number": "29.2",
            "text": "We dispatch preloved pieces within 2 business days of your order, professionally cleaned and \ncarefully packed.",
            "hasList": false
          },
          {
            "number": "29.3",
            "text": "Please read the condition notes, look closely at the photographs and check the measurements \nbefore you buy, and ask us about anything you are unsure of. We are always glad to help before you \ndecide.",
            "hasList": false
          }
        ]
      },
      {
        "number": 30,
        "title": "Making an offer",
        "anchor": "#c-offer",
        "keywords": "offer negotiate quote minimum counter accepted reserve pay bargain",
        "subclauses": [
          {
            "number": "30.1",
            "text": "On a preloved piece, you may offer a price instead of buying at the listed price. Each piece shows \nthe lowest offer we can consider.",
            "hasList": false
          },
          {
            "number": "30.2",
            "text": "We review every offer and reply within 24 hours, on WhatsApp or email, to accept it, suggest a \ncounter offer, or let you know it is not possible this time. If an offer is not accepted, you are welcome \nto make another.",
            "hasList": false
          },
          {
            "number": "30.3",
            "text": "An offer does not reserve the piece, and it becomes a purchase only when you  complete payment at \nthe agreed price. Until then, the piece remains available to others, and you are free not to go ahead.",
            "hasList": false
          },
          {
            "number": "30.4",
            "text": "An accepted offer stays open for the time we tell you when we accept it. The agreed price does not \ninclude GST or delivery, which are added at checkout.",
            "hasList": false
          },
          {
            "number": "30.5",
            "text": "Offers can be made only on preloved pieces, never on rentals.",
            "hasList": false
          }
        ]
      },
      {
        "number": 31,
        "title": "Delivery, ownership and responsibility",
        "anchor": "#c-pre-own",
        "keywords": "ownership title risk delivered transit insured courier lost missed delivery refused",
        "subclauses": [
          {
            "number": "31.1",
            "text": "A preloved piece becomes yours, and your responsibility, when it is delivered to you or to the person \nyou asked us to deliver it to. Until then it is our responsibility, and it is insured while in transit.",
            "hasList": false
          },
          {
            "number": "31.2",
            "text": "If the courier loses your parcel, we refund you in full as soon as the loss is confirmed.",
            "hasList": false
          },
          {
            "number": "31.3",
            "text": "If a delivery fails because nobody was available, or a parcel in good condition is refused, the piece \ncomes back to us and we will contact you. If you would rather not have it delivered again, we refund \nthe price less the delivery charges both ways.",
            "hasList": false
          }
        ]
      },
      {
        "number": 32,
        "title": "If a preloved piece is not as described",
        "anchor": "#c-pre-issue",
        "keywords": "final sale return not as described wrong item damaged missing flaw later hidden",
        "subclauses": [
          {
            "number": "32.1",
            "text": "Preloved pieces are a final sale once dispatched. They cannot be returned because of fit, a change \nof heart, or because they were bought as a gift, which is why every listing shows full measurements, \nhonest photographs, the condition grade and detailed notes.",
            "hasList": false
          },
          {
            "number": "32.2",
            "text": "You are always protected if something is wrong. If a piece is not as described, is damaged, is the \nwrong piece, or is missing something the listing includes, message us within 24 hours of delivery \nwith photographs. Please keep the House of Kaira tag attached, and do not wear, wash or alter the \npiece, until the issue is resolved.",
            "hasList": false
          },
          {
            "number": "32.3",
            "text": "Where a claim is accepted, the remedies, including a full refund when the piece is returned or, if you \nwould prefer to keep it, a fair partial refund, are set out in the Refund & Cancellation Policy.",
            "hasList": false
          },
          {
            "number": "32.4",
            "text": "If you find a significant flaw that was not disclosed and that you could not reasonably have noticed \nwhen the piece arrived, tell us as soon as you find it, and within 30 days of delivery. As long as the \npiece has not been worn beyond trying it on, washed or altered, we treat it as not as described.",
            "hasList": false
          },
          {
            "number": "32.5",
            "text": "Once a piece has been altered, washed or worn beyond a quick try-on, we can no longer accept a \nclaim about how it arrived, because we cannot tell. Please check everything carefully before you \ntake it to your tailor.",
            "hasList": false
          },
          {
            "number": "32.6",
            "text": "Once a piece is yours, you are free to have it tailored, and when you are ready for its next chapter, \nyou can list it with us. \n\n \n \n\nthe Lister Terms & Conditions your submission form refers to.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 6,
    "title": "Listing a piece",
    "italicWord": "piece",
    "barLabel": "Listing",
    "anchor": "#p-listing",
    "description": "For every Lister: what you promise, how we look after your piece, and how you are paid. These are our standard terms; specific Listing Terms apply to each piece.",
    "startClause": 33,
    "endClause": 38,
    "clauses": [
      {
        "number": 33,
        "title": "Listing with us",
        "anchor": "#c-lister-start",
        "keywords": "list lister submit submission review accept listing terms commission share",
        "subclauses": [
          {
            "number": "33.1",
            "text": "This Part applies when you submit a piece to rent out or sell through House of Kaira. It forms the \nLister Terms & Conditions you accept when you submit, and the rest of these Terms apply to you as \nwell.",
            "hasList": false
          },
          {
            "number": "33.2",
            "text": "Submitting a piece is free and commits you to nothing. Our team reviews every submission and \nreplies on WhatsApp within 48 hours. We may decline a piece without giving a reason.",
            "hasList": false
          },
          {
            "number": "33.3",
            "text": "When we accept your piece, we confirm its Listing Terms to you in writing, by email or WhatsApp: \nwhether it will be rented, sold or both, its price, your share of each rental and sale, the value we \nagree for the piece, and anything else particular to it. Nothing goes live until you have confirmed \nthem, and they change only with your written agreement.",
            "hasList": false
          }
        ]
      },
      {
        "number": 34,
        "title": "What you promise us",
        "anchor": "#c-lister-promise",
        "keywords": "owner ownership genuine authentic stolen disclosure photos edited ai",
        "subclauses": [
          {
            "number": "34.1",
            "text": "When you submit a piece, and for as long as it is listed, you promise that: \n(a) you are its legal owner, or have the owner’s authority to list it, and nobody else has any claim \nover it; \n(b) it is genuine and by the designer you name, and is not a copy, a replica or an “inspired by” \npiece presented as a designer original; \n(c) it is not stolen, and is not the subject of any dispute, loan or charge; \n(d) everything you tell us about it is true and complete, including how often it has been worn, every \nalteration, repair and flaw you know of, and anything else that affects its condition, such as \nsmoke, perfume or damp; \n(e) the photographs you send show the actual piece, and have not been edited, filtered or altered, \nincluding with artificial intelligence, in any way that hides a flaw or changes how it looks;  \n(f) it contains nothing the law does not allow to be sold, such as material from a species protected \nunder the Wildlife (Protection) Act, 1972; and \n(g) you will not rent or sell it anywhere else while it is listed with us, without first withdrawing it under \nclause 38.",
            "hasList": true
          },
          {
            "number": "34.2",
            "text": "If any of these promises is untrue, we may remove the piece, cancel affected bookings and orders, \nand hold back payouts for it. You are responsible for what we have had to refund or pay to \ncustomers as a result, with our reasonable costs, and we may close your account.",
            "hasList": false
          }
        ]
      },
      {
        "number": 35,
        "title": "How your piece is priced and presented",
        "anchor": "#c-lister-price",
        "keywords": "price pricing photograph photos listing approve offers minimum featured pause",
        "subclauses": [
          {
            "number": "35.1",
            "text": "We suggest a price for your piece based on its designer, category, condition and demand, and agree \nit with you before it goes live.",
            "hasList": false
          },
          {
            "number": "35.2",
            "text": "We photograph your piece and share the photographs with you before it goes live. We write its \nlisting, including its condition grade and notes, to our honest disclosure standard, and every flaw we \nknow of is disclosed.",
            "hasList": false
          },
          {
            "number": "35.3",
            "text": "Where your piece is for sale, we may accept offers from buyers at or above the minimum price we \nhave agreed with you.",
            "hasList": false
          },
          {
            "number": "35.4",
            "text": "We decide how pieces are presented, featured and ordered on the Platform, as clause 17 explains, \nand we may pause a listing at any time, for example for cleaning, repair or seasonal planning.",
            "hasList": false
          }
        ]
      },
      {
        "number": 36,
        "title": "How we look after your piece",
        "anchor": "#c-lister-care",
        "keywords": "collection pickup custody care cleaning repair loss damage compensation",
        "subclauses": [
          {
            "number": "36.1",
            "text": "We arrange collection of your piece from you. While it is with us, we look after it with the care a \ncareful owner would take of their own, and we have it professionally cleaned before and after every \nrental.",
            "hasList": false
          },
          {
            "number": "36.2",
            "text": "If your piece stays with you until it is rented or sold, you agree to keep it clean, safe and in the \ncondition its listing describes, and to hand it over promptly when we arrange collection. If you cannot, \nand we have to cancel a booking or order as a result, you are responsible for what we have had to \nrefund or pay to the customer.",
            "hasList": false
          },
          {
            "number": "36.3",
            "text": "Normal wear from rentals is expected, and you will not be asked to bear it. Before your piece first \ngoes live, we may have it cleaned or repaired so it is ready to list, and if extensive work is needed, \nwe discuss it, and its cost, with you first.",
            "hasList": false
          },
          {
            "number": "36.4",
            "text": "If your piece is lost, or damaged beyond normal wear, while it is with us or with a renter, we pursue \nthe renter for the loss and compensate you as your Listing Terms set out.",
            "hasList": false
          }
        ]
      },
      {
        "number": 37,
        "title": "Your payouts",
        "anchor": "#c-lister-payout",
        "keywords": "payout earnings paid bank upi share commission tds tax pan when timeline",
        "subclauses": [
          {
            "number": "37.1",
            "text": "Your share of each rental and sale, and how it is calculated, is set out in your Listing Terms. A \ndeposit, GST and delivery charges are never part of it.",
            "hasList": false
          },
          {
            "number": "37.2",
            "text": "We pay your share within 3 working days: for a rental, after the rental has ended and the piece has \ncome back to us and been inspected; for a sale, after the buyer has received the piece. We pay only \ninto a bank account or UPI ID in your own name.",
            "hasList": false
          },
          {
            "number": "37.3",
            "text": "If a sale is reversed because a buyer’s claim is accepted, no payout is due for it. If one has already \nbeen made, we may recover it from you or set it off against future payouts, unless the claim arose \nfrom something that happened while the piece was in our care.",
            "hasList": false
          },
          {
            "number": "37.4",
            "text": "Where the law requires us to deduct or collect tax from a payout, we do so and give you the details, \nand we may ask for your PAN for this purpose. You are responsible for any tax on your earnings.",
            "hasList": false
          },
          {
            "number": "37.5",
            "text": "We may set off any amount you owe us under these Terms against payouts due to you.",
            "hasList": false
          }
        ]
      },
      {
        "number": 38,
        "title": "Pausing or withdrawing your piece",
        "anchor": "#c-lister-withdraw",
        "keywords": "withdraw pause take back unlist return piece change mind",
        "subclauses": [
          {
            "number": "38.1",
            "text": "You may pause or withdraw your piece at any time, but bookings and sales already confirmed must \nbe honoured.",
            "hasList": false
          },
          {
            "number": "38.2",
            "text": "A piece listed for sale can be withdrawn at any time before a buyer completes payment.",
            "hasList": false
          },
          {
            "number": "38.3",
            "text": "We return your piece to you promptly after you withdraw it, or after its last confirmed booking ends if \nthat is later, as your Listing Terms set out.",
            "hasList": false
          },
          {
            "number": "38.4",
            "text": "If we can no longer list your piece, for example because it no longer meets our standard, we will tell \nyou why and return it to you.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 7,
    "title": "Payments, delivery & cancellations",
    "italicWord": "cancellations",
    "barLabel": "Payments",
    "anchor": "#p-payments",
    "description": "How you pay, how pieces reach you, and what happens when plans change.",
    "startClause": 39,
    "endClause": 44,
    "clauses": [
      {
        "number": 39,
        "title": "Paying",
        "anchor": "#c-paying",
        "keywords": "pay payment upi card net banking emi cod cash on delivery razorpay invoice gst",
        "subclauses": [
          {
            "number": "39.1",
            "text": "You can pay by UPI, credit or debit card, net banking, or no-cost EMI on selected cards. We do not \noffer cash on delivery.",
            "hasList": false
          },
          {
            "number": "39.2",
            "text": "Payments are processed by our payment partner, Razorpay. We never see or store your card or UPI \ndetails, and your bank’s or card issuer’s own terms, including for EMI, also apply.",
            "hasList": false
          },
          {
            "number": "39.3",
            "text": "You pay in full when you place your booking or order, except a deposit that the listing says is \ncollected separately.",
            "hasList": false
          },
          {
            "number": "39.4",
            "text": "If money leaves your account but your booking or order does not go through, your bank reverses it \nautomatically. If it does not, tell us and we will help straight away.",
            "hasList": false
          },
          {
            "number": "39.5",
            "text": "We issue a tax invoice in our name for every booking and order, and a credit note where we refund \nagainst it. If you ask for a GST invoice and give us your GSTIN, you confirm the GSTIN is yours and \nthe purchase is for that business; whether you can claim input tax credit is a matter between you and \nthe tax authorities.",
            "hasList": false
          }
        ]
      },
      {
        "number": 40,
        "title": "Payment disputes",
        "anchor": "#c-chargeback",
        "keywords": "chargeback bank dispute card dispute",
        "subclauses": [
          {
            "number": "40.1",
            "text": "If something is wrong with a payment or an order, please talk to us first. A bank dispute can freeze a \nrefund we are already processing, and often takes weeks longer.",
            "hasList": false
          },
          {
            "number": "40.2",
            "text": "You are always free to raise a dispute with your bank. If one is raised for a transaction  you \nauthorised and received, we will share the records of your booking or order with your bank, including \nthese Terms and your acceptance of them, and we may pause new orders on your account while it \nis open.",
            "hasList": false
          }
        ]
      },
      {
        "number": 41,
        "title": "Delivery and collection",
        "anchor": "#c-delivery",
        "keywords": "delivery shipping courier pin code free delivery express address not home insured",
        "subclauses": [
          {
            "number": "41.1",
            "text": "We deliver across India to the PIN codes we serve, which you can check at checkout. Standard \ndelivery is free on orders above ₹2,999, and any delivery charge is always shown before you pay. \nHow we deliver and collect, and how long it takes, is set out in our Shipping & Delivery Policy.",
            "hasList": false
          },
          {
            "number": "41.2",
            "text": "Please give us an accurate, complete address and a phone number the courier can reach, and make \nsure someone can receive the parcel. A rental’s delivery date is fixed to your booking, and the \nRefund & Cancellation Policy explains what happens if delivery cannot be completed in time \nbecause nobody was available.",
            "hasList": false
          },
          {
            "number": "41.3",
            "text": "Pieces are insured while in transit, and you never pay for a parcel the courier loses.",
            "hasList": false
          }
        ]
      },
      {
        "number": 42,
        "title": "Cancelling, changing and refunds",
        "anchor": "#c-cancel",
        "keywords": "cancel cancellation change refund timeline original payment method store credit",
        "subclauses": [
          {
            "number": "42.1",
            "text": "You may cancel or change a booking or order as the Refund & Cancellation Policy sets out. In short, \na rental cancelled more than 7 days before its Rental Period starts is refunded in full, a rental cannot \nbe cancelled once dispatched, and a preloved order can be cancelled for a full refund until it is \ndispatched.",
            "hasList": false
          },
          {
            "number": "42.2",
            "text": "Refunds go back to the payment method used at checkout and usually reach you within 7 to 14 \ndays, depending on your bank. We cannot refund in cash, as store credit or to a different account, \nexcept as the Refund & Cancellation Policy explains for a card or account that has since closed.",
            "hasList": false
          },
          {
            "number": "42.3",
            "text": "If something goes wrong because of us or our courier, you do not pay for it.",
            "hasList": false
          }
        ]
      },
      {
        "number": 43,
        "title": "If we have to cancel",
        "anchor": "#c-we-cancel",
        "keywords": "house of kaira cancels unavailable damaged double booked compensation",
        "subclauses": [
          {
            "number": "43.1",
            "text": "Occasionally we may have to cancel a confirmed booking or order, for example because a piece was \ndamaged before your dates, did not pass our final check, or was paid for by someone else at the \nsame moment. If so, we tell you straight away, refund everything you paid, automatically, and help \nyou find something else if you would like us to.",
            "hasList": false
          },
          {
            "number": "43.2",
            "text": "If we cancel a booking, for a reason that is not yours, at a time when cancelling it yourself would \nhave carried a charge under the Refund & Cancellation Policy, we also pay you an amount equal to \nthat charge, on top of your full refund. We do not think it is fair to charge you for cancelling unless we \nbear the same when we cancel.",
            "hasList": false
          },
          {
            "number": "43.3",
            "text": "If we cancel because you have broken these Terms, or because we could not confirm who you are, \nwe refund what you paid, less any amount you owe us, and the payment in clause 43.2 does not \napply.",
            "hasList": false
          }
        ]
      },
      {
        "number": 44,
        "title": "Events outside anyone’s control",
        "anchor": "#c-force",
        "keywords": "force majeure strike flood lockdown weather disaster government order delay",
        "subclauses": [
          {
            "number": "44.1",
            "text": "Neither of us is responsible for failing to do something, or for doing it late, because of events outside \nour reasonable control, such as floods, severe weather, epidemics, strikes, government orders, or \nthe failure of courier or payment networks.",
            "hasList": false
          },
          {
            "number": "44.2",
            "text": "If such an event stops a piece from being dispatched, you can choose a full refund or, for a rental, a \nlater date. If it happens while a piece is in transit, we keep you updated and make sure you are not \nleft out of pocket.",
            "hasList": false
          },
          {
            "number": "44.3",
            "text": "If such an event stops you returning a piece on time, you are not charged for the delay it causes, \nthough the piece remains your responsibility until it is collected.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 8,
    "title": "Content & intellectual property",
    "italicWord": "intellectual property",
    "barLabel": "Content",
    "anchor": "#p-content",
    "description": "What belongs to us, what belongs to you, and how reviews and photographs are used.",
    "startClause": 45,
    "endClause": 48,
    "clauses": [
      {
        "number": 45,
        "title": "What belongs to us",
        "anchor": "#c-our-ip",
        "keywords": "copyright trade mark logo photos content copy reuse intellectual property",
        "subclauses": [
          {
            "number": "45.1",
            "text": "The House of Kaira name and logo, the design of the Platform, and the photographs, listings, text \nand other content we create belong to us or are used by us with permission, and are protected by \nthe Copyright Act, 1957, the Trade Marks Act, 1999 and other laws.",
            "hasList": false
          },
          {
            "number": "45.2",
            "text": "You may view our pages and share links to them. You may not copy, reproduce, sell or reuse our \ncontent, including listing photographs, for any other purpose without our written permission.",
            "hasList": false
          }
        ]
      },
      {
        "number": 46,
        "title": "What you share with us",
        "anchor": "#c-your-content",
        "keywords": "my photos reviews story licence consent use my photo name marketing lister",
        "subclauses": [
          {
            "number": "46.1",
            "text": "When you share reviews, photographs, messages or other content with us, it remains yours, and you \ngive us a non-exclusive, royalty-free licence to use, reproduce, adapt and publish it on the Platform \nand in our marketing. You confirm you have the right to share it.",
            "hasList": false
          },
          {
            "number": "46.2",
            "text": "We will not publish a photograph in which you or anyone else can be recognised, or use your name \nin our marketing, unless you have agreed, and you can ask us to stop any such use at any time.",
            "hasList": false
          },
          {
            "number": "46.3",
            "text": "For Listers, this includes the photographs you send and the story of your piece. The photographs we \ntake of your piece belong to us, and we may keep them, and show them in our archive of past \npieces, after the piece is sold or withdrawn.",
            "hasList": false
          }
        ]
      },
      {
        "number": 47,
        "title": "Reviews and testimonials",
        "anchor": "#c-reviews",
        "keywords": "reviews ratings stars testimonials fake paid honest remove",
        "subclauses": [
          {
            "number": "47.1",
            "text": "A review must be your own honest opinion of a piece you rented or bought. We never pay for \nreviews or offer anything in return for a positive one.",
            "hasList": false
          },
          {
            "number": "47.2",
            "text": "We publish reviews as they are written, whether positive or negative. We decline or remove a review \nonly if it breaks clause 10, contains personal information, or is not about the piece or our service, \nand we keep a record of why.",
            "hasList": false
          },
          {
            "number": "47.3",
            "text": "We show a testimonial on our pages only with the consent of the person who gave it.",
            "hasList": false
          }
        ]
      },
      {
        "number": 48,
        "title": "Reporting content or an infringement",
        "anchor": "#c-report",
        "keywords": "report infringement copyright trade mark takedown unlawful content",
        "subclauses": [
          {
            "number": "48.1",
            "text": "If you believe something on the Platform infringes your rights, such as your copyright or trade mark, \nor breaks the law or clause 10, tell our Grievance Officer, whose details are in clause 53, where it \nappears and why, and we will act on it within the time the law requires.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 9,
    "title": "Responsibility & liability",
    "italicWord": "liability",
    "barLabel": "Liability",
    "anchor": "#p-liability",
    "description": "What each of us is responsible for, and the limits that are fair to both.",
    "startClause": 49,
    "endClause": 50,
    "clauses": [
      {
        "number": 49,
        "title": "Our responsibility to you",
        "anchor": "#c-our-resp",
        "keywords": "liability limit cap compensation indirect loss consumer rights negligence website",
        "subclauses": [
          {
            "number": "49.1",
            "text": "We provide our services with reasonable care and skill, and deliver every piece in the condition its \nlisting describes.",
            "hasList": false
          },
          {
            "number": "49.2",
            "text": "Nothing in these Terms limits or excludes our liability for death or personal injury caused by our \nnegligence, for fraud, for our gross negligence or wilful misconduct, or for anything else the law does \nnot allow us to limit, and nothing in them takes away your rights under the Consumer Protection Act, \n2019 or any other law.",
            "hasList": false
          },
          {
            "number": "49.3",
            "text": "Subject to that, we are not responsible for loss that was not reasonably foreseeable when your \nbooking or order was confirmed, and our total responsibility to you for a booking or order is limited to \nthe total amount you paid for it, together with the refund of your deposit in full.",
            "hasList": false
          },
          {
            "number": "49.4",
            "text": "We work hard to keep the Platform accurate and available, but we cannot promise it will always be \nuninterrupted or free of errors, and we may change or pause parts of it for maintenance or \nimprovement.",
            "hasList": false
          },
          {
            "number": "49.5",
            "text": "Styling suggestions, including through Consult a Stylist, are given in good faith to help you choose. \nHow a piece looks and feels on you is a personal judgement.",
            "hasList": false
          },
          {
            "number": "49.6",
            "text": "Where a listing states a fabric’s composition, it is given as we know it. If you are sensitive to any \nmaterial, dye or cleaning process, please ask us before you book or buy.",
            "hasList": false
          }
        ]
      },
      {
        "number": 50,
        "title": "Your responsibility to us",
        "anchor": "#c-your-resp",
        "keywords": "indemnity indemnify responsible loss third party claim legal costs",
        "subclauses": [
          {
            "number": "50.1",
            "text": "You are responsible for loss you cause us by breaking these Terms, by acting dishonestly or by \nbreaking the law, including any claim someone else brings against us as a result, for example a \ndesigner’s claim about a piece you listed that was not genuine. You agree to make good that loss, \nincluding our reasonable legal costs, to the extent you caused it.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 10,
    "title": "Your privacy",
    "italicWord": "privacy",
    "barLabel": "Privacy",
    "anchor": "#p-privacy",
    "description": "How your personal data is used, in brief. Our Privacy Policy has the detail.",
    "startClause": 51,
    "endClause": 51,
    "clauses": [
      {
        "number": 51,
        "title": "Your personal data",
        "anchor": "#c-data",
        "keywords": "privacy personal data dpdp consent erase delete correct access nominate share sell",
        "subclauses": [
          {
            "number": "51.1",
            "text": "We handle your personal data in line with the Digital Personal Data Protection Act, 2023 and our \nPrivacy Policy, which explains what we collect, why, who we share it with and how long we keep it.",
            "hasList": false
          },
          {
            "number": "51.2",
            "text": "We use your details to run your account, bookings, orders and listings, and share them only as the \nPrivacy Policy describes, for example with our courier and payment partners so they can deliver and \nprocess your order. We never sell your data.",
            "hasList": false
          },
          {
            "number": "51.3",
            "text": "You can ask to see, correct or erase your personal data, withdraw a consent you have given, \nnominate someone to act for you, or raise a concern, as the Privacy Policy explains. Withdrawing \nconsent does not affect what was done before, and we may still keep what the law requires us to \nkeep.",
            "hasList": false
          },
          {
            "number": "51.4",
            "text": "When you give us someone else’s details, for example a friend’s delivery address, you confirm they \nare happy for us to use them to deliver your order.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 11,
    "title": "Complaints & disputes",
    "italicWord": "disputes",
    "barLabel": "Complaints",
    "anchor": "#p-disputes",
    "description": "How to raise a concern, and where to go if we cannot resolve it together.",
    "startClause": 52,
    "endClause": 55,
    "clauses": [
      {
        "number": 52,
        "title": "Talk to us first",
        "anchor": "#c-talk",
        "keywords": "complaint unhappy escalate senior review help",
        "subclauses": [
          {
            "number": "52.1",
            "text": "Most concerns are settled with us within a day or two. Message us on WhatsApp at +91 93401 \n39300 or email hello@houseofkaira.com, and if you are not happy with how your case was handled, \nask for it to be reviewed by a senior member of our team.",
            "hasList": false
          }
        ]
      },
      {
        "number": 53,
        "title": "Our Grievance Officer",
        "anchor": "#c-complaints",
        "keywords": "grievance officer formal complaint acknowledge resolve appellate committee",
        "subclauses": [
          {
            "number": "53.1",
            "text": "For a formal complaint, including about a piece, our service, content on the Platform or your account, \nplease write to our Grievance Officer: [Name], [Designation], [Registered legal name], [Registered \noffice address], Indore, Madhya Pradesh. Email [Email address]. Phone [Phone number].",
            "hasList": false
          },
          {
            "number": "53.2",
            "text": "We acknowledge every complaint within 24 hours of receiving it, give you a reference number and a \ncopy of your complaint as we have recorded it, and keep you updated. We resolve complaints within \none month of receiving them, or within any shorter time the law sets for a particular kind of \ncomplaint, such as one about content on the Platform.",
            "hasList": false
          },
          {
            "number": "53.3",
            "text": "If you are not satisfied with the Grievance Officer’s decision on a complaint about content on the \nPlatform or your access to it, you may appeal to the Grievance Appellate Committee set up by the \nGovernment of India, within 30 days of that decision.",
            "hasList": false
          }
        ]
      },
      {
        "number": 54,
        "title": "Your rights as a consumer",
        "anchor": "#c-consumer",
        "keywords": "consumer rights national consumer helpline consumer commission e jagriti",
        "subclauses": [
          {
            "number": "54.1",
            "text": "You can also ask the National Consumer Helpline for help, by calling 1915, messaging +91 88000 \n01915 on WhatsApp, or at consumerhelpline.gov.in, and you can file a complaint with the Consumer \nDisputes Redressal Commission for your area, including online through e-Jagriti at e-jagriti.gov.in.",
            "hasList": false
          },
          {
            "number": "54.2",
            "text": "Nothing in these Terms limits your right to do so, or any other right you have under the Consumer \nProtection Act, 2019.",
            "hasList": false
          }
        ]
      },
      {
        "number": 55,
        "title": "The law that applies, and the courts",
        "anchor": "#c-law",
        "keywords": "governing law jurisdiction courts indore madhya pradesh dispute",
        "subclauses": [
          {
            "number": "55.1",
            "text": "These Terms are governed by the laws of India.",
            "hasList": false
          },
          {
            "number": "55.2",
            "text": "Subject to your rights in clause 54, the courts at Indore, Madhya Pradesh, have exclusive jurisdiction \nover any dispute arising from these Terms or your use of the Platform. If you are a consumer, you \nmay also bring a complaint wherever the Consumer Protection Act, 2019 allows, including wh ere you \nlive or work.",
            "hasList": false
          }
        ]
      }
    ]
  },
  {
    "partNumber": 12,
    "title": "Everything else",
    "italicWord": "else",
    "barLabel": "General",
    "anchor": "#p-general",
    "description": "The general terms that hold the agreement together.",
    "startClause": 56,
    "endClause": 59,
    "clauses": [
      {
        "number": 56,
        "title": "Suspending or closing an account",
        "anchor": "#c-suspension",
        "keywords": "suspend suspension close terminate ban block account remove listing cancel",
        "subclauses": [
          {
            "number": "56.1",
            "text": "We may suspend or close an account, remove a listing or cancel an open order only for a \nreasonable cause, such as: \n(a) a serious or repeated breach of these Terms; \n(b) fraud or suspected fraud, including a dishonest chargeback; \n(c) a piece not returned or an amount left unpaid; \n(d) abusive behaviour towards our team, our Listers or other customers; or  \n(e) a requirement of the law or of an authority.",
            "hasList": true
          },
          {
            "number": "56.2",
            "text": "Unless the law, or a risk to others, requires us to act at once, we tell you why first and give you a \nchance to respond.",
            "hasList": false
          },
          {
            "number": "56.3",
            "text": "If we cancel an order for a reason that is not yours, clause 43 applies. Closing an account does not \nend anything already owed, such as returning a rental piece, paying an amount due, or honouring a \nconfirmed booking of a piece you listed.",
            "hasList": false
          },
          {
            "number": "56.4",
            "text": "You can close your account at any time, as clause 8.5 explains.",
            "hasList": false
          }
        ]
      },
      {
        "number": 57,
        "title": "Notices",
        "anchor": "#c-notices",
        "keywords": "notice legal notice address email",
        "subclauses": [
          {
            "number": "57.1",
            "text": "We send notices to the email address, phone number or WhatsApp number on your account, and a \nnotice is treated as received when it is sent there, unless we learn it did not arrive.",
            "hasList": false
          },
          {
            "number": "57.2",
            "text": "You can send notices to us at hello@houseofkaira.com, and formal notices to our Grievance Officer \nat the address in clause 53.",
            "hasList": false
          }
        ]
      },
      {
        "number": 58,
        "title": "Transferring this agreement",
        "anchor": "#c-transfer",
        "keywords": "assign assignment transfer successor acquisition",
        "subclauses": [
          {
            "number": "58.1",
            "text": "You may not transfer your rights or obligations under these Terms to anyone else without our written \nagreement.",
            "hasList": false
          },
          {
            "number": "58.2",
            "text": "We may transfer ours to another business, for example if House of Kaira is reorganised or acquired, \nas long as this does not reduce your rights under these Terms, and we will tell you if it happens.",
            "hasList": false
          }
        ]
      },
      {
        "number": 59,
        "title": "The rest of the fine print",
        "anchor": "#c-misc",
        "keywords": "entire agreement severability waiver survival relationship language translation",
        "subclauses": [
          {
            "number": "59.1",
            "text": "The whole agreement. These Terms, our Policies and your confirmations are the whole agreement \nbetween us about the Platform.",
            "hasList": false
          },
          {
            "number": "59.2",
            "text": "If part does not hold. If any part of these Terms is found to be unenforceable, the rest remains in \nforce, and that part applies as far as the law allows.",
            "hasList": false
          },
          {
            "number": "59.3",
            "text": "No waiver. If we do not enforce a right straight away, we have not given it up.",
            "hasList": false
          },
          {
            "number": "59.4",
            "text": "Our relationship. Nothing in these Terms creates a partnership, joint venture or employment \nbetween you and us.",
            "hasList": false
          },
          {
            "number": "59.5",
            "text": "What continues. Clauses that by their nature continue after a booking or order is completed or an \naccount is closed, such as those on responsibility for a rental piece, amounts owed, intellectual \nproperty, liability and disputes, continue to apply.",
            "hasList": false
          },
          {
            "number": "59.6",
            "text": "Language. These Terms are written in English. If we provide a translation, it is for convenience, and \nthe English version applies if they differ.",
            "hasList": false
          },
          {
            "number": "59.7",
            "text": "Headings and summaries. Headings, the essentials at the top of this page and our guides help you \nfind your way; they do not change what the clauses say.",
            "hasList": false
          }
        ]
      }
    ]
  }
];

export const ALL_CLAUSES = [
  {
    "number": 1,
    "title": "Who we are",
    "anchor": "#c-who",
    "keywords": "company legal name address gstin cin operator contact who runs",
    "subclauses": [
      {
        "number": "1.1",
        "text": "House of Kaira is a curated home for designer Indian occasionwear, where you can rent a piece for \na celebration, buy a preloved piece to keep, or list a piece of your own. It is operated by [Registered \nlegal name], [its constitution, for example a private limited company incorporated under the \nCompanies Act, 2013], with its registered office at [Registered office address], Indore, Madhya \nPradesh (CIN [CIN], GSTIN [GSTIN]).",
        "hasList": false
      },
      {
        "number": "1.2",
        "text": "In these Terms, “House of Kaira”, “HOK”, “we”, “us” and “our” mean [Registered legal name]. “You” \nand “your” mean the person using the Platform and, where you act for a business such as a boutique \nthat lists with us, that business too.",
        "hasList": false
      },
      {
        "number": "1.3",
        "text": "You can reach us on WhatsApp at +91 93401 39300 (Seven days a week, 10 AM to 8 PM IST), by \nemail at hello@houseofkaira.com, or through our Grievance Officer, whose details are in clause 53.",
        "hasList": false
      }
    ]
  },
  {
    "number": 2,
    "title": "What these Terms cover",
    "anchor": "#c-scope",
    "keywords": "website app whatsapp instagram phone orders scope new services buy new",
    "subclauses": [
      {
        "number": "2.1",
        "text": "These Terms govern your use of our website at www.houseofkaira.com, any app we offer, and our \nservices on WhatsApp, Instagram, by phone and by email, which together we call the Platform. They \napply to every rental, purchase, offer and listing you make with us, however you make it.",
        "hasList": false
      },
      {
        "number": "2.2",
        "text": "Some Parts apply only to renting, buying preloved or listing a piece, and their titles make this clear. \nEverything else applies to everyone.",
        "hasList": false
      },
      {
        "number": "2.3",
        "text": "When we introduce a new service, for example selling new pieces directly from designers, we will \npublish the terms for it before it opens, and you will see them before you use it.",
        "hasList": false
      },
      {
        "number": "2.4",
        "text": "These Terms are an electronic record under the Information Technology Act, 2000 and the rules \nmade under it. They are generated by a computer system and need no physical or digital signature, \nand we publish them as rule 3(1) of the Information Technology (Intermediary Guidelines and Digital \nMedia Ethics Code) Rules, 2021 requires.",
        "hasList": false
      }
    ]
  },
  {
    "number": 3,
    "title": "How you accept these Terms",
    "anchor": "#c-accept",
    "keywords": "agree accept tick checkbox consent contract whatsapp order confirmation binding",
    "subclauses": [
      {
        "number": "3.1",
        "text": "You accept these Terms when you create an account, place an order or booking, make an offer, \nsubmit a piece to list, or otherwise use the Platform. Where we ask you to tick a box or press a \nbutton to confirm, doing so is your agreement. We never record your agreement with a box that has \nbeen ticked for you.",
        "hasList": false
      },
      {
        "number": "3.2",
        "text": "If you order through our team on WhatsApp, Instagram, by phone or by email, your confirmation will \ninclude a link to these Terms, and confirming or paying for that order is your acceptance of them.",
        "hasList": false
      },
      {
        "number": "3.3",
        "text": "An agreement made electronically in this way is valid and enforceable, as section 10A of the \nInformation Technology Act, 2000 provides.",
        "hasList": false
      },
      {
        "number": "3.4",
        "text": "If you do not agree with these Terms, please do not use the Platform.",
        "hasList": false
      }
    ]
  },
  {
    "number": 4,
    "title": "Words with a special meaning",
    "anchor": "#c-defs",
    "keywords": "definitions meaning glossary replacement value rental period return date lister listing",
    "subclauses": [
      {
        "number": "4.1",
        "text": "Words in these Terms have their everyday meaning, except these, which apply whether or not they begin with a capital letter:",
        "hasList": false
      },
      {
        "number": "4.2",
        "text": "Words such as “including” and “for example” introduce examples, not a complete list, and the \nsingular includes the plural.",
        "hasList": false
      }
    ],
    "definitions": [
      {
        "term": "Booking",
        "meaning": "A confirmed rental of a rental piece for a Rental Period.",
        "anchor": "#d-booking"
      },
      {
        "term": "Deposit",
        "meaning": "The refundable security deposit for a rental piece, explained in clause 20.",
        "anchor": "#d-deposit"
      },
      {
        "term": "Lister",
        "meaning": "A person or business who lists a piece with us.",
        "anchor": "#d-lister"
      },
      {
        "term": "Listing",
        "meaning": "The page on the Platform that describes a piece, including its photographs, condition grade, condition notes, measurements and what is included.",
        "anchor": "#d-listing"
      },
      {
        "term": "Listing Terms",
        "meaning": "The commercial terms for a listed piece that we confirm to its Lister in writing when we accept it, as clause 33 explains.",
        "anchor": "#d-listing-terms"
      },
      {
        "term": "Order",
        "meaning": "A confirmed purchase of a preloved piece.",
        "anchor": "#d-order"
      },
      {
        "term": "Piece",
        "meaning": "Any garment, set or item offered on the Platform, including everything its listing says is included. A rental piece is offered for rent, and a preloved piece is offered for sale after being owned, and possibly worn, before.",
        "anchor": "#d-piece"
      },
      {
        "term": "Platform",
        "meaning": "Our website, any app we offer, and our services on WhatsApp, Instagram, by phone and by email.",
        "anchor": "#d-platform"
      },
      {
        "term": "Policies",
        "meaning": "The policies listed in clause 5.",
        "anchor": "#d-policies"
      },
      {
        "term": "Rental Period",
        "meaning": "The period that starts on the day a rental piece is delivered and ends on its Return Date.",
        "anchor": "#d-rental-period"
      },
      {
        "term": "Replacement Value",
        "meaning": "The value of a rental piece shown in your booking confirmation, explained in clause 27.5.",
        "anchor": "#d-replacement-value"
      },
      {
        "term": "Return Date",
        "meaning": "The date by which a rental piece must be handed back for its return, shown before you pay and in your confirmation.",
        "anchor": "#d-return-date"
      }
    ]
  },
  {
    "number": 5,
    "title": "Our Policies, and which applies first",
    "anchor": "#c-policies",
    "keywords": "policies refund deposit care shipping privacy cookie faq precedence conflict differ",
    "subclauses": [
      {
        "number": "5.1",
        "text": "These Terms work together with our Policies, each of which forms part of your agreement with us:  \n(a) our Refund & Cancellation Policy, covering cancelling, changing and returning, and how refunds \nwork; \n(b) our Deposit Policy, covering how security deposits are collected, held and refunded;  \n(c) our Care, Cleaning & Damage Policy, covering caring for a rental piece, what counts as normal \nwear, and how damage is assessed; \n(d) our Shipping & Delivery Policy, covering where and how we deliver and collect; \n(e) our Privacy Policy and Cookie Policy, covering how we handle your personal data; and \n(f) the details on each piece’s listing, such as its condition, measurements, what is included, its \nrental windows and its deposit.",
        "hasList": true
      },
      {
        "number": "5.2",
        "text": "If they ever differ, what we have specifically agreed with you in writing for a booking or order applies \nfirst, then these Terms, then the Policies, then the listing. Where a Policy or a listing gives you a \nbetter position than these Terms, that better position applies.",
        "hasList": false
      },
      {
        "number": "5.3",
        "text": "Our Help & FAQs and other guides explain all of this in simpler words. They are there to help, but \nthey are not part of the agreement.",
        "hasList": false
      }
    ]
  },
  {
    "number": 6,
    "title": "When these Terms change",
    "anchor": "#c-changes",
    "keywords": "update change version notice previous old terms apply which version",
    "subclauses": [
      {
        "number": "6.1",
        "text": "We may update these Terms to reflect changes in the law, in our services or in how we work. The \nversion and date of the latest Terms are shown at the top of this page.",
        "hasList": false
      },
      {
        "number": "6.2",
        "text": "When a change matters to you, we will tell you before it takes effect, by email, WhatsApp or a notice \non the Platform.",
        "hasList": false
      },
      {
        "number": "6.3",
        "text": "A change never applies to a booking, order or listing already confirmed. Each is governed by the \nTerms in force when it was confirmed.",
        "hasList": false
      },
      {
        "number": "6.4",
        "text": "If you keep using the Platform after a change takes effect, the updated Terms apply to what you do \nfrom then on. If you do not agree with a change, you can stop using the Platform and close your \naccount at any time.",
        "hasList": false
      },
      {
        "number": "6.5",
        "text": "We keep every earlier version of these Terms, and we will send you the version that applied to your \nbooking, order or listing if you ask.",
        "hasList": false
      }
    ]
  },
  {
    "number": 7,
    "title": "Who can use House of Kaira",
    "anchor": "#c-eligibility",
    "keywords": "age minor adult eligible india who can use guardian parent under",
    "subclauses": [
      {
        "number": "7.1",
        "text": "To create an account, place an order or booking, make an offer or list a piece, you must be at least \n18 years old and able to enter into a binding contract under the Indian Contract Act, 1872.",
        "hasList": false
      },
      {
        "number": "7.2",
        "text": "If you are under 18 years, a parent or guardian may rent or buy on your behalf. They are then our \ncustomer, and these Terms, including responsibility for any rental piece you wear, apply to them.",
        "hasList": false
      },
      {
        "number": "7.3",
        "text": "We deliver and collect only within India, so every delivery address must be in India and in an area \nwe serve. Listers must be based in India.",
        "hasList": false
      },
      {
        "number": "7.4",
        "text": "You may not use the Platform if we have closed an account of yours for a breach of these Terms, \nunless we agree in writing.",
        "hasList": false
      }
    ]
  },
  {
    "number": 8,
    "title": "Your account",
    "anchor": "#c-account",
    "keywords": "account sign in login otp one time code google email password delete close",
    "subclauses": [
      {
        "number": "8.1",
        "text": "You can browse and save pieces without an account. To check out, make an offer or list a piece, you \nsign in with your mobile number and a one-time code, your email, or Google.",
        "hasList": false
      },
      {
        "number": "8.2",
        "text": "Please give us accurate and complete details and keep them up to date. Your mobile number should \nbe one we can reach on WhatsApp, because that is how we arrange deliveries, deposits and \nreturns.",
        "hasList": false
      },
      {
        "number": "8.3",
        "text": "Your account is personal to you. Keep your one-time codes and password private, and do not let \nanyone else use your account. You are responsible for what is done through it, unless it was done \nby someone who got access through no fault of yours. Tell us straight away if you think someone \nelse has used it.",
        "hasList": false
      },
      {
        "number": "8.4",
        "text": "Please keep to one account each. We may combine or close duplicate accounts.",
        "hasList": false
      },
      {
        "number": "8.5",
        "text": "You can delete your account from My Account at any time. If a rental is in progress, a deposit is \nwaiting to be refunded, a payout is due or an amount is owed, we settle that first. We keep the \nrecords the law requires us to keep, such as tax invoices, for as long as it requires, as our Privacy \nPolicy explains.",
        "hasList": false
      }
    ]
  },
  {
    "number": 9,
    "title": "Confirming who you are",
    "anchor": "#c-verify",
    "keywords": "identity id proof verification kyc aadhaar pan verify fraud check",
    "subclauses": [
      {
        "number": "9.1",
        "text": "To protect every piece and everyone who wears one, we may ask you to confirm your identity before \nwe confirm or dispatch a rental, accept an offer, or make a payout. We may ask for a government -\nissued photo ID, confirmation of your address, or a short call with our team.",
        "hasList": false
      },
      {
        "number": "9.2",
        "text": "We only ask for what we need for this purpose. We will never ask for your full Aadhaar number; if \nyou use Aadhaar, please share a masked copy.",
        "hasList": false
      },
      {
        "number": "9.3",
        "text": "If we cannot reasonably confirm who you are, we may decline or cancel the booking or order, and \nyou receive a full refund of anything you have paid.",
        "hasList": false
      }
    ]
  },
  {
    "number": 10,
    "title": "What we ask of everyone",
    "anchor": "#c-conduct",
    "keywords": "rules prohibited misuse fraud scraping reviews abuse harassment content",
    "subclauses": [
      {
        "number": "10.1",
        "text": "Please use the Platform lawfully, honestly and kindly. In particular, you agree not to:  \n(a) give false information, pretend to be someone else, or use a payment method without its \nowner’s permission; \n(b) book dates or make offers you do not intend to honour, or hold pieces back from others by any \nother means; \n(c) arrange to rent or buy a piece you found on House of Kaira directly from its Lister, or otherwise \naway from the Platform; \n(d) copy, scrape or reuse our listings, photographs, prices or other content, including with \nautomated tools, except as these Terms allow; \n(e) interfere with the Platform’s security or operation, or upload anything harmful, such as a virus;  \n(f) raise a payment dispute or chargeback dishonestly, for example for a rental you received and \nwore; \n(g) post fake, paid or misleading reviews, or reviews of pieces you did not rent or buy; or  \n(h) harass, abuse or threaten our team, our Listers or other customers.",
        "hasList": true
      },
      {
        "number": "10.2",
        "text": "You also agree not to upload, share or send through the Platform anything that:  \n(a) belongs to someone else and that you have no right to share; \n(b) is obscene, pornographic, paedophilic, invasive of another person’s privacy including bodily \nprivacy, insulting or harassing on the basis of gender, racially or ethnically objectionable, \n\n \n \nrelating to or encouraging money laundering or gambling, or promoting enmity between groups \non the grounds of religion or caste with the intent to incite violence; \n(c) is harmful to a child; \n(d) infringes any patent, trade mark, copyright or other proprietary right; \n(e) deceives or misleads anyone about where it came from, or knowingly and intentionally \ncommunicates misinformation or information that is patently false and untrue or misleading;  \n(f) impersonates another person; \n(g) threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with \nother countries or public order, incites the commission of any cognisable offence, prevents the \ninvestigation of any offence, or insults any other nation; \n(h) contains a software virus or any other code designed to interrupt, destroy or limit the functioning \nof any computer resource; \n(i) has been created or altered, including with artificial intelligence, to misrepresent a real person, \nevent or piece; or \n(j) breaks any law for the time being in force.",
        "hasList": true
      },
      {
        "number": "10.3",
        "text": "If you break this clause, we may remove the content, suspend or close your account and cancel \nopen orders, as clause 56 explains. Breaking the law through the Platform may also make you liable \nto penalties or punishment under the Information Technology Act, 2000 and other laws, and where \nthe law requires it, we report offences to the authorities.",
        "hasList": false
      }
    ]
  },
  {
    "number": 11,
    "title": "How we keep in touch",
    "anchor": "#c-comms",
    "keywords": "whatsapp sms email calls messages marketing unsubscribe fraud scam official",
    "subclauses": [
      {
        "number": "11.1",
        "text": "We send messages about your bookings, orders, deposits, returns, offers, listings and payouts by \nWhatsApp, SMS, email or phone. They are part of how we look after what you have asked for, so \nthey continue while you have anything open with us.",
        "hasList": false
      },
      {
        "number": "11.2",
        "text": "We send marketing, such as new arrivals and offers, only if you have chosen to receive it, and you \ncan stop it at any time from your notification settings or by replying to any message.",
        "hasList": false
      },
      {
        "number": "11.3",
        "text": "Instructions and confirmations you send us from the phone number or email address on your \naccount, for example agreeing new dates or accepting a deduction, are treated as coming from you.",
        "hasList": false
      },
      {
        "number": "11.4",
        "text": "We only contact you from the numbers, email addresses and accounts listed on our Contact page, \nand we will never ask for your card details, UPI PIN or one-time codes. If anyone claiming to be us \nasks for these, or asks you to pay into an account that is not ours, please do not pay, and tell us \nstraight away. We are not responsible for a payment made to someone else, unless it happened \nbecause we failed to keep your information safe.",
        "hasList": false
      },
      {
        "number": "11.5",
        "text": "If we record a call, to keep an accurate note of what was agreed, we will tell you at the start of it.",
        "hasList": false
      }
    ]
  },
  {
    "number": 12,
    "title": "How House of Kaira works",
    "anchor": "#c-roles",
    "keywords": "lister owner seller who contract responsible agent consignment invoice ownership",
    "subclauses": [
      {
        "number": "12.1",
        "text": "The pieces on House of Kaira come from the wardrobes of people across India and from designer \nboutiques who list with us, whom we call Listers. A Lister owns their piece until it is sold. \nOccasionally a piece belongs to House of Kaira itself, and these Terms apply to it in exactly the \nsame way.",
        "hasList": false
      },
      {
        "number": "12.2",
        "text": "We review, grade, photograph and look after every piece, and we rent and sell pieces on behalf of \ntheir Listers. When you rent or buy, we do so in our own name: your contract is with us, we take your \npayment, we issue your invoice, and we are responsible to you for your booking or order under these \nTerms. You never have to deal with a Lister.",
        "hasList": false
      },
      {
        "number": "12.3",
        "text": "When you rent a piece, ownership stays with its Lister throughout, and you have the right to use the \npiece for your Rental Period on these Terms. When you buy a preloved piece, ownership passes to \nyou as clause 31 explains.",
        "hasList": false
      }
    ]
  },
  {
    "number": 13,
    "title": "Our authenticity promise",
    "anchor": "#c-authentic",
    "keywords": "authentic genuine fake replica copy counterfeit authenticated by hok designer",
    "subclauses": [
      {
        "number": "13.1",
        "text": "Every piece is reviewed by our team before it goes live. We examine its craftsmanship, construction, \nmaterials and labels, and where they exist, we ask for provenance such as the original bill, care \nlabels or a designer certificate.",
        "hasList": false
      },
      {
        "number": "13.2",
        "text": "When a piece is listed under a designer’s name, or carries the Authenticated by HOK mark, we \nstand behind it as a genuine piece by that designer.",
        "hasList": false
      },
      {
        "number": "13.3",
        "text": "If it is ever shown that a piece is not what we said it was, you are entitled to a full refund. For a \npurchase, that is everything you paid for it, including GST and delivery, once the piece is returned to \nus in the condition it reached you, apart from normal wear. For a rental, it is your rental fee and \ndelivery charges, and your deposit in full.",
        "hasList": false
      },
      {
        "number": "13.4",
        "text": "To raise a concern, send us your reasons and photographs. We review every concern, and we \naccept a written opinion from the designer’s house or a recognised independent authenticator as \nevidence. This promise has no time limit.",
        "hasList": false
      },
      {
        "number": "13.5",
        "text": "Designer names are used only to describe pieces accurately. Unless we clearly say a designer is \none of our partners, House of Kaira is independent of, and not endorsed by, any designer whose \npieces appear on the Platform, and their names and trade marks belong to them.",
        "hasList": false
      }
    ]
  },
  {
    "number": 14,
    "title": "Condition, measurements and what is included",
    "anchor": "#c-condition",
    "keywords": "condition grade pristine excellent good fair wear flaw measurements size colour",
    "subclauses": [
      {
        "number": "14.1",
        "text": "Every listing shows the piece’s condition grade, written condition notes, actual garment \nmeasurements and what is included. We grade every piece in the same way:  \n(a) Pristine: unworn, or worn once for a short photoshoot, with no visible wear; tags may still be \nattached; \n(b) Excellent: worn once for a full-day event and professionally cleaned, with no visible damage, \nalteration or significant bead loss; any minor imperfection is disclosed and photographed;  \n(c) Good: worn two or three times, with any minor imperfection clearly photographed and \ndisclosed; and \n(d) Fair: showing visible signs of wear, which are photographed and described in the listing; offered \nfor rent only.",
        "hasList": true
      },
      {
        "number": "14.2",
        "text": "Rental pieces are graded again after every return, so the grade you see is current. Past alterations \nare disclosed in the condition notes: what was changed and, where we know, by whom.",
        "hasList": false
      },
      {
        "number": "14.3",
        "text": "The listing is always your reference. Anything photographed or written in the condition notes is part \nof the piece’s condition, not a fault.",
        "hasList": false
      },
      {
        "number": "14.4",
        "text": "Occasionwear is often made by hand, so small irregularities in embroidery, embellishment, weave or \ndye are part of its character, not faults. Colours can look slightly different from one screen to another, \nespecially deep reds and pastels. A difference clearly greater than this means the piece is not as \ndescribed.",
        "hasList": false
      },
      {
        "number": "14.5",
        "text": "Measurements are taken by our team from the actual piece, allowing for the small variation of \nmeasuring by hand. The height a piece suits best is given as a guide.",
        "hasList": false
      },
      {
        "number": "14.6",
        "text": "Only what the listing says is included comes with the piece. Jewellery, footwear, accessories, \noriginal tags, boxes and certificates are included only when the listing says so.",
        "hasList": false
      }
    ]
  },
  {
    "number": 15,
    "title": "Photographs and styled images",
    "anchor": "#c-imagery",
    "keywords": "photos images pictures ai artificial intelligence editorial styled render real actual",
    "subclauses": [
      {
        "number": "15.1",
        "text": "The photographs of a piece in its listing show that actual piece, and every imperfection we know of is \nphotographed and written into the listing.",
        "hasList": false
      },
      {
        "number": "15.2",
        "text": "Listings and other pages may also show styled or editorial images, including images created or \nenhanced with digital tools such as artificial intelligence, to suggest how a piece might be worn. \nEvery such image is labelled, is for illustration only, and is never the reference for a piece’s \ncondition, colour or fit. Jewellery, props and styling in any image are not included unless the listing \nsays so.",
        "hasList": false
      },
      {
        "number": "15.3",
        "text": "If you would like to see a detail more closely, ask us, and we will share further photographs of the \nactual piece.",
        "hasList": false
      }
    ]
  },
  {
    "number": 16,
    "title": "Prices, taxes and promo codes",
    "anchor": "#c-prices",
    "keywords": "price gst tax total charges hidden retail original discount reduction promo code",
    "subclauses": [
      {
        "number": "16.1",
        "text": "Prices are in Indian rupees. Rental fees and preloved prices are shown before GST, which is added \nat checkout at 18% on rentals and 5% on preloved pieces, and charged as the law requires for the \nplace of delivery. Before you pay, you see the full amount payable, including GST and any delivery \ncharge, and the deposit for a rental. Nothing is added afterwards.",
        "hasList": false
      },
      {
        "number": "16.2",
        "text": "Rental prices are fixed. Offers can be made only on preloved pieces, as clause 30 explains.",
        "hasList": false
      },
      {
        "number": "16.3",
        "text": "Where a listing shows a piece’s original retail price, it comes from the Lister’s records, such as the \noriginal bill, and is shown for reference only. It is not a price at which we have offered the piece.",
        "hasList": false
      },
      {
        "number": "16.4",
        "text": "If we reduce the price of a piece, we show its earlier price beside the new one, and the earlier price \nis the lowest price at which we offered that piece in the 30 days before the reduction.",
        "hasList": false
      },
      {
        "number": "16.5",
        "text": "A change in price never affects a booking or order already confirmed, and we cannot adjust the price \nof a piece after you have bought it.",
        "hasList": false
      },
      {
        "number": "16.6",
        "text": "If a price or another important detail is shown wrongly because of an obvious error, for example a \nmissing digit, we may cancel the booking or order before dispatch, tell you straight away, and refund \nyou in full. Such a cancellation is covered by clause 43.",
        "hasList": false
      },
      {
        "number": "16.7",
        "text": "Promo codes apply to rental fees and prices, never to a deposit. Each code has its own terms and \nexpiry, shown with it; it has no cash value, cannot be combined with another code unless its terms \nsay so, and may be withdrawn if it is misused.",
        "hasList": false
      }
    ]
  },
  {
    "number": 17,
    "title": "How pieces are ordered",
    "anchor": "#c-ranking",
    "keywords": "sort order ranking recommended search results sponsored featured paid",
    "subclauses": [
      {
        "number": "17.1",
        "text": "When you browse, you can choose to see pieces by price, by how recently they were listed, by \npopularity, by condition, or, for rentals, by how soon they are free.",
        "hasList": false
      },
      {
        "number": "17.2",
        "text": "If you do not choose, pieces appear in our Recommended order. Its main factors, from the most to \nthe least important, are: \n(a) whether a piece is available in your size and for your dates, where you have told us these;  \n(b) how closely it matches your search and filters; \n(c) our team’s curation, including new arrivals and seasonal edits; \n(d) how recently it was listed; and \n(e) how often it is saved, rented or bought.",
        "hasList": true
      },
      {
        "number": "17.3",
        "text": "No Lister or designer can pay to have a piece shown higher. If a piece is ever shown because \nsomeone has paid for it, it will be clearly labelled as sponsored.",
        "hasList": false
      }
    ]
  },
  {
    "number": 18,
    "title": "Booking a rental",
    "anchor": "#c-booking",
    "keywords": "book booking confirm dates calendar hold reserve wishlist bag someone else",
    "subclauses": [
      {
        "number": "18.1",
        "text": "You choose a piece, its size and your dates on its availability calendar. The dates shown as \navailable are those we can still deliver for, based on where you are.",
        "hasList": false
      },
      {
        "number": "18.2",
        "text": "Your booking is confirmed once you have paid the rental fee, GST and any delivery charge and we \nhave sent your confirmation. From then, your dates are held for you alone. Saving a piece to your \nwishlist or adding it to your bag does not hold it.",
        "hasList": false
      },
      {
        "number": "18.3",
        "text": "Each piece is its own booking, with its own dates, even when you book several together.",
        "hasList": false
      },
      {
        "number": "18.4",
        "text": "Very rarely, two people pay for the same piece and dates at the same moment. The booking we \nreceived first stands, and the other is cancelled and refunded under clause 43.",
        "hasList": false
      },
      {
        "number": "18.5",
        "text": "You may book for someone else, for example your mother or a friend, and have the piece sent to \ntheir address. The booking and the deposit stay in your name, and you remain responsible for the \npiece under these Terms while it is with them.",
        "hasList": false
      }
    ]
  },
  {
    "number": 19,
    "title": "Your Rental Period",
    "anchor": "#c-period",
    "keywords": "window days standard extended start end return date extend extension early",
    "subclauses": [
      {
        "number": "19.1",
        "text": "Each piece offers a standard rental window, usually 4 days, and often an extended window, usually \n7 days. Its listing shows the windows and the price of each.",
        "hasList": false
      },
      {
        "number": "19.2",
        "text": "Your Rental Period starts on the day your piece is delivered, which is 2 days before your event, and \nends on your Return Date. Both dates are shown before you pay and in your confirmation.",
        "hasList": false
      },
      {
        "number": "19.3",
        "text": "You may wear the piece as often as you like during your Rental Period.",
        "hasList": false
      },
      {
        "number": "19.4",
        "text": "Changing your dates, swapping to another piece, moving to a shorter window, or extending your \nrental is handled as the Refund & Cancellation Policy explains. Extra days are charged at the piece’s \ndaily rate.",
        "hasList": false
      },
      {
        "number": "19.5",
        "text": "Returning a piece early does not reduce the rental fee.",
        "hasList": false
      }
    ]
  },
  {
    "number": 20,
    "title": "Your security deposit",
    "anchor": "#c-deposit",
    "keywords": "deposit security refundable amount upi bank transfer whatsapp deduction refund",
    "subclauses": [
      {
        "number": "20.1",
        "text": "Every rental piece carries a refundable security deposit, set for that piece and shown on its listing \nbefore you book. It carries no GST, and no interest is paid on it.",
        "hasList": false
      },
      {
        "number": "20.2",
        "text": "The listing tells you how the deposit is paid: at checkout with your rental fee, or by UPI or bank \ntransfer to our account after our team contacts you on WhatsApp within 24 hours of your booking. \nWe dispatch the piece only once the deposit has reached us. If it has not by the dispatch date, we \nmay release your booking, which is then treated as a cancellation by you on that date.",
        "hasList": false
      },
      {
        "number": "20.3",
        "text": "We hold the deposit as security for what you owe under these Terms, and may use it towards:  \n(a) late return charges under clause 26; \n(b) the cost of repair or specialist cleaning for damage beyond normal wear, under clause 27; \n(c) the cost of replacing a part of the piece that is missing; and \n(d) the Replacement Value of a piece that is lost, stolen, not returned or damaged beyond repair.",
        "hasList": true
      },
      {
        "number": "20.4",
        "text": "We inspect every piece within 24 hours of it reaching us. If all is well, your full deposit is refunded \nwithin 3 to 5 business days. A deposit paid at checkout goes back to your original payment method, \nand one paid by UPI or bank transfer goes back to the account it came from. You can follow each \nstep in the Deposit Tracker in My Account.",
        "hasList": false
      },
      {
        "number": "20.5",
        "text": "If a deduction is needed, we photograph and document the reason and tell you the amount before \nanything is deducted. If you disagree, a senior member of our team who was not part of the original \ninspection reviews it, and nothing is final until you have had your say.",
        "hasList": false
      },
      {
        "number": "20.6",
        "text": "Your deposit is security, not a limit on what you may owe. If the charges under clause 26 or clause \n27 add up to more than your deposit, we will first share the full assessment with you and talk it \nthrough. You agree to pay the difference we then confirm within 7 days of the date of our invoice. \nFor example, if a repair costs ₹22,000 and your deposit is ₹15,000, your deposit goes towards the \nrepair and you pay the remaining ₹7,000.",
        "hasList": false
      },
      {
        "number": "20.7",
        "text": "The deposit is kept apart from your other payments. It is never used towards a rental fee or a future \nbooking.",
        "hasList": false
      }
    ]
  },
  {
    "number": 21,
    "title": "Caring for the piece",
    "anchor": "#c-care",
    "keywords": "care look after store hanger perfume makeup mehendi haldi food drink alter wash",
    "subclauses": [
      {
        "number": "21.1",
        "text": "We ask one thing of everyone who rents with us: treat the piece as your own. It was part of \nsomeone’s most special day, and it will be part of someone else’s next.",
        "hasList": false
      },
      {
        "number": "21.2",
        "text": "While the piece is with you, you agree to: \n(a) keep it on its padded hanger in its garment bag, somewhere cool and away from direct sunlight, \nwhenever you are not wearing it; \n(b) keep food, drink, perfume, makeup, mehendi, haldi, sindoor and colour at a careful distance, \nand let perfume and makeup dry before you dress; \n(c) never alter it in any way, including stitching, hemming, cutting or taking it in, as any alteration is \ntreated as damage; \n(d) never wash, dry-clean, spot clean, steam or iron it, as all cleaning is done by us and is included \nin the price; \n(e) take extra care at outdoor venues and shoots, where water, sand, mud and rough surfaces can \ncause damage; and \n(f) tell us straight away if anything happens to it, however small, and not try to repair or clean it \nyourself. For a spill, gently blot it with a clean tissue and do not rub.",
        "hasList": true
      },
      {
        "number": "21.3",
        "text": "Our Care, Cleaning & Damage Policy explains how to look after each kind of piece.",
        "hasList": false
      }
    ]
  },
  {
    "number": 22,
    "title": "How a rental piece may be used",
    "anchor": "#c-use",
    "keywords": "use personal photoshoot pre wedding shoot commercial campaign lend sublet sub",
    "subclauses": [
      {
        "number": "22.1",
        "text": "A rental is for personal wear by you, or by the person you booked it for, at your own celebrations, \nincluding personal photoshoots such as a pre-wedding shoot.",
        "hasList": false
      },
      {
        "number": "22.2",
        "text": "You may not: \n(a) lend, sub-rent, sell, pawn or give the piece to anyone, or let anyone other than the person you \nbooked it for wear it; \n(b) use it for a paid or commercial purpose, such as a brand campaign, a paid collaboration, a film, \na show or a pageant, without our written consent; or \n(c) take it outside India, unless we agree in writing before dispatch.",
        "hasList": true
      },
      {
        "number": "22.3",
        "text": "If a piece is used in a way these Terms do not allow, you are responsible for any damage that \nfollows, whatever its cause, and we may end your rental and ask for the piece back straight away.",
        "hasList": false
      }
    ]
  },
  {
    "number": 23,
    "title": "Responsibility for the piece while it is with you",
    "anchor": "#c-risk",
    "keywords": "responsible liability loss theft stolen damage risk fault insurance section 152 bailment",
    "subclauses": [
      {
        "number": "23.1",
        "text": "The piece is your responsibility from the moment it is delivered to you, or to the person you asked us \nto deliver it to, until it is collected by our courier or dropped at the courier point we tell you to use.",
        "hasList": false
      },
      {
        "number": "23.2",
        "text": "During that time, you are responsible for any loss, theft, destruction of or damage to the piece, \nwhether or not you were at fault, except: \n(a) normal wear, as clause 27.1 describes; \n(b) anything recorded in its listing or in our record of its condition at dispatch; and  \n(c) damage caused by our packaging or handling.",
        "hasList": true
      },
      {
        "number": "23.3",
        "text": "This is a special contract for the purposes of section 152 of the Indian Contract Act, 1872. It means \nyou take on more responsibility for the piece than the law would otherwise place on you, which is \nwhy we ask you to take the care in clause 21 and to keep the piece with you or somewhere secure. \nYou may wish to check whether your own insurance covers items in your care.",
        "hasList": false
      },
      {
        "number": "23.4",
        "text": "Once our courier has collected the piece, or you have dropped it at the courier point we told you to \nuse, you are no longer responsible for anything that happens to it in transit. Keep your pickup or \ndrop-off receipt until your deposit is refunded.",
        "hasList": false
      },
      {
        "number": "23.5",
        "text": "We record the condition of every piece, with photographs, before it is dispatched. That record, the \nlisting and any photographs you send us on arrival are what every assessment is based on.",
        "hasList": false
      }
    ]
  },
  {
    "number": 24,
    "title": "When your piece arrives",
    "anchor": "#c-arrival",
    "keywords": "arrive delivery try on fit wrong piece missing not fresh damaged parcel tampered",
    "subclauses": [
      {
        "number": "24.1",
        "text": "Please unpack the piece carefully and try it on as soon as you can. If anything is not right, whether it \ndoes not fit, is not fresh, is not as described, is the wrong piece, or is missing something the listing \nincludes, message us within 24 hours of delivery with photographs, so we can help while there is still \ntime before your event.",
        "hasList": false
      },
      {
        "number": "24.2",
        "text": "If the parcel looks damaged or tampered with, photograph it before you open it, and record a short \nvideo as you unpack it if you can.",
        "hasList": false
      },
      {
        "number": "24.3",
        "text": "What we do in each case is set out in the Refund & Cancellation Policy. Telling us within 24 hours \nlets us put things right in time and assess the piece exactly as it arrived. If you tell us later, we will \nstill consider it fairly, though we may need more to show that the issue was there on delivery.",
        "hasList": false
      },
      {
        "number": "24.4",
        "text": "If the piece arrives as described, the rental fee is not refunded because you have changed your mind \nor decided not to wear it. Please still return it on time, and your deposit will come back in full after \ninspection.",
        "hasList": false
      }
    ]
  },
  {
    "number": 25,
    "title": "Returning the piece",
    "anchor": "#c-return",
    "keywords": "return pickup collect courier drop blue dart label garment bag pack missed pickup",
    "subclauses": [
      {
        "number": "25.1",
        "text": "Please return the piece by your Return Date in the way your confirmation sets out, either by handing \nit to our courier at the pickup we arrange with you, or by dropping it at the courier point we tell you to \nuse.",
        "hasList": false
      },
      {
        "number": "25.2",
        "text": "Wrap it in the tissue it came in, place it in its garment bag, and include every part of the outfit and \nanything else that came with it.",
        "hasList": false
      },
      {
        "number": "25.3",
        "text": "Please be available for your pickup, or reachable on the number on your booking. If a pickup is \nmissed because nobody was available, the days until the next pickup may be charged as a late \nreturn. If a pickup is delayed by us or our courier, you are never charged.",
        "hasList": false
      },
      {
        "number": "25.4",
        "text": "Hand the piece only to our courier, never to anyone else, and keep your receipt.",
        "hasList": false
      }
    ]
  },
  {
    "number": 26,
    "title": "Late returns",
    "anchor": "#c-late",
    "keywords": "late return extra day fee charge daily rate extension not returned delay",
    "subclauses": [
      {
        "number": "26.1",
        "text": "If a piece comes back after your Return Date because of you, a late return charge of one day’s rental \nrate applies for each extra day, because another customer may be waiting for it. This charge is our \ngenuine estimate of what a late return costs, not a penalty.",
        "hasList": false
      },
      {
        "number": "26.2",
        "text": "If you think you may be late, tell us as early as you can. An extension agreed before your Return \nDate is charged at the daily rate instead, and is usually kinder on both sides.",
        "hasList": false
      },
      {
        "number": "26.3",
        "text": "Any late charge is shown to you first, and is taken from your deposit unless you would rather pay it \nseparately.",
        "hasList": false
      },
      {
        "number": "26.4",
        "text": "If a piece has still not been returned 5 days after your Return Date, and you have not agreed a new \ndate with us, we treat it as not returned: it is then handled as a total loss under clause 27.4, and we \nmay take the steps in clause 28.",
        "hasList": false
      }
    ]
  },
  {
    "number": 27,
    "title": "Damage and loss",
    "anchor": "#c-damage",
    "keywords": "damage stain tear burn normal wear repair replacement value lost stolen total",
    "subclauses": [
      {
        "number": "27.1",
        "text": "Normal wear is expected and never charged: a few loose threads, a little embellishment loss, light \ncreasing, and the small things that happen when a piece is worn and enjoyed.",
        "hasList": false
      },
      {
        "number": "27.2",
        "text": "Damage is anything beyond normal wear, such as stains, tears, burns, significant bead or \nembroidery loss, or any alteration. We assess it when the piece comes back, as our Care, Cleaning \n& Damage Policy explains.",
        "hasList": false
      },
      {
        "number": "27.3",
        "text": "For damage that can be repaired or specially cleaned, you are responsible for the reasonable cost of \ndoing so, which we show you, with photographs, before anything is deducted. If a missing part can \nbe replaced, you are responsible for the reasonable cost of replacing that part, not the value of the \nwhole piece.",
        "hasList": false
      },
      {
        "number": "27.4",
        "text": "If a piece is lost, stolen, not returned or damaged beyond repair, it is treated as a total loss: your \ndeposit is held, and you are responsible for the piece’s Replacement Value, less your deposit. We \nalways speak with you first and show you how the amount was worked out.",
        "hasList": false
      },
      {
        "number": "27.5",
        "text": "A piece’s Replacement Value is shown in your booking confirmation. It reflects what it would cost to \nreplace the piece, taking into account its designer, its original price and its condition, and you are \nnever asked to pay more than it for the loss of the piece.",
        "hasList": false
      },
      {
        "number": "27.6",
        "text": "If a piece is stolen, please report the theft to the police and send us a copy of the report. It supports \nany insurance claim, and it protects you.",
        "hasList": false
      }
    ]
  },
  {
    "number": 28,
    "title": "If a piece is not returned",
    "anchor": "#c-recovery",
    "keywords": "not returned keep sell pawn police criminal breach of trust legal action court",
    "subclauses": [
      {
        "number": "28.1",
        "text": "Keeping a rental piece beyond your Rental Period without our agreement, or selling, pawning or \ngiving it away, is a breach of these Terms, and may also be criminal breach of trust or another \noffence under the Bharatiya Nyaya Sanhita, 2023.",
        "hasList": false
      },
      {
        "number": "28.2",
        "text": "We will always try to resolve it with you first. If we cannot, we may recover the piece, and any \namount you owe, through the courts, report the matter to the police, and share your details with them \nand with our lawyers for that purpose.",
        "hasList": false
      },
      {
        "number": "28.3",
        "text": "Amounts you owe under this Part are a debt you agree to pay, and we may ask a court to award us \nthe reasonable costs of recovering them.",
        "hasList": false
      }
    ]
  },
  {
    "number": 29,
    "title": "Buying a preloved piece",
    "anchor": "#c-pre-buy",
    "keywords": "buy purchase preloved order dispatch one of a kind hold reserve keep aside",
    "subclauses": [
      {
        "number": "29.1",
        "text": "Every preloved piece is one of a kind. It becomes yours once you have completed payment and we \nhave confirmed your order; until then, including while it is in your bag, it remains available to others.",
        "hasList": false
      },
      {
        "number": "29.2",
        "text": "We dispatch preloved pieces within 2 business days of your order, professionally cleaned and \ncarefully packed.",
        "hasList": false
      },
      {
        "number": "29.3",
        "text": "Please read the condition notes, look closely at the photographs and check the measurements \nbefore you buy, and ask us about anything you are unsure of. We are always glad to help before you \ndecide.",
        "hasList": false
      }
    ]
  },
  {
    "number": 30,
    "title": "Making an offer",
    "anchor": "#c-offer",
    "keywords": "offer negotiate quote minimum counter accepted reserve pay bargain",
    "subclauses": [
      {
        "number": "30.1",
        "text": "On a preloved piece, you may offer a price instead of buying at the listed price. Each piece shows \nthe lowest offer we can consider.",
        "hasList": false
      },
      {
        "number": "30.2",
        "text": "We review every offer and reply within 24 hours, on WhatsApp or email, to accept it, suggest a \ncounter offer, or let you know it is not possible this time. If an offer is not accepted, you are welcome \nto make another.",
        "hasList": false
      },
      {
        "number": "30.3",
        "text": "An offer does not reserve the piece, and it becomes a purchase only when you  complete payment at \nthe agreed price. Until then, the piece remains available to others, and you are free not to go ahead.",
        "hasList": false
      },
      {
        "number": "30.4",
        "text": "An accepted offer stays open for the time we tell you when we accept it. The agreed price does not \ninclude GST or delivery, which are added at checkout.",
        "hasList": false
      },
      {
        "number": "30.5",
        "text": "Offers can be made only on preloved pieces, never on rentals.",
        "hasList": false
      }
    ]
  },
  {
    "number": 31,
    "title": "Delivery, ownership and responsibility",
    "anchor": "#c-pre-own",
    "keywords": "ownership title risk delivered transit insured courier lost missed delivery refused",
    "subclauses": [
      {
        "number": "31.1",
        "text": "A preloved piece becomes yours, and your responsibility, when it is delivered to you or to the person \nyou asked us to deliver it to. Until then it is our responsibility, and it is insured while in transit.",
        "hasList": false
      },
      {
        "number": "31.2",
        "text": "If the courier loses your parcel, we refund you in full as soon as the loss is confirmed.",
        "hasList": false
      },
      {
        "number": "31.3",
        "text": "If a delivery fails because nobody was available, or a parcel in good condition is refused, the piece \ncomes back to us and we will contact you. If you would rather not have it delivered again, we refund \nthe price less the delivery charges both ways.",
        "hasList": false
      }
    ]
  },
  {
    "number": 32,
    "title": "If a preloved piece is not as described",
    "anchor": "#c-pre-issue",
    "keywords": "final sale return not as described wrong item damaged missing flaw later hidden",
    "subclauses": [
      {
        "number": "32.1",
        "text": "Preloved pieces are a final sale once dispatched. They cannot be returned because of fit, a change \nof heart, or because they were bought as a gift, which is why every listing shows full measurements, \nhonest photographs, the condition grade and detailed notes.",
        "hasList": false
      },
      {
        "number": "32.2",
        "text": "You are always protected if something is wrong. If a piece is not as described, is damaged, is the \nwrong piece, or is missing something the listing includes, message us within 24 hours of delivery \nwith photographs. Please keep the House of Kaira tag attached, and do not wear, wash or alter the \npiece, until the issue is resolved.",
        "hasList": false
      },
      {
        "number": "32.3",
        "text": "Where a claim is accepted, the remedies, including a full refund when the piece is returned or, if you \nwould prefer to keep it, a fair partial refund, are set out in the Refund & Cancellation Policy.",
        "hasList": false
      },
      {
        "number": "32.4",
        "text": "If you find a significant flaw that was not disclosed and that you could not reasonably have noticed \nwhen the piece arrived, tell us as soon as you find it, and within 30 days of delivery. As long as the \npiece has not been worn beyond trying it on, washed or altered, we treat it as not as described.",
        "hasList": false
      },
      {
        "number": "32.5",
        "text": "Once a piece has been altered, washed or worn beyond a quick try-on, we can no longer accept a \nclaim about how it arrived, because we cannot tell. Please check everything carefully before you \ntake it to your tailor.",
        "hasList": false
      },
      {
        "number": "32.6",
        "text": "Once a piece is yours, you are free to have it tailored, and when you are ready for its next chapter, \nyou can list it with us. \n\n \n \n\nthe Lister Terms & Conditions your submission form refers to.",
        "hasList": false
      }
    ]
  },
  {
    "number": 33,
    "title": "Listing with us",
    "anchor": "#c-lister-start",
    "keywords": "list lister submit submission review accept listing terms commission share",
    "subclauses": [
      {
        "number": "33.1",
        "text": "This Part applies when you submit a piece to rent out or sell through House of Kaira. It forms the \nLister Terms & Conditions you accept when you submit, and the rest of these Terms apply to you as \nwell.",
        "hasList": false
      },
      {
        "number": "33.2",
        "text": "Submitting a piece is free and commits you to nothing. Our team reviews every submission and \nreplies on WhatsApp within 48 hours. We may decline a piece without giving a reason.",
        "hasList": false
      },
      {
        "number": "33.3",
        "text": "When we accept your piece, we confirm its Listing Terms to you in writing, by email or WhatsApp: \nwhether it will be rented, sold or both, its price, your share of each rental and sale, the value we \nagree for the piece, and anything else particular to it. Nothing goes live until you have confirmed \nthem, and they change only with your written agreement.",
        "hasList": false
      }
    ]
  },
  {
    "number": 34,
    "title": "What you promise us",
    "anchor": "#c-lister-promise",
    "keywords": "owner ownership genuine authentic stolen disclosure photos edited ai",
    "subclauses": [
      {
        "number": "34.1",
        "text": "When you submit a piece, and for as long as it is listed, you promise that: \n(a) you are its legal owner, or have the owner’s authority to list it, and nobody else has any claim \nover it; \n(b) it is genuine and by the designer you name, and is not a copy, a replica or an “inspired by” \npiece presented as a designer original; \n(c) it is not stolen, and is not the subject of any dispute, loan or charge; \n(d) everything you tell us about it is true and complete, including how often it has been worn, every \nalteration, repair and flaw you know of, and anything else that affects its condition, such as \nsmoke, perfume or damp; \n(e) the photographs you send show the actual piece, and have not been edited, filtered or altered, \nincluding with artificial intelligence, in any way that hides a flaw or changes how it looks;  \n(f) it contains nothing the law does not allow to be sold, such as material from a species protected \nunder the Wildlife (Protection) Act, 1972; and \n(g) you will not rent or sell it anywhere else while it is listed with us, without first withdrawing it under \nclause 38.",
        "hasList": true
      },
      {
        "number": "34.2",
        "text": "If any of these promises is untrue, we may remove the piece, cancel affected bookings and orders, \nand hold back payouts for it. You are responsible for what we have had to refund or pay to \ncustomers as a result, with our reasonable costs, and we may close your account.",
        "hasList": false
      }
    ]
  },
  {
    "number": 35,
    "title": "How your piece is priced and presented",
    "anchor": "#c-lister-price",
    "keywords": "price pricing photograph photos listing approve offers minimum featured pause",
    "subclauses": [
      {
        "number": "35.1",
        "text": "We suggest a price for your piece based on its designer, category, condition and demand, and agree \nit with you before it goes live.",
        "hasList": false
      },
      {
        "number": "35.2",
        "text": "We photograph your piece and share the photographs with you before it goes live. We write its \nlisting, including its condition grade and notes, to our honest disclosure standard, and every flaw we \nknow of is disclosed.",
        "hasList": false
      },
      {
        "number": "35.3",
        "text": "Where your piece is for sale, we may accept offers from buyers at or above the minimum price we \nhave agreed with you.",
        "hasList": false
      },
      {
        "number": "35.4",
        "text": "We decide how pieces are presented, featured and ordered on the Platform, as clause 17 explains, \nand we may pause a listing at any time, for example for cleaning, repair or seasonal planning.",
        "hasList": false
      }
    ]
  },
  {
    "number": 36,
    "title": "How we look after your piece",
    "anchor": "#c-lister-care",
    "keywords": "collection pickup custody care cleaning repair loss damage compensation",
    "subclauses": [
      {
        "number": "36.1",
        "text": "We arrange collection of your piece from you. While it is with us, we look after it with the care a \ncareful owner would take of their own, and we have it professionally cleaned before and after every \nrental.",
        "hasList": false
      },
      {
        "number": "36.2",
        "text": "If your piece stays with you until it is rented or sold, you agree to keep it clean, safe and in the \ncondition its listing describes, and to hand it over promptly when we arrange collection. If you cannot, \nand we have to cancel a booking or order as a result, you are responsible for what we have had to \nrefund or pay to the customer.",
        "hasList": false
      },
      {
        "number": "36.3",
        "text": "Normal wear from rentals is expected, and you will not be asked to bear it. Before your piece first \ngoes live, we may have it cleaned or repaired so it is ready to list, and if extensive work is needed, \nwe discuss it, and its cost, with you first.",
        "hasList": false
      },
      {
        "number": "36.4",
        "text": "If your piece is lost, or damaged beyond normal wear, while it is with us or with a renter, we pursue \nthe renter for the loss and compensate you as your Listing Terms set out.",
        "hasList": false
      }
    ]
  },
  {
    "number": 37,
    "title": "Your payouts",
    "anchor": "#c-lister-payout",
    "keywords": "payout earnings paid bank upi share commission tds tax pan when timeline",
    "subclauses": [
      {
        "number": "37.1",
        "text": "Your share of each rental and sale, and how it is calculated, is set out in your Listing Terms. A \ndeposit, GST and delivery charges are never part of it.",
        "hasList": false
      },
      {
        "number": "37.2",
        "text": "We pay your share within 3 working days: for a rental, after the rental has ended and the piece has \ncome back to us and been inspected; for a sale, after the buyer has received the piece. We pay only \ninto a bank account or UPI ID in your own name.",
        "hasList": false
      },
      {
        "number": "37.3",
        "text": "If a sale is reversed because a buyer’s claim is accepted, no payout is due for it. If one has already \nbeen made, we may recover it from you or set it off against future payouts, unless the claim arose \nfrom something that happened while the piece was in our care.",
        "hasList": false
      },
      {
        "number": "37.4",
        "text": "Where the law requires us to deduct or collect tax from a payout, we do so and give you the details, \nand we may ask for your PAN for this purpose. You are responsible for any tax on your earnings.",
        "hasList": false
      },
      {
        "number": "37.5",
        "text": "We may set off any amount you owe us under these Terms against payouts due to you.",
        "hasList": false
      }
    ]
  },
  {
    "number": 38,
    "title": "Pausing or withdrawing your piece",
    "anchor": "#c-lister-withdraw",
    "keywords": "withdraw pause take back unlist return piece change mind",
    "subclauses": [
      {
        "number": "38.1",
        "text": "You may pause or withdraw your piece at any time, but bookings and sales already confirmed must \nbe honoured.",
        "hasList": false
      },
      {
        "number": "38.2",
        "text": "A piece listed for sale can be withdrawn at any time before a buyer completes payment.",
        "hasList": false
      },
      {
        "number": "38.3",
        "text": "We return your piece to you promptly after you withdraw it, or after its last confirmed booking ends if \nthat is later, as your Listing Terms set out.",
        "hasList": false
      },
      {
        "number": "38.4",
        "text": "If we can no longer list your piece, for example because it no longer meets our standard, we will tell \nyou why and return it to you.",
        "hasList": false
      }
    ]
  },
  {
    "number": 39,
    "title": "Paying",
    "anchor": "#c-paying",
    "keywords": "pay payment upi card net banking emi cod cash on delivery razorpay invoice gst",
    "subclauses": [
      {
        "number": "39.1",
        "text": "You can pay by UPI, credit or debit card, net banking, or no-cost EMI on selected cards. We do not \noffer cash on delivery.",
        "hasList": false
      },
      {
        "number": "39.2",
        "text": "Payments are processed by our payment partner, Razorpay. We never see or store your card or UPI \ndetails, and your bank’s or card issuer’s own terms, including for EMI, also apply.",
        "hasList": false
      },
      {
        "number": "39.3",
        "text": "You pay in full when you place your booking or order, except a deposit that the listing says is \ncollected separately.",
        "hasList": false
      },
      {
        "number": "39.4",
        "text": "If money leaves your account but your booking or order does not go through, your bank reverses it \nautomatically. If it does not, tell us and we will help straight away.",
        "hasList": false
      },
      {
        "number": "39.5",
        "text": "We issue a tax invoice in our name for every booking and order, and a credit note where we refund \nagainst it. If you ask for a GST invoice and give us your GSTIN, you confirm the GSTIN is yours and \nthe purchase is for that business; whether you can claim input tax credit is a matter between you and \nthe tax authorities.",
        "hasList": false
      }
    ]
  },
  {
    "number": 40,
    "title": "Payment disputes",
    "anchor": "#c-chargeback",
    "keywords": "chargeback bank dispute card dispute",
    "subclauses": [
      {
        "number": "40.1",
        "text": "If something is wrong with a payment or an order, please talk to us first. A bank dispute can freeze a \nrefund we are already processing, and often takes weeks longer.",
        "hasList": false
      },
      {
        "number": "40.2",
        "text": "You are always free to raise a dispute with your bank. If one is raised for a transaction  you \nauthorised and received, we will share the records of your booking or order with your bank, including \nthese Terms and your acceptance of them, and we may pause new orders on your account while it \nis open.",
        "hasList": false
      }
    ]
  },
  {
    "number": 41,
    "title": "Delivery and collection",
    "anchor": "#c-delivery",
    "keywords": "delivery shipping courier pin code free delivery express address not home insured",
    "subclauses": [
      {
        "number": "41.1",
        "text": "We deliver across India to the PIN codes we serve, which you can check at checkout. Standard \ndelivery is free on orders above ₹2,999, and any delivery charge is always shown before you pay. \nHow we deliver and collect, and how long it takes, is set out in our Shipping & Delivery Policy.",
        "hasList": false
      },
      {
        "number": "41.2",
        "text": "Please give us an accurate, complete address and a phone number the courier can reach, and make \nsure someone can receive the parcel. A rental’s delivery date is fixed to your booking, and the \nRefund & Cancellation Policy explains what happens if delivery cannot be completed in time \nbecause nobody was available.",
        "hasList": false
      },
      {
        "number": "41.3",
        "text": "Pieces are insured while in transit, and you never pay for a parcel the courier loses.",
        "hasList": false
      }
    ]
  },
  {
    "number": 42,
    "title": "Cancelling, changing and refunds",
    "anchor": "#c-cancel",
    "keywords": "cancel cancellation change refund timeline original payment method store credit",
    "subclauses": [
      {
        "number": "42.1",
        "text": "You may cancel or change a booking or order as the Refund & Cancellation Policy sets out. In short, \na rental cancelled more than 7 days before its Rental Period starts is refunded in full, a rental cannot \nbe cancelled once dispatched, and a preloved order can be cancelled for a full refund until it is \ndispatched.",
        "hasList": false
      },
      {
        "number": "42.2",
        "text": "Refunds go back to the payment method used at checkout and usually reach you within 7 to 14 \ndays, depending on your bank. We cannot refund in cash, as store credit or to a different account, \nexcept as the Refund & Cancellation Policy explains for a card or account that has since closed.",
        "hasList": false
      },
      {
        "number": "42.3",
        "text": "If something goes wrong because of us or our courier, you do not pay for it.",
        "hasList": false
      }
    ]
  },
  {
    "number": 43,
    "title": "If we have to cancel",
    "anchor": "#c-we-cancel",
    "keywords": "house of kaira cancels unavailable damaged double booked compensation",
    "subclauses": [
      {
        "number": "43.1",
        "text": "Occasionally we may have to cancel a confirmed booking or order, for example because a piece was \ndamaged before your dates, did not pass our final check, or was paid for by someone else at the \nsame moment. If so, we tell you straight away, refund everything you paid, automatically, and help \nyou find something else if you would like us to.",
        "hasList": false
      },
      {
        "number": "43.2",
        "text": "If we cancel a booking, for a reason that is not yours, at a time when cancelling it yourself would \nhave carried a charge under the Refund & Cancellation Policy, we also pay you an amount equal to \nthat charge, on top of your full refund. We do not think it is fair to charge you for cancelling unless we \nbear the same when we cancel.",
        "hasList": false
      },
      {
        "number": "43.3",
        "text": "If we cancel because you have broken these Terms, or because we could not confirm who you are, \nwe refund what you paid, less any amount you owe us, and the payment in clause 43.2 does not \napply.",
        "hasList": false
      }
    ]
  },
  {
    "number": 44,
    "title": "Events outside anyone’s control",
    "anchor": "#c-force",
    "keywords": "force majeure strike flood lockdown weather disaster government order delay",
    "subclauses": [
      {
        "number": "44.1",
        "text": "Neither of us is responsible for failing to do something, or for doing it late, because of events outside \nour reasonable control, such as floods, severe weather, epidemics, strikes, government orders, or \nthe failure of courier or payment networks.",
        "hasList": false
      },
      {
        "number": "44.2",
        "text": "If such an event stops a piece from being dispatched, you can choose a full refund or, for a rental, a \nlater date. If it happens while a piece is in transit, we keep you updated and make sure you are not \nleft out of pocket.",
        "hasList": false
      },
      {
        "number": "44.3",
        "text": "If such an event stops you returning a piece on time, you are not charged for the delay it causes, \nthough the piece remains your responsibility until it is collected.",
        "hasList": false
      }
    ]
  },
  {
    "number": 45,
    "title": "What belongs to us",
    "anchor": "#c-our-ip",
    "keywords": "copyright trade mark logo photos content copy reuse intellectual property",
    "subclauses": [
      {
        "number": "45.1",
        "text": "The House of Kaira name and logo, the design of the Platform, and the photographs, listings, text \nand other content we create belong to us or are used by us with permission, and are protected by \nthe Copyright Act, 1957, the Trade Marks Act, 1999 and other laws.",
        "hasList": false
      },
      {
        "number": "45.2",
        "text": "You may view our pages and share links to them. You may not copy, reproduce, sell or reuse our \ncontent, including listing photographs, for any other purpose without our written permission.",
        "hasList": false
      }
    ]
  },
  {
    "number": 46,
    "title": "What you share with us",
    "anchor": "#c-your-content",
    "keywords": "my photos reviews story licence consent use my photo name marketing lister",
    "subclauses": [
      {
        "number": "46.1",
        "text": "When you share reviews, photographs, messages or other content with us, it remains yours, and you \ngive us a non-exclusive, royalty-free licence to use, reproduce, adapt and publish it on the Platform \nand in our marketing. You confirm you have the right to share it.",
        "hasList": false
      },
      {
        "number": "46.2",
        "text": "We will not publish a photograph in which you or anyone else can be recognised, or use your name \nin our marketing, unless you have agreed, and you can ask us to stop any such use at any time.",
        "hasList": false
      },
      {
        "number": "46.3",
        "text": "For Listers, this includes the photographs you send and the story of your piece. The photographs we \ntake of your piece belong to us, and we may keep them, and show them in our archive of past \npieces, after the piece is sold or withdrawn.",
        "hasList": false
      }
    ]
  },
  {
    "number": 47,
    "title": "Reviews and testimonials",
    "anchor": "#c-reviews",
    "keywords": "reviews ratings stars testimonials fake paid honest remove",
    "subclauses": [
      {
        "number": "47.1",
        "text": "A review must be your own honest opinion of a piece you rented or bought. We never pay for \nreviews or offer anything in return for a positive one.",
        "hasList": false
      },
      {
        "number": "47.2",
        "text": "We publish reviews as they are written, whether positive or negative. We decline or remove a review \nonly if it breaks clause 10, contains personal information, or is not about the piece or our service, \nand we keep a record of why.",
        "hasList": false
      },
      {
        "number": "47.3",
        "text": "We show a testimonial on our pages only with the consent of the person who gave it.",
        "hasList": false
      }
    ]
  },
  {
    "number": 48,
    "title": "Reporting content or an infringement",
    "anchor": "#c-report",
    "keywords": "report infringement copyright trade mark takedown unlawful content",
    "subclauses": [
      {
        "number": "48.1",
        "text": "If you believe something on the Platform infringes your rights, such as your copyright or trade mark, \nor breaks the law or clause 10, tell our Grievance Officer, whose details are in clause 53, where it \nappears and why, and we will act on it within the time the law requires.",
        "hasList": false
      }
    ]
  },
  {
    "number": 49,
    "title": "Our responsibility to you",
    "anchor": "#c-our-resp",
    "keywords": "liability limit cap compensation indirect loss consumer rights negligence website",
    "subclauses": [
      {
        "number": "49.1",
        "text": "We provide our services with reasonable care and skill, and deliver every piece in the condition its \nlisting describes.",
        "hasList": false
      },
      {
        "number": "49.2",
        "text": "Nothing in these Terms limits or excludes our liability for death or personal injury caused by our \nnegligence, for fraud, for our gross negligence or wilful misconduct, or for anything else the law does \nnot allow us to limit, and nothing in them takes away your rights under the Consumer Protection Act, \n2019 or any other law.",
        "hasList": false
      },
      {
        "number": "49.3",
        "text": "Subject to that, we are not responsible for loss that was not reasonably foreseeable when your \nbooking or order was confirmed, and our total responsibility to you for a booking or order is limited to \nthe total amount you paid for it, together with the refund of your deposit in full.",
        "hasList": false
      },
      {
        "number": "49.4",
        "text": "We work hard to keep the Platform accurate and available, but we cannot promise it will always be \nuninterrupted or free of errors, and we may change or pause parts of it for maintenance or \nimprovement.",
        "hasList": false
      },
      {
        "number": "49.5",
        "text": "Styling suggestions, including through Consult a Stylist, are given in good faith to help you choose. \nHow a piece looks and feels on you is a personal judgement.",
        "hasList": false
      },
      {
        "number": "49.6",
        "text": "Where a listing states a fabric’s composition, it is given as we know it. If you are sensitive to any \nmaterial, dye or cleaning process, please ask us before you book or buy.",
        "hasList": false
      }
    ]
  },
  {
    "number": 50,
    "title": "Your responsibility to us",
    "anchor": "#c-your-resp",
    "keywords": "indemnity indemnify responsible loss third party claim legal costs",
    "subclauses": [
      {
        "number": "50.1",
        "text": "You are responsible for loss you cause us by breaking these Terms, by acting dishonestly or by \nbreaking the law, including any claim someone else brings against us as a result, for example a \ndesigner’s claim about a piece you listed that was not genuine. You agree to make good that loss, \nincluding our reasonable legal costs, to the extent you caused it.",
        "hasList": false
      }
    ]
  },
  {
    "number": 51,
    "title": "Your personal data",
    "anchor": "#c-data",
    "keywords": "privacy personal data dpdp consent erase delete correct access nominate share sell",
    "subclauses": [
      {
        "number": "51.1",
        "text": "We handle your personal data in line with the Digital Personal Data Protection Act, 2023 and our \nPrivacy Policy, which explains what we collect, why, who we share it with and how long we keep it.",
        "hasList": false
      },
      {
        "number": "51.2",
        "text": "We use your details to run your account, bookings, orders and listings, and share them only as the \nPrivacy Policy describes, for example with our courier and payment partners so they can deliver and \nprocess your order. We never sell your data.",
        "hasList": false
      },
      {
        "number": "51.3",
        "text": "You can ask to see, correct or erase your personal data, withdraw a consent you have given, \nnominate someone to act for you, or raise a concern, as the Privacy Policy explains. Withdrawing \nconsent does not affect what was done before, and we may still keep what the law requires us to \nkeep.",
        "hasList": false
      },
      {
        "number": "51.4",
        "text": "When you give us someone else’s details, for example a friend’s delivery address, you confirm they \nare happy for us to use them to deliver your order.",
        "hasList": false
      }
    ]
  },
  {
    "number": 52,
    "title": "Talk to us first",
    "anchor": "#c-talk",
    "keywords": "complaint unhappy escalate senior review help",
    "subclauses": [
      {
        "number": "52.1",
        "text": "Most concerns are settled with us within a day or two. Message us on WhatsApp at +91 93401 \n39300 or email hello@houseofkaira.com, and if you are not happy with how your case was handled, \nask for it to be reviewed by a senior member of our team.",
        "hasList": false
      }
    ]
  },
  {
    "number": 53,
    "title": "Our Grievance Officer",
    "anchor": "#c-complaints",
    "keywords": "grievance officer formal complaint acknowledge resolve appellate committee",
    "subclauses": [
      {
        "number": "53.1",
        "text": "For a formal complaint, including about a piece, our service, content on the Platform or your account, \nplease write to our Grievance Officer: [Name], [Designation], [Registered legal name], [Registered \noffice address], Indore, Madhya Pradesh. Email [Email address]. Phone [Phone number].",
        "hasList": false
      },
      {
        "number": "53.2",
        "text": "We acknowledge every complaint within 24 hours of receiving it, give you a reference number and a \ncopy of your complaint as we have recorded it, and keep you updated. We resolve complaints within \none month of receiving them, or within any shorter time the law sets for a particular kind of \ncomplaint, such as one about content on the Platform.",
        "hasList": false
      },
      {
        "number": "53.3",
        "text": "If you are not satisfied with the Grievance Officer’s decision on a complaint about content on the \nPlatform or your access to it, you may appeal to the Grievance Appellate Committee set up by the \nGovernment of India, within 30 days of that decision.",
        "hasList": false
      }
    ]
  },
  {
    "number": 54,
    "title": "Your rights as a consumer",
    "anchor": "#c-consumer",
    "keywords": "consumer rights national consumer helpline consumer commission e jagriti",
    "subclauses": [
      {
        "number": "54.1",
        "text": "You can also ask the National Consumer Helpline for help, by calling 1915, messaging +91 88000 \n01915 on WhatsApp, or at consumerhelpline.gov.in, and you can file a complaint with the Consumer \nDisputes Redressal Commission for your area, including online through e-Jagriti at e-jagriti.gov.in.",
        "hasList": false
      },
      {
        "number": "54.2",
        "text": "Nothing in these Terms limits your right to do so, or any other right you have under the Consumer \nProtection Act, 2019.",
        "hasList": false
      }
    ]
  },
  {
    "number": 55,
    "title": "The law that applies, and the courts",
    "anchor": "#c-law",
    "keywords": "governing law jurisdiction courts indore madhya pradesh dispute",
    "subclauses": [
      {
        "number": "55.1",
        "text": "These Terms are governed by the laws of India.",
        "hasList": false
      },
      {
        "number": "55.2",
        "text": "Subject to your rights in clause 54, the courts at Indore, Madhya Pradesh, have exclusive jurisdiction \nover any dispute arising from these Terms or your use of the Platform. If you are a consumer, you \nmay also bring a complaint wherever the Consumer Protection Act, 2019 allows, including wh ere you \nlive or work.",
        "hasList": false
      }
    ]
  },
  {
    "number": 56,
    "title": "Suspending or closing an account",
    "anchor": "#c-suspension",
    "keywords": "suspend suspension close terminate ban block account remove listing cancel",
    "subclauses": [
      {
        "number": "56.1",
        "text": "We may suspend or close an account, remove a listing or cancel an open order only for a \nreasonable cause, such as: \n(a) a serious or repeated breach of these Terms; \n(b) fraud or suspected fraud, including a dishonest chargeback; \n(c) a piece not returned or an amount left unpaid; \n(d) abusive behaviour towards our team, our Listers or other customers; or  \n(e) a requirement of the law or of an authority.",
        "hasList": true
      },
      {
        "number": "56.2",
        "text": "Unless the law, or a risk to others, requires us to act at once, we tell you why first and give you a \nchance to respond.",
        "hasList": false
      },
      {
        "number": "56.3",
        "text": "If we cancel an order for a reason that is not yours, clause 43 applies. Closing an account does not \nend anything already owed, such as returning a rental piece, paying an amount due, or honouring a \nconfirmed booking of a piece you listed.",
        "hasList": false
      },
      {
        "number": "56.4",
        "text": "You can close your account at any time, as clause 8.5 explains.",
        "hasList": false
      }
    ]
  },
  {
    "number": 57,
    "title": "Notices",
    "anchor": "#c-notices",
    "keywords": "notice legal notice address email",
    "subclauses": [
      {
        "number": "57.1",
        "text": "We send notices to the email address, phone number or WhatsApp number on your account, and a \nnotice is treated as received when it is sent there, unless we learn it did not arrive.",
        "hasList": false
      },
      {
        "number": "57.2",
        "text": "You can send notices to us at hello@houseofkaira.com, and formal notices to our Grievance Officer \nat the address in clause 53.",
        "hasList": false
      }
    ]
  },
  {
    "number": 58,
    "title": "Transferring this agreement",
    "anchor": "#c-transfer",
    "keywords": "assign assignment transfer successor acquisition",
    "subclauses": [
      {
        "number": "58.1",
        "text": "You may not transfer your rights or obligations under these Terms to anyone else without our written \nagreement.",
        "hasList": false
      },
      {
        "number": "58.2",
        "text": "We may transfer ours to another business, for example if House of Kaira is reorganised or acquired, \nas long as this does not reduce your rights under these Terms, and we will tell you if it happens.",
        "hasList": false
      }
    ]
  },
  {
    "number": 59,
    "title": "The rest of the fine print",
    "anchor": "#c-misc",
    "keywords": "entire agreement severability waiver survival relationship language translation",
    "subclauses": [
      {
        "number": "59.1",
        "text": "The whole agreement. These Terms, our Policies and your confirmations are the whole agreement \nbetween us about the Platform.",
        "hasList": false
      },
      {
        "number": "59.2",
        "text": "If part does not hold. If any part of these Terms is found to be unenforceable, the rest remains in \nforce, and that part applies as far as the law allows.",
        "hasList": false
      },
      {
        "number": "59.3",
        "text": "No waiver. If we do not enforce a right straight away, we have not given it up.",
        "hasList": false
      },
      {
        "number": "59.4",
        "text": "Our relationship. Nothing in these Terms creates a partnership, joint venture or employment \nbetween you and us.",
        "hasList": false
      },
      {
        "number": "59.5",
        "text": "What continues. Clauses that by their nature continue after a booking or order is completed or an \naccount is closed, such as those on responsibility for a rental piece, amounts owed, intellectual \nproperty, liability and disputes, continue to apply.",
        "hasList": false
      },
      {
        "number": "59.6",
        "text": "Language. These Terms are written in English. If we provide a translation, it is for convenience, and \nthe English version applies if they differ.",
        "hasList": false
      },
      {
        "number": "59.7",
        "text": "Headings and summaries. Headings, the essentials at the top of this page and our guides help you \nfind your way; they do not change what the clauses say.",
        "hasList": false
      }
    ]
  }
];

export default {
  OPENING_PARAGRAPH,
  THE_ESSENTIALS,
  WHERE_TO_START_CARDS,
  DEFINITIONS,
  RELATED_POLICIES,
  TERMS_PARTS,
  ALL_CLAUSES
};
