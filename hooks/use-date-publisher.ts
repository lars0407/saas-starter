import { useState, useEffect, useCallback } from 'react';
import {
  publishDate,
  getActivePublishedDates,
  getPublishedDates,
  cleanupExpiredDates,
  type PublishedDate,
  type DatePublishingOptions
} from '@/lib/date-publisher';

export function useDatePublisher(metadata?: Record<string, any>) {
  const [publishedDates, setPublishedDates] = useState<PublishedDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial published dates
  useEffect(() => {
    const dates = getActivePublishedDates();
    setPublishedDates(dates);
  }, []);

  // Refresh published dates
  const refreshDates = useCallback(() => {
    const dates = getActivePublishedDates();
    setPublishedDates(dates);
  }, []);

  // Publish a new date
  const publishNewDate = useCallback(async (
    interval: '1d' | '3d' | '7d' | '30d',
    options: DatePublishingOptions = {}
  ) => {
    try {
      setIsLoading(true);
      
      const publishedDate = publishDate(interval, {
        ...options,
        metadata: {
          ...metadata,
          ...options.metadata,
          timestamp: new Date().toISOString()
        }
      });
      
      // Refresh dates to include the new one
      refreshDates();
      
      return publishedDate;
    } catch (error) {
      console.error('Error publishing date:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [metadata, refreshDates]);

  // Get dates by interval
  const getDatesByInterval = useCallback((interval: '1d' | '3d' | '7d' | '30d') => {
    return publishedDates.filter(date => date.interval === interval);
  }, [publishedDates]);

  // Get all dates for a specific interval
  const getAllDatesByInterval = useCallback((interval: '1d' | '3d' | '7d' | '30d') => {
    return getPublishedDates(interval);
  }, []);

  // Cleanup expired dates
  const cleanupDates = useCallback(() => {
    cleanupExpiredDates();
    refreshDates();
  }, [refreshDates]);

  // Set up auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(refreshDates, 60000);
    return () => clearInterval(interval);
  }, [refreshDates]);

  return {
    publishedDates,
    isLoading,
    publishNewDate,
    refreshDates,
    getDatesByInterval,
    getAllDatesByInterval,
    cleanupDates
  };
}
