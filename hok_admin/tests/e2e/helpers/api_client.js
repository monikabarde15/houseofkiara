/**
 * Opaque-box HTTP API Client for HOK Admin Panel E2E Tests
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5003/api';

class ApiClient {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async request(method, path, body = null, customHeaders = {}) {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const headers = {
      "Accept": "application/json",
      ...customHeaders,
    };

    if (this.token && !headers["Authorization"] && !headers["authorization"]) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body !== null && body !== undefined) {
      if (typeof body === "object" && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      } else {
        options.body = body;
      }
    }

    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get("content-type") || "";
      let data = null;
      let rawText = "";

      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      } else {
        rawText = await res.text();
      }

      return {
        status: res.status,
        ok: res.ok,
        headers: res.headers,
        data,
        rawText,
      };
    } catch (err) {
      return {
        status: 0,
        ok: false,
        headers: new Headers(),
        data: null,
        rawText: "",
        error: err.message,
      };
    }
  }

  get(path, headers = {}) {
    return this.request("GET", path, null, headers);
  }

  post(path, body, headers = {}) {
    return this.request("POST", path, body, headers);
  }

  put(path, body, headers = {}) {
    return this.request("PUT", path, body, headers);
  }

  patch(path, body, headers = {}) {
    return this.request("PATCH", path, body, headers);
  }

  delete(path, body = null, headers = {}) {
    return this.request("DELETE", path, body, headers);
  }
}

export const createApiClient = (baseUrl) => new ApiClient(baseUrl);
export const apiClient = new ApiClient();
