const stringUtils = {
  // Capitalize the first letter of a string
  capitalizeFirstLetter: str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Convert a string to lowercase
  toLowerCase: str => {
    return str.toLowerCase();
  },

  // Convert a string to uppercase
  toUpperCase: str => {
    return str.toUpperCase();
  },

  // Truncate a string and add ellipsis if it exceeds a specified length
  truncateWithEllipsis: (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  },

  // Check if a string is empty or contains only whitespace
  isEmptyOrWhitespace: str => {
    return str.trim() === '';
  },

  // Remove leading and trailing whitespace from a string
  trimWhitespace: str => {
    return str.trim();
  },

  // Check if a string contains another substring
  containsSubstring: (str, substring) => {
    return str.includes(substring);
  },

  // Replace all occurrences of a substring in a string
  replaceAllOccurrences: (str, search, replacement) => {
    return str.split(search).join(replacement);
  },
  findStringAfterSubString: (str, substring) => {
    return str.split(substring)[1];
  },
};

export default stringUtils;
