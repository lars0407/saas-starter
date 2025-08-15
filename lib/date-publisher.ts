/**
 * Date Publisher Utility
 * 
 * This utility provides functionality to store and retrieve dates in predefined intervals:
 * - 1 day (24 hours)
 * - 3 days (72 hours) 
 * - 7 days (1 week)
 * - 30 days (1 month)
 */

export interface PublishedDate {
  id: string;
  date: Date;
  interval: '1d' | '3d' | '7d' | '30d';
  intervalValue: number; // Numerischer Wert für Datenbank: 1, 3, 7, 30
  expiresAt: Date;
  metadata?: Record<string, any>;
}

export interface DatePublishingOptions {
  metadata?: Record<string, any>;
  customExpiry?: Date;
}

/**
 * Calculate expiry date based on interval
 */
function calculateExpiryDate(interval: '1d' | '3d' | '7d' | '30d'): Date {
  const now = new Date();
  const expiryDate = new Date(now);
  
  switch (interval) {
    case '1d':
      expiryDate.setDate(expiryDate.getDate() + 1);
      break;
    case '3d':
      expiryDate.setDate(expiryDate.getDate() + 3);
      break;
    case '7d':
      expiryDate.setDate(expiryDate.getDate() + 7);
      break;
    case '30d':
      expiryDate.setDate(expiryDate.getDate() + 30);
      break;
  }
  
  return expiryDate;
}

/**
 * Get interval label in German
 */
export function getIntervalLabel(interval: '1d' | '3d' | '7d' | '30d'): string {
  switch (interval) {
    case '1d':
      return '24 Stunden';
    case '3d':
      return '3 Tage';
    case '7d':
      return '1 Woche';
    case '30d':
      return '1 Monat';
    default:
      return interval;
  }
}

/**
 * Get interval description in German
 */
export function getIntervalDescription(interval: '1d' | '3d' | '7d' | '30d'): string {
  switch (interval) {
    case '1d':
      return 'Veröffentlicht für 24 Stunden';
    case '3d':
      return 'Veröffentlicht für 3 Tage';
    case '7d':
      return 'Veröffentlicht für 1 Woche';
    case '30d':
      return 'Veröffentlicht für 1 Monat';
    default:
      return '';
  }
}

/**
 * Get numeric value for interval (for database storage)
 */
export function getIntervalValue(interval: '1d' | '3d' | '7d' | '30d'): number {
  switch (interval) {
    case '1d':
      return 1;
    case '3d':
      return 3;
    case '7d':
      return 7;
    case '30d':
      return 30;
    default:
      return 1;
  }
}

/**
 * Publish a date with the specified interval
 */
export function publishDate(
  interval: '1d' | '3d' | '7d' | '30d',
  options: DatePublishingOptions = {}
): PublishedDate {
  const now = new Date();
  const expiresAt = options.customExpiry || calculateExpiryDate(interval);
  
  const publishedDate: PublishedDate = {
    id: generateId(),
    date: now,
    interval,
    intervalValue: getIntervalValue(interval),
    expiresAt,
    metadata: options.metadata || {}
  };
  
  // Store in localStorage for persistence
  storePublishedDate(publishedDate);
  
  return publishedDate;
}

/**
 * Get all published dates for a specific interval
 */
export function getPublishedDates(interval?: '1d' | '3d' | '7d' | '30d'): PublishedDate[] {
  const allDates = getAllPublishedDates();
  
  if (interval) {
    return allDates.filter(date => date.interval === interval);
  }
  
  return allDates;
}

/**
 * Get active (non-expired) published dates
 */
export function getActivePublishedDates(interval?: '1d' | '3d' | '7d' | '30d'): PublishedDate[] {
  const now = new Date();
  const allDates = getAllPublishedDates();
  
  let filteredDates = allDates.filter(date => date.expiresAt > now);
  
  if (interval) {
    filteredDates = filteredDates.filter(date => date.interval === interval);
  }
  
  return filteredDates;
}

/**
 * Check if a date is still active (not expired)
 */
export function isDateActive(publishedDate: PublishedDate): boolean {
  const now = new Date();
  return publishedDate.expiresAt > now;
}

/**
 * Get time remaining until expiry
 */
export function getTimeRemaining(publishedDate: PublishedDate): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const timeDiff = publishedDate.expiresAt.getTime() - now.getTime();
  
  if (timeDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(publishedDate: PublishedDate): string {
  const remaining = getTimeRemaining(publishedDate);
  
  if (remaining.days > 0) {
    return `${remaining.days} Tag${remaining.days > 1 ? 'e' : ''} verbleibend`;
  } else if (remaining.hours > 0) {
    return `${remaining.hours} Stunde${remaining.hours > 1 ? 'n' : ''} verbleibend`;
  } else if (remaining.minutes > 0) {
    return `${remaining.minutes} Minute${remaining.minutes > 1 ? 'n' : ''} verbleibend`;
  } else {
    return `${remaining.seconds} Sekunde${remaining.seconds > 1 ? 'n' : ''} verbleibend`;
  }
}

/**
 * Clean up expired dates
 */
export function cleanupExpiredDates(): void {
  const allDates = getAllPublishedDates();
  const now = new Date();
  const activeDates = allDates.filter(date => date.expiresAt > now);
  
  localStorage.setItem('publishedDates', JSON.stringify(activeDates));
}

// Private helper functions

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function storePublishedDate(publishedDate: PublishedDate): void {
  const allDates = getAllPublishedDates();
  allDates.push(publishedDate);
  localStorage.setItem('publishedDates', JSON.stringify(allDates));
}

function getAllPublishedDates(): PublishedDate[] {
  try {
    const stored = localStorage.getItem('publishedDates');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(date => ({
      ...date,
      date: new Date(date.date),
      expiresAt: new Date(date.expiresAt)
    })) : [];
  } catch (error) {
    console.error('Error parsing published dates:', error);
    return [];
  }
}

// Auto-cleanup expired dates when module is loaded
if (typeof window !== 'undefined') {
  cleanupExpiredDates();
}
