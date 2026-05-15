import { getAccessToken } from "./auth.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:10100/api/v1";

async function apiRequest(path, options = {}) {
  const method = options.method ?? "GET";
  const headers = { ...options.headers };

  // Add authorization header with access token
  const accessToken = getAccessToken();
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    credentials: "include", // Include HttpOnly cookies
  });

  // Handle 401 Unauthorized (token expired)
  if (response.status === 401) {
    // Clear tokens and redirect to login
    const { clearAuth } = await import("./auth.js");
    clearAuth();
    window.location.href = "/login";
    throw new Error("Authentication expired. Please login again.");
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // Response body was not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getFlags() {
  return apiRequest("/flags", { method: "GET" });
}

export async function toggleService(serviceKey) {
  await apiRequest(`/flags/service/${encodeURIComponent(serviceKey)}/toggle`, {
    method: "POST",
  });
  return getFlags();
}

export async function toggleEndpoint(flagName) {
  await apiRequest(`/flags/${encodeURIComponent(flagName)}/toggle`, {
    method: "POST",
  });
  return getFlags();
}
