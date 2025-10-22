"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase, Building2, Clock, DollarSign, Filter, Star, Bookmark, ExternalLink, Eye, X, Plus, HelpCircle, Target, Globe, Calendar, Settings, Save, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Job } from "@/lib/types"
import { cn } from "@/lib/utils"
import { JobDetailComponent } from "./job-detail-component"
import { MobileJobDetailDrawer } from "./mobile-job-detail-drawer"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'

interface JobSearchFilters {
  keyword: string
  location: string
  jobType: string
  experienceLevel: string
  salaryRange: string
  remoteWork: string
  companySize: string
  datePublished: string
}

interface JobSearchComponentProps {
  title?: string
  description?: string
  hideSearch?: boolean
  hideCompanyInfo?: boolean
  matchReason?: string
}

const initialFilters: JobSearchFilters = {
  keyword: "",
  location: "",
  jobType: "all",
  experienceLevel: "all",
  salaryRange: "",
  remoteWork: "all",
  companySize: "all",
  datePublished: "",
}

export function JobSearchComponent({ title = "Jobsuche", description = "Finde deinen Traumjob mit unseren intelligenten Suchfunktionen", hideSearch = false, hideCompanyInfo = false, matchReason }: JobSearchComponentProps) {
  const formatScore = (score: string | undefined) => {
    if (!score) return '';
    // If score already contains %, return as is
    if (score.includes('%')) return score;
    // If score is just a number, add %
    return `${score}%`;
  };

  const router = useRouter()
  const [filters, setFilters] = useState<JobSearchFilters>(initialFilters)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [hasMoreJobs, setHasMoreJobs] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(false)
  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(null)
  const [searchProfileOpen, setSearchProfileOpen] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  
  // Search Profile State
  const [searchProfile, setSearchProfile] = useState({
    jobTitle: '',
    excludedTitles: [] as string[],
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
    // New fields for coordinates
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
  })

  // Location search state
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ fullAddress: string; coordinates: { lon: number; lat: number } }>>([])
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [locationSearchTerm, setLocationSearchTerm] = useState('')
  const [creatingApplications, setCreatingApplications] = useState<Set<number>>(new Set())

  // Load job favourites and search profile on component mount
  useEffect(() => {
    fetchJobFavourites()
    // Only load search profile for regular search mode
    if (!hideSearch) {
      loadSearchProfile()
    }
  }, [hideSearch])

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    // Check on mount
    checkIsMobile()
    
    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Load jobs with search profile data after profile is loaded (only for regular search)
  useEffect(() => {
    if (!hideSearch && !hasInitialized) {
      // Mark search profile as loaded
      setHasInitialized(true)
      
      if (searchProfile.jobTitle || searchProfile.location || searchProfile.selectedLocation) {
        console.log('Search profile loaded, triggering job search with profile data:', searchProfile)
        // Update filters with search profile data
        const newFilters = {
          ...filters,
          keyword: searchProfile.jobTitle || '',
          datePublished: searchProfile.datePosted || '',
        }
        setFilters(newFilters)
        // Trigger job search with profile data
        fetchJobsWithProfileData(newFilters)
      }
      // If no search profile data, the initial load useEffect will handle it
    }
  }, [hideSearch, hasInitialized, searchProfile.jobTitle, searchProfile.location, searchProfile.selectedLocation, searchProfile.datePosted])

  // Sync locationSearchTerm with searchProfile.location (only for regular search)
  useEffect(() => {
    if (!hideSearch) {
      setLocationSearchTerm(searchProfile.location)
    }
  }, [hideSearch, searchProfile.location])

  // Fetch job favourites from API
  const fetchJobFavourites = async () => {
    try {
      // Get auth token from cookies (same as other parts of the app)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        console.log('No auth token found, skipping job favourites')
        return
      }

      const response = await fetch("/api/job_tracker/favourites", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.code === "ERROR_CODE_UNAUTHORIZED") {
          console.log('User not authenticated, skipping job favourites')
          return
        }
        throw new Error("Fehler beim Laden der Jobtracker-Liste")
      }

      const data = await response.json()
      console.log('Full job favourites response:', data)
      
      if (data.job_tracker_list?.items?.ids && Array.isArray(data.job_tracker_list.items.ids)) {
        const jobIds = data.job_tracker_list.items.ids
        setSavedJobs(new Set(jobIds))
        console.log('Loaded saved job IDs:', jobIds)
        console.log('Saved jobs set:', new Set(jobIds))
      } else {
        console.log('No job favourites found or invalid response structure:', data)
        console.log('Available keys:', Object.keys(data))
        if (data.job_tracker_list) {
          console.log('job_tracker_list keys:', Object.keys(data.job_tracker_list))
        }
      }
    } catch (error) {
      console.error('Error fetching job favourites:', error)
    }
  }



  // Helper function to convert radius string to meters
  const convertRadiusToMeters = (radius: string): number => {
    const value = parseInt(radius.replace('km', ''));
    return value * 1000;
  };

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

  // Fetch jobs with specific location coordinates (to avoid state update timing issues)
  const fetchJobsWithLocation = async (isLoadMore: boolean, coordinates: { lon: number; lat: number }, radius: string) => {
    console.log('fetchJobsWithLocation called with coordinates:', coordinates, 'radius:', radius);
    
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)
    
    const currentOffset = isLoadMore ? (page - 1) * 25 : 0
    
    console.log('API Request with location:', {
      isLoadMore,
      currentOffset,
      page,
      search_term: filters.keyword,
      location: filters.location,
      remote_work: filters.remoteWork,
      employement_type: filters.jobType,
      date_published: 30,
      coordinates,
      radius
    })
    
    try {
      const response = await fetch("https://api.jobjaeger.de/api:bxPM7PqZ/v3/job/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offset: currentOffset,
          search_term: filters.keyword,
          remote_work: searchProfile.remote_work && searchProfile.remote_work.length > 0 ? searchProfile.remote_work : undefined,
          employement_type: searchProfile.employement_type && searchProfile.employement_type.length > 0 ? searchProfile.employement_type : undefined,
          date_published: 30,
          location: {
            key: "data.location",
            geo_radius: {
              center: {
                lon: coordinates.lon,
                lat: coordinates.lat
              },
              radius: convertRadiusToMeters(radius)
            }
          }
        }),
      })
      if (!response.ok) throw new Error("Fehler beim Laden der Jobs.")
      const data = await response.json()
      
      // Debug: Log the first job to see the structure
      if (data.results && data.results.length > 0) {
        console.log('First job data:', data.results[0])
        console.log('Date fields available:', {
          created_at: data.results[0].payload.data.created_at,
          job_posted: data.results[0].payload.data.job_posted,
          posted_date: data.results[0].payload.data.posted_date,
          date: data.results[0].payload.data.date
        })
      }
      
      // Extract jobs from the new results structure
      const newJobs = data.results ? data.results.map((result: any) => {
        const jobData = result.payload.data
        return {
          ...jobData,
          id: typeof jobData.id === 'string' ? parseInt(jobData.id) : jobData.id
        }
      }) : []
      
      // Debug: Log all available fields in the response to find the total count
      console.log('Full API Response:', data)
      console.log('Available fields:', Object.keys(data))
      
      // Get total count from API response - check for different possible fields
      // Based on the API response structure, we need to find the correct field
      let totalCount = data.total || data.total_count || data.itemsTotal || data.total_results
      
      // If we don't have a total count from the API, estimate it based on current results
      // This is a fallback solution
      if (!totalCount || totalCount === 0) {
        // If this is the first page and we have results, estimate total
        if (!isLoadMore && newJobs.length > 0) {
          // Assume there are more pages if we got a full page of results
          totalCount = Math.max(newJobs.length * 2, newJobs.length + 10)
        } else if (isLoadMore) {
          // For load more, keep the existing total
          totalCount = totalJobs
        } else {
          totalCount = newJobs.length
        }
      }
      
      console.log('API Response:', {
        newJobsCount: newJobs.length,
        totalJobs: totalCount,
        isLoadMore,
        currentOffset,
        jobIds: newJobs.map((job: Job) => job.id).slice(0, 5), // Show first 5 job IDs
        responseData: data // Log full response to see available fields
      })
      
      if (isLoadMore) {
        setJobs(prev => [...prev, ...newJobs])
        setPage(prev => prev + 1)
      } else {
        setJobs(newJobs)
        setPage(2)
        // Reset selected job ID for new searches so the first job gets selected
        setSelectedJobId(null)
      }
      
      setTotalJobs(totalCount)
      setHasMoreJobs(newJobs.length === 25)
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler")
      if (!isLoadMore) {
        setJobs([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  };

  // Fetch jobs with search profile data
  const fetchJobsWithProfileData = async (profileFilters: JobSearchFilters) => {
    console.log('fetchJobsWithProfileData called with profile filters:', profileFilters)
    console.log('Current searchProfile:', searchProfile)
    
    setLoading(true)
    setError(null)
    
    const currentOffset = 0 // Always start from first page when loading with profile
    
    console.log('API Request with profile data:', {
      search_term: profileFilters.keyword,
      location: searchProfile.location,
      remote_work: searchProfile.remote_work,
      employement_type: searchProfile.employement_type,
      date_published: profileFilters.datePublished ? getDatePublishedValue(profileFilters.datePublished) : 30,
      selectedLocation: searchProfile.selectedLocation,
      radius: searchProfile.radius
    })
    
    try {
      const response = await fetch("https://api.jobjaeger.de/api:bxPM7PqZ/v3/job/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offset: currentOffset,
          search_term: profileFilters.keyword,
          remote_work: searchProfile.remote_work && searchProfile.remote_work.length > 0 ? searchProfile.remote_work : undefined,
          employement_type: searchProfile.employement_type && searchProfile.employement_type.length > 0 ? searchProfile.employement_type : undefined,
          date_published: profileFilters.datePublished ? getDatePublishedValue(profileFilters.datePublished) : 30,
          ...(searchProfile.selectedLocation && {
            location: {
              key: "data.location",
              geo_radius: {
                center: {
                  lon: searchProfile.selectedLocation.lon,
                  lat: searchProfile.selectedLocation.lat
                },
                radius: convertRadiusToMeters(searchProfile.radius)
              }
            }
          })
        }),
      })
      if (!response.ok) throw new Error("Fehler beim Laden der Jobs.")
      const data = await response.json()
      
      // Extract jobs from the new results structure
      const newJobs = data.results ? data.results.map((result: any) => {
        const jobData = result.payload.data
        return {
          ...jobData,
          id: typeof jobData.id === 'string' ? parseInt(jobData.id) : jobData.id
        }
      }) : []
      
      // Get total count from API response
      let totalCount = data.total || data.total_count || data.itemsTotal || data.total_results
      
      if (!totalCount || totalCount === 0) {
        totalCount = newJobs.length
      }
      
      console.log('Profile-based job search results:', {
        newJobsCount: newJobs.length,
        totalJobs: totalCount,
        searchTerm: profileFilters.keyword,
        datePublished: profileFilters.datePublished
      })
      
      setJobs(newJobs)
      setPage(2)
      setSelectedJobId(null)
      setTotalJobs(totalCount)
      setHasMoreJobs(newJobs.length === 25)
      
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler")
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch jobs with specific filters (for immediate use after filter updates)
  const fetchJobsWithNewFilters = async (newFilters: JobSearchFilters, isLoadMore = false) => {
    console.log('fetchJobsWithNewFilters called with filters:', newFilters);
    console.log('Current searchProfile.selectedLocation:', searchProfile.selectedLocation);
    console.log('Current searchProfile.radius:', searchProfile.radius);
    
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)
    
    const currentOffset = isLoadMore ? (page - 1) * 25 : 0
    
    console.log('API Request with new filters:', {
      isLoadMore,
      currentOffset,
      page,
      search_term: newFilters.keyword,
      location: newFilters.location,
      remote_work: newFilters.remoteWork,
      employement_type: newFilters.jobType,
      date_published: newFilters.datePublished,
      date_published_value: newFilters.datePublished ? getDatePublishedValue(newFilters.datePublished) : 30,
      selectedLocation: searchProfile.selectedLocation,
      radius: searchProfile.radius
    })
    
    try {
      const response = await fetch("https://api.jobjaeger.de/api:bxPM7PqZ/v3/job/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offset: currentOffset,
          search_term: newFilters.keyword,
          remote_work: searchProfile.remote_work && searchProfile.remote_work.length > 0 ? searchProfile.remote_work : undefined,
          employement_type: searchProfile.employement_type && searchProfile.employement_type.length > 0 ? searchProfile.employement_type : undefined,
          date_published: newFilters.datePublished ? getDatePublishedValue(newFilters.datePublished) : 30,
          ...(searchProfile.selectedLocation && {
            location: {
              key: "data.location",
              geo_radius: {
                center: {
                  lon: searchProfile.selectedLocation.lon,
                  lat: searchProfile.selectedLocation.lat
                },
                radius: convertRadiusToMeters(searchProfile.radius)
              }
            }
          })
        }),
      })
      if (!response.ok) throw new Error("Fehler beim Laden der Jobs.")
      const data = await response.json()
      
      // Debug: Log the first job to see the structure
      if (data.results && data.results.length > 0) {
        console.log('First job data:', data.results[0])
        console.log('Date fields available:', {
          created_at: data.results[0].payload.data.created_at,
          job_posted: data.results[0].payload.data.job_posted,
          posted_date: data.results[0].payload.data.posted_date,
          date: data.results[0].payload.data.date
        })
      }
      
      // Extract jobs from the new results structure
      const newJobs = data.results ? data.results.map((result: any) => {
        const jobData = result.payload.data
        return {
          ...jobData,
          id: typeof jobData.id === 'string' ? parseInt(jobData.id) : jobData.id
        }
      }) : []
      
      // Debug: Log all available fields in the response to find the total count
      console.log('Full API Response:', data)
      console.log('Available fields:', Object.keys(data))
      
      // Get total count from API response - check for different possible fields
      // Based on the API response structure, we need to find the correct field
      let totalCount = data.total || data.total_count || data.itemsTotal || data.total_results
      
      // If we don't have a total count from the API, estimate it based on current results
      // This is a fallback solution
      if (!totalCount || totalCount === 0) {
        // If this is the first page and we have results, estimate total
        if (!isLoadMore && newJobs.length > 0) {
          // Assume there are more pages if we got a full page of results
          totalCount = Math.max(newJobs.length * 2, newJobs.length + 10)
        } else if (isLoadMore) {
          // For load more, keep the existing total
          totalCount = totalJobs
        } else {
          totalCount = newJobs.length
        }
      }
      
      console.log('API Response:', {
        newJobsCount: newJobs.length,
        totalJobs: totalCount,
        isLoadMore,
        currentOffset,
        jobIds: newJobs.map((job: Job) => job.id).slice(0, 5), // Show first 5 job IDs
        responseData: data // Log full response to see available fields
      })
      
      if (isLoadMore) {
        setJobs(prev => [...prev, ...newJobs])
        setPage(prev => prev + 1)
      } else {
        setJobs(newJobs)
        setPage(2)
        // Reset selected job ID for new searches so the first job gets selected
        setSelectedJobId(null)
      }
      
      setTotalJobs(totalCount)
      setHasMoreJobs(newJobs.length === 25)
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler")
      if (!isLoadMore) {
        setJobs([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Fetch job recommendations from API
  const fetchJobRecommendations = async (isLoadMore = false) => {
    console.log('fetchJobRecommendations called with isLoadMore:', isLoadMore);
    
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)
    
    const currentOffset = isLoadMore ? (page - 1) * 25 : 0
    
    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        setError('Authentication required')
        return
      }

      const response = await fetch("https://api.jobjaeger.de/api:bxPM7PqZ/v3/job/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          offset: currentOffset
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Recommendation API response:', data)

      // Transform recommendation data to match Job interface
      const newJobs: Job[] = data.recommendation.items.map((item: any) => {
        const job = item.job[0] // Get the first job from the array
        
        // Handle missing company data
        const companyData = job.company || {}
        
        // Debug logging for description data
        console.log('Job description data:', {
          title: job.title,
          responsibilities: job.description?.description_responsibilities,
          qualifications: job.description?.description_qualification,
          benefits: job.description?.description_benefits
        })
        
        return {
          id: job.id,
          title: job.title,
          company: {
            employer_name: companyData.employer_name || '',
            employer_logo: companyData.employer_logo || '',
            employer_website: companyData.employer_website || '',
            employer_company_type: companyData.employer_company_type || '',
            employer_linkedin: companyData.employer_linkedin || '',
            about: companyData.about || '',
            short_description: companyData.short_description || '',
            founded: companyData.founded || '',
            company_size: companyData.company_size || ''
          },
          job_city: job.job_city || '',
          job_state: job.job_state || '',
          job_country: job.job_country || '',
          job_employement_type: job.job_employement_type || '',
          salary: job.salary === 'null' ? '' : (job.salary || ''),
          seniority: job.seniority || '',
          job_posted: job.job_posted || job.created_at || 0,
          apply_link: job.apply_link || '',
          applicants_number: job.applicants_number || '',
          working_hours: job.working_hours || '',
          remote_work: job.remote_work || '',
          source: job.source || '',
          description: job.description || {},
          job_geopoint: job.job_geopoint || '',
          recruiter: job.recruiter || {},
          created_at: job.created_at || 0,
          uuid: job.uuid || '',
          company_id: job.company_id || 0,
          job_origin: job.job_origin || '',
          job_expiration: job.job_expiration || false,
          job_identifier: job.job_identifier || '',
          auto_apply: job.auto_apply || false,
          recruitment_agency: job.recruitment_agency || false,
          // Add recommendation-specific fields
          recommendation_score: item.score,
          recommendation_reason: item.matchReason,
          matchReason: item.matchReason
        }
      })

      if (!isLoadMore) {
        setJobs(newJobs)
      } else {
        setJobs(prev => [...prev, ...newJobs])
      }
      
      setPage(prev => prev + 1)
      setSelectedJobId(null)
      setTotalJobs(data.recommendation.itemsTotal)
      setHasMoreJobs(newJobs.length === 25 && data.recommendation.nextPage > 0)
      
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden der Jobempfehlungen")
      console.error('Error fetching job recommendations:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Fetch jobs from Xano API
  const fetchJobs = async (isLoadMore = false) => {
    console.log('fetchJobs called with isLoadMore:', isLoadMore);
    console.log('Current searchProfile.selectedLocation:', searchProfile.selectedLocation);
    console.log('Current searchProfile.radius:', searchProfile.radius);
    
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)
    
    const currentOffset = isLoadMore ? (page - 1) * 25 : 0
    
    console.log('API Request:', {
      isLoadMore,
      currentOffset,
      page,
      search_term: filters.keyword,
      location: filters.location,
      remote_work: filters.remoteWork,
      employement_type: filters.jobType,
      date_published: filters.datePublished,
      date_published_value: filters.datePublished ? getDatePublishedValue(filters.datePublished) : 30,
      selectedLocation: searchProfile.selectedLocation,
      radius: searchProfile.radius
    })
    
    try {
      const response = await fetch("https://api.jobjaeger.de/api:bxPM7PqZ/v3/job/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offset: currentOffset,
          search_term: filters.keyword,
          remote_work: searchProfile.remote_work && searchProfile.remote_work.length > 0 ? searchProfile.remote_work : undefined,
          employement_type: searchProfile.employement_type && searchProfile.employement_type.length > 0 ? searchProfile.employement_type : undefined,
          date_published: filters.datePublished ? getDatePublishedValue(filters.datePublished) : 30,
          ...(searchProfile.selectedLocation && {
            location: {
              key: "data.location",
              geo_radius: {
                center: {
                  lon: searchProfile.selectedLocation.lon,
                  lat: searchProfile.selectedLocation.lat
                },
                radius: convertRadiusToMeters(searchProfile.radius)
              }
            }
          })
        }),
      })
      if (!response.ok) throw new Error("Fehler beim Laden der Jobs.")
      const data = await response.json()
      
      // Debug: Log the first job to see the structure
      if (data.results && data.results.length > 0) {
        console.log('First job data:', data.results[0])
        console.log('Date fields available:', {
          created_at: data.results[0].payload.data.created_at,
          job_posted: data.results[0].payload.data.job_posted,
          posted_date: data.results[0].payload.data.posted_date,
          date: data.results[0].payload.data.date
        })
      }
      
      // Extract jobs from the new results structure
      const newJobs = data.results ? data.results.map((result: any) => {
        const jobData = result.payload.data
        return {
          ...jobData,
          id: typeof jobData.id === 'string' ? parseInt(jobData.id) : jobData.id
        }
      }) : []
      
      // Debug: Log all available fields in the response to find the total count
      console.log('Full API Response:', data)
      console.log('Available fields:', Object.keys(data))
      
      // Get total count from API response - check for different possible fields
      // Based on the API response structure, we need to find the correct field
      let totalCount = data.total || data.total_count || data.itemsTotal || data.total_results
      
      // If we don't have a total count from the API, estimate it based on current results
      // This is a fallback solution
      if (!totalCount || totalCount === 0) {
        // If this is the first page and we have results, estimate total
        if (!isLoadMore && newJobs.length > 0) {
          // Assume there are more pages if we got a full page of results
          totalCount = Math.max(newJobs.length * 2, newJobs.length + 10)
        } else if (isLoadMore) {
          // For load more, keep the existing total
          totalCount = totalJobs
        } else {
          totalCount = newJobs.length
        }
      }
      
      console.log('API Response:', {
        newJobsCount: newJobs.length,
        totalJobs: totalCount,
        isLoadMore,
        currentOffset,
        jobIds: newJobs.map((job: Job) => job.id).slice(0, 5), // Show first 5 job IDs
        responseData: data // Log full response to see available fields
      })
      
      if (isLoadMore) {
        setJobs(prev => [...prev, ...newJobs])
        setPage(prev => prev + 1)
      } else {
        setJobs(newJobs)
        setPage(2)
        // Reset selected job ID for new searches so the first job gets selected
        setSelectedJobId(null)
      }
      
      setTotalJobs(totalCount)
      setHasMoreJobs(newJobs.length === 25)
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler")
      if (!isLoadMore) {
        setJobs([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load jobs based on whether search is hidden or not
  useEffect(() => {
    if (hideSearch) {
      fetchJobRecommendations(false)
    } else if (hasInitialized) {
      // Only load jobs after search profile is loaded to prevent multiple API calls
      fetchJobs(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideSearch, hasInitialized]) // Trigger when hideSearch or hasInitialized changes

  // Load jobs when filters change (only for regular search)
  useEffect(() => {
    if (!hideSearch && hasInitialized) {
      fetchJobs(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.keyword, filters.remoteWork]) // Trigger on main search fields and remote work

  // Select first job when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && (!selectedJobId || !jobs.find(job => job.id === selectedJobId))) {
      setSelectedJobId(jobs[0].id)
    }
  }, [jobs, selectedJobId])

  // Auto-select the job when selectedJobId changes
  useEffect(() => {
    if (selectedJobId && jobs.length > 0) {
      const job = jobs.find(j => j.id === selectedJobId)
      if (job) {
        setSelectedJob(job)
      }
    }
  }, [selectedJobId, jobs])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerTarget || loadingMore || !hasMoreJobs || jobs.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingMore && hasMoreJobs && !isNearBottom && jobs.length > 0) {
            console.log('Observer triggered - loading more jobs')
            setIsNearBottom(true)
            if (hideSearch) {
              fetchJobRecommendations(true)
            } else {
              fetchJobs(true)
            }
          }
        })
      },
      {
        root: document.querySelector('.job-list-container'),
        rootMargin: '100px', // Trigger 100px before reaching the target
        threshold: 0.1
      }
    )

    observer.observe(observerTarget)

    return () => {
      observer.disconnect()
    }
  }, [observerTarget, loadingMore, hasMoreJobs, isNearBottom, jobs.length])

  // Reset near bottom state when new jobs are loaded
  useEffect(() => {
    if (!loadingMore) {
      setIsNearBottom(false)
    }
  }, [loadingMore])

  const handleFilterChange = (key: keyof JobSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    
    // Only trigger search for regular search mode, not for recommendations
    if (!hideSearch && (key === 'jobType' || key === 'remoteWork')) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        fetchJobs(false)
      }, 100)
    }
  }

  // Handle search profile changes without triggering job search
  const handleSearchProfileChange = (updates: Partial<typeof searchProfile>) => {
    setSearchProfile(prev => ({ ...prev, ...updates }))
  }

  const handleSearch = () => {
    if (hideSearch) {
      fetchJobRecommendations(false)
    } else {
      fetchJobs(false)
    }
  }

  // Helper function to convert datePosted selection to numeric value (same as search profile page)
  const getDatePublishedValue = (datePosted: string): number => {
    
    const result = (() => {
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
    })();
    
    return result;
  }

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

  // Update employement_type and remote_work when jobType or workModel changes
  useEffect(() => {
    
    
    const newEmployementType = getEmployementTypeArray(searchProfile.jobType)
    const newRemoteWork = getRemoteWorkArray(searchProfile.workModel)
    
    
    
    setSearchProfile(prev => {
      const updated = {
        ...prev,
        employement_type: newEmployementType,
        remote_work: newRemoteWork
      }
      
      return updated
    })
  }, [searchProfile.jobType, searchProfile.workModel])

  // Function to fetch location suggestions from the API
  const fetchLocationSuggestions = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setLocationSuggestions([])
      setShowLocationDropdown(false)
      return
    }

    try {
      const response = await fetch(`https://api.jobjaeger.de/api:O72K2wiB/geopoint/search?adresse=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) {
        console.error('Error fetching location suggestions')
        return
      }

      const data = await response.json()
      console.log('Location suggestions response:', data)

      if (data.suggestions && Array.isArray(data.suggestions)) {
        const suggestions = data.suggestions.map((item: any) => {
          // Extract coordinates and full address
          const coordinates = item.geometry?.coordinates
          const lon = coordinates?.[0]
          const lat = coordinates?.[1]
          
          // Use full_address if available, otherwise construct from name and place_formatted
          let fullAddress = 'Unbekannter Ort'
          if (item.properties && item.properties.full_address) {
            fullAddress = item.properties.full_address
          } else if (item.properties && item.properties.name && item.properties.place_formatted) {
            fullAddress = `${item.properties.name}, ${item.properties.place_formatted}`
          } else if (item.properties && item.properties.name) {
            fullAddress = item.properties.name
          }
          
          return {
            fullAddress,
            coordinates: { lon, lat }
          }
        })
        setLocationSuggestions(suggestions)
        setShowLocationDropdown(suggestions.length > 0)
      } else {
        setLocationSuggestions([])
        setShowLocationDropdown(false)
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
      setLocationSuggestions([])
      setShowLocationDropdown(false)
    }
  }

  // Function to save search profile to API
  const saveSearchProfile = async () => {
    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        console.log('No auth token found, skipping search profile save')
        return
      }

      console.log('Saving search profile to API:', searchProfile)
      
      // Helper function to convert datePosted selection to numeric value (same as search profile page)
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
      
      // Prepare the data in the format expected by the API (same as search profile page)
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
      }

      console.log('Sending API data:', apiData)

      // Try to update first, if it fails, create a new one
      let response = await fetch("https://api.jobjaeger.de/api:7yCsbR9L/search_profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      })

      let result;
      if (!response.ok) {
        // If update fails, try to create a new profile (same structure as search profile page)
        console.log('Update failed, trying to create new profile...')
        const createResponse = await fetch("https://api.jobjaeger.de/api:7yCsbR9L/search_profile", {
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
        })

        if (!createResponse.ok) {
          const errorData = await createResponse.json()
          throw new Error(errorData.message || "Fehler beim Erstellen des Suchprofils")
        }

        result = await createResponse.json()
      } else {
        result = await response.json()
      }

      console.log('Search profile saved successfully:', result)
      
    } catch (error: any) {
      console.error('Error saving search profile:', error)
      // Don't show error toast here as it might interfere with the job search
    }
  }

  // Function to load search profile data from API
  const loadSearchProfile = async () => {
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
          // Fix jobType mapping - use employement_type array from API
          jobType: {
            fullTime: profile.employement_type?.includes('FULL_TIME') || false,
            partTime: profile.employement_type?.includes('PART_TIME') || false,
            temporary: profile.employement_type?.includes('TEMPORARY') || false,
            contract: profile.employement_type?.includes('FREELANCE') || false,
            internship: profile.employement_type?.includes('INTERN') || false
          },
          // Fix workModel mapping - use remote_work array and work_location_preference from API
          workModel: {
            onsite: profile.remote_work?.includes('Kein Homeoffice') || profile.work_location_preference === 'onsite' || false,
            remote: profile.remote_work?.includes('Vollständig remote') || profile.work_location_preference === 'remote' || false,
            hybrid: profile.remote_work?.includes('Hybrid') || profile.remote_work?.includes('Teilweise Homeoffice') || profile.work_location_preference === 'hybrid' || false
          },
          datePosted: getDatePostedFromValue(profile.date_published),
          employement_type: profile.employement_type || [],
          remote_work: profile.remote_work || []
        }

        
        
        // Update employement_type based on the new jobType
        const newEmployementType = getEmployementTypeArray(newSearchProfile.jobType)
        newSearchProfile.employement_type = newEmployementType
        
        // Set the complete search profile in one update
        setSearchProfile(newSearchProfile)
        
        // Also update the main filters if we have a job title
        if (newSearchProfile.jobTitle) {
          setFilters(prev => ({ ...prev, keyword: newSearchProfile.jobTitle }))
        }
        
        // Update locationSearchTerm to show the loaded location
        if (profile.parameter?.place) {
          setLocationSearchTerm(profile.parameter.place)
        }
      }
    } catch (error) {
      console.error('Error loading search profile:', error)
    }
  }

  // Handle search profile drawer open/close
  const handleSearchProfileOpenChange = (open: boolean) => {
    console.log('Search profile drawer open/close:', open)
    setSearchProfileOpen(open)
    
    // Load search profile data when drawer opens
    if (open) {
      console.log('Drawer opened, loading search profile...')
      loadSearchProfile()
    }
  }

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
  }

  // handleLoadMore is no longer needed with infinite scroll

  const clearFilters = () => {
    setFilters(initialFilters)
  }

  const toggleSavedJob = async (jobId: number) => {
    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        alert('Bitte melden Sie sich an, um Jobs zu speichern.')
        return
      }

      // Optimistically update the local state immediately for better UX
      const isCurrentlySaved = savedJobs.has(jobId)
      if (isCurrentlySaved) {
        setSavedJobs(prev => {
          const newSet = new Set(prev)
          newSet.delete(jobId)
          return newSet
        })
      } else {
        setSavedJobs(prev => new Set([...prev, jobId]))
      }

      const response = await fetch("/api/job_tracker/favourite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          job_id: jobId
        }),
      })

      if (!response.ok) {
        // Revert the optimistic update if the API call failed
        if (isCurrentlySaved) {
          setSavedJobs(prev => new Set([...prev, jobId]))
        } else {
          setSavedJobs(prev => {
            const newSet = new Set(prev)
            newSet.delete(jobId)
            return newSet
          })
        }
        
        const errorData = await response.json()
        if (errorData.code === "ERROR_CODE_UNAUTHORIZED") {
          alert('Bitte melden Sie sich an, um Jobs zu speichern.')
          return
        }
        throw new Error("Fehler beim Speichern des Jobs")
      }

      const data = await response.json()
      console.log('Job tracker response:', data)

      // Refresh the job favourites list to get the updated state from server
      await fetchJobFavourites()

      // Show success message based on API response
      if (data.message) {
        // You can add a toast notification here if you have a toast system
        console.log('Job tracker:', data.message)
      }
    } catch (error) {
      console.error('Error toggling saved job:', error)
      
      // Revert the optimistic update if there was an error
      const isCurrentlySaved = savedJobs.has(jobId)
      if (isCurrentlySaved) {
        setSavedJobs(prev => new Set([...prev, jobId]))
      } else {
        setSavedJobs(prev => {
          const newSet = new Set(prev)
          newSet.delete(jobId)
          return newSet
        })
      }
      
      // You can add error handling here (toast notification, etc.)
    }
  }

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const createApplication = async (jobId: number) => {
    setCreatingApplications(prev => new Set(prev).add(jobId));
    
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
          job_id: jobId 
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
      
      // Remove the job from the list
      setJobs(prev => prev.filter(job => job.id !== jobId));
      
      // Find the next job to show in detail view
      const currentJobIndex = jobs.findIndex(job => job.id === jobId);
      const remainingJobs = jobs.filter(job => job.id !== jobId);
      
      if (remainingJobs.length > 0) {
        // If there are remaining jobs, show the next one
        const nextJobIndex = currentJobIndex < remainingJobs.length ? currentJobIndex : 0;
        const nextJob = remainingJobs[nextJobIndex];
        
        if (nextJob) {
          setSelectedJobId(nextJob.id);
          setSelectedJob(nextJob);
        }
      } else {
        // If no more jobs, clear the selection
        setSelectedJobId(null);
        setSelectedJob(null);
      }
      
      toast.success('Bewerbung erfolgreich erstellt!');
      
    } catch (error: any) {
      console.error('Error creating application:', error);
      toast.error('Fehler beim Erstellen der Bewerbung.');
    } finally {
      setCreatingApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleApplicationCreated = (jobId: number) => {
    // Remove the job from the list
    setJobs(prev => prev.filter(job => job.id !== jobId));
    
    // Find the next job to show in detail view
    const currentJobIndex = jobs.findIndex(job => job.id === jobId);
    const remainingJobs = jobs.filter(job => job.id !== jobId);
    
    if (remainingJobs.length > 0) {
      // If there are remaining jobs, show the next one
      const nextJobIndex = currentJobIndex < remainingJobs.length ? currentJobIndex : 0;
      const nextJob = remainingJobs[nextJobIndex];
      
      if (nextJob) {
        setSelectedJobId(nextJob.id);
        setSelectedJob(nextJob);
      }
    } else {
      // If no more jobs, clear the selection
      setSelectedJobId(null);
      setSelectedJob(null);
    }
  };

  const handleJobClick = (jobId: number) => {
    setSelectedJobId(jobId)
    // Find the job object
    const job = jobs.find(j => j.id === jobId)
    if (job) {
      setSelectedJob(job)
    }
    // Open mobile drawer on mobile devices
    if (isMobile) { // lg breakpoint
      setMobileDrawerOpen(true)
    }
  }

  const formatDate = (dateString: string) => {
    // Handle empty or invalid date strings
    if (!dateString || dateString === 'null' || dateString === 'undefined') {
      console.log('Empty date string:', dateString)
      return "Datum unbekannt"
    }

    console.log('Processing date string:', dateString)
    
    let date: Date
    
    // Check if it's a timestamp (numeric string or number)
    if (!isNaN(Number(dateString))) {
      // Convert timestamp to milliseconds (if it's in seconds, multiply by 1000)
      const timestamp = Number(dateString)
      date = new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000)
    } else {
      // Try to parse as regular date string
      date = new Date(dateString)
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return "Datum unbekannt"
    }

    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Heute"
    if (diffDays === 2) return "Gestern"
    if (diffDays <= 7) return `vor ${diffDays - 1} Tagen`
    
    // For older jobs, show the full German date
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }



  return (
    <div className="h-screen max-h-screen flex flex-col space-y-3 md:space-y-6 overflow-hidden min-h-0 pb-4 md:pb-0">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <p className="text-sm md:text-base text-muted-foreground hidden sm:block">
          {description}
        </p>
      </div>

      {/* Search Bar */}
      {!hideSearch && (
        <Card>
          <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Job-Titel, Firma oder Schlüsselwörter..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                className="pl-10 focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:ring-opacity-20 focus:outline-none"
                style={{
                  '--tw-ring-color': '#0F973D',
                  '--tw-border-opacity': '1',
                  '--tw-ring-opacity': '0.2'
                } as React.CSSProperties}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Stadt, Bundesland oder Remote..."
                value={filters.location}
                onChange={(e) => {
                  const value = e.target.value
                  setFilters(prev => ({ ...prev, location: value }))
                  // Clear selected location when user types new location
                  setSearchProfile(prev => ({ ...prev, selectedLocation: null }))
                  // Fetch location suggestions from API
                  fetchLocationSuggestions(value)
                }}
                onFocus={() => {
                  if (locationSuggestions.length > 0) {
                    setShowLocationDropdown(true)
                  }
                }}
                onBlur={() => {
                  // Delay hiding dropdown to allow clicking on suggestions
                  setTimeout(() => setShowLocationDropdown(false), 200)
                }}
                className="pl-10 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus:ring-opacity-20 focus:outline-none"
                style={{
                  '--tw-ring-color': '#0F973D',
                  '--tw-border-opacity': '1',
                  '--tw-ring-opacity': '0.2'
                } as React.CSSProperties}
              />
              
              {/* Location Suggestions Dropdown for main search field */}
              {showLocationDropdown && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        console.log('Location selected:', suggestion);
                        console.log('Setting filters and search profile...');
                        
                        setFilters(prev => ({ ...prev, location: suggestion.fullAddress }))
                        setSearchProfile(prev => ({ ...prev, location: suggestion.fullAddress, selectedLocation: suggestion.coordinates }))
                        setShowLocationDropdown(false)
                        setLocationSuggestions([])
                        
                        console.log('About to trigger fetchJobs...');
                        // Immediately trigger job search with new location coordinates
                        // Pass the location data directly to avoid state update timing issues
                        setTimeout(() => {
                          console.log('Executing fetchJobsWithLocation with location:', suggestion.fullAddress, 'coordinates:', suggestion.coordinates);
                          fetchJobsWithLocation(false, suggestion.coordinates, searchProfile.radius);
                        }, 100);
                      }}
                    >
                      {suggestion.fullAddress}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Sheet open={searchProfileOpen} onOpenChange={handleSearchProfileOpenChange}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2 text-sm md:text-base"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </SheetTrigger>
                                                <SheetContent
                    side={isMobile ? "bottom" : "right"}
                    className={cn(
                      "overflow-y-auto",
                      isMobile
                        ? "h-[90vh] max-h-[90vh] w-full rounded-t-xl border-t-4 border-t-[#0F973D] px-4"
                        : "!w-[600px] px-6"
                    )}
                    style={isMobile ? {} : { width: '600px', minWidth: '600px', maxWidth: '600px' }}
                  >
                <SheetHeader className={cn(
                  "sticky top-0 bg-white border-b pb-4 z-10",
                  isMobile ? "pb-3" : "pb-4"
                )}>
                  <div className="flex items-center justify-between">
                    <SheetTitle className={cn(
                      "flex items-center gap-2",
                      isMobile ? "text-lg" : "text-xl"
                    )}>
                      <Settings className="h-5 w-5 text-[#0F973D]" />
                      <span className={isMobile ? "text-base" : "text-xl"}>
                        {isMobile ? "Filter" : "Suchprofil & Filter"}
                      </span>
                    </SheetTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchProfileOpen(false)}
                        className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
                      >
                        <X className="h-5 w-5 stroke-2" />
                      </Button>
                      <Button
                        className={cn(
                          "bg-[#0F973D] hover:bg-[#0F973D]/90",
                          isMobile ? "px-3 py-2 text-sm" : "px-4 py-2"
                        )}
                        onClick={async () => {
                        console.log('Saving search profile:', searchProfile);
                        
                        // Save search profile to API
                        await saveSearchProfile();
                        
                        // Update search filters with search profile data
                        const newFilters = {
                          ...filters,
                          keyword: searchProfile.jobTitle || '',
                          datePublished: searchProfile.datePosted || '',
                        };
                        
                        console.log('Updating filters with:', {
                          currentFilters: filters,
                          searchProfileDatePosted: searchProfile.datePosted,
                          newFilters: newFilters
                        });
                        
                        // Set the new filters
                        setFilters(newFilters);
                        
                        // Set the new filters
                        setFilters(newFilters);
                        
                        // Trigger job search immediately with the new filters (don't wait for state update)
                        console.log('About to trigger fetchJobs with new filters:', newFilters);
                        fetchJobsWithNewFilters(newFilters, false);
                        
                        // Close the drawer
                        setSearchProfileOpen(false);
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Speichern
                    </Button>
                    </div>
                  </div>
                </SheetHeader>
                <div className={cn(
                  "mt-6",
                  isMobile ? "space-y-4" : "space-y-6"
                )}>
                  
                  {/* Job Title */}
                  <Card>
                    <CardHeader className={isMobile ? "pb-3" : "pb-6"}>
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        isMobile ? "text-base" : "text-lg"
                      )}>
                        <Briefcase className="h-5 w-5 text-[#0F973D]" />
                        Job Titel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={cn(
                      "space-y-4",
                      isMobile ? "px-4 pb-4" : "px-6 pb-6"
                    )}>
                      <div className="space-y-2">
                        <Label className={isMobile ? "text-sm" : "text-base"}>Job Titel</Label>
                        <Input
                          id="jobTitle"
                          placeholder="Job Titel eingeben..."
                          value={searchProfile.jobTitle || ''}
                          onChange={(e) => {
                            handleSearchProfileChange({ 
                              jobTitle: e.target.value 
                            });
                          }}
                          className={cn(
                            "focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus:outline-none",
                            isMobile ? "py-2 text-sm" : "py-2 text-base"
                          )}
                          style={{
                            '--tw-ring-color': '#0F973D',
                            '--tw-border-opacity': '1',
                            '--tw-ring-opacity': '0.2'
                          } as React.CSSProperties}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Type */}
                  <Card>
                    <CardHeader className={isMobile ? "pb-3" : "pb-6"}>
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        isMobile ? "text-base" : "text-lg"
                      )}>
                        <Briefcase className="h-5 w-5 text-[#0F973D]" />
                        Job Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={cn(
                      "space-y-4",
                      isMobile ? "px-4 pb-4" : "px-6 pb-6"
                    )}>
                      <div className={cn(
                        "space-y-3",
                        isMobile ? "space-y-2" : "space-y-3"
                      )}>
                        <div className={cn(
                          "flex items-center space-x-2",
                          isMobile ? "py-1" : "py-0"
                        )}>
                          <Switch
                            checked={searchProfile.jobType.fullTime}
                            onCheckedChange={(checked: boolean) => {
                              const newJobType = { ...searchProfile.jobType, fullTime: checked }
                              const newEmployementType = getEmployementTypeArray(newJobType)
                              handleSearchProfileChange({
                                jobType: newJobType,
                                employement_type: newEmployementType
                              })
                            }}
                            className="data-[state=checked]:bg-[#0F973D]"
                          />
                          <Label className={isMobile ? "text-sm" : "text-base"}>Vollzeit</Label>
                        </div>
                        <div className={cn(
                          "flex items-center space-x-2",
                          isMobile ? "py-1" : "py-0"
                        )}>
                          <Switch
                            checked={searchProfile.jobType.partTime}
                            onCheckedChange={(checked: boolean) => {
                              const newJobType = { ...searchProfile.jobType, partTime: checked }
                              const newEmployementType = getEmployementTypeArray(newJobType)
                              handleSearchProfileChange({
                                jobType: newJobType,
                                employement_type: newEmployementType
                              })
                            }}
                            className="data-[state=checked]:bg-[#0F973D]"
                          />
                          <Label className={isMobile ? "text-sm" : "text-base"}>Teilzeit</Label>
                        </div>
                        <div className={cn(
                          "flex items-center space-x-2",
                          isMobile ? "py-1" : "py-0"
                        )}>
                          <Switch
                            checked={searchProfile.jobType.temporary}
                            onCheckedChange={(checked: boolean) => {
                              const newJobType = { ...searchProfile.jobType, temporary: checked }
                              const newEmployementType = getEmployementTypeArray(newJobType)
                              handleSearchProfileChange({
                                jobType: newJobType,
                                employement_type: newEmployementType
                              })
                            }}
                            className="data-[state=checked]:bg-[#0F973D]"
                          />
                          <Label className={isMobile ? "text-sm" : "text-base"}>Befristet</Label>
                        </div>
                        <div className={cn(
                          "flex items-center space-x-2",
                          isMobile ? "py-1" : "py-0"
                        )}>
                          <Switch
                            checked={searchProfile.jobType.contract}
                            onCheckedChange={(checked: boolean) => {
                              const newJobType = { ...searchProfile.jobType, contract: checked }
                              const newEmployementType = getEmployementTypeArray(newJobType)
                              handleSearchProfileChange({
                                jobType: newJobType,
                                employement_type: newEmployementType
                              })
                            }}
                            className="data-[state=checked]:bg-[#0F973D]"
                          />
                          <Label className={isMobile ? "text-sm" : "text-base"}>Vertrag</Label>
                        </div>
                        <div className={cn(
                          "flex items-center space-x-2",
                          isMobile ? "py-1" : "py-0"
                        )}>
                          <Switch
                            checked={searchProfile.jobType.internship}
                            onCheckedChange={(checked: boolean) => {
                              const newJobType = { ...searchProfile.jobType, internship: checked }
                              const newEmployementType = getEmployementTypeArray(newJobType)
                              handleSearchProfileChange({
                                jobType: newJobType,
                                employement_type: newEmployementType
                              })
                            }}
                            className="data-[state=checked]:bg-[#0F973D]"
                          />
                          <Label className={isMobile ? "text-sm" : "text-base"}>Praktikum</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Model */}
                  <Card>
                    <CardHeader className={isMobile ? "pb-3" : "pb-6"}>
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        isMobile ? "text-base" : "text-lg"
                      )}>
                        <Globe className="h-5 w-5 text-[#0F973D]" />
                        Arbeitsmodell
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={cn(
                      "space-y-4",
                      isMobile ? "px-4 pb-4" : "px-6 pb-6"
                    )}>
                      <div className={cn(
                        "space-y-3",
                        isMobile ? "space-y-2" : "space-y-3"
                      )}>
                        <div className={cn(
                          "flex items-center space-x-2",
                          isMobile ? "py-1" : "py-0"
                        )}>
                          <Switch
                            checked={searchProfile.workModel.onsite}
                            onCheckedChange={(checked: boolean) => {
                              const newWorkModel = { ...searchProfile.workModel, onsite: checked }
                              const newRemoteWork = getRemoteWorkArray(newWorkModel)
                              handleSearchProfileChange({
                                workModel: newWorkModel,
                                remote_work: newRemoteWork
                              })
                            }}
                            className="data-[state=checked]:bg-[#0F973D]"
                          />
                          <Label className={isMobile ? "text-sm" : "text-base"}>Vor Ort</Label>
                        </div>
                        <div className={cn(
                          "flex items-center space-x-2",
                          isMobile ? "py-1" : "py-0"
                        )}>
                          <Switch
                            checked={searchProfile.workModel.remote}
                            onCheckedChange={(checked: boolean) => {
                              console.log('Remote toggle changed to:', checked)
                              const newWorkModel = { ...searchProfile.workModel, remote: checked }
                              const newRemoteWork = getRemoteWorkArray(newWorkModel)
                              handleSearchProfileChange({
                                workModel: newWorkModel,
                                remote_work: newRemoteWork
                              })
                            }}
                            className="data-[state=checked]:bg-[#0F973D]"
                          />
                          <Label className={isMobile ? "text-sm" : "text-base"}>Remote</Label>
                        </div>
                        <div className={cn(
                          "flex items-center space-x-2",
                          isMobile ? "py-1" : "py-0"
                        )}>
                          <Switch
                            checked={searchProfile.workModel.hybrid}
                            onCheckedChange={(checked: boolean) => {
                              const newWorkModel = { ...searchProfile.workModel, hybrid: checked }
                              const newRemoteWork = getRemoteWorkArray(newWorkModel)
                              handleSearchProfileChange({
                                workModel: newWorkModel,
                                remote_work: newRemoteWork
                              })
                            }}
                            className="data-[state=checked]:bg-[#0F973D]"
                          />
                          <Label className={isMobile ? "text-sm" : "text-base"}>Hybrid</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location */}
                  <Card>
                    <CardHeader className={isMobile ? "pb-3" : "pb-6"}>
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        isMobile ? "text-base" : "text-lg"
                      )}>
                        <MapPin className="h-5 w-5 text-[#0F973D]" />
                        Standort
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={cn(
                      "space-y-4",
                      isMobile ? "px-4 pb-4" : "px-6 pb-6"
                    )}>
                      <div className={cn(
                        "space-y-2",
                        isMobile ? "space-y-2" : "space-y-2"
                      )}>
                        <Label className={isMobile ? "text-sm" : "text-base"}>Standort</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <Input
                              value={locationSearchTerm}
                              onChange={(e) => {
                                const value = e.target.value
                                setLocationSearchTerm(value)
                                // Clear selected location when user types new location
                                setSearchProfile(prev => ({ ...prev, selectedLocation: null }))
                                fetchLocationSuggestions(value)
                              }}
                              onFocus={() => {
                                if (locationSuggestions.length > 0) {
                                  setShowLocationDropdown(true)
                                }
                              }}
                              onBlur={() => {
                                // Save the current input as location if no suggestion was selected
                                if (locationSearchTerm && locationSearchTerm !== searchProfile.location) {
                                  setSearchProfile(prev => ({ ...prev, location: locationSearchTerm }))
                                }
                                // Delay hiding dropdown to allow clicking on suggestions
                                setTimeout(() => setShowLocationDropdown(false), 200)
                              }}
                              placeholder="Standort eingeben..."
                              className={cn(
                                "w-full focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus:outline-none",
                                isMobile ? "py-2 text-sm" : "py-2 text-base"
                              )}
                              style={{
                                '--tw-ring-color': '#0F973D',
                                '--tw-border-opacity': '1',
                                '--tw-ring-opacity': '0.2'
                              } as React.CSSProperties}
                            />
                            
                            {/* Location Suggestions Dropdown */}
                            {showLocationDropdown && locationSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                                {locationSuggestions.map((suggestion, index) => (
                                  <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => {
                                      setLocationSearchTerm(suggestion.fullAddress)
                                      setSearchProfile(prev => ({ ...prev, location: suggestion.fullAddress, selectedLocation: suggestion.coordinates }))
                                      setShowLocationDropdown(false)
                                      setLocationSuggestions([])
                                      
                                      // Immediately trigger job search with new location coordinates
                                      setTimeout(() => {
                                        console.log('Executing fetchJobsWithLocation from drawer with location:', suggestion.fullAddress, 'coordinates:', suggestion.coordinates);
                                        fetchJobsWithLocation(false, suggestion.coordinates, searchProfile.radius);
                                      }, 100);
                                    }}
                                  >
                                    {suggestion.fullAddress}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <Select value={searchProfile.radius} onValueChange={(value) => {
                            setSearchProfile(prev => ({ ...prev, radius: value }))
                            
                            // Trigger job search with new radius if location is selected
                            if (searchProfile.selectedLocation) {
                              setTimeout(() => {
                                console.log('Executing fetchJobsWithLocation from radius change with coordinates:', searchProfile.selectedLocation, 'new radius:', value);
                                fetchJobsWithLocation(false, searchProfile.selectedLocation!, value);
                              }, 100);
                            }
                          }}>
                            <SelectTrigger className={cn(
                              "focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D]",
                              isMobile ? "w-20 py-2 text-sm" : "w-24 py-2 text-base"
                            )}>
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



                  {/* Date Posted */}
                  <Card>
                    <CardHeader className={isMobile ? "pb-3" : "pb-6"}>
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        isMobile ? "text-base" : "text-lg"
                      )}>
                        <Calendar className="h-5 w-5 text-[#0F973D]" />
                        Veröffentlichungsdatum
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={cn(
                      "space-y-4",
                      isMobile ? "px-4 pb-4" : "px-6 pb-6"
                    )}>
                      <div className={cn(
                        "space-y-3",
                        isMobile ? "space-y-2" : "space-y-3"
                      )}>
                        <RadioGroup value={searchProfile.datePosted} onValueChange={(value) => setSearchProfile(prev => ({ ...prev, datePosted: value }))}>
                          <div className={cn(
                            "space-y-2",
                            isMobile ? "space-y-1" : "space-y-2"
                          )}>
                            <div className={cn(
                              "flex items-center space-x-2",
                              isMobile ? "py-1" : "py-0"
                            )}>
                              <RadioGroupItem value="past24h" id="past24h" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                              <Label htmlFor="past24h" className={isMobile ? "text-sm" : "text-base"}>Letzte 24 Stunden</Label>
                            </div>
                            <div className={cn(
                              "flex items-center space-x-2",
                              isMobile ? "py-1" : "py-0"
                            )}>
                              <RadioGroupItem value="past3days" id="past3days" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                              <Label htmlFor="past3days" className={isMobile ? "text-sm" : "text-base"}>Letzte 3 Tage</Label>
                            </div>
                            <div className={cn(
                              "flex items-center space-x-2",
                              isMobile ? "py-1" : "py-0"
                            )}>
                              <RadioGroupItem value="pastWeek" id="pastWeek" className="focus:ring-2 focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                              <Label htmlFor="pastWeek" className={isMobile ? "text-sm" : "text-base"}>Letzte Woche</Label>
                            </div>
                            <div className={cn(
                              "flex items-center space-x-2",
                              isMobile ? "py-1" : "py-0"
                            )}>
                              <RadioGroupItem value="pastMonth" id="pastMonth" className="focus:ring-[#0F973D] data-[state=checked]:bg-[#0F973D]" />
                              <Label htmlFor="pastMonth" className={isMobile ? "text-sm" : "text-base"}>Letzter Monat</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>




                </div>
              </SheetContent>
            </Sheet>
            <Button 
              className="bg-[#0F973D] hover:bg-[#0F973D]/90"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              Suchen
            </Button>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 flex-1 min-h-0">
        {/* Left Column - Job List - Full width on mobile */}
        <div className="lg:col-span-1 flex flex-col space-y-2 md:space-y-4 min-h-0 overflow-hidden">
          {/* Mobile-only title */}
          <div className="lg:hidden mb-2 md:mb-4">
            <h2 className="text-xl font-semibold">Jobs</h2>
            <p className="text-sm text-muted-foreground">
              Tippe auf einen Job, um die Details zu sehen
            </p>
          </div>
          
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold hidden lg:block">
               {loading ? "Lade Jobs..." : "Jobs gefunden"}
             </h2>
            <Select>
              <SelectTrigger className="w-28 md:w-32 focus:border-[#0F973D] focus:ring-[#0F973D]">
                <SelectValue placeholder="Sortieren" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevanz</SelectItem>
                <SelectItem value="date">Datum</SelectItem>
                <SelectItem value="salary">Gehalt</SelectItem>
              </SelectContent>
            </Select>
      </div>

                     <div className="flex-1 overflow-y-auto space-y-2 md:space-y-4 job-list-container scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0 max-h-[calc(100vh-320px)] md:max-h-none">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          ) : error ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-base font-semibold mb-2">Fehler beim Laden der Jobs</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => hideSearch ? fetchJobRecommendations(false) : fetchJobs(false)} variant="outline" size="sm">
                  Erneut versuchen
                </Button>
              </CardContent>
            </Card>
        ) : !loading && jobs.length > 0 ? (
                         jobs.map((job, index) => (
               <Card 
                 key={`${job.id}-${index}`}
                 className={cn(
                   "hover:shadow-md transition-all cursor-pointer border-2",
                   selectedJobId === job.id 
                     ? "border-[#0F973D] shadow-md" 
                     : "border-gray-200 hover:border-gray-300"
                 )}
                 onClick={() => handleJobClick(job.id)}
               >
                <CardContent className="px-3 py-0 md:px-4 md:py-0">
                  <div className="flex items-start gap-3">
                  {/* Company Logo */}
                     <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                       {job.company?.employer_logo ? (
                         <img
                           src={job.company.employer_logo}
                           alt={`${job.company.employer_name} logo`}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                             // Hide the image and show the fallback icon on error
                             e.currentTarget.style.display = 'none'
                             e.currentTarget.nextElementSibling?.classList.remove('hidden')
                           }}
                         />
                       ) : null}
                       <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Job Details */}
                    <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base hover:text-[#0F973D] truncate">
                          {job.title}
                        </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {job.company?.employer_name || 'Unbekanntes Unternehmen'}
                          </p>
                      </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (hideSearch) {
                              // On job recommendations page, create application
                              createApplication(job.id)
                            } else {
                              // On regular job search page, toggle saved job
                              toggleSavedJob(job.id)
                            }
                          }}
                          disabled={hideSearch && creatingApplications.has(job.id)}
                          className={cn(
                            "h-6 w-6 p-0 flex-shrink-0",
                            hideSearch 
                              ? "text-[#0F973D] hover:text-[#0F973D]/80" 
                              : savedJobs.has(job.id) && "text-[#0F973D]",
                            hideSearch && creatingApplications.has(job.id) && "opacity-50"
                          )}
                        >
                          {hideSearch ? (
                            creatingApplications.has(job.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Bot className="h-3 w-3" />
                            )
                          ) : (
                            <Bookmark className="h-3 w-3" />
                          )}
                        </Button>
                    </div>

                                           {/* Job Meta */}
                       <div className="flex flex-wrap gap-2 md:gap-3 text-xs text-muted-foreground">
                         <div className="flex items-center gap-1">
                           <MapPin className="h-3 w-3" />
                           {job.job_city}
                         </div>
                       </div>

                                           {/* Tags */}
                       <div className="flex flex-wrap gap-1 md:gap-1">
                         {job.job_employement_type && job.job_employement_type !== 'null' && job.job_employement_type !== 'Not Applicable' && (
                           <Badge variant="outline" className="text-xs">
                             {translateEmploymentType(job.job_employement_type)}
                           </Badge>
                         )}
                         {job.salary && job.salary !== 'null' && job.salary !== 'Not Applicable' && (
                           <Badge variant="outline" className="text-xs">{job.salary}</Badge>
                         )}
                         {job.seniority && job.seniority !== 'null' && job.seniority !== 'Not Applicable' && (
                           <Badge variant="outline" className="text-xs">
                             {job.seniority === 'Entry level' ? 'Berufseinstieg' :
                              job.seniority === 'Junior' ? 'Berufseinstieg' :
                              job.seniority === 'Internship' ? 'Praktikum' :
                              job.seniority === 'Mid-Senior Level' ? 'Management' :
                              job.seniority === 'Associate' ? 'Berufserfahren' :
                              job.seniority === 'Director' ? 'Direktor' :
                              job.seniority === 'Management' ? 'Management' :
                              job.seniority}
                           </Badge>
                         )}
                         {job.working_hours && job.working_hours !== 'null' && job.working_hours !== 'Not Applicable' && (
                           <Badge variant="outline" className="text-xs">{job.working_hours}</Badge>
                         )}
                         {job.remote_work && job.remote_work !== 'null' && job.remote_work !== 'Not Applicable' && (
                           <Badge variant="secondary" className="text-xs">
                             {job.remote_work === 'Remote' ? 'Vollständig Remote' :
                              job.remote_work === 'Hybrid' ? 'Hybrid' :
                              job.remote_work === 'On-site' ? 'Vor Ort' :
                              job.remote_work}
                           </Badge>
                         )}
                       </div>

                                             {/* Posted Date and Recommendation Score */}
                       <div className="flex items-center justify-between">
                         <div className="text-xs text-muted-foreground">
                           {formatDate(job.job_posted || job.created_at || job.posted_date || job.date || '')} gepostet
                         </div>
                         {/* Recommendation Score */}
                         {hideSearch && job.recommendation_score && (
                           <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                             {formatScore(job.recommendation_score)} Passung
                           </Badge>
                         )}
                       </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : !loading ? (
          // Empty state
          <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-semibold mb-2">Keine Jobs gefunden</h3>
                <p className="text-sm text-muted-foreground mb-4">
                Versuche deine Suchkriterien zu ändern oder erweitere deine Suche.
              </p>
                <Button onClick={clearFilters} variant="outline" size="sm">
                Filter zurücksetzen
              </Button>
            </CardContent>
          </Card>
        ) : null}

                            {/* Intersection Observer Target */}
            <div 
              ref={setObserverTarget}
              className="h-4 w-full"
            />
            
            {/* Loading indicator for infinite scroll */}
            {loadingMore && (
              <div className="text-center pt-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F973D]"></div>
                  Lade weitere Jobs...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Job Details - Hidden on mobile */}
        <div className="hidden lg:flex lg:col-span-2 flex-col space-y-4 min-h-0">
          <h2 className="text-lg font-semibold">Job Details</h2>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              // Loading skeleton for job details - represents actual JobDetailComponent structure
              <div className="space-y-6">
                {/* Job Header Skeleton */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-8 bg-muted rounded w-64"></div>
                          <div className="h-5 bg-muted rounded w-48"></div>
                          <div className="h-4 bg-muted rounded w-32"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded"></div>
                        <div className="w-8 h-8 bg-muted rounded"></div>
                      </div>
                    </div>
                    
                    {/* Tags Skeleton */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="h-6 bg-muted rounded-full w-16"></div>
                      <div className="h-6 bg-muted rounded-full w-20"></div>
                      <div className="h-6 bg-muted rounded-full w-24"></div>
                      <div className="h-6 bg-muted rounded-full w-18"></div>
                      <div className="h-6 bg-muted rounded-full w-22"></div>
                    </div>
                    
                    {/* Action Buttons Skeleton */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="h-10 bg-muted rounded flex-1"></div>
                      <div className="h-10 bg-muted rounded w-48"></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Description Skeleton */}
                <Card>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-32"></div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="h-4 bg-muted rounded w-4/6"></div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="h-5 bg-muted rounded w-40"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                        <div className="h-4 bg-muted rounded w-4/6"></div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="h-5 bg-muted rounded w-32"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                        <div className="h-4 bg-muted rounded w-4/6"></div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="h-5 bg-muted rounded w-24"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                        <div className="h-4 bg-muted rounded w-4/6"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Information Skeleton */}
                <Card>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-48"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded w-40"></div>
                        <div className="h-4 bg-muted rounded w-64"></div>
                        <div className="h-4 bg-muted rounded w-32"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="h-4 bg-muted rounded w-4/6"></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <div className="h-8 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : selectedJob ? (
              <div>
                <JobDetailComponent 
                  job={selectedJob} 
                  isSaved={savedJobs.has(selectedJob.id)}
                  onToggleSaved={() => toggleSavedJob(selectedJob.id)}
                  hideEmployeeCount={hideSearch}
                  hideCompanyInfo={hideCompanyInfo}
                  matchReason={selectedJob?.matchReason || matchReason}
                  onApplicationCreated={handleApplicationCreated}
                />
              </div>
            ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Wähle einen Job aus</h3>
                <p className="text-muted-foreground">
                  Klicke auf einen Job in der Liste links, um die Details anzuzeigen.
                </p>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>

      {/* Mobile Job Detail Drawer */}
      <MobileJobDetailDrawer
        job={selectedJob || null}
        isOpen={mobileDrawerOpen}
        onOpenChange={setMobileDrawerOpen}
        isSaved={selectedJob ? savedJobs.has(selectedJob.id) : false}
        onToggleSaved={() => selectedJob && toggleSavedJob(selectedJob.id)}
        hideEmployeeCount={hideSearch}
        hideCompanyInfo={hideCompanyInfo}
        matchReason={selectedJob?.matchReason || matchReason}
        onApplicationCreated={handleApplicationCreated}
      />
    </div>
  )
} 