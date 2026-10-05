export const desktopFooterColumns = [
  {
    title: "SHOP",
    links: [
      { label: "Rent", path: "/main-page?section=rent" },
      { label: "Buy Preloved", path: "/main-page?section=preloved" },
      { label: "Buy New", path: "/main-page?section=new" },
      { label: "Shop by Occasion", path: "/main-page?section=occasions" },
      { label: "Shop by Category", path: "/main-page?section=new&category" },
      { label: "All Designers", path: "/main-page?section=designers" },
    ],
  },
  {
    title: "SELL WITH US",
    links: [
      { label: "List Your Piece", path: "/list-your-piece" },
      { label: "How It Works", path: "/how-it-works" },
      { label: "Seller Guidelines", path: "/seller-guidelines" },
      { label: "Pricing & Fees", path: "/pricing-fees" },
      { label: "Designer Partners", path: "/designer-partners" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "FAQs", path: "/faqs" },
      { label: "Care, Cleaning & Damage", path: "/care-cleaning-damage" },
      { label: "Deposit Policy", path: "/deposit-policy" },
      { label: "Refunds & Cancellations", path: "/refunds" },
      { label: "Contact Us", path: "/contact-us" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About HOK", path: "/about-us" },
      { label: "Sustainability", path: "/sustainability" },
      { label: "Careers", path: "/careers" },
      { label: "Press", path: "/press" },
      { label: "Blog", path: "/blog" },
    ],
  },
];

export const mobileFooterColumns = [
  {
    title: "Shop",
    links: [
      { label: "Rent", path: "/main-page?section=rent" },
      { label: "Buy Preloved", path: "/main-page?section=preloved" },
      { label: "Buy New", path: "/main-page?section=new" },
      { label: "By Occasion", path: "/main-page?section=occasions" },
      { label: "All Designers", path: "/main-page?section=designers" },
    ],
  },
  {
    title: "Sell with Us",
    links: [
      { label: "List Your Piece", path: "/list-your-piece" },
      { label: "How It Works", path: "/how-it-works" },
      { label: "Seller Guidelines", path: "/seller-guidelines" },
      { label: "Pricing & Fees", path: "/pricing-fees" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", path: "/faqs" },
      { label: "Care & Damage", path: "/care-cleaning-damage" },
      { label: "Deposit Policy", path: "/deposit-policy" },
      { label: "Refunds", path: "/refunds" },
      { label: "Contact Us", path: "/contact-us" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About HOK", path: "/about-us" },
      { label: "Sustainability", path: "/sustainability" },
      { label: "Careers", path: "/careers" },
      { label: "Press", path: "/press" },
    ],
  },
];

export const desktopPolicyLinks = [
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Refund & Cancellation Policy", path: "/refunds" },
  { label: "Deposit Policy", path: "/deposit" },
  { label: "Care, Cleaning & Damage Policy", path: "/care-damage" },
  { label: "Cookie Policy", path: "/cookies" },
  { label: "Cookie settings", isButton: true, action: "open-cookie-settings" },
];

export const mobilePolicyLinks = [
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Refund Policy", path: "/refunds" },
  { label: "Deposit Policy", path: "/deposit" },
  { label: "Care & Damage Policy", path: "/care-damage" },
  { label: "Cookie Policy", path: "/cookies" },
  { label: "Cookie settings", isButton: true, action: "open-cookie-settings" },
];

// Backwards compatibility defaults
export const footerColumns = desktopFooterColumns;
export const policyLinks = desktopPolicyLinks;