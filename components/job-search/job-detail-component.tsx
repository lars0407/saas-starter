"use client"

import { useState, useEffect, useRef } from "react"
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
  ChevronUp,
  FileText,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Job } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DocumentCard } from "@/components/document-card"
import { DocumentPreviewCard } from "@/components/job-search/document-preview-card"
import { DocumentSkeleton } from "@/components/document-skeleton"

interface Document {
  id: number
  created_at: number
  updated_at: number
  type: "resume" | "cover letter"
  preview_link: string
  name: string
  storage_path: string
  variant: "human" | "ai"
  url: string
}

interface JobDetailComponentProps {
  jobId?: number
  job?: Job
  isSaved?: boolean
  onToggleSaved?: () => void
}

export function JobDetailComponent({ jobId, job: propJob, isSaved = false, onToggleSaved }: JobDetailComponentProps) {
  const [job, setJob] = useState<Job | null>(propJob || null)
  const [loading, setLoading] = useState(!propJob)
  const [applied, setApplied] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [jobDocuments, setJobDocuments] = useState<Document[]>([])
  const [jobDocumentsLoading, setJobDocumentsLoading] = useState(false)
  const [generatingDocuments, setGeneratingDocuments] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [jobTrackerCreated, setJobTrackerCreated] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    // If we have a job prop, use it directly
    if (propJob) {
      setJob(propJob)
      setLoading(false)
      // Fetch job-related documents when job is available
      if (propJob.id) {
        fetchJobDocuments(propJob.id)
      }
      // Auto-scroll to top when new job is loaded
      setTimeout(() => {
        if (topRef.current) {
          topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
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

  const generateDocuments = async (documentId: number) => {
    if (!job?.id) return
    
    setGeneratingDocuments(true)
    setDocumentsModalOpen(false) // Close the modal
    
    // Start cycling through loading messages
    const loadingMessages = [
      "Analysiere Job-Profile... 🔍",
      "Brainstorme deine Stärken... 💪",
      "Generiere Lebenslauf... 📝",
      "Erstelle Anschreiben... ✍️",
      "Finalisiere Bewerbung... 🚀"
    ]
    
    let messageIndex = 0
    const messageInterval = setInterval(() => {
      setLoadingMessage(loadingMessages[messageIndex])
      messageIndex = (messageIndex + 1) % loadingMessages.length
    }, 2000) // Change message every 2 seconds
    
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        console.error("No auth token found")
        setGeneratingDocuments(false)
        return
      }

      const response = await fetch(
        `https://api.jobjaeger.de/api:SiRHLF4Y/application/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            job_id: job.id,
            document_id: documentId
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to generate documents: ${response.status}`)
      }

      const data = await response.json()
      console.log("Document generation response:", data)
      
      if (data.success) {
        // Success! Refresh the job documents
        await fetchJobDocuments(job.id)
        
        // If we have a job tracker in the response, update the saved state
        if (data.job_tracker) {
          // Update the job tracker state to show the job is now saved
          console.log("Job tracker created:", data.job_tracker)
          setJobTrackerCreated(true)
          // You might want to call a callback to update the parent component's saved state
          if (onToggleSaved) {
            onToggleSaved()
          }
        }
      }
    } catch (error) {
      console.error("Error generating documents:", error)
    } finally {
      clearInterval(messageInterval)
      setGeneratingDocuments(false)
      setLoadingMessage("")
    }
  }

  const fetchJobDocuments = async (jobId: number) => {
    setJobDocumentsLoading(true)
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        setJobDocuments([])
        return
      }

      const response = await fetch(
        `https://api.jobjaeger.de/api:9BqVCxJj/job_tracker/documents/job/id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            job_id: jobId
          })
        }
      )

      if (!response.ok) {
        // Silently handle errors - don't show anything to user
        setJobDocuments([])
        return
      }

      const data = await response.json()
      console.log("Job documents API response:", data)
      
      if (data && data.document_list) {
        // Transform the API response to match our Document interface
        const transformedDocuments = data.document_list.map((doc: any) => ({
          id: doc.id,
          created_at: Date.now(), // Use current time as fallback
          updated_at: Date.now(), // Use current time as fallback
          type: doc.type,
          preview_link: doc.link,
          name: doc.type === 'resume' ? 'Lebenslauf' : 'Anschreiben',
          storage_path: doc.link,
          variant: "ai" as const, // Assuming generated documents are AI variant
          url: doc.link
        }))
        setJobDocuments(transformedDocuments)
      } else {
        setJobDocuments([])
      }
    } catch (error) {
      // Silently handle errors - don't show anything to user
      console.error("Error fetching job documents:", error)
      setJobDocuments([])
    } finally {
      setJobDocumentsLoading(false)
    }
  }

  const fetchDocuments = async () => {
    setDocumentsLoading(true)
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch(
        `https://api.jobjaeger.de/api:SiRHLF4Y/documents?offset=0&variant=human`,
        {
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`)
      }

      const data = await response.json()
      console.log("Documents API response:", data)
      
      if (data && data.document) {
        const documents = data.document.items || []
        setDocuments(documents)
      } else {
        setDocuments([])
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      setDocuments([])
    } finally {
      setDocumentsLoading(false)
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

  const formatListItems = (htmlString: string, sectionName: string) => {
    if (!htmlString || htmlString === 'null' || htmlString === 'undefined') {
      return (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Keine {sectionName} angegeben</span>
        </div>
      )
    }

    console.log(`Formatting ${sectionName}:`, htmlString) // Debug log
    
    // Handle different HTML formats
    let cleanString = htmlString
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?p[^>]*>/gi, '\n')
      .replace(/<\/?div[^>]*>/gi, '\n')
      .replace(/<\/?span[^>]*>/gi, '')
      .replace(/<\/?strong[^>]*>/gi, '')
      .replace(/<\/?b[^>]*>/gi, '')
      .replace(/<\/?em[^>]*>/gi, '')
      .replace(/<\/?i[^>]*>/gi, '')
    
    // Try to extract list items from <li> tags first
    const listItemRegex = /<li[^>]*>(.*?)<\/li>/gi
    const items: string[] = []
    let match
    
    while ((match = listItemRegex.exec(htmlString)) !== null) {
      const item = match[1]
        .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
        .trim()
      if (item && item.length > 0) {
        items.push(item)
      }
    }
    
    // If we found list items, return them as a proper list
    if (items.length > 0) {
      console.log(`Found ${items.length} list items:`, items)
      return (
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {items.map((item, index) => (
            <li key={index} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      )
    }
    
    // If no <li> tags found, try to split by common separators
    const separators = ['•', '-', '*', '·', '→', '⇒']
    let splitItems: string[] = []
    
    for (const separator of separators) {
      if (cleanString.includes(separator)) {
        splitItems = cleanString
          .split(separator)
          .map(item => item.trim())
          .filter(item => item.length > 0)
        break
      }
    }
    
    // If we found items with separators, return them as a list
    if (splitItems.length > 1) {
      console.log(`Found ${splitItems.length} items with separators:`, splitItems)
      return (
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {splitItems.map((item, index) => (
            <li key={index} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      )
    }
    
    // If still no items, try to split by newlines and clean up
    const lineItems = cleanString
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line !== 'null' && line !== 'undefined')
    
    if (lineItems.length > 1) {
      console.log(`Found ${lineItems.length} line items:`, lineItems)
      return (
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {lineItems.map((item, index) => (
            <li key={index} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      )
    }
    
    // Last resort: return the cleaned text as a single paragraph
    console.log(`Returning cleaned text for ${sectionName}:`, cleanString)
    return (
      <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
        {cleanString}
      </div>
    )
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
        // setSavedJobs(new Set(jobIds)) // This line is removed as per the edit hint
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

  // Load job favourites on component mount
  useEffect(() => {
    fetchJobFavourites()
  }, [])

  const handleApply = () => {
    // In a real app, you'd redirect to the application page
    if (job?.apply_link) {
      window.open(job.apply_link, '_blank')
    }
  }

  const handleOpenDocumentsModal = () => {
    setDocumentsModalOpen(true)
    fetchDocuments()
  }

  const handleViewDocument = (id: number) => {
    const document = documents.find(doc => doc.id === id)
    if (!document) return

    const downloadUrl = document.url
    if (!downloadUrl) return

    window.open(downloadUrl, '_blank')
  }

  const handleEditDocument = (id: number) => {
    const document = documents.find(doc => doc.id === id)
    if (!document) return

    if (document.type === 'resume') {
      window.location.href = `/dashboard/resume-generate?id=${id}`
    } else if (document.type === 'cover letter') {
      window.location.href = `/dashboard/coverletter-generate?id=${id}`
    }
  }

  const handleDeleteDocument = async (id: number) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch(
        `https://api.jobjaeger.de/api:SiRHLF4Y/documents/${id}`,
        {
          method: "DELETE",
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      // Refresh documents
      fetchDocuments()
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const handleAddToTracker = async () => {
    if (!job?.id) return
    
    // Use the onToggleSaved prop if provided, otherwise fall back to the old logic
    if (onToggleSaved) {
      onToggleSaved()
      return
    }
    
    try {
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        alert('Bitte melden Sie sich an, um Jobs zum Jobtracker hinzuzufügen.')
        return
      }

      const response = await fetch("/api/job_tracker/favourite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          job_id: job.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.code === "ERROR_CODE_UNAUTHORIZED") {
          alert('Bitte melden Sie sich an, um Jobs zum Jobtracker hinzuzufügen.')
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
      console.error('Error adding job to tracker:', error)
      // You can add error handling here (toast notification, etc.)
    }
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
    <div className="space-y-6" ref={topRef}>
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
                onClick={handleAddToTracker}
                className={cn(
                  isSaved && "text-[#0F973D]",
                  "hover:bg-gray-100"
                )}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-gray-100"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleApply}
                className="text-[#0F973D] hover:text-[#0F973D]/80 hover:bg-gray-100"
              >
                <ExternalLink className="h-4 w-4" />
                Bewerben
              </Button>
            </div>
          </div>

          {/* Job Meta - Removed Level and Applicants sections */}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {job.job_employement_type && job.job_employement_type !== 'null' && job.job_employement_type !== 'Not Applicable' && (
              <Badge variant="outline">
                {translateEmploymentType(job.job_employement_type)}
              </Badge>
            )}
            {job.salary && job.salary !== 'null' && job.salary !== 'Not Applicable' && (
              <Badge variant="outline">{job.salary}</Badge>
            )}
            {job.seniority && job.seniority !== 'null' && job.seniority !== 'Not Applicable' && (
              <Badge variant="outline">
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
              <Badge variant="outline">{job.working_hours}</Badge>
            )}
            {job.remote_work && job.remote_work !== 'null' && job.remote_work !== 'Not Applicable' && (
              <Badge variant="secondary">
                {job.remote_work === 'Remote' ? 'Vollständig Remote' :
                 job.remote_work === 'Hybrid' ? 'Hybrid' :
                 job.remote_work === 'On-site' ? 'Vor Ort' :
                 job.remote_work}
              </Badge>
            )}
            <Badge variant="outline">{job.company?.company_size} Mitarbeiter</Badge>
            <Badge variant="outline">{formatDate(job.job_posted || job.created_at || job.posted_date || job.date || '')} gepostet</Badge>
          </div>



          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
                         <Button 
               onClick={handleOpenDocumentsModal}
               disabled={jobDocuments.length > 0}
               className={cn(
                 "flex-1",
                 jobDocuments.length > 0 
                   ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" 
                   : "bg-[#0F973D] hover:bg-[#0F973D]/90"
               )}
             >
               <FileText className="h-4 w-4 mr-2" />
               {jobDocuments.length > 0 ? 
                 (jobTrackerCreated ? "Job gespeichert & Bewerbung erstellt 🎉" : "Bewerbungsunterlagen bereits erstellt") 
                 : "Bewerbungsunterlagen erstellen"}
             </Button>
            <Button variant="outline" onClick={handleAddToTracker}>
              {isSaved ? "Aus Jobtracker entfernen" : "Zum Jobtracker hinzufügen"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Documents Section - Debug Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Job Documents Debug Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Debug Info:</strong>
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Job ID: {job.id}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Documents Count: {jobDocuments.length}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Loading: {jobDocumentsLoading ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Generating: {generatingDocuments ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-600">
              Documents: {JSON.stringify(jobDocuments, null, 2)}
            </p>
          </div>
          
                        {jobDocuments.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {jobDocuments.map((doc) => (
                    <div key={doc.id} className="w-full sm:w-auto">
                      <DocumentCard
                        document={doc}
                        showDelete={false}
                        onView={(id) => {
                          // Handle view if needed
                          console.log('View document:', id)
                        }}
                        onEdit={(id) => {
                          // Open document for editing in new tab
                          const document = jobDocuments.find(doc => doc.id === id)
                          if (document) {
                            if (document.type === 'resume') {
                              window.open(`/dashboard/resume-generate?id=${id}`, '_blank')
                            } else if (document.type === 'cover letter') {
                              window.open(`/dashboard/coverletter-generate?id=${id}`, '_blank')
                            }
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
            <div className="text-center py-4 text-gray-500">
              {generatingDocuments ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F973D]"></div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      {loadingMessage || "Starte Generierung..."}
                    </p>
                    <p className="text-sm text-gray-600">Das dauert nur ein paar Sekunden! ⚡</p>
                  </div>
                </div>
              ) : jobDocumentsLoading ? 'Loading documents...' : 'No documents found'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Verantwortlichkeiten</h3>
            {formatListItems(job.description?.description_responsibilities, "Verantwortlichkeiten")}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Qualifikationen</h3>
            {formatListItems(job.description?.description_qualification, "Qualifikationen")}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Benefits</h3>
            {formatListItems(job.description?.description_benefits, "Benefits")}
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
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{job.company?.employer_name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Gegründet: {job.company?.founded}</span>
                <span>Mitarbeiter: {job.company?.company_size}</span>
              </div>
            </div>
          </div>
          
                     {job.company?.about && (
             <div className="mb-4">
               <div className="text-muted-foreground">
                 <p className={showFullDescription ? "" : "line-clamp-2"}>
                   {job.company.about}
                 </p>
               </div>
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

      {/* Documents Modal */}
      <Dialog open={documentsModalOpen} onOpenChange={setDocumentsModalOpen}>
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
            {documentsLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <DocumentSkeleton key={index} className="min-w-[300px] flex-shrink-0" />
                ))}
              </div>
            ) : documents.length === 0 ? (
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
                    setDocumentsModalOpen(false)
                    window.location.href = '/dashboard/resume-generate'
                  }}
                  className="bg-[#0F973D] hover:bg-[#0D7A32] text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Lebenslauf erstellen
                </Button>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {documents.map((document) => (
                  <div key={document.id} onClick={() => generateDocuments(document.id)} className="flex-shrink-0">
                    <DocumentPreviewCard
                      document={document}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 