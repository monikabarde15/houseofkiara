// src/utils/rentalDateCalculator.js
// Date math engine for the Rental Dates Strip strictly following Section 10.7

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

/**
 * Checks if a given Date falls in peak wedding season:
 * November, December, January, February, April, May, June (admin figure peak_months)
 * Month indices: Nov(10), Dec(11), Jan(0), Feb(1), Apr(3), May(4), Jun(5)
 */
export function isPeakSeason(date) {
  const m = date.getMonth();
  return [0, 1, 3, 4, 5, 10, 11].includes(m);
}

/**
 * Adds N business days to a date, skipping Saturdays and Sundays (Section 10.7)
 */
export function addBusinessDays(startDate, days) {
  const cur = new Date(startDate);
  let added = 0;
  while (added < days) {
    cur.setDate(cur.getDate() + 1);
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }
  return cur;
}

/**
 * Formats date into { dayMonth: "15 Oct", weekday: "Thursday", iso: "YYYY-MM-DD" }
 */
export function formatDateDisplay(date) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const weekday = WEEKDAY_NAMES[date.getDay()];
  return {
    dayMonth: `${day} ${month}`,
    weekday,
    iso: date.toISOString().split("T")[0],
  };
}

/**
 * Computes all 5 timeline steps and contextual notes given an event date and window length (4 or 7)
 */
export function calculateRentalTimeline(eventDateStr, windowDays = 4) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let eventDate = new Date(eventDateStr);
  if (isNaN(eventDate.getTime())) {
    eventDate = new Date();
    eventDate.setDate(today.getDate() + 30);
  }
  eventDate.setHours(0, 0, 0, 0);

  const peak = isPeakSeason(eventDate);

  // 1. Book by: event date minus 28 days in peak season, otherwise minus 10 days
  const leadDays = peak ? 28 : 10;
  const bookByDate = new Date(eventDate);
  bookByDate.setDate(eventDate.getDate() - leadDays);

  const isUrgent = bookByDate <= today;

  // 2. Arrives: event date minus arrive_before (2 days)
  const arrivesDate = new Date(eventDate);
  arrivesDate.setDate(eventDate.getDate() - 2);

  const isArrivesClose = arrivesDate <= today;

  // 3. Event: eventDate

  // 4. Collected: Arrives date plus (window length - 1) days
  const collectedDate = new Date(arrivesDate);
  collectedDate.setDate(arrivesDate.getDate() + (windowDays - 1));

  // 5. Deposit back by: Collected date + 1 day, then + 5 business days
  const depositStartDate = new Date(collectedDate);
  depositStartDate.setDate(collectedDate.getDate() + 1);
  const depositBackDate = addBusinessDays(depositStartDate, 5);

  // Note determination (Section 10.7 order: Arrives close -> Urgent -> Peak season -> empty)
  let noteMessage = "";
  if (isArrivesClose) {
    noteMessage = "This date is very close. Message us and we’ll check what can still reach you in time.";
  } else if (isUrgent) {
    noteMessage = "Your event is close, so it’s best to book today.";
  } else if (peak) {
    noteMessage = "Peak wedding season: the most loved pieces go early, so we suggest booking 3 to 4 weeks ahead.";
  }

  return {
    isPeak: peak,
    isUrgent,
    isArrivesClose,
    noteMessage,
    steps: [
      {
        num: 1,
        label: "Book by",
        date: isUrgent ? formatDateDisplay(today) : formatDateDisplay(bookByDate),
        isUrgent,
        showToday: isUrgent,
      },
      {
        num: 2,
        label: "Arrives",
        date: formatDateDisplay(arrivesDate),
      },
      {
        num: 3,
        label: "Your event",
        date: formatDateDisplay(eventDate),
        isEvent: true,
      },
      {
        num: 4,
        label: "Collected",
        date: formatDateDisplay(collectedDate),
      },
      {
        num: 5,
        label: "Deposit back by",
        date: formatDateDisplay(depositBackDate),
      },
    ],
  };
}
