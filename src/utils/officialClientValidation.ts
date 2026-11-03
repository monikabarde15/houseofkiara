/**
 * Official Client-Side Request Validation, Sanitization & High-Speed API Cache/Deduplication Guard
 * - Sanitizes all outgoing /api write requests (POST, PUT, PATCH)
 * - Deduplicates concurrent identical GET /api requests
 * - Caches GET /api responses in memory for instant navigation, while immediately
 *   invalidating all client & cross-tab caches on ANY write (POST, PUT, PATCH, DELETE)
 *   and bypassing stale browser disk cache (`cache: "no-store"`).
 */

const FORBIDDEN_KEYS = new Set([
  "__proto__",
  "constructor",
  "prototype",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__",
]);

const XSS_PATTERNS = [
  /<\s*script\b[^>]*>/i,
  /<\s*\/\s*script\s*>/i,
  /\bjavascript\s*:/i,
  /\bvbscript\s*:/i,
  /\bdata\s*:\s*text\/html/i,
  /\bon(?:error|load|click|mouseover|focus|blur|submit|change|keyup|keydown|toggle)\s*=/i,
  /<\s*(?:iframe|object|embed|applet|meta)\b[^>]*>/i,
  /\beval\s*\(/i,
];

export const sanitizePayload = (value: any, depth = 0): any => {
  if (depth > 10 || value === null || value === undefined) return value;

  if (typeof value === "string") {
    const cleaned = value.replace(/\0/g, "");
    for (const pattern of XSS_PATTERNS) {
      if (pattern.test(cleaned)) {
        throw new Error(
          "Security Validation Error: Unsafe or malicious content is not allowed.",
        );
      }
    }
    return cleaned;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item, depth + 1));
  }

  if (typeof value === "object") {
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      const trimmed = key.trim();
      if (FORBIDDEN_KEYS.has(trimmed) || trimmed.startsWith("$")) {
        continue;
      }
      sanitized[key] = sanitizePayload(value[key], depth + 1);
    }
    return sanitized;
  }

  return value;
};

interface CachedApiEntry {
  timestamp: number;
  status: number;
  statusText: string;
  headers: [string, string][];
  bodyText: string;
}

const CLIENT_GET_CACHE_TTL_MS = 10000;
const apiGetCache = new Map<string, CachedApiEntry>();
const inFlightApiGets = new Map<string, Promise<CachedApiEntry | null>>();

let cacheChannel: BroadcastChannel | null = null;

const clearClientApiCache = (broadcast = false) => {
  apiGetCache.clear();
  inFlightApiGets.clear();
  if (broadcast && cacheChannel) {
    try {
      cacheChannel.postMessage({ type: "INVALIDATE_ALL", ts: Date.now() });
    } catch {
      // ignore broadcast errors
    }
  }
};

const normalizeApiCacheKey = (urlStr: string): string => {
  try {
    const u = new URL(urlStr, window.location.origin);
    return `${u.pathname}${u.search}`;
  } catch {
    return urlStr;
  }
};

const buildResponseFromCache = (entry: CachedApiEntry): Response => {
  return new Response(entry.bodyText, {
    status: entry.status,
    statusText: entry.statusText,
    headers: entry.headers,
  });
};

let initialized = false;

export const initOfficialClientValidation = () => {
  if (initialized || typeof window === "undefined" || !window.fetch) return;
  initialized = true;

  if (typeof BroadcastChannel !== "undefined") {
    try {
      cacheChannel = new BroadcastChannel("hok_portal_cache_sync");
      cacheChannel.onmessage = () => {
        clearClientApiCache(false);
      };
    } catch {
      cacheChannel = null;
    }
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const method = (init?.method || "GET").toUpperCase();
    const urlStr =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const isApiCall = urlStr.includes("/api");

    // 1. Fast GET deduplication & zero-stale-cache memory layer
    if (method === "GET" && isApiCall) {
      const cacheKey = normalizeApiCacheKey(urlStr);
      const bypassCache =
        urlStr.includes("nocache") ||
        urlStr.includes("_t=") ||
        init?.cache === "reload";

      if (!bypassCache) {
        const cached = apiGetCache.get(cacheKey);
        if (
          cached &&
          Date.now() - cached.timestamp < CLIENT_GET_CACHE_TTL_MS
        ) {
          return buildResponseFromCache(cached);
        }

        if (inFlightApiGets.has(cacheKey)) {
          const shared = await inFlightApiGets.get(cacheKey);
          if (shared) {
            return buildResponseFromCache(shared);
          }
        }
      }

      const fetchPromise = (async (): Promise<CachedApiEntry | null> => {
        const res = await originalFetch(input, {
          ...init,
          cache: "no-store",
        });
        if (!res.ok) {
          return null;
        }
        const bodyText = await res.text();
        const headers: [string, string][] = [];
        res.headers.forEach((v, k) => headers.push([k, v]));
        const entry: CachedApiEntry = {
          timestamp: Date.now(),
          status: res.status,
          statusText: res.statusText,
          headers,
          bodyText,
        };
        apiGetCache.set(cacheKey, entry);
        return entry;
      })().finally(() => {
        inFlightApiGets.delete(cacheKey);
      });

      inFlightApiGets.set(cacheKey, fetchPromise);

      try {
        const entry = await fetchPromise;
        if (entry) {
          return buildResponseFromCache(entry);
        }
      } catch {
        // Fallback to direct call if stream clone failed
      }

      return originalFetch(input, { ...init, cache: "no-store" });
    }

    // 2. Write Requests (POST, PUT, PATCH, DELETE): Sanitize & Immediately Invalidate All Caches
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && isApiCall) {
      clearClientApiCache(true);

      if (["POST", "PUT", "PATCH"].includes(method) && init?.body) {
        if (typeof init.body === "string") {
          try {
            const parsed = JSON.parse(init.body);
            const sanitized = sanitizePayload(parsed);
            init = {
              ...init,
              body: JSON.stringify(sanitized),
            };
          } catch (err: any) {
            if (err?.message?.startsWith("Security Validation Error:")) {
              return new Response(
                JSON.stringify({ success: false, message: err.message }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
          }
        } else if (
          typeof FormData !== "undefined" &&
          init.body instanceof FormData
        ) {
          for (const [key, val] of Array.from(init.body.entries())) {
            if (FORBIDDEN_KEYS.has(key.trim()) || key.trim().startsWith("$")) {
              init.body.delete(key);
              continue;
            }
            if (typeof val === "string") {
              for (const pattern of XSS_PATTERNS) {
                if (pattern.test(val)) {
                  return new Response(
                    JSON.stringify({
                      success: false,
                      message:
                        "Security Validation Error: Unsafe or malicious content is not allowed.",
                    }),
                    {
                      status: 400,
                      headers: { "Content-Type": "application/json" },
                    },
                  );
                }
              }
            }
          }
        }
      }

      const writeRes = await originalFetch(input, {
        ...init,
        cache: "no-store",
      });
      clearClientApiCache(true);
      return writeRes;
    }

    return originalFetch(input, init);
  };
};
