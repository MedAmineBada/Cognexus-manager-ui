/**
 * Validate that name contains only alphabetic characters
 * @param {string} name - The name to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return { valid: false, error: "Full name is required." };
  }

  // Check if name contains only alphabetic characters and spaces
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      valid: false,
      error:
        "Name must contain only alphabetic characters (no numbers or symbols).",
    };
  }

  return { valid: true };
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, error: "Email is required." };
  }

  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  return { valid: true };
}

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: "Password is required." };
  }

  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must be at least 8 characters long.",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter.",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one lowercase letter.",
    };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one number.",
    };
  }

  // Check for at least one symbol
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one symbol (e.g., !@#$%^&*).",
    };
  }

  return { valid: true };
}

/**
 * Validate invitation code (6 alphanumeric characters)
 * @param {string} code - The invitation code to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateInvitationCode(code) {
  if (!code || !code.trim()) {
    return { valid: false, error: "Invitation code is required." };
  }

  // Check if code is exactly 6 alphanumeric characters
  const codeRegex = /^[A-Za-z0-9]{6}$/;
  if (!codeRegex.test(code.trim())) {
    return {
      valid: false,
      error: "Invitation code must be exactly 6 alphanumeric characters.",
    };
  }

  return { valid: true };
}

/**
 * Validate all registration fields
 * @param {object} formData - Object containing name, email, password, code
 * @returns {{valid: boolean, errors: object}}
 */
export function validateRegistrationForm(formData) {
  const { name, email, password, code } = formData;

  const nameValidation = validateName(name);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const codeValidation = validateInvitationCode(code);

  const errors = {};

  if (!nameValidation.valid) {
    errors.name = nameValidation.error;
  }

  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }

  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error;
  }

  if (!codeValidation.valid) {
    errors.code = codeValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
