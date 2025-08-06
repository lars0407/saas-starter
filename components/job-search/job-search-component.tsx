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
  const [loading, setLoading] = useState(false)
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

  // Fetch jobs from Xano API
  const fetchJobs = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)
    
    const currentPage = isLoadMore ? page : 1
    
    console.log('API Request:', {
      isLoadMore,
      currentPage,
      page,
      search_term: filters.keyword,
      location: filters.location
    })
    
    try {
      const response = await fetch("https://api.jobjaeger.de/api:bxPM7PqZ/v2/job/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: currentPage,
          search_term: filters.keyword,
          location: filters.location,
          // Add more filter mappings if supported by API
        }),
      })
      if (!response.ok) throw new Error("Fehler beim Laden der Jobs.")
      const data = await response.json()
      
      // Debug: Log the first job to see the structure
      if (data.items && data.items.length > 0) {
        console.log('First job data:', data.items[0])
        console.log('Date fields available:', {
          created_at: data.items[0].created_at,
          job_posted: data.items[0].job_posted,
          posted_date: data.items[0].posted_date,
          date: data.items[0].date
        })
      }
      
      const newJobs = data.items || []
      
      console.log('API Response:', {
        newJobsCount: newJobs.length,
        totalJobs: data.itemsTotal,
        isLoadMore,
        currentPage,
        jobIds: newJobs.map((job: Job) => job.id).slice(0, 5) // Show first 5 job IDs
      })
      
      if (isLoadMore) {
        setJobs(prev => [...prev, ...newJobs])
        setPage(prev => prev + 1)
      } else {
        setJobs(newJobs)
        setPage(2)
      }
      
      setTotalJobs(data.itemsTotal || 0)
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
  }, [filters.keyword, filters.location]) // Only trigger on main search fields for now

  // Select first job when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
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
  }

  const handleSearch = () => {
    fetchJobs(false)
  }

  // handleLoadMore is no longer needed with infinite scroll

  const clearFilters = () => {
    setFilters(initialFilters)
  }

  const toggleSavedJob = (jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
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
                className="pl-10"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Stadt, Bundesland oder Remote..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pl-10"
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
               {loading ? "Lade Jobs..." : `${jobs.length} von ${totalJobs.toLocaleString('de-DE')} Jobs gefunden`}
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
        ) : jobs.length > 0 ? (
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
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.job_employement_type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {job.salary}
                      </div>
                    </div>

                    {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">{job.remote_work}</Badge>
                        <Badge variant="outline" className="text-xs">{job.seniority}</Badge>
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
        ) : (
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
        )}

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
            {selectedJob ? (
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