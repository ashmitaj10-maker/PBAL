/**
 * Global Date Formatting Utilities for Perfect Body & Life (PBAL)
 * Standard Application-Wide Date Format: DD-MM-YYYY (e.g. 27-08-2026)
 */

/**
 * Formats any date input (ISO string, Date object, timestamp) into standardized DD-MM-YYYY format.
 * Returns '—' for empty or invalid dates.
 *
 * Examples:
 * formatDate('2026-08-27') => '27-08-2026'
 * formatDate('2026-08-27T10:30:00Z') => '27-08-2026'
 * formatDate(new Date(2026, 7, 5)) => '05-08-2026'
 */
export function formatDate(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '—';

  // If already in DD-MM-YYYY format, return directly
  if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateInput.trim())) {
    return dateInput.trim();
  }

  // If in YYYY-MM-DD format, quick string split to avoid timezone skew
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
    const [year, month, day] = dateInput.trim().split('-');
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '—';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch {
    return '—';
  }
}

/**
 * Formats a date with time into standardized DD-MM-YYYY, hh:mm A
 * Example: '27-08-2026, 05:30 PM'
 */
export function formatDateTime(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '—';

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '—';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const strHours = String(hours).padStart(2, '0');

    return `${day}-${month}-${year}, ${strHours}:${minutes} ${ampm}`;
  } catch {
    return '—';
  }
}

/**
 * Returns today's date formatted as DD-MM-YYYY
 */
export function getTodayFormatted(): string {
  return formatDate(new Date());
}

/**
 * Returns today's date formatted as YYYY-MM-DD (useful for HTML5 date inputs)
 */
export function getTodayIso(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Converts a DD-MM-YYYY string to YYYY-MM-DD for HTML input[type="date"]
 */
export function displayToIso(displayDate: string): string {
  if (!displayDate) return '';
  const match = displayDate.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  return displayDate;
}

/**
 * Converts a YYYY-MM-DD string to DD-MM-YYYY
 */
export function isoToDisplay(isoDate: string): string {
  return formatDate(isoDate);
}

/**
 * Adds a number of days to a given date string or Date object.
 */
export function addDays(dateInput: string | Date, days: number): Date {
  let baseDate: Date;
  if (typeof dateInput === 'string') {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateInput.trim())) {
      const [d, m, y] = dateInput.trim().split('-');
      baseDate = new Date(Number(y), Number(m) - 1, Number(d));
    } else {
      baseDate = new Date(dateInput);
    }
  } else {
    baseDate = new Date(dateInput.getTime());
  }

  const result = new Date(baseDate.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculates plan end date given start date and duration in days.
 * For example: Start = Thursday, duration = 7 days -> End = Wednesday (Start + 6 days).
 * Returns date in YYYY-MM-DD format.
 */
export function calculatePlanEndDateIso(startDateInput: string | Date, durationDays: number = 7): string {
  const endDate = addDays(startDateInput, Math.max(0, durationDays - 1));
  const day = String(endDate.getDate()).padStart(2, '0');
  const month = String(endDate.getMonth() + 1).padStart(2, '0');
  const year = endDate.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Calculates plan end date in DD-MM-YYYY format.
 */
export function calculatePlanEndDateDisplay(startDateInput: string | Date, durationDays: number = 7): string {
  return formatDate(calculatePlanEndDateIso(startDateInput, durationDays));
}

/**
 * Returns difference in calendar days between two dates (toDate - fromDate).
 * Returns 1 if toDate is tomorrow, 0 if today, negative if in the past.
 */
export function getDaysDifference(fromDateInput: string | Date, toDateInput: string | Date): number {
  const parseToMidnight = (input: string | Date): number => {
    let d: Date;
    if (typeof input === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(input.trim())) {
      const [day, month, year] = input.trim().split('-');
      d = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      d = new Date(input);
    }
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  };

  const ms1 = parseToMidnight(fromDateInput);
  const ms2 = parseToMidnight(toDateInput);
  return Math.round((ms2 - ms1) / (1000 * 60 * 60 * 24));
}

/**
 * Returns true if the target date is tomorrow relative to today.
 */
export function isTomorrow(targetDateInput: string | Date): boolean {
  return getDaysDifference(new Date(), targetDateInput) === 1;
}

/**
 * Returns true if the target date is today.
 */
export function isToday(targetDateInput: string | Date): boolean {
  return getDaysDifference(new Date(), targetDateInput) === 0;
}

/**
 * Formats a date with day of the week and DD-MM-YYYY format.
 * Example: 'Thursday, 28-08-2026'
 */
export function formatDayOfWeekAndDate(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '—';
  
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dateObj: Date;

  if (typeof dateInput === 'string') {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateInput.trim())) {
      const [d, m, y] = dateInput.trim().split('-');
      dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    } else {
      dateObj = new Date(dateInput);
    }
  } else {
    dateObj = new Date(dateInput);
  }

  if (isNaN(dateObj.getTime())) return '—';

  const dayName = DAYS[dateObj.getDay()];
  const formattedDate = formatDate(dateObj);
  return `${dayName}, ${formattedDate}`;
}

/**
 * Returns date formatted as YYYY-MM-DD
 */
export function formatDateIso(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' 
    ? (/^\d{2}-\d{2}-\d{4}$/.test(dateInput.trim()) 
        ? (() => { const [day, month, year] = dateInput.trim().split('-'); return new Date(Number(year), Number(month) - 1, Number(day)); })() 
        : new Date(dateInput))
    : dateInput;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}


