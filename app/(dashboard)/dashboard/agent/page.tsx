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
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

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

  const handleStartApplication = () => {
    router.push('/dashboard/agent-chat?reset=true');
  };

  const loadApplications = async () => {
    setIsLoadingApplications(true);
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

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Jobjäger Agent</h1>
          <Badge variant="secondary" className="bg-[#0F973D] text-white">
            Beta
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-4xl">
          Der Jobjäger Agent ist Ihr 24/7 automatisierter Job-Assistent, der Jobs findet und sofort bewirbt, 
          sobald sie gepostet werden. Er passt Lebensläufe für jede Rolle an, umgeht ATS-Filter und stellt sicher, 
          dass Sie mit optimierten Bewerbungen, die mehr Interviews landen, an erster Stelle stehen.
        </p>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleStartApplication}
            className="bg-[#0F973D] hover:bg-[#0F973D]/90 text-white px-6 py-3 text-lg font-semibold"
          >
            <Play className="h-5 w-5 mr-2" />
            Bewerbung starten
          </Button>
          <Button variant="link" className="p-0 h-auto text-[#0F973D]" disabled>
            Tutorials anzeigen
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matched-jobs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Passende Jobs
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Ihre Bewerbungen
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            E-Mail
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matched-jobs" className="space-y-6">
          {/* Application Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Während der Entwicklung haben Sie </span>
                    <span className="font-bold bg-[#0F973D]/10 px-2 py-1 rounded-md text-[#0F973D]">unbegrenzte Job-Bewerbungen</span>
                    <span className="text-muted-foreground">.</span>
                  </span>
                </div>
                <Button className="bg-[#0F973D] hover:bg-[#0F973D]/90" disabled>
                  Paket kaufen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button className="bg-[#0F973D] hover:bg-[#0F973D]/90" disabled>
                    Alle bewerben
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Aktualisieren
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={prioritizeRemote}
                      onCheckedChange={setPrioritizeRemote}
                    />
                    <span className="text-sm">Remote-Jobs priorisieren</span>
                  </div>
                  <Select value={matchingRate} onValueChange={setMatchingRate}>
                    <SelectTrigger className="w-40">
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
              </div>
            </CardContent>
          </Card>

          {/* Job List */}
          <Card>
            <CardHeader>
              <CardTitle>Passende Job-Möglichkeiten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Job-Empfehlungen kommen bald</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Wir arbeiten an der Integration intelligenter Job-Empfehlungen, die perfekt auf Ihr Profil abgestimmt sind. 
                  Diese Funktion wird in Kürze verfügbar sein.
                </p>
              </div>
              
              {/* Hidden table structure for development - DO NOT DELETE */}
              <div className="hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Position</th>
                        <th className="text-left py-3 px-4 font-medium">Standort</th>
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

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Ihre Bewerbungen
                {isLoadingApplications && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingApplications ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Bewerbungen werden geladen...</p>
                </div>
              ) : !Array.isArray(applications) || applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Noch keine Bewerbungen</h3>
                  <p className="text-muted-foreground">
                    Ihre Job-Bewerbungen werden hier angezeigt, sobald Sie mit dem Bewerben beginnen.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Position</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Erstellt</th>
                        <th className="text-left py-3 px-4 font-medium">Standort</th>
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
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              {application.job[0]?.title || 'Unbekannte Position'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {application.id}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={application.status === 'created' ? 'default' : 'secondary'}
                              className={application.status === 'created' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {application.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {new Date(application.created_at).toLocaleDateString('de-DE')}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {application.job[0]?.job_city && application.job[0]?.job_country 
                              ? `${application.job[0].job_city}, ${application.job[0].job_country}`
                              : 'Nicht angegeben'
                            }
                          </td>
                          <td className="py-4 px-4">
                            {application.events && application.events.length > 0 ? (
                              <div className="space-y-1">
                                {application.events.slice(-1).map((event, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className={`w-2 h-2 rounded-full ${
                                      event.event_status === 'done' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`} />
                                    <span className="text-muted-foreground">
                                      {event.event_type.replace(/_/g, ' ')}
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
                                <Download className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Diese Funktion wird bald verfügbar sein.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
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
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-[#0F973D] hover:bg-[#0F973D]/90 shadow-lg"
      >
        <Play className="h-6 w-6" />
      </Button>
    </div>
  );
} 