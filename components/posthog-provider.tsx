'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import useSWR from 'swr';

declare global {
  interface Window {
    posthog: typeof posthog;
  }
}

interface XanoUser {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
}

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

export function PostHogProvider() {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Fetch user data using SWR (same pattern as other components)
  const { data: user } = useSWR<XanoUser>('/api/user', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  useEffect(() => {
    // Only initialize on client-side
    if (typeof window === 'undefined') return;

    // Check if PostHog is already initialized
    if (window.posthog && window.posthog.__loaded) {
      setIsInitialized(true);
      return;
    }

    // Initialize PostHog with hardcoded API key
    posthog.init('phc_lcTufyPIhuXWqKkeWOttVU0PQSJn8Gs1B9Pprt5qtKk', {
      api_host: 'https://eu.i.posthog.com',
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: 'identified_only',
      loaded: (posthog) => {
        setIsInitialized(true);
        if (process.env.NODE_ENV === 'development') {
          console.log('PostHog loaded');
        }
      },
    });

    // Make posthog available globally
    window.posthog = posthog;
  }, []);

  // Identify user when PostHog is initialized and user data is available
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    if (user && user.id) {
      // Identify user in PostHog
      posthog.identify(user.id.toString(), {
        email: user.email,
        name: user.name,
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('PostHog identified user:', user.id);
      }
    } else {
      // User is not logged in, reset PostHog
      posthog.reset();
      if (process.env.NODE_ENV === 'development') {
        console.log('PostHog: User not authenticated, reset called');
      }
    }
  }, [isInitialized, user]);

  return null; // This component doesn't render anything visible
}

