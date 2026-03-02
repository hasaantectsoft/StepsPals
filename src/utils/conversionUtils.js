const conversionUtils = {
  // Convert a string to a number, returns NaN if the conversion fails
  stringToNumber: str => {
    return parseFloat(str);
  },

  // Convert a number to a string
  numberToString: num => {
    return num.toString();
  },

  // Convert a string representing a JSON object to a JavaScript object
  stringToJsonObject: str => {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  },

  // Convert a JavaScript object to a JSON-formatted string
  jsonObjectToString: obj => {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.error('Error stringifying JSON:', error);
      return null;
    }
  },

  // Convert a boolean value to its string representation
  booleanToString: bool => {
    return bool.toString();
  },

  // Convert a string representation of a boolean to a boolean value
  stringToBoolean: str => {
    return str.toLowerCase() === 'true';
  },
};

export default conversionUtils;
