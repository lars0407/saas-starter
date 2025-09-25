'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Zap,
  Building2,
  MapPin,
  DollarSign,
  User,
  Send,
  Bot,
  Link,
  Briefcase,
  MapPin as LocationIcon,
  Euro,
  Loader2,
  Download,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentPreviewCard } from '@/components/job-search/document-preview-card';
import { DocumentSkeleton } from '@/components/document-skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PDFViewer } from "@/components/ui/pdf-viewer";

interface AgentEvent {
  id: string;
  type: 'message' | 'action' | 'status' | 'error';
  timestamp: Date;
  content: string;
  status?: 'pending' | 'success' | 'error';
  metadata?: {
    jobTitle?: string;
    company?: string;
    location?: string;
    salary?: string;
    applicationId?: string;
    isSuccessfulApplication?: boolean;
    jobUrls?: string[];
    additionalInfo?: string;
    outputVideoUrl?: string;
    workflowRuns?: number;
  };
}

interface Document {
  id: number;
  created_at: number;
  updated_at: number;
  type: "resume" | "cover letter";
  preview_link: string;
  name: string;
  storage_path: string;
  variant: "human" | "ai";
  url: string;
}

interface ApplicationDetails {
  application: {
  id: number;
  created_at: number;
  job_id: number;
  user_id: number;
  updated_at: number | null;
  status: string;
  mode: string;
  events: Array<{
    event_id: number;
    timestamp: number;
    event_type: string;
    event_status: string;
  }>;
  settings: any;
  stop: boolean;
  job_tracker_id: number;
    document_id: number;
  auto_apply_id: number;
  job: Array<{
    id: number;
    created_at: number;
      uuid: string | null;
      company_id: number;
    title: string;
    job_city: string;
    job_state: string;
    job_country: string;
    job_employement_type: string;
    salary: string;
    seniority: string;
    job_origin: string;
    job_expiration: number | null;
    job_identifier: number;
    job_posted: number | null;
    apply_link: string;
    applicants_number: string;
    working_hours: string;
    remote_work: string;
    source: string;
    auto_apply: boolean;
    recruitment_agency: boolean;
    description: {
      description_original: string;
      description_responsibilities: string;
      description_qualification: string;
      description_benefits: string;
    };
    recruiter: {
      recruiter_name: string;
      recruiter_title: string;
      recruiter_url: string;
    };
      company: {
        id: number;
        created_at: number;
        uuid: string | null;
        employer_name: string;
        employer_logo: string;
        employer_website: string;
        employer_company_type: string;
        employer_linkedin: string;
        company_identifier: number;
        about: string;
        short_description: string;
        founded: string;
        company_size: string;
      };
    }>;
  };
  auto_apply: {
    created_at: number;
    status: string;
    output: string;
    application_data: string;
    output_video_url: string;
    workflow_runs: number;
  };
  documents: {
    document_list: Array<{
      id: number;
      type: string;
      link: string;
      job_tracker_id: number;
    }>;
    job_tracker: {
      id: number;
      created_at: number;
      user_id: number;
      job_id: number;
      status: string;
      joboffer_received: boolean;
      application_date: number | null;
      notes: string;
      interview_question: any[];
    };
  };
}

// Function to parse application_data JSON string and extract job URLs
const parseApplicationData = (applicationData: string): { jobUrls: string[]; additionalInfo: string } => {
  try {
    // The application_data might be a JSON fragment, so we need to handle it carefully
    let parsed;
    
    // First try to parse as complete JSON
    try {
      parsed = JSON.parse(applicationData);
    } catch {
      // If that fails, try to extract the data part from the fragment
      // Look for the data object in the string
      const dataMatch = applicationData.match(/"data":\s*{([^}]+(?:{[^}]*}[^}]*)*)}/);
      if (dataMatch) {
        const dataString = `{${dataMatch[0]}}`;
        parsed = JSON.parse(dataString);
      } else {
        // Try to parse as a JSON fragment by wrapping it
        parsed = JSON.parse(`{${applicationData}}`);
      }
    }
    
    if (parsed.data) {
      return {
        jobUrls: parsed.data.job_urls || [],
        additionalInfo: parsed.data.additional_information || ''
      };
    }
    return { jobUrls: [], additionalInfo: '' };
  } catch (error) {
    console.error('Error parsing application_data:', error);
    return { jobUrls: [], additionalInfo: '' };
  }
};

// Function to check if application was successful and has autoapply data
const hasSuccessfulApplication = (applicationDetails: ApplicationDetails | null): boolean => {
  if (!applicationDetails?.application?.events) return false;
  
  return applicationDetails.application.events.some(event => 
    (event.event_type === 'Application successful' || event.event_type === 'Bewerbung erfolgreich') && event.event_status === 'done'
  );
};

const demoEvents: AgentEvent[] = [
  {
    id: '1',
    type: 'message',
    timestamp: new Date('2024-01-15T23:00:00'),
    content: 'Hallo! Ich bin Ihr Jobjäger Agent. Ich habe 5 neue Job-Stellen gefunden, die zu Ihrem Profil passen. Soll ich mit der automatischen Bewerbung beginnen?',
  },
  {
    id: '2',
    type: 'action',
    timestamp: new Date('2024-01-15T23:01:00'),
    content: '✅ Job gefunden: Senior Software Engineer bei TechCorp GmbH',
    status: 'success',
    metadata: {
      jobTitle: 'Senior Software Engineer',
      company: 'TechCorp GmbH',
      location: 'Berlin, Deutschland',
      salary: '€75,000 - €95,000'
    }
  },
  {
    id: '3',
    type: 'action',
    timestamp: new Date('2024-01-15T23:02:00'),
    content: '📝 Lebenslauf wird für die Stelle angepasst...',
    status: 'pending'
  },
  {
    id: '4',
    type: 'action',
    timestamp: new Date('2024-01-15T23:03:00'),
    content: '✅ Lebenslauf erfolgreich angepasst',
    status: 'success'
  },
  {
    id: '5',
    type: 'action',
    timestamp: new Date('2024-01-15T23:04:00'),
    content: '📄 Anschreiben wird generiert...',
    status: 'pending'
  },
  {
    id: '6',
    type: 'action',
    timestamp: new Date('2024-01-15T23:05:00'),
    content: '✅ Anschreiben generiert und personalisiert',
    status: 'success'
  },
  {
    id: '7',
    type: 'action',
    timestamp: new Date('2024-01-15T23:06:00'),
    content: '🚀 Bewerbung wird eingereicht...',
    status: 'pending'
  },
  {
    id: '8',
    type: 'action',
    timestamp: new Date('2024-01-15T23:07:00'),
    content: '✅ Bewerbung erfolgreich eingereicht! Bewerbungs-ID: TC-2024-001',
    status: 'success',
    metadata: {
      applicationId: 'TC-2024-001'
    }
  },
  {
    id: '9',
    type: 'message',
    timestamp: new Date('2024-01-15T23:08:00'),
    content: 'Perfekt! Die erste Bewerbung wurde erfolgreich eingereicht. Ich fahre mit der nächsten Stelle fort...',
  },
  {
    id: '10',
    type: 'action',
    timestamp: new Date('2024-01-15T23:09:00'),
    content: '✅ Job gefunden: Full Stack Developer bei StartupXYZ',
    status: 'success',
    metadata: {
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'München, Deutschland',
      salary: '€65,000 - €85,000'
    }
  },
  {
    id: '11',
    type: 'action',
    timestamp: new Date('2024-01-15T23:10:00'),
    content: '📝 Lebenslauf wird für die Stelle angepasst...',
    status: 'pending'
  },
  {
    id: '12',
    type: 'action',
    timestamp: new Date('2024-01-15T23:11:00'),
    content: '✅ Lebenslauf erfolgreich angepasst',
    status: 'success'
  },
  {
    id: '13',
    type: 'action',
    timestamp: new Date('2024-01-15T23:12:00'),
    content: '📄 Anschreiben wird generiert...',
    status: 'pending'
  },
  {
    id: '14',
    type: 'action',
    timestamp: new Date('2024-01-15T23:13:00'),
    content: '✅ Anschreiben generiert und personalisiert',
    status: 'success'
  },
  {
    id: '15',
    type: 'action',
    timestamp: new Date('2024-01-15T23:14:00'),
    content: '🚀 Bewerbung wird eingereicht...',
    status: 'pending'
  },
  {
    id: '16',
    type: 'action',
    timestamp: new Date('2024-01-15T23:15:00'),
    content: '✅ Bewerbung erfolgreich eingereicht! Bewerbungs-ID: SX-2024-002',
    status: 'success',
    metadata: {
      applicationId: 'SX-2024-002'
    }
  },
  {
    id: '17',
    type: 'message',
    timestamp: new Date('2024-01-15T23:16:00'),
    content: 'Ausgezeichnet! Ich habe bereits 2 von 5 Bewerbungen erfolgreich eingereicht. Die nächste Stelle wird gerade analysiert...',
  }
];

function AgentChatContent() {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSteps, setRemainingSteps] = useState(3);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState<{
    type: 'message' | 'action' | 'status' | 'error';
    content: string;
    metadata?: any;
  } | null>(null);
  // Loading checklist tasks for the blue agent card
  const [loadingTasks, setLoadingTasks] = useState<Array<{ text: string; done: boolean }>>([]);
  const loadingTimersRef = useRef<number[]>([]);
  const loadingPhaseIdRef = useRef<number>(0);
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  
  // Form state for job details
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    url: ''
  });
  const [autoMode, setAutoMode] = useState(true);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumes, setResumes] = useState<Document[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Document | null>(null);

  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');
  const resetForm = searchParams.get('reset');

  const fetchResumes = async (autoSelect = false) => {
    setResumesLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(
        `https://api.jobjaeger.de/api:SiRHLF4Y/documents?offset=0&variant=human&type=resume`,
        {
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch resumes: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resumes API response:", data);
      
      if (data && data.document) {
        const resumes = data.document.items || [];
        setResumes(resumes);
        
        // Auto-select the latest resume if requested and resumes exist
        if (autoSelect && resumes.length > 0) {
          // Sort by created_at descending to get the latest
          const sortedResumes = resumes.sort((a, b) => b.created_at - a.created_at);
          setSelectedResume(sortedResumes[0]);
        }
      } else {
        setResumes([]);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setResumes([]);
    } finally {
      setResumesLoading(false);
    }
  };

  const handleOpenResumeModal = () => {
    setResumeModalOpen(true);
    fetchResumes();
  };

  const handleSelectResume = (resume: Document) => {
    setSelectedResume(resume);
    setResumeModalOpen(false);
  };

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
        console.log('Auto apply data (root):', data.auto_apply);
        console.log('Auto apply data (application):', data.application?.auto_apply);
        console.log('Application events:', data.application?.events);
        setApplicationDetails(data);
        
        // Convert API events to AgentEvent format and add them
        if (data.application?.events && Array.isArray(data.application.events)) {
          const convertedEvents: AgentEvent[] = data.application.events.map((event: any, index: number) => {
            const baseEvent = {
              id: `${event.event_id}_${index}`, // Use event_id + index to ensure uniqueness
              type: 'action' as const,
              timestamp: new Date(event.timestamp),
              content: `✅ ${event.event_type.replace(/_/g, ' ').replace('Application successful', 'Bewerbung erfolgreich').replace('job imported', 'Job importiert').replace('autoapply created', 'Auto-Bewerbung erstellt').replace('autoapply_created', 'Auto-Bewerbung erstellt')} - ${event.event_status === 'done' ? 'Fertig' : event.event_status}`,
              status: event.event_status === 'done' ? 'success' : 'pending'
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

  useEffect(() => {
    // Show form if no ID parameter is present
    if (!jobId) {
      setShowForm(true);
      setIsRunning(false);
      // Auto-fetch and select the latest resume when showing the form
      fetchResumes(true);
    } else {
      // Load application details if ID is present
      loadApplicationDetails(jobId);
      setShowForm(false);
    }
  }, [jobId]);

  // Listen for custom event from sidebar to open form
  useEffect(() => {
    const handleOpenForm = () => {
      setShowForm(true);
      setIsRunning(false);
      // Reset form fields
      setJobDetails({
        title: '',
        description: '',
        url: ''
      });
      // Auto-fetch and select the latest resume when opening form
      fetchResumes(true);
    };

    window.addEventListener('openAgentForm', handleOpenForm);
    
    return () => {
      window.removeEventListener('openAgentForm', handleOpenForm);
    };
  }, []);

  // Update event statuses when loading tasks complete
  useEffect(() => {
    const hasPendingTasks = loadingTasks.some(task => !task.done);
    if (!hasPendingTasks && loadingTasks.length > 0) {
      // All loading tasks are done, update any pending events to success
      setEvents(prev => prev.map(event => {
        if (event.status === 'pending' && event.type === 'action') {
          return { ...event, status: 'success' };
        }
        return event;
      }));
    }
  }, [loadingTasks]);

  // Handle form reset when reset parameter is present
  useEffect(() => {
    if (resetForm === 'true') {
      setJobDetails({
        title: '',
        description: '',
        url: ''
      });
      setShowForm(true);
      setIsRunning(false);
      // Auto-fetch and select the latest resume when opening form
      fetchResumes(true);
    }
  }, [resetForm]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventIcon = (event: AgentEvent) => {
    switch (event.type) {
      case 'message':
        return <Bot className="h-5 w-5 text-blue-500" />;
      case 'action':
        if (event.status === 'pending') {
          return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
        } else if (event.status === 'success') {
          return <CheckCircle className="h-5 w-5 text-green-500" />;
        } else if (event.status === 'error') {
          return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'status':
        return <Settings className="h-5 w-5 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventDescription = (event: AgentEvent) => {
    // Extract event type from content if it's from API
    const eventType = event.content.match(/✅ (.+) - (.+)/);
    if (eventType) {
      const [, action, status] = eventType;
      const actionMap: { [key: string]: string } = {
        'job imported': '📥 Job erfolgreich importiert',
        'resume created': '📄 Lebenslauf erstellt',
        'coverletter created': '✍️ Anschreiben erstellt',
        'application submitted': '🎯 Bewerbung eingereicht',
        'job search': '🔍 Job-Suche durchgeführt',
        'document generation': '📝 Dokument generiert'
      };
      
      const translatedAction = actionMap[action.toLowerCase()] || action;
      return {
        action: translatedAction,
        status: status === 'done' ? '✅ Fertig' : '⏳ Läuft...'
      };
    }
    
    return {
      action: event.content,
      status: event.status === 'success' ? '✅ Fertig' : event.status === 'error' ? '❌ Fehler' : '⏳ Läuft...'
    };
  };

  const getEventDescriptionFromType = (eventType: string, eventStatus: string) => {
    const actionMap: { [key: string]: string } = {
      'job_imported': '📥 Job erfolgreich importiert',
      'resume_created': '📄 Lebenslauf erstellt',
      'coverletter_created': '✍️ Anschreiben erstellt',
      'cover_letter_created': '✍️ Anschreiben erstellt',
      'autoapply_created': '🤖 Auto-Bewerbung erstellt',
      'application_submitted': '🎯 Bewerbung eingereicht',
      'job_search': '🔍 Job-Suche durchgeführt',
      'document_generation': '📝 Dokument generiert'
    };
    
    const translatedAction = actionMap[eventType] || `✅ ${eventType.replace(/_/g, ' ')}`;
    const status = eventStatus === 'done' ? '✅ Fertig' : '⏳ Läuft...';
    
    let actionText = translatedAction;
    if (eventType === 'autoapply_created' && String(eventStatus).toLowerCase() === 'done') {
      actionText = `${translatedAction} — Beschreibung: Du kannst das Fenster schließen. In der Regel dauert es ca. 10 Minuten, kann aber auch bis zu 24 Stunden dauern. Wir informieren dich, wenn die Bewerbung eingereicht ist.`;
    }
    
    return {
      action: actionText,
      status: status
    };
  };

  const getRelatedDocument = (event: AgentEvent) => {
    if (!applicationDetails?.documents?.document_list) return null;
    
    // Check if this is a resume or cover letter event based on content
    const content = event.content.toLowerCase();
    
    // Map event types to document types
    if (content.includes('resume') || content.includes('lebenslauf')) {
      return applicationDetails.documents.document_list.find(doc => doc.type === 'resume');
    } else if (content.includes('coverletter') || content.includes('anschreiben')) {
      return applicationDetails.documents.document_list.find(doc => doc.type === 'cover letter');
    }
    
    return null;
  };

  const getEventStyle = (event: AgentEvent) => {
    switch (event.type) {
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'action':
        if (event.status === 'pending') {
          return 'bg-yellow-50 border-yellow-200';
        } else if (event.status === 'success') {
          return 'bg-green-50 border-green-200';
        } else if (event.status === 'error') {
          return 'bg-red-50 border-red-200';
        }
        return 'bg-gray-50 border-gray-200';
      case 'status':
        return 'bg-gray-50 border-gray-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    // Start loading state for initial message
    startLoadingEvent('message', 'Agent wird gestartet...');
    
    // Demo: Simulate backend response after 2 seconds
    setTimeout(() => {
      stopLoadingEvent();
      addEvent({
        id: Date.now().toString(),
        type: 'message',
        timestamp: new Date(),
        content: 'Agent erfolgreich gestartet! Ich beginne mit der Job-Suche...'
      });
      
      // Start next loading event
      startLoadingEvent('action', 'Jobs werden gesucht...');
      
      setTimeout(() => {
        stopLoadingEvent();
        addEvent({
          id: (Date.now() + 1).toString(),
          type: 'action',
          timestamp: new Date(),
          content: '✅ 3 passende Jobs gefunden',
          status: 'success',
          metadata: {
            jobTitle: 'Senior Software Engineer',
            company: 'TechCorp GmbH',
            location: 'Berlin, Deutschland',
            salary: '€75,000 - €95,000'
          }
        });
      }, 2000);
    }, 2000);
  };

  const handlePause = () => {
    setIsRunning(false);
    stopLoadingEvent();
  };

  const handleStop = () => {
    setIsRunning(false);
    setRemainingSteps(0);
    stopLoadingEvent();
  };

  const startLoadingEvent = (type: 'message' | 'action' | 'status' | 'error', content: string, metadata?: any) => {
    setIsLoading(true);
    setLoadingEvent({ type, content, metadata });
  };

  const stopLoadingEvent = () => {
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
  };

  const addEvent = (event: AgentEvent) => {
    console.log('Adding event to state:', event);
    setEvents(prev => {
      // If this is an agent message, ensure it's always at the end
      if (event.type === 'message' && event.id.startsWith('agent_msg_')) {
        // Remove any existing agent messages and add this one at the end
        const otherEvents = prev.filter(e => !e.id.startsWith('agent_msg_'));
        const newEvents = [...otherEvents, event];
        console.log('Updated events array with agent message at end:', newEvents);
        return newEvents;
      } else {
        // For regular events, just add them normally
        const newEvents = [...prev, event];
        console.log('Updated events array:', newEvents);
        return newEvents;
      }
    });
  };

  const updateLastEvent = (updates: Partial<AgentEvent>) => {
    setEvents(prev => {
      const newEvents = [...prev];
      if (newEvents.length > 0) {
        newEvents[newEvents.length - 1] = { ...newEvents[newEvents.length - 1], ...updates };
      }
      return newEvents;
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setJobDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartApplication = async () => {
    try {
      // Start loading state
      startLoadingEvent('message', 'Bewerbung wird gestartet...');
      setShowForm(false);
      setIsRunning(true);

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

      // Clear previously loaded application details (if any)
      setApplicationDetails(null);

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

      // Try to call API (with fallback for development)
      let apiSuccess = false;
      try {
        // Read URL params AFTER potential cleanup above
        const urlParams = new URLSearchParams(window.location.search);
        const applicationId = urlParams.get('id');
        
        const requestBody: any = {
          job_title: jobDetails.title,
          job_description: jobDetails.description,
          job_url: jobDetails.url,
          document_id: selectedResume?.id || null,
          mode: autoMode ? 'auto' : 'manual'
        };
        
        // Do NOT include application_agent_id when starting a new application.
        // If in the future we support continuing an existing one, we can conditionally include it again.
        // (Intentionally not adding application_agent_id even if applicationId exists.)

        const response = await fetch('https://api.jobjaeger.de/api:BP7K6-ZQ/v2/agent/application/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          apiSuccess = true;
          
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
                        setApplicationDetails({
                          application: data,
                          documents: {
                            document_list: [],
                            job_tracker: jobTrackerFallback,
                          },
                        } as any);
                        setShowForm(false);
                        
                        // Clear existing events and add all events from the initial application
            setEvents([]);
                        data.events.forEach((event: any, index: number) => {
                          const eventDesc = getEventDescriptionFromType(event.event_type, event.event_status);
                          addEvent({
                            id: `${event.event_id}_${index}`,
                            type: 'action',
                            timestamp: new Date(event.timestamp),
                            content: eventDesc.action,
                            status: event.event_status === 'done' ? 'success' : 'pending'
                          });
                        });
                        
                        // Do NOT add an agent message event here; the blue loading card handles this while running
                      } catch (e) {
                        console.warn('Failed to process initial application:', e);
                      }
                    }
                     // Handle event messages
                     else if (data.type === 'event') {
                       console.log('Adding event message:', data);
                       const eventDesc = getEventDescriptionFromType(data.event_type, data.event_status);
                       
                      // If this event is done, mark the corresponding loading task as done
                      if (String(data.event_status).toLowerCase() === 'done') {
                        setLoadingTasks((prev) => {
                          const next = [...prev];
                          // Normalize type for robust matching (cover_letter, cover-letter, cover letter → coverletter)
                          const normalizedType = String(data.event_type || '')
                            .toLowerCase()
                            .replace(/[\s_-]+/g, '');
                          const taskIndex = next.findIndex(task => {
                            const taskText = task.text.toLowerCase();
                            if (normalizedType.includes('resume') && taskText.includes('lebenslauf')) return true;
                            if (normalizedType.includes('coverletter') && taskText.includes('anschreiben')) return true;
                            if (normalizedType.includes('application') && taskText.includes('bewerbung')) return true;
                            return false;
                          });
                          if (taskIndex !== -1) {
                            next[taskIndex] = { ...next[taskIndex], done: true };
                          }
                          return next;
                        });
                      }
                       
                       // Don't show as success if loading tasks are still active
                       const hasPendingTasks = loadingTasks.some(task => !task.done);
                       const isSuccess = data.event_status === 'done' && !hasPendingTasks;
                       addEvent({
                         id: `${data.event_id}_${Date.now()}_${Math.random()}`,
                         type: 'action',
                         timestamp: new Date(data.timestamp),
                         content: eventDesc.action,
                         status: isSuccess ? 'success' : 'pending'
                       });

                       // No extra message; description is embedded in the event text
                     }
                    // Handle status messages
                    else if (data.type === 'status') {
                      console.log('Updating status:', data.status);
                      // Update the application status in the job information card
                      setApplicationDetails(prev => {
                        if (prev?.application) {
                          return {
                            ...prev,
                            application: {
                              ...prev.application,
                              status: data.status
                            }
                          };
                        }
                        return prev;
                      });

                      // Do not stop the blue card on status anymore; wait for explicit finish message
                    }
                    // Handle result messages (documents, etc.)
                    else if (data.type === 'result') {
                      console.log('Processing result message:', data);
                      if (data.data) {
                        // Update application details with new documents (merge with existing)
                        setApplicationDetails(prev => {
                          if (prev) {
                            const existingDocuments = prev.documents?.document_list || [];
                            const newDocuments = data.data.document_list || [];
                            
                            // Merge documents, avoiding duplicates by ID
                            const mergedDocuments = [...existingDocuments];
                            newDocuments.forEach(newDoc => {
                              const existingIndex = mergedDocuments.findIndex(existing => existing.id === newDoc.id);
                              if (existingIndex >= 0) {
                                // Update existing document
                                mergedDocuments[existingIndex] = newDoc;
                              } else {
                                // Add new document
                                mergedDocuments.push(newDoc);
                              }
                            });
                            
                            return {
                              ...prev,
                              documents: {
                                document_list: mergedDocuments,
                                job_tracker: data.data.job_tracker || prev.documents?.job_tracker
                              }
                            };
                          }
                          return prev;
                        });
                        
                        // Show each remaining task as checked with 500ms delay
                        const currentPhaseId = loadingPhaseIdRef.current;
                        setLoadingTasks(prev => {
                          const uncheckedTasks = prev.filter(task => !task.done);
                          if (uncheckedTasks.length > 0) {
                            // Mark all remaining tasks as done one by one
                            uncheckedTasks.forEach((_, index) => {
                              const t = window.setTimeout(() => {
                                if (loadingPhaseIdRef.current !== currentPhaseId) return;
                                setLoadingTasks(current => 
                                  current.map((task, taskIndex) => {
                                    const isUnchecked = !task.done;
                                    const isThisTask = current.findIndex(t => !t.done) === taskIndex;
                                    return isUnchecked && isThisTask ? { ...task, done: true } : task;
                                  })
                                );
                              }, index * 500);
                              loadingTimersRef.current.push(t);
                            });
                            
                            // After all tasks are checked, finish loading state
                            const finalTimer = window.setTimeout(() => {
                              if (loadingPhaseIdRef.current !== currentPhaseId) return;
                              setLoadingTasks([]);
                              setEvents(prev => prev.map(event => {
                                if (event.status === 'pending' && event.type === 'action') {
                                  return { ...event, status: 'success' };
                                }
                                return event;
                              }));
                              stopLoadingEvent();
                            }, uncheckedTasks.length * 500);
                            loadingTimersRef.current.push(finalTimer);
                          } else {
                            // No unchecked tasks, finish immediately
                            setLoadingTasks([]);
                            setEvents(prev => prev.map(event => {
                              if (event.status === 'pending' && event.type === 'action') {
                                return { ...event, status: 'success' };
                              }
                              return event;
                            }));
                            stopLoadingEvent();
                          }
                          return prev;
                        });
                      }
                    }
                    // Handle loading state for blue agent card checklist
                    else if (data.type === 'loading_state') {
                      console.log('Processing loading_state:', data);
                      const minMs = Math.max(0, parseInt(String(data.time || '0'), 10) * 1000);
                      const tasks: string[] = Array.isArray(data.task) ? data.task : [];
                      // Start a new phase and clear any previous timers
                      loadingPhaseIdRef.current += 1;
                      const currentPhaseId = loadingPhaseIdRef.current;
                      if (loadingTimersRef.current.length) {
                        loadingTimersRef.current.forEach((t) => { try { window.clearTimeout(t); } catch {} });
                        loadingTimersRef.current = [];
                      }
                      // Initialize tasks: keep all unchecked initially
                      const initial = tasks.map((t: string) => ({ text: t, done: false }));
                      setLoadingTasks(initial);
                      setIsLoading(true);
                      setLoadingEvent({ type: 'message', content: 'Der Agent arbeitet an deinen Unterlagen…', metadata: {} });

                      // Complete all but the last task randomly within min time
                      if (initial.length > 1 && minMs > 0) {
                        const countToAutoComplete = initial.length - 1;
                        // Generate random times within [0, minMs - 1000]
                        const times = Array.from({ length: countToAutoComplete }, () => Math.floor(Math.random() * Math.max(1, minMs - 1000)));
                        times.sort((a, b) => a - b);
                        times.forEach((delay, idx) => {
                          const timer = window.setTimeout(() => {
                            if (loadingPhaseIdRef.current !== currentPhaseId) return;
                            setLoadingTasks((prev) => {
                              const next = [...prev];
                              // Mark the next unchecked (but not the last) as done
                              let marked = 0;
                              for (let i = 0; i < next.length - 1; i++) {
                                if (!next[i].done) {
                                  next[i] = { ...next[i], done: true };
                                  marked = 1;
                                  break;
                                }
                              }
                              return next;
                            });
                          }, Math.min(minMs - 500, delay + idx * 200));
                          loadingTimersRef.current.push(timer);
                        });
                      }
                    }
                    // Handle explicit finish message
                    else if (data.type === 'finish') {
                      console.log('Finishing stream.');
                      stopLoadingEvent();
                      setIsRunning(false);
                    }
                    // Handle final application summary after finish
                    else if (data.id && data.job && data.events && data.status) {
                      console.log('Processing final application summary:', data);
                      // Update application details with the complete final data
                      setApplicationDetails({
                        application: {
                          id: data.id,
                          created_at: data.created_at,
                          job_id: data.job_id,
                          user_id: data.user_id,
                          updated_at: data.updated_at,
                          status: data.status,
                          mode: data.mode,
                          events: data.events,
                          settings: data.settings,
                          stop: data.stop,
                          job_tracker_id: data.job_tracker_id,
                          document_id: data.document_id
                        },
                        job: data.job,
                        documents: applicationDetails?.documents || { document_list: [], job_tracker: {} }
                      });
                    }
                    // Handle legacy single event format
                    else if (data.event) {
                      console.log('Adding single event:', data.event);
                      const eventDesc = getEventDescriptionFromType(data.event.event_type, data.event.event_status);
                      addEvent({
                        id: `${data.event.event_id || Date.now()}_${Math.random()}`,
                        type: 'action',
                        timestamp: new Date(data.event.timestamp || Date.now()),
                        content: eventDesc.action,
                        status: data.event.event_status === 'done' ? 'success' : 'pending'
                      });

                      // No extra message; description is embedded in the event text
                    }
                    // Handle legacy message format
                    else if (data.message) {
                      console.log('Adding message:', data.message);
                      addEvent({
                        id: `msg_${Date.now()}_${Math.random()}`,
                        type: 'message',
                        timestamp: new Date(),
                        content: data.message
                      });
                    }
                    // Handle legacy events array format
                    else if (data.events && Array.isArray(data.events)) {
                      console.log('Adding events array:', data.events);
                      data.events.forEach((event: any, index: number) => {
                        const eventDesc = getEventDescriptionFromType(event.event_type, event.event_status);
                        addEvent({
                          id: `${event.event_id}_${index}`,
                  type: 'action',
                  timestamp: new Date(event.timestamp),
                          content: eventDesc.action,
                  status: event.event_status === 'done' ? 'success' : 'pending'
                });

                        // No extra message; description is embedded in the event text
                      });
                    } else {
                      console.log('Unknown data format:', data);
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
      } catch (apiError) {
        console.warn('API call failed, falling back to simulation:', apiError);
      }

      // Stop loading and add success event
      stopLoadingEvent();
      
      // Only add the success message if API didn't provide real events (fallback mode)
      if (!apiSuccess) {
      addEvent({
        id: Date.now().toString(),
        type: 'message',
        timestamp: new Date(),
          content: 'Bewerbung gestartet (Demo-Modus)! Der Agent beginnt mit der automatischen Erstellung der Bewerbungsunterlagen'
      });
      }

      // Only add simulation events if API didn't provide real events
      if (!apiSuccess) {
        // Start the agent process
        startLoadingEvent('action', 'Jobs werden gesucht...');
        
        // Simulate job search process
        setTimeout(() => {
          stopLoadingEvent();
          addEvent({
            id: (Date.now() + 1).toString(),
            type: 'action',
            timestamp: new Date(),
            content: '✅ 3 passende Jobs gefunden',
            status: 'success',
            metadata: {
              jobTitle: jobDetails.title,
              location: 'Berlin, Deutschland',
              salary: '€75,000 - €95,000'
            }
          });

          // Continue with more simulation events
          setTimeout(() => {
            startLoadingEvent('action', 'Lebenslauf wird angepasst...');
            setTimeout(() => {
              stopLoadingEvent();
              addEvent({
                id: (Date.now() + 2).toString(),
                type: 'action',
                timestamp: new Date(),
                content: '✅ Lebenslauf erfolgreich angepasst',
                status: 'success'
              });
            }, 1500);
          }, 2000);
        }, 2000);
      }

    } catch (error) {
      console.error('Error starting application:', error);
      stopLoadingEvent();
      addEvent({
        id: Date.now().toString(),
        type: 'error',
        timestamp: new Date(),
        content: `Fehler beim Starten der Bewerbung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
      });
      setIsRunning(false);
    }
  };

  const isFormValid = () => {
    if (activeTab === 'details') {
      return jobDetails.title && jobDetails.description;
    } else {
      return jobDetails.url;
    }
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
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Agent Chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Job Application Form */}
        {showForm && (
          <div className="flex-1 flex items-center justify-center px-24 py-8">
            <Card className="max-w-4xl w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-[#0F973D]" />
                  🚀 Job-Bewerbung starten
                </CardTitle>
                <p className="text-muted-foreground">
                  Gib einfach die Job-Details ein oder füg eine URL hinzu - wir machen den Rest! 💪
                </p>
              </CardHeader>
              <CardContent>
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                   <TabsList className="grid w-full grid-cols-2">
                     <TabsTrigger value="details" className="flex items-center gap-2">
                       <FileText className="h-4 w-4" />
                       📝 Job-Details
                     </TabsTrigger>
                     <TabsTrigger value="url" className="flex items-center gap-2" disabled>
                       <Link className="h-4 w-4" />
                       🔗 Job-URL (Soon™)
                     </TabsTrigger>
                   </TabsList>

                  <TabsContent value="details" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="title">🎯 Job-Titel *</Label>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="auto-mode" className="text-sm text-muted-foreground">
                              🤖 Auto-Modus
                            </Label>
                            <Switch
                              id="auto-mode"
                              checked={autoMode}
                              onCheckedChange={setAutoMode}
                              className="data-[state=checked]:bg-[#0F973D]"
                            />
                          </div>
                        </div>
                         <Input
                           id="title"
                           placeholder="z.B. Senior Software Engineer"
                           value={jobDetails.title}
                           onChange={(e) => handleInputChange('title', e.target.value)}
                           className="focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:outline-none focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                           style={{ 
                             '--tw-ring-color': '#0F973D',
                             '--tw-border-color': '#0F973D'
                           } as React.CSSProperties}
                         />
                      </div>
                    </div>


                     <div className="space-y-2">
                       <Label htmlFor="description">📋 Job-Beschreibung *</Label>
                       <Textarea
                         id="description"
                         placeholder="Erzähl uns was über die Stelle..."
                         value={jobDetails.description}
                         onChange={(e) => handleInputChange('description', e.target.value)}
                         rows={4}
                         className="focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:outline-none focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                         style={{ 
                           '--tw-ring-color': '#0F973D',
                           '--tw-border-color': '#0F973D'
                         } as React.CSSProperties}
                       />
                     </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobUrl">🔗 Job-URL (optional)</Label>
                      <Input
                        id="jobUrl"
                        placeholder="https://www.linkedin.com/jobs/view/..."
                        value={jobDetails.url}
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        type="url"
                        className="focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:outline-none focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                        style={{ 
                          '--tw-ring-color': '#0F973D',
                          '--tw-border-color': '#0F973D'
                        } as React.CSSProperties}
                      />
                      <p className="text-sm text-muted-foreground">
                        🚀 Wir bewerben uns automatisch für dich! Die URL hilft uns dabei, die perfekte Bewerbung zu erstellen.
                      </p>
                    </div>

                    {/* Resume Picker Section */}
                    <div className="space-y-2">
                      <Label>📄 Base-Lebenslauf wählen</Label>
                      {selectedResume ? (
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="w-16 h-20 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                            <PDFViewer
                              pdfUrl={selectedResume.url}
                              showToolbar={false}
                              showNavigation={false}
                              showBorder={false}
                              fallbackMessage=""
                              downloadMessage=""
                              placeholderMessage=""
                              className="w-full h-full -mt-6 -mb-6 pointer-events-none"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{selectedResume.name}</p>
                            <p className="text-xs text-gray-500">ID: {selectedResume.id}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedResume(null)}
                            className="text-xs"
                          >
                            ✏️ Ändern
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={handleOpenResumeModal}
                          className="w-full justify-start text-left h-auto p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-20 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
                              <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium">Lebenslauf auswählen</p>
                              <p className="text-xs text-muted-foreground">Wähle deinen Base-Lebenslauf für die KI-Generierung</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Button>
                      )}
                      <p className="text-sm text-muted-foreground">
                        🤖 Wähle einen Lebenslauf als Grundlage für die automatische Anpassung
                      </p>
                    </div>
                  </TabsContent>

                </Tabs>

                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    ❌ Abbrechen
                  </Button>
                  <Button
                    onClick={handleStartApplication}
                    disabled={!isFormValid()}
                    className="bg-[#0F973D] hover:bg-[#0F973D]/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    🚀 Bewerbung starten
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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

         {/* Job Information Card */}
         {!showForm && !isLoadingApplication && applicationDetails && (
           <div className="px-24 py-4">
             <Card className="mb-4">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Briefcase className="h-5 w-5" />
                   Job-Informationen
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-3">
                     <div>
                       <Label className="text-sm font-medium text-muted-foreground">Position</Label>
                       <p className="text-lg font-semibold">{applicationDetails.application?.job?.[0]?.title || 'Unbekannte Position'}</p>
                     </div>
                     <div>
                       <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                       <Badge 
                         variant={applicationDetails.application?.status === 'created' ? 'default' : 'secondary'}
                         className={applicationDetails.application?.status === 'created' ? 'bg-green-100 text-green-800' : ''}
                       >
                         {applicationDetails.application?.status}
                       </Badge>
                     </div>
                     <div>
                       <Label className="text-sm font-medium text-muted-foreground">Erstellt am</Label>
                       <p className="text-sm">{new Date(applicationDetails.application?.created_at || 0).toLocaleDateString('de-DE', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric',
                         hour: '2-digit',
                         minute: '2-digit'
                       })}</p>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div>
                       <Label className="text-sm font-medium text-muted-foreground">Standort</Label>
                       <p className="text-sm">
                         {applicationDetails.application?.job?.[0]?.job_city && applicationDetails.application?.job?.[0]?.job_country 
                           ? `${applicationDetails.application.job[0].job_city}, ${applicationDetails.application.job[0].job_country}`
                           : 'Nicht angegeben'
                         }
                       </p>
                     </div>
                     <div>
                       <Label className="text-sm font-medium text-muted-foreground">Arbeitszeit</Label>
                       <p className="text-sm">
                         {applicationDetails.application?.job?.[0]?.working_hours || 'Nicht angegeben'}
                       </p>
                     </div>
                     <div>
                       <Label className="text-sm font-medium text-muted-foreground">Remote-Arbeit</Label>
                       <p className="text-sm">
                         {applicationDetails.application?.job?.[0]?.remote_work || 'Nicht angegeben'}
                       </p>
                     </div>
                     <div>
                       <Label className="text-sm font-medium text-muted-foreground">Gehalt</Label>
                       <p className="text-sm">
                         {applicationDetails.application?.job?.[0]?.salary || 'Nicht angegeben'}
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 {applicationDetails.application?.job?.[0]?.description?.description_original && (
                   <div className="mt-6 pt-4 border-t">
                     <Label className="text-sm font-medium text-muted-foreground">Job-Beschreibung</Label>
                     <p className="text-sm mt-2 text-muted-foreground whitespace-pre-wrap">
                       {applicationDetails.application.job[0].description.description_original}
                     </p>
                   </div>
                 )}
                 
                 {applicationDetails.application?.job?.[0]?.apply_link && (
                   <div className="mt-4 pt-4 border-t">
                     <Button variant="outline" asChild>
                       <a 
                         href={applicationDetails.application.job[0].apply_link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-2"
                       >
                         <Link className="h-4 w-4" />
                         Zur Original-Stellenausschreibung
                       </a>
                     </Button>
                   </div>
                 )}
               </CardContent>
             </Card>
           </div>
         )}


         {/* Chat Messages */}
         {!showForm && !isLoadingApplication && (
           <div className="flex-1 overflow-y-auto px-24 py-4 pb-32 space-y-4">
           {events.map((event) => {
             const eventDesc = getEventDescription(event);
             const relatedDocument = getRelatedDocument(event);
             return (
             <div key={event.id} className={`flex gap-3 p-4 rounded-lg border ${getEventStyle(event)}`}>
               <div className="flex-shrink-0">
                 {getEventIcon(event)}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-sm font-medium text-gray-900">
                     {event.type === 'message' ? 'Jobjäger Agent' : 'Jobjäger'}
                   </span>
                   <span className="text-xs text-gray-500">
                     {formatTime(event.timestamp)}
                   </span>
                     <Badge 
                       variant={event.status === 'success' ? 'default' : event.status === 'error' ? 'destructive' : 'secondary'}
                       className="text-xs"
                     >
                       {eventDesc.status}
                     </Badge>
                   </div>
                   <p className="text-sm text-gray-700 font-medium mb-1">{eventDesc.action}</p>
                   {event.type === 'message' && (
                     <p className="text-sm text-gray-600">{event.content}</p>
                   )}
                   
                   {/* PDF Preview for related documents */}
                   {relatedDocument && (
                     <div className="mt-3 p-3 bg-white rounded-md border">
                       <div className="flex items-center gap-2 mb-2">
                         <FileText className="h-4 w-4 text-blue-600" />
                         <span className="text-sm font-medium text-gray-900">
                           {relatedDocument.type === 'resume' ? 'Lebenslauf' : 'Anschreiben'}
                         </span>
                         <Badge variant="outline" className="text-xs">
                           Vorschau
                         </Badge>
                 </div>
                       <div className="w-32 h-40 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                         <PDFViewer
                           pdfUrl={relatedDocument.link}
                           showToolbar={false}
                           showNavigation={false}
                           showBorder={false}
                           fallbackMessage=""
                           downloadMessage=""
                           placeholderMessage=""
                           className="w-full h-full -mt-6 -mb-6 pointer-events-none"
                         />
                       </div>
                       <div className="mt-2 flex gap-2">
                         <Button 
                           variant="outline" 
                           size="sm" 
                           asChild
                           className="text-xs"
                         >
                           <a 
                             href={relatedDocument.link} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-1"
                           >
                             <Link className="h-3 w-3" />
                             Öffnen
                           </a>
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={() => window.open(relatedDocument.link, '_blank')}
                           className="text-xs"
                         >
                           <Download className="h-3 w-3 mr-1" />
                           Download
                         </Button>
                       </div>
                     </div>
                   )}
                 
                 {/* Application Success Information */}
                 {(() => {
                   console.log('Checking event metadata:', event.metadata);
                   console.log('isSuccessfulApplication:', event.metadata?.isSuccessfulApplication);
                   return event.metadata?.isSuccessfulApplication;
                 })() && (
                   <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                     <div className="flex items-center gap-2 mb-3">
                       <CheckCircle className="h-5 w-5 text-green-600" />
                       <h4 className="font-semibold text-black">🎉 Bewerbung erfolgreich eingereicht!</h4>
                     </div>
                     
                     {/* Job URLs */}
                     {event.metadata.jobUrls && event.metadata.jobUrls.length > 0 && (
                       <div className="mb-3">
                         <h5 className="text-sm font-medium text-black mb-2">📋 Beworbene Stellen:</h5>
                         <div className="space-y-2">
                           {event.metadata.jobUrls.map((url: string, index: number) => (
                             <div key={index} className="flex items-center gap-2">
                               <ExternalLink className="h-4 w-4 text-green-600" />
                               <a 
                                 href={url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-sm text-black hover:text-gray-600 underline break-all"
                               >
                                 {url}
                               </a>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     {/* Output Video */}
                     {event.metadata.outputVideoUrl && (
                       <div className="mb-3">
                         <h5 className="text-sm font-medium text-black mb-2">🎥 Agentvideo:</h5>
                         <div className="space-y-2">
                           <video 
                             controls 
                             className="w-full max-w-md rounded-lg border border-green-200"
                             preload="metadata"
                           >
                             <source src={event.metadata.outputVideoUrl} type="video/webm" />
                             <source src={event.metadata.outputVideoUrl} type="video/mp4" />
                             Ihr Browser unterstützt das Video-Element nicht.
                           </video>
                           <div className="flex items-center gap-2">
                             <Button 
                               variant="outline" 
                               size="sm" 
                               asChild
                               className="border-gray-300 text-black hover:bg-gray-100"
                             >
                               <a 
                                 href={event.metadata.outputVideoUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-1"
                               >
                                 <ExternalLink className="h-3 w-3" />
                                 Video in neuem Tab öffnen
                               </a>
                             </Button>
                           </div>
                         </div>
                       </div>
                     )}

                     {/* Additional Information */}
                     {event.metadata.additionalInfo && (
                       <div className="mb-3">
                         <h5 className="text-sm font-medium text-black mb-2">ℹ️ Zusätzliche Informationen:</h5>
                         <p className="text-sm text-black bg-white p-2 rounded border">
                           {event.metadata.additionalInfo}
                         </p>
                       </div>
                     )}

                   </div>
                 )}

                 {/* Job Metadata */}
                 {event.metadata && !event.metadata.isSuccessfulApplication && (
                   <div className="mt-3 p-3 bg-white rounded-md border">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                       {event.metadata.jobTitle && (
                         <div className="flex items-center gap-1">
                           <FileText className="h-3 w-3 text-gray-500" />
                           <span className="font-medium">{event.metadata.jobTitle}</span>
                         </div>
                       )}
                       {event.metadata.company && (
                         <div className="flex items-center gap-1">
                           <Building2 className="h-3 w-3 text-gray-500" />
                           <span>{event.metadata.company}</span>
                         </div>
                       )}
                       {event.metadata.location && (
                         <div className="flex items-center gap-1">
                           <MapPin className="h-3 w-3 text-gray-500" />
                           <span>{event.metadata.location}</span>
                         </div>
                       )}
                       {event.metadata.salary && (
                         <div className="flex items-center gap-1">
                           <DollarSign className="h-3 w-3 text-gray-500" />
                           <span>{event.metadata.salary}</span>
                         </div>
                       )}
                       {event.metadata.applicationId && (
                         <div className="flex items-center gap-1">
                           <User className="h-3 w-3 text-gray-500" />
                           <span className="font-mono">{event.metadata.applicationId}</span>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
               </div>
             </div>
             );
           })}

           {/* Loading Event */}
           {isLoading && loadingEvent && (
             <div className={`flex gap-3 p-4 rounded-lg border ${getEventStyle({ type: loadingEvent.type, status: 'pending' } as AgentEvent)}`}>
               <div className="flex-shrink-0">
                 {loadingEvent.type === 'message' ? (
                   <Bot className="h-5 w-5 text-blue-500 animate-pulse" />
                 ) : (
                   <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
                 )}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-sm font-medium text-gray-900">
                     {loadingEvent.type === 'message' ? 'Jobjäger Agent' : 'Jobjäger'}
                   </span>
                   <span className="text-xs text-gray-500">
                     {formatTime(new Date())}
                   </span>
                   <Badge variant="secondary" className="text-xs">
                     In Bearbeitung
                   </Badge>
                 </div>
                 <div className="flex items-center gap-2">
                   <p className="text-sm text-gray-700">{loadingEvent.content}</p>
                   {!loadingTasks.length && (
                   <div className="flex space-x-1">
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                   </div>
                   )}
                 </div>

                 {/* Loading task checklist */}
                 {loadingTasks.length > 0 && (
                   <div className="mt-3 space-y-2">
                     {loadingTasks.map((t, idx) => (
                       <div key={`lt_${idx}`} className="flex items-center gap-2 text-sm">
                         {t.done ? (
                           <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                         ) : (
                           <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin" />
                         )}
                         <span className={t.done ? 'text-gray-600 line-through' : 'text-gray-700'}>{t.text}</span>
                       </div>
                     ))}
                   </div>
                 )}
                 
                 {/* Loading Metadata */}
                 {loadingEvent.metadata && (
                   <div className="mt-3 p-3 bg-white rounded-md border">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                       {loadingEvent.metadata.jobTitle && (
                         <div className="flex items-center gap-1">
                           <FileText className="h-3 w-3 text-gray-500" />
                           <span className="font-medium">{loadingEvent.metadata.jobTitle}</span>
                         </div>
                       )}
                       {loadingEvent.metadata.company && (
                         <div className="flex items-center gap-1">
                           <Building2 className="h-3 w-3 text-gray-500" />
                           <span>{loadingEvent.metadata.company}</span>
                         </div>
                       )}
                       {loadingEvent.metadata.location && (
                         <div className="flex items-center gap-1">
                           <MapPin className="h-3 w-3 text-gray-500" />
                           <span>{loadingEvent.metadata.location}</span>
                         </div>
                       )}
                       {loadingEvent.metadata.salary && (
                         <div className="flex items-center gap-1">
                           <DollarSign className="h-3 w-3 text-gray-500" />
                           <span>{loadingEvent.metadata.salary}</span>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
               </div>
             </div>
           )}

           {/* Application Summary Section - Disabled */}
           {false && applicationDetails && !isRunning && applicationDetails.application.status && (
             <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
               <div className="flex items-center gap-3 mb-4">
                 <CheckCircle className="h-6 w-6 text-green-600" />
                 <h3 className="text-lg font-semibold text-gray-900">🎉 Bewerbung erfolgreich erstellt!</h3>
               </div>
               
               {/* Job Summary */}
               {applicationDetails.job && applicationDetails.job[0] && (
                 <div className="mb-6 p-4 bg-white rounded-lg border">
                   <h4 className="font-medium text-gray-900 mb-2">📋 Job-Details</h4>
                   <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <Building2 className="h-4 w-4 text-gray-500" />
                       <span className="text-sm text-gray-700">
                         <strong>{applicationDetails.job[0].title}</strong>
                         {applicationDetails.job[0].company_id && ` bei Unternehmen ID: ${applicationDetails.job[0].company_id}`}
                       </span>
                     </div>
                     {applicationDetails.job[0].description?.description_original && (
                       <div className="flex items-start gap-2">
                         <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                         <div className="text-sm text-gray-700">
                           <p className="font-medium">Beschreibung:</p>
                           <p className="mt-1">{applicationDetails.job[0].description.description_original}</p>
                         </div>
                       </div>
                     )}
                     {applicationDetails.job[0].apply_link && (
                       <div className="flex items-center gap-2">
                         <ExternalLink className="h-4 w-4 text-gray-500" />
                         <a 
                           href={applicationDetails.job[0].apply_link} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-sm text-blue-600 hover:text-blue-800 underline"
                         >
                           Zur Stellenanzeige
                         </a>
                       </div>
                     )}
                   </div>
                 </div>
               )}

               {/* Documents Summary */}
               {applicationDetails.documents?.document_list && applicationDetails.documents.document_list.length > 0 && (
                 <div className="mb-6">
                   <h4 className="font-medium text-gray-900 mb-3">📄 Erstellte Dokumente</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {applicationDetails.documents.document_list.map((doc, index) => (
                       <div key={doc.id || index} className="p-4 bg-white rounded-lg border">
                         <DocumentPreviewCard 
                           document={doc} 
                           onDownload={() => {}} 
                           showDownload={true}
                         />
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Action Buttons */}
               <div className="flex flex-wrap gap-3">
                 {applicationDetails.documents?.document_list && applicationDetails.documents.document_list.length > 0 && (
                   <Button 
                     onClick={() => {
                       // Download all documents
                       applicationDetails.documents.document_list.forEach((doc, index) => {
                         setTimeout(() => {
                           const link = document.createElement('a');
                           link.href = doc.document_url || '';
                           link.download = doc.document_name || `document_${index + 1}.pdf`;
                           link.click();
                         }, index * 500); // Stagger downloads
                       });
                     }}
                     className="bg-green-600 hover:bg-green-700 text-white"
                   >
                     <Download className="h-4 w-4 mr-2" />
                     Alle Dokumente herunterladen
                   </Button>
                 )}
                 
                 <Button 
                   variant="outline" 
                   onClick={() => {
                     setShowForm(true);
                     fetchResumes(true);
                   }}
                 >
                   <Plus className="h-4 w-4 mr-2" />
                   Neue Bewerbung starten
                 </Button>
               </div>
             </div>
           )}
           </div>
         )}

        {/* Floating Control Menu */}
        {false && !showForm && !isLoadingApplication && (
          <div className="fixed bottom-6 right-6 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg" 
                className={`rounded-full w-16 h-16 shadow-lg ${
                  isRunning 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleStart} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                Start
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePause} disabled={!isRunning}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleStop}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem disabled>
                <Clock className="h-4 w-4 mr-2" />
                Verbleibende Schritte: {remainingSteps}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        )}

         {/* Floating Status Container */}
         {false && !showForm && !isLoadingApplication && (
           <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
             <div className="flex items-center justify-between bg-white border border-gray-200 rounded-full shadow-lg overflow-hidden min-w-[400px]">
               {/* Status Indicator */}
               <div className="flex items-center gap-3 px-6 py-3">
                 <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-yellow-500'}`} />
                 <span className="text-sm font-medium text-gray-700">
                   {isRunning ? '🚀 Läuft' : '⏸️ Pausiert'}
                 </span>
               </div>
               
               {/* Start/Stop Button */}
               <button
                 onClick={isRunning ? handleStop : handleStart}
                 className={`flex items-center gap-2 px-6 py-3 transition-colors ${
                   isRunning 
                     ? 'hover:bg-gray-50' 
                     : 'bg-[#0F973D] text-white hover:bg-[#0E8A36]'
                 }`}
               >
                 <span className="text-sm font-medium">
                   {isRunning ? '⏹️ Stoppen' : '▶️ Starten'}
                 </span>
                 {isRunning ? (
                   <div className="flex gap-0.5">
                     <div className="w-0.5 h-3 bg-gray-500"></div>
                     <div className="w-0.5 h-3 bg-gray-500"></div>
                   </div>
                 ) : (
                   <Play className="h-3 w-3" />
                 )}
               </button>
             </div>
           </div>
         )}

         {/* Resume Picker Modal */}
         <Dialog open={resumeModalOpen} onOpenChange={setResumeModalOpen}>
           <DialogContent className="max-w-7xl w-[98vw] max-h-[90vh]">
             <DialogHeader className="mb-6">
               <DialogTitle className="text-2xl font-bold text-center">
                 Wähle deinen Base-Lebenslauf 🚀
               </DialogTitle>
               <p className="text-center text-muted-foreground mt-2">
                 Pick dein bestehendes CV als Grundlage für die KI-Generierung
               </p>
             </DialogHeader>
             
             <div className="overflow-y-auto max-h-[60vh]">
               {resumesLoading ? (
                 <div className="flex gap-4 overflow-x-auto pb-4">
                   {Array.from({ length: 6 }).map((_, index) => (
                     <DocumentSkeleton key={index} className="min-w-[300px] flex-shrink-0" />
                   ))}
                 </div>
               ) : resumes.length === 0 ? (
                 <div className="text-center py-8">
                   <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                     <FileText className="h-12 w-12 text-gray-400" />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
                     Noch kein Base-Lebenslauf vorhanden 😅
                   </h3>
                   <p className="text-gray-600 mb-6 max-w-md mx-auto">
                     Erstelle deinen ersten Lebenslauf, um mit der KI-Generierung zu starten
                   </p>
                   <Button 
                     onClick={() => {
                       setResumeModalOpen(false);
                       window.location.href = '/dashboard/resume-generate';
                     }}
                     className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
                   >
                     <FileText className="mr-2 h-4 w-4" />
                     Lebenslauf erstellen
                   </Button>
                 </div>
               ) : (
                 <div className="flex gap-4 overflow-x-auto pb-4">
                   {resumes.map((resume) => (
                     <div key={resume.id} onClick={() => handleSelectResume(resume)} className="flex-shrink-0">
                       <DocumentPreviewCard
                         document={resume}
                       />
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </DialogContent>
         </Dialog>

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