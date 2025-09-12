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
  Euro
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
  const [events, setEvents] = useState<AgentEvent[]>(demoEvents);
  const [isRunning, setIsRunning] = useState(true);
  const [remainingSteps, setRemainingSteps] = useState(3);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  // Form state for job details
  const [jobDetails, setJobDetails] = useState({
    title: '',
    company: '',
    description: '',
    url: ''
  });

  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');

  useEffect(() => {
    // Show form if no ID parameter is present
    if (!jobId) {
      setShowForm(true);
      setIsRunning(false);
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
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setRemainingSteps(0);
  };

  const handleInputChange = (field: string, value: string) => {
    setJobDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartApplication = () => {
    // TODO: Implement application start logic
    console.log('Starting application with job details:', jobDetails);
    setShowForm(false);
    setIsRunning(true);
  };

  const isFormValid = () => {
    if (activeTab === 'details') {
      return jobDetails.title && jobDetails.company;
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Unternehmen *</Label>
                        <Input
                          id="company"
                          placeholder="z.B. TechCorp GmbH"
                          value={jobDetails.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                        />
                      </div>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="description">Job-Beschreibung</Label>
                      <Textarea
                        id="description"
                        placeholder="Beschreiben Sie die Stelle..."
                        value={jobDetails.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
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

        {/* Chat Messages */}
        {!showForm && (
          <div className="flex-1 overflow-y-auto px-24 py-4 space-y-4">
          {events.map((event) => (
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
                  {event.status && (
                    <Badge 
                      variant={event.status === 'success' ? 'default' : event.status === 'error' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {event.status === 'success' ? 'Erfolgreich' : event.status === 'error' ? 'Fehler' : 'In Bearbeitung'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700">{event.content}</p>
                
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
          ))}
          </div>
        )}

        {/* Floating Control Menu */}
        {!showForm && (
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

        {/* Status Bar */}
        {!showForm && (
          <div className="bg-white border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm text-gray-600">
                  {isRunning ? 'Agent läuft' : 'Agent pausiert'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {events.length} Events
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {remainingSteps} Schritte verbleibend
              </Badge>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
} 