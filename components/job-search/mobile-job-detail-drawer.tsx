"use client"

import { useState } from "react"
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
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Job } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface MobileJobDetailDrawerProps {
  job: Job | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isSaved?: boolean
  onToggleSaved?: () => void
}

export function MobileJobDetailDrawer({ 
  job, 
  isOpen, 
  onOpenChange, 
  isSaved = false, 
  onToggleSaved 
}: MobileJobDetailDrawerProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  if (!job) return null

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

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') {
      return "Datum unbekannt"
    }
    
    let date: Date
    
    if (!isNaN(Number(dateString))) {
      const timestamp = Number(dateString)
      date = new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000)
    } else {
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) {
      return "Datum unbekannt"
    }

    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Heute"
    if (diffDays === 2) return "Gestern"
    if (diffDays <= 7) return `vor ${diffDays - 1} Tagen`
    
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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

  const handleApply = () => {
    // In a real app, you'd redirect to the application page
    if (job?.apply_link) {
      window.open(job.apply_link, '_blank')
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] max-h-[90vh] w-full rounded-t-xl border-t-4 border-t-[#0F973D]"
      >
        <SheetHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-left">
              Job Details
            </SheetTitle>
          </div>
          
          {/* Job Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {job.company?.employer_logo ? (
                <img
                  src={job.company.employer_logo}
                  alt={`${job.company.employer_name} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold mb-2">{job.title}</h1>
              <p className="text-lg text-muted-foreground mb-2">{job.company?.employer_name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {job.job_city}, {job.job_state}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSaved}
                className={cn(isSaved && "text-[#0F973D]")}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Job Tags */}
          <div className="flex flex-wrap gap-2">
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
        </SheetHeader>

        {/* Job Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pt-4">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
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
              <CardTitle className="text-lg">Über das Unternehmen</CardTitle>
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
                    onClick={() => setShowFullDescription(!showFullDescription)}
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
                <CardTitle className="text-lg">Recruiter Kontakt</CardTitle>
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

        {/* Apply Button - Fixed at bottom */}
        <div className="border-t bg-transparent">
          <div className="flex justify-center py-4">
            <Button 
              onClick={handleApply}
              className="bg-[#0F973D] hover:bg-[#0F973D]/90 text-white font-semibold py-3 px-8"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Jetzt bewerben
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
