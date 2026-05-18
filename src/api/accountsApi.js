import { authenticatedFetch } from "./auth.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:10100/api/v1";

async function apiRequest(path, options = {}) {
  const method = options.method ?? "GET";
  const headers = { ...options.headers };

  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }

  const response = await authenticatedFetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // Response body was not JSON.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Get all accounts
 * @returns {Promise<{admin_id: string, users: Array}>}
 */
export async function getAccounts() {
  return apiRequest("/accounts", { method: "GET" });
}

/**
 * Get a specific account by ID
 * @param {string} userId - The user ID to fetch
 * @returns {Promise<{user: object}>}
 */
export async function getAccountById(userId) {
  return apiRequest(`/accounts?id=${encodeURIComponent(userId)}`, {
    method: "GET",
  });
}

/**
 * Create a new account
 * @param {object} userData - User data to create
 * @returns {Promise<object>}
 */
export async function createAccount(userData) {
  return apiRequest("/accounts", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * Update an existing account
 * @param {string} userId - The user ID to update
 * @param {object} userData - Updated user data
 * @returns {Promise<object>}
 */
export async function updateAccount(userId, userData) {
  return apiRequest(`/accounts?id=${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

/**
 * Delete an account
 * @param {string} userId - The user ID to delete
 * @returns {Promise<null>}
 */
export async function deleteAccount(userId) {
  return apiRequest(`/accounts?id=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

/**
 * Activate a user account
 * @param {string} userId - The user ID to activate
 * @returns {Promise<Response>}
 */
export async function activateUser(userId) {
  return apiRequest(`/accounts/activate/${encodeURIComponent(userId)}`, {
    method: "POST",
  });
}

/**
 * Deactivate a user account
 * @param {string} userId - The user ID to deactivate
 * @returns {Promise<Response>}
 */
export async function deactivateUser(userId) {
  return apiRequest(`/accounts/deactivate/${encodeURIComponent(userId)}`, {
    method: "POST",
  });
}

/**
 * Add a new user
 * @param {object} userData - User data to add (name, email, password, status)
 * @returns {Promise<object>}
 */
export async function addUser(userData) {
  return apiRequest("/accounts/add", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * Update an existing user
 * @param {string} userId - The user ID to update
 * @param {object} userData - Updated user data (name, email, status)
 * @returns {Promise<object>}
 */
export async function updateUser(userId, userData) {
  return apiRequest(`/accounts/update/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
}

/**
 * Delete a user
 * @param {string} userId - The user ID to delete
 * @returns {Promise<null>}
 */
export async function deleteUser(userId) {
  return apiRequest(`/accounts/delete/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}
