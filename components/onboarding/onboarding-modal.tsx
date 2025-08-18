"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { SpeechBubble } from "./speech-bubble"
import { CharacterImage } from "./character-image"
import { StepContent } from "./step-content"
import { JobTitleStep } from "./job-title-step"
import { WorkLocationStep } from "./work-location-step"
import { JobTypeStep } from "./job-type-step"
import { SalaryExpectationStep } from "./salary-expectation-step"


interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (firstName: string, lastName: string, resumeData?: any) => void
  speechText?: string
  characterSrc?: string
  characterAlt?: string
}

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
  speechText = "Nice, dass du da bist! Lass uns gleich starten – wie heißt du?",
  characterSrc = "/images/characters/Job-Jäger Expressions.png", // Jobjäger character
  characterAlt = "Friendly character",
}: OnboardingModalProps) {
  const [firstName, setFirstName] = useState("Max")
  const [lastName, setLastName] = useState("Mustermann")
  const [currentStep, setCurrentStep] = useState(1)
  const [characterIndex, setCharacterIndex] = useState(0)
  const [resumeData, setResumeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [jobSearchIntensity, setJobSearchIntensity] = useState<string>("")
  const [jobTitle, setJobTitle] = useState<string>("")
  const [workLocation, setWorkLocation] = useState<string>("")
  const [jobType, setJobType] = useState<string>("")
  const [salaryExpectation, setSalaryExpectation] = useState<string>("")
  const [apiError, setApiError] = useState<string>("")

  // localStorage keys
  const ONBOARDING_STEP_KEY = "onboarding_current_step"
  const ONBOARDING_DATA_KEY = "onboarding_data"

  // Function to transform profile data to the required JSON format
  const transformProfileDataToJSONFormat = (data: any) => {
    if (!data) return {}
    
    // Transform basics
    const basics = data.basics ? {
      first_name: data.basics.firstName || "",
      last_name: data.basics.lastName || "",
      email: data.basics.email || "",
      phone: data.basics.phone || "",
      adresse_city: data.basics.adresse_city || "",
      adresse_street: data.basics.adresse_street || "",
      adresse_country: data.basics.adresse_country || "",
      adresse_postcode: data.basics.adresse_postcode || "",
      title_before: data.basics.title_before || "",
      title_after: data.basics.title_after || "",
      nationality: data.basics.nationality || "",
      description: data.basics.summary || "",
      birthday: data.basics.birthday || "",
      gender: data.basics.gender || "",
      work_permit: data.basics.work_permit || false,
      number: data.basics.phone || "",
      title: data.basics.title || "",
      hobby: data.basics.hobby || ""
    } : {}
    
    // Transform links
    const links = []
    if (data.basics?.website) {
      links.push({ url: data.basics.website, label: "website" })
    }
    if (data.basics?.linkedin) {
      links.push({ url: data.basics.linkedin, label: "linkedin" })
    }
    if (data.basics?.github) {
      links.push({ url: data.basics.github, label: "github" })
    }
    
    // Transform education
    const education = Array.isArray(data.education) ? data.education.map((item: any) => {
      const { id, ...itemWithoutId } = item
      return {
        grade: itemWithoutId.gpa || "",
        degree: itemWithoutId.degree || "",
        school: itemWithoutId.institution || "",
        endDate: itemWithoutId.endDate || "",
        subject: itemWithoutId.field || "",
        startDate: itemWithoutId.startDate || "",
        description: itemWithoutId.description || "",
        location_city: itemWithoutId.location || "",
        location_country: ""
      }
    }) : []
    
    // Transform experience
    const experience = Array.isArray(data.experience) ? data.experience.map((item: any) => {
      const { id, ...itemWithoutId } = item
      return {
        title: itemWithoutId.position || "",
        company: itemWithoutId.company || "",
        endDate: itemWithoutId.endDate || "",
        location: itemWithoutId.location || "",
        startDate: itemWithoutId.startDate || "",
        description: itemWithoutId.description || "",
        achievements: Array.isArray(itemWithoutId.achievements) ? itemWithoutId.achievements : []
      }
    }) : []
    
    // Transform skills
    const skills = Array.isArray(data.skills) ? data.skills.map((item: any) => {
      const { id, ...itemWithoutId } = item
      return {
        label: itemWithoutId.category || "technical",
        skill: itemWithoutId.name || ""
      }
    }) : []
    
    return {
      link: links,
      skill: skills,
      basics: basics,
      courses: [],
      language: [],
      education: education,
      interests: [],
      experience: experience,
      publications: [],
      certifications: []
    }
  }

  // Function to transform work location to remote_work array
  const transformWorkLocationToRemoteWork = (workLocation: string): string[] => {
    switch (workLocation) {
      case 'remote':
        return ['Vollständig remote']
      case 'in-person':
        return ['Kein Homeoffice']
      case 'hybrid':
        return ['Hybrid']
      default:
        return ['Kein Homeoffice', 'null', 'Vollständig remote', 'Hybrid', 'Teilweise Homeoffice']
    }
  }

  // Function to transform job type to employement_type array
  const transformJobTypeToEmployementType = (jobType: string): string[] => {
    switch (jobType) {
      case 'full-time':
        return ['FULL_TIME', 'Not Applicable']
      case 'part-time':
        return ['PART_TIME']
      case 'flexible':
        return ['FULL_TIME', 'PART_TIME', 'INTERN', 'FREELANCE', 'TEMPORARY', 'Not Applicable']
      default:
        return ['FULL_TIME', 'Not Applicable']
    }
  }

  // Function to parse salary expectation
  const parseSalaryExpectation = (salaryString: string): { type: string, amount_eur: number } => {
    if (!salaryString || salaryString === 'flexible: negotiable') {
      return { type: "Monthly salary (gross)", amount_eur: 3500 }
    }
    
    const parts = salaryString.split(': ')
    if (parts.length === 2) {
      const type = parts[0]
      const amount = parseInt(parts[1]) || 3500
      
      // Convert yearly to monthly if needed
      if (type === 'yearly') {
        return { type: "Yearly salary (gross)", amount_eur: Math.round(amount / 12) }
      } else {
        return { type: "Monthly salary (gross)", amount_eur: amount }
      }
    }
    
    return { type: "Monthly salary (gross)", amount_eur: 3500 }
  }

  // API function to save onboarding data
  const saveOnboardingToAPI = async () => {
    try {
      // Get the search data from localStorage
      const searchData = localStorage.getItem('onboarding_search')
      const parsedSearchData = searchData ? JSON.parse(searchData) : {}
      
      // Get auth token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (!token) {
        throw new Error('No authentication token found. Please log in again.')
      }
      
      // Transform profile data to the required JSON format
      const transformedProfileData = transformProfileDataToJSONFormat(profileData)
      
      // Transform onboarding data to match new API structure
      const remoteWorkArray = transformWorkLocationToRemoteWork(workLocation)
      const employementTypeArray = transformJobTypeToEmployementType(jobType)
      const jobTitleArray = jobTitle ? [jobTitle] : []
      const salaryData = parseSalaryExpectation(salaryExpectation)
      
      // Prepare the request payload according to new API specification
      const payload = {
        profile_data: transformedProfileData,
        search_profile: {
          job_search_activity: jobSearchIntensity || "active",
          search_term: jobTitle || "",
          salary: salaryData.amount_eur,
          range: "monthly",
          roles: jobTitleArray,
          job_title: jobTitleArray,
          work_location_preference: workLocation || "flexible",
          work_time_preference: jobType || "flexible",
          employement_type: employementTypeArray,
          remote_work: remoteWorkArray,
          type_of_workplace: {
            hybrid: workLocation === 'hybrid',
            remote: workLocation === 'remote',
            onsite: workLocation === 'in-person'
          },
          search_type: {
            active: jobSearchIntensity === 'active',
            passive: jobSearchIntensity === 'casual',
            curious: jobSearchIntensity === 'browsing'
          },
          salary_expectation: salaryData,
          date_published: Date.now(),
          parameter: {},
          location: {},
          profile_id: 0
        },
        linkedin_url: profileData?.basics?.linkedin || "",
        job_title: jobTitleArray,
        remote_work: remoteWorkArray,
        employement_type: employementTypeArray
      }

      console.log('Sending onboarding data to API:', payload)
      console.log('Profile data structure:', profileData)
      console.log('Search data structure:', parsedSearchData)
      console.log('Full payload JSON:', JSON.stringify(payload, null, 2))
      
      // Try with the full payload first
      let response = await fetch('https://api.jobjaeger.de/api:cP4KlfKj/v3/onboarding7complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      // If the first attempt fails, try with a minimal payload
      if (!response.ok && response.status !== 401) {
        console.log('Full payload failed, trying with minimal payload...')
        const minimalPayload = {
          profile_data: {},
          search_profile: {},
          linkedin_url: "",
          job_title: [],
          remote_work: [],
          employement_type: []
        }
        
        console.log('Trying minimal payload:', minimalPayload)
        
        response = await fetch('https://api.jobjaeger.de/api:cP4KlfKj/v3/onboarding7complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(minimalPayload)
        })
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.')
        }
        
        // Try to get error details from response
        let errorDetails = ''
        try {
          const errorResponse = await response.text()
          errorDetails = errorResponse
          console.error('API Error Response:', errorResponse)
          console.error('Response status:', response.status)
          console.error('Response headers:', Object.fromEntries(response.headers.entries()))
        } catch (e) {
          errorDetails = 'Could not read error response'
          console.error('Error reading response:', e)
        }
        
        throw new Error(`API request failed: ${response.status} ${response.statusText}. Details: ${errorDetails}`)
      }

      const result = await response.json()
      console.log('Onboarding data saved successfully:', result)
      return result
    } catch (error) {
      console.error('Error saving onboarding data to API:', error)
      throw error
    }
  }

  // Array of character expressions
  const characterExpressions = [
    "/images/characters/Job-Jäger Expressions.png",
    "/images/characters/jobjaeger-gruebelnd.png",
    "/images/characters/jobjaeger-daumenhoch.png",
    "/images/characters/jobjaeger-gruebelnd.png",
    "/images/characters/jobjaeger-zielen.png",
    "/images/characters/jobjaeger_cheer.png",
    "/images/characters/jobjaeger-zeitdruck.png",
    "/images/characters/jobjaeger-gruebelnd.png"
  ]

  // Save current step to localStorage
  const saveCurrentStep = (step: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_STEP_KEY, step.toString())
      
      // Save all onboarding data
      const onboardingData = {
        firstName,
        lastName,
        resumeData,
        profileData,
        jobSearchIntensity,
        jobTitle,
        workLocation,
        jobType,
        salaryExpectation,
        characterIndex
      }
      localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(onboardingData))
      
      // Save search-specific data in separate object
      const onboardingSearchData = {
        job_search_activity: jobSearchIntensity || "active",
        job_title: jobTitle ? [jobTitle] : [],
        remote_work: transformWorkLocationToRemoteWork(workLocation),
        employement_type: transformJobTypeToEmployementType(jobType),
        work_location_preference: workLocation || "flexible",
        work_time_preference: jobType || "flexible",
        salary_expectation: parseSalaryExpectation(salaryExpectation)
      }
      localStorage.setItem('onboarding_search', JSON.stringify(onboardingSearchData))
    }
  }

  // Load saved step and data from localStorage
  const loadSavedStep = () => {
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem(ONBOARDING_STEP_KEY)
      const savedData = localStorage.getItem(ONBOARDING_DATA_KEY)
      
      if (savedStep) {
        const step = parseInt(savedStep, 10)
        if (step >= 1 && step <= 9) {
          setCurrentStep(step)
        }
      }
      
      if (savedData) {
        try {
          const data = JSON.parse(savedData)
          if (data.firstName) setFirstName(data.firstName)
          if (data.lastName) setLastName(data.lastName)
          if (data.resumeData) setResumeData(data.resumeData)
          if (data.profileData) setProfileData(data.profileData)
          if (data.jobSearchIntensity) setJobSearchIntensity(data.jobSearchIntensity)
          if (data.jobTitle) setJobTitle(data.jobTitle)
          if (data.workLocation) setWorkLocation(data.workLocation)
          if (data.jobType) setJobType(data.jobType)
          if (data.salaryExpectation) setSalaryExpectation(data.salaryExpectation)
          if (data.characterIndex !== undefined) setCharacterIndex(data.characterIndex)
        } catch (error) {
          console.error('Error parsing saved onboarding data:', error)
        }
      }
    }
  }

  // Load saved data when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('Onboarding modal opened, loading saved data...')
      loadSavedStep()

    }
  }, [isOpen])

  // Ensure correct character for each step
  useEffect(() => {
    if (isOpen) {
      if (currentStep === 1) {
        setCharacterIndex(0) // Force character index 0 for step 1
      } else if (currentStep === 2) {
        setCharacterIndex(1) // Force character index 1 for step 2
      } else if (currentStep === 3) {
        setCharacterIndex(2) // Force character index 2 for step 3
      } else if (currentStep === 4) {
        setCharacterIndex(3) // Force character index 3 for step 4
      } else if (currentStep === 5) {
        setCharacterIndex(4) // Force character index 4 for step 5
      } else if (currentStep === 6) {
        setCharacterIndex(5) // Force character index 5 for step 6
      } else if (currentStep === 7) {
        setCharacterIndex(6) // Force character index 6 for step 7
      } else if (currentStep === 8) {
        setCharacterIndex(7) // Force character index 7 for step 8
      }
    }
  }, [isOpen, currentStep])

  // Save step whenever currentStep changes
  useEffect(() => {
    if (isOpen && currentStep > 1) {
      saveCurrentStep(currentStep)
    }
  }, [currentStep, isOpen, firstName, lastName, resumeData, profileData, jobSearchIntensity, jobTitle, workLocation, jobType, salaryExpectation, characterIndex])

  // Clear localStorage when onboarding is completed
  const clearOnboardingData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ONBOARDING_STEP_KEY)
      localStorage.removeItem(ONBOARDING_DATA_KEY)
      localStorage.removeItem('onboarding_search')
      console.log('Onboarding data cleared from localStorage')
    }
  }



  // For development: manually clear localStorage
  // Uncomment and call this function if you need to reset onboarding
  // const resetOnboarding = () => {
  //   clearOnboardingData()
  //   setCurrentStep(1)
  //   setFirstName("Max")
  //   setLastName("Mustermann")
  //   setResumeData(null)
  //   setProfileData(null)
  //   setJobSearchIntensity("")
  //   setJobTitle("")
  //   setWorkLocation("")
  //   setJobType("")
  //   setSalaryExpectation("")
  //   setCharacterIndex(0)
  // }

  const handleContinue = async () => {
    if (currentStep === 1) {
      // Move to step 2 (resume upload)
      setCurrentStep(2)
      setCharacterIndex(1) // Change to different character expression
    } else if (currentStep === 2) {
      // Move to step 3 (profile creation)
      setCurrentStep(3)
      setCharacterIndex(2) // Change to different character expression
    } else if (currentStep === 3) {
      // Move to step 4 (job search intensity)
      setCurrentStep(4)
      setCharacterIndex(3) // Change to different character expression
    } else if (currentStep === 4) {
      // Move to step 5 (job title)
      setCurrentStep(5)
      setCharacterIndex(4) // Change to different character expression
    } else if (currentStep === 5) {
      // Move to step 6 (work location)
      setCurrentStep(6)
      setCharacterIndex(5) // Change to different character expression
    } else if (currentStep === 6) {
      // Move to step 7 (job type)
      setCurrentStep(7)
      setCharacterIndex(0) // Reset to first character expression
    } else if (currentStep === 7) {
      // Move to step 8 (salary expectation)
      setCurrentStep(8)
      setCharacterIndex(1) // Change to different character expression
    }
  }

  // Handle final completion
  const handleStartNow = () => {
    clearOnboardingData() // Clear saved data
    onComplete(firstName, lastName, resumeData)
  }

  const handleResumeProcessing = async (data: any) => {
    console.log('OnboardingModal: handleResumeProcessing called with:', data)
    
    if (data.method === 'file' && data.parsedData) {
      // Resume was successfully parsed, store the data
      setResumeData(data)
      
      // Transform the parsed data to match the profile format
      const transformedProfileData = {
        basics: {
          firstName: data.parsedData.basics?.first_name || '',
          lastName: data.parsedData.basics?.surname || '',
          email: data.parsedData.basics?.email || '',
          phone: data.parsedData.basics?.telephone || '',
          location: data.parsedData.basics?.adresse_city || '',
          adresse_street: data.parsedData.basics?.adresse_street || '',
          adresse_city: data.parsedData.basics?.adresse_city || '',
          adresse_postcode: data.parsedData.basics?.adresse_postcode || '',
          adresse_country: data.parsedData.basics?.adresse_country || '',
          website: data.parsedData.link?.find((l: any) => l.label === 'Website')?.url || '',
          linkedin: data.parsedData.link?.find((l: any) => l.label === 'LinkedIn')?.url || '',
          github: data.parsedData.link?.find((l: any) => l.label === 'GitHub')?.url || '',
          summary: data.parsedData.basics?.description || '',
        },
        education: data.parsedData.education?.map((edu: any) => ({
          id: `edu-${Date.now()}-${Math.random()}`,
          institution: edu.school || '',
          degree: edu.degree || '',
          field: edu.subject || '',
          location: `${edu.location_city || ''}, ${edu.location_country || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          current: false,
          description: edu.description || '',
          gpa: edu.grade || '',
        })) || [],
        experience: data.parsedData.experience?.map((exp: any) => ({
          id: `exp-${Date.now()}-${Math.random()}`,
          company: exp.company || '',
          position: exp.title || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          current: false,
          description: exp.description || '',
          achievements: exp.achievements || [],
        })) || [],
        skills: data.parsedData.skill?.map((skill: any) => ({
          id: `skill-${Date.now()}-${Math.random()}`,
          name: skill.skill || '',
          category: skill.label || 'technical',
          level: 'intermediate',
        })) || [],
        certifications: data.parsedData.certifications?.map((cert: any) => ({
          id: `cert-${Date.now()}-${Math.random()}`,
          name: cert.name || '',
          issuer: cert.organization || '',
          issueDate: cert.issue_date || '',
          description: '',
        })) || [],
        courses: data.parsedData.courses?.map((course: any) => ({
          id: `course-${Date.now()}-${Math.random()}`,
          title: course.name || '',
          provider: course.institution || '',
          startDate: course.startDate || '',
          endDate: course.endDate || '',
          duration: '',
          certificate: '',
          description: course.description || '',
          skills: [],
        })) || [],
        publications: data.parsedData.publications?.map((pub: any) => ({
          id: `pub-${Date.now()}-${Math.random()}`,
          title: pub.title || '',
          type: pub.type || 'article',
          authors: Array.isArray(pub.authors) ? pub.authors : [pub.authors || ''],
          publicationDate: pub.publicationDate || '',
          journal: pub.journal || '',
          doi: pub.doi || '',
          publisher: pub.publisher || '',
          url: pub.url || '',
          abstract: pub.abstract || '',
        })) || [],
        interests: data.parsedData.interests?.map((interest: any) => ({
          id: `interest-${Date.now()}-${Math.random()}`,
          name: interest.name || '',
          category: interest.category || 'general',
          description: interest.description || '',
        })) || [],
      }
      
      // Store the transformed profile data
      setProfileData(transformedProfileData)
      
      // Save the raw parsed data to localStorage for the profile modal to access
      // This allows ProfileContent to properly transform and display the CV data
      localStorage.setItem('onboarding_parsed_resume', JSON.stringify(data.parsedData))
      console.log('OnboardingModal: Stored raw parsed resume data in localStorage:', data.parsedData)
      
      // Move to profile creation step
      setCurrentStep(3)
      setCharacterIndex(2)
    } else {
      // Other methods (LinkedIn, manual, etc.)
      setResumeData(data)
      setCurrentStep(3)
      setCharacterIndex(2)
    }
  }

  const handleJobSearchIntensityComplete = (intensity: string) => {
    setJobSearchIntensity(intensity)
    setCurrentStep(5) // Move to job title step
  }

  const handleProfileModalComplete = (data: any) => {
    // Transform personalInfo to basics for consistent data structure
    const transformedData = data && data.personalInfo ? {
      basics: data.personalInfo,
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || []
    } : data
    
    setProfileData(transformedData)
    setCurrentStep(4) // Move to job search intensity step
  }

  const handleJobTitleComplete = (title: string) => {
    console.log('OnboardingModal: handleJobTitleComplete called with:', title)
    setJobTitle(title)
    setCurrentStep(6) // Move to work location step
  }

  const handleWorkLocationComplete = (location: string) => {
    console.log('OnboardingModal: handleWorkLocationComplete called with:', location)
    setWorkLocation(location)
    setCurrentStep(7) // Move to job type step
  }

  const handleJobTypeComplete = (type: string) => {
    console.log('OnboardingModal: handleJobTypeComplete called with:', type)
    setJobType(type)
    setCurrentStep(8) // Move to salary expectation step
  }

  const handleSalaryExpectationComplete = async (salary: string) => {
    console.log('OnboardingModal: handleSalaryExpectationComplete called with:', salary)
    setSalaryExpectation(salary)
    
    // Save data to API before moving to completion step
    try {
      setIsLoading(true)
      setApiError("") // Clear any previous errors
      await saveOnboardingToAPI()
      console.log('Onboarding data saved to API successfully')
      setCurrentStep(9) // Move to completion step
      setCharacterIndex(5) // Show success character expression
    } catch (error) {
      console.error('Failed to save onboarding data to API:', error)
      
      // More specific error handling
      let errorMessage = 'Fehler beim Speichern der Daten. Das Onboarding wird trotzdem abgeschlossen.'
      if (error instanceof Error) {
        if (error.message.includes('Authentication failed') || error.message.includes('No authentication token')) {
          errorMessage = 'Nicht angemeldet. Bitte melden Sie sich erneut an.'
        } else if (error.message.includes('401')) {
          errorMessage = 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.'
        }
      }
      
      setApiError(errorMessage)
      setCurrentStep(9) // Move to completion step even if API fails
      setCharacterIndex(5) // Show success character expression
    } finally {
      setIsLoading(false)
    }
  }

  const handleFirstNameChange = (value: string) => {
    setFirstName(value)
  }

  const handleLastNameChange = (value: string) => {
    setLastName(value)
  }

  const handleResumeDataChange = (data: any) => {
    setResumeData(data)
  }

  // Handle modal close
  const handleModalClose = () => {
    // Prevent closing during onboarding process
    if (currentStep < 9) {
      return // Don't allow closing until completion
    }
    // Only allow closing after step 9 (completion)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className={`sm:mx-auto overflow-visible rounded-2xl shadow-2xl border-3 border-[#0F973D] max-h-[80vh] ${currentStep === 3 ? 'max-w-4xl' : currentStep === 4 || currentStep === 5 || currentStep === 6 || currentStep === 7 || currentStep === 8 || currentStep === 9 ? 'max-w-4xl' : 'max-w-md'}`} showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>Onboarding - Name eingeben</DialogTitle>
        </VisuallyHidden>
        {/* Character and Speech Bubble - Above Modal */}
        <div className="relative bg-transparent">
          {/* Speech Bubble */}
          <div className="absolute -top-22 right-36 z-10">
            <SpeechBubble text={
              isLoading ? "Einen Moment bitte, ich analysiere deine Daten..." :
              currentStep === 1 ? "Nice, dass du da bist! Lass uns gleich starten – wie heißt du?" : 
              currentStep === 2 ? "Next Step! Wie willst du deinen Lebenslauf hinzufügen?" :
              currentStep === 3 ? "Fast geschafft! Lass uns dein Profil aufpolieren 💼" :
              currentStep === 4 ? "Wie sehr bist du im Job-Hunt-Modus? 🔍" :
              currentStep === 5 ? "Dein Zieljob? Sag's uns – wir finden ihn! 💫" :
              currentStep === 6 ? "Wo fühlst du dich am produktivsten? 🏠🏢" :
              currentStep === 7 ? "Wie viel willst du reinhauen? ⏰" :
              currentStep === 8 ? "Let's talk Money 💸 Was stellst du dir vor?" :
              currentStep === 9 ? "Boom! Dein Profil ist am Start 🎯" :
              "Boom! Dein Profil ist am Start 🎯"
            } />
          </div>

          {/* Character */}
          <div className="absolute -top-30 right-4 z-20 bg-transparent">
            <CharacterImage
              src={characterExpressions[characterIndex]}
              alt={characterAlt}
              className="w-32 h-32"
            />
          </div>
        </div>
        
        <div className="relative rounded-b-2xl overflow-y-auto max-h-[calc(80vh-120px)]">
          {/* Form Content */}
          <div className="mt-2 mb-6">
            <StepContent
              step={currentStep}
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={handleFirstNameChange}
              onLastNameChange={handleLastNameChange}
              onResumeDataChange={handleResumeProcessing}
              onJobSearchIntensityComplete={handleJobSearchIntensityComplete}
              onProfileComplete={handleProfileModalComplete}
              onProfileSkip={() => {
                setProfileData({ method: 'skipped' })
                setCurrentStep(4)
              }}
              onBack={() => setCurrentStep(2)}
              onJobTitleComplete={handleJobTitleComplete}
              onWorkLocationComplete={handleWorkLocationComplete}
              onJobTypeComplete={handleJobTypeComplete}
              onSalaryExpectationComplete={handleSalaryExpectationComplete}
              resumeData={resumeData}
              isLoading={isLoading}
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            {!isLoading && currentStep !== 3 && currentStep !== 4 && currentStep !== 5 && currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && currentStep !== 9 && (
              <Button
                onClick={handleContinue}
                className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-8 py-3 rounded-lg font-medium"
              >
                {currentStep === 1 ? `weiter als ${firstName || "Max"}` : 
                 currentStep === 2 ? "Weiter" : "Onboarding abschließen"}
              </Button>
            )}
            {!isLoading && currentStep === 9 && (
              <Button
                onClick={handleStartNow}
                className="bg-[#0F973D] hover:bg-[#0D7A32] text-white px-8 py-3 rounded-lg font-medium"
              >
                Jetzt starten
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 