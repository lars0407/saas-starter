"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase, Building2, Clock, DollarSign, Filter, Star, Bookmark, ExternalLink, Eye, Sparkles, Bot, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Job } from "@/lib/types"
import { cn } from "@/lib/utils"
import { JobDetailComponent } from "./job-detail-component"

interface AIJobSearchFilters {
  keyword: string
  location: string
  jobType: string
  experienceLevel: string
  salaryRange: string
  remoteWork: string
  companySize: string
  aiQuery: string
}

const initialFilters: AIJobSearchFilters = {
  keyword: "",
  location: "",
  jobType: "all",
  experienceLevel: "all",
  salaryRange: "",
  remoteWork: "all",
  companySize: "all",
  aiQuery: "",
}

// Mock job data - replace with actual API call
const mockJobs: Job[] = [
  {
    id: 1,
    created_at: "2024-01-15T10:00:00Z",
    company_id: 1,
    title: "Senior Frontend Developer",
    job_city: "Berlin",
    job_state: "Berlin",
    job_country: "Germany",
    job_employement_type: "Full-time",
    salary: "€65,000 - €85,000",
    seniority: "Senior",
    job_origin: "LinkedIn",
    job_identifier: 12345,
    apply_link: "https://example.com/apply",
    applicants_number: "45",
    working_hours: "40",
    remote_work: "Hybrid",
    source: "LinkedIn",
    auto_apply: false,
    recruitment_agency: false,
    description: {
      description_original: "We are looking for a Senior Frontend Developer with expertise in React, TypeScript, and modern web technologies. You will be responsible for developing and maintaining web applications that serve millions of users. This is an exciting opportunity to work with cutting-edge technologies and make a real impact on our product.",
      description_responsibilities: "• Develop and maintain web applications using React and TypeScript\n• Collaborate with design and backend teams to implement new features\n• Write clean, maintainable code and participate in code reviews\n• Optimize applications for maximum speed and scalability\n• Ensure cross-browser compatibility and responsive design\n• Mentor junior developers and share best practices\n• Participate in agile development processes",
      description_qualification: "• 5+ years of experience with React, TypeScript, and modern JavaScript\n• Experience with state management libraries like Redux or Zustand\n• Strong understanding of web performance and accessibility\n• Experience with testing frameworks (Jest, React Testing Library)\n• Knowledge of build tools (Webpack, Vite)\n• Experience with CSS-in-JS or modern CSS frameworks\n• Understanding of RESTful APIs and GraphQL\n• Bachelor's degree in Computer Science or related field",
      description_benefits: "• Competitive salary and equity package\n• Flexible working hours and remote work options\n• Health insurance and wellness programs\n• Professional development budget\n• Modern office in the heart of Berlin\n• Regular team events and social activities\n• 25 days of paid vacation\n• Relocation assistance if needed",
    },
    job_geopoint: "52.5200,13.4050",
    recruiter: {
      recruiter_name: "Sarah Johnson",
      recruiter_title: "Senior Recruiter",
      recruiter_url: "https://linkedin.com/in/sarah-johnson",
    },
    company: {
      id: 1,
      created_at: "2024-01-01T00:00:00Z",
      employer_name: "TechCorp GmbH",
      employer_logo: "/images/techcorp-logo.png",
      employer_website: "https://techcorp.com",
      employer_company_type: "Technology",
      employer_linkedin: "https://linkedin.com/company/techcorp",
      company_identifier: 1001,
      about: "Leading technology company in Berlin specializing in innovative web solutions. We help businesses transform their digital presence and create amazing user experiences.",
      short_description: "Innovative tech solutions for modern businesses",
      founded: "2015",
      company_size: "100-500",
    },
  },
  {
    id: 2,
    created_at: "2024-01-14T14:30:00Z",
    company_id: 2,
    title: "UX/UI Designer",
    job_city: "München",
    job_state: "Bayern",
    job_country: "Germany",
    job_employement_type: "Full-time",
    salary: "€55,000 - €75,000",
    seniority: "Mid-level",
    job_origin: "Indeed",
    job_identifier: 12346,
    apply_link: "https://example.com/apply-ux",
    applicants_number: "32",
    working_hours: "40",
    remote_work: "Remote",
    source: "Indeed",
    auto_apply: false,
    recruitment_agency: false,
    description: {
      description_original: "We are seeking a talented UX/UI Designer to join our creative team. You will be responsible for designing beautiful and intuitive user interfaces that enhance user experience and drive engagement.",
      description_responsibilities: "• Design user interfaces and experiences for web and mobile applications\n• Create wireframes, prototypes, and high-fidelity mockups\n• Conduct user research and usability testing\n• Collaborate with product managers and developers\n• Ensure design consistency across all platforms\n• Present design solutions to stakeholders\n• Stay updated with design trends and best practices",
      description_qualification: "• 3+ years of experience in UX/UI design\n• Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)\n• Strong understanding of user-centered design principles\n• Experience with prototyping tools (InVision, Framer)\n• Knowledge of design systems and component libraries\n• Understanding of web accessibility standards\n• Portfolio showcasing your design work\n• Bachelor's degree in Design or related field",
      description_benefits: "• Creative and collaborative work environment\n• Professional development opportunities\n• Flexible work arrangements\n• Competitive salary and benefits\n• Modern design tools and resources\n• Regular design workshops and conferences\n• Health and wellness programs\n• 25 days of paid vacation",
    },
    job_geopoint: "48.1351,11.5820",
    recruiter: {
      recruiter_name: "Michael Schmidt",
      recruiter_title: "HR Manager",
      recruiter_url: "https://linkedin.com/in/michael-schmidt",
    },
    company: {
      id: 2,
      created_at: "2024-01-01T00:00:00Z",
      employer_name: "DesignStudio AG",
      employer_logo: "/images/designstudio-logo.png",
      employer_website: "https://designstudio.com",
      employer_company_type: "Design",
      employer_linkedin: "https://linkedin.com/company/designstudio",
      company_identifier: 1002,
      about: "Creative design agency in Munich specializing in digital experiences and brand identity. We help companies create meaningful connections with their users through thoughtful design.",
      short_description: "Beautiful digital experiences",
      founded: "2018",
      company_size: "50-100",
    },
  },
  {
    id: 3,
    created_at: "2024-01-13T09:15:00Z",
    company_id: 3,
    title: "Backend Developer",
    job_city: "Hamburg",
    job_state: "Hamburg",
    job_country: "Germany",
    job_employement_type: "Full-time",
    salary: "€70,000 - €90,000",
    seniority: "Senior",
    job_origin: "Glassdoor",
    job_identifier: 12347,
    apply_link: "https://example.com/apply-backend",
    applicants_number: "28",
    working_hours: "40",
    remote_work: "On-site",
    source: "Glassdoor",
    auto_apply: false,
    recruitment_agency: false,
    description: {
      description_original: "Join our backend development team and help build scalable, high-performance services that power our applications. You will work with modern technologies and contribute to architectural decisions.",
      description_responsibilities: "• Build scalable backend services using Node.js and TypeScript\n• Design and implement RESTful APIs and GraphQL endpoints\n• Work with databases (PostgreSQL, MongoDB) and caching solutions\n• Implement authentication and authorization systems\n• Write unit and integration tests\n• Collaborate with frontend and DevOps teams\n• Participate in code reviews and technical discussions\n• Monitor and optimize application performance",
      description_qualification: "• 5+ years of experience with Node.js and TypeScript\n• Experience with databases (PostgreSQL, MongoDB)\n• Knowledge of microservices architecture\n• Experience with Docker and Kubernetes\n• Understanding of RESTful APIs and GraphQL\n• Experience with testing frameworks (Jest, Mocha)\n• Knowledge of CI/CD pipelines\n• Bachelor's degree in Computer Science or related field",
      description_benefits: "• Great team and collaborative environment\n• Modern tech stack and tools\n• Competitive salary and benefits\n• Professional development opportunities\n• Flexible working hours\n• Health insurance and wellness programs\n• Regular team events\n• 25 days of paid vacation",
    },
    job_geopoint: "53.5511,9.9937",
    recruiter: {
      recruiter_name: "Anna Weber",
      recruiter_title: "Tech Recruiter",
      recruiter_url: "https://linkedin.com/in/anna-weber",
    },
    company: {
      id: 3,
      created_at: "2024-01-01T00:00:00Z",
      employer_name: "HamburgTech Solutions",
      employer_logo: "/images/hamburgtech-logo.png",
      employer_website: "https://hamburgtech.com",
      employer_company_type: "Technology",
      employer_linkedin: "https://linkedin.com/company/hamburgtech",
      company_identifier: 1003,
      about: "Technology solutions provider in Hamburg specializing in scalable backend services and cloud infrastructure. We help businesses build robust and efficient digital solutions.",
      short_description: "Innovative tech solutions",
      founded: "2016",
      company_size: "200-500",
    },
  },
]

export function AIJobSearchComponent() {
  const router = useRouter()
  const [filters, setFilters] = useState<AIJobSearchFilters>(initialFilters)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    // Filter mock jobs based on current filters
    const filterJobs = () => {
      setLoading(true)
      
      let filteredJobs = mockJobs

      // Filter by keyword
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(keyword) ||
          job.company.employer_name.toLowerCase().includes(keyword) ||
          job.description.description_original.toLowerCase().includes(keyword)
        )
      }

      // Filter by location
      if (filters.location) {
        const location = filters.location.toLowerCase()
        filteredJobs = filteredJobs.filter(job => 
          job.job_city.toLowerCase().includes(location) ||
          job.job_state.toLowerCase().includes(location) ||
          job.remote_work.toLowerCase().includes(location)
        )
      }

      // Filter by job type
      if (filters.jobType && filters.jobType !== "all") {
        filteredJobs = filteredJobs.filter(job => 
          job.job_employement_type === filters.jobType
        )
      }

      // Filter by experience level
      if (filters.experienceLevel && filters.experienceLevel !== "all") {
        filteredJobs = filteredJobs.filter(job => 
          job.seniority === filters.experienceLevel
        )
      }

      // Filter by remote work
      if (filters.remoteWork && filters.remoteWork !== "all") {
        filteredJobs = filteredJobs.filter(job => 
          job.remote_work === filters.remoteWork
        )
      }

      // Filter by company size
      if (filters.companySize && filters.companySize !== "all") {
        filteredJobs = filteredJobs.filter(job => 
          job.company.company_size === filters.companySize
        )
      }

      setJobs(filteredJobs)
      setLoading(false)
    }

    filterJobs()
  }, [filters])

  // Select first job when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id)
    }
  }, [jobs, selectedJobId])

  const handleFilterChange = (key: keyof AIJobSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAISearch = async () => {
    if (!filters.aiQuery.trim()) return
    
    setAiLoading(true)
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would call an AI API here
      // For now, we'll just filter based on the AI query
      const aiQuery = filters.aiQuery.toLowerCase()
      const aiFilteredJobs = mockJobs.filter(job => 
        job.title.toLowerCase().includes(aiQuery) ||
        job.company.employer_name.toLowerCase().includes(aiQuery) ||
        job.description.description_original.toLowerCase().includes(aiQuery) ||
        job.description.description_responsibilities.toLowerCase().includes(aiQuery) ||
        job.description.description_qualification.toLowerCase().includes(aiQuery)
      )
      
      setJobs(aiFilteredJobs)
    } catch (error) {
      console.error('AI search error:', error)
    } finally {
      setAiLoading(false)
    }
  }

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
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Heute"
    if (diffDays === 2) return "Gestern"
    if (diffDays <= 7) return `vor ${diffDays - 1} Tagen`
    return date.toLocaleDateString('de-DE')
  }

  const selectedJob = jobs.find(job => job.id === selectedJobId)

  return (
    <div className="h-screen max-h-screen flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-[#0F973D]" />
          <h1 className="text-3xl font-bold">KI Jobsuche</h1>
        </div>
        <p className="text-muted-foreground">
          Beschreibe deinen Traumjob in natürlicher Sprache und lass unsere KI die besten Matches finden
        </p>
      </div>

      {/* AI Search Bar */}
      <Card className="border-[#0F973D]/20 bg-gradient-to-r from-[#0F973D]/5 to-transparent">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#0F973D]" />
              <h3 className="font-semibold">KI-gestützte Jobsuche</h3>
            </div>
            <div className="flex flex-col gap-4">
              <Textarea
                placeholder="Beschreibe deinen Traumjob... z.B. 'Ich suche eine Remote-Position als Senior Developer mit React-Erfahrung in einem Startup mit flexiblen Arbeitszeiten'"
                value={filters.aiQuery}
                onChange={(e) => handleFilterChange('aiQuery', e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  className="bg-[#0F973D] hover:bg-[#0F973D]/90 flex-1"
                  onClick={handleAISearch}
                  disabled={aiLoading || !filters.aiQuery.trim()}
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      KI analysiert...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      KI-Suche starten
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traditional Search Bar */}
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
            <Button className="bg-[#0F973D] hover:bg-[#0F973D]/90">
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
              {loading ? "Lade Jobs..." : `${jobs.length} Jobs gefunden`}
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

          <div className="flex-1 overflow-y-auto space-y-4">
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
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <Card 
                  key={job.id} 
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
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base hover:text-[#0F973D] truncate">
                              {job.title}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">{job.company.employer_name}</p>
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
                          Vor {formatDate(job.created_at)} gepostet
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
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-base font-semibold mb-2">Keine Jobs gefunden</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Versuche deine Suchkriterien zu ändern oder beschreibe deinen Traumjob mit der KI-Suche.
                  </p>
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Filter zurücksetzen
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Load More */}
            {jobs.length > 0 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  Mehr Jobs laden
                </Button>
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
                <JobDetailComponent jobId={selectedJob.id} />
              </div>
            ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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