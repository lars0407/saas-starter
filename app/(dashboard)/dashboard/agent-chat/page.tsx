'use client';

import { useState, useEffect } from 'react';
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
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  };
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

export default function AgentChatPage() {
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
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  
  // Form state for job details
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    url: ''
  });

  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');

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
          const convertedEvents: AgentEvent[] = data.application.events.map((event: any, index: number) => ({
            id: `${event.event_id}_${index}`, // Use event_id + index to ensure uniqueness
            type: 'action' as const,
            timestamp: new Date(event.timestamp),
            content: `✅ ${event.event_type.replace(/_/g, ' ')} - ${event.event_status}`,
            status: event.event_status === 'done' ? 'success' : 'pending'
          }));
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
    } else {
      // Load application details if ID is present
      loadApplicationDetails(jobId);
      setShowForm(false);
    }
  }, [jobId]);

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
        'job imported': 'Job wurde erfolgreich importiert',
        'resume created': 'Lebenslauf wurde erstellt',
        'coverletter created': 'Anschreiben wurde erstellt',
        'application submitted': 'Bewerbung wurde eingereicht',
        'job search': 'Job-Suche wurde durchgeführt',
        'document generation': 'Dokument wurde generiert'
      };
      
      const translatedAction = actionMap[action.toLowerCase()] || action;
      return {
        action: translatedAction,
        status: status === 'done' ? 'Abgeschlossen' : 'In Bearbeitung'
      };
    }
    
    return {
      action: event.content,
      status: event.status === 'success' ? 'Erfolgreich' : event.status === 'error' ? 'Fehler' : 'In Bearbeitung'
    };
  };

  const getRelatedDocument = (event: AgentEvent) => {
    if (!applicationDetails?.documents?.document_list) return null;
    
    // Extract event type from content if it's from API
    const eventType = event.content.match(/✅ (.+) - (.+)/);
    if (eventType) {
      const [, action] = eventType;
      const actionLower = action.toLowerCase();
      
      // Map event types to document types
      if (actionLower.includes('resume') || actionLower.includes('lebenslauf')) {
        return applicationDetails.documents.document_list.find(doc => doc.type === 'resume');
      } else if (actionLower.includes('coverletter') || actionLower.includes('anschreiben')) {
        return applicationDetails.documents.document_list.find(doc => doc.type === 'cover letter');
      }
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
  };

  const addEvent = (event: AgentEvent) => {
    setEvents(prev => [...prev, event]);
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
      let apiData: any = null;
      try {
        // Check if we have an ID parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const applicationId = urlParams.get('id');
        
        const requestBody: any = {
          job_title: jobDetails.title,
          job_description: jobDetails.description,
          job_url: jobDetails.url
        };
        
        // Only include application_agent_id if URL parameter exists
        if (applicationId) {
          requestBody.application_agent_id = parseInt(applicationId);
        }

        const response = await fetch('https://api.jobjaeger.de/api:BP7K6-ZQ/v2/agent/application/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          apiData = await response.json();
          console.log('API Response:', apiData);
          apiSuccess = true;
          
          // Process the real API response
          if (apiData.events && apiData.events.length > 0) {
            // Clear existing events and add real ones from API
            setEvents([]);
            
            // Add each event from the API response
            apiData.events.forEach((event: any, index: number) => {
              setTimeout(() => {
                addEvent({
                  id: `${event.event_id}_${index}`, // Use event_id + index to ensure uniqueness
                  type: 'action',
                  timestamp: new Date(event.timestamp),
                  content: `✅ ${event.event_type.replace(/_/g, ' ')} - ${event.event_status}`,
                  status: event.event_status === 'done' ? 'success' : 'pending'
                });
              }, index * 500); // Stagger events by 500ms each
            });
          }
        } else {
          console.warn('API returned error, falling back to simulation');
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to simulation:', apiError);
      }

      // Stop loading and add success event
      stopLoadingEvent();
      addEvent({
        id: Date.now().toString(),
        type: 'message',
        timestamp: new Date(),
        content: apiSuccess 
          ? 'Bewerbung erfolgreich gestartet! Der Agent beginnt mit der automatischen Job-Suche...'
          : 'Bewerbung gestartet (Demo-Modus)! Der Agent beginnt mit der automatischen Job-Suche...'
      });

      // Only add simulation events if API didn't provide real events
      if (!apiSuccess || !apiData?.events || apiData.events.length === 0) {
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
                  Job-Bewerbung starten
                </CardTitle>
                <p className="text-muted-foreground">
                  Geben Sie die Job-Details ein oder fügen Sie eine Job-URL hinzu, um mit der automatischen Bewerbung zu beginnen.
                </p>
              </CardHeader>
              <CardContent>
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                   <TabsList className="grid w-full grid-cols-2">
                     <TabsTrigger value="details" className="flex items-center gap-2">
                       <FileText className="h-4 w-4" />
                       Job-Details
                     </TabsTrigger>
                     <TabsTrigger value="url" className="flex items-center gap-2" disabled>
                       <Link className="h-4 w-4" />
                       Job-URL (Coming Soon)
                     </TabsTrigger>
                   </TabsList>

                  <TabsContent value="details" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job-Titel *</Label>
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
                       <Label htmlFor="description">Job-Beschreibung *</Label>
                       <Textarea
                         id="description"
                         placeholder="Beschreiben Sie die Stelle..."
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
                      <Label htmlFor="jobUrl">Job-URL (optional)</Label>
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
                        Optional: Fügen Sie die URL der Job-Stelle hinzu für zusätzliche Informationen.
                      </p>
                    </div>
                  </TabsContent>

                </Tabs>

                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    onClick={handleStartApplication}
                    disabled={!isFormValid()}
                    className="bg-[#0F973D] hover:bg-[#0F973D]/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Bewerbung starten
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
           <div className="flex-1 overflow-y-auto px-24 py-4 space-y-4">
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
                       {event.type === 'message' ? 'Jobjäger Agent' : 'System'}
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
                 
                 {/* Job Metadata */}
                 {event.metadata && (
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
                     {loadingEvent.type === 'message' ? 'Jobjäger Agent' : 'System'}
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
                   <div className="flex space-x-1">
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                   </div>
                 </div>
                 
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
           </div>
         )}

        {/* Floating Control Menu */}
        {!showForm && !isLoadingApplication && (
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
         {!showForm && !isLoadingApplication && (
           <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
             <div className="flex items-center justify-between bg-white border border-gray-200 rounded-full shadow-lg overflow-hidden min-w-[400px]">
               {/* Status Indicator */}
               <div className="flex items-center gap-3 px-6 py-3">
                 <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-yellow-500'}`} />
                 <span className="text-sm font-medium text-gray-700">
                   {isRunning ? 'Wird ausgeführt' : 'Pausiert'}
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
                   {isRunning ? 'Stoppen' : 'Starten'}
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

      </div>
    </div>
  );
} 