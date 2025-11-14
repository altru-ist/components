export type dateinput = string | number | Date;

/**
 * Converts a date input to a Date object.
 * @param {Date | string | number} date - The date input to convert.
 * @returns {Date} The converted Date object.
 */
export function toDate(date: dateinput): Date {
  return typeof date === "string" || typeof date === "number"
    ? new Date(date)
    : date;
}

/**
 * Adds a specified number of days to a given date.
 * Keeps the time component of the date.
 * @param {Date} d - The date to which to add days.
 * @param {number} days - The number of days to add.
 * @returns {Date} A new Date object with the specified number of days added.
 */
export function addDays(d: Date, days: number): Date {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + days,
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
  );
}

/**
 * Adds a specified number of months to a given date.
 * @param {Date} d - The date to which to add days.
 * @param {number} months - The number of months to add.
 * @returns {Date} A new Date object with the specified number of months added.
 */
export function addMonths(d: Date, months: number): Date {
  return new Date(
    d.getFullYear(),
    d.getMonth() + months,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
  );
}

/**
 * Gets the first day of a given month.
 * @param {Date} d - The date for which to get the first day of the month.
 * @returns {Date} A new Date object representing the first day of the month.
 */
export const beginningOfMonth = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth());

/**
 * Formats a date in hour format (HH:mm).
 * @param {Date | string | number} date - The date to format.
 * @returns {string} The formatted date in hour format.
 */
export function formatDateToHour(date: dateinput): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(toDate(date));
}

/**
 * Retrieves the name of the day for a given date.
 * @param {Date | string | number} date - The date for which to retrieve the day name.
 * @returns The name of the day.
 */
export const getDayName = (
  date: dateinput,
  locales: string = "en-US",
  options: Intl.DateTimeFormatOptions = { weekday: "long" },
): string => new Intl.DateTimeFormat(locales, options).format(toDate(date));

/**
 * Returns the day number of a given date.
 * @param date - The input date.
 * @returns The day number as a string.
 */
export const getDayNumber = (date: dateinput): string =>
  new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(toDate(date));

/**
 * Calculates the week number of a given date.
 * @param {Date | string} date - The date to calculate the week number for. It can be either a string or a Date object.
 * @param {number} firstDay - The first day of the week. By default, it is set to 1 (Monday). sunday = 0, monday = 1, ...
 * @returns {number} The week number of the given date.
 */
export function getWeekNumber(date: Date, firstDay = 1): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);

  //Set to first day of the week since it is the same weeknumber
  while (d.getDay() != firstDay) {
    d.setDate(d.getDate() - 1);
  }

  const dayOfYear = getDayOfYear(d);
  let week = Math.floor(dayOfYear / 7);

  // add an extra week if 4 or more days are in this year.
  const daysBefore = (dayOfYear % 7) - 1;
  if (daysBefore >= 4) {
    week += 1;
  }

  //if the last 3 days onf the year,it is the first week
  const t = new Date(d.getTime());
  t.setDate(t.getDate() + 3);
  if (t.getFullYear() > d.getFullYear()) {
    return 1;
  }
  week += 1;

  return week;
}

/**
 * Gets the first day of a given week number in a year.
 * @param {number} weekNumber - The week number.
 * @param {number} year - The year.
 * @param {number} firstDay - The first day of the week. By default, it is set to 1 (Monday). sunday = 0, monday = 1, ...
 * @returns {Date} The first day of the specified week number in the specified year.
 */
export function getFirstDayOfWeek(
  weekNumber: number,
  year: number,
  firstDay = 1,
): Date {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysToAdd = (weekNumber - 1) * 7 + (firstDay - firstDayOfYear.getDay());
  const firstDayOfWeek = new Date(year, 0, 1 + daysToAdd);
  return firstDayOfWeek;
}

/**
 * Gets the first day of a given week.
 */
export const beginningOfWeek = (d: Date, startDow: number = 1): Date =>
  addDays(d, (startDow - d.getDay() - 7) % -7);

/**
 * Gets the last day of a given week.
 */
export const endOfWeek = (d: Date, startDow: number): Date =>
  addDays(beginningOfWeek(d, startDow), 7);

/**
 * Get the date pattern based on the locale
 * @param locale
 * @returns
 */
export function getDatePattern(locale: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat(locale, options).formatToParts();
  return formatter
    .map(function (e) {
      switch (e.type) {
        case "month":
          return "MM";

        case "day":
          return "DD";

        case "year":
          return "YYYY";

        default:
          return e.value;
      }
    })
    .join("");
}

/**
 * Checks if two dates are equal, ignoring the time component.
 * @param {Date | string} date1 - The first date to compare.
 * @param {Date | string} date2 - The second date to compare.
 * @returns {boolean} True if the dates are equal, false otherwise.
 */
export function areDatesEqual(date1: dateinput, date2: dateinput): boolean {
  const startOfDate1 = startOfDay(date1);
  const startOfDate2 = startOfDay(date2);
  return startOfDate1.getTime() === startOfDate2.getTime();
}

/**
 * Day number of the year
 * @param date
 * @returns
 */
export function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
}

/**
 * Calculates the difference in minutes between two dates.
 * @param {Date | string} date1 - The first date.
 * @param {Date | string} date2 - The second date.
 * @returns {number} The difference in minutes between the two dates.
 */
export function differenceInMinutes(
  date1: string | Date,
  date2: string | Date,
): number {
  const differenceInMilliseconds = Math.abs(
    toDate(date2).getTime() - toDate(date1).getTime(),
  );
  return differenceInMilliseconds / (1000 * 60);
}

/**
 * Number of whole days between two dates. If present, time of day is ignored.
 * Treats dates as UTC to avoid DST changes within the perioud leading to incorrect
 * answers (#150).
 * @param {Date} d1 - The first date.
 * @param {Date} d2 - The second date.
 * @returns {number} The number of whole days between the two dates.
 */
export function dayDiff(d1: Date, d2: Date): number {
  const endDate = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()),
    startDate = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  return (endDate - startDate) / 86400000;
}

/**
 * Gets the start of the day for a given date.
 * @param {Date | string} date - The date for which to get the start of the day.
 * @returns {Date} A new Date object representing the start of the day.
 */
export function startOfDay(date: dateinput): Date {
  const startOfDay = new Date(toDate(date));
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

/**
 * Gets the end of the day for a given date.
 * @param {Date | string} date - The date for which to get the end of the day.
 * @returns {Date} A new Date object representing the end of the day.
 */
export function endOfDay(date: dateinput): Date {
  const endOfDay = new Date(toDate(date));
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}

/**
 * Gets the hours from a given date.
 * @param {Date | string} date - The date from which to extract the hours.
 * @returns {number} The hours (0-23) extracted from the date.
 */
export function getHours(date: dateinput): number {
  return toDate(date).getHours();
}

/**
 * Gets the minutes from a given date.
 * @param {Date | string} date - The date from which to extract the minutes.
 * @returns {number} The minutes (0-59) extracted from the date.
 */
export function getMinutes(date: dateinput): number {
  return toDate(date).getMinutes();
}

/**
 * Gets each hour of an interval between two dates.
 * @param {Date | string} startDate - The start date of the interval.
 * @param {Date | string} endDate - The end date of the interval.
 * @returns {Date[]} An array of Date objects representing each hour within the interval.
 */
export function eachHourOfInterval(
  startDate: dateinput,
  endDate: dateinput,
): Date[] {
  const end = toDate(endDate);
  const hours: Date[] = [];
  const current = new Date(toDate(startDate));
  while (current <= end) {
    hours.push(new Date(current));
    current.setHours(current.getHours() + 1);
  }
  return hours;
}

/**
 * Converts a time to pixel value based on the current date and hour pixel width.
 * @param {Date} time - The time to convert.
 * @param {Date} currentDate - The current date.
 * @param {number} hourPixelWidth - The width of an hour in pixels.
 * @returns {number} The pixel value.
 */
export function time2Pixel(
  time: Date,
  currentDate: Date,
  hourPixelWidth: number,
): number {
  if (typeof time !== "string") {
    if (time < startOfDay(currentDate)) {
      return 0;
    } else if (time > endOfDay(currentDate)) {
      return 24 * hourPixelWidth;
    } else {
      return (getHours(time) + getMinutes(time) / 60) * hourPixelWidth;
    }
  } else {
    return 0;
  }
}

/**
 * Compares two dates in ascending order.
 * @param {Date | string} date1 - The first date to compare.
 * @param {Date | string} date2 - The second date to compare.
 * @returns {number} -1 if date1 is earlier than date2, 1 if date1 is later than date2, 0 if they are equal.
 */
export function compareAsc(date1: dateinput, date2: dateinput): number {
  const time1 = toDate(date1).getTime();
  const time2 = toDate(date2).getTime();
  if (time1 < time2) {
    return -1;
  } else if (time1 > time2) {
    return 1;
  } else {
    return 0;
  }
}

/*
 * Parses a date string into a Date object using the provided locale.
 * The function extracts day, month and year according to the locale's date pattern
 *
 * @param input - The date string to be parsed (must match the locale's date format)
 * @returns A Date object if parsing was successful, otherwise null
 *
 * @example
 * for locale "en-US" (MM/DD/YYYY)
 * parseDate('12/31/2024') returns new Date(2024, 11, 31) Note: month is 11 for December (0-based)
 * parseDate("") returns null
 * parseDate(invalid Date) returns null
 *
 * for locale "sv-SE" (DD.MM.YYYY)
 * parseDate('31.12.2024') returns new Date(2024, 11, 31)
 */
export function parseDate(input: string, locale: string): Date | null {
  if (!input || input.trim().length === 0 || input.trim().length < 8)
    return null;

  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const formatter = new Intl.DateTimeFormat(locale, options).formatToParts(
      new Date(),
    );

    let day = 0;
    let month = 0;
    let year = 0;
    let currentIndex = 0;

    formatter.forEach((part) => {
      if (part.type === "literal") {
        currentIndex += part.value.length;
      } else {
        const valueLength = part.value.length;
        const value = input.substr(currentIndex, valueLength);
        currentIndex += valueLength;

        switch (part.type) {
          case "day":
            day = Math.min(parseInt(value, 10), 31);
            break;
          case "month":
            month = Math.min(parseInt(value, 10) - 1, 11); // JavaScript months are 0-based
            break;
          case "year":
            year = parseInt(value, 10);
            break;
        }
      }
    });
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }

    return new Date(year, month, day);
  } catch {
    return null;
  }
}

export default {
  addDays,
  addMonths,
  areDatesEqual,
  beginningOfMonth,
  beginningOfWeek,
  compareAsc,
  dayDiff,
  differenceInMinutes,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  formatDateToHour,
  getDatePattern,
  getDayName,
  getDayNumber,
  getDayOfYear,
  getFirstDayOfWeek,
  getHours,
  getMinutes,
  getWeekNumber,
  parseDate,
  startOfDay,
  time2Pixel,
  toDate,
};
