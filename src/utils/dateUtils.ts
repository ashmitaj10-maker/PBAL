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
