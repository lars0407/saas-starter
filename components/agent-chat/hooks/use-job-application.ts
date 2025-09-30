import { useState, useCallback } from 'react';
import { JobDetails, Document, ApplicationDetails } from '../types';

export function useJobApplication() {
  const [isProcessingLongText, setIsProcessingLongText] = useState(false);

  const handleStartApplication = useCallback(async (
    jobDetails: JobDetails,
    selectedResume: Document | null,
    autoMode: boolean,
    onSuccess: (applicationId: string) => void,
    onError: (error: Error) => void,
    onStreamingEvent?: (data: any) => void
  ) => {
    try {
      // Get auth token
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const authToken = getCookie('token');
      
      if (!authToken) {
        throw new Error('Kein Authentifizierungstoken gefunden. Bitte melden Sie sich erneut an.');
      }

      // Remove existing application id from URL when starting a NEW application
      try {
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.has('id')) {
          currentUrl.searchParams.delete('id');
          window.history.replaceState({}, '', currentUrl.pathname + (currentUrl.search ? `?${currentUrl.searchParams.toString()}` : ''));
        }
      } catch (_) {
        // ignore URL errors
      }

      const requestBody: any = {
        job_title: jobDetails.title,
        job_description: jobDetails.description,
        job_url: jobDetails.url,
        document_id: selectedResume?.id || null,
        mode: autoMode ? 'auto' : 'manual'
      };

      // Add job_id if it's from a recommendation (has jobId property)
      if (jobDetails.jobId) {
        requestBody.job_id = jobDetails.jobId;
      }

      // Don't add job_id for recommendations - only for existing job applications
      console.log('Sending request body:', requestBody);

      console.log('🚀 Making API request to start application');
      const response = await fetch('https://api.jobjaeger.de/api:BP7K6-ZQ/v2/agent/application/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) break;
              
              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');
              
              for (const line of lines) {
                if (line.trim() === '') continue;
                
                try {
                  // Handle different streaming formats
                  let data;
                  if (line.startsWith('data: ')) {
                    // Server-Sent Events format
                    data = JSON.parse(line.slice(6));
                  } else {
                    // Direct JSON format
                    data = JSON.parse(line);
                  }
                  
                  // Process streaming data
                  console.log('Processing streaming data:', data);
                  
                  // Handle complete application object (first message)
                  if (data && data.id && data.job && data.events && !data.type) {
                    try {
                      const jobTrackerFallback = {
                        id: data.job_tracker_id || 0,
                        created_at: data.created_at || Date.now(),
                        user_id: data.user_id || 0,
                        job_id: data.job_id || 0,
                        status: data.status || 'created',
                        joboffer_received: false,
                        application_date: null,
                        notes: '',
                        interview_question: [] as any[],
                      };
                      
                      // Update application details with latest data
                      const applicationDetails: ApplicationDetails = {
                        application: data,
                        documents: {
                          document_list: [],
                          job_tracker: jobTrackerFallback,
                        },
                      } as any;
                      
                      console.log('Clearing existing events, will process streaming events only');
                      
                      // Call success callback with application ID
                      onSuccess(data.id.toString());
                    } catch (e) {
                      console.warn('Failed to process initial application:', e);
                    }
                  }
                  // Handle streaming events (event, status, result)
                  else if (data.type === 'event') {
                    console.log('Processing streaming event:', data);
                    if (onStreamingEvent) {
                      onStreamingEvent(data);
                    }
                  }
                  else if (data.type === 'status') {
                    console.log('Processing status update:', data.status);
                    if (onStreamingEvent) {
                      onStreamingEvent(data);
                    }
                  }
                  else if (data.type === 'result') {
                    console.log('Processing result data:', data.data);
                    if (onStreamingEvent) {
                      onStreamingEvent(data);
                    }
                  }
                  else if (data.type === 'finish') {
                    console.log('Processing finish message:', data);
                    if (onStreamingEvent) {
                      onStreamingEvent(data);
                    }
                  }
                } catch (parseError) {
                  console.warn('Failed to parse streaming data:', line, parseError);
                }
              }
            }
          } catch (streamError) {
            console.error('Streaming error:', streamError);
          } finally {
            reader.releaseLock();
          }
        }
      } else {
        console.warn('API returned error, falling back to simulation');
      }
    } catch (error) {
      console.error('Error starting application:', error);
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }, []);

  return {
    isProcessingLongText,
    setIsProcessingLongText,
    handleStartApplication,
  };
}
