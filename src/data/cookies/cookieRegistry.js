/**
 * House of Kaira - Cookie Policy Complete Content Registry
 * Complete Section 11 Word-for-Word Copy & Data Model
 * Build Specification v1.0 (hok_cookie_v4)
 */

import { COOKIE_SETTINGS } from './cookieSettings.js';

export const WHERE_TO_START_CARDS = [
  {
    tag: "EVERY COOKIE, WHO SETS IT, HOW LONG",
    title: "The cookies we use",
    range: "Clauses 10 to 17",
    anchor: "#p-list",
    targetPart: 3
  },
  {
    tag: "ALLOW, REFUSE OR CHANGE YOUR MIND",
    title: "Your choices",
    range: "Clauses 18 to 23",
    anchor: "#p-choices",
    targetPart: 4
  },
  {
    tag: "WHAT COOKIES ARE, AND ARE NOT",
    title: "How cookies work",
    range: "Clauses 6 to 9",
    anchor: "#p-basics",
    targetPart: 2
  }
];

export const THE_ESSENTIALS = [
  {
    id: 1,
    text: "Only the cookies our website cannot work without run until you choose",
    reference: "Clause 18",
    clauseNumber: 18,
    anchor: "#c-first-visit"
  },
  {
    id: 2,
    text: "Closing the banner without choosing means only essential cookies",
    reference: "Clause 18.2",
    clauseNumber: 18,
    subclauseNumber: "18.2",
    anchor: "#c-first-visit-2"
  },
  {
    id: 3,
    text: "Functional, analytics and marketing cookies only if you allow them, kind by kind",
    reference: "Clause 10",
    clauseNumber: 10,
    anchor: "#c-categories"
  },
  {
    id: 4,
    text: "Every cookie we use is listed here, with who sets it and how long it lasts",
    reference: "Clause 11",
    clauseNumber: 11,
    anchor: "#c-essential"
  },
  {
    id: 5,
    text: "Our analytics never receives your name, and cannot follow you to other websites",
    reference: "Clause 13",
    clauseNumber: 13,
    anchor: "#c-analytics"
  },
  {
    id: 6,
    text: "You can change your mind at any time in Cookie settings",
    reference: "Clause 19",
    clauseNumber: 19,
    anchor: "#c-change"
  },
  {
    id: 7,
    text: "We never fingerprint your device or track children",
    reference: "Clause 17",
    clauseNumber: 17,
    anchor: "#c-never"
  }
];

export const DEFINITIONS = [
  {
    term: "Consent",
    meaning: "Your agreement to a particular use, given by a clear action of your own, such as choosing “Allow” in Cookie settings. Closing a banner or carrying on browsing is never consent."
  },
  {
    term: "Cookie",
    meaning: "A small text file that a website asks your browser to store on your device, and that your browser sends back to that website on later visits."
  },
  {
    term: "Device",
    meaning: "The phone, tablet or computer, and the browser on it, that you use to visit our website."
  },
  {
    term: "First-party cookie",
    meaning: "A cookie set under our own website address. A few are set by tools from other companies that run on our pages, such as Google Analytics, and we say so beside each one."
  },
  {
    term: "Local storage",
    meaning: "A space in your browser where a website can keep information on your device. Unlike a cookie, it is not sent to the website automatically, and it stays until it is deleted."
  },
  {
    term: "Persistent cookie",
    meaning: "A cookie that stays on your device after you close your browser, until its end date or until it is deleted."
  },
  {
    term: "Pixel",
    meaning: "A tiny, invisible image in an email or web page that tells the sender when it has been loaded."
  },
  {
    term: "Session cookie",
    meaning: "A cookie that is deleted when you close your browser."
  },
  {
    term: "Similar technologies",
    meaning: "Local storage, pixels and other tools that store or read information on your device, or report what happens on it, in the way cookies do. In this policy, “cookies” includes them unless we say otherwise."
  },
  {
    term: "Strictly necessary",
    meaning: "Needed for our website to work safely at all, or for a feature you have asked for, such as signing in or keeping your bag."
  },
  {
    term: "Third-party cookie",
    meaning: "A cookie set under another company’s website address, for example inside a payment window or an embedded post."
  }
];

export const COOKIE_PARTS = [
  {
    number: 1,
    title: "About this policy",
    italicWord: "policy",
    range: "Clauses 1 to 5",
    startClause: 1,
    endClause: 5,
    barLabel: "About",
    tooltip: "About this policy, clauses 1 to 5",
    description: "Who we are, what this policy covers, and the laws behind it.",
    anchor: "#p-about",
    clauses: [
      {
        number: 1,
        name: "who",
        title: "Who we are",
        anchor: "#c-who",
        subclauses: [
          {
            number: "1.1",
            anchor: "#c-who-1",
            text: `This Cookie Policy is published by ${COOKIE_SETTINGS.legal_name}, trading as ${COOKIE_SETTINGS.trade_name} under the brand House of Kaira, ${COOKIE_SETTINGS.legal_form} with its principal place of business at ${COOKIE_SETTINGS.business_address}. In this policy, “House of Kaira”, “we”, “us” and “our” mean ${COOKIE_SETTINGS.legal_name}.`
          },
          {
            number: "1.2",
            anchor: "#c-who-2",
            text: "We decide which cookies and similar technologies our website uses, and why, so we are responsible for them and for the personal data they collect, as our Privacy Policy explains."
          },
          {
            number: "1.3",
            anchor: "#c-who-3",
            text: `For any question about this policy, write to our Grievance Officer at ${COOKIE_SETTINGS.grievance_email}, or message our team on WhatsApp at ${COOKIE_SETTINGS.support_whatsapp} (${COOKIE_SETTINGS.support_days}, ${COOKIE_SETTINGS.support_hours}). The Grievance Officer’s full details are in clause 29.`
          }
        ]
      },
      {
        number: 2,
        name: "scope",
        title: "What this policy covers",
        anchor: "#c-scope",
        subclauses: [
          {
            number: "2.1",
            anchor: "#c-scope-1",
            text: `This policy covers the cookies and similar technologies used on our website at ${COOKIE_SETTINGS.site_url}, on every page and every device, and in the marketing emails we send to people who have chosen to receive them.`
          },
          {
            number: "2.2",
            anchor: "#c-scope-2",
            text: "It does not cover the cookies other companies use on their own websites and apps, such as WhatsApp, Instagram, Google or Razorpay, even when you reach them through a link or button on our website. Their own policies apply there."
          },
          {
            number: "2.3",
            anchor: "#c-scope-3",
            text: "It does not cover the internal systems our team uses to run House of Kaira."
          },
          {
            number: "2.4",
            anchor: "#c-scope-4",
            text: "If we launch an app, we will update this policy to cover the technologies it uses before the app is available."
          }
        ]
      },
      {
        number: 3,
        name: "how-read",
        title: "How this policy works with our Privacy Policy",
        anchor: "#c-how-read",
        subclauses: [
          {
            number: "3.1",
            anchor: "#c-how-read-1",
            text: "This policy explains which cookies and similar technologies we use, what each one does, how long it lasts and the choices you have. It is complete on its own, and it also forms part of our Privacy Policy and our Terms & Conditions."
          },
          {
            number: "3.2",
            anchor: "#c-how-read-2",
            text: "Some information collected through cookies is personal data. How we handle it, who we share it with, how long we keep it and your rights over it are set out in our Privacy Policy, which applies if the two policies ever say something different about your personal data."
          }
        ]
      },
      {
        number: 4,
        name: "defs",
        title: "Words with a special meaning",
        anchor: "#c-defs",
        hasDefinitions: true,
        subclauses: [
          {
            number: "4.1",
            anchor: "#c-defs-1",
            text: "Words in this policy have their everyday meaning, except these, which apply whether or not they begin with a capital letter:"
          },
          {
            number: "4.2",
            anchor: "#c-defs-2",
            text: "Words defined in our Privacy Policy, such as personal data and Grievance Officer, have the same meaning here."
          }
        ]
      },
      {
        number: 5,
        name: "laws",
        title: "The laws we follow",
        anchor: "#c-laws",
        subclauses: [
          {
            number: "5.1",
            anchor: "#c-laws-1",
            text: "India does not have a law written only for cookies. Cookies are governed by the laws on personal data and on how businesses treat consumers, and we follow all of them, including:",
            list: [
              { letter: "(a)", text: "the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025, which apply to personal data collected through cookies and set the standard for valid consent;" },
              { letter: "(b)", text: "the Information Technology Act, 2000 and the rules made under it on reasonable security practices; and" },
              { letter: "(c)", text: "the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020 and the Guidelines for Prevention and Regulation of Dark Patterns, 2023, which forbid designs that pressure or trick people into a choice." }
            ]
          },
          {
            number: "5.2",
            anchor: "#c-laws-2",
            text: "We treat every cookie that is not strictly necessary as needing your consent, to the standard the Digital Personal Data Protection Act, 2023 sets, and we apply that standard from the day we open rather than waiting for each part of the Act to come into force."
          }
        ]
      }
    ]
  },
  {
    number: 2,
    title: "How cookies work",
    italicWord: "work",
    range: "Clauses 6 to 9",
    startClause: 6,
    endClause: 9,
    barLabel: "How cookies work",
    tooltip: "How cookies work, clauses 6 to 9",
    description: "What cookies are, the kinds we use, how long they last, and the principles we follow.",
    anchor: "#p-basics",
    clauses: [
      {
        number: 6,
        name: "what-are",
        title: "What cookies and similar technologies are",
        anchor: "#c-what-are",
        subclauses: [
          {
            number: "6.1",
            anchor: "#c-what-are-1",
            text: "When you visit a website, it can ask your browser to store a cookie: a small text file holding a short piece of information, such as a random code. The next time your browser asks that website for a page, it sends the cookie back, so the website can recognise that the visit comes from the same browser."
          },
          {
            number: "6.2",
            anchor: "#c-what-are-2",
            text: "Cookies let websites remember things between pages and visits, such as that you are signed in or what is in your bag. They can also be used to count visitors, or to show people relevant advertising on other websites. clause 10 explains which kinds we use and the choices you have."
          },
          {
            number: "6.3",
            anchor: "#c-what-are-3",
            text: "Cookies cannot run programs, carry viruses or read other files on your device, and each cookie can be read only by the website address that set it."
          },
          {
            number: "6.4",
            anchor: "#c-what-are-4",
            text: "Similar technologies do comparable jobs. Local storage keeps information in your browser without sending it on every visit, and pixels in emails report when an email is opened. Every one we use is listed in Part 3, starting at clause 10."
          }
        ]
      },
      {
        number: 7,
        name: "parties",
        title: "Our cookies, and cookies from other companies",
        anchor: "#c-parties",
        subclauses: [
          {
            number: "7.1",
            anchor: "#c-parties-1",
            text: "First-party cookies are set under our own website address. Most are ours; a few are set by tools from other companies that run on our pages, such as Google Analytics, and we say so beside each one."
          },
          {
            number: "7.2",
            anchor: "#c-parties-2",
            text: "Third-party cookies are set under another company’s address, for example inside Razorpay’s payment window or in Instagram posts shown on our homepage. That company decides how its cookies work, under its own policies."
          },
          {
            number: "7.3",
            anchor: "#c-parties-3",
            text: "We use as few other companies’ tools as we can, and none of them sets a cookie that is not strictly necessary unless you allow it."
          }
        ]
      },
      {
        number: 8,
        name: "lifetimes",
        title: "How long cookies last",
        anchor: "#c-lifetimes",
        subclauses: [
          {
            number: "8.1",
            anchor: "#c-lifetimes-1",
            text: "Session cookies are deleted when you close your browser. Persistent cookies stay until their end date, until you delete them, or until you withdraw your consent, whichever comes first."
          },
          {
            number: "8.2",
            anchor: "#c-lifetimes-2",
            text: "The lifetime of every cookie we use is listed beside it, starting at clause 11."
          },
          {
            number: "8.3",
            anchor: "#c-lifetimes-3",
            text: `Some browsers shorten lifetimes on their own. Chrome, for example, keeps no cookie for more than ${COOKIE_SETTINGS.chrome_cap}, and Safari may delete some after ${COOKIE_SETTINGS.safari_cap} if you do not return. The lifetimes we list are the longest a cookie can last.`
          }
        ]
      },
      {
        number: 9,
        name: "principles",
        title: "Our principles",
        anchor: "#c-principles",
        subclauses: [
          {
            number: "9.1",
            anchor: "#c-principles-1",
            text: "We use cookies on five principles:",
            list: [
              { letter: "(a)", text: "nothing that is not strictly necessary runs until you have made a choice;" },
              { letter: "(b)", text: "we ask clearly, with “Allow all” and “Only essential” given equal weight, and we never pressure or trick you into a choice;" },
              { letter: "(c)", text: "every cookie we use is listed in this policy, with who sets it, what it does and how long it lasts;" },
              { letter: "(d)", text: "no cookie lasts longer than its purpose needs; and" },
              { letter: "(e)", text: "refusing any optional kind of cookie never limits what you can do on our website." }
            ]
          }
        ]
      }
    ]
  },
  {
    number: 3,
    title: "The cookies we use",
    italicWord: "use",
    range: "Clauses 10 to 17",
    startClause: 10,
    endClause: 17,
    barLabel: "The cookies we use",
    tooltip: "The cookies we use, clauses 10 to 17",
    description: "Every cookie and similar technology on our website: who sets it, what it does, how long it lasts, and whether it needs your consent.",
    anchor: "#p-list",
    clauses: [
      {
        number: 10,
        name: "categories",
        title: "The four kinds of cookie",
        anchor: "#c-categories",
        subclauses: [
          {
            number: "10.1",
            anchor: "#c-categories-1",
            text: "Every cookie on our website belongs to one of four kinds. Only strictly necessary cookies are on before you choose; the other three stay off until you allow them, kind by kind:",
            list: [
              { letter: "(a)", text: "strictly necessary, which the website needs to work safely, or which a feature you use cannot work without, such as signing in or keeping your bag. They are always on, and are listed in clause 11;" },
              { letter: "(b)", text: "functional, which remember choices that make the website easier to use, and let content from other services, such as Instagram posts, appear on our pages. They are listed in clause 12;" },
              { letter: "(c)", text: "analytics and performance, which help us understand how the website is used and how well it works, through Google Analytics. They are listed in clause 13; and" },
              { letter: "(d)", text: "marketing, which help us measure whether our advertising works and show you House of Kaira pieces on other websites and social media. We do not use any today, as clause 14 explains." }
            ]
          },
          {
            number: "10.2",
            anchor: "#c-categories-2",
            text: "Some other companies set their own cookies only when you choose to use their service, such as paying through Razorpay or signing in with Google. They are part of the service you asked for, and are listed in clause 15."
          },
          {
            number: "10.3",
            anchor: "#c-categories-3",
            text: "Before we add any cookie, of any kind, we list it in this policy with who sets it, what it does and how long it lasts. If it is not strictly necessary, it is set only once you have allowed its kind."
          }
        ]
      },
      {
        number: 11,
        name: "essential",
        title: "Strictly necessary cookies",
        anchor: "#c-essential",
        hasCookieRows: true,
        subclauses: [
          {
            number: "11.1",
            anchor: "#c-essential-1",
            text: "These cookies are set by House of Kaira, under our own website address. They are always on, because signing in, keeping your bag and checking out safely cannot work without them, and we use them only for the purpose shown beside each one."
          }
        ],
        cookieRows: [
          {
            subclauseNumber: "11.2",
            anchor: "#c-essential-2",
            title: "hok_session",
            items: [
              { label: "Set by", text: "House of Kaira" },
              { label: "Type", text: "Cookie, first party" },
              { label: "What it does", text: "Keeps you signed in as you move between pages, and confirms that each request really comes from your signed-in browser." },
              { label: "How long", text: `Until you sign out, or ${COOKIE_SETTINGS.signin_life} after your last visit if you stay signed in.` },
              { label: "Consent", text: "Not needed: signing in cannot work without it." }
            ]
          },
          {
            subclauseNumber: "11.3",
            anchor: "#c-essential-3",
            title: "hok_csrf",
            items: [
              { label: "Set by", text: "House of Kaira" },
              { label: "Type", text: "Session cookie, first party" },
              { label: "What it does", text: "Stops another website from secretly submitting forms in your name, such as adding to your bag, checking out or changing your account details." },
              { label: "How long", text: "Until you close your browser." },
              { label: "Consent", text: "Not needed: it keeps your account safe." }
            ]
          },
          {
            subclauseNumber: "11.4",
            anchor: "#c-essential-4",
            title: "hok_consent",
            items: [
              { label: "Set by", text: "House of Kaira" },
              { label: "Type", text: "Cookie, first party" },
              { label: "What it does", text: "Remembers the choices you made in Cookie settings, when you made them and which version of this policy you saw, so that we respect them on every page and do not ask again on each visit." },
              { label: "How long", text: `${COOKIE_SETTINGS.consent_life}, after which we ask again.` },
              { label: "Consent", text: "Not needed: it records your choice." }
            ]
          },
          {
            subclauseNumber: "11.5",
            anchor: "#c-essential-5",
            title: "hok_bag",
            items: [
              { label: "Set by", text: "House of Kaira" },
              { label: "Type", text: "Local storage" },
              { label: "What it does", text: "Keeps the pieces, sizes and dates in your bag while you are not signed in. Once you sign in, your bag is kept with your account instead." },
              { label: "How long", text: "Until you check out, empty your bag, sign in, or clear your browser’s stored data." },
              { label: "Consent", text: "Not needed: it keeps the bag you asked for." }
            ]
          },
          {
            subclauseNumber: "11.6",
            anchor: "#c-essential-6",
            title: "hok_wishlist",
            items: [
              { label: "Set by", text: "House of Kaira" },
              { label: "Type", text: "Local storage" },
              { label: "What it does", text: "Keeps the pieces you save to your wishlist while you are not signed in, on that device only. Once you sign in, they are kept with your account instead." },
              { label: "How long", text: "Until you sign in, remove the pieces, or clear your browser’s stored data." },
              { label: "Consent", text: "Not needed: it keeps the list you asked for." }
            ]
          },
          {
            subclauseNumber: "11.7",
            anchor: "#c-essential-7",
            title: "Security and load-balancing cookies",
            items: [
              { label: "Set by", text: "Our hosting provider, on our behalf" },
              { label: "Type", text: "Cookies, first party" },
              { label: "Names", text: COOKIE_SETTINGS.host_cookie_names },
              { label: "What they do", text: "Send your visit to a working server, and protect the website from automated attacks." },
              { label: "How long", text: COOKIE_SETTINGS.host_cookie_life },
              { label: "Consent", text: "Not needed: the website cannot run safely without them." }
            ]
          }
        ]
      },
      {
        number: 12,
        name: "functional",
        title: "Functional cookies",
        anchor: "#c-functional",
        hasCookieRows: true,
        subclauses: [
          {
            number: "12.1",
            anchor: "#c-functional-1",
            text: "Functional cookies remember choices that make the website easier to use, and let content from other services appear on our pages. They are off unless you allow them, and refusing them never stops you renting, buying or listing. Today we use only the one below."
          }
        ],
        cookieRows: [
          {
            subclauseNumber: "12.2",
            anchor: "#c-functional-2",
            title: "Instagram posts on our homepage",
            items: [
              { label: "Set by", text: "Meta, the company behind Instagram, inside the posts" },
              { label: "Kind", text: "Functional" },
              { label: "Type", text: "Cookies, third party" },
              { label: "What they do", text: "Meta may use them to show the posts, to recognise your browser and, if you are signed in to Instagram, to link the view to your account, under Meta’s own policies." },
              { label: "How long", text: "As Meta’s policies set out." },
              { label: "When", text: "Only after you allow functional cookies." },
              { label: "Consent", text: "Needed: the posts do not load until you allow them." }
            ]
          }
        ]
      },
      {
        number: 13,
        name: "analytics",
        title: "Analytics and performance cookies",
        anchor: "#c-analytics",
        hasCookieRows: true,
        subclauses: [
          {
            number: "13.1",
            anchor: "#c-analytics-1",
            text: "If you allow analytics, we use Google Analytics, a service of Google, to understand how our website is used: how many people visit, which pages and pieces they view, what they search for, and how many add pieces to a wishlist, start checking out and complete a booking or order. It helps us make the website easier to use. Until you allow analytics, our pages do not load Google Analytics at all."
          }
        ],
        cookieRows: [
          {
            subclauseNumber: "13.2",
            anchor: "#c-analytics-2",
            title: "_ga",
            items: [
              { label: "Set by", text: "Google Analytics, on our website" },
              { label: "Type", text: "Cookie, first party" },
              { label: "What it does", text: "Tells one visitor from another using a random number, so that visits can be counted without knowing who you are. It is unique to our website, so it cannot be used to follow you on other websites." },
              { label: "How long", text: `${COOKIE_SETTINGS.ga_cookie_life} from your last visit.` },
              { label: "Consent", text: "Needed: set only if you allow analytics." }
            ]
          },
          {
            subclauseNumber: "13.3",
            anchor: "#c-analytics-3",
            title: "_ga_ followed by our property code",
            items: [
              { label: "Set by", text: "Google Analytics, on our website" },
              { label: "Type", text: "Cookie, first party" },
              { label: "What it does", text: "Remembers your current visit, such as when it began and how many pages you have seen, so that each visit is counted once." },
              { label: "How long", text: `${COOKIE_SETTINGS.ga_cookie_life} from your last visit.` },
              { label: "Consent", text: "Needed: set only if you allow analytics." }
            ]
          }
        ],
        extraSubclauses: [
          {
            number: "13.4",
            anchor: "#c-analytics-4",
            text: "Google Analytics uses your IP address to work out your approximate location, such as your city, and does not log or store the address itself. We never send Google Analytics your name, email address, phone number, delivery address or anything else that identifies you directly, and we do not connect it to Google’s advertising services."
          },
          {
            number: "13.5",
            anchor: "#c-analytics-5",
            text: `Analytics information is kept for no more than ${COOKIE_SETTINGS.analytics_keep}, and it is processed by Google, including outside India, as our Privacy Policy explains.`
          }
        ]
      },
      {
        number: 14,
        name: "marketing",
        title: "Marketing cookies",
        anchor: "#c-marketing",
        subclauses: [
          {
            number: "14.1",
            anchor: "#c-marketing-1",
            text: "Marketing cookies help a business measure whether its advertising works, for example how many people reach the website from an Instagram advertisement, and show people its products on other websites and social media. They are usually set by advertising platforms such as Meta or Google."
          },
          {
            number: "14.2",
            anchor: "#c-marketing-2",
            text: "We do not use any marketing cookies today. If we start, we will first list each one in this clause, with who sets it, what it does and how long it lasts, and ask for your consent again. None will be set unless you allow marketing cookies, and refusing them never limits what you can do on our website."
          },
          {
            number: "14.3",
            anchor: "#c-marketing-3",
            text: "Marketing cookies we use will never be aimed at children, and we will never sell information collected through them."
          }
        ]
      },
      {
        number: 15,
        name: "services",
        title: "Other companies’ services",
        anchor: "#c-services",
        hasCookieRows: true,
        subclauses: [
          {
            number: "15.1",
            anchor: "#c-services-1",
            text: "These companies may set their own cookies when you use their service through our website. They decide how their cookies work, under their own policies, which we encourage you to read on their websites."
          }
        ],
        cookieRows: [
          {
            subclauseNumber: "15.2",
            anchor: "#c-services-2",
            title: "Payments through Razorpay",
            items: [
              { label: "Set by", text: "Razorpay, in its own secure payment window" },
              { label: "Type", text: "Cookies, third party" },
              { label: "What they do", text: "Identify your device and browser, keep your payment secure and run Razorpay’s service while you pay." },
              { label: "How long", text: "As Razorpay’s own policies set out; some end with your browser session and some last longer." },
              { label: "When", text: "Only when you open the payment window at checkout." },
              { label: "Consent", text: "Not needed: they are part of paying, which you asked to do." }
            ]
          },
          {
            subclauseNumber: "15.3",
            anchor: "#c-services-3",
            title: "Sign in with Google",
            items: [
              { label: "Set by", text: "Google’s sign-in tool, on our website and on Google’s own sign-in pages" },
              { label: "Type", text: "Cookies, first party and third party" },
              { label: "Names on our website", text: "g_csrf_token, and g_state if Google’s one-tap prompt is shown" },
              { label: "What they do", text: "g_csrf_token stops the sign-in step from being faked; g_state remembers whether you closed Google’s sign-in prompt. Google’s own cookies on its pages keep you signed in to your Google Account." },
              { label: "How long", text: "g_csrf_token for the sign-in step only; the others as Google’s policies set out." },
              { label: "When", text: "Only if you choose to sign in with Google." },
              { label: "Consent", text: "Not needed: they are part of the sign-in you asked for." }
            ]
          }
        ],
        extraSubclauses: [
          {
            number: "15.4",
            anchor: "#c-services-4",
            text: "Two services we use set no cookies on our website:",
            list: [
              { letter: "(a)", text: "Google Fonts, which delivers the typefaces on our pages. It sets no cookies, but to deliver the fonts your browser sends Google your IP address, the address of the page and details of your browser. Google says it does not use this to build profiles or target advertising; and" },
              { letter: "(b)", text: "WhatsApp: our WhatsApp buttons are ordinary links that open WhatsApp. They set nothing on our website, and once WhatsApp opens, its own terms and policies apply." }
            ]
          }
        ]
      },
      {
        number: 16,
        name: "emails",
        title: "Pixels in our marketing emails",
        anchor: "#c-emails",
        subclauses: [
          {
            number: "16.1",
            anchor: "#c-emails-1",
            text: "The marketing emails we send, only to people who have chosen to receive them, contain a pixel that tells us whether an email was opened, and when. Links in them may pass through our email provider so that we can see which were clicked. We use this only to learn which emails are useful, and to send fewer of those that are not."
          },
          {
            number: "16.2",
            anchor: "#c-emails-2",
            text: "You can stop the pixel by turning off automatic image loading in your email app, and stop marketing emails altogether through the unsubscribe link in any of them. Emails about your bookings, orders and account contain no tracking pixels."
          }
        ]
      },
      {
        number: 17,
        name: "never",
        title: "What we never do",
        anchor: "#c-never",
        subclauses: [
          {
            number: "17.1",
            anchor: "#c-never-1",
            text: "Whatever kinds of cookie we use, we never:",
            list: [
              { letter: "(a)", text: "set any cookie that is not strictly necessary before you have made a choice;" },
              { letter: "(b)", text: "identify your device by fingerprinting, meaning from its settings and characteristics instead of a cookie;" },
              { letter: "(c)", text: "sell information collected through cookies, or share it with anyone for their own marketing;" },
              { letter: "(d)", text: "use cookies to track or monitor children, or to direct advertising at them; or" },
              { letter: "(e)", text: "record your screen, mouse movements or taps, for example through session recording or heatmap tools, unless such a tool is listed in this policy and you have allowed its kind." }
            ]
          },
          {
            number: "17.2",
            anchor: "#c-never-2",
            text: "Payment and sign-in services may look at information about your device to prevent fraud when you pay or sign in, under their own policies, as clause 15 explains."
          }
        ]
      }
    ]
  },
  {
    number: 4,
    title: "Your choices",
    italicWord: "choices",
    range: "Clauses 18 to 23",
    startClause: 18,
    endClause: 23,
    barLabel: "Your choices",
    tooltip: "Your choices, clauses 18 to 23",
    description: "How you allow or refuse cookies, change your mind, and control them in your browser.",
    anchor: "#p-choices",
    clauses: [
      {
        number: 18,
        name: "first-visit",
        title: "When you first visit",
        anchor: "#c-first-visit",
        subclauses: [
          {
            number: "18.1",
            anchor: "#c-first-visit-1",
            text: "The first time you visit, a banner asks which cookies you allow. It offers “Allow all” and “Only essential” with equal weight, and “Settings” to choose kind by kind."
          },
          {
            number: "18.2",
            anchor: "#c-first-visit-2",
            text: "Until you choose, only strictly necessary cookies are used. If you close the banner or carry on browsing without choosing, we treat it as “Only essential”. We never take silence, scrolling or continued use as consent."
          },
          {
            number: "18.3",
            anchor: "#c-first-visit-3",
            text: `We ask once. The banner does not appear again unless ${COOKIE_SETTINGS.consent_life} have passed, we add a new kind of cookie or a new purpose, you clear your cookies, or you visit on a different browser or device.`
          },
          {
            number: "18.4",
            anchor: "#c-first-visit-4",
            text: "Your choice applies to the browser and device on which you made it. On another browser or device, you choose there separately."
          }
        ]
      },
      {
        number: 19,
        name: "change",
        title: "Changing your mind",
        anchor: "#c-change",
        subclauses: [
          {
            number: "19.1",
            anchor: "#c-change-1",
            text: "You can change your choices at any time in Cookie settings, which you can open from this page or from our Privacy Policy."
          },
          {
            number: "19.2",
            anchor: "#c-change-2",
            text: "Withdrawing is as easy as allowing: switch a kind off and save. We stop using it straight away, and delete from your browser the cookies of that kind that our website set, such as the Google Analytics cookies."
          },
          {
            number: "19.3",
            anchor: "#c-change-3",
            text: `Withdrawing does not undo what happened before. Analytics information already collected stays linked only to its random number, and is deleted within ${COOKIE_SETTINGS.analytics_keep}, as our Privacy Policy explains.`
          },
          {
            number: "19.4",
            anchor: "#c-change-4",
            text: "Cookies that other companies set inside their own content, such as Instagram posts, are controlled by them. Switching functional cookies off stops their content loading on our website, and you can delete any of their cookies already stored in your browser’s settings."
          }
        ]
      },
      {
        number: 20,
        name: "record",
        title: "How we record your choices",
        anchor: "#c-record",
        subclauses: [
          {
            number: "20.1",
            anchor: "#c-record-1",
            text: "When you make a choice, we keep a record of what you chose, when, and which version of this policy you saw. For visitors who are not signed in, the record is linked to a random number, not to your name."
          },
          {
            number: "20.2",
            anchor: "#c-record-2",
            text: `We keep each record for ${COOKIE_SETTINGS.claims_keep} after the choice ends, only to show that we respected it, as the law expects us to be able to.`
          }
        ]
      },
      {
        number: 21,
        name: "browser",
        title: "Controlling cookies in your browser",
        anchor: "#c-browser",
        subclauses: [
          {
            number: "21.1",
            anchor: "#c-browser-1",
            text: "Every browser lets you see, block and delete cookies and stored data, usually under Settings, then Privacy or Site settings. You can also use private or incognito browsing, which deletes cookies when you close the window."
          },
          {
            number: "21.2",
            anchor: "#c-browser-2",
            text: "Google offers a free Google Analytics Opt-out Browser Add-on for Chrome, Safari, Firefox and Microsoft Edge, which stops Google Analytics on every website you visit."
          },
          {
            number: "21.3",
            anchor: "#c-browser-3",
            text: "Deleting cookies also deletes your cookie choices, so we will ask again on your next visit."
          }
        ]
      },
      {
        number: 22,
        name: "blocked",
        title: "If you block or refuse cookies",
        anchor: "#c-blocked",
        subclauses: [
          {
            number: "22.1",
            anchor: "#c-blocked-1",
            text: "If you block strictly necessary cookies in your browser, parts of our website will not work: you may not be able to sign in, keep pieces in your bag or wishlist, or check out."
          },
          {
            number: "22.2",
            anchor: "#c-blocked-2",
            text: "Refusing any optional kind of cookie never limits what you can do. You can browse, rent, buy and list exactly as before; content from other services, such as Instagram posts, simply stays hidden until you allow functional cookies."
          }
        ]
      },
      {
        number: 23,
        name: "signals",
        title: "Browser privacy signals",
        anchor: "#c-signals",
        subclauses: [
          {
            number: "23.1",
            anchor: "#c-signals-1",
            text: "Some browsers can send signals such as “Do Not Track” or “Global Privacy Control”. There is no agreed standard in India for responding to them, so our website does not respond to them automatically, but your choices in Cookie settings always apply."
          }
        ]
      }
    ]
  },
  {
    number: 5,
    title: "Your information",
    italicWord: "information",
    range: "Clauses 24 to 26",
    startClause: 24,
    endClause: 26,
    barLabel: "Your information",
    tooltip: "Your information, clauses 24 to 26",
    description: "How cookie information relates to your personal data, children, and the security of our cookies.",
    anchor: "#p-info",
    clauses: [
      {
        number: 24,
        name: "personal-data",
        title: "Cookies and your personal data",
        anchor: "#c-personal-data",
        subclauses: [
          {
            number: "24.1",
            anchor: "#c-personal-data-1",
            text: "Some information collected through cookies, such as the random number in an analytics cookie or your IP address, can be personal data. Our Privacy Policy explains how we handle it, including when it is processed outside India, and your rights to see, correct and erase it."
          },
          {
            number: "24.2",
            anchor: "#c-personal-data-2",
            text: "Because analytics information is linked only to a random number, and never to your name, we usually cannot find it from your name or email address. The quickest way to remove it from your device is to switch analytics off in Cookie settings, or to delete your cookies."
          }
        ]
      },
      {
        number: 25,
        name: "children",
        title: "Children",
        anchor: "#c-children",
        subclauses: [
          {
            number: "25.1",
            anchor: "#c-children-1",
            text: `Our website is for adults, and accounts are only for people aged ${COOKIE_SETTINGS.age_min} and over. We never use cookies to track or monitor children, or to direct advertising at them.`
          }
        ]
      },
      {
        number: 26,
        name: "cookie-security",
        title: "Keeping our cookies secure",
        anchor: "#c-cookie-security",
        subclauses: [
          {
            number: "26.1",
            anchor: "#c-cookie-security-1",
            text: "Our own cookies hold only what they need, such as a random code, and never your password or payment details."
          },
          {
            number: "26.2",
            anchor: "#c-cookie-security-2",
            text: "Our sign-in cookie is sent only over encrypted connections, cannot be read by scripts on the page, and is not sent when another website contacts ours in the background, which protects your account from common attacks."
          }
        ]
      }
    ]
  },
  {
    number: 6,
    title: "Changes & contact",
    italicWord: "contact",
    range: "Clauses 27 to 30",
    startClause: 27,
    endClause: 30,
    barLabel: "General",
    tooltip: "Changes & contact, clauses 27 to 30",
    description: "How this policy changes, the languages it is available in, and who to contact.",
    anchor: "#p-general",
    clauses: [
      {
        number: 27,
        name: "changes",
        title: "When this policy changes",
        anchor: "#c-changes",
        subclauses: [
          {
            number: "27.1",
            anchor: "#c-changes-1",
            text: `The version and date of this policy are shown at the top of this page. We check the cookies our website uses at least ${COOKIE_SETTINGS.audit_freq}, and whenever we add a feature, and update this policy to match.`
          },
          {
            number: "27.2",
            anchor: "#c-changes-2",
            text: "If we want to use a new kind of cookie, or use one for a new purpose, we update this policy first and ask for your consent again before it is used."
          },
          {
            number: "27.3",
            anchor: "#c-changes-3",
            text: "We keep every earlier version of this policy, and send you any of them if you ask."
          }
        ]
      },
      {
        number: 28,
        name: "language",
        title: "This policy in your language",
        anchor: "#c-language",
        subclauses: [
          {
            number: "28.1",
            anchor: "#c-language-1",
            text: `This policy is written in English. You can ask for it in any of the ${COOKIE_SETTINGS.schedule_langs} languages in the Eighth Schedule to the Constitution of India, by writing to our Grievance Officer or messaging us on WhatsApp, and we will send it to you. If a translation ever differs from the English, we will not rely on the difference against you.`
          }
        ]
      },
      {
        number: 29,
        name: "contact",
        title: "Questions and complaints",
        anchor: "#c-contact",
        subclauses: [
          {
            number: "29.1",
            anchor: "#c-contact-1",
            text: `Our Grievance Officer handles every question and complaint about cookies and your personal data: ${COOKIE_SETTINGS.grievance_name}, ${COOKIE_SETTINGS.grievance_title}, House of Kaira, ${COOKIE_SETTINGS.business_address}. Email ${COOKIE_SETTINGS.grievance_email}. Phone ${COOKIE_SETTINGS.grievance_phone}.`
          },
          {
            number: "29.2",
            anchor: "#c-contact-2",
            text: `We acknowledge every complaint within ${COOKIE_SETTINGS.grievance_ack} and resolve it within ${COOKIE_SETTINGS.grievance_resolve}. If you are not satisfied, you may complain to the Data Protection Board of India, as our Privacy Policy explains.`
          }
        ]
      },
      {
        number: 30,
        name: "law",
        title: "The law that applies",
        anchor: "#c-law",
        subclauses: [
          {
            number: "30.1",
            anchor: "#c-law-1",
            text: "This policy is governed by the laws of India. Matters that the Digital Personal Data Protection Act, 2023 gives the Data Protection Board of India to decide are for the Board. For anything else, and subject to your rights as a consumer, the courts at Indore, Madhya Pradesh, have jurisdiction, as our Terms & Conditions provide."
          }
        ]
      }
    ]
  }
];

// Flat array of all 30 clauses
export const ALL_COOKIE_CLAUSES = COOKIE_PARTS.flatMap(part =>
  part.clauses.map(clause => ({
    ...clause,
    partNumber: part.number,
    partTitle: part.title,
    partName: `Part ${part.number}. ${part.title}`
  }))
);

// Flat array of all 11 cookie rows
export const ALL_COOKIE_ROWS = COOKIE_PARTS.flatMap(part =>
  part.clauses.flatMap(clause =>
    (clause.cookieRows || []).map(row => ({
      ...row,
      clauseNumber: clause.number,
      clauseTitle: clause.title,
      partNumber: part.number
    }))
  )
);

export default {
  COOKIE_SETTINGS,
  THE_ESSENTIALS,
  DEFINITIONS,
  COOKIE_PARTS,
  ALL_COOKIE_CLAUSES,
  ALL_COOKIE_ROWS
};
