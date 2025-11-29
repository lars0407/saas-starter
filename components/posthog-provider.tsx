'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

declare global {
  interface Window {
    posthog: typeof posthog;
  }
}

export function PostHogProvider() {
  useEffect(() => {
    // Only initialize on client-side
    if (typeof window === 'undefined') return;

    // Check if PostHog is already initialized
    if (window.posthog && window.posthog.__loaded) return;

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    
    if (!posthogKey) {
      console.warn('PostHog key is not set. Please add NEXT_PUBLIC_POSTHOG_KEY to your environment variables.');
      return;
    }

    // Initialize PostHog
    posthog.init(posthogKey, {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('PostHog loaded');
        }
      },
    });

    // Make posthog available globally
    window.posthog = posthog;
  }, []);

  return null; // This component doesn't render anything visible
}

