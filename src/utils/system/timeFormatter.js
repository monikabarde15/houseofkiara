/**
 * House of Kaira: Maintenance Time Formatter
 * Section 8.6 of System Pages Specification v1.0
 */

/**
 * Formats a timestamp/date into IST formatted time string:
 * "Expected back by {time} IST {day}"
 * e.g., "Expected back by 6:00 PM IST today"
 */
export const formatMaintenanceTime = (dateInput) => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  // Convert to IST (UTC + 5:30)
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const istDate = new Date(utcMs + istOffsetMs);

  // Current time in IST
  const now = new Date();
  const nowUtcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const nowIst = new Date(nowUtcMs + istOffsetMs);

  // Time format: 12-hour with minutes and AM/PM
  let hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const timeStr = `${hours}:${minuteStr} ${ampm}`;

  // Day determination in IST
  const istYear = istDate.getFullYear();
  const istMonth = istDate.getMonth();
  const istDay = istDate.getDate();

  const nowYear = nowIst.getFullYear();
  const nowMonth = nowIst.getMonth();
  const nowDay = nowIst.getDate();

  const isSameDay = istYear === nowYear && istMonth === nowMonth && istDay === nowDay;

  // Check tomorrow
  const tomorrowIst = new Date(nowIst);
  tomorrowIst.setDate(tomorrowIst.getDate() + 1);
  const isTomorrow =
    istYear === tomorrowIst.getFullYear() &&
    istMonth === tomorrowIst.getMonth() &&
    istDay === tomorrowIst.getDate();

  let dayStr = "";
  if (isSameDay) {
    dayStr = "today";
  } else if (isTomorrow) {
    dayStr = "tomorrow";
  } else {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    dayStr = `on ${weekdays[istDate.getDay()]}, ${istDay} ${months[istMonth]}`;
  }

  return `Expected back by ${timeStr} IST ${dayStr}`;
};
