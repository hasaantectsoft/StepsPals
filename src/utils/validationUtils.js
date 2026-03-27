// validationUtils.js
const validationUtils = {
  // Check if a given string is a valid email address
  isValidEmail: email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Check if a password is valid (at least 8 characters and contains at least 1 digit)
  isPasswordValid: password => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

    return passwordRegex.test(password);
  },

  // Check if a string is a valid URL
  isValidUrl: url => {
    try {
      URL(url);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Check if a string is a valid phone number
  isValidPhoneNumber: phoneNumber => {
    const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number
    return phoneRegex.test(phoneNumber);
  },

  // Check if a string is a valid date in the format YYYY-MM-DD
  isValidDate: date => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
  },

  // Check if a string contains only alphanumeric characters
  isAlphanumeric: str => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(str);
  },

  // Check if a string is not empty or contains only whitespace
  isNonEmptyString: str => {
    return str.trim() !== '';
  },

  // Check if a value is a number
  isNumber: value => {
    return typeof value === 'number' && !isNaN(value);
  },

  // Check if a value is a positive integer
  isPositiveInteger: value => {
    return Number.isInteger(value) && value > 0;
  },
};

export default validationUtils;
