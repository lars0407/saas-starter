'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Star,
  Building2,
  Globe,
  Calendar,
  Target,
  Settings,
  Save,
  X,
  Plus,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from 'sonner';
import { getIntervalValue } from '@/lib/date-publisher';
import { Skeleton } from '@/components/ui/skeleton';
import AddressSearch from '@/components/address-search';

export default function SearchProfilePage() {
  const [searchProfile, setSearchProfile] = useState({
    jobTitle: '',
    jobType: {
      fullTime: true,
      partTime: false,
      temporary: false,
      contract: false,
      internship: false
    },
    employement_type: ['FULL_TIME', 'Not Applicable'] as string[],
    workModel: {
      onsite: true,
      remote: true,
      hybrid: true
    },
    remote_work: ['Kein Homeoffice', 'null', 'Vollständig remote', 'Hybrid', 'Teilweise Homeoffice'] as string[],
    location: '',
    radius: '25km',
    experienceLevel: {
      intern: false,
      entryLevel: true,
      midLevel: true,
      seniorLevel: false,
      leadStaff: false,
      directorExecutive: false
    },
    requiredExperience: [0, 11],
    datePosted: '',
    minSalary: 0,
    selectedLocation: null as { lon: number; lat: number } | null,
    selectedAddress: null as {
      id: number;
      display_name: string;
      lat: number;
      lon: number;
      type: string;
      importance: number;
      address: {
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
        street?: string;
        house_number?: string;
      };
    } | null
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Function to create a new search profile
  const createSearchProfile = async (apiData: any) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]

    if (!token) {
      throw new Error('Nicht angemeldet')
    }

    const response = await fetch("https://api.jobjaeger.de/api:7yCsbR9L/search_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        search_profile: [{
          salary: searchProfile.minSalary,
          range: '',
          roles: [],
          job_title: apiData.job_title,
          search_term: searchProfile.jobTitle || '',
          parameter: {
            type: {
              INTERN: searchProfile.jobType.internship,
              FULL_TIME: searchProfile.jobType.fullTime,
              Freelance: searchProfile.jobType.contract,
              PART_TIME: searchProfile.jobType.partTime,
              TEMPORARY: searchProfile.jobType.temporary
            },
            place: searchProfile.location,
            distance: searchProfile.radius ? parseInt(searchProfile.radius.replace('km', '')) * 1000 : 25000,
            job_titles: apiData.job_title
          },
          adresse: searchProfile.selectedAddress?.display_name || searchProfile.location || '',
          location: {
            adresse: searchProfile.selectedAddress?.display_name || searchProfile.location || '',
            location: searchProfile.selectedLocation ? {
              key: "data.location",
              geo_radius: {
                center: {
                  lon: searchProfile.selectedLocation.lon,
                  lat: searchProfile.selectedLocation.lat
                },
                radius: searchProfile.radius ? parseInt(searchProfile.radius.replace('km', '')) * 1000 : 25000
              }
            } : {}
          },
          job_search_activity: 'casual',
          work_location_preference: 'in-person',
          work_time_preference: 'full-time',
          date_published: apiData.date_published,
          employement_type: apiData.employement_type,
          remote_work: apiData.remote_work,
          type_of_workplace: {
            hybrid: searchProfile.workModel.hybrid,
            remote: searchProfile.workModel.remote,
            onsite: searchProfile.workModel.onsite
          },
          search_type: {
            active: false,
            passive: false,
            curious: false
          },
          salary_expectation: {
            type: 'Monthly salary (gross)',
            amount_eur: searchProfile.minSalary
          }
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fehler beim Erstellen des Suchprofils");
    }

    return response.json();
  }

  const handleSave = async () => {
    // Validate required fields
    if (!searchProfile.jobTitle.trim()) {
      toast.error('Job Titel ist erforderlich');
      return;
    }

    if (searchProfile.employement_type.length === 0) {
      toast.error('Bitte wähle mindestens einen Job-Typ aus');
      return;
    }

    if (searchProfile.remote_work.length === 0) {
      toast.error('Bitte wähle mindestens ein Arbeitsmodell aus');
      return;
    }

    setSaving(true);
    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        toast.error('Nicht angemeldet. Bitte melde dich erneut an.')
        return
      }

      console.log('Saving search profile:', searchProfile);
      console.log('Selected address:', searchProfile.selectedAddress);
      console.log('Selected location:', searchProfile.selectedLocation);
      console.log('Radius:', searchProfile.radius);
      
      // Prepare the data in the format expected by the update API
      const apiData = {
        job_title: searchProfile.jobTitle ? [searchProfile.jobTitle] : [],
        adresse: searchProfile.selectedAddress?.display_name || searchProfile.location || '',
        location: {
          adresse: searchProfile.selectedAddress?.display_name || searchProfile.location || '',
          location: searchProfile.selectedLocation ? {
            key: "data.location",
            geo_radius: {
              center: {
                lon: searchProfile.selectedLocation.lon,
                lat: searchProfile.selectedLocation.lat
              },
              radius: searchProfile.radius ? parseInt(searchProfile.radius.replace('km', '')) * 1000 : 25000
            }
          } : {}
        },
        remote_work: searchProfile.remote_work,
        date_published: getDatePublishedValue(searchProfile.datePosted),
        employement_type: searchProfile.employement_type
      };

      console.log('Sending API data:', apiData);
      console.log('Date published value:', apiData.date_published, 'for selection:', searchProfile.datePosted);
      console.log('Address data being sent:', {
        adresse: apiData.adresse,
        location: apiData.location
      });

      // Try to update first, if it fails, create a new one
      let response = await fetch("https://api.jobjaeger.de/api:7yCsbR9L/search_profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });

      let result;
      if (!response.ok) {
        // If update fails, try to create a new profile
        console.log('Update failed, trying to create new profile...');
        result = await createSearchProfile(apiData);
        toast.success('Neues Suchprofil erfolgreich erstellt! ✨');
      } else {
        result = await response.json();
        toast.success('Suchprofil erfolgreich aktualisiert! 💾');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('search_profile_saved', 'true');
      }

      console.log('Search profile operation successful:', result);
      
    } catch (error: any) {
      console.error('Error saving search profile:', error);
      toast.error(error.message || 'Fehler beim Speichern des Suchprofils');
    } finally {
      setSaving(false);
    }
  };

  // Function to load search profile data from API
  const loadSearchProfile = async () => {
    setLoading(true);
    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        console.log('No auth token found, skipping search profile load')
        return
      }

      console.log('Loading search profile from API...')
      
      const response = await fetch("https://api.jobjaeger.de/api:7yCsbR9L/search_profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error loading search profile:', errorData)
        return
      }

      const data = await response.json()
      console.log('Search profile API response:', data)

      if (data.search_profile && data.search_profile.length > 0) {
        const profile = data.search_profile[0]
        
        // Map API data to local search profile state
        const newSearchProfile = {
          ...searchProfile,
          jobTitle: profile.job_title?.[0] || profile.search_term || '',
          minSalary: profile.salary_expectation?.amount_eur || 0,
          radius: profile.location?.location?.geo_radius?.radius ? `${Math.round(profile.location.location.geo_radius.radius / 1000)}km` : '25km',
          // Handle new address structure
          selectedLocation: profile.location?.location?.geo_radius?.center ? {
            lat: profile.location.location.geo_radius.center.lat,
            lon: profile.location.location.geo_radius.center.lon
          } : null,
          location: profile.location?.adresse || profile.adresse || profile.parameter?.place || '',
          // Handle selected address for AddressSearch component
          selectedAddress: profile.location?.adresse ? {
            id: 0, // We don't have the original ID from the API
            display_name: profile.location.adresse,
            lat: profile.location.location?.geo_radius?.center?.lat || 0,
            lon: profile.location.location?.geo_radius?.center?.lon || 0,
            type: 'loaded',
            importance: 0,
            address: {}
          } : null,
          // Map job types from API arrays
          jobType: {
            fullTime: profile.employement_type?.includes('FULL_TIME') || false,
            partTime: profile.employement_type?.includes('PART_TIME') || false,
            temporary: profile.employement_type?.includes('TEMPORARY') || false,
            contract: profile.employement_type?.includes('FREELANCE') || false,
            internship: profile.employement_type?.includes('INTERN') || false
          },
          // Map work model from API arrays/preferences
          workModel: {
            onsite: profile.remote_work?.includes('Kein Homeoffice') || profile.work_location_preference === 'onsite' || false,
            remote: profile.remote_work?.includes('Vollständig remote') || profile.work_location_preference === 'remote' || false,
            hybrid: profile.remote_work?.includes('Hybrid') || profile.remote_work?.includes('Teilweise Homeoffice') || profile.work_location_preference === 'hybrid' || false
          },
          datePosted: getDatePostedFromValue(profile.date_published),
          employement_type: profile.employement_type || [],
          remote_work: profile.remote_work || []
        }

        console.log('Updating search profile with API data:', newSearchProfile)
        setSearchProfile(newSearchProfile)
        
        // Update employement_type and remote_work based on the new jobType and workModel
        const newEmployementType = getEmployementTypeArray(newSearchProfile.jobType)
        const newRemoteWork = getRemoteWorkArray(newSearchProfile.workModel)
        
        setSearchProfile(prev => ({
          ...prev,
          employement_type: newEmployementType,
          remote_work: newRemoteWork
        }))
        
        toast.success('Suchprofil erfolgreich geladen! 🎯')
      }
    } catch (error) {
      console.error('Error loading search profile:', error)
      toast.error('Fehler beim Laden des Suchprofils')
    } finally {
      setLoading(false);
    }
  }

  // Load search profile data when component mounts
  useEffect(() => {
    loadSearchProfile()
  }, []) // Empty dependency array means this runs once when component mounts

  // Update employement_type and remote_work when jobType or workModel changes
  useEffect(() => {
    const newEmployementType = getEmployementTypeArray(searchProfile.jobType)
    const newRemoteWork = getRemoteWorkArray(searchProfile.workModel)
    
    setSearchProfile(prev => ({
      ...prev,
      employement_type: newEmployementType,
      remote_work: newRemoteWork
    }))
  }, [searchProfile.jobType, searchProfile.workModel])

  // Helper function to get employement_type array based on selected job types
  const getEmployementTypeArray = (jobType: any) => {
    const employementTypes: string[] = []
    
    if (jobType.fullTime) {
      employementTypes.push('FULL_TIME', 'Not Applicable')
    }
    if (jobType.partTime) {
      employementTypes.push('PART_TIME')
    }
    if (jobType.temporary) {
      employementTypes.push('TEMPORARY')
    }
    if (jobType.contract) {
      employementTypes.push('FREELANCE')
    }
    if (jobType.internship) {
      employementTypes.push('INTERN')
    }
    
    // If no options are selected, include all types
    if (employementTypes.length === 0) {
      employementTypes.push('FULL_TIME', 'PART_TIME', 'TEMPORARY', 'FREELANCE', 'INTERN', 'Not Applicable')
    }
    
    return employementTypes
  }

  // Helper function to get remote_work array based on selected work model
  const getRemoteWorkArray = (workModel: any) => {
    const remoteWorkTypes: string[] = []
    
    if (workModel.onsite) {
      remoteWorkTypes.push('Kein Homeoffice', 'null')
    }
    if (workModel.remote) {
      remoteWorkTypes.push('Vollständig remote')
    }
    if (workModel.hybrid) {
      remoteWorkTypes.push('Hybrid', 'Teilweise Homeoffice')
    }
    
    // If no options are selected, include all types
    if (remoteWorkTypes.length === 0) {
      remoteWorkTypes.push('Kein Homeoffice', 'null', 'Vollständig remote', 'Hybrid', 'Teilweise Homeoffice')
    }
    
    return remoteWorkTypes
  }

  // Helper function to convert datePosted selection to numeric value
  const getDatePublishedValue = (datePosted: string): number => {
    switch (datePosted) {
      case 'past24h':
        return 1; // 24 Stunden
      case 'past3days':
        return 3; // 3 Tage
      case 'pastWeek':
        return 7; // 1 Woche
      case 'pastMonth':
        return 30; // 1 Monat
      default:
        return 0; // Keine Auswahl
    }
  }

  // Helper function to convert numeric value back to datePosted selection
  const getDatePostedFromValue = (datePublished: number): string => {
    switch (datePublished) {
      case 1:
        return 'past24h';
      case 3:
        return 'past3days';
      case 7:
        return 'pastWeek';
      case 30:
        return 'pastMonth';
      default:
        return '';
    }
  }

  // Handle address selection
  const handleAddressSelect = (address: any) => {
    setSearchProfile(prev => ({
      ...prev,
      selectedAddress: address,
      location: address.display_name,
      selectedLocation: { lat: address.lat, lon: address.lon }
    }));
  };

  // Skeleton loader components
  const JobTitleSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const JobTypeSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const WorkModelSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const LocationSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-20" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ExperienceLevelSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-36" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DatePostedSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SalaryRangeSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-28" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const clearAll = (section: string) => {
    switch (section) {
      case 'experienceLevel':
        setSearchProfile(prev => ({
          ...prev,
          experienceLevel: {
            intern: false,
            entryLevel: false,
            midLevel: false,
            seniorLevel: false,
            leadStaff: false,
            directorExecutive: false
          }
        }));
        break;
      case 'datePosted':
        setSearchProfile(prev => ({ ...prev, datePosted: '' }));
        break;
      case 'minSalary':
        setSearchProfile(prev => ({ ...prev, minSalary: 0 }));
        break;
    }
  };

  return (
    <div className="p-2 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Suchprofil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-[#0F973D]" />
                <span>Dein Suchprofil – Jobsuche optimieren 🎯</span>
              </div>
              {loading && (
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-[#0F973D]"></div>
                  <span>Lade Suchprofil...</span>
                </div>
              )}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Hier kannst du deine Jobsuche-Präferenzen definieren. Alles safe und vertraulich! 🔒
            </p>
          </div>
          {loading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
            </div>
          ) : (
            <Button 
              onClick={handleSave} 
              disabled={!searchProfile.jobTitle || loading || saving}
              className={`w-full sm:w-auto ${
                !searchProfile.jobTitle || loading || saving
                  ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
                  : 'bg-[#0F973D] hover:bg-[#0F973D]/90'
              }`}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">
                {loading ? 'Laden...' : saving ? 'Speichern...' : !searchProfile.jobTitle ? 'Job Titel erforderlich' : 'Speichern'}
              </span>
              <span className="sm:hidden">
                {loading ? 'Laden...' : saving ? 'Speichern...' : !searchProfile.jobTitle ? 'Titel fehlt' : 'Speichern'}
              </span>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Job Title */}
        {loading ? (
          <JobTitleSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#0F973D]" />
                Job Titel
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Der Job Titel, nach dem du suchst
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="flex items-center gap-1">
                  Job Titel <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="Job Titel eingeben..."
                  value={searchProfile.jobTitle}
                  onChange={(e) => setSearchProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
                />
                {!searchProfile.jobTitle && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-amber-600" />
                      <p className="text-sm text-amber-800">
                        ⚠️ Ein Job Titel muss eingegeben werden, um das Suchprofil zu speichern.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Type */}
        {loading ? (
          <JobTypeSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#0F973D]" />
                Job Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.fullTime}
                    onCheckedChange={(checked: boolean) => {
                      const newJobType = { ...searchProfile.jobType, fullTime: checked }
                      const newEmployementType = getEmployementTypeArray(newJobType)
                      setSearchProfile(prev => ({
                        ...prev,
                        jobType: newJobType,
                        employement_type: newEmployementType
                      }))
                    }}
                    className="data-[state=checked]:bg-[#0F973D]"
                  />
                  <Label>Vollzeit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.partTime}
                    onCheckedChange={(checked: boolean) => {
                      const newJobType = { ...searchProfile.jobType, partTime: checked }
                      const newEmployementType = getEmployementTypeArray(newJobType)
                      setSearchProfile(prev => ({
                        ...prev,
                        jobType: newJobType,
                        employement_type: newEmployementType
                      }))
                    }}
                    className="data-[state=checked]:bg-[#0F973D]"
                  />
                  <Label>Teilzeit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.temporary}
                    onCheckedChange={(checked: boolean) => {
                      const newJobType = { ...searchProfile.jobType, temporary: checked }
                      const newEmployementType = getEmployementTypeArray(newJobType)
                      setSearchProfile(prev => ({
                        ...prev,
                        jobType: newJobType,
                        employement_type: newEmployementType
                      }))
                    }}
                    className="data-[state=checked]:bg-[#0F973D]"
                  />
                  <Label>Befristet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.contract}
                    onCheckedChange={(checked: boolean) => {
                      const newJobType = { ...searchProfile.jobType, contract: checked }
                      const newEmployementType = getEmployementTypeArray(newJobType)
                      setSearchProfile(prev => ({
                        ...prev,
                        jobType: newJobType,
                        employement_type: newEmployementType
                      }))
                    }}
                    className="data-[state=checked]:bg-[#0F973D]"
                  />
                  <Label>Vertrag</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.jobType.internship}
                    onCheckedChange={(checked: boolean) => {
                      const newJobType = { ...searchProfile.jobType, internship: checked }
                      const newEmployementType = getEmployementTypeArray(newJobType)
                      setSearchProfile(prev => ({
                        ...prev,
                        jobType: newJobType,
                        employement_type: newEmployementType
                      }))
                    }}
                    className="data-[state=checked]:bg-[#0F973D]"
                  />
                  <Label>Praktikum</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Work Model */}
        {loading ? (
          <WorkModelSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0F973D]" />
                Arbeitsmodell
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.workModel.onsite}
                    onCheckedChange={(checked: boolean) => {
                      const newWorkModel = { ...searchProfile.workModel, onsite: checked }
                      const newRemoteWork = getRemoteWorkArray(newWorkModel)
                      setSearchProfile(prev => ({
                        ...prev,
                        workModel: newWorkModel,
                        remote_work: newRemoteWork
                      }))
                    }}
                    className="data-[state=checked]:bg-[#0F973D]"
                  />
                  <Label>Vor Ort</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.workModel.remote}
                    onCheckedChange={(checked: boolean) => {
                      const newWorkModel = { ...searchProfile.workModel, remote: checked }
                      const newRemoteWork = getRemoteWorkArray(newWorkModel)
                      setSearchProfile(prev => ({
                        ...prev,
                        workModel: newWorkModel,
                        remote_work: newRemoteWork
                      }))
                    }}
                    className="data-[state=checked]:bg-[#0F973D]"
                  />
                  <Label>Remote</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={searchProfile.workModel.hybrid}
                    onCheckedChange={(checked: boolean) => {
                      const newWorkModel = { ...searchProfile.workModel, hybrid: checked }
                      const newRemoteWork = getRemoteWorkArray(newWorkModel)
                      setSearchProfile(prev => ({
                        ...prev,
                        workModel: newWorkModel,
                        remote_work: newRemoteWork
                      }))
                    }}
                    className="data-[state=checked]:bg-[#0F973D]"
                  />
                  <Label>Hybrid</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        {loading ? (
          <LocationSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#0F973D]" />
                Standort
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Standort</Label>
                <AddressSearch
                  onAddressSelect={handleAddressSelect}
                  placeholder="Adresse oder Stadt eingeben..."
                  initialValue={searchProfile.location}
                  className="flex-1"
                />
                <div className="flex items-center gap-2 mt-3">
                  <Label className="text-sm text-gray-600">Suchradius:</Label>
                  <Select value={searchProfile.radius} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, radius: value }))}>
                    <SelectTrigger className="w-24 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5km">5km</SelectItem>
                      <SelectItem value="10km">10km</SelectItem>
                      <SelectItem value="25km">25km</SelectItem>
                      <SelectItem value="50km">50km</SelectItem>
                      <SelectItem value="100km">100km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                

              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience Level */}
        {loading ? (
          <ExperienceLevelSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0F973D]" />
                Erfahrungslevel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1">
                    Erfahrungslevel
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearAll('experienceLevel')}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                  >
                    Alle löschen
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={searchProfile.experienceLevel.intern}
                      onCheckedChange={(checked: boolean) => 
                        setSearchProfile(prev => ({ 
                          ...prev, 
                          experienceLevel: { ...prev.experienceLevel, intern: checked } 
                        }))
                      }
                      className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                    />
                    <Label htmlFor="intern" className="flex items-center gap-1">
                      Praktikant/Neuer Absolvent
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={searchProfile.experienceLevel.entryLevel}
                      onCheckedChange={(checked: boolean) => 
                        setSearchProfile(prev => ({ 
                          ...prev, 
                          experienceLevel: { ...prev.experienceLevel, entryLevel: checked } 
                        }))
                      }
                      className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                    />
                    <Label htmlFor="entryLevel" className="flex items-center gap-1">
                      Einsteiger
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={searchProfile.experienceLevel.midLevel}
                      onCheckedChange={(checked: boolean) => 
                        setSearchProfile(prev => ({ 
                          ...prev, 
                          experienceLevel: { ...prev.experienceLevel, midLevel: checked } 
                        }))
                      }
                      className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                    />
                    <Label htmlFor="midLevel" className="flex items-center gap-1">
                      Mittleres Level
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={searchProfile.experienceLevel.seniorLevel}
                      onCheckedChange={(checked: boolean) => 
                        setSearchProfile(prev => ({ 
                          ...prev, 
                          experienceLevel: { ...prev.experienceLevel, seniorLevel: checked } 
                        }))
                      }
                      className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                    />
                    <Label htmlFor="seniorLevel" className="flex items-center gap-1">
                      Senior Level
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={searchProfile.experienceLevel.leadStaff}
                      onCheckedChange={(checked: boolean) => 
                        setSearchProfile(prev => ({ 
                          ...prev, 
                          experienceLevel: { ...prev.experienceLevel, leadStaff: checked } 
                        }))
                      }
                      className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                    />
                    <Label htmlFor="leadStaff" className="flex items-center gap-1">
                      Lead/Staff
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={searchProfile.experienceLevel.directorExecutive}
                      onCheckedChange={(checked: boolean) => 
                        setSearchProfile(prev => ({ 
                          ...prev, 
                          experienceLevel: { ...prev.experienceLevel, directorExecutive: checked } 
                        }))
                      }
                      className="data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D] focus:ring-2 focus:ring-[#0F973D] focus:ring-offset-2"
                    />
                    <Label htmlFor="directorExecutive" className="flex items-center gap-1">
                      Direktor/Executive
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Posted */}
        {loading ? (
          <DatePostedSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#0F973D]" />
                Veröffentlichungsdatum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <RadioGroup value={searchProfile.datePosted} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, datePosted: value }))}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="past24h" id="past24h" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                      <Label htmlFor="past24h">Letzte 24 Stunden</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="past3days" id="past3days" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                      <Label htmlFor="past3days">Letzte 3 Tage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pastWeek" id="pastWeek" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                      <Label htmlFor="pastWeek">Letzte Woche</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pastMonth" id="pastMonth" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                      <Label htmlFor="pastMonth">Letzter Monat</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Range */}
        {loading ? (
          <SalaryRangeSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#0F973D]" />
                Gehaltsbereich
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mindestgehalt (€)</Label>
              <Input
                type="number"
                placeholder="0"
                value={searchProfile.minSalary}
                onChange={(e) => setSearchProfile(prev => ({ ...prev, minSalary: parseInt(e.target.value) || 0 }))}
                className="focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
              />
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  )
} 