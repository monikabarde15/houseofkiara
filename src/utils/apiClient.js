// src/utils/apiClient.js
import apiCacheStore from "../store/apiCacheStore";

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL

function getCacheKey(url) {
  return url;
}

async function request(url, options = {}) {
  const { method = "GET", body, headers = {} } = options;
  const fetchOptions = {
    method,
    headers: { ...headers },
  };

  if (body) {
    if (body instanceof FormData) {
      fetchOptions.body = body;
      // Note: We don't set Content-Type here; browser handles multipart/form-data with boundary
    } else {
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(body);
    }
  }
  const response = await fetch(url, fetchOptions);
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

export async function get(url, { ttl = DEFAULT_TTL_MS, ...rest } = {}) {
  const cacheKey = getCacheKey(url);
  const cached = apiCacheStore.getState().get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }
  const result = await request(url, { method: "GET", ...rest });
  if (result.ok) {
    apiCacheStore
      .getState()
      .set(cacheKey, { data: result.data, timestamp: now });
  }
  return result.data;
}

export async function post(url, body, options = {}) {
  const result = await request(url, { method: "POST", body, ...options });
  // Invalidate related GET cache entries
  apiCacheStore.getState().invalidate(url);
  return result.data;
}

export async function put(url, body, options = {}) {
  const result = await request(url, { method: "PUT", body, ...options });
  apiCacheStore.getState().invalidate(url);
  return result.data;
}

export async function del(url, options = {}) {
  const result = await request(url, { method: "DELETE", ...options });
  apiCacheStore.getState().invalidate(url);
  return result.data;
}
