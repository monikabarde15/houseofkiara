import express from "express";
import { pool } from "../config/db.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to verify admin authentication
const protectAdmin = async (req, res, next) => {
  if (req.headers.authorization) {
    return requireAdminAuth(req, res, next);
  }
  if (process.env.NODE_ENV === "production") {
    return res.status(401).json({
      success: false,
      message: "Authorization token required (Bearer format).",
    });
  }
  next();
};

export const DEFAULT_ANNOUNCEMENT_SETTINGS = {
  showAcrossSite: true,
  howItMoves: "Scrolling loop",
  loopTimeSeconds: 28,
  pauseOnHover: true,
  backgroundColor: "#1A1612",
  textColor: "#C9A96E",
  italicLineColor: "#E3D2B4",
  separator: "Dot",
  messages: [
    {
      id: "msg-1",
      text: "Every story deserves a second chapter",
      italicSerif: true,
      showsOn: "All pages",
      link: "",
      goLiveDate: "",
      expiresDate: "",
      enabled: true,
    },
    {
      id: "msg-2",
      text: "Free delivery on orders above {{free_delivery_min}}",
      italicSerif: false,
      showsOn: "All pages",
      link: "/rent",
      goLiveDate: "",
      expiresDate: "",
      enabled: true,
    },
    {
      id: "msg-3",
      text: "New designer arrivals every Friday",
      italicSerif: false,
      showsOn: "All pages",
      link: "/buy-new",
      goLiveDate: "",
      expiresDate: "",
      enabled: true,
    },
    {
      id: "msg-4",
      text: "Wedding season styling appointments now open",
      italicSerif: false,
      showsOn: "All pages",
      link: "/contact",
      goLiveDate: "",
      expiresDate: "",
      enabled: true,
    },
    {
      id: "msg-5",
      text: "Rent · Buy Preloved · Buy New",
      italicSerif: false,
      showsOn: "All pages",
      link: "",
      goLiveDate: "",
      expiresDate: "",
      enabled: true,
    },
    {
      id: "msg-6",
      text: "Pan-India delivery available",
      italicSerif: false,
      showsOn: "All pages",
      link: "",
      goLiveDate: "",
      expiresDate: "",
      enabled: true,
    },
  ],
};

export const DEFAULT_HEADER_SETTINGS = {
  searchPlaceholder: "Search lehengas, designers, occasions…",
  bagCartLabel: "Cart",
  stickyHeader: true,
  showTagline: true,
  reducedHeader: {
    backLink: "Back to cart",
    securityLine: "SSL encrypted · Secured by Razorpay",
    pagesUsingIt: "Checkout, Payment, Order confirmation",
  },
  navItems: [
    {
      id: "nav-rent",
      shown: true,
      label: "Rent",
      link: "/rent",
      badge: "",
      style: "Accent",
      hasMenu: true,
      menuEnabled: true,
      menuColumns: [
        {
          id: "col-rent-cat",
          heading: "Shop by Category",
          links: [
            { id: "l1", label: "Bridal Lehengas", path: "/rent/bridal" },
            { id: "l2", label: "Sarees", path: "/rent/sarees" },
            { id: "l3", label: "Anarkalis", path: "/rent/anarkalis" },
            { id: "l4", label: "Sharara Sets", path: "/rent/sharara" },
            { id: "l5", label: "Sherwanis", path: "/rent/sherwanis" },
            { id: "l6", label: "Kurta Sets", path: "/rent/kurta" },
            { id: "l7", label: "See all categories", path: "/rent/all", position: "last" },
          ],
        },
        {
          id: "col-rent-des",
          heading: "Shop by Designer",
          links: [
            { id: "l8", label: "Sabyasachi", path: "/rent/sabyasachi" },
            { id: "l9", label: "Manish Malhotra", path: "/rent/mm" },
            { id: "l10", label: "Anita Dongre", path: "/rent/anita" },
            { id: "l11", label: "Tarun Tahiliani", path: "/rent/tarun" },
            { id: "l12", label: "Abu Jani Sandeep", path: "/rent/ajs" },
            { id: "l13", label: "Torani", path: "/rent/torani" },
            { id: "l14", label: "Raw Mango", path: "/rent/rawmango" },
            { id: "l15", label: "Rimzim Dadu", path: "/rent/rimzim" },
            { id: "l16", label: "See all designers", path: "/rent/designers", position: "last" },
          ],
        },
      ],
    },
    {
      id: "nav-preloved",
      shown: true,
      label: "Buy Preloved",
      link: "/buy-preloved",
      badge: "",
      style: "Plain",
      hasMenu: true,
      menuEnabled: true,
      menuColumns: [
        {
          id: "col-pre-cat",
          heading: "Shop by Category",
          links: [
            { id: "pl1", label: "Bridal Lehengas", path: "/preloved/bridal" },
            { id: "pl2", label: "Sarees", path: "/preloved/sarees" },
            { id: "pl3", label: "Anarkalis", path: "/preloved/anarkalis" },
            { id: "pl4", label: "Sharara Sets", path: "/preloved/sharara" },
            { id: "pl5", label: "Sherwanis", path: "/preloved/sherwanis" },
          ],
        },
        {
          id: "col-pre-cond",
          heading: "By Condition",
          links: [
            { id: "pl6", label: "Like New", path: "/preloved/likenew" },
            { id: "pl7", label: "Gently Worn", path: "/preloved/gently" },
            { id: "pl8", label: "Loved & Cherished", path: "/preloved/loved" },
          ],
        },
        {
          id: "col-pre-des",
          heading: "Shop by Designer",
          links: [
            { id: "pl9", label: "Sabyasachi", path: "/preloved/sabyasachi" },
            { id: "pl10", label: "Manish Malhotra", path: "/preloved/mm" },
            { id: "pl11", label: "Anita Dongre", path: "/preloved/anita" },
            { id: "pl12", label: "Raw Mango", path: "/preloved/rawmango" },
            { id: "pl13", label: "Tarun Tahiliani", path: "/preloved/tarun" },
            { id: "pl14", label: "Torani", path: "/preloved/torani" },
          ],
        },
        {
          id: "col-pre-price",
          heading: "By Price",
          links: [
            { id: "pl15", label: "Under ₹15,000", path: "/preloved/under15" },
            { id: "pl16", label: "₹15,000 – ₹50,000", path: "/preloved/15to50" },
            { id: "pl17", label: "₹50,000 & above", path: "/preloved/above50" },
          ],
        },
      ],
    },
    {
      id: "nav-buy-new",
      shown: true,
      label: "Buy New",
      link: "/buy-new",
      badge: "",
      style: "Plain",
      hasMenu: true,
      menuEnabled: true,
      menuColumns: [
        {
          id: "col-bn-cat",
          heading: "Shop by Category",
          links: [
            { id: "bn1", label: "Bridal Lehengas", path: "/new/bridal" },
            { id: "bn2", label: "Sarees", path: "/new/sarees" },
            { id: "bn3", label: "Anarkalis", path: "/new/anarkalis" },
            { id: "bn4", label: "Sharara Sets", path: "/new/sharara" },
            { id: "bn5", label: "Sherwanis", path: "/new/sherwanis" },
            { id: "bn6", label: "See all categories", path: "/new/all", position: "last" },
          ],
        },
        {
          id: "col-bn-des",
          heading: "Shop by Designer",
          links: [
            { id: "bn7", label: "Sabyasachi", path: "/new/sabyasachi" },
            { id: "bn8", label: "Manish Malhotra", path: "/new/mm" },
            { id: "bn9", label: "Tarun Tahiliani", path: "/new/tarun" },
            { id: "bn10", label: "Raw Mango", path: "/new/rawmango" },
            { id: "bn11", label: "Torani", path: "/new/torani" },
            { id: "bn12", label: "Ekaya", path: "/new/ekaya" },
            { id: "bn13", label: "See all designers", path: "/new/all", position: "last" },
          ],
        },
      ],
    },
    {
      id: "nav-women",
      shown: true,
      label: "Women",
      link: "/women",
      badge: "",
      style: "Plain",
      hasMenu: true,
      menuEnabled: true,
      menuColumns: [
        {
          id: "col-w-cat",
          heading: "Shop by Category",
          links: [
            { id: "w1", label: "Bridal Lehengas", path: "/women/bridal" },
            { id: "w2", label: "Sarees", path: "/women/sarees" },
            { id: "w3", label: "Anarkalis", path: "/women/anarkalis" },
            { id: "w4", label: "Sharara Sets", path: "/women/sharara" },
            { id: "w5", label: "Kurta Sets", path: "/women/kurta" },
            { id: "w6", label: "Gowns", path: "/women/gowns" },
            { id: "w7", label: "See all", path: "/women/all", position: "last" },
          ],
        },
        {
          id: "col-w-occ",
          heading: "Shop by Occasion",
          links: [
            { id: "w8", label: "Bridal", path: "/women/occ/bridal" },
            { id: "w9", label: "Wedding Guest", path: "/women/occ/guest" },
            { id: "w10", label: "Mehendi & Sangeet", path: "/women/occ/mehendi" },
            { id: "w11", label: "Festive", path: "/women/occ/festive" },
            { id: "w12", label: "Cocktail", path: "/women/occ/cocktail" },
          ],
        },
        {
          id: "col-w-mode",
          heading: "Shop by Mode",
          links: [
            { id: "w13", label: "Rent", path: "/women/rent" },
            { id: "w14", label: "Buy Preloved", path: "/women/preloved" },
            { id: "w15", label: "Buy New", path: "/women/new" },
          ],
        },
      ],
    },
    {
      id: "nav-men",
      shown: true,
      label: "Men",
      link: "/men",
      badge: "",
      style: "Plain",
      hasMenu: true,
      menuEnabled: true,
      menuColumns: [
        {
          id: "col-m-cat",
          heading: "Shop by Category",
          links: [
            { id: "m1", label: "Sherwanis", path: "/men/sherwanis" },
            { id: "m2", label: "Bandhgalas", path: "/men/bandhgala" },
            { id: "m3", label: "Kurta Sets", path: "/men/kurta" },
            { id: "m4", label: "Indo-Western", path: "/men/indowestern" },
            { id: "m5", label: "Nehru Jackets", path: "/men/nehru" },
            { id: "m6", label: "See all", path: "/men/all", position: "last" },
          ],
        },
        {
          id: "col-m-occ",
          heading: "Shop by Occasion",
          links: [
            { id: "m7", label: "Groom", path: "/men/occ/groom" },
            { id: "m8", label: "Wedding Guest", path: "/men/occ/guest" },
            { id: "m9", label: "Festive", path: "/men/occ/festive" },
          ],
        },
        {
          id: "col-m-mode",
          heading: "Shop by Mode",
          links: [
            { id: "m10", label: "Rent", path: "/men/rent" },
            { id: "m11", label: "Buy Preloved", path: "/men/preloved" },
            { id: "m12", label: "Buy New", path: "/men/new" },
          ],
        },
      ],
    },
    {
      id: "nav-occasions",
      shown: true,
      label: "Occasions",
      link: "/occasions",
      badge: "",
      style: "Plain",
      hasMenu: true,
      menuEnabled: true,
      menuColumns: [
        {
          id: "col-occ-br",
          heading: "Browse Occasions",
          links: [
            { id: "o1", label: "Bridal", path: "/occ/bridal" },
            { id: "o2", label: "Wedding Guest", path: "/occ/guest" },
            { id: "o3", label: "Mehendi & Sangeet", path: "/occ/mehendi" },
            { id: "o4", label: "Festive", path: "/occ/festive" },
            { id: "o5", label: "Cocktail", path: "/occ/cocktail" },
            { id: "o6", label: "Reception", path: "/occ/reception" },
            { id: "o7", label: "Engagement", path: "/occ/engagement" },
          ],
        },
        {
          id: "col-occ-mode",
          heading: "Shop by Mode",
          links: [
            { id: "o8", label: "Rent for the occasion", path: "/occ/rent" },
            { id: "o9", label: "Buy Preloved", path: "/preloved/all" },
            { id: "o10", label: "Buy New", path: "/new/all" },
          ],
        },
        {
          id: "col-occ-qf",
          heading: "Quick Filters",
          links: [
            { id: "o11", label: "Under ₹10,000 to rent", path: "/occ/under10" },
            { id: "o12", label: "Available this weekend", path: "/occ/rent" },
            { id: "o13", label: "Ships in 24 hours", path: "/occ/rent" },
          ],
        },
      ],
    },
    {
      id: "nav-designers",
      shown: true,
      label: "Designers",
      link: "/designers",
      badge: "",
      style: "Plain",
      hasMenu: true,
      menuEnabled: true,
      menuColumns: [
        {
          id: "col-des-feat",
          heading: "Featured Designers",
          links: [
            { id: "d1", label: "Sabyasachi", path: "/des/sabyasachi" },
            { id: "d2", label: "Manish Malhotra", path: "/des/mm" },
            { id: "d3", label: "Anita Dongre", path: "/des/anita" },
            { id: "d4", label: "Tarun Tahiliani", path: "/des/tarun" },
            { id: "d5", label: "Raw Mango", path: "/des/rawmango" },
            { id: "d6", label: "Abu Jani Sandeep", path: "/des/ajs" },
            { id: "d7", label: "Torani", path: "/des/torani" },
            { id: "d8", label: "A–Z index", path: "/designers/index", position: "last" },
          ],
        },
        {
          id: "col-des-disc",
          heading: "Discover by Type",
          links: [
            { id: "d9", label: "Couture Houses", path: "/des/couture" },
            { id: "d10", label: "Contemporary Labels", path: "/des/contemporary" },
            { id: "d11", label: "Heritage Weaves", path: "/des/heritage" },
            { id: "d12", label: "Indie Designers", path: "/des/indie" },
          ],
        },
        {
          id: "col-des-new",
          heading: "New to HOK",
          links: [
            { id: "d13", label: "Papa Don't Preach", path: "/des/pap" },
            { id: "d14", label: "Ekaya", path: "/des/ekaya" },
            { id: "d15", label: "Rahul Mishra", path: "/des/rahul" },
            { id: "d16", label: "Partner with HOK", path: "/list/your/piece", position: "last" },
          ],
        },
      ],
    },
    {
      id: "nav-shop-cat",
      shown: true,
      label: "Shop by Category",
      link: "/categories",
      badge: "",
      style: "Plain",
      hasMenu: false,
      menuEnabled: false,
      menuColumns: [],
    },
    {
      id: "nav-how-it-works",
      shown: true,
      label: "How It Works",
      link: "/how-it-works",
      badge: "",
      style: "Plain",
      hasMenu: false,
      menuEnabled: false,
      menuColumns: [],
    },
    {
      id: "nav-about",
      shown: true,
      label: "About HOK",
      link: "/about",
      badge: "",
      style: "Plain",
      hasMenu: false,
      menuEnabled: false,
      menuColumns: [],
    },
    {
      id: "nav-new-arrivals",
      shown: true,
      label: "New Arrivals",
      link: "/new-arrivals",
      badge: "New",
      style: "Plain",
      hasMenu: false,
      menuEnabled: false,
      menuColumns: [],
    },
    {
      id: "nav-list-your-piece",
      shown: true,
      label: "List Your Piece",
      link: "/list-your-piece",
      badge: "",
      style: "Highlight",
      hasMenu: false,
      menuEnabled: false,
      menuColumns: [],
    },
  ],
};

export function normalizeHeaderSettings(raw) {
  if (!raw) return { ...DEFAULT_HEADER_SETTINGS };

  const searchPlaceholder =
    raw.searchPlaceholder || DEFAULT_HEADER_SETTINGS.searchPlaceholder;
  const bagCartLabel =
    raw.bagCartLabel === "Bag" ? "Bag" : "Cart";
  const stickyHeader =
    typeof raw.stickyHeader === "boolean"
      ? raw.stickyHeader
      : DEFAULT_HEADER_SETTINGS.stickyHeader;
  const showTagline =
    typeof raw.showTagline === "boolean"
      ? raw.showTagline
      : DEFAULT_HEADER_SETTINGS.showTagline;

  const reducedHeader = {
    backLink:
      raw.reducedHeader?.backLink ||
      DEFAULT_HEADER_SETTINGS.reducedHeader.backLink,
    securityLine:
      raw.reducedHeader?.securityLine ||
      DEFAULT_HEADER_SETTINGS.reducedHeader.securityLine,
    pagesUsingIt:
      raw.reducedHeader?.pagesUsingIt ||
      DEFAULT_HEADER_SETTINGS.reducedHeader.pagesUsingIt,
  };

  let navItems = [];
  if (Array.isArray(raw.navItems) && raw.navItems.length > 0) {
    navItems = raw.navItems.map((item, idx) => ({
      id: item.id || `nav-${idx + 1}`,
      shown: item.shown !== false,
      label: item.label || "",
      link: item.link || "",
      badge: item.badge || "",
      style: ["Plain", "Accent", "Highlight"].includes(item.style)
        ? item.style
        : "Plain",
      hasMenu: typeof item.hasMenu === "boolean" ? item.hasMenu : false,
      menuEnabled: typeof item.menuEnabled === "boolean" ? item.menuEnabled : false,
      menuColumns: Array.isArray(item.menuColumns)
        ? item.menuColumns.map((col, cIdx) => ({
            id: col.id || `col-${cIdx + 1}`,
            heading: col.heading || "",
            hidden: !!col.hidden,
            links: Array.isArray(col.links)
              ? col.links.map((lnk, lIdx) => ({
                  id: lnk.id || `l-${lIdx + 1}`,
                  label: lnk.label || "",
                  path: lnk.path || "",
                  position: lnk.position || undefined,
                  hidden: !!lnk.hidden,
                }))
              : [],
          }))
        : [],
      isExpanded: !!item.isExpanded,
    }));
  } else {
    navItems = DEFAULT_HEADER_SETTINGS.navItems;
  }

  return {
    searchPlaceholder,
    bagCartLabel,
    stickyHeader,
    showTagline,
    reducedHeader,
    navItems,
  };
}


export const DEFAULT_FOOTER_SETTINGS = {
  blurbUnderWordmark: "{{tagline}}",
  copyrightLine: "© {{year}} House of Kaira. All rights reserved. Indore, India.",
  trustBadges: "Secure Payments, Circular Fashion",
  paymentMethods: {
    upi: true,
    visa: true,
    mastercard: true,
    rupay: true,
    netbanking: true,
    paytm: false,
    amex: false,
    nocost_emi: false,
  },
  newsletter: {
    show: false,
    heading: "Stay in the loop",
    buttonLabel: "Subscribe",
    body: "Get early access to drops and exclusive promotions.",
    consentLine: "By subscribing you agree to our Privacy Policy.",
  },
  linkColumns: [
    {
      id: "col-shop",
      heading: "Shop",
      links: [
        { id: "fl-1", label: "Rent", path: "/rent" },
        { id: "fl-2", label: "Buy Preloved", path: "/preloved" },
        { id: "fl-3", label: "Buy New", path: "/buy-new" },
        { id: "fl-4", label: "Shop by Occasion", path: "/occasions" },
        { id: "fl-5", label: "Shop by Category", path: "/categories" },
        { id: "fl-6", label: "All Designers", path: "/designers" },
      ],
    },
    {
      id: "col-sell",
      heading: "Sell with Us",
      links: [
        { id: "fl-7", label: "List Your Piece", path: "/list-your-piece" },
        { id: "fl-8", label: "How It Works", path: "/how-it-works" },
        { id: "fl-9", label: "Seller Guidelines", path: "/seller-guidelines" },
        { id: "fl-10", label: "Pricing & Fees", path: "/pricing" },
        { id: "fl-11", label: "Designer Partners", path: "/designer-partners" },
      ],
    },
    {
      id: "col-support",
      heading: "Support",
      links: [
        { id: "fl-12", label: "FAQs", path: "/faqs" },
        { id: "fl-13", label: "Care, Cleaning & Damage", path: "/care-policy" },
        { id: "fl-14", label: "Deposit Policy", path: "/deposit-policy" },
        { id: "fl-15", label: "Refunds & Cancellations", path: "/refunds" },
        { id: "fl-16", label: "Contact Us", path: "/contact" },
      ],
    },
    {
      id: "col-company",
      heading: "Company",
      links: [
        { id: "fl-17", label: "About HOK", path: "/about" },
        { id: "fl-18", label: "Sustainability", path: "/sustainability" },
        { id: "fl-19", label: "Careers", path: "/careers" },
        { id: "fl-20", label: "Press", path: "/press" },
        { id: "fl-21", label: "Blog", path: "/blog" },
      ],
    },
  ],
  legalRow: [
    { id: "leg-1", label: "Terms & Conditions", path: "/terms" },
    { id: "leg-2", label: "Privacy Policy", path: "/privacy" },
    { id: "leg-3", label: "Refund & Cancellation Policy", path: "/refunds" },
    { id: "leg-4", label: "Deposit Policy", path: "/deposit-policy" },
    { id: "leg-5", label: "Care, Cleaning & Damage Policy", path: "/care-policy" },
    { id: "leg-6", label: "Shipping Policy", path: "/shipping-policy" },
    { id: "leg-7", label: "Cookie Policy", path: "/cookies" },
  ],
};

export function normalizeFooterSettings(raw, context = {}) {
  if (!raw) return { ...DEFAULT_FOOTER_SETTINGS };

  const rawBlurb = raw.blurbUnderWordmark !== undefined
    ? raw.blurbUnderWordmark
    : DEFAULT_FOOTER_SETTINGS.blurbUnderWordmark;
  const blurbUnderWordmark = resolveTemplateVariables(rawBlurb, context);

  const rawCopyright = raw.copyrightLine !== undefined
    ? raw.copyrightLine
    : DEFAULT_FOOTER_SETTINGS.copyrightLine;
  const copyrightLine = resolveTemplateVariables(rawCopyright, context);

  const trustBadges =
    typeof raw.trustBadges === "string"
      ? raw.trustBadges
      : DEFAULT_FOOTER_SETTINGS.trustBadges;

  const paymentMethods = {
    ...DEFAULT_FOOTER_SETTINGS.paymentMethods,
    ...(raw.paymentMethods || {}),
  };

  const newsletter = {
    show:
      typeof raw.newsletter?.show === "boolean"
        ? raw.newsletter.show
        : DEFAULT_FOOTER_SETTINGS.newsletter.show,
    heading:
      raw.newsletter?.heading || DEFAULT_FOOTER_SETTINGS.newsletter.heading,
    buttonLabel:
      raw.newsletter?.buttonLabel ||
      DEFAULT_FOOTER_SETTINGS.newsletter.buttonLabel,
    body:
      raw.newsletter?.body || DEFAULT_FOOTER_SETTINGS.newsletter.body,
    consentLine:
      raw.newsletter?.consentLine ||
      DEFAULT_FOOTER_SETTINGS.newsletter.consentLine,
  };

  let linkColumns = [];
  if (Array.isArray(raw.linkColumns) && raw.linkColumns.length > 0) {
    linkColumns = raw.linkColumns.map((col, idx) => ({
      id: col.id || `col-${idx + 1}`,
      heading: col.heading || "",
      links: Array.isArray(col.links)
        ? col.links.map((lnk, lIdx) => ({
            id: lnk.id || `fl-${lIdx + 1}`,
            label: lnk.label || "",
            path: lnk.path || "",
          }))
        : [],
    }));
  } else {
    linkColumns = DEFAULT_FOOTER_SETTINGS.linkColumns;
  }

  let legalRow = [];
  if (Array.isArray(raw.legalRow) && raw.legalRow.length > 0) {
    legalRow = raw.legalRow.map((link, idx) => ({
      id: link.id || `leg-${idx + 1}`,
      label: link.label || "",
      path: link.path || "",
    }));
  } else {
    legalRow = DEFAULT_FOOTER_SETTINGS.legalRow;
  }

  return {
    blurbUnderWordmark,
    rawBlurbUnderWordmark: rawBlurb,
    copyrightLine,
    rawCopyrightLine: rawCopyright,
    trustBadges,
    paymentMethods,
    newsletter,
    linkColumns,
    legalRow,
  };
}

let inMemorySettings = {
  key: "global_settings",
  siteName: "House of Kaira",
  tagline: "Curation of designer luxury dress rentals",
  supportEmail: "support@houseofkaira.com",
  whatsappNumber: "+91 98765 43210",
  instagramHandle: "@houseofkaira",
  announcement: { ...DEFAULT_ANNOUNCEMENT_SETTINGS },
  announcementBar: {
    text: DEFAULT_ANNOUNCEMENT_SETTINGS.messages[0].text,
    enabled: DEFAULT_ANNOUNCEMENT_SETTINGS.showAcrossSite,
    howItMoves: DEFAULT_ANNOUNCEMENT_SETTINGS.howItMoves,
    loopTime: DEFAULT_ANNOUNCEMENT_SETTINGS.loopTimeSeconds,
    pauseOnHover: DEFAULT_ANNOUNCEMENT_SETTINGS.pauseOnHover,
    backgroundColor: DEFAULT_ANNOUNCEMENT_SETTINGS.backgroundColor,
    textColor: DEFAULT_ANNOUNCEMENT_SETTINGS.textColor,
    italicColor: DEFAULT_ANNOUNCEMENT_SETTINGS.italicLineColor,
    separator: DEFAULT_ANNOUNCEMENT_SETTINGS.separator,
    messages: DEFAULT_ANNOUNCEMENT_SETTINGS.messages,
  },
  header: { ...DEFAULT_HEADER_SETTINGS },
  footer: { ...DEFAULT_FOOTER_SETTINGS },
};

/**
 * Resolves template variables like {{free_delivery_min}}, {{site_name}}, etc.
 */
export function resolveTemplateVariables(text, context = {}) {
  if (!text || typeof text !== "string") return "";
  let result = text;
  const values = {
    "{{site_name}}": context.siteName || "House of Kaira",
    "{{tagline}}": context.tagline || "Circular Luxury Fashion",
    "{{sep}}": "—",
    "{{cart_label}}": context.cartLabel || "Cart",
    "{{year}}": new Date().getFullYear().toString(),
    "{{support_email}}": context.supportEmail || "hello@houseofkaira.com",
    "{{support_whatsapp}}": context.whatsappNumber || "+91 98765 43210",
    "{{support_hours}}": "10 AM – 8 PM IST",
    "{{support_days}}": "7 days a week",
    "{{support_sla}}": "2 hours",
    "{{instagram_handle}}": context.instagramHandle || "@house_of_kaira",
    "{{free_delivery_min}}": context.freeDeliveryMin || "₹2,999",
    "{{free_delivery_min_rental}}": context.freeDeliveryMinRental || "₹5,000",
    "{{payout_cycle}}": "T+3 working days",
    "{{deposit_refund_window}}": "3–5 business days",
  };

  for (const [code, val] of Object.entries(values)) {
    result = result.split(code).join(val);
  }
  return result;
}

/**
 * Checks whether an announcement message is active based on enabled flag, go-live date, and expires date.
 */
export function isMessageActive(msg, referenceDate = new Date()) {
  if (!msg) return false;
  if (msg.enabled === false) return false;

  if (msg.goLiveDate && typeof msg.goLiveDate === "string" && msg.goLiveDate.trim()) {
    const goLive = new Date(msg.goLiveDate);
    if (!isNaN(goLive.getTime()) && goLive > referenceDate) {
      return false; // Scheduled for future
    }
  }

  if (msg.expiresDate && typeof msg.expiresDate === "string" && msg.expiresDate.trim()) {
    const expires = new Date(msg.expiresDate);
    // Expiration date is inclusive of the entire day
    expires.setHours(23, 59, 59, 999);
    if (!isNaN(expires.getTime()) && expires < referenceDate) {
      return false; // Expired
    }
  }

  return true;
}

/**
 * Normalizes announcement settings into consistent schema.
 */
export function normalizeAnnouncementSettings(raw) {
  if (!raw) return { ...DEFAULT_ANNOUNCEMENT_SETTINGS };

  const showAcrossSite =
    typeof raw.showAcrossSite === "boolean"
      ? raw.showAcrossSite
      : typeof raw.enabled === "boolean"
      ? raw.enabled
      : DEFAULT_ANNOUNCEMENT_SETTINGS.showAcrossSite;

  const howItMoves = raw.howItMoves || DEFAULT_ANNOUNCEMENT_SETTINGS.howItMoves;
  const loopTimeSeconds =
    Number(raw.loopTimeSeconds || raw.loopTime) ||
    DEFAULT_ANNOUNCEMENT_SETTINGS.loopTimeSeconds;
  const pauseOnHover =
    typeof raw.pauseOnHover === "boolean"
      ? raw.pauseOnHover
      : DEFAULT_ANNOUNCEMENT_SETTINGS.pauseOnHover;
  const backgroundColor =
    raw.backgroundColor || raw.bgColor || DEFAULT_ANNOUNCEMENT_SETTINGS.backgroundColor;
  const textColor =
    raw.textColor || DEFAULT_ANNOUNCEMENT_SETTINGS.textColor;
  const italicLineColor =
    raw.italicLineColor || raw.italicColor || DEFAULT_ANNOUNCEMENT_SETTINGS.italicLineColor;
  const separator =
    raw.separator || DEFAULT_ANNOUNCEMENT_SETTINGS.separator;

  let messages = [];
  if (Array.isArray(raw.messages) && raw.messages.length > 0) {
    messages = raw.messages.map((m, idx) => ({
      id: m.id || `msg-${idx + 1}`,
      text: m.text || "",
      italicSerif:
        typeof m.italicSerif === "boolean"
          ? m.italicSerif
          : typeof m.printItalicSerif === "boolean"
          ? m.printItalicSerif
          : m.type === "italic",
      showsOn: m.showsOn || m.scope || "All pages",
      link: m.link || "",
      goLiveDate: m.goLiveDate || "",
      expiresDate: m.expiresDate || "",
      enabled: m.enabled !== false,
    }));
  } else {
    messages = DEFAULT_ANNOUNCEMENT_SETTINGS.messages;
  }

  return {
    showAcrossSite,
    howItMoves,
    loopTimeSeconds,
    pauseOnHover,
    backgroundColor,
    textColor,
    italicLineColor,
    separator,
    messages,
  };
}

// Database helper: fetch settings
async function getSettingsFromDb() {
  try {
    const dbRes = await pool.query(
      `SELECT data FROM site_settings WHERE key = 'global_settings' LIMIT 1`
    );
    if (dbRes && dbRes.rows && dbRes.rows.length > 0) {
      const raw = dbRes.rows[0].data;
      return typeof raw === "string" ? JSON.parse(raw) : (raw || {});
    }
  } catch (err) {
    console.warn("DB read note for site settings:", err.message);
  }
  return null;
}

// Database helper: save settings
async function saveSettingsToDb(settingsData) {
  try {
    await pool.query(
      `INSERT INTO site_settings (key, data, updated_at) 
       VALUES ('global_settings', $1, NOW()) 
       ON CONFLICT (key) 
       DO UPDATE SET data = $1, updated_at = NOW()`,
      [JSON.stringify(settingsData)]
    );
    return true;
  } catch (err) {
    console.warn("DB save note for site settings:", err.message);
    return false;
  }
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

/**
 * GET /api/site-settings/announcement/public
 * Public storefront endpoint (cached / non-auth)
 */
router.get("/announcement/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const rawAnn = dbData.announcement || dbData.announcementBar;
    const announcement = normalizeAnnouncementSettings(rawAnn);

    if (announcement.showAcrossSite === false) {
      return res.json({
        success: true,
        data: {
          showAcrossSite: false,
          howItMoves: announcement.howItMoves,
          loopTimeSeconds: announcement.loopTimeSeconds,
          pauseOnHover: announcement.pauseOnHover,
          backgroundColor: announcement.backgroundColor,
          textColor: announcement.textColor,
          italicLineColor: announcement.italicLineColor,
          separator: announcement.separator,
          messages: [],
        },
      });
    }

    const context = {
      siteName: dbData.brand?.siteName || dbData.siteName,
      tagline: dbData.brand?.tagline || dbData.tagline,
      supportEmail: dbData.contact?.supportEmail || dbData.supportEmail,
      whatsappNumber: dbData.contact?.whatsApp || dbData.whatsappNumber,
      instagramHandle: dbData.contact?.social?.instagram || dbData.instagramHandle,
      cartLabel: dbData.header?.bagCartLabel,
    };

    const activeMessages = (announcement.messages || [])
      .filter((m) => isMessageActive(m))
      .map((m) => ({
        id: m.id,
        text: resolveTemplateVariables(m.text, context),
        rawText: m.text,
        italicSerif: !!m.italicSerif,
        showsOn: m.showsOn || "All pages",
        link: m.link || "",
        enabled: true,
      }));

    return res.json({
      success: true,
      data: {
        showAcrossSite: true,
        howItMoves: announcement.howItMoves,
        loopTimeSeconds: announcement.loopTimeSeconds,
        pauseOnHover: announcement.pauseOnHover,
        backgroundColor: announcement.backgroundColor,
        textColor: announcement.textColor,
        italicLineColor: announcement.italicLineColor,
        separator: announcement.separator,
        messages: activeMessages,
      },
    });
  } catch (error) {
    console.error("Error in public announcement endpoint:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/announcement
 * Admin endpoint: retrieve announcement configuration
 */
router.get("/announcement", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const announcement = normalizeAnnouncementSettings(
      dbData.announcement || dbData.announcementBar
    );

    return res.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error("Error retrieving announcement configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/announcement
 * Admin endpoint: update announcement configuration
 */
router.put("/announcement", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputAnn = body.announcement || body;
    const normalized = normalizeAnnouncementSettings(inputAnn);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      announcement: normalized,
      announcementBar: {
        text: normalized.messages?.[0]?.text || "",
        enabled: normalized.showAcrossSite,
        howItMoves: normalized.howItMoves,
        loopTime: normalized.loopTimeSeconds,
        pauseOnHover: normalized.pauseOnHover,
        backgroundColor: normalized.backgroundColor,
        textColor: normalized.textColor,
        italicColor: normalized.italicLineColor,
        separator: normalized.separator,
        messages: normalized.messages,
      },
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Announcement settings updated successfully",
      data: normalized,
    });
  } catch (error) {
    console.error("Error updating announcement settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * GET /api/site-settings/header/public
 * Public storefront endpoint
 */
router.get("/header/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const header = normalizeHeaderSettings(dbData.header);
    return res.json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Error in public header endpoint:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/header
 * Admin endpoint: retrieve header configuration
 */
router.get("/header", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const header = normalizeHeaderSettings(dbData.header);
    return res.json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Error retrieving header configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/header
 * Admin endpoint: update header configuration
 */
router.put("/header", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputHeader = body.header || body;
    const normalized = normalizeHeaderSettings(inputHeader);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      header: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Header settings updated successfully",
      data: normalized,
    });
  } catch (error) {
    console.error("Error updating header settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * GET /api/site-settings/footer/public
 * Public storefront endpoint
 */
router.get("/footer/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const context = {
      siteName: dbData.brand?.siteName || dbData.siteName,
      tagline: dbData.brand?.tagline || dbData.tagline,
      supportEmail: dbData.contact?.supportEmail || dbData.supportEmail,
      whatsappNumber: dbData.contact?.whatsApp || dbData.whatsappNumber,
      instagramHandle: dbData.contact?.social?.instagram || dbData.instagramHandle,
    };
    const footer = normalizeFooterSettings(dbData.footer, context);
    return res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    console.error("Error in public footer endpoint:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/footer
 * Admin endpoint: retrieve footer configuration
 */
router.get("/footer", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const footer = normalizeFooterSettings(dbData.footer);
    return res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    console.error("Error retrieving footer configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/footer
 * Admin endpoint: update footer configuration
 */
router.put("/footer", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputFooter = body.footer || body;
    const normalized = normalizeFooterSettings(inputFooter);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      footer: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Footer settings updated successfully",
      data: normalized,
    });
  } catch (error) {
    console.error("Error updating footer settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// MOBILE BAR CMS INTEGRATION HELPERS & ROUTES
// ==========================================

const DEFAULT_MOBILE_SETTINGS = {
  tabs: [
    { id: "mtab-1", label: "Home", path: "/", shown: true },
    { id: "mtab-2", label: "Browse", path: "/rent", shown: true },
    { id: "mtab-3", label: "Wishlist", path: "/wishlist", shown: true },
    { id: "mtab-4", label: "Bag", path: "/cart", shown: true, isBagTab: true },
    { id: "mtab-5", label: "Account", path: "/profile", shown: true },
  ],
  drawer: {
    showSearchField: true,
    showModeShortcuts: true,
    itemVisibility: {
      "nav-rent": true,
      "nav-preloved": true,
      "nav-buy-new": true,
      "nav-women": true,
      "nav-men": true,
      "nav-occasions": true,
      "nav-designers": true,
      "nav-shop-cat": true,
      "nav-how-it-works": true,
      "nav-about": true,
      "nav-new-arrivals": true,
      "nav-list-your-piece": true,
    },
  },
};

function normalizeMobileSettings(raw, context = {}) {
  const source = raw || {};
  const bagCartLabel = context?.header?.bagCartLabel || "Bag";

  let tabs = [];
  if (Array.isArray(source.tabs) && source.tabs.length > 0) {
    tabs = source.tabs.map((tab, idx) => {
      const isBag =
        tab.isBagTab ||
        tab.id === "mtab-4" ||
        tab.label?.toLowerCase() === "bag" ||
        tab.label?.toLowerCase() === "cart";
      return {
        id: String(tab.id || `mtab-${idx + 1}`),
        label: isBag
          ? context.forPublic
            ? bagCartLabel
            : tab.label || bagCartLabel
          : String(tab.label || ""),
        path: String(tab.path || "/"),
        shown: tab.shown !== false,
        isBagTab: !!isBag,
      };
    });
  } else {
    tabs = DEFAULT_MOBILE_SETTINGS.tabs.map((t) => ({ ...t }));
  }

  const drawerRaw = source.drawer || {};
  const drawer = {
    showSearchField: drawerRaw.showSearchField !== false,
    showModeShortcuts: drawerRaw.showModeShortcuts !== false,
    itemVisibility:
      typeof drawerRaw.itemVisibility === "object" && drawerRaw.itemVisibility !== null
        ? { ...DEFAULT_MOBILE_SETTINGS.drawer.itemVisibility, ...drawerRaw.itemVisibility }
        : { ...DEFAULT_MOBILE_SETTINGS.drawer.itemVisibility },
  };

  return {
    tabs,
    drawer,
  };
}

/**
 * GET /api/site-settings/mobile/public
 * Public endpoint: returns active mobile bar and drawer configuration for storefront
 */
router.get("/mobile/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const headerSettings = normalizeHeaderSettings(dbData.header);
    const normalized = normalizeMobileSettings(dbData.mobile || dbData.mobileBar, {
      header: headerSettings,
      forPublic: true,
    });

    return res.json({
      success: true,
      data: normalized,
    });
  } catch (error) {
    console.error("Error retrieving public mobile settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/mobile
 * Admin endpoint: retrieve raw mobile settings
 */
router.get("/mobile", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const headerSettings = normalizeHeaderSettings(dbData.header);
    const normalized = normalizeMobileSettings(dbData.mobile || dbData.mobileBar, {
      header: headerSettings,
      forPublic: false,
    });
    merged.brand = normalizeBrandSettings(merged.brand);

    return res.json({
      success: true,
      data: normalized,
    });
  } catch (error) {
    console.error("Error retrieving mobile configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/mobile
 * Admin endpoint: update mobile configuration
 */
router.put("/mobile", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputMobile = body.mobile || body.mobileBar || body;
    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const headerSettings = normalizeHeaderSettings(currentDbData.header);
    const normalized = normalizeMobileSettings(inputMobile, {
      header: headerSettings,
      forPublic: false,
    });

    const updatedData = {
      ...currentDbData,
      mobile: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Mobile bar settings updated successfully",
      data: normalized,
    });
  } catch (error) {
    console.error("Error updating mobile settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// BRAND CMS INTEGRATION HELPERS & ROUTES
// ==========================================

const DEFAULT_BRAND_SETTINGS = {
  siteName: "House of Kaira",
  tagline: "Circular Luxury Fashion",
  brandQuote: "Every outfit has a story. We make sure it's never the last chapter.",
  assets: {
    logoMark: {
      file: "hok-logo.png",
      dataUrl: "",
      dimensions: "512×512",
      sizeKb: 24,
      addedBy: "Soumya",
      addedWhen: "12 days ago",
    },
    wordmark: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
    inverseMark: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
    browserTabIcon: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
    phoneHomeScreenIcon: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
    linkPreviewImage: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
  },
};

function normalizeAssetSlot(rawSlot, defaultSlot = {}) {
  const slot = rawSlot || {};
  return {
    file: String(slot.file || defaultSlot.file || ""),
    dataUrl: String(slot.dataUrl || defaultSlot.dataUrl || ""),
    dimensions: String(slot.dimensions || defaultSlot.dimensions || ""),
    sizeKb: typeof slot.sizeKb === "number" ? slot.sizeKb : (defaultSlot.sizeKb || 0),
    addedBy: String(slot.addedBy || defaultSlot.addedBy || "Admin"),
    addedWhen: String(slot.addedWhen || defaultSlot.addedWhen || "Recently"),
  };
}

function normalizeBrandSettings(raw) {
  const source = raw || {};
  const rawAssets = source.assets || {};

  return {
    siteName: String(source.siteName || DEFAULT_BRAND_SETTINGS.siteName).trim(),
    tagline: String(source.tagline || DEFAULT_BRAND_SETTINGS.tagline).trim(),
    brandQuote: String(source.brandQuote || DEFAULT_BRAND_SETTINGS.brandQuote).trim(),
    assets: {
      logoMark: normalizeAssetSlot(rawAssets.logoMark, DEFAULT_BRAND_SETTINGS.assets.logoMark),
      wordmark: normalizeAssetSlot(rawAssets.wordmark, DEFAULT_BRAND_SETTINGS.assets.wordmark),
      inverseMark: normalizeAssetSlot(rawAssets.inverseMark, DEFAULT_BRAND_SETTINGS.assets.inverseMark),
      browserTabIcon: normalizeAssetSlot(rawAssets.browserTabIcon, DEFAULT_BRAND_SETTINGS.assets.browserTabIcon),
      phoneHomeScreenIcon: normalizeAssetSlot(rawAssets.phoneHomeScreenIcon, DEFAULT_BRAND_SETTINGS.assets.phoneHomeScreenIcon),
      linkPreviewImage: normalizeAssetSlot(rawAssets.linkPreviewImage, DEFAULT_BRAND_SETTINGS.assets.linkPreviewImage),
    },
  };
}

/**
 * GET /api/site-settings/brand/public
 * Public endpoint: returns active brand settings (names, quotes, logo assets) for storefront
 */
router.get("/brand/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeBrandSettings(dbData.brand);

    return res.json({
      success: true,
      data: normalized,
    });
  } catch (error) {
    console.error("Error retrieving public brand settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/brand
 * Admin endpoint: retrieve brand settings
 */
router.get("/brand", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeBrandSettings(dbData.brand);

    return res.json({
      success: true,
      data: normalized,
    });
  } catch (error) {
    console.error("Error retrieving brand configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/brand
 * Admin endpoint: update brand configuration
 */
router.put("/brand", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputBrand = body.brand || body;
    const normalized = normalizeBrandSettings(inputBrand);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      brand: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Brand settings updated successfully",
      data: normalized,
    });
  } catch (error) {
    console.error("Error updating brand settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


export const DEFAULT_CONTACT_SETTINGS = {
  supportEmail: "hello@houseofkaira.com",
  phone: "+91 731 4005 220",
  whatsApp: "+91 98765 43210",
  daysOpen: "7 days a week",
  hours: "10 AM – 8 PM IST",
  replyWithinHrs: 2,
  returnsAddress: {
    addressedTo: "HOK Returns Desk",
    addressLine1: "14 Vijay Nagar",
    addressLine2: "Scheme 54",
    landmark: "",
    city: "Indore",
    state: "Madhya Pradesh",
    pinCode: "452010",
    contactNumber: "+91 731 4005 220",
  },
  whatsAppButton: {
    show: true,
    tooltip: "Chat with us",
    preFilledMessage: "Hi House of Kaira, I have a question about",
  },
  social: {
    instagram: "@house_of_kaira",
    followLabel: "Follow Us",
    facebook: "",
    pinterest: "",
    youTube: "",
    linkedIn: "",
  },
};

export function normalizeContactSettings(raw) {
  const c = raw || {};
  const def = DEFAULT_CONTACT_SETTINGS;
  const retAddr = c.returnsAddress || {};
  const waBtn = c.whatsAppButton || {};
  const soc = c.social || {};

  return {
    supportEmail: typeof c.supportEmail === "string" && c.supportEmail.trim()
      ? c.supportEmail.trim()
      : def.supportEmail,
    phone: typeof c.phone === "string" && c.phone.trim()
      ? c.phone.trim()
      : def.phone,
    whatsApp: typeof c.whatsApp === "string" && c.whatsApp.trim()
      ? c.whatsApp.trim()
      : def.whatsApp,
    daysOpen: typeof c.daysOpen === "string" && c.daysOpen.trim()
      ? c.daysOpen.trim()
      : def.daysOpen,
    hours: typeof c.hours === "string" && c.hours.trim()
      ? c.hours.trim()
      : def.hours,
    replyWithinHrs: typeof c.replyWithinHrs === "number" && !isNaN(c.replyWithinHrs)
      ? c.replyWithinHrs
      : (parseInt(c.replyWithinHrs, 10) || def.replyWithinHrs),
    returnsAddress: {
      addressedTo: typeof retAddr.addressedTo === "string" ? retAddr.addressedTo.trim() : def.returnsAddress.addressedTo,
      addressLine1: typeof retAddr.addressLine1 === "string" ? retAddr.addressLine1.trim() : def.returnsAddress.addressLine1,
      addressLine2: typeof retAddr.addressLine2 === "string" ? retAddr.addressLine2.trim() : def.returnsAddress.addressLine2,
      landmark: typeof retAddr.landmark === "string" ? retAddr.landmark.trim() : def.returnsAddress.landmark,
      city: typeof retAddr.city === "string" ? retAddr.city.trim() : def.returnsAddress.city,
      state: typeof retAddr.state === "string" ? retAddr.state.trim() : def.returnsAddress.state,
      pinCode: typeof retAddr.pinCode === "string" ? retAddr.pinCode.replace(/\D/g, "").slice(0, 6) : def.returnsAddress.pinCode,
      contactNumber: typeof retAddr.contactNumber === "string" ? retAddr.contactNumber.trim() : def.returnsAddress.contactNumber,
    },
    whatsAppButton: {
      show: waBtn.show !== undefined ? !!waBtn.show : def.whatsAppButton.show,
      tooltip: typeof waBtn.tooltip === "string" ? waBtn.tooltip.trim() : def.whatsAppButton.tooltip,
      preFilledMessage: typeof waBtn.preFilledMessage === "string" ? waBtn.preFilledMessage : def.whatsAppButton.preFilledMessage,
    },
    social: {
      instagram: typeof soc.instagram === "string" ? soc.instagram.trim() : def.social.instagram,
      followLabel: typeof soc.followLabel === "string" ? soc.followLabel.trim() : def.social.followLabel,
      facebook: typeof soc.facebook === "string" ? soc.facebook.trim() : def.social.facebook,
      pinterest: typeof soc.pinterest === "string" ? soc.pinterest.trim() : def.social.pinterest,
      youTube: typeof soc.youTube === "string" ? soc.youTube.trim() : def.social.youTube,
      linkedIn: typeof soc.linkedIn === "string" ? soc.linkedIn.trim() : def.social.linkedIn,
    },
  };
}

/**
 * GET /api/site-settings/contact/public
 * Public endpoint: returns active contact configuration for storefront
 */
router.get("/contact/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeContactSettings(dbData.contact);

    return res.json({
      success: true,
      data: normalized,
      contact: normalized,
    });
  } catch (error) {
    console.error("Error retrieving public contact settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/contact
 * Admin endpoint: retrieve contact settings
 */
router.get("/contact", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeContactSettings(dbData.contact);

    return res.json({
      success: true,
      data: normalized,
      contact: normalized,
    });
  } catch (error) {
    console.error("Error retrieving contact configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/contact
 * Admin endpoint: update contact configuration
 */
router.put("/contact", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputContact = body.contact || body;
    const normalized = normalizeContactSettings(inputContact);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      contact: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Contact settings updated successfully",
      data: normalized,
      contact: normalized,
    });
  } catch (error) {
    console.error("Error updating contact settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


export const DEFAULT_GOOGLE_SETTINGS = {
  headline: "House of Kaira — Rent, Buy & List Luxury Indian Occasion Wear",
  description: "Discover India’s most curated platform for luxury occasion wear — rent, buy preloved, or list your own Sabyasachi, Manish Malhotra, and more.",
  allowSearchEngines: true,
  tracking: {
    googleAnalytics: "",
    metaPixel: "",
    googleSearchConsole: "",
  },
  devSettings: {
    titleTemplate: "{{page_title}} {{sep}} {{site_name}}",
    separator: "—",
    canonicalAddress: "https://houseofkaira.com",
    publishSitemap: true,
  },
};

export function normalizeGoogleSettings(raw, context = {}) {
  const g = raw || {};
  const def = DEFAULT_GOOGLE_SETTINGS;
  const trk = g.tracking || {};
  const dev = g.devSettings || {};

  const rawGA = typeof trk.googleAnalytics === "string" ? trk.googleAnalytics.trim() : "";
  const cleanGA = /^(G-[A-Za-z0-9]+|UA-\d+-\d+)$/.test(rawGA)
    ? rawGA
    : (rawGA ? "" : def.tracking.googleAnalytics);

  const rawPixel = typeof trk.metaPixel === "string" ? trk.metaPixel.trim() : "";
  const cleanPixel = /^\d+$/.test(rawPixel)
    ? rawPixel
    : (rawPixel ? "" : def.tracking.metaPixel);

  const rawGSC = typeof trk.googleSearchConsole === "string" ? trk.googleSearchConsole.trim() : "";
  let cleanGSC = rawGSC;
  const contentMatch = rawGSC.match(/content=["']([^"']+)["']/i);
  if (contentMatch) {
    cleanGSC = contentMatch[1].trim();
  }

  return {
    headline:
      typeof g.headline === "string" && g.headline.trim()
        ? g.headline.trim()
        : def.headline,
    description:
      typeof g.description === "string" && g.description.trim()
        ? g.description.trim()
        : def.description,
    allowSearchEngines:
      g.allowSearchEngines !== undefined
        ? !!g.allowSearchEngines
        : def.allowSearchEngines,
    tracking: {
      googleAnalytics: cleanGA,
      metaPixel: cleanPixel,
      googleSearchConsole: cleanGSC,
    },
    devSettings: {
      titleTemplate:
        typeof dev.titleTemplate === "string" && dev.titleTemplate.trim()
          ? dev.titleTemplate.trim()
          : def.devSettings.titleTemplate,
      separator:
        typeof dev.separator === "string" && dev.separator.trim()
          ? dev.separator.trim()
          : def.devSettings.separator,
      canonicalAddress:
        typeof dev.canonicalAddress === "string" && dev.canonicalAddress.trim()
          ? dev.canonicalAddress.trim()
          : def.devSettings.canonicalAddress,
      publishSitemap:
        dev.publishSitemap !== undefined
          ? !!dev.publishSitemap
          : def.devSettings.publishSitemap,
    },
  };
}

/**
 * GET /api/site-settings/google/public
 * Public endpoint: returns public SEO, analytics and verification settings
 */
router.get("/google/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeGoogleSettings(dbData.google);

    return res.json({
      success: true,
      data: normalized,
      google: normalized,
    });
  } catch (error) {
    console.error("Error retrieving public google settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/google
 * Admin endpoint: retrieve Google & sharing settings
 */
router.get("/google", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeGoogleSettings(dbData.google);

    return res.json({
      success: true,
      data: normalized,
      google: normalized,
    });
  } catch (error) {
    console.error("Error retrieving google configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/google
 * Admin endpoint: update Google & sharing configuration
 */
router.put("/google", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputGoogle = body.google || body;
    const normalized = normalizeGoogleSettings(inputGoogle);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      google: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Google settings updated successfully",
      data: normalized,
      google: normalized,
    });
  } catch (error) {
    console.error("Error updating google settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/robots.txt
 * Dynamic robots.txt based on Google allowSearchEngines and sitemap settings
 */
router.get("/robots.txt", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const google = normalizeGoogleSettings(dbData.google);
    res.setHeader("Content-Type", "text/plain");
    if (!google.allowSearchEngines) {
      return res.send("User-agent: *\nDisallow: /\n");
    }
    const cleanCanonical = (google.devSettings.canonicalAddress || "").replace(/\/$/, "");
    const sitemapLine = google.devSettings.publishSitemap && cleanCanonical
      ? `\nSitemap: ${cleanCanonical}/sitemap.xml`
      : "";
    return res.send(`User-agent: *\nAllow: /${sitemapLine}\n`);
  } catch (err) {
    res.setHeader("Content-Type", "text/plain");
    return res.send("User-agent: *\nAllow: /\n");
  }
});

/**
 * GET /api/site-settings/sitemap.xml
 * Dynamic XML sitemap based on Google devSettings
 */
router.get("/sitemap.xml", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const google = normalizeGoogleSettings(dbData.google);
    res.setHeader("Content-Type", "application/xml");
    if (!google.devSettings.publishSitemap) {
      return res.status(404).send("<error>Sitemap is disabled</error>");
    }
    const baseUrl = (google.devSettings.canonicalAddress || "").replace(/\/$/, "");
    const pages = [
      "",
      "/rent",
      "/preloved",
      "/buy-new",
      "/categories",
      "/occasions",
      "/designers",
      "/contact",
      "/terms",
      "/privacy",
      "/refunds",
      "/deposit-policy",
      "/care-policy",
      "/shipping-policy",
      "/cookies"
    ];
    const now = new Date().toISOString().split("T")[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map(
        (p) =>
          `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n  </url>`
      )
      .join("\n")}\n</urlset>`;
    return res.send(xml);
  } catch (err) {
    return res.status(500).send("<error>Error generating sitemap</error>");
  }
});


export const DEFAULT_LEGAL_SETTINGS = {
  registeredEntity: {
    registeredName: "House of Kaira Retail Pvt Ltd",
    gstin: "23AABCH1234K1ZV",
    cin: "U52609MP2025PTC071482",
    registeredAddress: "14 Vijay Nagar, Scheme 54, Indore, Madhya Pradesh 452010",
  },
  cookieConsent: {
    showBanner: false,
    heading: "We use cookies",
    position: "Bottom bar",
    body: "We use cookies to run the site, remember your bag, and understand what people browse. You can accept all, or take only what the site needs to work.",
    acceptLabel: "Accept all",
    rejectLabel: "Only essential",
    manageLabel: "Manage",
    policyLink: "/cookies",
    categories: {
      essential: "Keeps you signed in, remembers your bag, and lets checkout work. These cannot be turned off.",
      analytics: "Lets us see which pieces people browse and where they arrived from, so we know what to stock more of.",
      marketing: "Lets us show House of Kaira pieces on Instagram and Facebook to people who have visited before.",
    },
  },
};

export function normalizeLegalSettings(raw) {
  const l = raw || {};
  const def = DEFAULT_LEGAL_SETTINGS;
  const entity = l.registeredEntity || {};
  const cookie = l.cookieConsent || {};
  const cats = cookie.categories || {};

  return {
    registeredEntity: {
      registeredName:
        typeof entity.registeredName === "string" && entity.registeredName.trim()
          ? entity.registeredName.trim()
          : def.registeredEntity.registeredName,
      gstin:
        typeof entity.gstin === "string" && entity.gstin.trim()
          ? entity.gstin.trim()
          : def.registeredEntity.gstin,
      cin:
        typeof entity.cin === "string" && entity.cin.trim()
          ? entity.cin.trim()
          : def.registeredEntity.cin,
      registeredAddress:
        typeof entity.registeredAddress === "string" && entity.registeredAddress.trim()
          ? entity.registeredAddress.trim()
          : def.registeredEntity.registeredAddress,
    },
    cookieConsent: {
      showBanner:
        cookie.showBanner !== undefined
          ? !!cookie.showBanner
          : def.cookieConsent.showBanner,
      heading:
        typeof cookie.heading === "string" && cookie.heading.trim()
          ? cookie.heading.trim()
          : def.cookieConsent.heading,
      position:
        ["Bottom bar", "Bottom-left card", "Centre modal"].includes(cookie.position)
          ? cookie.position
          : def.cookieConsent.position,
      body:
        typeof cookie.body === "string" && cookie.body.trim()
          ? cookie.body.trim()
          : def.cookieConsent.body,
      acceptLabel:
        typeof cookie.acceptLabel === "string" && cookie.acceptLabel.trim()
          ? cookie.acceptLabel.trim()
          : def.cookieConsent.acceptLabel,
      rejectLabel:
        typeof cookie.rejectLabel === "string" && cookie.rejectLabel.trim()
          ? cookie.rejectLabel.trim()
          : def.cookieConsent.rejectLabel,
      manageLabel:
        typeof cookie.manageLabel === "string" && cookie.manageLabel.trim()
          ? cookie.manageLabel.trim()
          : def.cookieConsent.manageLabel,
      policyLink:
        typeof cookie.policyLink === "string" && cookie.policyLink.trim()
          ? cookie.policyLink.trim()
          : def.cookieConsent.policyLink,
      categories: {
        essential:
          typeof cats.essential === "string" && cats.essential.trim()
            ? cats.essential.trim()
            : def.cookieConsent.categories.essential,
        analytics:
          typeof cats.analytics === "string" && cats.analytics.trim()
            ? cats.analytics.trim()
            : def.cookieConsent.categories.analytics,
        marketing:
          typeof cats.marketing === "string" && cats.marketing.trim()
            ? cats.marketing.trim()
            : def.cookieConsent.categories.marketing,
      },
    },
  };
}

/**
 * GET /api/site-settings/legal/public
 * Public endpoint: returns public legal and cookie consent configuration
 */
router.get("/legal/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeLegalSettings(dbData.legal);

    return res.json({
      success: true,
      data: normalized,
      legal: normalized,
    });
  } catch (error) {
    console.error("Error retrieving public legal settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/legal
 * Admin endpoint: retrieve legal & consent settings
 */
router.get("/legal", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeLegalSettings(dbData.legal);

    return res.json({
      success: true,
      data: normalized,
      legal: normalized,
    });
  } catch (error) {
    console.error("Error retrieving legal configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/legal
 * Admin endpoint: update legal & consent configuration
 */
router.put("/legal", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputLegal = body.legal || body;
    const normalized = normalizeLegalSettings(inputLegal);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      legal: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Legal settings updated successfully",
      data: normalized,
      legal: normalized,
    });
  } catch (error) {
    console.error("Error updating legal settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const DEFAULT_REGIONAL_SETTINGS = {
  timezone: "Asia/Kolkata (IST)",
  currency: "INR ₹",
  dateFormat: "DD MMM YYYY",
  numberFormat: "Indian — lakh and crore",
};

export function getCurrencySymbolFromCurrency(curr) {
  if (!curr || typeof curr !== "string") return "₹";
  if (curr.includes("INR") || curr.includes("₹")) return "₹";
  if (curr.includes("USD") || curr.includes("$")) return "$";
  if (curr.includes("AED") || curr.includes("د.إ")) return "AED ";
  if (curr.includes("GBP") || curr.includes("£")) return "£";
  if (curr.includes("EUR") || curr.includes("€")) return "€";
  return "₹";
}

export function normalizeRegionalSettings(raw) {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_REGIONAL_SETTINGS };
  }

  const validTimezones = [
    "Asia/Kolkata (IST)",
    "Asia/Dubai (GST)",
    "Europe/London (GMT)",
    "Asia/Singapore (SGT)",
    "America/New_York (EST)",
  ];
  const validCurrencies = ["INR ₹", "USD $", "AED د.إ", "GBP £", "EUR €"];
  const validDateFormats = [
    "DD MMM YYYY",
    "DD/MM/YYYY",
    "MMM DD, YYYY",
    "MM/DD/YYYY",
    "YYYY-MM-DD",
  ];
  const validNumberFormats = [
    "Indian — lakh and crore",
    "International — thousand and million",
    "International — million and billion",
  ];

  return {
    timezone: validTimezones.includes(raw.timezone)
      ? raw.timezone
      : typeof raw.timezone === "string" && raw.timezone.trim()
      ? raw.timezone.trim()
      : DEFAULT_REGIONAL_SETTINGS.timezone,
    currency: validCurrencies.includes(raw.currency)
      ? raw.currency
      : typeof raw.currency === "string" && raw.currency.trim()
      ? raw.currency.trim()
      : DEFAULT_REGIONAL_SETTINGS.currency,
    dateFormat: validDateFormats.includes(raw.dateFormat)
      ? raw.dateFormat
      : typeof raw.dateFormat === "string" && raw.dateFormat.trim()
      ? raw.dateFormat.trim()
      : DEFAULT_REGIONAL_SETTINGS.dateFormat,
    numberFormat: validNumberFormats.includes(raw.numberFormat)
      ? raw.numberFormat
      : typeof raw.numberFormat === "string" && raw.numberFormat.trim()
      ? raw.numberFormat.trim()
      : DEFAULT_REGIONAL_SETTINGS.numberFormat,
  };
}

/**
 * GET /api/site-settings/regional/public
 * Public endpoint: returns public regional formatting & timezone configuration
 */
router.get("/regional/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeRegionalSettings(dbData.regional);
    const currencySymbol = getCurrencySymbolFromCurrency(normalized.currency);

    const result = {
      ...normalized,
      currencySymbol,
    };

    return res.json({
      success: true,
      data: result,
      regional: result,
    });
  } catch (error) {
    console.error("Error retrieving public regional settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/regional
 * Admin endpoint: retrieve regional settings
 */
router.get("/regional", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeRegionalSettings(dbData.regional);

    return res.json({
      success: true,
      data: normalized,
      regional: normalized,
    });
  } catch (error) {
    console.error("Error retrieving regional configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/regional
 * Admin endpoint: update regional configuration
 */
router.put("/regional", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputRegional = body.regional || body;
    const normalized = normalizeRegionalSettings(inputRegional);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      regional: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Regional settings updated successfully",
      data: normalized,
      regional: normalized,
    });
  } catch (error) {
    console.error("Error updating regional settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const DEFAULT_MAINTENANCE_SETTINGS = {
  maintenance: {
    enabled: false,
    heading: "We’ll be right back",
    expectedBack: "",
    body: "House of Kaira is briefly down for scheduled work. Rentals already booked are unaffected.",
    allowList: "Soumya, Priya (Ops)",
  },
  notFoundPage: {
    heading: "This piece has moved on",
    body: "The page you were looking for is no longer here — which happens on a platform where pieces find new homes.",
    suggestedLinks: "Rent, Buy Preloved, New Arrivals",
  },
};

export function normalizeMaintenanceSettings(raw) {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_MAINTENANCE_SETTINGS };
  }

  const rawMaint = raw.maintenance || (raw.enabled !== undefined ? raw : {});
  const raw404 = raw.notFoundPage || {};

  return {
    maintenance: {
      enabled: rawMaint.enabled !== undefined ? !!rawMaint.enabled : DEFAULT_MAINTENANCE_SETTINGS.maintenance.enabled,
      heading: typeof rawMaint.heading === "string" ? rawMaint.heading : DEFAULT_MAINTENANCE_SETTINGS.maintenance.heading,
      expectedBack: typeof rawMaint.expectedBack === "string" ? rawMaint.expectedBack : DEFAULT_MAINTENANCE_SETTINGS.maintenance.expectedBack,
      body: typeof rawMaint.body === "string" ? rawMaint.body : DEFAULT_MAINTENANCE_SETTINGS.maintenance.body,
      allowList: typeof rawMaint.allowList === "string" ? rawMaint.allowList : DEFAULT_MAINTENANCE_SETTINGS.maintenance.allowList,
    },
    notFoundPage: {
      heading: typeof raw404.heading === "string" ? raw404.heading : DEFAULT_MAINTENANCE_SETTINGS.notFoundPage.heading,
      body: typeof raw404.body === "string" ? raw404.body : DEFAULT_MAINTENANCE_SETTINGS.notFoundPage.body,
      suggestedLinks: typeof raw404.suggestedLinks === "string" ? raw404.suggestedLinks : DEFAULT_MAINTENANCE_SETTINGS.notFoundPage.suggestedLinks,
    },
  };
}

/**
 * GET /api/site-settings/maintenance/public
 * Public storefront endpoint: returns maintenance status, active copy, and 404 configuration
 */
router.get("/maintenance/public", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeMaintenanceSettings(dbData.maintenance);

    return res.json({
      success: true,
      data: normalized,
      maintenance: normalized.maintenance,
      notFoundPage: normalized.notFoundPage,
    });
  } catch (error) {
    console.error("Error retrieving public maintenance settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings/maintenance
 * Admin endpoint: retrieve maintenance and 404 configuration
 */
router.get("/maintenance", async (req, res) => {
  try {
    const dbData = (await getSettingsFromDb()) || inMemorySettings;
    const normalized = normalizeMaintenanceSettings(dbData.maintenance);

    return res.json({
      success: true,
      data: normalized,
      maintenance: normalized.maintenance,
      notFoundPage: normalized.notFoundPage,
    });
  } catch (error) {
    console.error("Error retrieving maintenance configuration:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/site-settings/maintenance
 * Admin endpoint: update maintenance mode and 404 settings
 */
router.put("/maintenance", protectAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const inputData = body.maintenance && body.notFoundPage ? body : body.maintenance || body;
    const normalized = normalizeMaintenanceSettings(inputData);

    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;
    const updatedData = {
      ...currentDbData,
      maintenance: normalized,
    };

    inMemorySettings = updatedData;
    await saveSettingsToDb(updatedData);

    return res.json({
      success: true,
      message: "Maintenance settings updated successfully",
      data: normalized,
      maintenance: normalized.maintenance,
      notFoundPage: normalized.notFoundPage,
    });
  } catch (error) {
    console.error("Error updating maintenance settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/site-settings
 * Master settings endpoint (used by Admin)
 */
router.get("/", async (req, res) => {
  try {
    const dbData = await getSettingsFromDb();
    const merged = { ...inMemorySettings, ...(dbData || {}) };

    // Ensure announcement is always well-formed
    merged.announcement = normalizeAnnouncementSettings(
      merged.announcement || merged.announcementBar
    );
    merged.header = normalizeHeaderSettings(merged.header);
    merged.footer = normalizeFooterSettings(merged.footer);
    merged.mobile = normalizeMobileSettings(merged.mobile || merged.mobileBar, {
      header: merged.header,
      forPublic: false,
    });
    merged.contact = normalizeContactSettings(merged.contact);
    merged.google = normalizeGoogleSettings(merged.google);
    merged.legal = normalizeLegalSettings(merged.legal);
    merged.regional = normalizeRegionalSettings(merged.regional);
    merged.maintenance = normalizeMaintenanceSettings(merged.maintenance);

    return res.json({
      success: true,
      data: merged,
    });
  } catch (error) {
    console.error("Error in GET /api/site-settings:", error);
    return res.json({ success: true, data: inMemorySettings });
  }
});

/**
 * PUT /api/site-settings
 * Master settings update (used by Admin Publish / Save Changes)
 */
router.put("/", protectAdmin, async (req, res) => {
  try {
    const updatedData = req.body || {};
    const currentDbData = (await getSettingsFromDb()) || inMemorySettings;

    const merged = {
      ...currentDbData,
      ...updatedData,
    };

    if (updatedData.footer) {
      merged.footer = normalizeFooterSettings(updatedData.footer);
    }

    if (updatedData.brand) {
      merged.brand = normalizeBrandSettings(updatedData.brand);
    }

    if (updatedData.contact) {
      merged.contact = normalizeContactSettings(updatedData.contact);
    }

    if (updatedData.google) {
      merged.google = normalizeGoogleSettings(updatedData.google);
    }

    if (updatedData.legal) {
      merged.legal = normalizeLegalSettings(updatedData.legal);
    }

    if (updatedData.regional) {
      merged.regional = normalizeRegionalSettings(updatedData.regional);
    }

    if (updatedData.maintenance) {
      merged.maintenance = normalizeMaintenanceSettings(updatedData.maintenance);
    }

    if (updatedData.mobile || updatedData.mobileBar) {
      merged.mobile = normalizeMobileSettings(updatedData.mobile || updatedData.mobileBar, {
        header: merged.header,
        forPublic: false,
      });
    }

    if (updatedData.header) {
      merged.header = normalizeHeaderSettings(updatedData.header);
    }

    if (updatedData.announcement || updatedData.announcementBar) {
      const ann = normalizeAnnouncementSettings(
        updatedData.announcement || updatedData.announcementBar
      );
      merged.announcement = ann;
      merged.announcementBar = {
        text: ann.messages?.[0]?.text || "",
        enabled: ann.showAcrossSite,
        howItMoves: ann.howItMoves,
        loopTime: ann.loopTimeSeconds,
        pauseOnHover: ann.pauseOnHover,
        backgroundColor: ann.backgroundColor,
        textColor: ann.textColor,
        italicColor: ann.italicLineColor,
        separator: ann.separator,
        messages: ann.messages,
      };
    }

    inMemorySettings = merged;
    await saveSettingsToDb(merged);

    return res.json({
      success: true,
      message: "Site settings updated successfully",
      data: merged,
    });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: inMemorySettings,
    });
  }
});

export default router;
