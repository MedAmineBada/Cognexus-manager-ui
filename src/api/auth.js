const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

// Token storage keys
const ACCESS_TOKEN_KEY = "cognexus_access_token";
// Note: refresh_token is now stored in HttpOnly cookie by the server
// and cannot be accessed via JavaScript for security reasons

export async function hasRefreshTokenCookie() {
  // We can't directly check HttpOnly cookies from JavaScript
  // Instead, we'll check if we have an access token
  // The server will validate the refresh token cookie automatically
  const accessToken = getAccessToken();
  return !!accessToken;
}

export function setAccessToken(token) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export function getAccessToken() {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

export function clearAccessToken() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function isAuthenticated() {
  const accessToken = getAccessToken();
  const hasRefreshToken = hasRefreshTokenCookie();
  return !!accessToken && hasRefreshToken;
}

export function clearAuth() {
  clearAccessToken();
  // Note: HttpOnly refresh token cookie will be cleared by the server
  // when we call the logout endpoint, or it will expire naturally
  // We can't directly delete HttpOnly cookies from JavaScript
}

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

export async function checkUserExists() {
  try {
    const response = await fetch(`${API_URL}/auth/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Check user response status:", response.status);

    // 200 → User exists
    if (response.status === 200) {
      return { userExists: true };
    }

    // 404 → No user exists
    if (response.status === 404) {
      return { userExists: false };
    }

    // For any other status, assume user doesn't exist (safe default)
    console.warn("Unexpected status from /auth/check:", response.status);
    return { userExists: false };
  } catch (error) {
    console.error("Check user error:", error);
    // On network error, assume user doesn't exist to allow init flow
    return { userExists: false };
  }
}

export async function initFirstUser(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    console.log("Init user response status:", response.status);

    // Handle different error status codes
    if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      console.log("422 Error data:", errorData);
      return {
        success: false,
        error:
          errorData.detail ||
          errorData.message ||
          "Validation failed. Please check your input.",
        statusCode: 422,
      };
    }

    if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      console.log("409 Error data:", errorData);
      return {
        success: false,
        error: "An admin user already exists.",
        statusCode: 409,
      };
    }

    if (response.status === 500) {
      console.log("500 Server error");
      return {
        success: false,
        error: "Something went wrong in the backend. Please try again later.",
        statusCode: 500,
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
          "Initialization failed. Please try again.",
      };
    }

    // Successful initialization
    const data = await response.json();
    console.log("Initialization successful:", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Init user error:", error);
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

    if (response.status === 500) {
      console.log("500 Server error");
      return {
        success: false,
        error: "Something went wrong in the backend. Please try again later.",
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
 * Register handler
 * @param {string} name - User full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} code - Invitation code
 * @returns {Promise<{success: boolean, data?: object, error?: string, statusCode?: number}>}
 */
export async function register(name, email, password, code) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        code: code,
      }),
    });

    console.log("Register response status:", response.status);

    // Handle different error status codes
    if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      console.log("422 Error data:", errorData);
      return {
        success: false,
        error:
          errorData.detail ||
          errorData.message ||
          "Validation failed. Please check your input.",
        statusCode: 422,
      };
    }

    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      console.log("401 Error data:", errorData);
      return {
        success: false,
        error:
          "Invalid invitation code. Please contact an administrator for a valid code.",
        statusCode: 401,
      };
    }

    if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      console.log("409 Error data:", errorData);
      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          "A user with this email address already exists.",
        statusCode: 409,
      };
    }

    if (response.status === 500) {
      console.log("500 Server error");
      return {
        success: false,
        error: "Something went wrong in the backend. Please try again later.",
        statusCode: 500,
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
          "Registration failed. Please try again.",
      };
    }

    // Successful registration
    const data = await response.json();
    console.log("Registration successful:", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Register error:", error);
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
 * Used for all logout events: manual, automated, self-deactivation, idle, rotation
 */
export async function logout() {
  try {
    // Call server logout endpoint to clear HttpOnly cookie
    // Use fetch directly with credentials to ensure it works even if token is invalid
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Include HttpOnly refresh token cookie
    });
  } catch (error) {
    console.error("Logout API call failed:", error);
    // Continue with client-side cleanup even if API call fails
  } finally {
    // Always clear client-side tokens
    clearAuth();
    // Redirect to login
    window.location.href = "/";
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
 * Refresh access token using the refresh token cookie
 * @returns {Promise<boolean>} - True if refresh was successful, false otherwise
 */
export async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Include HttpOnly refresh token cookie
    });

    if (!response.ok) {
      console.error("Token refresh failed:", response.status);
      return false;
    }

    const data = await response.json();

    if (data.access_token) {
      setAccessToken(data.access_token);
      console.log("Access token refreshed successfully");
      return true;
    }

    console.error("No access token in refresh response");
    return false;
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
}

/**
 * Perform an authenticated API request with automatic token refresh
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export async function authenticatedFetch(url, options = {}) {
  const accessToken = getAccessToken();

  // If no access token, try to refresh first
  if (!accessToken) {
    console.log("No access token found, attempting refresh...");
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw new Error("Authentication required. Please login.");
    }
  }

  // Add authorization header
  const token = getAccessToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // First attempt
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // If 401, try to refresh token and retry once
  if (response.status === 401) {
    console.log("Received 401, attempting token refresh...");
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      // Refresh failed, clear auth and throw error
      clearAuth();
      throw new Error("Authentication expired. Please login again.");
    }

    // Retry the request with new token
    const newToken = getAccessToken();
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
      credentials: "include",
    });
  }

  return response;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getAuthConfig() instead for full cookie support
 */
export function getAuthHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
