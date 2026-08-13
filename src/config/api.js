// Default to '/api' so API calls hit local backend when served from backend public folder,
// or use VITE_API_BASE_URL if explicitly provided.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "/api"
).replace(/\/+$/, "");

export const TOKEN_KEY = "ts_token";

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.warn("Could not save token", err);
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn("Could not remove token", err);
  }
};

/**
 * Robust fetch wrapper for TechnoShop API calls
 * - Handles base URL prepending & proxy routing
 * - Attaches Bearer Authorization token from localStorage if present
 * - Handles CORS credentials safely (avoids wildcard CORS failure on cross-origin requests)
 * - Retries transient network failures / Render cold-starts
 */
export async function apiFetch(endpoint, options = {}, retries = 2) {
  const url =
    endpoint.startsWith("http://") || endpoint.startsWith("https://")
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getAuthToken();

  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Determine credentials mode:
  // If explicitly specified in options, respect it.
  // For cross-origin requests, default to 'same-origin' to avoid CORS wildcard errors ('*') with credentials.
  let credentialsMode = options.credentials;
  if (!credentialsMode) {
    const isCrossOrigin = url.startsWith("http://") || url.startsWith("https://");
    credentialsMode = isCrossOrigin ? "same-origin" : "include";
  }

  const config = {
    ...options,
    credentials: credentialsMode,
    headers,
  };

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(url, config);
      return response;
    } catch (err) {
      // If cross-origin fetch with 'include' credentials failed due to CORS policy, retry with 'same-origin'
      if (config.credentials === "include" && (url.startsWith("http://") || url.startsWith("https://"))) {
        try {
          const fallbackConfig = { ...config, credentials: "same-origin" };
          const response = await fetch(url, fallbackConfig);
          return response;
        } catch {
          // ignore fallback error and let outer retry loop handle
        }
      }

      if (attempt < retries) {
        attempt++;
        await new Promise((res) => setTimeout(res, 1500));
      } else {
        throw err;
      }
    }
  }
}
