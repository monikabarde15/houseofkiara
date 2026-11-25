/**
 * House of Kaira · Team & Permissions Canonical Registry (Spec v231)
 * Exact sections, levels, decisions, default roles, and self-computing rules.
 */

export const FOUNDER_ROLE_ID = "founder";

export const SECTION_GROUPS = [
  "Overview",
  "Operations",
  "Catalogue",
  "Growth",
  "Site Settings",
  "Configuration",
];

/**
 * Spec 3.1: Sections
 * Exact ids, labels, sidebar groups, allowed levels, and menu descriptions.
 */
export const SECTIONS = [
  {
    id: "dashboard",
    label: "Dashboard",
    group: "Overview",
    levels: ["View", "Hidden"],
    maxLevel: "View",
    inRolesTable: true,
    description:
      "The day at a glance: figures, alerts and what is due. Only ever viewed.",
  },
  {
    id: "notifications",
    label: "Notifications",
    group: "Overview",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    followsRole: true,
    inRolesTable: false,
    description:
      "Alerts for the sections a role can open. It follows the rest of the role: able to act wherever the role can edit.",
  },
  {
    id: "orders",
    label: "Orders",
    group: "Operations",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description:
      "Every rental and sale, from booking to return, with the customer’s address.",
  },
  {
    id: "offers",
    label: "Offers",
    group: "Operations",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Offers on preloved pieces, from the site or logged by hand.",
  },
  {
    id: "enquiries",
    label: "Enquiries",
    group: "Operations",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Interest logged from WhatsApp, Instagram, calls and visits.",
  },
  {
    id: "calendar",
    label: "Rental Calendar",
    group: "Operations",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description:
      "When each piece is booked, resting or blocked, and the team’s own tasks.",
  },
  {
    id: "dispatch",
    label: "Dispatch Schedule",
    group: "Operations",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "What leaves the studio, when, and the checks before it goes.",
  },
  {
    id: "returns",
    label: "Returns & Deposits",
    group: "Operations",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Pieces coming back, inspections, deposits and late fees.",
  },
  {
    id: "payouts",
    label: "Payouts to Listers",
    group: "Operations",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "What each lister is owed, approved and paid.",
  },
  {
    id: "customers",
    label: "Customers",
    group: "Operations",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Customer records, contact details, addresses and history.",
  },
  {
    id: "products",
    label: "Products",
    group: "Catalogue",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Every piece: details, photographs, prices and status.",
  },
  {
    id: "designers",
    label: "Designers",
    group: "Catalogue",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "The designers the shop names, and their pages.",
  },
  {
    id: "listers",
    label: "Listers",
    group: "Catalogue",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "The people whose pieces we look after, with their bank details.",
  },
  {
    id: "lyp",
    label: "LYP Submissions",
    group: "Catalogue",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Pieces offered to House of Kaira through List Your Piece.",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    group: "Growth",
    levels: ["View", "Hidden"],
    maxLevel: "View",
    inRolesTable: true,
    description:
      "Revenue and performance by designer, category and channel. Only ever viewed.",
  },
  {
    id: "promotions",
    label: "Promotions",
    group: "Growth",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Promo codes, who they are for, and what they cost.",
  },
  {
    id: "messaging",
    label: "Messaging",
    group: "Growth",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "The wording of every message customers and listers receive.",
  },
  {
    id: "settings",
    label: "Site Settings",
    group: "Site Settings",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Menus, header, footer and site-wide settings.",
  },
  {
    id: "homepage",
    label: "Homepage",
    group: "Site Settings",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Every band on the homepage.",
  },
  {
    id: "pages",
    label: "Pages",
    group: "Site Settings",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "Policies, help and company pages.",
  },
  {
    id: "platform_legal",
    label: "Platform & Legal",
    group: "Site Settings",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "The legal entity, GST and platform terms.",
  },
  {
    id: "master_data",
    label: "Master Data",
    group: "Configuration",
    levels: ["Edit", "View", "Hidden"],
    maxLevel: "Edit",
    inRolesTable: true,
    description: "The lists the panel chooses from, and the house rules.",
  },
  {
    id: "roles_permissions",
    label: "Team & Permissions",
    group: "Configuration",
    levels: ["Edit", "Hidden"],
    maxLevel: "Edit",
    founderOnly: true,
    inRolesTable: false,
    description: "The team, their roles and this page. Founder only, always.",
  },
];

export const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

/**
 * Spec 3.2: Fourteen decisions
 */
export const DECISIONS = [
  {
    id: "approve_pay_lister_payouts",
    label: "Approve and pay lister payouts",
    tableSectionId: "payouts",
    needsEditOn: ["payouts"],
    description:
      "Agree what a lister is paid and mark it paid. Money leaves House of Kaira.",
    askLine:
      "Prepare the payout and leave it for someone who can approve it.",
  },
  {
    id: "refund_deposit_in_full",
    label: "Refund a deposit in full",
    tableSectionId: "returns",
    needsEditOn: ["returns"],
    description:
      "Send a deposit back once the piece is home and nothing is owed.",
    askLine:
      "Record the inspection and leave the refund for someone who can release it.",
  },
  {
    id: "decide_deductions_late_fees_waivers",
    label: "Decide deductions, late fees and waivers",
    tableSectionId: "returns",
    needsEditOn: ["returns"],
    description:
      "Keep part or all of a deposit for damage or loss, charge or waive a late fee, or waive a balance a customer owes. Each is decided on evidence.",
    askLine:
      "Record what you found, with photographs, and leave the decision for someone who can make it.",
  },
  {
    id: "verify_lister_bank_account",
    label: "Verify a lister’s bank account",
    tableSectionId: "listers",
    needsEditOn: ["listers"],
    description:
      "Payouts go only to a verified account. Anyone who edits listers can enter or change bank details; a changed account number pauses payouts until it is verified again.",
    askLine:
      "Enter the details and leave the check, a penny drop or a statement, for someone who can verify it.",
  },
  {
    id: "cancel_paid_order",
    label: "Cancel a paid order",
    tableSectionId: "orders",
    needsEditOn: ["orders", "enquiries"],
    description:
      "Cancelling frees the dates, refunds the customer and voids the lister’s payout.",
    askLine:
      "Add a note to the order and ask someone who can cancel it.",
  },
  {
    id: "set_or_change_prices",
    label: "Set or change prices",
    tableSectionId: "products",
    needsEditOn: ["products"],
    description:
      "Rental fees, sale price, lowest offer and deposit on a piece, and a Buy New designer’s commission and payment terms. Always agreed with the lister or designer first.",
    askLine:
      "The price fields stay locked for you. Everything else on the piece can still be changed.",
  },
  {
    id: "set_lister_share",
    label: "Set a lister’s share",
    tableSectionId: "products",
    needsEditOn: ["products"],
    description:
      "What a lister earns on each rental and on a sale of her piece.",
    askLine: "The share fields stay locked for you.",
  },
  {
    id: "accept_counter_decline_offer",
    label: "Accept, counter or decline an offer",
    tableSectionId: "offers",
    needsEditOn: ["offers"],
    description:
      "Saying yes, or naming a counter price, sets what the piece sells for.",
    askLine:
      "Add a note to the offer and leave the answer for someone who can give it.",
  },
  {
    id: "put_piece_live",
    label: "Put a piece live",
    tableSectionId: "products",
    needsEditOn: ["products"],
    description:
      "Publish a piece to the shop after review, or bring a paused piece back.",
    askLine: "Submit the piece for review instead.",
  },
  {
    id: "decide_lyp_submission",
    label: "Say yes or no to a submission",
    tableSectionId: "lyp",
    needsEditOn: ["lyp"],
    description:
      "Accept a piece offered through List Your Piece, or decline it with a reason the lister reads.",
    askLine:
      "Fill in the worksheet and leave the decision for someone who can make it.",
  },
  {
    id: "create_change_promo_codes",
    label: "Create and change promo codes",
    tableSectionId: "promotions",
    needsEditOn: ["promotions"],
    description: "House of Kaira pays for every discount a code gives.",
    askLine: "Ask someone who can create codes.",
  },
  {
    id: "publish_to_website",
    label: "Publish to the website",
    tableSectionId: "pages",
    needsEditOn: ["homepage", "pages", "settings"],
    description: "Make homepage, page and menu changes live for customers.",
    askLine:
      "Your changes stay saved as a draft until someone who can publish makes them live.",
  },
  {
    id: "change_site_wide_settings",
    label: "Change site-wide settings",
    tableSectionId: "settings",
    needsEditOn: ["settings"],
    description:
      "Search listing, legal details, site status, brand and region. A wrong value shows on every page at once.",
    askLine: "Ask someone who can change site-wide settings.",
  },
  {
    id: "download_lists",
    label: "Download lists",
    tableSectionId: null, // Across the panel
    needsEditOn: [], // Needs no section at all
    description:
      "Export orders, customers, listers, payouts and other lists as files. They carry personal details.",
    askLine: "Ask someone who can download lists.",
  },
];

export const DECISION_BY_ID = Object.fromEntries(DECISIONS.map((d) => [d.id, d]));

/**
 * Spec 3.3: Five supplied roles
 */
export const DEFAULT_ROLES = [
  {
    roleId: "founder",
    name: "Founder",
    colour: "#C9A96E",
    isFixed: true,
    archived: false,
    sortOrder: 0,
    description:
      "Runs House of Kaira. Opens and decides everything, and is the only role that can manage the team.",
    levels: {
      dashboard: "View",
      orders: "Edit",
      offers: "Edit",
      enquiries: "Edit",
      calendar: "Edit",
      dispatch: "Edit",
      returns: "Edit",
      payouts: "Edit",
      customers: "Edit",
      products: "Edit",
      designers: "Edit",
      listers: "Edit",
      lyp: "Edit",
      reports: "View",
      promotions: "Edit",
      messaging: "Edit",
      settings: "Edit",
      homepage: "Edit",
      pages: "Edit",
      platform_legal: "Edit",
      master_data: "Edit",
    },
    decisions: DECISIONS.map((d) => d.id),
  },
  {
    roleId: "operations_manager",
    name: "Operations Manager",
    colour: "#6B7E5A",
    isFixed: false,
    archived: false,
    sortOrder: 1,
    description:
      "Runs the order desk day to day: rentals, sales, offers, enquiries, dispatch, returns and listers.",
    levels: {
      dashboard: "View",
      orders: "Edit",
      offers: "Edit",
      enquiries: "Edit",
      calendar: "Edit",
      dispatch: "Edit",
      returns: "Edit",
      payouts: "Edit",
      customers: "Edit",
      products: "Edit",
      designers: "View",
      listers: "Edit",
      lyp: "Edit",
      reports: "View",
      promotions: "Edit",
      messaging: "Edit",
      settings: "View",
      homepage: "View",
      pages: "View",
      platform_legal: "Hidden",
      master_data: "View",
    },
    decisions: [
      "refund_deposit_in_full",
      "cancel_paid_order",
      "accept_counter_decline_offer",
    ],
  },
  {
    roleId: "catalogue_content",
    name: "Catalogue & Content",
    colour: "#B85C38",
    isFixed: false,
    archived: false,
    sortOrder: 2,
    description:
      "Lists pieces and keeps the site looking its best: products, designers, homepage, pages and message wording.",
    levels: {
      dashboard: "Hidden",
      orders: "Hidden",
      offers: "Hidden",
      enquiries: "Hidden",
      calendar: "View",
      dispatch: "Hidden",
      returns: "Hidden",
      payouts: "Hidden",
      customers: "Hidden",
      products: "Edit",
      designers: "Edit",
      listers: "Hidden",
      lyp: "View",
      reports: "Hidden",
      promotions: "View",
      messaging: "Edit",
      settings: "Edit",
      homepage: "Edit",
      pages: "Edit",
      platform_legal: "Hidden",
      master_data: "View",
    },
    decisions: [],
  },
  {
    roleId: "studio_assistant",
    name: "Studio Assistant",
    colour: "#8A7E72",
    isFixed: false,
    archived: false,
    sortOrder: 3,
    description:
      "Looks after the pieces themselves: the checks before dispatch, packing, returns, cleaning, storage, and the dates a piece rests between rentals.",
    levels: {
      dashboard: "Hidden",
      orders: "View",
      offers: "Hidden",
      enquiries: "Hidden",
      calendar: "Edit",
      dispatch: "Edit",
      returns: "Edit",
      payouts: "Hidden",
      customers: "Hidden",
      products: "View",
      designers: "Hidden",
      listers: "Hidden",
      lyp: "Hidden",
      reports: "Hidden",
      promotions: "Hidden",
      messaging: "Hidden",
      settings: "Hidden",
      homepage: "Hidden",
      pages: "Hidden",
      platform_legal: "Hidden",
      master_data: "Hidden",
    },
    decisions: [],
  },
  {
    roleId: "accountant",
    name: "Accountant",
    colour: "#4B3F63",
    isFixed: false,
    archived: false,
    sortOrder: 4,
    description:
      "Keeps the books from outside the team. Sees orders, deposits, payouts and reports for GST and TDS, and changes nothing.",
    levels: {
      dashboard: "View",
      orders: "View",
      offers: "Hidden",
      enquiries: "Hidden",
      calendar: "Hidden",
      dispatch: "Hidden",
      returns: "View",
      payouts: "View",
      customers: "View",
      products: "View",
      designers: "Hidden",
      listers: "View",
      lyp: "Hidden",
      reports: "View",
      promotions: "View",
      messaging: "Hidden",
      settings: "Hidden",
      homepage: "Hidden",
      pages: "Hidden",
      platform_legal: "View",
      master_data: "Hidden",
    },
    decisions: ["download_lists"],
  },
];

/**
 * Spec 1 (Sample data) & Fig 01 / Fig 05 / Fig 12 / Fig 76:
 * Only two canonical users exist in the initial team.
 */
export const DEFAULT_MEMBERS = [
  {
    personId: "soumya",
    fullName: "Soumya Agrawal",
    shownOnRecordsAs: "Soumya",
    olderSpellings: [],
    roleId: "founder",
    status: "Active",
    workEmail: "soumya@houseofkaira.com",
    whatsappNumber: "+91 93401 39300",
    addedAt: "2025-12-01T10:00:00.000Z",
    addedBy: "Soumya",
    invitedAt: null,
    inviteExpiresAt: null,
    joinedAt: "2025-12-01T10:00:00.000Z",
    lastActiveAt: "2026-03-23T09:14:00.000Z",
    hasSignedInOnce: true,
  },
  {
    personId: "priya",
    fullName: "Priya",
    shownOnRecordsAs: "Priya (Ops)",
    olderSpellings: [],
    roleId: "operations_manager",
    status: "Active",
    workEmail: "priya.ops@houseofkaira.com",
    whatsappNumber: "",
    addedAt: "2025-12-15T11:30:00.000Z",
    addedBy: "Soumya",
    invitedAt: "2025-12-15T11:30:00.000Z",
    inviteExpiresAt: null,
    joinedAt: "2025-12-16T10:05:00.000Z",
    lastActiveAt: "2026-03-22T18:40:00.000Z",
    hasSignedInOnce: true,
  },
];

/**
 * Fig 05 History tab: initial 3 timeline lines matching DEFAULT_MEMBERS.
 */
export const DEFAULT_HISTORY = [
  {
    entryId: "HIS-DEFAULT-003",
    kind: "people",
    who: "Priya (Ops)",
    target: "priya",
    message: "Priya accepted her invite and signed in for the first time",
    occurredAt: "2025-12-16T10:05:00.000Z",
  },
  {
    entryId: "HIS-DEFAULT-002",
    kind: "people",
    who: "Soumya",
    target: "priya",
    message: "Invited Priya as Operations Manager",
    occurredAt: "2025-12-15T11:30:00.000Z",
  },
  {
    entryId: "HIS-DEFAULT-001",
    kind: "people",
    who: "Soumya",
    target: "soumya",
    message: "Set up the team with Soumya Agrawal as Founder",
    occurredAt: "2025-12-01T10:00:00.000Z",
  },
];

const LEVEL_RANK = { Hidden: 0, View: 1, Edit: 2 };

export function clampSectionLevel(sectionId, level) {
  const sec = SECTION_BY_ID[sectionId];
  if (!sec) return "Hidden";
  if (sec.founderOnly) return "Hidden";
  const normalized = ["Edit", "View", "Hidden"].includes(level)
    ? level
    : "Hidden";
  if (LEVEL_RANK[normalized] > LEVEL_RANK[sec.maxLevel]) {
    return sec.maxLevel;
  }
  return normalized;
}

/**
 * Spec 3.6: Rules the registry works out for itself
 */
export function computeEffectivePermissions(role) {
  const isFounder =
    Boolean(role?.isFixed) || role?.roleId === FOUNDER_ROLE_ID;

  const levels = {};

  if (isFounder) {
    for (const sec of SECTIONS) {
      levels[sec.id] = sec.maxLevel;
    }
    return {
      roleId: role?.roleId || FOUNDER_ROLE_ID,
      roleName: role?.name || "Founder",
      isFounder: true,
      levels,
      decisions: DECISIONS.map((d) => d.id),
      openSectionsCount: SECTIONS.filter((s) => s.id !== "roles_permissions")
        .length,
    };
  }

  const storedLevels = role?.levels || {};
  for (const sec of SECTIONS) {
    if (sec.founderOnly) {
      levels[sec.id] = "Hidden";
    } else if (sec.followsRole) {
      // Computed next
      levels[sec.id] = "Hidden";
    } else {
      levels[sec.id] = clampSectionLevel(sec.id, storedLevels[sec.id]);
    }
  }

  // Notifications: Edit if any section other than dashboard & reports has Edit;
  // else View if any such section has View; else Hidden.
  let hasOtherEdit = false;
  let hasOtherView = false;
  for (const sec of SECTIONS) {
    if (
      sec.id === "dashboard" ||
      sec.id === "reports" ||
      sec.id === "notifications" ||
      sec.id === "roles_permissions"
    ) {
      continue;
    }
    if (levels[sec.id] === "Edit") hasOtherEdit = true;
    if (levels[sec.id] === "View") hasOtherView = true;
  }
  levels.notifications = hasOtherEdit
    ? "Edit"
    : hasOtherView
      ? "View"
      : "Hidden";

  // Decisions: only count if reachable (needsEditOn is empty OR at least one has Edit)
  const storedDecisions = new Set(
    Array.isArray(role?.decisions) ? role.decisions : [],
  );
  const effectiveDecisions = DECISIONS.filter((dec) => {
    if (!storedDecisions.has(dec.id)) return false;
    if (!dec.needsEditOn || dec.needsEditOn.length === 0) return true;
    return dec.needsEditOn.some((secId) => levels[secId] === "Edit");
  }).map((d) => d.id);

  // Count of open sections (spec §8: "includes Notifications")
  const openSectionsCount = SECTIONS.filter(
    (s) => !s.founderOnly && levels[s.id] !== "Hidden",
  ).length;

  return {
    roleId: role?.roleId,
    roleName: role?.name || "",
    isFounder: false,
    levels,
    decisions: effectiveDecisions,
    openSectionsCount,
  };
}

/**
 * Normalize status between DB ("Suspended") and UI ("Paused")
 */
export function normalizeMemberStatusForApi(status) {
  if (status === "Suspended" || status === "Paused") return "Paused";
  if (status === "Invited" || status === "Left" || status === "Active") {
    return status;
  }
  return "Active";
}

export function normalizeMemberStatusForDb(status) {
  if (status === "Paused" || status === "Suspended") return "Suspended";
  if (status === "Invited" || status === "Left" || status === "Active") {
    return status;
  }
  return "Active";
}

/**
 * Spec 4.7: Initials ignoring any tag in brackets
 */
export function computeInitials(name = "") {
  const cleaned = String(name || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "?";
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function getFirstName(fullName = "") {
  const cleaned = String(fullName || "").trim();
  if (!cleaned) return "";
  return cleaned.split(/\s+/)[0];
}
