"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { User, Save, FileText, GraduationCap, Briefcase, Zap, Award, BookOpen, FileText as FileTextIcon, Heart } from "lucide-react"
import { PersonalInfo } from "@/components/resume-sections/personal-info"
import { Education } from "@/components/resume-sections/education"
import { Experience } from "@/components/resume-sections/experience"
import { Skills } from "@/components/resume-sections/skills"
import { Certifications } from "@/components/resume-sections/certifications"
import { Courses } from "@/components/resume-sections/courses"
import { Publications } from "@/components/resume-sections/publications"
import { Interests } from "@/components/resume-sections/interests"
import { getProfile, updateProfile } from "@/lib/xano"

// Import the interfaces from the resume sections
interface PersonalInfoData {
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  adresse_street?: string;
  adresse_city: string;
  adresse_postcode?: string;
  adresse_country?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  gpa?: string;
}

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// Import interfaces from the new components
import type { CertificationEntry } from "@/components/resume-sections/certifications"
import type { CourseEntry } from "@/components/resume-sections/courses"
import type { PublicationEntry } from "@/components/resume-sections/publications"
import type { InterestEntry } from "@/components/resume-sections/interests"

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  // Refs for scrolling to sections
  const personalRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const certificationsRef = useRef<HTMLDivElement>(null)
  const coursesRef = useRef<HTMLDivElement>(null)
  const publicationsRef = useRef<HTMLDivElement>(null)
  const interestsRef = useRef<HTMLDivElement>(null)

  // Resume data state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    adresse_street: "",
    adresse_city: "",
    adresse_postcode: "",
    adresse_country: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  })

  const [education, setEducation] = useState<EducationEntry[]>([])
  const [experience, setExperience] = useState<ExperienceEntry[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<CertificationEntry[]>([])
  const [courses, setCourses] = useState<CourseEntry[]>([])
  const [publications, setPublications] = useState<PublicationEntry[]>([])
  const [interests, setInterests] = useState<InterestEntry[]>([])

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setIsLoadingData(true)
      
      // Get auth token from cookies (same as other parts of the app)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]
      
      // Debug: log what we found
      console.log('Auth token found:', !!token)
      
      if (!token) {
        console.error('No auth token found in cookies')
        toast.error("Nicht angemeldet - Bitte melden Sie sich erneut an")
        return
      }

      // For now, using a default profile ID of 1 - you might need to get this from user context
      // In a real app, you might get this from the user's profile or a separate endpoint
      const profileId = 1
      console.log('Loading profile data for ID:', profileId)
      
      const profileData = await getProfile(token, profileId)
      console.log('Profile data received:', profileData)
      
      // Transform API data to component format
      transformApiDataToComponent(profileData)
      
    } catch (error: any) {
      console.error('Error loading profile data:', error)
      
      // More specific error handling
      if (error.response?.status === 401) {
        toast.error("Nicht angemeldet - Bitte melden Sie sich erneut an")
      } else if (error.response?.status === 404) {
        toast.error("Profil nicht gefunden")
      } else {
        toast.error("Fehler beim Laden der Profildaten")
      }
    } finally {
      setIsLoadingData(false)
    }
  }

  const transformApiDataToComponent = (apiData: any) => {
    // The API response now has the profile data nested under profile_data
    const profileData = apiData.profile_data || apiData
    
    console.log('Transforming profile data:', profileData)
         console.log('Skills data:', profileData.skills)
     console.log('Skill data (alternative):', profileData.skill)
     console.log('Experience data:', profileData.experience)
     console.log('Courses data:', profileData.courses)
     console.log('Publications data:', profileData.publications)
     console.log('Interests data:', profileData.interests)
    
    // Transform basic profile data
    if (profileData) {
      // Handle the basics object if it exists
      const basics = profileData.basics || {}
      
      setPersonalInfo({
        fullName: basics.first_name && basics.surname 
          ? `${basics.first_name} ${basics.surname}`.trim()
          : profileData.title || '',
        email: basics.email || '',
        phone: basics.telephone || profileData.number || '',
        location: profileData.residence?.place_formatted || '',
        adresse_street: basics.adresse_street || '',
        adresse_city: basics.adresse_city || profileData.residence?.name || '',
        adresse_postcode: basics.adresse_postcode || '',
        adresse_country: basics.adresse_country || profileData.residence?.country || '',
        website: profileData.link?.find((link: any) => link.label === 'website')?.url || 
                profileData.links?.find((link: any) => link.label === 'website')?.url || '',
        linkedin: profileData.link?.find((link: any) => link.label === 'linkedin')?.url || 
                 profileData.links?.find((link: any) => link.label === 'linkedin')?.url || 
                 profileData.linkedin_url || '',
        github: profileData.link?.find((link: any) => link.label === 'github')?.url || 
               profileData.links?.find((link: any) => link.label === 'github')?.url || '',
        summary: basics.description || profileData.hobby || '',
      })
    }

    // Transform skills data
    if (profileData.skills && Array.isArray(profileData.skills)) {
      const transformedSkills = profileData.skills.map((skill: any, index: number) => ({
        id: index.toString(),
        name: typeof skill === 'string' ? skill : skill.skill || skill.name || '',
        category: (typeof skill === 'object' && skill.label) || 'technical' as const,
        level: 'intermediate' as const,
      }))
      setSkills(transformedSkills)
    } else if (profileData.skill && Array.isArray(profileData.skill)) {
      // Alternative field name for skills
      const transformedSkills = profileData.skill.map((skill: any, index: number) => ({
        id: index.toString(),
        name: typeof skill === 'string' ? skill : skill.skill || skill.name || '',
        category: (typeof skill === 'object' && skill.label) || 'technical' as const,
        level: 'intermediate' as const,
      }))
      setSkills(transformedSkills)
    }

    // Transform education data
    if (profileData.education && Array.isArray(profileData.education)) {
      const transformedEducation = profileData.education.map((edu: any, index: number) => ({
        id: index.toString(),
        institution: edu.school || '',
        degree: edu.degree || '',
        field: edu.subject || '',
        location: edu.location_city || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        current: false,
        description: edu.description || '',
        gpa: edu.grade || '',
      }))
      setEducation(transformedEducation)
    }

    // Transform experience data
    if (profileData.experience && Array.isArray(profileData.experience)) {
      const transformedExperience = profileData.experience.map((exp: any, index: number) => ({
        id: index.toString(),
        company: exp.company || '',
        position: exp.title || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: false,
        description: exp.description || '',
        achievements: exp.achievements && Array.isArray(exp.achievements) ? exp.achievements : [],
      }))
      setExperience(transformedExperience)
    }

    // Transform certifications data
    if (profileData.certifications && Array.isArray(profileData.certifications)) {
      const transformedCertifications = profileData.certifications.map((cert: any, index: number) => ({
        id: index.toString(),
        name: cert.name || '',
        issuer: cert.organization || '',
        issueDate: cert.issue_date || '',
      }))
      setCertifications(transformedCertifications)
    }

         // Transform courses data
     if (profileData.courses && Array.isArray(profileData.courses)) {
       const transformedCourses = profileData.courses.map((course: any, index: number) => ({
         id: index.toString(),
         title: course.name || '',
         provider: course.institution || '',
         startDate: course.startDate || '',
         endDate: course.endDate || '',
         description: course.description || '',
       }))
       setCourses(transformedCourses)
     }

         // Transform publications data
     if (profileData.publications && Array.isArray(profileData.publications)) {
       const transformedPublications = profileData.publications.map((pub: any, index: number) => ({
         id: index.toString(),
         title: pub.title || '',
         authors: pub.authors || '',
         journal: pub.journal || '',
         publicationDate: pub.year || '',
         doi: pub.doi || '',
         abstract: pub.description || '',
         type: 'article' as const,
       }))
       setPublications(transformedPublications)
     }

    // Transform interests data
    if (profileData.interests && Array.isArray(profileData.interests)) {
      const transformedInterests = profileData.interests.map((interest: any, index: number) => ({
        id: index.toString(),
        name: interest.name || '',
        category: interest.category || 'other',
        description: interest.description || '',
      }))
      setInterests(transformedInterests)
    }
  }

  const transformComponentDataToApi = () => {
    // For the PUT request, we need to match the structure expected by the API
    // Based on the original data structure you provided, we'll use that format
    const nameParts = personalInfo.fullName.split(' ')
    const firstName = nameParts[0] || ''
    const surname = nameParts.slice(1).join(' ') || ''

    return {
      link: [
        {
          url: personalInfo.website || '',
          label: 'website'
        },
        {
          url: personalInfo.linkedin || '',
          label: 'linkedin'
        },
        {
          url: personalInfo.github || '',
          label: 'github'
        }
      ].filter(link => link.url),
      skill: skills.map(skill => ({
        label: skill.category,
        skill: skill.name
      })),
      basics: {
        email: personalInfo.email,
        image: "",
        surname: surname,
        birthdate: "",
        telephone: personalInfo.phone || "",
        first_name: firstName,
        description: personalInfo.summary || "",
        nationality: "",
        gender: "",
        title_after: "",
        adresse_city: personalInfo.adresse_city,
        title_before: "",
        adresse_street: personalInfo.adresse_street || "",
        adresse_country: personalInfo.adresse_country || "",
        adresse_postcode: personalInfo.adresse_postcode || ""
      },
      language: [],
      education: education.map(edu => ({
        grade: edu.gpa || "",
        degree: edu.degree,
        school: edu.institution,
        endDate: edu.endDate,
        subject: edu.field,
        startDate: edu.startDate,
        description: edu.description || "",
        location_city: edu.location,
        location_country: ""
      })),
      experience: experience.map(exp => ({
        title: exp.position,
        company: exp.company,
        endDate: exp.endDate,
        location: exp.location,
        startDate: exp.startDate,
        description: exp.description,
        achievements: exp.achievements
      })),
             certifications: certifications.map(cert => ({
         name: cert.name,
         organization: cert.issuer,
         endDate: "",
         issue_date: cert.issueDate
       })),
       courses: courses.map(course => ({
         name: course.title,
         institution: course.provider,
         startDate: course.startDate,
         endDate: course.endDate || "",
         description: course.description || ""
       })),
       publications: publications.map(pub => ({
         title: pub.title,
         authors: pub.authors,
         journal: pub.journal || "",
         year: pub.publicationDate,
         doi: pub.doi || "",
         description: pub.abstract || ""
       })),
       interests: interests.map(interest => ({
         name: interest.name,
         category: interest.category,
         description: interest.description || ""
       }))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Get auth token from cookies (same as other parts of the app)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]
      
      if (!token) {
        toast.error("Nicht angemeldet - Bitte melden Sie sich erneut an")
        return
      }

      const profileId = 1 // You might need to get this from user context
      const apiData = transformComponentDataToApi()
      
      await updateProfile(token, profileId, apiData)
      
      toast.success("Profil erfolgreich gespeichert!")
      setHasChanges(false)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      
      // More specific error handling
      if (error.response?.status === 401) {
        toast.error("Nicht angemeldet - Bitte melden Sie sich erneut an")
      } else if (error.response?.status === 404) {
        toast.error("Profil nicht gefunden")
      } else {
        toast.error("Fehler beim Speichern des Profils")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePersonalInfoChange = (data: PersonalInfoData) => {
    setPersonalInfo(data)
    setHasChanges(true)
  }

  const handleEducationChange = (data: EducationEntry[]) => {
    setEducation(data)
    setHasChanges(true)
  }

  const handleExperienceChange = (data: ExperienceEntry[]) => {
    setExperience(data)
    setHasChanges(true)
  }

  const handleSkillsChange = (data: Skill[]) => {
    setSkills(data)
    setHasChanges(true)
  }

  const handleCertificationsChange = (data: CertificationEntry[]) => {
    setCertifications(data)
    setHasChanges(true)
  }

  const handleCoursesChange = (data: CourseEntry[]) => {
    setCourses(data)
    setHasChanges(true)
  }

  const handlePublicationsChange = (data: PublicationEntry[]) => {
    setPublications(data)
    setHasChanges(true)
  }

  const handleInterestsChange = (data: InterestEntry[]) => {
    setInterests(data)
    setHasChanges(true)
  }

  const scrollToSection = (sectionId: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      personal: personalRef,
      education: educationRef,
      experience: experienceRef,
      skills: skillsRef,
      certifications: certificationsRef,
      courses: coursesRef,
      publications: publicationsRef,
      interests: interestsRef,
    }

    const ref = refs[sectionId]
    if (ref?.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
    setActiveTab(sectionId)
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const sections = [
      // Personal Info - check if name and email are filled
      personalInfo.fullName.trim() !== '' && personalInfo.email.trim() !== '',
      // Education - check if at least one entry exists
      education.length > 0,
      // Experience - check if at least one entry exists
      experience.length > 0,
      // Skills - check if at least one skill exists
      skills.length > 0,
      // Certifications - check if at least one entry exists
      certifications.length > 0,
      // Courses - check if at least one entry exists
      courses.length > 0,
      // Publications - check if at least one entry exists
      publications.length > 0,
      // Interests - check if at least one entry exists
      interests.length > 0,
    ]

    const completedSections = sections.filter(Boolean).length
    const totalSections = sections.length
    return Math.round((completedSections / totalSections) * 100)
  }

  const profileCompletion = calculateProfileCompletion()

  if (isLoadingData) {
    return (
      <div className="profile-settings space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Lade Profildaten...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-settings space-y-6">
      {/* Progress Indicator */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Profil-Vervollständigung</h3>
          <span className="text-sm font-semibold text-green-600">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-4">
        <Tabs value={activeTab} onValueChange={scrollToSection} className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Persönlich
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Ausbildung
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Erfahrung
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Zertifikate
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Kurse
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              Publikationen
            </TabsTrigger>
            <TabsTrigger value="interests" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Interessen
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Personal Information */}
      <div ref={personalRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Persönliche Informationen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfo 
              data={personalInfo} 
              onChange={handlePersonalInfoChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Education */}
      <div ref={educationRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Ausbildung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Education 
              data={education} 
              onChange={handleEducationChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Experience */}
      <div ref={experienceRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Berufserfahrung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Experience 
              data={experience} 
              onChange={handleExperienceChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <div ref={skillsRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fähigkeiten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skills 
              data={skills} 
              onChange={handleSkillsChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Certifications */}
      <div ref={certificationsRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Zertifikate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Certifications 
              data={certifications} 
              onChange={handleCertificationsChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <div ref={coursesRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Kurse & Weiterbildung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Courses 
              data={courses} 
              onChange={handleCoursesChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Publications */}
      <div ref={publicationsRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Publikationen & Veröffentlichungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Publications 
              data={publications} 
              onChange={handlePublicationsChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Interests */}
      <div ref={interestsRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Interessen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Interests 
              data={interests} 
              onChange={handleInterestsChange} 
              isEditing={true} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !hasChanges}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Speichern..." : "Speichern"}
        </Button>
      </div>
    </div>
  )
} 