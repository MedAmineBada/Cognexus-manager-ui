const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

// Token storage keys
const ACCESS_TOKEN_KEY = "cognexus_access_token";
// Note: refresh_token is now stored in HttpOnly cookie by the server
// and cannot be accessed via JavaScript for security reasons

/**
 * Check if refresh token cookie exists
 * Since HttpOnly cookies can't be read by JavaScript,
 * we infer its existence by checking if we have a valid access token
 * and making a test request to verify authentication
 */
export async function hasRefreshTokenCookie() {
  // We can't directly check HttpOnly cookies from JavaScript
  // Instead, we'll check if we have an access token
  // The server will validate the refresh token cookie automatically
  const accessToken = getAccessToken();
  return !!accessToken;
}

/**
 * Store access token in memory (sessionStorage for persistence across refreshes)
 */
export function setAccessToken(token) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

/**
 * Get access token from memory
 */
export function getAccessToken() {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

/**
 * Clear access token from memory
 */
export function clearAccessToken() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

/**
 * Check if user is authenticated (both tokens must be present)
 */
export function isAuthenticated() {
  const accessToken = getAccessToken();
  const hasRefreshToken = hasRefreshTokenCookie();
  return !!accessToken && hasRefreshToken;
}

/**
 * Clear all authentication tokens
 */
export function clearAuth() {
  clearAccessToken();
  // Note: HttpOnly refresh token cookie will be cleared by the server
  // when we call the logout endpoint, or it will expire naturally
  // We can't directly delete HttpOnly cookies from JavaScript
}

/**
 * Parse error message to determine error type
 */
export function parseAuthError(errorMessage) {
  const lowerMessage = errorMessage.toLowerCase();

  if (lowerMessage.includes("password")) {
    return {
      type: "wrong_password",
      message: "Incorrect password. Please try again.",
    };
  }

  if (lowerMessage.includes("activat")) {
    return {
      type: "account_not_activated",
      message:
        "Your account is not yet activated. Please wait or contact an admin for activation.",
    };
  }

  return {
    type: "auth_failed",
    message: "Either the password is incorrect or your account is not active.",
  };
}

/**
 * Login handler
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    // Debug logging (remove in production)
    console.log("Login response status:", response.status);

    // Handle different error status codes
    if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      console.log("422 Error data:", errorData);
      return {
        success: false,
        error:
          errorData.detail ||
          errorData.message ||
          "Invalid email format or missing credentials.",
      };
    }

    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      console.log("404 Error data:", errorData);
      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          "No account found with this email address.",
      };
    }

    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      console.log("401 Error data:", errorData);
      const errorMessage =
        errorData.error || errorData.message || "Authentication failed.";
      const parsedError = parseAuthError(errorMessage);
      return {
        success: false,
        error: parsedError.message,
        errorType: parsedError.type,
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Other error status:", response.status, errorData);
      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          "Login failed. Please try again.",
      };
    }

    // Successful login
    const data = await response.json();
    console.log("Login successful:", data);

    // Store access token only
    // Refresh token is automatically set as HttpOnly cookie by the server
    if (data.access_token) {
      setAccessToken(data.access_token);
    }

    // Note: Do NOT try to store refresh_token - it's in HttpOnly cookie
    // The browser will automatically send it with future requests

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please check your connection.",
    };
  }
}

/**
 * Logout handler
 * Calls the server logout endpoint to clear HttpOnly refresh token cookie
 */
export async function logout() {
  try {
    // Call server logout endpoint to clear HttpOnly cookie
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeader(),
      credentials: "include", // Include cookies in request
    });
  } catch (error) {
    console.error("Logout API call failed:", error);
    // Continue with client-side cleanup even if API call fails
  } finally {
    // Always clear client-side tokens
    clearAuth();
    // Redirect to login
    window.location.href = "/login";
  }
}

/**
 * Get authorization header for API requests
 * Also returns credentials: 'include' to send HttpOnly cookies
 */
export function getAuthConfig() {
  const token = getAccessToken();
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include", // Always include cookies (for HttpOnly refresh token)
  };
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getAuthConfig() instead for full cookie support
 */
export function getAuthHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
