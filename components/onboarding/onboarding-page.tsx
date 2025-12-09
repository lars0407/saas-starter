"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StepContent } from "./step-content"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft } from "lucide-react"

export function OnboardingPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  // Store original name from step 1 to ensure it's always used for user table
  const [originalFirstName, setOriginalFirstName] = useState("")
  const [originalLastName, setOriginalLastName] = useState("")
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
  const [jobLocation, setJobLocation] = useState<string>("")
  const [jobSelectedAddress, setJobSelectedAddress] = useState<any>(null)
  const [jobSelectedLocation, setJobSelectedLocation] = useState<{ lat: number; lon: number } | null>(null)
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
      surname: data.basics.lastName || "",
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
      telephone: data.basics.phone || "",
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
  const parseSalaryExpectation = (salaryString: string | undefined): { type: string, amount_eur: number } => {
    if (!salaryString || salaryString === 'flexible: negotiable' || salaryString === '') {
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
  const saveOnboardingToAPI = async (locationData?: {
    location?: string;
    selectedAddress?: any;
    selectedLocation?: { lat: number; lon: number } | null;
  }) => {
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
      
      // Use provided location data or fall back to state
      const finalLocation = locationData?.location || jobLocation || ''
      const finalSelectedAddress = locationData?.selectedAddress || jobSelectedAddress
      const finalSelectedLocation = locationData?.selectedLocation || jobSelectedLocation
      
      // Transform profile data to the required JSON format
      const transformedProfileData = transformProfileDataToJSONFormat(profileData)
      
      // Transform onboarding data to match new API structure
      const remoteWorkArray = transformWorkLocationToRemoteWork(workLocation)
      const employementTypeArray = transformJobTypeToEmployementType(jobType)
      const jobTitleArray = jobTitle ? [jobTitle] : []
      // Use default salary if not set (since salary step was removed)
      const salaryData = salaryExpectation ? parseSalaryExpectation(salaryExpectation) : { type: "Monthly salary (gross)", amount_eur: 3500 }
      
      // Always use the original name from step 1 for the user table
      // This ensures the name is always saved even if removed in step 3
      const step1FirstName = (originalFirstName || firstName || transformedProfileData?.basics?.first_name || '').trim()
      const step1LastName = (originalLastName || lastName || transformedProfileData?.basics?.surname || '').trim()
      // Combine first and last name with a space, ensuring both parts are included
      const userName = step1FirstName && step1LastName 
        ? `${step1FirstName} ${step1LastName}` 
        : step1FirstName || step1LastName || ''
      
      // Prepare the request payload according to new API specification
      const payload = {
        name: userName, // Add name from first step to update user table
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
          profile_id: 0
        },
        linkedin_url: profileData?.basics?.linkedin || "",
        job_title: jobTitleArray,
        remote_work: remoteWorkArray,
        employement_type: employementTypeArray,
        location: {
          adresse: finalSelectedAddress?.display_name || finalLocation || '',
          location: finalSelectedLocation ? {
            key: "data.location",
            geo_radius: {
              center: {
                lon: finalSelectedLocation.lon,
                lat: finalSelectedLocation.lat
              },
              radius: 25000 // 25km in meters
            }
          } : {}
        }
      }

      console.log('Sending onboarding data to API:', payload)
      console.log('Location data being sent:', {
        location: finalLocation,
        selectedAddress: finalSelectedAddress,
        selectedLocation: finalSelectedLocation,
        adresse: finalSelectedAddress?.display_name || finalLocation || '',
        locationStructure: payload.location
      })
      console.log('Profile data structure:', profileData)
      console.log('Search data structure:', parsedSearchData)
      console.log('Full payload JSON:', JSON.stringify(payload, null, 2))
      
      // Try with the full payload first
      let response = await fetch('https://api.jobjaeger.de/api:cP4KlfKj/v4/onboarding/complete', {
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
          name: userName, // Include name even in minimal payload
          profile_data: {},
          search_profile: {},
          linkedin_url: "",
          job_title: [],
          remote_work: [],
          employement_type: []
        }
        
        console.log('Trying minimal payload:', minimalPayload)
        
        response = await fetch('https://api.jobjaeger.de/api:cP4KlfKj/v4/onboarding/complete', {
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
      
      // Update user name separately if it's not empty
      if (userName && userName.trim()) {
        try {
          const updateUserResponse = await fetch('https://api.jobjaeger.de/api:fgXLZBBL/user/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: userName })
          })
          
          if (updateUserResponse.ok) {
            console.log('User name updated successfully:', userName)
          } else {
            console.warn('Failed to update user name, but onboarding was successful')
          }
        } catch (updateError) {
          console.warn('Error updating user name, but onboarding was successful:', updateError)
          // Don't throw - onboarding was successful, name update is secondary
        }
      }
      
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
        originalFirstName: originalFirstName || firstName, // Preserve original name
        originalLastName: originalLastName || lastName, // Preserve original name
        resumeData,
        profileData,
        jobSearchIntensity,
        jobTitle,
        workLocation,
        jobType,
        salaryExpectation,
        jobLocation,
        jobSelectedAddress,
        jobSelectedLocation,
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
        salary_expectation: salaryExpectation ? parseSalaryExpectation(salaryExpectation) : { type: "Monthly salary (gross)", amount_eur: 3500 }
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
        if (step >= 1 && step <= 8) {
          setCurrentStep(step)
        } else if (step > 8) {
          // If step is 9 or higher (old step numbers), complete onboarding and redirect
          clearOnboardingData()
          // Set flag to show welcome dialog on jobs page
          if (typeof window !== 'undefined') {
            localStorage.setItem('onboarding_show_welcome_dialog', 'true')
          }
          router.push('/dashboard/job-recommend')
          return
        }
      }
      
      if (savedData) {
        try {
          const data = JSON.parse(savedData)
          // Load original names FIRST - these should never be overwritten
          if (data.originalFirstName) {
            setOriginalFirstName(data.originalFirstName)
          }
          if (data.originalLastName) {
            setOriginalLastName(data.originalLastName)
          }
          // Only set original names from firstName/lastName if they don't exist yet (first time loading)
          if (data.firstName) {
            setFirstName(data.firstName)
            // Only set original if it doesn't exist yet (preserve from step 1)
            if (!originalFirstName && !data.originalFirstName) {
              setOriginalFirstName(data.firstName)
            }
          }
          if (data.lastName) {
            setLastName(data.lastName)
            // Only set original if it doesn't exist yet (preserve from step 1)
            if (!originalLastName && !data.originalLastName) {
              setOriginalLastName(data.lastName)
            }
          }
          if (data.resumeData) setResumeData(data.resumeData)
          if (data.profileData) setProfileData(data.profileData)
          if (data.jobSearchIntensity) setJobSearchIntensity(data.jobSearchIntensity)
          if (data.jobTitle) setJobTitle(data.jobTitle)
          if (data.workLocation) setWorkLocation(data.workLocation)
          if (data.jobType) setJobType(data.jobType)
          if (data.salaryExpectation) setSalaryExpectation(data.salaryExpectation)
          if (data.jobLocation) setJobLocation(data.jobLocation)
          if (data.jobSelectedAddress) setJobSelectedAddress(data.jobSelectedAddress)
          if (data.jobSelectedLocation) setJobSelectedLocation(data.jobSelectedLocation)
          if (data.characterIndex !== undefined) setCharacterIndex(data.characterIndex)
        } catch (error) {
          console.error('Error parsing saved onboarding data:', error)
        }
      }
    }
  }

  // Load saved data on mount
  useEffect(() => {
    console.log('Onboarding page loaded, loading saved data...')
    loadSavedStep()
  }, [])

  // Redirect if somehow on step 9 or higher
  useEffect(() => {
    if (currentStep > 8) {
      clearOnboardingData()
      // Set flag to show welcome dialog on jobs page
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboarding_show_welcome_dialog', 'true')
      }
      router.push('/dashboard/job-recommend')
    }
  }, [currentStep, router])

  // Ensure correct character for each step
  useEffect(() => {
    if (currentStep === 1) {
      setCharacterIndex(0)
    } else if (currentStep === 2) {
      setCharacterIndex(1)
    } else if (currentStep === 3) {
      setCharacterIndex(2)
    } else if (currentStep === 4) {
      setCharacterIndex(3)
    } else if (currentStep === 5) {
      setCharacterIndex(4)
    } else if (currentStep === 6) {
      setCharacterIndex(5) // Job location
    } else if (currentStep === 7) {
      setCharacterIndex(5) // Work location
    } else if (currentStep === 8) {
      setCharacterIndex(6) // Job type
    }
  }, [currentStep])

  // Save step whenever currentStep changes
  useEffect(() => {
    if (currentStep > 1) {
      saveCurrentStep(currentStep)
    }
  }, [currentStep, firstName, lastName, resumeData, profileData, jobSearchIntensity, jobTitle, workLocation, jobType, salaryExpectation, jobLocation, jobSelectedAddress, jobSelectedLocation, characterIndex])

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  // Clear localStorage when onboarding is completed
  const clearOnboardingData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ONBOARDING_STEP_KEY)
      localStorage.removeItem(ONBOARDING_DATA_KEY)
      localStorage.removeItem('onboarding_search')
      console.log('Onboarding data cleared from localStorage')
    }
  }

  const handleContinue = async () => {
    if (currentStep === 1) {
      // Validate that all required fields are filled
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
        return // Don't proceed if any required field is empty
      }
      // Move to step 2 (resume upload)
      setCurrentStep(2)
      setCharacterIndex(1)
    } else if (currentStep === 2) {
      // Move to step 3 (profile creation)
      setCurrentStep(3)
      setCharacterIndex(2)
    } else if (currentStep === 3) {
      // Move to step 4 (job search intensity)
      setCurrentStep(4)
      setCharacterIndex(3)
    } else if (currentStep === 4) {
      // Move to step 5 (job title)
      setCurrentStep(5)
      setCharacterIndex(4)
    } else if (currentStep === 5) {
      // Move to step 6 (work location)
      setCurrentStep(6)
      setCharacterIndex(5)
    } else if (currentStep === 6) {
      // Move to step 7 (job type)
      setCurrentStep(7)
      setCharacterIndex(0)
    } else if (currentStep === 7) {
      // Move to step 8 (salary expectation)
      setCurrentStep(8)
      setCharacterIndex(1)
    }
  }

  // Handle back navigation
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle final completion
  const handleStartNow = () => {
    clearOnboardingData()
    // Set flag to show welcome dialog on jobs page
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_show_welcome_dialog', 'true')
    }
    router.push('/dashboard/job-recommend')
  }

  const handleResumeProcessing = async (data: any) => {
    console.log('OnboardingPage: handleResumeProcessing called with:', data)
    
    if ((data.method === 'file' || data.method === 'linkedin') && data.parsedData) {
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
      localStorage.setItem('onboarding_parsed_resume', JSON.stringify(data.parsedData))
      console.log('OnboardingPage: Stored raw parsed resume data in localStorage:', data.parsedData)
      
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
    setCurrentStep(5)
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
    setCurrentStep(4)
  }

  const handleJobTitleComplete = (title: string) => {
    console.log('OnboardingPage: handleJobTitleComplete called with:', title)
    setJobTitle(title)
    setCurrentStep(6) // Now goes to job location
  }

  const handleJobLocationComplete = (data: {
    location: string;
    selectedAddress: any;
    selectedLocation: { lat: number; lon: number } | null;
  }) => {
    console.log('OnboardingPage: handleJobLocationComplete called with:', data)
    setJobLocation(data.location)
    setJobSelectedAddress(data.selectedAddress)
    setJobSelectedLocation(data.selectedLocation)
    setCurrentStep(7) // Continue to work location
  }

  const handleWorkLocationComplete = (location: string) => {
    console.log('OnboardingPage: handleWorkLocationComplete called with:', location)
    setWorkLocation(location)
    setCurrentStep(8) // Continue to job type
  }

  const handleJobTypeComplete = async (type: string) => {
    console.log('OnboardingPage: handleJobTypeComplete called with:', type)
    setJobType(type)
    // Save data to API and complete onboarding
    await handleJobLocationCompleteAndSave({
      location: jobLocation,
      selectedAddress: jobSelectedAddress,
      selectedLocation: jobSelectedLocation
    })
  }

  const handleJobLocationCompleteAndSave = async (data: {
    location: string;
    selectedAddress: any;
    selectedLocation: { lat: number; lon: number } | null;
  }) => {
    console.log('OnboardingPage: handleJobLocationCompleteAndSave called with:', data)
    setJobLocation(data.location)
    setJobSelectedAddress(data.selectedAddress)
    setJobSelectedLocation(data.selectedLocation)
    
    // Save data to API before completing onboarding
    try {
      setIsLoading(true)
      setApiError("")
      await saveOnboardingToAPI({
        location: data.location,
        selectedAddress: data.selectedAddress,
        selectedLocation: data.selectedLocation
      })
      console.log('Onboarding data saved to API successfully')
      // Complete onboarding and redirect
      handleStartNow()
    } catch (error) {
      console.error('Failed to save onboarding data to API:', error)
      
      // More specific error handling
      let errorMessage = 'Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.'
      if (error instanceof Error) {
        if (error.message.includes('Authentication failed') || error.message.includes('No authentication token')) {
          errorMessage = 'Nicht angemeldet. Bitte melden Sie sich erneut an.'
        } else if (error.message.includes('401')) {
          errorMessage = 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.'
        } else if (error.message.includes('API request failed')) {
          errorMessage = 'Fehler beim Speichern. Bitte versuchen Sie es später erneut.'
        }
      }
      
      setApiError(errorMessage)
      toast.error(errorMessage, {
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFirstNameChange = (value: string) => {
    setFirstName(value)
    // Save original value ONLY in step 1 - never overwrite after that
    if (value && currentStep === 1 && !originalFirstName) {
      setOriginalFirstName(value)
    }
  }

  const handleLastNameChange = (value: string) => {
    setLastName(value)
    // Save original value ONLY in step 1 - never overwrite after that
    if (value && currentStep === 1 && !originalLastName) {
      setOriginalLastName(value)
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
  }

  const handleAddressChange = (value: string) => {
    setAddress(value)
  }

  const handleCityChange = (value: string) => {
    setCity(value)
  }

  const handleStateChange = (value: string) => {
    setState(value)
  }

  const handleZipCodeChange = (value: string) => {
    setZipCode(value)
  }

  // Calculate progress percentage
  const progressPercentage = (currentStep / 8) * 100

  return (
    <div className="min-h-screen bg-white md:bg-gradient-to-br md:from-gray-50 md:to-gray-100 flex flex-col">
      {/* Header with Progress */}
      <div className="w-full bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {currentStep > 1 && currentStep < 8 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Zurück
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Schritt {currentStep} von 8
            </div>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 [&>div]:bg-[#0F973D]" 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 md:py-8">
        <div className={`w-full ${currentStep === 3 ? 'max-w-4xl' : 'max-w-lg'} mx-auto`}>
          {/* Step Content */}
          <div className="md:bg-white md:rounded-2xl md:shadow-xl md:border md:border-gray-200 p-4 md:p-8 relative">
            <div className="overflow-y-auto max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-400px)] px-1" data-step-content>
              <StepContent
                step={currentStep}
                firstName={firstName}
                lastName={lastName}
                phone={phone}
                address={address}
                city={city}
                state={state}
                zipCode={zipCode}
                onFirstNameChange={handleFirstNameChange}
                onLastNameChange={handleLastNameChange}
                onPhoneChange={handlePhoneChange}
                onAddressChange={handleAddressChange}
                onCityChange={handleCityChange}
                onStateChange={handleStateChange}
                onZipCodeChange={handleZipCodeChange}
                onResumeDataChange={handleResumeProcessing}
                onJobSearchIntensityComplete={handleJobSearchIntensityComplete}
                onProfileComplete={handleProfileModalComplete}
                onProfileSkip={() => {
                  setProfileData({ method: 'skipped' })
                  setCurrentStep(4)
                }}
                onBack={() => setCurrentStep(2)}
                onJobTitleComplete={handleJobTitleComplete}
                onJobLocationComplete={handleJobLocationComplete}
                onWorkLocationComplete={handleWorkLocationComplete}
                onJobTypeComplete={handleJobTypeComplete}
                resumeData={resumeData}
                isLoading={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-6 mt-6 md:border-t border-gray-100">
              {!isLoading && currentStep !== 3 && currentStep !== 4 && currentStep !== 5 && currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && (
                <Button
                  onClick={handleContinue}
                  disabled={currentStep === 1 && (!firstName.trim() || !lastName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !zipCode.trim())}
                  className={`px-8 py-3 rounded-lg font-medium ${
                    currentStep === 1 && (!firstName.trim() || !lastName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !zipCode.trim())
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0F973D] hover:bg-[#0D7A32] text-white'
                  }`}
                >
                  {currentStep === 1 ? (firstName && lastName ? `weiter als ${firstName} ${lastName}` : "Weiter") : 
                   currentStep === 2 ? "Weiter" : "Onboarding abschließen"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


