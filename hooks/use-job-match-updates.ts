import { useState, useEffect, useRef, useCallback } from 'react';

interface UseJobMatchUpdatesOptions {
  enabled?: boolean;
  interval?: number;
  onUpdate?: (count: number) => void;
}

interface UseJobMatchUpdatesReturn {
  newMatchesCount: number;
  sinceTimestamp: number | null;
  updateTimestamp: (timestamp: number) => void;
  isPolling: boolean;
}

const API_BASE_URL = 'https://api.jobjaeger.de/api:bxPM7PqZ';
const DEFAULT_INTERVAL = 3000; // 3 seconds

export function useJobMatchUpdates(
  options: UseJobMatchUpdatesOptions = {}
): UseJobMatchUpdatesReturn {
  const { enabled = true, interval = DEFAULT_INTERVAL, onUpdate } = options;
  
  const [newMatchesCount, setNewMatchesCount] = useState<number>(0);
  const [sinceTimestamp, setSinceTimestamp] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Get auth token from cookies
  const getAuthToken = useCallback((): string | null => {
    if (typeof document === 'undefined') return null;
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return token || null;
  }, []);

  // Fetch job match updates
  const checkForUpdates = useCallback(async () => {
    if (!enabled || !sinceTimestamp) return;
    
    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token found for job match updates');
      return;
    }

    try {
      setIsPolling(true);
      const response = await fetch(
        `${API_BASE_URL}/job_match/updates?since=${sinceTimestamp}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Unauthorized: Auth token may be invalid');
        } else {
          console.error(`Failed to fetch job match updates: ${response.status}`);
        }
        return;
      }

      const count = await response.json();
      const matchCount = typeof count === 'number' ? count : 0;
      
      if (isMountedRef.current) {
        setNewMatchesCount(matchCount);
        if (onUpdate && matchCount > 0) {
          onUpdate(matchCount);
        }
      }
    } catch (error) {
      console.error('Error checking for job match updates:', error);
    } finally {
      if (isMountedRef.current) {
        setIsPolling(false);
      }
    }
  }, [enabled, sinceTimestamp, getAuthToken, onUpdate]);

  // Update timestamp function
  const updateTimestamp = useCallback((timestamp: number) => {
    setSinceTimestamp(timestamp);
    // Reset count when timestamp is updated (after refresh)
    setNewMatchesCount(0);
  }, []);

  // Set up polling interval
  useEffect(() => {
    if (!enabled || !sinceTimestamp) {
      // Clear interval if disabled or no timestamp
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial check
    checkForUpdates();

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        checkForUpdates();
      }
    }, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, sinceTimestamp, interval, checkForUpdates]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    newMatchesCount,
    sinceTimestamp,
    updateTimestamp,
    isPolling,
  };
}




