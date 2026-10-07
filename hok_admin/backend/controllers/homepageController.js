import { pool } from "../config/db.js";
import { generateObjectId } from "../db/postgresAdapter.js";

export const DEFAULT_HERO_SETTINGS = {
  eyebrow: "India's Premier Circular Fashion Platform",
  heading: "Wear it with *love.*\nPass it on.",
  headingMob: "Wear it with *love.* Pass it on.",
  sub: "Rent, buy preloved, or discover new designer pieces — all in one curated destination for India's most discerning occasions.",
  subMob: "",
  subMobV3: "Rent, buy preloved, or discover new designer pieces — curated for India's most discerning occasions.",
  ctaA: {
    lbl: "Explore Collection",
    url: "/main-page",
  },
  ctaB: {
    lbl: "How It Works",
    url: "/how-it-works",
  },
  statsOn: false,
  stats: [
    { id: "stat-1", val: "2,400+", lbl: "Curated Pieces", lblMob: "Pieces", src: "Typed" },
    { id: "stat-2", val: "70+", lbl: "Active Designers", lblMob: "Designers", src: "Typed" },
    { id: "stat-3", val: "₹50+", lbl: "Cr Fashion Circulated", lblMob: "Circulated", src: "Typed" }
  ],
  layout: "Split",
  side: "Right",
  dim: 38,
  layoutMob: "Full bleed",
  dimMob: 52,
  img: {
    alt: "Bridal lehenga on House of Kaira",
    img: "",
    focal: "Centre"
  },
  imgMob: {
    alt: "Bridal lehenga on House of Kaira",
    img: "",
    focal: "Centre"
  },
  badge: {
    on: false,
    mob: false,
    mode: "Piece",
    sku: "HOK-SAB-002",
    title: "",
    sub: ""
  }
};

export const DEFAULT_HIW_SETTINGS = {
  eyebrow: "Simple by Design",
  heading: "How House of Kaira *works*",
  tabA: "I want to shop",
  tabB: "I want to sell",
  open: "Shop",
  shop: [
    {
      id: "step-1",
      ico: "search",
      t: "Browse & Discover",
      d: "Explore thousands of designer pieces across rent, preloved, and new categories — filtered by occasion, budget, and aesthetic."
    },
    {
      id: "step-2",
      ico: "pin",
      t: "Pick Your Path",
      d: "Choose to rent for the occasion, buy preloved forever, or purchase brand new with authenticity guaranteed."
    },
    {
      id: "step-3",
      ico: "box",
      t: "Doorstep Delivery",
      d: "Your look arrives dry-cleaned, pressed, and tailored — delivered right to your door with insured transit."
    },
    {
      id: "step-4",
      ico: "heart",
      t: "Wear, Love, Repeat",
      d: "Enjoy your look. For rentals, we collect it hassle-free. For purchases, love it forever or re-circulate it."
    }
  ],
  sell: [
    {
      id: "sell-1",
      ico: "camera",
      t: "Photograph & List",
      d: "Upload a few photos of your piece, set your price, and go live in under 10 minutes."
    },
    {
      id: "sell-2",
      ico: "users",
      t: "We Review & Feature",
      d: "Our team reviews your listing and recommends pricing to maximize your earnings."
    },
    {
      id: "sell-3",
      ico: "card",
      t: "Ship & Get Paid",
      d: "Once sold or rented, ship with our prepaid kit and receive T+3 working days direct to bank."
    }
  ],
  sellCard: {
    on: true,
    head: "The hours of *craftsmanship* on that piece deserve more than a dark wardrobe shelf.",
    body: "Give your occasion wear another life. Let someone else fall in love with it — and earn while you do.",
    quote: "Every piece has a story. Don't let it end with you.",
    cta: { lbl: "List Your Piece →", url: "/list-your-piece" }
  }
};

let inMemoryHero = {
  sectionId: "hero",
  isVisible: true,
  orderIndex: 1,
  data: { ...DEFAULT_HERO_SETTINGS },
};

let inMemoryHiw = {
  sectionId: "hiw",
  isVisible: true,
  orderIndex: 2,
  data: { ...DEFAULT_HIW_SETTINGS },
};

export const DEFAULT_FEATURED_SETTINGS = {
  eyebrow: "Handpicked for You",
  heading: "Featured *Pieces*",
  viewAll: { lbl: "View All →", url: "/rent/all" },
  slots: ["HOK-SAB-002", "HOK-MM-001", "HOK-TT-001", "HOK-AD-001"],
  shots: { "HOK-SAB-002": "On model" },
  cap: 8,
  perRow: 4,
  perRowMob: 2,
  topUp: "Off",
  topUpBy: "Newest live",
  showModeBadge: true,
  showWishlist: true,
  showWasPrice: true,
  showDuration: true,
};

let inMemoryFeatured = {
  sectionId: "featured",
  isVisible: true,
  orderIndex: 3,
  data: { ...DEFAULT_FEATURED_SETTINGS },
};

export const DEFAULT_CATEGORY_SETTINGS = {
  eyebrow: "Curated for Every Occasion",
  heading: "Shop by *Category*",
  viewAll: { lbl: "View All →", url: "/main-page?section=new&category" },
  layout: "Mosaic",
  layoutMob: "Carousel",
  header: true,
  headerMob: false,
  ctaLbl: "Shop Now",
  showCount: false,
  showCountMob: true,
  countLblMob: "{n} pieces available",
  tiles: {
    "bridal-lehenga": { alt: "Bridal lehengas", lbl: "Bridal Lehengas", kickMob: "Curated for every occasion", img: "" },
    "sherwani": { alt: "Sherwanis", lbl: "Sherwanis", kickMob: "For the groom", img: "" },
    "saree": { alt: "Sarees", lbl: "Sarees", kickMob: "Timeless drapes", img: "" },
    "anarkali": { alt: "Anarkalis", lbl: "Anarkalis", kickMob: "Ethereal silhouettes", img: "" },
    "indo-western": { alt: "Indo-Western", lbl: "Indo-Western", kickMob: "Modern fusion", img: "" }
  }
};

let inMemoryCategory = {
  sectionId: "category",
  isVisible: true,
  orderIndex: 4,
  data: { ...DEFAULT_CATEGORY_SETTINGS },
};

export const getHeroSectionFromDb = async () => {
  try {
    const res = await pool.query(
      `SELECT section_id, is_visible, order_index, data, updated_at FROM homepage_sections WHERE section_id = 'hero' LIMIT 1`
    );
    if (res && res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      return {
        sectionId: row.section_id,
        isVisible: row.is_visible !== false,
        orderIndex: row.order_index || 1,
        data: { ...DEFAULT_HERO_SETTINGS, ...data },
      };
    }
  } catch (err) {
    console.warn("DB query note for hero section, using fallback:", err.message);
  }
  return inMemoryHero;
};

export const getHiwSectionFromDb = async () => {
  try {
    const res = await pool.query(
      `SELECT section_id, is_visible, order_index, data, updated_at FROM homepage_sections WHERE section_id = 'hiw' LIMIT 1`
    );
    if (res && res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      return {
        sectionId: row.section_id,
        isVisible: row.is_visible !== false,
        orderIndex: row.order_index || 2,
        data: { ...DEFAULT_HIW_SETTINGS, ...data },
      };
    }
  } catch (err) {
    console.warn("DB query note for hiw section, using fallback:", err.message);
  }
  return inMemoryHiw;
};

export const getFeaturedSectionFromDb = async () => {
  try {
    const res = await pool.query(
      `SELECT section_id, is_visible, order_index, data, updated_at FROM homepage_sections WHERE section_id = 'featured' LIMIT 1`
    );
    if (res && res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      return {
        sectionId: row.section_id,
        isVisible: row.is_visible !== false,
        orderIndex: row.order_index || 3,
        data: { ...DEFAULT_FEATURED_SETTINGS, ...data },
      };
    }
  } catch (err) {
    console.warn("DB query note for featured section, using fallback:", err.message);
  }
  return inMemoryFeatured;
};

export const getCategorySectionFromDb = async () => {
  try {
    const res = await pool.query(
      `SELECT section_id, is_visible, order_index, data, updated_at FROM homepage_sections WHERE section_id = 'category' LIMIT 1`
    );
    if (res && res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      return {
        sectionId: row.section_id,
        isVisible: row.is_visible !== false,
        orderIndex: row.order_index || 4,
        data: { ...DEFAULT_CATEGORY_SETTINGS, ...data },
      };
    }
  } catch (err) {
    console.warn("DB query note for category section, using fallback:", err.message);
  }
  return inMemoryCategory;
};

export const DEFAULT_OCCASIONS_SETTINGS = {
  eyebrow: "Dressed for the Day",
  heading: "Shop by *Occasion*",
  viewAll: { lbl: "All Occasions →", url: "/main-page?section=occasions" },
  layout: "Even grid",
  ctaLbl: "Shop the Edit",
  showCount: true,
  tiles: {
    "wedding": { alt: "Wedding", lbl: "Wedding", kickMob: "For the big day", img: "" },
    "sangeet": { alt: "Sangeet", lbl: "Sangeet", kickMob: "Dance the night away", img: "" },
    "reception": { alt: "Reception", lbl: "Reception", kickMob: "Formal celebration", img: "" },
    "mehendi": { alt: "Mehendi", lbl: "Mehendi", kickMob: "Vibrant festivities", img: "" },
    "cocktail": { alt: "Cocktail", lbl: "Cocktail", kickMob: "Evening glamour", img: "" },
    "engagement": { alt: "Engagement", lbl: "Engagement", kickMob: "The beginning", img: "" },
  }
};

let inMemoryOccasions = {
  sectionId: "occasions",
  isVisible: false,
  orderIndex: 5,
  data: { ...DEFAULT_OCCASIONS_SETTINGS },
};

export const getOccasionsSectionFromDb = async () => {
  try {
    const res = await pool.query(
      `SELECT section_id, is_visible, order_index, data, updated_at FROM homepage_sections WHERE section_id = 'occasions' LIMIT 1`
    );
    if (res && res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      return {
        sectionId: row.section_id,
        isVisible: row.is_visible === true,
        orderIndex: row.order_index || 5,
        data: { ...DEFAULT_OCCASIONS_SETTINGS, ...data },
      };
    }
  } catch (err) {
    console.warn("DB query note for occasions section, using fallback:", err.message);
  }
  return inMemoryOccasions;
};

// GET /api/homepage/hero - Public storefront endpoint
export const getHeroSection = async (req, res) => {
  try {
    const heroRecord = await getHeroSectionFromDb();
    const data = heroRecord.data || DEFAULT_HERO_SETTINGS;

    res.json({
      success: true,
      data: {
        sectionId: "hero",
        isVisible: heroRecord.isVisible,
        order: heroRecord.orderIndex,
        eyebrow: data.eyebrow || DEFAULT_HERO_SETTINGS.eyebrow,
        headline: data.heading || DEFAULT_HERO_SETTINGS.heading,
        headlineMob: data.headingMob || data.heading || DEFAULT_HERO_SETTINGS.headingMob,
        description: data.sub || DEFAULT_HERO_SETTINGS.sub,
        descriptionMob: data.subMob || data.sub || DEFAULT_HERO_SETTINGS.sub,
        primaryCta: {
          text: data.ctaA?.lbl || DEFAULT_HERO_SETTINGS.ctaA.lbl,
          link: data.ctaA?.url || DEFAULT_HERO_SETTINGS.ctaA.url,
        },
        secondaryCta: {
          text: data.ctaB?.lbl || DEFAULT_HERO_SETTINGS.ctaB.lbl,
          link: data.ctaB?.url || DEFAULT_HERO_SETTINGS.ctaB.url,
        },
        desktopImage: {
          url: data.img?.img || "",
          alt: data.img?.alt || "",
          focal: data.img?.focal || "Centre",
        },
        mobileImage: {
          url: data.imgMob?.img || "",
          alt: data.imgMob?.alt || "",
          focal: data.imgMob?.focal || "Centre",
        },
        layout: data.layout || "Split",
        side: data.side || "Right",
        statsOn: !!data.statsOn,
        stats: data.stats || [],
        badge: data.badge || DEFAULT_HERO_SETTINGS.badge,
        settings: data, // Raw HeroSettings for CMS synchronization
      },
    });
  } catch (error) {
    console.error("Error fetching hero section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/homepage/how-it-works - Public storefront endpoint
export const getHiwSection = async (req, res) => {
  try {
    const hiwRecord = await getHiwSectionFromDb();
    const data = hiwRecord.data || DEFAULT_HIW_SETTINGS;

    res.json({
      success: true,
      data: {
        sectionId: "hiw",
        isVisible: hiwRecord.isVisible,
        order: hiwRecord.orderIndex,
        eyebrow: data.eyebrow || DEFAULT_HIW_SETTINGS.eyebrow,
        heading: data.heading || DEFAULT_HIW_SETTINGS.heading,
        tabA: data.tabA || DEFAULT_HIW_SETTINGS.tabA,
        tabB: data.tabB || DEFAULT_HIW_SETTINGS.tabB,
        open: data.open || DEFAULT_HIW_SETTINGS.open,
        shop: data.shop || DEFAULT_HIW_SETTINGS.shop,
        sell: data.sell || DEFAULT_HIW_SETTINGS.sell,
        sellCard: data.sellCard || DEFAULT_HIW_SETTINGS.sellCard,
        settings: data, // Raw HowItWorksSettings for CMS synchronization
      },
    });
  } catch (error) {
    console.error("Error fetching how-it-works section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/homepage/featured-pieces - Public storefront endpoint
export const getFeaturedSection = async (req, res) => {
  try {
    const featuredRecord = await getFeaturedSectionFromDb();
    const data = featuredRecord.data || DEFAULT_FEATURED_SETTINGS;

    res.json({
      success: true,
      data: {
        sectionId: "featured",
        isVisible: featuredRecord.isVisible,
        order: featuredRecord.orderIndex,
        eyebrow: data.eyebrow || DEFAULT_FEATURED_SETTINGS.eyebrow,
        heading: data.heading || DEFAULT_FEATURED_SETTINGS.heading,
        viewAll: {
          text: data.viewAll?.lbl || data.viewAll?.text || DEFAULT_FEATURED_SETTINGS.viewAll.lbl,
          link: data.viewAll?.url || data.viewAll?.link || DEFAULT_FEATURED_SETTINGS.viewAll.url,
          lbl: data.viewAll?.lbl || DEFAULT_FEATURED_SETTINGS.viewAll.lbl,
          url: data.viewAll?.url || DEFAULT_FEATURED_SETTINGS.viewAll.url,
        },
        slots: data.slots || DEFAULT_FEATURED_SETTINGS.slots,
        shots: data.shots || DEFAULT_FEATURED_SETTINGS.shots,
        cap: data.cap || DEFAULT_FEATURED_SETTINGS.cap,
        perRow: data.perRow || DEFAULT_FEATURED_SETTINGS.perRow,
        perRowMob: data.perRowMob || DEFAULT_FEATURED_SETTINGS.perRowMob,
        topUp: data.topUp || DEFAULT_FEATURED_SETTINGS.topUp,
        topUpBy: data.topUpBy || DEFAULT_FEATURED_SETTINGS.topUpBy,
        showModeBadge: data.showModeBadge !== false,
        showWishlist: data.showWishlist !== false,
        showWasPrice: data.showWasPrice !== false,
        showDuration: data.showDuration !== false,
        settings: data, // Raw FeaturedPiecesSettings for CMS synchronization
      },
    });
  } catch (error) {
    console.error("Error fetching featured section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/homepage/category - Public storefront endpoint
export const getCategorySection = async (req, res) => {
  try {
    const categoryRecord = await getCategorySectionFromDb();
    const data = categoryRecord.data || DEFAULT_CATEGORY_SETTINGS;

    res.json({
      success: true,
      data: {
        sectionId: "category",
        isVisible: categoryRecord.isVisible,
        order: categoryRecord.orderIndex,
        eyebrow: data.eyebrow || DEFAULT_CATEGORY_SETTINGS.eyebrow,
        heading: data.heading || DEFAULT_CATEGORY_SETTINGS.heading,
        viewAll: {
          text: data.viewAll?.lbl || data.viewAll?.text || DEFAULT_CATEGORY_SETTINGS.viewAll.lbl,
          link: data.viewAll?.url || data.viewAll?.link || DEFAULT_CATEGORY_SETTINGS.viewAll.url,
          lbl: data.viewAll?.lbl || DEFAULT_CATEGORY_SETTINGS.viewAll.lbl,
          url: data.viewAll?.url || DEFAULT_CATEGORY_SETTINGS.viewAll.url,
        },
        layout: data.layout || DEFAULT_CATEGORY_SETTINGS.layout,
        layoutMob: data.layoutMob || DEFAULT_CATEGORY_SETTINGS.layoutMob,
        header: data.header !== false,
        headerMob: data.headerMob === true,
        ctaLbl: data.ctaLbl || DEFAULT_CATEGORY_SETTINGS.ctaLbl,
        showCount: data.showCount === true,
        showCountMob: data.showCountMob !== false,
        countLblMob: data.countLblMob || DEFAULT_CATEGORY_SETTINGS.countLblMob,
        tiles: data.tiles || DEFAULT_CATEGORY_SETTINGS.tiles,
        settings: data, // Raw CategorySettings for CMS synchronization
      },
    });
  } catch (error) {
    console.error("Error fetching category section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/homepage/occasions - Public storefront endpoint
export const getOccasionsSection = async (req, res) => {
  try {
    const occasionsRecord = await getOccasionsSectionFromDb();
    const data = occasionsRecord.data || DEFAULT_OCCASIONS_SETTINGS;

    res.json({
      success: true,
      data: {
        sectionId: "occasions",
        isVisible: occasionsRecord.isVisible,
        order: occasionsRecord.orderIndex,
        eyebrow: data.eyebrow || DEFAULT_OCCASIONS_SETTINGS.eyebrow,
        heading: data.heading || DEFAULT_OCCASIONS_SETTINGS.heading,
        viewAll: {
          text: data.viewAll?.lbl || data.viewAll?.text || DEFAULT_OCCASIONS_SETTINGS.viewAll.lbl,
          link: data.viewAll?.url || data.viewAll?.link || DEFAULT_OCCASIONS_SETTINGS.viewAll.url,
          lbl: data.viewAll?.lbl || DEFAULT_OCCASIONS_SETTINGS.viewAll.lbl,
          url: data.viewAll?.url || DEFAULT_OCCASIONS_SETTINGS.viewAll.url,
        },
        layout: data.layout || DEFAULT_OCCASIONS_SETTINGS.layout,
        ctaLbl: data.ctaLbl || DEFAULT_OCCASIONS_SETTINGS.ctaLbl,
        showCount: data.showCount !== false,
        tiles: data.tiles || DEFAULT_OCCASIONS_SETTINGS.tiles,
        settings: data, // Raw OccasionsSettings for CMS synchronization
      },
    });
  } catch (error) {
    console.error("Error fetching occasions section:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/homepage - Admin endpoint to retrieve all homepage data
export const getHomepageData = async (req, res) => {
  try {
    const [heroRecord, hiwRecord, featuredRecord, categoryRecord, occasionsRecord] = await Promise.all([
      getHeroSectionFromDb(),
      getHiwSectionFromDb(),
      getFeaturedSectionFromDb(),
      getCategorySectionFromDb(),
      getOccasionsSectionFromDb(),
    ]);
    res.json({
      success: true,
      data: {
        hero: heroRecord.data,
        hiw: hiwRecord.data,
        featured: featuredRecord.data,
        category: categoryRecord.data,
        occasions: occasionsRecord.data,
        vis: {
          hero: heroRecord.isVisible,
          hiw: hiwRecord.isVisible,
          featured: featuredRecord.isVisible,
          category: categoryRecord.isVisible,
          occasions: occasionsRecord.isVisible,
        },
        heroOrder: heroRecord.orderIndex,
        hiwOrder: hiwRecord.orderIndex,
        featuredOrder: featuredRecord.orderIndex,
        categoryOrder: categoryRecord.orderIndex,
        occasionsOrder: occasionsRecord.orderIndex,
      },
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/homepage/hero - Protected Admin endpoint to update Hero section
export const updateHeroSection = async (req, res) => {
  try {
    const body = req.body || {};
    
    // Support either direct hero settings or wrapped object
    const heroSettings = body.hero || (body.heading || body.eyebrow ? body : body.settings) || {};
    const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : typeof body.isShown === "boolean" ? body.isShown : inMemoryHero.isVisible;
    const orderIndex = typeof body.order === "number" ? body.order : typeof body.orderIndex === "number" ? body.orderIndex : inMemoryHero.orderIndex;

    // Merge with current data
    const currentRecord = await getHeroSectionFromDb();
    const updatedData = {
      ...currentRecord.data,
      ...heroSettings,
    };

    inMemoryHero = {
      sectionId: "hero",
      isVisible,
      orderIndex,
      data: updatedData,
    };

    // Upsert into PostgreSQL
    try {
      const id = generateObjectId();
      await pool.query(
        `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
         VALUES ($1, 'hero', $2, $3, $4, NOW())
         ON CONFLICT (section_id)
         DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
        [id, isVisible, orderIndex, JSON.stringify(updatedData)]
      );
    } catch (dbErr) {
      console.warn("DB save note for hero section, saved to memory:", dbErr.message);
    }

    res.json({
      success: true,
      message: "Hero section updated successfully",
      data: {
        sectionId: "hero",
        isVisible,
        order: orderIndex,
        settings: updatedData,
      },
    });
  } catch (error) {
    console.error("Error updating hero section:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/homepage/how-it-works - Protected Admin endpoint to update How It Works section
export const updateHiwSection = async (req, res) => {
  try {
    const body = req.body || {};
    const hiwSettings = body.hiw || (body.heading || body.eyebrow || body.shop ? body : body.settings) || {};
    const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : typeof body.isShown === "boolean" ? body.isShown : inMemoryHiw.isVisible;
    const orderIndex = typeof body.order === "number" ? body.order : typeof body.orderIndex === "number" ? body.orderIndex : inMemoryHiw.orderIndex;

    const currentRecord = await getHiwSectionFromDb();
    const updatedData = {
      ...currentRecord.data,
      ...hiwSettings,
    };

    inMemoryHiw = {
      sectionId: "hiw",
      isVisible,
      orderIndex,
      data: updatedData,
    };

    try {
      const id = generateObjectId();
      await pool.query(
        `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
         VALUES ($1, 'hiw', $2, $3, $4, NOW())
         ON CONFLICT (section_id)
         DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
        [id, isVisible, orderIndex, JSON.stringify(updatedData)]
      );
    } catch (dbErr) {
      console.warn("DB save note for hiw section, saved to memory:", dbErr.message);
    }

    res.json({
      success: true,
      message: "How It Works section updated successfully",
      data: {
        sectionId: "hiw",
        isVisible,
        order: orderIndex,
        settings: updatedData,
      },
    });
  } catch (error) {
    console.error("Error updating how-it-works section:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/homepage/featured-pieces - Protected Admin endpoint to update Featured Pieces section
export const updateFeaturedSection = async (req, res) => {
  try {
    const body = req.body || {};
    const featuredSettings = body.featured || (body.heading || body.eyebrow || body.slots ? body : body.settings) || {};
    const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : typeof body.isShown === "boolean" ? body.isShown : inMemoryFeatured.isVisible;
    const orderIndex = typeof body.order === "number" ? body.order : typeof body.orderIndex === "number" ? body.orderIndex : inMemoryFeatured.orderIndex;

    const currentRecord = await getFeaturedSectionFromDb();
    const updatedData = {
      ...currentRecord.data,
      ...featuredSettings,
    };

    inMemoryFeatured = {
      sectionId: "featured",
      isVisible,
      orderIndex,
      data: updatedData,
    };

    try {
      const id = generateObjectId();
      await pool.query(
        `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
         VALUES ($1, 'featured', $2, $3, $4, NOW())
         ON CONFLICT (section_id)
         DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
        [id, isVisible, orderIndex, JSON.stringify(updatedData)]
      );
    } catch (dbErr) {
      console.warn("DB save note for featured section, saved to memory:", dbErr.message);
    }

    res.json({
      success: true,
      message: "Featured Pieces section updated successfully",
      data: {
        sectionId: "featured",
        isVisible,
        order: orderIndex,
        settings: updatedData,
      },
    });
  } catch (error) {
    console.error("Error updating featured section:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/homepage/category - Protected Admin endpoint to update Category section
export const updateCategorySection = async (req, res) => {
  try {
    const body = req.body || {};
    const categorySettings = body.category || (body.heading || body.eyebrow || body.tiles ? body : body.settings) || {};
    const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : typeof body.isShown === "boolean" ? body.isShown : inMemoryCategory.isVisible;
    const orderIndex = typeof body.order === "number" ? body.order : typeof body.orderIndex === "number" ? body.orderIndex : inMemoryCategory.orderIndex;

    const currentRecord = await getCategorySectionFromDb();
    const updatedData = {
      ...currentRecord.data,
      ...categorySettings,
    };

    inMemoryCategory = {
      sectionId: "category",
      isVisible,
      orderIndex,
      data: updatedData,
    };

    try {
      const id = generateObjectId();
      await pool.query(
        `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
         VALUES ($1, 'category', $2, $3, $4, NOW())
         ON CONFLICT (section_id)
         DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
        [id, isVisible, orderIndex, JSON.stringify(updatedData)]
      );
    } catch (dbErr) {
      console.warn("DB save note for category section, saved to memory:", dbErr.message);
    }

    res.json({
      success: true,
      message: "Shop by Category section updated successfully",
      data: {
        sectionId: "category",
        isVisible,
        order: orderIndex,
        settings: updatedData,
      },
    });
  } catch (error) {
    console.error("Error updating category section:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/homepage/occasions - Protected Admin endpoint to update Occasions section
export const updateOccasionsSection = async (req, res) => {
  try {
    const body = req.body || {};
    const occasionsSettings = body.occasions || (body.heading || body.eyebrow || body.tiles ? body : body.settings) || {};
    const isVisible = typeof body.isVisible === "boolean" ? body.isVisible : typeof body.isShown === "boolean" ? body.isShown : inMemoryOccasions.isVisible;
    const orderIndex = typeof body.order === "number" ? body.order : typeof body.orderIndex === "number" ? body.orderIndex : inMemoryOccasions.orderIndex;

    const currentRecord = await getOccasionsSectionFromDb();
    const updatedData = {
      ...currentRecord.data,
      ...occasionsSettings,
    };

    inMemoryOccasions = {
      sectionId: "occasions",
      isVisible,
      orderIndex,
      data: updatedData,
    };

    try {
      const id = generateObjectId();
      await pool.query(
        `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
         VALUES ($1, 'occasions', $2, $3, $4, NOW())
         ON CONFLICT (section_id)
         DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
        [id, isVisible, orderIndex, JSON.stringify(updatedData)]
      );
    } catch (dbErr) {
      console.warn("DB save note for occasions section, saved to memory:", dbErr.message);
    }

    res.json({
      success: true,
      message: "Shop by Occasion section updated successfully",
      data: {
        sectionId: "occasions",
        isVisible,
        order: orderIndex,
        settings: updatedData,
      },
    });
  } catch (error) {
    console.error("Error updating occasions section:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/homepage - Admin endpoint to publish entire homepage / registry
export const updateHomepage = async (req, res) => {
  try {
    const registry = req.body || {};

    // 1. Process Hero Band
    const heroSettings = registry.hero || {};
    const isHeroVisible = registry.vis?.hero !== false;
    let heroOrderIndex = 1;
    if (Array.isArray(registry.bands)) {
      const idx = registry.bands.findIndex((b) => b.id === "hero");
      if (idx !== -1) heroOrderIndex = idx + 1;
    }

    const currentHeroRecord = await getHeroSectionFromDb();
    const updatedHeroData = {
      ...currentHeroRecord.data,
      ...heroSettings,
    };

    inMemoryHero = {
      sectionId: "hero",
      isVisible: isHeroVisible,
      orderIndex: heroOrderIndex,
      data: updatedHeroData,
    };

    try {
      const id = generateObjectId();
      await pool.query(
        `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
         VALUES ($1, 'hero', $2, $3, $4, NOW())
         ON CONFLICT (section_id)
         DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
        [id, isHeroVisible, heroOrderIndex, JSON.stringify(updatedHeroData)]
      );
    } catch (dbErr) {
      console.warn("DB save note for hero homepage publish, saved to memory:", dbErr.message);
    }

    // 2. Process How It Works Band
    if (registry.hiw) {
      const hiwSettings = registry.hiw;
      const isHiwVisible = registry.vis?.hiw !== false;
      let hiwOrderIndex = 2;
      if (Array.isArray(registry.bands)) {
        const idx = registry.bands.findIndex((b) => b.id === "hiw");
        if (idx !== -1) hiwOrderIndex = idx + 1;
      }

      const currentHiwRecord = await getHiwSectionFromDb();
      const updatedHiwData = {
        ...currentHiwRecord.data,
        ...hiwSettings,
      };

      inMemoryHiw = {
        sectionId: "hiw",
        isVisible: isHiwVisible,
        orderIndex: hiwOrderIndex,
        data: updatedHiwData,
      };

      try {
        const id = generateObjectId();
        await pool.query(
          `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
           VALUES ($1, 'hiw', $2, $3, $4, NOW())
           ON CONFLICT (section_id)
           DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
          [id, isHiwVisible, hiwOrderIndex, JSON.stringify(updatedHiwData)]
        );
      } catch (dbErr) {
        console.warn("DB save note for hiw homepage publish, saved to memory:", dbErr.message);
      }
    }

    // 3. Process Featured Pieces Band
    if (registry.featured) {
      const featuredSettings = registry.featured;
      const isFeaturedVisible = registry.vis?.featured !== false;
      let featuredOrderIndex = 3;
      if (Array.isArray(registry.bands)) {
        const idx = registry.bands.findIndex((b) => b.id === "featured");
        if (idx !== -1) featuredOrderIndex = idx + 1;
      }

      const currentFeaturedRecord = await getFeaturedSectionFromDb();
      const updatedFeaturedData = {
        ...currentFeaturedRecord.data,
        ...featuredSettings,
      };

      inMemoryFeatured = {
        sectionId: "featured",
        isVisible: isFeaturedVisible,
        orderIndex: featuredOrderIndex,
        data: updatedFeaturedData,
      };

      try {
        const id = generateObjectId();
        await pool.query(
          `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
           VALUES ($1, 'featured', $2, $3, $4, NOW())
           ON CONFLICT (section_id)
           DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
          [id, isFeaturedVisible, featuredOrderIndex, JSON.stringify(updatedFeaturedData)]
        );
      } catch (dbErr) {
        console.warn("DB save note for featured homepage publish, saved to memory:", dbErr.message);
      }
    }

    // 4. Process Category Band
    if (registry.category) {
      const categorySettings = registry.category;
      const isCategoryVisible = registry.vis?.category !== false;
      let categoryOrderIndex = 4;
      if (Array.isArray(registry.bands)) {
        const idx = registry.bands.findIndex((b) => b.id === "category");
        if (idx !== -1) categoryOrderIndex = idx + 1;
      }

      const currentCategoryRecord = await getCategorySectionFromDb();
      const updatedCategoryData = {
        ...currentCategoryRecord.data,
        ...categorySettings,
      };

      inMemoryCategory = {
        sectionId: "category",
        isVisible: isCategoryVisible,
        orderIndex: categoryOrderIndex,
        data: updatedCategoryData,
      };

      try {
        const id = generateObjectId();
        await pool.query(
          `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
           VALUES ($1, 'category', $2, $3, $4, NOW())
           ON CONFLICT (section_id)
           DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
          [id, isCategoryVisible, categoryOrderIndex, JSON.stringify(updatedCategoryData)]
        );
      } catch (dbErr) {
        console.warn("DB save note for category homepage publish, saved to memory:", dbErr.message);
      }
    }

    // 5. Process Occasions Band
    if (registry.occasions) {
      const occasionsSettings = registry.occasions;
      const isOccasionsVisible = registry.vis?.occasions === true;
      let occasionsOrderIndex = 5;
      if (Array.isArray(registry.bands)) {
        const idx = registry.bands.findIndex((b) => b.id === "occasions");
        if (idx !== -1) occasionsOrderIndex = idx + 1;
      }

      const currentOccasionsRecord = await getOccasionsSectionFromDb();
      const updatedOccasionsData = {
        ...currentOccasionsRecord.data,
        ...occasionsSettings,
      };

      inMemoryOccasions = {
        sectionId: "occasions",
        isVisible: isOccasionsVisible,
        orderIndex: occasionsOrderIndex,
        data: updatedOccasionsData,
      };

      try {
        const id = generateObjectId();
        await pool.query(
          `INSERT INTO homepage_sections (_id, section_id, is_visible, order_index, data, updated_at)
           VALUES ($1, 'occasions', $2, $3, $4, NOW())
           ON CONFLICT (section_id)
           DO UPDATE SET is_visible = $2, order_index = $3, data = $4, updated_at = NOW()`,
          [id, isOccasionsVisible, occasionsOrderIndex, JSON.stringify(updatedOccasionsData)]
        );
      } catch (dbErr) {
        console.warn("DB save note for occasions homepage publish, saved to memory:", dbErr.message);
      }
    }

    res.json({
      success: true,
      message: "Homepage published successfully",
      data: {
        hero: inMemoryHero.data,
        hiw: inMemoryHiw.data,
        featured: inMemoryFeatured.data,
        category: inMemoryCategory.data,
        occasions: inMemoryOccasions.data,
        vis: {
          hero: inMemoryHero.isVisible,
          hiw: inMemoryHiw.isVisible,
          featured: inMemoryFeatured.isVisible,
          category: inMemoryCategory.isVisible,
          occasions: inMemoryOccasions.isVisible,
        },
      },
    });
  } catch (error) {
    console.error("Error publishing homepage:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
