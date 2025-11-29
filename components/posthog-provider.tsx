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

    // Initialize PostHog with hardcoded API key
    posthog.init('phc_lcTufyPIhuXWqKkeWOttVU0PQSJn8Gs1B9Pprt5qtKk', {
      api_host: 'https://eu.i.posthog.com',
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
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

