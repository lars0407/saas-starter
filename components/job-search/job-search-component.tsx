"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase, Building2, Clock, DollarSign, Filter, Star, Bookmark, ExternalLink, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Job } from "@/lib/types"
import { cn } from "@/lib/utils"
import { JobDetailComponent } from "./job-detail-component"

interface JobSearchFilters {
  keyword: string
  location: string
  jobType: string
  experienceLevel: string
  salaryRange: string
  remoteWork: string
  companySize: string
}

const initialFilters: JobSearchFilters = {
  keyword: "",
  location: "",
  jobType: "all",
  experienceLevel: "all",
  salaryRange: "",
  remoteWork: "all",
  companySize: "all",
}

export function JobSearchComponent() {
  const router = useRouter()
  const [filters, setFilters] = useState<JobSearchFilters>(initialFilters)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [hasMoreJobs, setHasMoreJobs] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(false)
  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(null)

  // Load initial jobs and job favourites on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchJobFavourites() // Load favourites first
      await fetchJobs(false) // Then load jobs
    }
    loadInitialData()
  }, [])

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

  // Fetch jobs from Xano API
  const fetchJobs = async (isLoadMore = false) => {
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
      date_published: 30 // Default to 30 days
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
          remote_work: filters.remoteWork !== "all" ? filters.remoteWork : undefined,
          employement_type: filters.jobType !== "all" ? filters.jobType : undefined,
          date_published: 30,
          location: filters.location || undefined,
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

  useEffect(() => {
    fetchJobs(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.keyword, filters.location, filters.jobType, filters.remoteWork]) // Trigger on main search fields and job type/remote work

  // Select first job when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && (!selectedJobId || !jobs.find(job => job.id === selectedJobId))) {
      setSelectedJobId(jobs[0].id)
    }
  }, [jobs, selectedJobId])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerTarget || loadingMore || !hasMoreJobs || jobs.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingMore && hasMoreJobs && !isNearBottom && jobs.length > 0) {
            console.log('Observer triggered - loading more jobs')
            setIsNearBottom(true)
            fetchJobs(true)
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
    
    // Trigger search immediately for job type and remote work changes
    if (key === 'jobType' || key === 'remoteWork') {
      // Small delay to ensure state is updated
      setTimeout(() => {
        fetchJobs(false)
      }, 100)
    }
  }

  const handleSearch = () => {
    fetchJobs(false)
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
        const errorData = await response.json()
        if (errorData.code === "ERROR_CODE_UNAUTHORIZED") {
          alert('Bitte melden Sie sich an, um Jobs zu speichern.')
          return
        }
        throw new Error("Fehler beim Speichern des Jobs")
      }

      const data = await response.json()
      console.log('Job tracker response:', data)

      // Refresh the job favourites list to get the updated state
      await fetchJobFavourites()

      // Show success message based on API response
      if (data.message) {
        // You can add a toast notification here if you have a toast system
        console.log('Job tracker:', data.message)
      }
    } catch (error) {
      console.error('Error toggling saved job:', error)
      // You can add error handling here (toast notification, etc.)
    }
  }

  const handleJobClick = (jobId: number) => {
    setSelectedJobId(jobId)
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

  const selectedJob = jobs.find(job => job.id === selectedJobId)

  return (
    <div className="h-screen max-h-screen flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Jobsuche</h1>
        <p className="text-muted-foreground">
          Finde deinen Traumjob mit unseren intelligenten Suchfunktionen
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
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
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pl-10 focus:border-[#0F973D] focus:ring-[#0F973D] focus:ring-2 focus:ring-opacity-20 focus:outline-none"
                style={{
                  '--tw-ring-color': '#0F973D',
                  '--tw-border-opacity': '1',
                  '--tw-ring-opacity': '0.2'
                } as React.CSSProperties}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
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

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Erweiterte Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Beschäftigungstyp</label>
                <Select value={filters.jobType} onValueChange={(value) => handleFilterChange('jobType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Typen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Typen</SelectItem>
                    <SelectItem value="Full-time">Vollzeit</SelectItem>
                    <SelectItem value="Part-time">Teilzeit</SelectItem>
                    <SelectItem value="Contract">Vertrag</SelectItem>
                    <SelectItem value="Internship">Praktikum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Erfahrungslevel</label>
                <Select value={filters.experienceLevel} onValueChange={(value) => handleFilterChange('experienceLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Level</SelectItem>
                    <SelectItem value="Entry">Anfänger</SelectItem>
                    <SelectItem value="Mid-level">Mittel</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Remote-Arbeit</label>
                <Select value={filters.remoteWork} onValueChange={(value) => handleFilterChange('remoteWork', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Optionen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Optionen</SelectItem>
                    <SelectItem value="Remote">Vollständig Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="On-site">Vor Ort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Unternehmensgröße</label>
                <Select value={filters.companySize} onValueChange={(value) => handleFilterChange('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Größen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Größen</SelectItem>
                    <SelectItem value="1-10">1-10 Mitarbeiter</SelectItem>
                    <SelectItem value="11-50">11-50 Mitarbeiter</SelectItem>
                    <SelectItem value="51-200">51-200 Mitarbeiter</SelectItem>
                    <SelectItem value="201-500">201-500 Mitarbeiter</SelectItem>
                    <SelectItem value="500+">500+ Mitarbeiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column - Job List */}
        <div className="lg:col-span-1 flex flex-col space-y-4 min-h-0">
      <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold">
               {loading ? "Lade Jobs..." : "Jobs gefunden"}
             </h2>
            <Select>
              <SelectTrigger className="w-32 focus:border-[#0F973D] focus:ring-[#0F973D]">
                <SelectValue placeholder="Sortieren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevanz</SelectItem>
              <SelectItem value="date">Datum</SelectItem>
              <SelectItem value="salary">Gehalt</SelectItem>
            </SelectContent>
          </Select>
      </div>

                     <div className="flex-1 overflow-y-auto space-y-4 job-list-container">
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
                <Button onClick={() => fetchJobs(false)} variant="outline" size="sm">
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
                <CardContent className="p-4">
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
                    <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base hover:text-[#0F973D] truncate">
                          {job.title}
                        </h3>
                          <p className="text-sm text-muted-foreground truncate">{job.company?.employer_name}</p>
                      </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSavedJob(job.id)
                          }}
                          className={cn(
                            "h-6 w-6 p-0 flex-shrink-0",
                            savedJobs.has(job.id) && "text-[#0F973D]"
                          )}
                        >
                          <Bookmark className="h-3 w-3" />
                        </Button>
                    </div>

                                           {/* Job Meta */}
                       <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                         <div className="flex items-center gap-1">
                           <MapPin className="h-3 w-3" />
                           {job.job_city}
                         </div>
                       </div>

                                           {/* Tags */}
                       <div className="flex flex-wrap gap-1">
                         {job.job_employement_type && job.job_employement_type !== 'null' && job.job_employement_type !== 'Not Applicable' && (
                           <Badge variant="outline" className="text-xs">
                             {job.job_employement_type === 'Full-time' ? 'Vollzeit' :
                              job.job_employement_type === 'FULL_TIME' ? 'Vollzeit' :
                              job.job_employement_type === 'Part-time' ? 'Teilzeit' :
                              job.job_employement_type === 'Contract' ? 'Vertrag' :
                              job.job_employement_type === 'Internship' ? 'Praktikum' :
                              job.job_employement_type}
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

                                             {/* Posted Date */}
                       <div className="text-xs text-muted-foreground">
                         {formatDate(job.job_posted || job.created_at || job.posted_date || job.date || '')} gepostet
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

        {/* Right Column - Job Details */}
        <div className="lg:col-span-2 flex flex-col space-y-4 min-h-0">
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
                <JobDetailComponent job={selectedJob} />
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
    </div>
  )
} 