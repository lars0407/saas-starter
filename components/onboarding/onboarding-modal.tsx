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
      
      // Prepare the request payload with fallback structures
      const payload = {
        profile_data: profileData || {
          personalInfo: {},
          education: [],
          experience: [],
          skills: []
        },
        search_profile: parsedSearchData || {
          job_search_activity: "",
          dream_job_title: "",
          work_location_preference: "",
          work_time_preference: "",
          salary_expectation: {
            type: "Monthly salary (gross)",
            amount_eur: 0
          }
        },
        linkedin_url: profileData?.personalInfo?.linkedin || ""
      }

      // Validate payload structure
      if (!payload.profile_data || typeof payload.profile_data !== 'object') {
        console.warn('Profile data is not an object:', payload.profile_data)
      }
      if (!payload.search_profile || typeof payload.search_profile !== 'object') {
        console.warn('Search profile is not an object:', payload.search_profile)
      }

      console.log('Sending onboarding data to API:', payload)
      console.log('Profile data structure:', profileData)
      console.log('Search data structure:', parsedSearchData)
      
      // Test with minimal payload to see if structure is the issue
      const testPayload = {
        profile_data: {},
        search_profile: {},
        linkedin_url: ""
      }
      console.log('Test payload:', testPayload)

      const response = await fetch('https://api.jobjaeger.de/api:cP4KlfKj/v3/onboarding7complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

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
        } catch (e) {
          errorDetails = 'Could not read error response'
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
        job_search_activity: jobSearchIntensity || "I am actively looking for a job",
        dream_job_title: jobTitle || "Frontend Developer",
        work_location_preference: workLocation || "Remote / Home Office",
        work_time_preference: jobType || "Full-time (40h/week)",
        salary_expectation: {
          type: "Monthly salary (gross)",
          amount_eur: salaryExpectation ? parseInt(salaryExpectation) || 3500 : 3500
        }
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
      debugLocalStorage() // Debug current status
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

  // Debug function to check current localStorage status
  const debugLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const step = localStorage.getItem(ONBOARDING_STEP_KEY)
      const data = localStorage.getItem(ONBOARDING_DATA_KEY)
      const searchData = localStorage.getItem('onboarding_search')
      console.log('Current localStorage status:', { 
        step, 
        data: data ? JSON.parse(data) : null,
        searchData: searchData ? JSON.parse(searchData) : null
      })
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
    setIsLoading(true)
    setResumeData(data)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsLoading(false)
    setCurrentStep(5) // Move to completion step
  }

  const handleJobSearchIntensityComplete = (intensity: string) => {
    setJobSearchIntensity(intensity)
    setCurrentStep(5) // Move to job title step
  }

  const handleProfileModalComplete = (data: any) => {
    setProfileData(data)
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
      <DialogContent className={`mx-auto p-0 overflow-visible rounded-2xl shadow-2xl border-3 border-[#0F973D] ${currentStep === 3 ? 'max-w-4xl max-h-[90vh]' : currentStep === 4 || currentStep === 5 || currentStep === 6 || currentStep === 7 || currentStep === 8 || currentStep === 9 ? 'max-w-4xl' : 'max-w-md'}`} showCloseButton={false}>
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
        
        <div className="relative p-2 rounded-b-2xl">
          {/* Form Content */}
          <div className="mt-2 mb-6 px-4">
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