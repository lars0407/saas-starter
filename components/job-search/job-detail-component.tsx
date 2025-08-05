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
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Job } from "@/lib/types"
import { cn } from "@/lib/utils"

interface JobDetailComponentProps {
  jobId: number
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

export function JobDetailComponent({ jobId }: JobDetailComponentProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true)
      try {
        // In a real app, you'd fetch from `/api/jobs/${jobId}`
        // For now, we'll use mock data
        const mockJob = mockJobs.find(j => j.id === jobId)
        
        if (mockJob) {
          setJob(mockJob)
        } else {
          console.error('Job not found')
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const handleApply = () => {
    setApplied(true)
    // In a real app, you'd redirect to the application page
    window.open(job?.apply_link, '_blank')
  }

  const handleAddToTracker = () => {
    // In a real app, you'd add the job to the tracker
    console.log('Adding job to tracker:', job?.id)
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
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg text-muted-foreground mb-2">{job.company.employer_name}</p>
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
            <Badge variant="outline">{job.company.company_size} Mitarbeiter</Badge>
            <Badge variant="outline">Vor {formatDate(job.created_at)} gepostet</Badge>
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
          <div>
            <h3 className="font-semibold mb-2">Über die Position</h3>
            <p className="text-muted-foreground leading-relaxed">
              {job.description.description_original}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Verantwortlichkeiten</h3>
            <div className="text-muted-foreground whitespace-pre-line">
              {job.description.description_responsibilities}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Qualifikationen</h3>
            <div className="text-muted-foreground whitespace-pre-line">
              {job.description.description_qualification}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Vorteile</h3>
            <div className="text-muted-foreground whitespace-pre-line">
              {job.description.description_benefits}
            </div>
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
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{job.company.employer_name}</h3>
              <p className="text-muted-foreground mb-2">{job.company.short_description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Gegründet: {job.company.founded}</span>
                <span>Größe: {job.company.company_size}</span>
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">{job.company.about}</p>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={job.company.employer_website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={job.company.employer_linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recruiter Information */}
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
                <a href={`mailto:${job.recruiter.recruiter_name.toLowerCase().replace(' ', '.')}@${job.company.employer_name.toLowerCase().replace(' ', '')}.com`}>
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
    </div>
  )
} 