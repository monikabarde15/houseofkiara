import {
  DecisionDefinition,
  EffectivePermissions,
  RoleRecord,
  SectionDefinition,
  SectionLevel,
  TeamMemberRecord,
} from "./types";

export const FOUNDER_ROLE_ID = "founder";

export const SECTION_GROUPS = [
  "Overview",
  "Operations",
  "Catalogue",
  "Growth",
  "Site Settings",
  "Configuration",
];

export const SECTIONS: SectionDefinition[] = [
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

export const SECTION_BY_ID: Record<string, SectionDefinition> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s]),
);

export const DECISIONS: DecisionDefinition[] = [
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
    askLine: "Add a note to the order and ask someone who can cancel it.",
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
    tableSectionId: null,
    needsEditOn: [],
    description:
      "Export orders, customers, listers, payouts and other lists as files. They carry personal details.",
    askLine: "Ask someone who can download lists.",
  },
];

export const DECISION_BY_ID: Record<string, DecisionDefinition> = Object.fromEntries(
  DECISIONS.map((d) => [d.id, d]),
);

const LEVEL_RANK: Record<SectionLevel, number> = {
  Hidden: 0,
  View: 1,
  Edit: 2,
};

export function clampSectionLevel(
  sectionId: string,
  level?: string,
): SectionLevel {
  const sec = SECTION_BY_ID[sectionId];
  if (!sec || sec.founderOnly) return "Hidden";
  const normalized: SectionLevel =
    level === "Edit" || level === "View" || level === "Hidden"
      ? level
      : "Hidden";
  return LEVEL_RANK[normalized] > LEVEL_RANK[sec.maxLevel]
    ? sec.maxLevel
    : normalized;
}

/**
 * Map existing app route/view IDs to their governing permission section ID.
 * Preserves existing views like `categories`, `pages_editor`, `occasions`, and detail views.
 */
export function resolveViewPermissionSection(view: string): string {
  if (!view) return "dashboard";
  if (view.startsWith("order_detail:")) return "orders";
  if (view.startsWith("lister_detail:")) return "listers";
  if (view.startsWith("product_detail:")) return "products";
  if (view.startsWith("customer_detail:")) return "customers";
  if (view === "returns:ledger" || view.startsWith("returns:")) return "returns";
  if (view === "categories") return "products";
  if (view === "occasions") return "master_data";
  if (view === "pages_editor") return "pages";
  return view;
}

export function computeEffectivePermissions(
  role?: Partial<RoleRecord> | null,
): EffectivePermissions {
  const isFounder = Boolean(role?.isFixed) || role?.roleId === FOUNDER_ROLE_ID;
  const levels: Record<string, SectionLevel> = {};

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

  const stored = role?.rawLevels || role?.levels || {};
  for (const sec of SECTIONS) {
    if (sec.founderOnly || sec.followsRole) {
      levels[sec.id] = "Hidden";
    } else {
      levels[sec.id] = clampSectionLevel(sec.id, stored[sec.id]);
    }
  }

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

  const storedDecs = new Set(role?.rawDecisions || role?.decisions || []);
  const decisions = DECISIONS.filter((dec) => {
    if (!storedDecs.has(dec.id)) return false;
    if (!dec.needsEditOn || dec.needsEditOn.length === 0) return true;
    return dec.needsEditOn.some((secId) => levels[secId] === "Edit");
  }).map((d) => d.id);

  const openSectionsCount = SECTIONS.filter(
    (s) => !s.founderOnly && levels[s.id] !== "Hidden",
  ).length;

  return {
    roleId: role?.roleId || "",
    roleName: role?.name || "",
    isFounder: false,
    levels,
    decisions,
    openSectionsCount,
  };
}

/**
 * Spec 4.7: Initials ignoring any tag in brackets
 */
export function computeInitials(name = ""): string {
  const cleaned = String(name || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "?";
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function getFirstName(fullName = ""): string {
  const cleaned = String(fullName || "").trim();
  if (!cleaned) return "";
  return cleaned.split(/\s+/)[0];
}

/**
 * Spec 4.8: Date & Time formatting
 */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatTime12h(d: Date): string {
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

export function formatShortDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatFullDateTime(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${formatTime12h(d)}`;
}

export function formatRelativeDateTime(
  iso?: string | null,
  lowerCaseDay = false,
): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startOfTarget = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  ).getTime();
  const diffDays = Math.round((startOfToday - startOfTarget) / 86400000);

  if (diffDays === 0) {
    const label = lowerCaseDay ? "today" : "Today";
    return `${label}, ${formatTime12h(d)}`;
  }
  if (diffDays === 1) {
    const label = lowerCaseDay ? "yesterday" : "Yesterday";
    return `${label}, ${formatTime12h(d)}`;
  }
  if (diffDays >= 2 && diffDays <= 6) {
    return `${diffDays} days ago`;
  }
  return formatShortDate(iso);
}

/**
 * Spec 5.1: Sort people by Status (Active -> Invited -> Paused -> Left),
 * then by role order in Roles table, then by name A to Z.
 */
export function sortMembersForTeamTable(
  members: TeamMemberRecord[],
  roles: RoleRecord[],
): TeamMemberRecord[] {
  const statusOrder: Record<string, number> = {
    Active: 0,
    Invited: 1,
    Paused: 2,
    Left: 3,
  };
  const roleIndex = new Map(roles.map((r, i) => [r.roleId, i]));

  return [...members].sort((a, b) => {
    const sa = statusOrder[a.status] ?? 99;
    const sb = statusOrder[b.status] ?? 99;
    if (sa !== sb) return sa - sb;
    const ra = roleIndex.get(a.roleId) ?? 999;
    const rb = roleIndex.get(b.roleId) ?? 999;
    if (ra !== rb) return ra - rb;
    return String(a.fullName || "").localeCompare(String(b.fullName || ""));
  });
}

export function joinWithAnd(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
