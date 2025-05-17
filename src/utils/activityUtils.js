import { parse, differenceInMinutes, isSameDay } from 'date-fns';

/**
 * Parse activity time string into a Date object
 * @param {string} timeStr - Time string in format "HH:MM"
 * @param {Date} date - The date to use
 * @returns {Date} - Date object with the time set
 */
export const parseActivityTime = (timeStr, date) => {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const activityDate = new Date(date);
    activityDate.setHours(hours, minutes, 0, 0);
    return activityDate;
  } catch (error) {
    console.error('Error parsing activity time:', error);
    return new Date();
  }
};

/**
 * Check if an activity is coming up soon
 * @param {Object} activity - Activity object
 * @param {Date} dayDate - The date of the activity
 * @param {number} minutesThreshold - Minutes threshold to consider "coming up soon"
 * @returns {boolean} - True if activity is coming up within the threshold
 */
export const isActivityComingSoon = (activity, dayDate, minutesThreshold = 10) => {
  if (!activity.time) return false;
  
  // Only check activities for today
  const today = new Date();
  if (!isSameDay(dayDate, today)) return false;
  
  const activityTime = parseActivityTime(activity.time, dayDate);
  const now = new Date();
  
  // Calculate minutes until activity
  const minutesUntil = differenceInMinutes(activityTime, now);
  
  // Activity is coming up soon if it's between 0 and threshold minutes away
  return minutesUntil >= 0 && minutesUntil <= minutesThreshold;
};

/**
 * Format time for display
 * @param {string} timeStr - Time string in format "HH:MM"
 * @returns {string} - Formatted time string
 */
export const formatTime = (timeStr) => {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return timeStr;
  }
};

/**
 * Get location display with timezone
 * @param {Object} activity - Activity object
 * @returns {Object} - Location info with display text and icon type
 */
export const getLocationWithTimezone = (activity) => {
  const location = activity.location || '';
  const timezone = activity.timezone || 'local';
  
  let timezoneLabel = '';
  let timezoneIcon = 'clock';
  
  switch (timezone) {
    case 'destination':
      timezoneLabel = '(Destination time)';
      timezoneIcon = 'globe';
      break;
    case 'home':
      timezoneLabel = '(Home time)';
      timezoneIcon = 'home';
      break;
    default:
      timezoneLabel = '(Local time)';
      timezoneIcon = 'clock';
  }
  
  return {
    displayText: location ? `${location} ${timezoneLabel}` : timezoneLabel,
    timezoneIcon
  };
}; 