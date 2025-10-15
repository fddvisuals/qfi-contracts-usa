export const parseCurrency = (value: string | undefined | null): number | null => {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.-]/g, '');
  if (!cleaned) return null;
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

export const formatCurrency = (value: number | null, options: Intl.NumberFormatOptions = {}): string => {
  if (value === null || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...options
  }).format(value);
};

export const formatNumber = (value: number | null): string => {
  if (value === null || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('en-US').format(value);
};

export const safeString = (value: string | undefined | null): string => {
  if (!value) return '';
  return value.trim();
};

const dateTokenRegex = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/g;

const coerceYear = (rawYear: string): number | null => {
  const numeric = Number.parseInt(rawYear, 10);
  if (Number.isNaN(numeric)) return null;
  if (rawYear.length === 2) {
    return numeric >= 70 ? 1900 + numeric : 2000 + numeric;
  }
  if (rawYear.length === 3) {
    return null;
  }
  return numeric;
};

const tryCreateDate = (month: number, day: number, year: number): Date | null => {
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const formatDateToken = (match: string, monthStr: string, dayStr: string, yearStr: string): string => {
  const month = Number.parseInt(monthStr, 10);
  const day = Number.parseInt(dayStr, 10);
  const year = coerceYear(yearStr);
  if (Number.isNaN(month) || Number.isNaN(day) || !year) {
    return match;
  }
  const date = tryCreateDate(month, day, year);
  if (!date) return match;
  return dateFormatter.format(date);
};

export const formatDate = (value: string | undefined | null): string => {
  if (!value) return '—';
  const trimmed = value.trim();
  if (!trimmed) return '—';
  const formatted = trimmed.replace(dateTokenRegex, formatDateToken);
  return formatted || '—';
};

export const extractYear = (value: string | undefined | null): number | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const fourDigitMatch = trimmed.match(/(20|19)\d{2}/);
  if (fourDigitMatch) {
    const year = Number.parseInt(fourDigitMatch[0], 10);
    if (!Number.isNaN(year)) {
      return year;
    }
  }

  const shortDateMatch = trimmed.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (shortDateMatch) {
    const [, monthStr, dayStr, yearStr] = shortDateMatch;
    const month = Number.parseInt(monthStr, 10);
    const day = Number.parseInt(dayStr, 10);
    const year = coerceYear(yearStr);
    if (Number.isNaN(month) || Number.isNaN(day) || !year) {
      return null;
    }
    const date = tryCreateDate(month, day, year);
    if (date) {
      return date.getFullYear();
    }
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.getFullYear();
  }

  return null;
};
