import { useState, useRef, useCallback } from 'react';
import { AgentEvent, JobDetails, Document, ApplicationDetails, LoadingEvent, LoadingTask } from '../types';

export function useAgentChat() {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState<LoadingEvent | null>(null);
  const [loadingTasks, setLoadingTasks] = useState<LoadingTask[]>([]);
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  
  // Form state
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    title: '',
    description: '',
    url: ''
  });
  const [autoMode, setAutoMode] = useState(true);
  const [selectedResume, setSelectedResume] = useState<Document | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  // Refs for timers
  const loadingTimersRef = useRef<number[]>([]);
  const loadingPhaseIdRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addEvent = useCallback((event: AgentEvent) => {
    console.log('🔵 addEvent called with:', event);
    setEvents(prev => {
      // If this is an agent message, ensure it's always at the end
      if (event.type === 'message' && event.id.startsWith('agent_msg_')) {
        // Remove any existing agent messages and add this one at the end
        const otherEvents = prev.filter(e => !e.id.startsWith('agent_msg_'));
        const newEvents = [...otherEvents, event];
        console.log('Updated events array with agent message at end:', newEvents);
        return newEvents;
      } else {
        // Check for duplicates based on event content and timestamp
        const isDuplicate = prev.some(existingEvent => {
          // Special handling for finish events - prevent any duplicates
          if (event.content.includes('🎉 Agent hat die Bearbeitung abgeschlossen!') && 
              existingEvent.content.includes('🎉 Agent hat die Bearbeitung abgeschlossen!')) {
            console.log('🚫 Duplicate finish event detected, skipping');
            return true;
          }
          
          // Same content and timestamp
          const sameContent = existingEvent.content === event.content;
          const sameTimestamp = existingEvent.timestamp.getTime() === event.timestamp.getTime();
          const sameType = existingEvent.type === event.type;
          
          // Check if both events have the same event_id (from the API)
          const existingEventId = existingEvent.id.match(/(\d+)_/)?.[1];
          const currentEventId = event.id.match(/(\d+)_/)?.[1];
          const sameEventId = existingEventId && currentEventId && existingEventId === currentEventId;
          
          // Only consider it a duplicate if it's the exact same event with same status
          // Allow status updates (pending -> success) for the same event
          const isExactDuplicate = sameEventId && existingEvent.status === event.status;
          
          return (sameContent && sameTimestamp && sameType) || isExactDuplicate;
        });
        
        if (isDuplicate) {
          console.log('Skipping duplicate event:', event);
          return prev;
        }
        
        // For regular events, just add them normally
        const newEvents = [...prev, event];
        console.log('✅ Event added successfully. New events array:', newEvents.map(e => ({ id: e.id, content: e.content })));
        return newEvents;
      }
    });
  }, []);

  const updateLastEvent = useCallback((updates: Partial<AgentEvent>) => {
    setEvents(prev => {
      const newEvents = [...prev];
      if (newEvents.length > 0) {
        newEvents[newEvents.length - 1] = { ...newEvents[newEvents.length - 1], ...updates };
      }
      return newEvents;
    });
  }, []);

  const startLoadingEvent = useCallback((type: 'message' | 'action' | 'status' | 'error', content: string, metadata?: any) => {
    setIsLoading(true);
    setLoadingEvent({ type, content, metadata });
  }, []);

  const stopLoadingEvent = useCallback(() => {
    setIsLoading(false);
    setLoadingEvent(null);
    // Clear any pending timers for loading tasks
    if (loadingTimersRef.current.length) {
      loadingTimersRef.current.forEach((t) => {
        try { window.clearTimeout(t); } catch {}
      });
      loadingTimersRef.current = [];
    }
    setLoadingTasks([]);
  }, []);

  const toggleEventExpansion = useCallback((eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  }, []);

  // Debounced input handler for better performance with long texts
  const handleInputChange = useCallback((field: string, value: string) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Limit maximum text length to prevent browser freezing
    const maxLength = 50000; // 50k characters limit
    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
    }
    
    // For description field with long text, use aggressive debouncing
    if (field === 'description' && value.length > 1500) {
      // Use longer debounce for very long texts
      const debounceTime = value.length > 15000 ? 1500 : value.length > 10000 ? 1000 : value.length > 5000 ? 800 : 300;
      
      debounceTimeoutRef.current = setTimeout(() => {
        setJobDetails((prev: JobDetails) => ({
          ...prev,
          [field]: value
        }));
      }, debounceTime);
    } else {
      // For short text or other fields, update immediately
      setJobDetails((prev: JobDetails) => ({
        ...prev,
        [field]: value
      }));
    }
  }, []);

  const clearEvents = useCallback(() => {
    console.log('Clearing all events');
    setEvents([]);
    setExpandedEvents(new Set());
  }, []);

  const resetApplicationState = useCallback(() => {
    console.log('Resetting application state');
    setEvents([]);
    setExpandedEvents(new Set());
    setApplicationDetails(null);
    setIsRunning(false);
    setIsLoading(false);
    setLoadingEvent(null);
    setLoadingTasks([]);
    setIsLoadingApplication(false);
  }, []);

  return {
    // State
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
    
    // Refs
    loadingTimersRef,
    loadingPhaseIdRef,
    
    // Actions
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
  };
}
