/**
 * House of Kaira - Cookie Banner Configuration & Content Data
 * Complete Section 13 Word-for-Word Copy & Kinds Definition
 * Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

export const COOKIE_BANNER_CONFIG = {
  version: "cookie-v1",
  cookieName: "hok_consent",
  maxAgeSeconds: 31536000, // 12 months
  maxAgeMs: 31536000 * 1000,
  arriveDelayMs: 1000,
  noteDurationMs: 3600,
  notePauseResumeDelayMs: 1800,
  keylineInset: 5,
};

export const COOKIE_KINDS = [
  {
    key: "strictly",
    name: "Strictly necessary",
    description: "Keep you signed in, remember your bag and keep the website and your payments secure. The website cannot work without them.",
    isAlwaysOn: true,
    countText: "(7)",
    cookies: [
      {
        name: "hok_session",
        who: "House of Kaira",
        purpose: "Keeps you signed in as you move from page to page."
      },
      {
        name: "hok_csrf",
        who: "House of Kaira",
        purpose: "Protects your account and our forms from being misused by other websites."
      },
      {
        name: "hok_bag",
        who: "House of Kaira",
        purpose: "Remembers the pieces in your bag."
      },
      {
        name: "hok_wishlist",
        who: "House of Kaira",
        purpose: "Remembers the pieces you save to your wishlist."
      },
      {
        name: "hok_consent",
        who: "House of Kaira",
        purpose: "Remembers the choices you make here, so we don’t ask again on every visit."
      },
      {
        name: "Payments",
        who: "Razorpay",
        purpose: "Set only when you pay, to keep your payment secure."
      },
      {
        name: "Sign in with Google",
        who: "Google",
        purpose: "Set only if you choose to sign in with your Google account."
      }
    ]
  },
  {
    key: "functional",
    name: "Functional",
    shortName: "functional",
    description: "Show content from other services on our pages, such as our latest Instagram posts on the homepage.",
    isAlwaysOn: false,
    countText: "(1)",
    cookies: [
      {
        name: "Instagram posts",
        who: "Meta",
        purpose: "Shows our latest posts on the homepage. Meta may set its own cookies when they load. If you leave this off, you see a link to our Instagram instead."
      }
    ]
  },
  {
    key: "personalisation",
    name: "Personalisation",
    shortName: "personalisation",
    description: "Remember the pieces you look at and the sizes and dates you choose, so we can tailor what you see, such as a row of pieces you recently viewed.",
    isAlwaysOn: false,
    countText: "(none yet)",
    emptyText: "We don’t use any personalisation cookies yet. If we start, each one will be listed here and in our Cookie Policy, and we will ask you again before any is set.",
    cookies: []
  },
  {
    key: "analytics",
    name: "Analytics and performance",
    shortName: "analytics",
    description: "Help us understand which pages and pieces people visit and how quickly the website works, so we can improve it. Never linked to your name.",
    isAlwaysOn: false,
    countText: "(2)",
    cookies: [
      {
        name: "_ga",
        who: "Google Analytics",
        purpose: "Tells one visit from another, without knowing who you are."
      },
      {
        name: "_ga_ with our site ID",
        who: "Google Analytics",
        purpose: "Keeps track of a single visit, such as the pages viewed."
      }
    ]
  },
  {
    key: "marketing",
    name: "Marketing",
    shortName: "marketing",
    description: "Help us measure our advertising and show you House of Kaira pieces on other websites and social media.",
    isAlwaysOn: false,
    countText: "(none yet)",
    emptyText: "We don’t use any marketing cookies yet. If we start, each one will be listed here and in our Cookie Policy, and we will ask you again before any is set.",
    cookies: []
  }
];

/**
 * Format timestamp into specification format: "[day] [month in words] [year]"
 * Example: "5 October 2026"
 */
export const formatSavedDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";

  const day = date.getDate();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Generates the exact saved note confirmation message (Sections 7.1 & 7.2)
 * The message is decided ONLY by which optional kinds end up on, never by which button was pressed.
 */
export const generateSavedNoteMessage = (choices) => {
  const safeChoices = {
    functional: Boolean(choices?.functional),
    personalisation: Boolean(choices?.personalisation),
    analytics: Boolean(choices?.analytics),
    marketing: Boolean(choices?.marketing),
  };

  const isAllOn = safeChoices.functional && safeChoices.personalisation && safeChoices.analytics && safeChoices.marketing;
  const isAllOff = !safeChoices.functional && !safeChoices.personalisation && !safeChoices.analytics && !safeChoices.marketing;

  if (isAllOn) {
    return "All cookies allowed. Change this any time in Cookie settings.";
  }

  if (isAllOff) {
    return "Only essential cookies. Change this any time in Cookie settings.";
  }

  // Build active list in exact order: functional, personalisation, analytics, marketing
  const activeKinds = [];
  if (safeChoices.functional) activeKinds.push("functional");
  if (safeChoices.personalisation) activeKinds.push("personalisation");
  if (safeChoices.analytics) activeKinds.push("analytics");
  if (safeChoices.marketing) activeKinds.push("marketing");

  let listString = "";
  if (activeKinds.length === 1) {
    listString = activeKinds[0];
  } else if (activeKinds.length === 2) {
    listString = `${activeKinds[0]} and ${activeKinds[1]}`;
  } else if (activeKinds.length === 3) {
    listString = `${activeKinds[0]}, ${activeKinds[1]} and ${activeKinds[2]}`;
  }

  return `Saved: ${listString} cookies on, other optional cookies off. Change this any time in Cookie settings.`;
};

export default {
  COOKIE_BANNER_CONFIG,
  COOKIE_KINDS,
  formatSavedDate,
  generateSavedNoteMessage
};
