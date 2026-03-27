const dateUtils = {
  // Get the current date in the format YYYY-MM-DD
  getCurrentDate: () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Format a date object to a custom date string
  formatDate: (dateObject, format = 'YYYY-MM-DD') => {
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    format = format.replace('YYYY', year);
    format = format.replace('MM', month);
    format = format.replace('DD', day);

    return format;
  },

  // Add days to a given date
  addDays: (dateObject, days) => {
    const newDate = new Date(dateObject);
    newDate.setDate(dateObject.getDate() + days);
    return newDate;
  },

  // Calculate the difference in days between two dates
  dateDifferenceInDays: (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    return diffDays;
  },

  // Check if a date is in the past
  isPastDate: dateObject => {
    const currentDate = new Date();
    return dateObject < currentDate;
  },

  // Check if a date is in the future
  isFutureDate: dateObject => {
    const currentDate = new Date();
    return dateObject > currentDate;
  },
  formatTimestampToTime: timestamp => {
    const date = new Date(timestamp);
    const options = {hour: '2-digit', minute: '2-digit', hour12: false};

    return new Intl.DateTimeFormat('en-US', options).format(date);
  },
};

export default dateUtils;
