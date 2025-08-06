"use client"

import { useState, useEffect } from "react"
import { 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Users, 
  Calendar,
  ExternalLink,
  Bookmark,
  Share2,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Star,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Job } from "@/lib/types"
import { cn } from "@/lib/utils"

interface JobDetailComponentProps {
  jobId?: number
  job?: Job
}

export function JobDetailComponent({ jobId, job: propJob }: JobDetailComponentProps) {
  const [job, setJob] = useState<Job | null>(propJob || null)
  const [loading, setLoading] = useState(!propJob)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    // If we have a job prop, use it directly
    if (propJob) {
      setJob(propJob)
      setLoading(false)
      return
    }

    // If we only have jobId, we need to fetch the job
    const fetchJob = async () => {
      if (!jobId) return
      
      setLoading(true)
      try {
        // In a real app, you'd fetch from `/api/jobs/${jobId}`
        // For now, we'll show an error since we don't have the job data
        console.error('Job not found - need to implement API call for individual job')
        setJob(null)
      } catch (error) {
        console.error('Error fetching job:', error)
        setJob(null)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId, propJob])

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

  const formatListItems = (htmlString: string) => {
    if (!htmlString) return null
    
    // Extract list items from HTML string
    const listItemRegex = /<li>(.*?)<\/li>/g
    const items: string[] = []
    let match
    
    while ((match = listItemRegex.exec(htmlString)) !== null) {
      items.push(match[1].trim())
    }
    
    if (items.length === 0) {
      // If no list items found, return the original text
      return <div className="text-muted-foreground">{htmlString}</div>
    }
    
    return (
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">{item}</li>
        ))}
      </ul>
    )
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const handleApply = () => {
    setApplied(true)
    // In a real app, you'd redirect to the application page
    if (job?.apply_link) {
      window.open(job.apply_link, '_blank')
    }
  }

  const handleAddToTracker = () => {
    // In a real app, you'd add the job to the tracker
    console.log('Adding job to tracker:', job?.id)
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!job) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Job nicht gefunden</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
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
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg text-muted-foreground mb-2">{job.company?.employer_name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.job_city}, {job.job_state}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className={cn(saved && "text-[#0F973D]")}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Job Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{job.job_employement_type}</p>
                <p className="text-xs text-muted-foreground">Beschäftigungstyp</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{job.salary}</p>
                <p className="text-xs text-muted-foreground">Gehalt</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{job.seniority}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{job.applicants_number}</p>
                <p className="text-xs text-muted-foreground">Bewerber</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">{job.remote_work}</Badge>
            <Badge variant="outline">{job.company?.company_size} Mitarbeiter</Badge>
            <Badge variant="outline">{formatDate(job.job_posted || job.created_at || job.posted_date || job.date || '')} gepostet</Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleApply}
              className="bg-[#0F973D] hover:bg-[#0F973D]/90 flex-1"
              disabled={applied}
            >
              {applied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Bewerbung gesendet
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Jetzt bewerben
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleAddToTracker}>
              Zum Jobtracker hinzufügen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle>Jobbeschreibung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {job.description?.description_original && (
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {job.description.description_original}
              </p>
            </div>
          )}

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Verantwortlichkeiten</h3>
            {formatListItems(job.description?.description_responsibilities || "Keine Informationen verfügbar.")}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Qualifikationen</h3>
            {formatListItems(job.description?.description_qualification || "Keine Informationen verfügbar.")}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Vorteile</h3>
            {formatListItems(job.description?.description_benefits || "Keine Informationen verfügbar.")}
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Über das Unternehmen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
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
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{job.company?.employer_name}</h3>
              <p className="text-muted-foreground mb-2">{job.company?.short_description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Gegründet: {job.company?.founded}</span>
                <span>Mitarbeiter: {job.company?.company_size}</span>
              </div>
            </div>
          </div>
          
                     {job.company?.about && (
             <div className="mb-4">
               <div className="text-muted-foreground">
                 {showFullDescription ? (
                   <p>{job.company.about}</p>
                 ) : (
                   <p>
                     {job.company.about.length > 150 
                       ? `${job.company.about.substring(0, 150)}...` 
                       : job.company.about
                     }
                   </p>
                 )}
               </div>
               {job.company.about.length > 150 && (
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={toggleDescription}
                   className="mt-2 p-0 h-auto text-[#0F973D] hover:text-[#0F973D]/80"
                 >
                   {showFullDescription ? (
                     <>
                       Weniger anzeigen
                       <ChevronUp className="h-4 w-4 ml-1" />
                     </>
                   ) : (
                     <>
                       Mehr anzeigen
                       <ChevronDown className="h-4 w-4 ml-1" />
                     </>
                   )}
                 </Button>
               )}
             </div>
           )}
          
          <div className="flex flex-wrap gap-2">
            {job.company?.employer_website && (
              <Button variant="outline" size="sm" asChild>
                <a href={job.company.employer_website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </a>
              </Button>
            )}
            {job.company?.employer_linkedin && (
              <Button variant="outline" size="sm" asChild>
                <a href={job.company.employer_linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recruiter Information */}
      {job.recruiter && (
        <Card>
          <CardHeader>
            <CardTitle>Recruiter Kontakt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{job.recruiter.recruiter_name}</h3>
                <p className="text-muted-foreground">{job.recruiter.recruiter_title}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${job.recruiter.recruiter_name.toLowerCase().replace(' ', '.')}@${job.company?.employer_name?.toLowerCase().replace(' ', '')}.com`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={job.recruiter.recruiter_url} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 