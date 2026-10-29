export const ADMIN_BASE = "/hok_admin";

export const VALID_VIEWS = [
  "dashboard",
  "orders",
  "offers",
  "calendar",
  "dispatch",
  "returns",
  "payouts",
  "customers",
  "categories",
  "products",
  "designers",
  "listers",
  "lyp",
  "occasions",
  "reports",
  "promotions",
  "messaging",
  "notifications",
  "settings",
  "homepage",
  "pages",
  "circularity",
  "platform_legal",
  "master_data",
  "roles_permissions",
] as const;

export type ValidView = (typeof VALID_VIEWS)[number];

export function parseAdminRoute(): {
  view: string;
  subId?: string;
  searchParams: URLSearchParams;
} {
  if (typeof window === "undefined") {
    return { view: "dashboard", searchParams: new URLSearchParams() };
  }

  const pathname = window.location.pathname.replace(/\/+$/, "");
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#\/?/, "").trim();

  // 1. Path-based route: /hok_admin/customers, /hok_admin/orders/ORD-001, etc.
  const baseRegex = new RegExp(`^${ADMIN_BASE}(?:/(.*))?$`, "i");
  const match = pathname.match(baseRegex);

  if (match) {
    const rawRest = (match[1] || "").trim();
    if (rawRest) {
      const parts = rawRest.split("/");
      const section = parts[0].toLowerCase();
      const subId = parts[1];

      if ((section === "orders" || section === "order") && subId) {
        return { view: `order_detail:${subId}`, subId, searchParams };
      }
      if ((section === "listers" || section === "lister") && subId) {
        return { view: `lister_detail:${subId}`, subId, searchParams };
      }
      if (VALID_VIEWS.includes(section as any)) {
        return { view: section, subId, searchParams };
      }
    }
  }

  // 2. Query param based route: ?view=customers or ?tab=customers
  const tabParam = searchParams.get("tab") || searchParams.get("view");
  if (tabParam) {
    const lowerTab = tabParam.toLowerCase();
    const idParam = searchParams.get("orderId") || searchParams.get("id");
    if ((lowerTab === "orders" || lowerTab === "order") && idParam) {
      return { view: `order_detail:${idParam}`, subId: idParam, searchParams };
    }
    if ((lowerTab === "listers" || lowerTab === "lister") && idParam) {
      return { view: `lister_detail:${idParam}`, subId: idParam, searchParams };
    }
    if (VALID_VIEWS.includes(lowerTab as any)) {
      return { view: lowerTab, searchParams };
    }
  }

  // 3. Hash based route: #/customers
  if (hash) {
    const [hSection, hSubId] = hash.split("/");
    const lowerH = hSection.toLowerCase();
    if ((lowerH === "orders" || lowerH === "order") && hSubId) {
      return { view: `order_detail:${hSubId}`, subId: hSubId, searchParams };
    }
    if ((lowerH === "listers" || lowerH === "lister") && hSubId) {
      return { view: `lister_detail:${hSubId}`, subId: hSubId, searchParams };
    }
    if (VALID_VIEWS.includes(lowerH as any)) {
      return { view: lowerH, subId: hSubId, searchParams };
    }
  }

  // 4. LocalStorage persistent fallback for refreshes on /hok_admin/
  try {
    const saved = localStorage.getItem("hok_admin_last_view");
    if (saved) {
      if (
        saved.startsWith("order_detail:") ||
        saved.startsWith("lister_detail:") ||
        VALID_VIEWS.includes(saved as any)
      ) {
        return { view: saved, searchParams };
      }
    }
  } catch {
    // Ignore localStorage access errors
  }

  return { view: "dashboard", searchParams };
}

export function buildRouteUrl(
  view: string,
  searchParams?: URLSearchParams,
): string {
  let path = `${ADMIN_BASE}/`;
  if (view.startsWith("order_detail:")) {
    const orderId = view.slice("order_detail:".length);
    path = `${ADMIN_BASE}/orders/${orderId}`;
  } else if (view.startsWith("lister_detail:")) {
    const listerId = view.slice("lister_detail:".length);
    path = `${ADMIN_BASE}/listers/${listerId}`;
  } else if (view && view !== "dashboard") {
    path = `${ADMIN_BASE}/${view}`;
  }

  const query = searchParams ? searchParams.toString() : "";
  return query ? `${path}?${query}` : path;
}

export function syncRoute(
  view: string,
  replace = false,
  searchParams?: URLSearchParams,
) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("hok_admin_last_view", view);
  } catch {
    // Ignore storage errors
  }

  const targetUrl = buildRouteUrl(view, searchParams);
  const currentUrl = window.location.pathname + window.location.search;

  if (currentUrl !== targetUrl) {
    if (replace) {
      window.history.replaceState({ view }, "", targetUrl);
    } else {
      window.history.pushState({ view }, "", targetUrl);
    }
  }
}
