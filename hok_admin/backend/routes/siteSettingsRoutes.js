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
