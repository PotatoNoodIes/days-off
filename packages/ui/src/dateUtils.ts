/**
 * Parses a date string in YYYY-MM-DD format as local time.
 * This prevents the one-day-behind bug caused by UTC conversion.
 */
export const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  // Note: Month in JS Date is 0-indexed
  return new Date(year, month - 1, day);
};

/**
 * Parses a YYYY-MM-DD string as local time and returns a formatted string.
 */
export const formatLocalDate = (dateStr: string): string => {
  return parseLocalDate(dateStr).toLocaleDateString();
};
