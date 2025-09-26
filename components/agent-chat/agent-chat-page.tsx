'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DashboardBreadcrumb, breadcrumbConfigs } from "@/components/dashboard-breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Import our new components
import { JobApplicationForm } from '@/components/agent-chat/job-application-form';
import { EventTimeline } from '@/components/agent-chat/components/event-timeline';
import { ResumePickerModal } from '@/components/agent-chat/components/resume-picker-modal';

// Import our hooks
import { useAgentChat } from '@/components/agent-chat/hooks/use-agent-chat';
import { useResumePicker } from '@/components/agent-chat/hooks/use-resume-picker';
import { useJobApplication } from '@/components/agent-chat/hooks/use-job-application';

// Import types
import { AgentEvent, ApplicationDetails } from '@/components/agent-chat/types';

// Import utility functions
import { generateStepDetails, getEventDescriptionFromType, parseApplicationData } from '@/components/agent-chat/utils';

function AgentChatContent() {
  // Use our custom hooks
  const {
    events,
    isRunning,
    showForm,
    isLoading,
    loadingEvent,
    loadingTasks,
    applicationDetails,
    isLoadingApplication,
    jobDetails,
    autoMode,
    selectedResume,
    expandedEvents,
    setEvents,
    setIsRunning,
    setShowForm,
    setApplicationDetails,
    setIsLoadingApplication,
    setJobDetails,
    setAutoMode,
    setSelectedResume,
    setLoadingTasks,
    addEvent,
    updateLastEvent,
    startLoadingEvent,
    stopLoadingEvent,
    toggleEventExpansion,
    handleInputChange,
    clearEvents,
    resetApplicationState,
  } = useAgentChat();

  const {
    resumeModalOpen,
    setResumeModalOpen,
    resumes,
    resumesLoading,
    fetchResumes,
    handleOpenResumeModal,
  } = useResumePicker();

  const {
    isProcessingLongText,
    setIsProcessingLongText,
    handleStartApplication,
  } = useJobApplication();

  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');
  const resetForm = searchParams.get('reset');

  // Character count for description
  const characterCount = jobDetails.description.length;

  // Load application details if ID is present
  useEffect(() => {
    if (jobId) {
      loadApplicationDetails(jobId);
      setShowForm(false);
    } else {
      // No jobId means we're starting fresh - clear any existing events
      console.log('No jobId - clearing events and showing form');
      clearEvents();
      setApplicationDetails(null);
      setShowForm(true);
      setIsRunning(false);
      fetchResumes(true).then((latestResume) => {
        if (latestResume) {
          setSelectedResume(latestResume);
        }
      });
    }
  }, [jobId]);

  // Handle form reset when reset parameter is present
  useEffect(() => {
    if (resetForm === 'true') {
      console.log('Form reset requested - clearing events and resetting state');
      resetApplicationState();
      setJobDetails({
        title: '',
        description: '',
        url: ''
      });
      setShowForm(true);
      fetchResumes(true).then((latestResume) => {
        if (latestResume) {
          setSelectedResume(latestResume);
        }
      });
    }
  }, [resetForm]);

  // Listen for custom event from sidebar to open form
  useEffect(() => {
    const handleOpenForm = () => {
      setShowForm(true);
      setIsRunning(false);
      setJobDetails({
        title: '',
        description: '',
        url: ''
      });
      fetchResumes(true).then((latestResume) => {
        if (latestResume) {
          setSelectedResume(latestResume);
        }
      });
    };

    window.addEventListener('openAgentForm', handleOpenForm);
    
    return () => {
      window.removeEventListener('openAgentForm', handleOpenForm);
    };
  }, []);

  const loadApplicationDetails = async (applicationId: string) => {
    setIsLoadingApplication(true);
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

      const response = await fetch(`https://api.jobjaeger.de/api:BP7K6-ZQ/application_agent/${applicationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Application details loaded:', data);
        setApplicationDetails(data);
        
        // Convert API events to AgentEvent format and add them
        if (data.application?.events && Array.isArray(data.application.events)) {
          const convertedEvents: AgentEvent[] = data.application.events.map((event: any, index: number) => {
            const eventDesc = getEventDescriptionFromType(event.event_type, event.event_status);
            const stepData = generateStepDetails(event.event_type, event.event_status);
            
            const baseEvent = {
              id: `${event.event_id}_${index}`,
              type: 'action' as const,
              timestamp: new Date(event.timestamp),
              content: eventDesc.action,
              status: event.event_status === 'done' ? 'success' : 'pending',
              stepCount: stepData.stepCount,
              stepDetails: stepData.stepDetails,
              metadata: {}
            };

            // Add special metadata for "Application successful" events
            const autoApplyData = data.auto_apply || data.application?.auto_apply;
            if ((event.event_type === 'Application successful' || event.event_type === 'Bewerbung erfolgreich') && event.event_status === 'done' && autoApplyData) {
              console.log('Found Application successful event with auto_apply data:', autoApplyData);
              const parsedData = parseApplicationData(autoApplyData.application_data);
              console.log('Parsed application data:', parsedData);
              const eventWithMetadata = {
                ...baseEvent,
                metadata: {
                  ...baseEvent.metadata,
                  isSuccessfulApplication: true,
                  jobUrls: parsedData.jobUrls,
                  additionalInfo: parsedData.additionalInfo,
                  outputVideoUrl: autoApplyData.output_video_url,
                  workflowRuns: autoApplyData.workflow_runs
                }
              };
              console.log('Event with metadata:', eventWithMetadata);
              return eventWithMetadata;
            }

            return baseEvent;
          });
          setEvents(convertedEvents);
        }
      } else {
        console.error('Failed to load application details:', response.status);
        setApplicationDetails(null);
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      setApplicationDetails(null);
    } finally {
      setIsLoadingApplication(false);
    }
  };

  // Streaming event processor for handling job import sequence
  const processStreamingEvent = useCallback((data: any) => {
    console.log('Processing streaming event:', data);
    
    // Handle event messages (like job_imported)
    if (data.type === 'event') {
      const eventDesc = getEventDescriptionFromType(data.event_type, data.event_status);
      const stepData = generateStepDetails(data.event_type, data.event_status);
      
      const isSuccess = data.event_status === 'done';
      addEvent({
        id: `${data.event_id}_${Date.now()}_${Math.random()}`,
        type: 'action' as const,
        timestamp: new Date(data.timestamp),
        content: eventDesc.action,
        status: isSuccess ? 'success' : 'pending',
        stepCount: stepData.stepCount,
        stepDetails: stepData.stepDetails,
        metadata: {}
      });
    }
    // Handle status messages (like "job_imported" status)
    else if (data.type === 'status') {
      console.log('Status update:', data.status);
      // Status messages are handled internally, no UI event needed
    }
    // Handle result messages (like job data)
    else if (data.type === 'result') {
      console.log('Result data:', data.data);
      
      // Update application details with result data
      if (data.data) {
        setApplicationDetails((prev: ApplicationDetails | null) => {
          if (prev) {
            return {
              ...prev,
              application: {
                ...prev.application,
                job: [data.data] // Update with the imported job data
              }
            };
          }
          return prev;
        });

        // Handle job data from job_imported event
        if (data.data.title || data.data.description?.description_original || data.data.job_origin) {
          console.log('Found job data, updating job_imported event with metadata:', {
            title: data.data.title,
            description: data.data.description?.description_original,
            descriptionLength: data.data.description?.description_original?.length || 0,
            job_origin: data.data.job_origin
          });
          
          setEvents(prevEvents => {
            const updatedEvents = [...prevEvents];
            // Find the most recent job_imported event
            for (let i = updatedEvents.length - 1; i >= 0; i--) {
              const event = updatedEvents[i];
              if (event.content.includes('Job erfolgreich importiert') && event.type === 'action') {
                console.log('Found job_imported event to update:', event.id);
                updatedEvents[i] = {
                  ...event,
                  metadata: {
                    ...event.metadata,
                    jobTitle: data.data.title || '',
                    jobDescription: data.data.description?.description_original || '',
                    jobOrigin: data.data.job_origin || '',
                    location: data.data.job_city ? `${data.data.job_city}${data.data.job_state ? `, ${data.data.job_state}` : ''}${data.data.job_country ? `, ${data.data.job_country}` : ''}` : '',
                    salary: data.data.salary || '',
                    employmentType: data.data.job_employement_type || '',
                    seniority: data.data.seniority || ''
                  }
                };
                console.log('Updated event metadata:', updatedEvents[i].metadata);
                break;
              }
            }
            return updatedEvents;
          });
        }
        
        // Handle document data from resume_created or coverletter_created events
        else if (data.data.document_list && data.data.document_list.length > 0) {
          console.log('Found document data, updating application details:', data.data);
          
          setApplicationDetails((prev: ApplicationDetails | null) => {
            if (prev) {
              return {
                ...prev,
                documents: {
                  ...prev.documents,
                  document_list: data.data.document_list,
                  job_tracker: data.data.job_tracker || prev.documents.job_tracker
                }
              };
            }
            return prev;
          });
          
          // Update the most recent resume_created or coverletter_created event with document metadata
          setEvents(prevEvents => {
            const updatedEvents = [...prevEvents];
            // Find the most recent resume_created or coverletter_created event
            for (let i = updatedEvents.length - 1; i >= 0; i--) {
              const event = updatedEvents[i];
              if ((event.content.includes('Lebenslauf erstellt') || event.content.includes('Anschreiben erstellt')) && event.type === 'action') {
                console.log('Found document event to update:', event.id);
                const document = data.data.document_list[0]; // Get the first document
                updatedEvents[i] = {
                  ...event,
                  metadata: {
                    ...event.metadata,
                    documentId: document.id,
                    documentType: document.type,
                    documentLink: document.link,
                    jobTrackerId: document.job_tracker_id
                  }
                };
                console.log('Updated document event metadata:', updatedEvents[i].metadata);
                break;
              }
            }
            return updatedEvents;
          });
        }
      }
    }
  }, [addEvent, setApplicationDetails, setEvents]);

  const handleStartApplicationClick = async () => {
    try {
      // Clear previous events and reset state when starting a new application
      console.log('Starting new application - clearing previous events');
      clearEvents();
      setApplicationDetails(null);
      
      startLoadingEvent('message', 'Bewerbung wird gestartet...');
      setShowForm(false);
      setIsRunning(true);

      await handleStartApplication(
        jobDetails,
        selectedResume,
        autoMode,
        (applicationId) => {
          console.log('Application started successfully:', applicationId);
          // Update URL with application ID
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('id', applicationId);
          window.history.replaceState({}, '', currentUrl.toString());
        },
        (error) => {
          console.error('Error starting application:', error);
          addEvent({
            id: Date.now().toString(),
            type: 'error',
            timestamp: new Date(),
            content: `Fehler beim Starten der Bewerbung: ${error.message}`,
            metadata: {}
          });
          setIsRunning(false);
        },
        processStreamingEvent
      );

      stopLoadingEvent();
    } catch (error) {
      console.error('Error starting application:', error);
      stopLoadingEvent();
      addEvent({
        id: Date.now().toString(),
        type: 'error',
        timestamp: new Date(),
        content: `Fehler beim Starten der Bewerbung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        metadata: {}
      });
      setIsRunning(false);
    }
  };

  const handleResumeSelect = (resume: any) => {
    setSelectedResume(resume);
    setResumeModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DashboardBreadcrumb items={breadcrumbConfigs.agentChat} />
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Job Application Form */}
        {showForm && (
          <JobApplicationForm
            jobDetails={jobDetails}
            autoMode={autoMode}
            selectedResume={selectedResume}
            isProcessingLongText={isProcessingLongText}
            characterCount={characterCount}
            onJobDetailsChange={handleInputChange}
            onAutoModeChange={setAutoMode}
            onResumeSelect={handleOpenResumeModal}
            onResumeChange={() => setSelectedResume(null)}
            onStartApplication={handleStartApplicationClick}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Loading State for Application Details */}
        {!showForm && isLoadingApplication && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Anwendungsdetails werden geladen...</p>
            </div>
          </div>
        )}

        {/* Event Timeline */}
        {!showForm && !isLoadingApplication && (
          <EventTimeline
            events={events}
            applicationDetails={applicationDetails}
            expandedEvents={expandedEvents}
            isLoading={isLoading}
            loadingEvent={loadingEvent}
            loadingTasks={loadingTasks}
            onToggleEventExpansion={toggleEventExpansion}
          />
        )}

        {/* Resume Picker Modal */}
        <ResumePickerModal
          isOpen={resumeModalOpen}
          onClose={() => setResumeModalOpen(false)}
          resumes={resumes}
          resumesLoading={resumesLoading}
          onSelectResume={handleResumeSelect}
        />
      </div>
    </div>
  );
}

export default function AgentChatPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Lade Agent Chat...</p>
        </div>
      </div>
    }>
      <AgentChatContent />
    </Suspense>
  );
}
