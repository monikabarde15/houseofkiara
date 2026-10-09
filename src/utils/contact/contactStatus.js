/**
 * House of Kaira: Live Status Calculator for India Standard Time (Asia/Kolkata)
 * Section 5.4 & Section 4.2 of Build Specification v2
 */

import { CONTACT_TOKENS, SUPPORT_HOURS_RULE } from "../../data/contact/contactSettings.js";

/**
 * Returns current date and time in Asia/Kolkata (IST).
 */
export function getNowInIST() {
  const now = new Date();
  // Formats time in Asia/Kolkata to extract day, hour, minute
  const options = {
    timeZone: SUPPORT_HOURS_RULE.timeZone,
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(now);
  const partMap = {};
  parts.forEach((p) => {
    partMap[p.type] = p.value;
  });

  const hour = parseInt(partMap.hour, 10);
  const minute = parseInt(partMap.minute, 10);
  const dayName = partMap.weekday; // e.g. "Monday"

  // Day index: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dayIndexMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  const dayOfWeek = dayIndexMap[dayName] !== undefined ? dayIndexMap[dayName] : now.getDay();

  return {
    hour,
    minute,
    timeInMinutes: hour * 60 + minute,
    dayOfWeek,
    dayName
  };
}

/**
 * Calculates current support status based on SUPPORT_HOURS_RULE.
 * Returns { isOpen, dot: 'green' | 'gold', title: string, line: string }
 */
export function computeSupportStatus() {
  const ist = getNowInIST();

  const [openH, openM] = SUPPORT_HOURS_RULE.opens.split(":").map(Number);
  const [closeH, closeM] = SUPPORT_HOURS_RULE.closes.split(":").map(Number);

  const openTimeMinutes = openH * 60 + openM;     // 10:00 -> 600
  const closeTimeMinutes = closeH * 60 + closeM;   // 20:00 -> 1200

  const isSupportDay = SUPPORT_HOURS_RULE.days.includes(ist.dayOfWeek);

  // 1. A support day, between open time up to close time
  if (isSupportDay && ist.timeInMinutes >= openTimeMinutes && ist.timeInMinutes < closeTimeMinutes) {
    return {
      isOpen: true,
      dot: "green",
      title: "Our team is here now",
      line: `${CONTACT_TOKENS.support_days}, ${CONTACT_TOKENS.support_hours}.`
    };
  }

  // 2. A support day, before opening time (e.g. 8:00 AM on Monday)
  if (isSupportDay && ist.timeInMinutes < openTimeMinutes) {
    return {
      isOpen: false,
      dot: "gold",
      title: "We’re back at 10 AM IST",
      line: "Leave us a message, and we’ll reply as soon as we’re back."
    };
  }

  // 3. After closing time, find next support day
  // Check if tomorrow is a support day
  const tomorrowDayOfWeek = (ist.dayOfWeek + 1) % 7;
  const isTomorrowSupportDay = SUPPORT_HOURS_RULE.days.includes(tomorrowDayOfWeek);

  if (isTomorrowSupportDay) {
    return {
      isOpen: false,
      dot: "gold",
      title: "We’re back tomorrow at 10 AM IST",
      line: "Leave us a message, and we’ll reply as soon as we’re back."
    };
  }

  // 4. Next support day is later in the week
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let nextDayName = "Monday";
  for (let offset = 2; offset <= 7; offset++) {
    const checkDay = (ist.dayOfWeek + offset) % 7;
    if (SUPPORT_HOURS_RULE.days.includes(checkDay)) {
      nextDayName = dayNames[checkDay];
      break;
    }
  }

  return {
    isOpen: false,
    dot: "gold",
    title: `We’re back on ${nextDayName} at 10 AM IST`,
    line: "Leave us a message, and we’ll reply as soon as we’re back."
  };
}
