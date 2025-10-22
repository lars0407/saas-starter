'use client';

import { useState, useEffect } from 'react';
import { 
  Send, 
  RefreshCw, 
  Download, 
  FileText, 
  Mail, 
  User, 
  Play, 
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Loader2,
  X,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { DashboardBreadcrumb, breadcrumbConfigs } from "@/components/dashboard-breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from 'next/link';
import type { JobDetails } from '@/components/agent-chat/types';
import { useJobApplication } from '@/components/agent-chat/hooks/use-job-application';
import { toast } from 'sonner';

interface Job {
  id: string;
  role: string;
  location: string;
  company: string;
  matchingRate: 'Hoch' | 'Mittel' | 'Niedrig';
  status: 'Beworben' | 'Ausstehend' | 'Abgelehnt';
  appliedDate?: string;
}

interface Application {
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
  auto_apply?: {
    id: number;
    created_at: number;
    job_id: number;
    user_id: number;
    status: string;
    output: string;
    updated_at: number;
    application_data: string;
    task_id: string;
    logs: any;
    session_id: string;
    session_status: string;
    document_resume_id: number;
    workflow_id: string;
    output_video_url: string;
    workflow_runs: number;
    isSuccess: boolean;
    steps: any;
    session: any;
  };
  job: Array<{
    id: number;
    created_at: number;
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
  }>;
}

// Function to translate event types to German
const translateEventType = (eventType: string): string => {
  const translations: { [key: string]: string } = {
    'job_imported': 'Job importiert',
    'autoapply_created': 'Auto-Bewerbung erstellt',
    'Application successful': 'Bewerbung erfolgreich',
    'Bewerbung erfolgreich': 'Bewerbung erfolgreich',
    'Application failed': 'Bewerbung gescheitert',
    'job_linked': 'Job geladen',
    'job_created': 'Job erstellt',
    'application_created': 'Bewerbung erstellt',
    'document_generated': 'Dokument generiert',
    'email_sent': 'E-Mail gesendet',
    'status_updated': 'Status aktualisiert',
    'cover_letter_created': 'Anschreiben erstellt',
    'cover letter created': 'Anschreiben erstellt',
    'resume_created': 'Lebenslauf erstellt',
    'resume created': 'Lebenslauf erstellt'
  };
  
  return translations[eventType] || eventType.replace(/_/g, ' ');
};

const mockJobs: Job[] = [
  {
    id: '1',
    role: 'Healthcare Compliance Berater',
    location: 'Berlin, Deutschland',
    company: 'Protiviti',
    matchingRate: 'Mittel',
    status: 'Ausstehend'
  },
  {
    id: '2',
    role: 'Senior Umweltberater',
    location: 'München, Deutschland',
    company: 'Hanchey',
    matchingRate: 'Mittel',
    status: 'Ausstehend'
  },
  {
    id: '3',
    role: 'Complex Claims Berater (Healthcare)',
    location: 'Hamburg, Deutschland',
    company: 'CNA Insurance',
    matchingRate: 'Mittel',
    status: 'Ausstehend'
  },
  {
    id: '4',
    role: 'SAP S/4 FICO Berater bei Rizing',
    location: 'Frankfurt, Deutschland',
    company: 'Rizing',
    matchingRate: 'Mittel',
    status: 'Ausstehend'
  },
  {
    id: '5',
    role: 'Oracle Health Revenue Cycle Solutions Berater',
    location: 'Stuttgart, Deutschland',
    company: 'Huron Consulting Group Inc.',
    matchingRate: 'Mittel',
    status: 'Ausstehend'
  },
  {
    id: '6',
    role: 'Healthcare Strategy & Operations Berater',
    location: 'Düsseldorf, Deutschland',
    company: 'Impact Advisors',
    matchingRate: 'Mittel',
    status: 'Ausstehend'
  },
  {
    id: '7',
    role: 'SAP - Finance Senior Berater',
    location: 'Köln, Deutschland',
    company: 'EY',
    matchingRate: 'Mittel',
    status: 'Ausstehend'
  },
  {
    id: '8',
    role: 'Healthcare Consulting Manager - Workforce',
    location: 'Dortmund, Deutschland',
    company: 'Huron Consulting Group',
    matchingRate: 'Niedrig',
    status: 'Ausstehend'
  },
  {
    id: '9',
    role: 'HR und Operations Assistent',
    location: 'Leipzig, Deutschland',
    company: 'Mainland',
    matchingRate: 'Niedrig',
    status: 'Ausstehend'
  },
  {
    id: '10',
    role: 'Assistant Cafe Manager - Berlin Mitte',
    location: 'Berlin, Deutschland',
    company: 'Chobani',
    matchingRate: 'Niedrig',
    status: 'Ausstehend'
  }
];

export default function JobjaegerAgentPage() {
  const [prioritizeRemote, setPrioritizeRemote] = useState(false);
  const [matchingRate, setMatchingRate] = useState('all');
  const [applicationsRemaining, setApplicationsRemaining] = useState(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [activeTab, setActiveTab] = useState('matched-jobs');
  const router = useRouter();

  // Recommendations state
  type CompanyInfo = {
    employer_name?: string;
  };

  type JobInfo = {
    id: number;
    title: string;
    job_city?: string;
    job_state?: string;
    job_country?: string;
    job_employement_type?: string;
    salary?: string;
    seniority?: string;
    source?: string;
    apply_link?: string;
    company?: CompanyInfo;
  };

  type RecommendationItem = {
    id: number;
    score?: string;
    matchReason?: string;
    job: JobInfo[];
  };

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingMoreRecs, setIsLoadingMoreRecs] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  const [recPage, setRecPage] = useState(1);
  const [hasMoreRecs, setHasMoreRecs] = useState(false);

  const { handleStartApplication } = useJobApplication();
  const [applyingIds, setApplyingIds] = useState<Set<number>>(new Set());

  const handleStartApplicationNavigation = () => {
    router.push('/dashboard/agent-chat?reset=true');
  };

  const startApplicationFromRecommendation = async (item: RecommendationItem) => {
    const j = item.job && item.job[0] ? item.job[0] : undefined;
    if (!j) return;
    
    // Add to applying state to show loading
    setApplyingIds(prev => new Set(prev).add(item.id));
    
    try {
      const authToken = getCookie('token');
      if (!authToken) {
        toast.error('Kein Authentifizierungstoken gefunden. Bitte melden Sie sich erneut an.');
        return;
      }

      const response = await fetch('https://api.jobjaeger.de/api:BP7K6-ZQ/v2/agent/application/queue/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ 
          job_id: j.id 
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Nicht autorisiert. Bitte melden Sie sich erneut an.');
        } else if (response.status === 400) {
          toast.error('Eingabefehler. Bitte überprüfen Sie die Job-Daten.');
        } else {
          toast.error('Fehler beim Erstellen der Bewerbung.');
        }
        return;
      }

      const applicationData = await response.json();
      console.log('Application created:', applicationData);
      
      // Remove the job from recommendations list
      setRecommendations(prev => prev.filter(rec => rec.id !== item.id));
      
      toast.success('Bewerbung erfolgreich erstellt!');
      
    } catch (error: any) {
      console.error('Error creating application:', error);
      toast.error('Fehler beim Erstellen der Bewerbung.');
    } finally {
      // Remove from applying state
      setApplyingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const fetchRecommendations = async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMoreRecs(true);
    } else {
      setIsLoadingRecommendations(true);
    }
    setRecommendationsError(null);

    try {
      const authToken = getCookie('token');
      if (!authToken) {
        throw new Error('Kein Authentifizierungstoken gefunden. Bitte melden Sie sich erneut an.');
      }

      const currentPage = isLoadMore ? recPage + 1 : 1;
      const offset = (currentPage - 1) * 25;

      const response = await fetch('https://api.jobjaeger.de/api:bxPM7PqZ/v3/job/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ offset, perPage: 25 }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setRecommendationsError('Nicht autorisiert. Bitte melden Sie sich erneut an.');
        } else if (response.status === 400) {
          setRecommendationsError('Eingabefehler. Bitte überprüfen Sie Ihr Suchprofil.');
        } else {
          setRecommendationsError('Fehler beim Laden der Empfehlungen.');
        }
        setRecommendations(isLoadMore ? recommendations : []);
        setHasMoreRecs(false);
        return;
      }

      const data = await response.json();
      const rec = data?.recommendation;
      const items: RecommendationItem[] = Array.isArray(rec?.items) ? rec.items : [];

      if (isLoadMore) {
        setRecommendations(prev => [...prev, ...items]);
        setRecPage(currentPage);
      } else {
        setRecommendations(items);
        setRecPage(1);
      }

      // Determine if more pages exist
      if (typeof rec?.nextPage === 'number' && typeof rec?.curPage === 'number') {
        setHasMoreRecs(rec.nextPage > rec.curPage);
      } else if (typeof rec?.itemsTotal === 'number' && typeof rec?.perPage === 'number') {
        const totalLoaded = (isLoadMore ? (recommendations.length + items.length) : items.length);
        setHasMoreRecs(totalLoaded < rec.itemsTotal);
      } else {
        setHasMoreRecs(items.length === 25);
      }
    } catch (error: any) {
      setRecommendationsError(error?.message || 'Unbekannter Fehler beim Laden der Empfehlungen.');
      if (!isLoadMore) {
        setRecommendations([]);
      }
      setHasMoreRecs(false);
    } finally {
      if (isLoadMore) {
        setIsLoadingMoreRecs(false);
      } else {
        setIsLoadingRecommendations(false);
      }
    }
  };

  // Load recommendations automatically when opening the page
  useEffect(() => {
    if (activeTab === 'matched-jobs' && !hasAttemptedLoad) {
      setHasAttemptedLoad(true);
      fetchRecommendations(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Track if we've attempted to load recommendations at least once
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const loadApplications = async () => {
    setIsLoadingApplications(true);
    try {
      const authToken = getCookie('token');
      
      if (!authToken) {
        throw new Error('Kein Authentifizierungstoken gefunden. Bitte melden Sie sich erneut an.');
      }

      const response = await fetch('https://api.jobjaeger.de/api:BP7K6-ZQ/application_agent', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Applications loaded:', data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setApplications(data);
        } else if (data && Array.isArray(data.items)) {
          setApplications(data.items);
        } else if (data && Array.isArray(data.applications)) {
          setApplications(data.applications);
        } else if (data && Array.isArray(data.data)) {
          setApplications(data.data);
        } else {
          console.warn('Unexpected API response format:', data);
          setApplications([]);
        }
      } else {
        console.error('Failed to load applications:', response.status);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'applications') {
      loadApplications();
    } else if (value === 'matched-jobs') {
      fetchRecommendations(false);
    }
  };

  const handleApplicationClick = (applicationId: number) => {
    router.push(`/dashboard/agent-chat?id=${applicationId}`);
  };

  const getMatchingRateColor = (rate: string) => {
    switch (rate) {
      case 'Hoch':
        return 'bg-green-100 text-green-800';
      case 'Mittel':
        return 'bg-yellow-100 text-yellow-800';
      case 'Niedrig':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Beworben':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Ausstehend':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Abgelehnt':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Helpers for UI formatting
  const formatScorePercent = (score?: string) => {
    if (!score) return '—';
    const n = Number(score);
    if (Number.isFinite(n)) {
      // Assume 0-1 scale; if >1 assume already percent
      const pct = n <= 1 ? Math.round(n * 100) : Math.round(n);
      return `${pct}%`;
    }
    // Try to parse like '0.87' inside string
    const parsed = parseFloat(score);
    if (!isNaN(parsed)) {
      const pct = parsed <= 1 ? Math.round(parsed * 100) : Math.round(parsed);
      return `${pct}%`;
    }
    return score;
  };

  const timeAgo = (dateLike?: number | string) => {
    if (!dateLike) return '';
    let date: Date;
    if (typeof dateLike === 'number') {
      date = new Date(dateLike);
    } else if (!isNaN(Date.parse(dateLike))) {
      date = new Date(dateLike);
    } else {
      return '';
    }
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const intervals: [number, string][] = [
      [31536000, 'Jahr'],
      [2592000, 'Monat'],
      [604800, 'Woche'],
      [86400, 'Tag'],
      [3600, 'Stunde'],
      [60, 'Minute'],
    ];
    for (const [sec, label] of intervals) {
      const count = Math.floor(seconds / sec);
      if (count >= 1) return `${count} ${label}${count > 1 ? 'n' : ''} ago`;
    }
    return 'Gerade eben';
  };

  // Helper function to translate employment types to German
  const translateEmploymentType = (type: string) => {
    switch (type) {
      case 'Full-time':
      case 'FULL_TIME':
        return 'Vollzeit'
      case 'Part-time':
      case 'PART_TIME':
        return 'Teilzeit'
      case 'Temporary':
      case 'TEMPORARY':
        return 'Befristet'
      case 'Contract':
      case 'FREELANCE':
        return 'Vertrag'
      case 'Internship':
      case 'INTERN':
        return 'Praktikum'
      default:
        return type
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
          <DashboardBreadcrumb items={breadcrumbConfigs.agent} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Page Header */}
        <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Jobjäger Agent</h1>
          <Badge variant="secondary" className="bg-[#0F973D] text-white w-fit">
            Beta
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-4xl text-sm md:text-base">
          Der Jobjäger Agent ist Ihr 24/7 automatisierter Job-Assistent, der Jobs findet und sofort bewirbt, 
          sobald sie gepostet werden. Er passt Lebensläufe für jede Rolle an, umgeht ATS-Filter und stellt sicher, 
          dass Sie mit optimierten Bewerbungen, die mehr Interviews landen, an erster Stelle stehen.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button 
            onClick={handleStartApplicationNavigation}
            className="bg-[#0F973D] hover:bg-[#0F973D]/90 text-white px-6 py-3 text-lg font-semibold w-full sm:w-auto"
          >
            <Play className="h-5 w-5 mr-2" />
            Bewerbung starten
          </Button>
          <Button variant="link" className="p-0 h-auto text-[#0F973D] w-fit" disabled>
            Tutorials anzeigen
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 md:space-y-6">
        <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => handleTabChange('matched-jobs')}
            className={`flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-3 py-2 rounded-md transition-colors ${
              activeTab === 'matched-jobs' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Passende Jobs</span>
            <span className="sm:hidden">Jobs</span>
          </button>
          <button
            onClick={() => handleTabChange('applications')}
            className={`flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-3 py-2 rounded-md transition-colors ${
              activeTab === 'applications' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Deine Bewerbungen</span>
            <span className="sm:hidden">Bewerbungen</span>
          </button>
          <button
            onClick={() => handleTabChange('email')}
            className={`flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-3 py-2 rounded-md transition-colors ${
              activeTab === 'email' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Mail className="h-3 w-3 md:h-4 md:w-4" />
            E-Mail
          </button>
          <button
            onClick={() => handleTabChange('profile')}
            className={`flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm px-3 py-2 rounded-md transition-colors ${
              activeTab === 'profile' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <User className="h-3 w-3 md:h-4 md:w-4" />
            Profil
          </button>
        </div>

        <TabsContent value="matched-jobs" className="space-y-4 md:space-y-6">
          {/* Combined Application Status and Controls */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Application Status Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Während der Entwicklung haben Sie </span>
                      <span className="font-bold bg-[#0F973D]/10 px-2 py-1 rounded-md text-[#0F973D]">unbegrenzte Job-Bewerbungen</span>
                      <span className="text-muted-foreground">.</span>
                    </span>
                  </div>
                  <Button className="bg-[#0F973D] hover:bg-[#0F973D]/90 w-full sm:w-auto" disabled>
                    Paket kaufen
                  </Button>
                </div>
                
                {/* Controls Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Button className="bg-[#0F973D] hover:bg-[#0F973D]/90 w-full sm:w-auto" disabled>
                      Alle bewerben
                    </Button>
                    <Button variant="outline" onClick={() => fetchRecommendations(false)} className="w-full sm:w-auto">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Aktualisieren
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job List */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-0 md:px-6 md:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-lg md:text-xl">Passende Job-Möglichkeiten</CardTitle>
                <Select value={matchingRate} onValueChange={setMatchingRate}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Passungsrate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Raten</SelectItem>
                    <SelectItem value="high">Nur Hoch</SelectItem>
                    <SelectItem value="medium">Nur Mittel</SelectItem>
                    <SelectItem value="low">Nur Niedrig</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 md:px-6 md:pb-6">
              {isLoadingRecommendations ? (
                <div className="text-center py-6 md:py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Empfehlungen werden geladen...</p>
                </div>
              ) : recommendationsError ? (
                <div className="text-center py-6 md:py-8">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Fehler beim Laden</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">{recommendationsError}</p>
                </div>
              ) : !hasAttemptedLoad ? (
                <div className="text-center py-8 md:py-12">
                  <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold mb-2">Empfehlungen werden geladen...</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Wir suchen die besten Job-Möglichkeiten für dich.
                  </p>
                </div>
              ) : !Array.isArray(recommendations) || recommendations.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Keine Empfehlungen gefunden</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Die Ergebnisse basieren auf deinem Suchprofil. Bitte überprüfe und aktualisiere dein Suchprofil, um bessere Empfehlungen zu erhalten.
                  </p>
                  <div className="mt-4">
                    <Link href="/dashboard/search-profile" className="text-[#0F973D] font-medium underline">
                      Zum Suchprofil
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3 md:space-y-4">
                    {recommendations.map((item) => {
                      const j = item.job && item.job[0] ? item.job[0] : undefined;
                      const location = [j?.job_city, j?.job_state, j?.job_country].filter(Boolean).join(', ');
                      const scorePct = formatScorePercent(item.score);
                      return (
                        <div key={item.id} className="border rounded-lg p-3 md:p-4 hover:bg-muted/30">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-base font-semibold">{j?.title || 'Unbekannte Position'}</div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {location && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-muted">{location}</span>
                                )}
                                {j?.job_employement_type && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-muted">{translateEmploymentType(j.job_employement_type)}</span>
                                )}
                                {j?.seniority && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-muted">{j.seniority}</span>
                                )}
                              </div>
                              {item.matchReason && (
                                <div className="mt-3 text-sm text-muted-foreground">
                                  <span className="font-medium">Begründung:</span> {item.matchReason}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                              <div className="rounded-full border px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 shrink-0">
                                {scorePct}
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled={applyingIds.has(item.id)}
                                onClick={() => startApplicationFromRecommendation(item)}
                                className="flex-1 sm:w-auto sm:flex-none"
                              >
                                {applyingIds.has(item.id) ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Bewerben
                                  </>
                                ) : (
                                  'Bewerben'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {hasMoreRecs && (
                    <div className="flex justify-center mt-4">
                      <Button onClick={() => fetchRecommendations(true)} disabled={isLoadingMoreRecs} variant="outline" className="w-full sm:w-auto">
                        {isLoadingMoreRecs ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Lädt...
                          </>
                        ) : (
                          'Mehr laden'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
              
              {/* Hidden table structure for development - DO NOT DELETE */}
              <div className="hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Position</th>
                        <th className="text-left py-3 px-4 font-medium">Bewerbung</th>
                        <th className="text-left py-3 px-4 font-medium">Unternehmen</th>
                        <th className="text-left py-3 px-4 font-medium">Passungsrate</th>
                        <th className="text-left py-3 px-4 font-medium">Aktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockJobs.map((job) => (
                        <tr key={job.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium">{job.role}</div>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {job.location}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {job.company}
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getMatchingRateColor(job.matchingRate)}>
                              {job.matchingRate}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Button size="sm" className="bg-[#0F973D] hover:bg-[#0F973D]/90">
                              <Zap className="h-4 w-4 mr-2" />
                              Schnell bewerben
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="px-4 pt-0 pb-0 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Deine Bewerbungen</span>
                <span className="sm:hidden">Bewerbungen</span>
                {isLoadingApplications && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-6">
              {isLoadingApplications ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Bewerbungen werden geladen...</p>
                </div>
              ) : !Array.isArray(applications) || applications.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Noch keine Bewerbungen</h3>
                  <p className="text-sm sm:text-base text-muted-foreground px-4">
                    Ihre Job-Bewerbungen werden hier angezeigt, sobald Sie mit dem Bewerben beginnen.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium w-1/3">Position</th>
                          <th className="text-left py-3 px-4 font-medium">Erstellt</th>
                          <th className="text-left py-3 px-4 font-medium">Bewerbung</th>
                          <th className="text-left py-3 px-4 font-medium">Letzte Aktivität</th>
                          <th className="text-left py-3 px-4 font-medium">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((application) => (
                          <tr 
                            key={application.id} 
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleApplicationClick(application.id)}
                          >
                            <td className="py-4 px-4 w-1/3">
                              <div className="font-medium">
                                {application.job[0]?.title || 'Unbekannte Position'}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">
                              {new Date(application.created_at).toLocaleDateString('de-DE')}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center">
                                {application.auto_apply?.isSuccess === true ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <X className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {application.status === 'application_queued' ? (
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                  <span className="text-muted-foreground">Bewerbung in Warteschlange</span>
                                </div>
                              ) : application.events && application.events.length > 0 ? (
                                <div className="space-y-1">
                                  {application.events.slice(-1).map((event, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <div className={`w-2 h-2 rounded-full ${
                                        event.event_status === 'done' ? 'bg-green-500' : 'bg-yellow-500'
                                      }`} />
                                      <span className="text-muted-foreground">
                                        {translateEventType(event.event_type)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">Keine Aktivität</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplicationClick(application.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Details
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {applications.map((application) => (
                      <div 
                        key={application.id} 
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleApplicationClick(application.id)}
                      >
                        <div className="flex flex-col gap-3">
                          {/* Job Title */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm leading-tight">
                                {application.job[0]?.title || 'Unbekannte Position'}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              {application.auto_apply?.isSuccess === true ? (
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>

                          {/* Created Date */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Erstellt:</span>
                            <span>{new Date(application.created_at).toLocaleDateString('de-DE')}</span>
                          </div>

                          {/* Last Activity */}
                          {application.status === 'application_queued' ? (
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full flex-shrink-0 bg-yellow-500" />
                              <span className="text-muted-foreground">Bewerbung in Warteschlange</span>
                            </div>
                          ) : application.events && application.events.length > 0 ? (
                            <div className="flex items-center gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                application.events[application.events.length - 1].event_status === 'done' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                              <span className="text-muted-foreground">
                                {translateEventType(application.events[application.events.length - 1].event_type)}
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Keine Aktivität
                            </div>
                          )}

                          {/* Action Button */}
                          <div className="pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApplicationClick(application.id);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Details anzeigen
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 sm:space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center py-6 sm:py-8">
                <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  Diese Funktion wird bald verfügbar sein.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4 sm:space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center py-6 sm:py-8">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  Diese Funktion wird bald verfügbar sein.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Help Button */}
      <Button
        size="lg"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-[#0F973D] hover:bg-[#0F973D]/90 shadow-lg"
      >
        <Play className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      </div>
    </div>
  );
} 